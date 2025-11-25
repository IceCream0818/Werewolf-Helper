var cList = ["狼人", "平民", "预言家", 
"守卫",'女巫', "猎人","白痴", 
"骑士", "白狼王","羊驼","河豚","熊","子狐","狼美人"];

var modeList = ["自定义","新手6人局","经典9人局", '7猎',
"8人骑士局", "7人生还者", "10人动物梦境"];

setProperty("characterChoice", "options", cList);
setProperty("modeChoice", "options", modeList);

var modeCharacters = [
  [cList[0],cList[0],cList[1],cList[1],cList[2],cList[3]],
  [cList[0],cList[0],cList[0],cList[1],cList[1],cList[1],cList[2],cList[5],cList[4]],
  [cList[0],cList[0],cList[0],cList[5],cList[5],cList[5],cList[5],cList[5],cList[5],cList[5]],
  [cList[0],cList[0],cList[0],cList[1],cList[1],cList[2],cList[3],cList[7]],
  [cList[0],cList[8],cList[1],cList[2],cList[3],cList[4],cList[5]],
  [cList[0],cList[0],cList[13],cList[9],cList[9],cList[9],cList[9],cList[11],cList[10],cList[12]]
];

var playerCount = 0;
var addedCharacters = [];
var gameCharacter = [];
var fakes = [];
var probability = 0.25;

onEvent ("addButton", "click", function(){
  if(getText("customCharacterInput")!=""){
    appendItem(addedCharacters,getText("customCharacterInput"));
  }
  else{  
    if (getProperty("modeChoice","index")!=0){
      setProperty("noCustomWarn", "text", "只能在自定义\n添加角色");
      setProperty("noCustomWarn", "hidden", false);
      return;
    }
    if (playerCount >= 16){
      setProperty("noCustomWarn", "hidden", false);
      setProperty("noCustomWarn", "text", "玩家数量过多");
      return;
    }
    appendItem(addedCharacters, cList[getProperty("characterChoice", "index")]);
  } 
  updateCharacter();
  setProperty("noCustomWarn", "hidden", true);
});

onEvent("removeButton", "click", function(){
//  if (checkDuplicateTimes(addedCharacters, cList[getProperty("characterChoice", "index")])>0){
//    var j = findItem(addedCharacters, getProperty("characterChoice", "text"));

//  }

  if(addedCharacters.length>0){  
    removeItem(addedCharacters, -1);
    updateCharacter();
  }
});

onEvent ("clearButton", "click", function(){
  setProperty("noCustomWarn", "hidden", true);
  playerCount = 0;
  addedCharacters = [];
  setProperty("modeChoice", "index", 0);
  updateCharacter();
});

onEvent("modeChoice", "change", function(){
  if(getProperty("modeChoice","index")==0){
    updateCharacter();
  }
  else{
    addedCharacters = copyList(modeCharacters[getProperty("modeChoice","index")-1]);
    playerCount = addedCharacters.length;
    updateCharacter();
  }
});

onEvent("startButton", "click", function(){
  if (playerCount < 3){
    setProperty("playerCountWarn", "hidden", false);
    return;
  }
  var selections = [];
  for(var i = 0; i<addedCharacters.length; i++){
    appendItem(selections, "玩家 " + (i+1));
  }
  setProperty("playerSelection","options", selections);
  
  gameCharacter = randomizeCharacters(addedCharacters);
  
  if(getProperty("toggleFakeCharacter", "checked")){
    fakes = [];
    for(var j = 0; j<addedCharacters.length; j++){
      if (Math.random() < probability) {
        appendItem(fakes, true);
      }
      else {
        appendItem(fakes, false);
      }
    }
  }
  
  updateRefText(gameCharacter);
  
  setScreen("gameScreen");
});

onEvent("showButton","click",function(){
  setText("character", gameCharacter[getProperty("playerSelection","index")]);
});

onEvent("hideButton", "click", function(){
  setText("character","");
});

onEvent("newGame", "click", function(){
  setScreen("settings");
  gameCharacter = [];
  setText("orderText",'');
  setText("character","");
});

onEvent("refButton", "click", function(){
  setScreen("refScreen");
});

onEvent("backButton", "click", function(){
  setScreen("gameScreen");
});

onEvent("orderButton",'click',function(){
  var direction;
  if(randomNumber(1,2)==1){
    direction = "顺时针";
  }
  else{
    direction = "逆时针";
  }
  setText('orderText', randomNumber(1, playerCount)+"号 "+direction);
});

function updateCharacter(){
  var filteredCharacters = [];
  removeDuplicate(addedCharacters, filteredCharacters);
  var text = "";
  for (var i = 0; i<filteredCharacters.length; i++){
    text += filteredCharacters[i] + " x " +
    checkDuplicateTimes(addedCharacters, filteredCharacters[i]) + "\n";
  }
  
  playerCount = addedCharacters.length;
  
  setText("addedCharacters", text);
  setProperty("playerCountDisplay", "text", playerCount + " 个玩家");
  setProperty("playerCountWarn", "hidden", true);
}

function randomizeCharacters(list){
  var temp = copyList(list);
  var New = [];
  for (var i = 0; i < list.length; i++){
    var random = randomNumber(0, temp.length-1);
    appendItem(New, temp[random]);
    removeItem(temp, random);
  }
  return (New);
}

function checkDuplicateTimes(list, item){
  var times = 0;
  for (var i = 0; i<list.length; i++){
    if(list[i]==item){
      times++;
    }
  }
  return times;
}

function updateRefText(characterList){
  var text = "";
  for (var i = 0; i<characterList.length; i++){
    text += "玩家 " + (i+1) + ": " + characterList[i];
    if (fakes[i]){
      text += " (假)";
    }
    text += "\n";
  }
  setText("refText", text);
}

//function findItem(list, item){
//  for(var i = 0; i<list.length; i++){
//    if(list[i]==item){
//      return i;
//    }
//  }
//}

//https://builtin.com/software-engineering-perspectives/remove-duplicates-from-array-javascript
function removeDuplicate(list, newList){
  for (var i = 0; i<list.length; i++){
    if(newList.indexOf(list[i]) < 0){
      appendItem(newList, list[i]);
    }
  }
}

//https://www.freecodecamp.org/news/how-to-clone-an-array-in-javascript-1d3183468f6a/
function copyList(list){
  var newList = [];
  for (var i = 0; i<list.length; i++){
    appendItem(newList, list[i]);
  }
  return(newList);
}
