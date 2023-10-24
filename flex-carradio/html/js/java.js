var mutedstate = false;
var issongpaused = false;

window.addEventListener('message', function(event) {
    const data = event.data;
    if (data.type == 'open'){
        mutedstate = data.mutestate
        $("#container").fadeIn(350);
        $("#page1").fadeIn(1250);
        $("#page2").fadeOut(0);
        $("#page3").fadeOut(0);
        loadsongs(data.channels, data.vehicle);
        playsong(data.vehicle);
        pausesong(data.vehicle);
        stopsong(data.vehicle);
        mutetoggle(data.vehicle);
        muteimage();
        mutebtn(data.vehicle);
        changevolume(data.vehicle);
        playpause(data.vehicle);
        navbar();
        setactive(2);
        if(data.currentsong != null) {
            if(data.currentsong.includes("https://www.youtube.com/watch?v=")) {
                var CurrentLink = data.currentsong.replace('https://www.youtube.com/watch?v=', '');
                localStorage.setItem("CurrentLink", CurrentLink);
                settitle();
            }
        }
    } else if (data.type == 'mutestate'){
        mutedstate = data.mutestate
        mutetoggle(data.vehicle);
        muteimage();
        setactive(2);
    }
});

function navbar() {
    var btn1 = document.querySelector('#btn1');
    var btn2 = document.querySelector('#btn2');
    var btn3 = document.querySelector('#btn3');
    var btn4 = document.querySelector('#btn4');
    var d1 = document.querySelector('#dot1');
    var d2 = document.querySelector('#dot2');
    var d3 = document.querySelector('#dot3');
    var p1 = document.querySelector('#page1');
    var p2 = document.querySelector('#page2');
    var p3 = document.querySelector('#page3');
    if(btn1 != null && btn2 != null && btn3 != null && btn4 != null && d1 != null && d2 != null && d3 != null) {
        btn1.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            p1.style.display = 'none';
            p2.style.display = 'none';
            $("#page3").fadeIn(1250);
            setactive(1);
        });

        btn2.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            $("#page1").fadeIn(1250);
            p2.style.display = 'none';
            p3.style.display = 'none';
            setactive(2);
        });

        btn3.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            p1.style.display = 'none';
            $("#page2").fadeIn(1250);
            p3.style.display = 'none';
            setactive(3);
        });

        d1.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            $("#page1").fadeIn(1250);
            p2.style.display = 'none';
            p3.style.display = 'none';
            setactive(2);
        });

        d2.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            p1.style.display = 'none';
            $("#page2").fadeIn(1250);
            p3.style.display = 'none';
            setactive(3);
        });

        d3.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            p1.style.display = 'none';
            p2.style.display = 'none';
            $("#page3").fadeIn(1250);
            setactive(1);
        });
    }
}

function changevolume(veh) {
    var down = document.querySelector('#s1');
    var up = document.querySelector('#s2');
    if(down != null || up != null) {
        down.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            $.post("https://flex-carradio/SetVolume", JSON.stringify({
                vehicle : veh,
                state : 'down',
            }));
        });

        up.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            $.post("https://flex-carradio/SetVolume", JSON.stringify({
                vehicle : veh,
                state : 'up',
            }));
        });
    }
}

function playpause(veh) {
    var play = document.querySelector('#s4');
    var pause = document.querySelector('#s5');
    if(play != null || pause != null) {
        play.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            $.post("https://flex-carradio/PlayPause", JSON.stringify({
                vehicle : veh,
                state : 'resume',
            }));
            issongpaused = false;
        });

        pause.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            $.post("https://flex-carradio/PlayPause", JSON.stringify({
                vehicle : veh,
                state : 'pause',
            }));
            issongpaused = true;
        });
    }
}

function setactive(state) {
    var d1 = document.querySelector('#dot1');
    var d2 = document.querySelector('#dot2');
    var d3 = document.querySelector('#dot3');
    if(d1 != null && d2 != null && d3 != null){
        if(state === 1) {
            d1.classList.add('noactive');
            d1.classList.remove('active');
            d2.classList.add('noactive');
            d2.classList.remove('active');
            d3.classList.add('active');
            d3.classList.remove('noactive');
        } else if(state === 2){
            d1.classList.add('active');
            d1.classList.remove('noactive');
            d2.classList.add('noactive');
            d2.classList.remove('active');
            d3.classList.add('noactive');
            d3.classList.remove('active');
        } else if(state === 3){
            d1.classList.add('noactive');
            d1.classList.remove('active');
            d2.classList.add('active');
            d2.classList.remove('noactive');
            d3.classList.add('noactive');
            d3.classList.remove('active');
        }
    }
}

