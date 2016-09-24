<properties
	pageTitle="Azure Mobile Engagement Web SDK upgrade procedures | Microsoft Azure"
	description="The latest updates and procedures for the Web SDK for Azure Mobile Engagement"
	services="mobile-engagement"
	documentationCenter="mobile"
	authors="piyushjo"
	manager="erikre"
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="web"
	ms.devlang="js"
	ms.topic="article"
	ms.date="06/07/2016"
	ms.author="piyushjo" />


# Azure Mobile Engagement Web SDK upgrade procedures

If you have already integrated an earlier version of the Azure Mobile Engagement Web SDK into your web application, you need to consider the following points when you upgrade the SDK.

If you skipped multiple versions of the Mobile Engagement Web SDK, you might need to complete several procedures during the upgrade process. For example, if you migrate from 1.4.0 to 1.6.0, first follow the procedures to upgrade from 1.4.0 to 1.5.0. Then, follow the procedures to upgrade from 1.5.0 to 1.6.0.

Whichever version you upgrade from, replace any earlier version of the file azure-engagement.js with the latest version of the file.

## Upgrade from 1.2.1 to 2.0.0

This section describes how to migrate a Mobile Engagement Web SDK integration from the Capptain service, offered by Capptain SAS, to an Azure Mobile Engagement app. If you are migrating from an earlier version, please consult the Capptain website to first migrate to 1.2.1, and then apply the following procedures.

This version of the Mobile Engagement Web SDK doesn't support Samsung Smart TV, Opera TV, webOS, or the Reach feature.

>[AZURE.IMPORTANT] Capptain and Azure Mobile Engagement are not the same service. The following procedure highlights only how to migrate the client app. Migrating the Mobile Engagement Web SDK in the app will not migrate your data from a Capptain server to a Mobile Engagement server.

### JavaScript files

Replace the file capptain-sdk.js with the file azure-engagement.js, and then update your script imports accordingly.

### Remove Capptain Reach

This version of the Mobile Engagement Web SDK doesn't support the Reach feature. If you integrated Capptain Reach into your application, you need to remove it.

Remove the Reach CSS import from your page and delete the related .css file (capptain-reach.css, by default).

Delete the following Reach resources: the close image (capptain-close.png, by default) and the brand icon (capptain-notification-icon, by default).

Remove the Reach UI for in-app notifications. The default layout looks like this:

	<!-- capptain notification -->
	<div id="capptain_notification_area" class="capptain_category_default">
	  <div class="icon">
	    <img src="capptain-notification-icon.png" alt="icon" />
	  </div>
	  <div class="content">
	    <div class="title" id="capptain_notification_title"></div>
	    <div class="message" id="capptain_notification_message"></div>
	  </div>
	  <div id="capptain_notification_image"></div>
	  <div>
	    <button id="capptain_notification_close">Close</button>
	  </div>
	</div>

Remove the Reach UI for text and web announcements and polls. The default layout looks like this:

	<div id="capptain_overlay" class="capptain_category_default">
	  <button id="capptain_overlay_close">x</button>
	  <div id="capptain_overlay_title"></div>
	  <div id="capptain_overlay_body"></div>
	  <div id="capptain_overlay_poll"></div>
	  <div id="capptain_overlay_buttons">
	    <button id="capptain_overlay_exit"></button>
	    <button id="capptain_overlay_action"></button>
	  </div>
	</div>

Remove the `reach` object from your configuration, if it exists. It looks like this:

	window.capptain = {
	  [...]
	  reach: {
	    [...]
	  }
	}

Remove any other Reach customization, such as categories.

### Remove deprecated APIs

Some APIs from Capptain are deprecated in the Mobile Engagement Web SDK.

Remove any calls to the following APIs: `agent.connect`, `agent.disconnect`, `agent.pause`, and `agent.sendMessageToDevice`.

Remove any instances of the following callbacks from your Capptain configuration: `onConnected`, `onDisconnected`, `onDeviceMessageReceived`, and `onPushMessageReceived`.

### Configuration

Mobile Engagement uses a connection string to configure SDK identifiers, for example, the application identifier.

Replace the application ID with your connection string. Note that the global object for the SDK configuration changes from `capptain` to `azureEngagement`.

Before migration:

	window.capptain = {
	  appId: ...,
	  [...]
	};

After migration:

	window.azureEngagement = {
	  connectionString: 'Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}',
	  [...]
	};

The connection string for your application is displayed in the Azure Portal.

### JavaScript APIs

The global JavaScript object `window.capptain` has been renamed `window.azureEngagement` but you can use the `window.engagement` alias for API calls. You can't use the alias to define the SDK configuration.

For instance, `capptain.deviceId` becomes `engagement.deviceId`, `capptain.agent.startActivity` becomes `engagement.agent.startActivity`, and so on.
