<properties linkid="manage-linux-common-task-upload-vhd" urlDisplayName="Upload a VHD" pageTitle="Create and upload a Linux VHD in Windows Azure" metaKeywords="Azure VHD, uploading Linux VHD" metaDescription="Learn to create and upload a Windows Azure virtual hard disk (VHD) that has the Linux operating system." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="kathydav" editor="tysonn" manager="jeffreyg"/>

<div chunk="../chunks/linux-left-nav.md" />

# Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System 

A virtual machine in Windows Azure runs the operating system that you choose when you create the virtual machine. Windows Azure stores a virtual machine's operating system in a virtual hard disk in VHD format (a .vhd file). A VHD of an operating system that has been prepared for duplication is called an image. This article shows you how to create your own image by uploading a .vhd file with an operating system you've installed and generalized. For more information about disks and images in Windows Azure, see [Manage Disks and Images](http://msdn.microsoft.com/en-us/library/windowsazure/jj672979.aspx).

**Note**: When you create a virtual machine, you can customize the operating system settings to facilitate running your application. The configuration that you set is stored on disk for that virtual machine. For instructions, see [How to Create a Custom Virtual Machine](/en-us/manage/windows/how-to-guides/custom-create-a-vm/).

##Prerequisites##
This article assumes that you have the following items:

- **A management certificate** - You have created a management certificate for the subscription for which you want to upload a VHD, and exported the certificate to a .cer file. For more information about creating certificates, see [Create a Management Certificate for Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg551722.aspx). 

- **Linux operating system installed in a .vhd file.**  - You have installed a supported Linux operating system to a virtual hard disk. Multiple tools exist to create .vhd files. You can use a virtualization solutions such as Hyper-V to create the .vhd file and install the operating system. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/en-us/library/hh846766.aspx). 

	**Important**: The newer VHDX format is not supported in Windows Azure. You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.

	For a list of endorsed distributions, see [Linux on Windows Azure-Endorsed Distributions](../otherresources/linux-on-endorsed-distributions.md). Note: This article includes a section at the end with [Information for Non Endorsed Distributions][].

