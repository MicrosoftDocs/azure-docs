---
title: Azure PowerShell Samples - Reset Azure Cloud Services (extended support)
description: Sample scripts for resetting an Azure Cloud Service (extended support) information
ms.topic: sample
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---
# Reset an Azure Cloud Service (extended support) 
This article covers various examples that can be used to reset an existing Azure Cloud Service (extended support) deployments.

### Example 1: Reimage role instances of cloud service
```powershell
PS C:\> $roleInstances = @("ContosoFrontEnd_IN_0", "ContosoBackEnd_IN_1")
PS C:\> Reset-AzCloudService -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance $roleInstances -Reimage
```
This command reimages 2 role instances ContosoFrontEnd\_IN\_0 and  ContosoBackEnd\_IN\_1 of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

### Example 2: Reimage all roles of cloud service
```powershell
PS C:\> Reset-AzCloudService -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance "*" -Reimage
```
This command reimages all role instances of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

### Example 3: Reimage a single role instance of a cloud service
```powershell
PS C:\> Reset-AzCloudServiceRoleInstance -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstanceName "ContosoFrontEnd_IN_0" -Reimage
```
This command reimages role instance named ContosoFrontEnd\_IN\_0 of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

### Example 4: Restart a single role instance of a cloud service
```powershell
PS C:\> Reset-AzCloudService -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance "*" -Restart
```
This command restarts role instance named ContosoFrontEnd\_IN\_0 of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

## Next steps

For more information on Azure Cloud Services (extended support), see [Azure Cloud Services (extended support) overview](overview.md)