<properties
	pageTitle="Create your first Windows VM | Microsoft Azure"
	description="Learn how to create your first Windows virtual machine by using the Azure portal."
	keywords="Windows virtual machine,create a virtual machine,virtual computer,setting up a virtual machine"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>
<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="09/06/2016"
	ms.author="cynthn"/>

# Create your first Windows virtual machine in the Azure portal

This tutorial shows you how easy it is to create a Windows virtual machine (VM) in just a few minutes, by using the Azure portal.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Choose the VM image from the marketplace

We use a Windows Server 2012 R2 Datacenter image as an example, but that's just one of the many images Azure offers. Your image choices depend on your subscription. For example, some desktop images are available to [MSDN subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the hub menu, click **New** > **Virtual Machines** > **Windows Server 2012 R2 Datacenter**.

	![Screenshot that shows the Azure VM images available in the portal](./media/virtual-machines-windows-hero-tutorial/marketplace-new.png)


3. On the **Windows Server 2012 R2 Datacenter** blade, in **Select a deployment model**, verify that **Resource Manager** is selected. Click **Create**.

	![Screenshot that shows the deployment model to select for the VM](./media/virtual-machines-windows-hero-tutorial/deployment-model.png)

## Create the Windows virtual machine

After you select the image, you can use the default settings and quickly create the virtual machine.

1. On the **Basics** blade, enter a **Name** for the virtual machine. The name must be 1-15 characters long and it cannot contain special characters.

2. Enter a **User name**, and a strong **Password** that will be used to create a local account on the VM. The local account is used to sign in to and manage the VM. 

	The password must be 8-123 characters long and meet three out of the four following complexity requirements: one lower case character, one upper case character, one number, and one special character. See more about [username and password requirements](virtual-machines-windows-faq.md#what-are-the-username-requirements-when-creating-a-vm).


3. Select an existing [Resource group](../resource-group-overview.md#resource-groups) or type the name for a new one. Type an Azure datacenter **Location** such as **West US**. 

4. When you are done, click **OK** to continue to the next section. 

	![Screenshot that shows the settings on the **Basics** blade for configuring an Azure VM](./media/virtual-machines-windows-hero-tutorial/basics-blade.png)

	
5. Choose a VM [size](virtual-machines-windows-sizes.md), and then click **Select** to continue. 

	![Screenshot of the Size blade that shows the Azure VM sizes that you can select](./media/virtual-machines-windows-hero-tutorial/size-blade.png)

6. On the **Settings** blade, you can change the storage and network options. For this tutorial, accept the default settings. If you selected a virtual machine size that supports it, you can try Azure Premium Storage by selecting **Premium (SSD)** in **Disk type**. When you're done making changes, click **OK**.

	![Screenshot of the Settings blade where you can configure optional features for an Azure VM](./media/virtual-machines-windows-hero-tutorial/settings-blade.png)

7. Click **Summary** to review your choices. When you see the **Validation passed** message, click **OK**.

	![Screenshot of the Summary page that shows the configuration choices made for the Azure VM](./media/virtual-machines-windows-hero-tutorial/summary-blade.png)

8. While Azure creates the virtual machine, you can track the progress in **Virtual Machines** on the hub menu. 


## Connect to the virtual machine and sign on

1.	On the hub menu, click **Virtual Machines**.

2.	Select the virtual machine from the list.

3. On the blade for the virtual machine, click **Connect**. This creates and downloads a Remote Desktop Protocol file (.rdp file) that is like a shortcut to connect to your machine. You might want to save the file to your desktop for easy access. **Open** this file to connect to your VM.

	![Screenshot of the Azure portal showing how to connect to your VM](./media/virtual-machines-windows-hero-tutorial/connect.png)

4. You get a warning that the .rdp is from an unknown publisher. This is normal. In the Remote Desktop window, click **Connect** to continue.

	![Screenshot of a warning about an unknown publisher](./media/virtual-machines-windows-hero-tutorial/rdp-warn.png)

5. In the Windows Security window, type the username and password for the local account that you created when you created the VM. The username is entered as *vmname*&#92;*username*, then click **OK**.

	![Screenshot of entering the VM name, user name and password](./media/virtual-machines-windows-hero-tutorial/credentials.png)
 	
6.	You get a warning that the certificate cannot be verified. This is normal. Click **Yes** to verify the identity of the virtual machine and finish logging on.

	![Screenshot showing a message abut verifying the identity of the VM](./media/virtual-machines-windows-hero-tutorial/cert-warning.png)


If you run in to trouble when you try to connect, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-windows-troubleshoot-rdp-connection.md).

You can now work with the virtual machine as you would with any other server.



## Optional: Stop the VM

It is a good idea to stop the VM so you don't incur charges when you aren't actually using it. Just click **Stop** and then click **Yes**.

![Screenshot showing the button to stop a VM](./media/virtual-machines-windows-hero-tutorial/stop-vm.png)
	
Click the **Start** button to restart the VM when you're ready to use it again.


## Next steps

- You can experiment with your new VM by [installing IIS](virtual-machines-windows-hero-role.md). This tutorial also shows how to open port 80 to incoming web traffic using a network security group (NSG). 

- You can also [create a Windows VM by using PowerShell](virtual-machines-windows-ps-create.md) or [create a Linux virtual machine](virtual-machines-linux-quick-create-cli.md) by using the Azure CLI.

- If you're interested in automating deployments, see [Create a Windows virtual machine by using a Resource Manager template](virtual-machines-windows-ps-template.md).
