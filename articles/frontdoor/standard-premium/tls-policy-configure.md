---
title: Configure Azure Front Door TLS policy
description: Learn how you can configure TLS policy to meet security requirements for your Front Door custom domains.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 05/14/2026
---

# Configure TLS policy on a Front Door custom domain 

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door Standard and Premium offer two mechanisms for controlling TLS policy. You can use either a predefined policy or a custom policy based on your own needs. If you use Azure Front Door (classic) or Microsoft CDN (classic), you continue to use the minimum TLS 1.2 version.

- Azure Front Door offers several predefined TLS policies. You can configure your Azure Front Door with any of these policies to get the appropriate level of security. The Microsoft Security team configures these predefined policies based on best practices and recommendations. Use the newest TLS policies to ensure the best TLS security.

- If you need to configure a TLS policy for your own business and security requirements, use a custom TLS policy. By using a custom TLS policy, you have complete control over the minimum TLS protocol version to support, and the supported cipher suites.

In this article, you learn how to configure TLS policy on a Front Door custom domain.

## Prerequisites

- A Front Door. For more information, see [Quickstart: Create a Front Door using the Azure portal](/azure/frontdoor/quickstart-create-front-door).
- A custom domain. If you don't have a custom domain, you must first purchase one from a domain provider. For more information, see [Buy a custom domain name](/azure/app-service/manage-custom-dns-buy-domain?toc=/azure/frontdoor/TOC.json).
- If you're using Azure to host your [DNS domains](/azure/dns/dns-overview), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](/azure/dns/dns-delegate-domain-azure-dns?toc=/azure/frontdoor/TOC.json). Otherwise, if you're using a domain provider to handle your DNS domain, see [Create a CNAME DNS record](/azure/frontdoor/front-door-custom-domain).

## Configure TLS policy

1. Go to your Azure Front Door profile that you want to configure the TLS policy for.

1. Under **Settings**, select **Domains**. Then select **+ Add** to add a new domain.

1. On **Add a domain**, follow the instructions in [Configure a custom domain on Azure Front Door](/azure/frontdoor/standard-premium/how-to-add-custom-domain) and [Configure HTTPS on an Azure Front Door custom domain](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain) to configure the domain.

1. For **TLS policy**, select the predefined policy from the dropdown list or **Custom** to customize the cipher suites per your needs.

    :::image type="content" source="../media/add-domain.png" alt-text="Screenshot that shows the TLS policy option in Add a domain page." lightbox="../media/add-domain.png":::

    Select **View policy details** to see the supported cipher suites.

    :::image type="content" source="../media/tls-policy-configure/tls-policy-details.png" alt-text="Screenshot that shows the TLS policy details." lightbox="../media/tls-policy-configure/tls-policy-details.png":::

    When you select **Custom**, you can choose the minimum TLS version and the corresponding cipher suites by selecting **Select cipher suites**.

    :::image type="content" source="../media/tls-policy-configure/tls-policy-customize.png" alt-text="Screenshot that shows how to customize your TLS policy." lightbox="../media/tls-policy-configure/tls-policy-customize.png":::

    > [!NOTE]
    > To reuse the custom TLS policy setting from other domains in the portal, select the domain in **Reuse setting from other domain**. 

1. After you customize the TLS policy, select **Add** to add the domain.

## Verify TLS policy configurations

View the supported cipher suite of your domain by using [www.ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/) or use the sslscan tool.

## Related content

- [Azure Front Door TLS Policy](tls-policy.md)
- [Add a custom domain on Azure Front Door](how-to-add-custom-domain.md)
- [Configure HTTPS for your custom domain on Azure Front Door](how-to-configure-https-custom-domain.md)
