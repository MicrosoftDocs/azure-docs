---
title: Configure Azure Front Door TLS Policy (preview)
description: This article shows you how you can configure TLS policy to meet security requirements for your Front Door custom domains.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 03/18/2025
---

# How to configure TLS policy on a Front Door custom domain onboarded on Front Door (preview)

> [!IMPORTANT]
> TLS policy is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Front Door offers two mechanisms for controlling TLS policy. You can use either a predefined policy or a custom policy per your own needs.

- Azure Front Door offers several predefined TLS policies. You can configure your AFD with any of these policies to get the appropriate level of security. These predefined policies are configured keeping in mind the best practices and recommendations from the Microsoft Security team. We recommend that you use the newest TLS policies to ensure the best TLS security.

- If a TLS policy needs to be configured for your own business and security requirements, you can use a Custom TLS policy. With a custom TLS policy, you have complete control over the minimum TLS protocol version to support, as well as the supported cipher suites.

In this document, you will learn how to configure TLS policy on a Front Door custom domain.

## Prerequisites

Before you can complete the steps in this tutorial, you must first create a Front Door. For more information, see [Quickstart: Create a Front Door](/azure/frontdoor/quickstart-create-front-door).

If you don't already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](/azure/app-service/manage-custom-dns-buy-domain).

If you're using Azure to host your [DNS domains](/azure/dns/dns-overview), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](/azure/dns/dns-delegate-domain-azure-dns). Otherwise, if you're using a domain provider to handle your DNS domain, continue to [Create a CNAME DNS record](/azure/frontdoor/front-door-custom-domain).

## Configure TLS policy

1. Under **Settings**, select **Domains** for your Azure Front Door profile. Then select **+** **Add** to add a new domain.

2. On the Add a domain pane, follow [How to add a custom domain - Azure Front Door | Microsoft Learn](/azure/frontdoor/standard-premium/how-to-add-custom-domain) and [Configure HTTPS for your custom domain - Azure Front Door | Microsoft Learn](/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain) to configure the following information.

3. For **TLS policy**, choose the predefined policy from the dropdown listor Custom  to customize the cipher suites per your needs. You can also view the supported cipher suites by clicking **View policy details**. When you choose **Custom**, you can choose the Minimum TLS version and the corresponding cipher suites. 

> [!NOTE]
> You can reuse the custom TLS policy setting from other domains in portal by selecting the domain in **Reuse setting from other domain**. 

## Verify TLS policy configurations

View the supported cipher suit of your domain via https://www.ssllabs.com/ssltest/ or use the sslscan tool.

## Related content

- [Azure Front Door TLS Policy (preview)](tls-policy.md)
- [Add a custom domain on Azure Front Door](how-to-add-custom-domain.md)
- [Configure HTTPS for your custom domain on Azure Front Door](how-to-configure-https-custom-domain.md)
