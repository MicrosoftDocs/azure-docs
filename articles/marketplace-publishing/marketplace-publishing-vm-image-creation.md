<properties
   pageTitle="Creating a virtual machine image for the Azure Marketplace | Microsoft Azure"
   description="Detailed instructions on how to create a virtual machine image for the Azure Marketplace for others to purchase."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="07/13/2016"
   ms.author="hascipio; v-divte"/>

# Guide to create a virtual machine image for the Azure Marketplace

This article, **Step 2**, walks you through preparing the virtual hard disks (VHDs) that you will deploy to the Azure Marketplace. Your VHDs are the foundation of your SKU. The process differs depending on whether you are providing a Linux-based or Windows-based SKU. This article covers both scenarios. This process can be performed in parallel with [Account creation and registration][link-acct-creation].

## 1. Define Offers and SKUs

In this section, you learn to define the offers and their associated SKUs.

An offer is a "parent" to all of its SKUs. You can have multiple offers. How you decide to structure your offers is up to you. When an offer is pushed to staging, it is pushed along with all of its SKUs. Carefully consider your SKU identifiers, because they will be visible in the URL:

- Azure.com: http://azure.microsoft.com/marketplace/partners/{PartnerNamespace}/{OfferIdentifier}-{SKUidentifier}

- Azure preview portal: https://portal.azure.com/#gallery/{PublisherNamespace}.{OfferIdentifier}{SKUIDdentifier}  

A SKU is the commercial name for a VM image. A VM image contains one operating system disk and zero or more data disks. It is essentially the complete storage profile for a virtual machine. One VHD is needed per disk. Even blank data disks require a VHD to be created.

Regardless of which operating system you use, add only the minimum number of data disks needed by the SKU. Customers cannot remove disks that are part of an image at the time of deployment but can always add disks during or after deployment if they need them.

>[AZURE.IMPORTANT] **Do not change disk count in a new image version.** If you must reconfigure Data disks in the image, define a new SKU. Publishing a new image version with different disk counts will have the potential of breaking new deployment based on the new image version in cases of auto-scaling, automatic deployments of solutions through ARM templates and other scenarios.

### 1.1 Add an offer

1. Sign in to the [Publishing Portal][link-pubportal] by using your seller account.
2. Select the **Virtual Machines** tab of the Publishing Portal. In the prompted entry field, enter your offer name. The offer name is typically the name of the product or service that you plan to sell in the Azure Marketplace.
3. Select **Create**.

### 1.2 Define a SKU
After you have added an offer, you need to define and identify your SKUs. You can have multiple offers, and each offer can have multiple SKUs under it. When an offer is pushed to staging, it is pushed along with all of its SKUs.

1. **Add a SKU.** The SKU requires an identifier, which is used in the URL. The identifier must be unique within your publishing profile, but there is no risk of identifier collision with other publishers.

    > [AZURE.NOTE] The offer and SKU identifiers are displayed in the offer URL in the Marketplace.

2. **Add a summary description for your SKU.** Summary descriptions are visible to customers, so you should make them easily readable. This information does not need to be locked until the "Push to Staging" phase. Until then, you are free to edit it.
3. If you are using Windows-based SKUs, follow the suggested links to acquire the approved versions of Windows Server.

## 2. Create an Azure-compatible VHD (Linux-based)
This section focuses on best practices for creating a Linux-based VM image for the Azure Marketplace. For a step-by-step walkthrough, refer to the following documentation:
[Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System](../virtual-machines/virtual-machines-linux-classic-create-upload-vhd.md)

## 3. Create an Azure-compatible VHD (Windows-based)
This section focuses on the steps to create a SKU based on Windows Server for the Azure Marketplace.

### 3.1 Ensure that you are using the correct base VHDs
The operating system VHD for your VM image must be based on an Azure-approved base image that contains Windows Server or SQL Server.

To begin, create a VM from one of the following images, located at the [Microsoft Azure portal][link-azure-portal]:

- Windows Server ([2012 R2 Datacenter][link-datactr-2012-r2], [2012 Datacenter][link-datactr-2012], [2008 R2 SP1][link-datactr-2008-r2])
- SQL Server 2014 ([Enterprise][link-sql-2014-ent], [Standard][link-sql-2014-std], [Web][link-sql-2014-web])
- SQL Server 2012 SP2 ([Enterprise][link-sql-2012-ent], [Standard][link-sql-2012-std], [Web][link-sql-2012-web])

