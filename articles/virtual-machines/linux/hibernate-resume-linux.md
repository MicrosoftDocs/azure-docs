---
title: Learn about hibernating your Linux virtual machine
description: Learn how to hibernate a Linux virtual machine.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: how-to
ms.date: 05/20/2024
ms.author: jainan
ms.reviewer: mattmcinnes
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Hibernating Linux virtual machines

**Applies to:** :heavy_check_mark: Linux VMs

[!INCLUDE [hibernate-resume-intro](../includes/hibernate-resume-intro.md)]

## How hibernation works
To learn how hibernation works, check out the [hibernation overview](../hibernate-resume.md).

## Supported configurations
Hibernation support is limited to certain VM sizes and OS versions. Make sure you have a supported configuration before using hibernation.

For a list of hibernation compatible VM sizes, check out the [supported VM sizes section in the hibernation overview](../hibernate-resume.md#supported-vm-sizes).

### Supported Linux distros
The following Linux operating systems support hibernation:

- Ubuntu 22.04 LTS
- Ubuntu 20.04 LTS
- Ubuntu 18.04 LTS
- Debian 11
- Debian 10 (with backports kernel)
- RHEL 9.0 and higher (with minimum kernel version 5.14.0-70)
- RHEL 8.3 and higher (with minimum kernel version 4.18.0.240)

### Prerequisites and configuration limitations
-	Hibernation isn't supported with Trusted Launch for Linux VMs  

For general limitations, Azure feature limitations supported VM sizes, and feature prerequisites check out the ["Supported configurations" section in the hibernation overview](../hibernate-resume.md#supported-configurations).

## Creating a Linux VM with hibernation enabled

To hibernate a VM, you must first enable the feature on the VM.

To enable hibernation during VM creation, you can use the Azure portal, CLI, PowerShell, ARM templates and API. 

### [Portal](#tab/enableWithPortal)

To enable hibernation in the Azure portal, check the 'Enable hibernation' box during VM creation.

![Screenshot of the checkbox in the Azure portal to enable hibernation while creating a new Linux VM.](../media/hibernate-resume/create-vm-with-hibernation-enabled.png)


### [CLI](#tab/enableWithCLI)

To enable hibernation in the Azure CLI, create a VM by running the following [az vm create]() command with ` --enable-hibernation` set to `true`.

```azurecli
 az vm create --resource-group myRG \
   --name myVM \
   --image Ubuntu2204 \
   --public-ip-sku Standard \
   --size Standard_D2s_v5 \
   --enable-hibernation true 
```

### [PowerShell](#tab/enableWithPS)

To enable hibernation when creating a VM with PowerShell, run the following command:

```powershell
New-AzVm ` 
 -ResourceGroupName 'myRG' ` 
 -Name 'myVM' ` 
 -Location 'East US' ` 
 -VirtualNetworkName 'myVnet' ` 
 -SubnetName 'mySubnet' ` 
 -SecurityGroupName 'myNetworkSecurityGroup' ` 
 -PublicIpAddressName 'myPublicIpAddress' ` 
 -Size Standard_D2s_v5 ` 
 -Image 'imageName' ` 
 -HibernationEnabled ` 
 -OpenPorts 80,3389 
```

### [REST](#tab/enableWithREST)

To create a VM with hibernation enabled, set *hibernationEnabled* to `true`.

```json
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/{vm-name}?api-version=2021-11-01


{
  "location": "eastus",
  "properties": {
    "hardwareProfile": {
      "vmSize": "Standard_D2s_v5"
    },
    "additionalCapabilities": {
      "hibernationEnabled": true
    }
  }
}

```
To learn more about REST, check out an [API example](/rest/api/compute/virtual-machines/create-or-update#create-a-vm-with-hibernationenabled)

---

Once you've created a VM with hibernation enabled, you need to configure the guest OS to successfully hibernate your VM. 

## Enabling hibernation on an existing Linux VM 

To enable hibernation on an existing VM, you can use Azure CLI, PowerShell, or REST API. Before proceeding, ensure that the guest OS version supports hibernation on Azure. For more information, see [supported OS versions](hibernate-resume-linux.md#supported-linux-distros).



### [CLI](#tab/enableWithCLIExisting)

To enable hibernation on an existing VM using Azure CLI, first deallocate your VM with [az vm deallocate](/cli/azure/vm#az-vm-deallocate). Once the VM is deallocated, update the OS disk and VM.

1. Update the OS disk to set *supportsHibernation* to `true`. If *supportsHibernation* is already set to `true`, you can skip this step and proceed to the next step.

    ```azurecli
       az disk update --resource-group myResourceGroup \
       --name MyOSDisk \   
       --set supportsHibernation=true 
    ```

1. Update the VM to enable hibernation.

   ```azurecli
      az vm update --resource-group myResourceGroup \
      --name myVM \
      --enable-hibernation true 
   ```
1. Start the VM and then proceed to configuring hibernation in the guest OS.

   ```azurecli
      az vm start --resource-group myResourceGroup \
      --name myVM \      
   ```

### [PowerShell](#tab/enableWithPSExisting)

1. To enable hibernation on an existing VM using Azure PowerShell, first stop your VM with [Stop-Az vm deallocate](/cli/azure/vm#az-vm-deallocate). Once the VM is deallocated, update the OS disk and VM. 

   ```powershell
   Stop-AzVM `
    -ResourceGroupName 'myResourceGroup' ` 
    -Name 'myVM'
   ```

 1. Once the VM is stopped, update the OS disk to set *SupportsHibernation* to `true`. If *SupportsHibernation* is already set to `true`, you can skip this step and proceed to the next step.

    ```powershell
    $disk = Get-AzDisk `
       -ResourceGroupName "myResourceGroup" `
       -DiskName "myOSDisk"
    $disk.SupportsHibernation = $True
    Update-AzDisk `
      -ResourceGroupName ‘myResourceGroup' `
      -DiskName 'myOSDisk' `
      -Disk $disk
    ```
1. Enable hibernation on the VM.

   ```powershell
   $vm= Get-AzVM `
     -ResourceGroupName "myResourceGroup" `
     -Name "myVM"
   Update-AzVM `
     -ResourceGroupName "myResourceGroup" `
     -VM $vm `
     -HibernationEnabled
   ```
1. Start the VM and then proceed to configuring hibernation in the guest OS.

   ```powershell
   Start-AzVM `
    -ResourceGroupName 'myResourceGroup' ` 
    -Name 'myVM'
   ```
---

## Configuring hibernation in the guest OS

After ensuring that your VM configuration is supported, you can enable hibernation on your Linux VM using one of two options: 

**Option 1**: LinuxHibernateExtension 

**Option 2**: hibernation-setup-tool

### LinuxHibernateExtension

> [!NOTE]
> If you've already installed the hibernation-setup-tool you do not need to install the LinuxHibernateExtension. These are redundant methods to enable hibernation on a Linux VM.

When you create a Hibernation-enabled VM via the Azure portal, the LinuxHibernationExtension is automatically installed on the VM. 

If the extension is missing, you can [manually install the LinuxHibernateExtension](/cli/azure/azure-cli-extensions-overview) on your Linux VM to configure the guest OS for hibernation. 

>[!NOTE]
> Azure extensions are currently disabled by default for Debian images. To re-enable extensions, [check the Linux hibernation troubleshooting guide](../linux/hibernate-resume-troubleshooting-linux.md#azure-extensions-disabled-on-debian-images).

>[!NOTE]
> For RHEL LVM you will need to expand the root volume and ensure there is sufficient space available to create the swap file. To expand the volume, [check the disk expansion guide](expand-disks.md?tabs=rhellvm#increase-the-size-of-the-os-disk).

#### [CLI](#tab/cliLHE)
    
To install *LinuxHibernateExtension* with the Azure CLI, run the following command:

```azurecli
az vm extension set -n LinuxHibernateExtension --publisher Microsoft.CPlat.Core --version 1.0 \    --vm-name MyVm --resource-group MyResourceGroup --enable-auto-upgrade true
```

#### [PowerShell](#tab/powershellLHE)

To install LinuxHibernateExtension with PowerShell, run the following command:

```powershell
Set-AzVMExtension -Publisher Microsoft.CPlat.Core -ExtensionType LinuxHibernateExtension -VMName <VMName> -ResourceGroupName <RGNAME> -Name "LinuxHibernateExtension" -Location <Location> -TypeHandlerVersion 1.0
```  
---

### Hibernation-setup-tool 

> [!NOTE]
> If you've already installed the LinuxHibernateExtension you do not need to install the hibernation-setup-tool. These are redundant methods to enable hibernation on a Linux VM.

You can install the hibernation-setup-tool package on your Linux VM from Microsoft’s Linux software repository at [packages.microsoft.com](https://packages.microsoft.com).

To use the Linux software repository, follow the instructions at [Linux package repository for Microsoft software](/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software#ubuntu).

#### [Debian/Ubuntu](#tab/Ubuntu20HST) 

To use the hibernation-setup-tool in Debian and Ubuntu versions, open git bash and run this command:

```bash
curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo tee etc/apt/trusted.gpg.d/microsoft.asc

sudo apt-add-repository https://packages.microsoft.com/ubuntu/20.04/prod

sudo apt-get update
```

To install the package, run this command in git bash:
```bash
sudo apt-get install hibernation-setup-tool
```


#### [RHEL](#tab/RHELHST) 

To use the hibernation-setup-tool in RHEL versions, run this command:

```bash
curl -sSL -O https://packages.microsoft.com/config/rhel/9/packages-microsoft-prod.rpm

sudo rpm -i packages-microsoft-prod.rpm

rm packages-microsoft-prod.rpm

sudo dnf update

sudo dnf install hibernation-setup-tool
```
---

>[!NOTE]
> For RHEL LVM you will need to expand the root volume and ensure there is sufficient space available to create the swap file. To expand the volume, [check the disk expansion guide](expand-disks.md?tabs=rhellvm#increase-the-size-of-the-os-disk).

Once the package installs successfully, your Linux guest OS is configured for hibernation. You can also create a new Azure Compute Gallery Image from this VM and use the image to create VMs. VMs created with this image have the hibernation package preinstalled, simplifying your VM creation experience. 


[!INCLUDE [hibernate-resume-platform-instructions](../includes/hibernate-resume-platform-instructions.md)]

## Troubleshooting
Refer to the [Hibernate troubleshooting guide](../hibernate-resume-troubleshooting.md) and the [Linux VM hibernation troubleshooting guide](./hibernate-resume-troubleshooting-linux.md) for more information.

## FAQs
Refer to the [Hibernate FAQs](../hibernate-resume.md#faqs) for more information.

## Next steps
- [Learn more about Azure billing](/azure/cost-management-billing/)
- [Look into Azure VM Sizes](../sizes.md)
