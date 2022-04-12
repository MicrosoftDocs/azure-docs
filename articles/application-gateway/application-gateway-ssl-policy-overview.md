---
title: TLS policy overview for Azure Application Gateway
description: Learn how to configure TLS policy for Azure Application Gateway and reduce encryption and decryption overhead from a back-end server farm.
services: application gateway
author: amsriva
ms.service: application-gateway
ms.topic: conceptual
ms.date: 12/17/2020
ms.author: amsriva
---

# Application Gateway TLS policy overview

You can use Azure Application Gateway to centralize TLS/SSL certificate management and reduce encryption and decryption overhead from a back-end server farm. This centralized TLS handling also lets you specify a central TLS policy that's suited to your organizational security requirements. This helps you meet compliance requirements as well as security guidelines and recommended practices.

The TLS policy includes control of the TLS protocol version as well as the cipher suites and the order in which ciphers are used during a TLS handshake. Application Gateway offers two mechanisms for controlling TLS policy. You can use either  a predefined policy or a custom policy.

## Usage and version details

* SSL 2.0 and 3.0 are disabled by default for all application gateways. These protocol versions are not configurable.
* A custom TLS policy gives you the option to select any TLS protocol as the minimum protocol version for your gateway: TLSv1_0, TLSv1_1, TLSv1_2 or TLSv1_3.
* If no TLS policy is defined, the minimum protocol version is set to TLSv1_0 and protocol versions v1.0, v1.1 and v1.2 are supported.
* Using a new Predefined or Customv2 policy enhances SSL security and performance posture of the entire gateway (for SSL Policy as well as SSL Profile). Hence, both old and new policies cannot co-exist. You are required to use any of the older predefined or custom policies across the gateway, in case there are clients requiring older TLS version or ciphers (for example, TLS v1.0).
* The new predefined and custom policies support TLS v1.3 and are available only for Application Gateway V2 SKUs (Standard_v2 or WAF_v2).
* TLS cipher suites used for the connection are also based on the type of the certificate being used. In client to application gateway connections, the cipher suites used are based on the type of server certificates on the application gateway listener. In application gateway to backend pool connections, the cipher suites used are based on the type of server certificates on the backend pool servers.

## Predefined TLS policy

Application Gateway offers several predefined security policies. You can configure your gateway with any of these policies to get the appropriate level of security. The policy names are annotated by the year and month in which they were configured (AppGwSslPolicy&lt;YYYYMMDD&gt;). Each policy offers different TLS protocol versions and/or cipher suites. These predefined policies are configured keeping in mind the best practices and recommendations from the Microsoft Security team. We recommend that you use the newest TLS policies to ensure the best TLS security.

The following table shows the list of cipher suites and minimum protocol version support for each predefined policy. The ordering of the cipher suites determines the priority order during TLS negotiation. To know the exact ordering of the cipher suites for these predefined policies, you can refer to the PowerShell, CLI, REST API or the Listeners blade in portal.

| Predefined policy names (AppGwSslPolicy&lt;YYYYMMDD&gt;) | 20150501  | 20170401 | 2017041S | 20220101 | 20220101S |
| ---------- | ---------- | ---------- | ---------- | ---------- | ---------- |
| **Minimum Protocol Version** | 1.0 | 1.1 | 1.2 | 1.2 | 1.2 |
| TLS_AES_128_GCM_SHA256 | &cross; | &cross; | &cross; | &check; | &check; |
| TLS_AES_256_GCM_SHA384 | &cross; | &cross; | &cross; | &check; | &check; |
| TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | &check; | &check; | &check; | &check; | &check; |
| TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 | &check; | &check; | &check; | &check; | &check; |
| TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | &check; | &cross; | &cross; | &check; | &cross; |
| TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 | &check; | &cross; | &cross; | &check; | &cross; |
| TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA | &check; | &check; | &check; | &cross; | &cross; |
| TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA | &check; | &check; | &check; | &cross; | &cross; |
| TLS_DHE_RSA_WITH_AES_256_GCM_SHA384 | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_DHE_RSA_WITH_AES_128_GCM_SHA256 | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_DHE_RSA_WITH_AES_256_CBC_SHA | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_DHE_RSA_WITH_AES_128_CBC_SHA | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_RSA_WITH_AES_256_GCM_SHA384 | &check; | &check; | &check; | &cross; | &cross; |
| TLS_RSA_WITH_AES_128_GCM_SHA256 | &check; | &check; | &check; | &cross; | &cross; |
| TLS_RSA_WITH_AES_256_CBC_SHA256 | &check; | &check; | &check; | &cross; | &cross; |
| TLS_RSA_WITH_AES_128_CBC_SHA256 | &check; | &check; | &check; | &cross; | &cross; |
| TLS_RSA_WITH_AES_256_CBC_SHA | &check; | &check; | &check; | &cross; | &cross; |
| TLS_RSA_WITH_AES_128_CBC_SHA | &check; | &check; | &check; | &cross; | &cross; |
| TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 | &check; | &check; | &check; | &check; | &check; |
| TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 | &check; | &check; | &check; | &check; | &check; |
| TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384 | &check; | &check; | &check; | &check; | &cross; |
| TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256 | &check; | &check; | &check; | &check; | &cross; |
| TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA | &check; | &check; | &check; | &cross; | &cross; |
| TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA | &check; | &check; | &check; | &cross; | &cross; |
| TLS_DHE_DSS_WITH_AES_256_CBC_SHA256 | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_DHE_DSS_WITH_AES_128_CBC_SHA256 | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_DHE_DSS_WITH_AES_256_CBC_SHA | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_DHE_DSS_WITH_AES_128_CBC_SHA | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_RSA_WITH_3DES_EDE_CBC_SHA | &check; | &cross; | &cross; | &cross; | &cross; |
| TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA | &check; | &cross; | &cross; | &cross; | &cross; |

