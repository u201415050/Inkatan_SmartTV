var widthCanvas = $(window).width() * 1;
var heightCanvas = $(window).height();

var colorsPointer = ['rgba(0, 255, 0,0.7)', 'rgba(255, 223, 46,0.7)', 'rgba(208, 23, 255,0.7)', 'rgba(255, 104, 46,0.7)']
var colorsPointerTotal = ['rgba(0, 255, 0,1)', 'rgba(255, 223, 46,1)', 'rgba(208, 23, 255,1)', 'rgba(255, 104, 46,1)']
var colorsPointerOpacity = ['rgba(0, 255, 0,0.4)', 'rgba(255, 223, 46,0.4)', 'rgba(208, 23, 255,0.4)', 'rgba(255, 104, 46,0.4)']

var mapDelimit = widthCanvas * 0.60
var paddingLeft = widthCanvas * 0.40 / 2
var centerMapH = heightCanvas / 2
var radio = mapDelimit / 12
var paddingHeight = centerMapH - (radio * 5)
var mapa = Mapa()
var game = Game()
var dice = Dice()
var longRoad=''
var mapPlayers = {}
var PlayersDetails = []
var cards = Cards()
// PRELOAD IMAGES
function preload() {
    mapa.preload()
    mapa.resources.preload()
}
//CALL CARD
function callCard(typeCard, playerCard) {
    cards.action(typeCard, mapPlayers[playerCard])
}
//SETUP MAP AND PLAYERS
function setup() {
    var canvas = createCanvas(widthCanvas, heightCanvas);
    canvas.parent('#canvas')
    background(100, 180, 100)
    mapa.setup()
    setPlayer()
}

//DRAW
function draw() {
    background(100, 180, 100)
    mapa.printAll()
    mapa.printObjects(PlayersDetails)
    game.Game(mapa, PlayersDetails)
    showPointer()
}

//SHOW MAP POINTER
function showPointer() {
    switch (mapa.select) {
        case 'vertice':
            mapa.printPoint(PlayersDetails[turnIndex].indicators.vertice.fi,
                PlayersDetails[turnIndex].indicators.vertice.fj)
            break;
        case 'arista':
            mapa.printArista(PlayersDetails[turnIndex].indicators.arista.fi,
                PlayersDetails[turnIndex].indicators.arista.fj)
            break
        case 'rombo':
            mapa.printRombo(PlayersDetails[turnIndex].indicators.rombo.fi,
                PlayersDetails[turnIndex].indicators.rombo.fj)
            break
    }
}

//TEST ACTIONS
function keyPressed() {
    if (keyCode === DOWN_ARROW) {
        mapa.move(PlayersDetails[turnIndex], 'down')
    } else if (keyCode === UP_ARROW) {
        mapa.move(PlayersDetails[turnIndex], 'up')
    } else if (keyCode === RIGHT_ARROW) {
        mapa.move(PlayersDetails[turnIndex], 'right')
    } else if (keyCode === LEFT_ARROW) {
        mapa.move(PlayersDetails[turnIndex], 'left')
    } else if (keyCode === 32) {
        mapa.addObject(PlayersDetails[turnIndex])
    } else if (key === 'q') {
        mapa.changeSelect()
    } else if (key === 'd') {
        dice.throwDice()
    } else if (key === 'c') {
        //alert(turnIndex)
        cards.action(card_names.TUCUY, turnIndex)
    }
    else if (key === 'a') {
        //alert(turnIndex)
        GetLongRoad()
    } else if (key === 'p') {
        //alert(turnIndex)
        IsPort(0)
    }else if (key === 'b') {
        //alert(turnIndex)
        SetBuildMode({
            player:PlayersDetails[0].name,
            type:'t',
            amount:1
        })
        
    }
}
function SetBuildMode(data){
    console.log(data)
    game.data={
        player:mapPlayers[data.player],
        type: data.type,
        previous:PlayersDetails[mapPlayers[data.player]][data.type=='h'?'houses':'ways'].length,
        amount: data.amount
    }
    game.ChangeStatus('BUILD')
    mapa.select=data.type=='h'? "vertice": 'arista'
}
//CALL MOVE FUNCTIONS
function Move(val) {
    if(val.player==PlayersDetails[turnIndex].name){
        mapa.move(PlayersDetails[turnIndex], val.type)
    }
    
}

//DICE ACTION
function ThrowDice() {
    dice.throwDice()
}

//ADD AN OBJECT
function Add(obj) {
    if(obj.player==PlayersDetails[turnIndex].name){
    mapa.addObject(PlayersDetails[turnIndex])
    }
}

//CONFIGURE PLAYERS
function setPlayer() {
    var players = ActualParameters.namesPlayers.split(',')
    players.map(function (player, i) {
        mapPlayers[player] = i
        PlayersDetails.push({
            id:i,
            name: player,
            colorTotal: colorsPointerTotal[i],
            color: colorsPointer[i],
            colorOpacity: colorsPointerOpacity[i],
            houses: [],
            ways: [],
            resources: {
                stone: 0,
                wool: 0,
                potato: 0,
                quinoa: 0,
                gold: 0,
                wood: 0,
            },
            indicators: {
                vertice: positionsVertice[i],
                arista: positionsAristas[i],
                rombo: {
                    fi: 0,
                    fj: 0
                }
            },
            longRoad: 0
        })
    })
    console.log(mapPlayers)
}

