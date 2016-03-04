<properties 
	pageTitle="Bridge Android WebView with native Mobile Engagement Android SDK" 
	description="Describes how to create a bridge between WebView running Javascript and the native Mobile Engagement Android SDK"		
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="erikre" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-android" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="02/25/2016" 
	ms.author="piyushjo" />

#Bridge Android WebView with native Mobile Engagement Android SDK

> [AZURE.SELECTOR]
- [Android Bridge](mobile-engagement-bridge-webview-native-android.md)
- [iOS Bridge](mobile-engagement-bridge-webview-native-ios.md)

Some mobile apps are designed as a hybrid app where the app itself is developed using native Android development but some or even all of the screens are rendered within an Android WebView. You can still consume Mobile Engagement Android SDK within such apps and this tutorial describes how to go about doing this. 
The sample code below is based on the Android documentation [here](https://developer.android.com/guide/webapps/webview.html#BindingJavaScript). It describes how this documented approach could be used to implement the same for Mobile Engagement Android SDK's commonly used methods such that a Webview from a hybrid app can also initiate requests to track events, jobs, errors, app-info while piping them via our Android SDK. 

1. First of all, you need to ensure that you have gone through our [Getting Started tutorial](mobile-engagement-android-get-started.md) to integrate the Mobile Engagement Android SDK in your hybrid app. Once you do that, your `OnCreate` method will look like the following.  
    
		@Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        setContentView(R.layout.activity_main);
	
	        EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
	        engagementConfiguration.setConnectionString("<Mobile Engagement Conn String>");
	        EngagementAgent.getInstance(this).init(engagementConfiguration);
	    }

2. Now make sure that your hybrid app has a screen with a WebView on it. The code for it will be similar to the following where we are loading a local HTML file **Sample.html** in the Webview in the 
`onCreate` method of your screen. 

	    private void SetWebView() {
	        WebView myWebView = (WebView) findViewById(R.id.webview);
	        myWebView.loadUrl("file:///android_asset/Sample.html");
		}

		protected void onCreate(Bundle savedInstanceState) {
			...
			...
			SetWebView();
	    }

