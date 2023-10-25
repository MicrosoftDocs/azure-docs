---
title: Sampling overrides (preview) - Azure Monitor Application Insights for Java
description: Learn to configure sampling overrides in Azure Monitor Application Insights for Java.
ms.topic: conceptual
ms.date: 08/11/2023
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java
ms.reviewer: mmcc
---

# Sampling overrides (preview) - Azure Monitor Application Insights for Java

> [!NOTE]
> The sampling overrides feature is in preview, starting from 3.0.3.

Sampling overrides allow you to override the [default sampling percentage](./java-standalone-config.md#sampling),
for example:
 * Set the sampling percentage to 0 (or some small value) for noisy health checks.
 * Set the sampling percentage to 0 (or some small value) for noisy dependency calls.
 * Set the sampling percentage to 100 for an important request type (for example, `/login`)
   even though you have the default sampling configured to something lower.

## Terminology

Before you learn about sampling overrides, you should understand the term *span*. A span is a general term for:

* An incoming request.
* An outgoing dependency (for example, a remote call to another service).
* An in-process dependency (for example, work being done by subcomponents of the service).

For sampling overrides, these span components are important:

* Attributes

The span attributes represent both standard and custom properties of a given request or dependency.

## Getting started

To begin, create a configuration file named *applicationinsights.json*. Save it in the same directory as *applicationinsights-agent-\*.jar*. Use the following template.

```json
{
  "connectionString": "...",
  "sampling": {
    "percentage": 10
  },
  "preview": {
    "sampling": {
      "overrides": [
        {
          "telemetryType": "request",
          "attributes": [
            ...
          ],
          "percentage": 0
        },
        {
          "telemetryType": "request",
          "attributes": [
            ...
          ],
          "percentage": 100
        }
      ]
    }
  }
}
```

## How it works

`telemetryType` (`telemetryKind` in Application Insights 3.4.0) must be one of `request`, `dependency`, `trace` (log), or `exception`.

When a span is started, the type of span and the attributes present on it at that time are used to check if any of the sampling
overrides match.

Matches can be either `strict` or `regexp`. Regular expression matches are performed against the entire attribute value,
so if you want to match a value that contains `abc` anywhere in it, then you need to use `.*abc.*`.
A sampling override can specify multiple attribute criteria, in which case all of them must match for the sampling
override to match.

If one of the sampling overrides matches, then its sampling percentage is used to decide whether to sample the span or
not.

Only the first sampling override that matches is used.

If no sampling overrides match:

* If this is the first span in the trace, then the
  [top-level sampling configuration](./java-standalone-config.md#sampling) is used.
* If this isn't the first span in the trace, then the parent sampling decision is used.

## Example: Suppress collecting telemetry for health checks

This example suppresses collecting telemetry for all requests to `/health-checks`.

This example also suppresses collecting any downstream spans (dependencies) that would normally be collected under
`/health-checks`.

```json
{
  "connectionString": "...",
  "preview": {
    "sampling": {
      "overrides": [
        {
          "telemetryType": "request",
          "attributes": [
            {
              "key": "http.url",
              "value": "https?://[^/]+/health-check",
              "matchType": "regexp"
            }
          ],
          "percentage": 0
        }
      ]
    }
  }
}
```

## Example: Suppress collecting telemetry for a noisy dependency call

This example suppresses collecting telemetry for all `GET my-noisy-key` redis calls.

```json
{
  "connectionString": "...",
  "preview": {
    "sampling": {
      "overrides": [
        {
          "telemetryType": "dependency",
          "attributes": [
            {
              "key": "db.system",
              "value": "redis",
              "matchType": "strict"
            },
            {
              "key": "db.statement",
              "value": "GET my-noisy-key",
              "matchType": "strict"
            }
          ],
          "percentage": 0
        }
      ]
    }
  }
}
```

## Example: Collect 100% of telemetry for an important request type

This example collects 100% of telemetry for `/login`.

Since downstream spans (dependencies) respect the parent's sampling decision
(absent any sampling override for that downstream span),
those are also collected for all '/login' requests.

```json
{
  "connectionString": "...",
  "sampling": {
    "percentage": 10
  },
  "preview": {
    "sampling": {
      "overrides": [
        {
          "telemetryType": "request",
          "attributes": [
            {
              "key": "http.url",
              "value": "https?://[^/]+/login",
              "matchType": "regexp"
            }
          ],
          "percentage": 100
        }
      ]
    }
  }
}
```

## Span attributes available for sampling

Span attribute names are based on the OpenTelemetry semantic conventions. (HTTP, Messaging, Database, RPC)

https://github.com/open-telemetry/semantic-conventions/blob/main/docs/README.md

To see the exact set of attributes captured by Application Insights Java for your application, set the
[self-diagnostics level to debug](./java-standalone-config.md#self-diagnostics), and look for debug messages starting
with the text "exporting span".

>[!Note]
> Only attributes set at the start of the span are available for sampling,
so attributes such as `http.status_code` which are captured later on can't be used for sampling.

## Troubleshooting

If you use `regexp` and the sampling override doesn't work, try with the `.*` regex. If the sampling now works, it means
you have an issue with the first regex and read [this regex documentation](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html).

If it doesn't work with `.*`, you may have a syntax issue in your `application-insights.json file`. Look at the Application Insights logs and see if you notice
warning messages.

