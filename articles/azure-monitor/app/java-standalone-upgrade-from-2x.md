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

## TelemetryInitializers and TelemetryProcessors

Java SDK 2.x TelemetryInitializers and TelemetryProcessors will not be run when using the 3.0 agent.
Many of the use cases that previously required these can be solved in 3.0
by configuring [custom dimensions](./java-standalone-config.md#custom-dimensions)
or configuring [telemetry processors](./java-standalone-telemetry-processors.md).

## Multiple applications in a single JVM

Currently, 3.0 only supports a single
[connection string and role name](./java-standalone-config.md#connection-string-and-role-name)
per running process. In particular, you can't have multiple tomcat web apps in the same tomcat deployment
using different connection strings or different role names yet.

## HTTP request telemetry names

HTTP request telemetry names in 3.0 have changed to generally provide a better aggregated view
in the Application Insights Portal U/X.

However, for some applications, you may still prefer the aggregated view in the U/X
that was provided by the previous telemetry names, in which case
you can use the telemetry processors preview feature in 3.0 to return to the previous names.

### To prefix the telemetry name with the http method (`GET`, `POST`, etc.):

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

### To set the telemetry name to the full URL path

```
{
  "preview": {
    "processors": [
      {
        "type": "span",
        "include": {
          "matchType": "strict",
          "attributes": [
            { "key": "http.method" },
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
            { "key": "http.method" },
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
