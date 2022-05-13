let puppeteer=require("puppeteer");
let request=require("request");
let fs=require("fs");
const { time, timeEnd } = require("console");
const { title } = require("process");
let page;

(async function fn()
{
   let browser = await puppeteer.launch(
       {
           headless:false,
           defaultViewport:null,
           ignoreDefaultArgs: ["--disable-extensions","--enable-automation"],
           args:["--start-maximized"]
       }
   )

   page=await browser.newPage();
   await page.goto("https://www.youtube.com/playlist?list=PL-JvKqQx2Atd--1Gs3WB8nmWOWRbEM7WW");
   
   await page.waitForSelector('.style-scope.yt-formatted-string');
   //console.log("hello");

   let elem=await page.$$('.style-scope.yt-formatted-string');
   
   let value=await page.evaluate(function fn(i){

    return i.textContent;

   },elem[0]);

   let videosNum=await page.evaluate(function fn(i){

    return i.textContent;

   },elem[1]);

   console.log("Title",value);
   console.log("No. of actual videos",videosNum);

   let views=await page.$$(".style-scope.ytd-playlist-sidebar-primary-info-renderer");
   

   views=await page.evaluate(function fn(i){
  
    return i.textContent;

   },views[6])
  
   console.log(views);


   let scroller=await page.$$(".circle.style-scope.tp-yt-paper-spinner");

   // console.log("scoller length ",scroller.length);
  
    let l=scroller.length;
  
    for(let i=0;i<l-1;i++)
    {
        await page.click(".circle.style-scope.tp-yt-paper-spinner");
        await waitTillHTMLRendered(page);
  
    }
  


   let vidTitle=await page.$$(".style-scope.ytd-playlist-video-renderer #video-title");

   let lastVid=vidTitle[vidTitle.length-1];
  
   await page.evaluate(function(element)
   {
 
     return element.scrollIntoView();
      
 
   },lastVid);

  let times=await page.$$("span[id='text']");

 
  console.log("no. of videos ",vidTitle.length);
  console.log("no. of times ",times.length);
  
//   for(let i=0;i<times.length;i++)
//   {
//     times[i]=await page.evaluate(function fn(element)
//     {
//        return element.textContent.trim();
//     },times[i])

//   }
  
  

//    for(let i=0;i<vidTitle.length;i++)
//    {
//        vidTitle[i]=await page.evaluate(function fn(i)
//        {
//            return i.textContent;
//        },vidTitle[i])

//        vidTitle[i]=vidTitle[i].trim();
//    }
   
   //console.log(vidTitle.length+" "+times.length);

   let infoObj=[];
   for(let i=0;i<times.length;i++)
   {
      // console.log("Hello")
       let obj=await page.evaluate(getObj,vidTitle[i],times[i]);

       infoObj.push(obj);

   }

  console.table(infoObj);

})();

function getObj(element1,element2)
{

    return {
        Title:element1.textContent.trim(),
        Time:element2.textContent.trim()
    }
    
}

//circle style-scope tp-yt-paper-spinner


const waitTillHTMLRendered = async (page, timeout = 10000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;
    while (checkCounts++ <= maxChecks) {
        // html
        let html = await page.content();
        let currentHTMLSize = html.length;
        
       // console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize);
        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
        }
        lastHTMLSize = currentHTMLSize;
        await page.waitFor(checkDurationMsecs);
    }
};