<properties
	pageTitle="Create a Windows VM in the Azure portal | Microsoft Azure"
	description="Learn how to create a Windows virtual machine using the Azure portal"
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
	ms.date="04/14/2016"
	ms.author="cynthn"/>

# Create a Windows virtual machine in the Azure portal

This tutorial shows you how easy it is to create a Windows VM in just a few minutes using the Azure portal. We use a Windows Server 2012 R2 Datacenter image as an example, but that's just one of the many images Azure offers. Your image choices depend on your subscription. For example, desktop images may be available to [MSDN subscribers](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?WT.mc_id=A261C142F).

If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free/) in just a couple of minutes.

## Video walkthrough

Here's a [video walkthrough](https://channel9.msdn.com/Blogs/Azure-Documentation-Shorts/Create-A-Virtual-Machine-Running-Windows-In-The-Azure-Preview-Portal) of this tutorial. 


## Select the Windows 2012 R2 virtual machine image from the marketplace

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the Hub menu, click **New** > **Virtual Machines** > **Windows Server 2012 R2 Datacenter**.

	![Screenshot that shows the Azure VM images available in the portal](./media/virtual-machines-windows-hero-tutorial/marketplace-new.png)


3. On the **Windows Server 2012 R2 Datacenter** page, under **Select a deployment model**, verify that **Resource Manager** is selected. Click **Create**.

	![Screenshot that shows the deployment model to select for the VM](./media/virtual-machines-windows-hero-tutorial/deployment-model.png)

## Create the Windows virtual machine

After you select the image, you can use Azure's default settings for most of the configuration and quickly create the virtual machine.

1. On the **Basics** blade, enter a **Name** for the virtual machine. The name must be 1-15 characters long and it cannot contain special characters.

2. Enter a **User name**, and a strong **Password** that will be used to create a local account on the VM. The local account is used to log on to and manage the VM. The password must be at 8-123 characters long and have at least 3 of the following: one lower case character, one upper case character, one number, and one special character. 


3. If you have more than one subscription, specify the subscription to use. Select an existing [Resource group](../resource-group-overview/#resource-groups) or type the name for a new one. Type an Azure datacenter **Location** such as **West US**. 

4. When you are done, click **OK** to continue to the next section. 

	![Screenshot that shows the basic settings to configure for an Azure VM](./media/virtual-machines-windows-hero-tutorial/basics-blade.png)

	
5. In the **Size** blade, select an appropriate virtual machine [size](virtual-machines-windows-sizes.md) by clicking on it and then click **Select** to continue. 

	![Screenshot that shows the Azure VM sizes that you can select](./media/virtual-machines-windows-hero-tutorial/size-blade.png)

3. On the  **Settings** blade, you can change the storage and networking options. For a first virtual machine, you can generally accept the default settings. If you selected a virtual machine size that supports it, you can try out Premium Storage by selecting **Premium (SSD)** under **Disk type**. When you are done making changes, click **OK**.

	![Screenshot that shows the optional features you can configure for an Azure VM](./media/virtual-machines-windows-hero-tutorial/settings-blade.png)

6. Click **Summary** to review your choices. When you're done, click **Create**.

	![Screenshot that shows the summary of the configuration choices made for the Azure VM](./media/virtual-machines-windows-hero-tutorial/summary-blade.png)

7. While Azure creates the virtual machine, you can track the progress under **Virtual Machines** in the hub menu. 


## Connect to the virtual machine and log on

1.	On the Hub menu, click **Virtual Machines**.

2.	Select the virtual machine from the list.

3. On the blade for the virtual machine, click **Connect**.

	![Screenshot of the Azure portal showing how to connect to your VM.](./media/virtual-machines-windows-connect-logon/connect.png)

4. Clicking **Connect** creates and downloads a Remote Desktop Protocol file (.rdp file). Click **Open** to use this file.

	![Screenshot of the downloaded .rdp file.](./media/virtual-machines-windows-hero-tutorial/open-rdp.png)

5. You will get a warning that the .rdp is from an unknown publisher. This is normal. In the Remote Desktop window, click **Connect** to continue.

	![Screenshot of a warning about an unknown publisher.](./media/virtual-machines-windows-hero-tutorial/rdp-warn.png)

6. In the Windows Security window, type the username and password for the local account that you created when you created the VM. The username is entered as *vmname*&#92;*username*, then click **OK**.

	![Screenshot of entering the VM name, user name and password.](./media/virtual-machines-windows-hero-tutorial/credentials.png)
 	
7.	You will get a warning that the certificate cannot be verified. This is normal. Click **Yes** to verify the identity of the virtual machine and finish logging on.

	![Screenshot showing a message abut verifying the identity of the VM.](./media/virtual-machines-windows-hero-tutorial/cert-warning.png)


If you run into trouble when you try to connect, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-windows-troubleshoot-rdp-connection.md).

You can now work with the virtual machine just as you would with any other server.

## Next steps

* You can also [create a Windows VM using Powershell](virtual-machines-windows-ps-create.md) or [create a Linux virtual machine](virtual-machines-linux-quick-create-cli.md) using the Azure CLI.
