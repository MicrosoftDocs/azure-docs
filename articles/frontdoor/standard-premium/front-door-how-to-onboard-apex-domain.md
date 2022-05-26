---
title: Onboard a root or apex domain to Front Door - Azure portal
description: Learn how to onboard a root or apex domain to an existing Front Door using the Azure portal.
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: how-to
ms.date: 05/26/2022
ms.author: duau

---
# Onboard a root or apex domain on your Front Door
Azure Front Door supports adding custom domain to Front Door profile. This is done by adding DNS TXT record for domain ownership validation and creating a CNAME record in your DNS configuration to route DNS queries for the custom domain to Azure Front Door endpoint. For apex domain, DNS TXT will continue to be used for domain validation. However, the DNS protocol prevents the assignment of CNAME records at the zone apex. For example, if your domain is `contoso.com`; you can create CNAME records for `somelabel.contoso.com`; but you can't create CNAME for `contoso.com` itself. Front Door doesn't expose the frontend IP address associated with your Front Door profile. So you can't map your apex domain to an IP address if your intent is to onboard it to Azure Front Door. 

This problem can be resolved by using alias records in Azure DNS. Unlike CNAME records, alias records are created at the zone apex. You can use it to point their zone apex record to a Front Door profile that has public endpoints. You can also point apex domain to the same Front Door profile that's used for any other domain within their DNS zone. For example, `contoso.com` and `www.contoso.com` can point to the same Front Door profile. 

Mapping your apex or root domain to your Front Door profile basically requires CNAME flattening or DNS chasing. A mechanism where the DNS provider recursively resolves the CNAME entry until it hits an IP address. This functionality is supported by Azure DNS for Front Door endpoints. 

> [!NOTE]
> There are other DNS providers as well that support CNAME flattening or DNS chasing, however, Azure Front Door recommends using Azure DNS for its customers for hosting their domains.

You can use the Azure portal to onboard an apex domain on your Front Door and enable HTTPS on it by associating it with a certificate for TLS termination. Apex domains are also referred as root or naked domains.

## Onboard the custom domain on your Front Door

1. Select **Domains** under settings for your Azure Front Door profile and then select + Add button.

1. The **Add a domain** page will appear where you can enter information of the custom domain. You can choose Azure-managed DNS, which is recommended or you can choose to use your own DNS provider. 

   - If you choose Azure-managed DNS, select an existing DNS zone and then click **Add new**. Under Add a new custom domain, select Apex domain and click OK.
   - If you're using another DNS provider, please make sure the DNS provider supports CNAME flattening and follow the standard How to add a custom domain - Azure Front Door | Microsoft Docs to add the domain.
1. Follow step 3 and 4 in How to add a custom domain - Azure Front Door | Microsoft Docs to complete domain ownership validation using TXT record.
1. Follow step 1 in How to add a custom domain - Azure Front Door | Microsoft Docs to associate the custom domain with your Front Door endpoint.
5.	Select the DNS state link to add the alias record to DNS provider.
    - If you use Azure DNS, click the Add button on the page.
    - If you use other DNS providers that support CNAME flattening, you must manually enter the alias record name.
1. Once alias record gets created and the custom domain is associated to the Azure Front Door endpoint, traffic will start flowing.
> [!NOTE]
> **DNS state** column is meant for CNAME mapping check. Because apex domain doesn’t support CNAME record, the DNS state will show ‘CNAME record is currently not detected’ even after you added the alias record to the DNS provider.

## Enable HTTPS on your custom domain
You can follow Configure HTTPS for your custom domain - Azure Front Door | Microsoft Docs to enable HTTPS for apex domain.

## Managed certificate renewal for apex domain
Front Door managed certificate automatically rotate certificate only when the domain is CNAME pointed to Front Door endpoint. Since apex domain doesn’t have a CNAME record pointing to Front Door endpoint, the auto-rotation for managed certificate will fail until domain ownership is re-validated. The Validation column will become ‘Pending-revalidation’ 45 days before the managed certificate expires. Please click on the ‘Pending-revalidation’ link and click the Regenerate button to regenerate the TXT token. Then add the TXT token to the DNS provider. 

## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
