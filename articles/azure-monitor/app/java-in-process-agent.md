---
title: Monitor Java applications on any environment - Azure Monitor Application Insights
description: Application performance monitoring for Java applications running in any environment without instrumenting the app. Distributed tracing and application map.
ms.topic: conceptual
ms.date: 03/29/2020

---

# Java codeless application monitoring Azure Monitor Application Insights - public preview

Java codeless application monitoring is all about simplicity - there are no code changes, the Java agent can be enabled through just a couple of configuration changes.

 The Java agent works in any environment, and allows you to monitor all of your Java applications. In other words, whether you are running your Java apps on VMs, on-premises, in AKS, on Windows, Linux - you name it, the Java 3.0 agent will monitor your app.

Adding the Application Insights Java SDK to your application is no longer required, as the 3.0 agent autocollects requests, dependencies and logs all on its own.

You can still send custom telemetry from your application. The 3.0 agent will track and correlate it along with all of the autocollected telemetry.

## Quickstart

**1. Download the agent**

Download [applicationinsights-agent-3.0.0-PREVIEW.4.jar](https://github.com/microsoft/ApplicationInsights-Java/releases/download/3.0.0-PREVIEW.4/applicationinsights-agent-3.0.0-PREVIEW.4.jar)

**2. Point the JVM to the agent**

Add `-javaagent:path/to/applicationinsights-agent-3.0.0-PREVIEW.4.jar` to your application's JVM args

Typical JVM args include `-Xmx512m` and `-XX:+UseG1GC`. So if you know where to add these, then you already know where to add this.

For additional help with configuring your application's JVM args, please see [3.0 Preview: Tips for updating your JVM args](https://docs.microsoft.com/azure/azure-monitor/app/java-standalone-arguments).

**3. Point the agent to your Application Insights resource**

If you do not already have an Application Insights resource, you can create a new one by following the steps in the [resource creation guide](https://docs.microsoft.com/azure/azure-monitor/app/create-new-resource).

Point the agent to your Application Insights resource, either by setting an environment variable:

```
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=00000000-0000-0000-0000-000000000000
```

Or by creating a configuration file named `ApplicationInsights.json`, and placing it in the same directory as `applicationinsights-agent-3.0.0-PREVIEW.4.jar`, with the following content:

```json
{
  "instrumentationSettings": {
    "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000"
  }
}
```

You can find your connection string in your Application Insights resource:

:::image type="content" source="media/java-ipa/connection-string.png" alt-text="Application Insights Connection String":::

**4. That's it!**

Now start up your application and go to your Application Insights resource in the Azure portal to see your monitoring data.

> [!NOTE]
> It may take a couple of minutes for your monitoring data to show up in the portal.


## Configuration options

In the `ApplicationInsights.json` file, you can additionally configure:

* Cloud role name
* Cloud role instance
* Application log capture
* JMX metrics
* Micrometer
* Heartbeat
* Sampling
* HTTP Proxy
* Self diagnostics

See details at [3.0 Public Preview: Configuration Options](https://docs.microsoft.com/azure/azure-monitor/app/java-standalone-config).

## Autocollected requests, dependencies, logs, and metrics

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

### Metrics

* Micrometer (including Spring Boot Actuator metrics)
* JMX Metrics

## Sending custom telemetry from your application

Our goal in 3.0+ is to allow you to send your custom telemetry using standard APIs.

We support Micrometer, OpenTelemetry API, and the popular logging frameworks. Application Insights Java 3.0 will automatically capture the telemetry, and correlate it along with all of the autocollected telemetry.

For this reason, we're not planning to release an SDK with Application Insights 3.0 at this time.

Application Insights Java 3.0 is already listening for telemetry that is sent to the Application Insights Java SDK 2.x. This functionality is an important part of the upgrade story for existing 2.x users, and it fills an important gap in our custom telemetry support until the OpenTelemetry API is GA.

## Sending custom telemetry using Application Insights Java SDK 2.x

Add `applicationinsights-core-2.6.0.jar` to your application (all 2.x versions are supported by Application Insights Java 3.0, but it's worth using the latest if you have a choice):

```xml
  <dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-core</artifactId>
    <version>2.6.0</version>
  </dependency>
```

Create a TelemetryClient:

  ```java
private static final TelemetryClient telemetryClient = new TelemetryClient();
```

and use that for sending custom telemetry.

### Events

  ```java
telemetryClient.trackEvent("WinGame");
```
### Metrics

You can send metric telemetry via [Micrometer](https://micrometer.io):

```java
  Counter counter = Metrics.counter("test_counter");
  counter.increment();
```

Or you can also use Application Insights Java SDK 2.x:

```java
  telemetryClient.trackMetric("queueLength", 42.0);
```

### Dependencies

```java
  boolean success = false;
  long startTime = System.currentTimeMillis();
  try {
      success = dependency.call();
  } finally {
      long endTime = System.currentTimeMillis();
      RemoteDependencyTelemetry telemetry = new RemoteDependencyTelemetry();
      telemetry.setTimestamp(new Date(startTime));
      telemetry.setDuration(new Duration(endTime - startTime));
      telemetryClient.trackDependency(telemetry);
  }
```

### Logs
You can send custom log telemetry via your favorite logging framework.

Or you can also use Application Insights Java SDK 2.x:

```java
  telemetryClient.trackTrace(message, SeverityLevel.Warning, properties);
```

### Exceptions
You can send custom exception telemetry via your favorite logging framework.

Or you can also use Application Insights Java SDK 2.x:

```java
  try {
      ...
  } catch (Exception e) {
      telemetryClient.trackException(e);
  }
```

## Upgrading from Application Insights Java SDK 2.x

If you're already using Application Insights Java SDK 2.x in your application, there is no need to remove it. The Java 3.0 agent will detect it, and capture and correlate any custom telemetry you're sending via the Java SDK 2.x, while suppressing any autocollection performed by the Java SDK 2.x to prevent duplicate capture.

> [!NOTE]
> Note: Java SDK 2.x TelemetryInitializers and TelemetryProcessors will not be run when using the 3.0 agent.
