---
title: Configuration options - Azure Monitor Application Insights for Java
description: How to configure Azure Monitor Application Insights for Java
ms.topic: conceptual
ms.date: 11/04/2020
author: MS-jgol
ms.custom: devx-track-java
ms.author: jgol
---

# Configuration options - Azure Monitor Application Insights for Java

> [!WARNING]
> **If you are upgrading from 3.0 Preview**
>
> Please review all the configuration options below carefully, as the json structure has completely changed,
> in addition to the file name itself which went all lowercase.

## Connection string and role name

Connection string and role name are the most common settings needed to get started:

```json
{
  "connectionString": "InstrumentationKey=...",
  "role": {
    "name": "my cloud role name"
  }
}
```

The connection string is required, and the role name is important any time you are sending data
from different applications to the same Application Insights resource.

You will find more details and additional configuration options below.

## Configuration file path

By default, Application Insights Java 3.0 expects the configuration file to be named `applicationinsights.json`, and to be located in the same directory as `applicationinsights-agent-3.0.3.jar`.

You can specify your own configuration file path using either

* `APPLICATIONINSIGHTS_CONFIGURATION_FILE` environment variable, or
* `applicationinsights.configuration.file` Java system property

If you specify a relative path, it will be resolved relative to the directory where `applicationinsights-agent-3.0.3.jar` is located.

## Connection string

Connection string is required. You can find your connection string in your Application Insights resource:

:::image type="content" source="media/java-ipa/connection-string.png" alt-text="Application Insights Connection String":::


```json
{
  "connectionString": "InstrumentationKey=..."
}
```

