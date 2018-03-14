---
title: Add Linux images to Azure Stack
description: Learn how add Linux images to Azure Stack.
services: azure-stack
documentationcenter: ''
author: brenduns
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/22/2018
ms.author: brenduns
ms.reviewer: jeffgo

---
# Add Linux images to Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

You can deploy Linux virtual machines (VMs) on Azure Stack by adding a Linux-based image into the Azure Stack Marketplace. The easiest way to add a Linux image to Azure Stack is through Marketplace Management. These images have been prepared and tested for compatibility with Azure Stack.

## Marketplace Management

To download Linux images from the Azure Marketplace, use the procedures in the following article. Select the Linux images that you want to offer users on your Azure Stack.

[Download marketplace items from Azure to Azure Stack](azure-stack-download-azure-marketplace-item.md).

## Prepare your own image

You can prepare your own Linux image using one of the following instructions:

   * [CentOS-based Distributions](../virtual-machines/linux/create-upload-centos.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Debian Linux](../virtual-machines/linux/debian-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [SLES & openSUSE](../virtual-machines/linux/suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
   * [Ubuntu](../virtual-machines/linux/create-upload-ubuntu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

1. Download and install the [Azure Linux Agent](https://github.com/Azure/WALinuxAgent/).

    The Azure Linux Agent version 2.2.2 or higher is required to provision your Linux VM on Azure Stack and some versions do not work (2.2.12 and 2.2.13, for examples). Many of the distributions listed previously already include a version of the agent (typically called `WALinuxAgent` or `walinuxagent`). If you create a custom image, you must install the agent manually. The installed version can be determined from the package name or by running `/usr/sbin/waagent -version` on the VM.

    Follow the instructions below to install the Azure Linux agent manually -

   a. First, download the latest Azure Linux agent from [GitHub](https://github.com/Azure/WALinuxAgent/releases), example:

            # wget https://github.com/Azure/WALinuxAgent/archive/v2.2.21.tar.gz
   b. Unpack the Azure agent:

            # tar -vzxf v2.2.21.tar.gz
   c. Install python-setuptools

        **Debian / Ubuntu**

            # sudo apt-get update
            # sudo apt-get install python-setuptools

        **Ubuntu 16.04+**

            # sudo apt-get install python3-setuptools

        **RHEL / CentOS / Oracle Linux**

            # sudo yum install python-setuptools
   d. Install the Azure agent:

            # cd WALinuxAgent-2.2.21
            # sudo python3 setup.py install --register-service

     Systems with Python 2.x and Python 3.x installed side-by-side may need to run the following command:

         sudo python3 setup.py install --register-service
     For more information, see the Azure Linux Agent [README](https://github.com/Azure/WALinuxAgent/blob/master/README.md).
2. [Add the image to the Marketplace](azure-stack-add-vm-image.md). Make sure that the `OSType` parameter is set to `Linux`.
3. After you've added the image to the Marketplace, a Marketplace item is created and users can deploy a Linux virtual machine.

## Next steps
[Overview of offering services in Azure Stack](azure-stack-offer-services-overview.md)
