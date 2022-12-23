---
title: Use Application Insights Java 2.x
description: Learn how to use the Application Insights Java 2.x, including sending trace logs, monitoring dependencies, filtering telemetry, and measuring metrics.
ms.topic: conceptual
ms.date: 12/07/2022
ms.devlang: java
ms.custom: devx-track-java
ms.reviewer: mmcc
---

# Application Insights for Java 2.x

> [!CAUTION]
> This document applies to Application Insights Java 2.x, which is no longer recommended.
>
> Documentation for the latest version can be found at [Application Insights Java 3.x](./java-in-process-agent.md).

In this article, you'll learn how to use Application Insights Java 2.x. This article shows you how to: 

- Get started, including instrumenting requests, tracking dependencies, collecting performance counters, diagnosing performance issues and exceptions, and writing code to track what users do with your app
- Send trace logs to Application Insights and explore them using the Application Insights portal.
- Monitor dependencies, caught exceptions, and method execution times in Java web apps
- Filter telemetry in your Java web app
- Explore Linux system performance metrics in Application Insights by using collectd
- Measure metrics for JVM-based application code and export the data to your favorite monitoring systems by using Micrometer application monitoring

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Get started with Application Insights in a Java web project

In this section, you use the Application Insights SDK to instrument requests, track dependencies, and collect performance counters, diagnose performance issues and exceptions, and write code to  track what users do with your app.

Application Insights is an extensible analytics service for web developers that helps you understand the performance and usage of your live application. Application Insights supports Java apps running on Linux, Unix, or Windows.

### Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* A functioning Java application.

### Get an Application Insights instrumentation key

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the Azure portal, create an Application Insights resource. Set the application type to Java web application.

3. Find the instrumentation key of the new resource. You'll need to paste this key into your code project shortly.

    :::image type="content" source="./media/deprecated-java-2x/instrumentation-key-001.png" alt-text="Screenshot of the Overview pane for an Application Insights resource in the Azure portal. The screenshot shows the instrumentation key highlighted." lightbox="./media/deprecated-java-2x/instrumentation-key-001.png":::

### Add the Application Insights SDK for Java to your project

*Choose your project type.*

# [Maven](#tab/maven)

If your project is already set up to use Maven for build, merge the following code to your *pom.xml* file.

Then, refresh the project dependencies to get the binaries downloaded.

```xml
    <dependencies>
      <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>applicationinsights-web-auto</artifactId>
        <!-- or applicationinsights-web for manual web filter registration -->
        <!-- or applicationinsights-core for bare API -->
        <version>2.6.4</version>
      </dependency>
    </dependencies>
```

# [Gradle](#tab/gradle)

If your project is already set up to use Gradle for build, merge the following code to your *build.gradle* file.

Then refresh the project dependencies to get the binaries downloaded.

```gradle
    dependencies {
      compile group: 'com.microsoft.azure', name: 'applicationinsights-web-auto', version: '2.6.4'
      // or applicationinsights-web for manual web filter registration
      // or applicationinsights-core for bare API
    }
```

---

#### Questions
* *What's the relationship between the `-web-auto`, `-web` and `-core` components?*
  * `applicationinsights-web-auto` gives you metrics that track HTTP servlet request counts and response times,
    by automatically registering the Application Insights servlet filter at runtime.
  * `applicationinsights-web` also gives you metrics that track HTTP servlet request counts and response times,
    but requires manual registration of the Application Insights servlet filter in your application.
  * `applicationinsights-core` gives you just the bare API, for example, if your application isn't servlet-based.
  
* *How should I update the SDK to the latest version?*
  * As of November 2020, for monitoring Java applications we recommend using Application Insights Java 3.x. For more information on how to get started, see [Application Insights Java 3.x](./java-in-process-agent.md).

### Add an *ApplicationInsights.xml* file
Add *ApplicationInsights.xml* to the resources folder in your project, or make sure it's added to your project's deployment class path. Copy the following XML into it.

Replace the instrumentation key with the one that you got from the Azure portal.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsights xmlns="http://schemas.microsoft.com/ApplicationInsights/2013/Settings" schemaVersion="2014-05-30">

   <!-- The key from the portal: -->
   <InstrumentationKey>** Your instrumentation key **</InstrumentationKey>

   <!-- HTTP request component (not required for bare API) -->
   <TelemetryModules>
      <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebRequestTrackingTelemetryModule"/>
      <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebSessionTrackingTelemetryModule"/>
      <Add type="com.microsoft.applicationinsights.web.extensibility.modules.WebUserTrackingTelemetryModule"/>
   </TelemetryModules>

   <!-- Events correlation (not required for bare API) -->
   <!-- These initializers add context data to each event -->
   <TelemetryInitializers>
      <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebOperationIdTelemetryInitializer"/>
      <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebOperationNameTelemetryInitializer"/>
      <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebSessionTelemetryInitializer"/>
      <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebUserTelemetryInitializer"/>
      <Add type="com.microsoft.applicationinsights.web.extensibility.initializers.WebUserAgentTelemetryInitializer"/>
   </TelemetryInitializers>

