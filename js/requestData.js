(function ($) {

  function savetomongo(postData) {

    $.ajax({
      url: '/dtask/web/save/mongodb',
      method: 'post',
      data: postData,
      dataType: 'json',
      success: function (msg) {
      },
      error: function (error) {
        console.log(error)
      },
    });

  }

  async function ajaxcallmultidata(type) {

    if(type=="candle")
    apiurl = 'https://min-api.cryptocompare.com/data/v2/histominute?fsym=BTC&tsym=GBP&limit=1&api_key=0dd7df231eed8225b22a2f91860b0d9dd1fb827c05257286f27e593e29146023';
    else
    apiurl= 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC&tsyms=USD&api_key=0dd7df231eed8225b22a2f91860b0d9dd1fb827c05257286f27e593e29146023';
    return new Promise(function (resolve, reject) {
      $.ajax({
       url: apiurl,
        method: 'get',
        dataType: 'json',
        success: function (data) {
          resolve(data); // Resolve the promise with the API response data
        },
        error: function (error) {
          reject(error); // Reject the promise in case of an error
        },
      });
    });
  }

  function formatcurr(val) {
    curr = val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 3,
    });
    return curr;
  }

  // Function to make the API request
  async function getlinechartdata() {

    let linedata = await ajaxcallmultidata("line");
    console.log(linedata.RAW.BTC.USD.PRICE);
    price = formatcurr(linedata.RAW.BTC.USD.PRICE)

    $('#current-price').text(price);
    ob = {}
    ob.type = 'line';
    ob.price = linedata.RAW.BTC.USD.PRICE;
    savetomongo(ob);
  }

  async function getcandlechartdata() {
    let data = await ajaxcallmultidata("candle");

    data.Data.Data[0].type = "candle"
    savetomongo(data.Data.Data[0]);
  }


  setInterval(getcandlechartdata, 2000);
  setInterval(getlinechartdata, 2000); 


})(jQuery);

