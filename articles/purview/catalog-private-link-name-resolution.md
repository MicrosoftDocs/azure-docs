---
title: Configure DNS Name Resolution for private endpoints
description: This article describes an overview of how you can use a private end point for your Microsoft Purview account
author: viseshag
ms.author: viseshag
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: how-to
ms.date: 03/29/2023
# Customer intent: As a Microsoft Purview admin, I want to set up private endpoints for my Microsoft Purview account, for secure access.
---

# Configure and verify DNS Name Resolution for Microsoft Purview private endpoints

## Conceptual overview
Accurate name resolution is a critical requirement when setting up private endpoints for your Microsoft Purview accounts. 

You may require enabling internal name resolution in your DNS settings to resolve the private endpoint IP addresses to the fully qualified domain name (FQDN) from data sources and your management machine to Microsoft Purview account and self-hosted integration runtime, depending on scenarios that you are deploying.

The following example shows Microsoft Purview DNS name resolution from outside the virtual network or when an Azure private endpoint is not configured.

   :::image type="content" source="media/catalog-private-link/purview-name-resolution-external.png" alt-text="Screenshot that shows Microsoft Purview name resolution from outside CorpNet.":::

The following example shows Microsoft Purview DNS name resolution from inside the virtual network.

   :::image type="content" source="media/catalog-private-link/purview-name-resolution-private-link.png" alt-text="Screenshot that shows Microsoft Purview name resolution from inside CorpNet.":::

## Deployment options 

Use any of the following options to set up internal name resolution when using private endpoints for your Microsoft Purview account:

