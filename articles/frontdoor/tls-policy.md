---
title: Configure an Azure Front Door TLS Policy
description: Learn about Azure Front Door TLS policies and configure a predefined or custom policy for a custom domain.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 08/13/2026
---

# Configure an Azure Front Door TLS policy

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door supports [end-to-end TLS encryption](end-to-end-tls.md). When you add a custom domain to Azure Front Door, you must use HTTPS and define a TLS policy. A TLS policy controls the TLS protocol version and cipher suites that Azure Front Door uses during the TLS handshake. Azure Front Door supports TLS 1.2 and TLS 1.3, and it also supports mutual TLS (mTLS) authentication. For more information, see [Mutual TLS authentication in Azure Front Door](mutual-tls.md).

Azure Front Door Standard and Premium provide predefined and custom TLS policies. If you use Azure Front Door (classic) or Microsoft CDN (classic), you continue to use the minimum TLS 1.2 version.

During the TLS handshake, Azure Front Door negotiates the protocol version and cipher suite with the client. For a minimum TLS version of 1.2, it first attempts to establish TLS 1.3 and then TLS 1.2. The client must support at least one of the supported cipher suites to establish an HTTPS connection with Azure Front Door. Azure Front Door chooses a cipher suite in the listed order from the cipher suites that the client supports.

When Azure Front Door initiates TLS traffic to the origin, it attempts to negotiate the best TLS version that the origin can reliably and consistently accept. Front Door supports TLS 1.2 and TLS 1.3 for origin connections.

> [!NOTE]
> Clients with TLS 1.3 enabled must support one of the Microsoft Security Development Lifecycle (SDL) compliant elliptic (EC) curves, including secp384r1, secp256r1, and secp521r1. Use one of these curves as the preferred curve during requests to avoid increased TLS handshake latency caused by multiple round trips to negotiate a supported EC curve.

## Choose a TLS policy

Select a predefined policy for a Microsoft-managed security configuration, or select a custom policy when you need control over the minimum TLS protocol version, supported cipher suites, and cipher-suite priority order.

### Predefined TLS policies

The Microsoft Security team configures predefined policies based on security best practices and recommendations. Use the newest TLS policy to get the most current TLS security configuration.

Policy names identify their minimum TLS version and the year in which they were configured. By default, Azure Front Door selects TLSv1.2_2023. TLSv1.2_2022 maps to the minimum TLS 1.2 version in the previous design.

The following table lists the minimum protocol version and cipher suites for each predefined policy. The cipher suite order determines the priority order during TLS negotiation.

| **OpenSSL** | **Cipher suite** | **TLSv1.2_2023** | **TLSv1.2_2022** |
| --- | --- | --- | --- |
| **Minimum protocol version** | | **1.2** | **1.2** |
| **Supported protocols** | | **1.3/1.2** | **1.3/1.2** |
| **TLS_AES_256_GCM_SHA384** | TLS_AES_256_GCM_SHA384 | Yes | Yes |
| **TLS_AES_128_GCM_SHA256** | TLS_AES_128_GCM_SHA256 | Yes | Yes |
| **ECDHE-RSA-AES256-GCM-SHA384** | TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 | Yes | Yes |
| **ECDHE-RSA-AES128-GCM-SHA256** | TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 | Yes | Yes |
| **ECDHE-RSA-AES256-SHA384** | TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384 | No | Yes |
| **ECDHE-RSA-AES128-SHA256** | TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256 | No | Yes |

### Custom TLS policies

A custom TLS policy gives you control over the minimum TLS protocol version, supported cipher suites, and cipher-suite priority order.

> [!NOTE]
> TLS 1.3 is always enabled regardless of the minimum TLS version that you select.

Azure Front Door supports the following cipher suites for custom policies. The cipher-suite order determines the priority order during TLS negotiation.

- TLS_AES_256_GCM_SHA384 (TLS 1.3 only)
- TLS_AES_128_GCM_SHA256 (TLS 1.3 only)
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384

> [!NOTE]
> For Windows 10 and later versions, enable one or both of the ECDHE_GCM cipher suites for better security. Windows 8.1, Windows 8, and Windows 7 aren't compatible with these ECDHE_GCM cipher suites. The ECDHE_CBC cipher suites are available for compatibility with those operating systems.

## Prerequisites

- An Azure Front Door profile. For more information, see [Create an Azure Front Door](create-front-door-portal.md).
- A custom domain. If you don't have one, purchase a domain from a domain provider. For more information, see [Buy a custom domain name](/azure/app-service/manage-custom-dns-buy-domain?toc=/azure/frontdoor/TOC.json).
- If you use Azure DNS to host your domain, delegate the domain provider's domain name system (DNS) to Azure DNS. For more information, see [Delegate a domain to Azure DNS](/azure/dns/dns-delegate-domain-azure-dns?toc=/azure/frontdoor/TOC.json). If your domain provider hosts your DNS domain, see [Create a CNAME DNS record](front-door-custom-domain.md).

## Configure a TLS policy

1. In the Azure portal, go to the Azure Front Door profile that you want to configure.

1. Under **Settings**, select **Domains**, and then select **+ Add**.

1. On **Add a domain**, follow the instructions in [Configure a custom domain on Azure Front Door](standard-premium/how-to-add-custom-domain.md) and [Configure HTTPS on an Azure Front Door custom domain](standard-premium/how-to-configure-https-custom-domain.md) to configure the domain.

1. For **TLS policy**, select a predefined policy from the dropdown list, or select **Custom** to choose cipher suites.

   :::image type="content" source="media/add-domain.png" alt-text="Screenshot that shows the TLS policy option on the Add a domain page." lightbox="media/add-domain.png":::

   Select **View policy details** to view the supported cipher suites.

   :::image type="content" source="media/tls-policy/tls-policy-details.png" alt-text="Screenshot that shows the TLS policy details." lightbox="media/tls-policy/tls-policy-details.png":::

   If you select **Custom**, you can choose the minimum TLS version and the corresponding cipher suites by selecting **Select cipher suites**.

   :::image type="content" source="media/tls-policy/tls-policy-customize.png" alt-text="Screenshot that shows how to customize a TLS policy." lightbox="media/tls-policy/tls-policy-customize.png":::

   > [!NOTE]
   > To reuse a custom TLS policy configuration from another domain, select the domain in **Reuse setting from other domain**.

1. After you configure the TLS policy, select **Add** to add the domain.

## Verify the TLS policy

Use the [SSL Server Test](https://www.ssllabs.com/ssltest/) or the `sslscan` tool to view the cipher suites that your domain supports.

## Related content

- [End-to-end TLS with Azure Front Door](end-to-end-tls.md)
- [Mutual TLS (mTLS) authentication in Azure Front Door](mutual-tls.md)
- [Configure HTTPS for your custom domain on Azure Front Door](standard-premium/how-to-configure-https-custom-domain.md)
- [Add a custom domain on Azure Front Door](standard-premium/how-to-add-custom-domain.md)
