---
title: Azure Private Endpoint DNS integration
description: Learn about Azure Private Endpoint DNS configuration scenarios.
services: private-link
author: abell
ms.service: azure-private-link
ms.topic: conceptual
ms.date: 12/03/2024
ms.author: abell
ms.custom: fasttrack-edit
---

# Azure Private Endpoint DNS integration

Azure Private Endpoint is a network interface that connects you privately and securely to a service powered by Azure Private Link. Private Endpoint uses a private IP address from your virtual network, effectively bringing the service into your virtual network. The service can be an Azure service such as Azure Storage, Azure Cosmos DB, SQL, etc., or your own Private Link Service. This article describes DNS configuration scenarios for Azure Private Endpoint.

**For private DNS zone settings for Azure services that support a private endpoint, see [Azure Private Endpoint private DNS zone values](private-endpoint-dns.md).**

## DNS configuration scenarios

The FQDN of the services resolves automatically to a public IP address. To resolve to the private IP address of the private endpoint, change your DNS configuration.

DNS is a critical component to make the application work correctly by successfully resolving the private endpoint IP address.

Based on your preferences, the following scenarios are available with DNS resolution integrated:

- [Virtual network workloads without Azure Private Resolver](#virtual-network-workloads-without-azure-private-resolver)
  
- [Peered virtual network workloads without Azure Private Resolver](#virtual-network-workloads-without-custom-dns-server)
   
- [Azure Private Resolver for on-premises workloads](#azure-private-resolver-for-on-premises-workloads)
  
- [Azure Private Resolver with on-premises DNS forwarder](#on-premises-workloads-using-a-dns-forwarder)
  
- [Azure Private Resolver for virtual network and on-premises workloads](#virtual-network-and-on-premises-workloads-using-a-dns-forwarder)

## Virtual network workloads without Azure Private Resolver

This configuration is appropriate for virtual network workloads without a custom DNS server. In this scenario, the client queries for the private endpoint IP address to the Azure-provided DNS service [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md). Azure DNS is responsible for DNS resolution of the private DNS zones.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](private-endpoint-dns.md).

To configure properly, you need the following resources:

- Client virtual network

- Private DNS zone [privatelink.database.windows.net](../dns/private-dns-privatednszone.md) with [type A record](../dns/dns-zones-records.md#record-types)

- Private endpoint information (FQDN record name and private IP address)

The following screenshot illustrates the DNS resolution sequence from virtual network workloads using the private DNS zone:

:::image type="content" source="media/private-endpoint-dns/single-vnet-azure-dns.png" alt-text="Diagram of single virtual network and Azure-provided DNS." lightbox="media/private-endpoint-dns/single-vnet-azure-dns.png"::: 

## <a name="virtual-network-workloads-without-custom-dns-server"></a> Peered virtual network workloads without Azure Private Resolver

You can extend this model to peered virtual networks associated to the same private endpoint. [Add new virtual network links](../dns/private-dns-virtual-network-links.md) to the private DNS zone for all peered virtual networks.

> [!IMPORTANT]
> - A single private DNS zone is required for this configuration. Creating multiple zones with the same name for different virtual networks would need manual operations to merge the DNS records.
>
> - If you're using a private endpoint in a hub-and-spoke model from a different subscription or even within the same subscription, link the same private DNS zones to all spokes and hub virtual networks that contain clients that need DNS resolution from the zones.

In this scenario, there's a [hub and spoke](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke) networking topology. The spoke networks share a private endpoint. The spoke virtual networks are linked to the same private DNS zone.

:::image type="content" source="media/private-endpoint-dns/hub-and-spoke-azure-dns.png" alt-text="Diagram of hub and spoke with Azure-provided DNS." lightbox="media/private-endpoint-dns/hub-and-spoke-azure-dns.png"::: 

## Azure Private Resolver for on-premises workloads

For on-premises workloads to resolve the FQDN of a private endpoint, use Azure Private Resolver to resolve the Azure service public DNS zone in Azure. Azure Private Resolver is an Azure managed service that can resolve DNS queries without the need for a virtual machine acting as a DNS forwarder.

The following scenario is for an on-premises network configured to use an Azure Private Resolver. The private resolver forwards the request for the private endpoint to Azure DNS.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone values](private-endpoint-dns.md).

The following resources are required for a proper configuration:

- On-premises network

- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)

- [Azure Private Resolver](/azure/dns/dns-private-resolver-overview)

- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md) with [type A record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and private IP address)

The following diagram illustrates the DNS resolution sequence from an on-premises network. The configuration uses a Private Resolver deployed in Azure. The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md):

:::image type="content" source="media/private-endpoint-dns/on-premises-using-azure-dns.png" alt-text="Diagram of on-premises using Azure private DNS zone." lightbox="media/private-endpoint-dns/on-premises-using-azure-dns.png"::: 



## <a name="on-premises-workloads-using-a-dns-forwarder"></a> Azure Private Resolver with on-premises DNS forwarder

This configuration can be extended for an on-premises network that already has a DNS solution in place. 

The on-premises DNS solution is configured to forward DNS traffic to Azure DNS via a [conditional forwarder](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server). The conditional forwarder references the Private Resolver deployed in Azure.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone values](private-endpoint-dns.md)