</ApplicationInsights>
```

Optionally, the configuration file can be in any location accessible to your application.  The system property `-Dapplicationinsights.configurationDirectory` specifies the directory that contains *ApplicationInsights.xml*. For example, a configuration file located at `E:\myconfigs\appinsights\ApplicationInsights.xml` would be configured with the property `-Dapplicationinsights.configurationDirectory="E:\myconfigs\appinsights"`.

* The instrumentation key is sent along with every item of telemetry and tells Application Insights to display it in your resource.
* The HTTP Request component is optional. It automatically sends telemetry about requests and response times to the portal.
* Event correlation is an addition to the HTTP request component. It assigns an identifier to each request received by the server. It then adds this identifier as a property to every item of telemetry as the property 'Operation.Id'. It allows you to correlate the telemetry associated with each request by setting a filter in [diagnostic search][diagnostic].

#### Alternative ways to set the instrumentation key
Application Insights SDK looks for the key in this order:

1. System property: -DAPPINSIGHTS_INSTRUMENTATIONKEY=your_ikey
2. Environment variable: APPINSIGHTS_INSTRUMENTATIONKEY
3. Configuration file: *ApplicationInsights.xml*

You can also [set it in code](./api-custom-events-metrics.md#ikey):

```java
    String instrumentationKey = "00000000-0000-0000-0000-000000000000";

    if (instrumentationKey != null)
    {
        TelemetryConfiguration.getActive().setInstrumentationKey(instrumentationKey);
    }
```

### Add agent

[Install the Java Agent](#monitor-dependencies-caught-exceptions-and-method-execution-times-in-java-web-apps) to capture outgoing HTTP calls, JDBC queries, application logging,
and better operation naming.

### Run your application
Either run it in debug mode on your development machine, or publish to your server.

### View your telemetry in Application Insights
Return to your Application Insights resource in [Microsoft Azure portal](https://portal.azure.com).

HTTP requests data appears on the overview pane. (If it isn't there, wait a few seconds and then click Refresh.)

:::image type="content" source="./media/deprecated-java-2x/overview-graphs.png" alt-text="Screenshot of overview sample data." lightbox="./media/deprecated-java-2x/overview-graphs.png":::

[Learn more about metrics.][metrics]

Click through any chart to see more detailed aggregated metrics.

:::image type="content" source="./media/deprecated-java-2x/006-barcharts.png" alt-text="Screenshot that shows Application Insights failures pane with charts." lightbox="./media/deprecated-java-2x/006-barcharts.png":::

#### Instance data
Click through a specific request type to see individual instances.

:::image type="content" source="./media/deprecated-java-2x/007-instance.png" alt-text="Screenshot that shows drilling into a specific sample view." lightbox="./media/deprecated-java-2x/007-instance.png":::

#### Analytics: Powerful query language
As you accumulate more data, you can run queries both to aggregate data and to find individual instances.  [Analytics](../logs/log-query-overview.md) is a powerful tool for both for understanding performance and usage, and for diagnostic purposes.

:::image type="content" source="./media/deprecated-java-2x/0025.png" alt-text="Screenshot that shows an example of Analytics in the Azure portal." lightbox="./media/deprecated-java-2x/0025.png":::

### Install your app on the server
Now publish your app to the server, let people use it, and watch the telemetry show up on the portal.

* Make sure your firewall allows your application to send telemetry to these ports:

  * dc.services.visualstudio.com:443
  * f5.services.visualstudio.com:443

* If outgoing traffic must be routed through a firewall, define system properties `http.proxyHost` and `http.proxyPort`.

* On Windows servers, install:

  * [Microsoft Visual C++ Redistributable](https://www.microsoft.com/download/details.aspx?id=40784)

    (This component enables performance counters.)

### Azure App Service, AKS, VMs config

The best and easiest approach to monitor your applications running on any of Azure resource providers is to use
[Application Insights Java 3.x](./java-in-process-agent.md).


### Exceptions and request failures
Unhandled exceptions and request failures are automatically collected by the Application Insights web filter.

To collect data on other exceptions, you can [insert calls to trackException() in your code][apiexceptions].

### Monitor method calls and external dependencies
[Install the Java Agent](#monitor-dependencies-caught-exceptions-and-method-execution-times-in-java-web-apps) to log specified internal methods and calls made through JDBC, with timing data.

And for automatic operation naming.

### W3C distributed tracing

The Application Insights Java SDK now supports [W3C distributed tracing](https://w3c.github.io/trace-context/).

The incoming SDK configuration is explained further in our article on [correlation](correlation.md).

Outgoing SDK configuration is defined in the [AI-Agent.xml](#monitor-dependencies-caught-exceptions-and-method-execution-times-in-java-web-apps) file.

### Performance counters
Open **Investigate**, **Metrics**, to see a range of performance counters.

:::image type="content" source="./media/deprecated-java-2x/011-perf-counters.png" alt-text="Screenshot of the Metrics pane for an Application Insights resource in the Azure portal. The screenshot shows process private bytes selected." lightbox="./media/deprecated-java-2x/011-perf-counters.png":::

#### Customize performance counter collection
To disable collection of the standard set of performance counters, add the following code under the root node of the *ApplicationInsights.xml* file:

```xml
    <PerformanceCounters>
       <UseBuiltIn>False</UseBuiltIn>
    </PerformanceCounters>
```

#### Collect additional performance counters
You can specify additional performance counters to be collected.

##### JMX counters (exposed by the Java Virtual Machine)

```xml
    <PerformanceCounters>
      <Jmx>
        <Add objectName="java.lang:type=ClassLoading" attribute="TotalLoadedClassCount" displayName="Loaded Class Count"/>
        <Add objectName="java.lang:type=Memory" attribute="HeapMemoryUsage.used" displayName="Heap Memory Usage-used" type="composite"/>
      </Jmx>
    </PerformanceCounters>
