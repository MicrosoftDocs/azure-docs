---
title: Azure PowerShell samples - Update an Azure Cloud Service (extended support)
description: Sample scripts for updating Azure Cloud Service (extended support) deployments
ms.topic: sample
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Update an Azure Cloud Service (extended support)

These samples cover various ways to update an existing Azure Cloud Service (extended support) deployment.

## Example 1: Add an extension to existing cloud service
```powershell
# Create RDP extension object
 $rdpExtension = New-AzCloudServiceRemoteDesktopExtensionObject -Name "RDPExtension" -Credential $credential -Expiration $expiration -TypeHandlerVersion "1.2.1"
# Get existing cloud service
 $cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"
# Add RDP extension to existing cloud service extension object
 $cloudService.ExtensionProfileExtension = $cloudService.ExtensionProfileExtension + $rdpExtension
# Update cloud service
 $cloudService | Update-AzCloudService
```

## Example 2: Remove all extensions from cloud service
```powershell
# Get existing cloud service
 $cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"
# Set extension to empty list
 $cloudService.ExtensionProfileExtension = @()
# Update cloud service
 $cloudService | Update-AzCloudService
```

## Example 3: Remove RDP extension from cloud service
```powershell
# Get existing cloud service
 $cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"
# Remove extension by name RDPExtension
 $cloudService.ExtensionProfileExtension = $cloudService.ExtensionProfileExtension | Where-Object { $_.Name -ne "RDPExtension" }
# Update cloud service
 $cloudService | Update-AzCloudService
```

## Example 4: Scale-Out / Scale-In role instances
```powershell
# Get existing cloud service
 $cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"

# Scale-out all role instance count by 1
 $cloudService.RoleProfileRole | ForEach-Object {$_.SkuCapacity += 1}

# Scale-in ContosoFrontend role instance count by 1
 $role = $cloudService.RoleProfileRole | Where-Object {$_.Name -eq "ContosoFrontend"}
 $role.SkuCapacity -= 1

# Update cloud service configuration as per the new role instance count
 $cloudService.Configuration = $configuration

# Update cloud service
 $cloudService | Update-AzCloudService
```

## Next steps
For more information on Azure Cloud Services (extended support), see [Azure Cloud Services (extended support) overview](overview.md)