---
title: Performance monitoring for Java web apps in Azure Application Insights | Microsoft Docs
description: Extended performance and usage monitoring of your Java website with Application Insights.
services: application-insights
documentationcenter: java
author: mrbullwinkle
manager: carmonm
ms.assetid: 84017a48-1cb3-40c8-aab1-ff68d65e2128
ms.service: application-insights
ms.workload: tbd
ms.tgt_pltfrm: ibiza
ms.topic: conceptual
ms.date: 01/10/2019
ms.author: mbullwin
---
# Monitor dependencies, caught exceptions and method execution times in Java web apps


If you have [instrumented your Java web app with Application Insights][java], you can use the Java Agent to get deeper insights, without any code changes:

* **Dependencies:** Data about calls that your application makes to other components, including:
  * **REST calls** made via HttpClient, OkHttp, and RestTemplate (Spring) are captured.
  * **Redis** calls made via the Jedis client are captured.
  * **[JDBC calls](https://docs.oracle.com/javase/7/docs/technotes/guides/jdbc/)** - MySQL, SQL Server and Oracle DB commands are automatically captured. For MySQL, if the call takes longer than 10s, the agent reports the query plan.
* **Caught exceptions:** Information about exceptions that are handled by your code.
* **Method execution time:** Information about the time it takes to execute specific methods.

To use the Java agent, you install it on your server. Your web apps must be instrumented with the [Application Insights Java SDK][java]. 

## Install the Application Insights agent for Java
1. On the machine running your Java server, [download the agent](https://github.com/Microsoft/ApplicationInsights-Java/releases/latest). Please ensure to download the same version of Java Agent as Application Insights Java SDK core and web packages.
2. Edit the application server startup script, and add the following JVM:
   
    `javaagent:`*full path to the agent JAR file*
   
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

        <!-- Collect remote dependency data -->
        <BuiltIn enabled="true">
           <!-- Disable Redis or alter threshold call duration above which arguments are sent.
               Defaults: enabled, 10000 ms -->
           <Jedis enabled="true" thresholdInMS="1000"/>

           <!-- Set SQL query duration above which query plan is reported (MySQL, PostgreSQL). Default is 10000 ms. -->
           <MaxStatementQueryLimitInMS>1000</MaxStatementQueryLimitInMS>
        </BuiltIn>

        <!-- Collect data about caught exceptions
             and method execution times -->

        <Class name="com.myCompany.MyClass">
           <Method name="methodOne"
               reportCaughtExceptions="true"
               reportExecutionTime="true"
               />
           <!-- Report on the particular signature
                void methodTwo(String, int) -->
           <Method name="methodTwo"
              reportExecutionTime="true"
              signature="(Ljava/lang/String;I)V" />
        </Class>

      </Instrumentation>
    </ApplicationInsightsAgent>

```

You have to enable reports exception and method timing for individual methods.

By default, `reportExecutionTime` is true and `reportCaughtExceptions` is false.

## Additional config (Spring Boot)

`java -javaagent:/path/to/agent.jar -jar path/to/TestApp.jar`

For Azure App Services do the following:

* Select Settings > Application Settings
* Under App Settings, add a new key value pair:

Key: `JAVA_OPTS`
Value: `-javaagent:D:/home/site/wwwroot/applicationinsights-agent-2.3.1-SNAPSHOT.jar`

For the latest version of the Java agent check the releases [here](https://github.com/Microsoft/ApplicationInsights-Java/releases
). 

The agent must be packaged as a resource in your project such that it ends up in the D:/home/site/wwwroot/ directory. You can confirm that your agent is in the correct App Service directory by going to **Development Tools** > **Advanced Tools** > **Debug Console** and examining the contents of the site directory.    

* Save the settings and Restart your app. (These steps only apply to App Services running on Windows.)

> [!NOTE]
> AI-Agent.xml and the agent jar file should be in the same folder. They are often placed together in the `/resources` folder of the project.  

### Spring Rest Template

In order for Application Insights to successfully instrument HTTP calls made with Spring's Rest Template, use of the Apache HTTP Client is required. By default Spring's Rest Template is not configured to use the Apache HTTP Client. By specifying [HttpComponentsClientHttpRequestfactory](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/client/HttpComponentsClientHttpRequestFactory.html) in the constructor of a Spring Rest Template, it will use Apache HTTP.

Here's an example of how to do this with Spring Beans. This is a very simple example which uses the default settings of the factory class.

```java
@bean
public ClientHttpRequestFactory httpRequestFactory() {
return new HttpComponentsClientHttpRequestFactory()
}
@Bean(name = 'myRestTemplate')
public RestTemplate dcrAccessRestTemplate() {
    return new RestTemplate(httpRequestFactory())
}
```

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

Make sure that **both [incoming](correlation.md#w3c-distributed-tracing) and outgoing (agent) configurations** are exactly same.

## View the data
In the Application Insights resource, aggregated remote dependency and method execution times appears [under the Performance tile][metrics].

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
[metrics]: ../../azure-monitor/app/metrics-explorer.md