To configure properly, you need the following resources:

- On-premises network with a custom DNS solution in place

- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)

- [Azure Private Resolver](/azure/dns/dns-private-resolver-overview)

- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md) with [type A record](../dns/dns-zones-records.md#record-types)

- Private endpoint information (FQDN record name and private IP address)

The following diagram illustrates the DNS resolution from an on-premises network. DNS resolution is conditionally forwarded to Azure. The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md).

> [!IMPORTANT]
> The conditional forwarding must be made to the recommended [public DNS zone forwarder](private-endpoint-dns.md). For example: `database.windows.net` instead of **privatelink**.database.windows.net.

:::image type="content" source="media/private-endpoint-dns/on-premises-forwarding-to-azure.png" alt-text="Diagram of on-premises forwarding to Azure DNS." lightbox="media/private-endpoint-dns/on-premises-forwarding-to-azure.png"::: 

## <a name="virtual-network-and-on-premises-workloads-using-a-dns-forwarder"></a> Azure Private Resolver for virtual network and on-premises workloads

For workloads accessing a private endpoint from virtual and on-premises networks, use Azure Private Resolver to resolve the Azure service [public DNS zone](private-endpoint-dns.md) deployed in Azure.

The following scenario is for an on-premises network with virtual networks in Azure. Both networks access the private endpoint located in a shared hub network.

The private resolver is responsible for resolving all the DNS queries via the Azure-provided DNS service [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md).

> [!IMPORTANT]
> A single private DNS zone is required for this configuration. All client connections made from on-premises and [peered virtual networks](../virtual-network/virtual-network-peering-overview.md) must also use the same private DNS zone.

> [!NOTE]
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](private-endpoint-dns.md).

To configure properly, you need the following resources:

- On-premises network

- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)

- [Peered virtual network](../virtual-network/virtual-network-peering-overview.md) 

- Azure Private Resolver

- Private DNS zones [privatelink.database.windows.net](../dns/private-dns-privatednszone.md)  with [type A record](../dns/dns-zones-records.md#record-types)

- Private endpoint information (FQDN record name and private IP address)

The following diagram shows the DNS resolution for both networks, on-premises and virtual networks. The resolution is using Azure Private Resolver. 

The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md):

:::image type="content" source="media/private-endpoint-dns/hybrid-scenario.png" alt-text="Diagram of hybrid scenario with private DNS zone." lightbox="media/private-endpoint-dns/hybrid-scenario.png"::: 

## Private DNS zone group

If you choose to integrate your private endpoint with a private DNS zone, a private DNS zone group is also created. The DNS zone group has a strong association between the private DNS zone and the private endpoint. It helps with managing the private DNS zone records when there's an update on the private endpoint. For example, when you add or remove regions, the private DNS zone is automatically updated with the correct number of records.

Previously, the DNS records for the private endpoint were created via scripting (retrieving certain information about the private endpoint and then adding it on the DNS zone). With the DNS zone group, there's no need to write any extra CLI/PowerShell lines for every DNS zone. Also, when you delete the private endpoint, all the DNS records within the DNS zone group are deleted.

In a hub-and-spoke topology, a common scenario allows the creation of private DNS zones only once in the hub. This setup permits the spokes to register to it, instead of creating different zones in each spoke.


> [!NOTE]
> - Each DNS zone group can support up to 5 DNS zones.
> - Adding multiple DNS zone groups to a single Private Endpoint is not supported.
> - Delete and update operations for DNS records can be seen performed by **Azure Traffic Manager and DNS.** This is a normal platform operation necessary for managing your DNS Records.

## Next steps
- [Learn about private endpoints](private-endpoint-overview.md)
