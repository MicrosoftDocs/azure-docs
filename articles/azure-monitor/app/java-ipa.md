---
title: Monitor Java applications on any environment 
description: Application performance monitoring for Java applications running in any environment without instrumenting the app. Distributed tracing and application map.
ms.topic: conceptual
ms.date: 03/29/2020

---

# Java codeless application monitoring - public preview

One of the major goals of 3.0 is to simplify the onboarding experience.

Adding the Application Insights Java SDK to your application is no longer required, as the 3.0 agent auto-collects requests, dependencies and logs all on its own.

But don't worry, you can still send custom telemetry from your application if you wish, and the 3.0 agent will track and correlate it along with all of the auto-collected telemetry.

## Quick Start 

1. Download the agent
Download [applicationinsights-agent-3.0.0-PRIVATEPREVIEW.jar](https://applicationinsightsjava.blob.core.windows.net/privatepreview/applicationinsights-agent-3.0.0-PRIVATEPREVIEW.jar)
1. Point the JVM to the agent. Add the Java agent to your application's JVM args
```powershell
-javaagent:path/to/applicationinsights-agent-3.0.0-PRIVATEPREVIEW.jar
``` 
3. Point the agent to your Application Insights resource
Set the environment variable APPLICATIONINSIGHTS_CONNECTION_STRING, e.g.
```powershell
export APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=00000000-0000-0000-0000-000000000000
```
You can find the connection string in your Application Insights resource.
1. That's it!!
Now start up your application and go to your Application Insights resource in the Azure portal to see your monitoring data. Note: it may take a few minutes for your monitoring data to show up in the portal.

## Auto-collection of requests, dependencies and logs

The following are auto-collected by the agent:

### Requests

* JMS Consumers 
* Kafka Consumers 
* Netty/WebFlux 
* Servlets
* Spring Scheduling 

### Dependencies with distributed trace propagation

* Apache HttpClient and HttpAsyncClient
* gRPC 
* java.net.HttpURLConnection
* JMS 
* Kafka 
* Netty client 
* OkHttp

### Other dependencies

* Cassandra 
* JDBC
* MongoDB (async and sync)
* Redis (Lettuce and Jedis)

### Logs

* java.util.logging 
* Log4j
* SLF4J/Logback

## Sending custom telemetry from your application

Our goal in 3.0+ is to allow you to send your custom telemetry using standard APIs.

We plan to initially support Micrometer, OpenTelemetry API, and the popular logging frameworks.

Application Insights Java 3.0 will automatically capture telemetry that is sent to these APIs, and correlate it along with all of the auto-collected telemetry.

For this reason, we are not planning to release an SDK with Application Insights 3.0 at this time.

Application Insights Java 3.0 is already listening for telemetry that is sent to the Application Insights Java SDK 2.x. We have no plans to remove this support, as it is an important part of the upgrade story for existing 2.x users, and it fills an important gap in our custom telemetry support until OpenTelemetry API is GA.

### Sending custom telemetry using Application Insights Java SDK 2.x
[Working on this - Julia]

### Upgrading from Application Insights Java SDK 2.x
[Working on this - Julia]