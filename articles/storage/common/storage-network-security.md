---
title: Configure Azure Storage firewalls and virtual networks
description: Configure layered network security for your storage account by using the Azure Storage firewall.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Configure Azure Storage firewalls and virtual networks

You can disable public network access to your storage account, and permit traffic only if it originates from sources that you specify. Sources can include [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md) subnets, public IP address ranges, specific Azure resource instances or traffic from trusted Azure services. Clients that make requests from allowed sources must also meet the authorization requirements of the storage account. To learn more about account authorization, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

<a id="grant-access-from-a-virtual-network"></a>
<a id="azure-storage-cross-region-service-endpoints"></a>

## Virtual network subnets

You can enable traffic from subnets in any Azure Virtual network in any subscription from any Microsoft Entra tenant in any Azure region. Create a *virtual network rule* for each subnet. Each storage account supports up to **400** virtual network rules.  

Creating a virtual network rule is only one part of what is required to enable traffic from a virtual network. In the settings of the virtual network, you must enable a Virtual Network *service endpoint* that is specifically designed to provide secure and direct connectivity to your storage account. If you create network rules by using the Azure portal, then these service endpoints are created for you as you choose each target subnet. PowerShell and Azure CLI provide commands that you can run to create them. To learn more about service endpoints, see [Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md). 

The following table describes each type of service endpoint that you can enable for Azure Storage:

| Service endpoint                            | Resource name            | Description                                                                              |
|---------------------------------------------|--------------------------|------------------------------------------------------------------------------------------|
| Azure Storage endpoint                      | Microsoft.Storage        | Provides connectivity to storage accounts in the **same region** as the virtual network. |
| Azure Storage cross-region service endpoint | Microsoft.Storage.Global | Provides connectivity to storage accounts in **any region**.                             |

> [!NOTE]
> You can associate only one of these endpoint types to a subnet. If one of these endpoints is already associated with the subnet, you'll have to delete that endpoint before adding the other. 

To learn how to configure a virtual network rule and enable service endpoints, see [Create a virtual network rule for Azure Storage](storage-network-security-virtual-networks.md).

<a id="grant-access-from-an-internet-ip-range"></a>
<a id="managing-ip-network-rules"></a>

### Paired regions

Service endpoints also work between virtual networks and service instances in a [paired region](../../best-practices-availability-paired-regions.md).

Configuring service endpoints between virtual networks and service instances in a [paired region](../../best-practices-availability-paired-regions.md) can be an important part of your disaster recovery plan. Service endpoints allow continuity during a regional failover and access to read-only geo-redundant storage (RA-GRS) instances. Virtual network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When you're planning for disaster recovery during a regional outage, create the virtual networks in the paired region in advance. Enable service endpoints for Azure Storage, with network rules granting access from these alternative virtual networks. Then apply these rules to your geo-redundant storage accounts.

## IP address ranges

For clients and services not located in a virtual network, you can enable traffic by creating *IP network rules*. Each IP network rule can enable traffic from a specific public IP address range. For example, if a client from an on-premises network needs to access storage data, then a rule can include the public IP address of that client. Each storage account supports up to **400** IP network rules. 

To learn how to create IP network rules, see [Create an IP network rule for Azure Storage](storage-network-security-ip-address-range.md).

If you've enabled a service endpoint for a subnet, then traffic from that subnet won't use a public IP address to communicate with a storage account. Instead, all the traffic uses a private IP address as a source IP. As a result, IP network rules that permit traffic from those subnets no longer have an effect.

> [!IMPORTANT]
> Some restrictions apply to IP address ranges. For a list of restrictions, see [Restrictions for IP network rules](storage-network-security-limitations.md#restrictions-for-ip-network-rules).

<a id="configuring-access-from-on-premises-networks"></a>

### Configuring access from on-premises networks

To grant access from your on-premises networks to your storage account by using an IP network rule, you must identify the internet-facing IP addresses that your network uses. Contact your network administrator for help.

If you're using [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) from your premises, you need to identify the NAT IP addresses used for Microsoft peering. Either the service provider or the customer provides the NAT IP addresses.

To allow access to your service resources, you must allow these public IP addresses in the firewall setting for resource IPs.

<a id="grant-access-from-azure-resource-instances"></a>

## Azure resource instances

Some Azure resources can't be isolated through a virtual network or IP address rule. You can enable traffic from those resources by creating a *resource instance rule*. The Azure role assignments of the resource instance determine the types of operations that a resource instance can perform on storage account data. Resource instances must be from the same tenant as your storage account, but they can belong to any subscription in the tenant.

To learn how to configure a resource instance rule, see [Configure Azure Storage to accept requests from resource instances](storage-network-security-resource-instances.md).

<a id="grant-access-to-trusted-azure-services"></a>
<a id="manage-exceptions"></a>
<a id="trusted-microsoft-services"></a>
<a id="exceptions"></a>
<a id="trusted-access-based-on-system-assigned-managed-identity"></a>
<a id="trusted-access-based-on-a-managed-identity"></a>
<a id="trusted-access-for-resources-registered-in-your-microsoft-entra-tenant"></a>

## Trusted Azure services

If you need to enable traffic from an Azure service outside of the network boundary, you can add a *network security exception*. This can be useful in cases where an Azure service operates from a network that you can't include in your virtual network or IP network rules. For example, some services might need to read resource logs and metrics in your account. You can allow read access for the log files, metrics tables, or both by creating a network rule exception. These services connect to your storage account by using strong authentication.

To learn more about how to add a network security exception, see [Manage Network security exceptions](storage-network-security-manage-exceptions.md).

For a complete list of Azure services you can enable traffic for, see [Trusted Azure services](storage-network-security-trusted-azure-services.md).

## Restrictions and considerations

Before implementing network security for your storage accounts, make sure to review all restrictions and considerations. For a complete list, see [Restrictions and limitations for Azure Storage firewall and virtual network configuration](storage-network-security-limitations.md).

## Next steps

- Learn more about [Azure network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).
- Dig deeper into [security recommendations for Azure Blob storage](../blobs/security-recommendations.md).
