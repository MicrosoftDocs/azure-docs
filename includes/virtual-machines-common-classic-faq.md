


This article addresses some common questions users ask about Azure virtual machines created with the classic deployment model.

## Can I migrate my VM created in the classic deployment model to the new Resource Manager model?

Yes. For instructions on how to migrate, see:

- [Migrate from classic to Azure Resource Manager using Azure PowerShell](../articles/virtual-machines/virtual-machines-windows-ps-migration-classic-resource-manager.md).

- [Migrate from classic to Azure Resource Manager using Azure CLI](../articles/virtual-machines/virtual-machines-linux-cli-migration-classic-resource-manager.md).

## What can I run on an Azure VM?

All subscribers can run server software on an Azure virtual machine. You can run recent versions of Windows Server, as well as a variety of Linux distributions. For support details, see:

• For Windows VMs -- [Microsoft server software support for Azure Virtual Machines](http://go.microsoft.com/fwlink/p/?LinkId=393550)

• For Linux VMs -- [Linux on Azure-Endorsed Distributions](http://go.microsoft.com/fwlink/p/?LinkId=393551)

For Windows client images, certain versions of Windows 7 and Windows 8.1 are available to MSDN Azure benefit subscribers and MSDN Dev and Test Pay-As-You-Go subscribers, for development and test tasks. For details, including instructions and limitations, see [Windows Client images for MSDN subscribers](https://azure.microsoft.com/blog/2014/05/29/windows-client-images-on-azure/).

## Why are affinity groups being deprecated?

Affinity groups are a legacy concept for a geographical grouping of a customer’s cloud service deployments and storage accounts within Azure. They were originally provided to improve VM-to-VM network performance in the early Azure network designs. They also supported the initial release of virtual networks (VNets), which were limited to a small set of hardware in a region.

The current Azure network within a region is designed so that affinity groups are no longer required. Virtual networks are also at a regional scope, so an affinity group is no longer required when you use a virtual network. Due to these improvements, we no longer recommend that customers use affinity groups because they can be limiting in some scenarios. Using affinity groups will unnecessarily associate your VMs to specific hardware that limits the choice of VM sizes that are available to you. It might also lead to capacity-related errors when you attempt to add new VMs if the specific hardware associated with the affinity group is near capacity.

Affinity group features are already deprecated in the Azure Resource Manager deployment model and in the Azure portal. For the classic Azure portal, we're deprecating support for creating affinity groups and creating storage resources that are pinned to an affinity group. You don't need to modify existing cloud services that are using an affinity group. However, you should not use affinity groups for new cloud services unless an Azure support professional recommends them.

## How much storage can I use with a virtual machine?

Each data disk can be up to 1 TB. The number of data disks you can use depends on the size of the virtual machine. For details, see [Sizes for Virtual Machines](../articles/virtual-machines/virtual-machines-linux-sizes.md).

An Azure storage account provides storage for the operating system disk and any data disks. Each disk is a .vhd file stored as a page blob. For pricing details, see [Storage Pricing Details](http://go.microsoft.com/fwlink/p/?LinkId=396819).

## Which virtual hard disk types can I use?

Azure only supports fixed, VHD-format virtual hard disks. If you have a VHDX that you want to use in Azure, you need to first convert it by using Hyper-V Manager or the [convert-VHD](http://go.microsoft.com/fwlink/p/?LinkId=393656) cmdlet. After you do that, use [Add-AzureVHD](https://msdn.microsoft.com/library/azure/dn495173.aspx) cmdlet (in Service Management mode) to upload the VHD to a storage account in Azure so you can use it with virtual machines.

- For Linux instructions, see [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](../articles/virtual-machines/virtual-machines-linux-classic-create-upload-vhd.md).

- For Windows instructions, see [Create and upload a Windows Server VHD to Azure](../articles/virtual-machines/virtual-machines-windows-classic-createupload-vhd.md).

## Are these virtual machines the same as Hyper-V virtual machines?

In many ways they’re similar to “Generation 1” Hyper-V VMs, but they’re not exactly the same. Both types provide virtualized hardware, and the VHD-format virtual hard disks are compatible. This means you can move them between Hyper-V and Azure. Three key differences that sometimes surprise Hyper-V users are:

- Azure doesn’t provide console access to a virtual machine. There is no way to access a VM until it is done booting.
- Azure VMs in most [sizes](../articles/virtual-machines/virtual-machines-linux-sizes.md) have only 1 virtual network adapter, which means that they also can have only 1 external IP address. (The A8 and A9 sizes use a second network adapter for application communication between instances in limited scenarios.)
- Azure VMs don't support Generation 2 Hyper-V VM features. For details about these features, see [Virtual Machine Specifications for Hyper-V](http://technet.microsoft.com/library/dn592184.aspx) and [Generation 2 Virtual Machine Overview] (https://technet.microsoft.com/library/dn282285.aspx).

## Can these virtual machines use my existing, on-premises networking infrastructure?

For virtual machines created in the classic deployment model, you can use Azure Virtual Network to extend your existing infrastructure. The approach is like setting up a branch office. You can provision and manage virtual private networks (VPNs) in Azure as well as securely connect them to on-premises IT infrastructure. For details, see [Virtual Network Overview](../articles/virtual-network/virtual-networks-overview.md).

You’ll need to specify the network that you want the virtual machine to belong to when you create the virtual machine. You can’t join an existing virtual machine to a virtual network. However, you can work around this by detaching the virtual hard disk (VHD) from the existing virtual machine, and then use it to create a new virtual machine with the networking configuration you want.

## How can I access  my virtual machine?

You need to establish a remote connection to log on to the virtual machine by using Remote Desktop Connection for a Windows VM or a Secure Shell (SSH) for a Linux VM. For instructions, see:

- [How to Log on to a Virtual Machine Running Windows Server](../articles/virtual-machines/virtual-machines-windows-classic-connect-logon.md). A maximum of 2 concurrent connections are supported, unless the server is configured as a Remote Desktop Services session host.  
- [How to Log on to a Virtual Machine Running Linux](../articles/virtual-machines/virtual-machines-linux-classic-log-on.md). By default, SSH allows a maximum of 10 concurrent connections. You can increase this number by editing the configuration file.


If you’re having problems with Remote Desktop or SSH, install and use the [VMAccess](../articles/virtual-machines/virtual-machines-windows-extensions-features.md) extension to help fix the problem.

For Windows VMs, additional options include:

- In the Azure classic portal, find the VM, then click **Reset Remote Access** from the Command bar.
- Review [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](../articles/virtual-machines/virtual-machines-windows-troubleshoot-rdp-connection.md).
- Use Windows PowerShell Remoting to connect to the VM, or create additional endpoints for other resources to connect to the VM. For details, see [How to Set Up Endpoints to a Virtual Machine](../articles/virtual-machines/virtual-machines-windows-classic-setup-endpoints.md).

If you’re familiar with Hyper-V, you might be looking for a tool similar to VMConnect. Azure doesn’t offer a similar tool because console access to a virtual machine isn’t supported.

## Can I use the temporary disk (the D: drive for Windows or /dev/sdb1 for Linux) to store data?

You shouldn’t use the temporary disk (the D: drive by default for Windows or /dev/sdb1 for Linux) to store data. They are only temporary storage, so you would risk losing data that can’t be recovered. This can occur when the virtual machine moves to a different host. Resizing a virtual machine, updating the host, or a hardware failure on the host are some of the reasons a virtual machine might move.

## How can I change the drive letter of the temporary disk?

On a Windows virtual machine, you can change the drive letter by moving the page file and reassigning drive letters, but you’ll need to make sure you do the steps in a specific order. For instructions, see [Change the drive letter of the Windows temporary disk](../articles/virtual-machines/virtual-machines-windows-classic-change-drive-letter.md).

## How can I upgrade the guest operating system?

The term upgrade generally means moving to a more recent release of your operating system, while staying on the same hardware. For Azure VMs, the process for moving to a more recent release differs for Linux and Windows:

- For Linux VMs, use the package management tools and procedures appropriate for the distribution.
- For a Windows virtual machine, you need to migrate the server using something like the Windows Server Migration Tools. Don’t attempt to upgrade the guest OS while it resides on Azure. It isn’t supported because of the risk of losing access to the virtual machine. If problems occur during the upgrade, you could lose the ability to start a Remote Desktop session and wouldn’t be able to troubleshoot the problems.

For general details about the tools and processes for migrating a Windows Server, see [Migrate Roles and Features to Windows Server](http://go.microsoft.com/fwlink/p/?LinkId=396940).



## What's the default user name and password on the virtual machine?

The images provided by Azure don’t have a pre-configured user name and password. When you create virtual machine using one of those images, you’ll need to provide a user name and password, which you’ll use to log on to the virtual machine.

If you’ve forgotten the user name or password and you’ve installed the VM Agent, you can install and use the [VMAccess](../articles/virtual-machines/virtual-machines-windows-extensions-features.md) extension to fix the problem.

Additional details:


- For the Linux images, if you use the Azure classic portal, ‘azureuser’ is given as a default user name, but you can change this by using ‘From Gallery’ instead of ‘Quick Create’ as the way to create the virtual machine. Using ‘From Gallery’ also lets you decide whether to use a password, an SSH key, or both to log you in. The user account is a non-privileged user that has ‘sudo’ access to run privileged commands. The ‘root’ account is disabled.


- For Windows images, you’ll need to provide a user name and password when you create the VM. The account is added to the Administrators group.

## Can Azure run anti-virus on my virtual machines?

Azure offers several options for anti-virus solutions, but it’s up to you to manage it. For example, you might need a separate subscription for antimalware software, and you’ll need to decide when to run scans and install updates. You can add anti-virus support with a VM extension for Microsoft Antimalware, Symantec Endpoint Protection, or TrendMicro Deep Security Agent when you create a Windows virtual machine, or at a later point. The Symantec and TrendMicro extensions let you use a free limited-time trial subscription or an existing enterprise subscription. Microsoft Antimalware is free of charge. For details, see:

- [How to install and configure Symantec Endpoint Protection on an Azure VM](http://go.microsoft.com/fwlink/p/?LinkId=404207)
- [How to install and configure Trend Micro Deep Security as a Service on an Azure VM](http://go.microsoft.com/fwlink/p/?LinkId=404206)
- [Deploying Antimalware Solutions on Azure Virtual Machines](https://azure.microsoft.com/blog/2014/05/13/deploying-antimalware-solutions-on-azure-virtual-machines/)

## What are my options for backup and recovery?

Azure Backup is available as a preview in certain regions. For details, see [Back up Azure virtual machines](../articles/backup/backup-azure-vms.md). Other solutions are available from certified partners. To find out what’s currently available, search the Azure Marketplace.

An additional option is to use the snapshot capabilities of blob storage. To do this, you’ll need to shut down the VM before any operation that relies on a blob snapshot. This saves pending data writes and puts the file system in a consistent state.

## How does Azure charge for my VM?

Azure charges an hourly price based on the VM’s size and operating system. For partial hours, Azure charges only for the minutes of use. If you create the VM with a VM image containing certain pre-installed software, additional hourly software charges may apply. Azure charges separately for storage for the VM’s operating system and data disks. Temporary disk storage is free.

You are charged when the VM status is Running or Stopped, but you are not charged when the VM status is Stopped (De-allocated). To put a VM in the Stopped (De-allocated) state, do one of the following:

- Shut down or delete the VM from the Azure classic portal.
- Use the Stop-AzureVM cmdlet, available in the Azure PowerShell module.
- Use the Shutdown Role operation in the Service Management REST API and specify StoppedDeallocated for the PostShutdownAction element.

For more details, see [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/).

## Will Azure reboot my VM for maintenance?

Azure sometimes restarts your VM as part of regular, planned maintenance updates in the Azure datacenters.

Unplanned maintenance events can occur when Azure detects a serious hardware problem that affects your VM. For unplanned events, Azure automatically migrates the VM to a healthy host and restarts the VM.

For any standalone VM (meaning the VM isn’t part of an availability set), Azure notifies the subscription’s Service Administrator by email at least one week before planned maintenance because the VMs could be restarted during the update. Applications running on the VMs could experience downtime.

You also can use the Azure classic portal or Azure PowerShell to view the reboot logs when the reboot occurred due to planned maintenance. For details, see [Viewing VM Reboot Logs](https://azure.microsoft.com/blog/2015/04/01/viewing-vm-reboot-logs/).

To provide redundancy, put two or more similarly configured VMs in the same availability set. This helps ensure at least one VM is available during planned or unplanned maintenance. Azure guarantees certain levels of VM availability for this configuration. For details, see [Manage the availability of virtual machines](../articles/virtual-machines/virtual-machines-windows-manage-availability.md).



## Additional resources

[About Azure Virtual Machines](../articles/virtual-machines/virtual-machines-linux-about.md)

[Different Ways to Create a Linux Virtual Machine](../articles/virtual-machines/virtual-machines-linux-creation-choices.md)

[Different Ways to Create a Windows Virtual Machine](../articles/virtual-machines/virtual-machines-windows-creation-choices.md)
