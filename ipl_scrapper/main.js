//given url
let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

//getting request and cheerio  and xlsx services
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let xlsx = require("xlsx");

// requesting and implementing callback 
request(url, maincb);

function maincb(error, response, html) {
    if (error) {
        console.log(error);
    }
    else if (response.statusCode == 404) {
        console.log("WebPage not Found");

    }

    else {
        //loading in cheerio and finding link for all results
        let searchTool = cheerio.load(html);
        let matchUrl = searchTool(".widget-items.cta-link .label.blue-text.blue-on-hover").attr("href");
        // console.log(matchUrl);

        //requesting for all matches and implementing its callback function
        request(`https://www.espncricinfo.com${matchUrl}`, allMatchUrl);



    }
}

function allMatchUrl(error, response, html) {
    if (error) {
        console.log(error);
    }
    else if (response.statusCode == 404) {
        console.log("WebPage not Found");
    }
    else {
        scorecards(html);
    }
}

function scorecards(html) {
    //getting scorecards element Reperesentative
    let searchTool = cheerio.load(html);
    let ScoreUrlArray = searchTool('a[data-hover="Scorecard"]');
    // console.log(searchTool(ScoreUrlArray[1]).attr("href"));
    //looping on all elem rep to get url and then proceed to that url for getting batsmen performance
    //console.log(ScoreUrlArray.length)
    for (let i = 0; i < ScoreUrlArray.length; i++) {
        let lastUrl = searchTool(ScoreUrlArray[i]).attr("href");
        lastUrl = `https://www.espncricinfo.com${lastUrl}`;
        request(lastUrl, getBatsmenCallback);

    }

}


function getBatsmenCallback(error, response, html) {
    if (error) {
        console.log(error);
    }
    else if (response.statusCode == 404) {
        console.log("WebPage not Found");
    }
    else {
        getBatsmenData(html);
    }
}

//getting batsmen stats
function getBatsmenData(html) {

    if (fs.existsSync("D:\\projects\\web\\ipl_scrapper\\IPL_2020-2021") == false) {
        fs.mkdirSync("D:\\projects\\web\\ipl_scrapper\\IPL_2020-2021");
    }

    let searchTool = cheerio.load(html);
    let bothTeams = searchTool(".Collapsible");

    // console.log(matchinfo);
    let info = searchTool(".header-info .description").text();
    infoArr = info.split(",");
    venue = infoArr[1].trim();


    let date = infoArr[2].trim();

    //   console.log(venue+" "+date);
    let result = searchTool(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text").text();
    //  console.log(result);

    //console.log(bothTeams.length);
    for (let i = 0; i < bothTeams.length; i++) {
      //  console.log("loop started")
        let teamNames = searchTool(bothTeams[i]).find(".header-title.label");
        teamNames = searchTool(teamNames).text().split("INNINGS");
        teamNames = teamNames[0];
        teamNames = teamNames.trim();
        //console.log(teamNames);

        let tableRows = searchTool(bothTeams[i]).find(".table.batsman tbody tr");

        for (let j = 0; j < tableRows.length - 1; j = j + 2) {
            let cols = searchTool(tableRows[j]).find("td");
            let palyerName = searchTool(cols[0]).text();
            palyerName = palyerName.split("(c)")
            palyerName = palyerName[0].split("†");
            palyerName = palyerName[0].trim();
            // console.log(palyerName);

            let runs = searchTool(cols[2]).text();
            let balls = searchTool(cols[3]).text();
            let fours = searchTool(cols[5]).text();
            let sixes = searchTool(cols[6]).text();
            let sr = searchTool(cols[7]).text();

            let opponentTeam = "";
            if (i == 0) {
                opponentTeam = searchTool(bothTeams[1]).find(".header-title.label").text();
            }
            else {
                opponentTeam = searchTool(bothTeams[0]).find(".header-title.label").text();
            }
            opponentTeam = opponentTeam.split("INNINGS");
            opponentTeam = opponentTeam[0].trim();
            // console.log(opponentTeam);

            // console.log(palyerName+" "+runs+" "+balls+" "+fours+" "+sixes+" "+sr);    


            // fs.appendFileSync(`D:\\projects\\web\\ipl_scrapper\\IPL_2020-2021\\${palyerName}.json`,`{"name":"${palyerName}",\n"myTeam":"${teamNames}",\n"venue":"${venue}",\n"date":"${date}",\n"opponent":"${opponentTeam}",\n"result":"${result}",\n"runs":"${runs}",\n"balls":"${balls}",\n"fours":"${fours}",\n"sixes":"${sixes}",\n"sr":"${sr}"};\n`);

            //making teams' folder
        let filePath=`D:\\projects\\web\\ipl_scrapper\\IPL_2020-2021\\${teamNames}`;
        if(fs.existsSync(filePath)==false)
        {
            fs.mkdirSync(filePath);
        }

        filePath=`D:\\projects\\web\\ipl_scrapper\\IPL_2020-2021\\${teamNames}\\${palyerName}.xlsx`;
            // creating players object
         
           let playersArray=[];

           playersObj={
             
           "Name":palyerName,
             "Team Name":teamNames,
           "Opponent Team":opponentTeam,
           "Strike Rate":sr,
           "Runs":runs,
           "Sixes":sixes,
           "Fours":fours,
           "Result":result,
           "Venue":venue,
           "Date":date,
           "Balls":balls 
           }

              
        //  console.log(playersObj);
          
        if(fs.existsSync(filePath)==true)
        {
            //sheetName and workbook name are considered to be same by me
            playersArray=excelReader(filePath,palyerName);
            playersArray.push(playersObj);
           
        }
        
       else
       {
         playersArray.push(playersObj);
       }
       excelWriter(filePath,playersArray,palyerName);

        }








    }

}


function excelReader(filePath, sheetName) {
    //player workbook 
    let wb = xlsx.readFile(filePath);
    //read from a particular sheet in that wb
    let excelData = wb.Sheets[sheetName];
    //sheet to json
    let ans = xlsx.utils.sheet_to_json(excelData);

    return ans;

}

function excelWriter(filePath, json, sheetName) {
    //workbook create
    let newWB = xlsx.utils.book_new();
    //worksheet
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    //excel file create
    xlsx.writeFile(newWB, filePath);
}