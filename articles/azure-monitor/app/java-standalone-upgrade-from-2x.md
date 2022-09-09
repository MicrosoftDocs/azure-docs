---
title: Upgrading from 2.x - Azure Monitor Application Insights Java
description: Upgrading from Azure Monitor Application Insights Java 2.x
ms.topic: conceptual
ms.date: 11/25/2020
ms.devlang: java
ms.custom: devx-track-java
ms.reviewer: mmcc
---

# Upgrading from Application Insights Java 2.x SDK

If you're already using Application Insights Java 2.x SDK in your application, you can keep using it.
The Application Insights Java 3.x agent will detect it,
and capture and correlate any custom telemetry you're sending via the 2.x SDK,
while suppressing any auto-collection performed by the 2.x SDK to prevent duplicate telemetry.

If you were using Application Insights 2.x agent, you need to remove the `-javaagent:` JVM arg
that was pointing to the 2.x agent.

The rest of this document describes limitations and changes that you may encounter
when upgrading from 2.x to 3.x, as well as some workarounds that you may find helpful.



## TelemetryInitializers and TelemetryProcessors

The 2.x SDK TelemetryInitializers and TelemetryProcessors will not be run when using the 3.x agent.
Many of the use cases that previously required these can be solved in Application Insights Java 3.x
by configuring [custom dimensions](./java-standalone-config.md#custom-dimensions)
or configuring [telemetry processors](./java-standalone-telemetry-processors.md).

## Multiple applications in a single JVM

This use case is supported in Application Insights Java 3.x using [Instrumentation key overrides (preview)](./java-standalone-config.md#instrumentation-key-overrides-preview).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-instrumentation-key-deprecation.md)]

## Operation names

In the Application Insights Java 2.x SDK, in some cases, the operation names contained the full path, e.g.

:::image type="content" source="media/java-ipa/upgrade-from-2x/operation-names-with-full-path.png" alt-text="Screenshot showing operation names with full path":::

Operation names in Application Insights Java 3.x have changed to generally provide a better aggregated view
in the Application Insights Portal U/X, e.g.

:::image type="content" source="media/java-ipa/upgrade-from-2x/operation-names-parameterized.png" alt-text="Screenshot showing operation names parameterized":::

However, for some applications, you may still prefer the aggregated view in the U/X
that was provided by the previous operation names, in which case you can use the
[telemetry processors](./java-standalone-telemetry-processors.md) (preview) feature in 3.x
to replicate the previous behavior.

The snippet below configures 3 telemetry processors that combine to replicate the previous behavior.
The telemetry processors perform the following actions (in order):

1. The first telemetry processor is an attribute processor (has type `attribute`),
   which means it applies to all telemetry which has attributes
   (currently `requests` and `dependencies`, but soon also `traces`).

   It will match any telemetry that has attributes named `http.method` and `http.url`.

   Then it will extract the path portion of the `http.url` attribute into a new attribute named `tempName`.

2. The second telemetry processor is a span processor (has type `span`),
   which means it applies to `requests` and `dependencies`.

   It will match any span that has an attribute named `tempPath`.

   Then it will update the span name from the attribute `tempPath`.

3. The last telemetry processor is an attribute processor, same type as the first telemetry processor.

   It will match any telemetry that has an attribute named `tempPath`.

   Then it will delete the attribute named `tempPath`, so that it won't be reported as a custom dimension.

```
{
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "include": {
          "matchType": "strict",
          "attributes": [
            { "key": "http.method" },
            { "key": "http.url" }
          ]
        },
        "actions": [
          {
            "key": "http.url",
            "pattern": "https?://[^/]+(?<tempPath>/[^?]*)",
            "action": "extract"
          }
        ]
      },
      {
        "type": "span",
        "include": {
          "matchType": "strict",
          "attributes": [
            { "key": "tempPath" }
          ]
        },
        "name": {
          "fromAttributes": [ "http.method", "tempPath" ],
          "separator": " "
        }
      },
      {
        "type": "attribute",
        "include": {
          "matchType": "strict",
          "attributes": [
            { "key": "tempPath" }
          ]
        },
        "actions": [
          { "key": "tempPath", "action": "delete" }
        ]
      }
    ]
  }
}
```

## 2.x SDK logging appenders

Application Insights Java 3.x [auto-collects logging](./java-standalone-config.md#auto-collected-logging)
without the need for configuring any logging appenders.
If you are using 2.x SDK logging appenders, those can be removed,
as they will be suppressed by the Application Insights Java 3.x anyways.

## 2.x SDK spring boot starter

There is no Application Insights Java 3.x spring boot starter.
3.x setup and configuration follows the same [simple steps](./java-in-process-agent.md#get-started)
whether you are using spring boot or not.

When upgrading from the Application Insights Java 2.x SDK spring boot starter,
note that the cloud role name will no longer default to `spring.application.name`.
See the [3.x configuration docs](./java-standalone-config.md#cloud-role-name)
for setting the cloud role name in 3.x via json config or environment variable.
