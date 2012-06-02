<properties umbracoNaviHide="0" pageTitle="Create and Upload a Linux Virtual Hard Disk (VHD) to Windows Azure" metaKeywords="" metaDescription="" linkid="manage-linux-common-tasks-upload-vhd" urlDisplayName="Upload VHD" headerExpose="" footerExpose="" disqusComments="1" />
# Create and Upload a Linux virtual hard disk (VHD) to Windows Azure 

<div chunk="../../shared/chunks/disclaimer.md" />

A virtual machine that you create in Windows Azure runs the operating system that you choose from the supported operating system versions. You can customize the operating system settings of the virtual machine to facilitate running your application. The configuration that you set is stored on disk. You create a virtual machine in Windows Azure by using a virtual hard disk (VHD) file. You can choose to create a virtual machine by using a VHD file that is supplied for you in the Image Gallery, or you can choose to create your own image and upload it to Windows Azure in a VHD file.

The following resources must be available to complete this task:

- **Server running the Windows Server operating system.** This task depends on using the Hyper-V Manager that is a part of the Hyper-V role in the Windows Server operating system.
- **Linux operating system media.** Before you start this task, you must make sure that you have access to media that contains the Linux operating system. The following are supported Linux distributions:
	- Open SUSE 12.1
	- SLES 11 SP2
	- CentOS 6.2
	- Ubuntu 12.04
