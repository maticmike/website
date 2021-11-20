Bs5Utils.defaults.toasts.position = 'bottom-right';
const bs5Utils = new Bs5Utils();

let imgArray = []
let mikesPulled = []
let currentDance = 0;
// write async functions for pulling mikes

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// We need to wait until any miner has included the transaction
// in a block to get the address of the contract
const waitBlock = async(txhash, blocksToWait = 1, args) => {
  while (true) {
      try{
        let receipt = await web3.eth.getTransactionReceipt(txhash);
        var block = await web3.eth.getBlock(receipt.blockNumber);
        var current = await web3.eth.getBlock("latest");
        if (current.number - block.number >= blocksToWait) {
            console.log("confirmed");
            break;
        }
      }
      catch(err){
          console.log("Awaiting transaction...");
      }
    
    console.log("Waiting a mined block to include your txHash... currently in block " + web3.eth.blockNumber);
    await sleep(5000);
  }

  return args;
}

const enterRoyaleConnect = async(id, juice) => {
    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainID}],
        });
    } 
    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                    {
                        chainId: chainID,
                        chainName: chainName,
                        rpcUrls: [chainRPC],
                        nativeCurrency: {
                        name: "MATIC",
                        symbol: currencySymbol,
                        decimals: 18,
                        },
                        blockExplorerUrls: [blockExplorer],
                    },
                    ],
                });
            } catch (error) {
                alert(error.message);
                return;
            }
        }
    }
    finally{
        let allowance = await hghcontract.methods.allowance(ethereum.selectedAddress, danceoffaddress).call();

        if(allowance > 0){
            enterRoyale(id, juice);
        }
        else{
            $('#alertModal .modal-title').html("Contract needs HGH Allowance");
            // change this to allow coinbase and trust wallet links
            $('#alertModal .modal-body').html('You must approve the dance off contract to use your $HGH balance. Sign the prompt and then try again once transaction is complete.');
            alertModal.show();
            allowHghSpend(id, juice);
        }
    }
}

const allowHghSpend = async(id, juice) => {
    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.approve(danceoffaddress, web3.utils.toWei('1000000', "ether")).encodeABI(),
        chainId: chainID
    }

    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        let args = [];
        args['id'] = id;
        args['juice'] = juice;
        let block = waitBlock(txHash, 1, args);
        block.then(function(args){
            bs5Utils.Snack.show('dark', 'Approved $HGH usage, now you can send in your Mike!', 3000, true);
            enterRoyale(args.id, args.juice)
        })
    })
}

const enterRoyale = async(id, hgh) => {
    const tx = {
        from: ethereum.selectedAddress,
        to: danceoffaddress,
        data: danceoff.methods.enterRoyale(id, hgh).encodeABI(),
        chainId: chainID
    }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        let args = [];
        args['id'] = id;
        args['juice'] = hgh;
        let block = waitBlock(txHash, 1, args);
        block.then(function(args){
            bs5Utils.Snack.show('dark', 'Matic Mike #' + args.id.toString() + ' has been entered into tournament', 3000, true);
            enableLiveWatch(currentDance);
            rumbleInfo();
        })
        
    })
}

const populateSelect = async(id) => {
    try{
        let jsonObj = {}
        let result = await contract.methods.tokenURI(id).call()

        let metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")))
        imgArray[id] = metadata.image
        let pl = metadata.attributes.find(o => o.trait_type === "Power Level")
        let name = metadata.name + ' - PL: ' + pl.value.toString()

        jsonObj['id'] = id
        jsonObj['text'] = name

        jsonObj['name'] = metadata.name
        jsonObj['image'] = metadata.image
        jsonObj['powerlevel'] = pl.value

        return jsonObj
    }
    catch(err){
        return populateSelect(id);
    }
}

const checkSize = async(length1, length2) => {
    if(length1 <= length2){
        return true;
    }
    else{
        await sleep(100);
        return checkSize(length1, mikesPulled.length - 1);
    }
}

