let puppeteer=require("puppeteer");
//creating browser

let codes=require("./codes");

let browserOpenPromise=puppeteer.launch({

    headless:false,
    defaultViewport:null,
    args:["--start-maximized","--disable-notifications"]

});

let page;

browserOpenPromise.then(function(browserObj)
{
   console.log("Chromium opened");
    
   let newtabPromise=browserObj.newPage();

   return newtabPromise;
}).then(function(newTabObj)
{    page=newTabObj;
    let gpagePromise=newTabObj.goto("https://www.google.com");
    return gpagePromise;

}).then(function(gpageObj)
{
    let waitForElement=page.waitForSelector(".gLFyf.gsfi",{visible:true});
    return waitForElement;

}).then(function()
{

    let typingPromise=page.type(".gLFyf.gsfi","hackerrank");
    return typingPromise;

}).then(function()
{
    let enterPromise=page.keyboard.press("Enter",{delay:100});
    return enterPromise;
}).then(function()
{
    let waitForElement=page.waitForSelector(".LC20lb.DKV0Md",{visible:true});

    return waitForElement;
}

).then(function()
{
    let allElem=page.$$(".LC20lb.DKV0Md");
    return allElem
}).then(function(allElem)
{
    let elementClicked=allElem[0].click();
    return elementClicked;
}).then(function()
{
    let element=page.waitForSelector(`a[href="https://www.hackerrank.com/auth/signup?h_r=home&h_l=body_middle_left_button&h_v=1"]`);
    return element;
}).then(function()
{
    let elementClicked=page.click(`a[href="https://www.hackerrank.com/auth/signup?h_r=home&h_l=body_middle_left_button&h_v=1"]`)
    return elementClicked;
}).then(function()
{
    let elementwait=page.waitForSelector(`a[href="/auth/login"]`,{visible:true});
    return elementwait;
}).then(function()
{
    let elementClicked=page.click(`a[href="/auth/login"]`);
    return elementClicked;
}).then(function()
{
    let elementwait=page.waitForSelector("input[type]",{visible:true});

    return elementwait;
}).then(function()
{
   return page.type(`input[name="username"]`,"dedowop471@posiklan.com");

}).then(function()
{
    return page.type(`input[name="password"]`,"9587881339");
}).then(function()
{
    return page.waitForSelector('button[type="submit"]')
})
.then(function()
{   
    return page.click('button[type="submit"]');
}).then(function()
{
    console.log("logged in");
}).then(function()
{

   let waitAndClickPromise=waitAndClick(`div[data-automation="algorithms"]`);
   return waitAndClickPromise;

}).then(function()
{
    let waitAndClickPromise=waitAndClick(`input[value="warmup"]`);
   return waitAndClickPromise;
}).then(function()
{
    let allElem=page.$$(".js-track-click.challenge-list-item");
    return allElem
}).then(function(allElem)
{
    return allElem[1].click();
}).then(function()
{
    //getting it into focus
  return waitAndClick(".hr-monaco-editor-parent");
}).then(function()
{
    return page.keyboard.down("Control")
}).then(function()
{
    return page.keyboard.press("A");
}).then(function()
{
    return page.keyboard.press("X");
}).then(function()
{
    return page.keyboard.up("Control");
})



function waitAndClick(selector)
{
    return new Promise(function(resolve,reject)
    {
        let waitForElement=page.waitForSelector(selector,{visible:true});
        waitForElement.then(function()
        {
            
            return page.click(selector); 
        }).then(function()
        {
            resolve();
        }).catch(function(err)
        {
            reject(err);
        })


    })
 
}



