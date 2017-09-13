---
title: Add Linux images to Azure Stack
description: Learn how add Linux images to Azure Stack.
services: azure-stack
documentationcenter: ''
author: anjayajodha
manager: byronr
editor: ''

ms.assetid: d2155c59-902e-4f63-ac58-d19e6a765380
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 9/25/2017
ms.author: anajod

---
# Add Linux images to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit* 

You can deploy Linux virtual machines on Azure Stack by adding a Linux-based image into the Azure Stack Marketplace. The easiest way to add a Linux image to Azure Stack is through Marketplace Management.

## Marketplace Management

Before you can download Linux images from the Azure Marketplace, you need to register your Azure Stack with Azure.

For more information about downloading marketplace items, see [Download marketplace items from Azure to Azure Stack](azure-stack-download-azure-marketplace-item.md). Follow the procedures in this article and select the Linux images that you want to offer users on your Azure Stack.

## Download an image

You can download and extract Azure Stack-compatible Linux images using the following links:


   * [Bitnami](https://bitnami.com/azure-stack)
   * [CentOS](http://olstacks.cloudapp.net/latest/)
   * [CoreOS](https://stable.release.core-os.net/amd64-usr/current/coreos_production_azure_image.vhd.bz2)
   * [SuSE](https://download.suse.com/Download?buildid=VCFi7y7MsFQ~)
   * [Ubuntu 14.04 LTS](https://partner-images.canonical.com/azure/azure_stack/) / [Ubuntu 16.04 LTS](http://cloud-images.ubuntu.com/releases/xenial/release/ubuntu-16.04-server-cloudimg-amd64-disk1.vhd.zip)

1. Extract the image VHD if necessary and [add the image to the Marketplace](azure-stack-add-vm-image.md). Make sure that the `OSType` parameter is set to `Linux`.
2. After you've added the image to the Marketplace, a Marketplace item is created and users can deploy a Linux virtual machine.

## Prepare your own image

You can prepare your own Linux image using one of the following instructions:
   
   * [CentOS-based Distributions](../virtual-machines/linux/create-upload-centos.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Debian Linux](../virtual-machines/linux/debian-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Oracle Linux](../virtual-machines/linux/oracle-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Red Hat Enterprise Linux](../virtual-machines/linux/redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [SLES & openSUSE](../virtual-machines/linux/suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Ubuntu](../virtual-machines/linux/create-upload-ubuntu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

1. Download and install the [Azure Linux Agent](https://github.com/Azure/WALinuxAgent/).
   
    The Azure Linux Agent version 2.1.3 or higher is required to provision your Linux VM on Azure Stack. Many of the distributions listed previously already include this version of the agent or higher as a package in their repositories (typically called `WALinuxAgent` or `walinuxagent`). However, if the version of the Azure agent package is less than 2.1.3 (for example, 2.0.18 or lower), then you must install the agent manually. The installed version can be determined either from the package name or by running `/usr/sbin/waagent -version` on the VM.
   
    Follow the instructions below to install the Azure Linux agent manually -
   
   a. First, download the latest Azure Linux agent from [GitHub](https://github.com/Azure/WALinuxAgent/releases), example:
     
            # wget https://github.com/Azure/WALinuxAgent/archive/v2.2.16.tar.gz
   b. Unpack the Azure agent:
     
            # tar -vzxf v2.2.16.tar.gz
   c. Install python-setuptools
     
        **Debian / Ubuntu**
     
            # sudo apt-get update
            # sudo apt-get install python-setuptools
     
        **Ubuntu 16.04+**
     
            # sudo apt-get install python3-setuptools
     
        **RHEL / CentOS / Oracle Linux**
     
            # sudo yum install python-setuptools
   d. Install the Azure agent:
     
            # cd WALinuxAgent-2.2.16
            # sudo python3 setup.py install --register-service
     
     Systems with Python 2.x and Python 3.x installed side-by-side may need to run the following command:
     
         sudo python3 setup.py install --register-service
     For more information, see the Azure Linux Agent [README](https://github.com/Azure/WALinuxAgent/blob/master/README.md).
2. [Add the image to the Marketplace](azure-stack-add-vm-image.md). Make sure that the `OSType` parameter is set to `Linux`.
3. After you've added the image to the Marketplace, a Marketplace item is created and users can deploy a Linux virtual machine.

## Next steps
[Overview of offering services in Azure Stack](azure-stack-offer-services-overview.md)

