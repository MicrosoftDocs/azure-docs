---
title: 'How to add a custom domain - Azure Front Door'
description: In this article, you'll  learn how to onboard a custom domain to Azure Front Door profile using the Azure portal.
services: frontdoor
documentationcenter: ''
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 09/06/2022
ms.author: duau
#Customer intent: As a website owner, I want to add a custom domain to my Front Door configuration so that my users can use my custom domain to access my content.
---

# Configure a custom domain on Azure Front Door using the Azure portal

When you use Azure Front Door for application delivery, a custom domain is necessary if you would like your own domain name to be visible in your end-user requests. Having a visible domain name can be convenient for your customers and useful for branding purposes.

After you create an Azure Front Door Standard/Premium profile, the default frontend host will have a subdomain of `azurefd.net`. This subdomain gets included in the URL when Azure Front Door Standard/Premium delivers content from your backend by default. For example, `https://contoso-frontend.azurefd.net/activeusers.htm`. For your convenience, Azure Front Door provides the option of associating a custom domain with the default host. With this option, you deliver your content with a custom domain in your URL instead of an Azure Front Door owned domain name. For example, `https://www.contoso.com/photo.png`.

Azure Front Door supports two types of domains, non-Azure validated domain and Azure pre-validated domain. Azure managed certificate and customer certificate are supported for both types. For more information, see [Configure HTTPS on a custom domain](how-to-configure-https-custom-domain.md).

* **Azure pre-validated domains** - are domains validated by another Azure service. This domain type is used when you onboard and validated a domain to an Azure service, and then configured the Azure service behind an Azure Front Door. You don't need to validate the domain through the Azure Front Door when you use this type of domain.

    > [!NOTE]
    > Currently Azure pre-validated domain only supports domain validated by Static Web App.

* **Non-Azure validated domains** - are domains that aren't validated by any Azure service. This domain type can be hosted with any DNS service and requires domain ownership validation with Azure Front Door. 

## Prerequisites

* Before you can complete the steps in this tutorial, you must first create a Front Door. For more information, see [Quickstart: Create a Front Door Standard/Premium](create-front-door-portal.md).

* If you don't already have a custom domain, you must first purchase one with a domain provider. For example, see [Buy a custom domain name](../../app-service/manage-custom-dns-buy-domain.md).

* If you're using Azure to host your [DNS domains](../../dns/dns-overview.md), you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](../../dns/dns-delegate-domain-azure-dns.md). Otherwise, if you're using a domain provider to handle your DNS domain, you must manually validate the domain by entering prompted DNS TXT records.

## Add a new custom domain

> [!NOTE]
> If a custom domain is validated in an Azure Front Door or a Microsoft CDN profile already, then it can't be added to another profile.

A custom domain is configured on the **Domains** page of the Front Door profile. A custom domain can be set up and validated prior to endpoint association. A custom domain and its subdomains can only be associated with a single endpoint at a time. However, you can use different subdomains from the same custom domain for different Front Door profiles. You may also map custom domains with different subdomains to the same Front Door endpoint.

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
    > An Azure pre-validated domain will have a validation state of **Pending** and will automatically change to **Approved** after a few minutes. Once validation gets approved, skip to [**Associate the custom domain to your Front Door endpoint**](#associate-the-custom-domain-to-your-front-door-endpoint) and complete the remaining steps. 

    The validation state will change to **Pending** after a few minutes.

    :::image type="content" source="../media/how-to-add-custom-domain/validation-state-pending.png" alt-text="Screenshot of domain validation state pending.":::

1. Select the **Pending** validation state. A new page will appear with DNS TXT record information needed to validate the custom domain. The TXT record is in the form of `_dnsauth.<your_subdomain>`. If you're using Azure DNS-based zone, select the **Add** button, and a new TXT record with the displayed record value will be created in the Azure DNS zone. If you're using another DNS provider, manually create a new TXT record of name `_dnsauth.<your_subdomain>` with the record value as shown on the page.

    :::image type="content" source="../media/how-to-add-custom-domain/validate-custom-domain.png" alt-text="Screenshot of validate custom domain page.":::

1. Close the page to return to custom domains list landing page. The provisioning state of custom domain should change to **Provisioned** and validation state should change to **Approved**.

    :::image type="content" source="../media/how-to-add-custom-domain/provisioned-approved-status.png" alt-text="Screenshot of provisioned and approved status.":::

### Domain validation state

| Domain validation state | Description and actions |
|--|--|
| Approved | This status means the domain has been successfully validated. |
| Internal error | If you see this error, retry validation by selecting the **Refresh** or **Regenerate** button. If you're still experiencing issues, submit a support request to Azure support. |
| Pending | A domain goes to pending state once the DNS TXT record challenge is generated. Add the DNS TXT record to your DNS provider and wait for the validation to complete. If the status remains **Pending** even after the TXT record has been updated with the DNS provider, select **Regenerate** to refresh the TXT record then add the TXT record to your DNS provider again. |
| Pending re-validation | This status occurs when the managed certificate is less than 45 days from expiring. If you have a CNAME record already pointing to the Azure Front Door endpoint, no action is required for certificate renewal. If the custom domain is pointed to another CNAME record, select the **Pending re-validation**, and then select **Regenerate** on the *Validate the custom domain* page. Lastly, select **Add** if you're using Azure DNS or manually add the TXT record with your own DNS provider’s DNS management. |
| Refreshing validation token | A domain goes into a *Refreshing Validation Token* state for a brief period after the **Regenerate** button is selected. Once a new TXT record challenge is issued, the state will change to **Pending**. |
| Rejected | This  when the certificate provider/authority rejects the issuance for the managed certificate, for example, when the domain is invalid. Select the **Rejected** link and then select **Regenerate** on the *Validate the custom domain* page, as shown in the screenshots below this table. Then select **Add** to add the TXT record in the DNS provider. |
| Submitting | When a new custom domain is added and being created, the validation state becomes Submitting. |
| Timeout | The domain validation state will change from *Pending* to *Timeout* if the TXT record isn't added to your DNS provider within seven days. You'll also see a *Timeout* state if an invalid DNS TXT record has been added. Select the **Timeout** link and then select **Regenerate** on the *Validate the custom domain* page. Then select **Add** to add the TXT record to the DNS provider. |

> [!NOTE]
> 1. The default TTL for TXT record is 1 hour. When you need to regenerate the TXT record for re-validation, please pay attention to the TTL for the previous TXT record. If it doesn't expire, the validation will fail until the previous TXT record expires. 
> 2. If the **Regenerate** button doesn't work, delete and recreate the domain.
> 3. If the domain state doesn't reflect as expected, select the **Refresh** button.

## Associate the custom domain to your Front Door endpoint

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
   > If HTTPS is enabled, certificate provisioning and propagation may take a few minutes because propagation is being done to all edge locations.

## Verify the custom domain

After you've validated and associated the custom domain, verify that the custom domain is correctly referenced to your endpoint.

:::image type="content" source="../media/how-to-add-custom-domain/verify-configuration.png" alt-text="Screenshot of validated and associated custom domain.":::

Lastly, validate that your application content is getting served using a browser.

## Next steps

Learn how to [enable HTTPS for your custom domain](how-to-configure-https-custom-domain.md).