- **Linux Azure command-line tool.** If you are using a Linux operating system to create your image, you use this tool to upload the VHD file. To download the tool, see [Windows Azure Command-Line Tools for Linux and Mac](http://go.microsoft.com/fwlink/?LinkID=253691&clcid=0x409).

- **Add-AzureVhd cmdlet**, which is part of the Windows Azure PowerShell module. To download the module, see [Windows Azure Downloads](/en-us/develop/downloads/). For reference information, see [Add-AzureVhd](http://msdn.microsoft.com/en-us/library/windowsazure/dn205185.aspx).

For all distributions note the following:

The Windows Azure Linux Agent (Waagent) is not compatible with NetworkManager. Networking configuration should use the ifcfg-eth0 file and should be controllable via the ifup/ifdown scripts. Waagent will refuse to install if the NetworkManager package is detected.

NUMA is not supported because of a bug in Linux kernel versions below 2.6.37. The installation of waagent will automatically disable NUMA in the GRUB configuration for the Linux kernel command line.

The Windows Azure Linux Agent requires that the python-pyasn1 package is installed.

It is recommended that you do not create a SWAP partition at installation time. You may configure SWAP space by using the Windows Azure Linux Agent. It is also not recommended to use the mainstream Linux kernel with a Windows Azure virtual machine without the patch available at the [Microsoft web site](http://go.microsoft.com/fwlink/?LinkID=253692&clcid=0x409).

All of the VHDs must have sizes that are multiples of 1 MB.

This task includes the following steps:

This task includes the following steps:

- [Step 1: Prepare the image to be uploaded] []
- [Step 2: Create a storage account in Windows Azure] []
- [Step 3: Prepare the connection to Windows Azure] []
- [Step 4: Upload the image to Windows Azure] []

## <a id="prepimage"> </a>Step 1: Prepare the image to be uploaded ##

### Prepare the CentOS 6.2 and CentOS 6.3 operating system ###

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
	
	a) Obtain the .iso file that contains the drivers for the Linux Integration Services from [Download Center](http://www.microsoft.com/en-us/download/details.aspx?id=34603).

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

		sudo yum install python-pyasn1

9. Replace their /etc/yum.repos.d/CentOS-Base.repo file with the following text
> [openlogic]
> name=CentOS-$releasever - openlogic packages for $basearch
> baseurl=http://olcentgbl.trafficmanager.net/openlogic/$releasever/openlogic/$basearch/
> enabled=1
> gpgcheck=0
> 
> [base]
> name=CentOS-$releasever - Base
> baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/os/$basearch/
> gpgcheck=1
> gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
>  
> \#released updates
> [updates]
> name=CentOS-$releasever - Updates
> baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/updates/$basearch/
> gpgcheck=1
> gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
>  
> \#additional packages that may be useful
> [extras]
> name=CentOS-$releasever - Extras
> baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/extras/$basearch/
> gpgcheck=1
> gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
>  
> \#additional packages that extend functionality of existing packages
> [centosplus]
> name=CentOS-$releasever - Plus
> baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/centosplus/$basearch/
> gpgcheck=1
> enabled=0
> gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6
>  
> \#contrib - packages by Centos Users
> [contrib]
> name=CentOS-$releasever - Contrib
> baseurl=http://olcentgbl.trafficmanager.net/centos/$releasever/contrib/$basearch/
> gpgcheck=1
> enabled=0
> gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-6

10.	Add the following lines to /etc/yum.conf

-	http_caching=packages

-	exclude=kernel*
11. Disable the yum module "fastestmirror" by editing the file
"/etc/yum/pluginconf.d/fastestmirror.conf" and under [main]

-	set enabled=0  
12.	Clear the current Yum metadata
You need to clear your current yum metadata:
-	yum clean all


13. Update a Running VM's Kernel by running

-	For CentOS 6.2 do:
		-	sudo yum remove kernel-firmware
		-	sudo yum --disableexcludes=main install kernel-2.6.32-279.14.1.el6.openlogic.x86_64 kernel-firmware-2.6.32-279.14.1.el6.openlogic.x86_64

-	For CentOS 6.3 do:
		-		yum install kernel-2.6.32-279.14.1.el6.openlogic.x86_64.rpm


14. Ensure that you have modified the kernel boot line to include lines for 

-	console=ttyS0 ( this will enable serial console output)

-	rootdelay=300

15. Ensure that all SCSI devices mounted in your kernel include an I/O timeout of  300 seconds or more.

16.	Comment out Defaults targetpw in /etc/sudoers
17.	SSH Server should be included by default
18.	No SWAP on Host OS DISK should be created 
	SWAP if needed can be requested for creation on the local resource disk by the Linux Agent. You may modify /etc/waagent.conf appropriately.
19. Install the Windows Azure Linux Agent by running
-	yum install WALinuxAgent-1.2-1
20.	Run the following commands to deprovision the virtual machine:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

21. Click **Shutdown** in Hyper-V Manager.

### Prepare the Ubunutu 12.04 and 12.10 operating system ###

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3.	Replace the current repositories in your image to use the azure repositories that carry the kernel and agent package that you will need to upgrade the VM.

	The steps for this are different depending on the distribution that you are using.

	Ubuntu 12.04 and 12.04.1:
	-	sudo sed -i “s,archive.ubuntu.com,azure.archive.ubuntu.com,g” /etc/apt/sources.list
	-	sudo apt-add-repository 'http://archive.canonical.com/ubuntu precise-backports main'
	-	sudo apt-get update

	Ubuntu 12.10:
	-	sudo sed -i “s,archive.ubuntu.com,azure.archive.ubuntu.com,g” /etc/apt/sources.list
	-	sudo apt-add-repository 'http://archive.canonical.com/ubuntu quantal-backports main'
	-	sudo apt-get update


4. Update the operating system to the latest kernel by running the following commands : 

		Ubuntu 12.04 and 12.04.1:
	-	sudo apt-get update
	-	sudo apt-get install hv-kvp-daemon-init linux-backports-modules-hv-precise-virtual
	-	(recommended) sudo apt-get dist-upgrade
	-	sudo reboot

	Ubuntu 12.10:
	-	sudo apt-get update
	-	sudo apt-get install hv-kvp-daemon-init linux-backports-modules-hv-quantal-virtual
	-	(recommended) sudo apt-get dist-upgrade
	-	sudo reboot


5.	 Install the agent by running the following commands with sudo:

		apt-get update
		apt-get install walinuxagent 

6.	Fix the Grub timeout. Ubuntu waits at Grub for user input after a system crash. To prevent this, complete the following steps:

	a) Open the /etc/grub.d/00_header file.

	b) In the function **make_timeout()**, search for **if [“\${recordfail}” = 1 ]; then**

	c) Change the statement below this line to **set timeout=5**.

	d) Run update-grub.

