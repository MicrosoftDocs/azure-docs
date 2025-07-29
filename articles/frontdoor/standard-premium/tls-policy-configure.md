---
title: Configure Azure Front Door TLS policy
description: Learn how you can configure TLS policy to meet security requirements for your Front Door custom domains.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 04/09/2025
---

# Configure TLS policy on a Front Door custom domain 

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

Azure Front Door Standard and Premium offer two mechanisms for controlling TLS policy. You can use either a predefined policy or a custom policy per your own needs. If you use Azure Front Door (classic) and Microsoft CDN (classic), you'll continue to use the minimum TLS 1.2 version.

- Azure Front Door offers several predefined TLS policies. You can configure your AFD with any of these policies to get the appropriate level of security. These predefined policies are configured keeping in mind the best practices and recommendations from the Microsoft Security team. We recommend that you use the newest TLS policies to ensure the best TLS security.

- If a TLS policy needs to be configured for your own business and security requirements, you can use a Custom TLS policy. With a custom TLS policy, you have complete control over the minimum TLS protocol version to support, and the supported cipher suites.

In this article, you learn how to configure TLS policy on a Front Door custom domain.

## Prerequisites

- A Front Door. For more information, see [Quickstart: Create a Front Door using the Azure portal](/azure/frontdoor/quickstart-create-front-door).
- A custom domain. If you don't have a custom domain, you must first purchase one from a domain provider. For more information, see [Buy a custom domain name](/azure/app-service/manage-custom-dns-buy-domain?toc=/azure/frontdoor/TOC.json).
- If you're using Azure to host your [DNS domains](/azure/dns/dns-overview), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](/azure/dns/dns-delegate-domain-azure-dns?toc=/azure/frontdoor/TOC.json). Otherwise, if you're using a domain provider to handle your DNS domain, see [Create a CNAME DNS record](/azure/frontdoor/front-door-custom-domain).

## Configure TLS policy

1. Go to your Azure Front Door profile that you want to configure the TLS policy for.

1. Under **Settings**, select **Domains** . Then select **+** **Add** to add a new domain.

1. On the **Add a domain** page, follow the instructions in [Configure a custom domain on Azure Front Door](/azure/frontdoor/standard-premium/how-to-add-custom-domain) and [Configure HTTPS on an Azure Front Door custom domain](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain) to configure the domain.

1. For **TLS policy**, select the predefined policy from the dropdown list or **Custom** to customize the cipher suites per your needs.

    :::image type="content" source="../media/add-domain.png" alt-text="Screenshot that shows the TLS policy option in Add a domain page." lightbox="../media/add-domain.png":::

    You can view the supported cipher suites by selecting **View policy details**.

    :::image type="content" source="../media/tls-policy-configure/tls-policy-details.png" alt-text="Screenshot that shows the TLS policy details." lightbox="../media/tls-policy-configure/tls-policy-details.png":::

    When you select **Custom**, you can choose the Minimum TLS version and the corresponding cipher suites by selecting **Select cipher suites**.

    :::image type="content" source="../media/tls-policy-configure/tls-policy-customize.png" alt-text="Screenshot that shows how to customize your TLS policy." lightbox="../media/tls-policy-configure/tls-policy-customize.png":::

    > [!NOTE]
    > You can reuse the custom TLS policy setting from other domains in the portal by selecting the domain in **Reuse setting from other domain**. 

1. Select **Add** to add the domain.

## Verify TLS policy configurations

View the supported cipher suite of your domain via [www.ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/) or use the sslscan tool.

## Related content

- [Azure Front Door TLS Policy](tls-policy.md)
- [Add a custom domain on Azure Front Door](how-to-add-custom-domain.md)
- [Configure HTTPS for your custom domain on Azure Front Door](how-to-configure-https-custom-domain.md)