```

* `displayName` – The name displayed in the Application Insights portal.
* `objectName` – The JMX object name.
* `attribute` – The attribute of the JMX object name to fetch
* `type` (optional) - The type of JMX object's attribute:
  * Default: a simple type such as int or long.
  * `composite`: the perf counter data is in the format of 'Attribute.Data'
  * `tabular`: the perf counter data is in the format of a table row

##### Windows performance counters
Each [Windows performance counter](/windows/win32/perfctrs/performance-counters-portal) is a member of a category (in the same way that a field is a member of a class). Categories can either be global, or can have numbered or named instances.

```xml
    <PerformanceCounters>
      <Windows>
        <Add displayName="Process User Time" categoryName="Process" counterName="%User Time" instanceName="__SELF__" />
        <Add displayName="Bytes Printed per Second" categoryName="Print Queue" counterName="Bytes Printed/sec" instanceName="Fax" />
      </Windows>
    </PerformanceCounters>
```

* displayName – The name displayed in the Application Insights portal.
* categoryName – The performance counter category (performance object) with which this performance counter is associated.
* counterName – The name of the performance counter.
* instanceName – The name of the performance counter category instance, or an empty string (""), if the category contains a single instance. If the categoryName is Process, and the performance counter you'd like to collect is from the current JVM process on which your app is running, specify `"__SELF__"`.

#### Unix performance counters
* [Install collectd with the Application Insights plugin](#collectd-linux-performance-metrics-in-application-insights-deprecated) to get a wide variety of system and network data.

### Get user and session data
OK, you're sending telemetry from your web server. Now to get the full 360-degree view of your application, you can add more monitoring:

* [Add telemetry to your web pages][usage] to monitor page views and user metrics.
* [Set up web tests][availability] to make sure your application stays live and responsive.

### Send your own telemetry
Now that you've installed the SDK, you can use the API to send your own telemetry.

* [Track custom events and metrics][api] to learn what users are doing with your application.
* [Search events and logs][diagnostic] to help diagnose problems.

### Availability web tests
Application Insights can test your website at regular intervals to check that it's up and responding well.

[Learn more about how to set up availability web tests.][availability]

### Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/java-2x-troubleshoot).

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Explore Java trace logs in Application Insights

If you're using Logback or Log4J (v1.2 or v2.0) for tracing, you can have your trace logs sent automatically to Application Insights where you can explore and search on them.

> [!TIP]
> You only need to set your Application Insights Instrumentation Key once for your application. If you are using a framework like Java Spring, you may have already registered the key elsewhere in your app's configuration.

### Using the Application Insights Java agent

By default, the Application Insights Java agent automatically captures logging performed at `WARN` level and above.

You can change the threshold of logging that is captured using the `AI-Agent.xml` file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsightsAgent>
   <Instrumentation>
      <BuiltIn>
         <Logging threshold="info"/>
      </BuiltIn>
   </Instrumentation>
</ApplicationInsightsAgent>
```

You can disable the Java agent's logging capture using the `AI-Agent.xml` file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsightsAgent>
   <Instrumentation>
      <BuiltIn>
         <Logging enabled="false"/>
      </BuiltIn>
   </Instrumentation>
</ApplicationInsightsAgent>
```

### Alternatively (as opposed to using the Java agent), you can follow the instructions below

#### Install the Java SDK

Follow the instructions to install [Application Insights SDK for Java][java], if you haven't already done that.

#### Add logging libraries to your project
*Choose the appropriate way for your project.*

##### If you're using Maven...
If your project is already set up to use Maven for build, merge one of the following snippets of code into your pom.xml file.

Then refresh the project dependencies, to get the binaries downloaded.

*Logback*

```xml

    <dependencies>
       <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>applicationinsights-logging-logback</artifactId>
          <version>[2.0,)</version>
       </dependency>
    </dependencies>
```

*Log4J v2.0*

```xml

    <dependencies>
       <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>applicationinsights-logging-log4j2</artifactId>
          <version>[2.0,)</version>
       </dependency>
    </dependencies>
```

*Log4J v1.2*

```xml

    <dependencies>
       <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>applicationinsights-logging-log4j1_2</artifactId>
          <version>[2.0,)</version>
       </dependency>
    </dependencies>
```

##### If you're using Gradle...
If your project is already set up to use Gradle for build, add one of the following lines to the `dependencies` group in your build.gradle file:

Then refresh the project dependencies, to get the binaries downloaded.

**Logback**

```

    compile group: 'com.microsoft.azure', name: 'applicationinsights-logging-logback', version: '2.0.+'
```

**Log4J v2.0**

```
    compile group: 'com.microsoft.azure', name: 'applicationinsights-logging-log4j2', version: '2.0.+'
```

**Log4J v1.2**

```
    compile group: 'com.microsoft.azure', name: 'applicationinsights-logging-log4j1_2', version: '2.0.+'
```

##### Otherwise ...
Follow the guidelines to manually install Application Insights Java SDK, download the jar (After arriving at Maven Central Page click on 'jar' link in download section) for appropriate appender and add the downloaded appender jar to the project.

| Logger | Download | Library |
| --- | --- | --- |
| Logback |[Logback appender Jar](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22applicationinsights-logging-logback%22) |applicationinsights-logging-logback |
| Log4J v2.0 |[Log4J v2 appender Jar](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22applicationinsights-logging-log4j2%22) |applicationinsights-logging-log4j2 |
| Log4j v1.2 |[Log4J v1.2 appender Jar](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22applicationinsights-logging-log4j1_2%22) |applicationinsights-logging-log4j1_2 |


#### Add the appender to your logging framework
To start getting traces, merge the relevant snippet of code to the Log4J or Logback configuration file: 

*Logback*

```xml

    <appender name="aiAppender" 
      class="com.microsoft.applicationinsights.logback.ApplicationInsightsAppender">
        <instrumentationKey>[APPLICATION_INSIGHTS_KEY]</instrumentationKey>
    </appender>
    <root level="trace">
      <appender-ref ref="aiAppender" />
    </root>
