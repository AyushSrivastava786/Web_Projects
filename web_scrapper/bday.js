let cheerio = require("cheerio");
let url="https://www.espncricinfo.com/series/ipl-2021-1249214/rajasthan-royals-vs-sunrisers-hyderabad-28th-match-1254085/full-scorecard"
let request=require("request");
let fs=require("fs");

console.log("before");
let dummyhtml="";
request(url,cb);
let dates=[];
let names=[];
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
let elemRep;
function extract(html)
{
    let searchTool=cheerio.load(html);
     elemRep=searchTool(".table.bowler tbody tr");
   
    for(let i=0;i<elemRep.length;i++)
    {
        dummyhtml=dummyhtml+searchTool(elemRep[i]).html();
    }
    fs.writeFileSync("index.html",dummyhtml);

    for(let i=0;i<elemRep.length;i++)
    {

        let cols= searchTool(elemRep[i]).find("td");
       // let name=searchTool(cols[0]).text();
       // let wick=searchTool(cols[4]).text();
        //console.log(name+" "+wick);

        let ha=searchTool(cols[0]).find("a");
        let hr=searchTool(ha).attr("href");
       
        let fullLink=`https://www.espncricinfo.com${hr}`
        
        request(fullLink,newcb);

    }


}
let count=0;
function newcb(error,response,html)
{
   if(error)
   {
       console.log(error);
   }
   else if(response.statusCode==404)
   {
       console.log("Not found");
   }
   
   else{
       count++;
       getBday(html);
      if(elemRep.length==count)
      {
          print();
      }
   
   }

}

function getBday(html)
{
    let searchTool=cheerio.load(html);
    let elemRep=searchTool(".player-card-description");
    let ageyd=searchTool(elemRep[2]).text();
    let name=searchTool(elemRep[0]).text();
    //console.log(name+" "+age);
     
        dates.push(ageyd);
        names.push(name);
     
  
     
         for(let i=dates.length-1;i>0;i--)
        {
           let incomingBirthArr=dates[i].split("y");
           let incomingBirthYear=incomingBirthArr[0].trim();
           
           let incomingBirthDay=incomingBirthArr[1].split("d");
           incomingBirthDay=incomingBirthDay[0].trim();
        // //    console.log(incomingBirthDay);
        // //    console.log(incomingBirthYear);

        let compareBirthArr=dates[i-1].split("y");
        let compareBirthYear=compareBirthArr[0].trim();
        
        let compareBirthDay=compareBirthArr[1].split("d");
        compareBirthDay=compareBirthDay[0].trim();
        
         if(incomingBirthYear<compareBirthYear)
         {
             let temp=dates[i];
             dates[i]=dates[i-1];
             dates[i-1]=temp;

             temp=names[i];
             names[i]=names[i-1];
             names[i-1]=temp;
         }
         else if(incomingBirthYear==compareBirthYear)
         {
             if(incomingBirthDay<compareBirthDay)
             {
                let temp=dates[i];
                dates[i]=dates[i-1];
                dates[i-1]=temp;
             }
         }
         else
         {
             break;
         }

        }
    
    
  // count++;

//    if(count==elemRep.length-1)
//    {
//        print();
//    }
    
     
    

}

function print()
{
    for(let i=0;i<dates.length;i++)
    {
        console.log(names[i]+"  "+dates[i]);
    }
}
console.log("after");


