module.exports = ValidationClass = function(){
    this.id = 0;
};

ValidationClass.prototype.getRandomInteger = function(min ,max){
    return Math.floor(Math.random() * (max - min)) + min;
};

ValidationClass.prototype.getRandomId = function(){
    var dTime = new Date().getTime();
    var id;
    var rNum = this.getRandomInteger(1, 9);
    id = '' + rNum + '' + dTime;
    return id;
};

