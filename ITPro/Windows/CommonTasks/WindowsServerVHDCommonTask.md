#Creating and Uploading a Virtual Hard Disk that Contains the Windows Server Operating System #

<div chunk="../../shared/chunks/disclaimer.md" />

A virtual machine that you create in Windows Azure runs the operating system that you choose from the supported operating system versions. You can customize the operating system settings of the virtual machine to facilitate running your application. The configuration that you set is stored on disk. You create a virtual machine in Windows Azure by using a virtual hard disk (VHD) file. You can choose to create a virtual machine by using a VHD file that is supplied for you in the Image Gallery, or you can choose to create your own image and upload it to Windows Azure in a VHD file.

The following resources must be available to complete this task:

- **Server running the Windows Server operating system.** This task depends on using the Hyper-V Manager that is a part of the Hyper-V role in the Windows Server operating system.
- **Window Server operating system media.** Before you start this task, you must make sure that you have access to an .ISO file that contains the Windows Server operating system. The following are supported Windows Server distributions:
<P>
  <TABLE BORDER="1" WIDTH="600">
  <TR BGCOLOR="#E9E7E7">
    <TH>OS</TH>
    <TH>SKU</TH>
    <TH>Service Pack</TH>
    <TH>Architecture</TH>
  </TR>
  <TR>
    <TD>Windows Server 2012 RC (en\_us)</TD>
    <TD>All editions</TD>
    <TD>N/A</TD>
    <TD>x64</TD>
  </TR>
  <TR>
    <TD>Windows Server 2008 R2(en\_us)</TD>
    <TD>All editions</TD>
    <TD>SP1</TD>
    <TD>x64</TD>
  </TR>
  </TABLE>
</P>
- **CSUpload command-line tool.** This tool is a part of the Windows Azure SDK. You use this tool to set the connection to Windows Azure and upload the VHD file. To download the SDK and the tools, see [Windows Azure Downloads](../../downloads/).

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

4. On the **Connect Virtual Hard Disk** page, select **Create a virtual hard disk**. Provide the following information, and then click **Next**:

	- **Name** - the name of the .vhd file. This is the file that you upload to Windows Azure.
	- **Location** - the folder where the .vhd file is located. You should store the VHD file in a secure location.
	- **Size** - the size of the virtual machine. You must ensure that the size of the virtual machine is one of the values in the following table and that the size corresponds to the size that you choose for the virtual machine when you create it in the Windows Azure Management Portal.
  
5. On the **Installation Options** page, select **Install an operating system from a boot CD/DVD –ROM media**, and then choose the method that is appropriate for your installation media.

	![Choose the installation media] (../media/windowschoosemedia.png)

6. Finish the wizard to create the virtual machine.

After the virtual machine is created it is not started by default. You must start the virtual machine to complete the installation of the operating system.

1. In the center pane of Hyper-V Manager, select the virtual machine that you created in the previous procedure.

2. In the **Actions** pane, click **Start**.

	![Start the virtual machine] (../media/start.png)

3. Click **Connect** to open the window for the virtual machine.

	![Connect to the virtual machine] (../media/connect.png)

4. Finish the installation of the operating system. For more information about installing the operating system, see [Install and Deploy Windows Server](http://technet.microsoft.com/en-us/library/dd283085%28WS.10%29.aspx).

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

5. Choose the region or affinity group that will contain the storage account. By specifying an affinity group, you can co-locate your cloud services in the same data center with your storage.

6. Choose whether you need geo-replication for the storage account. Geo-replication is turned on by default. During geo-replication, your data is replicated to a secondary location, at no cost to you, so that your storage fails over seamlessly to a secondary location in the event of a major failure that can't be handled in the primary location. The secondary location is assigned automatically, and can't be changed. If legal requirements or organizational policy requires tighter control over the location of your cloud-based storage, you can turn off geo-replication. However, be aware that if you later turn on geo-replication, you will be charged a one-time data transfer fee to replicate your existing data to the secondary location. Storage services without geo-replication are offered at a discount.

7. Click **Create Storage Account**.

	The account is now listed under **Storage Accounts**.

	![Storage account successfully created] (../media/storagesuccess.png)

## <a id="prepimage"> </a>Step 4: Prepare the image to be uploaded ##

Before the image can be uploaded to Windows Azure, it must be generalized by using the Sysprep command. For more information about using Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/en-us/library/bb457073.aspx).

