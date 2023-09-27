const http = require("http");
const fs = require("fs");

http.createServer(function(request, response){

    if (request.url === "/" || request.url === "/home"){
        fs.readFile("./index.html", (err, data)=>{
            if (!err){
                response.setHeader("Content-Type", "text/html; charset=utf-8");
                response.write(data);
                response.end();
            } else {
                response.statusCode = 400;
                response.write("Something went wrong");
                response.end()
            }
        });
    }

    if (request.url === "/upload") {
        let user_form = "";
        request.on("data", (part) => {
            user_form = user_form + part;
        })
        request.on("end", () => {
            // console.log(user_form.split("&"));
            user_form = user_form.split("&");
            let data_to_file = "";
            for (let i=0; i<user_form.length; i++){
                let label, value, chunk;
                chunk = user_form[i].split("=");
                label = chunk[0];
                value = decodeURIComponent(chunk[1]);
                if (label === "email"){
                    value = value.replace("%40", "@");
                }
                data_to_file = data_to_file + label + " : " + value + "\n";
            }
            fs.writeFile("user_data.txt", data_to_file, (err)=>{});
            response.end(data_to_file);
        })
    }

}).listen(5000);
