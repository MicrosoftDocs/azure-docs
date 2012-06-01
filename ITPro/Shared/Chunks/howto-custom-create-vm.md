#How to Create a Custom Virtual Machine

To use this feature, please sign up for access to the preview at [https://account.windowsazure.com/PreviewFeatures](https://account.windowsazure.com/PreviewFeatures). 

You can create a custom virtual machine by providing advanced options, such as size, connected resources, DNS name, and network connection. You must use this option if you want to connect virtual machines or if you want to use a custom image to create the machine. 

Before you create a virtual machine, you should decide how it will be used. If you have a need for only one virtual machine in your application, you choose to create a stand-alone virtual machine. If you need multiple virtual machines in the same cloud service that can communicate with each other and act as a load-balanced application, you choose to connect the new virtual machine to an existing virtual machine.

1. Sign  in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. On the command bar, click **New**.

	![Create a new virtual machine][Create a new virtual machine]

3. Click **Virtual Machine**, and then click **From Gallery**.

	![Create a new custom virtual machine][Create a new custom virtual machine]

	The **VM OS Selection** dialog box appears. You can now select an image from the Image Gallery.

	![Select the image][Select the image]

4. Click **Platform Images**, select the platform image that you want to use, and then click the arrow to continue.

	The **VM Configuration** dialog box appears.

	![Select the image][Define the image]

5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

6. In **New Password**, type the password that is used for the Administrator account on the virtual machine. In **Confirm Password**, retype the password that you previously entered.

7. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

8. Click the arrow to continue.

	The **VM Mode** dialog box appears.

	![Define the stand-alone virtual machine][Define the stand-alone virtual machine]

9. Choose whether the virtual machine is a single stand-alone machine or whether it is part of a cloud service that contains multiple connected machines. For more information about connecting virtual machines, see **How to connect virtual machines in a cloud service**.

10. If you are creating a stand-alone virtual machine, in **DNS Name**, type a name for the cloud service that is created for the machine. The entry can contain from 3-24 lowercase letters and numbers.

11. In **Storage Account**, select a storage account where the VHD file is stored, or you can select to have a storage account automatically created. Only one storage account per region is automatically created. All other virtual machines that you create with this setting are located in this storage account. You are limited to 20 storage accounts.

12. In **Region/Affinity Group/Virtual Network**, select region, affinity group, or virtual network that you want to contain the virtual machine. For more information about affinity groups, see [About Affinity Groups for Virtual Network][].

13. Click the arrow to continue.

	The **VM Options** dialog box appears.

	![Define the virtual machine options][Define the virtual machine options]

14. (Optional) In **Availability Set**, select **Create availability set**. When a virtual machine is a member of an availability set, it is deployed to different fault domains as other virtual machines in the set. Multiple virtual machines in an availability set make sure that your application is available during network failures, local disk hardware failures, and any planned downtime.

15. If you are creating an availability set, enter the name for the availability set.

16. (Optional) Choose the subnet that the virtual machine should be a member of. For more information about adding a virtual machine to a network, see [Create a Virtual Machine into a Virtual Network][].

17. Click the arrow to create the virtual machine.

	![Custom virtual machine creation successful][Custom virtual machine creation successful]

[Create a Virtual Machine into a Virtual Network]:http://www.windowsazure.com/manage/services/networking/
[About Affinity Groups for Virtual Network]:http://msdn.microsoft.com/en-us/library/windowsazure/
[Create a new virtual machine]:../media/create.png
[Create a new custom virtual machine]:../media/createnew.png
[Select the image]:../media/imageselectionwindows.png
[Define the image]:../media/imagedefinewindows.png
[Define the stand-alone virtual machine]:../media/imagestandalonewindows.png
[Define the virtual machine options]:../media/imageoptionswindows.png
[Custom virtual machine creation successful]:../media/vmsuccesswindows.png