```

*Log4J v2.0*

```xml

    <Configuration packages="com.microsoft.applicationinsights.log4j.v2">
      <Appenders>
        <ApplicationInsightsAppender name="aiAppender" instrumentationKey="[APPLICATION_INSIGHTS_KEY]" />
      </Appenders>
      <Loggers>
        <Root level="trace">
          <AppenderRef ref="aiAppender"/>
        </Root>
      </Loggers>
    </Configuration>
```

*Log4J v1.2*

```xml

    <appender name="aiAppender" 
         class="com.microsoft.applicationinsights.log4j.v1_2.ApplicationInsightsAppender">
        <param name="instrumentationKey" value="[APPLICATION_INSIGHTS_KEY]" />
    </appender>
    <root>
      <priority value ="trace" />
      <appender-ref ref="aiAppender" />
    </root>
```

The Application Insights appenders can be referenced by any configured logger, and not necessarily by the root logger (as shown in the code samples above).

### Explore your traces in the Application Insights portal
Now that you've configured your project to send traces to Application Insights, you can view and search these traces in the Application Insights portal, in the [Search][diagnostic] pane.

Exceptions submitted via loggers will be displayed on the portal as Exception Telemetry.

:::image type="content" source="./media/deprecated-java-2x/01-diagnostics.png" alt-text="Screenshot of the Search pane for an Application Insights resource in the Azure portal." lightbox="./media/deprecated-java-2x/01-diagnostics.png":::

## Monitor dependencies, caught exceptions, and method execution times in Java web apps

If you have [instrumented your Java web app with Application Insights SDK][javaagent], you can use the Java Agent to get deeper insights, without any code changes:

* **Dependencies:** Data about calls that your application makes to other components, including:
  * **Outgoing HTTP calls** made via Apache HttpClient, OkHttp, and `java.net.HttpURLConnection` are captured.
  * **Redis calls** made via the Jedis client are captured.
  * **JDBC queries** - For MySQL and PostgreSQL, if the call takes longer than 10 seconds, the agent reports the query plan.

* **Application logging:** Capture and correlate your application logs with HTTP requests and other telemetry
  * **Log4j 1.2**
  * **Log4j2**
  * **Logback**

* **Better operation naming:** (used for aggregation of requests in the portal)
  * **Spring** - based on `@RequestMapping`.
  * **JAX-RS** - based on `@Path`. 

To use the Java agent, you install it on your server. Your web apps must be instrumented with the [Application Insights Java SDK][javaagent]. 

### Install the Application Insights agent for Java
1. On the machine running your Java server, [download the 2.x agent](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/2.6.4). Please make sure the version of the 2.x Java Agent that you use matches the version of the 2.x Application Insights Java SDK that you use.
2. Edit the application server startup script, and add the following JVM argument:
   
    `-javaagent:<full path to the agent JAR file>`
   
    For example, in Tomcat on a Linux machine:
   
    `export JAVA_OPTS="$JAVA_OPTS -javaagent:<full path to agent JAR file>"`
3. Restart your application server.

### Configure the agent
Create a file named `AI-Agent.xml` and place it in the same folder as the agent JAR file.

Set the content of the xml file. Edit the following example to include or omit the features you want.

```xml
<?xml version="1.0" encoding="utf-8"?>
<ApplicationInsightsAgent>
   <Instrumentation>
      <BuiltIn enabled="true">

         <!-- capture logging via Log4j 1.2, Log4j2, and Logback, default is true -->
         <Logging enabled="true" />

         <!-- capture outgoing HTTP calls performed through Apache HttpClient, OkHttp,
              and java.net.HttpURLConnection, default is true -->
         <HTTP enabled="true" />

         <!-- capture JDBC queries, default is true -->
         <JDBC enabled="true" />

         <!-- capture Redis calls, default is true -->
         <Jedis enabled="true" />

         <!-- capture query plans for JDBC queries that exceed this value (MySQL, PostgreSQL),
              default is 10000 milliseconds -->
         <MaxStatementQueryLimitInMS>1000</MaxStatementQueryLimitInMS>

      </BuiltIn>
   </Instrumentation>
</ApplicationInsightsAgent>
```

### Additional config (Spring Boot)

`java -javaagent:/path/to/agent.jar -jar path/to/TestApp.jar`

For Azure App Services, do the following:

* Select Settings > Application Settings
* Under App Settings, add a new key value pair:

Key: `JAVA_OPTS`
Value: `-javaagent:D:/home/site/wwwroot/applicationinsights-agent-2.6.4.jar`

The agent must be packaged as a resource in your project such that it ends up in the D:/home/site/wwwroot/ directory. You can confirm that your agent is in the correct App Service directory by going to **Development Tools** > **Advanced Tools** > **Debug Console** and examining the contents of the site directory.    

* Save the settings and Restart your app. (These steps only apply to App Services running on Windows.)

> [!NOTE]
> AI-Agent.xml and the agent jar file should be in the same folder. They are often placed together in the `/resources` folder of the project.  

##### Enable W3C distributed tracing

Add the following to AI-Agent.xml:

```xml
<Instrumentation>
   <BuiltIn enabled="true">
      <HTTP enabled="true" W3C="true" enableW3CBackCompat="true"/>
   </BuiltIn>
