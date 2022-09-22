---
title: Azure App Configuration REST API - consistency
description: Reference pages for ensuring real-time consistency by using the Azure App Configuration REST API
author: maud-lv
ms.author: malev
ms.service: azure-app-configuration
ms.topic: reference
ms.date: 08/17/2020
---


# Real-time consistency

Due to the nature of some distributed systems, real-time consistency between requests is difficult to enforce implicitly. A solution is to allow protocol support in the form of multiple synchronization tokens. Synchronization tokens are optional.

## Initial request

To guarantee real-time consistency between different client instances and requests, use optional `Sync-Token` request and response headers.

Syntax:

```http
Sync-Token: <id>=<value>;sn=<sn>
```

|Parameter|Description|
|--|--|
| `<id>` | Token ID (opaque) |
| `<value>` | Token value  (opaque). Allows base64 encoded string. |
| `<sn>` | Token sequence number (version). Higher means a newer version of the same token. Allows for better concurrency and client caching. The client can choose to use only the token's last version, because token versions are inclusive. This parameter isn't required for requests. |

## Response

The service provides a `Sync-Token` header with each response.

```http
Sync-Token: jtqGc1I4=MDoyOA==;sn=28
```

## Subsequent requests

Any subsequent request is guaranteed real-time consistent response in relation to the provided `Sync-Token`.

```http
Sync-Token: <id>=<value>
```

If you omit the `Sync-Token` header from the request, it's possible for the service to respond with cached data during a short period of time (up to a few seconds), before it settles internally. This behavior might cause inconsistent reads if changes occurred immediately before reading.

## Multiple sync-tokens

The server might respond with multiple synchronization tokens for a single request. To keep real-time consistency for the next request, the client must respond with all of the received synchronization tokens. Multiple header values must be comma-separated.

```http
Sync-Token: <token1-id>=<value>,<token2-id>=<value>
```
