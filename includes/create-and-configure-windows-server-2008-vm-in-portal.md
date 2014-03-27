<properties writer="kathydav" editor="tysonn" manager="jeffreyg" /> 

**Note**: This article creates a virtual machine that is not connected to a virtual network. If you want your virtual machine to use a virtual network so you can connect to your virtual machines directly by hostname or set up 
cross-premises connections, use the **From Gallery** method instead and specify the virtual network when you create the virtual machine. For more information about virtual networks, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).


Follow these steps to create a virtual machine:

1. Login to the [Azure Management Portal](http://manage.windowsazure.com) using your Azure account.

2. In the Management Portal, at the bottom left of the web page, click **+New**, click **Virtual Machine**, and then click **From Gallery**.
	![Create a New Virtual Machine][Image1]

3. Select a Windows Server 2008 R2 SP1 virtual machine image, and then click the next arrow at the bottom right of the page.
	
4. On the **Virtual machine configuration** page, provide the following information:

- Provide a **Virtual Machine Name**, such as "testwinvm".
- In the **New User Name** box, type "Administrator".
- In the **New Password** box, type a [strong password](http://msdn.microsoft.com/en-us/library/ms161962.aspx).
- In the **Confirm Password** box, retype the password.
- Select the appropriate **Size** from the drop down list.

	Click the next arrow to continue.


5. On the **Virtual machine mode** page, provide the following information:

- Select **Standalone Virtual Machine**.
- In the **DNS Name** box, type a valid sub-domain in the format **testwinvm.cloudapp.net**
- In the **Region/Affinity Group/Virtual Network** box, select a region where this virtual image will be hosted.

   Click the next arrow to continue.

	
6. On the **Virtual machine options** page, select **(none)** in the **Availability Set** box. Click the check mark to continue.
	

7. Wait while Azure prepares your virtual machine.


[Image1]: ./media/create-and-configure-windows-server-2008-vm-in-portal/CreateWinVM.png


