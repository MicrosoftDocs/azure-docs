---
title: FAQ about Windows VMs in Azure | Microsoft Docs
description: Provides answers to some of the common questions about Windows virtual machines created with the Resource Manager model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: timlt
editor: ''
tags: azure-resource-management

ms.assetid: 757da816-a050-4889-a010-6f75d7978eb7
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 01/17/2017
ms.author: cynthn

---

# Frequently asked question about Windows Virtual Machines
This article addresses some common questions about Windows virtual machines created in Azure using the Resource Manager deployment model. For the Linux version of this topic, see [Frequently asked question about Linux Virtual Machines](../linux/faq.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

## What can I run on an Azure VM?
All subscribers can run server software on an Azure virtual machine. For information about the support policy for running Microsoft server software in Azure, see [Microsoft server software support for Azure Virtual Machines](https://support.microsoft.com/kb/2721672)

Certain versions of Windows 7, Windows 8.1, and Windows 10 are available to MSDN Azure benefit subscribers and MSDN Dev and Test Pay-As-You-Go subscribers, for development and test tasks. For details, including instructions and limitations, see [Windows Client images for MSDN subscribers](http://azure.microsoft.com/blog/2014/05/29/windows-client-images-on-azure/). 

## How much storage can I use with a virtual machine?
Each data disk can be up to 1 TB. The number of data disks you can use depends on the size of the virtual machine. For details, see [Sizes for Virtual Machines](sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

An Azure storage account provides storage for the operating system disk and any data disks. Each disk is a .vhd file stored as a page blob. For pricing details, see [Storage Pricing Details](https://azure.microsoft.com/pricing/details/storage/).

## How can I access my virtual machine?
Establish a remote connection using Remote Desktop Connection (RDP) for a Windows VM. For instructions, see [How to connect and log on to an Azure virtual machine running Windows](connect-logon.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). A maximum of two concurrent connections are supported, unless the server is configured as a Remote Desktop Services session host.  

If you’re having problems with Remote Desktop, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](troubleshoot-rdp-connection.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

If you’re familiar with Hyper-V, you might be looking for a tool similar to VMConnect. Azure doesn’t offer a similar tool because console access to a virtual machine isn’t supported.

## Can I use the temporary disk (the D: drive by default) to store data?
Don’t use the temporary disk to store data. It is only temporary storage, so you would risk losing data that can’t be recovered. Data loss can occur when the virtual machine moves to a different host. Resizing a virtual machine, updating the host, or a hardware failure on the host are some of the reasons a virtual machine might move.

If you have an application that needs to use the D: drive letter, you can reassign drive letters so that the temporary disk uses something other than D:. For instructions, see [Change the drive letter of the Windows temporary disk](change-drive-letter.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).


## How can I change the drive letter of the temporary disk?
You can change the drive letter by moving the page file and reassigning drive letters, but you need to make sure you do the steps in a specific order. For instructions, see [Change the drive letter of the Windows temporary disk](change-drive-letter.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

## Can I add an existing VM to an availability set?
No. If you want your VM to be part of an availability set, you need to create the VM within the set. There currently isn't a way to add a VM to an availability set after it has been created.
## Can I upload a virtual machine to Azure?
Yes. For instructions, see [Upload a Windows VM image to Azure ](upload-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

## Can I resize the OS disk?
Yes. For instructions, see [How to expand the OS drive of a Virtual Machine in an Azure Resource Group](expand-os-disk.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Can I copy or clone an existing Azure VM?
Yes. For instructions, see [How to create a copy of a Windows virtual machine in the Resource Manager deployment model](vhd-copy.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Why am I not seeing Canada Central and Canada East regions through Azure Resource Manager?

The two new regions of Canada Central and Canada East are not automatically registered for virtual machine creation for existing Azure subscriptions. This registration is done automatically when a virtual machine is deployed through the Azure portal to any other region using Azure Resource Manager. After a virtual machine is deployed to any other Azure region, the new regions should be available for subsequent virtual machines.

## Does Azure support Linux VMs?
Yes. To quickly create a Linux VM to try out, see [Create a Linux VM on Azure using the Portal](../linux/quick-create-portal.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## Can I add a NIC to my VM after it's created?
Yes, this is now possible. The VM first needs to be stopped deallocated. Then you can add or remove a NIC (unless it's the last NIC on the VM). 

## Are there any computer name requirements?
Yes. The computer name can be a maximum of 15 characters in length. See [Infrastructure naming guidelines](infrastructure-naming-guidelines.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) for more information around naming your resources.

## What are the username requirements when creating a VM?

Usernames can be a maximum of 20 characters in length and cannot end in a period ("."). 


The following usernames are not allowed:
<table>
    <tr>
        <td style="text-align:center">administrator </td><td style="text-align:center"> admin </td><td style="text-align:center"> user </td><td style="text-align:center"> user1</td>
    </tr>
    <tr>
        <td style="text-align:center">test </td><td style="text-align:center"> user2 </td><td style="text-align:center"> test1 </td><td style="text-align:center"> user3</td>
    </tr>    <tr>
        <td style="text-align:center">admin1 </td><td style="text-align:center"> 1 </td><td style="text-align:center"> 123 </td><td style="text-align:center"> a</td>
    </tr>
    <tr>
        <td style="text-align:center">actuser  </td><td style="text-align:center"> adm </td><td style="text-align:center"> admin2 </td><td style="text-align:center"> aspnet</td>
    </tr>
    <tr>
        <td style="text-align:center">backup </td><td style="text-align:center"> console </td><td style="text-align:center"> david </td><td style="text-align:center"> guest</td>
    </tr>
    <tr>
        <td style="text-align:center">john </td><td style="text-align:center"> owner </td><td style="text-align:center"> root </td><td style="text-align:center"> server</td>
    </tr>
    <tr>
        <td style="text-align:center">sql </td><td style="text-align:center"> support </td><td style="text-align:center"> support_388945a0 </td><td style="text-align:center"> sys</td>
    </tr>
    <tr>
        <td style="text-align:center">test2 </td><td style="text-align:center"> test3 </td><td style="text-align:center"> user4 </td><td style="text-align:center"> user5</td>
    </tr>
</table>

## What are the password requirements when creating a VM?
Passwords must be 12 - 123 characters in length and meet 3 out of the following 4 complexity requirements:

* Have lower characters
* Have upper characters
* Have a digit
* Have a special character (Regex match [\W_])

The following passwords are not allowed:

<table>
    <tr>
        <td>abc@123 </td>
        <td>P@$$w0rd </td>
        <td>P@ssw0rd </td>
        <td>P@ssword123 </td>
        <td>Pa$$word </td>
    </tr>
    <tr>
        <td>pass@word1 </td>
        <td>Password! </td>
        <td>Password1 </td>
        <td>Password22 </td>
        <td>iloveyou! </td>
    </tr>
</table>
