---
title: Onboard a root or apex domain to Azure Front Door
description: Learn how to onboard a root or apex domain to an existing Front Door using the Azure portal.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 02/07/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Onboard a root or apex domain to Azure Front Door

::: zone pivot="front-door-classic"

Azure Front Door uses CNAME records to validate domain ownership for the onboarding of custom domains. Azure Front Door doesn't expose the frontend IP address associated with your Front Door profile. So you can't map your apex domain to an IP address if your intent is to onboard it to Azure Front Door.

The DNS protocol prevents the assignment of CNAME records at the zone apex. For example, if your domain is `contoso.com`; you can create CNAME records for `somelabel.contoso.com`; but you can't create CNAME for `contoso.com` itself. This restriction presents a problem for application owners who have load-balanced applications behind Azure Front Door. Since using a Front Door profile requires creation of a CNAME record, it isn't possible to point at the Front Door profile from the zone apex.

This problem can be resolved by using alias records in Azure DNS. Unlike CNAME records, alias records are created at the zone apex. Application owners can use it to point their zone apex record to a Front Door profile that has public endpoints. Application owners point to the same Front Door profile that's used for any other domain within their DNS zone. For example, `contoso.com` and `www.contoso.com` can point to the same Front Door profile. 

Mapping your apex or root domain to your Front Door profile requires *CNAME flattening* or *DNS chasing*, which is where the DNS provider recursively resolves CNAME entries until it resolves an IP address. This functionality is supported by Azure DNS for Azure Front Door endpoints.

> [!NOTE]
> There are other DNS providers as well that support CNAME flattening or DNS chasing. However, Azure Front Door recommends using Azure DNS for its customers for hosting their domains.

You can use the Azure portal to onboard an apex domain on your Azure Front Door and enable HTTPS on it by associating it with a TLS certificate. Apex domains are also referred as *root* or *naked* domains.

::: zone-end

::: zone pivot="front-door-standard-premium"

Apex domains are at the root of a DNS zone and don't contain subdomains. For example, `contoso.com` is an apex domain. Azure Front Door supports adding apex domains when you use Azure DNS. For more information about apex domains, see [Domains in Azure Front Door](domain.md).

You can use the Azure portal to onboard an apex domain on your Azure Front Door profile, and you can enable HTTPS on it by associating it with a TLS certificate.

::: zone-end

::: zone pivot="front-door-standard-premium"

## Onboard the custom domain to your Azure Front Door profile

1. Select **Domains** from under *Settings* on the left side pane for your Azure Front Door profile and then select **+ Add** to add a new custom domain.

    :::image type="content" source="./media/front-door-apex-domain/add-domain.png" alt-text="Screenshot of adding a new domain to Front Door profile.":::

