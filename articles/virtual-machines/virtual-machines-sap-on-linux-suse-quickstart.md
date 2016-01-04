<properties
   pageTitle="Testing SAP NetWeaver on Microsoft Azure SUSE Linux VMs | Microsoft Azure"
   description="Testing SAP NetWeaver on Microsoft Azure SUSE Linux VMs"
   services="virtual-machines,virtual-network,storage"
   documentationCenter="saponazure"
   authors="hermanndms"
   manager="juergent"
   editor=""
   tags="azure-resource-manager"
   keywords=""/>
<tags
   ms.service="virtual-machines"
   ms.devlang="NA"
   ms.topic="campaign-page"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="na"
   ms.date="11/26/2015"
   ms.author="hermannd"/>

# Testing SAP NetWeaver on Microsoft Azure SUSE Linux VMs


Here is a list of items to consider when you're testing SAP NetWeaver on Microsoft Azure SUSE Linux VMs.
There is no official SAP support statement for SAP-Linux-Azure at this point.
Nevertheless, customers can do some testing, demonstrating, or prototyping as long as they are not dependent
on official SAP support.

The following information should help you avoid some potential pitfalls.



## SUSE images on Microsoft Azure for testing SAP

For SAP testing on Azure, use only SUSE Linux Enterprise Server (SLES) 11 SP4 and SLES 12. A special SUSE image is in the Azure image gallery ("SLES 11 SP3 for SAP CAL"), but this is not intended for general usage. It's reserved for the [SAP Cloud Appliance Library]
(https://cal.sap.com/) solution. There was no option
to hide this image from the public. So just don't use it.

You should use Azure Resource Manager for all new tests on Azure. To look for SUSE SLES images
and versions by using Azure PowerShell or the Azure command-line interface (CLI), use the following commands. You can then use the output, for example, to define the OS image in a JSON template for deploying a new SUSE Linux VM.
The PowerShell commands below are valid for Azure PowerShell version 1.0.1 or later.

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
   CLI : azure vm image list-skus westeurope SUSE SLES
   ```

* Look for a specific version of a SLES SKU:

   ```
   PS  : Get-AzureRmVMImage -Location "West Europe" -Publisher "SUSE" -Offer "SLES" -skus "12"
   CLI : azure vm image list westeurope SUSE SLES 12
   ```

## Installing WALinuxAgent in a SUSE VM

The agent called WALinuxAgent is part of the SLES images in the Azure gallery. Here are places where you can find
information about installing it manually (e.g. when uploading a SLES OS VHD from on-premises):

- [OpenSUSE] (http://software.opensuse.org/package/WALinuxAgent)

- [Azure] (virtual-machines-linux-endorsed-distributions.md)

- [SUSE] (https://www.suse.com/communities/blog/suse-linux-enterprise-server-configuration-for-windows-azure/)

## Attaching Azure data disks to an Azure Linux VM

Never mount Azure data disks to an Azure Linux VM via device ID. Instead, use the UUID. Be careful
when using, for example, graphical tools to mount Azure data disks. Double-check the entries in /etc/fstab.

The issue with the device ID is that it might change, and then the Azure VM might hang in the boot
process. You might add the nofail parameter in /etc/fstab to mitigate the issue. But watch out
that with nofail, applications might use the mount point as before, and maybe write into the root
file system in case an external Azure data disk wasn't mounted during the boot.

## Uploading a SUSE VM from on-premises to Azure

[This article] (virtual-machines-linux-create-upload-vhd-suse.md) describes the steps for uploading a SUSE VM from on-premises to Azure.

If you want to upload a VM without the deprovision step at the end to keep, for example, an existing SAP
installation as well as the hostname, check the following items:

* Make sure that the OS disk is mounted via UUID and not via device ID. Changing to UUID just in /etc/fstab is not enough for the OS disk. Also, don't forget to adapt the boot loader via YaST or by editing /boot/grub/menu.lst.
* If you used the VHDX format for the SUSE OS disk and converted it to VHD for uploading to Azure, it's very likely that the network device changed from eth0 to eth1.
To avoid issues when you're booting on Azure later, change back to eth0 as described in [this article] (https://dartron.wordpress.com/2013/09/27/fixing-eth1-in-cloned-sles-11-vmware/).

In addition to what's described in the article, we recommended that you remove this:

   /lib/udev/rules.d/75-persistent-net-generator.rules

Installing the Azure Linux Agent (waagent) should also help you avoid potential issues, as long as there are no multiple NICs.

## Deploying a SUSE VM on Azure

New SUSE VMs should be created via JSON template files in the new Azure Resource Manager model. Once the JSON template
file is created, you can deploy the VM by using the following CLI command as an alternative to PowerShell:

   ```
   azure group deployment create "<deployment name>" -g "<resource group name>" --template-file "<../../filename.json>"

   ```
You can find more details about JSON template files in [this article] (resource-group-authoring-templates.md) and [this webpage] (https://azure.microsoft.com/documentation/templates/).

You can find more details about CLI and Azure Resource Manager in [this article] (xplat-cli-azure-resource-manager.md).

## SAP license and hardware key

For the official SAP-Windows-Azure certification, a new mechanism was introduced to calculate the
SAP hardware key that's used for the SAP license. The SAP kernel had to be adapted to make use
of this.
The current SAP kernel versions for Linux do not include this code change. Therefore, it might happen
that in certain situations (e.g. Azure VM resizing), the SAP hardware key changes and the SAP license
is no longer valid.

## SUSE sapconf package

SUSE provides a package called "sapconf," which takes care of a set of SAP-specific settings. More
details about this package--what it does, and how to install and use it--can be found at [this SUSE blog entry] (https://www.suse.com/communities/blog/using-sapconf-to-prepare-suse-linux-enterprise-server-to-run-sap-systems/) and [this SAP blog entry] (http://scn.sap.com/community/linux/blog/2014/03/31/what-is-sapconf-or-how-to-prepare-a-suse-linux-enterprise-server-for-running-sap-systems).

## NFS share in distributed SAP installations

In case of a distributed installation where you want to install, for example, the database and the SAP
application servers in separate VMs, you might share the /sapmnt directory via the network file system (NFS). If there
are problems with the installation steps after you create the NFS share for /sapmnt, check
if "no_root_squash" is set for the share. This was the solution in an internal test case.


## Logical volumes

Logical Volume Manager (LVM) isn't fully validated on Azure. If you need a big logical volume across multiple Azure
data disks (e.g. for the SAP database), you should use mdadm. [This article]
(virtual-machines-linux-configure-raid.md) describes how to set up Linux RAID on Azure by using mdadm.


## Azure SUSE repository

If there is an issue with access to the standard Azure SUSE repository, there is
a simple command to reset it. This could happen when you're creating a private OS image in an Azure
region and then copying the image to a different region where you want to deploy new VMs
based on this private OS image. Just run the following command inside the VM:

   ```
   service guestregister restart
   ```

## Gnome desktop

If you want to use the Gnome desktop for installing a complete SAP demo system inside
a single VM--SAP GUI, browser, SAP management console, and so on--here is a little hint
for installing it on the Azure SLES images:

   SLES 11

   ```
   zypper in -t pattern gnome
   ```

   SLES 12

   ```
   zypper in -t pattern gnome-basic
   ```

## SAP-Oracle support on Linux in the cloud

There is a support restriction from Oracle on Linux in virtualized environments. This is a general topic, not an Azure-specific one. Nevertheless, it's important to
understand.
SAP won't support Oracle on SUSE or Red Hat in a public cloud
like Azure.
Customers should contact Oracle directly to discuss this topic.
