export default async function handler(req, res) {
    let ret = {
        retCode: 200,
        retContent: {
            error: "伺服器不認你欸"
        }
    };

    const url = req.url || '';
    const apiMatch = /^\/api\/(.*)/.exec(url);
    const apiName = apiMatch ? apiMatch[1] : false;

    switch (req.method) {
        case "GET": {
            switch (apiName) {
                case "hello": {
                    ret.retContent = {
                        message: "Hello World!"
                    };
                    ret.retCode = 200;
                    break;
                }
            }
            break;
        }

        case "POST": {
            let body = '';

            try {
                body = await new Promise((resolve, reject) => {
                    let data = '';
                    req.on('data', chunk => (data += chunk.toString()));
                    req.on('end', () => resolve(data));
                    req.on('error', err => reject(err));
                });
                body = JSON.parse(body);
            } catch {
                ret.retCode = 400;
                ret.retContent = {
                    error: "我不知道的錯誤"
                };
                break;
            }

            switch (apiName) {
                case "write-a-dynamic-bubble-message": {
                    if (body.message) {
                        ret.retContent = {
                            reply: `你剛剛說了：「${body.message}」`
                        };
                        ret.retCode = 200;
                    } else {
                        ret.retCode = 400;
                        ret.retContent = {
                            error: "請包含 message 欄位"
                        };
                    }
                    break;
                }
            }

            break;
        }

        default: {
            ret.retContent = {
                message: "伺服器好像不支援你的HTTP方法。"
            };
            ret.retCode = 400;
        }
    }

    res.statusCode = ret.retCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ret.retContent));
}