</Instrumentation>
```

> [!NOTE]
> Backward compatibility mode is enabled by default and the enableW3CBackCompat parameter is optional and should be used only when you want to turn it off. 

Ideally this would be the case when all your services have been updated to newer version of SDKs supporting W3C protocol. It is highly recommended to move to newer version of SDKs with W3C support as soon as possible.

Make sure that **both [incoming](correlation.md#enable-w3c-distributed-tracing-support-for-java-apps) and outgoing (agent) configurations** are exactly same.

### View the data
In the Application Insights resource, aggregated remote dependency and method execution times appear [under the Performance tile][metrics].

To search for individual instances of dependency, exception, and method reports, open [Search][diagnostic].

[Diagnosing dependency issues - learn more](./asp-net-dependencies.md#diagnosis).

### Questions? Problems?
* No data? [Set firewall exceptions](./ip-addresses.md)
* [Troubleshooting Java](java-2x-troubleshoot.md)

## Filter telemetry in your Java web app

Filters provide a way to select the telemetry that your [Java web app sends to Application Insights](#get-started-with-application-insights-in-a-java-web-project). There are some out-of-the-box filters that you can use, and you can also write your own custom filters.

The out-of-the-box filters include:

* Trace severity level
* Specific URLs, keywords or response codes
* Fast responses - that is, requests to which your app responded to quickly
* Specific event names

> [!NOTE]
> Filters skew the metrics of your app. For example, you might decide that, in order to diagnose slow responses, you will set a filter to discard fast response times. But you must be aware that the average response times reported by Application Insights will then be slower than the true speed, and the count of requests will be smaller than the real count.
> If this is a concern, use [Sampling](./sampling.md) instead.

### Setting filters

In ApplicationInsights.xml, add a `TelemetryProcessors` section like this example:


```xml

    <ApplicationInsights>
      <TelemetryProcessors>

        <BuiltInProcessors>
           <Processor type="TraceTelemetryFilter">
                  <Add name="FromSeverityLevel" value="ERROR"/>
           </Processor>

           <Processor type="RequestTelemetryFilter">
                  <Add name="MinimumDurationInMS" value="100"/>
                  <Add name="NotNeededResponseCodes" value="200-400"/>
           </Processor>

           <Processor type="PageViewTelemetryFilter">
                  <Add name="DurationThresholdInMS" value="100"/>
                  <Add name="NotNeededNames" value="home,index"/>
                  <Add name="NotNeededUrls" value=".jpg,.css"/>
           </Processor>

           <Processor type="TelemetryEventFilter">
                  <!-- Names of events we don't want to see -->
                  <Add name="NotNeededNames" value="Start,Stop,Pause"/>
           </Processor>

           <!-- Exclude telemetry from availability tests and bots -->
           <Processor type="SyntheticSourceFilter">
                <!-- Optional: specify which synthetic sources,
                     comma-separated
                     - default is all synthetics -->
                <Add name="NotNeededSources" value="Application Insights Availability Monitoring,BingPreview"
           </Processor>

        </BuiltInProcessors>

        <CustomProcessors>
          <Processor type="com.fabrikam.MyFilter">
            <Add name="Successful" value="false"/>
          </Processor>
        </CustomProcessors>

      </TelemetryProcessors>
    </ApplicationInsights>

```

[Inspect the full set of built-in processors](https://github.com/microsoft/ApplicationInsights-Java/tree/main/agent/agent-tooling/src/main/java/com/microsoft/applicationinsights/agent/internal).

### Built-in filters

#### Metric Telemetry filter

```xml

           <Processor type="MetricTelemetryFilter">
                  <Add name="NotNeeded" value="metric1,metric2"/>
           </Processor>
```

* `NotNeeded` - Comma-separated list of custom metric names.


#### Page View Telemetry filter

```xml

           <Processor type="PageViewTelemetryFilter">
                  <Add name="DurationThresholdInMS" value="500"/>
                  <Add name="NotNeededNames" value="page1,page2"/>
                  <Add name="NotNeededUrls" value="url1,url2"/>
           </Processor>
```

* `DurationThresholdInMS` - Duration refers to the time taken to load the page. If this is set, pages that loaded faster than this time are not reported.
* `NotNeededNames` - Comma-separated list of page names.
* `NotNeededUrls` - Comma-separated list of URL fragments. For example, `"home"` filters out all pages that have "home" in the URL.


#### Request Telemetry Filter


```xml

           <Processor type="RequestTelemetryFilter">
                  <Add name="MinimumDurationInMS" value="500"/>
                  <Add name="NotNeededResponseCodes" value="page1,page2"/>
                  <Add name="NotNeededUrls" value="url1,url2"/>
           </Processor>
```



#### Synthetic Source filter

Filters out all telemetry that have values in the SyntheticSource property. These include requests from bots, spiders and availability tests.

Filter out telemetry for all synthetic requests:


```xml

           <Processor type="SyntheticSourceFilter" />
```

Filter out telemetry for specific synthetic sources:


```xml

           <Processor type="SyntheticSourceFilter" >
                  <Add name="NotNeeded" value="source1,source2"/>
           </Processor>
```

* `NotNeeded` - Comma-separated list of synthetic source names.

#### Telemetry Event filter

Filters custom events (logged using [TrackEvent()](./api-custom-events-metrics.md#trackevent)).


```xml

           <Processor type="TelemetryEventFilter" >
                  <Add name="NotNeededNames" value="event1, event2"/>
           </Processor>
