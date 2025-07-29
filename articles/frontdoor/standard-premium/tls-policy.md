---
title: Azure Front Door TLS policy
description: Learn how custom TLS policies help you meet security requirements for your Azure Front Door custom domains.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 04/09/2025
---

# Azure Front Door TLS policy

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door supports [end-to-end TLS encryption](../end-to-end-tls.md). When you add a custom domain to Azure Front Door, HTTPS is required, and you need to define a TLS policy which includes control of the TLS protocol version and the cipher suites during a TLS handshake. 

Azure Front Door supports two versions of the TLS protocol: TLS versions 1.2 and 1.3. Currently, Azure Front Door doesn't support client/mutual authentication (mTLS).

> [!NOTE]
> As of March 1, 2025, TLS 1.0 and 1.1 minimum version are disallowed on Azure Front Door. 

Azure Front Door Standard and Premium offer two mechanisms for controlling TLS policy. You can use either a predefined policy or a custom policy per your own needs. If you use Azure Front Door (classic) and Microsoft CDN (classic), you'll continue to use the minimum TLS 1.2 version.

- Azure Front Door offers several predefined TLS policies. You can configure your AFD with any of these policies to get the appropriate level of security. These predefined policies are configured keeping in mind the best practices and recommendations from the Microsoft Security team. We recommend that you use the newest TLS policies to ensure the best TLS security.
- If a TLS policy needs to be configured for your own business and security requirements, you can use a Custom TLS policy. With a custom TLS policy, you have complete control over the minimum TLS protocol version to support, and the supported cipher suites.

For a minimum TLS version 1.2, the negotiation will attempt to establish TLS 1.3 and then TLS 1.2. The client must support at least one of the supported ciphers to establish an HTTPS connection with Azure Front Door. Azure Front Door chooses a cipher in the listed order from the client-supported ciphers.

When Azure Front Door initiates TLS traffic to the origin, it will attempt to negotiate the best TLS version that the origin can reliably and consistently accept. Supported TLS versions for origin connections are TLS 1.2, and TLS 1.3. 

> [!NOTE]
> Clients with TLS 1.3 enabled are required to support one of the Microsoft SDL compliant EC Curves, including Secp384r1, Secp256r1, and Secp521, in order to successfully make requests with Azure Front Door using TLS 1.3. It's recommended that clients use one of these curves as their preferred curve during requests to avoid increased TLS handshake latency, which may result from multiple round trips to negotiate the supported EC curve.

## Predefined TLS policy

Azure Front Door offers several predefined TLS policies. You can configure your AFD with any of these policies to get the appropriate level of security. The policy names are annotated by the minimum TLS versions and the year in which they were configured (TLSv1.2_2023>). Each policy offers different TLS protocol versions and/or cipher suites. These predefined policies are configured keeping in mind the best practices and recommendations from the Microsoft Security team. We recommend that you use the newest TLS policies to ensure the best TLS security.

The following table shows the list of cipher suites and minimum protocol version support for each predefined policy. The ordering of the cipher suites determines the priority order during TLS negotiation.

By default, TLSv1.2_2023 will be selected. TLSv1.2_2022 maps to the minimum TLS 1.2 version in previous design. Some might see a read-only TLSv1.0/1.1_2019 which maps to the minimum TLS 1.0/1.1 version in previous design, because they don't specifically switch to minimum TLS 1.2 version. The TLSv1.0/1.1_2019 policy for such will be removed and disabled in April 2025.

| **OpenSSL** | **Cipher** **Suite** | **TLSv1.2_2023** | **TLSv1.2_2022** |
|---|---|---|---|
| **Minimum Protocol version** | | **1.2** | **1.2** |
| **Supported Protocols** | | **1.3/1.2** | **1.3./1.2** |
| **TLS_AES_256_GCM_SHA384** | TLS_AES_256_GCM_SHA384 | Yes | Yes |
| **TLS_AES_128_GCM_SHA256** | TLS_AES_128_GCM_SHA256 | Yes | Yes |
| **ECDHE-RSA-AES256-GCM-SHA384** | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | Yes | Yes |
| **ECDHE-RSA-AES128-GCM-SHA256** | TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 | Yes | Yes | 
| **DHE-RSA-AES256-GCM-SHA384** | TLS_DHE_RSA_WITH_AES_256_GCM_SHA384 | | Yes | 
| **DHE-RSA-AES128-GCM-SHA256** | TLS_DHE_RSA_WITH_AES_128_GCM_SHA256 | | Yes | 
| **ECDHE-RSA-AES256-SHA384** | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | | Yes | 
| **ECDHE-RSA-AES128-SHA256** | TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 | | Yes | 

## Custom TLS policy

If a TLS policy needs to be configured for your requirements, you can use a Custom TLS policy. With a custom TLS policy, you have complete control over the minimum TLS protocol version to support, and the supported cipher suites and their priority order. 

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
- TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_DHE_RSA_WITH_AES_256_GCM_SHA384

> [!NOTE]
> For Windows 10 and later versions, we recommend enabling one or both of the ECDHE_GCM cipher suites for better security. Windows 8.1, 8, and 7 aren't compatible with these ECDHE_GCM cipher suites. The ECDHE_CBC and DHE cipher suites have been provided for compatibility with those operating systems.

## Next step

> [!div class="nextstepaction"]
> [Configure TLS policy on Front Door](tls-policy-configure.md)
