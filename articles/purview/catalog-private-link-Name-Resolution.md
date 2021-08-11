---
title: Configure DNS Name Resolution for private endpoints
description: This article describes an overview of how you can use a private end point for your Purview account
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: Configure DNS Name Resolution for private endpoints
ms.topic: how-to
ms.date: 08/10/2021
# Customer intent: As a Purview admin, I want to set up private endpoints for my Purview account, for secure access.
---

# Configure DNS Name Resolution for private endpoints

## DNS Name Resolution Conceptual overview
Correct name resolution is a critical requirement when setting up private endpoints for your Azure Purview accounts. 

You may require enabling internal name resolution in your DNS settings to resolve the private endpoint IP address to the fully qualified domain name (FQDN) among Azure Purview account, self-hosted integration runtime, data sources and your management PC, depending scenarios you are deploying.

The following example shows Azure Purview DNS name resolution from outside the virtual network or when an Azure private endpoint isn not configured.

   :::image type="content" source="media/catalog-private-link/purview-name-resolution-external.png" alt-text="Screenshot that shows Azure Purview name resolution from outside CorpNet.":::

The following example shows Azure Purview DNS name resolution from inside the virtual network.

   :::image type="content" source="media/catalog-private-link/purview-name-resolution-private-link.png" alt-text="Screenshot that shows Purview name resolution from inside CorpNet.":::

## Option 1 - Deploy Azure Private DNS Zones  

To enable internal name resolution, you can deploy the required Azure DNS Zones inside your Azure subscription. 

When you create a private endpoint, the DNS CNAME resource record for Azure Purview is automatically updated to an alias in a subdomain with the prefix `privatelink`. 
By default, we also create a [private DNS zone](../dns/private-dns-overview.md) that corresponds to the `privatelink` subdomain, with the DNS A resource records for the private endpoints.

Private endpoint  |Private endpoint associated to  |DNS Zone  |A Record )(example) |
|---------|---------|---------|---------|
|Account     |Azure Purview         |`privatelink.purview.azure.com`         |PurviewA         |
|Portal     |Azure Purview account          |`privatelink.purview.azure.com`        |Web         |
|Ingestion     |Purview managed Storage Account - Blob          |`privatelink.blob.core.windows.net`          |scaneastusabcd1234         |
|Ingestion   |Purview managed Storage Account - Queue         |`privatelink.queue.core.windows.net`         |scaneastusabcd1234         |
|Ingestion     |Purview managed Storage Account - Event Hub         |`privatelink.servicebus.windows.net`         |atlas-12345678-1234-1234-abcd-123456789abc         |

   :::image type="content" source="media/catalog-private-link/purview-name-resolution-diagram.png" alt-text="Diagram that shows Azure Purview name resolution"lightbox="media/catalog-private-link/purview-name-resolution-diagram.png":::


When you resolve the Azure Purview endpoint URL from outside the virtual network with the private endpoint, it resolves to the public endpoint of Azure Purview. When resolved from the virtual network hosting the private endpoint, the Azure Purview endpoint URL resolves to the private endpoint's IP address.

As an example, if an Azure Purview account name is 'PurviewA', when it is resolved from outside the virtual network that hosts the private endpoint, it will be:

| Name | Type | Value |
| ---------- | -------- | --------------- |
| `PurviewA.purview.azure.com` | CNAME | `PurviewA.privatelink.purview.azure.com` |
| `PurviewA.privatelink.purview.azure.com` | CNAME | \<Purview public endpoint\> |
| \<Purview public endpoint\> | A | \<Purview public IP address\> |
| `Web.purview.azure.com` | CNAME | \<Purview public endpoint\> |

The DNS resource records for PurviewA, when resolved in the virtual network hosting the private endpoint, will be:

| Name | Type | Value |
| ---------- | -------- | --------------- |
| `PurviewA.purview.azure.com` | CNAME | `PurviewA.privatelink.purview.azure.com` |
| `PurviewA.privatelink.purview.azure.com` | A | \<private endpoint IP address\> |
| `Web.purview.azure.com` | CNAME | \<private endpoint IP address\> |

<br>

## Option 2 - Use your own DNS Servers

If you do not use DNS forwarders and instead you manage A records directly in your on-premises DNS servers to resolve the endpoints through their private IP addresses, you might need to create additional A records in your DNS servers.

