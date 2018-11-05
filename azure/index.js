var request = require("async-request");

module.exports = async function(context, req) {
    
        context.log('starting..');
        
        var keys = {
            "id": req.body.public_key,
            "secret": req.body.private_key
          };

        var obj = {
            method: "POST",
            data: JSON.stringify(keys),
            headers: {
                "Content-Type": "application/json"
            }
        };

        let res = await request("https://www.greeninvoice.co.il/api/v1/account/token",obj);
        
        if (res.statusCode!=200) {
            context.res = { status: res.statusCode, body: res.body };
            context.done();
            return;
        }

        
        var token = JSON.parse(res.body).token;
        console.log(token);

        var obj2 = {
            method: req.body.httpverb.toUpperCase(),
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json",
                "Content-Type":"application/json"
            }
        };

        if (req.body.payload) obj2.data = (typeof req.body.payload=='string') ? req.body.payload : JSON.stringify(req.body.payload);

        var res2;
        try{
            res2 = await request(req.body.url, obj2);

            if (res2.statusCode!=200) {
                context.res = { status: res2.statusCode, body: res2.body };
                context.done();
                return;
            }

        }
        catch(err){
            console.log(err);
        }
        
        context.res = { status: res2.statusCode, body: res2.body };
        context.done();

};