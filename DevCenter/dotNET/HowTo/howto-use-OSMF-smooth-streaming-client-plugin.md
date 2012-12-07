# How to Use the Microsoft® Smooth Streaming Plugin for the Adobe Open Source Media Framework #

##Overview ##
Microsoft Smooth Streaming plugin for OSMF 2.0 (SS for OSMF) extends the default capabilities of “Adobe Open Source Media Framework 2.0” and adds Microsoft Smooth Streaming content playback to new and existing OSMF players. The plugin also adds Smooth Streaming playback capabilities to Strobe Media Playback (SMP).
SS for OSMF includes two versions of plugin:

- Static Smooth Streaming plugin for OSMF (.swc)

- Dynamic Smooth Streaming plugin for OSMF (.swf)

This document assumes that the reader has a general working knowledge of OSMF and OSMF plug-ins. For more information about OSMF, please see the documentation on the [official OSMF site](http://www.osmf.org/).

Smooth Streaming plugin for OSMF 2.0
Plugin supports loading and playback of on demand Smooth Streaming content. 

Supported features:

- OD Smooth Streaming (Play, Pause, Seek, Stop)
- Support for video codecs – H.264
- Support for Audio codecs – AAC
- Multiple audio language switching with OSMF built-in APIs
- Max playback quality selection with OSMF built-in APIs
- Sidecar closed captions with OSMF captions plugin
- Flash runtime 10.2 or higher.
- This version only supports OSMF 2.0.

Unsupported features:

- Live Smooth Streaming playback
- VC-1 and WMA codec
- Content protection (PlayReady)
- Text and Sparse Tracks
- Trickplay (slow motion, fast-forward, and rewind)

Known Issues:

- Playback of Smooth Streaming content with 48KHz audio tracks have issues. Flash runtime have a known issue for rendering 48KHz audio content. Because of this issue, Smooth Streaming content encoded with 48Khz settings might not work as expected. Please see: [Using Flash Player](http://forums.adobe.com/message/4483498#4483498) and [Adobe Flash Player 11.3  -  Bug 3210964](https://bugbase.adobe.com/index.cfm?event=bug&id=3210964) for more info.
- Multiple Smooth Streaming content playback on single page might cause issues. This is a known issue with OSMF.
- Playback of Stage video on Mac might cause no video. This is a known Flash runtime issue. As a workaround you can disable hardware acceleration or Stage video.

## Loading the Plugin
OSMF plugins can be loaded statically (at compile time) or dynamically (at run-time). The Smooth Streaming plugin for OSMF download includes both dynamic and static versions.

- Static loading: To load statically, a static library (SWC) file is required. Static plugins are added as a reference to the projects and merge inside the final output file at the compile time.

- Dynamic loading: To load dynamically, a precompiled (SWF) file is required. Dynamic plugins are loaded in the runtime and not included in the project output. (Compiled output) Dynamic plugins can be loaded using HTTP and FILE protocols.

For more information, see the official OSMF plugin page [here](http://osmf.org/dev/osmf/OtherPDFs/osmf_plugin_dev_guide.pdf).

###SS for OSMF Static Loading
The code snippet below shows how to load the Smooth Streaming plugin for OSMF statically and play a basic video using OSMF MediaFactory. Before including the SS OSMF code, please ensure that the project reference includes the “SmoothStreamingPlugin-vx.x-osmf-v2.0.swc” static plugin.


<pre><code>
package
{
	// import related OSMF and Flash Runtime classes.
	
	import com.microsoft.azure.media.SmoothStreamingPluginInfo;
	
	import flash.display.*;
	import org.osmf.media.*;
	import org.osmf.containers.MediaContainer;
	import org.osmf.events.MediaErrorEvent;
	import org.osmf.events.MediaFactoryEvent;
	import org.osmf.events.MediaPlayerStateChangeEvent;
	import org.osmf.layout.*;
	
	//Sets the size of the SWF
	
	[SWF(width="1024", height="768", backgroundColor='#405050', frameRate="25")]
	public class TestPlayer extends Sprite
	{        
		public var _container:MediaContainer;
		public var _mediaFactory:DefaultMediaFactory;
		private var _mediaPlayerSprite:MediaPlayerSprite;
		

		public function TestPlayer( )
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			initMediaPlayer();
		}
	
		private function initMediaPlayer():void
		{
		
			// Create the container (sprite) for managing display and layout
			_mediaPlayerSprite = new MediaPlayerSprite();    
			_mediaPlayerSprite.addEventListener(MediaErrorEvent.MEDIA_ERROR, onPlayerFailed);
			_mediaPlayerSprite.addEventListener(MediaPlayerStateChangeEvent.MEDIA_PLAYER_STATE_CHANGE, onPlayerStateChange);
			_mediaPlayerSprite.scaleMode = ScaleMode.NONE;
			_mediaPlayerSprite.width = stage.stageWidth;
			_mediaPlayerSprite.height = stage.stageHeight;
			//Adds the container to the stage
			addChild(_mediaPlayerSprite);
			
			// Create a mediafactory instance
			_mediaFactory = new DefaultMediaFactory();
			
			// Add the listeners for PLUGIN_LOADING
			_mediaFactory.addEventListener(MediaFactoryEvent.PLUGIN_LOAD,onPluginLoaded);
			_mediaFactory.addEventListener(MediaFactoryEvent.PLUGIN_LOAD_ERROR, onPluginLoadFailed );
			
			// Load the plugin class 
			loadSmoothStreamingPlugin( );  
			
		}
		
		private function loadSmoothStreamingPlugin( ):void
		{
			var pluginResource:MediaResourceBase;
			
			pluginResource = new PluginInfoResource(new SmoothStreamingPluginInfo( )); 
			_mediaFactory.loadPlugin( pluginResource ); 
		}
		
		private function onPluginLoaded( event:MediaFactoryEvent ):void
		{
			// The plugin is loaded successfully.
			// Your web server needs to host a valid crossdomain.xml file to allow plugin to download Smooth Streaming files.
			loadMediaSource("http://devplatem.vo.msecnd.net/Sintel/Sintel_H264.ism/manifest")
		}
		
		private function onPluginLoadFailed( event:MediaFactoryEvent ):void
		{
			// The plugin is failed to load ...
		}
		
		
		private function onPlayerStateChange(event:MediaPlayerStateChangeEvent) : void
		{
			var state:String;
			
			state =  event.state;
			
			switch (state)
			{
				case MediaPlayerState.LOADING: 
					
					// A new source is started to load.
					
					break;
				
				case  MediaPlayerState.READY :   
					// Add code to deal with Player Ready when it is hit the first load after a source is loaded. 
					
					break;
				
				case MediaPlayerState.BUFFERING :
					
					break;
				
				case  MediaPlayerState.PAUSED :
					break;      
				// other states ...          
			}
		}
		
		private function onPlayerFailed(event:MediaErrorEvent) : void
		{
			// Media Player is failed .           
		}
		
		private function loadMediaSource(sourceURL : String):void 
		{
			// Take an URL of SmoothStreamingSource’s manifest and add it to the page.
			
			var resource:URLResource= new URLResource( sourceURL );
			
			var element:MediaElement = _mediaFactory.createMediaElement( resource );
			_mediaPlayerSprite.scaleMode = ScaleMode.LETTERBOX;
			_mediaPlayerSprite.width = stage.stageWidth;
			_mediaPlayerSprite.height = stage.stageHeight;
			
			// Add the media element
			_mediaPlayerSprite.media = element;
		}     
	}
}
</code></pre>


###SS for OSMF Dynamic Loading

The code snippet below shows how to load te SS plugin for OSMF dynamically and play a basic video using the OSMF MediaFactory. Before including the SS OSMF code, please copy the  “SmoothStreamingPlugin-vx.x-osmf-v2.0.swf” dynamic plugin to the project folder if you want to load using FILE protocol or copy under a web server for HTTP load. 

**Note**: There is no need to include “SmoothStreamingPlugin-vx.x-osmf-v2.0.swc” in project references.

<pre><code>
package 
{
	// import related OSMF and Flash Runtime classes.
	
	import flash.display.*;
	import org.osmf.media.*;
	import org.osmf.containers.MediaContainer;
	import org.osmf.events.MediaErrorEvent;
	import org.osmf.events.MediaFactoryEvent;
	import org.osmf.events.MediaPlayerStateChangeEvent;
	import org.osmf.layout.*;
	import flash.events.Event;
	import flash.system.Capabilities;

	
	//Sets the size of the SWF
	
	[SWF(width="1024", height="768", backgroundColor='#405050', frameRate="25")]
	public class TestPlayer extends Sprite
	{        
		public var _container:MediaContainer;
		public var _mediaFactory:DefaultMediaFactory;
		private var _mediaPlayerSprite:MediaPlayerSprite;
		
		
		public function TestPlayer( )
		{
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			stage.quality = StageQuality.HIGH;
			initMediaPlayer();
		}
		
		private function initMediaPlayer():void
		{
			
			// Create the container (sprite) for managing display and layout
			_mediaPlayerSprite = new MediaPlayerSprite();    
			_mediaPlayerSprite.addEventListener(MediaErrorEvent.MEDIA_ERROR, onPlayerFailed);
			_mediaPlayerSprite.addEventListener(MediaPlayerStateChangeEvent.MEDIA_PLAYER_STATE_CHANGE, onPlayerStateChange);

			//Adds the container to the stage
			addChild(_mediaPlayerSprite);
			
			// Create a mediafactory instance
			_mediaFactory = new DefaultMediaFactory();
			
			// Add the listeners for PLUGIN_LOADING
			_mediaFactory.addEventListener(MediaFactoryEvent.PLUGIN_LOAD,onPluginLoaded);
			_mediaFactory.addEventListener(MediaFactoryEvent.PLUGIN_LOAD_ERROR, onPluginLoadFailed );
			
			// Load the plugin class 
			loadSmoothStreamingPlugin( );  
			
		}
		
		private function loadSmoothStreamingPlugin( ):void
		{
			var pluginResource:MediaResourceBase;
			var smoothStreamingPluginUrl:String;

			// Your dynamic plugin web server needs to host a valid crossdomain.xml file to allow loading plugins.

			smoothStreamingPluginUrl = "http://yourdoamin/SmoothStreamingPlugin-vx.x-osmf-v2.0.swf";
			pluginResource = new URLResource(smoothStreamingPluginUrl);
			_mediaFactory.loadPlugin( pluginResource ); 

		}
		
		private function onPluginLoaded( event:MediaFactoryEvent ):void
		{
			// The plugin is loaded successfully.

			// Your web server needs to host a valid crossdomain.xml file to allow plugin to download Smooth Streaming files.

			loadMediaSource("http://devplatem.vo.msecnd.net/Sintel/Sintel_H264.ism/manifest")
		}
		
		private function onPluginLoadFailed( event:MediaFactoryEvent ):void
		{
			// The plugin is failed to load ...
		}
		
		
		private function onPlayerStateChange(event:MediaPlayerStateChangeEvent) : void
		{
			var state:String;
			
			state =  event.state;
			
			switch (state)
			{
				case MediaPlayerState.LOADING: 
					
					// A new source is started to load.
					
					break;
				
				case  MediaPlayerState.READY :   
					// Add code to deal with Player Ready when it is hit the first load after a source is loaded. 
					
					break;
				
				case MediaPlayerState.BUFFERING :
					
					break;
				
				case  MediaPlayerState.PAUSED :
					break;      
				// other states ...          
			}
		}
		
		private function onPlayerFailed(event:MediaErrorEvent) : void
		{
			// Media Player is failed .           
		}
		
		private function loadMediaSource(sourceURL : String):void 
		{
			// Take an URL of SmoothStreamingSource’s manifest and add it to the page.
			
			var resource:URLResource= new URLResource( sourceURL );
			
			var element:MediaElement = _mediaFactory.createMediaElement( resource );
			_mediaPlayerSprite.scaleMode = ScaleMode.LETTERBOX;
			_mediaPlayerSprite.width = stage.stageWidth;
			_mediaPlayerSprite.height = stage.stageHeight;
			// Add the media element
			_mediaPlayerSprite.media = element;
		}     
		
	}
}
</code></pre>

##Strobe Media  Playback with the SS ODMF Dynamic Plugin
Smooth Streaming OSMF dynamic plugin is compatible with [Strobe Media Playback (SMP)](http://www.osmf.org/strobe_mediaplayback.html). You can use the SS OSMF plugin to add Smooth Streaming content playback to SMP. To do this, perform the following steps:

1. Copy “SmoothStreamingPlugin-vx.x-osmf-v2.0.swf” under a web server for HTTP load

2. Browse Strobe Media Playback [setup page](http://www.osmf.org/strobe_mediaplayback.html). 
3. Set the src to a Smooth Streaming source, (for example, http://devplatem.vo.msecnd.net/Sintel/Sintel_H264.ism/manifest  make the desired configuration changes and click “Preview and Update” (Your content web server needs a valid crossdomain.xml )
4. Copy the preview code and paste the code to a simple HTML page using your favorite text editor.

`
<html>
<body>
<object width="920" height="640"> 
<param name="movie" value="http://osmf.org/dev/2.0gm/StrobeMediaPlayback.swf"></param>
<param name="flashvars" value="src=http://devplatem.vo.msecnd.net/Sintel/Sintel_H264.ism/manifest &autoPlay=true"></param>
<param name="allowFullScreen" value="true"></param>
<param name="allowscriptaccess" value="always"></param>
<param name="wmode" value="direct"></param>
<embed src="http://osmf.org/dev/2.0gm/StrobeMediaPlayback.swf" 
    type="application/x-shockwave-flash" 
    allowscriptaccess="always" 
    allowfullscreen="true" 
    wmode="direct" 
    width="920" 
    height="640" 
    flashvars=" src=http://devplatem.vo.msecnd.net/Sintel/Sintel_H264.ism/manifest&autoPlay=true"></embed>
</object>
</body>
</html>
`

5. Add Smooth Streaming OSMF plugin to the embed code and save.

`
<html>
<object width="920" height="640"> 
<param name="movie" value="http://osmf.org/dev/2.0gm/StrobeMediaPlayback.swf"></param>
<param name="flashvars" value="src=http://devplatem.vo.msecnd.net/Sintel/Sintel_H264.ism/manifest&autoPlay=true&plugin_SmoothStreamingPlugin=http://yourdoamin/SmoothStreamingPlugin-vx.x-osmf-v2.0.swf&SmoothStreamingPlugin_retryLive=true&SmoothStreamingPlugin_retryInterval=10"></param>
<param name="allowFullScreen" value="true"></param>
<param name="allowscriptaccess" value="always"></param>
<param name="wmode" value="direct"></param>
<embed src="http://osmf.org/dev/2.0gm/StrobeMediaPlayback.swf" 
    type="application/x-shockwave-flash" 
    allowscriptaccess="always" 
    allowfullscreen="true" 
    wmode="direct" 
    width="920" 
    height="640" 
    flashvars="src=http://devplatem.vo.msecnd.net/Sintel/Sintel_H264.ism/manifest&autoPlay=true&plugin_SmoothStreamingPlugin=http://yourdoamin/SmoothStreamingPlugin-vx.x-osmf-v2.0.swf&SmoothStreamingPlugin_retryLive=true&SmoothStreamingPlugin_retryInterval=10"></embed>
</object>
</html>
`

6. Save your HTML page and publish to a web server. Browse the published web page using your favorite Flash runtime enabled internet browser (eg. IE, Chrome, Firefox, so on).

Enjoy Smooth Streaming content inside Adobe Flash runtime.

For more information on general OSMF development, please see official the [OSMF development page](http://www.osmf.org/developers.html).
