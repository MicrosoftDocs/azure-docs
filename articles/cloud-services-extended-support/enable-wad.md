---
title: Apply the Windows Azure diagnostics extension in Cloud Services (extended support) 
description: Apply the Windows Azure diagnostics extension for Cloud Services (extended support)
ms.topic: how-to
ms.service: cloud-services-extended-support
author: gachandw
ms.author: gachandw
ms.reviewer: mimckitt
ms.date: 10/13/2020
ms.custom: 
---

# Apply the Windows Azure diagnostics extension in Cloud Services (extended support) 
You can monitor key performance metrics for any cloud service. Every cloud service role collects minimal data: CPU usage, network usage, and disk utilization. If the cloud service has the Microsoft.Azure.Diagnostics extension applied to a role, that role can collect additional points of data. For more information, see [Extensions Overview](extensions.md)

Windows Azure Diagnostics extension can be enabled for Cloud Services (extended support) through [PowerShell](deploy-powershell.md) or [ARM template](deploy-template.md)

## Apply Windows Azure Diagnostics extension using PowerShell

Apply to an existing Cloud Service (extended support) deployment

```powershell
# Create RDP extension object
$rdpExtension = New-AzCloudServiceRemoteDesktopExtensionObject -Name "RDPExtension" -Credential $credential -Expiration $expiration -TypeHandlerVersion "1.2.1"
# Get existing Cloud Service
$cloudService = Get-AzCloudService -ResourceGroup "ContosOrg" -CloudServiceName "ContosoCS"
# Add RDP extension to existing Cloud Service extension object
$cloudService.ExtensionProfileExtension = $cloudService.ExtensionProfileExtension + $rdpExtension
# Update Cloud Service
$cloudService | Update-AzCloudService
```