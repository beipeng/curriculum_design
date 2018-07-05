var signal; 	
var isFirstTime = true;		

var Controls = {
	getTime: function() {
		var sDate = new Date();
		return player.getCurrentTime()*1000;
	},

	startPlayback: function() {
		if( !Viewer.isPaused ) {
       	         	Viewer.startTime = Controls.getTime();

			// Run the first time
			Viewer.load();
			// Setup a callback for future runs
			Viewer.refreshID = setInterval( function() { Viewer.refresh(); }, Viewer.refreshInterval);
		}
		else {
			Viewer.pauseTime += Controls.getTime() - Viewer.startCurPauseTime;
		}

		Viewer.isPaused = false;
	},

	pausePlayback: function() {
		//
		if( !Viewer.isPaused ) {
			Viewer.startCurPauseTime = Controls.getTime();
			Viewer.isPaused = true;
		}
	},

	stopPlayback: function() {
		// 
		$('#transcript').text("");
		clearInterval(Viewer.refreshID);

		Viewer.words = new Array();
		Viewer.nextIdx = 0;
		Viewer.startTime = 0;
		Viewer.lastTime = 0;
		Viewer.refreshID = 0;

		Viewer.pauseTime = 0;
		Viewer.startCurPauseTime = 0;
		Viewer.isPaused = false;
		Viewer.isDone = false;
	},

	vidIsPlaying: false,
	holdingIdx: -1,

	pauseMode: false,
	holdMode: false
}


$(document).ready( function() {
   // $('#vidCover').click( function() {
//    		alert("click play");
//    		//Controls.startPlayback();
//         //Controls.vidIsPlaying = true;     		
//             	
//    });  
});

