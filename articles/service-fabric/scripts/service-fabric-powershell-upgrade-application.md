---
title: Upgrade a Service Fabric application in PowerShell
description: Azure PowerShell Script Sample - Upgrade and monitor an Azure Service Fabric application using PowerShell.
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
ms.date: 01/18/2018
ms.author: atsenthi
ms.custom: mvc, devx-track-azurepowershell
---

# Upgrade a Service Fabric application

This sample script upgrades a running Service Fabric application instance to version 1.3.0. The script copies the new application package to the cluster image store, registers the application type, and removes the unnecessary application package.  The script starts a monitored upgrade and continuously checks the upgrade status until the upgrade completes or rolls back. Customize the parameters as needed. 

If needed, install the Service Fabric PowerShell module with the [Service Fabric SDK](../service-fabric-get-started.md). 

## Sample script

[!code-powershell[main](../../../powershell_scripts/service-fabric/upgrade-application/upgrade-application.ps1 "Upgrade an application")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-ServiceFabricApplication](/powershell/module/servicefabric/get-servicefabricapplication) | Gets all the applications in the Service Fabric cluster or a specific application.  |
| [Get-ServiceFabricApplicationUpgrade](/powershell/module/servicefabric/get-servicefabricapplicationupgrade) | Gets the status of a Service Fabric application upgrade. |
| [Get-ServiceFabricApplicationType](/powershell/module/servicefabric/get-servicefabricapplicationtype) | Gets the Service Fabric application types registered on the Service Fabric cluster. |
| [Unregister-ServiceFabricApplicationType](/powershell/module/servicefabric/unregister-servicefabricapplicationtype) | Unregisters a Service Fabric application type.  |
| [Copy-ServiceFabricApplicationPackage](/powershell/module/servicefabric/copy-servicefabricapplicationpackage) | Copies a Service Fabric application package to the image store.  |
| [Register-ServiceFabricApplicationType](/powershell/module/servicefabric/register-servicefabricapplicationtype) | Registers a Service Fabric application type. |
| [Start-ServiceFabricApplicationUpgrade](/powershell/module/servicefabric/start-servicefabricapplicationupgrade) | Upgrades a Service Fabric application to the specified application type version. |
| [Remove-ServiceFabricApplicationPackage](/powershell/module/servicefabric/remove-servicefabricapplicationpackage) | Removes a Service Fabric application package from the image store.|


## Next steps

For more information on the Service Fabric PowerShell module, see [Azure PowerShell documentation](/powershell/azure/service-fabric/overview).

Additional PowerShell samples for Azure Service Fabric can be found in the [Azure PowerShell samples](../service-fabric-powershell-samples.md).