1. On **Add a domain** page, you'll enter information about the custom domain. You can choose Azure-managed DNS (recommended) or you can choose to use your DNS provider. 

   - **Azure-managed DNS** - select an existing DNS zone and for *Custom domain*, select **Add new**. Select **APEX domain** from the pop-up and then select **OK** to save.

      :::image type="content" source="./media/front-door-apex-domain/add-custom-domain.png" alt-text="Screenshot of adding a new custom domain to Front Door profile.":::

   - **Another DNS provider** - make sure the DNS provider supports CNAME flattening and follow the steps for [adding a custom domain](standard-premium/how-to-add-custom-domain.md#add-a-new-custom-domain).

1. Select the **Pending** validation state. A new page will appear with DNS TXT record information needed to validate the custom domain. The TXT record is in the form of `_dnsauth.<your_subdomain>`. 

   :::image type="content" source="./media/front-door-apex-domain/pending-validation.png" alt-text="Screenshot of custom domain pending validation.":::

   - **Azure DNS-based zone** - select the **Add** button and a new TXT record with the displayed record value will be created in the Azure DNS zone.

      :::image type="content" source="./media/front-door-apex-domain/validate-custom-domain.png" alt-text="Screenshot of validate a new custom domain.":::

    - If you're using another DNS provider, manually create a new TXT record of name `_dnsauth.<your_subdomain>` with the record value as shown on the page.

1. Close the *Validate the custom domain* page and return to the *Domains* page for the Front Door profile. You should see the *Validation state* change from **Pending** to **Approved**. If not, wait up to 10 minutes for changes to reflect. If your validation doesn't get approved, make sure your TXT record is correct and name servers are configured correctly if you're using Azure DNS.

    :::image type="content" source="./media/front-door-apex-domain/validation-approved.png" alt-text="Screenshot of new custom domain passing validation.":::

1. Select **Unassociated** from the *Endpoint association* column, to add the new custom domain to an endpoint.

    :::image type="content" source="./media/front-door-apex-domain/unassociated-endpoint.png" alt-text="Screenshot of unassociated custom domain to an endpoint.":::

1. On the *Associate endpoint and route* page, select the **Endpoint** and **Route** you would like to associate the domain to. Then select **Associate** to complete this step.

    :::image type="content" source="./media/front-door-apex-domain/associate-endpoint.png" alt-text="Screenshot of associated endpoint and route page for a domain.":::

1.	Under the *DNS state* column, select the **CNAME record is currently not detected** to add the alias record to DNS provider.

    - **Azure DNS** - select the **Add** button on the page.

       :::image type="content" source="./media/front-door-apex-domain/cname-record.png" alt-text="Screenshot of add or update CNAME record page.":::

    - **A DNS provider that supports CNAME flattening** - you must manually enter the alias record name.
    
1. Once the alias record gets created and the custom domain is associated to the Azure Front Door endpoint, traffic will start flowing.

   :::image type="content" source="./media/front-door-apex-domain/cname-record-added.png" alt-text="Screenshot of completed APEX domain configuration.":::

> [!NOTE]
> * The **DNS state** column is used for CNAME mapping check. Since an apex domain doesn’t support a CNAME record, the DNS state will show 'CNAME record is currently not detected' even after you add the alias record to the DNS provider.
> * When placing service like an Azure Web App behind Azure Front Door, you need to configure with the web app with the same domain name as the root domain in Front Door. You also need to configure the backend host header with that domain name to prevent a redirect loop.
> * Apex domains don't have CNAME records pointing to the Azure Front Door profile, therefore managed certificate autorotation will always fail unless domain validation is completed between rotations.  

## Enable HTTPS on your custom domain

Follow the guidance for [configuring HTTPS for your custom domain](standard-premium/how-to-configure-https-custom-domain.md) to enable HTTPS for your apex domain.

::: zone-end

::: zone pivot="front-door-classic"

## Create an alias record for zone apex

1. Open **Azure DNS** configuration for the domain to be onboarded.

1. Create or edit the record for zone apex.

1. Select the record **type** as *A* record and then select *Yes* for **Alias record set**. **Alias type** should be set to *Azure resource*.

1. Select the Azure subscription where your Front Door profile gets hosted. Then select the Front Door resource from the **Azure resource** dropdown.

1. Select **OK** to submit your changes.

    :::image type="content" source="./media/front-door-apex-domain/front-door-apex-alias-record.png" alt-text="Alias record for zone apex":::

1. The above step will create a zone apex record pointing to your Front Door resource and also a CNAME record mapping 'afdverify' (example - `afdverify.contosonews.com`) to  that will be used for onboarding the domain on your Front Door profile.

## Onboard the custom domain on your Front Door

1. On the Front Door designer tab, select on '+' icon on the Frontend hosts section to add a new custom domain.

1. Enter the root or apex domain name in the custom host name field, example `contosonews.com`.

1. Once the CNAME mapping from the domain to your Front Door is validated, select on **Add** to add the custom domain.

1. Select **Save** to submit the changes.

   :::image type="content" source="./media/front-door-apex-domain/front-door-onboard-apex-domain.png" alt-text="Custom domain menu":::

## Enable HTTPS on your custom domain

1. Select the custom domain that was added and under the section **Custom domain HTTPS**, change the status to **Enabled**.

1. Select the  **Certificate management type** to *'Use my own certificate'*.

   :::image type="content" source="./media/front-door-apex-domain/front-door-onboard-apex-custom-domain.png" alt-text="Custom domain HTTPS settings":::    

   > [!WARNING]
   > Front Door managed certificate management type is not currently supported for apex or root domains. The only option available for enabling HTTPS on an apex or root domain for Front Door is using your own custom TLS/SSL certificate hosted on Azure Key Vault.

1. Ensure that you have setup the right permissions for Front Door to access your key Vault as noted in the UI, before proceeding to the next step.

1. Choose a **Key Vault account** from your current subscription and then select the appropriate **Secret** and **Secret version** to map to the right certificate.

1. Select **Update** to save the selection and then Select **Save**.

1. Select **Refresh** after a couple of minutes and then select the custom domain again to see the progress of certificate provisioning. 

> [!WARNING]
> Ensure that you have created appropriate routing rules for your apex domain or added the domain to existing routing rules.

::: zone-end

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
