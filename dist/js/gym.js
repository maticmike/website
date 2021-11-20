Bs5Utils.defaults.toasts.position = 'bottom-right';
const bs5Utils = new Bs5Utils();

let tokenids = [];
let stakedids = [];

let lastSupply = 0;

let whitelist = false;
let burnActive = false;
let active = false;
let upgradeCost = 0;
let mintCost = 0; 

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

const stakeMike = async (ids, all=false) => {
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
        stakeMikeTransaction(ids, all);
    }
}

const withdrawMike = async (ids, all=false) => {
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
        withdrawMikeTransaction(ids, all);
    }
}

const withdrawHGH = async () => {
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
        withdrawHGHTransaction();
    }
}


if (typeof window.ethereum !== 'undefined') {
    ethereum.on('accountsChanged', function (accounts) {
        account = accounts[0];
        $('.btn-connect').each(function(){
            $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
        })
        $('#mikeCrewContainer').html('');
        $('#mikeStakedContainer').html('');
        tokenids = [];
        stakedids = [];
        loadMikes()
        loadStakedMikes()
        loadHGHBalance()
    });
}

$(document).on('click', '.btn-polygon-setup', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    switchNetworkPoly();
})

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


$(document).on('click', '#btnWithdrawMikes', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(stakedids.length > 0){
        withdrawMike(stakedids, true)
    }
    else{
        $('#alertModal .modal-title').html("No Mikes At the Gym");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('No Mikes are in the gym right now.');
        alertModal.show();
    }
})
$(document).on('click', '.btn-stake', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(stakedids.length >= 10){
        $('#alertModal .modal-title').html("Already have 10 Mikes Staked");
        // change this to allow coinbase and trust wallet links
        $('#alertModal .modal-body').html('You can only stake a maximum of 10 Mikes.');
    }
    else{
        let id = $(this).attr('data-tokenid');
        stakeMike([parseInt(id)]);
    }
})

$(document).on('click', '#btnDepositAll', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    if(tokenids.length > 0 && stakedids.length + tokenids.length <= 10){
        stakeMike(tokenids, true);
    }
    else if(stakedids.length < 10){
        let curids = [];

        for(var i=0; i<(10-stakedids.length); i++){
            curids.push(tokenids[i]);
        }

        stakeMike(curids);
    }
    else if(stakedids.length == 10 && tokenids.length > 0){
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>Your Gym is Full</h3>")
        $('#alertModal .modal-body').html("<p>There's a limit of 10 Mike's in the gym per wallet at a time. Too much beef in there.</p>")
        alertModal.show();
    }
    else{
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>You have no Mike's to stake</h3>")
        $('#alertModal .modal-body').html("<p>You must have a Mike outside of the gym available to stake.</p>")
        alertModal.show();
    }
})

$(document).on('click', '#btnWithdrawAllHGH', function(e){
    if(stakedids.length > 0){
        withdrawHGH()
    }
    else{
        // alert box goes here
        $('#alertModal .modal-title').html("<h3>No Mike's in the gym</h3>")
        $('#alertModal .modal-body').html("<p>You must have a Mike inside of the gym to claim $HGH.</p>")
        alertModal.show()
    }
})

$(document).on('click', '.btn-withdraw', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    let id = $(this).attr('data-tokenid');
    withdrawMike([parseInt(id)]);
})

async function stakeMikeTransaction(ids, all){
    let curids = ids;

    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.stakeByIds(ids).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        if(all){
            tokenids = [];
            $('#mikeCrewContainer').html('');
        }
        else{
            for(var i=0; i<curids.length; i++){
                let index = tokenids.indexOf(curids[i].toString());
                if (index > -1) {
                    tokenids.splice(index, 1);
                }
                $('#mikeCrewContainer').find("[container-tokenid='" + curids[i].toString() + "']").remove();
            }
        }
        
        let block = waitBlock(txHash, 3, 1);

        block.then(function(args){
            bs5Utils.Snack.show('dark', 'Your Mike(s) have been sent to the gym.', 4000, true);
            loadMikes()
            loadStakedMikes()
        })
    })
}

async function withdrawMikeTransaction(ids, all){
    let curids = ids;

    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.unstakeByIds(ids).encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);
        if(all){
            stakedids = [];
            $('#mikeStakedContainer').html('');
        }
        else{
            for(var i=0; i<curids.length; i++){
                let index = stakedids.indexOf(curids[i].toString());
                if (index > -1) {
                    stakedids.splice(index, 1);
                }
                $('#mikeStakedContainer').find("[container-tokenid='" + curids[i].toString() + "']").remove();
            }
        }
        
        let block = waitBlock(txHash, 3, 1);

        block.then(function(args){
            bs5Utils.Snack.show('dark', 'Your Mike(s) have been withdrawn from the gym.', 4000, true);
            loadHGHBalance();
            loadMikes()
            loadStakedMikes()
            getAllRewards()
        })
    })
}

