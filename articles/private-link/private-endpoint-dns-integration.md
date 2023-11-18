---
title: Azure Private Endpoint DNS integration
description: Learn about Azure Private Endpoint DNS configuration scenarios.
services: private-link
author: asudbring
ms.service: private-link
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: allensu
ms.custom: fasttrack-edit
---

# Azure Private Endpoint DNS integration

Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. Private Endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network. The service can be an Azure service such as Azure Storage, Azure Cosmos DB, SQL, etc., or your own Private Link Service. This article describes DNS configuration scenarios for Azure Private Endpoint.

**For private DNS zone settings for Azure services that support a private endpoint, see [Azure Private Endpoint private DNS zone values](private-endpoint-dns.md).**

## DNS configuration scenarios

The FQDN of the services resolves automatically to a public IP address. To resolve to the private IP address of the private endpoint, change your DNS configuration.

DNS is a critical component to make the application work correctly by successfully resolving the private endpoint IP address.

Based on your preferences, the following scenarios are available with DNS resolution integrated:

  - [Virtual network workloads without custom DNS server](#virtual-network-workloads-without-custom-dns-server)
  
  - [On-premises workloads using a DNS forwarder](#on-premises-workloads-using-a-dns-forwarder)
  
  - [Virtual network and on-premises workloads using a DNS forwarder](#virtual-network-and-on-premises-workloads-using-a-dns-forwarder)

> [!NOTE]
> [Azure Firewall DNS proxy](../firewall/dns-settings.md#dns-proxy) can be used as DNS forwarder for [On-premises workloads](#on-premises-workloads-using-a-dns-forwarder) and [Virtual network workloads using a DNS forwarder](#virtual-network-and-on-premises-workloads-using-a-dns-forwarder).

## Virtual network workloads without custom DNS server

This configuration is appropriate for virtual network workloads without a custom DNS server. In this scenario, the client queries for the private endpoint IP address to the Azure-provided DNS service [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). Azure DNS is responsible for DNS resolution of the private DNS zones.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](private-endpoint-dns.md).

To configure properly, you need the following resources:

- Client virtual network

- Private DNS zone [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A record](../dns/dns-zones-records.md#record-types)

- Private endpoint information (FQDN record name and private IP address)

The following screenshot illustrates the DNS resolution sequence from virtual network workloads using the private DNS zone:

:::image type="content" source="media/private-endpoint-dns/single-vnet-azure-dns.png" alt-text="Diagram of single virtual network and Azure-provided DNS":::

You can extend this model to peered virtual networks associated to the same private endpoint. [Add new virtual network links](../dns/private-dns-virtual-network-links.md) to the private DNS zone for all peered virtual networks.

> [!IMPORTANT]
> A single private DNS zone is required for this configuration. Creating multiple zones with the same name for different virtual networks would need manual operations to merge the DNS records.

> [!IMPORTANT]
> If you're using a private endpoint in a hub-and-spoke model from a different subscription or even within the same subscription, link the same private DNS zones to all spokes and hub virtual networks that contain clients that need DNS resolution from the zones.

In this scenario, there's a [hub and spoke](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) networking topology. The spoke networks share a private endpoint. The spoke virtual networks are linked to the same private DNS zone.

:::image type="content" source="media/private-endpoint-dns/hub-and-spoke-azure-dns.png" alt-text="Diagram of hub and spoke with Azure-provided DNS":::

## On-premises workloads using a DNS forwarder

For on-premises workloads to resolve the FQDN of a private endpoint, use a DNS forwarder to resolve the Azure service [public DNS zone](private-endpoint-dns.md) in Azure. A [DNS forwarder](/windows-server/identity/ad-ds/plan/reviewing-dns-concepts#resolving-names-by-using-forwarding) is a Virtual Machine running on the Virtual Network linked to the Private DNS Zone that can proxy DNS queries coming from other Virtual Networks or from on-premises. This is required as the query must be originated from the Virtual Network to Azure DNS. A few options for DNS proxies are: Windows running DNS services, Linux running DNS services, [Azure Firewall](../firewall/dns-settings.md).

The following scenario is for an on-premises network that has a DNS forwarder in Azure. This forwarder resolves DNS queries via a server-level forwarder to the Azure provided DNS [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md).

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](private-endpoint-dns.md).

To configure properly, you need the following resources:

- On-premises network
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- DNS forwarder deployed in Azure 
- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md) with [type A record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and private IP address)

The following diagram illustrates the DNS resolution sequence from an on-premises network. The configuration uses a DNS forwarder deployed in Azure. The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md):

:::image type="content" source="media/private-endpoint-dns/on-premises-using-azure-dns.png" alt-text="Diagram of on-premises using Azure DNS":::

This configuration can be extended for an on-premises network that already has a DNS solution in place. 
The on-premises DNS solution is configured to forward DNS traffic to Azure DNS via a [conditional forwarder](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server). The conditional forwarder references the DNS forwarder deployed in Azure.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](private-endpoint-dns.md)

To configure properly, you need the following resources:

- On-premises network with a custom DNS solution in place 
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- DNS forwarder deployed in Azure
- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and private IP address)