function Struct(){
    return {
        start:[],
        end:[]
    }
}
function GetLongRoadPlayer(index){
    var listWays = PlayersDetails[index].ways;
    var treeWays = listWays.map(function(){return Struct()})
    var visited =  listWays.map(function(){return false})
    
    for(var i=0; i<listWays.length;i++){
        for(var j=i; j<listWays.length;j++){
            if(j!=i){
                if(listWays[i].start.id==listWays[j].start.id || listWays[i].start.id==listWays[j].end.id){
                    if(listWays[i].start.id==listWays[j].start.id){
                        treeWays[j].start.push(i)
                    }else{
                        treeWays[j].end.push(i)
                    }
                    treeWays[i].start.push(j)
                    
                }else if(listWays[i].end.id==listWays[j].start.id || listWays[i].end.id==listWays[j].end.id){
                    if(listWays[i].end.id==listWays[j].start.id){
                        treeWays[j].start.push(i)
                    }else{
                        treeWays[j].end.push(i)
                    }
                    treeWays[i].end.push(j)
                    
                }
            }
        }
    }
    var posibleInit=treeWays.filter(function(item,i){
            return item.start.length==0||item.end.length==0
        }).map(function(item,i){
        return i;
    })
    var lastVal=0
    var response =0
    for (let i = 0; i < posibleInit.length; i++) {
        var init = posibleInit[i]
        if(!visited[i]){
            response= DFS(init, visited,treeWays,0,-1)
            if(lastVal<response){
                lastVal=response
            }
        }
    }
    //var init = 0
    //while(!visited.includes(false)){
       /* treeWays= [
            {end:[1], start:[]},
            {end:[2,4], start:[0]},
            {end:[2,4], start:[1]},
            {end:[], start:[]},
            {end:[], start:[]},
            {end:[], start:[]},
        ]*/
      //visited[init]
    //}
    
    return response
}

function DFS(index, visited, treeWays, cant,source){
    if(visited[index]) return cant;
    visited[index]=true
    var total =  cant+1;
    var canEnd=true
    var canStart=true
    var nextEnd = treeWays[index].end
    for(var i=0;i<nextEnd.length;i++){
        if(nextEnd[i]==source){
            canEnd=false
        }
    }
    var nextStart = treeWays[index].start
    for(var i=0;i<nextStart.length;i++){
        if(nextStart[i]==source){
            canStart=false
        }
    }
    if(nextEnd.length==0 && nextStart.length==0){
        return total;
    }else{
        var temp=total;  
        if(canEnd){
            //console.log("end")
            for(var i=0;i<nextEnd.length;i++){
                var value = DFS(nextEnd[i],visited,treeWays,total,index)
                if(value>temp){
                    temp=value
                }
            }
        }
        if(canStart){
            //console.log("start")
            for(var i=0;i<nextStart.length;i++){
                var value = DFS(nextStart[i],visited,treeWays,total,index)
                if(value>temp){
                    temp=value
                }
            }
        }
        return temp;
       
    }
}

function ProcessLongRoad(){
    var ext = 0;
    var playerLong = '';
    for (let i = 0; i < PlayersDetails.length; i++) {
        if(ext<PlayersDetails[i].longRoad && PlayersDetails[i].longRoad>=4){
            ext=PlayersDetails[i].longRoad
            playerLong= i
        }
    }
    console.log("LONGROAD",longRoad,ext,playerLong)
    if(longRoad!=''){
        if(longRoad.dist<ext){
            if(longRoad.player!=playerLong){
                console.log("one")
                sendMessageServer({
                player: PlayersDetails[longRoad.player].name,
                action: "LongRoute",
                amount:-1
            })
            console.log("two")
            sendMessageServer({
                player: PlayersDetails[playerLong].name,
                action: "LongRoute",
                amount:1
            })
            }
            
            longRoad.dist=ext;
            longRoad.player=playerLong;
            
            console.log(longRoad)
        }
    }else{
        if(4<=ext){
            console.log("three")
            sendMessageServer({
                player: PlayersDetails[playerLong].name,
                action:"LongRoute",
                amount: 1,
            })
            longRoad={}

            longRoad.dist=ext;
            longRoad.player=playerLong;
            console.log(longRoad)
        }
    }
}

function IsPort(playerName){
    
    var player = mapPlayers[playerName]
    var ports= []
    for (let i = 0; i < PlayersDetails[player].houses.length; i++) {
        portos.map(function(item){
            if(PlayersDetails[player].houses[i].id==item.fi+'-'+item.fj){
                ports.push(item.resource)
            }
        })
    } 
    sendMessageServer({action:"PUERTO",puertos:ports, player:PlayersDetails[player].name})
}
function ExchangeOut(data){
    const { player, input , output} = data
    var newMessage = {
        player: player,
        action:'resources',
        resource:[{
            name: input,
            amount: -4,
        },{
            name: output,
            amount: 1,
        }]
    }
    PlayersDetails[mapPlayers[player]].resources[input]=PlayersDetails[mapPlayers[player]].resources[input]-4
    PlayersDetails[mapPlayers[player]].resources[output]=PlayersDetails[mapPlayers[player]].resources[output]+1
    sendMessageServer(
        newMessage
    )
    //sendMessageServer({ports, player:PlayersDetails[player].name})
}


