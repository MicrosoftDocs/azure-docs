---
title: Introduction to Effective security rules view in Azure Network Watcher | Microsoft Docs
description: This page provides an overview of the Network Watcher - Effective security rules view capability
services: network-watcher
documentationcenter: na
author: damendo
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 04/26/2017
ms.author: damendo
---

# Introduction to Effective security rules view in Azure Network Watcher

Network Security groups are associated at a subnet level or at a NIC level. When associated at a subnet level, it applies to all the VM instances in the subnet. Effective security rules view returns all the configured NSGs and rules that are associated at a NIC and subnet level for a virtual machine providing insight into the configuration. In addition, the effective security rules are returned for each of the NICs in a VM. Using Effective security rules view, you can assess a VM for network vulnerabilities such as open ports. You can also validate if your Network Security Group is working as expected based on a [comparison between the configured and the approved security rules](network-watcher-nsg-auditing-powershell.md).

A more extended use case is in security compliance and auditing. You can define a prescriptive set of security rules as a model for security governance in your organization. A periodic compliance audit can be implemented in a programmatic way by comparing the prescriptive rules with the effective rules for each of the VMs in your network.

In the portal rules are displayed for each Network Interface and grouped by inbound vs outbound. This provides a simple view into the rules applied to a virtual machine. A download button is provided to easily download all the security rules no matter the tab into a CSV file.

![security group view][1]

Rules can be selected and a new blade opens up to show the Network Security Group and source and destination prefixes. From this blade you can navigate directly to the Network Security Group resource.

![drilldown][2]

### Next steps

You can also use the *Effective Security Groups* feature through other methods listed below:
* [REST API](/rest/api/virtualnetwork/NetworkInterfaces/ListEffectiveNetworkSecurityGroups)
* [PowerShell](/powershell/module/az.network/get-azeffectivenetworksecuritygroup)
* [Azure CLI](/cli/azure/network/nic#az_network_nic_list_effective_nsg)

Learn how to audit your Network Security Group settings by visiting [Audit Network Security Group settings with PowerShell](network-watcher-nsg-auditing-powershell.md)

[1]: ./media/network-watcher-security-group-view-overview/securitygroupview.png
[2]: ./media/network-watcher-security-group-view-overview/figure1.png