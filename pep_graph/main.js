//requiring puppeteer
let puppeteer=require("puppeteer");

//getting request and cheerio module
let request=require("request");
let cheerio=require("cheerio");

//getting id/pass as input
let  inputArr=process.argv.slice(2);
let emailId=inputArr[0].trim();
let pass=inputArr[1].trim();

//creating browser 

let browserStartPromise=puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximized","--disable-notifications"]
});


let page;
let gBrowserObj;
let selector;
browserStartPromise.then(function(browserObj)
{ 
    //getting list of open tabs and attaching page to last tab and gBrowserObj to browserObj

    gBrowserObj=browserObj;

    let allListOfPages=browserObj.pages();
    return allListOfPages;
}).then(function(allListOfPages)
{
    page=(allListOfPages[allListOfPages.length-1]);
    return page;
}).then(function()
{
    //opening pepccoding website
    let pepOpen=page.goto("https://www.pepcoding.com/");
})

.then(function()
{
    //waiting and clicking for login selector
    console.log("reached");
    return waitAndClick(`li.site-nav-li[role="presentation"]`,page);
    
})


//waiting for email selector
.then(function()
{  selector="input[type='email']"
    console.log("reached 4",selector);
    return page.waitForSelector(selector,{visible:true},{delay:120});
})
.then(function()
{   //typing email
    console.log("reached typing email")
    
        let typePromise=page.type(selector,emailId,{delay:120});
        return typePromise;
    
    
})
//waiting for pass selector
.then(function()
{

   return page.waitForSelector("input[type='password']",{visible:true},{delay:120})

})
.then(function()
{ //typing password
    
        return page.type("input[type='password']",pass,{delay:120});
   
   
})
.then(function()
{    //pressing submit button
    return waitAndClick('button[type="submit"]',page);
})
.then(function()
{   //opening profile page
    return waitAndClick('.svg-user.svg-header',page);
})
.then(function()
{   //opening profile page
    return waitAndClick('.col.l8.s8.m8.lp-dropdown',page);
})

.then(function()
{
    let listOfElements=page.$$(".card .bold.no-margin");
    return listOfElements;
})

.then(function(listOfElements)
{
    return listOfElements[1].click();
})

.then(function()
{   // making 100 submissions visible per page
    return waitAndClick("#showSubmissionsPerpage",page);
})
.then(function()
{  
    // making 100 submissions visible per page
    return page.select("#showSubmissionsPerpage",'100');
    
})
.then(function()
{
    return waitAndClick("#showSubmissionsPerpage",page);
})

.then(function()
{
    // requesting submissions page
    request("https://www.pepcoding.com/profile/submissions",rcb);
     
})

function rcb(error,response,html)
{
    if(error)
    {
        console.log(error);
    }
    else if(response.statusCode==404)
    {
        console.log("Not found");
    }
    else 
    {
        dataExtracter(html);
    }
}

function dataExtracter(html)
{
    //console.log("html ",html);
    let searchTool=cheerio.load(html);
    console.log("reached data extracter")
    let waitPro=page.waitForSelector("#stat .col.l2.s4.m6");
    waitPro.then(function fn()
    {
        let elemRep=searchTool("#stat .col.l2.s4.m6");
        console.log(searchTool(elemRep[0]).text());
    })
   
}


//building wait and click promise function
function waitAndClick(selector,cPage)
{
   return new Promise(function(resolve,reject)
   {
      let waitForPromise=cPage.waitForSelector(selector,{visible:true},{delay:150});
      waitForPromise.then(function()
      {
          let click=cPage.click(selector);
          return click;
      }).then(function()
      {
          resolve();
      }).catch(function(err)
      {
          reject(err);
      })
   })
}