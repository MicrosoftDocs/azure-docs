---
title: Apply Windows license to session host virtual machines - Azure
description: Describes how to apply the Windows license for Windows Virtual Desktop VMs.
services: virtual-desktop
author: ChristianMontoya

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/14/2019
ms.author: chrimo
---
# Apply Windows license to session host virtual machines

Customers who are properly licensed to run Windows Virtual Desktop workloads are eligible to apply a Windows license to their session host virtual machines and run them without paying for another license. For more information, see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

## Ways to use your Windows Virtual Desktop license
Windows Virtual Desktop licensing allows you to apply a license to any Windows or Windows Server virtual machine that is registered as a session host in a host pool and receives user connections. This license does not apply to virtual machines that are running as file share servers, domain controllers, and so on.

There are a few ways to use the Windows Virtual Desktop license:
- You can create a host pool and its session host virtual machines using the [Azure Marketplace offering](./create-host-pools-azure-marketplace.md). Virtual machines created this way automatically have the license applied.
- You can create a host pool and its session host virtual machines using the [GitHub Azure Resource Manager template](./virtual-desktop-fall-2019/create-host-pools-arm-template.md). Virtual machines created this way automatically have the license applied.
- You can apply a license to an existing session host virtual machine. To do this, first follow the instructions in [Create a host pool with PowerShell](./create-host-pools-powershell.md) to create a host pool and associated VMs, then return to this article to learn how to apply the license.

## Apply a Windows license to a session host VM
Make sure you have [installed and configured the latest Azure PowerShell](/powershell/azure/overview). Run the following PowerShell cmdlet to apply the Windows license:

```powershell
$vm = Get-AzVM -ResourceGroup <resourceGroupName> -Name <vmName>
$vm.LicenseType = "Windows_Client"
Update-AzVM -ResourceGroupName <resourceGroupName> -VM $vm
```

## Verify your session host VM is utilizing the licensing benefit
After deploying your VM, run this cmdlet ot verify the license type:
```powershell
Get-AzVM -ResourceGroupName <resourceGroupName> -Name <vmName>
```

A session host VM with the applied Windows license will show you something like this:

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : Windows_Client
```

VMs without the applied Windows license will show you something like this:

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              :
```

Run the following cmdlet to see a list of all session host VMs that have the Windows license applied in your Azure subscription:

```powershell
$vms = Get-AzVM
$vms | Where-Object {$_.LicenseType -like "Windows_Client"} | Select-Object ResourceGroupName, Name, LicenseType
```
