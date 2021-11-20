const tokenId = parseInt(window.location.href.split("/").pop()) || 0;
let winners = [];

if (typeof window.ethereum !== 'undefined') {
    ethereum.on('accountsChanged', function (accounts) {
        account = accounts[0];
        $('.btn-connect').each(function(){
            $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
        })
    });
}

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

async function getAccount(){
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    $('.btn-connect').each(function(){
         $(this).html(account.substring(0, 2) + account.substring(2, 6).toUpperCase() + '...' + account.substring(account.length-4).toUpperCase());
    })
}

const pullMike =  async(id) => {
    let result = await contract.methods.tokenURI(id).call()
    let metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")))
    metadata['id'] = id;
    return metadata;
}

const getStats = async(meta) => {
    let entered = await danceoff.methods.getRumblesEntered(meta.id).call();
    let placed = await danceoff.methods.getPlacementsByToken(meta.id).call();
    meta['entered'] = entered;
    meta['placed'] = placed;
    meta['placepercent'] = parseFloat(placed.length / entered.length * 100).toFixed(2).toString() + '%';
    
    let firsts = 0;
    let seconds = 0;
    let thirds = 0;

    let totalPurse = 0;
    for(let i=0; i<placed.length; i++){
        totalPurse += parseFloat(web3.utils.fromWei(placed[i].payout, 'ether'))
        switch(placed[i].placement){
            case '1':
                firsts++;
            break;
            case '2':
                seconds++;
            break;
            case '3':
                thirds++;
            break;
        }
    }
    if(entered.length !== 0){
        meta['purse'] = totalPurse.toFixed(2);
        meta['firstpercent'] = parseFloat(firsts / entered.length * 100).toFixed(2).toString() + '%';
        meta['secondpercent'] = parseFloat(seconds / entered.length * 100).toFixed(2).toString() + '%';
        meta['thirdpercent'] = parseFloat(thirds / entered.length * 100).toFixed(2).toString() + '%';
    }
    else{
        meta['purse'] = totalPurse.toFixed(2);
        meta['firstpercent'] = 'Never Entered';
        meta['secondpercent'] = 'Never Entered';
        meta['thirdpercent'] = 'Never Entered';
        meta['placepercent'] = 'Never Entered';
    }
    

    return meta;
}

const pullInfo = async(id) => {
            let mike = pullMike(parseInt(id));
            mike.then(function(metadata){
                let html = '';
                html += '<img src="' + metadata.image + '" class="img img-fluid" /><br>'
                
                html += `<h3 class="text-center purple">${metadata.name}</h1>`
                $('#mikeInfo .mike').html(html);

                var stats = getStats(metadata);

                stats.then(function(result){
                let stathtml = '<ul class="list-group">';
                stathtml += `<li class="list-group-item">Entered <span class="purple">${result.entered.length}</span> Dance Royales</li>`;
                stathtml += `<li class="list-group-item">Lifetime Purse: <span class="purple">${result.purse.toString()}</span> <i class="far fa-syringe"></i>HGH</li>`;
                stathtml += `<li class="list-group-item">Placement %: <span class="purple">${result.placepercent}</span></li>`;
                stathtml += `<li class="list-group-item">First Place: <span class="purple">${result.firstpercent}</span></li>`;
                stathtml += `<li class="list-group-item">Second Place: <span class="purple">${result.secondpercent}</span></li>`;
                stathtml += `<li class="list-group-item">Third Place: <span class="purple">${result.thirdpercent}</span></li>`;
                stathtml += '</ul>';
                $('#mikeInfo .info').html(stathtml);

                for(let i=0; i<result.entered.length; i++){
                    let resultshtml = '<div class="col-6 col-sm-3 my-3">'
                    resultshtml += `<h1 class="text-center">Rumble #${result.entered[i]}</h1>`;
                    resultshtml += '<div class="d-grid gap-2">';
                    resultshtml += "<a type='button' href='" + homeurl + "/watch/" + result.entered[i].toString() + "' title='Watch Dance' class='btn btn-dark btn-watch' data-rumbleid='" + result.entered[i].toString() + "'><i class='fak fa-dance'></i> Watch Dance</a>"
                    resultshtml += "<a type='button' href='" + homeurl + "/results/" + result.entered[i].toString() + "' title='View Results' class='btn btn-dark btn-view' data-rumbleid='" + result.entered[i].toString() + "'><i class='far fa-trophy'></i> View Results</a>"
                    resultshtml += '</div>'
                    resultshtml += '</div>';
                    $('#historyRow').prepend(resultshtml);
                }
                });
            });
}

$(function(){

    pullInfo(tokenId);
})