3. Now create a bridge file called **WebAppInterface** which creates a wrapper over some commonly used Mobile Engagement Android SDK methods using the `@JavascriptInterface` approach described in the [Android documentation](https://developer.android.com/guide/webapps/webview.html#BindingJavaScript):

		import android.content.Context;
		import android.os.Bundle;
		import android.util.Log;
		import android.webkit.JavascriptInterface;
		
		import com.microsoft.azure.engagement.EngagementAgent;
		
		import org.json.JSONArray;
		import org.json.JSONObject;
		
		public class WebAppInterface {
		    Context mContext;
		
		    /** Instantiate the interface and set the context */
		    WebAppInterface(Context c) {
		        mContext = c;
		    }
		
		    @JavascriptInterface
		    public void sendEngagementEvent(String name, String extras ){
		        EngagementAgent.getInstance(mContext).sendEvent(name, ParseExtras(extras));
		    }
		
		    @JavascriptInterface
		    public void startEngagementJob(String name, String extras ){
		        EngagementAgent.getInstance(mContext).startJob(name, ParseExtras(extras));
		    }
		
		    @JavascriptInterface
		    public void endEngagementJob(String name){
		        EngagementAgent.getInstance(mContext).endJob(name);
		    }
		
		    @JavascriptInterface
		    public void sendEngagementError(String name, String extras ){
		        EngagementAgent.getInstance(mContext).sendError(name, ParseExtras(extras));
		    }
		
		    @JavascriptInterface
		    public void sendEngagementAppInfo(String appInfo){
		        EngagementAgent.getInstance(mContext).sendAppInfo(ParseExtras(appInfo));
		    }
		
		    public Bundle ParseExtras(String input) {
		        Bundle extras = new Bundle();
		
		        try {
		            JSONObject jObject = new JSONObject(input);
		            extras.putString(jObject.names().getString(0),
		                    jObject.get(jObject.names().getString(0)).toString());
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
		        return extras;
		    }
		}  

4. Once we have created the above bridge file, we need to ensure that it is associated with our Webview. For this to happen, you need to edit your `SetWebview` method so that it looks like the following:

	    private void SetWebView() {
	        WebView myWebView = (WebView) findViewById(R.id.webview);
	        myWebView.loadUrl("file:///android_asset/Sample.html");
	        WebSettings webSettings = myWebView.getSettings();
	        webSettings.setJavaScriptEnabled(true);
	        myWebView.addJavascriptInterface(new WebAppInterface(this), "EngagementJs");
	    }

5. In the above snippet, we called `addJavascriptInterface` to associate our bridge class with our Webview and also created a handle called **EngagementJs** to call the methods from the bridge file. 

6. Now create the following file called **Sample.html** in your project in a folder called **assets** which is loaded into the Webview and where we will call the methods from the bridge file.

		<!doctype html>
		<html>
		    <head>
		        <style type='text/css'>
		            html { font-family:Helvetica; color:#222; }
		            h1 { color:steelblue; font-size:22px; margin-top:16px; }
		            h2 { color:grey; font-size:14px; margin-top:18px; margin-bottom:0px; }
		        </style>
		
		        <script type="text/javascript">
		
		            window.onerror = function(err)
		            {
		              log('window.onerror: ' + err);
		            }
		
		            send = function(inputId)
		            {
		                var input = document.getElementById(inputId);
		                if(input)
		                {
		                    var value = input.value;
		                    // Example of how extras info can be passed with the Engagement logs
		                    var extras = '{"CustomerId":"MS290011"}';
		
		                    if(value && value.length > 0)
		                    {
		                        switch(inputId)
		                        {
		                            case "event":
		                            EngagementJs.sendEngagementEvent(value, extras);
		                            break;
		
		                            case "job":
		                            EngagementJs.startEngagementJob(value, extras);
		                            window.setTimeout( function()
		                            {
		                              EngagementJs.endEngagementJob(value);
		                            }, 10000 );
		                            break;
		
		                            case "error":
		                            EngagementJs.sendEngagementError(value, extras);
		                            break;
		
		                            case "appInfo":
		                            EngagementJs.sendEngagementAppInfo({"customer_name":value});
		                            break;
		                        }
		                    }
		                }
		            }
		        </script>
		    </head>
		    <body>
		        <h1>Bridge Tester</h1>
		        <div id='engagement'>
		            <h2>Event</h2>
		            <input type="text" id="event" size="35">
		            <button onclick="send('event')">Send</button>
		
		            <h2>Job</h2>
		            <input type="text" id="job" size="35">
		            <button onclick="send('job')">Send</button>
		
		            <h2>Error</h2>
		            <input type="text" id="error" size="35">
		            <button onclick="send('error')">Send</button>
		
		            <h2>AppInfo</h2>
		            <input type="text" id="appInfo" size="35">
		            <button onclick="send('appInfo')">Send</button>
		        </div>
		    </body>
		</html>

8. Note the following points about the HTML file above:

	- 	It contains a set of input boxes where you can provide data to be used as names for your Event, Job, Error, AppInfo. When you click on the button next to it, a call is made to the Javascript which eventually calls the methods from the bridge file to pass this call to the Mobile Engagement Android SDK. 
	- 	We are tagging on some static extra info to the events, jobs and even errors to demonstrate how this could be done. This extra info is sent as a JSON string which, if you look in the `WebAppInterface` file, is parsed and put in an Android `Bundle` and is passed along with sending Events, Jobs, Errors. 
	- 	A Mobile Engagement Job is kicked off with the name you specify in the input box, run for 10 seconds and shut down. 
	- 	A Mobile Engagement appinfo or tag is passed with 'customer_name' as the static key and the value that you entered in the input as the value for the tag. 
 
9. Run the app and you will see the following. Now provide some name for a test event like the following and click **Send** below it. 

	![][1]

10. Now if you go to the **Monitor** tab of your app and look under **Events -> Details**, you will see this event show up along with the static app-info that we are sending. 

	![][2]

<!-- Images. -->
[1]: ./media/mobile-engagement-bridge-webview-native-android/sending-event.png
[2]: ./media/mobile-engagement-bridge-webview-native-android/event-output.png