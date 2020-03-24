---
title: Add a network security group rule in Powershell
description: Azure PowerShell Script Sample - Adds a network security group to allow inbound traffic on a specific port.
services: service-fabric
documentationcenter: 
author: athinanthny
manager: chackdan
editor: 
tags: azure-service-management

ms.assetid: 
ms.service: service-fabric
ms.workload: multiple
ms.topic: sample
ms.date: 11/28/2017
ms.author: atsenthi
ms.custom: mvc
---

# Add an inbound network security group rule

This sample script creates a network security group rule to allow inbound traffic on port 8081.  The script gets the network security group, creates a new network security configuration rule, and updates the network security group. Customize the parameters as needed.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

If needed, install the Azure PowerShell using the instructions found in the [Azure PowerShell guide](/powershell/azure/overview). 

## Sample script

[!code-powershell[main](../../../powershell_scripts/service-fabric/add-inbound-nsg-rule/add-inbound-nsg-rule.ps1 "Update the RDP port range values")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzResource](/powershell/module/az.resources/get-azresource) | Gets the `Microsoft.Network/networkSecurityGroups` resource. |
|[Get-AzNetworkSecurityGroup](/powershell/module/az.network/get-aznetworksecuritygroup)| Gets the network security group by name.|
|[Add-AzNetworkSecurityRuleConfig](/powershell/module/az.network/add-aznetworksecurityruleconfig)| Adds a network security rule configuration to a network security group. |
|[Set-AzNetworkSecurityGroup](/powershell/module/az.network/set-aznetworksecuritygroup)| Sets the goal state for a network security group.|

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).
