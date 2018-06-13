---
title: Azure PowerShell Script Sample - Add a network security group rule | Microsoft Docs
description: Azure PowerShell Script Sample - Adds a network security group to allow inbound traffic on a specific port.
services: service-fabric
documentationcenter: 
author: rwike77
manager: timlt
editor: 
tags: azure-service-management

ms.assetid: 
ms.service: service-fabric
ms.workload: multiple
ms.devlang: na
ms.topic: sample
ms.date: 11/28/2017
ms.author: ryanwi
ms.custom: mvc
---

# Add an inbound network security group rule

This sample script creates a network security group rule to allow inbound traffic on port 8081.  The script gets the `Microsoft.Network/networkSecurityGroups` resource that the cluster is located in, creates a new network security configuration rule, and updates the network security group. Customize the parameters as needed.

If needed, install the Azure PowerShell using the instructions found in the [Azure PowerShell guide](/powershell/azure/overview). 

## Sample script

[!code-powershell[main](../../../powershell_scripts/service-fabric/add-inbound-nsg-rule/add-inbound-nsg-rule.ps1 "Update the RDP port range values")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzureRmResource](/powershell/module/azurerm.resources/get-azurermresource) | Gets the `Microsoft.Network/networkSecurityGroups` resource. |
|[Get-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/get-azurermnetworksecuritygroup)| Gets the network security group by name.|
|[Add-AzureRmNetworkSecurityRuleConfig](/powershell/module/azurerm.network/add-azurermnetworksecurityruleconfig)| Adds a network security rule configuration to a network security group. |
|[Set-AzureRmNetworkSecurityGroup](/powershell/module/azurerm.network/set-azurermnetworksecuritygroup)| Sets the goal state for a network security group.|

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).
