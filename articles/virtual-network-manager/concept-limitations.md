---
title: Limitations with Azure Virtual Network Manager
description: Learn about current limitations when you're using Azure Virtual Network Manager to manage virtual networks.
author: mbender-ms
ms.author: mbender
ms.service: azure-virtual-network-manager
ms.topic: concept-article
ms.date: 09/16/2026
#CustomerIntent: As a network admin, I want understand the limitations in Azure Virtual Network Manager so that I can properly deploy it my environment.
ms.custom:
  - build-2025
  - references_regions
---

# Limitations with Azure Virtual Network Manager

This article provides an overview of the current limitations when you use [Azure Virtual Network Manager](overview.md) to manage virtual networks. Understanding these limitations can help you properly deploy an Azure Virtual Network Manager instance, or network manager, in your environment. The article covers topics like the maximum number of virtual networks that a network manager can connect, how a network manager handles connected virtual networks with overlapping address space, and the evaluation cycle for policy compliance.

## General limitations

* Currently, you can only [add cross-tenant](concept-cross-tenant.md) virtual networks to network groups manually. See [Static membership](concept-network-groups.md#static-membership).

* If you have more than 15,000 Azure subscriptions, you can only apply an Azure Virtual Network Manager policy at the [subscription and resource group scopes](concept-network-manager-scope.md). You can't apply policies onto management groups that exceed the 15,000 subscription limit. In this scenario, you need to create assignments at lower-level management group scopes that each have fewer than 15,000 subscriptions.

* You can't add virtual networks to a network group when the Azure Virtual Network Manager custom policy `enforcementMode` element is set to `Disabled`.

* Azure Virtual Network Manager policies don't support the standard evaluation cycle for policy compliance. For more information, see [Evaluation triggers](../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

* Moving the subscription where the Azure Virtual Network Manager instance exists to another tenant isn't supported.

* In Azure China regions, you can't currently use tags on resource groups and subscriptions in Azure Policy definitions for network group membership.

* You can't move an Azure Virtual Network Manager instance from the existing subscription to another subscription.

## Limitations for connected groups 

* You can peer a virtual network with up to 1,000 virtual networks by using Azure Virtual Network Manager's hub-and-spoke connectivity configuration. This limit means you can peer up to 1,000 spoke virtual networks to a hub virtual network.

* By default, each connected group supports up to 2,000 private endpoints. You can increase this limit to 20,000 by [enabling high-scale private endpoints in connected groups](./concept-connectivity-configuration.md#enable-high-scale-private-endpoints-in-azure-virtual-network-manager-connected-groups).

* By default, each [connected group](concept-connectivity-configuration.md#behind-the-scenes-connected-group) supports up to 250 virtual networks. In supported regions, register the `AllowHighScaleConnectedGroup` preview feature and submit the [high-scale connected group enablement form](https://forms.cloud.microsoft.com/r/1Je8uWNkXJ) to enable a [high-scale connected group](concept-connectivity-configuration.md#enable-high-scale-connectivity-in-azure-virtual-network-manager-connected-groups) that contains up to 3,000 virtual networks. To increase a connected group to up to 5,000 virtual networks or to scale the private IP address space for a group of connected, peered virtual networks beyond 128,000 addresses, submit the [scaling request form](https://forms.cloud.microsoft.com/r/BBNK1V8qTD).

> [!NOTE]
> Connected groups are currently supported in the following regions: Asia East, Asia Southeast, Australia Central, Australia Central 2, Australia East, Australia Southeast, Brazil South, Canada Central, Canada East, North Europe, West Europe, France Central, Germany West Central, Central India, South India, West India, Japan East, Japan West, Korea Central, Korea South, Mexico Central, Norway East, Qatar Central, South Africa North, Sweden Central, Switzerland North, Switzerland West, UAE North, UK South, UK West, Central US, East US, East US 2, US North, US South, West US, West US 2, West US 3, West Central US, East US 2 EUAP, and Central US EUAP.

* By default, a virtual network can be part of up to two [connected groups](concept-connectivity-configuration.md#behind-the-scenes-connected-group). For example, a virtual network:
  * Can be part of two mesh connectivity configurations.
  * Can be part of a mesh connectivity configuration and a spoke network group that has direct connectivity enabled in a hub-and-spoke connectivity configuration.
  * Can be part of two spoke network groups with direct connectivity enabled in the same or different hub-and-spoke connectivity configurations.
  * This default is a soft limit and you can adjust it by submitting the [connected group limit request form](https://forms.cloud.microsoft.com/r/1Je8uWNkXJ).

* The following BareMetal Infrastructures aren't supported in connected groups:
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

* Currently, you can't remove address spaces managed by IPAM from virtual networks or subnets. This restriction applies only to IPAM-managed address spaces, not to other address spaces. For example, if IPv4 is managed by IPAM but IPv6 isn't, you can still remove IPv6 address spaces. You also can't remove IP address spaces from an IPAM pool.

## Related content

* [Frequently asked questions](faq.md)
