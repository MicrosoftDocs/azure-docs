<properties
	pageTitle="Linux Guests on Azure Stack | Microsoft Azure"
	description="Learn how create Linux-based virtual machines on Azure Stack."
	services="azure-stack"
	documentationCenter=""
	authors="anjayajodha"
	manager="byronr"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/18/2016"
	ms.author="anajod"/>
    
# Deploy Linux virtual machines on Azure Stack

You can deploy Linux virtual machines on the Azure Stack POC by adding a Linux-based image into the Azure Stack Platform Image Repository (PIR). Several Linux vendors have provided images that can be added into an Azure Stack POC or you can build your own.

## Download an image

 1. Download and extract an Azure Stack-compatible image from the following links, or prepare your own:
  - [Ubuntu 14.04 LTS](https://partner-images.canonical.com/azure/azure_stack/)
  - [CentOS](http://olstacks.cloudapp.net/latest/)
  - [SuSE](https://download.suse.com/Download?buildid=VCFi7y7MsFQ~)
  
 1. Extract the image VHD if necessary and [add the image to the PIR](../azure-stack/azure-stack-add-image-pir.md). Make sure that the `OSType` parameter is set to `Linux`.
 
 1. After you've added the image to the PIR, a Marketplace item is created and you can deploy a Linux virtual machine.
  
## Prepare your own image

1. Prepare your own Linux image using one of the following instructions:
 - [CentOS-based Distributions](../virtual-machines/virtual-machines-linux-create-upload-centos.md)
 - [Debian Linux](../virtual-machines/virtual-machines-linux-debian-create-upload-vhd.md)
 - [Oracle Linux](../virtual-machines/virtual-machines-linux-oracle-create-upload-vhd.md)
 - [Red Hat Enterprise Linux](../virtual-machines/virtual-machines-linux-redhat-create-upload-vhd.md)
 - [SLES & openSUSE](../virtual-machines/virtual-machines-linux-suse-create-upload-vhd.md)
 - [Ubuntu](../virtual-machines/virtual-machines-linux-create-upload-ubuntu.md)

2. [Add the image to the PIR](../azure-stack/azure-stack-add-image-pir.md). Make sure that the `OSType` parameter is set to `Linux`.

3. After you've added the image to the PIR, a Marketplace item is created and you can deploy a Linux virtual machine.

## Next steps

[Frequently asked questions for Azure Stack](../azure-stack/azure-stack-faq.md)
