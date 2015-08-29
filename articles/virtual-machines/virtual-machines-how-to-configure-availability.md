<properties
	pageTitle="How to configure an availability set for virtual machines"
	description="Gives the steps to configure an availability set for a new or existing virtual machine in Azure using the Azure portal and Azure PowerShell commands"
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
	ms.date="08/10/2015"
	ms.author="kathydav"/>

#How to configure an availability set for virtual machines#

An availability set helps keep your virtual machines available during downtime, such as during maintenance. Placing two or more similarly configured virtual machines in an availability set creates the redundancy needed to maintain availability of the applications or services that your virtual machine runs. For details about how this works, see [Manage the availability of virtual machines] [].

It's a best practice to use both availability sets and load-balancing endpoints to help ensure that your application is always available and running efficiently. For details about load-balanced endpoints, see [Load balancing for Azure infrastructure services] [].

You can put virtual machines into an availability set by using one of two options:

- [Option 1: Create a virtual machine and an availability set at the same time] []. Then, add new virtual machines to the set when you create those virtual machines.
- [Option 2: Add an existing virtual machine to an availability set] [].

>[AZURE.NOTE] Virtual machines that you want to put in the same availability set must belong to the same cloud service.

## <a id="createset"> </a>Option 1: Create a virtual machine and an availability set at the same time##

You can use either the Azure portal or Azure PowerShell commands to do this.

To use the portal:

1. If you haven't already done so, sign in to the [portal](http://manage.windowsazure.com).

2. On the command bar, click **New**.

3. Click **Virtual Machine**, and then click **From Gallery**.

4. Use the first two screens to select an image, a user name and password, and so on. For more details, see [Create a virtual machine running Windows][].

5. In the third screen, you can configure resources for networking, storage, and availability. Do the following:

	1. Choose the appropriate cloud service. Leave it set to **Create a new cloud service** (unless you are adding this new virtual machine to an existing virtual machine cloud service). Then, under **Cloud Service DNS Name**, type a name. The DNS name becomes part of the URI that's used to contact the virtual machine. The cloud service acts as a communications and isolation group. All virtual machines in the same cloud service can communicate with each other, can be set up for load balancing, and can be placed in the same availability set.

	2. Under **Region/Affinity Group/Virtual Network**, specify a virtual network if you plan to use one. **Important**: If you want a virtual machine to use a virtual network, you must join the virtual machine to the virtual network when you create the virtual machine. You can't join the virtual machine to a virtual network after you create the virtual machine. For more information, see [Virtual Network Overview][].

	3. Create the availability set. Under **Availability Set**, leave it set to **Create an availability set**. Then, type a name for the set.

	4. Create the default endpoints and add more endpoints if needed. You also can add endpoints later.

	![Create an availability set for a new virtual machine](./media/virtual-machines-how-to-configure-availability/VMavailabilityset.png)

6. On the fourth screen, click the extensions that you want to install. Extensions provide features that make it easier to manage the virtual machine, such as running antimalware or resetting passwords. For details, see [Azure VM Agent and VM Extensions](virtual-machines-extensions-agent-about.md).

7.	Click the arrow to create the virtual machine and the availability set.

	From the dashboard of the new virtual machine, you can click **Configure** to see that the virtual machine belongs to the new availability set.

To use Azure PowerShell commands to create an Azure virtual machine and add it to a new or existing availability set, see the following:

- [Use Azure PowerShell to create and preconfigure Windows-based virtual machines](virtual-machines-ps-create-preconfigure-windows-vms.md)
- [Use Azure PowerShell to create and preconfigure Linux-based virtual machines](virtual-machines-ps-create-preconfigure-linux-vms.md)

## <a id="addmachine"> </a>Option 2: Add an existing virtual machine to an availability set##

In the portal, you can add existing virtual machines to an existing availability set
 or create a new one for them. (Keep in mind that the virtual machines in the same availability set must belong to the same cloud service.) The steps are almost the same. With Azure PowerShell, you can add the virtual machine to an existing availability set.

1. If you have not already done so, sign in to the [portal](http://manage.windowsazure.com).

2. On the command bar, click **Virtual Machines**.

3. From the list of virtual machines, select the name of the virtual machines that you want to add to the set.

4. From the tabs below the virtual machine name, click **Configure**.

5. In the Settings section, find **Availability Set**. Do one of the following:

	A. Select **Create an availability set**, and then type a name for the set.

	B. Select **Select an availability set**, and then select a set from the list.

	![Create an availability set for an existing virtual machine](./media/virtual-machines-how-to-configure-availability/VMavailabilityExistingVM.png)

6. Click **Save**.

To use Azure PowerShell commands, open an administrator-level Azure PowerShell session and run the following command. For the placeholders (such as &lt;VmCloudServiceName&gt;), replace everything within the quotes, including the < and > characters, with the correct names.

	Get-AzureVM -ServiceName "<VmCloudServiceName>" -Name "<VmName>" | Set-AzureAvailabilitySet -AvailabilitySetName "<AvSetName>" | Update-AzureVM

>[AZURE.NOTE] The virtual machine might have to be restarted to finish adding it to the availability set.

##Additional resources

[About Azure virtual machine configuration settings]

<!-- LINKS -->
[Option 1: Create a virtual machine and an availability set at the same time]: #createset
[Option 2: Add an existing virtual machine to an availability set]: #addmachine

[Load balancing for Azure infrastructure services]: virtual-machines-load-balance.md
[Manage the availability of virtual machines]: virtual-machines-manage-availability.md
[Create a virtual machine running Windows]: virtual-machines-windows-tutorial.md
[Virtual Network overview]: virtual-networks-overview.md
[About Azure virtual machine configuration settings]: http://msdn.microsoft.com/library/azure/dn763935.aspx
