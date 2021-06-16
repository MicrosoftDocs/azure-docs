---
title: Azure Government extensions | Microsoft Docs
description: This article lists virtual machine extensions available in Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''

ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 03/11/2021 
ms.custom: devx-track-azurepowershell

---
# Azure Government virtual machine extensions
This document contains a list of available [virtual machine extensions](../virtual-machines/extensions/features-windows.md) in Azure Government. To see other extensions in Azure Government, request them via the [Azure Government Feedback Forum](https://feedback.azure.com/forums/558487-azure-government).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Virtual machine extensions
You can obtain the list of virtual machine extensions available in Azure Government by [connecting to Azure Government via PowerShell](./documentation-government-get-started-connect-with-ps.md) and running the following commands:

```powershell
Connect-AzAccount -Environment AzureUSGovernment

Get-AzVmImagePublisher -Location USGovVirginia | `
Get-AzVMExtensionImageType | `
Get-AzVMExtensionImage | Select Type, Version
```
<!-- 
Get-AzVmImagePublisher -Location USGovVirginia | `
Get-AzVMExtensionImageType | `
Get-AzVMExtensionImage | `
Select Type, Version | `
Group Type | `
Sort Name | `
Select-Object @{Name="Entry";Expression={"| " + $_.Name + " | " + ($_.Group.Version -join "; ") +  " | " }} | `
Select-Object -ExpandProperty Entry | `
Out-File vm-extensions.md
-->

## Next steps
* [Deploy a Windows virtual machine extension](../virtual-machines/extensions/features-windows.md#run-vm-extensions)
* [Deploy a Linux virtual machine extension](../virtual-machines/extensions/features-linux.md#run-vm-extensions)
