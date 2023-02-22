---
title: Use Application Insights Java 2.x
description: Learn how to use Application Insights Java 2.x so that you can send trace logs, monitor dependencies, filter telemetry, and measure metrics.
ms.topic: conceptual
ms.date: 02/14/2023
ms.devlang: java
ms.custom: devx-track-java
ms.reviewer: mmcc
---

# Application Insights for Java 2.x

> [!CAUTION]
> This article applies to Application Insights Java 2.x, which is [no longer recommended](https://azure.microsoft.com/updates/application-insights-java-2x-retirement/).
>
> Documentation for the latest version can be found at [Application Insights Java 3.x](./opentelemetry-enable.md?tabs=java).

In this article, you'll learn how to use Application Insights Java 2.x. This article shows you how to:

- Get started, and learn how to instrument requests, track dependencies, collect performance counters, diagnose performance issues and exceptions, and write code to track what users do with your app.
- Send trace logs to Application Insights and explore them by using the Application Insights portal.
- Monitor dependencies, caught exceptions, and method execution times in Java web apps.
- Filter telemetry in your Java web app.
- Explore Linux system performance metrics in Application Insights by using `collectd`.
- Measure metrics for Java virtual machine (JVM)-based application code. Export the data to your favorite monitoring systems by using Micrometer application monitoring.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Get started with Application Insights in a Java web project

In this section, you use the Application Insights SDK to instrument requests, track dependencies, collect performance counters, diagnose performance issues and exceptions, and write code to track what users do with your app.

Application Insights is an extensible analytics service for web developers that helps you understand the performance and usage of your live application. Application Insights supports Java apps running on Linux, Unix, or Windows.

### Prerequisites

You need:

* An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
* A functioning Java application.

### Get an Application Insights instrumentation key

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the Azure portal, create an Application Insights resource. Set the application type to Java web application.

1. Find the instrumentation key of the new resource. You'll need to paste this key into your code project shortly.

    :::image type="content" source="./media/deprecated-java-2x/instrumentation-key-001.png" alt-text="Screenshot of the Overview pane for an Application Insights resource in the Azure portal with the instrumentation key highlighted." lightbox="./media/deprecated-java-2x/instrumentation-key-001.png":::

### Add the Application Insights SDK for Java to your project

Choose your project type.

# [Maven](#tab/maven)

If your project is already set up to use Maven for build, merge the following code to your *pom.xml* file. Then refresh the project dependencies to get the binaries downloaded.

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

If your project is already set up to use Gradle for build, merge the following code to your *build.gradle* file. Then refresh the project dependencies to get the binaries downloaded.

```gradle
    dependencies {
      compile group: 'com.microsoft.azure', name: 'applicationinsights-web-auto', version: '2.6.4'
      // or applicationinsights-web for manual web filter registration
      // or applicationinsights-core for bare API
    }
```

---

#### Frequently asked questions

* What's the relationship between the `-web-auto`, `-web`, and `-core` components?
  * `applicationinsights-web-auto` gives you metrics that track HTTP servlet request counts and response times by automatically registering the Application Insights servlet filter at runtime.
  * `applicationinsights-web` also gives you metrics that track HTTP servlet request counts and response times. But manual registration of the Application Insights servlet filter in your application is required.
  * `applicationinsights-core` gives you the bare API, for example, if your application isn't servlet-based.
  
* How should I update the SDK to the latest version?
  * As of November 2020, for monitoring Java applications, we recommend using Application Insights Java 3.x. For more information on how to get started, see [Application Insights Java 3.x](./opentelemetry-enable.md?tabs=java).

### Add an ApplicationInsights.xml file
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

Optionally, the configuration file can be in any location accessible to your application. The system property `-Dapplicationinsights.configurationDirectory` specifies the directory that contains *ApplicationInsights.xml*. For example, a configuration file located at *E:\myconfigs\appinsights\ApplicationInsights.xml* would be configured with the property `-Dapplicationinsights.configurationDirectory="E:\myconfigs\appinsights"`.

* The instrumentation key is sent along with every item of telemetry and tells Application Insights to display it in your resource.
* The HTTP Request component is optional. It automatically sends telemetry about requests and response times to the portal.
* Event correlation is an addition to the HTTP request component. It assigns an identifier to each request received by the server. It then adds this identifier as a property to every item of telemetry as the property `Operation.Id`. It allows you to correlate the telemetry associated with each request by setting a filter in [Diagnostic search][diagnostic].

#### Alternative ways to set the instrumentation key
Application Insights SDK looks for the key in this order:

- **System property**: -DAPPINSIGHTS_INSTRUMENTATIONKEY=your_ikey
- **Environment variable**: APPINSIGHTS_INSTRUMENTATIONKEY
- **Configuration file**: *ApplicationInsights.xml*

You can also [set it in code](./api-custom-events-metrics.md#ikey):

```java
    String instrumentationKey = "00000000-0000-0000-0000-000000000000";

    if (instrumentationKey != null)
    {
        TelemetryConfiguration.getActive().setInstrumentationKey(instrumentationKey);
    }
```

### Add agent

[Install the Java agent](#monitor-dependencies-caught-exceptions-and-method-execution-times-in-java-web-apps) to capture outgoing HTTP calls, JDBC queries, application logging, and better operation naming.

### Run your application
Either run it in debug mode on your development machine or publish it to your server.

### View your telemetry in Application Insights
Return to your Application Insights resource in the [Azure portal](https://portal.azure.com).

HTTP requests data appears on the overview pane. If it isn't there, wait a few seconds and then select **Refresh**.

:::image type="content" source="./media/deprecated-java-2x/overview-graphs.png" alt-text="Screenshot that shows overview sample data." lightbox="./media/deprecated-java-2x/overview-graphs.png":::

Learn more about [metrics][metrics].

Click through any chart to see more detailed aggregated metrics.

:::image type="content" source="./media/deprecated-java-2x/006-barcharts.png" alt-text="Screenshot that shows an Application Insights failures pane with charts." lightbox="./media/deprecated-java-2x/006-barcharts.png":::

#### Instance data
Click through a specific request type to see individual instances.

:::image type="content" source="./media/deprecated-java-2x/007-instance.png" alt-text="Screenshot that shows drilling into a specific sample view." lightbox="./media/deprecated-java-2x/007-instance.png":::

#### Log Analytics: Powerful query language
As you accumulate more data, you can run queries to aggregate data and find individual instances. [Log Analytics](../logs/log-query-overview.md) is a powerful tool for understanding performance and usage, and for diagnostic purposes.

:::image type="content" source="./media/deprecated-java-2x/0025.png" alt-text="Screenshot that shows an example of Log Analytics in the Azure portal." lightbox="./media/deprecated-java-2x/0025.png":::

### Install your app on the server
Now publish your app to the server, let people use it, and watch the telemetry show up in the portal.

* Make sure your firewall allows your application to send telemetry to these ports:

  * dc.services.visualstudio.com:443
  * f5.services.visualstudio.com:443

* If outgoing traffic must be routed through a firewall, define the system properties `http.proxyHost` and `http.proxyPort`.
* On Windows servers, install:

  * [Microsoft Visual C++ Redistributable](https://www.microsoft.com/download/details.aspx?id=40784)

    This component enables performance counters.

### Azure App Service, Azure Kubernetes Service, VMs config

The best and easiest approach to monitor your applications running on any Azure resource providers is to use [Application Insights Java 3.x](./opentelemetry-enable.md?tabs=java).

### Exceptions and request failures
Unhandled exceptions and request failures are automatically collected by the Application Insights web filter.

To collect data on other exceptions, you can [insert calls to trackException() in your code][apiexceptions].

### Monitor method calls and external dependencies
[Install the Java agent](#monitor-dependencies-caught-exceptions-and-method-execution-times-in-java-web-apps) to log-specified internal methods and calls made through JDBC, with timing data, and for automatic operation naming.

### W3C distributed tracing

The Application Insights Java SDK now supports [W3C distributed tracing](https://w3c.github.io/trace-context/).

The incoming SDK configuration is explained further in [Telemetry correlation in Application Insights](correlation.md).

Outgoing SDK configuration is defined in the [AI-Agent.xml](#monitor-dependencies-caught-exceptions-and-method-execution-times-in-java-web-apps) file.

### Performance counters
Select **Investigate** > **Metrics** to see a range of performance counters.

:::image type="content" source="./media/deprecated-java-2x/011-perf-counters.png" alt-text="Screenshot that shows the Metrics pane for an Application Insights resource in the Azure portal with process private bytes  selected." lightbox="./media/deprecated-java-2x/011-perf-counters.png":::

#### Customize performance counter collection
To disable collection of the standard set of performance counters, add the following code under the root node of the *ApplicationInsights.xml* file:

```xml
    <PerformanceCounters>
       <UseBuiltIn>False</UseBuiltIn>
    </PerformanceCounters>
```

#### Collect more performance counters
You can specify more performance counters to be collected.

##### JMX counters (exposed by the Java virtual machine)

```xml
    <PerformanceCounters>
      <Jmx>
        <Add objectName="java.lang:type=ClassLoading" attribute="TotalLoadedClassCount" displayName="Loaded Class Count"/>
        <Add objectName="java.lang:type=Memory" attribute="HeapMemoryUsage.used" displayName="Heap Memory Usage-used" type="composite"/>
      </Jmx>
    </PerformanceCounters>
```

* `displayName`: The name displayed in the Application Insights portal.
* `objectName`: The JMX object name.
* `attribute`: The attribute of the JMX object name to fetch.
* `type` (optional): The type of JMX object's attribute:
  * Default: A simple type, such as int or long.
  * `composite`: The perf counter data is in the format of `Attribute.Data`.
  * `tabular`: The perf counter data is in the format of a table row.

##### Windows performance counters
Each [Windows performance counter](/windows/win32/perfctrs/performance-counters-portal) is a member of a category (in the same way that a field is a member of a class). Categories can either be global or have numbered or named instances.

```xml
    <PerformanceCounters>
      <Windows>
        <Add displayName="Process User Time" categoryName="Process" counterName="%User Time" instanceName="__SELF__" />
        <Add displayName="Bytes Printed per Second" categoryName="Print Queue" counterName="Bytes Printed/sec" instanceName="Fax" />
      </Windows>
    </PerformanceCounters>
```

* `displayName`: The name displayed in the Application Insights portal.
* `categoryName`: The performance counter category (performance object) with which this performance counter is associated.
* `counterName`: The name of the performance counter.
* `instanceName`: The name of the performance counter category instance or an empty string (""), if the category contains a single instance. If `categoryName` is `Process` and the performance counter you want to collect is from the current JVM process on which your app is running, specify `"__SELF__"`.

#### Unix performance counters
[Install collectd with the Application Insights plug-in](#collectd-linux-performance-metrics-in-application-insights-deprecated) to get a wide variety of system and network data.

### Get user and session data
Now you're sending telemetry from your web server. To get the full 360-degree view of your application, you can add more monitoring:

* [Add telemetry to your web pages][usage] to monitor page views and user metrics.
* [Set up web tests][availability] to make sure your application stays live and responsive.

### Send your own telemetry
Now that you've installed the SDK, you can use the API to send your own telemetry:

* [Track custom events and metrics][api] to learn what users are doing with your application.
* [Search events and logs][diagnostic] to help diagnose problems.

### Availability web tests
Application Insights can test your website at regular intervals to check that it's up and responding well.

Learn more about how to [set up availability web tests][availability].

### Troubleshooting

See the dedicated [troubleshooting article](/troubleshoot/azure/azure-monitor/app-insights/java-2x-troubleshoot).

[!INCLUDE [azure-monitor-app-insights-test-connectivity](../../../includes/azure-monitor-app-insights-test-connectivity.md)]

## Explore Java trace logs in Application Insights

If you're using Logback or Log4J (v1.2 or v2.0) for tracing, you can have your trace logs sent automatically to Application Insights where you can explore and search on them.

> [!TIP]
> You need to set your Application Insights instrumentation key only once for your application. If you're using a framework like Java Spring, you might have already registered the key elsewhere in your app's configuration.

### Use the Application Insights Java agent

By default, the Application Insights Java agent automatically captures logging performed at the `WARN` level and above.

You can change the threshold of logging that's captured by using the *AI-Agent.xml* file:

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

You can disable the Java agent's logging capture by using the *AI-Agent.xml* file:

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

### Alternatives

Instead of using the Java agent, you can follow these instructions.

#### Install the Java SDK

Follow the instructions to install the [Application Insights SDK for Java][java], if you haven't already done that.

#### Add logging libraries to your project
Choose the appropriate way for your project.

##### Maven
If your project is already set up to use Maven for build, merge one of the following snippets of code into your *pom.xml* file. Then refresh the project dependencies to get the binaries downloaded.

**Logback**

```xml

    <dependencies>
       <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>applicationinsights-logging-logback</artifactId>
          <version>[2.0,)</version>
       </dependency>
    </dependencies>
```

**Log4J v2.0**

```xml

    <dependencies>
       <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>applicationinsights-logging-log4j2</artifactId>
          <version>[2.0,)</version>
       </dependency>
    </dependencies>
```

**Log4J v1.2**

```xml

    <dependencies>
       <dependency>
          <groupId>com.microsoft.azure</groupId>
          <artifactId>applicationinsights-logging-log4j1_2</artifactId>
          <version>[2.0,)</version>
       </dependency>
    </dependencies>
```

##### Gradle
If your project is already set up to use Gradle for build, add one of the following lines to the `dependencies` group in your *build.gradle* file. Then refresh the project dependencies to get the binaries downloaded.

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

##### Use the jar link
Follow the guidelines to manually install Application Insights Java SDK and download the jar. On the Maven Central page, select the `jar` link in the download section for the appropriate appender. Add the downloaded appender jar to the project.

| Logger | Download | Library |
| --- | --- | --- |
| Logback |[Logback appender Jar](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22applicationinsights-logging-logback%22) |applicationinsights-logging-logback |
| Log4J v2.0 |[Log4J v2 appender Jar](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22applicationinsights-logging-log4j2%22) |applicationinsights-logging-log4j2 |
| Log4j v1.2 |[Log4J v1.2 appender Jar](https://search.maven.org/#search%7Cga%7C1%7Ca%3A%22applicationinsights-logging-log4j1_2%22) |applicationinsights-logging-log4j1_2 |

#### Add the appender to your logging framework
To start getting traces, merge the relevant snippet of code to the Logback or Log4J configuration file.

**Logback**

```xml

    <appender name="aiAppender" 
      class="com.microsoft.applicationinsights.logback.ApplicationInsightsAppender">
        <instrumentationKey>[APPLICATION_INSIGHTS_KEY]</instrumentationKey>
    </appender>
    <root level="trace">
      <appender-ref ref="aiAppender" />
    </root>
```

**Log4J v2.0**

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

**Log4J v1.2**

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

The Application Insights appenders can be referenced by any configured logger and not necessarily by the root logger, as shown in the preceding code samples.

### Explore your traces in the Application Insights portal
Now that you've configured your project to send traces to Application Insights, you can view and search these traces in the Application Insights portal in the [Search][diagnostic] pane.

Exceptions submitted via loggers will be displayed on the portal as **Exception** telemetry.

:::image type="content" source="./media/deprecated-java-2x/01-diagnostics.png" alt-text="Screenshot that shows the Search pane for an Application Insights resource in the Azure portal." lightbox="./media/deprecated-java-2x/01-diagnostics.png":::

## Monitor dependencies, caught exceptions, and method execution times in Java web apps

If you've [instrumented your Java web app with Application Insights SDK][javaagent], you can use the Java agent to get deeper insights, without any code changes:

* **Dependencies**: Data about calls that your application makes to other components, including:
  * **Outgoing HTTP calls**: Calls made via `Apache HttpClient`, `OkHttp`, and `java.net.HttpURLConnection` are captured.
  * **Redis calls**: Calls made via the Jedis client are captured.
  * **JDBC queries**: For MySQL and PostgreSQL, if the call takes longer than 10 seconds, the agent reports the query plan.

* **Application logging**: Capture and correlate your application logs with HTTP requests and other telemetry:
  * **Log4j 1.2**
  * **Log4j2**
  * **Logback**

* **Better operation naming**: Used for aggregation of requests in the portal.
  * **Spring**: Based on `@RequestMapping`.
  * **JAX-RS**: Based on `@Path`.

To use the Java agent, you install it on your server. Your web apps must be instrumented with the [Application Insights Java SDK][javaagent].

### Install the Application Insights agent for Java
1. On the machine running your Java server, [download the 2.x agent](https://github.com/microsoft/ApplicationInsights-Java/releases/tag/2.6.4). Make sure the version of the 2.x Java agent that you use matches the version of the 2.x Application Insights Java SDK that you use.
1. Edit the application server startup script, and add the following JVM argument:
   
    `-javaagent:<full path to the agent JAR file>`
   
    For example, in Tomcat on a Linux machine:
   
    `export JAVA_OPTS="$JAVA_OPTS -javaagent:<full path to agent JAR file>"`
1. Restart your application server.

### Configure the agent
Create a file named *AI-Agent.xml* and place it in the same folder as the agent jar file.

Set the content of the XML file. Edit the following example to include or omit the features you want.

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

### More config (Spring Boot)

`java -javaagent:/path/to/agent.jar -jar path/to/TestApp.jar`

For Azure App Service, follow these steps:

1. Select **Settings** > **Application Settings**.
1. Under **App Settings**, add a new key value pair:
   - **Key**: `JAVA_OPTS`
   - **Value**: `-javaagent:D:/home/site/wwwroot/applicationinsights-agent-2.6.4.jar`

   The agent must be packaged as a resource in your project so that it ends up in the *D:/home/site/wwwroot/* directory. To confirm that your agent is in the correct App Service directory, go to **Development Tools** > **Advanced Tools** > **Debug Console** and examine the contents of the site directory.

1. Save the settings and restart your app. These steps only apply to app services running on Windows.

> [!NOTE]
> *AI-Agent.xml* and the agent jar file should be in the same folder. They're often placed together in the */resources* folder of the project.

##### Enable W3C distributed tracing

Add the following snippet to *AI-Agent.xml*:

```xml
<Instrumentation>
   <BuiltIn enabled="true">
      <HTTP enabled="true" W3C="true" enableW3CBackCompat="true"/>
   </BuiltIn>
</Instrumentation>
```

> [!NOTE]
> Backward compatibility mode is enabled by default. The `enableW3CBackCompat` parameter is optional and should be used only when you want to turn it off.
>
>Ideally, this would be the case when all your services have been updated to newer versions of SDKs supporting the W3C protocol. We recommend that you move to newer versions of SDKs with W3C support as soon as possible.

Make sure that *both [incoming](correlation.md#enable-w3c-distributed-tracing-support-for-java-apps) and outgoing (agent) configurations* are exactly the same.

### View the data
In the Application Insights resource, aggregated remote dependency and method execution times appear [under the Performance tile][metrics].

To search for individual instances of dependency, exception, and method reports, open [Search][diagnostic].

Learn more about how to [diagnose dependency issues](./asp-net-dependencies.md#diagnosis).

### Questions or problems?

Use the following resources:

* No data? [Set firewall exceptions](./ip-addresses.md).
* [Troubleshoot Java](java-2x-troubleshoot.md).

## Filter telemetry in your Java web app

Filters provide a way to select the telemetry that your [Java web app sends to Application Insights](#get-started-with-application-insights-in-a-java-web-project). There are some out-of-the-box filters that you can use. You can also write your own custom filters.

The out-of-the-box filters include:

* Trace severity level.
* Specific URLs, keywords, or response codes.
* Fast responses. In other words, requests to which your app responded quickly.
* Specific event names.

> [!NOTE]
> Filters skew the metrics of your app. For example, you might decide that to diagnose slow responses, you'll set a filter to discard fast response times. But you must be aware that the average response times reported by Application Insights will then be slower than the true speed. Also, the count of requests will be smaller than the real count.
>
> If this is a concern, use [Sampling](./sampling.md) instead.

### Set filters

In *ApplicationInsights.xml*, add a `TelemetryProcessors` section like this example:

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

Inspect the [full set of built-in processors](https://github.com/microsoft/ApplicationInsights-Java/tree/main/agent/agent-tooling/src/main/java/com/microsoft/applicationinsights/agent/internal).

### Built-in filters

This section discusses the built-in filters that are available.

#### Metric Telemetry filter

```xml

           <Processor type="MetricTelemetryFilter">
                  <Add name="NotNeeded" value="metric1,metric2"/>
           </Processor>
```

* `NotNeeded`: Comma-separated list of custom metric names

#### Page View Telemetry filter

```xml

           <Processor type="PageViewTelemetryFilter">
                  <Add name="DurationThresholdInMS" value="500"/>
                  <Add name="NotNeededNames" value="page1,page2"/>
                  <Add name="NotNeededUrls" value="url1,url2"/>
           </Processor>
```

* `DurationThresholdInMS`: Duration refers to the time taken to load the page. If this parameter is set, pages that loaded faster than this time aren't reported.
* `NotNeededNames`: Comma-separated list of page names.
* `NotNeededUrls`: Comma-separated list of URL fragments. For example, `"home"` filters out all pages that have "home" in the URL.

#### Request Telemetry filter

```xml

           <Processor type="RequestTelemetryFilter">
                  <Add name="MinimumDurationInMS" value="500"/>
                  <Add name="NotNeededResponseCodes" value="page1,page2"/>
                  <Add name="NotNeededUrls" value="url1,url2"/>
           </Processor>
```

#### Synthetic Source filter

Filters out all telemetry that has values in the `SyntheticSource` property. Requests from bots, spiders, and availability tests are included.

Filters out telemetry for all synthetic requests:

```xml

           <Processor type="SyntheticSourceFilter" />
```

Filters out telemetry for specific synthetic sources:

```xml

           <Processor type="SyntheticSourceFilter" >
                  <Add name="NotNeeded" value="source1,source2"/>
           </Processor>
```

* `NotNeeded`: Comma-separated list of synthetic source names

#### Telemetry Event filter

Filters custom events that were logged by using [TrackEvent()](./api-custom-events-metrics.md#trackevent):

```xml

           <Processor type="TelemetryEventFilter" >
                  <Add name="NotNeededNames" value="event1, event2"/>
           </Processor>
```

* `NotNeededNames`: Comma-separated list of event names

#### Trace Telemetry filter

Filters log traces logged by using [TrackTrace()](./api-custom-events-metrics.md#tracktrace) or a [logging framework collector](#explore-java-trace-logs-in-application-insights):

```xml

           <Processor type="TraceTelemetryFilter">
                  <Add name="FromSeverityLevel" value="ERROR"/>
           </Processor>
```

* The `FromSeverityLevel` valid values are:

  * **OFF**: Filters out *all* traces.
  *  **TRACE**: No filtering. Equals to TRACE level.
  *  **INFO**: Filters out TRACE level.
  *  **WARN**: Filters out TRACE and INFO.
  *  **ERROR**: Filters out WARN, INFO, and TRACE.
  *  **CRITICAL**: Filters out all but CRITICAL.

### Custom filters

The following sections show you the steps to create your own custom filters.

#### Code your filter

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

#### Invoke your filter in the configuration file

Now, in *ApplicationInsights.xml*:

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

#### Invoke your filter (Java Spring)

For applications based on the Spring framework, custom telemetry processors must be registered in your main application class as a bean. They'll then be autowired when the application starts.

```Java
@Bean
public TelemetryProcessor successFilter() {
      return new SuccessFilter();
}
```

You create your own filter parameters in `application.properties`. Then you use Spring Boot's externalized configuration framework to pass those parameters into your custom filter.

### Troubleshooting

This section offers a troubleshooting tip.

#### My filter isn't working

Check that you've provided valid parameter values. For example, durations should be integers. Invalid values will cause the filter to be ignored. If your custom filter throws an exception from a constructor or set method, it will be ignored.

## collectd: Linux performance metrics in Application Insights (deprecated)

To explore Linux system performance metrics in [Application Insights](./app-insights-overview.md), install [collectd](https://collectd.org/) together with its Application Insights plug-in. This open-source solution gathers various system and network statistics.

Typically, you'll use `collectd` if you've already [instrumented your Java web service with Application Insights][java]. It gives you more data to help you enhance your app's performance or diagnose problems.

### Get your instrumentation key
In the [Azure portal](https://portal.azure.com), open the [Application Insights](./app-insights-overview.md) resource where you want the data to appear. Or, you can [create a new resource](./create-new-resource.md).

Take a copy of the **Instrumentation Key**, which identifies the resource.

:::image type="content" source="./media/deprecated-java-2x/instrumentation-key-001.png" alt-text="Screenshot that shows the overview pane for an Application Insights resource in the Azure portal with the instrumentation key highlighted." lightbox="./media/deprecated-java-2x/instrumentation-key-001.png":::

### Install collectd and the plug-in
On your Linux server machines:

1. Install [collectd](https://collectd.org/) version 5.4.0 or later.
1. Download the [Application Insights collectd writer plug-in](https://github.com/microsoft/ApplicationInsights-Java/tree/main/agent/agent-tooling/src/main/java/com/microsoft/applicationinsights/agent/internal). Note the version number.
1. Copy the plug-in jar into `/usr/share/collectd/java`.
1. Edit `/etc/collectd/collectd.conf`:
   * Ensure that [the Java plug-in](https://collectd.org/wiki/index.php/Plugin:Java) is enabled.
   * Update the JVMArg for the `java.class.path` to include the following jar. Update the version number to match the one you downloaded:
       * `/usr/share/collectd/java/applicationinsights-collectd-1.0.5.jar`
   * Add this snippet by using the instrumentation key from your resource:

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

Configure other [collectd plug-ins](https://collectd.org/wiki/index.php/Table_of_Plugins), which can collect various data from different sources.

Restart `collectd` according to its [manual](https://collectd.org/wiki/index.php/First_steps).

### View the data in Application Insights
In your Application Insights resource, open [Metrics and add charts][metrics]. Select the metrics you want to see from the **Custom** category.

By default, the metrics are aggregated across all host machines from which the metrics were collected. To view the metrics per host, in the **Chart details** pane, turn on **Grouping**, and then choose to group by **CollectD-Host**.

### Exclude upload of specific statistics
By default, the Application Insights plug-in sends all the data collected by all the enabled `collectd read` plug-ins.

To exclude data from specific plug-ins or data sources:

* Edit the configuration file.
* In `<Plugin ApplicationInsightsWriter>`, add directive lines like the ones in the following table:

    | Directive | Effect |
    | --- | --- |
    | `Exclude disk` |Exclude all data collected by the `disk` plug-in. |
    | `Exclude disk:read,write` |Exclude the sources named `read` and `write` from the `disk` plug-in. |

Separate directives with a newline.

### Problems?

This section offers troubleshooting tips.

#### I don't see data in the portal

Try these options:

* Open [Search][diagnostic] to see if the raw events have arrived. Sometimes they take longer to appear in metrics explorer.
* You might need to [set firewall exceptions for outgoing data](./ip-addresses.md).
* Enable tracing in the Application Insights plug-in. Add this line within `<Plugin ApplicationInsightsWriter>`:
  * `SDKLogger true`
* Open a terminal and start `collectd` in verbose mode to see any issues it's reporting:
  * `sudo collectd -f`

### Known issue

The Application Insights write plug-in is incompatible with certain read plug-ins. Some plug-ins sometimes send `NaN`, but the Application Insights plug-in expects a floating-point number.

- **Symptom**: The `collectd` log shows errors that include "AI: ... SyntaxError: Unexpected token N."
- **Workaround**: Exclude data collected by the problem write plug-ins.

## Use Micrometer with the Application Insights Java SDK (not recommended)

Micrometer application monitoring measures metrics for JVM-based application code and lets you export the data to your favorite monitoring systems. This section teaches you how to use Micrometer with Application Insights for both Spring Boot and non-Spring Boot applications.

### Use Spring Boot 1.5x
Add the following dependencies to your *pom.xml* or *build.gradle* file:

* Application Insights spring-boot-starter 2.5.0 or later.
* Micrometer Azure Registry 1.1.0 or above.
* [Micrometer Spring Legacy](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#production-ready-metrics) 1.1.0 or above. It backports the autoconfig code in the Spring framework.
* [ApplicationInsights resource](./create-new-resource.md).

Follow these steps:

1. Update the *pom.xml* file of your Spring Boot application and add the following dependencies in it:

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
1. Update the *application.properties* or YML file with the Application Insights instrumentation key by using the following property:

     `azure.application-insights.instrumentation-key=<your-instrumentation-key-here>`
1. Build your application and run it.

The preceding steps should get you up and running with pre-aggregated metrics autocollected to Azure Monitor.

### Use Spring 2.x

Add the following dependencies to your *pom.xml* or *build.gradle* file:

* Application Insights Spring-boot-starter 2.1.2 or above
* Azure-spring-boot-metrics-starters 2.0.7 or later
* [Application Insights resource](./create-new-resource.md)

Follow these steps:

1. Update the *pom.xml* file of your Spring Boot application and add the following dependency in it:

    ```xml
    <dependency> 
          <groupId>com.microsoft.azure</groupId>
          <artifactId>azure-spring-boot-metrics-starter</artifactId>
          <version>2.0.7</version>
    </dependency>
    ```

1. Update the *application.properties* or YML file with the Application Insights instrumentation key by using the following property:

     `azure.application-insights.instrumentation-key=<your-instrumentation-key-here>`
1. Build your application and run it.

The preceding steps should get you running with pre-aggregated metrics autocollected to Azure Monitor. For more information on how to fine-tune Application Insights Spring Boot starter, see the [readme on GitHub](https://github.com/Microsoft/azure-spring-boot/releases/latest).

Default metrics:

* Automatically configured metrics for Tomcat, JVM, Logback Metrics, Log4J Metrics, Uptime Metrics, Processor Metrics, and FileDescriptorMetrics.
* For example, if Netflix Hystrix is present on the class path, we get those metrics too.
* The following metrics can be available by adding the respective beans:
    - `CacheMetrics` (`CaffeineCache`, `EhCache2`, `GuavaCache`, `HazelcastCache`, and `JCache`)
    - `DataBaseTableMetrics`
    - `HibernateMetrics`
    - `JettyMetrics`
    - `OkHttp3` Metrics
    - `Kafka` Metrics

Turn off automatic metrics collection:

- JVM Metrics:
    - `management.metrics.binders.jvm.enabled=false`
- Logback Metrics:
    - `management.metrics.binders.logback.enabled=false`
- Uptime Metrics:
    - `management.metrics.binders.uptime.enabled=false`
- Processor Metrics:
    -  `management.metrics.binders.processor.enabled=false`
- FileDescriptorMetrics:
    - `management.metrics.binders.files.enabled=false`
- Hystrix Metrics if library on `classpath`:
    - `management.metrics.binders.hystrix.enabled=false`
- AspectJ Metrics if library on `classpath`:
    - `spring.aop.enabled=false`

> [!NOTE]
> Specify the preceding properties in the *application.properties* or *application.yml* file of your Spring Boot application.

### Use Micrometer with non-Spring Boot web applications

Add the following dependencies to your *pom.xml* or *build.gradle* file:

* Application Insights Web Auto 2.5.0 or later
* Micrometer Azure Registry 1.1.0 or above
* [Application Insights resource](./create-new-resource.md)

Follow these steps:

1. Add the following dependencies in your *pom.xml* or *build.gradle* file:

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

1. If you haven't done so already, add the *ApplicationInsights.xml* file in the resources folder. For more information, see [Add an ApplicationInsights.xml file](#add-an-applicationinsightsxml-file).

1. Sample Servlet class (emits a timer metric):

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

1. Sample configuration class:

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

To learn more about metrics, see the [Micrometer documentation](https://micrometer.io/docs/).

Other sample code on how to create different types of metrics can be found in the [official Micrometer GitHub repo](https://github.com/micrometer-metrics/micrometer/tree/master/samples/micrometer-samples-core/src/main/java/io/micrometer/core/samples).

### Bind more metrics collection

The following sections show you how to collect more metrics.

#### SpringBoot/Spring

Create a bean of the respective metric category. For example, say you need Guava Cache metrics:

```Java
    @Bean
    GuavaCacheMetrics guavaCacheMetrics() {
        Return new GuavaCacheMetrics();
    }
```

Several metrics aren't enabled by default but can be bound in the preceding fashion. For a complete list, see the [Micrometer GitHub repo](https://github.com/micrometer-metrics/micrometer/tree/master/micrometer-core/src/main/java/io/micrometer/core/instrument/binder).

#### Non-Spring apps
Add the following binding code to the configuration file:

```Java 
    New GuavaCacheMetrics().bind(registry);
```

## Next steps

* Add [monitoring to your webpages](javascript.md) to monitor page load times, AJAX calls, and browser exceptions.
* Write [custom telemetry](./api-custom-events-metrics.md) to track usage in the browser or at the server.
* Use [Log Analytics](../logs/log-query-overview.md) for powerful queries over telemetry from your app.
* Use [Diagnostic search][diagnostic].
* Consider [sampling](./sampling.md) as an alternative to filtering that doesn't skew your metrics.
* To learn more about Micrometer, see the [Micrometer documentation](https://micrometer.io/docs).
* To learn about Spring on Azure, see the [Spring on Azure documentation](/java/azure/spring-framework/).
* For more information, see [Azure for Java developers](/java/azure).

<!--Link references-->
[api]: ./api-custom-events-metrics.md
[apiexceptions]: ./api-custom-events-metrics.md#trackexception
[availability]: ./availability-overview.md
[diagnostic]: ./diagnostic-search.md
[javalogs]: #explore-java-trace-logs-in-application-insights
[metrics]: ../essentials/metrics-charts.md
[usage]: javascript.md
[eclipse]: app-insights-java-eclipse.md
[java]: #get-started-with-application-insights-in-a-java-web-project
[javaagent]: opentelemetry-enable.md?tabs=java