In the virtual machine that you just created, complete the following procedure:

1. Open a Command Prompt window as an administrator.

	![Open Command Prompt window] (../media/sysprepcommand.png)

2. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.

	The **System Preparation Tool** dialog box appears.

	![Start Sysprep] (../media/sysprepgeneral.png)

3. In **System Cleanup Action**, select **Enter System Out-of-Box Experience (OOBE)** and make sure that **Generalize** is checked.

4. In **Shutdown Options**, select **Shutdown**.

5. Click **OK**.

## <a id="upload"> </a>Step 5: Upload the image to Windows Azure ##

To upload an image contained in a VHD file to Windows Azure, you must:

1.	Create and install a management certificate
2.	Obtain the thumbprint of the certificate and the subscription ID
3.	Set the connection
4.	Upload the VHD file

### Create and install the management certificate ###

You can create a management certificate in a variety of ways.  For more information about creating certificates, see [How to Create a Certificate for a Role](http://msdn.microsoft.com/en-us/library/gg432987.aspx).  After you create the certificate, you must add it to your subscription in Windows Azure. 

1. Sign in to the Windows Azure Management Portal.

2. In the upper-left corner of the Management Portal, click **Preview**, and then click **Previous Management Portal**.

	![Open Previous Management Portal] (../media/preview.png)

3. In the navigation pane, click **Hosted Services, Storage Accounts & CDN**.

4. At the top of the navigation pane, click **Management Certificates**.

5. On the ribbon, in the **Certificates** group, click **Add Certificate**.

6. In **Choose a subscription**, select the Windows Azure subscription to which you want to add the management certificate.

7. In **Certificate file**, browse to the certificate file, and then click **OK**.

### Obtain the thumbprint of the certificate and the subscription ID ###

You need the thumbprint of the management certificate that you added and you need the subscription ID to be able to upload the VHD file to Windows Azure.

1. While still in the Previous Management Portal, click **Hosted Services, Storage Accounts & CDN**, and then click **Management Certificates**.

2. In the center pane, click your certificate, and then record the thumbprint from the **Properties** pane by copying and pasting it to a location where you can retrieve it later.

You also need the ID of your subscription to upload the VHD file.

1. In the Previous Management Portal, click **Hosted Services, Storage Accounts & CDN**, and then click **Hosted Services**.

2. In the center pane, select your subscription, and then record the subscription ID from the **Properties** pane by copying and pasting it to a location where you can retrieve it later.

### Set the connection ###

You must set the connection string that is used to access the subscription. The CSUpload Command-Line Tool is used to set the connection string that is used. For more information, see [CSUpload Command-Line Tool](http://msdn.microsoft.com/en-us/library/gg466228.aspx).

1. Open a Windows Azure SDK Command Prompt window as an administrator.

2. Set the connection string by using the following command and replacing **Subscriptionid** and **CertThumbprint** with the values that you obtained earlier:

	`csupload Set-Connection "SubscriptionID=<Subscriptionid>;CertificateThumbprint=<Thumbprint>;ServiceManagementEndpoint=https://management-preview.core.windows-int.net"`

### Upload the VHD file ###

For this task, you upload the VHD file to be used as an image for creating virtual machines. You use the CSUpload command-line tool be used to upload a VHD file to the Image Gallery in Windows Azure.

1. Use the same Command Prompt window that you opened to set the connection string.

2. Upload the VHD file by using the following command and replacing **Subscriptionid** and **CertThumbprint** with the values that you obtained earlier:

	`csupload Add-PersistentVMImage –Destination "<BlobStorageURL>/<YourImagesFolder>/<VHDName>" -Label <VHDName> -LiteralPath <PathToVHDFile> -OS Windows`

Where **BlobStorageURL** is the URL for the storage account that you created earlier. You can place the VHD file anywhere within your Blog storage. **YourImagesFolder** is the container within blob storage where you want to store your images. **VHDName** is the label that appears in the Management Portal to identify the VHD. **PathToVHDFile** is the full path and name of the VHD file.

[Step 1: Install the Hyper-V role on your server]: #hyperv
[Step 2: Create the image]: #createimage
[Step 3: Create a storage account in Windows Azure]: #createstorage
[Step 4: Prepare the image to be uploaded]: #prepimage
[Step 5: Upload the image to Windows Azure]: #upload




