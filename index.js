const http = require('http');

function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', err => {
            reject(err);
        });
    });
}

const server = http.createServer( async (req, res) => {
    let ret = {
        "retCode" : 200,
        "retContent":{
            "error":"伺服器不認你欸"
        }
    }

    let apiName = req.url.split('/').pop();

    switch (req.method){
        case "GET":{
            switch(apiName){
                case "hello":{
                    ret.retContent = {
                        "message":"Hello World!"
                    }
                    ret.retCode = 200;
                }
            }
            break;
        }
        case "POST":{

            let body;

            try{
                body = await getRequestBody(req);
                body = JSON.parse(body);
            }catch {
                ret.retCode = 400;
                ret.retContent = {
                    "error":"我不知道的錯誤"
                };
            }


            switch(apiName){
                case "write-a-dynamic-bubble-message" :{
                    if(body.message){

                    }
                }
            }

            break;
        }

        default:{
            ret.retContent = {
                "message":"伺服器好像不支援你的HTTP方法。"
            };
            ret.retCode = 400;
        }
    }

    let ContentJSON =
        JSON.stringify(ret.retContent);

    res.writeHead(ret.retCode, { 'Content-Type': 'application/json'});
    res.end(ContentJSON);
});

server.listen(443, () => {
    console.log('https://api/hxx.lol/');
});
