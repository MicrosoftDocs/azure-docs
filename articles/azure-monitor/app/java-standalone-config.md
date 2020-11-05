---
title: Configuration options - Azure Monitor Application Insights Java
description: Configuration options for Azure Monitor Application Insights Java
ms.topic: conceptual
ms.date: 04/16/2020
ms.custom: devx-track-java
---

# Configuration options for Azure Monitor Application Insights Java

> [!WARNING]
> **If you are upgrading from 3.0 Preview**
>
> Please review all the configuration settings below, as the structure has completely changed, in addition to the
> file name itself which went all lowercase.

## Connection string and role name

Connection string and role name are the most common settings needed to get started:

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "role": {
    "name": "my cloud role name"
  }
}
```

The connection string is required, and the role name is important any time you are sending data
from different applications to the same Application Insights resource.

You will find more details and additional configuration options below.

## Configuration file path

By default, Application Insights Java 3.0 expects the configuration file to be named `applicationinsights.json`, and to be located in the same directory as `applicationinsights-agent-3.0.0.jar`.

You can specify your own configuration file path using either

* `APPLICATIONINSIGHTS_CONFIGURATION_FILE` environment variable, or
* `applicationinsights.configuration.file` Java system property

If you specify a relative path, it will be resolved relative to the directory where `applicationinsights-agent-3.0.0.jar` is located.

## Connection string

This is required. You can find your connection string in your Application Insights resource:

:::image type="content" source="media/java-ipa/connection-string.png" alt-text="Application Insights Connection String":::


```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000"
}
```

You can also set the connection string using the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`.

Not setting the connection string will disable the Java agent.

## Cloud role name

Cloud role name is used to label the component on the application map.

If you want to set the cloud role name:

```json
{
  "role": {   
    "name": "my cloud role name"
  }
}
```

If cloud role name is not set, the Application Insights resource's name will be used to label the component on the application map.

You can also set the cloud role name using the environment variable `APPLICATIONINSIGHTS_ROLE_NAME`.

## Cloud role instance

Cloud role instance defaults to the machine name.

If you want to set the cloud role instance to something different rather than the machine name:

```json
{
  "role": {
    "name": "my cloud role name",
    "instance": "my cloud role instance"
  }
}
```

You can also set the cloud role instance using the environment variable `APPLICATIONINSIGHTS_ROLE_INSTANCE`.

## Sampling

Sampling is helpful if you need to reduce cost.
Sampling is performed as a function on the operation ID (also known as trace ID), so that the same operation ID will always result in the same sampling decision. This ensures that you won't get parts of a distributed transaction sampled in while other parts of it are sampled out.

For example, if you set sampling to 10%, you will only see 10% of your transactions, but each one of those 10% will have full end-to-end transaction details.

Here is an example how to set the sampling to capture approximately **1/3 of all transactions** - please make sure you set the sampling rate that is correct for your use case:

```json
{
  "sampling": {
    "percentage": 33.333
  }
}
```

You can also set the sampling percentage using the environment variable `APPLICATIONINSIGHTS_SAMPLING_PERCENTAGE`.

> [!NOTE]
> For the sampling percentage, choose a percentage that is close to 100/N where N is an integer. Currently sampling doesn't support other values.

## JMX metrics

If you want to collect some additional JMX metrics:

```json
{
  "jmxMetrics": [
    {
      "name": "JVM uptime (millis)",
      "objectName": "java.lang:type=Runtime",
      "attribute": "Uptime"
    },
    {
      "name": "MetaSpace Used",
      "objectName": "java.lang:type=MemoryPool,name=Metaspace",
      "attribute": "Usage.used"
    }
  ]
}
```

`name` is the metric name that will be assigned to this JMX metric (can be anything).

