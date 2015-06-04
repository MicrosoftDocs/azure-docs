<properties 
	pageTitle="Frequently asked questions for Azure Virtual Machines" 
	description="Provides answers to some of the most common questions about Azure virtual machines" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor=""/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-multiple" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/15/2015" 
	ms.author="kathydav"/>

# Azure Virtual Machines FAQ

This article addresses some common questions users ask about Azure virtual machines, based on input from the Azure VM Support team, as well as from forums, newsgroups, and comments in other articles. For general information, start with Virtual Machines Overview.

## What can I run on an Azure VM?

All subscribers can run server software on an Azure virtual machine. Additionally, MSDN subscribers have access to certain Windows client images provided by Azure.

For server software, you can run recent versions of Windows Server, as well as a variety of Linux distributions, and host various server workloads and services on them. For support details, see:

• For Windows VMs -- [Microsoft server software support for Azure Virtual Machines](http://go.microsoft.com/fwlink/p/?LinkId=393550)

• For Linux VMs -- [Linux on Azure-Endorsed Distributions](http://go.microsoft.com/fwlink/p/?LinkId=393551)

For Windows client images, certain versions of Windows 7 and Windows 8.1 are available to MSDN Azure benefit subscribers and MSDN Dev and Test Pay-As-You-Go subscribers, for development and test tasks. For details, including instructions and limitations, see [Windows Client images for MSDN subscribers](http://azure.microsoft.com/blog/2014/05/29/windows-client-images-on-azure/).


## How much storage can I use with a virtual machine?

Each data disk can be up to 1 TB. The number of data disks you can use depends on the size of the virtual machine. For details, see [Sizes for Virtual Machines](virtual-machines-size-specs.md).

An Azure storage account provides storage for the operating system disk and any data disks. Each disk is a .vhd file stored as a page blob. You’re charged for the storage used in the storage account, rather than for available space on the disk. For pricing details, see [Storage Pricing Details](http://go.microsoft.com/fwlink/p/?LinkId=396819). For disk details, see [About Virtual Machine Disks in Azure](need file).

## Which virtual hard disk types can I use?

Azure supports fixed, VHD-format virtual hard disks. If you want to use a VHDX-format disk in Azure, convert it by using Hyper-V Manager or the [convert-VHD](http://go.microsoft.com/fwlink/p/?LinkId=393656) cmdlet. After you do that, use the [Add-AzureVHD](http://go.microsoft.com/fwlink/p/?LinkId=396821) cmdlet to upload the VHD to a storage account in Azure so you can use it with virtual machines. The cmdlet converts a dynamic VHD to a fixed VHD, but doesn’t convert from VHDX to VHD.

- For Linux instructions, see Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System http://www.windowsazure.com/documentation/articles/virtual-machines-linux-create-upload-vhd/

- For Windows instructions, see Creating and Uploading a Windows Server VHDhttp://azure.microsoft.com/documentation/articles/virtual-machines-create-upload-vhd-windows-server/ 

For instructions on uploading a data disk, see the Linux or Windows article and start with the steps for connecting to Azure.

## Are these virtual machines the same as Hyper-V virtual machines?

In many ways they’re similar to “Generation 1” Hyper-V VMs, but they’re not exactly the same. Both types provide virtualized hardware, and the VHD-format virtual hard disks are compatible. This means you can move them between Hyper-V and Azure. Two key differences that sometimes surprise Hyper-V users are:

- Azure doesn’t provide console access to a virtual machine.
- Azure VMs in most sizes have only 1 virtual network adapter, which means that they also can have only 1 external IP address. (The A8 and A9 sizes use a second network adapter for application communication between instances in limited scenarios.)
- Azure VMs don't support Generation 2 Hyper-V VM features. For details about these features, see [Virtual Machine Specifications for Hyper-V](http://technet.microsoft.com/library/dn592184.aspx).

## Can these virtual machines use my existing, on-premises networking infrastructure?

You can use Azure Virtual Network to extend your existing infrastructure. The approach is like setting up a branch office. You can provision and manage virtual private networks (VPNs) in Azure as well as securely connect these to on-premises IT infrastructure. For details, see [Virtual Network Overview](https://msdn.microsoft.com/library/jj156007.aspx).

You’ll need to specify the network that you want the virtual machine to belong to when you create the virtual machine. This means, for example, that you can’t join an existing virtual machine to a virtual network. However, you can work around this by detaching the virtual hard disk (VHD) from the existing virtual machine, and then use it to create a new virtual machine with the networking configuration you want.

## How can I access  my virtual machine?

You need to establish a remote connection to log on to the virtual machine, using Remote Desktop Connection for a Windows VM or a Secure Shell (SSH) for a Linux VM. For instructions, see: 

How to Log on to a Virtual Machine Running Windows Serverhttp://go.microsoft.com/fwlink/p/?LinkID=254035. A maximum of 2 concurrent connections are supported, unless the server is configured as a Remote Desktop Services session host.  
How to Log on to a Virtual Machine Running Linuxhttp://go.microsoft.com/fwlink/p/?LinkId=396827. By default, SSH allows a maximum of 10 concurrent connections. You can increase this number by editing the configuration file.

If you’re having problems with Remote Desktop or SSH, try installing and using the VMAccess http://go.microsoft.com/fwlink/p/?LinkId=396856 extension to fix the problem.
You  can also use Windows PowerShell Remoting to connect to the VM, or create additional endpoints for other resources to connect to the VM. For details, see How to Set Up Endpoints to a Virtual Machine http://azure.microsoft.com/documentation/articles/virtual-machines-set-up-endpoints/

If you’re familiar with Hyper-V, you might be looking for a tool similar to Virtual Machine Connection. Azure doesn’t offer a similar tool because console access to a virtual machine isn’t supported.

## Can I use the D: drive (Windows) or /dev/sdb1 (Linux)?

You shouldn’t use the D: drive (Windows) or /dev/sdb1 (Linux). They provide temporary storage only, so you would risk losing data that can’t be recovered. A common way this could occur is when the virtual machine moves to a different host. Resizing a virtual machine, updating the host, or a hardware failure on the host are some of the reasons a virtual machine might move.

## 









