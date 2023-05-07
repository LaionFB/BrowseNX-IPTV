var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var server = urlParams.get('server');
var username = urlParams.get('username');
var password = urlParams.get('password');
var listUrl = `http://${server}/get.php?username=${username}&password=${password}&type=m3u_plus&output=m3u8`
var title = document.getElementById('title');
var content = document.getElementById('content');
var m3u = '';
fetch(listUrl)
.then(async res => {
    var body = res.body;
    var reader = body.getReader();

    while (true) {
        const result = await reader.read();
        if (result.done) {
            parseRawM3u(m3u);
          return;
        }
    
        const chunk = result.value;
        if (chunk == null) {
          throw 'Empty chunk received during download';
        } else {
            m3u += new TextDecoder("utf-8").decode(chunk);
        }
      }
})

function parseRawM3u(m3u){
    var regex=/#EXTINF:-1 tvg-name="(.*?)" tvg-logo="(.*?)" group-title="(.*?)",(.*?)\n(https?:\/\/[^\s]*)/gsm
    var i =0;
    var pos=0;
    var error = 0;
    var channels = [];
    var inner = '';
    do{
        var result = (regex.exec(m3u));
        if(result){
            if(i && result['index'] != pos){
                error++
            }
            i++;
            pos = result['index'] + result[0].length + 1;
            if(/ HD$/.test(result[1])){
                channels.push({
                    name: result[1],
                    img: result[2],
                    category: result[3],
                    desc: result[4],
                    url: result[5]
                });

                inner += `
                <a class="channel" href="${result[5]}">
                    <div class="logo-container">
                        <img class="logo" src="${result[2]}" onerror="this.style.display = 'none'"/>
                    </div>
                    <div class="text-container">
                        <span class="label">${result[1]}</span>
                        <span class="epg">Teste EPG</span>
                    </div>
                </a>
                `;
            }
        }
    }while(result)
    console.log(channels)
    content.innerHTML = inner;
}