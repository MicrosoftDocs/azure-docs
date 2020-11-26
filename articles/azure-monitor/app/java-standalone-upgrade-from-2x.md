---
title: Upgrading from 2.x - Azure Monitor Application Insights Java
description: Upgrading from Azure Monitor Application Insights Java 2.x
ms.topic: conceptual
ms.date: 11/25/2020

---

# Upgrading from Application Insights Java SDK 2.x

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

## HTTP remote dependency telemetry names
 
Remote dependency telemetry names for http dependencies has changed.

The reason for this is that it is in line with OpenTelemetry specification for span name,
and in general it gives better aggregation than our previous telemetry names.

However, for some applications and use-cases, the previous telemetry names may be optimal,
in which case you can configure telemetry processors to get the same behavior:

```
{
  "preview": {
    "processors": [
      {
        "type": "span",
        "include": {
          "matchType": "strict",
          "attributes": [
            {
              "key": "http.method"
            }
          ]
        },
        "name": {
          "toAttributes": {
            "rules": [
              "^(?<tempRoute>.*)$"
            ]
          }
        }
      },
      {
        "type": "span",
        "include": {
          "matchType": "strict",
          "attributes": [
            {
              "key": "http.method"
            }
          ]
        },
        "name": {
          "fromAttributes": [
            "http.method",
            "tempRoute"
          ],
          "separator": " "
        }
      },
      {
        "type": "attribute",
        "include": {
          "matchType": "strict",
          "attributes": [
            {
              "key": "http.method"
            }
          ]
        },
        "actions": [
          {
            "key": "tempRoute",
            "action": "delete"
          }
        ]
      }
    ]
  }
}
```
