1. Sign in to the [classic portal](http://manage.windowsazure.com). 

2. On the command bar at the bottom of the window, click **New**.

3. Under **Compute**, click **Virtual Machine**, and then click **From Gallery**.

	![Navigate to From Gallery in the Command Bar](./media/virtual-machines-create-WindowsVM/fromgallery.png)

4. The first screen after this lets you **Choose an Image** for your virtual machine from the list of available images. You can choose an image from the gallery or select from images and disks that you have uploaded. The available images may differ depending on the subscription you're using.

5. The second screen lets you pick a computer name, size, and administrative user name and password. Use the tier and size required to run your app or workload. Here are some tips:

	- **Virtual Machine Name** can only contain letters, numbers and hypens. It also must start with a letter and end with a letter or a number.
	- **New User Name** refers to the administrative account that you use to manage the server. The password must be 8-123 characters long and have at least three of the following: lower case character, upper case character, number, and a special character. **You'll need the user name and password to connect and log on to the virtual machine**.
	- A virtual machine's size affects the cost of using it, as well as configuration options such as how many data disks you can attach. For details, see [Sizes for virtual machines](virtual-machines-windows-sizes.md).

6. The third screen lets you configure resources for networking, storage, and availability. Here are some tips:

	- The **Cloud Service DNS Name** is the global DNS name that becomes part of the URI that's used to contact the virtual machine. You'll need to come up with your own cloud service name because it must be unique in Azure. Cloud services are important for scenarios using [multiple virtual machines](virtual-machines-windows-classic-connect-vms.md).

	- For **Region/Affinity Group/Virtual Network**, use a region that's appropriate to your location. You can also choose to specify a virtual network instead.

	- If you want a virtual machine to use a virtual network, you **must** specify the virtual network when you create the virtual machine. You can't join the virtual machine to a virtual network after you create the VM. For more information, see [Azure Virtual Network Overview](virtual-networks-overview.md).
	
	- For details about configuring endpoints, see [How to Set Up Endpoints to a Virtual Machine](virtual-machines-windows-classic-setup-endpoints.md).

7. The fourth configuration screen lets you install the VM Agent and configure some of the available extensions.

	>[AZURE.NOTE] The VM agent provides the environment for you to install extensions that can help you interact with or manage the virtual machine. For details, see [About the VM agent and extensions](virtual-machines-windows-classic-agents-and-extensions.md).  

8. After the virtual machine is created, the classic portal lists the new virtual machine under **Virtual Machines**. The corresponding cloud service and storage account also are created and are listed in those sections. Both the virtual machine and cloud service are started automatically and their status is listed as **Running**.

	![Configure VM Agent and the endpoints of the virtual machine](./media/virtual-machines-create-WindowsVM/vmcreated.png)
