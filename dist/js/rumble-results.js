const rumbleId = parseInt(window.location.href.split("/").pop()) || 0;
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

const pullMike =  async(id, index) => {
    let result = await contract.methods.tokenURI(id).call()
    let metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")))
    metadata['id'] = id;
    metadata['index'] = index;
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

    for(let i=0; i<placed.length; i++){
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

    meta['firstpercent'] = parseFloat(firsts / entered.length * 100).toFixed(2).toString() + '%';
    meta['secondpercent'] = parseFloat(seconds / entered.length * 100).toFixed(2).toString() + '%';
    meta['thirdpercent'] = parseFloat(thirds / entered.length * 100).toFixed(2).toString() + '%';

    return meta;
}

const pullInfo = async(id) => {
    let rumbleActive = await danceoff.methods.isComplete(id).call();
    if(rumbleActive){
        winners = await danceoff.methods.getPlacementsByRumble(id).call()
        for(let i=0; i<winners.length; i++){
            let mike = pullMike(parseInt(winners[i].tokenId), i);
            mike.then(function(metadata){
                let html = '';
                html += '<img src="' + metadata.image + '" class="img img-fluid" /><br>'
                switch(winners[metadata.index].placement){
                    case '1':
                        html += `<h3 class="text-center purple">First Place<br><small class="purple">${metadata.name}</small></h1>`
                        html += `<b class="text-center">Payout: ${parseInt(web3.utils.fromWei(winners[metadata.index].payout, 'ether'))} <i class="far fa-syringe"></i>HGH</b>`
                        html += '<br><i>' + winners[metadata.index].holder.substring(0, 2) + winners[metadata.index].holder.substring(2, 6).toUpperCase() + '...' + winners[metadata.index].holder.substring(winners[metadata.index].holder.length-4).toUpperCase() + '</i>'
                        $('#winnersRow .first-place').html(html);

                        var stats = getStats(metadata);

                        stats.then(function(result){
                            let stathtml = '<b>' + result.name + '</b><br><ul class="list-group">';
                            stathtml += `<li class="list-group-item">Entered <span class="purple">${result.entered.length}</span> Dance Royales</li>`;
                            stathtml += `<li class="list-group-item">Placement %: <span class="purple">${result.placepercent}</span></li>`;
                            stathtml += `<li class="list-group-item">First Place: <span class="purple">${result.firstpercent}</span></li>`;
                            stathtml += `<li class="list-group-item">Second Place: <span class="purple">${result.secondpercent}</span></li>`;
                            stathtml += `<li class="list-group-item">Third Place: <span class="purple">${result.thirdpercent}</span></li>`;
                            stathtml += '</ul>';
                            stathtml += `<a href="${homeurl}/stats/${result.id}" class="btn btn-dark my-5">View Stat Page</a>`;
                            $('#winnerInfo .first-place').html(stathtml);
                        })
                    break;
                    case '2':
                        html += `<h3 class="text-center purple">Second Place<br><small class="purple">${metadata.name}</small></h1>`
                        html += `<b class="text-center">Payout: ${parseInt(web3.utils.fromWei(winners[metadata.index].payout, 'ether'))} <i class="far fa-syringe"></i>HGH</b>`
                        html += '<br><i>' + winners[metadata.index].holder.substring(0, 2) + winners[metadata.index].holder.substring(2, 6).toUpperCase() + '...' + winners[metadata.index].holder.substring(winners[metadata.index].holder.length-4).toUpperCase() + '</i>'
                        $('#winnersRow .second-place').html(html);

                        var stats = getStats(metadata);

                        stats.then(function(result){
                            let stathtml = '<b>' + result.name + '</b><br><ul class="list-group">';
                            stathtml += `<li class="list-group-item">Entered <span class="purple">${result.entered.length}</span> Dance Royales</li>`;
                            stathtml += `<li class="list-group-item">Placement %: <span class="purple">${result.placepercent}</span></li>`;
                            stathtml += `<li class="list-group-item">First Place: <span class="purple">${result.firstpercent}</span></li>`;
                            stathtml += `<li class="list-group-item">Second Place: <span class="purple">${result.secondpercent}</span></li>`;
                            stathtml += `<li class="list-group-item">Third Place: <span class="purple">${result.thirdpercent}</span></li>`;
                            stathtml += '</ul>';
                            stathtml += `<a href="${homeurl}/stats/${result.id}" class="btn btn-dark my-5">View Stat Page</a>`;
                            $('#winnerInfo .second-place').html(stathtml);
                        })
                    break;
                    case '3':
                        html += `<h3 class="text-center purple">Third Place<br><small class="purple">${metadata.name}</small></h1>`
                        html += `<b class="text-center">Payout: ${parseInt(web3.utils.fromWei(winners[metadata.index].payout, 'ether'))} <i class="far fa-syringe"></i>HGH</b>`
                        html += '<br><i>' + winners[metadata.index].holder.substring(0, 2) + winners[metadata.index].holder.substring(2, 6).toUpperCase() + '...' + winners[metadata.index].holder.substring(winners[metadata.index].holder.length-4).toUpperCase() + '</i>'
                        $('#winnersRow .third-place').html(html);

                        var stats = getStats(metadata);

                        stats.then(function(result){
                            let stathtml = '<b>' + result.name + '</b><br><ul class="list-group">';
                            stathtml += `<li class="list-group-item">Entered <span class="purple">${result.entered.length}</span> Dance Royales</li>`;
                            stathtml += `<li class="list-group-item">Placement %: <span class="purple">${result.placepercent}</span></li>`;
                            stathtml += `<li class="list-group-item">First Place: <span class="purple">${result.firstpercent}</span></li>`;
                            stathtml += `<li class="list-group-item">Second Place: <span class="purple">${result.secondpercent}</span></li>`;
                            stathtml += `<li class="list-group-item">Third Place: <span class="purple">${result.thirdpercent}</span></li>`;
                            stathtml += '</ul>';
                            stathtml += `<a href="${homeurl}/stats/${result.id}" class="btn btn-dark my-5">View Stat Page</a>`;
                            $('#winnerInfo .third-place').html(stathtml);
                        })
                    break;
                }
                
            });
        }
    }
    else{
        let html = '<div class="col-12 text-center"><h1 class="text-center">This Rumble Has Not Started</h1><br><br><a href="' + homeurl + '/watch/' + id.toString() + '" class="btn btn-dark btn-lg"><i class="fak fa-dance"></i> Watch Live</a></div>';

        $('#winnersRow').html(html)
        $('#statsSection').hide();
    }
}

$(function(){
    pullInfo(rumbleId);
})