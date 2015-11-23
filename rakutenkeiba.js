 var access_token="IgABM3uzw4Wze-3z_xAt8U8V1pzeUZOQcMQ1oko_TonNSad1fth";
  var Co="rakuten";
  var clcd="hack";
  var uma_regist_number;
  var service_url = "https://app.rakuten.co.jp/engine/api/HorseRace/GetHorseDetail_20141112";
  var ncmb = new NCMB("c484b149af300bced4b1ae1204988f91d17ba57db3dc120d95bf8560759b8a3a","c9726eb8fc690a6c77b987e045402123e6a32858252661d63dc733660d12447f");
  var Uma_list;
function rakutenkeiba(regist_number){
  console.log(regist_number);
  var data = {"access_token":access_token, 
                  "Co":Co,
                  "clcd":clcd,
                  "uma_regist_number":regist_number
                };
  var resdata = uma_api(data);
  console.log(resdata);
}

function uma_api(data){
    var response_data = $.ajax({
      type:"GET",
      url:service_url,
      data:data ,
      //xhrFields: { withCredentials: true },
      //dataType: 'jsonp',
      async: false
    }).responseText;
    return response_data;
};

