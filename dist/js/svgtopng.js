var getCanvas; // global variable

const svgToPng = async (id) => {
    try {
        await contract.methods.tokenURI(id).call((err, result) => { 
            let metadata = JSON.parse(atob(result.replace("data:application/json;base64,", "")));
            var b64 = metadata.image.replace('data:image/svg+xml;base64,', '');
            var svg = atob(b64);
            $('#svg').html(svg);
            // do svg to png here
            window.scrollTo(0,0);

            html2canvas(document.querySelector("#svg"),
            {
                scrollX: -window.scrollX,
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight
            }
            ).then(canvas => {
                $('#svg').html('');
                $('#svg').append(canvas)
            });
        });
    } 
    catch (error) {
        alert(error.message);
    }
}

$(document).on('click', '#btnSvgToPng', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();

    svgToPng(parseInt($('#tokenId').val()))
})
