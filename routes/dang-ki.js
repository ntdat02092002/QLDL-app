const express = require('express');

const router = express.Router();

function validate() {
    var u = document.getElementById("username").value;   
    if(u== "") {
    alert("Vui lòng nhập tên!");
    return false;
    }   
    alert("Xin hãy điền đúng thông tin!")
     
    return true;
}



module.exports = router;