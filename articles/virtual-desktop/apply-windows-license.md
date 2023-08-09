---
title: Apply Windows license to session host virtual machines - Azure
description: Describes how to apply the Windows license for Azure Virtual Desktop VMs.
author: Heidilohr
ms.topic: how-to
ms.date: 11/14/2022
ms.author: helohr 
---
# Apply Windows license to session host virtual machines

Customers who are properly licensed to run Azure Virtual Desktop workloads are eligible to apply a Windows license to their session host virtual machines and run them without paying for another license. For more information, see [Azure Virtual Desktop pricing](https://azure.microsoft.com/pricing/details/virtual-desktop/).

## Ways to apply an Azure Virtual Desktop license

Azure Virtual Desktop licensing allows you to apply a license to any Windows or Windows Server virtual machine (VM) that's registered as a session host in a host pool and receives user connections. This license doesn't apply to virtual machines running as file share servers, domain controllers, and so on.

You can apply an Azure Virtual Desktop license to your VMs with the following methods:

- You can create a host pool and its session host virtual machines [in the Azure portal](./create-host-pools-azure-marketplace.md). Creating VMs in the Azure portal automatically applies the license.
- You can create a host pool and its session host virtual machines using the [GitHub Azure Resource Manager template](https://github.com/Azure/RDS-Templates/tree/master/ARM-wvd-templates). Creating VMs with this method automatically applies the license.
- You can manually apply a license to an existing session host virtual machine. To apply the license this way, first follow the instructions in [Create a host pool with PowerShell or the Azure CLI](./create-host-pools-powershell.md) to create a host pool and associated VMs, then return to this article to learn how to apply the license.

## Manually apply a Windows license to a Windows client session host VM

>[!NOTE]
>The directions in this section apply to Windows client VMs, not Windows Server VMs.

Before you start, make sure you've [installed and configured the latest version of Azure PowerShell](/powershell/azure/). 

Next, run the following PowerShell cmdlet to apply the Windows license:

```powershell
$vm = Get-AzVM -ResourceGroup <resourceGroupName> -Name <vmName>
$vm.LicenseType = "Windows_Client"
Update-AzVM -ResourceGroupName <resourceGroupName> -VM $vm
```

## Verify your session host VM is utilizing the licensing benefit

After deploying your VM, run this cmdlet to verify the license type:

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

## Using Windows Server as session hosts

If you deploy Windows Server as session hosts in Azure Virtual Desktop, a Remote Desktop Services license server must be accessible from those virtual machines. The Remote Desktop Services license server can be located on-premises or in Azure, as long as there is network connectivity between the session hosts and license server. For more information, see [Activate the Remote Desktop Services license server](/windows-server/remote/remote-desktop-services/rds-activate-license-server).

## Known limitations

If you create a Windows Server session host using the Azure Virtual Desktop host pool creation process, the process might automatically assign it an incorrect license type. To change the license type using PowerShell, follow the instructions in [Convert an existing VM using Azure Hybrid Benefit for Windows Server](../virtual-machines/windows/hybrid-use-benefit-licensing.md#powershell-1).
