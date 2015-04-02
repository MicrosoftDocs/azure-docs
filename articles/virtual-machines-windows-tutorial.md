<properties 
	pageTitle="Create a virtual machine running Windows in Azure" 
	description="Learn to create Windows virtual machine (VM) in Azure, then log on and attach a data disk" 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/02/2015" 
	ms.author="kathydav"/>



# Create a Virtual Machine Running Windows

<div class="dev-center-tutorial-selector sublanding"><a href="/documentation/articles/virtual-machines-windows-tutorial/" title="Azure Portal" class="current">Azure Portal</a><a href="/documentation/articles/virtual-machines-windows-tutorial-azure-preview/" title="Azure Preview Portal">Azure Preview Portal</a><a href="/documentation/articles/virtual-machines-ps-create-preconfigure-windows-vms/" title="PowerShell" class="current">PowerShell</a></div>

This tutorial shows you how easy it is to create an Azure virtual machine (VM). This tutorial uses a Windows Server image, but that's only one of the many images available through Azure. This includes Windows operating systems, Linux-based operating systems, and images with pre-installed applications. The images you can choose from depend on the type of subscription you have. For example, desktop images may be available to MSDN subscribers.


You can also create Windows VMs using [your own images as templates](virtual-machines-create-upload-vhd-windows-server.md). To learn more about Azure VMs, see [Overview of Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156143.aspx).

[AZURE.INCLUDE [free-trial-note](../includes/free-trial-note.md)]

## <a id="createvirtualmachine"> </a>How to create the virtual machine

This section shows you how to use the **From Gallery** option in the Management Portal to create the virtual machine. This option provides more configuration choices than the **Quick Create** option. For example, if you want to join a virtual machine to a virtual network, you'll need to use the **From Gallery** option.

