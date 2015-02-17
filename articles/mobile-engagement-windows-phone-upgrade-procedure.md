<properties 
	pageTitle="Azure Mobile Engagement Windows Phone SDK Integration" 
	description="Windows Phone SDK Upgrade Procedures for Azure Mobile Engagement" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="lalathie" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="kapiteir" />

#Upgrade procedures

If you already have integrated an older version of Capptain into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK. For example if you migrate from 0.10.1 to 0.11.0 you have to first follow the "from 0.9.0 to 0.10.1" procedure then the "from 0.10.1 to 0.11.0" procedure.

##From 1.1.1 to 2.0.0

Capptain is rebranded as Engagement.

### Nuget package

Replace Capptain.WindowsPhone.nupkg by azuresdk-mobileengagement-windowsphone-VERSION.nupkg in archive package lib folder.

### Rebranding

Capptain has been renamed to Engagement. You need to update your project to match this change.

You need to uninstall your current Capptain nuget package. Consider that all your changes in Capptain Resources folder will be removed. If you want to keep those files then make a copy of them.

After that, install the new Microsoft Azure Engagement nuget package on your project. You can find it directly on [nuget website]. or here index. This action replaces all resources files used by Engagement and adds the new Engagement DLL to your project References.

You have to clean your project references by deleting old Capptain DLL references. If you do not make this, the old version of Capptain will conflict and errors will happen.

If you have customized Capptain resources, copy your old files content and paste them in the new Engagement files. Please note that both xaml and cs files have to be updated.

When those steps are completed you only have to replace old Capptain references by the new Engagement references.

All Capptain namespaces have to be updated.

Before rebrand:

			using Capptain.Agent;
			using Capptain.Reach;

After rebrand:

			using Microsoft.Azure.Engagement;

All Capptain classes that contain "Capptain" now contains "Engagement".

Before rebrand:

			public sealed partial class MainPage : CapptainPage
			{
			  protected override string GetCapptainPageName()
			  {
			    return "Capptain Demo";
			  }
			  ...
			}

After rebrand:

			public sealed partial class MainPage : EngagementPage
			{
			  protected override string GetEngagementPageName()
			  {
			    return "Engagement Demo";
			  }
			  ...
			}

For xaml files Capptain namespace and attributes also change.

Before rebrand:

			<capptain:CapptainPage
			...
			xmlns:capptain="clr-namespace:Capptain.Agent;assembly=Capptain.Agent.WP"
			...
			</capptain:CapptainPage>

After rebrand:

			<engagement:EngagementPage
			...
			xmlns:engagement="clr-namespace:Microsoft.Azure.Engagement;assembly=Microsoft.Azure.Engagement.EngagementAgent.WP"
			...
			</engagement:EngagementPage>

For the other resources like Capptain pictures, please note that they also have been renamed to use "Engagement".

### Application ID / SDK Key

Now Engagement uses a connection string. You don't have to specify an application ID and an SDK key anymore you only have to specify a connection string. You can set it up on your CapptainConfiguration file.

The Engagement configuration can be set in your `Resources\EngagementConfiguration.xml` file of your project.

Edit this file to specify:

-   Your application connection string between tags `<connectionString>` and `<\connectionString>`.

If you want to specify it at runtime instead, you can call the following method before the Engagement agent initialization:

			/* Engagement configuration. */
			EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
			engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";
			
			/* Initialize Engagement angent with above configuration. */
			EngagementAgent.Instance.Init(engagementConfiguration);

The connection string for your application is displayed on Azure Portal.

### Items renamed

Every items named ...capptain... has been renamed to ...engagement... It is the same for Capptain and Engagement.

Examples on commonly used Capptain items :

> -   CapptainConfiguration renamed EngagementConfiguration
> -   CapptainAgent renamed EngagementAgent
> -   CapptainReach renamed EngagementReach
> -   CapptainHttpConfig renamed EngagementHttpConfig
> -   GetCapptainPageName renamed GetEngagementPageName

Note that rename also affects overrided methods

##From 1.0.0 to 1.1.0

The way to set the Capptain configuration (application ID, SDK key, repot crash...) and the Capptain agent initialization have changed. The configuration could be set either :

-   From the `Resources\CapptainConfiguration.xml` file :

    > -   Edit this file to specify :
    >
    >     > -   Your application ID between tags `<applicationId>` and `</applicationId>`.
    >     > -   Your SDK key between tags `<SDKKey>` and `</SDKKey>`.
    >     > -   *Optional*, whether you want Capptain's crash reporting feature or not between `<reportCrash>` and `</reportCrash>` tags, (`true` by default).
    >     > -   *Optional*, whether the native push (MPNS) is activated or not between `<enableNativePush>` and `</enableNativePush>` tags, (`true` by default).
    >     > -   *Optional*, the name of the push channel between `<channelName>` and `</channelName>` tags, provide the same that your application may currently use or leave it empty.
    >
    > -   Modify your Capptain Agent initialization from `CapptainAgent.Init(appId, SDKkey)` to `CapptainAgent.Instance.Init()`.
    > -   Modify your Capptain Agent initialization from `CapptainReach.Init()` to `CapptainReach.Instance.Init()`.

