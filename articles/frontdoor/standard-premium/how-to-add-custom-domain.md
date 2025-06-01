---
title: How to add a custom domain
titleSuffix: Azure Front Door
description: In this article, you learn how to onboard a custom domain to an Azure Front Door profile by using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 03/26/2025

#Customer intent: As a website owner, I want to add a custom domain to my Azure Front Door configuration so that my users can use my custom domain to access my content.
---

# Configure a custom domain on Azure Front Door by using the Azure portal

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

When using Azure Front Door for application delivery, a custom domain allows your own domain name to appear in user requests. This visibility can enhance customer convenience and support branding efforts.

By default, after creating an Azure Front Door Standard/Premium profile and endpoint, the endpoint host is a subdomain of `azurefd.net`. For example, the URL might look like `https://contoso-frontend-mdjf2jfgjf82mnzx.z01.azurefd.net/activeusers.htm`.

To make your URLs more user-friendly and branded, Azure Front Door allows you to associate a custom domain. This way, your content can be delivered using a custom domain in the URL, such as `https://www.contoso.com/photo.png`, instead of the default Azure Front Door domain.

## Prerequisites

- An Azure Front Door profile. For more information, see [Quickstart: Create an Azure Front Door Standard/Premium](create-front-door-portal.md).
- A custom domain. If you don't have a custom domain, you must first purchase one from a domain provider. For more information, see [Buy a custom domain name](/azure/app-service/manage-custom-dns-buy-domain?toc=/azure/frontdoor/TOC.json).
- If you're using Azure to host your DNS domains, you must delegate the domain provider's domain name system (DNS) to an Azure DNS. For more information, see [Delegate a domain to Azure DNS](/azure/dns/dns-delegate-domain-azure-dns?toc=/azure/frontdoor/TOC.json). Otherwise, if you're using a domain provider to handle your DNS domain, you must manually validate the domain by entering prompted DNS TXT records.

## Add a new custom domain

> [!NOTE]
> If a custom domain is already validated in an Azure Front Door or Microsoft CDN profile, it can't be added to another profile.

To configure a custom domain, go to the **Domains** pane of your Azure Front Door profile. You can set up and validate a custom domain before associating it with an endpoint. A custom domain and its subdomains can only be associated with a single endpoint at a time. However, different subdomains from the same custom domain can be used for different Azure Front Door profiles. You can also map custom domains with different subdomains to the same Azure Front Door endpoint.

1. Under **Settings**, select **Domains** for your Azure Front Door profile. Then select **+ Add**.

