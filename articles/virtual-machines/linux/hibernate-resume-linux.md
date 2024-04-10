---
title: Learn about hibernating your Linux virtual machine
description: Learn how to hibernate a Linux virtual machine.
author: mattmcinnes
ms.service: virtual-machines
ms.topic: how-to
ms.date: 04/09/2024
ms.author: jainan
ms.reviewer: mattmcinnes
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Hibernating Linux virtual machines

**Applies to:** :heavy_check_mark: Linux VMs

[!INCLUDE [hibernate-resume-intro](./includes/hibernate-resume-intro.md)]

## How hibernation works
To learn how hibernation works, check out the [hibernation overview](../hibernate-resume.md).

## Supported configurations
Hibernation support is limited to certain VM sizes and OS versions. Make sure you have a supported configuration before using hibernation.

### Supported Linux distros
The following Linux operating systems support hibernation:

- Ubuntu 22.04 LTS
- Ubuntu 20.04 LTS
- Ubuntu 18.04 LTS
- Debian 11
- Debian 10 (with backports kernel)

### Prerequisites and configuration limitations
-	Hibernation isn't supported with Trusted Launch for Linux VMs  

For general limitations, Azure feature limitations supported VM sizes, and feature prerequisites check out the ["Supported configurations" section in the hibernation overview](../hibernate-resume.md#supported-configurations).

## Getting started with hibernation on your Linux guest

After ensuring that your VM configuration is supported, you can enable hibernation on your Linux VM using the "LinuxHibernateExtension" or "hibernation-setup-tool".

### LinuxHibernateExtension
When you create a Hibernation-enabled VM via the Azure portal, the LinuxHibernationExtension is automatically installed on the VM. 

If the extension is missing, you can [manually install the LinuxHibernateExtension](/cli/azure/azure-cli-extensions-overview) on your Linux VM to configure the guest OS for hibernation. 

>[!NOTE]
> Azure extensions are currently disabled by default for Debian images. To re-enable extensions, [check the hibernation troubleshooting guide](hibernate-resume-troubleshooting.md#azure-extensions-disabled-on-debian-images).

#### [CLI](#tab/cliLHE)
    
To install LinuxHibernateExtension with the Azure CLI, run the following command:

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
You can install the hibernation-setup-tool package on your Linux VM from Microsoft’s Linux software repository at [packages.microsoft.com](https://packages.microsoft.com).

To use the Linux software repository, follow the instructions at [Linux package repository for Microsoft software](/windows-server/administration/Linux-Package-Repository-for-Microsoft-Software#ubuntu).

#### [Ubuntu 18.04 (Bionic)](#tab/Ubuntu18HST) 

To use the repository in Ubuntu 18.04, open git bash and run this command:

```bash
curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -

sudo apt-add-repository https://packages.microsoft.com/ubuntu/18.04/prod

sudo apt-get update
```

#### [Ubuntu 20.04 (Focal)](#tab/Ubuntu20HST) 

To use the repository in Ubuntu 20.04, open git bash and run this command:

```bash
curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo tee etc/apt/trusted.gpg.d/microsoft.asc

sudo apt-add-repository https://packages.microsoft.com/ubuntu/20.04/prod

sudo apt-get update
```
---


To install the package, run this command in git bash:
```bash
sudo apt-get install hibernation-setup-tool
```

Once the package installs successfully, your Linux guest OS is configured for hibernation. You can also create a new Azure Compute Gallery Image from this VM and use the image to create VMs. VMs created with this image have the hibernation package preinstalled, simplifying your VM creation experience. 

## Hibernate a VM
Once a VM with hibernation enabled is created and the guest OS is configured for hibernation, you can hibernate the VM. You can then check its current status through the Azure portal, the Azure CLI, PowerShell, or REST API. 

To learn more about hibernating a VM, check out ["Hibernate a VM" in the hibernation overview](../hibernate-resume.md#hibernate-a-vm).

## View state of hibernated VM
You can check the state of a hibernated VM through the Azure portal, the Azure CLI, PowerShell, or REST API.

To learn how to check the status of a hibernated VM, check out ["Viewing the state of a hibernated VM" in the hibernation overview](../hibernate-resume.md#view-state-of-hibernated-vm).


## Start hibernated VMs 

You can start hibernated VMs just like how you would start a stopped VM. This can be done through the Azure portal, the Azure CLI, PowerShell, or REST API.

To learn how to start a hibernated VM, check out ["Starting a hibernated VM" in the hibernation overview](../hibernate-resume.md#starting-a-hibernated-vm).

## Alternative deployments

VMs from the Compute Gallery and OS disks can also have hibernation enabled. 

To learn more about deploying hibernation-enabled VMs from the Compute Gallery, check out ["Deploy hibernation enabled VMs from the Azure Compute Gallery"](../hibernate-resume.md#deploy-hibernation-enabled-vms-from-the-azure-compute-gallery).

To learn more about deploying hibernation-enabled VMs from an OS disk, check out ["Deploy hibernation enabled VMs from an OS disk"](../hibernate-resume.md#deploy-hibernation-enabled-vms-from-an-os-disk).


## Troubleshooting
Refer to the [Hibernate troubleshooting guide](../hibernate-resume-troubleshooting.md) for more information.

## FAQs
Refer to the [Hibernate FAQs](../hibernate-resume.md#faqs) for more information.

## Next Steps:
- [Learn more about Azure billing](/azure/cost-management-billing/)
- [Learn about Azure Virtual Desktop](../virtual-desktop/overview.md)
- [Look into Azure VM Sizes](sizes.md)