| Name | Type | Value |
| ---------- | -------- | --------------- |
| `PurviewA.Purview.azure.com` | A | \<account private endpoint IP address of Azure Purview> |
| `PurviewA.scan.Purview.azure.com` | A | \<account private endpoint IP address of Azure Purview> |
| `PurviewA.catalog.Purview.azure.com` | A | \<account private endpoint IP address of Azure Purview\> |
| `PurviewA.proxy.purview.azure.com` | A | \<account private endpoint IP address of Azure Purview\> |
| `PurviewA.guardian.purview.azure.com` | A | \<account private endpoint IP address of Azure Purview\> |
| `PurviewA.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.manifest.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.cdn.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.hub.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.catalog.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.cseo.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.datascan.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.datashare.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.datasource.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.policy.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |
| `PurviewA.sensitivity.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Azure Purview\> |

<br> 
If you're using a custom DNS server on your network, clients must be able to resolve the FQDN for the Azure Purview endpoint to the private endpoint IP address. Configure your DNS server to delegate your Private Link subdomain to the private DNS zone for the virtual network. Or, configure the A records for `PurviewA.privatelink.purview.azure.com` with the private endpoint IP address.

For more information, see [Azure private endpoint DNS configuration](../private-link/private-endpoint-dns.md).

## Validate and test name resolution

1. If you are using Azure Private DNS Zones, make sure the following DNS Zones are created on your Azure Subscription. Make sure all the required A records are created inside each Zone:

   |Private endpoint  |Private endpoint associated to  |DNS Zone  |A Record )(example) |
   |---------|---------|---------|---------|
   |Account     |Azure Purview         |`privatelink.purview.azure.com`         |PurviewA         |
   |Portal     |Azure Purview account          |`privatelink.purview.azure.com`        |Web         |
   |Ingestion     |Purview managed Storage Account - Blob          |`privatelink.blob.core.windows.net`          |scaneastusabcd1234         |
   |Ingestion   |Purview managed Storage Account - Queue         |`privatelink.queue.core.windows.net`         |scaneastusabcd1234         |
   |Ingestion     |Purview managed Storage Account - Event Hub         |`privatelink.servicebus.windows.net`         |atlas-12345678-1234-1234-abcd-123456789abc         |

2.  Create [Virtual network links](../dns/private-dns-virtual-network-links.md) to your Azure Private DNS Zones in your Azure Virtual Networks to allow internal name resolution.
   
3. From your management PC and Self-Hosted integration runtime, test name resolution and connectivity to your Azure Purview account using tools such as Nslookup.exe and PowerShell.

To test name resolution you need to resolve the following FQDNs through their private IP addresses:
(Instead of PurviewA, scaneastusabcd1234 or atlas-12345678-1234-1234-abcd-123456789abc, use the hostname associated with your purview account name and managed resources names)

- PurviewA.purview.azure.com
- web.purview.azure.com
- scaneastusabcd1234.blob.core.windows.net
- scaneastusabcd1234.queue.core.windows.net
- atlas-12345678-1234-1234-abcd-123456789abc.servicebus.windows.net

## Validate and test name resolution

To test network connectivity, from self-hosted integration runtime VM you can launch PowerShell console and test connectivity using `Test-NetConnection`. You must resolve each endpoint by their private endpoint and obtain TcpTestSucceeded as True. (Instead of PurviewA, scaneastusabcd1234 or atlas-12345678-1234-1234-abcd-123456789abc, use the hostname associated with your purview account name and managed resources names)

Test-NetConnection -ComputerName PurviewA.purview.azure.com -port 443
Test-NetConnection -ComputerName web.purview.azure.com -port 443
Test-NetConnection -ComputerName scaneastusabcd1234.blob.core.windows.net -port 443
Test-NetConnection -ComputerName scaneastusabcd1234.queue.core.windows.net -port 443
Test-NetConnection -ComputerName atlas-12345678-1234-1234-abcd-123456789abc.servicebus.windows.net -port 443 

## Next steps

- [Setup Self-Hosted Integration Runtime](/manage-integration-runtimes.md)
- [Troubleshooting private endpoint configuration for your Azure Purview account](catalog-private-link-troubleshooting.md)