const getMikes = async(addr) => {
    imgArray = [];
    let mmWallet = await contract.methods.walletOfOwner(addr).call();
    let hghWallet = await hghcontract.methods.getTokensStaked(addr).call();

    let startobj = {'id': -1, 'text': 'Select your Mike...', 'selected': true}
    mikesPulled.push(startobj);
    for(let i=0; i<mmWallet.length; i++){
        let popmike = populateSelect(parseInt(mmWallet[i]));

        popmike.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    for(let i=0; i<hghWallet.length; i++){
        let hghmike = populateSelect(parseInt(hghWallet[i]));

        hghmike.then(function(jsonObj){
            mikesPulled.push(jsonObj);
        })
    }

    let popselect = checkSize(hghWallet.length + mmWallet.length, mikesPulled.length - 1);
    popselect.then(function(res){
        if(res){
            $('#mikeSelect').select2({
                data: mikesPulled,
                theme: "bootstrap-5",
                templateResult: formatSelect
            })
        }
    })
}

const getAccount = async() => {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    $('.btn-connect').each(function(){
         $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
    })
   
    //enableMintBtns();
    loadHGHBalance();
    $('#btnConnect').removeClass('btn-danger');
    $('#btnConnect').addClass('btn-success');
    mikesPulled = []
    getMikes(account);
}

const currentEntries = async() => {
    let result = await danceoff.methods.getCurrentEntries().call();
    let startTime = await danceoff.methods.getTimeTrigger().call();

    let maxUsers = 50;
    if(Math.floor(Date.now() / 1000) - startTime > 1800){
        if(result > 15){
            maxUsers = result + 1;
        }
        else{
            maxUsers = 15;
        }
    }

    let percent = (result / maxUsers) * 100;
    let precentstring = percent.toString() + '%';

    $('#max-users').html(maxUsers.toString())
    $("#total-entries").html(result);
    $('.total-entries-bar').attr('aria-valuenow', result);
    $('.total-entries-bar').css('width', precentstring);
}

const rumbleInfo = async() => {
    setTimeout(() => {
        if (typeof window.ethereum !== 'undefined') {
            if(typeof ethereum.selectedAddress !== 'undefined'){
                loadHGHBalance();
            }
        }
    }, 1000);
    
    currentEntries();

    danceoff.methods.getCurrentRumble().call((err, result) => {
        $("#rumbleId").html(result);
        if(currentDance != result && currentDance != 0){
            populateResultBtns(currentDance);
            currentDance = result;
        }
        else if(currentDance == 0 && result != 0){
            currentDance = result;
            if(result - 100 > 0){
                for(let i=result-30; i<result; i++){
                    populateResultBtns(i);
                }
            }
            else{
                for(let i=0; i<result; i++){
                    populateResultBtns(i);
                }
            }
        }
    })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function disableLiveWatch(){
    $('#btnWatchLive').fadeOut(200);
}
function enableLiveWatch(rumbleId){
    $('#btnWatchLive').fadeIn(200);
    $('#btnWatchLive').attr("href", homeurl + "/watch/" + rumbleId.toString());
}
function populateResultBtns(rumbleId){
    let html = '<div class="col-6 col-sm-3 my-3"><h1 class="text-center">Rumble #' + rumbleId.toString() + '</h1>'
    html += '<div class="d-grid gap-2">'
    html += "<a type='button' href='" + homeurl + "/watch/" + rumbleId.toString() + "' title='Watch Dance' class='btn btn-dark btn-watch' data-rumbleid='" + rumbleId.toString() + "'><i class='fak fa-dance'></i> Watch Dance</a>"
    html += "<a type='button' href='" + homeurl + "/results/" + rumbleId.toString() + "' title='View Results' class='btn btn-dark btn-view' data-rumbleid='" + rumbleId.toString() + "'><i class='far fa-trophy'></i> View Results</a>"
    html += '</div></div>'
    $('#danceResults').prepend(html)
}

function formatSelect (state) {
    if (!state.id) {
        return state.text;
    }
    else if(state.id == -1){
        var $state = $(
            '<span><img src="' + homeurl + '/dist/img/1.png" class="img-flag" /> ' + state.text + '</span>'
        );
        return $state;
    }
    var $state = $(
        '<span><img src="' + imgArray[state.id] + '" class="img-flag" /> ' + state.text + '</span>'
    );
    return $state;
};

$(document).on('click', '#btnEnterRumble', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = parseInt($('#mikeSelect').find(':selected').val());
    let hgh = parseInt($('#hghJuice').find(':selected').val());

    enterRoyaleConnect(id, hgh);
})
// on select
$(document).on('select2:select', '#mikeSelect', function(e){
    let data = e.params.data;
    if(data.id != -1){
        $('#selected-mike img').attr('src', data.image);
        let html = data.name + '<br><small class="purple">Power Level <span data-powerlevel="' + data.powerlevel + '" id="selected-powerlevel">' + data.powerlevel + '</span></small>'
        $('#selected-name').html(html);
        $('#btnEnterRumble').prop('disabled', false);
    }
    else{
        $('#selected-mike img').attr('src', 'https://maticmike.club/dist/img/1.png');
         $('#selected-name').html("Select your Mike...");
        $('#btnEnterRumble').prop('disabled', true);
    }
});

$(document).on('click', '.btn-connect', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    switchNetworkPoly();

    if (typeof window.ethereum !== 'undefined') {
        getAccount()
    }
    else if(isMobile){
            window.open('https://metamask.app.link/dapp/maticmike.club/#mint', '_blank');
    }
    else{
        $('#alertModal .modal-title').html("Wallet Connection Error");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('MetaMask is not installed. Install MetaMask on a supported browser for minting.<br><br>You can <a href="https://metamask.io/download.html" rel="noreferrer" target="_blank" title="Install MetaMask here for supported browsers">install MetaMask here.</a>');
        alertModal.show();
    }
})

if (typeof window.ethereum !== 'undefined') {
    ethereum.on('accountsChanged', function (accounts) {
        account = accounts[0];
        $('.btn-connect').each(function(){
            $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
        })
        
        try{
            $("#mikeSelect").select2("destroy")
            $("#mikeSelect").html('');
        }
        catch(err){
            console.log(err);
        }
        mikesPulled = []
        getMikes(ethereum.selectedAddress);
    });
}


$(function(){
    setInterval(rumbleInfo, 30*1000);
    rumbleInfo();
    setTimeout(() => {
        try{
            if(typeof ethereum.selectedAddress !== 'undefined'){
                account = ethereum.selectedAddress;
                $('.btn-connect').each(function(){
                    $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
                })
                $('#btnConnect').removeClass('btn-danger');
                $('#btnConnect').addClass('btn-success');

                //enableMintBtns();
                getMikes(ethereum.selectedAddress);
            }
        }
        catch(err){
            console.log('Wallet not yet connected');
        }
    }, 500);
})