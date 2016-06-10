<properties
	pageTitle="Azure Mobile Engagement Web SDK Integration"
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

#How to Integrate Engagement in a Web Application

> [AZURE.SELECTOR]
- [Windows Universal](mobile-engagement-windows-store-integrate-engagement.md)
- [Windows Phone Silverlight](mobile-engagement-windows-phone-integrate-engagement.md)
- [iOS](mobile-engagement-ios-integrate-engagement.md)
- [Android](mobile-engagement-android-integrate-engagement.md)

This procedure describes the simplest way to activate Engagement's Analytics and Monitoring functions in your Web
application.

The following steps are enough to activates the report of logs needed to compute all statistics regarding Users, Sessions, Activities, Crashes and Technicals. The report of logs needed to compute other statistics like Events, Errors and Jobs must be done manually using the Engagement API (see [How to use the advanced Mobile Engagement tagging API in a Web application](mobile-engagement-web-use-engagement-api.md) since these statistics are application dependent.

## Introduction

Download the Web SDK from [here](http://aka.ms/P7b453).
The SDK is shipped as a single JavaScript file named **azure-engagement.js** that you have to include in
each page of your site or web application.

This script **MUST** be loaded **AFTER** a script or code snippet that you must write to configure Engagement for your application.

## Browser compatibility

The Engagement Web SDK uses native JSON encoding/decoding and cross domain AJAX requests (relying on the W3C CORS specification).

* Edge 12+
* IE 10+
* Firefox 3.5+
* Chrome 4+
* Safari 6+
* Opera 12+

## Configure Engagement

Write a script that creates a global **azureEngagement** JavaScript object like the following.
 
Since your site may contain multiples pages, this example assumes that this script is also included in every pages, we'll name it `azure-engagement-conf.js` in this procedure.

	window.azureEngagement = {
	  connectionString: 'Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}',
	  appVersionName: '1.0.0',
	  appVersionCode: 1
	};

The `connectionString` for your application is displayed on the Azure Portal. 

> [AZURE.NOTE] `appVersionName` and `appVersionCode` are optional, it's recommended to configure them in order for analytics to process version information.

## Include Engagement scripts in your pages

	<head>
	  ...
	  <script type="text/javascript" src="azure-engagement-conf.js"></script>
	  <script type="text/javascript" src="azure-engagement.js"></script>
	  ...
	</head>

Or

	<body>
	  ...
	  <script type="text/javascript" src="azure-engagement-conf.js"></script>
	  <script type="text/javascript" src="azure-engagement.js"></script>
	  ...
	</body>

## Alias

Once loaded the SDK script creates the **engagement** alias to access the SDK APIs (it can't be used to define the SDK configuration). This alias will be used as a reference in this documentation. 

Note that if the default alias is conflicting with another global variable from your page then you can redefine it in the configuration before loading the SDK as follow:

	window.azureEngagement = {
	  connectionString: 'Endpoint={appCollection}.{domain};AppId={appId};SdkKey={sdkKey}',
	  appVersionName: '1.0.0',
	  appVersionCode: 1
	  alias:'anotherAlias'
	};

## Basic reporting

### Session tracking

An Engagement session is divided into a sequence of activities identified by a name.

In a classic web site, we recommend that you declare a different activity on each page of your site. In a web site or web application that never changes the current page, you may want to track the activities in a finer way.

Either way, to start or change the current user activity, call the `engagement.agent.startActivity` function like in this example:

	<body onload="yourOnload()">

	<!-- -->

	yourOnload = function() {
      [...]
      engagement.agent.startActivity('welcome');
	};

An opened session will automatically be ended by the Engagement server within 3 minutes after the application page is closed.

Alternatively you can also end a session manually by calling `engagement.agent.endActivity`, this will set the current user activity as 'idle' and will actually end the session 10 seconds after that unless a new call to `engagement.agent.startActivity` resumes the session in the meantime.
 
This 10 seconds delay can be configured in the global **engagement** object:

	engagement.sessionTimeout = 2000; // 2 seconds
	// or
	engagement.sessionTimeout = 0; // end the session as soon as endActivity is called

> [AZURE.NOTE] `engagement.agent.endActivity` cannot be used in the `onunload` callback since Ajax calls are not possible at this stage.

## Advanced reporting

Optionally, if you want to report application specific `events`, `errors` and `jobs`, you need to use the Engagement API through the `engagement.agent` object. 

The Engagement API allows to use all of Engagement's advanced capabilities and is detailed in the [How to use the advanced Mobile Engagement tagging API in a Web application](mobile-engagement-web-use-engagement-api.md).

## Customize the URLs used for AJAX calls

You can customize URLs used by the SDK. For example to redefine the log URL (SDK endpoint for logging) you can override the configuration like this:

	window.azureEngagement = {
	  ...
	  urls: {
	    ...        
	    getLoggerUrl: function() {
	    return 'someProxy/log';
	    }
	  }
	};

If your URL functions return a string beginning with either `/`, `//`, `http://` or `https://`, the default scheme is not used.

By default, the `https://` scheme is used for those URLs. If you want to customize the default scheme then override the configuration like this:

	window.azureEngagement = {
	  ...
	  urls: {
        ...	     
	    scheme: '//'
	  }
	};
