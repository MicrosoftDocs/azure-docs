<properties 
	pageTitle="Azure Mobile Engagement iOS SDK Integration" 
	description="Latest updates and procedures for iOS SDK for Azure Mobile Engagement"
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="kpiteira" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-ios" 
	ms.devlang="objective-c" 
	ms.topic="article" 
	ms.date="02/12/2015" 
	ms.author="kapiteir" />

#How to Integrate Engagement on iOS

> [AZURE.SELECTOR] 
- [Windows Universal](mobile-engagement-windows-store-integrate-engagement.md) 
- [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md) 
- [iOS](mobile-engagement-ios-integrate-engagement.md) 
- [Android](mobile-engagement-android-integrate-engagement.md) 

This procedure describes the simplest way to activate Engagement's Analytics and Monitoring functions in your iOS application.

> [AZURE.IMPORTANT] The Engagement SDK requires iOS4+: the deployment target of your application must be at least iOS 4.

The following steps are enough to activate the report of logs needed to compute all statistics regarding Users, Sessions, Activities, Crashes and Technicals. The report of logs needed to compute other statistics like Events, Errors and Jobs must be done manually using the Engagement API  (see [How to use the advanced Mobile Engagement tagging API in your iOS app](mobile-engagement-ios-use-engagement-api.md) since these statistics are application dependent.

##Embed the Engagement SDK into your iOS project

Add the Engagement SDK to your iOS project: in Xcode 4, right click on your project and select **"Add files to ..."** and choose the `EngagementSDK` folder.

Engagement requires additional frameworks to work: in the project explorer, open your project pane and select the correct target. Then, open the **"Build phases"** tab and in the **"Link Binary With Libraries"** menu, add these frameworks:

> -   `AdSupport.framework` - set the link as `Optional`
> -   `SystemConfiguration.framework`
> -   `CoreTelephony.framework`
> -   `CFNetwork.framework`
> -   `CoreLocation.framework`
> -   `libxml2.dylib`

> [AZURE.NOTE] The AdSupport framework can be removed. Engagement needs this framework to collect the IDFA. However, IDFA collection can be disabled \<ios-sdk-engagement-idfa\> to comply with the new Apple policy regarding this ID.

##Initialize the Engagement SDK

You need to modify your Application Delegate:

-   At the top of your implementation file, import the Engagement agent:

			[...]
			#import "EngagementAgent.h"

-   Initialize Engagement inside the method '**applicationDidFinishLaunching:**' or '**application:didFinishLaunchingWithOptions:**':

			- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
			{
			  [...]
			  [EngagementAgent init:@"Endpoint={YOUR_APP_COLLECTION.DOMAIN};SdkKey={YOUR_SDK_KEY};AppId={YOUR_APPID}"];
			  [...]
			}

##Basic reporting

### Recommended method: overload your `UIViewController` classes

In order to activate the report of all the logs required by Engagement to compute Users, Sessions, Activities, Crashes and Technical statistics, you can simply make all your `UIViewController` sub-classes inherit from the `EngagementViewController` classes (same rule for `UITableViewController` -\> `EngagementTableViewController`).

**Without Engagement :**

			#import <UIKit/UIKit.h>
			
			@interface Tab1ViewController : UIViewController<UITextFieldDelegate> {
			  UITextField* myTextField1;
			  UITextField* myTextField2;
			}
			
			@property (nonatomic, retain) IBOutlet UITextField* myTextField1;
			@property (nonatomic, retain) IBOutlet UITextField* myTextField2;

**With Engagement :**

			#import <UIKit/UIKit.h>
			#import "EngagementViewController.h"
			
			@interface Tab1ViewController : EngagementViewController<UITextFieldDelegate> {
			  UITextField* myTextField1;
			  UITextField* myTextField2;
			}
			
			@property (nonatomic, retain) IBOutlet UITextField* myTextField1;
			@property (nonatomic, retain) IBOutlet UITextField* myTextField2;

### Alternate method: call `startActivity()` manually

If you cannot or do not want to overload your `UIViewController` classes, you can instead start your activities by calling `EngagementAgent`'s methods directly.

> [AZURE.IMPORTANT] The iOS SDK automatically calls the `endActivity()` method when the application is closed. Thus, it is *HIGHLY* recommended to call the `startActivity` method whenever the activity of the user change, and to *NEVER* call the `endActivity` method, since calling this method forces the current session to be ended.

##Location reporting

Apple terms of service do not allow applications to use location tracking for statistics purpose only. Thus, it is recommended to enable location reports only if your application also use the location tracking for another reason.

Starting with iOS 8, you must provide a description for how your app uses location services by setting a string for the key [NSLocationWhenInUseUsageDescription] or [NSLocationAlwaysUsageDescription] in your app's Info.plist file. If you want to report location in the background with Engagement, add the key NSLocationAlwaysUsageDescription. In all other cases, add the key NSLocationWhenInUseUsageDescription.

### Lazy area location reporting

Lazy area location reporting allows to report the country, region and locality associated to devices. This type of location reporting only uses network locations (based on Cell ID or WIFI). The device area is reported at most once per session. The GPS is never used, and thus this type of location report has very few (not to say no) impact on the battery.

Reported areas are used to compute geographic statistics about users, sessions, events and errors. They can also be used as criterion in Reach campaigns. The last known area reported for a device can be retrieved thanks to the [Device API].

To enable lazy area location reporting, add the following line after initializing the Engagement agent:

			- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
			{
			  [...]
			  [[EngagementAgent shared] setLazyAreaLocationReport:YES];
			  [...]
			}

### Real time location reporting

Real time location reporting allows to report the latitude and longitude associated to devices. By default, this type of location reporting only uses network locations (based on Cell ID or WIFI), and the reporting is only active when the application runs in foreground (i.e. during a session).

Real time locations are *NOT* used to compute statistics. Their only purpose is to allow the use of real time
geo-fencing \<Reach-Audience-geofencing\> criterion in Reach campaigns.

To enable real time location reporting, add the following line after initializing the Engagement agent:

			[[EngagementAgent shared] setRealtimeLocationReport:YES];

#### GPS based reporting

By default, real time location reporting only uses network based locations. To enable the use of GPS based locations (which are far more precise), add:

			[[EngagementAgent shared] setFineRealtimeLocationReport:YES];

#### Background reporting

By default, real time location reporting is only active when the application runs in foreground (i.e. during a session). To enable the reporting also in background, add:

			[[EngagementAgent shared] setBackgroundRealtimeLocationReport:YES withLaunchOptions:launchOptions];

> [AZURE.NOTE] When the application runs in background, only network based locations are reported, even if you enabled the GPS.

Implementation of this function will call [startMonitoringSignificantLocationChanges] when your application goes into the background. Be aware that it will automatically relaunch your application into the background if a new location event arrives.

##Advanced reporting

Optionally, if you want to report application specific events, errors and jobs, you need to use the Engagement API through the methods of the `EngagementAgent` class. An object of this class can be retrieved by calling the `[EngagementAgent shared]` static method.

The Engagement API allows to use all of Engagement's advanced capabilities and is detailed in the How to Use the
Engagement API on iOS (as well as in the technical documentation of the `EngagementAgent` class).

##Disable IDFA collection

By default, Engagement will use the [IDFA] to uniquely identify a user. But if you’re not using advertising elsewhere in the app, you might be rejected by the App Store review process. IDFA collection can be disabled by adding the preprocessor macro `ENGAGEMENT_DISABLE_IDFA` in your pch file (or in the `Build Settings` of your application). This will ensure that there is no references to `ASIdentifierManager`, `advertisingIdentifier` or `isAdvertisingTrackingEnabled` in the application build.

Integration in the **prefix.pch** file:

			#define ENGAGEMENT_DISABLE_IDFA
			...

You can verify that the IDFA collection is properly disabled in your application by checking the Engagement test logs. See the Integration Test\<ios-sdk-engagement-test-idfa\> documentation for further information.

##Disable log reporting

### Using a method call

If you want Engagement to stop sending logs, you can call:

			[[EngagementAgent shared] setEnabled:NO];

This call is persistent: it uses `NSUserDefaults` to store the information.

You can enable log reporting again by calling the same function with `YES`.

### Integration in your settings bundle

Instead of calling this function, you can also integrate this setting directly in your existing `Settings.bundle` file. The string `engagement_agent_enabled` must be used as a the preference identifier and it must be associated to a toggle switch(`PSToggleSwitchSpecifier`).

The following example of `Settings.bundle` shows how to implement it:

			<dict>
			    <key>PreferenceSpecifiers</key>
			    <array>
			        <dict>
			            <key>DefaultValue</key>
			            <true/>
			            <key>Key</key>
			            <string>engagement_agent_enabled</string>
			            <key>Title</key>
			            <string>Log reporting enabled</string>
			            <key>Type</key>
			            <string>PSToggleSwitchSpecifier</string>
			        </dict>
			    </array>
			    <key>StringsTable</key>
			    <string>Root</string>
			</dict>

<!-- URLs. -->
[Device API]: http://go.microsoft.com/?linkid=9876094
[NSLocationWhenInUseUsageDescription]:https://developer.apple.com/library/prerelease/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW26
[NSLocationAlwaysUsageDescription]:https://developer.apple.com/library/prerelease/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW18
[startMonitoringSignificantLocationChanges]:http://developer.apple.com/library/IOs/#documentation/CoreLocation/Reference/CLLocationManager_Class/CLLocationManager/CLLocationManager.html#//apple_ref/occ/instm/CLLocationManager/startMonitoringSignificantLocationChanges
[IDFA]:https://developer.apple.com/library/ios/documentation/AdSupport/Reference/ASIdentifierManager_Ref/ASIdentifierManager.html#//apple_ref/occ/instp/ASIdentifierManager/advertisingIdentifier