`objectName` is the [Object Name](https://docs.oracle.com/javase/8/docs/api/javax/management/ObjectName.html)
of the JMX MBean that you want to collect.

`attribute` is the attribute name inside of the JMX MBean that you want to collect.

Numeric and boolean JMX metric values are supported. Boolean JMX metrics are mapped to `0` for false, and `1` for true.

[//]: # "NOTE: Not documenting APPLICATIONINSIGHTS_JMX_METRICS here"
[//]: # "json embedded in env var is messy, and should be documented only for codeless attach scenario"

## Custom dimensions

If you want to add custom dimensions to all of your telemetry:

```json
{
  "customDimensions": {
    "mytag": "my value",
    "anothertag": "${ANOTHER_VALUE}"
  }
}
```

`${...}` can be used to read the value from specified environment variable at startup.

## Telemetry processors (preview)

This is a preview feature.

It allows you to configure rules that will be applied to request, dependency and trace telemetry, e.g.
 * Mask sensitive data
 * Conditionally add custom dimensions
 * Update the telemetry name used for aggregation and display

For more information, check out the [telemetry processor](./java-standalone-telemetry-processors.md) documentation.

## Auto-collected logging

Log4j, Logback, and java.util.logging are auto-instrumented, and logging performed via these logging frameworks
is auto-collected.

By default, logging is only collected when that logging is performed at the `INFO` level or above.

If you want to change this collection level:

```json
{
  "instrumentation": {
    "logging": {
      "level": "WARN"
    }
  }
}
```

You can also set the threshold using the environment variable `APPLICATIONINSIGHTS_INSTRUMENTATION_LOGGING_LEVEL`.

These are the valid `level` values that you can specify in the `applicationinsights.json` file, and how they correspond to logging levels in different logging frameworks:

| level             | Log4j  | Logback | JUL     |
|-------------------|--------|---------|---------|
| OFF               | OFF    | OFF     | OFF     |
| FATAL             | FATAL  | ERROR   | SEVERE  |
| ERROR (or SEVERE) | ERROR  | ERROR   | SEVERE  |
| WARN (or WARNING) | WARN   | WARN    | WARNING |
| INFO              | INFO   | INFO    | INFO    |
| CONFIG            | DEBUG  | DEBUG   | CONFIG  |
| DEBUG (or FINE)   | DEBUG  | DEBUG   | FINE    |
| FINER             | DEBUG  | DEBUG   | FINER   |
| TRACE (or FINEST) | TRACE  | TRACE   | FINEST  |
| ALL               | ALL    | ALL     | ALL     |

## Auto-collected Micrometer metrics (including Spring Boot Actuator metrics)

If your application uses [Micrometer](https://micrometer.io),
then metrics that are sent to the Micrometer global registry are auto-collected.

Also, if your application uses
[Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html),
then metrics configured by Spring Boot Actuator are also auto-collected.

To disable auto-collection of Micrometer metrics (including Spring Boot Actuator metrics):

```json
{
  "instrumentation": {
    "micrometer": {
      "enabled": false
    }
  }
}
```

## Heartbeat

By default, Application Insights Java 3.0 sends a heartbeat metric once every 15 minutes. If you are using the heartbeat metric to trigger alerts, you can increase the frequency of this heartbeat:

```json
{
  "heartbeat": {
    "intervalSeconds": 60
  }
}
```

> [!NOTE]
> You cannot decrease the frequency of this heartbeat, as the heartbeat data is also used to track Application Insights usage.

## HTTP Proxy

If your application is behind a firewall and cannot connect directly to Application Insights (see [IP addresses used by Application Insights](./ip-addresses.md)), you can configure Application Insights Java 3.0 to use an HTTP proxy:

```json
{
  "proxy": {
    "host": "myproxy",
    "port": 8080
  }
}
```

[//]: # "NOTE not advertising OpenTelemetry support until we support 0.10.0, which has massive breaking changes from 0.9.0"

[//]: # "## Support for OpenTelemetry API pre-1.0 releases"

[//]: # "Support for pre-1.0 versions of OpenTelemetry API is opt-in, because the OpenTelemetry API is not stable yet"
[//]: # "and so each version of the agent only supports a specific pre-1.0 versions of OpenTelemetry API"
[//]: # "(this limitation will not apply once OpenTelemetry API 1.0 is released)."

[//]: # "```json"
[//]: # "{"
[//]: # "  \"preview\": {"
[//]: # "    \"openTelemetryApiSupport\": true"
[//]: # "  }"
[//]: # "}"
[//]: # "```"

## Self-diagnostics

"Self-diagnostics" refers to internal logging from Application Insights Java 3.0.

This can be helpful for spotting and diagnosing issues with Application Insights itself.

By default, Application Insights Java 3.0 logs at level `INFO` to both the file `applicationinsights.log`
and the console, corresponding to this configuration:

```json
{
  "selfDiagnostics": {
    "destination": "file+console",
    "level": "INFO",
    "file": {
      "path": "applicationinsights.log",
      "maxSizeMb": 5,
      "maxHistory": 1
    }
  }
}
```

`destination` can be one of `file`, `console` or `file+console`.

`level` can be one of `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG`, or `TRACE`.

`path` can be an absolute or relative path. Relative paths are resolved against the directory where
`applicationinsights-agent-3.0.0.jar` is located.

`maxSizeMb` is the max size of the log file before it rolls over.

`maxHistory` is the number of rolled over log files that are retained (in addition to the current log file).
