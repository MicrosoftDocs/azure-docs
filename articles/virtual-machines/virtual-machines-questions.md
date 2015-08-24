<properties
	pageTitle="Frequently asked questions for Azure Virtual Machines"
	description="Provides answers to some of the most common questions about Azure virtual machines"
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/17/2015"
	ms.author="kathydav"/>

# Azure Virtual Machines FAQ

This article addresses some common questions users ask about Azure virtual machines, based on input from the Azure VM Support team, as well as from forums, newsgroups, and comments in other articles. For basic information, start with [About Virtual Machines](virtual-machines-about.md).

## What can I run on an Azure VM?

All subscribers can run server software on an Azure virtual machine. Additionally, MSDN subscribers have access to certain Windows client images provided by Azure.

For server software, you can run recent versions of Windows Server, as well as a variety of Linux distributions, and host various server workloads and services on them. For support details, see:

• For Windows VMs -- [Microsoft server software support for Azure Virtual Machines](http://go.microsoft.com/fwlink/p/?LinkId=393550)

• For Linux VMs -- [Linux on Azure-Endorsed Distributions](http://go.microsoft.com/fwlink/p/?LinkId=393551)

For Windows client images, certain versions of Windows 7 and Windows 8.1 are available to MSDN Azure benefit subscribers and MSDN Dev and Test Pay-As-You-Go subscribers, for development and test tasks. For details, including instructions and limitations, see [Windows Client images for MSDN subscribers](http://azure.microsoft.com/blog/2014/05/29/windows-client-images-on-azure/).

## How much storage can I use with a virtual machine?

Each data disk can be up to 1 TB. The number of data disks you can use depends on the size of the virtual machine. For details, see [Sizes for Virtual Machines](virtual-machines-size-specs.md).

An Azure storage account provides storage for the operating system disk and any data disks. Each disk is a .vhd file stored as a page blob. For pricing details, see [Storage Pricing Details](http://go.microsoft.com/fwlink/p/?LinkId=396819).

## Which virtual hard disk types can I use?

Azure supports fixed, VHD-format virtual hard disks. If you want to use a VHDX-format disk in Azure, convert it by using Hyper-V Manager or the [convert-VHD](http://go.microsoft.com/fwlink/p/?LinkId=393656) cmdlet. After you do that, use [Add-AzureVHD](https://msdn.microsoft.com/library/azure/dn495173.aspx) cmdlet (in Service Management mode) to upload the VHD to a storage account in Azure so you can use it with virtual machines. The cmdlet converts a dynamic VHD to a fixed VHD, but doesn’t convert from VHDX to VHD.

- For Linux instructions, see [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](virtual-machines-linux-create-upload-vhd.md).

- For Windows instructions, see [Create and upload a Windows Server VHD to Azure](virtual-machines-create-upload-vhd-windows-server.md).

For instructions on uploading a data disk, see the Linux or Windows article and start with the steps for connecting to Azure.

## Are these virtual machines the same as Hyper-V virtual machines?

In many ways they’re similar to “Generation 1” Hyper-V VMs, but they’re not exactly the same. Both types provide virtualized hardware, and the VHD-format virtual hard disks are compatible. This means you can move them between Hyper-V and Azure. Three key differences that sometimes surprise Hyper-V users are:

- Azure doesn’t provide console access to a virtual machine.
- Azure VMs in most [sizes](virtual-machines-size-specs.md) have only 1 virtual network adapter, which means that they also can have only 1 external IP address. (The A8 and A9 sizes use a second network adapter for application communication between instances in limited scenarios.)
- Azure VMs don't support Generation 2 Hyper-V VM features. For details about these features, see [Virtual Machine Specifications for Hyper-V](http://technet.microsoft.com/library/dn592184.aspx).

## Can these virtual machines use my existing, on-premises networking infrastructure?

For virtual machines created in Service Management, you can use Azure Virtual Network to extend your existing infrastructure. The approach is like setting up a branch office. You can provision and manage virtual private networks (VPNs) in Azure as well as securely connect these to on-premises IT infrastructure. For details, see [Virtual Network Overview](../virtual-network/virtual-networks-overview.md).

You’ll need to specify the network that you want the virtual machine to belong to when you create the virtual machine. This means, for example, that you can’t join an existing virtual machine to a virtual network. However, you can work around this by detaching the virtual hard disk (VHD) from the existing virtual machine, and then use it to create a new virtual machine with the networking configuration you want.

## How can I access  my virtual machine?

You need to establish a remote connection to log on to the virtual machine, using Remote Desktop Connection for a Windows VM or a Secure Shell (SSH) for a Linux VM. For instructions, see:

- [How to Log on to a Virtual Machine Running Windows Server](virtual-machines-log-on-windows-server.md). A maximum of 2 concurrent connections are supported, unless the server is configured as a Remote Desktop Services session host.  
- [How to Log on to a Virtual Machine Running Linux](virtual-machines-linux-how-to-log-on.md). By default, SSH allows a maximum of 10 concurrent connections. You can increase this number by editing the configuration file.

If you’re having problems with Remote Desktop or SSH, install and use the [VMAccess](http://go.microsoft.com/fwlink/p/?LinkId=396856) extension to help fix the problem. For Windows VMs, additional options include:

- In the Azure Preview Portal, find the VM, then click **Reset Remote Access** from the Command bar.
- Review [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-troubleshoot-remote-desktop-connections.md).
- Use Windows PowerShell Remoting to connect to the VM, or create additional endpoints for other resources to connect to the VM. For details, see [How to Set Up Endpoints to a Virtual Machine](virtual-machines-set-up-endpoints.md).

If you’re familiar with Hyper-V, you might be looking for a tool similar to Virtual Machine Connection. Azure doesn’t offer a similar tool because console access to a virtual machine isn’t supported.

## Can I use the D: drive (Windows) or /dev/sdb1 (Linux)?

You shouldn’t use the D: drive (Windows) or /dev/sdb1 (Linux). They provide temporary storage only, so you would risk losing data that can’t be recovered. A common way this could occur is when the virtual machine moves to a different host. Resizing a virtual machine, updating the host, or a hardware failure on the host are some of the reasons a virtual machine might move.

## How can I change the drive letter of the temporary disk?

On a Windows virtual machine, you can change the drive letter by moving the page file and reassigning drive letters, but you’ll need to make sure you do the steps in a specific order. For instructions, see [Change the drive letter of the Windows temporary disk](virtual-machines-windows-change-drive-letter.md).

## How can I upgrade the guest operating system?

The term upgrade generally means moving to a more recent release of your operating system, while staying on the same hardware. For Azure VMs, the process for moving to a more recent release differs for Linux and Windows:

- For Linux VMs, use the package management tools and procedures appropriate for the distribution.
- For a Windows virtual machine, use Windows Server Migration Tools. Don’t attempt to upgrade the guest OS while it resides on Azure. It isn’t supported because of the risk of losing access to a virtual machine. If problems occur during the upgrade, you could lose the ability to start a Remote Desktop session and wouldn’t be able to troubleshoot the problems. For general details about the tools and process, see [Migrate Roles and Features to Windows Server](http://go.microsoft.com/fwlink/p/?LinkId=396940). For details on upgrading to Windows Server 2012 R2, see [Upgrade Options for Windows Server 2012 R2](https://technet.microsoft.com/library/dn303416.aspx).

## What's the default user name and password on the virtual machine?

The images provided by Azure don’t have a pre-configured user name and password. When you create virtual machine using one of those images, you’ll need to provide a user name and password, which you’ll use to log on to the virtual machine.

If you’ve forgotten the user name or password and you’ve installed the VM Agent, you can install and use the VMAccess extension to fix the problem.

Additional details:

- For the Linux images, if you use the Management Portal, ‘azureuser’ is given as a default user name, but you can change this by using ‘From Gallery’ instead of ‘Quick Create’ as the way to create the virtual machine. Using ‘From Gallery’ also lets you decide whether to use a password, an SSH key, or both to log you in. The user account is a non-privileged user that has ‘sudo’ access to run privileged commands. The ‘root’ account is disabled.
- For Windows images, you’ll need to provide a user name and password when you create the VM. The account is added to the Administrators group.

## Can Azure run anti-virus on my virtual machines?

Azure offers several options for anti-virus solutions, but it’s up to you to manage it. For example, you might need a separate subscription for antimalware software, and you’ll need to decide when to run scans and install updates. You can add anti-virus support with a VM extension for Microsoft Antimalware, Symantec Endpoint Protection, or TrendMicro Deep Security Agent when you create a Windows virtual machine, or at a later point. The Symantec and TrendMicro extensions let you use a free limited-time trial subscription or an existing enterprise subscription. Microsoft Antimalware is free of charge. For details, see:

- [How to install and configure Symantec Endpoint Protection on an Azure VM](http://go.microsoft.com/fwlink/p/?LinkId=404207)
- [How to install and configure Trend Micro Deep Security as a Service on an Azure VM](http://go.microsoft.com/fwlink/p/?LinkId=404206)
- [Deploying Antimalware Solutions on Azure Virtual Machines](http://azure.microsoft.com/blog/2014/05/13/deploying-antimalware-solutions-on-azure-virtual-machines/)

## What are my options for backup and recovery?

Azure Backup is available as a preview in certain regions. For details, see [Back up Azure virtual machines](backup-azure-vms.md). Other solutions are available from certified partners. To find out what’s currently available, search the Azure Marketplace.

An additional option is to use the snapshot capabilities of blob storage. To do this, you’ll need to shut down the VM before any operation that relies on a blob snapshot. This saves pending data writes and puts the file system in a consistent state.

## How does Azure charge for my VM?

Azure charges an hourly price based on the VM’s size and operating system. For partial hours, Azure charges only for the minutes of use. If you create the VM with a VM image containing certain pre-installed software, additional hourly software charges may apply. Azure charges separately for storage for the VM’s operating system and data disks. Temporary disk storage is free.

You are charged when the VM status is Running or Stopped, but you are not charged when the VM status is Stopped (De-allocated). To put a VM in the Stopped (De-allocated) state, do one of the following:

- Shut down or delete the VM from the Management Portal.
- Use the Stop-AzureVM cmdlet, available in the Azure PowerShell module.
- Use the Shutdown Role operation in the Service Management REST API and specify StoppedDeallocated for the PostShutdownAction element.

For more details, see [Virtual Machines Pricing](http://azure.microsoft.com/pricing/details/virtual-machines/).

## Will Azure reboot my VM for maintenance?

Generally, you can start, stop, or restart your VM whenever you need to. (For details, see [About starting, stopping, and restarting an Azure VM](https://msdn.microsoft.com/library/azure/dn763934.aspx)). Azure sometimes restarts your VM as part of regular, planned maintenance updates in the Azure datacenters. Unplanned maintenance events can occur when Azure detects a serious hardware problem that affects your VM. For unplanned events, Azure automatically migrates the VM to a healthy host and restarts the VM.

For any standalone VM (meaning the VM isn’t part of an availability set), Azure notifies the subscription’s Service Administrator by email at least one week before planned maintenance because the VMs could be restarted during the update. Applications running on the VMs could experience downtime.

You also can use the Azure portal or Azure PowerShell to view the reboot logs when the reboot occurred due to planned maintenance. For details, see [Viewing VM Reboot Logs](http://azure.microsoft.com/blog/2015/04/01/viewing-vm-reboot-logs/).

To provide redundancy, put two or more similarly configured VMs in the same availability set. This helps ensure at least one VM is available during planned or unplanned maintenance. Azure guarantees certain levels of VM availability for this configuration. For details, see [Manage the availability of virtual machines](virtual-machines-manage-availability.md).

## Additional resources

[About Azure Virtual Machines](virtual-machines-about.md)

[Different Ways to Create a Linux Virtual Machine](virtual-machines-linux-choices-create-vm.md)

[Different Ways to Create a Windows Virtual Machine](virtual-machines-windows-choices-create-vm.md)
