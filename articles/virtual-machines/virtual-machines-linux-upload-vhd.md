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
	ms.date="07/15/2016"
	ms.author="iainfou"/>

# Upload and create a VM from custom disk image

This article shows you how to upload a virtual hard disk (VHD) using the Resource Manager deployment model and create VMs from this custom image. This functionality allows you to install and configure a Linux distro to your requirements and then use that VHD to quickly create Azure virtual machines (VMs).

## Quick commands
Make sure that you have [the Azure CLI](../xplat-cli-install.md) logged in and using resource manager mode (`azure config mode arm`).

First, create a resource group:

```bash
azure group create TestRG --location "WestUS"
```

Create a storage account to hold your virtual disks:

```bash
azure storage account create testuploadedstorage --resource-group TestRG \
	--location "WestUS" --kind Storage --sku-name PLRS
```

List the access keys for the storage account you just created and make a note of `key1`:

```bash
azure storage account keys list testuploadedstorage --resource-group TestRG
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

Note that the destination storage account has to be the same as where you uploaded your virtual disk to. You also need to specify, or answer prompts for, all the additional parameters required by the `azure vm create` command such as virtual network, public IP address, username and SSH keys, etc. You can read more about the [available CLI resource manager parameters](azure-cli-arm-commands.md#azure-vm-commands-to-manage-your-azure-virtual-machines).


## Detailed steps
There are a number of steps involved in preparing your custom Linux image amd uploading it to Azure. The remainder of this article provides more detailed information around each of the steps noted in the previous set of quick commands.


## Requirements
In order to complete the above steps you will need:

- **Linux operating system installed in a .vhd file** - Install an [Azure-endorsed Linux distribution](virtual-machines-linux-endorsed-distros.md) (or see [information for non-endorsed distributions](virtual-machines-linux-create-upload-generic.md)) to a virtual disk in the VHD format. Multiple tools exist to create a VM and VHD:
	- Install and configure [QEMU](https://en.wikibooks.org/wiki/QEMU/Installing_QEMU) or [KVM](http://www.linux-kvm.org/page/RunningKVM), taking care to use VHD as your image format. You can [convert an image](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) using `qemu-img convert` if needed.
	- You can also use Hyper-V [on Windows 10](https://msdn.microsoft.com/virtualization/hyperv_on_windows/quick_start/walkthrough_install) or [on Windows Server 2012/2012 R2](https://technet.microsoft.com/library/hh846766.aspx).

> [AZURE.NOTE] The newer VHDX format is not supported in Azure. When you create a VM, specify VHD as the format. If needed, you can convert VHDX disks to VHD using [`qemu-img convert`](https://en.wikibooks.org/wiki/QEMU/Images#Converting_image_formats) or the [`Convert-VHD`](https://technet.microsoft.com/library/hh848454.aspx) PowerShell cmdlet. Further, Azure does not support uploading dynamic VHDs, so you need to convert such disks to static VHDs before uploading. You can use tools such as [Azure VHD Utilities for GO](https://github.com/Microsoft/azure-vhd-utils-for-go) to convert dynamic disks during the process of uploading to Azure.

- VMs created from your custom image must reside in the same storage account as the image itself
	- Create a storage account and container to hold both your custom image and created VMs
	- After you have created all your VMs, you can safely delete your image


<a id="prepimage"> </a>
## Prepare the image to be uploaded

Azure supports a variety of Linux distributions (see [Endorsed Distributions](virtual-machines-linux-endorsed-distros.md)). The following articles guide you through how to prepare the various Linux distributions that are supported on Azure:

- **[CentOS-based Distributions](virtual-machines-linux-create-upload-centos.md)**
- **[Debian Linux](virtual-machines-linux-debian-create-upload-vhd.md)**
- **[Oracle Linux](virtual-machines-linux-oracle-create-upload-vhd.md)**
- **[Red Hat Enterprise Linux](virtual-machines-linux-redhat-create-upload-vhd.md)**
- **[SLES & openSUSE](virtual-machines-linux-suse-create-upload-vhd.md)**
- **[Ubuntu](virtual-machines-linux-create-upload-ubuntu.md)**
- **[Other - Non-Endorsed Distributions](virtual-machines-linux-create-upload-generic.md)**

Also see the **[Linux Installation Notes](virtual-machines-linux-create-upload-generic.md#general-linux-installation-notes)** for more general tips on preparing Linux images for Azure.

> [AZURE.NOTE] The [Azure platform SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/) applies to VMs running Linux only when one of the endorsed distributions is used with the configuration details as specified under 'Supported Versions' in [Linux on Azure-Endorsed Distributions](virtual-machines-linux-endorsed-distros.md).


## Create a resource group
Resource groups logically bring together all the Azure resources to support your virtual machines, such as the virtual networking and storage. Read more about [Azure resource groups here](../resource-group-overview.md). Before uploading your custom disk image and creating VMs, you first need to create a resource group:

```bash
azure group create TestRG --location "WestUS"
```

## Create a storage account
VMs are stored as page blobs within a storage account. Read more about [Azure blob storage here](../storage/storage-introduction.md#blob-storage). You need to create a storage account for your custom disk iamge and VMs. Any VMs that you create from your custom disk image need to be in the same storage account as that image.

Create a storage account within the resource group that you just created:

```bash
azure storage account create testuploadedstorage --resource-group TestRG \
	--location "WestUS" --kind Storage --sku-name PLRS
