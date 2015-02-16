<properties 
	pageTitle="Azure Mobile Engagement Windows Phone SDK Integration" 
	description="Latest updates and procedures for Windows Phone SDK for Azure Mobile Engagement" 					
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
	ms.date="02/12/2015" 
	ms.author="kapiteir" />

#Windows Phone SDK for Azure Mobile Engagement v2.0.0
Start here to get all the details on how to integrate Azure Mobile Engagement in a Windows Phone App. If you'd like to give it a try first, make sure you do our [15 minutes tutorial](../mobile-engagement-windows-phone-get-started/).

Click to see the [SDK Content](../mobile-engagement-windows-phone-sdk-content/)

##Integration procedures

1. Start here: [How to integrate Mobile Engagement in your Windows Phone app](../mobile-engagement-windows-phone-integrate-engagement/)

2. For Notifications: [How to integrate Reach (Notifications) in your Windows Phone app](../mobile-engagement-windows-phone-integrate-engagement-reach/)

3. Tag plan implementation: [How to use the advanced Mobile Engagement tagging API in your Windows Phone app](../mobile-engagement-windows-phone-use-the-engagement-api/)

##Release notes

###2.0.0 (02/17/2015)
-   Rebranded Capptain to Engagement.
-   appId/sdkKey configuration is replaced by a connection string configuration.
-   Security improvements.

For earlier version please see the [complete release notes](../mobile-engagement-windows-phone-release-notes/)

##Upgrade procedures

If you already have integrated an older version of Capptain into your application, you have to carefully apply the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK see the complete [Upgrade Procedures](mobile-engagement-windows-phone-upgrade-procedure/). For example if you migrate from 0.10.1 to 0.11.0 you have to first follow the "from 0.9.0 to 0.10.1" procedure then the "from 0.10.1 to 0.11.0" procedure.

###From 1.1.1 to 2.0.0

Capptain is rebranded as Engagement.

#### Nuget package

Replace Capptain.WindowsPhone.nupkg by azuresdk-mobileengagement-windowsphone-VERSION.nupkg in archive package lib folder.

#### Rebranding

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

#### Application ID / SDK Key

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

#### Items renamed

Every items named ...capptain... has been renamed to ...engagement... It is the same for Capptain and Engagement.

Examples on commonly used Capptain items :

> -   CapptainConfiguration renamed EngagementConfiguration
> -   CapptainAgent renamed EngagementAgent
> -   CapptainReach renamed EngagementReach
> -   CapptainHttpConfig renamed EngagementHttpConfig
> -   GetCapptainPageName renamed GetEngagementPageName

Note that rename also affects overrided methods

### Upgrade from older versions

See [Upgrade Procedures](mobile-engagement-windows-phone-upgrades/)