function playsong(veh) {
    var play = document.querySelector('#play');
    if(play != null) {
        play.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            var input = document.querySelector('#youtube input');
            var title = document.querySelector('#youtube #title');
            if (input.value.includes("https://www.youtube.com/watch?v=")) {
                var CurrentLink = input.value.replace('https://www.youtube.com/watch?v=', '');
                localStorage.setItem("CurrentLink", CurrentLink);
    
                fetch(`https://noembed.com/embed?dataType=json&url=${input.value}`)
                .then(res => res.json())
                .then(data => title.innerHTML = data.title);

                $.post("https://flex-carradio/PlaySong", JSON.stringify({
                    vehicle : veh,
                    url : input.value,
                    volume : 0.2,
                    loop : false,
                }));
            } else {
                $.post("https://flex-carradio/PlaySong", JSON.stringify({
                    vehicle : veh,
                    url : input.value,
                    volume : 0.2,
                    loop : false,
                }));
                title.innerHTML = 'Streamed song';
            }
        });

    }
}

function playsongsaved(veh) {
    fetch(`https://noembed.com/embed?dataType=json&url=${"https://www.youtube.com/watch?v="+localStorage.getItem("CurrentLink")}`)
    .then(res => res.json())
    .then(data => title.innerHTML = data.title);

    $.post("https://flex-carradio/PlaySong", JSON.stringify({
        vehicle : veh,
        url : "https://www.youtube.com/watch?v="+localStorage.getItem("CurrentLink"),
        volume : 0.2,
        loop : false,
    }));
}

function pausesong(veh) {
    var pause = document.querySelector('#pause');
    if(pause != null) {
        pause.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            if(issongpaused){
                issongpaused = false;
                $.post("https://flex-carradio/PlayPause", JSON.stringify({
                    vehicle : veh,
                    state : 'resume',
                }));
            } else {
                issongpaused = true;
                $.post("https://flex-carradio/PlayPause", JSON.stringify({
                vehicle : veh,
                state : 'pause',
            }));
            }
        });
    }
}

function stopsong(veh) {
    var stop = document.querySelector('#stop');
    var title = document.querySelector('#youtube #title');
    if(stop != null) {
        stop.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            title.innerHTML = 'NO SONG CURRENTLY PLAYING';
            localStorage.setItem("CurrentLink", null);
            $.post("https://flex-carradio/StopSound", JSON.stringify({
                vehicle : veh,
            }));
        });
    }
    var stopp = document.querySelector('#s6');
    if(stopp != null) {
        stopp.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            localStorage.setItem("CurrentLink", null);
            $.post("https://flex-carradio/StopSound", JSON.stringify({
                vehicle : veh,
            }));
        });
    }
}

function mutebtn(veh) {
    var mbtn = document.querySelector('#s3');
    if(mbtn != null) {
        mbtn.addEventListener("click", (e) => {
            if (e.detail === 1) {
                e.stopImmediatePropagation();
                $.post("https://flex-carradio/MuteState", JSON.stringify({vehicle : veh, mutestate : !mutedstate}));
                muteimage();
            }
        });
    }
}

function muteimage() {
    var mute = document.querySelector('#btn4');
    if(!mutedstate){
        mute.style.backgroundImage = 'url(img/SoundUp.png)';
    } else {
        mute.style.backgroundImage = 'url(img/NoSound.png)';
    }
}

function mutetoggle(veh) {
    var mute = document.querySelector('#btn4');
    if(mute != null) {
        mute.addEventListener("click", (e) => {
            if (e.detail === 1) {
                e.stopImmediatePropagation();
                $.post("https://flex-carradio/MuteState", JSON.stringify({vehicle : veh, mutestate : !mutedstate}));
                muteimage();
            }
        });
    }
}

function settitle() {
    var titel = document.querySelector('#youtube #title');
    if(titel != null) {
        if(localStorage.getItem("CurrentLink") === 'null') {
            titel.innerHTML = 'NO SONG CURRENTLY PLAYING';
        } else {
            var t = null;
            fetch(`https://noembed.com/embed?dataType=json&url=${'https://www.youtube.com/watch?v='+localStorage.getItem("CurrentLink")}`)
            .then(res => res.json())
            .then(data => 
                titel.innerHTML = data.title
            );
        }
    }
}

