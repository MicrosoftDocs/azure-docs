---
title: TLS policy overview for Azure Application Gateway
description: Learn how to configure TLS policy for Azure Application Gateway and reduce encryption and decryption overhead from a backend server farm.
services: application gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: conceptual
ms.date: 06/06/2023
ms.author: greglin
---

# Application Gateway TLS policy overview

You can use Azure Application Gateway to centralize TLS/SSL certificate management and reduce encryption and decryption overhead from a backend server farm. This centralized TLS handling also lets you specify a central TLS policy that's suited to your organizational security requirements. This helps you meet compliance requirements as well as security guidelines and recommended practices.

The TLS policy includes control of the TLS protocol version as well as the cipher suites and the order in which ciphers are used during a TLS handshake. Application Gateway offers two mechanisms for controlling TLS policy. You can use either  a predefined policy or a custom policy.

## Usage and version details

- SSL 2.0 and 3.0 are disabled for all application gateways and are not configurable.
- A custom TLS policy allows you to select any TLS protocol as the minimum protocol version for your gateway: TLSv1_0, TLSv1_1, TLSv1_2, or TLSv1_3.
- If no TLS policy is chosen, a [default TLS policy](application-gateway-ssl-policy-overview.md#default-tls-policy) gets applied based on the API version used to create that resource.
- The [**2022 Predefined**](#predefined-tls-policy) and [**Customv2 policies**](#custom-tls-policy) that support **TLS v1.3** are available only with Application Gateway V2 SKUs (Standard_v2 or WAF_v2).
- Using a 2022 Predefined or Customv2 policy enhances SSL security and performance posture of the entire gateway (for SSL Policy and [SSL Profile](application-gateway-configure-listener-specific-ssl-policy.md#set-up-a-listener-specific-ssl-policy)). Hence, both old and new policies cannot co-exist on a gateway. You must use any of the older predefined or custom policies across the gateway if clients require older TLS versions or ciphers (for example, TLS v1.0).
- TLS cipher suites used for the connection are also based on the type of the certificate being used. The cipher suites used in "client to application gateway connections" are based on the type of listener certificates on the application gateway. Whereas the cipher suites used in establishing "application gateway to backend pool connections" are based on the type of server certificates presented by the backend servers.

## Predefined TLS policy

Application Gateway offers several predefined security policies. You can configure your gateway with any of these policies to get the appropriate level of security. The policy names are annotated by the year and month in which they were configured (AppGwSslPolicy&lt;YYYYMMDD&gt;). Each policy offers different TLS protocol versions and/or cipher suites. These predefined policies are configured keeping in mind the best practices and recommendations from the Microsoft Security team. We recommend that you use the newest TLS policies to ensure the best TLS security.

The following table shows the list of cipher suites and minimum protocol version support for each predefined policy. The ordering of the cipher suites determines the priority order during TLS negotiation. To know the exact ordering of the cipher suites for these predefined policies, you can refer to the PowerShell, CLI, REST API or the Listeners blade in portal.

| Predefined policy names (AppGwSslPolicy&lt;YYYYMMDD&gt;) | 20150501  | 20170401 | 20170401S | 20220101 | 20220101S |
| ---------- | ---------- | ---------- | ---------- | ---------- | ---------- |
| **Minimum Protocol Version** | 1.0 | 1.1 | 1.2 | 1.2 | 1.2 |
| **Enabled protocol versions** | 1.0<br/>1.1<br/>1.2 | 1.1<br/>1.2 | 1.2 | 1.2<br/>1.3 | 1.2<br/>1.3 |
| **Default** | True<br/>(for API version < 2023-02-01) | False | False | True<br/>(for API version >= 2023-02-01) | False |
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

### Default TLS policy

When no specific SSL Policy is specified in the application gateway resource configuration, a default TLS policy gets applied. The selection of this default policy is based on the API version used to create that gateway.

- **For API versions 2023-02-01 or higher**, the minimum protocol version is set to 1.2 (version up to 1.3 is supported). The gateways created with these API versions will see a read-only property **defaultPredefinedSslPolicy:[AppGwSslPolicy20220101](application-gateway-ssl-policy-overview.md#predefined-tls-policy)** in the resource configuration. This property defines the default TLS policy to use.
- **For older API versions < 2023-02-01**, the minimum protocol version is set to 1.0 (versions up to 1.2 are supported) as they use the predefined policy [AppGwSslPolicy20150501](application-gateway-ssl-policy-overview.md#predefined-tls-policy) as default.

If the default TLS doesn’t fit your requirement, choose a different Predefined policy or use a Custom one.

> [!NOTE]
> Azure PowerShell and CLI support for the updated default TLS policy is coming soon.


## Custom TLS policy

If a TLS policy needs to be configured for your requirements, you can use a Custom TLS policy. With a custom TLS policy, you have complete control over the minimum TLS protocol version to support, as well as the supported cipher suites and their priority order.
  
> [!NOTE]
> The newer, stronger ciphers and TLSv1.3 support are only available with the **CustomV2 policy**. It provides enhanced security and performance benefits.

> [!IMPORTANT]
> - If you're using a custom SSL policy in Application Gateway v1 SKU (Standard or WAF), make sure that you add the mandatory cipher "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256" to the list. This cipher is required to enable metrics and logging in the Application Gateway v1 SKU.
> This is not mandatory for Application Gateway v2 SKU (Standard_v2 or WAF_v2).
> - The cipher suites “TLS_AES_128_GCM_SHA256” and “TLS_AES_256_GCM_SHA384” are mandatory for TLSv1.3. You need NOT mention these explicitly when setting a CustomV2 policy with minimum protocol version 1.2 or 1.3 through [PowerShell](application-gateway-configure-ssl-policy-powershell.md) or CLI. Accordingly, these ciphers suites won't appear in the Get Details output, with an exception of Portal.
 

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

## Limitations

- The connections to backend servers are always with minimum protocol TLS v1.0 and up to TLS v1.2. Therefore, only TLS versions 1.0, 1.1 and 1.2 are supported to establish a secured connection with backend servers. 
- As of now, the TLS 1.3 implementation is not enabled with &#34;Zero Round Trip Time (0-RTT)&#34; feature.
- Application Gateway v2 doesn't support the following DHE ciphers. These won't be used for the TLS connections with clients even though they are mentioned in the predefined policies. Instead of DHE ciphers, secure and faster ECDHE ciphers are recommended.
  - TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
  - TLS_DHE_RSA_WITH_AES_128_CBC_SHA
  - TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
  - TLS_DHE_RSA_WITH_AES_256_CBC_SHA
  - TLS_DHE_DSS_WITH_AES_128_CBC_SHA256
  - TLS_DHE_DSS_WITH_AES_128_CBC_SHA
  - TLS_DHE_DSS_WITH_AES_256_CBC_SHA256
  - TLS_DHE_DSS_WITH_AES_256_CBC_SHA
- Constrained clients looking for "Maximum Fragment Length Negotiation" support must use the newer [**2022 Predefined**](#predefined-tls-policy) or [**Customv2 policies**](#custom-tls-policy).

## Next steps

If you want to learn to configure a TLS policy, see [Configure TLS policy versions and cipher suites on Application Gateway](application-gateway-configure-ssl-policy-powershell.md).