7. Ensure that you have modified the kernel boot line to include lines for 

-	console=ttyS0 ( this will enable serial console output)

-	rootdelay=300

8. It is recommended that you set /etc/sysconfig/network/dhcp or equivalent  from DHCLIENT_SET_HOSTNAME="yes" to DHCLIENT_SET_HOSTNAME="no"

9. Ensure that all SCSI devices mounted in your kernel include an I/O timeout of  300 seconds or more.
10.	Comment out Defaults targetpw in /etc/sudoers
11.	SSH Server should be included by default
12.	No SWAP on Host OS DISK should be created 
	SWAP if needed can be requested for creation on the local resource disk by the Linux Agent. You may modify /etc/waagent.conf appropriately.
	

13.	Run the following commands to deprovision the virtual machine:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

14. Click **Shutdown** in Hyper-V Manager.

### Prepare the SUSE Linux Enterprise Server 11 SP2 operating system ###

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3. Addd the repository containing the latest agent and the latest kernel
  On the shell, call 'zypper lr'. If this command returns

	 | Alias                        | Name               | Enabled | Refresh
	
	1 | susecloud:SLES11-SP1-Pool    | SLES11-SP1-Pool    | No      | Yes    
	2 | susecloud:SLES11-SP1-Updates | SLES11-SP1-Updates | No      | Yes    
	3 | susecloud:SLES11-SP2-Core    | SLES11-SP2-Core    | No      | Yes    
	4 | susecloud:SLES11-SP2-Updates | SLES11-SP2-Updates | No      | Yes 

		then the repositories are configured as expected, no adjustments are necessary.

 	In case the command returns "No repositories defined. Use the 'zypper addrepo' command to add one or more repositories." then the repositories need to be re-enabled by calling 'suse_register -r'. You    		will get following output:

      Query installed languages failed.(134)  No packages found.
      To complete the registration, provide some additional parameters:

      Personal identification (mandatory) with:
        * E-mail address :    email="me@example.com"


      You can provide these parameters with the '-a' option.
      You can use the '-a' option multiple times.

      Example:

      suse_register -a email="me@example.com"

      To register your product manually, use the following URL:

      https://secure-www.novell.com/center/regsvc-1.0/?lang=POSIX&guid=64f60dc79688491e8bf88527804e06f0&command=interactive


      Information on Novell's Privacy Policy:
      Submit information to help you manage your registered systems.
      http://www.novell.com/company/policies/privacy/textonly.html

   Verify your repositories have been added by calling 'zypper lr', this is the expected output:

	    | Alias                        | Name               | Enabled | Refresh
     
      1 | susecloud:SLES11-SP1-Pool    | SLES11-SP1-Pool    | No      | Yes    
      2 | susecloud:SLES11-SP1-Updates | SLES11-SP1-Updates | No      | Yes    
      3 | susecloud:SLES11-SP2-Core    | SLES11-SP2-Core    | No      | Yes    
      4 | susecloud:SLES11-SP2-Updates | SLES11-SP2-Updates | No      | Yes 

   In case one of the relevant update repositories is not enabled, enable it with following command:

     # zypper mr -e [NUMBER OF REPOSITORY]

   In the above case, the command proper command would be

      # zypper mr -e 1 2 3 4

