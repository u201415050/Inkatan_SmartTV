//import SendMessages from '../../Util/constants';
var playersIcons = [
	'<div id="player1" class="itemPlayer"><div class="playerNumber">1</div><div class="avatar"><img class="user" src="../../Assets/icons/user.png" /></div><div id="playerName1" class="playerName">Esperando...</div></div>',
	'<div id="player2" class="itemPlayer disabled"><div class="playerNumber">2</div><div class="avatar" style="background: rgb(171, 154, 31)"><img class="user" src="../../Assets/icons/user.png" /></div><div id="playerName2" class="playerName">Esperando...</div></div>',
	'<div id="player3" class="itemPlayer disabled"><div class="playerNumber">3</div><div class="avatar" style="background: rgb(126, 34, 140)"><img class="user" src="../../Assets/icons/user.png" /></div><div id="playerName3" class="playerName">Esperando...</div></div>',
	'<div id="player4" class="itemPlayer disabled"><div class="playerNumber">4</div><div class="avatar" style="background: rgb(140, 89, 34)"><img class="user" src="../../Assets/icons/user.png" /></div><div id="playerName4" class="playerName">Esperando...</div></div>'
]

$(document).ready(function () {
	//getParametersFromUrl()
	//console.log(SendMessages)
	//elementTest(1)
	
	//$('#token').append('Token: INK-' + ActualParameters.ipSelected);
	
	var data=ActualParameters.url.substr(5,ActualParameters.url.length-11)
	var qr = qrcode(4, 'M');
  	qr.addData(data);
	  qr.make();
	 var wd=$(window).height();
  	document.getElementById('token').innerHTML = qr.createImgTag(parseInt(wd/200),0);
});
var lenPlayers = 0
var numberPlayers = 0
//alert(location.href)
var ready = [];

function setPlayers(valueCursor) {
	$("#messageWaiting").remove();
	for (var i = 0; i < valueCursor; i++) {
		$("#playersContainer").append(playersIcons[i]);
		tasks.push(
			{name: ("Esperando al jugador #"+i), status:false},
		)
		ready.push(false)
	}
	tasks.push(
		{name: "Esperando la seleccion de modo de juego", status:false},
	)
	tasks.push(
		{name: "Esperando la seleccion del nivel de modo de juego", status:false},
	)
	numberPlayers = valueCursor
}

var listNames = []
var tasks=[]
function changeName(name) {
	if (lenPlayers < numberPlayers) {
		tasks[lenPlayers].status=true
		tasks[lenPlayers].name=name+" conectado"
		lenPlayers++;
		$('#playerName' + lenPlayers).text(name)
		listNames.push(name)
		$('#player' + lenPlayers).removeClass("disabled")
		setReady(lenPlayers - 1)
	}
	console.log(tasks)
	sendMessageServer({
		action:"CONNECTION",
		name: tasks[lenPlayers-1].name
	})
}
var gameStarting = false;
var readyIndex = 0;


function addtemp(){
	console.log(1)
	changeName("Jesus")
}
function setReady(index) {
	var toChange = ready[index]
	ready[index] = !toChange
	//alert('55')
	if (toChange) {
		$('#player' + (index + 1) + ' .avatar .user').attr('src', '../../Assets/icons/user.png')
	} else {
		$('#player' + (index + 1) + ' .avatar .user').attr('src', '../../Assets/icons/userReady.png')
	}
	readyIndex++;
	var noMoreReady = true;
	this.ready.map(function (itemReady) {
		if (!itemReady) {
			noMoreReady = false
		}
	})
	if (noMoreReady) {
		gameStarting = true
		//alert(1)
		var strNames = '';
		listNames.map(function (item) {
			strNames += ',' + item
		})
		sendMessageServer({
			action:"ALLREADY"
		})
		
		setTimeout(function () {
			
			location.replace(parseUrl(location.href, "/GameMode",
				[{
						name: "namesPlayers",
						value: strNames.substr(1)
					},
					{
						name: "numberPlayers",
						value: numberPlayers
					}
				]))
			gameStarting = false
		}, 100)
	}
}