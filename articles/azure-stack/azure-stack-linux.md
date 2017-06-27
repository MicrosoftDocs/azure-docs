---
title: Linux Guests on Azure Stack | Microsoft Docs
description: Learn how create Linux-based virtual machines on Azure Stack.
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
ms.date: 7/10/2016
ms.author: anajod

---
# Deploy Linux virtual machines on Azure Stack
You can deploy Linux virtual machines on the Azure Stack Development Kit by adding a Linux-based image into the Azure Stack Marketplace. Several Linux vendors have provided images that can be added into an Azure Stack Development Kit or you can build your own.

## Download an image
1. Download and extract an Azure Stack-compatible image from the following links, or prepare your own:
   
   * [Bitnami](https://bitnami.com/azure-stack)
   * [CentOS](http://olstacks.cloudapp.net/latest/)
   * [CoreOS](https://stable.release.core-os.net/amd64-usr/current/coreos_production_azure_image.vhd.bz2)
   * [SuSE](https://download.suse.com/Download?buildid=VCFi7y7MsFQ~)
   * [Ubuntu 14.04 LTS](https://partner-images.canonical.com/azure/azure_stack/) / [Ubuntu 16.04 LTS](http://cloud-images.ubuntu.com/releases/xenial/release/ubuntu-16.04-server-cloudimg-amd64-disk1.vhd.zip)
2. Extract the image VHD if necessary and [add the image to the Marketplace](azure-stack-add-vm-image.md). Make sure that the `OSType` parameter is set to `Linux`.
3. After you've added the image to the Marketplace, a Marketplace item is created and you can deploy a Linux virtual machine.

## Prepare your own image
1. Prepare your own Linux image using one of the following instructions:
   
   * [CentOS-based Distributions](../virtual-machines/linux/create-upload-centos.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Debian Linux](../virtual-machines/linux/debian-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Oracle Linux](../virtual-machines/linux/oracle-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Red Hat Enterprise Linux](../virtual-machines/linux/redhat-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [SLES & openSUSE](../virtual-machines/linux/suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Ubuntu](../virtual-machines/linux/create-upload-ubuntu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
2. Download and install the [Azure Linux Agent](https://github.com/Azure/WALinuxAgent/)
   
    The Azure Linux Agent version 2.1.3 or higher is required to provision your Linux VM on Azure Stack. Many of the distributions listed above already include this version of the agent or higher as a package in their repositories (typically called `WALinuxAgent` or `walinuxagent`). However, if the version of the Azure agent package is less than 2.1.3 (i.e. 2.0.18 or lower), then you must install the agent manually. The installed version can be determined either from the package name or by running `/usr/sbin/waagent -version` on the VM.
   
    Follow the instructions below to install the Azure Linux agent manually -
   
   * First, download the latest Azure Linux agent from [GitHub](https://github.com/Azure/WALinuxAgent/releases), example:
     
            # wget https://github.com/Azure/WALinuxAgent/archive/v2.2.0.tar.gz
   * Unpack the Azure agent:
     
            # tar -vzxf v2.2.0.tar.gz
   * Install python-setuptools
     
        **Debian / Ubuntu**
     
            # sudo apt-get update
            # sudo apt-get install python-setuptools
     
        **Ubuntu 16.04+**
     
            # sudo apt-get install python3-setuptools
     
        **RHEL / CentOS / Oracle Linux**
     
            # sudo yum install python-setuptools
   * Install the Azure agent:
     
            # cd WALinuxAgent-2.2.0
            # sudo python setup.py install --register-service
     
     Systems with Python 2.x and Python 3.x installed side-by-side may need to run the following command:
     
         sudo python3 setup.py install --register-service
     For more information, see the Azure Linux Agent [README](https://github.com/Azure/WALinuxAgent/blob/master/README.md).
3. [Add the image to the Marketplace](azure-stack-add-vm-image.md). Make sure that the `OSType` parameter is set to `Linux`.
4. After you've added the image to the Marketplace, a Marketplace item is created and you can deploy a Linux virtual machine.

## Next steps
[Frequently asked questions for Azure Stack](azure-stack-faq.md)

