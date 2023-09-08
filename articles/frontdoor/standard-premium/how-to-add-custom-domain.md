---
title: 'How to add a custom domain - Azure Front Door'
description: In this article, you'll  learn how to onboard a custom domain to Azure Front Door profile using the Azure portal.
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 07/24/2023
ms.author: duau
#Customer intent: As a website owner, I want to add a custom domain to my Front Door configuration so that my users can use my custom domain to access my content.
---

# Configure a custom domain on Azure Front Door using the Azure portal

When you use Azure Front Door for application delivery, a custom domain is necessary if you would like your own domain name to be visible in your end-user requests. Having a visible domain name can be convenient for your customers and useful for branding purposes.

After you create an Azure Front Door Standard/Premium profile, the default frontend host will have a subdomain of `azurefd.net`. This subdomain gets included in the URL when Azure Front Door Standard/Premium delivers content from your backend by default. For example, `https://contoso-frontend.azurefd.net/activeusers.htm`. For your convenience, Azure Front Door provides the option of associating a custom domain with the default host. With this option, you deliver your content with a custom domain in your URL instead of an Azure Front Door owned domain name. For example, `https://www.contoso.com/photo.png`.

## Prerequisites

* Before you can complete the steps in this tutorial, you must first create an Azure Front Door profile. For more information, see [Quickstart: Create a Front Door Standard/Premium](create-front-door-portal.md).

* If you don't already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](../../app-service/manage-custom-dns-buy-domain.md).

* If you're using Azure to host your [DNS domains](../../dns/dns-overview.md), you must delegate the domain provider's domain name system (DNS) to Azure DNS. For more information, see [Delegate a domain to Azure DNS](../../dns/dns-delegate-domain-azure-dns.md). Otherwise, if you're using a domain provider to handle your DNS domain, you must manually validate the domain by entering prompted DNS TXT records.

## Add a new custom domain

> [!NOTE]
> If a custom domain is validated in an Azure Front Door or a Microsoft CDN profile already, then it can't be added to another profile.

A custom domain is configured on the **Domains** page of the Azure Front Door profile. A custom domain can be set up and validated prior to endpoint association. A custom domain and its subdomains can only be associated with a single endpoint at a time. However, you can use different subdomains from the same custom domain for different Azure Front Door profiles. You may also map custom domains with different subdomains to the same Azure Front Door endpoint.

1. Select **Domains** under settings for your Azure Front Door profile and then select **+ Add** button.

    :::image type="content" source="../media/how-to-add-custom-domain/add-domain-button.png" alt-text="Screenshot of add domain button on domain landing page.":::

