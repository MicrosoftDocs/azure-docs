---
title: Manage accelerated networking for Azure Virtual Machines
description: Learn how to manage the accelerated networking feature of Azure Virtual Machines. Use the Azure portal, Azure CLI, or PowerShell to enable or disable accelerated networking.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: how-to #Don't change
ms.date: 01/07/2025

#customer intent: As a network or virtual machine administrator, I want to manage the accelerated networking feature of my Azure Virtual Machines. I want to enable or disable accelerated networking using the Azure portal, Azure CLI, or PowerShell.

---

# Manage accelerated networking for Azure Virtual Machines

The article discusses how to enable and manage Accelerated Networking on existing Azure Virtual Machines.

## Prerequisites

### [Portal](#tab/portal)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

### [PowerShell](#tab/powershell)

- An Azure account with an active subscription. You can [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [cloud-shell-try-it.md](~/reusable-content/ce-skilling/azure/includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this article requires the Azure PowerShell module version 1.0.0 or later. Run `Get-Module -ListAvailable Az` to find the installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you're running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

### [CLI](#tab/cli)

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

---

## Handle dynamic binding and revocation of virtual function

Binding to the synthetic network interface exposed in the virtual machine is a mandatory requirement for all applications that take advantage of Accelerated Networking. 

Applications running directly over the virtual function network interface miss some packets destined for the virtual machine. These packets appear over the synthetic interface instead.

You must run an application over the synthetic network interface to guarantee that the application receives all packets that are destined to it. Binding to the synthetic network interface also ensures that the application keeps running even if the virtual function is revoked during host servicing.

For more information about application binding requirements, see [How Accelerated Networking works in Linux and FreeBSD VMs](./accelerated-networking-how-it-works.md#application-usage).

Test the functionality on any Windows Hyper-V server to ensure that your custom image or applications correctly support the dynamic binding and revocation of virtual functions. Use a local Windows Server running Hyper-V in the following configuration:

 - Ensure you have a physical network adapter that supports SR-IOV.

 - An external virtual switch is created on top of this SR-IOV adapter with "Enable single-root I/O virtualization (SR-IOV)" checked.

 - A virtual machine running your operating system image or application is created/deployed.

 - The network adapters for this virtual machine, under Hardware Acceleration, have "Enable SR-IOV" selected.

Once you've verified your virtual machine and application are leveraging a network adapter using SR-IOV, you can modify the following example commands to toggle SR-IOV off/on in order to revoke and add the virtual function which will simulate what happens during Azure host servicing:

``` Powershell
# Get the virtual network adapter to test
$vmNic = Get-VMNetworkAdapter -VMName "myvm" | where {$_.MacAddress -eq "001122334455"}

# Enable SR-IOV on a virtual network adapter
Set-VMNetworkAdapter $vmNic -IovWeight 100 -IovQueuePairsRequested 1

# Disable SR-IOV on a virtual network adapter
Set-VMNetworkAdapter $vmNic -IovWeight 0
```
<a name="enable-accelerated-networking-on-existing-vms"></a>

## Manage Accelerated Networking on existing VMs

It's possible to enable Accelerated Networking on an existing VM. The VM must meet the following requirements to support Accelerated Networking:

- A supported size for Accelerated Networking.

- A supported Azure Marketplace image and kernel version for Linux.

- Stopped or deallocated before you can enable Accelerated Networking on any NIC. This requirement applies to all individual VMs or VMs in an availability set or Azure Virtual Machine Scale Sets.

### Enable Accelerated Networking on individual VMs or VMs in availability sets

### [Portal](#tab/portal)

When you [create a VM in the Azure portal](/azure/virtual-machines/linux/quick-create-portal), you can select the **Enable accelerated networking** checkbox on the **Networking** tab of the **Create a virtual machine** screen.

If the VM uses a [supported operating system](./accelerated-networking-overview.md#supported-operating-systems) and [VM size](./accelerated-networking-overview.md#supported-vm-instances) for Accelerated Networking, the **Enable accelerated networking** checkbox on the **Networking** tab of the **Create a virtual machine** screen is automatically selected. If Accelerated Networking isn't supported, the checkbox isn't selected, and a message explains the reason.

>[!NOTE]
>- You can enable Accelerated Networking during portal VM creation only for Azure Marketplace supported operating systems. To create and enable Accelerated Networking for a VM with a custom OS image, you must use Azure CLI or PowerShell.
>
>- The Accelerated Networking setting in the portal shows the user-selected state. Accelerated Networking allows choosing **Disabled** in the portal even if the VM size requires Accelerated Networking. VM sizes that require Accelerated Networking enable Accelerated Networking at runtime regardless of the user setting in the portal.

To enable or disable Accelerated Networking for an existing VM through the Azure portal:

1. From the [Azure portal](https://portal.azure.com) page for the VM, select **Networking** from the left menu.

1. On the **Networking** page, select the **Network Interface**.

1. At the top of the NIC **Overview** page, select **Edit accelerated networking**.

1. Select **Automatic**, **Enabled**, or **Disabled**, and then select **Save**.

To confirm whether Accelerated Networking is enabled for an existing VM:

1. From the portal page for the VM, select **Networking** from the left menu.

1. On the **Networking** page, select the **Network Interface**.

1. On the network interface **Overview** page, under **Essentials**, note whether **Accelerated networking** is set to **Enabled** or **Disabled**.

To confirm whether Accelerated Networking is enabled for an existing VM:

1. From the [Azure portal](https://portal.azure.com) page for the VM, select **Networking** from the left menu.

1. On the **Networking** page, select the **Network Interface**.

1. On the NIC **Overview** page, under **Essentials**, note whether **Accelerated networking** is set to **Enabled** or **Disabled**.

### [PowerShell](#tab/powershell)

1. Stop or deallocate the VM or, if an availability set, all the VMs in the set:

   ```azurepowershell
   Stop-AzVM -ResourceGroup "<myResourceGroup>" -Name "<myVM>"
   ```

   If you created your VM individually without an availability set, you must stop or deallocate only the individual VM to enable Accelerated Networking. If you created your VM with an availability set, you must stop or deallocate all VMs in the set, so the VMs end up on a cluster that supports Accelerated Networking.

   The stop or deallocate requirement is unnecessary to disable Accelerated Networking. Clusters that support Accelerated Networking also work fine with NICs that don't use Accelerated Networking.

1. Enable Accelerated Networking on the NIC of your VM:

   ```azurepowershell
   $nic = Get-AzNetworkInterface -ResourceGroupName "<myResourceGroup>" -Name "<myNic>"
   
   $nic.EnableAcceleratedNetworking = $true
   
   $nic | Set-AzNetworkInterface
   ```

3. Restart your VM, or all the VMs in the availability set, and [confirm that Accelerated Networking is enabled](./create-virtual-machine-accelerated-networking.md#confirm-that-accelerated-networking-is-enabled).

   ```azurepowershell
   Start-AzVM -ResourceGroup "<myResourceGroup>" -Name "<myVM>"
   ```

### Enable Accelerated Networking on Virtual Machine Scale Sets

Azure Virtual Machine Scale Sets is slightly different but follows the same workflow.

1. Stop the VMs:

   ```azurepowershell
   Stop-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myScaleSet>"
    ```

1. Update the Accelerated Networking property under the NIC:

   ```azurepowershell
   $vmss = Get-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myScaleSet>"
   
   $vmss.VirtualMachineProfile.NetworkProfile.NetworkInterfaceConfigurations[0].EnableAcceleratedNetworking = $true
   
   Update-AzVmss 
     -ResourceGroupName "<myResourceGroup>" `
     -VMScaleSetName "<myScaleSet>" `
     -VirtualMachineScaleSet $vmss
   ```

1. Virtual Machine Scale Sets has an upgrade policy that applies updates by using automatic, rolling, or manual settings. Set the upgrade policy to automatic so that the changes are immediately picked up.

   ```azurepowershell
   $vmss.UpgradePolicy.Mode = "Automatic"
   
   Update-AzVmss 
     -ResourceGroupName "<myResourceGroup>" `
     -VMScaleSetName "<myScaleSet>" `
     -VirtualMachineScaleSet $vmss
   ```

1. Restart the scale set:

   ```azurepowershell
   Start-AzVmss -ResourceGroupName "<myResourceGroup>" -VMScaleSetName "<myScaleSet>"

### [CLI](#tab/cli)

1. First, stop and deallocate the VM, or all the VMs in the availability set.

   ```azurecli
   az vm deallocate \
     --resource-group <myResourceGroup> \
     --name <myVm>
   ```

   If you created your VM individually without an availability set, you must stop or deallocate only the individual VM to enable Accelerated Networking. If you created your VM with an availability set, you must stop or deallocate all VMs in the set before you can enable Accelerated Networking on any of the NICs.

1. Once the VM is stopped, enable Accelerated Networking on the NIC of your VM.

   ```azurecli
   az network nic update \
     --name <myNic> \
     --resource-group <myResourceGroup> \
     --accelerated-networking true
   ```

1. Restart your VM, or all the VMs in the availability set, and [confirm that Accelerated Networking is enabled](./create-virtual-machine-accelerated-networking.md#confirm-that-accelerated-networking-is-enabled).

   ```azurecli
   az vm start --resource-group <myResourceGroup> \
     --name <myVm>
   ```

### Enable Accelerated Networking on Virtual Machine Scale Sets

Azure Virtual Machine Scale Sets is slightly different, but follows the same workflow.

1. First, stop the VMs:

   ```azurecli
   az vmss deallocate \
     --name <myVmss> \
     --resource-group <myResourceGroup>
   ```

1. Once the VMs are stopped, update the Accelerated Networking property under the network interface.

   ```azurecli
   az vmss update --name <myVmss> \
     --resource-group <myResourceGroup> \
     --set virtualMachineProfile.networkProfile.networkInterfaceConfigurations[0].enableAcceleratedNetworking=true
   ```

1. Virtual Machine Scale Sets has an upgrade policy that applies updates by using automatic, rolling, or manual settings. The following instructions set the policy to automatic so Virtual Machine Scale Sets picks up the changes immediately after restart.

   ```azurecli
   az vmss update \
     --name <myVmss> \
     --resource-group <myResourceGroup> \
     --set upgradePolicy.mode="automatic"
   ```

1. Finally, restart Virtual Machine Scale Sets.

   ```azurecli
   az vmss start \
     --name <myVmss> \
     --resource-group <myResourceGroup>
   ```

---

Once you restart and the upgrades finish, the VF appears inside VMs that use a supported OS and VM size.

### Resize existing VMs with Accelerated Networking

You can resize VMs with Accelerated Networking enabled only to sizes that also support Accelerated Networking. You can't resize a VM with Accelerated Networking to a VM instance that doesn't support Accelerated Networking by using the resize operation. Instead, use the following process to resize these VMs:

1. Stop and deallocate the VM or all the VMs in the availability set or Virtual Machine Scale Sets.

1. Disable Accelerated Networking on the NIC of the VM or all the VMs in the availability set or Virtual Machine Scale Sets.

1. Move the VM or VMs to a new size that doesn't support Accelerated Networking, and restart them.

## Related content

* [Create an Azure Virtual Machine with Accelerated Networking](create-virtual-machine-accelerated-networking.md)

