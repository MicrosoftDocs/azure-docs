---
title: Java web apps performance monitoring - Azure Application Insights
description: Extended performance and usage monitoring of your Java website with Application Insights.
ms.topic: conceptual
ms.date: 01/10/2019

---

# Monitor dependencies, caught exceptions, and method execution times in Java web apps


If you have [instrumented your Java web app with Application Insights][java], you can use the Java Agent to get deeper insights, without any code changes:

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

To use the Java agent, you install it on your server. Your web apps must be instrumented with the [Application Insights Java SDK][java]. 

## Install the Application Insights agent for Java
1. On the machine running your Java server, [download the agent](https://github.com/Microsoft/ApplicationInsights-Java/releases/latest). Please ensure to download the same version of Java Agent as Application Insights Java SDK core and web packages.
2. Edit the application server startup script, and add the following JVM argument:
   
    `-javaagent:<full path to the agent JAR file>`
   
    For example, in Tomcat on a Linux machine:
   
    `export JAVA_OPTS="$JAVA_OPTS -javaagent:<full path to agent JAR file>"`
3. Restart your application server.

## Configure the agent
Create a file named `AI-Agent.xml` and place it in the same folder as the agent JAR file.

Set the content of the xml file. Edit the following example to include or omit the features you want.

```XML
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

## Additional config (Spring Boot)

`java -javaagent:/path/to/agent.jar -jar path/to/TestApp.jar`

For Azure App Services, do the following:

* Select Settings > Application Settings
* Under App Settings, add a new key value pair:

Key: `JAVA_OPTS`
Value: `-javaagent:D:/home/site/wwwroot/applicationinsights-agent-2.5.0.jar`

For the latest version of the Java agent, check the releases [here](https://github.com/Microsoft/ApplicationInsights-Java/releases
). 

The agent must be packaged as a resource in your project such that it ends up in the D:/home/site/wwwroot/ directory. You can confirm that your agent is in the correct App Service directory by going to **Development Tools** > **Advanced Tools** > **Debug Console** and examining the contents of the site directory.    

* Save the settings and Restart your app. (These steps only apply to App Services running on Windows.)

> [!NOTE]
> AI-Agent.xml and the agent jar file should be in the same folder. They are often placed together in the `/resources` folder of the project.  

#### Enable W3C distributed tracing

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

## View the data
In the Application Insights resource, aggregated remote dependency and method execution times appear [under the Performance tile][metrics].

To search for individual instances of dependency, exception, and method reports, open [Search][diagnostic].

[Diagnosing dependency issues - learn more](../../azure-monitor/app/asp-net-dependencies.md#diagnosis).

## Questions? Problems?
* No data? [Set firewall exceptions](../../azure-monitor/app/ip-addresses.md)
* [Troubleshooting Java](java-troubleshoot.md)

<!--Link references-->

[api]: ../../azure-monitor/app/api-custom-events-metrics.md
[apiexceptions]: ../../azure-monitor/app/api-custom-events-metrics.md#track-exception
[availability]: ../../azure-monitor/app/monitor-web-app-availability.md
[diagnostic]: ../../azure-monitor/app/diagnostic-search.md
[eclipse]: app-insights-java-eclipse.md
[java]: java-get-started.md
[javalogs]: java-trace-logs.md
[metrics]: ../../azure-monitor/platform/metrics-charts.md
