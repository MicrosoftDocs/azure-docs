<properties writer="cynthn" editor="tysonn" manager="timlt" />

1. Sign in to the [Azure classic portal](http://manage.windowsazure.com).  

2. On the command bar at the bottom of the window, click **New**.

3. Under **Compute**, click **Virtual Machine**, and then click **From Gallery**.

	![Create a New Virtual Machine][Image1]

4. Under the **SUSE** group, select an OpenSUSE virtual machine image, and then click the arrow to continue.

5. On the first **Virtual machine configuration** page:

	- Type a **Virtual Machine Name**, such as "testlinuxvm". The name must contain between 3 and 15 characters, can contain only letters, numbers, and hyphens, and must start with a letter and end with either a letter or number.

	- Verify the **Tier** and pick a **Size**. The tier determines the sizes you can choose from. The size affects the cost of using it, as well as configuration options such as how many data disks you can attach. For details, see [Sizes for virtual machines](../articles/virtual-machines-linux-sizes.md).
	- Type a **New User Name**, or accept the default, **azureuser**. This name is added to the Sudoers list file.
	- Decide which type of **Authentication** to use. For general password guidelines, see [Strong passwords](http://msdn.microsoft.com/library/ms161962.aspx).

6. On the next **Virtual machine configuration** page:

	- Use the default **Create a new cloud service**.
	- In the **DNS Name** box, type a unique DNS name to use as part of the address, such as "testlinuxvm".
	- In the **Region/Affinity Group/Virtual Network** box, select a region where this virtual image will be hosted.
	- Under **Endpoints**, keep the SSH endpoint. You can add others now, or add, change, or delete them after the virtual machine is created.

	>[AZURE.NOTE] If you want a virtual machine to use a virtual network, you **must** specify the virtual network when you create the virtual machine. You can't add a virtual machine to a virtual network after you create the virtual machine. For more information, see [Virtual Network Overview](virtual-networks-overview.md).

7.	On the last **Virtual machine configuration** page, keep the default settings and then click the check mark to finish.

The portal lists the new virtual machine under **Virtual Machines**. While the status is reported as **(Provisioning)**, the virtual machine is being set up. When the status is reported as **Running**, you can move on to the next step.

##Connect to the Virtual Machine

You'll use SSH or PuTTY to connect to the virtual machine, depending on the operating system on the computer you'll connect from:

- From a computer running Linux, use SSH. At the command prompt, type:

	`$ ssh newuser@testlinuxvm.cloudapp.net -o ServerAliveInterval=180`

	Type the user's password.

- From a computer running Windows, use PuTTY. If you don't have it installed, download it from the [PuTTY Download Page][PuTTYDownload].

	Save **putty.exe** to a directory on your computer. Open a command prompt, navigate to that folder, and run **putty.exe**.

	Type the host name, such as "testlinuxvm.cloudapp.net", and type "22" for the **Port**.

	![PuTTY Screen][Image6]  

##Update the Virtual Machine (optional)

1. After you're connected to the virtual machine, you can optionally install system updates and patches. To run the update, type:

	`$ sudo zypper update`

2. Select **Software**, then **Online Update** to list available updates. Select **Accept** to start the installation and apply all new available patches (except the optional ones).

3. After installation is done, select **Finish**.  Your system is now up to date.

[PuTTYDownload]: http://www.puttyssh.org/download.html

[Image1]: ./media/create-and-configure-opensuse-vm-in-portal/CreateVM.png

[Image6]: ./media/create-and-configure-opensuse-vm-in-portal/putty.png
