---
title: Azure Monitor Application Insights Java
description: Application performance monitoring for Java applications running in any environment without requiring code modification. Distributed tracing and application map.
ms.topic: conceptual
ms.date: 03/29/2020

---

# Java codeless application monitoring Azure Monitor Application Insights

Java codeless application monitoring is all about simplicity - there are no code changes, the Java agent can be enabled through just a couple of configuration changes.

 The Java agent works in any environment, and allows you to monitor all of your Java applications. In other words, whether you are running your Java apps on VMs, on-premises, in AKS, on Windows, Linux - you name it, the Java 3.0 agent will monitor your app.

Adding the Application Insights Java SDK to your application is no longer required, as the 3.0 agent auto-collects requests, dependencies and logs all on its own.

You can still send custom telemetry from your application. The 3.0 agent will track and correlate it along with all of the auto-collected telemetry.

The 3.0 agent supports Java 8 and above.

## Quickstart

**1. Download the agent**

> [!WARNING]
> **If you are upgrading from 3.0 Preview**
>
> Please review all the [configuration options](./java-standalone-config.md) carefully,
> as the json structure has completely changed, in addition to the file name itself which went all lowercase.

Download [applicationinsights-agent-3.0.0.jar](https://github.com/microsoft/ApplicationInsights-Java/releases/download/3.0.0/applicationinsights-agent-3.0.0.jar)

**2. Point the JVM to the agent**

Add `-javaagent:path/to/applicationinsights-agent-3.0.0.jar` to your application's JVM args

Typical JVM args include `-Xmx512m` and `-XX:+UseG1GC`. So if you know where to add these, then you already know where to add this.

For additional help with configuring your application's JVM args, please see [Tips for updating your JVM args](./java-standalone-arguments.md).

**3. Point the agent to your Application Insights resource**

If you do not already have an Application Insights resource, you can create a new one by following the steps in the [resource creation guide](./create-new-resource.md).

Point the agent to your Application Insights resource, either by setting an environment variable:

```
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=...
```

Or by creating a configuration file named `applicationinsights.json`, and placing it in the same directory as `applicationinsights-agent-3.0.0.jar`, with the following content:

```json
{
  "connectionString": "InstrumentationKey=..."
}
```

You can find your connection string in your Application Insights resource:

:::image type="content" source="media/java-ipa/connection-string.png" alt-text="Application Insights Connection String":::

**4. That's it!**

Now start up your application and go to your Application Insights resource in the Azure portal to see your monitoring data.

> [!NOTE]
> It may take a couple of minutes for your monitoring data to show up in the portal.


## Configuration options

In the `applicationinsights.json` file, you can additionally configure:

* Cloud role name
* Cloud role instance
* Sampling
* JMX metrics
* Custom dimensions
* Telemetry processors (preview)
* Auto-collected logging
* Auto-collected Micrometer metrics (including Spring Boot Actuator metrics)
* Heartbeat
* HTTP Proxy
* Self-diagnostics

See [configuration options](./java-standalone-config.md) for full details.

## Auto-collected requests, dependencies, logs, and metrics

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
* Log4j (including MDC properties)
* SLF4J/Logback (including MDC properties)

### Metrics

* Micrometer (including Spring Boot Actuator metrics)
* JMX Metrics

## Sending custom telemetry from your application

Our goal in 3.0+ is to allow you to send your custom telemetry using standard APIs.

We support Micrometer, OpenTelemetry API, and the popular logging frameworks. Application Insights Java 3.0 will automatically capture the telemetry, and correlate it along with all of the auto-collected telemetry.

### Supported custom telemetry

The table below represents currently supported custom telemetry types that you can enable to supplement the Java 3.0 agent. To summarize, custom metrics are supported through micrometer, custom exceptions and traces can be enabled through logging frameworks, and any type of the custom telemetry is supported through the [Application Insights Java 2.x SDK](#sending-custom-telemetry-using-application-insights-java-sdk-2x). 

|                     | Micrometer | Log4j, logback, JUL | 2.x SDK |
|---------------------|------------|---------------------|---------|
| **Custom Events**   |            |                     |  Yes    |
| **Custom Metrics**  |  Yes       |                     |  Yes    |
| **Dependencies**    |            |                     |  Yes    |
| **Exceptions**      |            |  Yes                |  Yes    |
| **Page Views**      |            |                     |  Yes    |
| **Requests**        |            |                     |  Yes    |
| **Traces**          |            |  Yes                |  Yes    |

We're not planning to release an SDK with Application Insights 3.0 at this time.

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

If you're already using Application Insights Java SDK 2.x in your application, there is no need to remove it.
The Java 3.0 agent will detect it, and capture and correlate any custom telemetry you're sending via the Java SDK 2.x,
while suppressing any auto-collection performed by the Java SDK 2.x to prevent duplicate telemetry.

If you were using Application Insights 2.x agent, you need to remove the `-javaagent:` JVM arg
that was pointing to the 2.x agent.

> [!NOTE]
> Java SDK 2.x TelemetryInitializers and TelemetryProcessors will not be run when using the 3.0 agent.
> Many of the use cases that previously required these can be solved in 3.0
> by configuring [custom dimensions](./java-standalone-config.md#custom-dimensions)
> or configuring [telemetry processors](./java-standalone-telemetry-processors.md).

> [!NOTE]
> 3.0 does not support multiple instrumentation keys in a single JVM yet.
