--- 
title: "Azure Storage firewall rules and network access"
description: "Configure Azure Storage firewall rules to control network access. Restrict traffic by IP address, virtual network, or trusted services to secure your storage account."
services: storage
author: normesta
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: how-to
ms.date: 07/06/2026
ms.author: normesta
ms.custom: devx-track-azurepowershell, devx-track-azurecli, build-2023, engagement, ignite-2024
# Customer intent: As a cloud administrator, I want to configure network firewalls and access rules for Azure Storage, so that I can enhance security by restricting access to specific IP addresses, virtual networks, and trusted services.
---

# Azure Storage firewall rules and network access control

Azure Storage firewall rules provide granular control over network access to your storage account's public endpoint. By default, storage accounts allow connections from any network, but you can restrict access by configuring network rules that define which sources can connect to your storage account.

You can configure four types of network rules:

- **Virtual network rules**: Allow traffic from specific subnets within Azure Virtual Networks
- **IP network rules**: Allow traffic from specific public IP address ranges
- **Resource instance rules**: Allow traffic from specific Azure resource instances that can't be isolated through virtual network or IP rules
- **Trusted service exceptions**: Allow traffic from specific Azure services that operate outside your network boundary

When you configure network rules, only traffic from explicitly allowed sources can access your storage account through its public endpoint. All other traffic is denied.

> [!NOTE]
> Clients that make requests from allowed sources must also meet the authorization requirements of the storage account. To learn more about account authorization, see [Authorize access to data in Azure Storage](../common/authorize-data-access.md).

<a id="grant-access-from-a-virtual-network"></a>
<a id="azure-storage-cross-region-service-endpoints"></a>

## Virtual network rules

You can enable traffic from subnets in any Azure Virtual Network. The virtual network can be from any subscription within any Microsoft Entra tenant across any Azure region. To enable traffic from a subnet, add a *virtual network rule*. You can add up to 400 virtual network rules per storage account.

> [!IMPORTANT]
> By default, traffic to all subnets is blocked. Requests to resources in a subnet receive a 403 error until you add a rule that allows traffic to that subnet. 

In the subnet's virtual network settings, you must also enable a Virtual Network *service endpoint*. This endpoint provides secure and direct connectivity to your storage account. 

When you create network rules by using the Azure portal, it automatically creates these service endpoints as you select each target subnet. PowerShell and Azure CLI provide commands that you can use to create them manually. To learn more about service endpoints, see [Virtual Network service endpoints](../../virtual-network/virtual-network-service-endpoints-overview.md).

The following table describes each type of service endpoint that you can enable for Azure Storage:

| Service endpoint                            | Resource name            | Description                                                                              |
|---------------------------------------------|--------------------------|------------------------------------------------------------------------------------------|
| Azure Storage endpoint                      | Microsoft.Storage        | Provides connectivity to storage accounts in the **same region** as the virtual network. |
| Azure Storage cross-region service endpoint | Microsoft.Storage.Global | Provides connectivity to storage accounts in **any region**.                             |

> [!NOTE]
> You can associate only one of these endpoint types with a subnet. If one of these endpoints is already associated with the subnet, you must delete that endpoint before adding the other.

To learn how to configure a virtual network rule and enable service endpoints, see [Create a virtual network rule for Azure Storage](storage-network-security-virtual-networks.md).

### Access from a paired region

Configuring service endpoints between virtual networks and service instances in a [paired region](../../best-practices-availability-paired-regions.md) (Azure's designated backup region for disaster recovery) can be an important part of your disaster recovery plan. Service endpoints enable continuity during a regional failover and provide access to read-only geo-redundant storage (RA-GRS) instances. Virtual network rules that grant access from a virtual network to a storage account also grant access to any RA-GRS instance.

When planning for disaster recovery during a regional outage, create the virtual networks in the paired region in advance. Enable service endpoints for Azure Storage with network rules that grant access from these alternative virtual networks. Then apply these rules to your geo-redundant storage accounts.

<a id="managing-ip-network-rules"></a>
<a id="grant-access-from-an-internet-ip-range"></a>

## IP network rules

For clients and services that aren't located in a virtual network, you can enable traffic by creating *IP network rules*. Each IP network rule enables traffic from a specific public IP address range. For example, if a client from an on-premises network needs to access storage data, you can create a rule that includes the public IP address of that client. Each storage account supports up to **400** IP network rules. 

To learn how to create IP network rules, see [Create an IP network rule for Azure Storage](storage-network-security-ip-address-range.md).

If you enable a service endpoint for a subnet, traffic from that subnet won't use a public IP address to communicate with a storage account. Instead, all traffic uses a private IP address as the source IP. As a result, IP network rules that permit traffic from those subnets no longer have an effect.

SAS tokens that grant access to a specific IP address limit the token holder's access, but they don't grant new access beyond configured network rules.

> [!IMPORTANT]
> Some restrictions apply to IP address ranges. For a list of restrictions, see [Restrictions for IP network rules](storage-network-security-limitations.md#restrictions-for-ip-network-rules).

<a id="configuring-access-from-on-premises-networks"></a>

### Access from an on-premises network

You can enable traffic from an on-premises network by using an IP network rule. First, identify the internet-facing IP addresses that your network uses. Contact your network administrator for assistance.

If you're using [Azure ExpressRoute](../../expressroute/expressroute-introduction.md) from your premises, you need to identify the NAT (network address translation) IP addresses used for Microsoft peering. Either the service provider or the customer provides the NAT IP addresses.

To allow access to your service resources, you must allow these public IP addresses in the firewall setting for resource IPs.

<a id="grant-access-from-azure-resource-instances"></a>

## Azure resource instance rules

Some Azure resources can't be isolated through a virtual network or IP address rule. You can enable traffic from those resources by creating a *resource instance network rule*. The Azure role assignments of the resource instance determine the types of operations that the resource instance can perform on storage account data. Resource instances must be from the same tenant as your storage account, but they can belong to any subscription within the tenant.

To learn how to configure a resource instance rule, see [Create a resource instance network rule for Azure Storage](storage-network-security-resource-instances.md).

<a id="grant-access-to-trusted-azure-services"></a>
<a id="manage-exceptions"></a>
<a id="exceptions"></a>
<a id="exceptions-for-trusted-azure-services"></a>

## Exceptions for trusted Azure services and network security

If you need to enable traffic from an Azure service outside of the network boundary, add a *network security exception*. This exception is useful when an Azure service operates from a network that you can't include in your virtual network or IP network rules. For example, some services might need to read resource logs and metrics in your account. You can allow read access for the log files, metrics tables, or both by creating a network security exception. These services connect to your storage account by using strong authentication.

To learn more about how to add a network security exception, see [Manage network security exceptions](storage-network-security-manage-exceptions.md).

For a complete list of Azure services you can enable traffic for, see [Trusted Azure services](storage-network-security-trusted-azure-services.md).

## Restrictions and considerations for Azure Storage firewall

Before implementing network security for your storage accounts, review all restrictions and considerations. For a complete list, see [Restrictions and limitations for Azure Storage firewall and virtual network configuration](storage-network-security-limitations.md).

## See also

- [Azure Storage network security overview](storage-network-security-overview.md)
- [Restrictions and considerations](storage-network-security-limitations.md)
- [Virtual network rules](storage-network-security-virtual-networks.md)
- [IP network rules](storage-network-security-ip-address-range.md)
- [Resource instance rules](storage-network-security-resource-instances.md)
- [Network rule exceptions](storage-network-security-manage-exceptions.md)
- [Trusted Azure services](storage-network-security-trusted-azure-services.md)
