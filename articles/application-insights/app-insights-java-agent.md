<properties 
	pageTitle="Monitor dependencies, exceptions and execution times in Java web apps" 
	description="Extended monitoring of your Java website with Application Insights" 
	services="application-insights" 
    documentationCenter="java"
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/02/2016" 
	ms.author="awills"/>
 
# Monitor dependencies, exceptions and execution times in Java web apps

*Application Insights is in Preview.*

If you have [instrumented your Java web app with Application Insights][java], you can use the Java Agent to get deeper insights, without any code changes:


* **Dependencies:** Data about calls that your application makes to other components, including:
 * **REST calls** made via HttpClient, OkHttp and RestTemplate (Spring).
 * **Redis** calls made via the Jedis client. If the call takes longer than 10s, the agent will also fetch the call arguments.
 * **[JDBC calls](http://docs.oracle.com/javase/7/docs/technotes/guides/jdbc/)** - MySQL, SQL Server, PostgreSQL, SQLite, Oracle DB or Apache Derby DB. "executeBatch" calls are supported. For MySQL and PostgreSQL, if the call takes longer than 10s, the agent will report the query plan. 
* **Caught exceptions:** Data about exceptions that are handled by your code.
* **Method execution time:** Data about the time it takes to execute specific methods.

To use the Java agent, you install it on your server. Your web apps must be instrumented with the [Application Insights Java SDK][java].

## Install the Application Insights agent for Java

1. On the machine running your Java server, [download the agent](https://azuredownloads.blob.core.windows.net/applicationinsights/sdk.html).
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
           <!-- Disable Redis or alter threshold call duration above which arguments will be sent.
               Defaults: enabled, 10000 ms -->
           <Jedis enabled="true" thresholdInMS="1000"/>
           
           <!-- Set SQL query duration above which query plan will be reported (MySQL, PostgreSQL). Default is 10000 ms. -->
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

By default, `reportExecutionTime` is true, `reportCaughtExceptions` is false.

## View the data

In the Application Insights resource, aggregated remote dependency and method exection times will appear [under the Performance tile][metrics]. 

To search for individual instances of dependency, exception and method reports, open [Search][diagnostic]. 

[Diagnosing dependency issues - learn more](app-insights-dependencies.md#diagnosis).



## Questions? Problems?

[Troubleshooting Java](app-insights-java-troubleshoot.md)



<!--Link references-->

[api]: app-insights-api-custom-events-metrics.md
[apiexceptions]: app-insights-api-custom-events-metrics.md#track-exception
[availability]: app-insights-monitor-web-app-availability.md
[diagnostic]: app-insights-diagnostic-search.md
[eclipse]: app-insights-java-eclipse.md
[java]: app-insights-java-get-started.md
[javalogs]: app-insights-java-trace-logs.md
[metrics]: app-insights-metrics-explorer.md
[usage]: app-insights-web-track-usage.md

 