4. To get the ATA Piix driver, update the kernel to the latest available 
   version:

-	   \# zypper up kernel-default

5. Disable automatic DVD ROM probing.

6. Install the Windows Azure Linux Agent:

-	   Call 'zypper up WALinuxAgent' and you will get a similar message like the following:

      "There is an update candidate for 'WALinuxAgent', but it is from different vendor. 
      Use 'zypper install WALinuxAgent-1.2-1.1.noarch' to install this candidate."

   As the vendor of the package has changed from "Microsoft Corporation" to "SUSE LINUX Products GmbH, 
   Nuernberg, Germany", one has to explicitely install the package as mentioned in the message.

   Note: The version of the WALinuxAgent package might be slightly different.

7. To enable serial console and increase the rootdelay, adjust 
   the kernel command line in the file '/boot/grub/menu.lst' and add the 
   following string to the end of the kernel line:

   >console=ttyS0 rootdelay=300

8.	Ensure that all SCSI devices mounted in your kernel include an I/O timeout of  300 seconds or more (The SUSE agent intallation scripts normally take care of this).

9.	It is recommended that you set /etc/sysconfig/network/dhcp or equivalent  from DHCLIENT_SET_HOSTNAME="yes" to DHCLIENT_SET_HOSTNAME="no"

10.	Comment out Defaults targetpw in /etc/sudoers

11.	SSH Server should be included by default

12.	No SWAP on Host OS DISK should be created 
	SWAP if needed can be requested for creation on the local resource disk by the Linux Agent. You may modify /etc/waagent.conf appropriately.


13.	Run the following commands to deprovision the virtual machine:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

14. Click **Shutdown** in Hyper-V Manager.

### Prepare the openSUSE 12.3 operating system ###

1. In the center pane of Hyper-V Manager, select the virtual machine.

2. Click **Connect** to open the window for the virtual machine.

