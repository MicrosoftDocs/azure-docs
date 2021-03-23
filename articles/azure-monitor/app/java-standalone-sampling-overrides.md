---
title: Sampling overrides (preview) - Azure Monitor Application Insights for Java
description: Learn to configure sampling overrides in Azure Monitor Application Insights for Java.
ms.topic: conceptual
ms.date: 03/22/2021
author: trask
ms.custom: devx-track-java
ms.author: trstalna
---

# Sampling overrides (preview) - Azure Monitor Application Insights for Java

> [!NOTE]
> The sampling overrides feature is in preview.

Here are some use cases for sampling overrides:
 * Suppress collecting telemetry for health checks.
 * Suppress collecting telemetry for noisy dependency calls.
 * Reduce the noise from health checks or noisy dependency calls without suppressing them completely.
 * Collect 100% of telemetry for an important request (e.g. `/login`) even though you have default sampling
   configured to something lower.

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
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "sampling": {
    "percentage": 10
  },
  "preview": {
    "sampling": {
      "overrides": [
        {
          "attributes": [
            ...
          ],
          "percentage": 0
        },
        {
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

When a span is started, the attributes present on the span at that time are used to check if any of the sampling
overrides match.

If one of the sampling overrides match, then its sampling percentage is used to decide whether to sample the span or
not.

Only the first sampling override that matches is used.

If no sampling overrides match:

* If this is the first span in the trace, then the [normal sampling percentage](./java-standalone-config.md#sampling)
  is used.
* If this is not the first span in the trace, then the parent sampling decision is used.

> [!IMPORTANT]
> When a decision has been made to not collect a span, then all downstream spans will also not be collected,
> even if there are sampling overrides that match the downstream span.
> This behavior is necessary because otherwise broken traces would result, with downstream spans being collected
> but being parented to spans that were not collected.

> [!NOTE]
> The sampling decision is based on hashing the traceId (also known as the operationId) to a number between 0 and 100,
> and that hash is then compared to the sampling percentage.
> Since all spans in a given trace will have the same traceId, they will have the same hash,
> and so the sampling decision will be consistent across the whole trace.

## Example: Suppress collecting telemetry for health checks

This will suppress collecting telemetry for all requests to `/health-checks`.

This will also suppress collecting any downstream spans (dependencies) that would normally be collected under
`/health-checks`.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "sampling": {
      "overrides": [
        {
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

This will suppress collecting telemetry for all `GET my-noisy-key` redis calls.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "sampling": {
      "overrides": [
        {
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

This will collect 100% of telemetry for `/login`.

Since downstream spans (dependencies) respect the parent's sampling decision
(absent any sampling override for that downstream span),
those will also be collected for all '/login' requests.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "sampling": {
    "percentage": 10
  },
  "preview": {
    "sampling": {
      "overrides": [
        {
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

## Common span attributes

This section lists some common span attributes that sampling overrides can use.

### HTTP spans

| Attribute  | Type | Description | 
|---|---|---|
| `http.method` | string | HTTP request method.|
| `http.url` | string | Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. The fragment isn't usually transmitted over HTTP. But if the fragment is known, it should be included.|
| `http.status_code` | number | [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).|
| `http.flavor` | string | Type of HTTP protocol. |
| `http.user_agent` | string | Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client. |

### JDBC spans

| Attribute  | Type | Description  |
|---|---|---|
| `db.system` | string | Identifier for the database management system (DBMS) product being used. |
| `db.connection_string` | string | Connection string used to connect to the database. It's recommended to remove embedded credentials.|
| `db.user` | string | Username for accessing the database. |
| `db.name` | string | String used to report the name of the database being accessed. For commands that switch the database, this string should be set to the target database, even if the command fails.|
| `db.statement` | string | Database statement that's being run.|