1. On the **Add a domain** pane, select the domain type. You can choose **Non-Azure validated domain** or **Azure pre-validated domain**.

    * **Non-Azure validated domain**: The domain requires ownership validation. We recommend using the Azure-managed DNS option. You can also use your own DNS provider. If you choose Azure-managed DNS, select an existing DNS zone and either select an existing custom subdomain or create a new one. If you're using another DNS provider, manually enter the custom domain name. Then select **Add** to add your custom domain.

        :::image type="content" source="../media/add-domain.png" alt-text="Screenshot that shows the Add a domain pane." lightbox="../media/add-domain.png":::

    * **Azure pre-validated domain**: The domain is already validated by another Azure service, so domain ownership validation isn't required from Azure Front Door. A dropdown list of validated domains by different Azure services appear.

        :::image type="content" source="../media/pre-validated-custom-domain.png" alt-text="Screenshot that shows Prevalidated custom domains on the Add a domain pane." lightbox="../media/pre-validated-custom-domain.png":::

    > [!NOTE]
    > - Azure Front Door supports both Azure-managed certificates and Bring Your Own Certificates (BYOCs). For non-Azure validated domains, Azure-managed certificates are issued and managed by Azure Front Door. For Azure prevalidated domains, the Azure-managed certificate is issued and managed by the Azure service that validates the domain. To use your own certificate, see [Configure HTTPS on a custom domain](how-to-configure-https-custom-domain.md).
    > - Azure Front Door supports Azure prevalidated domains and Azure DNS zones in different subscriptions.
    > - Currently, Azure prevalidated domains only support domains validated by Azure Static Web Apps.

    A new custom domain initially has a validation state of **Submitting**.

    > [!NOTE]
    > - As of September 2023, Azure Front Door supports BYOC-based domain ownership validation. Azure Front Door automatically approves domain ownership if the Certificate Name (CN) or Subject Alternative Name (SAN) of the provided certificate matches the custom domain. When you select **Azure managed certificate**, domain ownership continues to be validated via the DNS TXT record.
    > - For custom domains created before BYOC-based validation support, if the domain validation status is anything but **Approved**, trigger auto-approval by selecting **Validation State** > **Revalidate** in the portal. If using the command-line tool, trigger domain validation by sending an empty `PATCH` request to the domain API.
    > - An Azure prevalidated domain will have a validation state of **Pending**. It will automatically change to **Approved** after a few minutes. Once approved, proceed to [Associate the custom domain with your Front Door endpoint](#associate-the-custom-domain-with-your-azure-front-door-endpoint) and complete the remaining steps.

    After a few minutes, the validation state will change to **Pending**.

1. Select the **Pending** validation state. A new pane appears with the DNS TXT record information required to validate the custom domain. The TXT record is in the format `_dnsauth.<your_subdomain>`. 

    - If you're using an Azure DNS-based zone, select **Add** to create a new TXT record with the provided value in the Azure DNS zone.
    - If you're using another DNS provider, manually create a new TXT record named `_dnsauth.<your_subdomain>` with the value shown on the pane.

1. Close the pane to return to the custom domains list. The provisioning state of the custom domain should change to **Provisioned**, and the validation state should change to **Approved**.

For more information about domain validation states, see [Domains in Azure Front Door](../domain.md#domain-validation).

## Associate the custom domain with your Azure Front Door endpoint

After validating your custom domain, you can associate it with your Azure Front Door Standard/Premium endpoint.

1. Select the **Unassociated** link to open the **Associate endpoint and routes** pane. Select the endpoint and routes you want to associate with the domain, then select **Associate** to update your configuration.

    :::image type="content" source="../media/how-to-add-custom-domain/associate-endpoint-routes.png" alt-text="Screenshot of the Associate endpoint and routes pane.":::

    The **Endpoint association** status updates to reflect the endpoint currently associated with the custom domain.

1. Select the **DNS state** link.

    :::image type="content" source="../media/how-to-add-custom-domain/dns-state-link.png" alt-text="Screenshot that shows the DNS state link." lightbox="../media/how-to-add-custom-domain/dns-state-link.png":::

    > [!NOTE]
    > For an Azure prevalidated domain, manually update the CNAME record from the other Azure service endpoint to the Azure Front Door endpoint in your DNS hosting service. This step is required regardless of whether the domain is hosted with Azure DNS or another DNS service. The link to update the CNAME from the **DNS state** column isn't available for this type of domain.

1. The **Add or update the CNAME record** pane appears with the necessary CNAME record information. If using Azure DNS hosted zones, you can create the CNAME records by clicking **Add** on the pane. If using another DNS provider, manually enter the CNAME record name and value as shown on the pane.

1. Once the CNAME record is created and the custom domain is associated with the Azure Front Door endpoint, traffic starts flowing.

    > [!NOTE]
    > - If HTTPS is enabled, certificate provisioning and propagation might take a few minutes as it propagates to all edge locations.
    > - If your domain CNAME is indirectly pointed to an Azure Front Door endpoint, such as through Azure Traffic Manager for multi-CDN failover, the **DNS state** column may show **CNAME/Alias record currently not detected**. Azure Front Door can't guarantee 100% detection of the CNAME record in this scenario. If you configured an Azure Front Door endpoint to Traffic Manager and still see this message, it doesn't necessarily mean there's an issue with your setup. No further action is required.

## Verify the custom domain

After validating and associating the custom domain, ensure that the custom domain is correctly referenced to your endpoint.

:::image type="content" source="../media/how-to-add-custom-domain/verify-configuration.png" alt-text="Screenshot showing the validated and associated custom domain.":::

Finally, verify that your application content is being served by using a browser.

## Related content

- [Enable HTTPS on your custom domain](how-to-configure-https-custom-domain.md)
- [Custom domains in Azure Front Door](../domain.md)
- [End-to-end TLS with Azure Front Door](../end-to-end-tls.md)
