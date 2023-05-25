---
title: Update the RDP username and password in PowerShell
description: Azure PowerShell Script Sample - Update the RDP username and password for all Service Fabric cluster nodes of a specific node type.
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
ms.date: 03/19/2018
ms.author: atsenthi
ms.custom: mvc, devx-track-azurepowershell
---

# Update the admin username and password of the VMs in a cluster

Each [node type](../service-fabric-cluster-nodetypes.md) in a Service Fabric cluster is a virtual machine scale set. This sample script updates the admin username and password for the cluster virtual machines in a specific node type.  Add the VMAccessAgent extension to the scale set, because the admin password is not a modifiable scale set property.  The username and password changes apply to all nodes in the scale set. Customize the parameters as needed.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/). 

## Sample script

[!code-powershell[main](../../../powershell_scripts/service-fabric/change-rdp-user-and-pw/change-rdp-user-and-pw.ps1 "Updates a RDP username and password for cluster nodes")]

## Script explanation

This script uses the following commands: Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-AzVmss](/powershell/module/az.compute/get-azvmss) | Gets the properties of a cluster node type (a virtual machine scale set).   |
| [Add-AzVmssExtension](/powershell/module/az.compute/add-azvmssextension)| Adds an extension to the virtual machine scale set.|
| [Update-AzVmss](/powershell/module/az.compute/update-azvmss)|Updates the state of a virtual machine scale set to the state of a local VMSS object.|

## Duration

A single node type with five nodes, for example, has a duration of 45 to 60 minutes to change the username or password. 

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure Service Fabric can be found in the [Azure PowerShell samples](../service-fabric-powershell-samples.md).
