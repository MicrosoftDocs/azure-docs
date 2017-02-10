---
title: Bridge iOS WebView with native Mobile Engagement iOS SDK
description: Describes how to create a bridge between WebView running Javascript and the native Mobile Engagement iOS SDK
services: mobile-engagement
documentationcenter: mobile
author: piyushjo
manager: erikre
editor: ''

ms.assetid: e1d6ff6f-cd67-4131-96eb-c3d6318de752
ms.service: mobile-engagement
ms.workload: mobile
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: article
ms.date: 08/19/2016
ms.author: piyushjo

---
# Bridge iOS WebView with native Mobile Engagement iOS SDK
> [!div class="op_single_selector"]
> * [Android Bridge](mobile-engagement-bridge-webview-native-android.md)
> * [iOS Bridge](mobile-engagement-bridge-webview-native-ios.md)
> 
> 

Some mobile apps are designed as a hybrid app where the app itself is developed using native iOS Objective-C development but some or even all of the screens are rendered within an iOS WebView. You can still consume Mobile Engagement iOS SDK within such apps and this tutorial describes how to go about doing this. 

There are two approaches to achieve this though both are undocumented:

* First one is described on this [link](http://stackoverflow.com/questions/9826792/how-to-invoke-objective-c-method-from-javascript-and-send-back-data-to-javascrip) which involves registering a `UIWebViewDelegate` on your web view and catch-and-immediatly-cancel a location change done in Javascript. 
* Second one is based on this [WWDC 2013 session](https://developer.apple.com/videos/play/wwdc2013/615), an approach which is cleaner than the first and which we will follow for this guide. Note that this approach only works on iOS7 and above. 

Follow the steps below for the iOS bridge sample:

1. First of all, you need to ensure that you have gone through our [Getting Started tutorial](mobile-engagement-ios-get-started.md) to integrate the Mobile Engagement iOS SDK in your hybrid app. Optionally, you can also enable test logging as follows so that you can see the SDK methods as we trigger them from the webview. 
   
        - (BOOL)application:(UIApplication ​*)application didFinishLaunchingWithOptions:(NSDictionary *​)launchOptions {
           ....
             [EngagementAgent setTestLogEnabled:YES];
           ....
        }
2. Now make sure that your hybrid app has a screen with a webview on it. You can add it to the `Main.storyboard` of the app. 
3. Associate this webview with your **ViewController** by clicking and dragging the webview from the View Controller Scene to the `ViewController.h` edit screen, placing it just below the `@interface` line. 
4. Once you do this, a dialog box will pop up asking for a name. Provide the name as **webView**. Your `ViewController.h` file should look like the following:
   
        #import <UIKit/UIKit.h>
        #import "EngagementViewController.h"
   
        @interface ViewController : EngagementViewController
        @property (strong, nonatomic) IBOutlet UIWebView *webView;
   
        @end
5. We will update the `ViewController.m` file later but first we will create the bridge file which creates a wrapper over some commonly used Mobile Engagement iOS SDK methods. Create a new header file called **EngagementJsExports.h** which uses the `JSExport` mechanism described in the aforementioned [session](https://developer.apple.com/videos/play/wwdc2013/615) to expose the native iOS methods. 
   
        #import <Foundation/Foundation.h>
        #import <JavaScriptCore/JavascriptCore.h>
   
        @protocol EngagementJsExports <JSExport>
   
        + (void) sendEngagementEvent:(NSString*) name :(NSString*)extras;
        + (void) startEngagementJob:(NSString*) name :(NSString*)extras;
        + (void) endEngagementJob:(NSString*) name;
        + (void) sendEngagementError:(NSString*) name :(NSString*)extras;
        + (void) sendEngagementAppInfo:(NSString*) appInfo;
   
        @end
   
        @interface EngagementJs : NSObject <EngagementJsExports>
   
        @end
6. Next we will create the second part of the bridge file. Create a file called **EngagementJsExports.m** which will contain the implementation creating the actual wrappers by calling the Mobile Engagement iOS SDK methods. Also note that we are parsing the `extras` being passed from the webview javascript and putting that into an `NSMutableDictionary` object to be passed with the Engagement SDK method calls.  
   
        #import <UIKit/UIKit.h>
        #import "EngagementAgent.h"
        #import "EngagementJsExports.h"
   
        @implementation EngagementJs
   
        +(void) sendEngagementEvent:(NSString​*)name :(NSString*​)extras {
           NSMutableDictionary* extrasInput = [self ParseExtras:extras];
           [[EngagementAgent shared] sendEvent:name extras:extrasInput];
        }
   
        + (void) startEngagementJob:(NSString*) name :(NSString*)extras {
           NSMutableDictionary* extrasInput = [self ParseExtras:extras];
           [[EngagementAgent shared] startJob:name extras:extrasInput];
        }
   
        + (void) endEngagementJob:(NSString*) name {
           [[EngagementAgent shared] endJob:name];
        }
   
        + (void) sendEngagementError:(NSString*) name :(NSString*)extras {
           NSMutableDictionary* extrasInput = [self ParseExtras:extras];
           [[EngagementAgent shared] sendError:name extras:extrasInput];
        }
   
        + (void) sendEngagementAppInfo:(NSString*) appInfo {
           NSMutableDictionary* appInfoInput = [self ParseExtras:appInfo];
           [[EngagementAgent shared] sendAppInfo:appInfoInput];
        }
   
        + (NSMutableDictionary*) ParseExtras:(NSString*) input {
           NSData *data = [input dataUsingEncoding:NSUTF8StringEncoding];
           NSError* error = nil;
           NSMutableDictionary* extras = [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
   
           return extras;
        }
   
        @end
7. Now we come back to the **ViewController.m** and update it with the following code: 
   
        #import <JavaScriptCore/JavaScriptCore.h>
        #import "ViewController.h"
        #import "EngagementJsExports.h"
   
        @interface ViewController ()
   
        @end
   
        @implementation ViewController
   
        - (void)viewDidLoad
        {
           self.webView.delegate = self;
           [super viewDidLoad];
           [self loadWebView];
        }
   
        - (void)loadWebView {
           NSBundle* mainBundle = [NSBundle mainBundle];
           NSURL* htmlPage = [mainBundle URLForResource:@"LocalPage" withExtension:@"html"];
   
           NSURLRequest* urlReq = [NSURLRequest requestWithURL:htmlPage];
           [self.webView loadRequest:urlReq];
        }
   
        - (void)webViewDidFinishLoad:(UIWebView*)wv
        {
           JSContext* context = [wv valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
   
           context[@"EngagementJs"] = [EngagementJs class];
        }
   
        - (void)webView:(UIWebView​*)wv didFailLoadWithError:(NSError*​)error
        {
           NSLog(@"Error for WEBVIEW: %@", [error description]);
        }
   
        - (void)didReceiveMemoryWarning {
           [super didReceiveMemoryWarning];
           // Dispose of any resources that can be recreated.
        }
   
        @end
8. Note the following points about the **ViewController.m** file:
   
   * In the `loadWebView` method, we are loading a local HTML file called **LocalPage.html** whose code we will review next. 
   * In the `webViewDidFinishLoad` method, we are grabbing the `JsContext` and associating our wrapper class with it. This will allow calling our wrapper SDK methods using the handle **EngagementJs** from the webView. 
9. Create a file called **LocalPage.html** with the following code:
   
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
                   alert('window.onerror: ' + err);
               }
   
               function send(inputId)
               {
                   var input = document.getElementById(inputId);
                   if(input)
                   {
                       var value = input.value;
                       // Example of how extras info can be passed with the Engagement logs
                       var extras = '{"CustomerId":"MS290011"}';
                   }
   
                   if(value && value.length > 0)
                   {
                       switch(inputId)
                       {
                           case "event":
                           EngagementJs.sendEngagementEvent(value, extras);
                           break;
   
                           case "job":
                           EngagementJs.startEngagementJob(value, extras);
                           window.setTimeout(
                           function(){
                               EngagementJs.endEngagementJob(value);
                           }, 10000 );
                           break;
   
                           case "error":
                           EngagementJs.sendEngagementError(value, extras);
                           break;
   
                           case "appInfo":
                           var appInfo = '{"customer_name":"' + value + '"}';
                           EngagementJs.sendEngagementAppInfo(appInfo);
                           break;
                       }
                   }
               }
               </script>
   
           </head>
           <body>
               <h1>Bridge Tester</h1>
   
               <div id='engagement'>
   
                   <br/>
                   <h2>Event</h2>
                   <input type="text" id="event" size="35">
                   <button onclick="send('event')">Send</button>
   
                   <br/>
                   <h2>Job</h2>
                   <input type="text" id="job" size="35">
                   <button onclick="send('job')">Send</button>
   
                   <br/>
                   <h2>Error</h2>
                   <input type="text" id="error" size="35">
                   <button onclick="send('error')">Send</button
   
                   <br/>
                   <h2>AppInfo</h2>
                   <input type="text" id="appInfo" size="35">
                   <button onclick="send('appInfo')">Send</button>
   
               </div>
           </body>
        </html>
10. Note the following points about the HTML file above:
    
    * It contains a set of input boxes where you can provide data to be used as names for your Event, Job, Error, AppInfo. When you click on the button next to it, a call is made to the Javascript which eventually calls the methods from the bridge file to pass this call to the Mobile Engagement iOS SDK. 
    * We are tagging on some static extra info to the events, jobs and even errors to demonstrate how this could be done. This extra info is sent as a JSON string which, if you look in the `EngagementJsExports.m` file, is parsed and passed along with sending Events, Jobs, Errors. 
    * A Mobile Engagement Job is kicked off with the name you specify in the input box, run for 10 seconds and shut down. 
    * A Mobile Engagement appinfo or tag is passed with 'customer_name' as the static key and the value that you entered in the input as the value for the tag. 
11. Run the app and you will see the following. Now provide some name for a test event like the following and click **Send** next to it. 
    
     ![][1]
12. Now if you go to the **Monitor** tab of your app and look under **Events -> Details**, you will see this event show up along with the static app-info that we are sending. 
    
    ![][2]

<!-- Images. -->
[1]: ./media/mobile-engagement-bridge-webview-native-ios/sending-event.png
[2]: ./media/mobile-engagement-bridge-webview-native-ios/event-output.png