3. Update the operating system to the latest kernel.

	**Note:** The SLES kernel update does not currently contain an important fix on the kernel to improve storage performance. It is expected that this fix will be available soon after release. It is recommended that you use an image from the [SUSE Studio gallery]( http://www.susestudio.com) to take advantage of all the functionality in Windows Azure.

4. On the shell, call 'zypper lr'. If this command returns

         | Alias | Name | Enabled | Refresh
      
      1 | openSUSE_12.3_OSS     | openSUSE_12.3_OSS     | Yes     | Yes    
      2 | openSUSE_12.3_Updates | openSUSE_12.3_Updates | Yes     | Yes

   then the repositories are configured as expected, no adjustments are necessary.

   In case the command returns "No repositories defined. Use the 'zypper addrepo' command to add one 
   or more repositories." then the repositories need to be re-enabled:

      # zypper ar -f http://download.opensuse.org/distribution/12.3/repo/oss openSUSE_12.3_OSS
      # zypper ar -f http://download.opensuse.org/update/12.3 openSUSE_12.3_Updates

   Verify your repositories have been added by calling 'zypper lr', this is the expected output:

       | Alias | Name | Enabled | Refresh
     
      1 | openSUSE_12.3_OSS     | openSUSE_12.3_OSS     | Yes     | Yes    
      2 | openSUSE_12.3_Updates | openSUSE_12.3_Updates | Yes     | Yes

   In case one of the relevant update repositories is not enabled, enable it with following command:

      # zypper mr -e [NUMBER OF REPOSITORY]


5.	To get the ATA Piix driver, update the kernel to the latest available 
   version:

	   \# zypper in perl

   \# zypper up kernel-default

   Note: It is necessary to install the package 'perl' before updating the kernel, because there's a missing dependency in openSUSE 12.3.


7.	Disable automatic DVD ROM probing.

8.	Install the Windows Azure Linux Agent:

	First, add the repository containing the new WALinuxAgent:

      # zypper ar -f -r http://download.opensuse.org/repositories/Cloud:/Tools/openSUSE_12.3/Cloud:Tools.repo

   Then, call 'zypper up WALinuxAgent' and you will get a similar message like the following:

      "There is an update candidate for 'WALinuxAgent', but it is from different vendor. 
      Use 'zypper install WALinuxAgent-1.2-1.1.noarch' to install this candidate."

   As the vendor of the package has changed from "Microsoft Corporation" to "obs://build.opensuse.org/Cloud",
   one has to explicitely install the package as mentioned in the message.

   Note: The version of the WALinuxAgent package might be slightly different.

9.	To enable serial console and increase the rootdelay, adjust 
   the kernel command line in the file '/boot/grub/menu.lst' and add the 
   following string to the end of the kernel line:

   console=ttyS0 rootdelay=300

 	In the same file, remove the following part from the kernel command line:

      libata.atapi_enabled=0 reserve=0x1f0,0x8

10.	Ensure that all SCSI devices mounted in your kernel include an I/O timeout of  300 seconds or more (The SUSE agent intallation scripts normally take care of this).

11.	It is recommended that you set /etc/sysconfig/network/dhcp or equivalent  from DHCLIENT_SET_HOSTNAME="yes" to DHCLIENT_SET_HOSTNAME="no"

12.	Comment out Defaults targetpw in /etc/sudoers
13.	SSH Server should be included by default
14.	No SWAP on Host OS DISK should be created 
	SWAP if needed can be requested for creation on the local resource disk by the Linux Agent. You may modify /etc/waagent.conf appropriately.

15.	Run the following commands to deprovision the virtual machine:

		waagent –force –deprovision
		export HISTSIZE=0
		logout

16. Click **Shutdown** in Hyper-V Manager.


## <a id="createstorage"> </a>Step 2: Create a storage account in Windows Azure ##

A storage account represents the highest level of the namespace for accessing the storage services and is associated with your Windows Azure subscription. You need a storage account in Windows Azure to upload a .vhd file to Windows Azure that can be used for creating a virtual machine. You can create a storage account by using the Windows Azure Management Portal.

1. Sign in to the Windows Azure Management Portal.

2. On the command bar, click **New**.

	![Create storage account] (../media/create.png)

3. Click **Storage Account**, and then click **Quick Create**.

	![Quick create a storage account] (../media/storage-quick-create.png)

4. Fill out the fields as follows:

	![Enter storage account details] (../media/storage-create-account.png)

- Under **URL**, type a subdomain name to use in the URL for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This name becomes the host name within the URL that is used to address Blob, Queue, or Table resources for the subscription.
	
- Choose the location or affinity group for the storage account. By specifying an affinity group, you can co-locate your cloud services in the same data center with your storage.
 
- Decide whether to use geo-replication for the storage account. Geo-replication is turned on by default. This option replicates your data to a secondary location, at no cost to you, so that your storage fails over to a secondary location if a major failure occurs that can't be handled in the primary location. The secondary location is assigned automatically, and can't be changed. If legal requirements or organizational policy requires tighter control over the location of your cloud-based storage, you can turn off geo-replication. However, be aware that if you later turn on geo-replication, you will be charged a one-time data transfer fee to replicate your existing data to the secondary location. Storage services without geo-replication are offered at a discount.

5. Click **Create Storage Account**.

	The account is now listed under **Storage Accounts**.

	![Storage account successfully created] (../media/Storagenewaccount.png)


## <a id="#connect"> </a>Step 3: Prepare the connection to Windows Azure ##

Before you can upload a .vhd file, you need to establish a secure connection between your computer and your subscription in Windows Azure. 

1. Open a Windows Azure PowerShell window.

2. Type: 

	`Get-AzurePublishSettingsFile`

	This command opens a browser window and automatically downloads a .publishsettings file that contains information and a certificate for your Windows Azure subscription. 

3. Save the .publishsettings file. 

4. Type:

	`Import-AzurePublishSettingsFile <PathToFile>`

	Where `<PathToFile>` is the full path to the .publishsettings file. 

	For more information, see [Get Started with Windows Azure Cmdlets](http://msdn.microsoft.com/en-us/library/windowsazure/jj554332.aspx) 


## <a id="upload"> </a>Step 4: Upload the image to Windows Azure ##

When you upload the .vhd file, you can place the .vhd file anywhere within your blob storage. In the following command examples, **BlobStorageURL** is the URL for the storage account that you created in Step 2, **YourImagesFolder** is the container within blob storage where you want to store your images. **VHDName** is the label that appears in the Management Portal to identify the virtual hard disk. **PathToVHDFile** is the full path and name of the .vhd file. 

Do one of the following:

- From the Windows Azure PowerShell window you used in the previous step, type:

	`Add-AzureVhd -Destination <BlobStorageURL>/<YourImagesFolder>/<VHDName> -LocalFilePath <PathToVHDFile>`

	For more information, see [Add-AzureVhd](http://msdn.microsoft.com/en-us/library/windowsazure/dn205185.aspx).

- Use the Linux command-line tool to upload the image. You can upload an image by using the following command:

		Azure vm image create <image name> --location <Location of the data center> --OS Linux <Sourcepath to the vhd>

## <a id="nonendorsed"> </a>Information for Non Endorsed Distributions ##
In essence all distributions running on Windows Azure will need to meet the following prerequisites to have a chance to properly run in the platform. 

This list is by no means comprehensive as every distribution is different; and it is quite possible that even if you meet all the criteria below you will still need to significantly tweak your image to ensure that it properly runs on top of the platform .

 It is for this reason that we recommend that you start with one of our [partners endorsed images](https://www.windowsazure.com/en-us/manage/linux/other-resources/endorsed-distributions/).

The list below replaces step 2 of the process to create your own VHD:

1.	You will need to ensure that you are running a kernel that either incorporates the latest LIS drivers for Hyper V or that you have successfully compiled them ( They have been Open Sourced). The Drivers can be found [at this location](http://go.microsoft.com/fwlink/p/?LinkID=254263&clcid=0x409)

2.	Your kernel should also include the latest version of the ATA PiiX driver that is used to to provision the iamges and has the fixes committed to the kernel with commit cd006086fa5d91414d8ff9ff2b78fbb593878e3c Date:   Fri May 4 22:15:11 2012 +0100   ata_piix: defer disks to the Hyper-V drivers by default

3.	Your compressed intird should be less than 40 MB (* we are continuously workign to increase this number so it might be outdated by now)

4.	You should add the following lines to your Kernel Boot

	-	console=ttyS0 rootdelay=300

5.	It is recommended that you set /etc/sysconfig/network/dhcp or equivalent  from DHCLIENT_SET_HOSTNAME="yes" to DHCLIENT_SET_HOSTNAME="no"

6.	You should Ensure that all SCSI devices mounted in your kernel include an I/O timeout of  300 seconds or more.

7.	You will need to install the Agent following the steps in the [Agent Guide](https://www.windowsazure.com/en-us/manage/linux/how-to-guides/linux-agent-guide/). The Agent has been released under the Apache 2 license and you can get the latest bits at the [Agent GitHub Location](http://go.microsoft.com/fwlink/p/?LinkID=250998&clcid=0x409)
8.	Comment out Defaults targetpw in /etc/sudoers

9.	SSH Server should be included by default

10.	No SWAP on Host OS DISK should be created 
	SWAP if needed can be requested for creation on the local resource disk by the Linux Agent. You may modify /etc/waagent.conf appropriately.

11.	You will need to run the following commands to deprovision the virtual machine:

        waagent –force –deprovision
        export HISTSIZE=0
        logout

12.	You will then need to shut down the virtual machine and proceed with the upload.


[Step 1: Prepare the image to be uploaded]: #prepimage
[Step 2: Create a storage account in Windows Azure]: #createstorage
[Step 3: Prepare the connection to Windows Azure]: #connect
[Step 4: Upload the image to Windows Azure]: #upload
[Information for Non Endorsed Distributions]: #nonendorsed