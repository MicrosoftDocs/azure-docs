---
title: What are the configuration settings for TLS?
description: Learn about the TLS protocol configuration and how to use TLS to securely communicate with Azure Cache for Redis instances.
author: flang-msft

ms.service: cache
ms.topic: overview
ms.date: 01/23/2024
ms.author: franlanglois

# Customer intent: As a developer creating a service that uses a cache, I want to know the details about TLS connections so that I know my service is secure.
---

# What are the configuration settings for the TLS protocol?

Transport Layer Security (TLS) is a cryptographic protocol that provides secure communication over a network. Azure Cache for Redis supports TLS on all tiers. When create a service that uses an Azure Cache for Redis instance, we strongly encourage you to connect using TLS.

> [!IMPORTANT]
> Starting November 01, 2024, TLS 1.0 and 1.1 will no longer be supported. You should use TLS 1.2 or 1.3 instead.
>

## Scope of availability

This table contains the information for TLS availability in different tiers.

| **Tier**         | Basic, Standard, Premium                       | Enterprise, Enterprise Flash |
|:-----------------|:----------------------------------------------:|:----------------------------:|
| **Availability** | Yes (1.0(retired), 1.1(retired), 1.2, and 1.3) | Yes (1.2 and 1.3)            |

## TLS 1.3 support

TLS 1.3 is supported across all tiers of Azure Cache for Redis. Presently, there's no option to enforce that TLS 1.3 is used by clients. You're required to negotiate TLS 1.3 when connecting to the cache instance.

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

Enabling and disabling TLS is different within different tiers. Here's the information for the two sets of Azure Cache for Redis tiers.

### Basic, Standard, and Premium tiers

By default, TLS access is enabled in new caches, while non-TLS access is disabled. To [enable the non-TLS port](cache-configure.md#access-ports):

1. Navigate to the **Advanced settings** on the Resource menu.
1. Then, select **No** for **Allow access only via SSL** .
1. select **Save**.

In nonclustered caches, port `6380` is used for TLS access, while port `6379` is used for non-TLS access.

In [clustered caches](cache-how-to-scale.md#can-i-directly-connect-to-the-individual-shards-of-my-cache), TLS-enabled caches use ports in the `150XX` range, while non-TLS caches use ports in the `130XX` range.

### Enterprise and Enterprise Flash tiers

By default, only TLS access can be used. To disable TLS access:

1. Navigate to the **Advanced settings** on the Resource menu.
2. Select **Enable** for **Non-TLS access only**.
3. Select **Save**.

Enterprise and Enterprise Flash tier caches use port `10000` for both TLS and non-TLS connections. If the OSS cluster policy is used, [more connections are established](cache-how-to-scale.md#can-i-directly-connect-to-the-individual-shards-of-my-cache) using ports in the `85XX` range, regardless of TLS status.

## Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis

For more information, see [TLS 1.0/1.1 retirement](cache-remove-tls-10-11.md).

## Related content

- [TLS 1.0/1.1 retirement](cache-remove-tls-10-11.md)
