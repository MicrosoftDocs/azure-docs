---
title: Azure PowerShell samples - Reset Azure Cloud Services (extended support)
description: Sample scripts for resetting an Azure Cloud Service (extended support) deployment
ms.topic: sample
ms.service: azure-cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 07/24/2024
ms.custom: devx-track-azurepowershell
# Customer intent: As a cloud administrator, I want PowerShell scripts for resetting Azure Cloud Service deployments so that I can efficiently manage and recover service instances.
---
# Reset an Azure Cloud Service (extended support) 

> [!IMPORTANT]
> As of March 31, 2025, cloud Services (extended support) is deprecated and will be fully retired on March 31, 2027. [Learn more](https://aka.ms/csesretirement) about this deprecation and [how to migrate](https://aka.ms/cses-retirement-march-2025).

These samples cover various ways to reset an existing Azure Cloud Service (extended support) deployment.

## Reimage role instances of cloud service
```powershell
$roleInstances = @("ContosoFrontEnd_IN_0", "ContosoBackEnd_IN_1")
Invoke-AzCloudServiceReimage -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance $roleInstances
```
This command reimages two role instances ContosoFrontEnd_IN_0 and ContosoBackEnd_IN_1 of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

## Reimage all roles of Cloud Service
```powershell
Invoke-AzCloudServiceReimage -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance "*"
```
This command reimages all role instances of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

## Reimage a single role instance of a Cloud Service
```powershell
Invoke-AzCloudServiceRoleInstanceReimage -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstanceName "ContosoFrontEnd_IN_0"
```
This command reimages role instance named ContosoFrontEnd_IN_0 of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

## Rebuild role instances of cloud service
```powershell
$roleInstances = @("ContosoFrontEnd_IN_0", "ContosoBackEnd_IN_1")
Invoke-AzCloudServiceRebuild -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance $roleInstances
```
This command rebuilds two role instances ContosoFrontEnd_IN_0 and ContosoBackEnd_IN_1 of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

## Rebuild all roles of cloud service
```powershell
Invoke-AzCloudServiceRebuild -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance "*"
```
This command rebuilds all role instances of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

## Restart role instances of cloud service
```powershell
$roleInstances = @("ContosoFrontEnd_IN_0", "ContosoBackEnd_IN_1")
Restart-AzCloudService -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance $roleInstances
```
This command restarts two role instances ContosoFrontEnd_IN_0 and ContosoBackEnd_IN_1 of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

## Restart all roles of cloud service
```powershell
Restart-AzCloudService -ResourceGroupName "ContosOrg" -CloudServiceName "ContosoCS" -RoleInstance "*"
```
This command restarts all role instances of cloud service named ContosoCS that belongs to the resource group named ContosOrg.

## Next steps

- For more information on Azure Cloud Services (extended support), see [Azure Cloud Services (extended support) overview](overview.md).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support)
