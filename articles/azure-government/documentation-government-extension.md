---
title: Azure Government extensions | Microsoft Docs
description: This article lists virtual machine extensions available in Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: gsacavdm
manager: pathuff

ms.assetid: 729197f0-c531-493f-a55b-3df950327d67
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/20/2017
ms.author: gsacavdm

---
# Azure Government virtual machine extensions
This document contains a list of available [virtual machine extensions](../virtual-machines/windows/extensions-features.md) in Azure Government. If you'd like to see other extension in Azure Government, please request them via the [Azure Government Feedback Forum](https://feedback.azure.com/forums/558487-azure-government).

## Virtual machine extensions
The list of virtual machine extensions available in Azure Government can be obtained by [connecting to Azure Government via PowerShell](documentation-government-get-started-connect-with-ps.md) and running the following commands:

```powershell
Login-AzureRMAccount -Environment AzureUSGovernment

Get-AzureRmVmImagePublisher -Location USGovVirginia | `
Get-AzureRmVMExtensionImageType | `
Get-AzureRmVMExtensionImage | Select Type, Version
```
<!-- 
Get-AzureRmVmImagePublisher -Location USGovVirginia | `
Get-AzureRmVMExtensionImageType | `
Get-AzureRmVMExtensionImage | `
Select Type, Version | `
Group Type | `
Sort Name | `
Select-Object @{Name="Entry";Expression={"| " + $_.Name + " | " + ($_.Group.Version -join "; ") +  " | " }} | `
Select-Object -ExpandProperty Entry | `
Out-File vm-extensions.md
-->

The table below contains a snapshot of the list of extensions available in Azure Government as of October 10, 2017.

|Extension|Versions|
| --- | --- |
| ADETest | 1.4.0.2 | 
| AzureCATExtensionHandler | 2.2.0.68 | 
| AzureDiskEncryption | 1.1.0.1 | 
| AzureDiskEncryptionForLinux | 0.1.0.999195; 0.1.0.999196; 0.1.0.999283; 0.1.0.999297 | 
| AzureEnhancedMonitorForLinux | 2.0.0.2; 3.0.1.0 | 
| BGInfo | 2.1 | 
| ChefClient | 1210.12.109.1005 | 
| CustomScript | 2.0.2 | 
| CustomScriptExtension | 1.2; 1.3; 1.4; 1.7; 1.8 | 
| CustomScriptForLinux | 1.0; 1.1; 1.2.2.0; 1.3.0.2; 1.4.1.0; 1.5.2.0 | 
| DSC | 2.19.0.0; 2.22.0.0; 2.23.0.0; 2.24.0.0; 2.26.0.0; 2.26.1.0; 2.71.0.0 | 
| DSCForLinux | 1.0.0.0; 2.0.0.0 | 
| IaaSAntimalware | 1.3.0.0; 1.5.4.4 | 
| IaaSAutoPatchingForWindows | 1.0.1.14 | 
| IaaSDiagnostics | 1.4.3.0; 1.7.4.0; 1.9.0.0 | 
| JsonADDomainExtension | 1.3 | 
| Linux | 1.0.0.1; 1.0.0.3 | 
| LinuxChefClient | 1210.12.109.1005 | 
| LinuxDEBIAN7 | 1.0.0.3 | 
| LinuxDEBIAN8 | 1.0.0.3 | 
| LinuxDiagnostic | 2.0.9005; 2.1.9005; 2.2.9005; 2.3.9005; 2.3.9007; 2.3.9011; 2.3.9013; 2.3.9015; 2.3.9017; 2.3.9021 | 
| LinuxOL6 | 1.0.0.1; 1.0.0.3 | 
| LinuxRHEL6 | 1.0.0.1; 1.0.0.3 | 
| LinuxRHEL7 | 1.0.0.1; 1.0.0.3 | 
| LinuxSLES11SP3 | 1.0.0.1; 1.0.0.3 | 
| LinuxSLES11SP4 | 1.0.0.1; 1.0.0.3 | 
| LinuxUBUNTU1404 | 1.0.0.0; 1.0.0.3 | 
| LinuxUBUNTU1604 | 1.0.0.3 | 
| MicrosoftMonitoringAgent | 1.0.11030.0; 1.0.11030.1; 1.0.11030.2; 1.0.11049.1 | 
| NetworkWatcherAgentLinux | 1.4.270.0 | 
| NetworkWatcherAgentWindows | 1.4.270.0 | 
| OmsAgentForLinux | 1.2.75.0; 1.4.45.2 | 
| OSPatchingForLinux | 1.0.1.1; 2.0.0.5; 2.1.0.0; 2.2.0.0; 2.3.0.1 | 
| RDMAUpdateForLinux | 0.1.0.9 | 
| SqlIaaSAgent | 1.2.11.0; 1.2.15.0; 1.2.16.0; 1.2.17.0; 1.2.18.0 | 
| VMAccessAgent | 2.0; 2.0.2; 2.3 | 
| VMAccessForLinux | 1.0; 1.1; 1.2; 1.3.0.1; 1.4.0.0; 1.4.5.0 | 
| VMBackupForLinuxExtension | 0.1.0.995; 0.1.0.993 | 
| VMJITAccessExtension | 1.0.0.0 | 
| VMSnapshot | 1.0.17.0; 1.0.22.0; 1.0.23.0; 1.0.26.0; 1.0.27.0 | 
| VMSnapshotLinux | 1.0.9103.0; 1.0.9111.0; 1.0.9112.0; 1.0.9117.0; 1.0.9118.0 | 
| VSRemoteDebugger | 1.1.3.0 | 
| Windows | 1.0.0.1; 1.0.0.3 | 

## Next steps
* [Deploy a Windows virtual machine extension](../virtual-machines/windows/extensions-features.md#run-vm-extensions)
* [Deploy a Linux virtual machine extension](../virtual-machines/linux/extensions-features.md#run-vm-extensions)
