var current;
var errorCode;


var currents ;
var visitors ;
var homes ;

function renderPage() {
 	var bgPage = chrome.extension.getBackgroundPage();
    current = bgPage.current;
    errorCode = bgPage.errorCode;

    currents = bgPage.currents;
    visitors = bgPage.visitors;
    homes = bgPage.homes;
    

    if(errorCode > '')
    {
    	$("#temp").html(errorCode);
    	$("#temp").removeClass('hide');
    }
    else
    {
    	$("#games").removeClass('hide');
    	setGameTeamsImage(bgPage.visitor, bgPage.home);
        console.log(visitors);
        setGameTeamsScore(visitors[0], homes[0]);
    }
    setGameList()

    var $gameHtml = $($(current).find('textarea').val());
    $gameHtml = $('<div />').append($gameHtml);
    $gameHtml .find('div').remove();
    $("#detail").html($gameHtml);
}


function setGameList()
{
    for (var i = 0; i < currents.length; i++) {
        var cur = currents[i];
        var _visitor = visitors[i];
        var _home = homes[i];
        var gameTitle = _home.team_key + ' vs ' + _visitor.team_key;
        $('#menu-bar').append(createMenuItem(gameTitle));

        $('#game-menu').append(createSelectMenuItem(gameTitle, _home.team_key + _visitor.team_key));
    };
}

function createMenuItem(title)
{
    var $li = $('<li>').addClass('current');
    $li.append($('<a>')).find('a');
    $li.find('a').append($('<span>')).find('span').text(title).attr('id', 'current');
    return $li;
}

function createSelectMenuItem(title,value)
{
    var $option = $('<option>');
    $option.val(value);
    $option.text(title);
    return $option;
}

function setGameTeamsImage(tvisitor, thome)
{
	if(tvisitor > '')
	{
		$('div#visitor img').attr('src', 'images/teams/svg/'+ tvisitor +'_logo.svg');
	}
	if(thome > '')
	{
		$('div#home img').attr('src', 'images/teams/svg/'+ thome +'_logo.svg');
	}
}
function setGameTeamsScore(tvisitor, thome)
{
    //render html home team & away team
    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);
    var result_home = template(thome);
    var result_away = template(tvisitor);

    $('div#home_score').html(result_home);
    $('div#visitor_score').html(result_away);
}

$(document).ready(function() {
    renderPage();
    $('#game-menu').change(function()
    {
        for (var i = 0; i < currents.length; i++) {
            var cur = currents[i];
            var _visitor = visitors[i];
            var _home = homes[i];
            var gameTitle = _home.team_key + _visitor.team_key;
            if (gameTitle === $.trim($(this).find('option:selected').val()))
            {
                 var $gameHtml = $($(cur).find('textarea').val());
                $gameHtml = $('<div />').append($gameHtml);
                $gameHtml .find('div').remove();
                $("#detail").html($gameHtml);
                setGameTeamsImage(_visitor.team_key, _home.team_key);
                setGameTeamsScore(_visitor, _home);
            }
        };
    });
    $('#game-menu').focus();
});