```

## List storage account keys
Azure generates two 512-bit access keys for each storage account. These access keys are used when authenticating to the storage account, such as to carry out write operations. Read more about [managing access to storage here](../storage/storage-create-storage-account.md#manage-your-storage-account). You can view access keys with the `azure storage account keys list` command.

View the access keys for the storage account you just created:

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
Make a note of `key1` as you will use it to interact with your storage account in the next steps.

## Create a storage container
In the same way that you create different directories to logically organize your local file system, you create containers within a storage account to organize your virtual disks and disk images. A storage account can contain any number of containers. 

Create a new container, specifying the access key obtained in the previous step:

```bash
azure storage container create --account-name testuploadedstorage \
	--account-key <key1> --container vm-images
```

## Upload VHD
Now you can actually upload your custom disk image. As with all virtual disks used by VMs, you will upload and store your custom disk image as a page blob.

You will need to specify your access key, the container you created in the previous step, and then the path to the custom disk image on your local computer:

```bash
azure storage blob upload --blobtype page --account-name testuploadedstorage \
	--account-key <key1> --container vm-images /path/to/disk/yourdisk.vhd
```

## Create VM from custom image
When you create VMs from your custom disk image, you need to specify the URI to the disk image and ensure that the destination storage account matches where your custom disk image is stored. You can create your VM using the Azure CLI or resource manager JSON template.


### Create a VM using the Azure CLI
You specify the `--image-urn` (or simply `-Q`) parameter with the `azure vm create` command to point to your custom disk image. Ensure that `--storage-account-name` (or `-o`) matches the storage account where your custom disk image is stored. You do not have to use the same container as the custom disk image to store your VMs, just make sure to create any additional containers in the same way as the earlier steps before uploading your custom disk images.

Create a VM from your custom disk image:

```bash
azure vm create TestVM -l "WestUS" --resource-group TestRG \
	-Q https://testuploadedstorage.blob.core.windows.net/vm-images/yourdisk.vhd
	-o testuploadedstorage
```

Note that you will still need to specify, or answer prompts for, all the additional parameters required by the `azure vm create` command such as virtual network, public IP address, username and SSH keys, etc. Read more about the [available CLI resource manager parameters](azure-cli-arm-commands.md#azure-vm-commands-to-manage-your-azure-virtual-machines).

### Create a VM using a JSON template
Azure Resource Manager templates are JavaScript Object Notation (JSON) files that define the environment you wish to build. The templates are broken down in to different resource providers such as compute or network. You can use existing templates or write your own. Read more about [using resource manager and templates](../resource-group-overview.md).

Within the `Microsoft.Compute/virtualMachines` provider of your template, you will have a `storageProfile` node that contains the configuration details for your VM. The two main parameters to edit are the `image` and `vhd` URIs that point to your custom disk image and your new VM's virtual disk. Below is an example of the JSON for using a custom disk image:

```bash
"storageProfile": {
          "osDisk": {
            "name": "TestVM",
            "osType": "Linux",
            "caching": "ReadWrite",
			"createOption": "FromImage",
            "image": {
              "uri": "https://testuploadedstorage.blob.core.windows.net/vm-images/yourdisk.vhd"
            },
            "vhd": {
              "uri": "https://testuploadedstorage.blob.core.windows.net/vhds/newvmname.vhd"
            }
          }
```

You can use [this existing template to create a VM from a custom image](https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-from-user-image) or read about [creating your own Azure resource manager templates](../resource-group-authoring-templates.md). 

Once you have a template configured, you create your VMs using the `azure group deployment create` command. Specify the URI of your JSON template with the `--template-uri` parameter:

```bash
azure group deployment create --resource-group TestTemplateRG
	--template-uri https://uri.to.template/yourtemplate.json
```

If you have a JSON file stored locally on your computer, you can use the `--template-file` parameter instead:

```bash
azure group deployment create --resource-group TestTemplateRG
	--template-file /path/to/yourtemplate.json
```


## Next steps
After you have prepared and uploaded your custom virtual disk, you can read more about [using resource manager and templates](../resource-group-overview.md). You may also want to [add a data disk](virtual-machines-linux-add-disk.md) to your new VMs. If you have applications running on your VMs that you need to access, be sure to [open ports and endpoints](virtual-machines-linux-nsg-quickstart.md).
