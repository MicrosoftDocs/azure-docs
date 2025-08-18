---
title: TLS configuration settings
description: Learn about the TLS protocol configuration and how to use TLS to securely communicate with Azure Cache for Redis instances.



ms.topic: overview
ms.custom:
  - ignite-2024
ms.date: 05/05/2025
appliesto:
  - ✅ Azure Cache for Redis
# Customer intent: As a developer creating a service that uses a cache, I want to know the details about TLS connections so that I know my service is secure.
---

# Azure Cache for Redis TLS protocol configuration settings

Transport Layer Security (TLS) is a cryptographic protocol that provides secure communication over a network. Azure Cache for Redis supports TLS on all tiers, and requires TLS encrypted communications by default. Using TLS is recommended as a best practice across virtually all Azure Redis use cases.

The option to connect Azure Redis without TLS is included for backwards compatibility purposes. If your client library or tool doesn't support TLS, you can enable unencrypted connections through the [Azure portal](cache-configure.md#access-ports) or [management APIs](/rest/api/redis/redis/update). This article describes how to enable non-TLS access by using the Azure portal.

> [!IMPORTANT]
> TLS 1.0 and 1.1 are no longer supported. For more information, see [Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis](cache-remove-tls-10-11.md),

## Scope of availability

| **Tier**         | Basic, Standard, Premium                       | Enterprise, Enterprise Flash |
|:-----------------|:----------------------------------------------:|:----------------------------:|
| **Availability** | Yes (1.2, and 1.3) | Yes (1.2 and 1.3)            |

TLS 1.2 and TLS 1.3 are available in all Azure Redis tiers.

## TLS 1.3 support

TLS 1.3 is supported across all Azure Redis tiers. There's no option to enforce TLS 1.3 use by clients. You must negotiate TLS 1.3 when connecting to the cache instance.

The TLS 1.3 cipher suites are as follows:

- `TLS_AES_128_GCM_SHA256`
- `TLS_AES_256_GCM_SHA384`

> [!NOTE]
> The `TLS_CHACHA20_POLY1305_SHA256` cipher suite is no longer supported for TLS 1.3 connections. Use the `TLS_AES_128_GCM_SHA256` or `TLS_AES_256_GCM_SHA384` cipher suites instead.

## How to enable or disable TLS

Enabling and disabling TLS is different for different Azure Redis tiers.

### Basic, Standard, and Premium tiers

By default, TLS access is enabled and non-TLS access is disabled in new caches. Nonclustered caches use port `6380` for TLS access or port `6379` for non-TLS access.

To enable the non-TLS port:

1. On your cache page in the Azure portal, select **Advanced settings** under **Settings** in the left navigation menu.
1. On the **Advanced settings** page, select **No** under **Allow access only via SSL**.
1. Select **Save**.

For more information, see [Access ports](cache-configure.md#access-ports).

In clustered caches, TLS-enabled caches use ports in the `150XX` range, while non-TLS caches use ports in the `130XX` range. For more information, see [Can I directly connect to the individual shards of my cache?](cache-how-to-scale.md#can-i-directly-connect-to-the-individual-shards-of-my-cache)

### Enterprise and Enterprise Flash tiers

By default, only TLS access is enabled in Enterprise and Enterprise Flash tiers. To disable TLS access:

1. On your cache page in the Azure portal, select **Advanced settings** under **Settings** in the left navigation menu.
2. Select **Enable** for **Non-TLS access only**.
3. Select **Save**.

Enterprise and Enterprise Flash tier caches use port `10000` for both TLS and non-TLS connections. If you use the OSS cluster policy, more connections are established using ports in the `85XX` range, regardless of TLS status. For more information, see [Can I directly connect to the individual shards of my cache?](cache-how-to-scale.md#can-i-directly-connect-to-the-individual-shards-of-my-cache)

## Related content

- [Remove TLS 1.0 and 1.1 from use with Azure Cache for Redis](cache-remove-tls-10-11.md)
