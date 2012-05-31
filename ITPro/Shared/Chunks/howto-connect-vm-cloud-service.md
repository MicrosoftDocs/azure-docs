#How to Connect Virtual Machines in a Cloud Service

When you create a virtual machine, a cloud service is automatically created to contain the machine. You can create multiple virtual machines under the same cloud service to enable the machines to communicate with each other, to load-balance between virtual machines, and to maintain high availability of the machines. 

You must first create a virtual machine with a new cloud service, and then you can connect additional machines with the first machine under the same cloud service. 

1. Create a virtual machine using the steps in [How to create a custom virtual machine] [].

2. After you create the first custom virtual machine, on the [Management Portal](http://manage.windowsazure.com) command bar, click **New**.

	![Create a new virtual machine][Create a new virtual machine]

3. Click **Virtual Machine**, and then click **From Gallery**.

	![Create a custom virtual machine][Create a custom virtual machine]

	The **VM OS Selection** dialog box appears. You can now select an image from the Image Gallery.

	![Select the image][Select the image]

4. Click **Platform Images**, select the platform image that you want to use, and then click the arrow to continue.

	The **VM Configuration** dialog box appears.

	![Select the image][Select the image]

5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

6. In **New Password**, type the password that is used for the Administrator account on the virtual machine. In **Confirm Password**, retype the password that you previously entered.

7. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

8. For a virtual machine running the Linux operating system , you can select to secure the machine with an SSH Key.

9. Click the arrow to continue.

	The **VM Mode** dialog box appears.

	![Define the connected virtual machine][Define the connected virtual machine]

10. Select **Connect to existing Virtual Machine** to create a new virtual machine under an existing cloud service. Select the cloud service that will contain the new virtual machine.

11. In **Storage Account**, select a storage account where the VHD file is stored or you can have a storage account automatically created. Only one storage account is automatically created. All other virtual machines that you create with this setting are located in this storage account. You are limited to 20 storage accounts.

12. In **Region/Affinity Group/Virtual Network**, select region that you want to contain the virtual machine.

13. Click the arrow to continue.

	The **VM Options** dialog box appears.

	![Define the connected virtual machine][Define the connected virtual machine]

14. Select the availability set that was created when you created the first virtual machine.

15. Click the check mark to create the connected virtual machine.

[How to create a custom virtual machine]:./howto-custom-create-VM/
[Create a new virtual machine]:../media/create.png
[Create a custom virtual machine]:../media/createnew.png
[Select the image]:../media/imageselectionwindows.png
[Select the image]:../media/imagedefinewindows.png
[Define the connected virtual machine]:../media/connectedvms.png
[Define the connected virtual machine] (../media/availabilitysetselect.png
