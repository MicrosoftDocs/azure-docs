<properties writer="kathydav" editor="tysonn" manager="jeffreyg" /> 

#Manage the Availability of Virtual Machines#

You can ensure the availability of your application by using multiple Windows Azure Virtual Machines. By using multiple virtual machines in your application, you can make sure that your application is available during local network failures, local disk hardware failures, and any planned downtime that the platform may require.

You manage the availability of your application that uses multiple virtual machines by adding the machines to an availability set. Availability sets are directly related to fault domains and update domains. A fault domain in Windows Azure is defined by avoiding single points of failure, like the network switch or power unit of a rack of servers. In fact, a fault domain is closely equivalent to a rack of physical servers.  When multiple virtual machines are connected together in a cloud service, an availability set can be used to ensure that the machines are located in different fault domains. The following diagram shows two availability sets with two virtual machines in each set.

![Update domains][Update domains]

Windows Azure periodically updates the operating system that hosts the instances of an application. A virtual machine is shut down when an update is applied. An update domain is used to ensure that not all of the virtual machine instances are updated at the same time. When you assign multiple virtual machines to an availability set, Windows Azure ensures that the machines are assigned to different update domains. The previous diagram shows two virtual machines running Internet Information Services (IIS) in separate update domains and two virtual machines running SQL Server also in separate update domains.

You should use a combination of availability sets and load-balancing endpoints to help ensure that your application is always available and running efficiently. For more information about using load-balanced endpoints, see [Load Balancing Virtual Machines] [].

This task includes the following steps:

- [Step 1: Create a virtual machine and an availability set] []
- [Step 2: Add a virtual machine to the cloud service and assign it to the availability set during the creation process] []
- [Step 3: (Optional) Create an availability set for previously created virtual machines] []
- [Step 4: (Optional) Add a previously created virtual machine to an availability set] []

## <a id="createset"> </a>Step 1: Create a virtual machine and an availability set ##

To create an availability set that contains virtual machines, you can create the first virtual machine and the availability set at the same time, and then you can add virtual machines to the availability set as you create them. You can also create virtual machines, create an availability set, and then add all of the machines to the set.

**To create a virtual machine and availability set**

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. On the command bar, click **New**.

	![Create a virtual machine][Create a virtual machine]

3. Click **Virtual Machine**, and then click **From Gallery**.


	The **Select the virtual machine operating system** dialog box appears. This article shows the selection of a Windows Server 2012 image, but these instructions also apply to Linux images.
	
4. From **Platform Images**, select an image and then click the arrow to continue.

	The **Virtual machine configuration** dialog box appears.

5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

6. In **New User Name**, type a name for the administrative account that you want to use to manage the server. 

7. In **New Password**, type a strong password for the administrative account. In **Confirm Password**, retype the password that you previously entered.

8. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

9. Click the arrow to continue.

	The **Virtual machine mode** dialog box appears.
	
10. Choose **Stand-alone virtual machine**.

11.	In **DNS Name**, type a name for the cloud service that is created for the machine. The name can contain from 3 through 24 lowercase letters and numbers.

12.	In **Storage Account**, select a storage account where the .vhd file is stored, or you can select to have a storage account automatically created. Only one storage account per region is automatically created. All other virtual machines that you create with this setting are located in this storage account. You are limited to 20 storage accounts.

13.	In **Region/Affinity Group/Virtual Network**, select region, affinity group, or virtual network that you want to contain the virtual machine. For more information about affinity groups, see [About Affinity Groups for Virtual Network] [].

14. Click the arrow to continue.

	The **Virtual machine options** dialog box appears.

15. In **Availability Set**, select **Create availability set**.
 
16. In **Availability Set Name**, enter the name for the availability set.

17.	Click the arrow to create the virtual machine and the availability set.

	From the dashboard of the new virtual machine, you can click **Configure** and see that the virtual machine is a member of the new availability set.

	![Configure availability][Configure availability]

## <a id="addmachine"> </a>Step 2: Add a virtual machine to the cloud service and assign it to the availability set during the creation process ##

The previous step showed you how to create a virtual machine and availability set at the same time. You can now create a new virtual machine, connect it to the cloud service of the first virtual machine, and then add it to the availability set that you previously created.

**To connect a new virtual machine and add it to the availability set**

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. On the command bar, click **New**.

	![Create a virtual machine][Create a virtual machine]

