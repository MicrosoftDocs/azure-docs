<properties writer="kathydav" editor="tysonn" manager="jeffreyg" />

#How to Create a Custom Virtual Machine

You can create a custom virtual machine by providing advanced options, such as size, connected resources, DNS name, and network connection. You must use this option if you want to connect virtual machines or if you want to use a custom image to create the machine. 

Before you create a virtual machine, you should decide how it will be used. If you have a need for only one virtual machine in your application, you choose to create a stand-alone virtual machine. If you need multiple virtual machines in the same cloud service that can communicate with each other and act as a load-balanced application, connect the new virtual machine to an existing virtual machine.

**Important**: If you want your virtual machine to use a virtual network so you can connect to it directly by hostname or set up cross-premises connections, make sure you specify the virtual network when you create the virtual machine. A virtual machine can be configured to join a virtual network only when you create the virtual machine. For more information about virtual networks, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

1. Sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. On the command bar, click **New**.

	![Create a new virtual machine][Create a new virtual machine]

3. Click **Virtual Machine**, and then click **From Gallery**.

	![Create a new custom virtual machine][Create a new custom virtual machine]

	The **Select the virtual machine operating system** dialog box appears.  

	
4. From **Platform Images**, select a platform image that you want to use, and then click the arrow to continue.

	**Note**: These instructions describe the selection of a Windows Server image, but the instructions also apply to Linux images.

	The **Virtual machine configuration** dialog box appears.

	
5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

6. In **New User Name**, type a name for the administrative account that you want to use to manage the server. 

7. In **New Password**, type a strong password to use for the administrative account on the virtual machine. In **Confirm Password**, retype the same password.

8. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

9. Click the arrow to continue.

	The **Virtual machine mode** dialog box appears.
	
10. Choose whether this virtual machine will be a stand-alone virtual machine, or connected to other virtual machines in the same cloud service to balance the load of traffic to the application. For more information about connecting virtual machines, see [How to connect virtual machines in a cloud service](http://www.windowsazure.com/en-us/manage/windows/how-to-guides/connect-to-a-cloud-service/).

11. If it will be a stand-alone virtual machine, in **DNS Name**, type a name for the cloud service that is created for the machine. The entry can contain from 3 through 24 lowercase letters and numbers.

12. In **Storage Account**, select an existing storage account for the VHD file, or use an automatically generated storage account. Only one storage account per region is automatically created. All other virtual machines that you create with this setting are located in this storage account. You are limited to 20 storage accounts.

13. In **Region/Affinity Group/Virtual Network**, select region, affinity group, or virtual network that you want to use for the virtual machine. For more information about affinity groups, see [About Affinity Groups for Virtual Network][].

14. Click the arrow to continue.

	The **Virtual machine options** dialog box appears.


15. (Optional) In **Availability Set**, select **Create availability set**. When a virtual machine is a member of an availability set, it is deployed to different fault domains than other virtual machines in the set. Multiple virtual machines in an availability set help ensure that your application is available during network failures, local disk hardware failures, and any planned downtime.

	If you are creating an availability set, type a the name for the availability set.

16. (Optional) If you want the virtual machine to use a virtual network, choose the virtual network subnet. For more information about virtual networks, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

17. Click the arrow to create the virtual machine.

	![Custom virtual machine creation successful][Custom virtual machine creation successful]

[Create a Virtual Machine into a Virtual Network]: /en-us/manage/services/networking/add-a-vm-to-a-virtual-network/
[About Affinity Groups for Virtual Network]:http://msdn.microsoft.com/en-us/library/windowsazure/
[Create a new virtual machine]:../media/create.png
[Create a new custom virtual machine]:../media/createnew.png
[Custom virtual machine creation successful]:../media/vmsuccesswindows.png