```


* `NotNeededNames` - Comma-separated list of event names.


#### Trace Telemetry filter

Filters log traces (logged using [TrackTrace()](./api-custom-events-metrics.md#tracktrace) or a [logging framework collector](#explore-java-trace-logs-in-application-insights)).

```xml

           <Processor type="TraceTelemetryFilter">
                  <Add name="FromSeverityLevel" value="ERROR"/>
           </Processor>
```

* `FromSeverityLevel` valid values are:
  *  OFF             - Filter out ALL traces
  *  TRACE           - No filtering. equals to Trace level
  *  INFO            - Filter out TRACE level
  *  WARN            - Filter out TRACE and INFO
  *  ERROR           - Filter out WARN, INFO, TRACE
  *  CRITICAL        - filter out all but CRITICAL


### Custom filters

#### 1. Code your filter

In your code, create a class that implements `TelemetryProcessor`:

```Java

    package com.fabrikam.MyFilter;
    import com.microsoft.applicationinsights.extensibility.TelemetryProcessor;
    import com.microsoft.applicationinsights.telemetry.Telemetry;

    public class SuccessFilter implements TelemetryProcessor {

        /* Any parameters that are required to support the filter.*/
        private final String successful;

        /* Initializers for the parameters, named "setParameterName" */
        public void setNotNeeded(String successful)
        {
            this.successful = successful;
        }

        /* This method is called for each item of telemetry to be sent.
           Return false to discard it.
           Return true to allow other processors to inspect it. */
        @Override
        public boolean process(Telemetry telemetry) {
            if (telemetry == null) { return true; }
            if (telemetry instanceof RequestTelemetry)
            {
                RequestTelemetry requestTelemetry = (RequestTelemetry)    telemetry;
                return request.getSuccess() == successful;
            }
            return true;
        }
    }

```

#### 2. Invoke your filter in the configuration file

In ApplicationInsights.xml:

```xml


    <ApplicationInsights>
      <TelemetryProcessors>
        <CustomProcessors>
          <Processor type="com.fabrikam.SuccessFilter">
            <Add name="Successful" value="false"/>
          </Processor>
        </CustomProcessors>
      </TelemetryProcessors>
    </ApplicationInsights>

```

#### 3. Invoke your filter (Java Spring)

For applications based on the Spring framework, custom telemetry processors must be registered in your main application class as a bean. They will then be autowired when the application starts.

```Java
@Bean
public TelemetryProcessor successFilter() {
      return new SuccessFilter();
}
```

You will need to create your own filter parameters in `application.properties` and leverage Spring Boot's externalized configuration framework to pass those parameters into your custom filter. 


### Troubleshooting

*My filter isn't working.*

* Check that you have provided valid parameter values. For example, durations should be integers. Invalid values will cause the filter to be ignored. If your custom filter throws an exception from a constructor or set method, it will be ignored.

## collectd: Linux performance metrics in Application Insights [Deprecated]

To explore Linux system performance metrics in [Application Insights](./app-insights-overview.md), install [collectd](https://collectd.org/), together with its Application Insights plug-in. This open-source solution gathers various system and network statistics.

Typically you'll use collectd if you have already [instrumented your Java web service with Application Insights][java]. It gives you more data to help you to enhance your app's performance or diagnose problems. 

### Get your instrumentation key
In the [Microsoft Azure portal](https://portal.azure.com), open the [Application Insights](./app-insights-overview.md) resource where you want the data to appear. (Or [create a new resource](./create-new-resource.md).)

Take a copy of the instrumentation key, which identifies the resource.

:::image type="content" source="./media/deprecated-java-2x/instrumentation-key-001.png" alt-text="Screenshot of the Overview pane for an Application Insights resource in the Azure portal. The screenshot shows the instrumentation key highlighted." lightbox="./media/deprecated-java-2x/instrumentation-key-001.png":::

### Install collectd and the plug-in
On your Linux server machines:

1. Install [collectd](https://collectd.org/) version 5.4.0 or later.
2. Download the [Application Insights collectd writer plugin](https://github.com/microsoft/ApplicationInsights-Java/tree/main/agent/agent-tooling/src/main/java/com/microsoft/applicationinsights/agent/internal). Note the version number.
3. Copy the plugin JAR into `/usr/share/collectd/java`.
4. Edit `/etc/collectd/collectd.conf`:
   * Ensure that [the Java plugin](https://collectd.org/wiki/index.php/Plugin:Java) is enabled.
   * Update the JVMArg for the java.class.path to include the following JAR. Update the version number to match the one you downloaded:
   * `/usr/share/collectd/java/applicationinsights-collectd-1.0.5.jar`
   * Add this snippet, using the Instrumentation Key from your resource:

```xml

     LoadPlugin "com.microsoft.applicationinsights.collectd.ApplicationInsightsWriter"
     <Plugin ApplicationInsightsWriter>
        InstrumentationKey "Your key"
     </Plugin>
```

Here's part of a sample configuration file:

```xml

    ...
    # collectd plugins
    LoadPlugin cpu
    LoadPlugin disk
    LoadPlugin load
    ...

    # Enable Java Plugin
    LoadPlugin "java"

    # Configure Java Plugin
    <Plugin "java">
      JVMArg "-verbose:jni"
      JVMArg "-Djava.class.path=/usr/share/collectd/java/applicationinsights-collectd-1.0.5.jar:/usr/share/collectd/java/collectd-api.jar"

      # Enabling Application Insights plugin
      LoadPlugin "com.microsoft.applicationinsights.collectd.ApplicationInsightsWriter"

      # Configuring Application Insights plugin
      <Plugin ApplicationInsightsWriter>
        InstrumentationKey "12345678-1234-1234-1234-123456781234"
      </Plugin>

      # Other plugin configurations ...
      ...
    </Plugin>
    ...
