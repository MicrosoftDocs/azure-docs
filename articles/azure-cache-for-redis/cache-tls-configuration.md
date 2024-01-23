---
title: What is TLS within Azure Cache for Redis
description: Learn about the TLS protocol and how to use it with your application to communicate to your Azure Cache for Redis instances.
author: flang-msft

ms.service: cache
ms.topic: overview
ms.date: 01/05/2024
ms.author: franlanglois


---

# What is the TLS protocol with Azure Cache for Redis

Transport Layer Security (TLS) is a cryptographic protocol that provides secure communication over a network. Azure Cache for Redis supports TLS on all tiers, and usage is encouraged.
For more infomation on 

> [!IMPORTANT]
> Starting October 1, 2024, TLS 1.0 and 1.1 will no longer be supported. You should use TLS 1.2 or 1.3 instead.
>

## Scope of availability

This table contains the informtion for TLS availability in different tiers.

| **Tier**         | Basic, Standard, Premium | Enterprise, Enterprise Flash |
|:-----------------|:------------------------:|:----------------------------:|
| **Availability** | Yes (1.0(retired), 1.1(retired), 1.2, and 1.3(coming soon))           | Yes (1.2 and 1.3(coming soon))                        |

## TLS 1.3 Support

On February 1, 2024, TLS 1.3 will be supported across all tiers of Azure Cache for Redis. No option is yet available to enforce that TLS 1.3 be used by clients. You are required to negotiate TLS 1.3 when connecting to the cache instance.

### TLS cipher suites

TLS 1.2 cipher suites:

- `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384`
- `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256`

TLS 1.3 cipher suites:

- `TLS_AES_128_GCM_SHA256`
- `TLS_AES_256_GCM_SHA384`

> [!NOTE]
> The `TLS_CHACHA20_POLY1305_SHA256` cipher suite will no longer be supported for TLS 1.3 connections on February 1, 2024. The `TLS_AES_128_GCM_SHA256` or `TLS_AES_256_GCM_SHA384` cipher suites can be used instead.
>

## How to enable or disable TLS

Enabling and disabling TLS is different within different tiers. Here is the information for the two sets of Azure Cache for Redis tiers.

### Basic, Standard, and Premium tiers

By default, TLS access is enabled in new caches, while non-TLS access is disabled. To [enable the non-TLS port](cache-configure.md#access-ports):

1. Navigate to the **Advanced settings** on the Resource menu.
1. Then, select **No** for **Allow access only via SSL** .
1. select **Save**.

In non-clustered caches, port `6380` is used for TLS access, while port `6379` is used for non-TLS access.

In [clustered caches](cache-how-to-scale.md#can-i-directly-connect-to-the-individual-shards-of-my-cache), TLS-enabled caches use ports in the `150XX` range, while non-TLS caches use ports in the `130XX` range.

### Enterprise and Enterprise Flash tiers

By default, only TLS access can be used. To disable TLS access:

1. Navigate to the **Advanced settings** on the Resource menu.
2. Select **Enable** for **Non-TLS access only**.
3. Select **Save**.

Enterprise and Enterprise Flash tier caches use port `10000` for both TLS and non-TLS connections. If the OSS cluster policy is used, [additional connections are established](cache-how-to-scale.md#can-i-directly-connect-to-the-individual-shards-of-my-cache) using ports in the `85XX` range, regardless of TLS status.

## Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis

For more information, see [TLS 1.0/1.1 retirement](cache-remove-tls-10-11.md).

## Related content

- [TLS 1.0/1.1 retirement](cache-remove-tls-10-11.md)
