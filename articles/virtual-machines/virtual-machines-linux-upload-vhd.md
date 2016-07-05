<properties
	pageTitle="Create and upload a Linux VHD | Microsoft Azure"
	description="Create and upload an Azure virtual hard disk (VHD) using the resource manager deployment model."
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
	ms.date="07/05/2016"
	ms.author="iainfou"/>

# Uploading a virtual hard disk

This article shows you how to upload a virtual hard disk (VHD) using the Resource Manager deployment model. You can install and configure a Linux distro to your requirements and then use this disk to quickly create Azure VMs.

**Important**: The Azure platform SLA applies to virtual machines running the Linux OS only when one of the endorsed distributions is used with the configuration details as specified under 'Supported Versions' in [Linux on Azure-Endorsed Distributions](virtual-machines-linux-endorsed-distros.md). All Linux distributions in the Azure image gallery are endorsed distributions with the required configuration.

## Quick commands
If needed, first create a resource group:

```bash
azure group create TestRG --location "WestUS"
```

Create a storage account that you will upload your virtual disks to:

```bash
azure storage account create testuploadedstorage --resource-group TestRG --location "WestUS" \
	--kind Storage --sku-name LRS
```

List the storage keys for the storage account you just created:

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

Create a container within your storage account using the displayed storage key:

```bash
azure storage container create --account-name testuploadedstorage --account-key <key1> --container vm-images
```

Finally, upload your VHD to the container you just created:

```bash
azure storage blob upload --blobtype page --account-name testuploadedstorage \
	--account-key <key1> --container vm-images /path/to/disk/localdisk.vhd
```

You can now create a VM from your uploaded virtual disk [using a resource manager template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vm-from-specialized-vhd) or through the CLI by specifying the URI to your disk as follows:

```bash
azure vm create TestVM -l "WestUS" --resource-group TestRG \
	-Q https://testuploadedstorage.blob.core.windows.net/vm-images/uploadeddisk.vhd
```

## Prerequisites
This article assumes that you have the following items:

- **Linux operating system installed in a .vhd file**  - You have installed an [Azure-endorsed Linux distribution](virtual-machines-linux-endorsed-distros.md) (or see [information for non-endorsed distributions](virtual-machines-linux-create-upload-generic.md)) to a virtual disk in the VHD format. Multiple tools exist to create .vhd files - for example you can use a virtualization solution such as Hyper-V to create the .vhd file and install the operating system. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/library/hh846766.aspx).

	> [AZURE.NOTE] The newer VHDX format is not supported in Azure. You can convert a VHDX to VHD format using Hyper-V Manager or the `Convert-VHD` cmdlet. Further, Azure does not support uploading dynamic VHDs, so you need to convert such disks to static VHDs before uploading. You can use tools such as [Azure VHD Utilities for GO](https://github.com/Microsoft/azure-vhd-utils-for-go) to convert dynamic disks.

- **Azure CLI** - Install and configure the latest [Azure CLI](../virtual-machines-command-line-tools.md) tools.

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