let cheerio = require("cheerio");
let url="https://www.espncricinfo.com/series/ipl-2021-1249214/rajasthan-royals-vs-sunrisers-hyderabad-28th-match-1254085/full-scorecard"
let request=require("request");
let fs=require("fs");
console.log("before");
let dummyhtml="";
request(url,cb);

function cb(err,response,html)
{
    if(err)
    {
        console.log(err);
    }
    else if(response.statusCode==404)
    {
        console.log("page not found");

    }
    else
    {
        extract(html);
    }
}

function extract(html)
{
    let searchTool=cheerio.load(html);
    let elemRep=searchTool(".table.bowler tbody tr");
   
    for(let i=0;i<elemRep.length;i++)
    {
        dummyhtml=dummyhtml+searchTool(elemRep[i]).html();
    }
    fs.writeFileSync("index.html",dummyhtml);

    for(let i=0;i<elemRep.length;i++)
    {

        let cols= searchTool(elemRep[i]).find("td");
        let name=searchTool(cols[0]).text().trim();
        let wick=searchTool(cols[4]).text().trim();

        console.log(name+" "+wick);

    }


}




console.log("after");
