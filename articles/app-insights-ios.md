<properties 
    pageTitle="Application Insights for Windows desktop apps" 
    description="Analyze usage and performance of your Windows app with Application Insights." 
    services="application-insights" 
    documentationCenter=""
    authors="alancameronwills" 
    manager="ronmart"/>

<tags 
    ms.service="application-insights" 
    ms.workload="tbd" 
    ms.tgt_pltfrm="ibiza" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/27/2015" 
    ms.author="awills"/>

# Application Insights for iOS apps

Visual Studio Application Insights lets you monitor your mobile application for usage and performance.

## Requirements

You'll need:

* A subscription with [Microsoft Azure](http://azure.com).  You login with a Microsoft subscription, which you might have for XBox Live or other Microsoft cloud services.
* The SDK runs on devices with iOS 6.0 or higher.

## Create an Application Insights resource

In the [Azure portal][portal], create a new Application Insights resource.  Pick the iOS option.

![Click New, Developer services, Application Insights](./media/app-insights-ios/11-new.png)

The blade that opens is the place where you'll see performance and usage data about your app. To get back to it next time you login to Azure, you should find a tile for it on the start screen. Alternatively click Browse to find it.


### Copy  the Instrumentation Key.

You'll need this shortly, to direct the data from the SDK in your app to the resource you just created.

![Click Properties, select the key, and press ctrl+C](./media/app-insights-ios/12-props.png)



## Download and Extract

1. Download the latest [Application Insights for iOS](https://github.com/Microsoft/AppInsights-iOS/releases) framework.

2. Unzip the file. A new folder `AppInsights` is created.

3. Move the folder into your project directory. We usually put 3rd-party code into a subdirectory named `Vendor`, so we move the directory into it.

## Set up Xcode

1. Drag and drop `AppInsights.framework` from your project directory to your Xcode project.
2. Similar to above, our projects have a group `Vendor`, so we drop it there.
3. Select `Create groups for any added folders` and set the checkmark for your target. Then click `Finish`.
4. Select your project in the `Project Navigator` (⌘+1).
5. Select your app target.
6. Select the tab `Build Phases`.
7. Expand `Link Binary With Libraries`.
8. Add the following system frameworks, if they are missing:
	- `UIKit`
	- `Foundation`
	- `SystemConfiguration`
	- `Security`
	- `CoreTelephony`(only required if iOS > 7.0)

#### Set the Instrumentation Key

Open the `info.plist` of your app target and add a new field of type *String*. Name it `MSAIInstrumentationKey` and set your Application Insights instrumentation key as its value.

## Modify Code 

### Objective-C

2. Open your `AppDelegate.m` file.
3. Add the following line at the top of the file below your own #import statements:

	```objectivec
	#import <AppInsights/AppInsights.h>
	```
4. Search for the method `application:didFinishLaunchingWithOptions:`
5. Add the following lines to setup and start the AppInsights SDK:

	```objectivec
	[[MSAIAppInsights sharedInstance] setup];
	// Do some additional configuration if needed here
	...
	[[MSAIAppInsights sharedInstance] start];
	```

	You can also use the following shortcut:

	```objectivec
	[MSAIAppInsights setup];
	[MSAIAppInsights start];
	```

6. Send some data to the server:

	```objectivec	
	// Send an event with custom properties and measuremnts data
	[MSAITelemetryManager trackEventWithName:@"Hello World event!"
								  properties:@{@"Test property 1":@"Some value",
											 @"Test property 2":@"Some other value"}
							     measurements:@{@"Test measurement 1":@(4.8),
											 @"Test measurement 2":@(15.16),
		                                	 @"Test measurement 3":@(23.42)}];

	// Send a message
	[MSAITelemetryManager trackTraceWithMessage:@"Test message"];

	// Manually send pageviews (note: this will also be done automatically)
	[MSAITelemetryManager trackPageView:@"MyViewController"
							   duration:300
					 	     properties:@{@"Test measurement 1":@(4.8)}];

	// Send custom metrics
	[MSAITelemetryManager trackMetricWithName:@"Test metric" 
									    value:42.2];
	```

*Note:* The SDK is optimized to defer everything possible to a later time while making sure that, for example, crashes on startup can also be caught and each module executes other code with a delay some seconds. This ensures that applicationDidFinishLaunching will process as fast as possible and the SDK will not block the startup sequence resulting in a possible kill by the watchdog process.

### Swift

2. Open your `AppDelegate.swift` file.
3. Add the following line at the top of the file below your own #import statements:
	
	```swift	
	#import AppInsights
	```
4. Search for the method 
	
	```swift	
	application(application: UIApplication, didFinishLaunchingWithOptions launchOptions:[NSObject: AnyObject]?) -> Bool`
	```
5. Add the following lines to setup and start the AppInsights SDK:
	
	```swift
	MSAIAppInsights.sharedInstance().setup();
   MSAIAppInsights.sharedInstance().start();
	```
	
	You can also use the following shortcut:

	```swift
	MSAIAppInsights.setup();
   MSAIAppInsights.start();
	```
5. Send some data to the server:
	
	```swift
	// Send an event with custom properties and measuremnts data
	MSAITelemetryManager.trackEventWithName(name:"Hello World event!", 
									  properties:@{"Test property 1":"Some value",
												  "Test property 2":"Some other value"},
								    measurements:@{"Test measurement 1":@(4.8),
												  "Test measurement 2":@(15.16),
 											      "Test measurement 3":@(23.42)});

	// Send a message
	MSAITelemetryManager.trackTraceWithMessage(message:"Test message");

	// Manually send pageviews
	MSAITelemetryManager.trackPageView(pageView:"MyViewController",
									   duration:300,
								     properties:@{"Test measurement 1":@(4.8)});

	// Send a message
	MSAITelemetryManager.trackMetricWithName(name:"Test metric",
										    value:42.2);
	```

## Endpoint 

By default the following server URL is used to work with the [Azure portal](https://portal.azure.com):

* `https://dc.services.visualstudio.com`

To change the URL, setup Application Insights like this:

```objectivec
	[[MSAIAppInsights sharedInstance] setup];
	[[MSAIppInsights sharedInstance] setServerURL:{your server url}];
	[[MSAIAppInsights sharedInstance] start];
```
	

## iOS 8 Extensions

The following points need to be considered to use the Application Insights SDK with iOS 8 Extensions:

1. Each extension is required to use the same values for version (`CFBundleShortVersionString`) and build number (`CFBundleVersion`) as the main app uses. (This is required only if you are using the same `MSAIInstrumentationKey` for your app and extensions).
2. You need to make sure the SDK setup code is only invoked once. Since there is no `applicationDidFinishLaunching:` equivalent and `viewDidLoad` can run multiple times, you need to use a setup like the following example:

	```objectivec	
	@interface TodayViewController () <NCWidgetProviding>
	@property (nonatomic, assign) BOOL didSetupAppInsightsSDK;
	@end

	@implementation TodayViewController

	- (void)viewDidLoad {
		[super viewDidLoad];
		if (!self.didSetupAppInsightsSDK) {
			[MSAIAppInsights setup];
			[MSAIAppInsights start];
          self.didSetupAppInsightsSDK = YES;
       }
    }
    ```
 
<a id="options"></a> 
## Additional Options

### Set up with xcconfig

Instead of manually adding the missing frameworks, you can also use our bundled xcconfig file.

1. Select your project in the `Project Navigator` (⌘+1).

2. Select your project.

3. Select the tab `Info`.

4. Expand `Configurations`.

5. Select `AppInsights.xcconfig` for all your configurations (if you don't already use a `.xcconfig` file)

	**Note:** You can also add the required frameworks manually to your targets `Build Phases` and continue with step `7.` instead.

6. If you are already using a `.xcconfig` file, simply add the following line to it

	`#include "../Vendor/AppInsights/Support/AppInsights.xcconfig"`

	(Adjust the path depending where the `Project.xcconfig` file is located related to the Xcode project package)

	**Important note:** Check if you overwrite any of the build settings and add a missing `$(inherited)` entry on the projects build settings level, so the `AppInsights.xcconfig` settings will be passed through successfully.

7. If you are getting build warnings, then the `.xcconfig` setting wasn't included successfully or its settings in `Other Linker Flags` get ignored because `$(inherited)` is missing on project or target level. Either add `$(inherited)` or link the following frameworks manually in `Link Binary With Libraries` under `Build Phases`:
	- `UIKit`
	- `Foundation`
	- `SystemConfiguration`
	- `Security`
	- `CoreTelephony`(only required if iOS > 7.0)

### Setup with CocoaPods

[CocoaPods](http://cocoapods.org) is a dependency manager for Objective-C, which automates and simplifies the process of using 3rd-party libraries like ApplicationInsights in your projects. To learn how to setup cocoapods for your project, visit the [official cocoapods website](http://cocoapods.org/).

**[NOTE]**
When adding Application Insights to your podfile **without** specifying the version, `pod install` will throw an error because using a pre-release version of a pod has to be specified **explicitly**.
As soon as Application Insights 1.0 is available, the version doesn't have to be specified in your podfile anymore. 

#### Podfile

```ruby
platform :ios, '8.0'
pod "ApplicationInsights", '1.0-beta.1'
```


## Run your app

Run the app in debug mode, or publish it.

## View your data in Application Insights

Return to http://portal.azure.com and browse to your Application Insights resource.

Click Search to open Diagnostic Search - that's where the first events will appear. If you don't see anything, wait a minute or two and click Refresh.

![Click Diagnostic Search](./media/app-insights-ios/21-search.png)

As your app is used, data will appear in the overview blade.

![Overview blade](./media/app-insights-ios/22-oview.png)

Click on any chart to get more detail. For example, crashes:

![Click the crash chart](./media/app-insights-ios/23-crashes.png)

## <a name="usage"></a>Next Steps

[Track usage of your app][track]

[Capture and search diagnostic logs][diagnostic]

[Troubleshooting][qna]




<!--Link references-->

[alerts]: app-insightss-alerts.md
[android]: https://github.com/Microsoft/AppInsights-Android
[api]: app-insights-custom-events-metrics-api.md
[apiproperties]: app-insights-custom-events-metrics-api.md#properties
[apiref]: http://msdn.microsoft.com/library/azure/dn887942.aspx
[availability]: app-insights-monitor-web-app-availability.md
[azure]: insights-perf-analytics.md
[azure-availability]: insights-create-web-tests.md
[azure-usage]: insights-usage-analytics.md
[azurediagnostic]: insights-how-to-use-diagnostics.md
[client]: app-insights-web-track-usage.md
[config]: app-insights-configuration-with-applicationinsights-config.md
[data]: app-insights-data-retention-privacy.md
[desktop]: app-insights-windows-desktop.md
[detect]: app-insights-detect-triage-diagnose.md
[diagnostic]: app-insights-diagnostic-search.md
[eclipse]: app-insights-java-eclipse.md
[exceptions]: app-insights-web-failures-exceptions.md
[export]: app-insights-export-telemetry.md
[exportcode]: app-insights-code-sample-export-telemetry-sql-database.md
[greenbrown]: app-insights-start-monitoring-app-health-usage.md
[java]: app-insights-java-get-started.md
[javalogs]: app-insights-java-trace-logs.md
[javareqs]: app-insights-java-track-http-requests.md
[knowUsers]: app-insights-overview-usage.md
[metrics]: app-insights-metrics-explorer.md
[netlogs]: app-insights-asp-net-trace-logs.md
[new]: app-insights-create-new-resource.md
[older]: http://www.visualstudio.com/get-started/get-usage-data-vs
[perf]: app-insights-web-monitor-performance.md
[platforms]: app-insights-platforms.md
[portal]: http://portal.azure.com/
[qna]: app-insights-troubleshoot-faq.md
[redfield]: app-insights-monitor-performance-live-website-now.md
[roles]: app-insights-role-based-access-control.md
[start]: app-insights-get-started.md
[trace]: app-insights-search-diagnostic-logs.md
[track]: app-insights-custom-events-metrics-api.md
[usage]: app-insights-web-track-usage.md
[windows]: app-insights-windows-get-started.md
[windowsCrash]: app-insights-windows-crashes.md
[windowsUsage]: app-insights-windows-usage.md




