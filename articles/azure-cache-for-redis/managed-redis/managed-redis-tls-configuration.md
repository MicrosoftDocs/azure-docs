---
title: What are the configuration settings for TLS?
description: Learn about the TLS protocol configuration and how to use TLS to securely communicate with Azure Managed Redis instances.



ms.service: azure-managed-redis
ms.custom:
  - ignite-2024
ms.topic: conceptual
ms.date: 11/15/2024
# Customer intent: As a developer creating a service that uses a cache, I want to know the details about TLS connections so that I know my service is secure.
---

# What are configuration settings for the TLS protocol with Azure Managed Redis (preview)?

Transport Layer Security (TLS) is a cryptographic protocol that provides secure communication over a network. Azure Managed Redis (preview) supports TLS on all tiers.
When you create a service that uses an Azure Managed Redis instance, we strongly encourage you to connect using TLS.

> [!IMPORTANT]
> Azure Managed Redis only supports TLS 1.2 and 1.3.
>
> TLS 1.0 and 1.1 are not supported.
>

## Scope of availability

This table contains the information for TLS availability in different tiers.

| **Tier**         | Memory Optimized, Balanced, Compute Optimized  | Flash Optimized             |
|:-----------------|:----------------------------------------------:|:----------------------------:|
| **Availability** | Yes (1.2 and 1.3)                             | Yes (1.2 and 1.3)          |

## TLS 1.3 support

TLS 1.3 is supported across all tiers of Azure Managed Redis. Presently, there's no option to enforce that TLS 1.3 is used by clients. You're required to negotiate TLS 1.3 when connecting to the cache instance.

### TLS cipher suites

TLS 1.2 cipher suites:

- `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384`
- `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256`

TLS 1.3 cipher suites:

- `TLS_AES_128_GCM_SHA256`
- `TLS_AES_256_GCM_SHA384`

> [!NOTE]
> The `TLS_CHACHA20_POLY1305_SHA256` cipher suite is no longer supported for TLS 1.3 connections. The `TLS_AES_128_GCM_SHA256` or `TLS_AES_256_GCM_SHA384` cipher suites can be used instead.
>

## How to enable or disable TLS

By default, TLS is required for access. To disable TLS access:

1. Navigate to the **Advanced settings** on the Resource menu.
2. Select **Enable** for **Non-TLS access only**.
3. Select **Save**.

Azure Managed Redis instances use port `10000` for both TLS and non-TLS connections. If the OSS cluster policy is used, [more connections are established](managed-redis-architecture.md#cluster-policies) using ports in the `85XX` range, regardless of TLS status.

## Related content

- [Use Microsoft Entra for cache authentication with Azure Managed Redis](managed-redis-entra-for-authentication.md)
