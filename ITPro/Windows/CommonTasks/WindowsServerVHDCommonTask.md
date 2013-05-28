<properties linkid="manage-windows-common-task-upload-vhd" urlDisplayName="Upload a VHD" pageTitle="Create and upload a Windows Server VHD to Windows Azure" metaKeywords="Azure VHD, uploading VHD" metaDescription="Learn how to create and upload a virtual hard disk (VHD) in Windows Azure that has the Windows Server operating system." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="kathydav" editor="tysonn" manager="jeffreyg" />

<div chunk="../chunks/windows-left-nav.md" />

#Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System #

A virtual machine in Windows Azure runs the operating system that you choose when you create the virtual machine. Windows Azure stores a virtual machine's operating system in a virtual hard disk in VHD format (a .vhd file). A VHD of an operating system that has been prepared for duplication is called an image. This article shows you how to create your own image by uploading a .vhd file with an operating system you've installed and generalized. For more information about disks and images in Windows Azure, see [Manage Disks and Images](http://msdn.microsoft.com/en-us/library/windowsazure/jj672979.aspx).

**Note**: When you create a virtual machine, you can customize the operating system settings to facilitate running your application. The configuration that you set is stored on disk for that virtual machine. For instructions, see [How to Create a Custom Virtual Machine](/en-us/manage/windows/how-to-guides/custom-create-a-vm/).

##Prerequisites##
This article assumes that you have the following items:

**A management certificate** - You have created a management certificate for the subscription for which you want to upload a VHD, and exported the certificate to a .cer file. For more information about creating certificates, see [Create a Management Certificate for Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/gg551722.aspx). 

**A supported Windows operating system stored in a .vhd file** - You have installed a supported Windows Server operating system to a virtual hard disk. Multiple tools exist to create .vhd files. You can use a virtualization solutions such as Hyper-V to create the .vhd file and install the operating system. For instructions, see [Install the Hyper-V Role and Configure a Virtual Machine](http://technet.microsoft.com/en-us/library/hh846766.aspx).

**Important**: The newer VHDX format is not supported in Windows Azure. You can convert the disk to VHD format using Hyper-V Manager or the convert-vhd cmdlet.     
 
- **Window Server operating system media.** This task requires an .iso file that contains the Windows Server operating system. The following Windows Server versions are supported:
<P>
  <TABLE BORDER="1" WIDTH="600">
  <TR BGCOLOR="#E9E7E7">
    <TH>OS</TH>
    <TH>SKU</TH>
    <TH>Service Pack</TH>
    <TH>Architecture</TH>
  </TR>
  <TR>
    <TD>Windows Server 2012</TD>
    <TD>All editions</TD>
    <TD>N/A</TD>
    <TD>x64</TD>
  </TR>
  <TR>
    <TD>Windows Server 2008 R2</TD>
    <TD>All editions</TD>
    <TD>SP1</TD>
    <TD>x64</TD>
  </TR>
  </TABLE>
</P>

- The [Add-AzureVHD](http://msdn.microsoft.com/en-us/library/windowsazure/dn205185.aspx) cmdlet, which is part of the Windows Azure PowerShell module. To download the module, see [Windows Azure Downloads](/en-us/develop/downloads/).


This task includes the following steps:

- [Step 1: Prepare the image to be uploaded] []
- [Step 2: Create a storage account in Windows Azure] []
- [Step 3: Prepare the connection to Windows Azure] []
- [Step 4: Upload the .vhd file] []

## <a id="prepimage"> </a>Step 1: Prepare the image to be uploaded ##

Before the image can be uploaded to Windows Azure, it must be generalized by using the Sysprep command. For more information about using Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/en-us/library/bb457073.aspx).

In the virtual machine that you just created, complete the following procedure:

1. Log in to the operating system.

2. Open a Command Prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.

	![Open Command Prompt window] (../media/sysprepcommand.png)

3.	The **System Preparation Tool** dialog box appears.

	![Start Sysprep] (../media/sysprepgeneral.png)

4. In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked.

5. In **Shutdown Options**, select **Shutdown**.

6. Click **OK**.


## <a id="createstorage"> </a>Step 2: Create a storage account in Windows Azure ##

A storage account represents the highest level of the namespace for accessing the storage services and is associated with your Windows Azure subscription. You need a storage account in Windows Azure to upload a .vhd file to Windows Azure that can be used for creating a virtual machine. You can use the Windows Azure Management Portal to create a storage account.

1. Sign in to the Windows Azure Management Portal.

2. On the command bar, click **New**.

3. Click **Storage Account**, and then click **Quick Create**.

	![Quick create a storage account] (../media/Storage-quick-create.png)

4. Fill out the fields as follows:

	![Enter storage account details] (../media/Storage-create-account.png)

- Under **URL**, type a subdomain name to use in the URL for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This name becomes the host name within the URL that is used to address Blob, Queue, or Table resources for the subscription.
	
- Choose the location or affinity group for the storage account. By specifying an affinity group, you can co-locate your cloud services in the same data center with your storage.
 
- Decide whether to use geo-replication for the storage account. Geo-replication is turned on by default. This option replicates your data to a secondary location, at no cost to you, so that your storage fails over to a secondary location if a major failure occurs that can't be handled in the primary location. The secondary location is assigned automatically, and can't be changed. If legal requirements or organizational policy requires tighter control over the location of your cloud-based storage, you can turn off geo-replication. However, be aware that if you later turn on geo-replication, you will be charged a one-time data transfer fee to replicate your existing data to the secondary location. Storage services without geo-replication are offered at a discount.

5. Click **Create Storage Account**.

	The account now appears under **Storage Accounts**.

	![Storage account successfully created] (../media/Storagenewaccount.png)


## <a id="PrepAzure"> </a>Step 3: Prepare the connection to Windows Azure ##

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


## <a id="upload"> </a>Step 4: Upload the .vhd file ##

When you upload the .vhd file, you can place the .vhd file anywhere within your blob storage. In the following command examples, **BlobStorageURL** is the URL for the storage account that you created in Step 2, **YourImagesFolder** is the container within blob storage where you want to store your images. **VHDName** is the label that appears in the Management Portal to identify the virtual hard disk. **PathToVHDFile** is the full path and name of the .vhd file. 

1. From the Windows Azure PowerShell window you used in the previous step, type:

	`Add-AzureVhd -Destination <BlobStorageURL>/<YourImagesFolder>/<VHDName> -LocalFilePath <PathToVHDFile>`

	For more information, see [Add-AzureVhd](http://msdn.microsoft.com/en-us/library/windowsazure/dn205185.aspx).

##Add the Image to Your List of Custom Images ##
After you upload the .vhd, you add it as an image to the list of custom images associated with your subscription.

1. From the Management Portal, under **All Items**, click **Virtual Machines**.

2. Under Virtual Machines, click **Images**, and then click **Create**.

3. In **Create an image from a VHD**, specify a name and the URL to the .vhd that you uploaded.

4. Check **I have run Sysprep on the virtual machine associated with this VHD** to acknowledge that you generalized the operating system in Step 2, and then click **OK**. 


## Next Steps ##
After the image is available in your list, you can use it to create virtual machines. For instructions, see [Create a Virtual Machine Running Windows Server](../Tutorials/CreateVirtualMachineWindowsTutorial.md).

[Step 1: Prepare the image to be uploaded]: #prepimage
[Step 2: Create a storage account in Windows Azure]: #createstorage
[Step 3: Prepare the connection to Windows Azure]: #prepAzure
[Step 4: Upload the .vhd file]: #upload