These links can also be found in the Publishing Portal under the SKU page.

> [AZURE.TIP] If you are using the current Azure portal or PowerShell, Windows Server images published on September 8, 2014 and later are approved.


### 3.2 Create your Windows-based VM
From the Microsoft Azure portal, you can create your VM based on an approved base image in just a few simple steps. The following is an overview of the process:

1. From the base image page, select **Create Virtual Machine** to be directed to the new [Microsoft Azure portal][link-azure-portal].

    ![drawing][img-acom-1]

2. Sign in to the portal with the Microsoft account and password for the Azure subscription you want to use.
3. Follow the prompts to create a VM by using the base image you have selected. You need to provide a host name (name of the computer), user name (registered as an administrator), and password for the VM.

    ![drawing][img-portal-vm-create]

4. Select the size of the VM to deploy:

    a.	If you plan to develop the VHD on-premises, the size does not matter. Consider using one of the smaller VMs.

    b.	If you plan to develop the image in Azure, consider using one of the recommended VM sizes for the selected image.

    c.	For pricing information, refer to the **Recommended pricing tiers** selector displayed on the portal. It will provide the three recommended sizes provided by the publisher. (In this case, the publisher is Microsoft.)

    ![drawing][img-portal-vm-size]

5. Set properties:

    a.	For quick deployment, you can leave the default values for the properties under **Optional Configuration** and **Resource Group**.

    b.	Under **Storage Account**, you can optionally select the storage account in which the operating system VHD will be stored.

    c.	Under **Resource Group**, you can optionally select the logical group in which to place the VM.
6. Select the **Location** for deployment:

    a.	If you plan to develop the VHD on-premises, the location does not matter because you will upload the image to Azure later.

    b.	If you plan to develop the image in Azure, consider using one of the US-based Microsoft Azure regions from the beginning. This speeds up the VHD copying process that Microsoft performs on your behalf when you submit your image for certification.

    ![drawing][img-portal-vm-location]

7. Click **Create**. The VM starts to deploy. Within minutes, you will have a successful deployment and can begin to create the image for your SKU.

### 3.3 Develop your VHD in the cloud
We strongly recommend that you develop your VHD in the cloud by using Remote Desktop Protocol (RDP). You connect to RDP with the user name and password specified during provisioning.

> [AZURE.IMPORTANT] If you develop your VHD on-premises (which is not recommended), see [Creating a virtual machine image on-premises](marketplace-publishing-vm-image-creation-on-premise.md). Downloading your VHD is not necessary if you are developing in the cloud.


**Connect via RDP using the [Microsoft Azure portal][link-azure-portal]**

1. Select **Browse** > **VMs**.
2. The Virtual machines blade opens. Ensure that the VM that you want to connect with is running, and then select it from the list of deployed VMs.
3. A blade opens that describes the selected VM. At the top, click **Connect**.
4. You are prompted to enter the user name and password that you specified during provisioning.

**Connect via RDP using PowerShell**

To download a remote desktop file to a local machine, use the [Get-AzureRemoteDesktopFile cmdlet][link-technet-2]. In order to use this cmdlet, you need to know the name of the service and name of the VM. If you created the VM from the [Microsoft Azure portal][link-azure-portal], you can find this information under VM properties:

1. In the Microsoft Azure portal, select **Browse** > **VMs**.
2. The Virtual machines blade opens. Select the VM that you deployed.
3. A blade opens that describes the selected VM.
4. Click **Properties**.
5. The first portion of the domain name is the service name. The host name is the VM name.

    ![drawing][img-portal-vm-rdp]

6. The cmdlet to download the RDP file for the created VM to the administrator's local desktop is as follows.

        Get‐AzureRemoteDesktopFile ‐ServiceName “baseimagevm‐6820cq00” ‐Name “BaseImageVM” –LocalPath “C:\Users\Administrator\Desktop\BaseImageVM.rdp”

