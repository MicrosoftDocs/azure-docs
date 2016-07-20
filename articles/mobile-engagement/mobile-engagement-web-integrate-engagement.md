<properties
	pageTitle="Azure Mobile Engagement Web SDK integration | Microsoft Azure"
	description="The latest updates and procedures for the Azure Mobile Engagement Web SDK"
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

#Integrate Azure Mobile Engagement in a web application

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-integrate-engagement.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md)
- [iOS](mobile-engagement-ios-integrate-engagement.md)
- [Android](mobile-engagement-android-integrate-engagement.md)

The procedures in this article describe the simplest way to activate the analytics and monitoring functions in Azure Mobile Engagement in your web application.

Follow the steps to activate the log reports that are needed to compute all statistics about users, sessions, activities, crashes, and technicals. For application-dependent statistics, such as events, errors, and jobs, you must activate log reports manually by using the Azure Mobile Engagement API. For more information, learn [how to use the advanced Mobile Engagement tagging API in a web application](mobile-engagement-web-use-engagement-api.md).

## Introduction

[Download the Azure Mobile Engagement Web SDK](http://aka.ms/P7b453).
The Mobile Engagement Web SDK is shipped as a single JavaScript file, azure-engagement.js, which you have to include in each page of your site or web application.

> [AZURE.IMPORTANT] Before you run this script, you must run a script or code snippet that you write to configure Mobile Engagement for your application.

## Browser compatibility

The Mobile Engagement Web SDK uses native JSON encoding and decoding, in addition to cross-domain AJAX requests (relying on the W3C CORS specification). It's compatible with the following browsers:

* Microsoft Edge 12+
* Internet Explorer 10+
* Firefox 3.5+
* Chrome 4+
* Safari 6+
* Opera 12+

## Configure Mobile Engagement

Write a script that creates a global `azureEngagement` JavaScript object, as in the following example. Because your site might have multiples pages, this example assumes that this script is included in every page. In this example, the JavaScript object is named `azure-engagement-conf.js`.

	window.azureEngagement = {
	  connectionString: 'Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}',
	  appVersionName: '1.0.0',
	  appVersionCode: 1
	};

The `connectionString` value for your application is displayed in the Azure portal.

> [AZURE.NOTE] `appVersionName` and `appVersionCode` are optional. However, we recommend that you configure them so that analytics can process version information.

## Include Mobile Engagement scripts in your pages
Add Mobile Engagement scripts to your pages in one of the following ways:

	<head>
	  ...
	  <script type="text/javascript" src="azure-engagement-conf.js"></script>
	  <script type="text/javascript" src="azure-engagement.js"></script>
	  ...
	</head>

Or this:

	<body>
	  ...
	  <script type="text/javascript" src="azure-engagement-conf.js"></script>
	  <script type="text/javascript" src="azure-engagement.js"></script>
	  ...
	</body>

## Alias

After the Mobile Engagement Web SDK script is loaded, it creates the **engagement** alias to access the SDK APIs. You cannot use this alias to define the SDK configuration. This alias is used as a reference in this documentation.

Note that if the default alias conflicts with another global variable from your page, you can redefine it in the configuration as follows before you load the Mobile Engagement Web SDK:

	window.azureEngagement = {
	  connectionString: 'Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}',
	  appVersionName: '1.0.0',
	  appVersionCode: 1
	  alias:'anotherAlias'
	};

## Basic reporting

Basic reporting in Mobile Engagement covers session-level statistics, such as statistics about users, sessions, activities, and crashes.

### Session tracking

A Mobile Engagement session is divided into a sequence of activities, each identified by a name.

In a classic website, we recommend that you declare a different activity on each page of your site. For a website or web application in which the current page never changes, you might want to track the activities on a smaller scale, such as within the page.

Either way, to start or change the current user activity, call the `engagement.agent.startActivity` function. For example:

	<body onload="yourOnload()">

	<!-- -->

	yourOnload = function() {
      [...]
      engagement.agent.startActivity('welcome');
	};

The Mobile Engagement server automatically ends an open session within three minutes after the application page is closed.

Alternatively, you can end a session manually by calling `engagement.agent.endActivity`. This sets the current user activity to 'Idle.'  The session will end 10 seconds later unless a new call to `engagement.agent.startActivity` resumes the session.

You can configure the 10-second delay in the global engagement object, as follows:

	engagement.sessionTimeout = 2000; // 2 seconds
	// or
	engagement.sessionTimeout = 0; // end the session as soon as endActivity is called

> [AZURE.NOTE] You cannot use `engagement.agent.endActivity` in the `onunload` callback because you cannot make AJAX calls at this stage.

## Advanced reporting

Optionally, if you want to report application-specific events, errors, and jobs, you need to use the Mobile Engagement API. You access the Mobile Engagement API through the `engagement.agent` object.

You can access all of the advanced capabilities in Mobile Engagement in the Mobile Engagement API. The API is detailed in the article [How to use the advanced Mobile Engagement tagging API in a web application](mobile-engagement-web-use-engagement-api.md).

## Customize the URLs used for AJAX calls

You can customize URLs that the Mobile Engagement Web SDK uses. For example, to redefine the log URL (the SDK endpoint for logging), you can override the configuration like this:

	window.azureEngagement = {
	  ...
	  urls: {
	    ...        
	    getLoggerUrl: function() {
	    return 'someProxy/log';
	    }
	  }
	};

If your URL functions return a string that begins with `/`, `//`, `http://`, or `https://`, the default scheme is not used. By default, the `https://` scheme is used for those URLs. If you want to customize the default scheme, override the configuration, like this:

	window.azureEngagement = {
	  ...
	  urls: {
        ...	     
	    scheme: '//'
	  }
	};
