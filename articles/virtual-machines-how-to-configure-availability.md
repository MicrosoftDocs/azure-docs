<properties title="How to Configure An Availability Set for Virtual Machines" pageTitle="How to Configure An Availability Set for Virtual Machines" description="Gives the steps to configure an availability set for a VM in Azure" metaKeywords="" services="virtual-machines" solutions="" documentationCenter="" authors="kathydav" manager="timlt" videoId="" scriptId="" />

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-multiple" ms.devlang="na" ms.topic="article" ms.date="09/30/2014" ms.author="kathydav" />

#How to Configure An Availability Set for Virtual Machines#

An availability set helps keep your virtual machines available during downtime, such as during maintenance. Placing two or more similarly configured virtual machines in an availability set creates the redundancy needed to maintain availability of the applications or services that your virtual machine runs. For more details, see [Manage the Availability of Virtual Machines] []. 

It's a best practice to use both availability sets and load-balancing endpoints to help ensure that your application is always available and running efficiently. For details about load-balanced endpoints, see [Load Balancing for Azure Infrastructure Services] [].

You can put virtual machines into an availability set using one of two options:

- [Option 1: Create a virtual machine and an availability set at the same time] []. Then, add new virtual machines to the set when you create those virtual machines.
- [Option 2: Add an existing virtual machine to an availability set] [].


>[WACOM.NOTE] Virtual machines that you want to put in the same availability set must belong to the same cloud service.   

## <a id="createset"> </a>Option 1: Create a virtual machine and an availability set at the same time##

You can use either the Management Portal or Azure PowerShell cmdlets to do this. 

To use the Management Portal:

1. If you haven't already done so, sign in to the Azure [Management Portal](http://manage.windowsazure.com).

2. On the command bar, click **New**.

3. Click **Virtual Machine**, and then click **From Gallery**.

4. Use the first two screens to pick an image, a user name and password, and so on. For more details, see [Create a Virtual Machine Running Windows][].
 
5. The third screen lets you configure resources for networking, storage, and availability. Do the following:
	 
	1. Pick the appropriate choice for cloud service. Leave it set to **Create a new cloud service** (unless you are adding this new virtual machine to an existing VM cloud service). Then, under **Cloud Service DNS Name**, type a name. The DNS name becomes part of the URI that's used to contact the virtual machine. The cloud service acts as a communications and isolation group. All virtual machines in the same cloud service can communicate with each other, can be set up for load balancing, and can be placed in the same availability set. 

	2. Under **Region/Affinity Group/Virtual Network**, specify a virtual network if you plan to use one. **Important**: If you want a virtual machine to use a virtual network, you must join the VM to the virtual network when you create the virtual machine. You can't join the virtual machine to a virtual network after you create the VM. For more information, see [Azure Virtual Network Overview][]. 
	
	3. Create the availability set. Under **Availability Set**, leave it set to **Create an availability set**. Then, type a name for the set. 
	4. Create the default endpoints and add more endpoints if needed. You also can add endpoints later. 

	![Create an availabililty set for a new VM](./media/virtual-machines-how-to-configure-availability/VMavailabilityset.png) 

6. On the fourth screen, choose the extensions you want to install. Extensions provide features that make it easier to manage the virtual machine, such as running antimalware or resetting passwords. For details, see [Azure VM Agent and VM Extensions](http://go.microsoft.com/fwlink/p/?LinkId=XXX).

7.	Click the arrow to create the virtual machine and the availability set.

	From the dashboard of the new virtual machine, you can click **Configure** to see that the virtual machine belongs to the new availability set.

To use Azure cmdlets:

1.	Open an Azure PowerShell session and run commands similar to the following examples. Note that these examples assume you're creating the virtual machine, the cloud service, and the availability set.

2.	Get the name of the image that you want to use to create the virtual machine, and store it in a variable. The command uses the index number and the ImageName property of the image object:<br>

	`C:\PS> $image = (Get-AzureVMImage)[4].ImageName`

	>[WACOM.NOTE] To get a list of all images that apply to your subscription, run `Get-AzureVMImage` without parameters.

3.	Specify the configuration for the new virtual machine, and then use the pipeline to pass a configuration object to the cmdlet that creates the VM. Be sure to substitute your own values for the placeholders, such as  &lt;VmName&gt; and &lt;VmSize&gt;.

	`C:\PS> New-AzureVMConfig -Name "<VmName>" -InstanceSize <VmSize> -AvailabilitySetName "<SetName>" -ImageName $image | Add-AzureProvisioningConfig -Windows -AdminUsername "<UserName>" -Password "<MyPassword>" | Add-AzureDataDisk -CreateNew -DiskSizeInGB 50 -DiskLabel 'datadisk1' -LUN 0 | New-AzureVM –ServiceName "<MySvc1>" `

## <a id="addmachine"> </a>Option 2: Add an existing virtual machine to an availability set##

In the Management Portal, you can add existing virtual machines to an existing availability set, or create a new one for them. (Keep in mind that the virtual machines must belong to the same cloud service.) The steps are almost the same. In Azure PowerShell, you can add the virtual machine to an existing availability set. 

1. If you have not already done so, sign in to the Azure [Management Portal](http://manage.windowsazure.com).

2. On the navigation bar, click **Virtual Machines**.

3. From the list of virtual machines, pick one of the virtual machines you want to add to the set. Click the row of the virtual machine to open its dashboard.

4. From the tabs below the virtual machine name, click **Configure**. 

5. In the Settings section, find **Availability Set**. Do one of the following:

	A. Pick **Create an availability set**, and then type a name for the set.

	B. Pick **Select an availability set**, and then pick a set from the list.

	![Create an availabililty set for an existing VM](./media/virtual-machines-how-to-configure-availability/VMavailabilityExistingVM.png) 

6. Click **Save**.

To use Azure cmdlets:

Open an Azure PowerShell session and run the following command. Be sure to substitute your own values for the placeholders, such as &lt;VmCloudServiceName&gt; and &lt;VmName&gt;.

	C:\PS> Get-AzureVM -ServiceName "<VmCloudServiceName>" -Name "<VmName>" | Set-AzureAvailabilitySet -AvailabilitySetName "<MyAvSet>" | Update-AzureVM

>[WACOM.NOTE] The virtual machine might be restarted to finish adding it to the availability set.


##Additional resources
[About Azure VM configuration settings]

[Option 1: Create a virtual machine and an availability set at the same time]: #createset
[Option 2: Add an existing virtual machine to an availability set]: #addmachine

<!-- LINKS -->
[Load Balancing for Azure Infrastructure Services]: ../virtual-machines-load-balance
[Manage the Availability of Virtual Machines]: ../virtual-machines-manage-availability
[Create a Virtual Machine Running Windows]: ../virtual-machines-windows-tutorial
[Azure Virtual Network Overview]: http://go.microsoft.com/fwlink/p/?linkid=294063
[About Affinity Groups for Virtual Network]: http://msdn.microsoft.com/library/windowsazure/jj156085.aspx
[How to connect virtual machines in a cloud service]: ../virtual-machines-connect-cloud-service
[About Azure VM configuration settings]: http://msdn.microsoft.com/en-us/library/azure/dn763935.aspx

