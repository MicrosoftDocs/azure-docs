<properties writer="kathydav" editor="tysonn" manager="timlt" /> 

**Important**: If you want your virtual machine to use a virtual network, make sure you specify the virtual network when you create the virtual machine. A virtual machine can be configured to join a virtual network only when you create the virtual machine. For more information about virtual networks, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).


1. Login to the [Azure Management Portal][AzurePreviewPortal] using your Azure account.

2. In the Management Portal, at the bottom left of the web page, click **+New**, click **Virtual Machine**, and then click **From Gallery**.

	![Create a New Virtual Machine][Image1]

3. Under the **SUSE** group, select an OpenSUSE virtual machine image, and then click the forward arrow at the bottom right of the page.


4. On the first **Virtual machine configuration** page, fill in or verify the settings:

	- Type a **Virtual Machine Name**, such as "testlinuxvm".
	- Verify the **Tier** and pick a **Size**. The tier determines the sizes you can choose from.
	- Type a **New User Name**, such as "newuser", which will be added to the Sudoers list file.
	- Decide which type of **Authentication** to use. For general password guidelines, see [Strong passwords](http://msdn.microsoft.com/library/ms161962.aspx).


5. On the next **Virtual machine configuration** page, fill in or verify the settings:
	- Use the default **Create a new cloud service**.
	- In the **DNS Name** box, type a valid DNS name to use as part of the address, such as "testlinuxvm".
	- In the **Region/Affinity Group/Virtual Network** box, select a region where this virtual image will be hosted.

6.	Click the next arrow to finish, then wait while Azure prepares your virtual machine and then starts it.

##Connect to the Virtual Machine
You'll use SSH or PuTTY to connect to the virtual machine, depending on the operating system you're running on your computer:

- If you're using Linux to connect to the VM, use SSH. At the command prompt, run: 

	`$ ssh newuser@testlinuxvm.cloudapp.net -o ServerAliveInterval=180`
	
	Type the user's password.

- If you're using Windows computer to connect to the VM, use PuTTY. You can PuTTY download from the [PuTTY Download Page][PuTTYDownLoad]. 

	Download and save **putty.exe** to a directory on your computer. Open a command prompt, navigate to that folder, and execute **putty.exe**.

	Type the host name, such as "testlinuxvm.cloudapp.net", and type "22" for the **Port**.

	![PuTTY Screen][Image6]  

##Update the Virtual Machine (optional)
1. After you've connected to the virtual machine, you can optionally install system updates and patches. To run the update, type:

	`$ sudo zypper update`

2. Select **Software**, then **Online Update** to list available updates. Select **Accept** to start the installation and apply all new available patches (except the optional ones). 

3. After installation is done, select **Finish**.  Your system is now up to date.

[PuTTYDownload]: http://www.puttyssh.org/download.html
[AzurePreviewPortal]: http://manage.windowsazure.com

[Image1]: ./media/create-and-configure-opensuse-vm-in-portal/CreateVM.png

[Image6]: ./media/create-and-configure-opensuse-vm-in-portal/putty.png
