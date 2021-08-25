---
title: How to add a custom domain to your Azure Front Door Standard/Premium SKU configuration
description: In this tutorial, you'll  learn how to onboard a custom domain to Azure Front Door Standard/Premium SKU.
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 02/18/2021
ms.author: amsriva
#Customer intent: As a website owner, I want to add a custom domain to my Front Door configuration so that my users can use my custom domain to access my content.
---

# Create a custom domain on Azure Front Door Standard/Premium SKU (Preview) using the Azure portal

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

When you use Azure Front Door Standard/Premium for application delivery, a custom domain is necessary if you would like your own domain name to be visible in your end-user requests. Having a visible domain name can be convenient for your customers and useful for branding purposes.

After you create an Azure Front Door Standard/Premium profile, the default frontend host will have a subdomain of azurefd.net. This subdomain gets included in the URL when Azure Front Door Standard/Premium delivers content from your backend by default. For example, `https://contoso-frontend.azurefd.net/activeusers.htm`. For your convenience, Azure Front Door provides the option of associating a custom domain with the default host. With this option, you deliver your content with a custom domain in your URL instead of an Azure Front Door Standard/Premium owned domain name. For example, 'https://www.contoso.com/photo.png'.

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [**Supplemental Terms of Use for Microsoft Azure Previews**](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites
* Before you can complete the steps in this tutorial, you must first create a Front Door. For more information, see [Quickstart: Create a Front Door Standard/Premium](create-front-door-portal.md).

* If you don't already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](../../app-service/manage-custom-dns-buy-domain.md).

* If you're using Azure to host your [DNS domains](../../dns/dns-overview.md), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](../../dns/dns-delegate-domain-azure-dns.md). Otherwise, if you're using a domain provider to handle your DNS domain, you must manually validate the domain by entering prompted DNS TXT records.

## Add a new custom domain

> [!NOTE]
> While in Public Preview, using Azure DNS to create Apex domains is  not supported on Azure Front Door Standard/Premium. There are other DNS providers that support CNAME flattening or DNS chasing that will allow APEX domains to be used for Azure Front Door Standard/Premium.

A custom domain is managed by Domains section in the portal. A custom domain can be created and validated before association to an endpoint. A custom domain and its subdomains can be associated with only a single endpoint at a time. However, you can use different subdomains from the same custom domain for different Front Doors. You can also map custom domains with different subdomains to the same Front Door endpoint.

1. Under Settings for your Azure Front Door profile, select *Domains*  and then the **Add a domain** button.

    :::image type="content" source="../media/how-to-add-custom-domain/add-domain-button.png" alt-text="Screenshot of add domain button on domain landing page.":::

1. The **Add a domain** page will appear where you can enter information about of the custom domain. You can choose Azure-managed DNS, which is recommended or you can choose to use your own DNS provider. If you choose Azure-managed DNS, select an existing DNS zone and then select a custom subdomain or create a new one. If you're using another DNS provider, manually enter the custom domain name. Select **Add** to add your custom domain.

    :::image type="content" source="../media/how-to-add-custom-domain/add-domain-page.png" alt-text="Screenshot of add a domain page.":::

    A new custom domain is created with a validation state of **Submitting**.

    :::image type="content" source="../media/how-to-add-custom-domain/validation-state-submitting.png" alt-text="Screenshot of domain validation state submitting.":::

    Wait until the validation state changes to **Pending**. This operation could take a few mins.

    :::image type="content" source="../media/how-to-add-custom-domain/validation-state-pending.png" alt-text="Screenshot of domain validation state pending.":::

1. Select the **Pending** validation state. A new page will appear with DNS TXT record information needed to validate the custom domain. The TXT record is in the form of `_dnsauth.<your_subdomain>`. If you're using Azure DNS-based zone, select the **Add** button and a new TXT record with the displayed record value will be created in the Azure DNS zone. If you're using another DNS provider, manually create a new TXT record of name `dnsauth.<your_subdomain>` with the record value as shown on the page.

    :::image type="content" source="../media/how-to-add-custom-domain/validate-custom-domain.png" alt-text="Screenshot of validate custom domain page.":::

1. Select the refresh status. Once the domain is validated using the DNS TXT record, the validation status will change to **verified**. This operation may take a few minutes to validate.

    :::image type="content" source="../media/how-to-add-custom-domain/domain-status-verified.png" alt-text="Screenshot of custom domain verified.":::

1. Close the page to return to custom domains list landing page. The provisioning state of custom domain should change to **Provisioned** and validation state should change to **Approved**.

    :::image type="content" source="../media/how-to-add-custom-domain/provisioned-approved-status.png" alt-text="Screenshot of provisioned and approved status.":::

## Associate the custom domain with your Front Door Endpoint

After you've validated your custom domain, you can then add it to your Azure Front Door Standard/Premium endpoint.

1. Once custom domain is validated, you can associate it to an existing Azure Front Door Standard/Premium endpoint and route. Select the **Endpoint association** link to open the **Associate endpoint and routes** page. Select an endpoint and routes you want to associate with. Then select **Associate**. Close the page once the associate operation completes.

    :::image type="content" source="../media/how-to-add-custom-domain/associate-endpoint-routes.png" alt-text="Screenshot of associate endpoint and routes page.":::

    The Endpoint association status should change to reflect the endpoint to which the custom domain is currently associated. 

    :::image type="content" source="../media/how-to-add-custom-domain/endpoint-association-status.png" alt-text="Screenshot of endpoint association link.":::

1. Select the DNS state link.

    :::image type="content" source="../media/how-to-add-custom-domain/dns-state-link.png" alt-text="Screenshot of DNS state link.":::

1. The **Add or update the CNAME record** page will appear and display the CNAME record information that must be provided before traffic can start flowing. If you're using Azure DNS hosted zones, the CNAME records can be created by selecting the **Add** button on the page. If you're using another DNS provider, you must manually enter the CNAME record name and value as shown on the page.

    :::image type="content" source="../media/how-to-add-custom-domain/add-update-cname-record.png" alt-text="Screenshot of add or update CNAME record.":::

1. Once the CNAME record gets created and the custom domain is associated to the Azure Front Door endpoint completes, traffic flow will start flowing.

    > [!NOTE]
    > If HTTPS is enabled, certificate provisioning and propagation may take a few minutes because propagation is being done to all edge locations. 

## Verify the custom domain

After you've validated and associated the custom domain, verify that the custom domain is correctly referenced to your endpoint.

:::image type="content" source="../media/how-to-add-custom-domain/verify-configuration.png" alt-text="Screenshot of validated and associated custom domain.":::

Then lastly, validate that your application content is getting served using a browser.

## Next steps

To learn how to enable HTTPS for your custom domain, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Enable HTTPS for a custom domain]()
