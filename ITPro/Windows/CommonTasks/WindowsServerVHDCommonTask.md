<properties linkid="manage-windows-common-task-upload-vhd" urlDisplayName="Upload a VHD" pageTitle="Create and upload a Windows Server VHD to Windows Azure" metaKeywords="Azure VHD, uploading VHD" metaDescription="Learn how to create and upload a virtual hard disk (VHD) in Windows Azure that has the Windows Server operating system." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="kathydav" editor="tysonn" manager="jeffreyg" />

<div chunk="../chunks/windows-left-nav.md" />

#Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System #

A virtual machine in Windows Azure runs the operating system that you choose when you create the virtual machine. Windows Azure stores a virtual machine's operating system in a virtual hard disk in VHD format (a .vhd file). A VHD of an operating system is called an image. This article shows you how to create your own image by uploading a .vhd file with an operating system you've installed and generalized. For more information about disks and images in Windows Azure, see [Manage Disks and Images](http://msdn.microsoft.com/en-us/library/windowsazure/jj672979.aspx).

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


- **The Add-AzureVHD cmdlet or the CSUpload command-line tool.** You use one of these tools to upload the .vhd file. 
- The [Add-AzureVHD](http://msdn.microsoft.com/en-us/library/windowsazure/dn205185.aspx) cmdlet is part of the Windows Azure PowerShell module. 

- The CSUpload tool is a part of the Windows Azure SDK. You must use the tools available in Windows Azure SDK June 2012 or later to upload .vhds to Windows Azure. 

To download the SDK or the module, see [Windows Azure Downloads](/en-us/develop/downloads/).


This task includes the following steps:

- [Step 2: Prepare the image to be uploaded] []
- [Step 2: Create a storage account in Windows Azure] []
- [Step 3: Upload the image to Windows Azure] []

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

	![Create storage account] (../media/create.png)

3. Click **Storage Account**, and then click **Quick Create**.

	![Quick create a storage account] (../media/createnewstorage.png)

	The **Create a New Storage Account** dialog box appears.

	![Enter storage account details] (../media/storageinfo.png)

4. Under URL, type a subdomain name to use in the URL for the storage account. The entry can contain from 3-24 lowercase letters and numbers. This name becomes the host name within the URL that is used to address Blob, Queue, or Table resources for the subscription.

5. Choose the region or affinity group for the storage account. By specifying an affinity group, you can co-locate your cloud services in the same data center with your storage.

6. Decide whether to use geo-replication for the storage account. Geo-replication is turned on by default. This option replicates your data to a secondary location, at no cost to you, so that your storage fails over to a secondary location if a major failure occurs that can't be handled in the primary location. The secondary location is assigned automatically, and can't be changed. If legal requirements or organizational policy requires tighter control over the location of your cloud-based storage, you can turn off geo-replication. However, be aware that if you later turn on geo-replication, you will be charged a one-time data transfer fee to replicate your existing data to the secondary location. Storage services without geo-replication are offered at a discount.

7. Click **Create a Storage Account**.

	The account is now listed under **Storage Accounts**.

	![Storage account successfully created] (../media/storagesuccess.png)


## <a id="upload"> </a>Step 3: Upload the image to Windows Azure ##

Uploading a.vhd file to Windows Azure consists of the following steps:

1.	Upload the management certificate to your subscription.
2.	Obtain the thumbprint of the certificate and the subscription ID.
3.	Set the connection string.
4.	Upload the .vhd file.

### Upload the management certificate ###

This step assumes you have exported the certificate to a .cer file so  it can be uploaded to your subscription in Windows Azure. 

1. Sign in to the Windows Azure Management Portal.

2. In the navigation pane, click **Settings**.

3. Under **Management Certificates**, click **Upload a management certificate**.

4. In **Upload a management certificate**, browse to the certificate file, and then click **OK**.

### Obtain the thumbprint of the certificate and the subscription ID ###

You need the thumbprint of the management certificate that you added and you need the subscription ID to be able to upload the .vhd file to Windows Azure.

1. From the Management Portal, click **Settings**.

2. Under **Management Certificates**, click your certificate, and then record the thumbprint from the **Properties** pane by copying and pasting it to a location where you can retrieve it later.

You also need the ID of your subscription to upload the .vhd file.

1. From the Management Portal, click **All Items**.

2. In the center pane, under **Subscription**, copy the subscription and paste it to a location where you can retrieve it later.

### Set the connection string###

Next, set the connection string that is used to access the subscription. The CSUpload Command-Line Tool is used to set the connection string that is used. For more information, see [CSUpload Command-Line Tool](http://msdn.microsoft.com/en-us/library/windowsazure/gg466228.aspx).

1. Open a Windows Azure SDK Command Prompt window as an administrator.

2. Set the connection string by using the following command and replacing **Subscriptionid** and **CertThumbprint** with the values that you obtained earlier:

	`csupload Set-Connection "SubscriptionID=<Subscriptionid>;
	CertificateThumbprint=<Thumbprint>;
	ServiceManagementEndpoint=https:/management.core.windows.net"`

	After you run the command, leave the window open for use in the next step.

### Upload the .vhd file ###

For this task, you use either Add-AzureVhd or CSUpload to upload the .vhd file.

**Using Add-AzureVhd**  


**Using CSUpload**

1. Use the same Command Prompt window that you opened to set the connection string.

2. Upload the .vhd file by using the following command and replacing **Subscriptionid** and **CertThumbprint** with the values that you obtained earlier and where **BlobStorageURL** is the URL for the storage account that you created earlier:

	`csupload Add-PersistentVMImage -Destination "<BlobStorageURL>/<YourImagesFolder>/<VHDName>" -Label <VHDName> -LiteralPath <PathToVHDFile> -OS Windows`

You can place the .vhd file anywhere within your blob storage. **YourImagesFolder** is the container within blob storage where you want to store your images. **VHDName** is the label that appears in the Management Portal to identify the virtual hard disk. **PathToVHDFile** is the full path and name of the .vhd file.

##Add the Image to Your List of Custom Images ##
After you upload the .vhd, you add it as an image to the list of custom images associated with your subscription.


## Next Steps ##
After the image is available in your list, you can use it to create virtual machines. For instructions, see [link to custom create].

[Step 1: t the image to be uploaded]: #prepimage
[Step 2: Create a storage account in Windows Azure]: #createstorage
[Step 3: Upload the image to Windows Azure]: #upload




