<properties writer="kathydav" editor="tysonn" manager="jeffreyg" />

#How to Create a Custom Virtual Machine

Creating a custom virtual machine allows you to choose options that aren't available if you use the **Quick Create** method. These options include connecting to a virtual network, to an existing cloud service, and to an availability set.

Each virtual machine is associated with a cloud service, either by itself or with other virtual machines in the same cloud service. A common reason for placing more than one virtual machine in the same cloud service is to provide load balancing for the application. If your application needs only one virtual machine, or you're creating the first virtual machine, you will create the cloud service when you create the virtual machine. Otherwise, you will add the new virtual machine to an existing cloud service.

**Important**: If you want your virtual machine to use a virtual network so you can connect to it directly by hostname or set up cross-premises connections, make sure you specify the virtual network when you create the virtual machine. A virtual machine can be configured to join a virtual network only when you create the virtual machine. For more information about virtual networks, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

1. Sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. On the command bar, click **New**.

3. Click **Compute**, click **Virtual Machine**, and then click **From Gallery**.

4. From **Platform Images**, select a platform image that you want to use, and then click the arrow to continue.
	
5.  If multiple versions of the image are available, in **Version Release Date**, pick the version you want to use.

6. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

7. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

8. In **New User Name**, type a name for the administrative account that you want to use to manage the server. 

9. In **New Password**, type a strong password to use for the administrative account on the virtual machine. In **Confirm Password**, retype the same password.

10. Click the arrow to continue.

11. In **Cloud Service**, do one of the following:
	
- If this is the first or only virtual machine in the cloud service, select **Create a New Cloud Service**. Then, in **Cloud Service DNS Name**, type a name that uses between 3 and 24 lowercase letters and numbers. This name becomes part of the URI that is used to contact the virtual machine through the cloud service.
- If this virtual machine is being added to a cloud service, select it in the list.

	**Note**: For more information about placing virtual machines in the same cloud service, see [How to connect virtual machines in a cloud service](http://www.windowsazure.com/en-us/manage/windows/how-to-guides/connect-to-a-cloud-service/).

12. In **Region/Affinity Group/Virtual Network**, select region, affinity group, or virtual network that you want to use for the virtual machine. For more information about affinity groups, see [About Affinity Groups for Virtual Network][].

13. In **Storage Account**, select an existing storage account for the VHD file, or use an automatically generated storage account. Only one storage account per region is automatically created. All other virtual machines that you create with this setting are located in this storage account. You are limited to 20 storage accounts.

14. If you want the virtual machine to belong to an availability set, In **Availability Set**, select **Create availability set** or add it to an existing availability set. 

	**Note**: Virtual machine that are members of an availability set are deployed to different fault domains. Placing multiple virtual machines in an availability set helps ensure that your application is available during network failures, local disk hardware failures, and any planned downtime.

15.  Under Endpoints, review the new endpoints that will be created to allow connections to the virtual machine, such through Remote Desktop or a Secure Shell (SSH) client. You also can add endpoints now, or create them later. For instructions on creating them later, see [How to Set Up Communication with a Virtual Machine](http://www.windowsazure.com/en-us/manage/linux/how-to-guides/setup-endpoints/). 

16. Click the arrow to create the virtual machine.

	![Custom virtual machine creation successful][Custom virtual machine creation successful]

[Create a Virtual Machine into a Virtual Network]: /en-us/manage/services/networking/add-a-vm-to-a-virtual-network/
[About Affinity Groups for Virtual Network]:http://msdn.microsoft.com/en-us/library/windowsazure/
[Create a new virtual machine]:../media/create.png
[Create a new custom virtual machine]:../media/createnew.png
[Custom virtual machine creation successful]:../media/vmsuccesswindows.png