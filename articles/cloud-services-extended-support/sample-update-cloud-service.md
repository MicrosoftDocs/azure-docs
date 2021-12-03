---
title: Azure PowerShell samples - Update an Azure Cloud Service (extended support)
description: Sample scripts for updating Azure Cloud Service (extended support) deployments
ms.topic: sample
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: devx-track-azurepowershell
---

# Update an Azure Cloud Service (extended support)

These samples cover various ways to update an existing Azure Cloud Service (extended support) deployment.

## Add an extension to existing Cloud Service
Below set of commands adds a RDP extension to already existing cloud service named ContosoCS that belongs to the resource group named ContosOrg.
```powershell
# Create RDP extension object
$rdpExtension = New-AzCloudServiceRemoteDesktopExtensionObject -Name "RDPExtension" -Credential $credential -Expiration $expiration -TypeHandlerVersion "1.2.1"
# Get existing cloud service
$cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"
# Add RDP extension to existing cloud service extension object
$cloudService.ExtensionProfile.Extension = $cloudService.ExtensionProfile.Extension + $rdpExtension
# Update cloud service
$cloudService | Update-AzCloudService
```

## Remove all extensions from a Cloud Service
Below set of commands removes all extensions from existing cloud service named ContosoCS that belongs to the resource group named ContosOrg.
```powershell
# Get existing cloud service
$cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"
# Set extension to empty list
$cloudService.ExtensionProfile.Extension = @()
# Update cloud service
$cloudService | Update-AzCloudService
```

## Remove the remote desktop extension from Cloud Service
Below set of commands removes RDP extension from existing cloud service named ContosoCS that belongs to the resource group named ContosOrg.
```powershell
# Get existing cloud service
$cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"
# Remove extension by name RDPExtension
$cloudService.ExtensionProfile.Extension = $cloudService.ExtensionProfile.Extension | Where-Object { $_.Name -ne "RDPExtension" }
# Update cloud service
$cloudService | Update-AzCloudService
```

## Scale-out / scale-in role instances
Below set of commands shows how to scale-out and scale-in role instance count for cloud service named ContosoCS that belongs to the resource group named ContosOrg.
```powershell
# Get existing cloud service
$cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"

# Scale-out all role instance count by 1
$cloudService.RoleProfile.Role | ForEach-Object {$_.SkuCapacity += 1}

# Scale-in ContosoFrontend role instance count by 1
$role = $cloudService.RoleProfile.Role | Where-Object {$_.Name -eq "ContosoFrontend"}
$role.SkuCapacity -= 1

# Update cloud service configuration as per the new role instance count
$cloudService.Configuration = $configuration

# Update cloud service
$cloudService | Update-AzCloudService
```

## Next steps
For more information on Azure Cloud Services (extended support), see [Azure Cloud Services (extended support) overview](overview.md).
- Visit the [Cloud Services (extended support) samples repository](https://github.com/Azure-Samples/cloud-services-extended-support)
