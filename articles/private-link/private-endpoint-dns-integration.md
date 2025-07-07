---
title: Azure Private Endpoint DNS Integration Scenarios
description: Learn how to configure Azure Private Endpoint DNS for secure and efficient private IP resolution. Discover key scenarios and best practices.
services: private-link
author: abell
ms.service: azure-private-link
ms.topic: concept-article
ms.date: 06/25/2025
ms.author: abell
ms.custom: fasttrack-edit
# Customer intent: As a network administrator, I want to configure DNS settings for Azure Private Endpoints, so that I can ensure secure and efficient resolution of private IP addresses required for my applications and services within the virtual network.
---

# Azure Private Endpoint DNS integration Scenarios

Azure Private Endpoint DNS integration is essential for enabling secure, private connectivity to Azure services within your virtual network. This article describes common DNS configuration scenarios for Azure Private Endpoints, including options for virtual networks, peered networks, and on-premises environments. Use these scenarios and best practices to ensure reliable and secure name resolution for your applications and services.

For private DNS zone settings for Azure services that support a private endpoint, see [Azure Private Endpoint private DNS zone values](private-endpoint-dns.md).

## DNS configuration scenarios

The FQDN of the service automatically resolves to a public IP address. To resolve to the private IP address of the private endpoint, change your DNS configuration.

DNS is critical for your application to work correctly because it resolves the private endpoint IP address.

You can use the following DNS resolution scenarios:

- [Virtual network workloads without Azure Private Resolver](#virtual-network-workloads-without-azure-private-resolver)
  
- [Peered virtual network workloads without Azure Private Resolver](#virtual-network-workloads-without-custom-dns-server)

- [On-premises workloads using a DNS forwarder without Azure Private Resolver)](#on-premises-workloads-using-a-dns-forwarder-without-azure-private-resolver)
   
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

## On-premises workloads using a DNS forwarder without Azure Private Resolver

For on-premises workloads to resolve the FQDN of a private endpoint, configure a DNS forwarder in Azure. The DNS forwarder should be deployed in the virtual network that is linked to the private DNS zone for your private endpoint.

A [DNS forwarder](/windows-server/identity/ad-ds/plan/reviewing-dns-concepts#resolving-names-by-using-forwarding) is typically a virtual machine running DNS services or a managed service like [Azure Firewall](../firewall/dns-settings.md). The DNS forwarder receives DNS queries from on-premises or other virtual networks and forwards them to Azure DNS.

> [!NOTE]
> DNS queries for private endpoints must originate from the virtual network that is linked to the private DNS zone. The DNS forwarder enables this by proxying queries on behalf of on-premises clients.
> This scenario uses the Azure SQL Database-recommended private DNS zone. For other services, you can adjust the model using the following reference: [Azure services DNS zone configuration](private-endpoint-dns.md).


The following scenario is for an on-premises network that has a DNS forwarder in Azure. This forwarder resolves DNS queries via a server-level forwarder to the Azure provided DNS [168.63.129.16](../virtual-network/what-is-ip-address-168-63-129-16.md).

To configure properly, you need the following resources:

- On-premises network with a custom DNS solution in place
- Virtual network [connected to on-premises](/azure/architecture/reference-architectures/hybrid-networking/)
- DNS solution in deployed in your Azure environment with the capability to conditionally forward DNS requests
- Private DNS zone [privatelink.database.windows.net](../dns/private-dns-privatednszone.md) with [type A record](../dns/dns-zones-records.md#record-types)
- Private endpoint information (FQDN record name and private IP address)


> [!IMPORTANT]
> The conditional forwarding must be made to the recommended public DNS zone forwarder. For example: `database.windows.net` instead of **privatelink**.database.windows.net.

- Extend this configuration for on-premises networks that already have a custom DNS solution.
- Configure your on-premises DNS solution with a [conditional forwarder](../virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances.md#name-resolution-that-uses-your-own-dns-server) for the private DNS zone. The conditional forwarder should point to the DNS forwarder deployed in Azure, so DNS queries for private endpoints are correctly resolved.

The resolution is made by a private DNS zone [linked to a virtual network](../dns/private-dns-virtual-network-links.md):

:::image type="content" source="media/private-endpoint-dns/on-premises-forwarding-to-azure-no-resolver.png" alt-text="Diagram of on-premises forwarding to Azure DNS without Azure Private Resolver." lightbox="media/private-endpoint-dns/on-premises-forwarding-to-azure-no-resolver.png":::

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
> - Each DNS zone group can support up to five DNS zones.
> - Adding multiple DNS zone groups to a single Private Endpoint isn't supported.
> - Delete and update operations for DNS records can be seen performed by **Azure Traffic Manager and DNS.** This is a normal platform operation necessary for managing your DNS Records.

## Related content
- [Learn about private endpoints](private-endpoint-overview.md)
- [Private endpoint private DNS zone values](private-endpoint-dns.md)