The following diagram illustrates the DNS resolution from an on-premises network. DNS resolution is conditionally forwarded to Azure. The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md).

> [!IMPORTANT]
> The conditional forwarding must be made to the recommended [public DNS zone forwarder](private-endpoint-dns.md). For example: `database.windows.net` instead of **privatelink**.database.windows.net.

:::image type="content" source="media/private-endpoint-dns/on-premises-forwarding-to-azure.png" alt-text="Diagram of on-premises forwarding to Azure DNS":::

## Virtual network and on-premises workloads using a DNS forwarder

For workloads accessing a private endpoint from virtual and on-premises networks, use a DNS forwarder to resolve the Azure service [public DNS zone](private-endpoint-dns.md) deployed in Azure.

The following scenario is for an on-premises network with virtual networks in Azure. Both networks access the private endpoint located in a shared hub network.

This DNS forwarder is responsible for resolving all the DNS queries via a server-level forwarder to the Azure-provided DNS service [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md).

> [!IMPORTANT]
> A single private DNS zone is required for this configuration. All client connections made from on-premises and [peered virtual networks](../virtual-network/virtual-network-peering-overview.md) must  also use the same private DNS zone.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](private-endpoint-dns.md).

To configure properly, you need the following resources:

- On-premises network
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- [Peered virtual network](../virtual-network/virtual-network-peering-overview.md) 
- DNS forwarder deployed in Azure
- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and private IP address)

The following diagram shows the DNS resolution for both networks, on-premises and virtual networks. The resolution is using a DNS forwarder. The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md):

:::image type="content" source="media/private-endpoint-dns/hybrid-scenario.png" alt-text="Diagram of hybrid scenario":::

## Private DNS zone group

If you choose to integrate your private endpoint with a private DNS zone, a private DNS zone group is also created. The DNS zone group has a strong association between the private DNS zone and the private endpoint. It helps with managing the private DNS zone records when there's an update on the private endpoint. For example, when you add or remove regions, the private DNS zone is automatically updated with the correct number of records.

Previously, the DNS records for the private endpoint were created via scripting (retrieving certain information about the private endpoint and then adding it on the DNS zone). With the DNS zone group, there is no need to write any additional CLI/PowerShell lines for every DNS zone. Also, when you delete the private endpoint, all the DNS records within the DNS zone group will be deleted as well.

A common scenario for DNS zone group is in a hub-and-spoke topology, where it allows the private DNS zones to be created only once in the hub and allows the spokes to register to it, rather than creating different zones in each spoke.

> [!NOTE]
> Each DNS zone group can support up to 5 DNS zones.

> [!NOTE]
> Adding multiple DNS zone groups to a single Private Endpoint is not supported.

> [!NOTE]
> Delete and update operations for DNS records can be seen performed by "Azure Traffic Manager and DNS." This is a normal platform operation necessary for managing your DNS Records.

## Next steps
- [Learn about private endpoints](private-endpoint-overview.md)
