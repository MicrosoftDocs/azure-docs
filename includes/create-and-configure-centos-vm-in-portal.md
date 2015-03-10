<properties writer="kathydav" editor="tysonn" manager="jeffreyg" /> 

**Note**: This article creates a virtual machine that is not connected to a virtual network. If you want your virtual machine to use a virtual network so you can connect to your virtual machines directly by hostname or set up
cross-premises connections, use the **From Gallery** method instead and specify the virtual network when you create the virtual machine. For more information about virtual networks, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

1. Sign in to the Azure Management Portal using your Azure account.
2. In the Management Portal, at the bottom left of the web page, click **+New**, click **Virtual Machine**, and then click **From Gallery**.

	![Create a New Virtual Machine][Image1]

3. Select a CentOS virtual machine image from **Platform Images**, and then click the next arrow at the bottom right of the page.
	
4. On the **Virtual machine configuration** page, provide the following information:
	- Provide a **Virtual Machine Name**, such as "testlinuxvm".
	- Specify a **New User Name**, such as "newuser", which will be added to the Sudoers list file.
	- In the **New Password** box, type a [strong password](http://msdn.microsoft.com/library/ms161962.aspx).
	- In the **Confirm Password** box, retype the password.
	- Select the appropriate **Size** from the drop down list.

	Click the next arrow to continue.
	
5. On the **Virtual machine mode** page, provide the following information:
	- Select **Standalone Virtual Machine**.
	- In the **DNS Name** box, type a valid DNS address.  For example,  "testlinuxvm"
	- In the **Storage Account** box, select **Use an automatically generated storage account**.
	- In the **Region/Affinity Group/Virtual Network** box, select a region where this virtual image will be hosted.

	Click the next arrow to continue.

6. On the **Virtual machine options** page, select **(none)** in the **Availability Set** box.

	Click the check mark to continue.
	
7. Wait while Azure prepares your virtual machine.

##Configure Endpoints
After the virtual machine is created, configure endpoints in order to remotely connect.

1. In the Management Portal, click **Virtual Machines**, click the name of your new virtual machine, then click **Endpoints**.

2. Click **Edit Endpoint** at the bottom of the page, and edit the SSH endpoint so that its **Public Port** is 22.

##Connect to the Virtual Machine
When the virtual machine has been provisioned and the endpoints configured you can connect to it using SSH or PuTTY.

###Connecting Using SSH
If you are using Linux, connect to the virtual machine using SSH.  At the command prompt, run:

	$ ssh newuser@testlinuxvm.cloudapp.net -o ServerAliveInterval=180

Enter the user's password.

###Connecting using PuTTY
If you are using a Windows computer, connect to the VM using PuTTY. PuTTY can be downloaded from the [PuTTY Download Page][PuTTYDownLoad]. 

1. Download and save **putty.exe** to a directory on your computer. Open a command prompt, navigate to that folder, and execute **putty.exe**.

2. Enter "testlinuxvm.cloudapp.net" for the **Host Name** and "22" for the **Port**.
![PuTTY Screen][Image6]  

##Update the Virtual Machine (optional)
Once you've connected to the virtual machine, you can optionally install updates. Run:

	$ sudo yum update

Enter the password again.  Wait while updates install.


[PuTTYDownload]: http://www.puttyssh.org/download.html

[Image1]: ./media/create-and-configure-centos-vm-in-portal/CreateVM.png

[Image6]: ./media/create-and-configure-centos-vm-in-portal/putty.png
