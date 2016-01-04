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


Here is a list of items to consider when testing SAP NetWeaver on Microsoft Azure SUSE Linux VMs.
There is no official SAP support statement for SAP-Linux-Azure at this point in time. 
Nevertheless customers can do some testing, demo or prototyping as long as they are not dependent
on official SAP support. 

The following list should simply help to avoid some potential pitfalls and make life easier :



## SUSE images on Microsoft Azure for testing SAP 

For SAP testing on Azure only SLES 11SP4 and SLES 12 should be used. A special SUSE image can
be found in the Azure image gallery : "SLES 11 SP3 for SAP CAL"
But this is not intended for general usage. It's reserved for the SAP Cloud Appliance Library
solution called SAP "CAL" ( <https://cal.sap.com/> ).There was no option
to hide this image from the public. So just don't use it.

All new tests on Azure should be done with Azure Resource Manager. To look for SUSE SLES images 
and versions using Azure Powershell or CLI use the following commands. The output can then be used
e.g. to define the OS image in a json template for deploying a new SUSE Linux VM. 
The PS commands below are valid for Azure Powershell version >= 1.0.1

* look for existing publishers including SUSE :

   ```
   PS  : Get-AzureRmVMImagePublisher -Location "West Europe"  | where-object { $_.publishername -like "*US*"  }
   CLI : azure vm image list-publishers westeurope | grep "US"
   ```

* look for existing offerings from SUSE :
      
   ```
   PS  : Get-AzureRmVMImageOffer -Location "West Europe" -Publisher "SUSE"
   CLI : azure vm image list-offers westeurope SUSE
   ```
      
* look for SUSE SLES offerings :
      
   ```
   PS  : Get-AzureRmVMImageSku -Location "West Europe" -Publisher "SUSE" -Offer "SLES"
   CLI : azure vm image list-skus westeurope SUSE SLES
   ```
      
* look for a specific version of a SLES sku :
      
   ```
   PS  : Get-AzureRmVMImage -Location "West Europe" -Publisher "SUSE" -Offer "SLES" -skus "12"
   CLI : azure vm image list westeurope SUSE SLES 12
   ```
     
## Installing WALinuxAgent in a SUSE VM 
 
The agent is part of the SLES images in the Azure gallery. Here are places where one can find
information about installing it manually ( e.g. when uploading a SLES OS vhd from on-premises ) :

<http://software.opensuse.org/package/WALinuxAgent>

<https://azure.microsoft.com/documentation/articles/virtual-machines-linux-endorsed-distributions/>

<https://www.suse.com/communities/blog/suse-linux-enterprise-server-configuration-for-windows-azure/>

## Attaching Azure data disks to an Azure Linux VM

NEVER mount Azure data disks to an Azure Linux VM via device id. Instead use UUID. Be careful
when using e.g. graphical tools to mount Azure data disks. Double-check the entries in /etc/fstab.
The issue with device id is that it might change and then the Azure VM might hang in the boot 
process. One might add the nofail parameter in /etc/fstab to mitigate the issue. But watch out
that with nofail applications might use the mount point as before and maybe write into the root
file system in case an external Azure data disk wasn't mounted during the boot.

## Uploading a SUSE VM from on-premises to Azure

The following blog describes the steps :

<https://azure.microsoft.com/documentation/articles/virtual-machines-linux-create-upload-vhd-suse/>

If one wants to upload a VM without the deprovision step at the end to keep e.g. an existing SAP
installation as well as the hostname the following items have to be checked :

* make sure that the OS disk is mounted via UUID and NOT via device id. Changing to UUID just in /etc/fstab is NOT enough for the OS disk. One may not forget to also adapt the boot loader e.g. via yast or by editing /boot/grub/menu.lst
* in case one used the vhdx format for the SUSE OS disk and converts it to vhd for uploading to Azure it's very likely that the network device changed from eth0 to eth1.
To avoid issues when booting on Azure later on one should change back to eth0 like described here :

<https://dartron.wordpress.com/2013/09/27/fixing-eth1-in-cloned-sles-11-vmware/>

In addition to what's described in the article it's recommended to also remove 

   /lib/udev/rules.d/75-persistent-net-generator.rules

Installing the waagent should also avoid any potential issue as long as there are no multiple nics.

## Deploy a SUSE VM on Azure

New VMs should be created via json template files in the new Azure Resource Manager model. Once the json template
file is created one can deploy the VM using the following CLI command as an alternative to Powershell :

   ```
   azure group deployment create "<deployment name>" -g "<resource group name>" --template-file "<../../filename.json>"
   
   ```
More details about json template files can be found here :

<https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/>

<https://azure.microsoft.com/documentation/templates/>

More details about CLI and Azure Resource Manager can be found here :

<https://azure.microsoft.com/documentation/articles/xplat-cli-azure-resource-manager/>

## SAP license and hardware key

For the official SAP-Windows-Azure certification a new mechanism was introduced to calculate the
SAP hardware key which is used for the SAP license. The SAP kernel had to be adapted to make use 
of this. 
The current SAP kernel versions for Linux do NOT include this code change. Therefore it might happen 
that in certain situations ( e.g. Azure VM resize ) the SAP hardware key changes and the SAP license
is no longer valid

## SUSE sapconf package

SUSE provides a package called "sapconf" which takes care of a set of SAP-specific settings. More
details about this package, what it does and how to install and use it can be found here :

<https://www.suse.com/communities/blog/using-sapconf-to-prepare-suse-linux-enterprise-server-to-run-sap-systems/>

<http://scn.sap.com/community/linux/blog/2014/03/31/what-is-sapconf-or-how-to-prepare-a-suse-linux-enterprise-server-for-running-sap-systems>

## NFS share in distributed SAP installations

In case of a distributed installation where one wants to install e.g. the database and the SAP
application servers in separate VMs one might share the /sapmnt directory via NFS. If there
should be problems with the installation steps after creating the NFS share for /sapmnt check
if "no_root_squash" is set for the share. This was the solution in an internal test case


## Logical volumes

LVM isn't fully validated on Azure. If one needs a big logical volume across multiple Azure 
data disks ( e.g. for the SAP database ) mdadm should be used. Here is a nice blog which
describes how to set up Linux RAID on Azure using mdadm :

<https://azure.microsoft.com/documentation/articles/virtual-machines-linux-configure-raid/>


## SUSE Azure repository

In case there should be an issue with access to the standard Azure SUSE repository there is 
a simple command to reset it. This could happen when creating a private OS image in an Azure
region and then copying the image to a different region where one wants to deploy new VMs
based on this private OS image. Just run the following command inside the VM :

   ```
   service guestregister restart
   ```

## Gnome desktop

If someone would like to use the Gnome desktop for installing a complete SAP demo system inside
one single VM including SAP GUI, browser, SAP management console and so on here is a little hint 
for installing it on the Azure SLES images :

   SLES 11

   ```
   zypper in -t pattern gnome
   ```
      
   SLES 12
   
   ```
   zypper in -t pattern gnome-basic
   ```

## SAP-Oracle support on Linux in the Cloud
 
This isn't in fact an Azure specific topic but a general one. Nevertheless it's important to
understand. There is a support restriction from Oracle on Linux in virtualized environments.
At the end this means that SAP won't support Oracle on SUSE or also RedHat in a public cloud
like Azure. 
Customers should contact Oracle directly to discuss this topic.


