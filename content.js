var elements = document.getElementsByTagName('*');
var oneBtcToIdr = (localStorage.getItem('one_btc_to_idr') == null ? 450000000 : localStorage.getItem('one_btc_to_idr'))

/**
 * Load bitcoin price and save to localStorage
 */
if (localStorage.getItem('last_bitcoin_price_check') == null) {
    update();
} else {
    // refresh if more than 10 minutes
    if (Math.floor(Date.now() / 1000) - localStorage.getItem('last_bitcoin_price_check') > (60 * 10)) {
        update();
    }
}

function update() {
    fetch("https://roaringstars.com/api_rate.php?deposit=1500")
    .then(response => response.json())
    .then(json => {
        if (json.data.one_btc_to_idr_int !== null) {
            localStorage.setItem('one_btc_to_idr', json.data.one_btc_to_idr_int);
            localStorage.setItem('last_bitcoin_price_check', Math.floor(Date.now() / 1000));
        }
    });
}

/**
 * find price 
 */
for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            var textStripped = text.replace(/[^0-9]/g, '');
            var priceInSatoshi = Math.round(textStripped / (oneBtcToIdr/100000000)).toLocaleString();

            var replacedText = text.replace(/(Rp |Rp)[a-zA-Z0-9.]{4,8}$/gi, priceInSatoshi + ' Satoshi');

            if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
            }
        }
    }
}

