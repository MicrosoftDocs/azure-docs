<properties 
	pageTitle="Troubleshoot Application Insights in a Java web project" 
	description="Troubleshooting guide and question and answer." 
	services="application-insights" 
    documentationCenter="java"
	authors="alancameronwills" 
	manager="keboyd"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/30/2015" 
	ms.author="awills"/>
 
# Troubleshooting and Q and A for Application Insights for Java

Questions or problems with [Visual Studio Application Insights in Java][java]? Here are some tips.


## Build errors

*In Eclipse, when adding the Application Insights SDK via Maven or Gradle, I get build or checksum validation errors.*

* If the dependency <version> element is using a pattern with wildcard characters (e.g. (Maven) `<version>[0.9,)</version>` or (Gradle) `version:'0.9.+'`), try specifying a specific version instead like `0.9.3`.

## No data 

*I added Application Insights successfully and ran my app, but I've never seen data in the portal.*

* Wait a minute and click Refresh. Currently, refresh isn't automatic.
* Check that you have an instrumentation key defined in the ApplicationInsights.xml file (in the resources folder in your project)
* Verify that there is no `<DisableTelemetry>true</DisableTelemetry>` node in the xml file.
* In your firewall, you might have to open TCP ports 80 and 443 for outgoing traffic to dc.services.visualstudio.com and f5.services.visualstudio.com.
* In the Microsoft Azure start board, look at the service status map. If there are some alert indications, wait until they have returned to OK and then close and re-open your Application Insights application blade.
* Turn on logging to the IDE console window, by adding an `<SDKLogger />` element under the root node in the ApplicationInsights.xml file (in the resources folder in your project), and check for entries prefaced with [Error].


#### I used to see data, but it has stopped

* Check the [status blog](http://blogs.msdn.com/b/applicationinsights-status/)



## No usage data

*I see data about requests and response times, but no page view, browser, or user data.*

You successfully set up your app to send telemetry from the server. Now your next step is to [set up your web pages to send telemetry from the web browser][usage].

Alternatively, if your client is an app in a [phone or other device][platforms], you can send telemetry from there. 

Use the same instrumentation key to set up both your client and server telemetry. The data will appear in the same Application Insights resource, and you'll be able to correlate events from client and server.



## Disabling telemetry

*How can I disable telemetry collection?*

In code:

    TelemetryConfiguration config = TelemetryConfiguration.getActive();
    config.setTrackingIsDisabled(true);


**Or** 

Update ApplicationInsights.xml (in the resources folder in your project). Add the following under the root node:

    <DisableTelemetry>true</DisableTelemetry>

Using the XML method, you have to restart the application when you change the value.

## Changing the target

*How can I change which Azure resource my project sends data to?*

* [Get the instrumentation key of the new resource.][java]
* If you added Application Insights to your project using the Azure Toolkit for Eclipse, right click your web project, select **Azure**, **Configure Application Insights**, and change the key.
* Otherwise, update the key in ApplicationInsights.xml in the resources folder in your project.


## The Azure start screen

*I'm looking at [the Azure portal](http://portal.azure.com). Does the map tell me something about my app?*

No, it shows the health of Azure servers around the world.

*From the Azure start board (home screen), how do I find data about my app?*

Assuming you [set up your app for Application Insights][java], click Browse, select Application Insights, and select the app resource you created for your app. To get there faster in future, you can pin your app to the start board.

## Intranet servers

*Can I monitor a server on my intranet?*

Yes, provided your server can send telemetry to the Application Insights portal through the public internet. 

In your firewall, you might have to open TCP ports 80 and 443 for outgoing traffic to dc.services.visualstudio.com and f5.services.visualstudio.com.

## Data retention 

*How long is data retained in the portal? Is it secure?*

See [Data retention and privacy][data].

## Next steps

*I set up Application Insights for my Java server app. What else can I do?*

* [Monitor availability of your web pages][availability]
* [Monitor web page usage][usage]
* [Track usage and diagnose issues in your device apps][platforms]
* [Write code to track usage of your app][track]
* [Capture diagnostic logs][javalogs]


## Get help

* [Stack Overflow](http://stackoverflow.com/questions/tagged/ms-application-insights)

<!--Link references-->

[availability]: app-insights-monitor-web-app-availability.md
[data]: app-insights-data-retention-privacy.md
[java]: app-insights-java-get-started.md
[javalogs]: app-insights-java-trace-logs.md
[platforms]: app-insights-platforms.md
[track]: app-insights-custom-events-metrics-api.md
[usage]: app-insights-web-track-usage.md

