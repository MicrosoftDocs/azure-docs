---
title: 'How to add a custom domain - Azure Front Door'
description: In this article, you learn how to onboard a custom domain to an Azure Front Door profile by using the Azure portal.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 11/12/2024
ms.author: duau
#Customer intent: As a website owner, I want to add a custom domain to my Azure Front Door configuration so that my users can use my custom domain to access my content.
---

# Configure a custom domain on Azure Front Door by using the Azure portal
When using Azure Front Door for application delivery, a custom domain allows your own domain name to appear in user requests. This visibility can enhance customer convenience and support branding efforts.

By default, after creating an Azure Front Door Standard/Premium profile and endpoint, the endpoint host is a subdomain of `azurefd.net`. For example, the URL might look like `https://contoso-frontend-mdjf2jfgjf82mnzx.z01.azurefd.net/activeusers.htm`.

To make your URLs more user-friendly and branded, Azure Front Door allows you to associate a custom domain. This way, your content can be delivered using a custom domain in the URL, such as `https://www.contoso.com/photo.png`, instead of the default Azure Front Door domain.

## Prerequisites

* Ensure you have an Azure Front Door profile set up. For guidance, refer to [Quickstart: Create an Azure Front Door Standard/Premium](create-front-door-portal.md).
* Obtain a custom domain if you don't have one. You can purchase one from a domain provider. For example, see [Buy a custom domain name](../../app-service/manage-custom-dns-buy-domain.md).
* If your DNS domains are hosted on Azure, delegate the domain provider's DNS to Azure DNS. For instructions, see [Delegate a domain to Azure DNS](../../dns/dns-delegate-domain-azure-dns.md). If you use another domain provider for DNS, manually validate the domain by entering the required DNS TXT records.

## Add a new custom domain

> [!NOTE]
> If a custom domain is already validated in an Azure Front Door or Microsoft CDN profile, it can't be added to another profile.

To configure a custom domain, go to the **Domains** pane of your Azure Front Door profile. You can set up and validate a custom domain before associating it with an endpoint. A custom domain and its subdomains can only be associated with a single endpoint at a time. However, different subdomains from the same custom domain can be used for different Azure Front Door profiles. You can also map custom domains with different subdomains to the same Azure Front Door endpoint.

1. Under **Settings**, select **Domains** for your Azure Front Door profile. Then select **+ Add**.

    :::image type="content" source="../media/how-to-add-custom-domain/add-domain-button.png" alt-text="Screenshot that shows the Add a domain button on the domain landing pane.":::