function loadsongs(channels, veh) {
    var song1 = document.querySelector('#song1');
    if(song1 != null) {
        if(channels[0].canchange) {
            song1.addEventListener("dblclick", (e) => {
                song1.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("CurrentLink")+'/sddefault.jpg)';
                localStorage.setItem("song1", localStorage.getItem("CurrentLink"));
            });
            if(localStorage.getItem("song1") != null && localStorage.getItem("song1") != ''){
                song1.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("song1")+'/sddefault.jpg)';
            }

            song1.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song1"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        } else {
            var link = channels[0].link.replace('https://www.youtube.com/watch?v=', '');
            localStorage.setItem("song1", link);
            if(localStorage.getItem("song1") != null && localStorage.getItem("song1") != ''){
                song1.style.backgroundImage = 'url(https://img.youtube.com/vi/'+link+'/sddefault.jpg)';
            }

            song1.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song1"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        }
    }

    var song2 = document.querySelector('#song2');
    if(song2 != null) {
        if(channels[1].canchange) {
            song2.addEventListener("dblclick", (e) => {
                song2.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("CurrentLink")+'/sddefault.jpg)';
                localStorage.setItem("song2", localStorage.getItem("CurrentLink"));
            });
            if(localStorage.getItem("song2") != null && localStorage.getItem("song2") != ''){
                song2.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("song2")+'/sddefault.jpg)';
            }

            song2.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song2"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        } else {
            var link = channels[1].link.replace('https://www.youtube.com/watch?v=', '');
            localStorage.setItem("song2", link);
            if(localStorage.getItem("song2") != null && localStorage.getItem("song2") != ''){
                song2.style.backgroundImage = 'url(https://img.youtube.com/vi/'+link+'/sddefault.jpg)';
            }

            song2.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song2"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        }
    }

    var song3 =  document.querySelector('#song3');
    if(song3 != null) {
        if(channels[2].canchange) {
            song3.addEventListener("dblclick", (e) => {
                song3.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("CurrentLink")+'/sddefault.jpg)';
                localStorage.setItem("song3", localStorage.getItem("CurrentLink"));
            });
            if(localStorage.getItem("song3") != null && localStorage.getItem("song3") != ''){
                song3.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("song3")+'/sddefault.jpg)';
            }

            song3.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song3"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        } else {
            var link = channels[2].link.replace('https://www.youtube.com/watch?v=', '');
            localStorage.setItem("song3", link);
            if(localStorage.getItem("song3") != null && localStorage.getItem("song3") != ''){
                song3.style.backgroundImage = 'url(https://img.youtube.com/vi/'+link+'/sddefault.jpg)';
            }

            song3.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song3"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        }
    }

    var song4 = document.querySelector('#song4');
    if(song4 != null) {
        if(channels[3].canchange) {
            song4.addEventListener("dblclick", (e) => {
                song4.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("CurrentLink")+'/sddefault.jpg)';
                localStorage.setItem("song4", localStorage.getItem("CurrentLink"));
            });
            if(localStorage.getItem("song4") != null && localStorage.getItem("song4") != ''){
                song4.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("song4")+'/sddefault.jpg)';
            }

            song4.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song4"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        } else {
            var link = channels[3].link.replace('https://www.youtube.com/watch?v=', '');
            localStorage.setItem("song4", link);
            if(localStorage.getItem("song4") != null && localStorage.getItem("song4") != ''){
                song4.style.backgroundImage = 'url(https://img.youtube.com/vi/'+link+'/sddefault.jpg)';
            }

            song4.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song4"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        }
    }

    var song5 = document.querySelector('#song5');
    if(song5 != null) {
        if(channels[4].canchange) {
            song5.addEventListener("dblclick", (e) => {
                song5.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("CurrentLink")+'/sddefault.jpg)';
                localStorage.setItem("song5", localStorage.getItem("CurrentLink"));
            });
            if(localStorage.getItem("song5") != null && localStorage.getItem("song5") != ''){
                song5.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("song5")+'/sddefault.jpg)';
            }

            song5.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song5"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        } else {
            var link = channels[4].link.replace('https://www.youtube.com/watch?v=', '');
            localStorage.setItem("song5", link);
            if(localStorage.getItem("song5") != null && localStorage.getItem("song5") != ''){
                song5.style.backgroundImage = 'url(https://img.youtube.com/vi/'+link+'/sddefault.jpg)';
            }

            song5.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song5"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        }
    }

    var song6 = document.querySelector('#song6');
    if(song6 != null) {
        if(channels[5].canchange) {
            song6.addEventListener("dblclick", (e) => {
                song6.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("CurrentLink")+'/sddefault.jpg)';
                localStorage.setItem("song6", localStorage.getItem("CurrentLink"));
            });
            if(localStorage.getItem("song6") != null && localStorage.getItem("song6") != ''){
                song6.style.backgroundImage = 'url(https://img.youtube.com/vi/'+localStorage.getItem("song6")+'/sddefault.jpg)';
            }

            song6.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song6"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        } else {
            var link = channels[5].link.replace('https://www.youtube.com/watch?v=', '');
            localStorage.setItem("song6", link);
            if(localStorage.getItem("song6") != null && localStorage.getItem("song6") != ''){
                song6.style.backgroundImage = 'url(https://img.youtube.com/vi/'+link+'/sddefault.jpg)';
            }

            song6.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                setTimeout(() => {
                    localStorage.setItem("CurrentLink", localStorage.getItem("song6"));
                    settitle();
                    playsongsaved(veh);
                }, 1000);
            });
        }
    }
}

$( function() {
    $("body").on("keydown", function (key) {
        if (key.keyCode == 27) {
            close();
        }
    });
});

function close() {
    $("#container").fadeOut(350);
    $.post("https://flex-carradio/CloseNui", JSON.stringify({}));
}