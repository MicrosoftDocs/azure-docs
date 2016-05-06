<properties
	pageTitle="Azure Mobile Engagement Web SDK upgrade procedures"
	description="Latest updates and procedures for Web SDK for Azure Mobile Engagement"
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
	ms.date="02/29/2016"
	ms.author="piyushjo" />


# Upgrade procedures

If you already have integrated an older version of our SDK into your application, you have to consider the following points when upgrading the SDK.

You may have to follow several procedures if you missed several versions of the SDK. For example if you migrate from 1.4.0 to 1.6.0 you have to first follow the "from 1.4.0 to 1.5.0" procedure then the "from 1.5.0 to 1.6.0" procedure.

Whatever the version you upgrade from, you have to replace the `engagement-sdk.js` with the new one.

## From 1.2.1 to 2.0.0

The following describes how to migrate an SDK integration from the Capptain service offered by Capptain SAS into an app powered by Azure Mobile Engagement. If you are migrating from an earlier version, please consult the Capptain web site to migrate to 1.2.1 first and then apply the following procedure.

This version of the Engagement Web SDK doesn't support samsung-tv, OperaTV, webOS and the Reach feature. 

>[AZURE.IMPORTANT] Capptain and Mobile Engagement are not the same services, and the procedure given below only highlights how to migrate the client app. Migrating the SDK in the app will NOT migrate your data from the Capptain servers to the Mobile Engagement servers.

### JavaScript files

Replace the `capptain-sdk.js` file by the `engagement-sdk.js` file and update your script imports accordingly.

### Uninstall Capptain Reach

This version of Engagement Web SDK doesn't support the Reach feature, it needs to be uninstalled from your application.

Remove the Reach css import from your page and delete the related css file (capptain-reach.css by default).

Delete the Reach resources: the close image (capptain-close.png by default) and the brand icon (capptain-notification-icon by default).

Remove Reach UI for in-app notifications, the default layout looks like:

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

Remove Reach UI for text\web announcements and polls, the default layout looks like:

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

Remove the `reach` object from your configuration if any. It looks like the following:

	window.capptain = {
	  [...]
	  reach: {
	    [...]
	  }
	}

Remove any other Reach customization such as categories.

### Remove useless APIs

Some of the APIs from Capptain became useless in the Engagement version of the SDK.

Remove any call to the following APIs: `agent.connect`, `agent.disconnect`, `agent.pause`, `agent.sendMessageToDevice`.

Remove the following callbacks, if any, from your Capptain configuration: `onConnected`, `onDisconnected`, `onDeviceMessageReceived`, `onPushMessageReceived`.

### JavaScript APIs

Every occurrences of *capptain* has been renamed *engagement*. You have to do the same in your application. Basically the global JavaScript object `window.capptain` becomes `window.engagement`.

For instance: `capptain.deviceId` becomes `engagement.deviceId`, `capptain.agent.startActivity` becomes `engagement.agent.startActivity` etc ...

### Application ID

Now Engagement uses a connection string to configure the SDK identifiers such as the application identifier.

Replace the AppID by your connection string.

Before migration:

	window.capptain = {
	  appId: ...,
	  [...]
	};

After migration:

	window.engagement = {
	  connectionString: 'Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}',
	  [...]
	};

The connection string for your application is displayed on the Azure Portal.