## Custom TLS policy

If a TLS policy needs to be configured for your requirements, you can use a Custom TLS policy. With a custom TLS policy, you have complete control over the minimum TLS protocol version to support, as well as the supported cipher suites and their priority order.
  
> [!NOTE]
> The newer, stronger ciphers and TLSv1.3 support are only available with the **CustomV2 policy**. We recommend using this as it provides enhanced security and performance benefits.

> [!IMPORTANT]
> - If you are using a custom SSL policy in Application Gateway v1 SKU (Standard or WAF), make sure that you add the mandatory cipher "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256" to the list. This cipher is required to enable metrics and logging in the Application Gateway v1 SKU.
> This is not mandatory for Application Gateway v2 SKU (Standard_v2 or WAF_v2).
> - The cipher suites “TLS_AES_128_GCM_SHA256” and “TLS_AES_256_GCM_SHA384” with TLSv1.3 are not customizable. Hence, these are included by default when choosing a CustomV2 policy with minimum protocol version 1.2 or 1.3.
 

### Cipher suites

Application Gateway supports the following cipher suites from which you can choose your custom policy. The ordering of the cipher suites determines the priority order during TLS negotiation.

- TLS_AES_128_GCM_SHA256 (available only with Customv2) 
- TLS_AES_256_GCM_SHA384 (available only with Customv2)
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
- TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_DHE_RSA_WITH_AES_256_CBC_SHA
- TLS_DHE_RSA_WITH_AES_128_CBC_SHA
- TLS_RSA_WITH_AES_256_GCM_SHA384
- TLS_RSA_WITH_AES_128_GCM_SHA256
- TLS_RSA_WITH_AES_256_CBC_SHA256
- TLS_RSA_WITH_AES_128_CBC_SHA256
- TLS_RSA_WITH_AES_256_CBC_SHA
- TLS_RSA_WITH_AES_128_CBC_SHA
- TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
- TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
- TLS_DHE_DSS_WITH_AES_256_CBC_SHA256
- TLS_DHE_DSS_WITH_AES_128_CBC_SHA256
- TLS_DHE_DSS_WITH_AES_256_CBC_SHA
- TLS_DHE_DSS_WITH_AES_128_CBC_SHA
- TLS_RSA_WITH_3DES_EDE_CBC_SHA
- TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA

## Known issue
Application Gateway v2 does not support the following DHE ciphers and these won't be used for the TLS connections with clients even though they are mentioned in the predefined policies. Instead of DHE ciphers, secure and faster ECDHE ciphers are recommended.

- TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_DHE_RSA_WITH_AES_128_CBC_SHA
- TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_DHE_RSA_WITH_AES_256_CBC_SHA
- TLS_DHE_DSS_WITH_AES_128_CBC_SHA256
- TLS_DHE_DSS_WITH_AES_128_CBC_SHA
- TLS_DHE_DSS_WITH_AES_256_CBC_SHA256
- TLS_DHE_DSS_WITH_AES_256_CBC_SHA

## Next steps

If you want to learn to configure a TLS policy, see [Configure TLS policy versions and cipher suites on Application Gateway](application-gateway-configure-ssl-policy-powershell.md).
