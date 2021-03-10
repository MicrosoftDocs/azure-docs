---
title: Upgrading from 2.x - Azure Monitor Application Insights Java
description: Upgrading from Azure Monitor Application Insights Java 2.x
ms.topic: conceptual
ms.date: 11/25/2020
author: MS-jgol
ms.custom: devx-track-java
ms.author: jgol
---

# Upgrading from Application Insights Java 2.x SDK

If you're already using Application Insights Java 2.x SDK in your application, there is no need to remove it.
The Java 3.0 agent will detect it, and capture and correlate any custom telemetry you're sending via the 2.x SDK,
while suppressing any auto-collection performed by the 2.x SDK to prevent duplicate telemetry.

If you were using Application Insights 2.x agent, you need to remove the `-javaagent:` JVM arg
that was pointing to the 2.x agent.

The rest of this document describes limitations and changes that you may encounter
when upgrading from 2.x to 3.0, as well as some workarounds that you may find helpful.

## TelemetryInitializers and TelemetryProcessors

The 2.x SDK TelemetryInitializers and TelemetryProcessors will not be run when using the 3.0 agent.
Many of the use cases that previously required these can be solved in 3.0
by configuring [custom dimensions](./java-standalone-config.md#custom-dimensions)
or configuring [telemetry processors](./java-standalone-telemetry-processors.md).

## Multiple applications in a single JVM

Currently, 3.0 only supports a single
[connection string and role name](./java-standalone-config.md#connection-string-and-role-name)
per running process. In particular, you can't have multiple tomcat web apps in the same tomcat deployment
using different connection strings or different role names yet.

## Operation names

Operation names in 3.0 have changed to generally provide a better aggregated view
in the Application Insights Portal U/X.

:::image type="content" source="media/java-ipa/upgrade-from-2x/operation-names-3-0.png" alt-text="Operation names in 3.0":::

However, for some applications, you may still prefer the aggregated view in the U/X
that was provided by the previous operation names, in which case you can use the
[telemetry processors](./java-standalone-telemetry-processors.md) (preview) feature in 3.0
to replicate the previous behavior.

### Prefix the operation name with the http method (`GET`, `POST`, etc.)

In the 2.x SDK, the operation names were prefixed by the http method (`GET`, `POST`, etc.), e.g

:::image type="content" source="media/java-ipa/upgrade-from-2x/operation-names-prefixed-by-http-method.png" alt-text="Operation names prefixed by http method":::

The snippet below configures 3 telemetry processors that combine to replicate the previous behavior.
The telemetry processors perform the following actions (in order):

1. The first telemetry processor is a span processor (has type `span`),
   which means it applies to `requests` and `dependencies`.

   It will match any span that has an attribute named `http.method` and has a span name that begins with `/`.

   Then it will extract that span name into an attribute named `tempName`.

2. The second telemetry processor is also a span processor.

   It will match any span that has an attribute named `tempName`.

   Then it will update the span name by concatenating the two attributes `http.method` and `tempName`,
   separated by a space.

3. The last telemetry processor is an attribute processor (has type `attribute`),
   which means it applies to all telemetry which has attributes
   (currently `requests`, `dependencies` and `traces`).

   It will match any telemetry that has an attribute named `tempName`.

   Then it will delete the attribute named `tempName`, so that it won't be reported as a custom dimension.

```
{
  "preview": {
    "processors": [
      {
        "type": "span",
        "include": {
          "matchType": "regexp",
          "attributes": [
            { "key": "http.method", "value": "" }
          ],
          "spanNames": [ "^/" ]
        },
        "name": {
          "toAttributes": {
            "rules": [ "^(?<tempName>.*)$" ]
          }
        }
      },
      {
        "type": "span",
        "include": {
          "matchType": "strict",
          "attributes": [
            { "key": "tempName" }
          ]
        },
        "name": {
          "fromAttributes": [ "http.method", "tempName" ],
          "separator": " "
        }
      },
      {
        "type": "attribute",
        "include": {
          "matchType": "strict",
          "attributes": [
            { "key": "tempName" }
          ]
        },
        "actions": [
          { "key": "tempName", "action": "delete" }
        ]
      }
    ]
  }
}
```

### Set the operation name to the full path

Also, in the 2.x SDK, in some cases, the operation names contained the full path, e.g.

:::image type="content" source="media/java-ipa/upgrade-from-2x/operation-names-with-full-path.png" alt-text="Operation names with full path":::

The snippet below configures 4 telemetry processors that combine to replicate the previous behavior.
The telemetry processors perform the following actions (in order):

1. The first telemetry processor is a span processor (has type `span`),
   which means it applies to `requests` and `dependencies`.

   It will match any span that has an attribute named `http.url`.

   Then it will update the span name with the `http.url` attribute value.

   This would be the end of it, except that `http.url` looks something like `http://host:port/path`,
   and it's likely that you only want the `/path` part.

2. The second telemetry processor is also a span processor.

   It will match any span that has an attribute named `http.url`
   (in other words, any span that the first processor matched).

   Then it will extract the path portion of the span name into an attribute named `tempName`.

3. The third telemetry processor is also a span processor.

   It will match any span that has an attribute named `tempPath`.

   Then it will update the span name from the attribute `tempPath`.

4. The last telemetry processor is an attribute processor (has type `attribute`),
   which means it applies to all telemetry which has attributes
   (currently `requests`, `dependencies` and `traces`).

   It will match any telemetry that has an attribute named `tempPath`.

   Then it will delete the attribute named `tempPath`, so that it won't be reported as a custom dimension.

```
{
  "preview": {
    "processors": [
      {
        "type": "span",
        "include": {
          "matchType": "strict",
          "attributes": [
            { "key": "http.url" }
          ]
        },
        "name": {
          "fromAttributes": [ "http.url" ]
        }
      },
      {
        "type": "span",
        "include": {
          "matchType": "strict",
          "attributes": [
            { "key": "http.url" }
          ]
        },
        "name": {
          "toAttributes": {
            "rules": [ "https?://[^/]+(?<tempPath>/[^?]*)" ]
          }
        }
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
          "fromAttributes": [ "tempPath" ]
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

## Dependency names

Dependency names in 3.0 have also changed, again to generally provide a better aggregated view
in the Application Insights Portal U/X.

Again, for some applications, you may still prefer the aggregated view in the U/X
that was provided by the previous dependency names, in which case you can use similar
techniques as above to replicate the previous behavior.

## Operation name on dependencies

Previously in the 2.x SDK, the operation name from the request telemetry was also set on the dependency telemetry.
Application Insights Java 3.0 no longer populates operation name on dependency telemetry.
If you want to see the operation name for the request that is the parent of the dependency telemetry,
you can write a Logs (Kusto) query to join from the dependency table to the request table, e.g.

```
let start = datetime('...');
let end = datetime('...');
dependencies
| where timestamp between (start .. end)
| project timestamp, type, name, operation_Id
| join (requests
    | where timestamp between (start .. end)
    | project operation_Name, operation_Id)
    on $left.operation_Id == $right.operation_Id
| summarize count() by operation_Name, type, name
```

## 2.x SDK logging appenders

The 3.0 agent [auto-collects logging](./java-standalone-config.md#auto-collected-logging)
without the need for configuring any logging appenders.
If you are using 2.x SDK logging appenders, those can be removed, as they will be suppressed by the 3.0 agent anyways.

## 2.x SDK spring boot starter

There is no 3.0 spring boot starter.
The 3.0 agent setup and configuration follows the same [simple steps](./java-in-process-agent.md#quickstart)
whether you are using spring boot or not.

When upgrading from the 2.x SDK spring boot starter,
note that the cloud role name will no longer default to `spring.application.name`.
See the [3.0 configuration docs](./java-standalone-config.md#cloud-role-name)
for setting the cloud role name in 3.0 via json config or environment variable.
