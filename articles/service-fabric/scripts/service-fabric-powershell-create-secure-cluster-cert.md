---
title: Create a Service Fabric cluster in PowerShell
description: Azure PowerShell Script Sample - Create a Service Fabric cluster secured with an X.509 certificate.
services: service-fabric
documentationcenter: 
author: athinanthny
manager: chackdan
editor: 
tags: azure-service-management

ms.assetid: 0f9c8bc5-3789-4eb3-8deb-ae6e2200795a
ms.service: service-fabric
ms.workload: multiple
ms.topic: sample
ms.date: 01/19/2018
ms.author: atsenthi
ms.custom: mvc, devx-track-azurepowershell
---

# Create a Service Fabric cluster

This sample script creates a five-node Service Fabric cluster secured with an X.509 certificate.  The command creates a self-signed certificate and uploads it to a new key vault. The certificate is also copied to a local directory.  Set the *-OS* parameter to choose the version of Windows or Linux that runs on the cluster nodes.  Customize the parameters as needed.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

If needed, install the Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/) and then run `Connect-AzAccount` to create a connection with Azure. 

## Sample script

[!code-powershell[main](../../../powershell_scripts/service-fabric/create-secure-cluster/create-secure-cluster.ps1 "Create a Service Fabric cluster")]

## Clean up deployment 

After the script sample has been run, the following command can be used to remove the resource group, cluster, and all related resources.

```powershell
$groupname="mysfclustergroup"
Remove-AzResourceGroup -Name $groupname -Force
```

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [New-AzServiceFabricCluster](/powershell/module/az.servicefabric/New-azServiceFabricCluster) | Creates a new Service Fabric cluster. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

Additional Azure PowerShell samples for Azure Service Fabric can be found in the [Azure PowerShell samples](../service-fabric-powershell-samples.md).
