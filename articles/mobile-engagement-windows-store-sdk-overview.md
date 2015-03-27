<properties 
	pageTitle="Azure Mobile Engagement Windows Store SDK Overview" 
	description="Latest updates and procedures for Windows Store SDK for Azure Mobile Engagement" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="kpiteira" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="" 
	ms.topic="article" 
	ms.date="02/12/2015" 
	ms.author="kapiteir" />

#2.0.0

Start here to get all the details on how to integrate Azure Mobile Engagement in a Windows Store App. If you'd like to give it a try first, make sure you do our [15 minutes tutorial](mobile-engagement-windows-store-dotnet-get-started.md).

Click to see the [SDK Content](mobile-engagement-windows-store-sdk-content.md)

##Integration procedures

1. Start here: [How to integrate Mobile Engagement in your Windows Store app](mobile-engagement-windows-store-integrate-engagement.md)

2. For Notifications: [How to integrate Reach (Notifications) in your Windows Store app](mobile-engagement-windows-store-integrate-engagement-reach.md)

3. Tag plan implementation: [How to use the advanced Mobile Engagement tagging API in your Windows Store app](mobile-engagement-windows-store-use-engagement-api.md)

##Release notes


##2.0.0 (02/17/2015)

-   Initial Release of Azure Mobile Engagement
-   appId/sdkKey configuration is replaced by a connection string configuration.
-   Security improvements.

For earlier version please see the [complete release notes](mobile-engagement-windows-store-release-notes.md)

##Upgrade procedures

If you already have integrated an older version of Engagement into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDKsee the complete [Upgrade Procedures](mobile-engagement-windows-store-upgrade-procedure.md). For example if you migrate from 0.10.1 to 0.11.0 you have to first follow the "from 0.9.0 to 0.10.1" procedure then the "from 0.10.1 to 0.11.0" procedure.

##From 1.1.1 to 2.0.0

The following describes how to migrate an SDK integration from the Capptain service offered by Capptain SAS into an app powered by Azure Mobile Engagement. 

>[Azure.IMPORTANT] Capptain and Mobile Engagement are not the same services and the procedure given below only highlights how to migrate the client app. Migrating the SDK in the app will NOT migrate your data from the Capptain servers to the Mobile Engagement servers

If you are migrating from an earlier version, please consult the Capptain web site to migrate to 1.1.1 first then apply the following procedure

### Nuget package

Replace Capptain.WindowsPhone.nupkg by azuresdk-mobileengagement-windows-VERSION.nupkg in archive package lib folder.

### Applying Mobile Engagement

The SDK uses the term `Engagement`. You need to update your project to match this change.

You need to uninstall your current Capptain nuget package. Consider that all your changes in Capptain Resources folder will be removed. If you want to keep those files then make a copy of them.

After that, install the new Microsoft Azure Engagement nuget package on your project. You can find it directly on [nuget website]. or here index. This action replaces all resources files used by Engagement and adds the new Engagement DLL to your project References.

You have to clean your project references by deleting Capptain DLL references. If you do not make this, the version of Capptain will conflict and errors will happen.

If you have customized Capptain resources, copy your old files content and paste them in the new Engagement files. Please note that both xaml and cs files have to be updated.

When those steps are completed you only have to replace old Capptain references by the new Engagement references.

All Capptain namespaces have to be updated.

Before migration:

			using Capptain.Agent;
			using Capptain.Reach;

After migration:

			using Microsoft.Azure.Engagement;

All Capptain classes that contain "Capptain" should contains "Engagement".

Before migration:

			public sealed partial class MainPage : CapptainPage
			{
			  protected override string GetCapptainPageName()
			  {
			    return "Capptain Demo";
			  }
			  ...
			}

After migration:

			public sealed partial class MainPage : EngagementPage
			{
			  protected override string GetEngagementPageName()
			  {
			    return "Engagement Demo";
			  }
			  ...
			}

For xaml files Capptain namespace and attributes also change.

Before migration:

			<capptain:CapptainPage
			...
			xmlns:capptain="using:Capptain.Agent"
			...
			</capptain:CapptainPage>

After migration:

			<engagement:EngagementPage
			...
			xmlns:engagement="using:Microsoft.Azure.Engagement"
			...
			</engagement:EngagementPage>

> [AZURE.IMPORTANT] Overlay also changes. Its new namespace is `Microsoft.Azure.Engagement.Overlay`. It has to be used in both xaml and cs files. Moreover `CapptainGrid` is to be named `EngagementGrid`, `capptain_notification_content` and `capptain_announcement_content` are named `engagement_notification_content` and `engagement_announcement_content`.

For overlay :

			<capptain:CapptainPageOverlay
			  xmlns:capptain="using:Capptain.Overlay"
			  ...
			</capptain:CapptainPageOverlay>

It becomes :

			<EngagementPageOverlay
			  engagement="using:Microsoft.Azure.Engagement.Overlay"
			  ...
			</engagement:EngagementPageOverlay>

For the other resources like Capptain pictures and HTML files, please note that they also have been renamed to use "Engagement".

### Project declaration

On Package.appxmanifest `File Type Associations` has been updated from :

> -   capptain\_reach\_content to engagement\_reach\_content
> -   capptain\_log\_file to engagement\_log\_file

### Application ID / SDK Key

Engagement uses a connection string. You don't have to specify an application ID and an SDK key with Mobile Engagement, you only have to specify a connection string. You can set it up on your EngagementConfiguration file.

The Engagement configuration can be set in your `Resources\EngagementConfiguration.xml` file of your project.

Edit this file to specify:

-   Your application connection string between tags `<connectionString>` and `<\connectionString>`.

If you want to specify it at runtime instead, you can call the following method before the Engagement agent initialization:

			/* Engagement configuration. */
			EngagementConfiguration engagementConfiguration = new EngagementConfiguration();
			engagementConfiguration.Agent.ConnectionString = "Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}";
			
			/* Initialize Engagement agent with above configuration. */
			EngagementAgent.Instance.Init(args, engagementConfiguration);

The connection string for your application is displayed on Azure Portal.

### Items name change

Every items named ...capptain... has been named ...engagement... It is the same for Capptain and Engagement.

Examples on commonly used Capptain items :

> -   CapptainConfiguration now named EngagementConfiguration
> -   CapptainAgent now named EngagementAgent
> -   CapptainReach now named EngagementReach
> -   CapptainHttpConfig now named EngagementHttpConfig
> -   GetCapptainPageName now named GetEngagementPageName

Note that rename also affects overrided methods.

[nuget website]:http://www.nuget.org/packages/Capptain.WindowsCS