1. On the **Add a domain** pane, select the domain type. You can choose **Non-Azure validated domain** or **Azure pre-validated domain**.

    * **Non-Azure validated domain**: The domain requires ownership validation. We recommend using the Azure-managed DNS option. You can also use your own DNS provider. If you choose Azure-managed DNS, select an existing DNS zone and either select an existing custom subdomain or create a new one. If you're using another DNS provider, manually enter the custom domain name. Then select **Add** to add your custom domain.

        :::image type="content" source="../media/how-to-add-custom-domain/add-domain-page.png" alt-text="Screenshot that shows the Add a domain pane.":::

    * **Azure pre-validated domain**: The domain is already validated by another Azure service, so domain ownership validation isn't required from Azure Front Door. A dropdown list of validated domains by different Azure services appear.

        :::image type="content" source="../media/how-to-add-custom-domain/pre-validated-custom-domain.png" alt-text="Screenshot that shows Prevalidated custom domains on the Add a domain pane.":::

    > [!NOTE]
    > * Azure Front Door supports both Azure-managed certificates and Bring Your Own Certificates (BYOCs). For non-Azure validated domains, Azure-managed certificates are issued and managed by Azure Front Door. For Azure prevalidated domains, the Azure-managed certificate is issued and managed by the Azure service that validates the domain. To use your own certificate, see [Configure HTTPS on a custom domain](how-to-configure-https-custom-domain.md).
    > * Azure Front Door supports Azure prevalidated domains and Azure DNS zones in different subscriptions.
    > * Currently, Azure prevalidated domains only support domains validated by Azure Static Web Apps.

    A new custom domain initially has a validation state of **Submitting**.

    :::image type="content" source="../media/how-to-add-custom-domain/validation-state-submitting.png" alt-text="Screenshot that shows the domain validation state as Submitting.":::

    > [!NOTE]
    > * As of September 2023, Azure Front Door supports BYOC-based domain ownership validation. Azure Front Door automatically approves domain ownership if the Certificate Name (CN) or Subject Alternative Name (SAN) of the provided certificate matches the custom domain. When you select **Azure managed certificate**, domain ownership continues to be validated via the DNS TXT record.
    > * For custom domains created before BYOC-based validation support, if the domain validation status is anything but **Approved**, trigger auto-approval by selecting **Validation State** > **Revalidate** in the portal. If using the command-line tool, trigger domain validation by sending an empty `PATCH` request to the domain API.
    > * An Azure prevalidated domain will have a validation state of **Pending**. It will automatically change to **Approved** after a few minutes. Once approved, proceed to [Associate the custom domain with your Front Door endpoint](#associate-the-custom-domain-with-your-azure-front-door-endpoint) and complete the remaining steps.

    After a few minutes, the validation state will change to **Pending**.

    :::image type="content" source="../media/how-to-add-custom-domain/validation-state-pending.png" alt-text="Screenshot that shows the domain validation state as Pending.":::

1. Select the **Pending** validation state. A new pane appears with the DNS TXT record information required to validate the custom domain. The TXT record is in the format `_dnsauth.<your_subdomain>`. 

    * If you're using an Azure DNS-based zone, select **Add** to create a new TXT record with the provided value in the Azure DNS zone.
    * If you're using another DNS provider, manually create a new TXT record named `_dnsauth.<your_subdomain>` with the value shown on the pane.

    :::image type="content" source="../media/how-to-add-custom-domain/validate-custom-domain.png" alt-text="Screenshot that shows the validate the custom domain pane.":::

1. Close the pane to return to the custom domains list. The provisioning state of the custom domain should change to **Provisioned**, and the validation state should change to **Approved**.

    :::image type="content" source="../media/how-to-add-custom-domain/provisioned-approved-status.png" alt-text="Screenshot that shows the Provisioning state and the Approved status.":::

For more information about domain validation states, see [Domains in Azure Front Door](../domain.md#domain-validation).

## Associate the custom domain with your Azure Front Door endpoint

After validating your custom domain, you can associate it with your Azure Front Door Standard/Premium endpoint.

1. Select the **Unassociated** link to open the **Associate endpoint and routes** pane. Select the endpoint and routes you want to associate with the domain, then select **Associate** to update your configuration.

    :::image type="content" source="../media/how-to-add-custom-domain/associate-endpoint-routes.png" alt-text="Screenshot of the Associate endpoint and routes pane.":::

    The **Endpoint association** status updates to reflect the endpoint currently associated with the custom domain.

    :::image type="content" source="../media/how-to-add-custom-domain/endpoint-association-status.png" alt-text="Screenshot of the Endpoint association link.":::

1. Select the **DNS state** link.

    :::image type="content" source="../media/how-to-add-custom-domain/dns-state-link.png" alt-text="Screenshot of the DNS state link.":::

    > [!NOTE]
    > For an Azure prevalidated domain, manually update the CNAME record from the other Azure service endpoint to the Azure Front Door endpoint in your DNS hosting service. This step is required regardless of whether the domain is hosted with Azure DNS or another DNS service. The link to update the CNAME from the **DNS state** column isn't available for this type of domain.

1. The **Add or update the CNAME record** pane appears with the necessary CNAME record information. If using Azure DNS hosted zones, you can create the CNAME records by clicking **Add** on the pane. If using another DNS provider, manually enter the CNAME record name and value as shown on the pane.

    :::image type="content" source="../media/how-to-add-custom-domain/add-update-cname-record.png" alt-text="Screenshot of the Add or update the CNAME record pane.":::

1. Once the CNAME record is created and the custom domain is associated with the Azure Front Door endpoint, traffic starts flowing.

    > [!NOTE]
    > * If HTTPS is enabled, certificate provisioning and propagation might take a few minutes as it propagates to all edge locations.
    > * If your domain CNAME is indirectly pointed to an Azure Front Door endpoint, such as through Azure Traffic Manager for multi-CDN failover, the **DNS state** column may show **CNAME/Alias record currently not detected**. Azure Front Door can't guarantee 100% detection of the CNAME record in this scenario. If you configured an Azure Front Door endpoint to Traffic Manager and still see this message, it doesn't necessarily mean there is an issue with your setup. No further action is required.

## Verify the custom domain

After validating and associating the custom domain, ensure that the custom domain is correctly referenced to your endpoint.

:::image type="content" source="../media/how-to-add-custom-domain/verify-configuration.png" alt-text="Screenshot showing the validated and associated custom domain.":::

Finally, verify that your application content is being served by using a browser.

## Next steps

* Learn how to [enable HTTPS for your custom domain](how-to-configure-https-custom-domain.md).
* Learn more about [custom domains in Azure Front Door](../domain.md).
* Learn about [end-to-end TLS with Azure Front Door](../end-to-end-tls.md).
