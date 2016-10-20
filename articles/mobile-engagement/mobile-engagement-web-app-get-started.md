<properties
	pageTitle="Get started with Azure Mobile Engagement for Web Apps | Microsoft Azure"
	description="Learn how to use Azure Mobile Engagement with analytics and push notifications for Web Apps."
	services="mobile-engagement"
	documentationCenter="Mobile"
	authors="piyushjo"
	manager=""
	editor="" />

<tags
	ms.service="mobile-engagement"
	ms.workload="mobile"
	ms.tgt_pltfrm="na"
	ms.devlang="js"
	ms.topic="hero-article"
	ms.date="06/01/2016"
	ms.author="piyushjo" />

# Get started with Azure Mobile Engagement for Web Apps

[AZURE.INCLUDE [Hero tutorial switcher](../../includes/mobile-engagement-hero-tutorial-switcher.md)]

This topic shows you how to use Azure Mobile Engagement to understand your Web App usage.

This tutorial requires the following:

+ Visual Studio 2015 or any other editor of your choice
+ [Web SDK](http://aka.ms/P7b453) 

This Web SDK is in Preview and only supports Analytics at the moment and doesn't support sending browser or in-app push notifications yet. 

> [AZURE.NOTE] To complete this tutorial, you must have an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/?WT.mc_id=A0E0E5C02&amp;returnurl=http%3A%2F%2Fazure.microsoft.com%2Fen-us%2Fdocumentation%2Farticles%2Fmobile-engagement-web-app-get-started).

##Setup Mobile Engagement for your Web app

[AZURE.INCLUDE [Create Mobile Engagement App in Portal](../../includes/mobile-engagement-create-app-in-portal-new.md)]

##<a id="connecting-app"></a>Connect your app to the Mobile Engagement backend

This tutorial presents a "basic integration," which is the minimal set required to collect data.

We will create a basic web app with Visual Studio to demonstrate the integration though you can follow the steps with any web application created outside of Visual Studio also. 

###Create a new Web App

The following steps assume the use of Visual Studio 2015 though the steps are similar in earlier versions of Visual Studio. 

1. Start Visual Studio, and in the **Home** screen, select **New Project**.

2. In the pop-up, select **Web** -> **ASP.Net Web Application**. Fill in the app **Name**, **Location** and  **Solution name**, and then click **OK**.

3. In the **Select a template** popup, select **Empty** under **ASP.Net 4.5 Templates** and click **OK**. 

You have now created a new blank Web App project into which we will integrate the Azure Mobile Engagement Web SDK.

###Connect your app to Mobile Engagement backend

1. Create a new folder called **javascript** in your solution and add the Web SDK JS file **azure-engagement.js** into it. 

2. Add a new file called **main.js** in this javascript folder with the following code. Make sure to update the connection string. This `azureEngagement` object will be used to access Web SDK methods. 

		var azureEngagement = {
		    debug: true,
		    connectionString: 'xxxxx'
		};

	![Visual Studio with js files][1]

##Enable real-time monitoring

In order to start sending data and ensuring that the users are active, you must send at least one Activity to the Mobile Engagement backend. An activity in the context of a web app is a web page. 

1. Create a new page called **home.html** in your solution and set it as the starting page for your web app. 
2. Include the two javascripts we added earlier in this page by adding the following within the body tag. 

	    <script type="text/javascript" src="javascript/main.js"></script>
	    <script type="text/javascript" src="javascript/azure-engagement.js"></script>

3. Update the body tag to call EngagementAgent's `startActivity` method
		
		<body onload="engagement.agent.startActivity('Home')">

4. Here is what your **home.html** will look like
		
		<html>
		<head>
			...
		</head>
		<body onload="engagement.agent.startActivity('Home')">
		    <script type="text/javascript" src="javascript/main.js"></script>
		    <script type="text/javascript" src="javascript/azure-engagement.js"></script>
		</body>
		</html>

##Connect app with real-time monitoring

[AZURE.INCLUDE [Connect app with real-time monitoring](../../includes/mobile-engagement-connect-app-with-monitor.md)]

![][2]

##Extend analytics

Here are all the methods currently available with Web SDK that you can use for analytics:

1. Activities/Web pages:

		engagement.agent.startActivity(name);
		engagement.agent.endActivity();

2. Events
		
		engagement.agent.sendEvent(name, extras);

3. Errors

		engagement.agent.sendError(name, extras);

4. Jobs

		engagement.agent.startJob(name);
		engagement.agent.endJob(name);

<!-- Images. -->
[1]: ./media/mobile-engagement-web-app-get-started/visual-studio-solution-js.png
[2]: ./media/mobile-engagement-web-app-get-started/session.png

