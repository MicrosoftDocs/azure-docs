<properties 
	pageTitle="Get Started with Mobile Analytics | Mobile Dev Center" 
	description="Get Started with Mobile Analytics." 
	documentationCenter="ios" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="10/10/2014" 
	ms.author="mahender"/>

# Get Started with Mobile Analytics (Capptain)

<div class="dev-center-tutorial-selector sublanding">
<a href="/documentation/articles/mobile-services-ios-get-started-mobile-analytics" title="iOS" class="current">iOS</a>
</div>

In this tutorial, you add mobile analytics capabilities to your app using [Capptain]. Mobile Analytics allow you to determine how users are interacting with your app and what sections are driving the most activity. To start getting these data, you will instrument your app with the Capptain SDK.


>[AZURE.NOTE] Microsoft-owned Capptain.com offers analytics for mobile apps free up to 100,000 monthly active users for Azure Mobile Services Standard Tier customers. To take advantage of this offer, please contact us at mobileservices@microsoft.com for further instructions. The tutorial below summarizes the Capptain.com features and capabilities and provides instructions on how to use them.


This tutorial walks you through these basic steps:

1. [Initialize the Capptain SDK]
2. [Overload UIViewController]

This tutorial requires the following:

* A [Capptain] account
* A [Mobile Services Standard tier] app

## <a name="initialize"></a>Initialize the Capptain SDK

1. Navigate to the **Application Details** page of your app registered in Capptain. Select the SDK tab and download the package.

2. In XCode, add the Capptain SDK to your project by right clicking your project and selecting "Add files to..." Choose the CapptainSDK folder.

3. Select your project. Under the **Build Phases** tab, select **Link Binary With Libraries** and add the following frameworks:
    * AdSupport.framework - set the link as Optional
    * SystemConfiguration.framework
    * CoreTelephony.framework
    * CFNetwork.framework
    * CoreLocation.framework
    * libxml2.dylib

    >[AZURE.NOTE] The AdSupport framework can be removed. Capptain needs this framework to collect the IDFA. However, IDFA collection can be disabled to comply with the Apple policy regarding this ID.

4. In the Application Delegate implementation file, import the Capptain Agent.


        #import "CapptainAgent.h"


5. Inside `applicationDidFinishLaunching:` or `application:didFinishLaunchingWithOptions:`, initialize the Capptain Agent by passing `registerapp:identifiedby:` with your App ID and SDK Key.

         - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
        {
          [...]
          [CapptainAgent registerApp:@"YOUR_APPID" identifiedBy:@"YOUR_SDK_KEY"];
          [...]
        }

## <a name="instrument"></a>Overload UIViewController

1. Find each child of `UIViewController` in your project and make sure that each instead inherits from `CapptainViewController`.

        #import <UIKit/UIKit.h>
        #import "CapptainViewController.h"

        // formerly @interface Tab1ViewController : UIViewController<UITextFieldDelegate>
        @interface Tab1ViewController : CapptainViewController<UITextFieldDelegate> {
          UITextField* myTextField1;
          UITextField* myTextField2;
        }

        @property (nonatomic, retain) IBOutlet UITextField* myTextField1;
        @property (nonatomic, retain) IBOutlet UITextField* myTextField2;

2. Find each child of `UITableViewController` in your project and make sure that each instead inherits from `CapptainTableViewController`.

    Your app is now configured to send analytics data to Capptain.

## Next Steps
Find out more about what Capptain can do for your app at [http://www.capptain.com](http://www.capptain.com)

<!-- Anchors. -->
[Initialize the Capptain SDK]: #initialize
[Overload UIViewController]: #instrument


<!-- URLs. -->
[Capptain]: http://www.capptain.com
[Mobile Services Standard tier]: /pricing/details/mobile-services/
