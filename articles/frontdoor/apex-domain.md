---
title: 'Apex domains in Azure Front Door'
description: Learn about apex domains when using Azure Front Door.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/07/2023
ms.author: jodowns
---

# Apex domains in Azure Front Door

Apex domains, also called *root domains* or *naked domains*, are at the root of a DNS zone and don't contain subdomains. For example, `contoso.com` is an apex domain.

Azure Front Door supports apex domains, but requires special considerations. This article describes how apex domains work in Azure Front Door.

To add a root or apex domain to your Azure Front Door profile, see [Onboard a root or apex domain on your Azure Front Door profile](front-door-how-to-onboard-apex-domain.md).

## DNS CNAME flattening

The DNS protocol prevents the assignment of CNAME records at the zone apex. For example, if your domain is `contoso.com`, you can create a CNAME record for `myapplication.contoso.com`, but you can't create a CNAME record for `contoso.com` itself.

Azure Front Door doesn't expose the frontend public IP address associated with your Azure Front Door endpoint. So, you can't map an apex domain to an Azure Front Door IP address.

> [!WARNING]
> Don't create an A record with the public IP address of your Azure Front Door endpoint. Your Azure Front Door endpoint's public IP address might change and we don't provide any guarantees that it will remain the same.

However, this problem can be resolved by using alias records in Azure DNS. Unlike CNAME records, alias records are created at the zone apex. You can point a zone apex record to an Azure Front Door profile that has public endpoints. Multiple application owners can point to the same Azure Front Door endpoint that's used for any other domain within their DNS zone. For example, `contoso.com` and `www.contoso.com` can point to the same Azure Front Door endpoint.

Mapping your apex or root domain to your Azure Front Door profile uses *CNAME flattening*, sometimes called *DNS chasing*. CNAME flattening is where a DNS provider recursively resolves CNAME entries until it resolves an IP address. This functionality is supported by Azure DNS for Azure Front Door endpoints.

> [!NOTE]
> Other DNS providers support CNAME flattening or DNS chasing. However, Azure Front Door recommends using Azure DNS for hosting your apex domains.

## TXT record validation

To validate a domain, you need to create a DNS TXT record. The name of the TXT record must be of the form `_dnsauth.{subdomain}`. Azure Front Door provides a unique value for your TXT record when you start to add the domain to Azure Front Door.

For example, suppose you want to use the apex domain `contoso.com` with Azure Front Door. First, you should add the domain to your Azure Front Door profile, and note the TXT record value that you need to use. Then, you should configure a DNS record with the following properties:

| Property | Value |
|-|-|
| Record name | `_dnsauth` |
| Record value | *use the value provided by Azure Front Door* |
| Time to live (TTL) | 1 hour |

## Azure Front Door-managed TLS certificate rotation

When you use an Azure Front Door-managed certificate, Azure Front Door attempts to automatically rotate (renew) the certificate. Before it does so, Azure Front Door checks whether the DNS CNAME record is still pointed to the Azure Front Door endpoint. Apex domains don't have a CNAME record pointing to an Azure Front Door endpoint, so the auto-rotation for managed certificate fails until the domain ownership is revalidated.

Select the **Pending revalidation** link and then select the **Regenerate** button to regenerate the TXT token. After that, add the TXT token to the DNS provider settings.

> [!NOTE]
> Azure Front Door's DNS TXT records for domain name validation need to be updated when the certificate is renewed. When you see the *Pending revalidation* domain validation state, ensure that you generate a new TXT record and update your DNS server.

## Next steps

To add a root or apex domain to your Azure Front Door profile, see [Onboard a root or apex domain on your Azure Front Door profile](front-door-how-to-onboard-apex-domain.md).
