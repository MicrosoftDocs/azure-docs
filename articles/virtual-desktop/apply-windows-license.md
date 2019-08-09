---
title: Apply Windows license for Windows Virtual Desktop session hosts - Azure
description: Describes how to apply the Windows license for Windows Virtual Desktop VMs.
services: virtual-desktop
author: ChristianMontoya

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/16/2019
ms.author: chrimo
---
# Apply Windows license for Windows Virtual Desktop session hosts

Customers who are properly licensed to run Windows Virtual Desktop workloads are eligible to apply a Windows license to their session host virtual machines and run them without paying for another license. For more information, please see [Windows Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

## Ways to use your Windows Virtual Desktop license
Windows Virtual Desktop licensing allows you to apply a license to any Windows or Windows Server virtual machine that is registered as a session host in a host pool and receives user connections. This license does not apply to virtual machines that are running as file share servers, domain controllers, etc.

There are a few ways to use the Windows Virtual Desktop license:
1. You can create a host pool and its session host virtual machines using the [Azure Marketplace offering](./create-host-pools-azure-marketplace.md). Virtual machines created this way automatically have the license applied!
2. You can create a host pool and its session host virtual machines using the [GitHub ARM template](./create-host-pools-arm-template.md). Virtual machines created this way automatically have the license applied!
3. You can apply a license to an existing session host virtual machine. Follow the steps in [create a host pool with PowerShell](./create-host-pools-powershell.md) to create a host pool and associated virtual machines, then follow the steps below to apply the license.

## Apply a Windows license to a session host VM
Make sure you have [installed and configured the latest Azure PowerShell](/powershell/azure/overview). Run the following PowerShell cmdlet to apply the Windows license.

```powershell
$vm = Get-AzVM -ResourceGroup <resourceGroupName> -Name <vmName>
$vm.LicenseType = "Windows_Client"
Update-AzVM -ResourceGroupName <resourceGroupName> -VM $vm
```


## Verify your session host VM is utilizing the licensing benefit
Once you have deployed your VM through either the PowerShell or Resource Manager deployment method, run this cmdlet to verify the license type.
```powershell
Get-AzVM -ResourceGroup <resourceGroupName> -Name <vmName>
```

A session host virtual machine with the applied Windows license will have output similar to this.

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              : Windows_Client
```

Other virtual machines without the applied Windows license will have output similar to this.

```powershell
Type                     : Microsoft.Compute/virtualMachines
Location                 : westus
LicenseType              :
```

To see a full list of session host virtual machines in your Azure subscription that have the Windows license applied, run the following cmdlet.

```powershell
$vms = Get-AzVM
$vms | ?{$_.LicenseType -like "Windows_Client"} | select ResourceGroupName, Name, LicenseType
```