```

Configure other [collectd plugins](https://collectd.org/wiki/index.php/Table_of_Plugins), which can collect various data from different sources.

Restart collectd according to its [manual](https://collectd.org/wiki/index.php/First_steps).

### View the data in Application Insights
In your Application Insights resource, open [Metrics and add charts][metrics], selecting the metrics you want to see from the Custom category.

By default, the metrics are aggregated across all host machines from which the metrics were collected. To view the metrics per host, in the Chart details pane, turn on Grouping and then choose to group by CollectD-Host.

### To exclude upload of specific statistics
By default, the Application Insights plugin sends all the data collected by all the enabled collectd 'read' plugins. 

To exclude data from specific plugins or data sources:

* Edit the configuration file. 
* In `<Plugin ApplicationInsightsWriter>`, add directive lines like this:

| Directive | Effect |
| --- | --- |
| `Exclude disk` |Exclude all data collected by the `disk` plugin |
| `Exclude disk:read,write` |Exclude the sources named `read` and `write` from the `disk` plugin. |

Separate directives with a newline.

### Problems?
*I don't see data in the portal*

* Open [Search][diagnostic] to see if the raw events have arrived. Sometimes they take longer to appear in metrics explorer.
* You might need to [set firewall exceptions for outgoing data](./ip-addresses.md)
* Enable tracing in the Application Insights plugin. Add this line within `<Plugin ApplicationInsightsWriter>`:
  * `SDKLogger true`
* Open a terminal and start collectd in verbose mode, to see any issues it is reporting:
  * `sudo collectd -f`

### Known issue

The Application Insights Write plugin is incompatible with certain Read plugins. Some plugins sometimes send "NaN" where the Application Insights plugin expects a floating-point number.

Symptom: The collectd log shows errors that include "AI: ... SyntaxError: Unexpected token N".

Workaround: Exclude data collected by the problem Write plugins.

## How to use Micrometer with Azure Application Insights Java SDK (not recommended)

Micrometer application monitoring measures metrics for JVM-based application code and lets you export the data to your favorite monitoring systems. This section will teach you how to use Micrometer with Application Insights for both Spring Boot and non-Spring Boot applications.

### Using Spring Boot 1.5x
Add the following dependencies to your pom.xml or build.gradle file: 
* Application Insights spring-boot-starter
  2.5.0 or later
* Micrometer Azure Registry 1.1.0 or above
* [Micrometer Spring Legacy](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-metrics) 1.1.0 or above (this backports the autoconfig code in the Spring framework).
* [ApplicationInsights Resource](./create-new-resource.md)

Steps

1. Update the pom.xml file of your Spring Boot application and add the following dependencies in it:

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>applicationinsights-spring-boot-starter</artifactId>
        <version>2.5.0</version>
    </dependency>

    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-spring-legacy</artifactId>
        <version>1.1.0</version>
    </dependency>

    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-azure-monitor</artifactId>
        <version>1.1.0</version>
    </dependency>

    ```
2. Update the application.properties or yml file with the Application Insights Instrumentation key using the following property:

     `azure.application-insights.instrumentation-key=<your-instrumentation-key-here>`
1. Build your application and run
2. The above should get you up and running with pre-aggregated metrics auto collected to Azure Monitor.

### Using Spring 2.x

Add the following dependencies to your pom.xml or build.gradle file:

* Application Insights Spring-boot-starter 2.1.2 or above
* Azure-spring-boot-metrics-starters 2.0.7 or later
* [Application Insights Resource](./create-new-resource.md)

Steps:

1. Update the pom.xml file of your Spring Boot application and add the following dependency in it:

    ```xml
    <dependency> 
          <groupId>com.microsoft.azure</groupId>
          <artifactId>azure-spring-boot-metrics-starter</artifactId>
          <version>2.0.7</version>
    </dependency>
    ```
1. Update the application.properties or yml file with the Application Insights Instrumentation key using the following property:

     `azure.application-insights.instrumentation-key=<your-instrumentation-key-here>`
