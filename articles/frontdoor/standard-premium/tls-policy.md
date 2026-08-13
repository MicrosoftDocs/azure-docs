---
title: Azure Front Door TLS policy
description: Learn how custom TLS policies help you meet security requirements for your Azure Front Door custom domains.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 07/31/2026
---

# Azure Front Door TLS policy

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door supports [end-to-end TLS encryption](../end-to-end-tls.md). When you add a custom domain to Azure Front Door, you must use HTTPS, and you need to define a TLS policy that includes control of the TLS protocol version and the cipher suites during a TLS handshake. 

Azure Front Door supports two versions of the TLS protocol: TLS versions 1.2 and 1.3. Currently, Azure Front Door doesn't support client/mutual authentication (mTLS).

Azure Front Door Standard and Premium offer two mechanisms for controlling TLS policy. You can use either a predefined policy or a custom policy based on your own needs. If you use Azure Front Door (classic) and Microsoft CDN (classic), you continue to use the minimum TLS 1.2 version.

- Azure Front Door offers several predefined TLS policies. You can configure Azure Front Door with any of these policies to get the appropriate level of security. The Microsoft Security team configures these predefined policies based on best practices and recommendations. Use the newest TLS policies to ensure the best TLS security.
- If you need to configure a TLS policy for your own business and security requirements, use a Custom TLS policy. By using a custom TLS policy, you have complete control over the minimum TLS protocol version to support, and the supported cipher suites.

For a minimum TLS version 1.2, the negotiation process first attempts to establish TLS 1.3 and then TLS 1.2. The client must support at least one of the supported ciphers to establish an HTTPS connection with Azure Front Door. Azure Front Door chooses a cipher in the listed order from the client-supported ciphers.

When Azure Front Door initiates TLS traffic to the origin, it attempts to negotiate the best TLS version that the origin can reliably and consistently accept. Supported TLS versions for origin connections are TLS 1.2 and TLS 1.3. 

> [!NOTE]
> Clients with TLS 1.3 enabled must support one of the Microsoft SDL compliant EC Curves, including Secp384r1, Secp256r1, and Secp521, to successfully make requests with Azure Front Door using TLS 1.3. Use one of these curves as the preferred curve during requests to avoid increased TLS handshake latency, which might result from multiple round trips to negotiate the supported EC curve.

## Predefined TLS policy

Azure Front Door offers several predefined TLS policies. You can configure Azure Front Door with any of these policies to get the appropriate level of security. The policy names include the minimum TLS versions and the year in which they were configured (TLSv1.2_2023>). Each policy offers different TLS protocol versions and cipher suites. The Microsoft Security team configures these predefined policies based on best practices and recommendations. Use the newest TLS policies to ensure the best TLS security.

The following table shows the list of cipher suites and minimum protocol version support for each predefined policy. The ordering of the cipher suites determines the priority order during TLS negotiation.

By default, Azure Front Door selects TLSv1.2_2023. TLSv1.2_2022 maps to the minimum TLS 1.2 version in previous design.

| **OpenSSL** | **Cipher** **Suite** | **TLSv1.2_2023** | **TLSv1.2_2022** |
|---|---|---|---|
| **Minimum Protocol version** | | **1.2** | **1.2** |
| **Supported Protocols** | | **1.3/1.2** | **1.3./1.2** |
| **TLS_AES_256_GCM_SHA384** | TLS_AES_256_GCM_SHA384 | Yes | Yes |
| **TLS_AES_128_GCM_SHA256** | TLS_AES_128_GCM_SHA256 | Yes | Yes |
| **ECDHE-RSA-AES256-GCM-SHA384** | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | Yes | Yes |
| **ECDHE-RSA-AES128-GCM-SHA256** | TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 | Yes | Yes | 
| **ECDHE-RSA-AES256-SHA384** | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | | Yes | 
| **ECDHE-RSA-AES128-SHA256** | TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 | | Yes | 

## Custom TLS policy

If you need to configure a TLS policy for your requirements, use a custom TLS policy. By using a custom TLS policy, you have complete control over the minimum TLS protocol version to support, and the supported cipher suites and their priority order. 

> [!NOTE]
> TLS 1.3 is always enabled no matter what minimum version is enabled.

### Cipher suites

Azure Front Door supports the following cipher suites from which you can choose your custom policy. The ordering of the cipher suites determines the priority order during TLS negotiation.

- TLS_AES_256_GCM_SHA384 (TLS 1.3 only)
- TLS_AES_128_GCM_SHA256 (TLS 1.3 only)
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384

> [!NOTE]
> For Windows 10 and later versions, enable one or both of the ECDHE_GCM cipher suites for better security. Windows 8.1, 8, and 7 aren't compatible with these ECDHE_GCM cipher suites. The ECDHE_CBC cipher suites are provided for compatibility with those operating systems.

## Next step

> [!div class="nextstepaction"]
> [Configure TLS policy on Front Door](tls-policy-configure.md)
