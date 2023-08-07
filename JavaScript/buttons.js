function register() {
    const registerDiv = document.getElementById("register");
    registerDiv.style.zIndex = 50;
    registerDiv.style.opacity = 1;
    const overlay = document.querySelector(".overlay");
    overlay.style.opacity = 1;
}

function login() {
    const registerDiv = document.getElementById("login");
    registerDiv.style.zIndex = 50;
    registerDiv.style.opacity = 1;
    const overlay = document.querySelector(".overlay");
    overlay.style.opacity = 1;
}

function close_login() {
    const registerDiv = document.getElementById("login");
    registerDiv.style.opacity = 0;
    registerDiv.style.zIndex = 0;
    const overlay = document.querySelector(".overlay");
    overlay.style.opacity = 0;
    document.getElementById("login_input_username").value = "";
    document.getElementById("login_input_password").value = "";
}

function close_register() {
    const registerDiv = document.getElementById("register");
    registerDiv.style.opacity = 0;
    registerDiv.style.zIndex = 0;
    const overlay = document.querySelector(".overlay");
    overlay.style.opacity = 0;
    document.getElementById("register_input_username").value = "";
    document.getElementById("register_input_password").value = "";
}

function login_input() {
    $.ajax({
        method: "POST",
        url: 'DB.base.php',
        data: {
            username: $('#login_input_username').val(),
            password: $('#login_input_password').val(),
            fuggveny: "login",
        },
        success: function(status = 1) {
            alert(phpfunc());
            close_login();
        }
    });
}

function register_input() {
    $.ajax({
        method: "POST",
        url: 'DB.base.php',
        data: {
            username: $('#register_input_username').val(),
            password: $('#register_input_password').val(),
            fuggveny: "register",
        },
        success: function() {
            close_register();
        }
    });
}