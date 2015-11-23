  var APIKey="099ed0f397f021e2d1671de61fed7d8f";
  var optionFlgMinFaceWidth="1";
  var facePartsCoordinates="1";
  var blinkJudge="0";
  var ageAndgenderJudge="0";
  var angleJudge="0";
  var smileJudge="0";
  var enjoyJudge="0";
  var response ="json";
  var service_url = "http://eval.api.polestars.jp:8080/webapi/face.do";
  var ncmb = new NCMB("c484b149af300bced4b1ae1204988f91d17ba57db3dc120d95bf8560759b8a3a","c9726eb8fc690a6c77b987e045402123e6a32858252661d63dc733660d12447f");
  var Uma_list;
function requestRecognition(){
 
  document.getElementById( "fromCamera" ).onchange = function()
{
  // 変数の宣言
  var fileList , file , fr , result ;
  console.log("test");
  // ファイルリストを取得
  fileList = this.files ;
  console.log(fileList);
  // 結果エリアのエレメントを取得
  result = document.getElementById( "result" ) ;

  // 結果エリアを一度リセット
  result.innerHTML = "" ;

  // ローカル画像を表示する (枚数分)
  for( var i=0,l=fileList.length; l>i; i++ )
  {
    // 対象のファイルを取得
    file = fileList[i] ;
    console.log(file);
    // [FileReader]クラスを起動
    fr = new FileReader() ;
    console.log("test0");
    fr.readAsDataURL(file);
    // 読み込み後の処理
    fr.onload = function()
    {
      // HTMLに書き出し[
      //console.log("test");
      //console.log(this.result);
      //result.innerHTML += '<img src="' + this.result + '" width="auto" height="auto">' ;
      document.getElementById("result").src = this.result;

      
      var data = {"apiKey":APIKey, 
                  "inputBase64":this.result,
                  "facePartsCoordinates":facePartsCoordinates,
                  "blinkJudge":blinkJudge,
                  "ageAndgenderJudge":ageAndgenderJudge,
                  "angleJudge":angleJudge,
                  "smileJudge":smileJudge,
                  "enjoyJudge":enjoyJudge,
                  "response":response
                };
      var resdata = pux_api(data);
      //console.log(resdata);
      var facedata = JSON.parse(resdata);
      //console.log(facedata);
      var faceFrameLeftX = Number(JSON.stringify(facedata.results.faceRecognition.detectionFaceInfo[0].faceCoordinates["faceFrameLeftX"]));
      var faceFrameRightX = Number(JSON.stringify(facedata.results.faceRecognition.detectionFaceInfo[0].faceCoordinates["faceFrameRightX"]));
      var leftBlackEyeCenter_x = Number(JSON.stringify(facedata.results.faceRecognition.detectionFaceInfo[0].facePartsCoordinates["leftBlackEyeCenter"].x));
      var leftBlackEyeCenter_y = Number(JSON.stringify(facedata.results.faceRecognition.detectionFaceInfo[0].facePartsCoordinates["leftBlackEyeCenter"].y));
      var rightBlackEyeCenter_x = Number(JSON.stringify(facedata.results.faceRecognition.detectionFaceInfo[0].facePartsCoordinates["rightBlackEyeCenter"].x));
      var rightBlackEyeCenter_y = Number(JSON.stringify(facedata.results.faceRecognition.detectionFaceInfo[0].facePartsCoordinates["rightBlackEyeCenter"].y));
      var subFaceFrame = faceFrameRightX - faceFrameLeftX ;
      var subEyeX = rightBlackEyeCenter_x - leftBlackEyeCenter_x;
      var subEyeY = rightBlackEyeCenter_y - leftBlackEyeCenter_y;
      var subEye = subEyeX*subEyeX + subEyeY*subEyeY;
      subEye = Math.sqrt(subEye);
      console.log("subEye:" + subEye);
      console.log("subFaceFrame:" + subFaceFrame);
      var human_eyeratio = Math.round(subEye) / subFaceFrame;
      console.log("human_eyeratio:" + human_eyeratio);
      comapre_db(human_eyeratio);



    }
  }
}

}

function pux_api(data){
    var response_data = $.ajax({
      type:"POST",
      url:service_url,
      data:data ,
      async: false
    }).responseText;
    return response_data;
}

function comapre_db(human_eyeratio){
  var UmaClass = ncmb.DataStore("uma");
  var array_uma = [];
  UmaClass.lessThan("uma_eyeratio",1.0)
          .fetchAll()
          .then(function(results){
            console.log("Successfully retrieved " + results.length + " scores.");
            Uma_list = results;
            console.log(results);
            console.log(Uma_list[0].uma_eyeratio);
            for (var i = 0; i < results.length; i++) {
              
              Uma_list[i].uma_eyeratio = Math.abs(parseFloat(Uma_list[i].uma_eyeratio) - human_eyeratio);
              console.log(Uma_list[i].uma_eyeratio +":"+ Uma_list[i].uma_name +":"+ Uma_list[i].uma_regist_number);
              array_uma[i] = Uma_list[i].uma_eyeratio;
            }
            var min_ratio = Math.min.apply(null, array_uma);
            for (var i = 0; i < Uma_list.length; i++) {
              if( Uma_list[i].uma_eyeratio == min_ratio){
                console.log(Uma_list[i].uma_eyeratio +":"+ Uma_list[i].uma_name +":"+ Uma_list[i].uma_regist_number);
                location.href="./share.html?uma_regist_number="+Uma_list[i].uma_regist_number;
              }
            }
          })
         .catch(function(err){
            console.log(err);
          });
}