- [Deploy new Azure Private DNS Zones](#option-1---deploy-new-azure-private-dns-zones) in your Azure environment part of private endpoint deployment. (Default option)
- [Use existing Azure Private DNS Zones](#option-2---use-existing-azure-private-dns-zones). Use this option if you using a private endpoint in a hub-and-spoke model from a different subscription or even within the same subscription. 
- [Use your own DNS Servers](#option-3---use-your-own-dns-servers) if you do not use DNS forwarders and instead you manage A records directly in your on-premises DNS servers.

## Option 1 - Deploy new Azure Private DNS Zones  

### Deploy new Azure Private DNS Zones
To enable internal name resolution, you can deploy the required Azure DNS Zones inside your Azure subscription where Microsoft Purview account is deployed. 

   :::image type="content" source="media/catalog-private-link/purview-pe-dns-zones.png" alt-text="Screenshot that shows DNS Zones.":::

When you create ingestion, portal and account private endpoints, the DNS CNAME resource records for Microsoft Purview is automatically updated to an alias in few subdomains with the prefix `privatelink`:

- By default, during the deployment of _account_ private endpoint for your Microsoft Purview account, we also create a [private DNS zone](../dns/private-dns-overview.md) that corresponds to the `privatelink` subdomain for Microsoft Purview as `privatelink.purview.azure.com` including DNS A resource records for the private endpoints.

- During the deployment of _portal_ private endpoint for your Microsoft Purview account, we also create a new private DNS zone that corresponds to the `privatelink` subdomain for Microsoft Purview as `privatelink.purviewstudio.azure.com` including DNS A resource records for _Web_.

- If you enable ingestion private endpoints, additional DNS zones are required for managed or configured resources. 

The following table shows an example of Azure Private DNS zones and DNS A Records that are deployed as part of configuration of private endpoint for a Microsoft Purview account if you enable _Private DNS integration_ during the deployment: 

Private endpoint  |Private endpoint associated to  |DNS Zone (new)  |A Record (example) |
|---------|---------|---------|---------|
|Account     |Microsoft Purview         |`privatelink.purview.azure.com`         |Contoso-Purview         |
|Portal     |Microsoft Purview          |`privatelink.purviewstudio.azure.com`        |Web         |
|Ingestion     |Microsoft Purview managed Storage Account - Blob          |`privatelink.blob.core.windows.net`          |scaneastusabcd1234         |
|Ingestion   |Microsoft Purview managed Storage Account - Queue         |`privatelink.queue.core.windows.net`         |scaneastusabcd1234         |
|Ingestion     |Microsoft Purview managed Storage Account - Event Hub         |`privatelink.servicebus.windows.net`         |atlas-12345678-1234-1234-abcd-123456789abc         |

### Validate virtual network links on Azure Private DNS Zones

Once the private endpoint deployment is completed, make sure there is a [Virtual network link](../dns/private-dns-virtual-network-links.md) on all corresponding Azure Private DNS zones to Azure virtual network where private endpoint was deployed.

   :::image type="content" source="media/catalog-private-link/purview-name-resolution-link.png" alt-text="Screenshot that shows virtual network links on DNS Zone.":::

For more information, see [Azure private endpoint DNS configuration](../private-link/private-endpoint-dns.md).

### Verify internal name resolution

When you resolve the Microsoft Purview endpoint URL from outside the virtual network with the private endpoint, it resolves to the public endpoint of Microsoft Purview. When resolved from the virtual network hosting the private endpoint, the Microsoft Purview endpoint URL resolves to the private endpoint's IP address.

As an example, if a Microsoft Purview account name is 'Contoso-Purview', when it is resolved from outside the virtual network that hosts the private endpoint, it will be:

| Name | Type | Value |
| ---------- | -------- | --------------- |
| `Contoso-Purview.purview.azure.com` | CNAME | `Contoso-Purview.privatelink.purview.azure.com` |
| `Contoso-Purview.privatelink.purview.azure.com` | CNAME | \<Microsoft Purview public endpoint\> |
| \<Microsoft Purview public endpoint\> | A | \<Microsoft Purview public IP address\> |
| `Web.purview.azure.com` | CNAME | \<Microsoft Purview governance portal public endpoint\> |

The DNS resource records for Contoso-Purview, when resolved in the virtual network hosting the private endpoint, will be:

| Name | Type | Value |
| ---------- | -------- | --------------- |
| `Contoso-Purview.purview.azure.com` | CNAME | `Contoso-Purview.privatelink.purview.azure.com` |
| `Contoso-Purview.privatelink.purview.azure.com` | A | \<Microsoft Purview account private endpoint IP address\> |
| `Web.purview.azure.com` | CNAME | \<Microsoft Purview portal private endpoint IP address\> |

## Option 2 - Use existing Azure Private DNS Zones

### Use existing Azure Private DNS Zones

During the deployment of Microsft Purview private endpoints, you can choose _Private DNS integration_ using existing Azure Private DNS zones. This is common case for organizations where private endpoint is used for other services in Azure. In this case, during the deployment of private endpoints, make sure you select the existing DNS zones instead of creating new ones. 

This scenario also applies if your organization uses a central or hub subscription for all Azure Private DNS Zones.

The following list shows the required Azure DNS zones and A records for Microsoft Purview private endpoints:

> [!NOTE]
> Update all names with `Contoso-Purview`,`scaneastusabcd1234` and `atlas-12345678-1234-1234-abcd-123456789abc` with corresponding Azure resources name in your environment. For example, instead of `scaneastusabcd1234` use the name of your Microsoft Purview managed storage account.

Private endpoint  |Private endpoint associated to  |DNS Zone (existing)  |A Record (example) |
|---------|---------|---------|---------|
|Account     |Microsoft Purview         |`privatelink.purview.azure.com`         |Contoso-Purview         |
|Portal     |Microsoft Purview          |`privatelink.purviewstudio.azure.com`        |Web         |
|Ingestion     |Microsoft Purview managed Storage Account - Blob          |`privatelink.blob.core.windows.net`          |scaneastusabcd1234         |
|Ingestion   |Microsoft Purview managed Storage Account - Queue         |`privatelink.queue.core.windows.net`         |scaneastusabcd1234         |
|Ingestion     |Microsoft Purview managed Storage Account - Event Hub         |`privatelink.servicebus.windows.net`         |atlas-12345678-1234-1234-abcd-123456789abc         |

   :::image type="content" source="media/catalog-private-link/purview-name-resolution-diagram.png" alt-text="Diagram that shows Microsoft Purview name resolution"lightbox="media/catalog-private-link/purview-name-resolution-diagram.png":::

For more information, see [Virtual network workloads without custom DNS server](../private-link/private-endpoint-dns.md#virtual-network-workloads-without-custom-dns-server) and [On-premises workloads using a DNS forwarder](../private-link/private-endpoint-dns.md#on-premises-workloads-using-a-dns-forwarder) scenarios in [Azure Private Endpoint DNS configuration](../private-link/private-endpoint-dns.md).

### Verify virtual network links on Azure Private DNS Zones

Once the private endpoint deployment is completed, make sure there is a [Virtual network link](../dns/private-dns-virtual-network-links.md) on all corresponding Azure Private DNS zones to Azure virtual network where private endpoint was deployed.

   :::image type="content" source="media/catalog-private-link/purview-name-resolution-link.png" alt-text="Screenshot that shows virtual network links on DNS Zone.":::

For more information, see [Azure private endpoint DNS configuration](../private-link/private-endpoint-dns.md).

### Configure DNS Forwarders if custom DNS is used

Additionally it is required to validate your DNS configurations on Azure virtual network where self-hosted integration runtime VM or management PC is located. 

   :::image type="content" source="media/catalog-private-link/purview-pe-custom-dns.png" alt-text="Diagram that shows Azure virtual network custom DNS":::

- If it is configured to _Default_, no further action is required in this step.

-  If custom DNS server is used, you should add corresponding DNS forwarders inside your DNS servers for the following zones:
  
   -  Purview.azure.com
   -  Blob.core.windows.net
   -  Queue.core.windows.net
   -  Servicebus.windows.net

### Verify internal name resolution

When you resolve the Microsoft Purview endpoint URL from outside the virtual network with the private endpoint, it resolves to the public endpoint of Microsoft Purview. When resolved from the virtual network hosting the private endpoint, the Microsoft Purview endpoint URL resolves to the private endpoint's IP address.

As an example, if a Microsoft Purview account name is 'Contoso-Purview', when it is resolved from outside the virtual network that hosts the private endpoint, it will be:

| Name | Type | Value |
| ---------- | -------- | --------------- |
| `Contoso-Purview.purview.azure.com` | CNAME | `Contoso-Purview.privatelink.purview.azure.com` |
| `Contoso-Purview.privatelink.purview.azure.com` | CNAME | \<Microsoft Purview public endpoint\> |
| \<Microsoft Purview public endpoint\> | A | \<Microsoft Purview public IP address\> |
| `Web.purview.azure.com` | CNAME | \<Microsoft Purview governance portal public endpoint\> |

The DNS resource records for Contoso-Purview, when resolved in the virtual network hosting the private endpoint, will be:

| Name | Type | Value |
| ---------- | -------- | --------------- |
| `Contoso-Purview.purview.azure.com` | CNAME | `Contoso-Purview.privatelink.purview.azure.com` |
| `Contoso-Purview.privatelink.purview.azure.com` | A | \<Microsoft Purview account private endpoint IP address\> |
| `Web.purview.azure.com` | CNAME | \<Microsoft Purview portal private endpoint IP address\> |

## Option 3 - Use your own DNS Servers

If you do not use DNS forwarders and instead you manage A records directly in your on-premises DNS servers to resolve the endpoints through their private IP addresses, you might need to create the following A records in your DNS servers.

> [!NOTE]
> Update all names with `Contoso-Purview`,`scaneastusabcd1234` and `atlas-12345678-1234-1234-abcd-123456789abc` with corresponding Azure resources name in your environment. For example, instead of `scaneastusabcd1234` use the name of your Microsoft Purview managed storage account.

| Name | Type | Value |
| ---------- | -------- | --------------- |
| `web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview> |
| `scaneastusabcd1234.blob.core.windows.net` | A | \<blob-ingestion private endpoint IP address of Microsoft Purview> |
| `scaneastusabcd1234.queue.core.windows.net` | A | \<queue-ingestion private endpoint IP address of Microsoft Purview> |
| `atlas-12345678-1234-1234-abcd-123456789abc.servicebus.windows.net`| A | \<namespace-ingestion private endpoint IP address of Microsoft Purview> |
| `Contoso-Purview.Purview.azure.com` | A | \<account private endpoint IP address of Microsoft Purview> |
| `Contoso-Purview.scan.Purview.azure.com` | A | \<account private endpoint IP address of Microsoft Purview> |
| `Contoso-Purview.catalog.Purview.azure.com` | A | \<account private endpoint IP address of Microsoft Purview\> |
| `Contoso-Purview.proxy.purview.azure.com` | A | \<account private endpoint IP address of Microsoft Purview\> |
| `Contoso-Purview.guardian.purview.azure.com` | A | \<account private endpoint IP address of Microsoft Purview\> |
| `gateway.purview.azure.com` | A | \<account private endpoint IP address of Microsoft Purview\> |
| `insight.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `manifest.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `cdn.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `hub.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `catalog.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `cseo.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `datascan.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `datashare.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `datasource.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `policy.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `sensitivity.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `web.privatelink.purviewstudio.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |
| `workflow.prod.ext.web.purview.azure.com` | A | \<portal private endpoint IP address of Microsoft Purview\> |

## Verify and DNS test name resolution and connectivity 

1. If you are using Azure Private DNS Zones, make sure the following DNS Zones and the corresponding A records are created in your Azure Subscription:

   |Private endpoint  |Private endpoint associated to  |DNS Zone  |A Record )(example) |
   |---------|---------|---------|---------|
   |Account     |Microsoft Purview         |`privatelink.purview.azure.com`         |Contoso-Purview         |
   |Portal     |Microsoft Purview          |`privatelink.purviewstudio.azure.com`        |Web         |
   |Ingestion     |Microsoft Purview managed Storage Account - Blob          |`privatelink.blob.core.windows.net`          |scaneastusabcd1234         |
   |Ingestion   |Microsoft Purview managed Storage Account - Queue         |`privatelink.queue.core.windows.net`         |scaneastusabcd1234         |
   |Ingestion     |Microsoft Purview configured Event Hubs - Event Hub         |`privatelink.servicebus.windows.net`         |atlas-12345678-1234-1234-abcd-123456789abc         |

2. Create [Virtual network links](../dns/private-dns-virtual-network-links.md) in your Azure Private DNS Zones for your Azure Virtual Networks to allow internal name resolution.
   
3. From your management PC and self-hosted integration runtime VM, test name resolution and network connectivity to your Microsoft Purview account using tools such as Nslookup.exe and PowerShell

To test name resolution you need to resolve the following FQDNs through their private IP addresses:
(Instead of Contoso-Purview, scaneastusabcd1234 or atlas-12345678-1234-1234-abcd-123456789abc, use the hostname associated with your purview account name and managed or configured resources names)

- `Contoso-Purview.purview.azure.com`
- `web.purview.azure.com`
- `scaneastusabcd1234.blob.core.windows.net`
- `scaneastusabcd1234.queue.core.windows.net`
- `atlas-12345678-1234-1234-abcd-123456789abc.servicebus.windows.net`

To test network connectivity, from self-hosted integration runtime VM you can launch PowerShell console and test connectivity using `Test-NetConnection`. 
You must resolve each endpoint by their private endpoint and obtain TcpTestSucceeded as True. (Instead of Contoso-Purview, scaneastusabcd1234 or atlas-12345678-1234-1234-abcd-123456789abc, use the hostname associated with your purview account name and managed or configured resources names)

- `Test-NetConnection -ComputerName Contoso-Purview.purview.azure.com -port 443`
- `Test-NetConnection -ComputerName web.purview.azure.com -port 443`
- `Test-NetConnection -ComputerName scaneastusabcd1234.blob.core.windows.net -port 443`
- `Test-NetConnection -ComputerName scaneastusabcd1234.queue.core.windows.net -port 443`
- `Test-NetConnection -ComputerName atlas-12345678-1234-1234-abcd-123456789abc.servicebus.windows.net -port 443` 

## Next steps

- [Troubleshooting private endpoint configuration for your Microsoft Purview account](catalog-private-link-troubleshoot.md)
- [Manage data sources in Microsoft Purview](./manage-data-sources.md)
