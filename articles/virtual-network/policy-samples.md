---
title: Policy template samples | Microsoft Docs
description: Azure policy template samples for Virtual Network.
services: virtual-network
documentationcenter:
author: jimdial
manager: jeconnoc
editor:
tags:
ms.assetid:
ms.service: virtual-network
ms.devlang: na
ms.topic: sample
ms.tgt_pltfrm:
ms.workload:
ms.date: 05/02/2018
ms.author: jdial
ms.custom: mvc

---
# Azure policy sample templates for virtual network

The following table includes links to sample [Azure Policy](../azure-policy/azure-policy-introduction.md?toc=%2fazure%2fvirtual-network%2ftoc.json) templates. The samples are found in the [Azure Policy samples repository](https://github.com/Azure/azure-policy).

| | |
|---|---|
|**Network**||
| [NSG X on every NIC](../azure-policy/scripts/nsg-on-nic.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Requires that a specific network security group is used with every virtual network interface. You specify the ID of the network security group to use. |
| [NSG X on every subnet](../azure-policy/scripts/nsg-on-subnet.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Requires that a specific network security group is used with every virtual subnet. You specify the ID of the network security group to use. |
| [No route table](../azure-policy/scripts/no-user-def-route-table.md?toc=%2fazure%2fvirtual-network%2ftoc.json)  |Prohibits virtual networks from being deployed with a route table. |
| [Use approved subnet for VM network interfaces](../azure-policy/scripts/use-approved-subnet-vm-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Requires that network interfaces use an approved subnet. You specify the ID of the approved subnet. |
| [Use approved vNet for VM network interfaces](../azure-policy/scripts/use-approved-vnet-vm-nics.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Requires that network interfaces use an approved virtual network. You specify the ID of the approved virtual network. |
|**Monitoring**||
| [Audit diagnostic setting](../azure-policy/scripts/audit-diag-setting.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Audits if diagnostic settings are not enabled for specified resource types. You specify an array of resource types to check whether diagnostic settings are enabled. |
|**Name and text conventions**||
| [Allow multiple name patterns](../azure-policy/scripts/allow-multiple-name-patterns.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Allow one of many name patterns to be used for resources. |
| [Require like pattern](../azure-policy/scripts/enforce-like-pattern.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Ensure resource names meet the *like* condition for a pattern. |
| [Require match pattern](../azure-policy/scripts/enforce-match-pattern.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Ensure resource names match a specified naming pattern. |
| [Require tag match pattern](../azure-policy/scripts/enforce-tag-match-pattern.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Ensure that a tag value matches a text pattern. |
|**Tags**||
| [Billing tags policy initiative](../azure-policy/scripts/billing-tags-policy-init.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Requires specified tag values for cost center and product name. Uses built-in policies to apply and enforce required tags. You specify the required values for the tags.  |
| [Enforce tag and its value on resource groups](../azure-policy/scripts/enforce-tag-rg.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Requires a tag and value on a resource group. You specify the required tag name and value.  |
| [Enforce tag and its value](../azure-policy/scripts/enforce-tag-val.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Requires a specified tag name and value. You specify the tag name and value to enforce.  |
| [Apply tag and its default value](../azure-policy/scripts/apply-tag-def-val.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Appends a specified tag name and value, if that tag is not provided. You specify the tag name and value to apply.  |
|**General**||
| [Allowed locations](../azure-policy/scripts/allowed-locs.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Requires that all resources are deployed to the approved locations. You specify an array of approved locations.  |
| [Allowed resource types](../azure-policy/scripts/allowed-res-types.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Ensures only approved resource types are deployed. You specify an array of resource types that are permitted.  |
| [Not allowed resource types](../azure-policy/scripts/not-allowed-res-type.md?toc=%2fazure%2fvirtual-network%2ftoc.json) | Prohibits the deployment of specified resource types. You specify an array of the resource types to block.  |