<properties 
	pageTitle="Create a new Application Insights resource" 
	description="Start monitoring a new application with a new instrumentation key" 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="keboyd"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/13/2015" 
	ms.author="awills"/>

# Create a new Application Insights resource

Visual Studio Application Insights displays data about your application in a Microsoft Azure *resource*. Creating a new resource is therefore part of [setting up Application Insights to monitor a new application][start]. In many cases, this can be done automatically by the IDE, and that's the recommended way where it's available. But in some cases, you create a resource manually.

After you have created the resource, you get its instrumentation key and use that to configure the SDK in the application. This sends the telemetry to the resource.

Examples where you want to create the resource manually include:

* There isn't a plug-in for [your IDE and platform][platforms]. 
* You want to [configure a web page][client] to send data to a separate resource.
* You want to configure an application to send data to different resources in different situations - for example during test.


## <a name="add"></a> Create an Application Insights resource


In the [Azure portal][portal], create a new Application Insights resource.  

![Click New, Application Insights](./media/app-insights-windows-get-started/01-new.png)

Your choice of application type sets the content of the Overview blade and the properties available in [metric explorer][metrics].

If your application type isn't available, try ASP.NET app.
    

## Copy  the Instrumentation Key.

![Click Properties, select the key, and press ctrl+C](./media/app-insights-windows-get-started/02-props.png)

## Configure your SDK

Use the instrumentation key to configure [the SDK that you install in your application][start].

This step depends heavily on the type of application you are working with. 


## <a name="monitor"></a>See monitor data

Return to your application blade in the Azure portal.

The first events will appear in Diagnostic Search. 

Click Refresh after a few seconds if you're expecting more data.




[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]


