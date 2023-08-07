<?php

    //----Check which function to call---- 
    //Ha sok fuggvenyt kéne meghívni így érdemes lehet átírni
    //a POST-ot számra és swichel vizsgálni, hogy megyiket kell meghívni

    if($_POST['fuggveny'] === "register" || $_POST['fuggveny'] === "login" ){
        registerOrLogin();
    }

    function registerOrLogin(){
        $servername = "localhost";
        $dbusername = "root";
        $dbpassword = "";
        $dbname = "sitequest";

        $db = new mysqli($servername, $dbusername, $dbpassword, $dbname);

        $username = $_POST["username"];
        $password = $_POST["password"];

        if($_POST['fuggveny'] === "register"){
            $sql = "INSERT INTO users (username, password, authority) VALUES ('$username', '$password', 1)"; 
            $db->query($sql);   
        }
        if($_POST['fuggveny'] === "login"){
            $sql = "SELECT username, password FROM users";
            $dates = $db->query($sql);
            foreach($dates as $row) {
                if($row['username'] === $username){
                    if($row['password'] ===  $password){
                        $status = 1;
                    }else{
                        $status = 2;
                    }
                    return;
                }
            }
            $status = 3;
        }

        $db->close();
        
        function phpfunc() {
            return 1;
        }
    }
    /*function popup($text){
        echo '<script>
        const registerDiv = document.querySelector(".popup");
        registerDiv.style.zIndex = 50;
        registerDiv.style.opacity = 1;
        </script>';     
    }*/
?>