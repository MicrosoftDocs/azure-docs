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
    
# Linux Guests on Azure Stack

By sideloading a Linux-based image into the Azure Stack Platform Image Repository (PIR), Linux guest virtual machines can be deployed on to the Azure Stack POC. Several Linux vendors have provided images that can be added into an Azure Stack POC or you can build your own. 

## Adding a Premade Linux Image to the Azure Stack PIR

1. Download and extract an Azure Stack-compatible image from the following links, or prepare your own:
  - Ubuntu 14.04 LTS: [https://partner-images.canonical.com/azure/azure_stack/](https://partner-images.canonical.com/azure/azure_stack/)
  - CentOS: [http://olstacks.cloudapp.net/latest/](http://olstacks.cloudapp.net/latest/)
  - SuSE: [https://download.suse.com/Download?buildid=VCFi7y7MsFQ~](https://download.suse.com/Download?buildid=VCFi7y7MsFQ~)
  - Prepare your own Linux image using one of the following instructions:
    - [CentOS-based Distributions](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-centos/)
    - [Debian Linux](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-debian-create-upload-vhd/)
    - [Oracle Linux](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-oracle-create-upload-vhd/)
    - [Red Hat Enterprise Linux](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-redhat-create-upload-vhd/)
    - [SLES & openSUSE](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-vhd-suse)
    - [Ubuntu](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-create-upload-ubuntu/)

2.  Extract the VHD from the download or use a self-created image and follow [these steps](azure-stack-add-image-pir.md). Make sure that the `OSType` parameter is set to `Linux`.

3. Once the image is added to the PIR, a gallery image will automatically be created, and Linux guest VMs can be created. 

## Next steps

[Frequently asked questions for Azure Stack](azure-stack-faq.md)
