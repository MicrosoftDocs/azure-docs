<properties urlDisplayName="Create a virtual machine in the Preview Portal" pageTitle="Create a virtual machine running Windows in the Azure Preview Portal" metaKeywords="Azure image gallery vm" description="Learn how to create an Azure virtual machine (VM) running Windows, using the VM Gallery in the Azure Preview Portal" metaCanonical="" services="virtual-machines" documentationCenter="" title="Create a Virtual Machine Running Windows in the Azure Preview Portal" authors="danlep,kathydav,rasquill" solutions="" manager="timlt" editor="tysonn" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-windows" ms.devlang="na" ms.topic="article" ms.date="09/16/2014" ms.author="danlep,kathydav,rasquill" />



# Create a Virtual Machine Running Windows in the Azure Preview Portal#

<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/documentation/articles/virtual-machines-windows-tutorial/" title="Azure Portal">Azure Portal</a><a href="/en-us/documentation/articles/virtual-machines-windows-tutorial-azure-preview/" title="Azure Preview Portal" class="current">Azure Preview Portal</a></div>

This tutorial shows you how easy it is to create an Azure virtual machine (VM) running Windows, using as an example a Windows Server image from the Image Gallery in the Azure Preview Portal. The Gallery offers a variety of images, including Windows operating systems, Linux-based operating systems, and application images. 

> [WACOM.NOTE] You don't need any experience with Azure VMs to finish this tutorial. However, you do need an Azure account. You can create a free trial account in just a couple of minutes. For details, see [Create an Azure account](http://www.windowsazure.com/en-us/develop/php/tutorials/create-a-windows-azure-account/). 

This tutorial shows you:

- [How to create the virtual machine](#createvirtualmachine)
- [How to log on to the virtual machine after you create it](#logon)

If you'd like to know more, see [Virtual Machines](http://go.microsoft.com/fwlink/p/?LinkID=271224).


##<a id="createvirtualmachine"> </a>How to create the virtual machine##

This section shows you how to use the Preview Portal to create a VM, using Windows Server as an example. You can use Azure's default settings for most of the configuration and create the VM in just a few minutes.

> [WACOM.NOTE] How many and what kind of images are available in the gallery depends upon the type of subscription you have. This tutorial uses a Windows Server image, but an MSDN subscription may have additional images available to you including desktop images. 
 

1. Sign in to the [Azure Preview Portal](https://portal.azure.com). Check out the [Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/) offer if you do not have a subscription yet.

2. On the Hub menu, click **New**.

	![Select New from the Command Bar](./media/virtual-machines-windows-tutorial-azure-preview/new_button_preview_portal.png)

3. Under **New**, click **Everything**, and then under **Gallery**, click **Virtual machines**. Click **Windows Server 2012 R2 Datacenter**. From there, click **Create**.

	![Select a VM image from the Gallery](./media/virtual-machines-windows-tutorial-azure-preview/image_gallery_preview_portal.png)
	
4. On the **Create VM** blade, fill in the **Host Name** you want for the VM, the administrative **User Name**, and a strong **Password**.  

	![Configure host name and log on credentials](./media/virtual-machines-windows-tutorial-azure-preview/create_vm_preview_portal.png)

	>[WACOM.NOTE] **User Name** refers to the administrative account that you use to manage the server. Create a unique password for this account and make sure to remember it. **You'll need the user name and password to log on to the virtual machine**.
	
5. To use the default settings for the remaining VM options and start creating the VM, click **Create**. But if you want, before clicking **Create**, you can explore **Optional Configuration** settings. For example, you can configure optional diagnostics on the VM to track lots of metrics on your VM later on. Click **Optional Configuration**, click **Diagnostics**, and toggle the **Status** to **On**.

	![Turn on VM diagnostics](./media/virtual-machines-windows-tutorial-azure-preview/vm_diagnostics_status_preview_portal.png)

	>[WACOM.NOTE] If you turn on Azure Diagnostics, Azure will store the diagnostics data in an Azure storage account, resulting in additional storage cost.  

6. While Azure creates the VM, you can keep track of the progress in **Notifications**, in the Hub menu. After Azure creates the VM, you will see it on your Startboard.

	![VM appears on the Startboard](./media/virtual-machines-windows-tutorial-azure-preview/vm_startboard_preview_portal.png)

## <a id="logon"> </a>How to log on to the virtual machine after you create it ##

This section shows you how to log on to the VM so you can manage its settings and the applications that you'll run on it.

>[WACOM.NOTE] For requirements and troubleshooting tips, see [Connect to an Azure virtual machine with RDP or SSH](http://go.microsoft.com/fwlink/p/?LinkId=398294).

1. If you have not already done so, sign in to the [Azure Preview Portal](https://portal.azure.com).

2. Click your VM on the Startboard. If you need to find it, click **Browse** and then click **Virtual machines**. 

	![Browse to find the VM](./media/virtual-machines-windows-tutorial-azure-preview/browse_vm_preview_portal.png)

3. On the VM blade, click **Connect** at the top.

	![Log on to the virtual machine](./media/virtual-machines-windows-tutorial-azure-preview/connect_vm_preview_portal.png)

4. Click **Open** to use the Remote Desktop Protocol file that was automatically created for the virtual machine.
	
5. Click **Connect** to proceed with the connection process.

	![Continue with connecting](./media/virtual-machines-log-on-windows-server/connectpublisher.png)

6. Type the user name and password of the administrative account on the virtual machine, and then click **OK**.
	
7. Click **Yes** to verify the identity of the virtual machine.

	![Verify the identity of the machine](./media/virtual-machines-log-on-windows-server/connectverify.png)

	You can now work with the virtual machine just as you would with any other server.

##Next Steps 

To learn more about configuring Windows virtual machines on Azure, see the following articles:

[How to Connect Virtual Machines in a Cloud Service](http://www.windowsazure.com/en-us/documentation/articles/cloud-services-connect-virtual-machine/)

[How to Create and Upload your own Virtual Hard Disk containing the Windows Server Operating System](http://www.windowsazure.com/en-us/documentation/articles/virtual-machines-create-upload-vhd-windows-server/)

[Attach Data Disks to a Virtual Machine](http://www.windowsazure.com/en-us/documentation/articles/storage-windows-attach-disk/)

[Manage the Availability of Virtual Machines](http://www.windowsazure.com/en-us/documentation/articles/manage-availability-virtual-machines/)

[About Azure VM configuration settings](http://msdn.microsoft.com/library/azure/dn763935.aspx)

[How to create the virtual machine]: #custommachine
[How to log on to the virtual machine after you create it]: #logon
