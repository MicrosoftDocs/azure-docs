---
title: Testing SAP NetWeaver on Microsoft Azure SUSE Linux VMs | Microsoft Docs
description: Testing SAP NetWeaver on Microsoft Azure SUSE Linux VMs
services: virtual-machines-linux
documentationcenter: ''
author: hermanndms
manager: jeconnoc
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 645e358b-3ca1-4d3d-bf70-b0f287498d7a
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 09/14/2017
ms.author: hermannd

---
# Running SAP NetWeaver on Microsoft Azure SUSE Linux VMs
This article describes various things to consider when you're running SAP NetWeaver on Microsoft Azure SUSE Linux virtual machines (VMs). As of May 19, 2016 SAP NetWeaver is officially supported on SUSE Linux VMs on Azure. All details regarding Linux versions, 
SAP kernel versions, and other prerequisites can be found in SAP Note 1928533 "SAP Applications on Azure: Supported Products and Azure VM types".
Further documentation about SAP on Linux VMs can be found here: [Using SAP on Linux virtual machines (VMs)](get-started.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

The following information should help you avoid some potential pitfalls.

## SUSE images on Azure for running SAP
For running SAP NetWeaver on Azure, use SUSE Linux Enterprise Server SLES 12 (SPx) or SLES for SAP - see also SAP note 1928533. A special SUSE image is in the Azure Marketplace ("SLES 11 SP3 for SAP CAL"), but the image is not intended for general usage. Do not use this image because it's reserved for the [SAP Cloud Appliance Library](https://cal.sap.com/) solution.  

You need to use the Azure Resource Manager deployment framework for all installations on Azure. To look for SUSE SLES images and versions by using Azure PowerShell or the Azure command-line interface (CLI), use the commands shown below. You can then use the output, for example, to define the OS image in a JSON template for deploying a new SUSE Linux VM.
These PowerShell commands are valid for Azure PowerShell version 1.0.1 and later.

While it's still possible to use the standard SLES images for SAP installations, it's recommended to make use of the new SLES for SAP images. These images are available now in the Azure image gallery. More information about these images can be found on the corresponding [Azure Marketplace page]( https://azuremarketplace.microsoft.com/en-us/marketplace/apps/SUSE.SLES-SAP ) or the [SUSE FAQ web page about SLES for SAP]( https://www.suse.com/products/sles-for-sap/frequently-asked-questions/ ).


* Look for existing publishers, including SUSE:
  
   ```
   PS  : Get-AzureRmVMImagePublisher -Location "West Europe"  | where-object { $_.publishername -like "*US*"  }
   CLI : azure vm image list-publishers westeurope | grep "US"
   ```
* Look for existing offerings from SUSE:
  
   ```
   PS  : Get-AzureRmVMImageOffer -Location "West Europe" -Publisher "SUSE"
   CLI : azure vm image list-offers westeurope SUSE
   ```
* Look for SUSE SLES offerings:
  
   ```
   PS  : Get-AzureRmVMImageSku -Location "West Europe" -Publisher "SUSE" -Offer "SLES"
   PS  : Get-AzureRmVMImageSku -Location "West Europe" -Publisher "SUSE" -Offer "SLES-SAP"
   CLI : azure vm image list-skus westeurope SUSE SLES
   CLI : azure vm image list-skus westeurope SUSE SLES-SAP
   ```
* Look for a specific version of a SLES SKU:
  
   ```
   PS  : Get-AzureRmVMImage -Location "West Europe" -Publisher "SUSE" -Offer "SLES" -skus "12-SP2"
   PS  : Get-AzureRmVMImage -Location "West Europe" -Publisher "SUSE" -Offer "SLES-SAP" -skus "12-SP2"
   CLI : azure vm image list westeurope SUSE SLES 12-SP2
   CLI : azure vm image list westeurope SUSE SLES-SAP 12-SP2
   ```

## Installing WALinuxAgent in a SUSE VM
The agent called WALinuxAgent is part of the SLES images in the Azure Marketplace. For information about installing it manually (for example, when uploading a SLES OS virtual hard disk (VHD) from on-premises), see:

* [OpenSUSE](http://software.opensuse.org/package/WALinuxAgent)
* [Azure](../../linux/endorsed-distros.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
* [SUSE](https://www.suse.com/communities/blog/suse-linux-enterprise-server-configuration-for-windows-azure/)

## SAP "enhanced monitoring"
SAP "enhanced monitoring" is a mandatory prerequisite to run SAP on Azure. Check details in SAP note 2191498
"SAP on Linux with Azure: Enhanced Monitoring".

## Attaching Azure data disks to an Azure Linux VM
Never mount Azure data disks to an Azure Linux VM by using the device ID. Instead, use the universally unique identifier (UUID). Be careful when you use graphical tools to mount Azure data disks, for example. Double-check the entries in /etc/fstab.

The issue with the device ID is that it might change, and then the Azure VM might hang in the boot process. To mitigate the issue, you could add the nofail parameter in /etc/fstab. But, be careful with
nofail because applications might use the mount point as before, and might write into the root file system in case an external Azure data disk wasn't mounted during the boot.

The only exception to mounting via UUID is attaching an OS disk for troubleshooting purposes, as described in the section that follow.

## Troubleshooting a SUSE VM that isn't accessible anymore
There might be situations where a SUSE VM on Azure hangs in the boot process (for example, with an error related to
mounting disks). You can verify this issue by using the boot diagnostics feature for Azure Virtual Machines v2 in the Azure portal. For more information, see [Boot diagnostics](https://azure.microsoft.com/blog/boot-diagnostics-for-virtual-machines-v2/).

One way to solve the problem is to attach the OS disk from the damaged VM to another SUSE VM on Azure. Then make appropriate changes like editing /etc/fstab or removing network udev rules, as described in the next section.

There is one important thing to consider. Deploying several SUSE VMs from the same Azure Marketplace image (for example, SLES 11 SP4) causes the OS disk to always be mounted by the same UUID. Therefore, using the UUID to attach an OS disk from a different VM that was deployed by using the same Azure Marketplace image results in two identical UUIDs. Two identical UUIDs cause the VM used for troubleshooting, booting from the attached and damaged OS disk instead of the original OS disk.

There are two ways to avoid problems:

* Use a different Azure Marketplace image for the troubleshooting VM (for example, SLES 11 SPx instead of SLES 12).
* Don't attach the damaged OS disk from another VM by using UUID--use something else.

## Uploading a SUSE VM from on-premises to Azure
For a description of the steps to upload a SUSE VM from on-premises to Azure, see [Prepare a SLES or openSUSE virtual machine for Azure](../../linux/suse-create-upload-vhd.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

If you want to upload a VM without the deprovision step at the end (for example, to keep an existing SAP installation, as well as the host name), check the following items:

* Make sure that the OS disk is mounted by using UUID and not the device ID. Changing to UUID just in /etc/fstab is not enough for the OS disk. Also, don't forget to adapt the boot loader through YaST or by editing /boot/grub/menu.lst.
* If you use the VHDX format for the SUSE OS disk and convert it to VHD for uploading to Azure, it is likely that the network device changes from eth0 to eth1. To avoid problems when you're booting on Azure later, change back to eth0 as described in [Fixing eth0 in cloned SLES 11 VMware](https://dartron.wordpress.com/2013/09/27/fixing-eth1-in-cloned-sles-11-vmware/).

In addition to what's described in the article, we recommend that you remove this file:

   /lib/udev/rules.d/75-persistent-net-generator.rules

You can also install the Azure Linux Agent (waagent) to help you avoid potential issues, as long as there are not multiple NICs.

## Deploying a SUSE VM on Azure
You should create new SUSE VMs by using JSON template files in the new Azure Resource Manager model. After the JSON template
file is created, you can deploy the VM by using the following CLI command as an alternative to PowerShell:

   ```
   azure group deployment create "<deployment name>" -g "<resource group name>" --template-file "<../../filename.json>"

   ```
For more information about JSON template files, see [Authoring Azure Resource Manager templates](../../../resource-group-authoring-templates.md) and [Azure quickstart templates](https://azure.microsoft.com/documentation/templates/).

For more information about Azure classic CLI and Azure Resource Manager, see [Use the Azure classic CLI for Mac, Linux, and Windows with Azure Resource Manager](../../../xplat-cli-azure-resource-manager.md).

## SAP license and hardware key
For the official SAP-Azure certification, a new mechanism was introduced to calculate the SAP hardware key that's used for the SAP license. The SAP kernel had to be adapted to make use of the new algorithm. Former SAP kernel versions for Linux did not include this code change. Therefore, in certain situations (for example, Azure VM resizing), the SAP hardware key changed and the SAP license was no longer be valid. A solution is provided with more recent SAP Linux kernels.  The detailed SAP kernel patches are documented in SAP note 1928533.

## SUSE sapconf package / tuned-adm
SUSE provides a package called "sapconf" that manages a set of SAP-specific settings. For more information about what this package does, and how to install and use it, see:  [Using sapconf to prepare a SUSE Linux Enterprise Server to run SAP systems](https://www.suse.com/communities/blog/using-sapconf-to-prepare-suse-linux-enterprise-server-to-run-sap-systems/) and [What is sapconf or how to prepare a SUSE Linux Enterprise Server for running SAP systems?](http://scn.sap.com/community/linux/blog/2014/03/31/what-is-sapconf-or-how-to-prepare-a-suse-linux-enterprise-server-for-running-sap-systems).

In the meantime, there is a new tool, which replaces 'sapconf - tuned-adm'. One can find more information about this tool following the two links:

- SLES documentation about 'tuned-adm' profile sap-hana can be found [here](https://www.suse.com/documentation/sles-for-sap-12/book_s4s/data/sec_saptune.html) 

- Tuning Systems for SAP Workloads with 'tuned-adm' - can be found [here](https://www.suse.com/documentation/sles-for-sap-12/pdfdoc/book_s4s/book_s4s.pdf) in chapter 6.2

## NFS share in distributed SAP installations
If you have a distributed installation--for example, where you want to install the database and the SAP application servers in separate VMs--you can share the /sapmnt directory via Network File System (NFS). If you have problems with the installation steps after you create the NFS share for /sapmnt, check to see if "no_root_squash" is set for the share.

## Logical volumes
In the past, if one needed a large logical volume across multiple Azure data disks (for example, for the SAP database), it was recommended to use Raid Management tool MDADM since Linux Logical Volume Manager (LVM) was not fully validated yet on Azure. To learn how to set up Linux RAID on Azure by using mdadm, see [Configure software RAID on Linux](../../linux/configure-raid.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). In the meantime, as of beginning of May 2016, Linux Logical Volume Manager is fully supported on Azure and can be used as an alternative to MDADM. For more information regarding LVM on Azure, read:  
[Configure LVM on a Linux VM in Azure](../../linux/configure-lvm.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Azure SUSE repository
If you have an issue with access to the standard Azure SUSE repository, you can use a command to reset it. Such problems might happen if you create a private OS image in one Azure
region and then copy the image to a different Azure region to deploy new VMs that are based on this private OS image. Run the following command inside the VM:

   ```
   service guestregister restart
   ```

## Gnome desktop
If you want to use the Gnome desktop to install a complete SAP demo system inside a single VM--including an SAP GUI, browser, and SAP management console--use this hint to install it on the Azure SLES images:

   For SLES 11:

   ```
   zypper in -t pattern gnome
   ```

   For SLES 12:

   ```
   zypper in -t pattern gnome-basic
   ```

## SAP support for Oracle on Linux in the cloud
There is a support restriction from Oracle on Linux in virtualized environments. Although this support restriction is not an Azure-specific topic, it's important to understand. SAP does not support Oracle on SUSE or Red Hat in a public cloud like Azure. 
In the meantime running, Oracle DB in Azure is fully supported by SAP on Oracle Linux (see SAP Note 1928533). If other combinations are required, contact Oracle directly.

