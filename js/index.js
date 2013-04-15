/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
 	var o = JSON.parse(channels);
	var channelLive=false;
	
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
   //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        //app.receivedEvent('deviceready');
		detectSTB();
			if (stbBaseUrl) {
			
				$('#debug').append("<a href='"+stbBaseUrl+"/remoteControl/cmd?operation=10'>STB</a>");
				$.ajax({
					  url:stbBaseUrl+"/remoteControl/cmd?operation=10",
					  dataType: 'json',
					  cache:"false",
					  async: false,
					  statusCode: {
						200:function(data){
							if(data.result.data.osdContext=="LIVE")
								channelLive = data.result.data.playedMediaId;
							$('#debug').append(data.result.data.osdContext+" "+data.result.data.playedMediaId);
							
						}
					  }
				});	
			}
	
			$.ajax({
			  url:"http://rendezvous.griotte.com/mp/kelziktv/?format=json",
			  dataType: 'json',
			  cache:"false",
			  statusCode: {
				200:function(data){
					console.log(channelLive);
					showResults(data);
				}
			  }
			});
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
		navigator.splashscreen.hide();
    },
	
	showResults: function(progs){

		var tmpSTR2 = "<ul>";

		for(item in progs){
			console.log(channelLive);

			if(progs[item].channelId==channelLive)
				tmpSTR2 += "<li class='ui-li ui-li-live'>";
			else
				tmpSTR2 += "<li class='ui-li ui-li-hr'>";
	
			if(o[progs[item].channelId]!=undefined)
				tmpSTR2 += "<img class='ui-li-thumb' src='images/CACHE_CHANNELS/90x90_"+o[progs[item].channelId].image+"'>";
			else
				tmpSTR2 += "<img class='ui-li-thumb' src=''>";
			tmpSTR2 += "<div class='deezerlinks'>";
						tmpSTR2 += "<span class='node-text-title'>"+progs[item].title+" </span><span class='nodes node-category'>("+progs[item].category+")</span>";
			
			tmpSTR2 += "<ul class='node-deezer'>";
			
			if(progs[item].artists!=undefined){
				tmpSTR2 += "<div><span class='node-text-artists'>Musique par "+progs[item].artists+"</span></div>";
			}
			tmpSTR2 += "<ul class='node-deezer'>";
			
			if(progs[item].artists!=undefined){
				
				for(compositor in progs[item].artist){
					tmpSTR2 += "<li class='node-deezer-artist'> <a target='_blank' href='www://www.deezer.com/artist/"+progs[item].artist[compositor].idDZ+"'>"+progs[item].artist[compositor].nameDZ+"</a></li>";
				}
			}
			
			if(progs[item].album!=undefined)
				tmpSTR2 += "<li class='node-deezer-album'><a target='_blank' href='www://www.deezer.com/album/"+progs[item].album[0].idDZ+"'>"+progs[item].album[0].titleDZ+"</a></li>";

			if(progs[item].playlist!=undefined)
				tmpSTR2 += "<li class='node-deezer-playlist'><a target='_blank' href='"+progs[item].playlist[0].urlDZ+"'>"+progs[item].playlist[0].titleDZ+"</a></li>";
			
			if(progs[item].clip!=undefined){
				for(clip in progs[item].clip){
					tmpSTR2 += "<li class='node-dm-artist'> <a target='_blank' href='http://www.dailymotion.com/video/"+progs[item].clip[clip].id+"'>"+progs[item].clip[clip].title+"</a></li>";
				}
			}
			
			tmpSTR2 +="</ul>";
			tmpSTR2 +="</div>";
			tmpSTR2 +="</li>";
			
		}	
		tmpSTR2 += "</ul>";
		$('#content').append(tmpSTR2);
	},
};