-   At run-time thanks to the `CapptainConfiguration` object :

			/* Capptain configuration. */
			CapptainConfiguration capptainConfiguration = new CapptainConfiguration();
			
			/* Agent configuration. */
			capptainConfiguration.Agent.ApplicationId = "YOUR_APPID";
			capptainConfiguration.Agent.SDKKey = "YOUR_SDK_KEY";
			
			/* Reach configuration. */
			capptainConfiguration.Reach.EnableNativePush = true;                  /* [Optional] whether the native push (MPNS) is activated or not. */
			capptainConfiguration.Reach.ChannelName = "YOUR_PUSH_CHANNEL_NAME";   /* [Optional] Provide the same channel name that your application may currently use. */
			
			/* Initialize Capptain agent with above configuration. */
			CapptainAgent.Instance.Init(capptainConfiguration);
			CapptainReach.Instance.Init();

-   Every call to CapptainAgent in your application have to be modified from `CapptainAgent.AnyCapptainItem` to `CapptainAgent.Instance.AnyCapptainItem`.

Example :

> `CapptainAgent.StartActivity("MyPage")` becomes `CapptainAgent.Instance.StartActivity("MyPage")`;

-   Every call to CapptainReach in your application have to be modified from `CapptainReach.AnyCapptainItem` to `CapptainReach.Instance.AnyCapptainItem`.

Example :

> `CapptainReach.Init()` becomes `CapptainReach.Instance.Init()`;

-   Update your `CapptainAgent.OnTombstoned(e)` to `CapptainAgent.Instance.OnActivated(e)` and add `CapptainReach.Instance.OnActivated(e)` right after it.

Example :

			[...]
			private void Application_Activated(object sender, ActivatedEventArgs e)
			{
			  [...]
			  CapptainAgent.Instance.OnActivated(e);
			  CapptainReach.Instance.OnActivated(e);
			  [...]
			}
			[...]

##From 0.7.0 to 1.0.0

You have to change your :

-   References
-   In each XAML files corresponding to your views :
    -   XML namespace, replace `xmlns:capptain="clr-namespace:Capptain.Agent;assembly=Capptain.Agent"` by `xmlns:capptain="clr-namespace:Capptain.Agent;assembly=Capptain.Agent.WP"`
    -   XML tags, replace each `﻿capptain:CapptainPhoneApplicationPage` by `﻿capptain:CapptainPage`
-   In each XAML.cs files corresponding to your views' code behind :
    -   Replace `CapptainPhoneApplicationPage` with `CapptainPage`

##From 0.6.0 to 0.7.0

The `CapptainReach.Init()` signature has changed : the parameter deviceId has been removed. Please delete it from your `Application_Launching` method of your `App.xaml.cs` file.

##From 0.5.0 to 0.6.0

Limits on keys and size are now in place, please read Latest/How to Use the Engagement API on Windows Phone.

##From 0.x.x to 0.5.0

### Libraries

You also need to import the Capptain.Common.dll to your project. Otherwise, the Capptain.Agent.dll will not work.

### Initialization parameter change

In your `CapptainAgent.Init()` call, the parameter apiKey is now called sdkKey. If you called the method with named parameters, change the parameter name.

##From 0.2.0 to 0.3.0

### Version support

We have dropped the support for the 7.0 version of Windows Phone. We will only support WP7 Mango (codenamed 7.1) starting today.

### Namespace change

To better manage the futures releases, we have modified the SDK namespace.

The namespace `Capptain.Agent` is now replacing the old `WP7CapptainSDK`. You will have to change your :

-   References
-   Using directives
    -   `using WP7CapptainSDK;` by
    -   `using Capptain.Agent;`
-   XML namespace in the XAML files :
    -   `xmlns:phone="clr-namespace:WP7CapptainSDK;assembly=WP7CapptainSDK"` by
    -   `xmlns:phone="clr-namespace:Capptain.Agent;assembly=Capptain.Agent"`

### Location reporting

The WP7 Capptain SDK used to provide a different dll when you wanted to report the location. As of today, there will be only one dll for all the cases.

If you want to report the location, simply add `true` as the third parameter of the `Capptain.Init()` method (normally in the `Application_Launching()` method of your App.xaml.cs file).


[nuget website]:http://www.nuget.org/packages/Capptain.WindowsPhone