async function withdrawHGHTransaction(){
    const tx = {
        from: ethereum.selectedAddress,
        to: hghaddress,
        data: hghcontract.methods.claimAll().encodeABI(),
        chainId: chainID
      }
    
    window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [tx],
    })
    .then(function(txHash){
        console.log(txHash);

        let block = waitBlock(txHash, 3, 1);

        block.then(function(args){
            bs5Utils.Snack.show('dark', 'Your $HGH has been claimed and should appear shortly', 4000, true);
            loadHGHBalance();
            getAllRewards()
        })
    })
}

async function getAccount(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    $('.btn-connect').each(function(){
         $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
    })
   
    $('#btnConnect').removeClass('btn-danger');
    $('#btnConnect').addClass('btn-success');
    loadMikes();
    loadStakedMikes();
}

// modify this to include the data abi as a param
async function createTransaction(wei) {
      const tx = {
        from: ethereum.selectedAddress,
        to: address,
        value: web3.utils.toHex(wei),
        data: contract.methods.donationMint().encodeABI(),
        chainId: chainID
      }
      window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [tx],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }

async function loadMikes(){
    contract.methods.walletOfOwner(ethereum.selectedAddress).call((err, result) => { 
        if(result.length > 0){
            $('#btnDepositAll').prop('disabled', false);

            for(var i=0; i<result.length; i++){
                if(!tokenids.includes(result[i])){
                    tokenids.push(result[i]);
                    pullMike(result[i]);
                }
            }
        }
        else{
            $('#btnDepositAll').prop('disabled', true);
        }
    });
}

async function loadStakedMikes(){
    hghcontract.methods.getTokensStaked(ethereum.selectedAddress).call((err, result) => { 
        if(result.length > 0 ){
            $('#btnWithdrawAllHGH').prop('disabled', false);
            $('#btnWithdrawMikes').prop('disabled', false);
            for(var i=0; i<result.length; i++){
                if(!stakedids.includes(result[i])){
                    stakedids.push(result[i]);
                    pullStakedMike(result[i]);
                }
            }
        }
        else{
            $('#btnWithdrawAllHGH').prop('disabled', true);
            $('#btnWithdrawMikes').prop('disabled', true);
        }
        
    });
}

async function getAllRewards(){
    hghcontract.methods.getAllRewards(ethereum.selectedAddress).call((err, result) => { 
        $('.reward-counter').html(parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(2));
    });
}

function pullMike(id){

    contract.methods.tokenURI(id).call((err, result) => { 
        var metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")));
        let traits = JSON.stringify(metadata.attributes);
        var html = '<div class="col-6 col-sm-3 text-center py-3" container-tokenid="' + id.toString() + '">';
        html += '<img class="img img-fluid" src="' + metadata.image + '" />';
        html += '<br><h2 class="text-center">' + metadata.name + '</h2><br>';
        html += '<div class="d-grid gap-2">';
        html += '<button type="button" title="Stake Mike to earn $HGH" class="btn btn-dark btn-stake" data-tokenid="' + id.toString() + '"><i class="far fa-dumbbell"></i> Send to Gym</button>';
        html += "<button type='button' title='View Traits' class='btn btn-dark btn-traits' data-tokenid='" + id.toString() + "' data-traits='" + traits + "'><i class='far fa-info-circle'></i> View Traits</button>";
        html += '</div></div>'

        $('#mikeCrewContainer').append(html);
        
    });

}

function pullStakedMike(id){
    contract.methods.tokenURI(id).call((err, result) => { 
        var metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")));
        let traits = JSON.stringify(metadata.attributes);
        var html = '<div class="col-6 col-sm-3 text-center py-3" container-tokenid="' + id.toString() + '">';
        html += '<img class="img img-fluid" src="' + metadata.image + '" />';
        html += '<br><h2 class="text-center">' + metadata.name + '</h2><br>';
        html += '<div class="d-grid gap-2">';
        html += '<button type="button" title="Take this Mike out of gym and put him back in wallet." class="btn btn-danger btn-success btn-withdraw" data-tokenid="' + id.toString() + '"><i class="far fa-wallet"></i> Withdraw Mike</button>';
        html += "<button type='button' title='View Traits' class='btn btn-dark btn-traits' data-tokenid='" + id.toString() + "' data-traits='" + traits + "'><i class='far fa-info-circle'></i> View Traits</button>";
        html += '</div></div>'

        $('#mikeStakedContainer').append(html);
        
    });
}

$(document).ready(function(){
    
    setTimeout(() => {
        try{
            if(typeof ethereum.selectedAddress !== 'undefined'){
                loadHGHBalance()
                account = ethereum.selectedAddress
                $('.btn-connect').each(function(){
                    $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase())
                })
                $('#btnConnect').removeClass('btn-danger')
                $('#btnConnect').addClass('btn-success')

                loadMikes()
                loadStakedMikes()
                getAllRewards()
            }
        }
        catch(err){
            console.log('Wallet not yet connected');
        }
    }, 500)
})
