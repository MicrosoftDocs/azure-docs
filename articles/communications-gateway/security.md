---
title: Security and Azure Communications Gateway
description: Understand how Microsoft keeps your Azure Communications Gateway and user data secure
author: GemmaWakeford
ms.author: gwakeford
ms.service: azure-communications-gateway
ms.topic: conceptual
ms.date: 11/17/2023
ms.custom: template-concept
---

# Overview of security for Azure Communications Gateway

The customer data Azure Communications Gateway handles can be split into:

- Content data, such as media for voice calls.
- Customer data provisioned on Azure Communications Gateway or present in call metadata.

## Data retention, data security and encryption at rest

Azure Communications Gateway doesn't store content data, but it does store customer data.

- Customer data provisioned on Azure Communications Gateway includes configuration of numbers for specific communications services. It's needed to match numbers to these communications services and (optionally) make number-specific changes to calls, such as adding custom headers.
- Temporary customer data from call metadata is stored for a maximum of 30 days and used to provide statistics. After 30 days, data from call metadata is no longer accessible to perform diagnostics or analysis of individual calls. Anonymized statistics and logs produced based on customer data are available after the 30 days limit.

Your organization's access to Azure Communications Gateway is managed using Microsoft Entra ID. For more information on the permissions your staff need, see [Set up user roles for Azure Communications Gateway](provision-user-roles.md). For information about Microsoft Entra ID with the Provisioning API, see the [API Reference](/rest/api/voiceservices) for the Provisioning API.

Azure Communications Gateway doesn't support [Customer Lockbox for Microsoft Azure](../security/fundamentals/customer-lockbox-overview.md).  However Microsoft engineers can only access data on a just-in-time basis, and only for diagnostic purposes.

Azure Communications Gateway stores all data at rest securely, including provisioned customer and number configuration and any temporary customer data, such as call records. Azure Communications Gateway uses standard Azure infrastructure, with platform-managed encryption keys, to provide server-side encryption compliant with a range of security standards including FedRAMP. For more information, see [encryption of data at rest](../security/fundamentals/encryption-overview.md).

## Encryption in transit

All traffic handled by Azure Communications Gateway is encrypted. This encryption is used between Azure Communications Gateway components and towards Microsoft Phone System.

* SIP and HTTP traffic is encrypted using TLS.
* Media traffic is encrypted using SRTP.

When encrypting traffic to send to your network, Azure Communications Gateway prefers TLSv1.3. It falls back to TLSv1.2 if necessary.

### TLS certificates for SIP and HTTPS

Azure Communications Gateway uses mutual TLS for SIP and HTTPS, meaning that both the client and the server for the connection verify each other.

You must manage the certificates that your network presents to Azure Communications Gateway. By default, Azure Communications Gateway supports the DigiCert Global Root G2 certificate and the Baltimore CyberTrust Root certificate as root certificate authority (CA) certificates. If the certificate that your network presents to Azure Communications Gateway uses a different root CA certificate, you must provide this certificate to your onboarding team when you [connect Azure Communications Gateway to your networks](deploy.md#connect-azure-communications-gateway-to-your-networks).

We manage the certificate that Azure Communications Gateway uses to connect to your network, Microsoft Phone System and Zoom servers. Azure Communications Gateway's certificate uses the DigiCert Global Root G2 certificate as the root CA certificate. If your network doesn't already support this certificate as a root CA certificate, you must download and install this certificate when you [connect Azure Communications Gateway to your networks](deploy.md#connect-azure-communications-gateway-to-your-networks).

### Cipher suites for TLS (for SIP and HTTPS) and SRTP

The following cipher suites are used for encrypting SIP, HTTP and RTP.

#### Ciphers used with TLSv1.2 for SIP and HTTPS

* TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256

#### Ciphers used with TLSv1.3 for SIP and HTTPS

* TLS_AES_256_GCM_SHA384
* TLS_AES_128_GCM_SHA256

#### Ciphers used with SRTP

* AES_CM_128_HMAC_SHA1_80

## Next steps

- Read the [security baseline for Azure Communications Gateway](/security/benchmark/azure/baselines/azure-communications-gateway-security-baseline?toc=/azure/communications-gateway/toc.json&bc=/azure/communications-gateway/breadcrumb/toc.json)
- Learn about [user roles for Azure Communications Gateway](provision-user-roles.md)
- Learn about [planning an Azure Communications Gateway deployment](get-started.md)
