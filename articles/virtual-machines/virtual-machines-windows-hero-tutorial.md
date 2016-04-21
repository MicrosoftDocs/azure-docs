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

2. On the Hub menu, click **New** > **Compute** > **Windows Server 2012 R2 Datacenter**.

	![Screenshot that shows the Azure VM images available in the portal](./media/virtual-machines-windows-hero-tutorial/marketplace_new.png)


3. On the **Windows Server 2012 R2 Datacenter** page, under **Select a deployment model**, select **Resource Manager**. Click **Create**.

	![Screenshot that shows the deployment model to select for an Azure VM](./media/virtual-machines-windows-hero-tutorial/marketplace_search_select.png)

## Create the Windows virtual machine

After you select the image, you can use Azure's default settings for most of the configuration and quickly create the virtual machine.

1. On the **Create virtual machine** blade, click **Basics**.

2. Enter a **Name** you want for the virtual machine. The name cannot contain special characters.

3. Enter administrative **User name**, and a strong **Password**. The password must be at 8-123 characters long and have at least 3 of the following: one lower case character, one upper case character, one number, and one special character. **You need the user name and password to connect to the virtual machine**.


4. If you have more than one subscription, specify the one for the new virtual machine. Select a new or existing [Resource group](../resource-group-overview/#resource-groups) and an Azure datacenter **Location** such as **West US**. 

	![Screenshot that shows the basic settings to configure for an Azure VM](./media/virtual-machines-windows-hero-tutorial/create_vm_basics.PNG)

	
2. Click **Size** and select an appropriate virtual machine size for your needs. Each size specifies the number of compute cores, memory, and other features, such as support for Premium Storage, which affects the price. Azure recommends certain sizes automatically depending on the image you choose.

	![Screenshot that shows the Azure VM sizes that you can select](./media/virtual-machines-windows-hero-tutorial/create_vm_size.PNG)

	>[AZURE.NOTE] Premium storage is available for DS-series virtual machines in certain regions. Premium storage is the best storage option for data intensive workloads such as a database. For details, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](../storage/storage-premium-storage.md).

3. Click **Settings** to see storage and networking settings for the new virtual machine. For a first virtual machine, you can generally accept the default settings. If you selected a virtual machine size that supports it, you can try out Premium Storage by selecting **Premium (SSD)** under **Disk type**.

	![Screenshot that shows the optional features you can configure for an Azure VM](./media/virtual-machines-windows-hero-tutorial/create_vm_settings.PNG)

6. Click **Summary** to review your configuration choices. When you're done reviewing or updating the settings, click **Create**.

	![Screenshot that shows the summary of the configuration choices made for the Azure VM](./media/virtual-machines-windows-hero-tutorial/create_vm_summary.PNG)

8. While Azure creates the virtual machine, you can track the progress under **Virtual Machines** in the hub menu. 


## Connect to the virtual machine and log on

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com/).

2.	On the Hub menu, click **Virtual Machines**.

3.	Select the virtual machine from the list.

4. On the blade for the virtual machine, click **Connect**.

	![Screenshot of the Azure portal showing how to connect to your VM.](./media/virtual-machines-windows-connect-logon/preview-portal-connect.png)


[AZURE.INCLUDE [virtual-machines-log-on-win-server](../../includes/virtual-machines-log-on-win-server.md)]

If you run into trouble when you try to connect, see [Troubleshoot Remote Desktop connections to a Windows-based Azure Virtual Machine](virtual-machines-windows-troubleshoot-rdp-connection.md).

You can now work with the virtual machine just as you would with any other server.

## Next steps

* You can also [create a Windows VM using Powershell](virtual-machines-windows-ps-create.md) or [create a Linux virtual machine](virtual-machines-linux-quick-create-cli.md) using the Azure CLI.
