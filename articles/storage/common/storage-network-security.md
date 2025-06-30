--- 
title: Azure Storage firewall rules
description: Learn about settings that you can use to secure traffic to the public endpoints of your Azure Storage account.
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 06/18/2025
ms.author: normesta

---

# Azure Storage firewall rules

Azure Storage firewall rules provide granular control over network access to your storage account's public endpoint. By default, storage accounts allow connections from any network, but you can restrict access by configuring network rules that define which sources can connect to your storage account.

You can configure four types of network access rules:

- **Virtual network rules**: Allow traffic from specific subnets within Azure Virtual Networks
- **IP network rules**: Allow traffic from specific public IP address ranges  
- **Resource instance rules**: Allow traffic from specific Azure resource instances that can't be isolated through virtual network or IP rules
- **Trusted service exceptions**: Allow traffic from specific Azure services that operate outside your network boundary

When network rules are configured, only traffic from explicitly allowed sources can access your storage account through its public endpoint. All other traffic is denied.

> [!NOTE]
> Network rules control network-level access but don't replace authentication and authorization requirements. Clients from allowed sources must still meet the authorization requirements of the storage account. To learn more about account authorization, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

<a id="grant-access-from-a-virtual-network"></a>
<a id="azure-storage-cross-region-service-endpoints"></a>

## Virtual network rules

You can enable traffic from subnets in any Azure Virtual Network. The virtual network can be from any subscription within any Microsoft Entra tenant across any Azure region. To enable traffic from a subnet, add a *virtual network rule*. You can add up to 400 virtual network rules per storage account.

In the subnet's virtual network settings, you must also enable a Virtual Network *service endpoint*. This endpoint is designed to provide secure and direct connectivity to your storage account. 

When you create network rules using the Azure portal, these service endpoints are automatically created as you select each target subnet. PowerShell and Azure CLI provide commands that you can use to create them manually. To learn more about service endpoints, see [Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).

The following table describes each type of service endpoint that you can enable for Azure Storage:

| Service endpoint                            | Resource name            | Description                                                                              |
|---------------------------------------------|--------------------------|------------------------------------------------------------------------------------------|
| Azure Storage endpoint                      | Microsoft.Storage        | Provides connectivity to storage accounts in the **same region** as the virtual network. |
| Azure Storage cross-region service endpoint | Microsoft.Storage.Global | Provides connectivity to storage accounts in **any region**.                             |

> [!NOTE]
> You can associate only one of these endpoint types with a subnet. If one of these endpoints is already associated with the subnet, you must delete that endpoint before adding the other.

To learn how to configure a virtual network rule and enable service endpoints, see [Create a virtual network rule for Azure Storage](storage-network-security-virtual-networks.md).

### Access from a paired region

Service endpoints also work between virtual networks and service instances in a [paired region](../../best-practices-availability-paired-regions.md).

Configuring service endpoints between virtual networks and service instances in a [paired region](../../best-practices-availability-paired-regions.md) can be an important part of your disaster recovery plan. Service endpoints enable continuity during a regional failover and provide access to read-only geo-redundant storage (RA-GRS) instances. Virtual network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When planning for disaster recovery during a regional outage, create the virtual networks in the paired region in advance. Enable service endpoints for Azure Storage with network rules that grant access from these alternative virtual networks. Then apply these rules to your geo-redundant storage accounts.

<a id="managing-ip-network-rules"></a>
<a id="grant-access-from-an-internet-ip-range"></a>

## IP network rules

For clients and services that aren't located in a virtual network, you can enable traffic by creating *IP network rules*. Each IP network rule enables traffic from a specific public IP address range. For example, if a client from an on-premises network needs to access storage data, you can create a rule that includes the public IP address of that client. Each storage account supports up to **400** IP network rules. 

To learn how to create IP network rules, see [Create an IP network rule for Azure Storage](storage-network-security-ip-address-range.md).

If you enable a service endpoint for a subnet, traffic from that subnet won't use a public IP address to communicate with a storage account. Instead, all traffic uses a private IP address as the source IP. As a result, IP network rules that permit traffic from those subnets no longer have an effect.

SAS tokens that grant access to a specific IP address serve to limit the access of the token holder, but they don't grant new access beyond configured network rules.

> [!IMPORTANT]
> Some restrictions apply to IP address ranges. For a list of restrictions, see [Restrictions for IP network rules](storage-network-security-limitations.md#restrictions-for-ip-network-rules).

<a id="configuring-access-from-on-premises-networks"></a>

### Access from an on-premises network

You can enable traffic from an on-premises network by using an IP network rule. First, you must identify the internet-facing IP addresses that your network uses. Contact your network administrator for assistance.

If you're using [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) from your premises, you need to identify the NAT IP addresses used for Microsoft peering. Either the service provider or the customer provides the NAT IP addresses.

To allow access to your service resources, you must allow these public IP addresses in the firewall setting for resource IPs.

<a id="grant-access-from-azure-resource-instances"></a>

## Azure resource instance rules

Some Azure resources can't be isolated through a virtual network or IP address rule. You can enable traffic from those resources by creating a *resource instance network rule*. The Azure role assignments of the resource instance determine the types of operations that the resource instance can perform on storage account data. Resource instances must be from the same tenant as your storage account, but they can belong to any subscription within the tenant.

To learn how to configure a resource instance rule, see [Create a resource instance network rule for Azure Storage](storage-network-security-resource-instances.md).

<a id="grant-access-to-trusted-azure-services"></a>
<a id="manage-exceptions"></a>
<a id="exceptions"></a>

## Exceptions for trusted Azure services

If you need to enable traffic from an Azure service outside of the network boundary, you can add a *network security exception*. This can be useful when an Azure service operates from a network that you can't include in your virtual network or IP network rules. For example, some services might need to read resource logs and metrics in your account. You can allow read access for the log files, metrics tables, or both by creating a network rule exception. These services connect to your storage account using strong authentication.

To learn more about how to add a network security exception, see [Manage network security exceptions](storage-network-security-manage-exceptions.md).

For a complete list of Azure services you can enable traffic for, see [Trusted Azure services](storage-network-security-trusted-azure-services.md).

## Restrictions and considerations

Before implementing network security for your storage accounts, make sure to review all restrictions and considerations. For a complete list, see [Restrictions and limitations for Azure Storage firewall and virtual network configuration](storage-network-security-limitations.md).

## See also

- [Azure Storage network security overview](storage-network-security-overview.md)
- [Restrictions and considerations](storage-network-security-limitations.md)
- [Virtual network rules](storage-network-security-virtual-networks.md)
- [IP network rules](storage-network-security-ip-address-range.md)
- [Resource instance rules](storage-network-security-resource-instances.md)
- [Network rule exceptions](storage-network-security-manage-exceptions.md)
- [Trusted Azure services](storage-network-security-trusted-azure-services.md)
