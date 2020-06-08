---
title: Troubleshoot Application Insights in a Java web project
description: Troubleshooting guide - monitoring live Java apps with Application Insights.
ms.topic: conceptual
ms.date: 03/14/2019

---

# Troubleshooting and Q and A for Application Insights for Java
Questions or problems with [Azure Application Insights in Java][java]? Here are some tips.

## Build errors
**In Eclipse or Intellij Idea, when adding the Application Insights SDK via Maven or Gradle, I get build or checksum validation errors.**

* If the dependency `<version>` element is using a pattern with wildcard characters (e.g. (Maven) `<version>[2.0,)</version>` or (Gradle) `version:'2.0.+'`), try specifying a specific version instead like `2.0.1`. See the [release notes](https://github.com/Microsoft/ApplicationInsights-Java/releases) for the latest version.

## No data
**I added Application Insights successfully and ran my app, but I've never seen data in the portal.**

* Wait a minute and click Refresh. The charts refresh themselves periodically, but you can also refresh manually. The refresh interval depends on the time range of the chart.
* Check that you have an instrumentation key defined in the ApplicationInsights.xml file (in the resources folder in your project) or configured as Environment variable.
* Verify that there is no `<DisableTelemetry>true</DisableTelemetry>` node in the xml file.
* In your firewall, you might have to open TCP ports 80 and 443 for outgoing traffic to dc.services.visualstudio.com. See the [full list of firewall exceptions](../../azure-monitor/app/ip-addresses.md)
* In the Microsoft Azure start board, look at the service status map. If there are some alert indications, wait until they have returned to OK and then close and re-open your Application Insights application blade.
* [Turn on logging](#debug-data-from-the-sdk) by adding an `<SDKLogger />` element under the root node in the ApplicationInsights.xml file (in the resources folder in your project), and check for entries prefaced with AI: INFO/WARN/ERROR for any suspicious logs. 
* Make sure that the correct ApplicationInsights.xml file has been successfully loaded by the Java SDK, by looking at the console's output messages for a "Configuration file has been successfully found" statement.
* If the config file is not found, check the output messages to see where the config file is being searched for, and make sure that the ApplicationInsights.xml is located in one of those search locations. As a rule of thumb, you can place the config file near the Application Insights SDK JARs. For example: in Tomcat, this would mean the WEB-INF/classes folder. During development you can place ApplicationInsights.xml in resources folder of your web project.
* Please also look at [GitHub issues page](https://github.com/Microsoft/ApplicationInsights-Java/issues) for known issues with the SDK.
* Please ensure to use same version of Application Insights core, web, agent and logging appenders to avoid any version conflict issues.

#### I used to see data, but it has stopped
* Have you hit your monthly quota of data points? Open Settings/Quota and Pricing to find out. If so, you can upgrade your plan, or pay for additional capacity. See the [pricing scheme](https://azure.microsoft.com/pricing/details/application-insights/).
* Have you recently upgraded your SDK? Please ensure that only Unique SDK jars are present inside the project directory. There should not be two different versions of SDK present.
* Are you looking at the correct AI resource? Please match the iKey of your application to the resource where you are expecting telemetry. They should be the same.

#### I don't see all the data I'm expecting
* Open the Usage and estimated cost page and check whether [sampling](../../azure-monitor/app/sampling.md) is in operation. (100% transmission means that sampling isn't in operation.) The Application Insights service can be set to accept only a fraction of the telemetry that arrives from your app. This helps you keep within your monthly quota of telemetry.
* Do you have SDK Sampling turned on? If yes, data would be sampled at the rate specified for all the applicable types.
* Are you running an older version of Java SDK? Starting with version 2.0.1, we have introduced fault tolerance mechanism to handle intermittent network and backend failures as well as data persistence on local drives.
* Are you getting throttled due to excessive telemetry? If you turn on INFO logging, you will see a log message "App is throttled". Our current limit is 32k telemetry items/second.

### Java Agent cannot capture dependency data
* Have you configured Java agent by following [Configure Java Agent](java-agent.md) ?
* Make sure both the java agent jar and the AI-Agent.xml file are placed in the same folder.
* Make sure that the dependency you are trying to auto-collect is supported for auto collection. Currently we only support MySQL, MsSQL, Oracle DB and Azure Cache for Redis dependency collection.

## No usage data
**I see data about requests and response times, but no page view, browser, or user data.**

You successfully set up your app to send telemetry from the server. Now your next step is to [set up your web pages to send telemetry from the web browser][usage].

Alternatively, if your client is an app in a [phone or other device][platforms], you can send telemetry from there.

Use the same instrumentation key to set up both your client and server telemetry. The data will appear in the same Application Insights resource, and you'll be able to correlate events from client and server.


## Disabling telemetry
**How can I disable telemetry collection?**

In code:

```Java

    TelemetryConfiguration config = TelemetryConfiguration.getActive();
    config.setTrackingIsDisabled(true);
```

**Or**

Update ApplicationInsights.xml (in the resources folder in your project). Add the following under the root node:

```XML

    <DisableTelemetry>true</DisableTelemetry>
```

Using the XML method, you have to restart the application when you change the value.

## Changing the target
**How can I change which Azure resource my project sends data to?**

* [Get the instrumentation key of the new resource.][java]
* If you added Application Insights to your project using the Azure Toolkit for Eclipse, right click your web project, select **Azure**, **Configure Application Insights**, and change the key.
* If you had configured the Instrumentation Key as environment variable please update the value of the environment variable with new iKey.
* Otherwise, update the key in ApplicationInsights.xml in the resources folder in your project.

## Debug data from the SDK

**How can I find out what the SDK is doing?**

To get more information about what's happening in the API, add `<SDKLogger/>` under the root node of the ApplicationInsights.xml configuration file.

### ApplicationInsights.xml

You can also instruct the logger to output to a file:

```XML
  <SDKLogger type="FILE"><!-- or "CONSOLE" to print to stderr -->
    <Level>TRACE</Level>
    <UniquePrefix>AI</UniquePrefix>
    <BaseFolderPath>C:/agent/AISDK</BaseFolderPath>
</SDKLogger>
```

### Spring Boot Starter

To enable SDK logging with Spring Boot Apps using the Application Insights Spring Boot Starter, add the following to the `application.properties` file:

```yaml
azure.application-insights.logger.type=file
azure.application-insights.logger.base-folder-path=C:/agent/AISDK
azure.application-insights.logger.level=trace
```

or to print to standard error:

```yaml
azure.application-insights.logger.type=console
azure.application-insights.logger.level=trace
```

### Java Agent

To enable JVM Agent Logging update the [AI-Agent.xml file](java-agent.md):

```xml
<AgentLogger type="FILE"><!-- or "CONSOLE" to print to stderr -->
    <Level>TRACE</Level>
    <UniquePrefix>AI</UniquePrefix>
    <BaseFolderPath>C:/agent/AIAGENT</BaseFolderPath>
</AgentLogger>
```

### Java Command Line Properties
_Since version 2.4.0_

To enable logging using command line options, without changing configuration files:

```
java -Dapplicationinsights.logger.file.level=trace -Dapplicationinsights.logger.file.uniquePrefix=AI -Dapplicationinsights.logger.baseFolderPath="C:/my/log/dir" -jar MyApp.jar
```

or to print to standard error:

```
java -Dapplicationinsights.logger.console.level=trace -jar MyApp.jar
```

## The Azure start screen
**I'm looking at [the Azure portal](https://portal.azure.com). Does the map tell me something about my app?**

No, it shows the health of Azure servers around the world.

*From the Azure start board (home screen), how do I find data about my app?*

Assuming you [set up your app for Application Insights][java], click Browse, select Application Insights, and select the app resource you created for your app. To get there faster in future, you can pin your app to the start board.

## Intranet servers
**Can I monitor a server on my intranet?**

Yes, provided your server can send telemetry to the Application Insights portal through the public internet.

In your firewall, you might have to open TCP ports 80 and 443 for outgoing traffic to dc.services.visualstudio.com and f5.services.visualstudio.com.

## Data retention
**How long is data retained in the portal? Is it secure?**

See [Data retention and privacy][data].

## Debug logging
Application Insights uses `org.apache.http`. This is relocated within Application Insights core jars under the namespace `com.microsoft.applicationinsights.core.dependencies.http`. This enables Application Insights to handle scenarios where different versions of the same `org.apache.http` exist in one code base.

>[!NOTE]
>If you enable DEBUG level logging for all namespaces in the app, it will be honored by all executing modules including `org.apache.http` renamed as `com.microsoft.applicationinsights.core.dependencies.http`. Application Insights will not be able to apply filtering for these calls because the log call is being made by the Apache library. DEBUG level logging produce a considerable amount of log data and is not recommended for live production instances.


## Next steps
**I set up Application Insights for my Java server app. What else can I do?**

* [Monitor availability of your web pages][availability]
* [Monitor web page usage][usage]
* [Track usage and diagnose issues in your device apps][platforms]
* [Write code to track usage of your app][track]
* [Capture diagnostic logs][javalogs]

## Get help
* [Stack Overflow](https://stackoverflow.com/questions/tagged/ms-application-insights)
* [File an issue on GitHub](https://github.com/Microsoft/ApplicationInsights-Java/issues)

<!--Link references-->

[availability]: ../../azure-monitor/app/monitor-web-app-availability.md
[data]: ../../azure-monitor/app/data-retention-privacy.md
[java]: java-get-started.md
[javalogs]: java-trace-logs.md
[platforms]: ../../azure-monitor/app/platforms.md
[track]: ../../azure-monitor/app/api-custom-events-metrics.md
[usage]: javascript.md

