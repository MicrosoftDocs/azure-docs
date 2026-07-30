---
title: Onboard a Root or Apex Domain to Azure Front Door
description: Learn how to onboard a root or apex domain to an Azure Front Door Standard or Premium profile by using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 07/30/2026
ms.custom: sfi-image-nochange
---

# Onboard a root or apex domain to Azure Front Door

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

> [!IMPORTANT]
> Azure Front Door (classic) no longer supports new domain onboarding. To add an apex domain, [migrate to Azure Front Door Standard or Premium](migrate-tier.md), and then follow the Standard/Premium instructions in this article.

Apex domains are at the root of a DNS zone and don't contain subdomains. For example, `contoso.com` is an apex domain. Azure Front Door supports adding apex domains when you use Azure DNS. For more information about apex domains, see [Domains in Azure Front Door](domain.md).

You can use the Azure portal to onboard an apex domain on your Azure Front Door profile, and you can enable HTTPS on it by associating it with a TLS certificate.

## Onboard the custom domain to your Azure Front Door profile

1. Under **Settings**, select **Domains** for your Azure Front Door profile. Then select **+ Add** to add a new custom domain.

    :::image type="content" source="./media/apex-domain-onboard/add-domain.png" alt-text="Screenshot that shows  adding a new domain to an Azure Front Door profile.":::

1. On **Add a domain**, enter information about the custom domain. Choose Azure-managed DNS (recommended), or choose to use your DNS provider.

   - **Azure-managed DNS**: Select an existing DNS zone. For **Custom domain**, select **Add new**. Select **APEX domain** from the pop-up. Then select **OK** to save.

    :::image type="content" source="./media/apex-domain-onboard/add-custom-domain.png" alt-text="Screenshot that shows adding a new custom domain to an Azure Front Door profile.":::

   - **Another DNS provider**: Make sure the DNS provider supports CNAME flattening and follow the steps for [adding a custom domain](standard-premium/how-to-add-custom-domain.md#add-a-new-custom-domain).

1. Select the **Pending** validation state. A new pane appears with the DNS TXT record information needed to validate the custom domain. The TXT record is in the form of `_dnsauth.<your_subdomain>`.

   - **Azure DNS-based zone**: Select **Add** to create a new TXT record with the value that appears in the Azure DNS zone.

    - If you're using another DNS provider, manually create a new TXT record with the name `_dnsauth.<your_subdomain>` with the record value as shown on the pane.

1. Close **Validate the custom domain** and return to **Domains** for the Azure Front Door profile. You should see **Validation state** change from **Pending** to **Approved**. If not, wait up to 10 minutes for changes to appear. If your validation isn't approved, make sure your TXT record is correct and that name servers are configured correctly if you're using Azure DNS.

    :::image type="content" source="./media/apex-domain-onboard/validation-approved.png" alt-text="Screenshot that shows a new custom domain passing validation.":::

1. Select **Unassociated** from the **Endpoint association** column to add the new custom domain to an endpoint.

    :::image type="content" source="./media/apex-domain-onboard/unassociated-endpoint.png" alt-text="Screenshot that shows an unassociated custom domain added to an endpoint.":::

1. On **Associate endpoint and route**, select the endpoint and route to which you want to associate the domain. Then select **Associate**.

1.	Under the **DNS state** column, select **CNAME record is currently not detected** to add the alias record to the DNS provider.

    - **Azure DNS**: Select **Add**.

    - **A DNS provider that supports CNAME flattening**: Manually enter the alias record name.

1. After you create the alias record and associate the custom domain with the Azure Front Door endpoint, traffic starts flowing.

    :::image type="content" source="./media/apex-domain-onboard/cname-record-added.png" alt-text="Screenshot that shows the completed APEX domain configuration.":::

> [!NOTE]
> - The **DNS state** column is used for CNAME mapping check. An apex domain doesn't support a CNAME record, so the DNS state shows **CNAME record is currently not detected** even after you add the alias record to the DNS provider.
>
> - When you place a service like an Azure Web App behind Azure Front Door, you need to configure the web app with the same domain name as the root domain in Azure Front Door. You also need to configure the back-end host header with that domain name to prevent a redirect loop.
>
> - Apex domains don't have CNAME records pointing to the Azure Front Door profile. Managed certificate autorotation always fails unless domain validation is finished between rotations.
>
> - The **Microsoft.Network** resource provider is required to create alias records.

## Related content

- [Create an Azure Front Door profile](create-front-door-portal.md)
- [Configure HTTPS on your custom domain](standard-premium/how-to-configure-https-custom-domain.md)
- [Azure Front Door routing architecture](front-door-routing-architecture.md)
