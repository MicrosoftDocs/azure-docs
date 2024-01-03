---
title: Azure App Configuration REST API - Throttling
description: Reference pages for understanding throttling when using the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---

# Throttling

Configuration stores have limits on the requests that they can serve. Any requests that exceed an allotted quota for a configuration store will receive an HTTP 429 (Too Many Requests) response.

Throttling is divided into different quota policies:

- **Total Requests** - total number of requests
- **Total Bandwidth** - outbound data in bytes
- **Storage** - total storage size of user data in bytes

## Handling throttled responses

When the rate limit for a given quota has been reached, the server will respond to further requests of that type with a _429_ status code. The _429_ response will contain a _retry-after-ms_ header providing the client with a suggested wait time (in milliseconds) to allow the request quota to replenish.

```http
HTTP/1.1 429 (Too Many Requests)
retry-after-ms: 10
Content-Type: application/problem+json; charset=utf-8
```

```json
{
  "type": "https://azconfig.io/errors/too-many-requests",
  "title": "Resource utilization has surpassed the assigned quota",
  "policy": "Total Requests",
  "status": 429
}
```

In the above example, the client has exceeded its allowed quota and is advised to slow down and wait 10 milliseconds before attempting any further requests. Clients should consider progressive backoff as well.

## Other retry

The service might identify situations other than throttling that need a client retry (ex: 503 Service Unavailable). In all such cases, the `retry-after-ms` response header will be provided. To increase robustness, the client is advised to follow the suggested interval and perform a retry.

```http
HTTP/1.1 503 Service Unavailable
retry-after-ms: 787
```

## Monitoring

To view the **Total Requests** quota usage, App Configuration provides a metric named **Request Quota Usage**. The request quota usage metric shows the current quota usage as a percentage.

For more information on the request quota usage metric and other App Configuration metrics see [Monitoring App Configuration data reference](./monitor-app-configuration-reference.md).