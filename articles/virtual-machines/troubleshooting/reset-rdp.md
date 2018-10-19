---
title: Reset the password or Remote Desktop configuration on a Windows VM | Microsoft Docs
description: Learn how to reset an account password or Remote Desktop services on a Windows VM using the Azure portal or Azure PowerShell.
services: virtual-machines-windows
documentationcenter: ''
author: genlin
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 45c69812-d3e4-48de-a98d-39a0f5675777
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.topic: troubleshooting
ms.date: 03/23/2018
ms.author: genli
---

# How to reset the Remote Desktop service or its login password in a Windows VM
If you can't connect to a Windows virtual machine (VM), you can reset the local administrator password or reset the Remote Desktop service configuration (not supported on Windows Domain Controllers). You can use either the Azure portal or the VM Access extension in Azure PowerShell to reset the password. Once you have logged into the VM, you should reset the password for that user.  
If you are using PowerShell, make sure that you have the [latest PowerShell module installed and configured](/powershell/azure/overview) and are signed in to your Azure subscription. You can also [perform these steps for VMs created with the Classic deployment model](https://docs.microsoft.com/azure/virtual-machines/windows/classic/reset-rdp).

## Ways to reset configuration or credentials
You can reset Remote Desktop services and credentials in a few different ways, depending on your needs:

- [Reset using the Azure portal](#azure-portal)
- [Reset using Azure PowerShell](#vmaccess-extension-and-powershell)

## Azure portal
To expand the portal menu, click the three bars in the upper left corner and then click **Virtual machines**:

![Browse for your Azure VM](./media/reset-rdp/Portal-Select-VM.png)

### **Reset the local administrator account password**

Select your Windows virtual machine then click **Support + Troubleshooting** > **Reset password**. The password reset blade is displayed:

![Password reset page](./media/reset-rdp/Portal-RM-PW-Reset-Windows.png)

Enter the username and a new password, then click **Update**. Try connecting to your VM again.

### **Reset the Remote Desktop service configuration**

Select your Windows virtual machine then click **Support + Troubleshooting** > **Reset password**. The password reset blade is displayed. 

![Reset RDP configuration](./media/reset-rdp/Portal-RM-RDP-Reset.png)

Select **Reset configuration only** from the drop-down menu, then click **Update**. Try connecting to your VM again.


## VMAccess extension and PowerShell
Make sure that you have the [latest PowerShell module installed and configured](/powershell/azure/overview) and are signed in to your Azure subscription with the `Connect-AzureRmAccount` cmdlet.

### **Reset the local administrator account password**
Reset the administrator password or user name with the [Set-AzureRmVMAccessExtension](/powershell/module/azurerm.compute/set-azurermvmaccessextension) PowerShell cmdlet. The typeHandlerVersion must be 2.0 or greater, as version 1 is deprecated. 

```powershell
$SubID = "<SUBSCRIPTION ID>" 
$RgName = "<RESOURCE GROUP NAME>" 
$VmName = "<VM NAME>" 
$Location = "<LOCATION>" 
 
Connect-AzureRmAccount 
Select-AzureRMSubscription -SubscriptionId $SubID 
Set-AzureRmVMAccessExtension -ResourceGroupName $RgName -Location $Location -VMName $VmName -Credential (get-credential) -typeHandlerVersion "2.0" -Name VMAccessAgent 
```

> [!NOTE] 
> If you type a different name than the current local administrator account on your VM, the VMAccess extension will add a local administrator account with that name, and assign your specified password to that account. If the local administrator account on your VM exists, it will reset the password and if the account is disabled, the VMAccess extension enables it.

### **Reset the Remote Desktop service configuration**
Reset remote access to your VM with the [Set-AzureRmVMAccessExtension](/powershell/module/azurerm.compute/set-azurermvmaccessextension) PowerShell cmdlet. The following example resets the access extension named `myVMAccess` on the VM named `myVM` in the `myResourceGroup` resource group:

```powershell
Set-AzureRmVMAccessExtension -ResourceGroupName "myResoureGroup" -VMName "myVM" -Name "myVMAccess" -Location WestUS -typeHandlerVersion "2.0" -ForceRerun
```

> [!TIP]
> At any point, a VM can have only a single VM access agent. To set the VM access agent properties successfully, the `-ForceRerun` option can be used. When using `-ForceRerun`, make sure to use the same name for the VM access agent as used in any previous commands.

If you still can't connect remotely to your virtual machine, see more steps to try at [Troubleshoot Remote Desktop connections to a Windows-based Azure virtual machine](troubleshoot-rdp-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). If you lose connection to the Windows domain controller, you will need to restore it from a domain controller backup.

## Next steps
If the Azure VM access extension does not respond and you are unable to reset the password, you can [reset the local Windows password offline](../windows/reset-local-password-without-agent.md). This method is a more advanced process and requires you to connect the virtual hard disk of the problematic VM to another VM. Follow the steps documented in this article first, and only attempt the offline password reset method as a last resort.

[Azure VM extensions and features](../extensions/features-windows.md)

[Connect to an Azure virtual machine with RDP or SSH](http://msdn.microsoft.com/library/azure/dn535788.aspx)

[Troubleshoot Remote Desktop connections to a Windows-based Azure virtual machine](troubleshoot-rdp-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

