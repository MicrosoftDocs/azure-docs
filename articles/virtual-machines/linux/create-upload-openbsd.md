---
title: Create and upload an OpenBSD VM image | Microsoft Docs
description: Learn to create and upload a virtual hard disk (VHD) that contains the OpenBSD operating system to create an Azure virtual machine through Azure CLI
services: virtual-machines-linux
documentationcenter: ''
author: KylieLiang
manager: timlt
editor: ''
tags: azure-service-management

ms.assetid: 1ef30f32-61c1-4ba8-9542-801d7b18e9bf
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/24/2017
ms.author: kyliel

---
# Create and upload a FreeBSD VHD to Azure
This article shows you how to create and upload a virtual hard disk (VHD) that contains the OpenBSD operating system. After you upload it, you can use it as your own image to create a virtual machine (VM) in Azure through Azure CLI

> [!IMPORTANT] 
> Azure has two different deployment models for creating and working with resources: [Resource Manager and Classic](../../resource-manager-deployment-model.md). This article covers using the Resource Manager model. Microsoft recommends that most new deployments use the Resource Manager model. 

## Prerequisites
This article assumes that you have the following items:

* **An Azure subscription**--If you don't have an account, you can create one in just a couple of minutes. If you have an MSDN subscription, see [Monthly Azure credit for Visual Studio subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). Otherwise, learn how to [create a free trial account](https://azure.microsoft.com/pricing/free-trial/).  
* **Azure CLI 2.0**--Make sure you have the latest [Azure CLI 2.0](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed. 
* **OpenBSD operating system installed in a .vhd file**--A supported OpenBSD operating system (6.1 version) must be installed to a virtual hard disk. Multiple tools exist to create .vhd files. For example, you can use a virtualization solution such as Hyper-V to create the .vhd file and install the operating system. For instructions about how to install and use Hyper-V, see [Install Hyper-V and create a virtual machine](http://technet.microsoft.com/library/hh846766.aspx).

>
> 

## Prepare the OpenBSD image for Azure
On the virtual machine where you installed the OpenBSD operating system 6.1, which added Hyper-V support, complete the following procedures:

1. Enable DHCP.
    If DHCP is not enabled during installation, run below command.
    
        # echo dhcp > /etc/hostname.hvn0

2. Set up a serial console.

        # echo "stty com0 115200" >> /etc/boot.conf
        # echo "set tty com0" >> /etc/boot.conf

3. Configure Package installation

        # echo "https://ftp.openbsd.org/pub/OpenBSD" > /etc/installurl
   
4. Enable Doas
    
    By default, the `root` user is disabled on virtual machines in Azure. Users can run commands with elevated privileges by using the `doas` command on OpenBSD VM.Doas is enabled by default, refer to [doas.conf](http://man.openbsd.org/doas.conf.5). 

5. Prerequisites for Azure Agent.

        # pkg_add py-setuptools openssl git
        # ln -sf /usr/local/bin/python2.7 /usr/local/bin/python
        # ln -sf /usr/local/bin/python2.7-2to3 /usr/local/bin/2to3
        # ln -sf /usr/local/bin/python2.7-config /usr/local/bin/python-config
        # ln -sf /usr/local/bin/pydoc2.7  /usr/local/bin/pydoc

6. Install Azure Agent.

    The latest release of the Azure Agent can always be found on [github](https://github.com/Azure/WALinuxAgent/releases). The patch to support OpenBSD will be merged into the master of Azure Agent soon. 

        # git clone https://github.com/reyk/WALinuxAgent
        # cd WALinuxAgent
        # git checkout waagent-openbsd
        # python setup.py install
        # waagent -register-service

   > [!IMPORTANT]
   > After you install Azure Agent, it's a good idea to verify that it's running:
   >
   >

        # ps auxw | grep waagent
        root     79309  0.0  1.5  9184 15356 p1  S      4:11PM    0:00.46 python /usr/local/sbin/waagent -daemon (python2.7)
        # cat /var/log/waagent.log

7. Deprovision the system.

    Deprovision the system to clean it and make it suitable for reprovisioning. The following command also deletes the last provisioned user account and the associated data:

        # waagent -deprovision -force

    Now you can shut down your VM.

## Prepare the VHD for upload
The VHDX format is not supported in Azure, only **fixed VHD**. You can convert the disk to fixed VHD format using Hyper-V Manager or the Powershell [convert-vhd](https://technet.microsoft.com/itpro/powershell/windows/hyper-v/convert-vhd) cmdlet and [resize-vhd](https://technet.microsoft.com/en-us/itpro/powershell/windows/hyper-v/resize-vhd). Examples are as followings.

        > Resize-VHD -Path OpenBSD61.vhdx -SizeBytes 20GB
        > Convert-VHD OpenBSD61.vhdx OpenBSD61.vhd

## Create a VM with prepared VHD 
You could refer to [Create a VM with a virtual hard disk](https://docs.microsoft.com/en-us/azure/virtual-machines/scripts/virtual-machines-linux-cli-sample-create-vm-vhd) to get a script. Here we list Azure CLI steps to upload OpenBSD.vhd and create an OpenBSD VM with SSH key for your quick reference. 

```azurecli
    az login
    az group create -n myResourceGroup  -l westus
    az storage account create -g myResourceGroup -n mystorageaccount -l westus --sku PREMIUM_LRS
    $STORAGE_KEY=az storage account keys list -g myResourceGroup -n mystorageaccount --query "[?keyName=='key1']  | [0].value" -o tsv
    az storage container create -n vhds --account-name mystorageaccount --account-key ${STORAGE_KEY}
    az storage blob upload -c vhds -f ./OpenBSD61.vhd -n OpenBSD61.vhd --account-name mystorageaccount --account-key ${STORAGE_KEY}
    az vm create -g myResourceGroup -n myOpenBSD61 --image "https://mystorageaccount.blob.core.windows.net/vhds/OpenBSD61.vhd" --os-type linux --admin-username azureuser --storage-account mystorageaccount --storage-container-name vhds --storage-sku PREMIUM_LRS --use-unmanaged-disk --size Standard_DS1_v2 --ssh-key-value '~/.ssh/id_rsa.pub' 
```

You can get the IP address for your OpenBSD VM through [az vm list-ip-addresses](https://docs.microsoft.com/en-us/cli/azure/vm#list-ip-addresses).
```azurecli
    az vm list-ip-addresses -g myResourceGroup -n myOpenBSD61
```

Now you can SSH to your OpenBSD VM as normal:
        
        ssh azureuser@<ip address>

## Next Step
If you want to know more about Hyper-V support on OpenBSD6.1, read [OpenBSD 6.1](https://www.openbsd.org/61.html) and [hyperv.4](http://man.openbsd.org/hyperv.4).

In this article, you get steps to create an OpenBSD VM through Azure CLI 2.0. If you want to know how to create a FreeBSD VM using the Classic deployment model, read [Create and upload a FreeBSD VHD to Azure](./classic/freebsd-create-upload-vhd.md). 
