---
title: Azure PowerShell Script Sample - Upgrade an application | Microsoft Docs
description: Azure PowerShell Script Sample - Upgrade a Service Fabric application.
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
ms.topic: article
ms.date: 06/20/2017
ms.author: ryanwi
ms.custom: mvc
---

# Upgrade an application on a Service Fabric cluster

This sample script deletes a running Service Fabric application instance, unregisters an application type and version from the cluster, and deletes the application package from the cluster image store.  Deleting the application instance also deletes all the running service instances associated with that application. Customize the parameters as needed. 

If needed, install the Service Fabric PowerShell module with the [Service Fabric SDK](../service-fabric-get-started.md). 

## Sample script

[!code-powershell[main](../../../powershell_scripts/service-fabric/upgrade-application/upgrade-application.ps1 "Upgrade an application")]

## Script explanation

This script uses the following commands. Each command in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Get-ServiceFabricApplication](/powershell/module/servicefabric/get-servicefabricapplication?view=azureservicefabricps) | Gets all the applications in the Service Fabric cluster or a specific application.  |
| [Get-ServiceFabricApplicationUpgrade]() | |
| [Get-ServiceFabricApplicationType]() | |
| [Unregister-ServiceFabricApplicationType]() | |
| [Copy-ServiceFabricApplicationPackage]() | |
| [Register-ServiceFabricApplicationType]() | |
| [Start-ServiceFabricApplicationUpgrade]() | |


## Next steps

For more information on the Service Fabric PowerShell module, see [Azure PowerShell documentation](/powershell/azure/service-fabric/?view=azureservicefabricps).

Additional Powershell samples for Azure Service Fabric can be found in the [Azure PowerShell samples](../service-fabric-powershell-samples.md).
