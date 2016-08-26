<properties
	pageTitle="Create and upload a custom Linux image | Microsoft Azure"
	description="Create and upload to Azure a virtual hard disk (VHD) with a custom Linux image using the resource manager deployment model."
	services="virtual-machines-linux"
	documentationCenter=""
	authors="iainfoulds"
	manager="timlt"
	editor="tysonn"
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-linux"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-linux"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/07/2016"
	ms.author="iainfou"/>

# Upload and create a VM from custom disk image

This article shows you how to upload a virtual hard disk (VHD) using the Resource Manager deployment model and create VMs from this custom image. This functionality allows you to install and configure a Linux distro to your requirements and then use that VHD to quickly create Azure virtual machines (VMs).

## Quick commands
Make sure that you have [the Azure CLI](../xplat-cli-install.md) logged in and using the resource manager mode (`azure config mode arm`).

First, create a resource group:

```bash
azure group create TestRG --location "WestUS"
```

Create a storage account to hold your virtual disks:

```bash
azure storage account create testuploadedstorage --resource-group TestRG \
	--location "WestUS" --kind Storage --sku-name LRS
```

List the storage keys for the storage account you just created and make a note of `key1`:

```bash
azure storage account keys list testuploadedstorage --resource-group TestRG
```

The output will be similar to:

```
info:    Executing command storage account keys list
+ Getting storage account keys
data:    Name  Key                                                                                       Permissions
data:    ----  ----------------------------------------------------------------------------------------  -----------
data:    key1  d4XAvZzlGAgWdvhlWfkZ9q4k9bYZkXkuPCJ15NTsQOeDeowCDAdB80r9zA/tUINApdSGQ94H9zkszYyxpe8erw==  Full
data:    key2  Ww0T7g4UyYLaBnLYcxIOTVziGAAHvU+wpwuPvK4ZG0CDFwu/mAxS/YYvAQGHocq1w7/3HcalbnfxtFdqoXOw8g==  Full
info:    storage account keys list command OK
```

Create a container within your storage account using the storage key you just obtained:

```bash
azure storage container create --account-name testuploadedstorage \
	--account-key <key1> --container vm-images
```

Finally, upload your VHD to the container you just created:

```bash
azure storage blob upload --blobtype page --account-name testuploadedstorage \
	--account-key <key1> --container vm-images /path/to/disk/yourdisk.vhd
```

You can now create a VM from your uploaded virtual disk [using a resource manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-from-specialized-vhd) or through the CLI by specifying the URI to your disk as follows:

```bash
azure vm create TestVM -l "WestUS" --resource-group TestRG \
	-Q https://testuploadedstorage.blob.core.windows.net/vm-images/yourdisk.vhd
```

Note that you will still need all the additional parameters required by the `azure vm create` command such as virtual network, public IP address, username and SSH keys, etc. You can read more about the [available CLI resource manager parameters](azure-cli-arm-commands.md#azure-vm-commands-to-manage-your-azure-virtual-machines).

## Requirements
In order to complete the above steps, you will need:

- **Linux operating system installed in a .vhd file** - Install an [Azure-endorsed Linux distribution](virtual-machines-linux-endorsed-distros.md) (or see [information for non-endorsed distributions](virtual-machines-linux-create-upload-generic.md)) to a virtual disk in the VHD format. Multiple tools exist to create a VM and VHD:
	- Install and configure [QEMU](https://en.wikibooks.org/wiki/QEMU/Installing_QEMU) or [KVM](http://www.linux-kvm.org/page/RunningKVM), taking care to use VHD as your image format. You can [convert an image](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) using `qemu-img convert` if needed.
	- You can also use Hyper-V [on Windows 10](https://msdn.microsoft.com/virtualization/hyperv_on_windows/quick_start/walkthrough_install) or [on Windows Server 2012/2012 R2](https://technet.microsoft.com/library/hh846766.aspx).

> [AZURE.NOTE] The newer VHDX format is not supported in Azure. When you create a VM, specify the original VHD format. If needed, you can convert a VHDX to VHD format using [`qemu-img convert`](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) or the [`Convert-VHD`](https://technet.microsoft.com/library/hh848454.aspx) PowerShell cmdlet. Further, Azure does not support uploading dynamic VHDs, so you need to convert such disks to static VHDs before uploading. You can use tools such as [Azure VHD Utilities for GO](https://github.com/Microsoft/azure-vhd-utils-for-go) to convert dynamic disks during the process of uploading to Azure.


<a id="prepimage"> </a>
## Prepare the image to be uploaded

Azure supports a variety of Linux distributions (see [Endorsed Distributions](virtual-machines-linux-endorsed-distros.md)). The following articles will guide you through how to prepare the various Linux distributions that are supported on Azure. Make sure you appropriately prepare your virtual disk before uploading:

- **[CentOS-based Distributions](virtual-machines-linux-create-upload-centos.md)**
- **[Debian Linux](virtual-machines-linux-debian-create-upload-vhd.md)**
- **[Oracle Linux](virtual-machines-linux-oracle-create-upload-vhd.md)**
- **[Red Hat Enterprise Linux](virtual-machines-linux-redhat-create-upload-vhd.md)**
- **[SLES & openSUSE](virtual-machines-linux-suse-create-upload-vhd.md)**
- **[Ubuntu](virtual-machines-linux-create-upload-ubuntu.md)**
- **[Other - Non-Endorsed Distributions](virtual-machines-linux-create-upload-generic.md)**

Also see the **[Linux Installation Notes](virtual-machines-linux-create-upload-generic.md#general-linux-installation-notes)** for more general tips on preparing Linux images for Azure.

> [AZURE.NOTE] The [Azure platform SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) applies to VMs running Linux only when one of the endorsed distributions is used with the configuration details as specified under 'Supported Versions' in [Linux on Azure-Endorsed Distributions](virtual-machines-linux-endorsed-distros.md).

## Next steps
After you have prepared and uploaded your custom virtual disk, you can read more about [using resource manager and templates](../resource-group-overview.md). You may also want to [add a data disk](virtual-machines-linux-add-disk.md) to your new VMs. If you have applications running on your VMs that you need to access, be sure to [open ports and endpoints](virtual-machines-linux-nsg-quickstart.md).