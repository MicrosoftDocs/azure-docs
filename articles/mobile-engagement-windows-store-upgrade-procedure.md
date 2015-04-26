<properties 
	pageTitle="Windows Universal Apps SDK Upgrade Procedures" 
	description="Windows Universal Apps SDK Upgrade Procedures for Azure Mobile Engagement" 					
	services="mobile-engagement" 
	documentationCenter="mobile" 
	authors="piyushjo" 
	manager="dwrede" 
	editor="" />

<tags 
	ms.service="mobile-engagement" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="piyushjo" />

#Windows Universal Apps SDK Upgrade Procedures

If you already have integrated an older version of Engagement into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK. For example if you migrate from 0.10.1 to 0.11.0 you have to first follow the "from 0.9.0 to 0.10.1" procedure then the "from 0.10.1 to 0.11.0" procedure.

##From 2.0.0 to 3.0.0

### Resources
This step concerns customized resources only. If you have customized the resources provided by the SDK (html, images, overlay) then you have to backup them before upgrading and reapply your customization on upgraded resources.

##From 1.1.1 to 2.0.0

The following describes how to migrate an SDK integration from the Capptain service offered by Capptain SAS into an app powered by Azure Mobile Engagement. 

> [Azure.IMPORTANT] Capptain and Mobile Engagement are not the same services and the procedure given below only highlights how to migrate the client app. Migrating the SDK in the app will NOT migrate your data from the Capptain servers to the Mobile Engagement servers

If you are migrating from an earlier version, please consult the Capptain web site to migrate to 1.1.1 first then apply the following procedure

### Nuget package

Replace **Capptain.WindowsPhone** by **MicrosoftAzure.MobileEngagement** Nuget package.

### Applying Mobile Engagement

The SDK uses the term `Engagement`. You need to update your project to match this change.

You need to uninstall your current Capptain nuget package. Consider that all your changes in Capptain Resources folder will be removed. If you want to keep those files then make a copy of them.

After that, install the new Microsoft Azure Engagement nuget package on your project. You can find it directly on [nuget website]. or here index. This action replaces all resources files used by Engagement and adds the new Engagement DLL to your project References.

You have to clean your project references by deleting Capptain DLL references. If you do not make this, the version of Capptain will conflict and errors will happen.

If you have customized Capptain resources, copy your old files content and paste them in the new Engagement files. Please note that both xaml and cs files have to be updated.

When those steps are completed you only have to replace old Capptain references by the new Engagement references.

1. All Capptain namespaces have to be updated.

	Before migration:
	
		using Capptain.Agent;
		using Capptain.Reach;
	
	After migration:
	
		using Microsoft.Azure.Engagement;

2. All Capptain classes that contain "Capptain" should contain "Engagement".

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

3. For xaml files Capptain namespace and attributes also change.

	Before migration:
	
		<capptain:CapptainPage
		...
		xmlns:capptain="clr-namespace:Capptain.Agent;assembly=Capptain.Agent.WP"
		...
		</capptain:CapptainPage>
	
	After migration:
	
		<engagement:EngagementPage
		...
		xmlns:engagement="clr-namespace:Microsoft.Azure.Engagement;assembly=Microsoft.Azure.Engagement.EngagementAgent.WP"
		...
		</engagement:EngagementPage>

4. Overlay page changes
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

5. For the other resources like Capptain pictures and HTML files, please note that they also have been renamed to use "Engagement".

### Project declaration

On Package.appxmanifest `File Type Associations` has been updated from :

 -   capptain\_reach\_content to engagement\_reach\_content
 -   capptain\_log\_file to engagement\_log\_file

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

The connection string for your application is displayed on the Azure Management Portal.

### Items name change

All items named *capptain* have been named *engagement*. Similarly for *Capptain* to *Engagement*.

Examples of commonly used Capptain items :

-   CapptainConfiguration now named EngagementConfiguration
-   CapptainAgent now named EngagementAgent
-   CapptainReach now named EngagementReach
-   CapptainHttpConfig now named EngagementHttpConfig
-   GetCapptainPageName now named GetEngagementPageName

Note that rename also affects overridden methods.

