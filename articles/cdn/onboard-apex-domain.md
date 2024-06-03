---
title: Onboard a root or apex domain to an existing Azure CDN endpoint - Azure portal
description: Learn how to onboard a root or apex domain to an existing Azure CDN endpoint using the Azure portal.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: how-to
ms.date: 03/20/2024
ms.author: duau
---

# Onboard a root or apex domain to an existing Azure CDN endpoint

Azure CDN uses CNAME records to validate domain ownership for onboarding of custom domains. CDN doesn't expose the frontend IP address associated with your CDN profile. You can't map your apex domain to an IP address if your intent is to onboard it to Azure CDN.

The DNS protocol prevents the assignment of CNAME records at the zone apex. For example, if your domain is `contoso.com`; you can create CNAME records for `somelabel.contoso.com`; but you can't create a CNAME for `contoso.com` itself. This restriction presents a problem for application owners who have load-balanced applications behind Azure CDN. Since using a CDN profile requires creation of a CNAME record, it isn't possible to point at the CDN profile from the zone apex.

This problem can be resolved by using alias records in Azure DNS. Unlike CNAME records, alias records are created at the zone apex. Application owners can use it to point their zone apex record to a CDN profile that has public endpoints. Application owners point to the same CDN profile that's used for any other domain within their DNS zone. For example, `contoso.com` and `www.contoso.com` can point to the same CDN profile.

Mapping your apex or root domain to your CDN profile requires CNAME flattening or DNS chasing. A mechanism where the DNS provider recursively resolves the CNAME entry until it hits an IP address. This functionality is supported with Azure DNS for CDN endpoints.

> [!NOTE]
> There are other DNS providers as well that support CNAME flattening or DNS chasing, however, Azure CDN recommends using Azure DNS for its customers for hosting their domains.

You can use the Azure portal to onboard an apex domain on your CDN and enable HTTPS on it by associating it with a certificate for TLS termination. Apex domains are also referred as root or naked domains.

> [!IMPORTANT]
> CDN-managed certificates are not available for root or apex domains. If your Azure CDN custom domain is a root or apex domain, you must use the *Bring Your Own Certificate (BYOC)* feature.
>

## Create an alias record for zone apex

1. Open **Azure DNS** configuration for the domain to be onboarded.

2. Select **+ Record set**.

3. In **Add record set**, enter or select the following information:

    | Setting | Value |
    | ------- | ------|
    | Name | Enter **@**. |
    | Type | Select **A**. |
    | Alias record set | Select **Yes**. |
    | Alias type | Select **Azure resource**. |
    | Choose a subscription | Select your subscription. |
    | Azure resource | Select your CDN endpoint. |

4. Enter your value for **TTL**.

5. Select **OK** to submit your changes.

    :::image type="content" source="./media/onboard-apex-domain/cdn-apex-alias-record.png" alt-text="Alias record for zone apex":::

6. The above step creates a zone apex record pointing to your CDN resource. A CNAME record-mapping **cdnverify** is used for onboarding the domain on your CDN profile.
    1. Example, **cdnverify.contoso.com**.

## Onboard the custom domain on your CDN

After you've registered your custom domain, you can then add it to your CDN endpoint.

1. Sign in to the [Azure portal](https://portal.azure.com/) and browse to the CDN profile containing the endpoint that you want to map to a custom domain.

2. On the **CDN profile** page, select the CDN endpoint to associate with the custom domain.

    :::image type="content" source="media/onboard-apex-domain/cdn-endpoint-selection.png" alt-text="CDN endpoint selection" border="true":::

3. Select **+ Custom domain**.

   :::image type="content" source="media/onboard-apex-domain/cdn-custom-domain-button.png" alt-text="Add custom domain button" border="true":::

4. In **Add a custom domain**, **Endpoint hostname**, is pre-filled and is derived from your CDN endpoint URL: **\<endpoint-hostname>**.azureedge.net. It can't be changed.

5. For **Custom hostname**, enter your custom root or apex domain to use as the source domain of your CNAME record.
    1. For example, **contoso.com**. **Don't use the cdnverify subdomain name**.

    :::image type="content" source="media/onboard-apex-domain/cdn-add-custom-domain.png" alt-text="Add custom domain" border="true":::

6. Select **Add**.

   Azure verifies that the CNAME record exists for the custom domain name you entered. If the CNAME is correct, your custom domain is validated.

   It can take some time for the new custom domain settings to propagate to all CDN edge nodes:
    - For **Azure CDN Standard from Microsoft** profiles, propagation usually completes in 10 minutes.
    - For **Azure CDN Standard from Edgio** and **Azure CDN Premium from Edgio** profiles, propagation usually completes in 10 minutes.

## Enable HTTPS on your custom domain

For more information on enabling HTTPS on your custom domain for Azure CDN, see [Tutorial: Configure HTTPS on an Azure CDN custom domain](cdn-custom-ssl.md)

## Next steps

- Learn how to [create a CDN endpoint](cdn-create-new-endpoint.md).