1. On the *Add a domain* page, select the **Domain type**. You can select between a **Non-Azure validated domain** or an **Azure pre-validated domain**.

    * **Non-Azure validated domain** is a domain that requires ownership validation. When you select Non-Azure validated domain, the recommended DNS management option is to use Azure-managed DNS. You may also use your own DNS provider. If you choose Azure-managed DNS, select an existing DNS zone. Then select an existing custom subdomain or create a new one. If you're using another DNS provider, manually enter the custom domain name. Then select **Add** to add your custom domain.

        :::image type="content" source="../media/how-to-add-custom-domain/add-domain-page.png" alt-text="Screenshot of add a domain page.":::  

    * **Azure pre-validated domain** is a domain already validated by another Azure service. When you select this option, domain ownership validation isn't required by Azure Front Door. A dropdown list of validated domains by different Azure services will appear.

        :::image type="content" source="../media/how-to-add-custom-domain/pre-validated-custom-domain.png" alt-text="Screenshot of pre-validated custom domain in add a domain page.":::    

    > [!NOTE]
    > * Azure Front Door supports both Azure managed certificate and Bring Your Own Certificates. For Non-Azure validated domain, the Azure managed certificate is issued and managed by the Azure Front Door. For Azure pre-validated domain, the Azure managed certificate gets issued and is managed by the Azure service that validates the domain. To use own certificate, see [Configure HTTPS on a custom domain](how-to-configure-https-custom-domain.md).
    > * Azure Front Door supports Azure pre-validated domains and Azure DNS zones in different subscriptions. 
    > * Currently Azure pre-validated domains only supports domains validated by Static Web App.

    A new custom domain will have a validation state of **Submitting**.

    :::image type="content" source="../media/how-to-add-custom-domain/validation-state-submitting.png" alt-text="Screenshot of domain validation state submitting.":::

    > [!NOTE]
    > An Azure pre-validated domain will have a validation state of **Pending** and will automatically change to **Approved** after a few minutes. Once validation gets approved, skip to [**Associate the custom domain to your Front Door endpoint**](#associate-the-custom-domain-with-your-azure-front-door-endpoint) and complete the remaining steps. 

    The validation state will change to **Pending** after a few minutes.

    :::image type="content" source="../media/how-to-add-custom-domain/validation-state-pending.png" alt-text="Screenshot of domain validation state pending.":::

1. Select the **Pending** validation state. A new page will appear with DNS TXT record information needed to validate the custom domain. The TXT record is in the form of `_dnsauth.<your_subdomain>`. If you're using Azure DNS-based zone, select the **Add** button, and a new TXT record with the displayed record value will be created in the Azure DNS zone. If you're using another DNS provider, manually create a new TXT record of name `_dnsauth.<your_subdomain>` with the record value as shown on the page.

    :::image type="content" source="../media/how-to-add-custom-domain/validate-custom-domain.png" alt-text="Screenshot of validate custom domain page.":::

1. Close the page to return to custom domains list landing page. The provisioning state of custom domain should change to **Provisioned** and validation state should change to **Approved**.

    :::image type="content" source="../media/how-to-add-custom-domain/provisioned-approved-status.png" alt-text="Screenshot of provisioned and approved status.":::

For more information about domain validation states, see [Domains in Azure Front Door](../domain.md#domain-validation).

## Associate the custom domain with your Azure Front Door endpoint

After you validate your custom domain, you can associate it to your Azure Front Door Standard/Premium endpoint.

1. Select the **Unassociated** link to open the **Associate endpoint and routes** page. Select an endpoint and routes you want to associate the domain with. Then select **Associate** to update your configuration.

    :::image type="content" source="../media/how-to-add-custom-domain/associate-endpoint-routes.png" alt-text="Screenshot of associate endpoint and routes page.":::

    The Endpoint association status should change to reflect the endpoint to which the custom domain is currently associated. 

    :::image type="content" source="../media/how-to-add-custom-domain/endpoint-association-status.png" alt-text="Screenshot of endpoint association link.":::

1. Select the DNS state link.

    :::image type="content" source="../media/how-to-add-custom-domain/dns-state-link.png" alt-text="Screenshot of DNS state link.":::

    > [!NOTE]
    > For an Azure pre-validated domain, go to the DNS hosting service and manually update the CNAME record for this domain from the other Azure service endpoint to Azure Front Door endpoint. This step is required, regardless of whether the domain is hosted with Azure DNS or with another DNS service. The link to update the CNAME from the DNS State column isn't available for this type of domain.

1. The **Add or update the CNAME record** page will appear and display the CNAME record information that must be provided before traffic can start flowing. If you're using Azure DNS hosted zones, the CNAME records can be created by selecting the **Add** button on the page. If you're using another DNS provider, you must manually enter the CNAME record name and value as shown on the page.

    :::image type="content" source="../media/how-to-add-custom-domain/add-update-cname-record.png" alt-text="Screenshot of add or update CNAME record.":::

1. Once the CNAME record gets created and the custom domain is associated to the Azure Front Door endpoint completes, traffic flow will start flowing.

    > [!NOTE]
    > * If HTTPS is enabled, certificate provisioning and propagation may take a few minutes because propagation is being done to all edge locations.
    > * If your domain CNAME is indirectly pointed to a Front Door endpoint, for example, using Azure Traffic Manager for multi-CDN failover, the **DNS state** column shows as **CNAME/Alias record currently not detected**. Azure Front Door can't guarantee 100% detection of the CNAME record in this case. If you've configured an Azure Front Door endpoint to Azure Traffic Manager and still see this message, it doesn’t mean you didn't set up correctly, therefore further no action is neccessary from your side.

## Verify the custom domain

After you've validated and associated the custom domain, verify that the custom domain is correctly referenced to your endpoint.

:::image type="content" source="../media/how-to-add-custom-domain/verify-configuration.png" alt-text="Screenshot of validated and associated custom domain.":::

Lastly, validate that your application content is getting served using a browser.

## Next steps

Learn how to [enable HTTPS for your custom domain](how-to-configure-https-custom-domain.md).