- **Linux Azure command-line tool.** If you are using a Linux operating system to create your image, you use this tool to upload the VHD file. To download the tool, see [Windows Azure Command-Line Tools for Linux and Mac](http://go.microsoft.com/fwlink/?LinkID=253691&clcid=0x409).
- **CSUpload command-line tool.** If you are using a Windows Server operating system to create your image, you use this tool to set the connection to Windows Azure and upload the VHD file. To download the SDK and the tools, see [Windows Azure Downloads](https://www.windowsazure.com/en-us/develop/downloads/).

This task includes the following steps:

- [Step 1: Install the Hyper-V role on your server] []
- [Step 2: Create the image] []
- [Step 3: Create a storage account in Windows Azure] []
- [Step 4: Prepare the image to be uploaded] []
- [Step 5: Upload the image to Windows Azure] []

## <a id="hyperv"> </a>Step 1: Install the Hyper-V role on your server ##

Multiple tools exist to create VHD files. In this task, you use Hyper-V Manager to create the VHD file that is uploaded to Windows Azure. For more information, see [Hyper-V](http://technet.microsoft.com/en-us/library/cc753637(WS.10).aspx).

1. On your server that is running Windows Server 2008, click **Start**, point to **Administrative Tools**, and then click **Server Manager**.

2. In the **Roles Summary** area, click **Add Roles**.

	![Add roles] (../media/role.png)

3. On the **Select Server Roles** page, click **Hyper-V**.

4. On the **Create Virtual Networks** page, click one or more network adapters if you want to make their network connection available to virtual machines.

5. On the **Confirm Installation Selections** page, click **Install**.

6. The computer must be restarted to complete the installation. Click **Close** to finish the wizard, and then click **Yes** to restart the computer.

7. After you restart the computer, log on with the same account you used to install the role. When the installation is complete, click **Close** to finish the wizard.

	You can now see the Hyper-V role installed on the server:

	![Hyper-V role added] (../media/rolehyperv.png)

## <a id="createimage"> </a>Step 2: Create the image ##

An image is a virtual hard disk (VHD) file that you can use as a template to create a new virtual machine. An image is a template because it doesn’t have specific settings like a configured virtual machine, such as the computer name and user account settings. The VHD contains the operating system, any operating system customizations, and your applications. You can create the VHD by completing the following steps in Hyper-V.

1. On your server, click **Start**, click **All Programs**, click **Administrative Tools**, and then click **Hyper-V Manager**.

2. In the **Actions** pane of Hyper-V Manager, click **New**, and then click **Virtual Machine**.

	![Create virtual machine] (../media/newmachine.png)

3. In the New Virtual Machine Wizard, provide a name and a location for the virtual machine, the amount of memory that you want the virtual machine to use, and the network adapter that you want the virtual machine to use.

	You will be asked to provide information for the virtual hard disk that is used for creating the virtual machine.

	![Enter virtual machine details] (../media/newvhd.png)

4. On the Connect **Virtual Hard Disk** page, select **Create a virtual hard disk**. Provide the following information, and then click **Next**:

	- **Name** - the name of the .vhd file. This is the file that you upload to Windows Azure.
	- **Location** - the folder where the .vhd file is located. You should store the VHD file in a secure location.
	- **Size** - the size of the virtual hard disk.  The maximum size for a virtual machine in Windows Azure is 127 GB.
5. On the **Installation Options** page, select **Install an operating system from a boot CD/DVD –ROM media**, and then choose the method that is appropriate for your installation media.

	![Choose the installation media] (../media/linuxchoosemedia.png)

6. Finish the wizard to create the virtual machine.

After the virtual machine is created it is not started by default. You must start the virtual machine to complete the installation of the operating system.

1. In the center pane of Hyper-V Manager, select the virtual machine that you created in the previous procedure.

2. In the **Actions** pane, click **Start**.

	![Start the virtual machine] (../media/start.png)

3. Click **Connect** to open the window for the virtual machine.

	![Connect to the virtual machine] (../media/connect.png)

4. Finish the installation of the operating system. For more information about installing the operating system, see the documentation provided by the Linux distributor. You must also prepare the image by completing specific steps for the distribution that you are using. You do this in [Step 4: Prepare the image to be uploaded] []. 

	**Note:** It is recommended that you do not create a SWAP partition at installation time. You may configure SWAP space by using the Windows Azure Linux Agent. It is also not recommended to use the mainstream Linux kernel with a Windows Azure virtual machine without the patch available at the [Microsoft web site](http://go.microsoft.com/fwlink/?LinkID=253692&clcid=0x409).

## <a id="createstorage"> </a>Step 3: Create a storage account in Windows Azure ##

A storage account represents the highest level of the namespace for accessing the storage services and is associated with your Windows Azure subscription. You need a storage account in Windows Azure to upload a VHD file to Windows Azure that can be used for creating a virtual machine. You can create a storage account by using the Windows Azure Management Portal.

1. Sign in to the Windows Azure Management Portal.

2. On the command bar, click **New**.

	![Create storage account] (../media/create.png)

3. Click **Storage Account**, and then click **Quick Create**.

	![Quick create a storage account] (../media/createnewstorage.png)

	The **Create a New Storage Account** dialog box appears.

	![Enter storage account details] (../media/storageinfo.png)

4. Enter a subdomain name to use in the URL for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This value becomes the host name within the URL that is used to address Blob, Queue, or Table resources for the subscription.

5. Choose the region that will contain the storage account.

6. Choose whether you need geo-replication for the storage account. Geo-replication is turned on by default. During geo-replication, your data is replicated to a secondary region so that your storage fails over seamlessly to a secondary location in the event of a major failure that can't be handled in the primary location. The secondary location is assigned automatically, and can't be changed. If legal requirements or organizational policy requires tighter control over the location of your cloud-based storage, you can turn off geo-replication. However, be aware that if you later turn on geo-replication, you will be charged a one-time data transfer fee to replicate your existing data to the secondary location. Storage services without geo-replication are offered at a discount.

7. Click **Create Storage Account**.

	The account is now listed under **Storage Accounts**.

	![Storage account successfully created] (../media/storagesuccess.png)



## <a id="prepimage"> </a>Step 4: Prepare the image to be uploaded ##

### Prepare the CentOS 6.2 operating system ###

You must complete specific configuration steps in the operating system for the virtual machine to run in Windows Azure.

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3. Uninstall NetworkManager by running the following command:

		rpm -e --nodeps NetworkManager

	**Note:** If the package is not already installed, this command will fail with an error message. This is expected.

4.	Create a file named **network** in the `/etc/sysconfig/` directory that contains the following text:

		NETWORKING=yes
		HOSTNAME=localhost.localdomain

5.	Create a file named **ifcfg-eth0** in the `/etc/sysconfig/network-scripts/` directory that contains the following text:

		DEVICE=eth0
		ONBOOT=yes
		DHCP=yes
		BOOTPROTO=dhcp
		TYPE=Ethernet
		USERCTL=no
		PEERDNS=yes
		IPV6INIT=no

6. Enable the network service by running the following command:

		chkconfig network on

7. Install the drivers for the Linux Integration Services.
	
	a) Obtain the .iso file that contains the drivers for the Linux Integration Services from [Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=28188).

	b) In Hyper-V Manager, in the **Actions** pane, click **Settings**.

	![Open Hyper-V settings] (../media/settings.png)

	c) In the **Hardware** pane, click **IDE Controller 1**.

	![Add DVD drive with install media] (../media/installiso.png)

	d) In the **IDE Controller** box, click **DVD Drive**, and then click **Add**.

	e) Select **Image file**, browse to **Linux IC v3.2.iso**, and then click **Open**.

	f) In the **Settings** page, click **OK**.

	g) Click **Connect** to open the window for the virtual machine.

	h) In the Command Prompt window, type the following commands:

		mount /dev/cdrom /media
		/media/install.sh`
		reboot

8. Install python-pyasn1 by running the following command:

		yum install python-pyasn1

9.	Download the [Windows Azure Linux Agent](http://go.microsoft.com/fwlink/?LinkID=251942&clcid=0x409) and then install it by running the following command:

		rpm –ivh WALinuxAgent-1.0-1.noarch.rpm

10.	Run the following commands to deprovision the virtual machine:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

11. Click **Shutdown** in Hyper-V Manager.

### Prepare the Ubunutu 12.04 operating system ###

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3. Update the operating system to the latest kernel by running the following commands:

		apt-get update
		apt-get install linux-image-virtual
		apt-get install linux-headers-virtual

4. Disable the legacy ATA driver by adding the following to the kernel command line in /boot/grub/grub.cfg: 

		ata_piix.disable_driver

	**Note:** this kernel option was only recently added by  Canonical to its kernel tree and might not have been released by the time you are attempting this. You can put the following to the kernel command line in /boot/grub/grub.cfg: reserve=0x1f0, 0x8. (This option reserves this I/O region and prevents ata_piix from loading).

5.	Download the [Windows Azure Linux Agent](http://go.microsoft.com/fwlink/?LinkID=251942&clcid=0x409) and then install it by running the following command:

		rpm –ivh WALinuxAgent-1.0-1.noarch.rpm

6.	Fix the Grub timeout. Ubuntu waits at Grub for user input after a system crash. To prevent this, complete the following steps:

	a) Open the /etc/grub.d/00_header file.

	b) In the function **make_timeout()**, search for **if [“\${recordfail}” = 1 ]; then**

	c) Change the statement below this line to **set timeout=5**.

	d) Run update-grub.

7.	Run the following commands to deprovision the virtual machine:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

8. Click **Shutdown** in Hyper-V Manager.

### Prepare the SUSE Linux Enterprise Server 11 SP2 operating system ###

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3. Update the operating system to the latest kernel.

	**Note:** The SLES kernel update does not currently contain an important fix on the kernel to improve storage performance. It is expected that this fix will be available soon after release. It is recommended that you use an image from the [SUSE Studio gallery]( http://www.susestudio.com) to take advantage of all the functionality in Windows Azure.

4. Disable the legacy ATA driver by completing the following steps:

	a) Create a file named modprobe.d in /etc that contains the text: **install ata_piix  { /sbin/modprobe hv_storvsc 2>&1 || /sbin/modprobe --ignore-install ata_piix; }**

	b) Run mkinitrd.

5.	Disable automatic DVD ROM probing.

6.	Download the [Windows Azure Linux Agent](http://go.microsoft.com/fwlink/?LinkID=251942&clcid=0x409) and then install it by running the following command:

		rpm –ivh WALinuxAgent-1.0-1.noarch.rpm

7.	Run the following commands to deprovision the virtual machine:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

8. Click **Shutdown** in Hyper-V Manager.

### Prepare the OpenSuse 12.1 operating system ###

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3. Update the operating system to the latest kernel.

	**Note:** The SLES kernel update does not currently contain an important fix on the kernel to improve storage performance. It is expected that this fix will be available soon after release. It is recommended that you use an image from the [SUSE Studio gallery]( http://www.susestudio.com) to take advantage of all the functionality in Windows Azure.

4. Disable the legacy ATA driver by adding **reserve=0x1f0, 0x8** to the kernel command line in **/boot/grub/menu.lst**.

5.	Download the [Windows Azure Linux Agent](http://go.microsoft.com/fwlink/?LinkID=251942&clcid=0x409) and then install it by running the following command:

		rpm –ivh WALinuxAgent-1.0-1.noarch.rpm

6.	Run the following commands to deprovision the virtual machine:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

7. Click **Shutdown** in Hyper-V Manager.

## <a id="upload"> </a>Step 5: Upload the image to Windows Azure ##

To upload an image contained in a VHD file to Windows Azure, you must:

1.	Create and install a management certificate
2.	Obtain the thumbprint of the certificate and the subscription ID
3.	Set the connection
4.	Upload the VHD file

### Create and install the management certificate ###

You need a management certificate uploaded to Windows Azure before you can upload a VHD.  For more information about creating certificates, see [Create Management Certificates for Linux](http://go.microsoft.com/fwlink/?LinkID=253693&clcid=0x409).

### Obtain the thumbprint of the certificate and the subscription ID ###

You need the thumbprint of the management certificate that you added and you need the subscription ID to be able to upload the VHD file to Windows Azure.

1.	In the Previous Management Portal, click **Hosted Services, Storage Accounts & CDN**, and then click **Management Certificates**.

2.	In the center pane, click your certificate, and then record the thumbprint from the **Properties** pane by copying and pasting it to a location where you can retrieve it later.

You also need the ID of your subscription to upload the VHD file.

1.	In the Previous Management Portal, click **Hosted Services, Storage Accounts & CDN**, and then click **Hosted Services**.

2.	In the center pane, select your subscription, and then record the subscription ID from the **Properties** pane by copying and pasting it to a location where you can retrieve it later.

### Use the Linux command-line tool to upload the image ###

You can upload an image by using the following command:

		Azure vm image create --location <Location of the data center> --OS Linux <Sourcepath to the vhd>

### Use the CSUpload command-line tool to upload the image ###

You must set the connection string that is used to access the subscription. The CSUpload Command-Line Tool is used to set the connection string that is used. For more information, see [CSUpload Command-Line Tool](http://msdn.microsoft.com/en-us/library/gg466228.aspx).

1. Open a Windows Azure SDK Command Prompt window as an administrator.

2. Set the connection string by using the following command and replacing **Subscriptionid** and **CertThumbprint** with the values that you obtained earlier:

		csupload Set-Connection "SubscriptionID=<Subscriptionid>;CertificateThumbprint=<Thumbprint>;ServiceManagementEndpoint=https://management-preview.core.windows-int.net"

After the connection string is set, you use the CSUpload command-line tool to upload a VHD file to the Image Gallery in Windows Azure.

1. Use the Windows Azure SDK Command Prompt window that you opened to set the connection string.

2. Set the connection string by using the following command and replacing **Subscriptionid** and **CertThumbprint** with the values that you obtained earlier:

		csupload Add-PersistentVMImage –Destination "<BlobStorageURL>/<YourImagesFolder>/<VHDName>" -Label <VHDName> -LiteralPath <PathToVHDFile> -OS Windows

	Where **BlobStorageURL** is the URL for the storage account that you created earlier. You can place the VHD file anywhere within your Blog storage. **YourImagesFolder** is the container within blob storage where you want to store your images. **VHDName** is the label that appears in the Management Portal to identify the VHD. **PathToVHDFile** is the full path and name of the VHD file.

[Step 1: Install the Hyper-V role on your server]: #hyperv
[Step 2: Create the image]: #createimage
[Step 3: Create a storage account in Windows Azure]: #createstorage
[Step 4: Prepare the image to be uploaded]: #prepimage
[Step 5: Upload the image to Windows Azure]: #upload