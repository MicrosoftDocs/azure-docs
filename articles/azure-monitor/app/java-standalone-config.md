---
title: Monitor Java applications anywhere - Azure Monitor Application Insights
description: Codeless application performance monitoring for Java applications running in any environment without instrumenting the app. Find the root cause of the issues d using distributed tracing and application map.
ms.topic: conceptual
ms.date: 04/16/2020

---

# Configuration options - Java standalone agent for Azure Monitor Application Insights



## Connection string and role name

```json
{
  "instrumentationSettings": {
    "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
    "preview": {
      "roleName": "my cloud role name"
    }
  }
}
```

The connection string is required, and the role name is important any time you are sending data from different applications to the same Application Insights resource.

You will find more details and additional configuration options below for more details.

## Configuration file path

By default, Application Insights Java 3.0 Preview expects the configuration file to be named `ApplicationInsights.json`, and to be located in the same directory as `applicationinsights-agent-3.0.0-PREVIEW.4.jar`.

You can specify your own configuration file path using either

* `APPLICATIONINSIGHTS_CONFIGURATION_FILE` environment variable, or
* `applicationinsights.configurationFile` Java system property

If you specify a relative path, it will be resolved relative to the directory where `applicationinsights-agent-3.0.0-PREVIEW.4.jar` is located.

## Connection string

This is required. You can find your connection string in your Application Insights resource:

:::image type="content" source="media/java-ipa/connection-string.png" alt-text="Application Insights Connection String":::

You can also set the connection string using the environment variable `APPLICATIONINSIGHTS_CONNECTION_STRING`.

## Cloud role name

Cloud role name is used to label the component on the application map.

If you want to set the cloud role name:

```json
{
  "instrumentationSettings": {
    "preview": {   
      "roleName": "my cloud role name"
    }
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
  "instrumentationSettings": {
    "preview": {
      "roleInstance": "my cloud role instance"
    }
  }
}
```

You can also set the cloud role instance using the environment variable `APPLICATIONINSIGHTS_ROLE_INSTANCE`.

## Application log capture

Application Insights Java 3.0 Preview automatically captures application logging via Log4j, Logback, and java.util.logging.

By default it will capture all logging performed at `WARN` level or above.

If you want to change this threshold:

```json
{
  "instrumentationSettings": {
    "preview": {
      "instrumentation": {
        "logging": {
          "threshold": "ERROR"
        }
      }
    }
  }
}
```

These are the valid `threshold` values that you can specify in the `ApplicationInsights.json` file, and how they correspond to logging levels across different logging frameworks:

| `threshold`  | Log4j  | Logback | JUL     |
|--------------|--------|---------|---------|
| OFF          | OFF    | OFF     | OFF     |
| FATAL        | FATAL  | ERROR   | SEVERE  |
| ERROR/SEVERE | ERROR  | ERROR   | SEVERE  |
| WARN/WARNING | WARN   | WARN    | WARNING |
| INFO         | INFO   | INFO    | INFO    |
| CONFIG       | DEBUG  | DEBUG   | CONFIG  |
| DEBUG/FINE   | DEBUG  | DEBUG   | FINE    |
| FINER        | DEBUG  | DEBUG   | FINER   |
| TRACE/FINEST | TRACE  | TRACE   | FINEST  |
| ALL          | ALL    | ALL     | ALL     |

## JMX metrics

If you have some JMX metrics that you are interested in capturing:

```json
{
  "instrumentationSettings": {
    "preview": {
        "jmxMetrics": [
        {
          "objectName": "java.lang:type=ClassLoading",
          "attribute": "LoadedClassCount",
          "display": "Loaded Class Count"
        },
        {
          "objectName": "java.lang:type=MemoryPool,name=Code Cache",
          "attribute": "Usage.used",
          "display": "Code Cache Used"
        }
      ]
    }
  }
}
```

## Micrometer (including metrics from Spring Boot Actuator)

If your application uses [Micrometer](https://micrometer.io), Application Insights 3.0 (starting with Preview.2) now captures metrics sent to the Micrometer global registry.

If your application uses [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/production-ready-features.html), Application Insights 3.0 (starting with Preview.4) now captures metrics configured by Spring Boot Actuator (which uses Micrometer, but doesn't use the Micrometer global registry).

If you want to disable these features:

```json
{
  "instrumentationSettings": {
    "preview": {
      "instrumentation": {
        "micrometer": {
          "enabled": false
        }
      }
    }
  }
}
```

## Heartbeat

By default, Application Insights Java 3.0 Preview sends a heartbeat metric once every 15 minutes. If you are using the heartbeat metric to trigger alerts, you can increase the frequency of this heartbeat:

```json
{
  "instrumentationSettings": {
    "preview": {
        "heartbeat": {
            "intervalSeconds": 60
        }
    }
  }
}
```

> [!NOTE]
> You cannot decrease the frequency of this heartbeat, as the heartbeat data is also used to track Application Insights usage.

## Sampling

Sampling is helpful if you need to reduce cost.
Sampling is performed as a function on the operation ID (also known as trace ID), so that the same operation ID will always result in the same sampling decision. This ensures that you won't get parts of a distributed transaction sampled in while other parts of it are sampled out.

For example, if you set sampling to 10%, you will only see 10% of your transactions, but each one of those 10% will have full end-to-end transaction details.

Here is an example how to set the sampling to **10% of all transactions** - please make sure you set the sampling rate that is correct for your use case:

```json
{
  "instrumentationSettings": {
    "preview": {
        "sampling": {
            "fixedRate": {
                "percentage": 10
            }
          }
        }
    }
}
```

## HTTP Proxy

If your application is behind a firewall and cannot connect directly to Application Insights (see [IP addresses used by Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/ip-addresses)), you can configure Application Insights Java 3.0 Preview to use an HTTP proxy:

```json
{
  "instrumentationSettings": {
    "preview": {
      "httpProxy": {
        "host": "myproxy",
        "port": 8080
      }
    }
  }
}
```

## Self-diagnostics

"Self-diagnostics" refers to internal logging from Application Insights Java 3.0 Preview.

This can be helpful for spotting and diagnosing issues with Application Insights itself.

By default, it logs to console with level `warn`, corresponding to this configuration:

```json
{
  "instrumentationSettings": {
    "preview": {
        "selfDiagnostics": {
            "destination": "console",
            "level": "WARN"
        }
    }
  }
}
```

Valid levels are `OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG`, and `TRACE`.

If you want to log to a file instead of logging to console:

```json
{
  "instrumentationSettings": {
    "preview": {
        "selfDiagnostics": {
            "destination": "file",
            "directory": "/var/log/applicationinsights",
            "level": "WARN",
            "maxSizeMB": 10
        }    
    }
  }
}
```

When using file logging, once the file hits `maxSizeMB`, it will rollover, keeping just the most recently completed log file in addition to the current log file.
