---
title: Configure the Microsoft Azure-hosted VM for the Azure Marketplace 
description: Explains how to size, update, and generalize a VM hosted on Azure.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 10/19/2018
ms.author: pabutler
---

# Configure the Azure-hosted VM

This article explains how to size, update, and generalize a virtual machine (VM) hosted on Azure.  These steps are necessary to prepare your VM to be deployed from the Azure Marketplace.


## Sizing the VHDs

<!--TD: Check if the following assertion is true. I didn't understand the original content. -->
If you have selected one of the VMs pre-configured with an operating system (and optionally additional services), then you have already picked a standard Azure VM size, as described in [Virtual machine SKUs tab](./cpp-skus-tab.md).  Starting your solution with a pre-configured OS is the recommended approach.  However, if you are installing an OS manually, then you must size your primary VHD in your VM image:

- For Windows, the operating system VHD should be created as a 127-128 GB fixed-format VHD. 
- For Linux, this VHD should be created as a 30-50 GB fixed-format VHD.

If the physical size is less than 127-128 GB, the VHD should be sparse. The base Windows and SQL Server images provided already meet these requirements, so do not change the format or the size of the VHD obtained. 

Data disks can be as large as 1 TB. When deciding on their size, remember that customers cannot resize VHDs within an image at the time of deployment. Data disk VHDs should be created as fixed-format VHDs. They should also be sparse. Data disks can initially be empty or contain data.


## Install the most current updates

The base images of operating system VMs contain the latest updates up to their published date. Before publishing the operating system VHD you have created, ensure that you update the OS and all installed services with all the latest security and maintenance patches.

For Windows Server 2016, run the **Check for Updates** command.  Otherwise, for older versions of Windows, see [How to get an update through Windows Update](https://support.microsoft.com/help/3067639/how-to-get-an-update-through-windows-update).  Windows update will automatically install the latest critical and important security updates.

For Linux distributions, updates are commonly downloaded and installed through a command-line tool or a graphical utility.  For example, Ubuntu Linux provides the [apt-get](https://manpages.ubuntu.com/manpages/cosmic/man8/apt-get.8.html) command and the [Update Manager](https://manpages.ubuntu.com/manpages/cosmic/man8/update-manager.8.html) tool for updating the OS.


## Perform additional security checks

You should maintain a high level of security for your solution images in the Azure Marketplace.  The following article provides a checklist of security configurations and procedures to assist you in this objective: [Security Recommendations for Azure Marketplace Images](https://docs.microsoft.com/azure/security/security-recommendations-azure-marketplace-images).  Some of these recommendations are specific to Linux-based images, but most apply to any VM image. 


## Perform custom configuration and scheduled tasks

If additional configuration is needed, the recommended approach is to use a scheduled task that runs at startup to make any final changes to the VM after it has been deployed.  Also consider the following recommendations:
- If it is a run-once task, it is recommended that the task delete itself after it successfully completes.
- Configurations should not rely on drives other than C or D, because only these two drives that are always guaranteed to exist. Drive C is the operating system disk, and drive D is the temporary local disk.

For more information about Linux customizations, see [Virtual machine extensions and features for Linux](https://docs.microsoft.com/azure/virtual-machines/extensions/features-linux).


## Generalize the image

All images in the Azure Marketplace must be reusable in a generic fashion. To achieve this reusability, the operating system VHD must be *generalized*, an operation that removes all instance-specific identifiers and software drivers from a VM.

### Windows

Windows OS disks are generalized with the [sysprep tool](https://docs.microsoft.com/windows-hardware/manufacture/desktop/sysprep--system-preparation--overview). If you subsequently update or reconfigure the OS, you must rerun sysprep. 

> [!WARNING]
>  Because updates may run automatically, once you run sysprep, you should to turn off the VM until it is deployed.  This shutdown will avoid subsequent updates from making instance-specific changes to the VHD OS or installed services.

For more information about running sysprep, see [Steps to generalize a VHD](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource#generalize-the-windows-vm-using-sysprep)

### Linux

Following two-step process will generalize a Linux VM and redeploy it as a separate VM.  For more information, see [How to create an image of a virtual machine or VHD](../../../virtual-machines/linux/capture-image.md). 

#### Remove the Azure Linux agent
1.  Connect to your Linux VM using an SSH client.
2.  In the SSH window, type the following command: <br/>
    `sudo waagent -deprovision+user`
3.  Type `y` to continue. (You can add the `-force` parameter to the previous command avoid this confirmation step.)
4.  After the command completes, type `exit` to close the SSH client.

<!-- TD: I need to add meat and/or references to the following steps -->
#### Capture the Image
1.  Go to the Azure portal, select your resource group (RG) and de-allocate the VM.
2.  Your VHD is generalized now and you can create a new VM by using this VHD.


## Create one or more copies

Creating copies of VM is often useful for backup, testing, customized fail-over or load balancing, to offer different configurations of a solution, and so on. For information on how to duplicate and download a primary VHD, to make an unmanaged clone, see:

- Linux VM: [Download a Linux VHD from Azure](../../../virtual-machines/linux/download-vhd.md)
- Windows VM: [Download a Windows VHD from Azure](../../../virtual-machines/windows/download-vhd.md)


## Next steps

After your VM is configured, you are ready to [deploy a virtual machine from a virtual hard disk](./cpp-deploy-vm-vhd.md).
