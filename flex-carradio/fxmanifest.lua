fx_version 'cerulean'
game 'common'
description "Flex-carradio"
version "0.0.1"

ui_page 'html/index.html'

shared_script 'config.lua'
client_script 'c_main.lua'
server_script 's_main.lua'

files {
	'html/index.html',
	'html/js/java.js',
	'html/img/*.png',
	'html/css/style.css',
}