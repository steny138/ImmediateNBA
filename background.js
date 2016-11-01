var errorCode;
var currents ;
var current;
var host = 'http://data.nba.com/'
var gamesUrl = 'jsonp/5s/json/cms/noseason/scoreboard/';
var dataUrl = 'data/10s/html/nbacom/2015/gameinfo/';
var newUrl = 'http://tw.global.nba.com/stats2/game/snapshotlive.json?countryCode=TW&locale=zh_TW&gameId=';
var reqeustInterval = 1000 * 60 * 5;
var visitor;
var home;
var visitors;
var homes;

var getInfo = {

    processData: function(data)
    {
        data = JSON.parse(data);
        if(data.sports_content.games === ''){
            errorCode = '今天沒有比賽...工作吧';
            reqeustInterval = 1000 * 60 * 60 * 24;
            return;
        }
        else
        {
            reqeustInterval = 1000 * 60 * 5;
        }
        currents = [];
        visitors = [];
        homes = [];
        var games = data.sports_content.games.game;
        if(games.length > 0){
            var csi = '' + new Date().getHours()+ new Date().getMinutes() + new Date().getSeconds();
            for (var i = 0; i < games.length; i++) {
                var game = games[i];
                $.ajax({
                    url: newUrl + game.id,
                    type: "GET",
                    dataType: 'json',
                    async: false,
                    success: function (responseText) {
                        currents.push(responseText);
                        visitors.push(responseText.payload.awayTeam);
                        homes.push(responseText.payload.homeTeam);
                        console.log(homes);
                        if (i==0)
                        {
                            current = responseText;
                            visitor = responseText.payload.awayTeam.profile.abbr;
                            home =  responseText.payload.homeTeam.profile.abbr;
                        }
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        errorCode = '抓不到資料我好難過2';
                    }
                });
            };
        }
        else
        {
            errorCode = '抓不到資料我好難過3';
        }
    }
}   

function getGames(feedDate)
{
	feedDate.setDate(feedDate.getDate() - 1);

    var currYear = feedDate.getFullYear();
    var currMonth = ((feedDate.getMonth()+1) < 10) ? '0'+(feedDate.getMonth()+1) : feedDate.getMonth()+1;
    var currDate = (feedDate.getDate() < 10) ? '0'+(feedDate.getDate()) : (feedDate.getDate());
    $.ajax({
        'url': host + gamesUrl + currYear + currMonth + currDate + '/games.json',
        'type': "GET",
        'dataType':'text',
        'success': function(data)
        {
            getInfo.processData(data.replace('callbackWrapper(', '').replace(');', ''));
        },
        'error': function (xhr, ajaxOptions, thrownError) {
            errorCode = '抓不到資料我好難過1';
        }
    });

    
    window.setTimeout(startRequest, reqeustInterval);
}

function startRequest()
{
    getGames(new Date());
    //getScore(); 
}
/*
function scheduleRequest() {
	var reqeustInterval = 1000 * 60 * 5;
	console.log("Scheduling request...");
	window.setTimeout(startRequest, reqeustInterval);
}
*/
startRequest();