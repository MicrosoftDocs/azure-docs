---
title: FIPS 140 on Azure Application Gateway
description: Learn how to enable FIPS mode for Azure Application Gateway V2 SKU.
services: application gateway
author: jaesoni
ms.service: azure-application-gateway
ms.topic: concept-article
ms.date: 12/01/2025
ms.author: greglin
---

# FIPS mode in Application Gateway

Application Gateway V2 SKUs can run in a FIPS (Federal Information Processing Standard) 140 approved mode of operation, which is commonly referred to as "FIPS mode." With FIPS mode, Application Gateway supports cryptographic modules and data encryption. The FIPS mode calls a FIPS 140-2 validated cryptographic module that ensures FIPS-compliant algorithms for encryption, hashing, and signing when enabled.

## Clouds and Regions

| Cloud | Status  | Default behavior | 
| ---------- | ---------- | ---------- |
| Azure Government (Fairfax) | Supported | Enabled for deployments through Portal |
| Public | Supported | Disabled |
| Microsoft Azure operated by 21Vianet | Supported | Disabled |

Since FIPS 140 is mandatory for US federal agencies, Application Gateway V2 has FIPS mode enabled by default in Azure Government (Fairfax) cloud. Customers can disable FIPS mode if they have legacy clients using older cipher suites, though it isn't recommended. As part of the FedRAMP compliance, the US Government mandates that systems operate in a [FIPS-approved mode](/azure/compliance/offerings/offering-fips-140-2) after August 2024.

For rest of the clouds, customers must opt in to enable the FIPS mode.

## FIPS mode operation

Application Gateway utilizes a rolling upgrade process to implement configurations with the FIPS validated cryptographic module across all instances. The duration for enabling or disabling FIPS mode may range from 15 to 60 minutes, depending on the number of configured or currently running instances.

> [!IMPORTANT]
> The FIPS mode configuration change can take anywhere between 15 to 60 minutes depending on the number of instances for your gateway.

Once enabled, the gateway exclusively supports TLS policies and cipher suites that comply with FIPS standards. Consequently, the portal displays only the restricted selection of TLS policies (both Predefined and Custom).

## Supported TLS policies

Application Gateway offers two mechanisms for controlling TLS policy. You can use either a Predefined policy or a Custom policy. For complete details, visit [TLS policy overview](application-gateway-ssl-policy-overview.md). A FIPS-enabled Application Gateway resource only supports the following policies.

### Predefined
* AppGwSslPolicy20220101
* AppGwSslPolicy20220101S

### Custom V2
**Versions**
* TLS 1.3
* TLS 1.2 

**Cipher suites**

* TLS_AES_128_GCM_SHA256
* TLS_AES_256_GCM_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 

Due to the restricted compatibility of TLS policies, enabling FIPS automatically selects AppGwSslPolicy20220101 for both "SSL Policy" and "SSL Profile." It can be modified to use other FIPS-compliant TLS policies later. To support legacy clients with other noncompliant cipher suites, it's possible to disable the FIPS mode, although it isn't recommended for resources within the scope of FedRAMP infrastructure.

## Enabling FIPS mode in V2 SKU

**Azure portal**

To control the FIPS mode setting through Azure portal,

1. Navigate to your application gateway resource.
2. Open the Configuration blade in the left menu pane.
3. Switch the FIPS mode toggle as "Enabled".

## Next steps

Know about the supported [TLS policies on Application Gateway](application-gateway-ssl-policy-overview.md).
