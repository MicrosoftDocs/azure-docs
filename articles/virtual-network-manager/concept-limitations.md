---
title: Limitations with Azure Virtual Network Manager
description: Learn about current limitations when you're using Azure Virtual Network Manager to manage virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 07/11/2025
#CustomerIntent: As a network admin, I want understand the limitations in Azure Virtual Network Manager so that I can properly deploy it my environment.
ms.custom:
  - build-2025
---

# Limitations with Azure Virtual Network Manager

This article provides an overview of the current limitations when you're using [Azure Virtual Network Manager](overview.md) to manage virtual networks. Understanding these limitations can help you properly deploy an Azure Virtual Network Manager instance, or network manager, in your environment. The article covers topics like the maximum number of virtual networks that a network manager can connect, how a network manager handles connected virtual networks with overlapping address space, and the evaluation cycle for policy compliance.

## General limitations

* Currently, [cross-tenant](concept-cross-tenant.md) virtual networks can only be [added to network groups manually](concept-network-groups.md#static-membership).

* Customers with more than 15,000 Azure subscriptions can only apply an Azure Virtual Network Manager policy at the [subscription and resource group scopes](concept-network-manager-scope.md). You can't apply policies onto management groups over the limit of 15,000 subscriptions. In this scenario, you would need to create assignments at lower-level management group scopes that each have fewer than 15,000 subscriptions.

* You can't add virtual networks to a network group when the Azure Virtual Network Manager custom policy `enforcementMode` element is set to `Disabled`.

* Azure Virtual Network Manager policies don't support the standard evaluation cycle for policy compliance. For more information, see [Evaluation triggers](../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

* The move of the subscription where the Azure Virtual Network Manager instance exists to another tenant isn't supported.

* In Azure China regions, using tags on resource groups and subscriptions in Azure Policy definitions for network group membership isn't currently supported.

* An Azure Virtual Network Manager instance cannot be moved from the existing subscription to another.

## Limitations for connected groups 

* A virtual network can be peered with up to 1,000 virtual networks using Azure Virtual Network Manager's hub-and-spoke connectivity configuration, meaning you can peer up to 1,000 spoke virtual networks to a hub virtual network.

* By default, the maximum number of private endpoints per connected group is 2,000. You can increase this limit to 20,000 using the this feature [enabling high-scale private endpoints in connected groups](./concept-connectivity-configuration.md#enable-high-scale-private-endpoints-in-azure-virtual-network-manager-connected-groups).

* By default, a [connected group](concept-connectivity-configuration.md#behind-the-scenes-connected-group) can have up to 250 virtual networks. This default is a soft limit and can be increased up to 1,000 virtual networks by submitting a request using [this form](https://forms.office.com/pages/responsepage.aspx?id=v4j5cvGGr0GRqy180BHbRzeHatNxLHpJshECDnD5QidURTM2OERMQlYxWkE1UTNBMlRNUkJUNkhDTy4u&route=shorturl).

* By default, a virtual network can be part of up to two [connected groups](concept-connectivity-configuration.md#behind-the-scenes-connected-group). For example, a virtual network:
  * Can be part of two mesh connectivity configurations.
  * Can be part of a mesh connectivity configuration and a spoke network group that has direct connectivity enabled in a hub-and-spoke connectivity configuration.
  * Can be part of two spoke network groups with direct connectivity enabled in the same or different hub-and-spoke connectivity configurations.
  * This default is a soft limit and can be adjusted by submitting a request using [this form](https://forms.office.com/r/xXxYrQt0NQ).

* The following BareMetal Infrastructures aren't supported in connected group:
  * [Azure NetApp Files](../azure-netapp-files/index.yml)
  * [Azure VMware Solution](../azure-vmware/index.yml)
  * [Nutanix Cloud Clusters on Azure](../baremetal-infrastructure/workloads/nc2-on-azure/about-nc2-on-azure.md)
  * [Oracle Database@Azure](../oracle/oracle-db/oracle-database-what-is-new.md)
  * [Azure Payment HSM](/azure/payment-hsm/solution-design)

* You can have virtual networks with overlapping IP spaces in the same connected group. However, communication to an overlapped IP address is dropped.

* When a connected group’s virtual network is peered with an external virtual network that has overlapping IP address space with any member of the connected group, these overlapping address spaces become inaccessible within the connected group. Traffic from the peered virtual network in the connected group to the overlapping address space is routed to the external virtual network, while traffic from other virtual networks in the connected group to the overlapping address space is dropped.

## Limitations for security admin rules

* The maximum number of IP prefixes in all [security admin rules](concept-security-admins.md) combined is 20,000.

* The maximum number of security admin rules in one level of Azure Virtual Network Manager is 100.

* The service tags AzurePlatformDNS, AzurePlatformIMDS, and AzurePlatformLKM aren't currently supported in security admin rules.

## Limitations for IP address management (IPAM)

* Currently, removing address spaces managed by IPAM from virtual networks or subnets is not supported. This restriction applies only to IPAM-managed address spaces, not to other address spaces (for example, if IPv4 is managed by IPAM but IPv6 is not, IPv6 address spaces can still be removed). In addition, removing IP address spaces from an IPAM pool is not supported.

## Related content

* [Frequently asked questions](faq.md)
