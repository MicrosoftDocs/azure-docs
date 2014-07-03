1. Sign in to the Windows Azure [Management Portal](http://manage.windowsazure.com). Check out the [Free Trial](http://www.windowsazure.com/en-us/pricing/free-trial/) offer if you do not have a subscription yet.

2. On the command bar at the bottom of the screen, click **New**.

	![Select New from the Command Bar](./media/virtual-machines-create-WindowsVM/commandbarnew.png)

3. Under **Compute**, click **Virtual Machine**, and then click **From Gallery**.

	![Navigate to From Gallery in the Command Bar](./media/virtual-machines-create-WindowsVM/fromgallery.png)
	
4. The first screen lets you **Choose an Image** for your virtual machine from one of the lists in the Image Gallery. (The available images may differ depending on the subscription you're using.) Click the arrow to continue.

	![Choose an image](./media/virtual-machines-create-WindowsVM/chooseimage.png)

5. The second screen lets you pick a computer name, size, and administrative user name and password. For this tutorial, fill in the fields as shown in the image below. Then, click the arrow to continue.

	>[WACOM.NOTE] **New User Name** refers to the administrative account that you use to manage the server. Create a unique password for this account and make sure to remember it. **You'll need the user name and password to log on to the virtual machine**.

	![Configure the properties of the virtual machine](./media/virtual-machines-create-WindowsVM/vmconfiguration.png)

	

6. The third screen lets you configure resources such as the cloud service and the storage account. When this screen is complete, click the arrow to continue. Some tips to help you fill this out are: 

	

	- The **Cloud Service DNS Name** is the global DNS name that becomes part of the URI that is used to contact the virtual machine. You'll need to come up with your own cloud service name since cloud service names must be unique in Azure. Cloud services are important for more complex scenarios using [multiple virtual machines](http://www.windowsazure.com/en-us/documentation/articles/cloud-services-connect-virtual-machine/).
 
	- For **Region/Affinity Group/Virtual Network**, use a region that is appropriate to your location. You can also choose to specify a virtual network instead.
 
	>[WACOM.NOTE] If you want a virtual machine to use a virtual network, you **must** specify the virtual network when you create the virtual machine. You can't join the virtual machine to a virtual network after you create the VM. For more information, see [Azure Virtual Network Overview](http://go.microsoft.com/fwlink/p/?LinkID=294063).

	- For details about configuring endpoints, see [How to Set Up Endpoints to a Virtual Machine](http://www.windowsazure.com/en-us/documentation/articles/virtual-machines-set-up-endpoints/).

	![Configure the connected resources of the virtual machine](./media/virtual-machines-create-WindowsVM/resourceconfiguration.png)

7. The fourth configuration screen lets you configure the VM Agent and some of the available extensions. For this tutorial, do not make any changes to this screen. Click the check mark to create the virtual machine.


	![Configure VM Agent and extensions for the virtual machine](./media/virtual-machines-create-WindowsVM/agent-and-extensions.png)

	>[WACOM.NOTE] The VM agent provides the environment for you to install extensions that can help you interact with the virtual machine. For details, see [Using Extensions](http://go.microsoft.com/FWLink/p/?LinkID=390493).  
    
8. After the virtual machine is created, the Management Portal lists the new virtual machine under **Virtual Machines**. The corresponding cloud service and storage account are also created under their respective sections. Both the virtual machine and cloud service are started automatically and the Management Portal shows their status as **Running**. 

	![Configure VM Agent and the endpoints of the virtual machine](./media/virtual-machines-create-WindowsVM/vmcreated.png)