---
title: Security and Azure Communications Gateway
description: Understand how Microsoft keeps your Azure Communications Gateway and user data secure
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: conceptual
ms.date: 02/09/2023
ms.custom: template-concept
---

# Overview of security for Azure Communications Gateway

The customer data Azure Communications Gateway handles can be split into:

- Content data, such as media for voice calls.
- Customer data present in call metadata.

## Data retention, data security and encryption at rest

Azure Communications Gateway doesn't store content data, but it does store customer data and provide statistics based on it. This data is stored for a maximum of 30 days. After this period, it's no longer accessible to perform diagnostics or analysis of individual calls. Anonymized statistics and logs produced based on customer data are available after the 30 days limit.

Azure Communications Gateway doesn't support [Customer Lockbox for Microsoft Azure](../security/fundamentals/customer-lockbox-overview.md).  However Microsoft engineers can only access data on a just-in-time basis, and only for diagnostic purposes.

Azure Communications Gateway stores all data at rest securely, including any customer data that has to be temporarily stored, such as call records.  It uses standard Azure infrastructure, with platform-managed encryption keys, to provide server-side encryption compliant with a range of security standards including FedRAMP. For more information, see [encryption of data at rest](../security/fundamentals/encryption-overview.md).

## Encryption in transit

All traffic handled by Azure Communications Gateway is encrypted. This encryption is used between Azure Communications Gateway components and towards Microsoft Teams.
* SIP and HTTP traffic is encrypted using TLS.
* Media traffic is encrypted using SRTP.

When encrypting traffic to send to your network, Azure Communications Gateway prefers TLSv1.3. It falls back to TLSv1.2 if necessary.

The following cipher suites are used for encrypting SIP and RTP.

### Ciphers used with TLSv1.2

* TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256

### Ciphers used with TLSv1.3

* TLS_AES_256_GCM_SHA384
* TLS_AES_128_GCM_SHA256

### Ciphers used with SRTP

* AES_CM_128_HMAC_SHA1_80

## Next steps

- Read the [security baseline for Azure Communications Gateway](/security/benchmark/azure/baselines/azure-communications-gateway-security-baseline?toc=/azure/communications-gateway/toc.json&bc=/azure/communications-gateway/breadcrumb/toc.json)
- Learn about [how Azure Communications Gateway communicates with Microsoft Teams and your network](interoperability.md).