More information about RDP can be found on MSDN in the article [Connect to an Azure VM with RDP or SSH](http://msdn.microsoft.com/library/azure/dn535788.aspx).

**Configure a VM and create your SKU**

After the operating system VHD is downloaded, use Hyper­V and configure a VM to begin creating your SKU. Detailed steps can be found at the following TechNet link: [Install Hyper­V and Configure a VM](http://technet.microsoft.com/library/hh846766.aspx).

### 3.4 Choose the correct VHD size
The Windows operating system VHD in your VM image should be created as a 128-GB fixed-format VHD.  

If the physical size is less than 128 GB, the VHD should be sparse. The base Windows and SQL Server images provided already meet these requirements, so do not change the format or the size of the VHD obtained.  

Data disks can be as large as 1 TB. When deciding on the disk size, remember that customers cannot resize VHDs within an image at the time of deployment. Data disk VHDs should be created as a fixed-format VHD. They should also be sparse. Data disks can be empty or contain data.


### 3.5 Install the latest Windows patches
The base images contain the latest patches up to their published date. Before publishing the operating system VHD you have created, ensure that Windows Update has been run and that all the latest Critical and Important security updates have been installed.

### 3.6 Perform additional configuration and schedule tasks as necessary
If additional configuration is needed, consider using a scheduled task that runs at startup to make any final changes to the VM after it has been deployed:

- It is a best practice to have the task delete itself upon successful execution.
- No configuration should rely on drives other than drives C or D, because these are the only two drives that are always guaranteed to exist. Drive C is the operating system disk, and drive D is the temporary local disk.

### 3.7 Generalize the image
All images in the Azure Marketplace must be reusable in a generic fashion. In other words, the operating system VHD must be generalized:

- For Windows, the image should be "sysprepped," and no configurations should be done that do not support the **sysprep** command.
- You can run the following command from the directory %windir%\System32\Sysprep.

        sysprep.exe /generalize /oobe /shutdown

  Guidance on how to sysprep the operating system is provided in Step of the following MSDN article: [Create and upload a Windows Server VHD to Azure](../virtual-machines/virtual-machines-windows-classic-createupload-vhd.md).

## 4. Deploy a VM from your VHDs
After you have uploaded your VHDs (the generalized operating system VHD and zero or more data disk VHDs) to an Azure storage account, you can register them as a user VM image. Then you can test that image. Note that because your operating system VHD is generalized, you cannot directly deploy the VM by providing the VHD URL.

To learn more about VM images, review the following blog posts:

- [VM Image](https://azure.microsoft.com/blog/vm-image-blog-post/)
- [VM Image PowerShell How To](https://azure.microsoft.com/blog/vm-image-powershell-how-to-blog-post/)
- [About VM images in Azure](https://msdn.microsoft.com/library/azure/dn790290.aspx)

### 4.1 Create a user VM image
To create a user VM image from your SKU to begin deploying multiple VMs, you need to use the [Create VM Image Rest API](http://msdn.microsoft.com/library/azure/dn775054.aspx) to register VHDs as a VM image.

You can use the **Invoke-WebRequest** cmdlet to create a VM image from PowerShell. The following PowerShell script shows how to create a VM image with an operating system disk and one data disk. Note that a subscription and the PowerShell session should already be set up.

        # Image Parameters to Specify
        $ImageName=’ENTER-YOUR-OWN-IMAGE-NAME-HERE’
        $Label='ENTER-YOUR-LABEL-HERE'
        $Description='DESCRIBE YOUR IMAGE HERE’
        $osCaching='ReadWrite'
        $os = 'Windows'
        $state = 'Generalized'
        $osMediaLink = 'https://mystorageaccount.blob.core.windows.net/vhds/myosvhd.vhd'
        $dataCaching='None'
        $lun='1'
        $dataMediaLink='http://mystorageaccount.blob.core.windows.net/vhds/mydatavhd.vhd'
        # Subscription-Related Properties
        $SrvMngtEndPoint='https://management.core.windows.net'
        $subscription = Get-AzureSubscription -Current -ExtendedDetails
        $certificate = $subscription.Certificate
        $SubId = $subscription.SubscriptionId
        $body =  
        "<VMImage xmlns=`"http://schemas.microsoft.com/windowsazure`" xmlns:i=`"http://www.w3.org/2001/XMLSchema-instance`">" + Name>" + $ImageName + "</Name>" +
        "<Label>" + $Label + "</Label>" +
        "<Description>" + $Description + "</Description>" + "<OSDiskConfiguration>" +
        "<HostCaching>" + $osCaching + "</HostCaching>" +
        "<OSState>" + $state + "</OSState>" +
        "<OS>" + $os + "</OS>" +
        "<MediaLink>" + $osMediaLink + "</MediaLink>" +
        "</OSDiskConfiguration>" +
        "<DataDiskConfigurations>" +
        "<DataDiskConfiguration>" +
        "<HostCaching>" + $dataCaching + "</HostCaching>" +
        "<Lun>" + $lun + "</Lun>" +
        "<MediaLink>" + $dataMediaLink + "</MediaLink>" +
        "</DataDiskConfiguration>" +
        "</DataDiskConfigurations>" +
        "</VMImage>"
        $uri = $SrvMngtEndPoint + "/" + $SubId + "/" + "services/vmimages" $headers = @{"x-ms-version"="2014-06-01"}
        $response = Invoke-WebRequest -Uri $uri -ContentType "application/xml" -Body
        $body -Certificate $certificate -Headers $headers -Method POST
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300)
        {
        echo "Accepted"
        } else {
        echo "Not Accepted" }
        $opId = $response.Headers.'x-ms-request-id'
        $uri2 = $SrvMngtEndPoint + "/" + $SubId + "/" + "operations" + "/" + $opId $response2 = Invoke-WebRequest -Uri $uri2 -ContentType "application/xml" -
        Certificate $certificate -Headers $headers -Method GET
        $response2.RawContent


By running this script, you create a user VM image with the name you provided to the ImageName parameter, myVMImage. It consists of one operating system disk and one data disk.

This API is an asynchronous operation and responds with a 202 "Accepted" code. In order to see whether the VM image has been created, you need to query for operation status. The x-ms-request-id in the return response is the operation ID. This ID should be set in $opId below.

        $opId = #Fill In With Operation ID
        $uri2 = $SrvMngtEndPoint + "/" + $SubId + "/" + "operations" + "/" + "opId"
        $response2 = Invoke‐WebRequest ‐Uri $uri2 ‐ContentType "application/xml" ‐Certificate $certificate ‐Headers $headers ‐Method GET

To create a VM image from an operating system VHD and an additional empty data disks (you do not have the VHD for this disk created) by using the Create VM Image API, use the following script.

        # Image Parameters to Specify
        $ImageName=’myVMImage’
        $Label='IMAGE_LABEL'
        $Description='My VM Image to Test’
        $osCaching='ReadWrite'
        $os = 'Windows'
        $state = 'Generalized'
        $osMediaLink = 'http://mystorageaccount.blob.core.windows.net/containername/myOSvhd.vhd'
        $dataCaching='None'
        $lun='1'
        $emptyDiskSize= 32
        # Subscription-Related Properties
        $SrvMngtEndPoint='https://management.core.windows.net'
        $subscription = Get‐AzureSubscription –Current ‐ExtendedDetails
        $certificate = $subscription.Certificate
        $SubId = $subscription.SubscriptionId
        $body =
        "<VMImage xmlns="http://schemas.microsoft.com/windowsazure" xmlns:i="http://www.w3.org/2001/XMLSchema‐instance">" +
        "<Name>" + $ImageName + "</Name>" +
        "<Label>" + $Label + "</Label>" +
        "<Description>" + $Description + "</Description>" +
        "<OSDiskConfiguration>" +
        "<HostCaching>" + $osCaching + "</HostCaching>" +
        "<OSState>" + $state + "</OSState>" +
        "<OS>" + $os + "</OS>" +
        "<MediaLink>" + $osMediaLink + "</MediaLink>" +
        "</OSDiskConfiguration>" +
        "<DataDiskConfigurations>" +
        "<DataDiskConfiguration>" +
        "<HostCaching>" + $dataCaching + "</HostCaching>" +
        "<Lun>" + $lun + "</Lun>" +
        "<MediaLink>" + $dataMediaLink + "</MediaLink>" +
        "<LogicalDiskSizeInGB>" + $emptyDiskSize + "</LogicalDiskSizeInGB>" +
        "</DataDiskConfiguration>" +
        "</DataDiskConfigurations>" +
        "</VMImage>"
        $uri = $SrvMngtEndPoint + "/" + $SubId + "/" + "services/vmimages"
        $headers = @{"x‐ms‐version"="2014‐06‐01"}
        $response = Invoke‐WebRequest ‐Uri $uri ‐ContentType "application/xml" ‐Body $body ‐Certificate $certificate ‐Headers $headers ‐Method POST
        if ($response.StatusCode ‐ge 200 ‐and $response.StatusCode ‐lt 300)
        {
        echo "Accepted"
        }
        else
        {
        echo "Not Accepted"
        }

By running this script, you create a user VM image with the name you provided to the ImageName parameter, myVMImage. It consists of one operating system disk and one data disk.

This API is an asynchronous operation and responds with a 202 "Accepted" code. In order to see whether the VM image has been created, you need to query for operation status.  The x-ms-request-id in the return response is the operation ID. This ID should be set in $opId below.

        $opId = #Fill In With Operation ID
        $uri2 = $SrvMngtEndPoint + "/" + $SubId + "/" + "operations" + "/" + "$opId"
        $response2 = Invoke-WebRequest -Uri $uri2 -ContentType "application/xml" Certificate $certificate -Headers $headers -Method GET

To create a VM image from an operating system VHD and an additional empty data disks (you do not have the VHD for this disk created) by using the Create VM Image API, use the following script.

        # Image Parameters to Specify
        $ImageName=’myVMImage’
        $Label='IMAGE_LABEL'
        $Description='My VM Image to Test’
        $osCaching='ReadWrite'
        $os = 'Windows'
        $state = 'Generalized'
        $osMediaLink =
        'http://mystorageaccount.blob.core.windows.net/containername/myOSvhd.vhd'
        $dataCaching='None'
        $lun='1'
        $emptyDiskSize= 32
        # Subscription-Related Properties
        $SrvMngtEndPoint='https://management.core.windows.net'
        $subscription = Get-AzureSubscription –Current -ExtendedDetails
        $certificate = $subscription.Certificate
        $SubId = $subscription.SubscriptionId
        $body =  
        "<VMImage xmlns=`"http://schemas.microsoft.com/windowsazure`" xmlns:i=`"http://www.w3.org/2001/XMLSchema-instance`">" +
        "<Name>" + $ImageName + "</Name>" +
        "<Label>" + $Label + "</Label>" +
        "<Description>" + $Description + "</Description>" + "<OSDiskConfiguration>" + "<HostCaching>" + $osCaching + "</HostCaching>" +
        "<OSState>" + $state + "</OSState>" +
        "<OS>" + $os + "</OS>" +
        "<MediaLink>" + $osMediaLink + "</MediaLink>" +
        "</OSDiskConfiguration>" +
        "<DataDiskConfigurations>" +
        "<DataDiskConfiguration>" +
        "<HostCaching>" + $dataCaching + "</HostCaching>" +
        "<Lun>" + $lun + "</Lun>" +
        "<MediaLink>" + $dataMediaLink + "</MediaLink>" +
        "<LogicalDiskSizeInGB>" + $emptyDiskSize + "</LogicalDiskSizeInGB>" + "</DataDiskConfiguration>" +
        "</DataDiskConfigurations>" +
        "</VMImage>"
        $uri = $SrvMngtEndPoint + "/" + $SubId + "/" + "services/vmimages"
        $headers = @{"x-ms-version"="2014-06-01"}
        $response = Invoke-WebRequest -Uri $uri -ContentType "application/xml" -Body $body Certificate $certificate -Headers $headers -Method POST
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300)
        { echo "Accepted"
        } else
        { echo "Not Accepted"
        }

By running this script, you create a user VM image with the name you provided to the ImageName parameter, myVMImage.  It consists of one operating system disk, based on the VHD you passed, and one empty 32-GB data disk.

### 4.2 Deploy a VM from a user VM image
To deploy a VM from a user VM image, you can use the current [Azure portal](https://manage.windowsazure.com) or PowerShell.

**Deploy a VM from the current Azure portal**

1. Go to **New** > **Compute** > **Virtual machine** > **From gallery**.

    ![drawing][img-manage-vm-new]

2. Go to **My images**, and then select the VM image from which to deploy a VM:
  1. Pay close attention to which image you select, because the **My images** view lists both operating system images and VM images.
  2. Looking at the number of disks can help determine what type of image you are deploying, because the majority of VM images have more than one disk. However, it is still possible to have a VM image with only a single operating system disk, which would then have **Number of disks** set to 1.

    ![drawing][img-manage-vm-select]

3. Follow the VM creation wizard and specify the VM name, VM size, location, user name, and password.

**Deploy a VM from PowerShell**

To deploy a large VM from the generalized VM image just created, you can use the following cmdlets.

    $img = Get‐AzureVMImage ‐ImageName "myVMImage"
    $user = "user123"
    $pass = "adminPassword123"
    $myVM = New‐AzureVMConfig ‐Name "VMImageVM" ‐InstanceSize "Large" ‐ImageName $img.ImageName | Add‐AzureProvisioningConfig ‐Windows ‐AdminUsername $user ‐Password $pass
    New‐AzureVM ‐ServiceName "VMImageCloudService" ‐VMs $myVM ‐Location "West US" ‐WaitForBoot

## 5. Obtain certification for your VM image
The next step in preparing your VM image for the Azure Marketplace is to have it certified.

This process includes running a special certification tool, uploading the verification results to the Azure container where your VHDs reside, adding an offer, defining your SKU, and submitting your VM image for certification.

### 5.1 Download and run the Certification Test Tool for Azure Certified
The certification tool runs on a running VM, provisioned from your user VM image, to ensure that the VM image is compatible with Microsoft Azure. It will verify that the guidance and requirements about preparing your VHD have been met. The output of the tool is a compatibility report, which should be uploaded on the Publishing Portal while requesting certification.

The certification tool can be used with both Windows and Linux VMs. It connects to Windows-based VMs via PowerShell and connects to Linux VMs via SSH.Net:

1. First, download the certification tool at the [Microsoft download site][link-msft-download].
2. Open the certification tool, and then click the **Start New Test** button.
3. From the **Test Information** screen, enter a name for the test run.
4. Choose whether your VM is on Linux or Windows. Depending on which you choose, select the subsequent
options.

### **Connect the certification tool to a Linux VM image**

1. Select the SSH authentication mode: password or key file.
2. If using password-­based authentication, enter the Domain Name System (DNS) name, user name, and password.
3. If using key file authentication, enter the DNS name, user name, and private key location.

  ![Password authentication of Linux VM Image][img-cert-vm-pswd-lnx]

  ![Key file authentication of Linux VM Image][img-cert-vm-key-lnx]

### **Connect the certification tool to a Windows-based VM image**

1. Enter the fully qualified VM DNS name (for example, MyVMName.Cloudapp.net).
2. Enter the user name and password.

  ![Password authentication of Windows VM Image][img-cert-vm-pswd-win]

After you have selected the correct options for your Linux or Windows-based VM image, select **Test Connection** to ensure
that SSH.Net or PowerShell has a valid connection for testing purposes. After a connection is established, select **Next** to start the test.

When the test is complete, you will receive the results (Pass/Fail/Warning) for each test element.

![Test cases for Linux VM Image][img-cert-vm-test-lnx]

![Test cases for Windows VM Image][img-cert-vm-test-win]

If any of the tests fail, your image will not be certified. If this occurs, review the requirements and make any necessary changes.

After the automated test, you are asked to provide additional input on your VM image via a questionnaire screen.  Complete the questions, and then select **Next**.

![Certification Tool Questionnaire][img-cert-vm-questionnaire]

![Certification Tool Questionnaire][img-cert-vm-questionnaire-2]

After you have completed the questionnaire, you can provide additional information such as SSH access information for the Linux VM image and an explanation for any failed assessments. You can download the test results and log files for the executed test cases in addition to your answers to the questionnaire. Save the results in the same container as your VHDs.

![Save certification test results][img-cert-vm-results]

### 5.2 Get the shared access signature URI for your VM images

During the publishing process, you specify the uniform resource identifiers (URIs) that lead to each of the VHDs you have created for your SKU. Microsoft needs access to these VHDs during the certification process. Therefore, you need to create a shared access signature URI for each VHD. This is the URI that should be entered in the
**Images** tab in the Publishing Portal.

The shared access signature URI created should adhere to the following requirements:

- When generating shared access signature URIs for your VHDs, List and Read­ permissions are sufficient. Do not provide Write or Delete access.
- The duration for access should be a minimum of seven business days from when the shared access signature URI is created.
- To avoid immediate errors due to clock skews, specify a time 15 minutes before the current time.

To create a shared access signature URI, you can follow the instructions provided in [Shared access signatures, Part 1: Understanding the SAS model][link-azure-1] and [Shared access signatures, Part 2: Create and use a SAS with the Azure Blob service][link-azure-2].

Instead of generating a shared access key by using code, you can also use storage tools, such as [Azure Storage Explorer][link-azure-codeplex].

**Use Azure Storage Explorer to generate a shared access key**

1. Download [Azure Storage Explorer][link-azure-codeplex] 6 and above from CodePlex.
2. After it is installed, open the application.
3. Click **Add Account**.

    ![drawing][img-azstg-add]

4. Specify the storage account name, storage account key, and storage endpoints domain. Don’t select **Use HTTPS**.

    ![drawing][img-azstg-setup-1]

5. Azure Storage Explorer is now connected to your specific storage account. It will start showing all the containers within the storage account. Select the container where you have copied the operating system disk VHD file (also data disks if they are applicable for your scenario).

    ![drawing][img-azstg-setup-2]

6. After selecting the blob container, Azure Storage Explorer starts showing the files within the container. Select the image file (.vhd) that needs to be submitted.

    ![drawing][img-azstg-setup-3]

7. After selecting the .vhd file in the container, click the **Security** tab.

    ![drawing][img-azstg-setup-4]

8. In the **Blob Container Security** dialog box, leave the defaults on the **Access Level** tab, and then click the **Shared Access Signatures** tab.

    ![drawing][img-azstg-setup-5]

9. Follow the steps below to generate a shared access signature URI for the .vhd image:

    ![drawing][img-azstg-setup-6]

    a.	**Access permitted from**: To safeguard for UTC time, select the day before the current date. For example, if the current date is October 6, 2014, select 10/5/2014.

    b.	**Access permitted to**: Select a date that is at least 7 to 8 days after the **Access permitted from** date.

    c.	**Actions permitted**: Select the **List** and **Read** permissions.

    d.	If you have selected your .vhd file correctly, then your file appears in **Blob name to access** with extension .vhd.

    e.	Click **Generate Signature**.

    f.	In **Generated Shared Access Signature URI of this container**, check for the following as highlighted above:

    - 	Make sure that the URL doesn't start with "https".
    - 	Make sure that your image file name and ".vhd" are in the URI.
    - 	At the end of the signature, make sure that "=rl" appears. This demonstrates that Read and List access was provided successfully.

    g.	To ensure that the generated shared access signature URI works, click **Test in Browser**. It should start the download process.
10. Copy the shared access signature URI. This is the URI to paste into the Publishing Portal.
11. Repeat these steps for each VHD in the SKU.

### 5.3 Provide information about the VM image and request certification in the Publishing Portal
After you have created your offer and SKU, you should enter the image details associated with that SKU:

1. Go to the [Publishing Portal][link-pubportal], and then sign in with your seller account.
2. Select the **VM images** tab.
3. The identifier listed at the top of the page is actually the offer identifier and not the SKU identifier.
4. Fill out the properties under the **SKUs** section.
5. Under **Operating system family**, click the operating system type associated with the operating system VHD.
6. In the **Operating system** box, describe the operating system. Consider a format such as operating system family, type, version, and updates. An example is "Windows Server Datacenter 2014 R2."
7. Select up to six recommended virtual machine sizes. These are recommendations that get displayed to the customer in the Pricing tier blade in the Azure Portal when they decide to purchase and deploy your image. **These are only recommendations. The customer is able to select any VM size that accommodates the disks specified in your image.**
8. Enter the version. The version field encapsulates a semantic version to identify the product and its updates:
  -	Versions should be of the form X.Y.Z, where X, Y, and Z are integers.
  -	Images in different SKUs can have different major and minor versions.
  -	Versions within a SKU should only be incremental changes, which increase the patch version (Z from X.Y.Z).
9. In the **OS VHD URL** box, enter the shared access signature URI created for the operating system VHD.
10. If there are data disks associated with this SKU, select the logical unit number (LUN) to which you would like this data disk to be mounted upon deployment.
11. In the **LUN X VHD URL** box, enter the shared access signature URI created for the first data VHD.

    ![drawing](media/marketplace-publishing-vm-image-creation/vm-image-pubportal-skus-3.png)

## Next step
After you are done with the SKU details, you can move forward to the [Azure Marketplace marketing content guide][link-pushstaging]. In that step of the publishing process, you provide the marketing content, pricing, and other information necessary prior to **Step 3: Testing your VM offer in staging**, where you test various use-case scenarios before deploying the offer to the Azure Marketplace for public visibility and purchase.  

## See also
- [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

[img-acom-1]:media/marketplace-publishing-vm-image-creation/vm-image-acom-datacenter.png
[img-portal-vm-size]:media/marketplace-publishing-vm-image-creation/vm-image-portal-size.png
[img-portal-vm-create]:media/marketplace-publishing-vm-image-creation/vm-image-portal-create-vm.png
[img-portal-vm-location]:media/marketplace-publishing-vm-image-creation/vm-image-portal-location.png
[img-portal-vm-rdp]:media/marketplace-publishing-vm-image-creation/vm-image-portal-rdp.png
[img-azstg-add]:media/marketplace-publishing-vm-image-creation/vm-image-storage-add.png
[img-azstg-setup-1]:media/marketplace-publishing-vm-image-creation/vm-image-storage-setup.png
[img-azstg-setup-2]:media/marketplace-publishing-vm-image-creation/vm-image-storage-setup-2.png
[img-azstg-setup-3]:media/marketplace-publishing-vm-image-creation/vm-image-storage-setup-3.png
[img-azstg-setup-4]:media/marketplace-publishing-vm-image-creation/vm-image-storage-setup-4.png
[img-azstg-setup-5]:media/marketplace-publishing-vm-image-creation/vm-image-storage-setup-5.png
[img-azstg-setup-6]:media/marketplace-publishing-vm-image-creation/vm-image-storage-setup-6.png
[img-manage-vm-new]:media/marketplace-publishing-vm-image-creation/vm-image-manage-new.png
[img-manage-vm-select]:media/marketplace-publishing-vm-image-creation/vm-image-manage-select.png
[img-cert-vm-key-lnx]:media/marketplace-publishing-vm-image-creation/vm-image-certification-keyfile-linux.png
[img-cert-vm-pswd-lnx]:media/marketplace-publishing-vm-image-creation/vm-image-certification-password-linux.png
[img-cert-vm-pswd-win]:media/marketplace-publishing-vm-image-creation/vm-image-certification-password-win.png
[img-cert-vm-test-lnx]:media/marketplace-publishing-vm-image-creation/vm-image-certification-test-sample-linux.png
[img-cert-vm-test-win]:media/marketplace-publishing-vm-image-creation/vm-image-certification-test-sample-win.png
[img-cert-vm-results]:media/marketplace-publishing-vm-image-creation/vm-image-certification-results.png
[img-cert-vm-questionnaire]:media/marketplace-publishing-vm-image-creation/vm-image-certification-questionnaire.png
[img-cert-vm-questionnaire-2]:media/marketplace-publishing-vm-image-creation/vm-image-certification-questionnaire-2.png
[img-pubportal-vm-skus]:media/marketplace-publishing-vm-image-creation/vm-image-pubportal-skus.png
[img-pubportal-vm-skus-2]:media/marketplace-publishing-vm-image-creation/vm-image-pubportal-skus-2.png

[link-pushstaging]:marketplace-publishing-push-to-staging.md
[link-github-waagent]:https://github.com/Azure/WALinuxAgent
[link-azure-codeplex]:https://azurestorageexplorer.codeplex.com/
[link-azure-2]: ../storage/storage-dotnet-shared-access-signature-part-2.md
[link-azure-1]: ../storage/storage-dotnet-shared-access-signature-part-1.md
[link-msft-download]:http://www.microsoft.com/download/details.aspx?id=44299
[link-technet-3]:https://technet.microsoft.com/library/hh846766.aspx
[link-technet-2]:https://msdn.microsoft.com/library/dn495261.aspx
[link-azure-portal]:https://portal.azure.com
[link-pubportal]:https://publish.windowsazure.com
[link-sql-2014-ent]:http://azure.microsoft.com/marketplace/partners/microsoft/sqlserver2014enterprisewindowsserver2012r2/
[link-sql-2014-std]:http://azure.microsoft.com/marketplace/partners/microsoft/sqlserver2014standardwindowsserver2012r2/
[link-sql-2014-web]:http://azure.microsoft.com/marketplace/partners/microsoft/sqlserver2014webwindowsserver2012r2/
[link-sql-2012-ent]:http://azure.microsoft.com/marketplace/partners/microsoft/sqlserver2012sp2enterprisewindowsserver2012/
[link-sql-2012-std]:http://azure.microsoft.com/marketplace/partners/microsoft/sqlserver2012sp2standardwindowsserver2012/
[link-sql-2012-web]:http://azure.microsoft.com/marketplace/partners/microsoft/sqlserver2012sp2webwindowsserver2012/
[link-datactr-2012-r2]:http://azure.microsoft.com/marketplace/partners/microsoft/windowsserver2012r2datacenter/
[link-datactr-2012]:http://azure.microsoft.com/marketplace/partners/microsoft/windowsserver2012datacenter/
[link-datactr-2008-r2]:http://azure.microsoft.com/marketplace/partners/microsoft/windowsserver2008r2sp1/
[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
[link-technet-1]:https://technet.microsoft.com/library/hh848454.aspx
[link-azure-vm-2]:./virtual-machines-linux-agent-user-guide/
[link-openssl]:https://www.openssl.org/
[link-intsvc]:http://www.microsoft.com/download/details.aspx?id=41554
[link-python]:https://www.python.org/
