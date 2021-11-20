async function loadHGHBalance(){
    // current-hgh-held
    hghcontract.methods.balanceOf(ethereum.selectedAddress).call((err, result) => { 
        hghBalance = parseFloat(web3.utils.fromWei(result, 'ether')).toFixed(2)
        $('.current-hgh-held').html(hghBalance);
    });
}

$(document).on('click', '.btn-traits', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    let html = '<div class="container-fluid">';

    let traits = JSON.parse($(this).attr('data-traits'));

    html += '<div class="row">';
    for(let i=0; i<traits.length; i++){
        
        html += '<div class="col-6 mb-2">';
       // html += '<div class=" rounded trait-display p-1">';
        //html += '<h5 class="text-center"><small>' + traits[i].trait_type + '</small><br>';
        //html += '<span class="purple">' + traits[i].value + '</span></h5>';
        //html+= '</div></div>';
        html += '<div class="card"><div class="card-body"><p class="card-title">'+ traits[i].trait_type + '</p>'
        html += '<p class="card-text">' + traits[i].value + '</p></div></div>';
        html += '</div>';
    }

    html += '</div></div>';

    $('#alertModal .modal-title').html("Traits");
    // change this to allow coinbase and trust wallet links
    $('#alertModal .modal-body').html(html);
    alertModal.show();
})