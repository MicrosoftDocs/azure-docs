---
title: Azure PowerShell samples - Reset Azure Cloud Services (extended support)
description: Sample scripts for resetting an Azure Cloud Service (extended support) deployment
ms.topic: sample
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---
# Reset an Azure Cloud Service (extended support) 
These samples cover various ways to reset an existing Azure Cloud Service (extended support) deployment.

## Reimage role instances of Cloud Service
```powershell
$roleInstances = @("ContosoFrontEnd_IN_0", "ContosoBackEnd_IN_1")
Reset-AzCloudService -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance $roleInstances -Reimage
```
This command reimages 2 role instances **ContosoFrontEnd\_IN\_0** and **ContosoBackEnd\_IN\_1** of Cloud Service named ContosoCS that belongs to the resource group named ContosOrg.

## Reimage all roles of Cloud Service
```powershell
Reset-AzCloudService -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance "*" -Reimage
```

## Reimage a single role instance of a Cloud Service
```powershell
Reset-AzCloudServiceRoleInstance -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstanceName "ContosoFrontEnd_IN_0" -Reimage
```

## Restart a single role instance of a Cloud Service
```powershell
Reset-AzCloudService -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance "*" -Restart
```

## Next steps

- For more information on Azure Cloud Services (extended support), see [Azure Cloud Services (extended support) overview](overview.md).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support)