<properties writer="kathydav" editor="tysonn" manager="jeffreyg" /> 


#How to Connect Virtual Machines in a Cloud Service



When you create a virtual machine, a cloud service is automatically created to contain the machine. You can create multiple virtual machines under the same cloud service to enable the virtual machines to communicate with each other, to load-balance between virtual machines, and to maintain high availability of the machines. 

For more information about load-balancing virtual machines, see [Load balancing virtual machines] [Load balancing virtual machines]. For more information about managing the availability of your application, see [Manage the availability of virtual machines] [Manage the availability of virtual machines]. 


First, you'll need to create a virtual machine with a new cloud service, and then you can connect additional virtual machines to the first virtual machine under the same cloud service. 



1. Create a virtual machine using the steps in [How to create a custom virtual machine] [How to create a custom virtual machine].


2. After you create the first custom virtual machine, on the [Management Portal](http://manage.windowsazure.com) command bar, click **New**.


	![Create a new virtual machine](./media/howto-connect-vm-cloud-service/Create.png)

3. Click **Virtual Machine**, and then click **From Gallery**.

	
	![Create a custom virtual machine](./media/howto-connect-vm-cloud-service/CreateNew.png)

	The **Select the virtual machine operating system** dialog box appears. 


4. From the **Choose an image** page, select an image, and then click the arrow to continue.


	The first **Virtual machine configuration** page appears.


5. In **Virtual Machine Name**, type the name that you want to use for the virtual machine.

6. In **Size**, select the size that you want to use for the virtual machine. The size that you select depends on the number of cores that are needed for your application.

7. In **New User Name**, type a name for the administrative account that you want to use to manage the server.


8. In **New Password**, type a strong password for the administrative account. In **Confirm Password**, retype the password.


9. For a virtual machine running the Linux operating system, you can select to secure the machine with an SSH Key.


10. In **Cloud Service**, select the cloud service that will contain the new virtual machine.

11. In **Region/Affinity Group/Virtual Network**, select region that you want to contain the virtual machine.

12. In **Storage Account**, select a storage account to store the .vhd file, or leave the field set at the default to create the storage account automatically. Only one storage account is automatically created. All other virtual machines that you create with this setting are located in this storage account. You are limited to 20 storage accounts.


13. To use an availability set, select the one was created when you created the first virtual machine.

14. Review the default endpoint configuration, and modify if necessary. 

15. Click the check mark to create the connected virtual machine.


[How to create a custom virtual machine]: http://windowsazure.com/en-us/documentation/articles/virtual-machines-create-custom/
[Load balancing virtual machines]: http://windowsazure.com/en-us/documentation/articles/load-balance-virtual-machines/
[Manage the availability of virtual machines]: http://windowsazure.com/en-us/documentation/articles/virtual-machines-manage-availability/