#How to Quickly Create a Virtual Machine

To use this feature and other new Windows Azure capabilities, sign up for the [free preview](https://account.windowsazure.com/PreviewFeatures). 

You use the **Quick Create** method to quickly create a virtual machine in the Management Portal. When you create this machine, all you need to provide is the name of the machine, the image that is used to create the machine, and the password for the user account that is used to manage the machine.

1. Sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. On the command bar, click **New**.

	![Create a new virtual machine] (../media/create.png)

3. Click **Virtual Machines**, and then click **Quick Create**.

	![Quick Create a new virtual machine] (../media/createquick.png)

	The **Create a New Virtual Machine** dialog box appears.

	![Enter the details of the new virtual machine] (../media/newvm.png)

4. Enter the following information for the new virtual machine:

	- **DNS Name** – the name that is used for both the virtual machine that is created and the cloud service that contains the virtual machine.
	- **Image** – the platform image that is used to create the virtual machine. 
	- **Account Password** - enter and confirm a password for the Administrator account. You use this account to manage the virtual machine.
	- **Location** – the region that contains the virtual machine. 

5. Click the check mark to create the virtual machine.

	**Note:** A storage account is created to contain this virtual machine.  Only one storage account exists for holding these virtual machines, if it exists, it is used to for additional machines. 

	You will see the new virtual machine listed in on the **Virtual Machines** page.

	![Virtual machine creation success] (../media/vmsuccesswindows.png)