3. Click **Virtual Machine**, and then click **From Gallery**.

	![Create from gallery][Create from gallery]

	The **VM OS Selection** dialog box appears. You can now select an image from the Image Gallery.

	![Select platform image][Select platform image]

4. Click **Platform Images**, select the platform image that you want to use, and then click the arrow to continue.

	The **VM Configuration** dialog box appears.

	![Define the virtual machine][Define the virtual machine]

5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

6. In **New Password**, type the password that is used for the Administrator account on the virtual machine. In **Confirm Password**, retype the password that you previously entered.

7. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

8. For a virtual machine running the Linux operating system, you can select to secure the machine with an SSH Key.

9.	Click the arrow to continue.

	The **VM Mode** dialog box appears.

	![Connect virtual machines][Connect virtual machines]

10. Select **Connect to existing Virtual Machine** to create a new virtual machine that will be connected with the first virtual machine in the availability set.  Select the cloud service that contains the virtual machine in the availability set.

11. In **Storage Account**, select a storage account where the VHD file is stored.

12. In **Region/Affinity Group/Virtual Network**, select region that you want to contain the virtual machine.

13. Click the arrow to continue.

	The **VM Options** dialog box appears.

	![Select the availability set][Select the availability set]

14. Select the availability set that was created when you created the first virtual machine.

15. Click the check mark to create the connected virtual machine and add it to the availability set.

	From the dashboard of the new virtual machine, you can click **Configure** and see that the virtual machine is a member of the new availability set.

	![Availability set success][Availability set success]

## <a id="previousmachine"> </a>Step 3: (Optional) Create an availability set for previously created virtual machines ##

You can create an availability set and add a virtual machine to it after you create the machine. After you create a virtual machine, you can configure the size of the machine and whether it is a member of an availability set.

**To create a new availability set**

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the virtual machine that you want to configure.

3. Click **Configure**.

	![Configure the virtual machine][Configure the virtual machine]

4. In the **Availability Set** section, select **Create Availability Set**, and then enter a name for the set.

	![Create availability set][Create availability set]

5. Click **Save**.

	**Note:** This might result in the virtual machine being restarted to finalize the membership in the availability set. 

## <a id="existingset"> </a>Step 4: (Optional) Add a previously created virtual machine to an availability set ##

You can easily add an existing virtual machine to an availability set that was previously created. To add a virtual machine to an availability set, it must connected to the same cloud service as the other virtual machines in the set. For more information about connecting virtual machines, see [How to Connect Virtual Machines in a Cloud Service] [].

**To add an existing virtual machine to an availability set**

1. If you have not already done so, sign in to the Windows Azure Management Portal.

2. Click **Virtual Machines**, and then select the virtual machine that you want to add to the availability set.

3. Click **Configure**.

	![Configure the virtual machine][Configure the virtual machine]

4. In the **Availability Set** section, select the availability set that you previously created.

	![Add a virtual machine][Add a virtual machine]

5. Click **Save**. 

	**Note:** This might result in the virtual machine being restarted to finalize the membership in the availability set.


[Step 1: Create a virtual machine and an availability set]: #createset
[Step 2: Add a virtual machine to the cloud service and assign it to the availability set during the creation process]: #addmachine
[Step 3: (Optional) Create an availability set for previously created virtual machines]: #previousmachine
[Step 4: (Optional) Add a previously created virtual machine to an availability set]: #existingset

[Update domains]:../media/updatedomains.png
[Create a virtual machine]:../media/create.png
[Create from gallery]:../media/createnew.png
[Select platform image]:../media/platformimageselection.png
[Define the virtual machine]:../media/imagedefinewindows.png
[Select standalone]:../media/imagestandalonewindows.png
[Set virtual machine options]:../media/availabilityset.png
[Configure availability]:../media/configureavailability.png
[Connect virtual machines]:../media/connectedvms.png
[Select the availability set]:../media/availabilitysetselect.png
[Availability set success]:../media/availabilitysuccess.png
[Configure the virtual machine]:../media/configurevm.png
[Create availability set]:../media/availabilitycreate.png
[Add a virtual machine]:../media/availabilityadd.png

[Load Balancing Virtual Machines]:../../Windows/CommonTasks/LoadBalancingVirtualMachines.md
[About Affinity Groups for Virtual Network]:http://msdn.microsoft.com/en-us/library/jj156085.aspx
[How to connect virtual machines in a cloud service]:../../Windows/HowTo/howto-connect-vm-cloud-service.md