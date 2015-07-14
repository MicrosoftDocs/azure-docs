<properties
	pageTitle="Create a virtual machine running Windows in the Azure Preview portal | Microsoft Azure"
	description="Learn how to create an Azure virtual machine (VM) resource running Windows, using the Azure Marketplace in the Azure Preview Portal"
	services="virtual-machines"
	documentationCenter=""
	authors="KBDAzure"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>
<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/13/2015"
	ms.author="kathydav"/>

# Create a Virtual Machine running Windows in the Azure Preview Portal#

> [AZURE.SELECTOR]
- [Azure Preview Portal](virtual-machines-windows-tutorial.md)
- [Azure Portal](virtual-machines-windows-tutorial-classic-portal.md)
- [PowerShell - Resource Manager](virtual-machines-deploy-rmtemplates-powershell.md)
- [PowerShell - Service Management](virtual-machines-ps-create-preconfigure-windows-vms.md)

This tutorial shows you how easy it is to create an Azure virtual machine (VM) in just a few minutes in the Azure Preview portal. We'll use a Windows Server 2012 R2 Datacenter image as an example to create the VM in Azure Resource Manager, but that's just one of the many images Azure offers. Note that your image choices depend on your subscription. For example, desktop images may be available to MSDN subscribers.

You can also create VMs using your own images, with Resource Manager templates, or with automation tools. To learn about the different methods, see [Different Ways to Create a Windows Virtual Machine](virtual-machines-windows-choices-create-vm.md).

[AZURE.INCLUDE [free-trial-note](../../includes/free-trial-note.md)]


## Select the image

Go to the Azure Marketplace in the Preview portal to find the Windows Server VM image you want.

1. Sign in to the [Preview portal](https://portal.azure.com).

2. On the Hub menu, click **New** > **Compute** > **Windows Server 2012 R2 Datacenter**.

	![Marketplace](./media/virtual-machines-windows-tutorial/marketplace_new.png)

	>[AZURE.TIP] To find additional images, click **Marketplace** and then search or filter for available items.

3. On the **Windows Server 2012 R2 Datacenter** page, select **Use the Resource Manager stack** to create the VM in Azure Resource Manager. (For most new workloads we recommend the Resource Manager stack. For considerations see [Azure Compute, Network & Storage Providers under the Azure Resource Manager](virtual-machines-azurerm-versus-azuresm.md).) Then click **Create**.

	![Search in the Marketplace](./media/virtual-machines-windows-tutorial/marketplace_search_select.png)

## Create the virtual machine

After you select the image, you can use Azure's default settings for most of the configuration and quickly create the VM.

1. On the **Create virtual machine** blade, click **Basics**. Enter a **Name** you want for the VM, the administrative **User name**, and a strong **Password**. If you have more than one subscription, specify the one for the new VM, as well as a new or existing **Resource group** and an Azure datacenter **Location**.

	![Configure VM basics](./media/virtual-machines-windows-tutorial/create_vm_basics.PNG)

	>[AZURE.NOTE]**User name** refers to the administrative account that you'll use to manage the server. Create a password that's hard for others to guess but that you can remember. **You'll need the user name and password to log on to the virtual machine**.

2. Click **Size** and select an appropriate VM size for your needs. Each size specifies the number of compute cores, memory, and other features, such as support for Premium Storage, which will affect the price. Azure recommends certain sizes automatically depending on the image you choose.

	![Configure VM size](./media/virtual-machines-windows-tutorial/create_vm_size.PNG)

	>[AZURE.NOTE] Premium storage is available for DS-series virtual machines in certain regions. Premium storage is the best storage option for data intensive workloads such as a database. For details, see [Premium Storage: High-Performance Storage for Azure Virtual Machine Workloads](storage-premium-storage-preview-portal.md).

3. Click **Settings** to see storage and networking settings for the new VM. For a first VM you can generally accept the default settings. If you selected a VM size that supports it, you can try out Premium Storage by selecting **Premium (SSD)** under **Disk type**.

	![Configure VM settings](./media/virtual-machines-windows-tutorial/create_vm_settings.PNG)

6. Click **Summary** to review your configuration choices. When you're done reviewing or updating the settings, click **Create**.

	![Configure VM settings](./media/virtual-machines-windows-tutorial/create_vm_summary.PNG)

8. While Azure creates the VM, you can track the progress in **Notifications**, in the Hub menu. After Azure creates the VM, you'll see it on your Startboard unless you cleared **Pin to Startboard** in the **Create virtual machine** blade.

## Log on to the virtual machine

After you create the VM, you'll want to log on to it so you can manage its settings and the applications that you'll run on it.

>[AZURE.NOTE] For requirements and troubleshooting tips, see [Connect to an Azure virtual machine with RDP or SSH](https://msdn.microsoft.com/library/azure/dn535788.aspx).

1. If you haven't already done so, sign in to the [Preview portal](https://portal.azure.com).

2. Click your VM on the Startboard. If you need to find it, click **Browse All** > **Recent** or **Browse All** > **Virtual machines**. Then, select your VM from the list.

3. On the VM blade, click **Connect**.

	![Log on to the virtual machine](./media/virtual-machines-windows-tutorial/connect_vm_portal.png)

4. Click **Open** to use the Remote Desktop Protocol file that's automatically created for the Windows Server virtual machine.

5. Click **Connect**.

6. Type the user name and password you set when you created the virtual machine, and then click **OK**.

7. Click **Yes** to verify the identity of the virtual machine.

	You can now work with the virtual machine just as you would with any other server.

## Next steps

* Use Azure PowerShell and the Azure CLI to [find and select VM images](resource-groups-vm-searching.md).
* Automate VM and workload deployment and management using [Azure Resource Manager](virtual-machines-how-to-automate-azure-resource-manager.md) and [Azure Resource Manager templates](http://azure.microsoft.com/en-us/documentation/templates/).
