<properties writer="kathydav" editor="tysonn" manager="jeffreyg" /> 

#How to Quickly Create a Virtual Machine

You use the **Quick Create** method to quickly create a virtual machine in the Management Portal. When you create this machine, you use one dialog box to provide the configuration details.

**Note**: This article creates a virtual machine that is not connected to a virtual network. If you want your virtual machine to use a virtual network, use the **From Gallery** method instead and specify the virtual network when you create the virtual machine. For more information about virtual networks, see [Windows Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

1. Sign in to the [Windows Azure Management Portal](http://manage.windowsazure.com).

2. On the command bar, click **New**.

	![Create a new virtual machine] (../media/create.png)

3. Click **Virtual Machines**, and then click **Quick Create**.

	![Quick Create a new virtual machine] (../media/createquick.png)

	The **Create a New Virtual Machine** dialog box appears.

	4. Type the following information for the new virtual machine:

	- **DNS Name** – the name that is used for both the virtual machine that is created and the cloud service that contains the virtual machine.
	- **Image** – the platform image that is used to create the virtual machine. 
	- **User Name** - the name of the account that you want to use to manage the virtual machine.
	- **Account Password** - type and confirm a strong password for the account.
	- **Location** – the region that contains the virtual machine. 

5. Click the check mark to create the virtual machine.

	**Note:** A storage account is automatically created to contain this virtual machine.   

	You will see the new virtual machine listed in on the **Virtual Machines** page.

	![Virtual machine creation success] (../media/vmsuccesswindows.png)