You can also set the connection string using the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`
(which will then take precedence over connection string specified in the json configuration).

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

You can also set the cloud role name using the environment variable `APPLICATIONINSIGHTS_ROLE_NAME`
(which will then take precedence over cloud role name specified in the json configuration).

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

You can also set the cloud role instance using the environment variable `APPLICATIONINSIGHTS_ROLE_INSTANCE`
(which will then take precedence over cloud role instance specified in the json configuration).

## Sampling

Sampling is helpful if you need to reduce cost.
Sampling is performed as a function on the operation ID (also known as trace ID), so that the same operation ID will always result in the same sampling decision. This ensures that you won't get parts of a distributed transaction sampled in while other parts of it are sampled out.

For example, if you set sampling to 10%, you will only see 10% of your transactions, but each one of those 10% will have full end-to-end transaction details.

Here is an example how to set the sampling to capture approximately **1/3 of all transactions** - make sure you set the sampling rate that is correct for your use case:

```json
{
  "sampling": {
    "percentage": 33.333
  }
}
```

You can also set the sampling percentage using the environment variable `APPLICATIONINSIGHTS_SAMPLING_PERCENTAGE`
(which will then take precedence over sampling percentage specified in the json configuration).

> [!NOTE]
> For the sampling percentage, choose a percentage that is close to 100/N where N is an integer. Currently sampling doesn't support other values.

## Sampling overrides (preview)

This feature is in preview, starting from 3.0.3.

Sampling overrides allow you to override the [default sampling percentage](#sampling), for example:
* Set the sampling percentage to 0 (or some small value) for noisy health checks.
* Set the sampling percentage to 0 (or some small value) for noisy dependency calls.
* Set the sampling percentage to 100 for an important request type (e.g. `/login`)
  even though you have the default sampling configured to something lower.

For more information, check out the [sampling overrides](./java-standalone-sampling-overrides.md) documentation.

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

> [!NOTE]
> Starting from version 3.0.2, if you add a custom dimension named `service.version`, the value will be stored
> in the `application_Version` column in the Application Insights Logs table instead of as a custom dimension.

## Telemetry processors (preview)

This feature is in preview.

It allows you to configure rules that will be applied to request, dependency and trace telemetry, for example:
 * Mask sensitive data
 * Conditionally add custom dimensions
 * Update the span name, which is used to aggregate similar telemetry in the Azure portal.
 * Drop specific span attributes to control ingestion costs.

For more information, check out the [telemetry processor](./java-standalone-telemetry-processors.md) documentation.

> [!NOTE]
> If you are looking to drop specific (whole) spans for controlling ingestion cost,
> see [sampling overrides](./java-standalone-sampling-overrides.md).

## Auto-collected logging

Log4j, Logback, and java.util.logging are auto-instrumented, and logging performed via these logging frameworks
is auto-collected.

Logging is only captured if it first meets the level that is configured for the logging framework,
and second, also meets the level that is configured for Application Insights.

For example, if your logging framework is configured to log `WARN` (and above) from package `com.example`,
and Application Insights is configured to capture `INFO` (and above),
then Application Insights will only capture `WARN` (and above) from package `com.example`.

The default level configured for Application Insights is `INFO`. If you want to change this level:

```json
{
  "instrumentation": {
    "logging": {
      "level": "WARN"
    }
  }
}
```

You can also set the level using the environment variable `APPLICATIONINSIGHTS_INSTRUMENTATION_LOGGING_LEVEL`
(which will then take precedence over level specified in the json configuration).

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

> [!NOTE]
> If an exception object is passed to the logger, then the log message (and exception object details)
> will show up in the Azure portal under the `exceptions` table instead of the `traces` table.

## Auto-collected Micrometer metrics (including Spring Boot Actuator metrics)

If your application uses [Micrometer](https://micrometer.io),
then metrics that are sent to the Micrometer global registry are auto-collected.

Also, if your application uses
[Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html),
then metrics configured by Spring Boot Actuator are also auto-collected.

To disable auto-collection of Micrometer metrics (including Spring Boot Actuator metrics):

> [!NOTE]
> Custom metrics are billed separately and may generate additional costs. Make sure to check the detailed [pricing information](https://azure.microsoft.com/pricing/details/monitor/). To disable the Micrometer and Spring Actuator metrics, add the below configuration to your config file.

```json
{
  "instrumentation": {
    "micrometer": {
      "enabled": false
    }
  }
}
```

## Auto-collected Azure SDK telemetry (preview)

Many of the latest Azure SDK libraries emit telemetry (see the [full list](./java-in-process-agent.md#azure-sdks-preview)).

Starting from Application Insights Java 3.0.3, you can enable capturing this telemetry.

If you want to enable this feature:

```json
{
  "preview": {
    "instrumentation": {
      "azureSdk": {
        "enabled": true
      }
    }
  }
}
```

You can also enable this feature using the environment variable 
`APPLICATIONINSIGHTS_PREVIEW_INSTRUMENTATION_AZURE_SDK_ENABLED`
(which will then take precedence over enabled specified in the json configuration).

## Suppressing specific auto-collected telemetry

Starting from version 3.0.3, specific auto-collected telemetry can be suppressed using these configuration options:

```json
{
  "instrumentation": {
    "cassandra": {
      "enabled": false
    },
    "jdbc": {
      "enabled": false
    },
    "jms": {
      "enabled": false
    },
    "kafka": {
      "enabled": false
    },
    "micrometer": {
      "enabled": false
    },
    "mongo": {
      "enabled": false
    },
    "redis": {
      "enabled": false
    },
    "springScheduling": {
      "enabled": false
    }
  }
}
```

You can also suppress these instrumentations using these environment variables:

* `APPLICATIONINSIGHTS_INSTRUMENTATION_CASSANDRA_ENABLED`
* `APPLICATIONINSIGHTS_INSTRUMENTATION_JDBC_ENABLED`
* `APPLICATIONINSIGHTS_INSTRUMENTATION_JMS_ENABLED`
* `APPLICATIONINSIGHTS_INSTRUMENTATION_KAFKA_ENABLED`
* `APPLICATIONINSIGHTS_INSTRUMENTATION_MICROMETER_ENABLED`
* `APPLICATIONINSIGHTS_INSTRUMENTATION_MONGO_ENABLED`
* `APPLICATIONINSIGHTS_INSTRUMENTATION_REDIS_ENABLED`
* `APPLICATIONINSIGHTS_INSTRUMENTATION_SPRING_SCHEDULING_ENABLED`

(which will then take precedence over enabled specified in the json configuration).

> NOTE
> If you are looking for more fine-grained control, e.g. to suppress some redis calls but not all redis calls,
> see [sampling overrides](./java-standalone-sampling-overrides.md).

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
> You cannot increase the interval to longer than 15 minutes,
> because the heartbeat data is also used to track Application Insights usage.

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

Application Insights Java 3.0 also respects the global `-Dhttps.proxyHost` and `-Dhttps.proxyPort` if those are set
(and `-Dhttp.nonProxyHosts` if needed).

## Metric interval

This feature is in preview.

By default, metrics are captured every 60 seconds.

Starting from version 3.0.3, you can change this interval:

```json
{
  "preview": {
    "metricIntervalSeconds": 300
  }
}
```

The setting applies to all of these metrics:

* Default performance counters, e.g. CPU and Memory
* Default custom metrics, e.g. Garbage collection timing
* Configured JMX metrics ([see above](#jmx-metrics))
* Micrometer metrics ([see above](#auto-collected-micrometer-metrics-including-spring-boot-actuator-metrics))


[//]: # "NOTE OpenTelemetry support is in private preview until OpenTelemetry API reaches 1.0"

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

This functionality can be helpful for spotting and diagnosing issues with Application Insights itself.

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
`applicationinsights-agent-3.0.3.jar` is located.

`maxSizeMb` is the max size of the log file before it rolls over.

`maxHistory` is the number of rolled over log files that are retained (in addition to the current log file).

Starting from version 3.0.2, you can also set the self-diagnostics `level` using the environment variable `APPLICATIONINSIGHTS_SELF_DIAGNOSTICS_LEVEL`
(which will then take precedence over self-diagnostics level specified in the json configuration).

## An example

This is just an example to show what a configuration file looks like with multiple components.
Please configure specific options based on your needs.

```json
{
  "connectionString": "InstrumentationKey=...",
  "role": {
    "name": "my cloud role name"
  },
  "sampling": {
    "percentage": 100
  },
  "jmxMetrics": [
  ],
  "customDimensions": {
  },
  "instrumentation": {
    "logging": {
      "level": "INFO"
    },
    "micrometer": {
      "enabled": true
    }
  },
  "proxy": {
  },
  "preview": {
    "processors": [
    ]
  },
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