> [AZURE.NOTE] You can also try the richer, customizable [Azure Preview Portal](https://portal.azure.com) to create a virtual machine, automate the deployment of multi-VM application templates, use enhanced VM monitoring and diagnostics features, and more. The available VM configuration options in the two portals overlap substantially but aren't identical.  

[AZURE.INCLUDE [virtual-machines-create-WindowsVM](../includes/virtual-machines-create-WindowsVM.md)]

## <a id="logon"> </a>How to log on to the virtual machine after you create it 

This section shows you how to log on to the virtual machine so you can manage its settings and the applications that you'll run on it.

[AZURE.INCLUDE [virtual-machines-log-on-win-server](../includes/virtual-machines-log-on-win-server.md)]

## <a id="attachdisk"> </a>How to attach a data disk to the new virtual machine 

This section shows you how to attach an empty data disk to the virtual machine. See the [Attach a Data Disk Tutorial](storage-windows-attach-disk.md) for more information, including how to attach existing disks.

1. Sign in to the Azure [Management Portal](http://manage.windowsazure.com).

2. Click **Virtual Machines**, and then select the **MyTestVM** virtual machine.

	![Select MyTestVM](./media/virtual-machines-windows-tutorial/selectvm.png)
	
3. You may see the Quick Start page first. If so, select **Dashboard** from the top.

	![Select Dashboard](./media/virtual-machines-windows-tutorial/dashboard.png)

4. On the command bar, click **Attach**, and then click **Attach Empty Disk** when it pops up.

	![Select Attach from the command bar](./media/virtual-machines-windows-tutorial/commandbarattach.png)	

5. The **Virtual Machine Name**, **Storage Location**, **File Name**, and **Host Cache Preference** are already defined for you. All you have to specify is a size for the disk. For example, type **5** in the **Size** field. Click the check mark to attach the disk.


	>[AZURE.NOTE] All disks are created from .vhd files in Azure storage. **File Name** lets you name the .vhd file that the disk uses, not the disk name. Azure automatically assigns a name to the disk. 

	![Specify the size of the empty disk](./media/virtual-machines-windows-tutorial/emptydisksize.png)	
	
	>[AZURE.NOTE] The .vhd files are stored as page blobs in Azure storage. Outside of Azure, virtual hard disks can use either a VHD or a VHDX format. They can also be fixed, dynamically expanding, or differencing. Azure supports VHD format, fixed disks. For more details, see [About VHDs in Azure](http://msdn.microsoft.com/library/azure/dn790344.aspx)  

6. Return to the dashboard to verify that the empty data disk was successfully attached to the virtual machine. It should appear in the **Disks** list after the OS Disk.

	![Attach empty disk](./media/virtual-machines-windows-tutorial/disklistwithdatadisk.png)

	When you attach a data disk, it's offline and not initialized. Before you can use it to store data, you'll need to log on to the virtual machine and initialize the disk.

7. Connect and log on to the virtual machine by using the steps in the previous section, [How to log on to the virtual machine after you create it] (#logon).

8. After you log on to the virtual machine, open **Server Manager**. In the left pane, select **File and Storage Services**.

	![Expand File and Storage Services in Server Manager](./media/virtual-machines-windows-tutorial/fileandstorageservices.png)

9. Select **Disks** from the expanded menu.

	![Expand File and Storage Services in Server Manager](./media/virtual-machines-windows-tutorial/selectdisks.png)	
	
10.	The **Disks** section lists disk 0, disk 1, and disk 2. Disk 0 is the OS disk, disk 1 is a temporary resource disk (which should not be used for data storage), and disk 2 is the data disk you have attached to the virtual machine. The data disk has a capacity of 5 GB, based on what you specified when you attached the disk. Right-click disk 2 and  select **Initialize**.

	![Start initialization](./media/virtual-machines-windows-tutorial/initializedisk.png)

11. Click **Yes**.

	![Continue initialization](./media/virtual-machines-windows-tutorial/yesinitialize.png)

12. Right-click disk 2 again and select **New Volume**. 

	![Create the volume](./media/virtual-machines-windows-tutorial/initializediskvolume.png)

13. Complete the wizard using the default values. When the wizard is done, the **Volumes** section lists the new volume. The disk is now online and ready to store data. 

	![Create the volume](./media/virtual-machines-windows-tutorial/newvolumecreated.png)
	
## Next Steps 

To learn more about configuring Windows virtual machines on Azure, see:

[How to Connect Virtual Machines with a Virtual Network or Cloud Service](cloud-services-connect-virtual-machine.md)

[Create and upload a Windows Server VHD to Azure](virtual-machines-create-upload-vhd-windows-server.md)

[Manage the Availability of Virtual Machines](manage-availability-virtual-machines.md)

[About Azure VM configuration settings](http://msdn.microsoft.com/library/azure/dn763935.aspx)

[VIDEO: Getting Started with VHDs - What's Really Happening](http://azure.microsoft.com/documentation/videos/getting-started-with-azure-virtual-machines)

[VIDEO: FAQ with Mark Russinovich - Does Azure run Windows?](http://azure.microsoft.com/documentation/videos/mark-russinovich-windows-on-azure)

[VIDEO: Adding a new virtual machine to a Web Farm by making reusable images](http://azure.microsoft.com/documentation/videos/adding-virtual-machines-web-farm)

[VIDEO: Adding Virtual Hard Drives, Storage Accounts, and Scaling Virtual Machines](http://azure.microsoft.com/documentation/videos/adding-drives-scaling-virtual-machines)

[VIDEO: Scott Guthrie starts with Virtual Machines](http://azure.microsoft.com/documentation/videos/virtual-machines-scottgu)

[VIDEO: Storage and Disk Basics with Azure Virtual Machines](http://azure.microsoft.com/documentation/videos/storage-and-disks-virtual-machines)



[About virtual machines in Azure]: #virtualmachine
[How to create the virtual machine]: #custommachine
[How to log on to the virtual machine after you create it]: #logon
[How to attach a data disk to the new virtual machine]: #attachdisk
[How to set up communication with the virtual machine]: #endpoints
