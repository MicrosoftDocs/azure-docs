<properties 
	pageTitle="Get started with Application Insights with Java in Eclipse" 
	description="Use the Eclipse plug-in to add performance and usage monitoring to your Java website with Application Insights" 
	services="application-insights" 
	authors="alancameronwills" 
	manager="kamrani"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="2015-03-02" 
	ms.author="awills"/>
 
# Get started with Application Insights with Java in Eclipse

The Application Insights SDK sends telemetry from your app so that you can analyze usage and performance.

The Application Insights Toolkit for Eclipse makes it quick and easy to add the SDK to your Java web applications. It provides a simpler alternative to manually configuring the SDK.

## Prerequisites

You'll need:

* Oracle JRE 1.6 or later
* A subscription to [Microsoft Azure](http://azure.microsoft.com/). (You could start with the [free trial](http://azure.microsoft.com/pricing/free-trial/).)
* [Eclipse IDE for Java EE Developers](http://www.eclipse.org/downloads/), Indigo or later.
* Windows 7 or later, or Windows Server 2008 or later

## Install the Application Insights toolkit

You only have to do this one time per machine.

1. In Eclipse, click Help, Install New Software.
    ![](./media/app-insights-java-eclipse/0-plugin.png)
2. The SDK is in http://dl.msopentech.com/eclipse, under Azure Toolkit. 
3. Uncheck **Contact all update sites...**
    ![](./media/app-insights-java-eclipse/1-plugin.png)

## Add Application Insights to your Java project


### Get an Application Insights instrumentation key

1. Log into the [Microsoft Azure Portal](https://portal.azure.com)
2. Create a new Application Insights resource

    ![Click + and choose Application Insights](./media/app-insights-java-get-started/01-create.png)
3. Set the application type to Java web application.

    ![Fill a name, choose Java web app, and click Create](./media/app-insights-java-get-started/02-create.png)
4. Find the instrumentation key of the new resource. You'll need to paste this into your code project shortly.

    ![In the new resource overview, click Properties and copy the Instrumentation Key](./media/app-insights-java-get-started/03-key.png)

## Add the SDK to your project

1. Invoke the toolkit on your project.
    ![In the new resource overview, click Properties and copy the Instrumentation Key](./media/app-insights-java-eclipse/4-addai.png)
2. Paste the instrumentation key that you got from the Azure portal.
    ![In the new resource overview, click Properties and copy the Instrumentation Key](./media/app-insights-java-eclipse/5-config.png)


The key is sent along with every item of telemetry and tells Application Insights to display it in your resource.

## Send telemetry from your server using the API

Insert a few lines of code in your Java web application to find out what users are doing with it. You can track events, metrics and exceptions.

#### Import the namespace

    import com.microsoft.applicationinsights.TelemetryClient;

#### Track metrics

Metrics are aggregated in the portal and displayed in graphical form. For example, to see the average score that users achieve in a game:

    TelemetryClient client = new TelemetryClient();
    client.trackMetric("Score", 2.1);

#### Track events

Events can be displayed on the portal as an aggregated count, and you can also display individual occurrences. For example, to see how many games have been won:

    TelemetryClient client = new TelemetryClient();
    client.trackEvent("WinGame");

#### Track exceptions

Exception telemetry allows you to see how often different types of exceptions have occurred. You can also investigate the stack trace of individual exceptions:


    TelemetryClient client = new TelemetryClient();

    try {
       ...
    } catch (Exception e) {
      client.trackException(e);
    }

#### Trace logs

You can [capture logs using your logging framework][javalogs] and search and filter the logs in Application Insights, along with custom events and exception reports. This is a powerful diagnostic tool.

Or you can use the Application Insights trace API directly:
    TelemetryClient client = new TelemetryClient();
    client.trackTrace ("Log entry");

#### Attach properties and measurements to telemetry

You can add property values to any of the above events and other types. As well as carrying extra data, the properties can be used to [filter][diagnostic] and [segment][metrics] the events in Application Insights. 

For example:

    TelemetryClient telemetry = new TelemetryClient();
    
    Map<String, String> properties = new HashMap<String, String>();
    properties.put("game", currentGame.getName());
    properties.put("difficulty", currentGame.getDifficulty());
    
    Map<String, Double> measurements = new HashMap<String, Double>();
    measurements.put("Score", currentGame.getScore());
    measurements.put("Opponents", currentGame.getOpponentCount());
    
    telemetry.trackEvent("WinGame", properties, measurements);

## View your results in Application Insights

Run your application.

Return to your Application Insights resource in Microsoft Azure.

Data will appear on the overview blade. (If it isn't there, wait a few seconds and then click Refresh.)

![Click through to more data](./media/appinsights/appinsights-gs-r-10-java.png)

Click through any chart to see more detailed metrics. [Learn more about metrics.][perf]

## Next steps

#### Detect and diagnose issues

* [Add web client telemetry][usage] to get performance telemetry from the web client.
* [Set up web tests][availability] to make sure your application stays live and responsive.
* [Search events and logs][diagnostic] to help diagnose problems.
* [Capture Log4J or Logback traces][javalogs]

#### Track usage

* [Add web client telemetry][usage] to monitor page views and basic user metrics.
* [Track custom events and metrics][track] to learn about how your application is used, both at the client and the server.


[AZURE.INCLUDE [app-insights-learn-more](../includes/app-insights-learn-more.md)]