3. Build your application and run
4. The above should get you running with pre-aggregated metrics auto collected to Azure Monitor. For details on how to fine-tune Application Insights Spring Boot starter refer to the [readme on GitHub](https://github.com/Microsoft/azure-spring-boot/releases/latest).

Default Metrics:

*    Automatically configured metrics for Tomcat, JVM, Logback Metrics, Log4J metrics, Uptime Metrics, Processor Metrics, FileDescriptorMetrics.
*    For example, if Netflix Hystrix is present on class path we get those metrics as well. 
*    The following metrics can be available by adding respective beans. 
        - CacheMetrics (CaffeineCache, EhCache2, GuavaCache, HazelcastCache, JCache)
        - DataBaseTableMetrics 
        - HibernateMetrics 
        - JettyMetrics 
        - OkHttp3 metrics 
        - Kafka Metrics 



How to turn off automatic metrics collection: 

- JVM Metrics: 
    - management.metrics.binders.jvm.enabled=false 
- Logback Metrics: 
    - management.metrics.binders.logback.enabled=false
- Uptime Metrics: 
    - management.metrics.binders.uptime.enabled=false 
- Processor Metrics:
    -  management.metrics.binders.processor.enabled=false 
- FileDescriptorMetrics:
    - management.metrics.binders.files.enabled=false 
- Hystrix Metrics if library on classpath: 
    - management.metrics.binders.hystrix.enabled=false 
- AspectJ Metrics if library on classpath: 
    - spring.aop.enabled=false 

> [!NOTE]
> Specify the properties above in the application.properties or application.yml file of your Spring Boot application

### Use Micrometer with non-Spring Boot web applications

Add the following dependencies to your pom.xml or build.gradle file:

* Application Insights Web Auto 2.5.0 or later
* Micrometer Azure Registry 1.1.0 or above
* [Application Insights Resource](./create-new-resource.md)

Steps:

1. Add the following dependencies in your pom.xml or build.gradle file:

    ```xml
        <dependency>
            <groupId>io.micrometer</groupId>
            <artifactId>micrometer-registry-azure-monitor</artifactId>
            <version>1.1.0</version>
        </dependency>

        <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>applicationinsights-web-auto</artifactId>
            <version>2.5.0</version>
        </dependency>
     ```

2. If you haven't already, add `ApplicationInsights.xml` file in the resources folder. For more information, see [Add an ApplicationInsights.xml file](#add-an-applicationinsightsxml-file).

3. Sample Servlet class (emits a timer metric):

    ```Java
        @WebServlet("/hello")
        public class TimedDemo extends HttpServlet {

          private static final long serialVersionUID = -4751096228274971485L;

          @Override
          @Timed(value = "hello.world")
          protected void doGet(HttpServletRequest request, HttpServletResponse response)
              throws ServletException, IOException {

            response.getWriter().println("Hello World!");
            MeterRegistry registry = (MeterRegistry) getServletContext().getAttribute("AzureMonitorMeterRegistry");

        //create new Timer metric
            Timer sampleTimer = registry.timer("timer");
            Stream<Integer> infiniteStream = Stream.iterate(0, i -> i+1);
            infiniteStream.limit(10).forEach(integer -> {
              try {
                Thread.sleep(1000);
                sampleTimer.record(integer, TimeUnit.MILLISECONDS);
              } catch (Exception e) {}
               });
          }
          @Override
          public void init() throws ServletException {
            System.out.println("Servlet " + this.getServletName() + " has started");
          }
          @Override
          public void destroy() {
            System.out.println("Servlet " + this.getServletName() + " has stopped");
          }

        }

    ```

4. Sample configuration class:

    ```Java
         @WebListener
         public class MeterRegistryConfiguration implements ServletContextListener {

           @Override
           public void contextInitialized(ServletContextEvent servletContextEvent) {

         // Create AzureMonitorMeterRegistry
           private final AzureMonitorConfig config = new AzureMonitorConfig() {
             @Override
             public String get(String key) {
                 return null;
             }
            @Override
               public Duration step() {
                 return Duration.ofSeconds(60);}

             @Override
             public boolean enabled() {
                 return false;
             }
         };

      MeterRegistry azureMeterRegistry = AzureMonitorMeterRegistry.builder(config);

             //set the config to be used elsewhere
             servletContextEvent.getServletContext().setAttribute("AzureMonitorMeterRegistry", azureMeterRegistry);

           }

           @Override
           public void contextDestroyed(ServletContextEvent servletContextEvent) {

           }
         }
    ```

To learn more about metrics, refer to the [Micrometer documentation](https://micrometer.io/docs/).

Other sample code on how to create different types of metrics can be found in the [official Micrometer GitHub repo](https://github.com/micrometer-metrics/micrometer/tree/master/samples/micrometer-samples-core/src/main/java/io/micrometer/core/samples).

### How to bind additional metrics collection

#### SpringBoot/Spring

Create a bean of the respective metric category. For example, say we need Guava cache Metrics:

```Java
    @Bean
    GuavaCacheMetrics guavaCacheMetrics() {
        Return new GuavaCacheMetrics();
    }
```
There are several metrics that are not enabled by default but can be bound in the above fashion. For a complete list, refer to [the official Micrometer GitHub repo](https://github.com/micrometer-metrics/micrometer/tree/master/micrometer-core/src/main/java/io/micrometer/core/instrument/binder ).

#### Non-Spring apps
Add the following binding code to the configuration  file:
```Java 
    New GuavaCacheMetrics().bind(registry);
```

## Next steps
* Add [monitoring to your web pages](javascript.md) to monitor page load times, AJAX calls, browser exceptions.
* Write [custom telemetry](./api-custom-events-metrics.md) to track usage in the browser or at the server.
* Use [Analytics](../logs/log-query-overview.md) for powerful queries over telemetry from your app
* [Diagnostic search][diagnostic]
* [Sampling](./sampling.md) - Consider sampling as an alternative to filtering that does not skew your metrics.
* To learn more about Micrometer, see the official [Micrometer documentation](https://micrometer.io/docs).
* To learn about Spring on Azure, see the official [Spring on Azure documentation](/java/azure/spring-framework/).
* For more information, visit [Azure for Java developers](/java/azure).

<!--Link references-->
[api]: ./api-custom-events-metrics.md
[apiexceptions]: ./api-custom-events-metrics.md#trackexception
[availability]: ./monitor-web-app-availability.md
[diagnostic]: ./diagnostic-search.md
[javalogs]: #explore-java-trace-logs-in-application-insights
[metrics]: ../essentials/metrics-charts.md
[usage]: javascript.md
[eclipse]: app-insights-java-eclipse.md
[java]: #get-started-with-application-insights-in-a-java-web-project
[javaagent]: java-in-process-agent.md