---
title: Creating a virtual machine image for the Azure Marketplace | Microsoft Docs
description: Detailed instructions on how to create a virtual machine image for the Azure Marketplace for others to purchase.
services: Azure Marketplace
documentationcenter: ''
author: HannibalSII
manager: hascipio
editor: ''

ms.assetid: 5c937b8e-e28d-4007-9fef-624046bca2ae
ms.service: marketplace
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: Azure
ms.workload: na
ms.date: 01/05/2017
ms.author: hascipio; v-divte
---
# Guide to create a virtual machine image for the Azure Marketplace
This article, **Step 2**, walks you through preparing the virtual hard disks (VHDs) that you will deploy to the Azure Marketplace. Your VHDs are the foundation of your SKU. The process differs depending on whether you are providing a Linux-based or Windows-based SKU. This article covers both scenarios. This process can be performed in parallel with [Account creation and registration][link-acct-creation].

## 1. Define Offers and SKUs
In this section, you learn to define the offers and their associated SKUs.

An offer is a "parent" to all of its SKUs. You can have multiple offers. How you decide to structure your offers is up to you. When an offer is pushed to staging, it is pushed along with all of its SKUs. Carefully consider your SKU identifiers, because they will be visible in the URL:

* Azure.com: http://azure.microsoft.com/marketplace/partners/{PartnerNamespace}/{OfferIdentifier}-{SKUidentifier}
* Azure preview portal: https://portal.azure.com/#gallery/{PublisherNamespace}.{OfferIdentifier}{SKUIDdentifier}  

A SKU is the commercial name for a VM image. A VM image contains one operating system disk and zero or more data disks. It is essentially the complete storage profile for a virtual machine. One VHD is needed per disk. Even blank data disks require a VHD to be created.

Regardless of which operating system you use, add only the minimum number of data disks needed by the SKU. Customers cannot remove disks that are part of an image at the time of deployment but can always add disks during or after deployment if they need them.

> [!IMPORTANT]
> **Do not change disk count in a new image version.** If you must reconfigure Data disks in the image, define a new SKU. Publishing a new image version with different disk counts will have the potential of breaking new deployment based on the new image version in cases of auto-scaling, automatic deployments of solutions through ARM templates and other scenarios.
>
>

### 1.1 Add an offer
1. Sign in to the [Publishing Portal][link-pubportal] by using your seller account.
2. Select the **Virtual Machines** tab of the Publishing Portal. In the prompted entry field, enter your offer name. The offer name is typically the name of the product or service that you plan to sell in the Azure Marketplace.
3. Select **Create**.

### 1.2 Define a SKU
After you have added an offer, you need to define and identify your SKUs. You can have multiple offers, and each offer can have multiple SKUs under it. When an offer is pushed to staging, it is pushed along with all of its SKUs.

1. **Add a SKU.** The SKU requires an identifier, which is used in the URL. The identifier must be unique within your publishing profile, but there is no risk of identifier collision with other publishers.

   > [!NOTE]
   > The offer and SKU identifiers are displayed in the offer URL in the Marketplace.
   >
   >
2. **Add a summary description for your SKU.** Summary descriptions are visible to customers, so you should make them easily readable. This information does not need to be locked until the "Push to Staging" phase. Until then, you are free to edit it.
3. If you are using Windows-based SKUs, follow the suggested links to acquire the approved versions of Windows Server.

## 2. Create an Azure-compatible VHD (Linux-based)
This section focuses on best practices for creating a Linux-based VM image for the Azure Marketplace. For a step-by-step walkthrough, refer to the following documentation:
[Create a custom Linux VM image](../virtual-machines/linux/create-upload-generic.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

## 3. Create an Azure-compatible VHD (Windows-based)
This section focuses on the steps to create a SKU based on Windows Server for the Azure Marketplace.

### 3.1 Ensure that you are using the correct base VHDs
The operating system VHD for your VM image must be based on an Azure-approved base image that contains Windows Server or SQL Server.

To begin, create a VM from one of the following images, located at the [Microsoft Azure portal][link-azure-portal]:

* Windows Server ([2012 R2 Datacenter][link-datactr-2012-r2], [2012 Datacenter][link-datactr-2012], [2008 R2 SP1][link-datactr-2008-r2])
* SQL Server 2014 
* SQL Server 2012 SP2 

These links can also be found in the Publishing Portal under the SKU page.

> [!TIP]
> If you are using the current Azure portal or PowerShell, Windows Server images published on September 8, 2014 and later are approved.
>
>

### 3.2 Create your Windows-based VM
From the Microsoft Azure portal, you can create your VM based on an approved base image in just a few simple steps. The following is an overview of the process:

1. From the base image page, select **Create Virtual Machine** to be directed to the new [Microsoft Azure portal][link-azure-portal].

    ![drawing][img-acom-1]
2. Sign in to the portal with the Microsoft account and password for the Azure subscription you want to use.
3. Follow the prompts to create a VM by using the base image you have selected. You need to provide a host name (name of the computer), user name (registered as an administrator), and password for the VM.

    ![drawing][img-portal-vm-create]
4. Select the size of the VM to deploy:

    a.    If you plan to develop the VHD on-premises, the size does not matter. Consider using one of the smaller VMs.

    b.    If you plan to develop the image in Azure, consider using one of the recommended VM sizes for the selected image.

    c.    For pricing information, refer to the **Recommended pricing tiers** selector displayed on the portal. It will provide the three recommended sizes provided by the publisher. (In this case, the publisher is Microsoft.)

    ![drawing][img-portal-vm-size]
5. Set properties:

    a.    For quick deployment, you can leave the default values for the properties under **Optional Configuration** and **Resource Group**.

    b.    Under **Storage Account**, you can optionally select the storage account in which the operating system VHD will be stored.

    c.    Under **Resource Group**, you can optionally select the logical group in which to place the VM.
6. Select the **Location** for deployment:

    a.    If you plan to develop the VHD on-premises, the location does not matter because you will upload the image to Azure later.

    b.    If you plan to develop the image in Azure, consider using one of the US-based Microsoft Azure regions from the beginning. This speeds up the VHD copying process that Microsoft performs on your behalf when you submit your image for certification.

    ![drawing][img-portal-vm-location]
7. Click **Create**. The VM starts to deploy. Within minutes, you will have a successful deployment and can begin to create the image for your SKU.

### 3.3 Develop your VHD in the cloud
We strongly recommend that you develop your VHD in the cloud by using Remote Desktop Protocol (RDP). You connect to RDP with the user name and password specified during provisioning.

> [!IMPORTANT]
> **Do not use discs managed.** The virtual machine used to develop the VHD to the cloud must not be based on disks managed as it currently does not support the creation of an image from them.
> Creating the virtual machine in the optional feature change the default for disks managed.

> If you develop your VHD on-premises (which is not recommended), see [Creating a virtual machine image on-premises](marketplace-publishing-vm-image-creation-on-premise.md). Downloading your VHD is not necessary if you are developing in the cloud.
>
>

**Connect via RDP using the [Microsoft Azure portal][link-azure-portal]**

1. Select **All services** > **VMs**.
2. The Virtual machines blade opens. Ensure that the VM that you want to connect with is running, and then select it from the list of deployed VMs.
3. A blade opens that describes the selected VM. At the top, click **Connect**.
4. You are prompted to enter the user name and password that you specified during provisioning.

**Connect via RDP using PowerShell**

To download a remote desktop file to a local machine, use the [Get-AzureRemoteDesktopFile cmdlet][link-technet-2]. In order to use this cmdlet, you need to know the name of the service and name of the VM. If you created the VM from the [Microsoft Azure portal][link-azure-portal], you can find this information under VM properties:

1. In the Microsoft Azure portal, select **All services** > **VMs**.
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

* It is a best practice to have the task delete itself upon successful execution.
* No configuration should rely on drives other than drives C or D, because these are the only two drives that are always guaranteed to exist. Drive C is the operating system disk, and drive D is the temporary local disk.

### 3.7 Generalize the image
All images in the Azure Marketplace must be reusable in a generic fashion. In other words, the operating system VHD must be generalized:

* For Windows, the image should be "sysprepped," and no configurations should be done that do not support the **sysprep** command.
* You can run the following command from the directory %windir%\System32\Sysprep.

        sysprep.exe /generalize /oobe /shutdown

  Guidance on how to sysprep the operating system is provided in Step of the following MSDN article: [Create and upload a Windows Server VHD to Azure](../virtual-machines/windows/classic/createupload-vhd.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

## 4. Deploy a VM from your VHDs
After you have uploaded your VHDs (the generalized operating system VHD and zero or more data disk VHDs) to an Azure storage account, you can register them as a user VM image. Then you can test that image. Note that because your operating system VHD is generalized, you cannot directly deploy the VM by providing the VHD URL.

To learn more about VM images, review the following blog posts:

* [VM Image](https://azure.microsoft.com/blog/vm-image-blog-post/)
* [VM Image PowerShell How To](https://azure.microsoft.com/blog/vm-image-powershell-how-to-blog-post/)
* [About VM images in Azure](https://msdn.microsoft.com/library/azure/dn790290.aspx)

### Set up the necessary tools, PowerShell and Azure classic CLI
* [How to setup PowerShell](/powershell/azure/overview)
* [How to setup Azure classic CLI](../cli-install-nodejs.md)

### 4.1 Create a user VM image
#### Capture VM
Please read the links given below for guidance on capturing the VM using API/PowerShell/Azure CLI.

* [API](https://msdn.microsoft.com/library/mt163560.aspx)
* [PowerShell](../virtual-machines/windows/capture-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Azure CLI](../virtual-machines/linux/capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

### Generalize Image
Please read the links given below for guidance on capturing the VM using API/PowerShell/Azure CLI.

* [API](https://msdn.microsoft.com/library/mt269439.aspx)
* [PowerShell](../virtual-machines/windows/capture-image.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)
* [Azure CLI](../virtual-machines/linux/capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)

### 4.2 Deploy a VM from a user VM image
To deploy a VM from a user VM image, you can use the current [Azure portal](https://manage.windowsazure.com) or PowerShell.

**Deploy a VM from the current Azure portal**

1. Go to **New** > **Compute** > **Virtual machine** > **From gallery**.

2. Go to **My images**, and then select the VM image from which to deploy a VM:

   1. Pay close attention to which image you select, because the **My images** view lists both operating system images and VM images.
   2. Looking at the number of disks can help determine what type of image you are deploying, because the majority of VM images have more than one disk. However, it is still possible to have a VM image with only a single operating system disk, which would then have **Number of disks** set to 1.

      ![drawing][img-manage-vm-select]
3. Follow the VM creation wizard and specify the VM name, VM size, location, user name, and password.

**Deploy a VM from PowerShell**

To deploy a large VM from the generalized VM image just created, you can use the following cmdlets.

    $img = Get-AzureVMImage -ImageName "myVMImage"
    $user = "user123"
    $pass = "adminPassword123"
    $myVM = New-AzureVMConfig -Name "VMImageVM" -InstanceSize "Large" -ImageName $img.ImageName | Add-AzureProvisioningConfig -Windows -AdminUsername $user -Password $pass
    New-AzureVM -ServiceName "VMImageCloudService" -VMs $myVM -Location "West US" -WaitForBoot

> [!IMPORTANT]
> Please refer [Troubleshooting common issues encountered during VHD creation] for additional assistance.
>
>

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

Note:The following instructions are applicable only for unmanaged disks which are the only kind supported.

* When generating shared access signature URIs for your VHDs, List and Read­ permissions are sufficient. Do not provide Write or Delete access.
* The duration for access should be a minimum of three (3) weeks from when the shared access signature URI is created.
* To safeguard for UTC time, select the day before the current date. For example, if the current date is October 6, 2014, select 10/5/2014.

SAS URL can be generated in multiple ways to share your VHD for Azure Marketplace.
Following are the 3 recommended tools:

1.	Azure Storage Explorer
2.	Microsoft Storage Explorer
3.	Azure CLI

**Azure Storage Explorer (Recommended for Windows Users)**

Following are the steps for generating SAS URL by using Azure Storage Explorer

1. Download [Azure Storage Explorer 6 Preview 3](https://azurestorageexplorer.codeplex.com/) from CodePlex. Go to [Azure Storage Explorer 6 Preview](https://azurestorageexplorer.codeplex.com/) and click **"Downloads"**.

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_01.png)

2. Download [AzureStorageExplorer6Preview3.zip](https://azurestorageexplorer.codeplex.com/downloads/get/891668) and install after unzipping it.

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_02.png)

3. After it is installed, open the application.
4. Click **Add Account**.

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_03.png)

5. Specify the storage account name, storage account key, and storage endpoints domain. This is the storage account in your Azure subscription where you have kept your VHD on Azure portal.

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_04.png)

6. Once Azure Storage Explorer is connected to your specific storage account, it will start showing all of the contains within the storage account. Select the container where you copied the operating system disk VHD file (also data disks if they are applicable for your scenario).

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_05.png)

7. After selecting the blob container, Azure Storage Explorer starts showing the files within the container. Select the image file (.vhd) that needs to be submitted.

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_06.png)

8.	After selecting the .vhd file in the container, click the **Security** tab.

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_07.png)

9.	In the **Blob Container Security** dialog box, leave the defaults on the **Access Level** tab, and then click **Shared Access Signatures** tab.

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_08.png)

10.	Follow the steps below to generate a shared access signature URI for the .vhd image:

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_09.png)

    a. **Access permitted from:** To safeguard for UTC time, select the day before the current date. For example, if the current date is October 6, 2014, select 10/5/2014.

    b. **Access permitted to:** Select a date that is at least 3 weeks after the **Access permitted from** date.

    c. **Actions permitted:** Select the **List** and **Read** permissions.

    d. If you have selected your .vhd file correctly, then your file appears in **Blob name to access** with extension .vhd.

    e. Click **Generate Signature**.

    f. In **Generated Shared Access Signature URI of this container**, check for the following as highlighted above:

       - Make sure that your image file name and **".vhd"** are in the URI.
       - At the end of the signature, make sure that **"=rl"** appears. This demonstrates that Read and List access was provided successfully.
       - In middle of the signature, make sure that **"sr=c"** appears. This demonstrates that you have container level access

11.	To ensure that the generated shared access signature URI works, click **Test in Browser**. It should start the download process.

12.	Copy the shared access signature URI. This is the URI to paste into the Publishing Portal.

13.	Repeat steps 6-10 for each VHD in the SKU.

**Microsoft Azure Storage Explorer (Windows/MAC/Linux)**

Following are the steps for generating SAS URL by using Microsoft Azure Storage Explorer

1.	Download Microsoft Azure Storage Explorer form [http://storageexplorer.com/](http://storageexplorer.com/) website. Go to [Microsoft Azure Storage Explorer](http://storageexplorer.com/releasenotes.html) and click **“Download for Windows”**.

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_10.png)

2.	After it is installed, open the application.

3.	Click **Add Account**.

4.	Configure Microsoft Azure Storage Explorer to your subscription by sign in to your account

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_11.png)

5.	Go to storage account and select the Container

6.	Select **“Get Share Access Signature..”** by using Right Click of the **container**

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_12.png)

7.	Update Start time, Expiry time and Permissions as per following

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_13.png)

    a.	**Start Time:** To safeguard for UTC time, select the day before the current date. For example, if the current date is October 6, 2014, select 10/5/2014.

    b.	**Expiry Time:** Select a date that is at least 3 weeks after the **Start Time** date.

    c.	**Permissions:** Select the **List** and **Read** permissions

8.	Copy Container shared access signature URI

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_14.png)

    Generated SAS URL is for container Level and now we need to add VHD name in it.

    Format of Container Level SAS URL: `https://testrg009.blob.core.windows.net/vhds?st=2016-04-22T23%3A05%3A00Z&se=2016-04-30T23%3A05%3A00Z&sp=rl&sv=2015-04-05&sr=c&sig=J3twCQZv4L4EurvugRW2klE2l2EFB9XyM6K9FkuVB58%3D`

    Insert VHD name after the container name in SAS URL as below
    `https://testrg009.blob.core.windows.net/vhds/<VHD NAME>?st=2016-04-22T23%3A05%3A00Z&se=2016-04-30T23%3A05%3A00Z&sp=rl&sv=2015-04-05&sr=c&sig=J3twCQZv4L4EurvugRW2klE2l2EFB9XyM6K9FkuVB58%3D`

    Example:

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_15.png)

    TestRGVM201631920152.vhd is the VHD Name then VHD SAS URL will be
`https://testrg009.blob.core.windows.net/vhds/TestRGVM201631920152.vhd?st=2016-04-22T23%3A05%3A00Z&se=2016-04-30T23%3A05%3A00Z&sp=rl&sv=2015-04-05&sr=c&sig=J3twCQZv4L4EurvugRW2klE2l2EFB9XyM6K9FkuVB58%3D`

    - Make sure that your image file name and **".vhd"** are in the URI.
    - In middle of the signature, make sure that **"sp=rl"** appears. This demonstrates that Read and List access was provided successfully.
    - In middle of the signature, make sure that **"sr=c"** appears. This demonstrates that you have container level access

9.	To ensure that the generated shared access signature URI works, test it in browser. It should start the download process

10.	Copy the shared access signature URI. This is the URI to paste into the Publishing Portal.

11.	Repeat these steps for each VHD in the SKU.

**Azure classic CLI (Recommended for Non-Windows & Continuous Integration)**

Following are the steps for generating SAS URL by using Azure classic CLI

[!INCLUDE [outdated-cli-content](../../includes/contains-classic-cli-content.md)]

1.	Download the Azure classic CLI from [here](https://azure.microsoft.com/en-in/documentation/articles/xplat-cli-install/). You can also find different links for **[Windows](http://aka.ms/webpi-azure-cli)** and **[MAC OS](http://aka.ms/mac-azure-cli)**.

2.	Once it is downloaded, please install

3.	Create a PowerShell (or other script executable) file with following code and save it locally

          $conn="DefaultEndpointsProtocol=https;AccountName=<StorageAccountName>;AccountKey=<Storage Account Key>"
          azure storage container list vhds -c $conn
          azure storage container sas create vhds rl <Permission End Date> -c $conn --start <Permission Start Date>  

    Update the following parameters in above

    a. **`<StorageAccountName>`**: Give your storage account name

    b. **`<Storage Account Key>`**: Give your storage account key

    c. **`<Permission Start Date>`**: To safeguard for UTC time, select the day before the current date. For example, if the current date is October 26, 2016, then value should be 10/25/2016. If using Azure CLI version 2.0 or higher, provide both the date and time in the Start and End Dates, for example: 10-25-2016T00:00:00Z.

    d. **`<Permission End Date>`**: Select a date that is at least 3 weeks after the **Start Date**. The value should be **11/02/2016**. If using Azure CLI version 2.0 or higher, provide both the date and time in the Start and End Dates, for example: 11-02-2016T00:00:00Z.

    Following is the example code after updating proper parameters

          $conn="DefaultEndpointsProtocol=https;AccountName=st20151;AccountKey=TIQE5QWMKHpT5q2VnF1bb+NUV7NVMY2xmzVx1rdgIVsw7h0pcI5nMM6+DVFO65i4bQevx21dmrflA91r0Vh2Yw=="
          azure storage container list vhds -c $conn
          azure storage container sas create vhds rl 11/02/2016 -c $conn --start 10/25/2016  

4.	Open Powershell editor with “Run as Administrator” mode and open file in step #3. You can use any script editor that is available on your OS.

5.	Run the script and it will provide you the SAS URL for container level access

    Following will be the output of the SAS Signature and copy the highlighted part in a notepad

    ![drawing](media/marketplace-publishing-vm-image-creation/img5.2_16.png)

6.	Now you will get container level SAS URL and you need to add VHD name in it.

    Container level SAS URL #

    `https://st20151.blob.core.windows.net/vhds?st=2016-10-25T07%3A00%3A00Z&se=2016-11-02T07%3A00%3A00Z&sp=rl&sv=2015-12-11&sr=c&sig=wnEw9RfVKeSmVgqDfsDvC9IHhis4x0fc9Hu%2FW4yvBxk%3D`

7.	Insert VHD name after the container name in SAS URL as shown below
    `https://st20151.blob.core.windows.net/vhds/<VHDName>?st=2016-10-25T07%3A00%3A00Z&se=2016-11-02T07%3A00%3A00Z&sp=rl&sv=2015-12-11&sr=c&sig=wnEw9RfVKeSmVgqDfsDvC9IHhis4x0fc9Hu%2FW4yvBxk%3D`

    Example:

    TestRGVM201631920152.vhd is the VHD Name then VHD SAS URL will be

    `https://st20151.blob.core.windows.net/vhds/ TestRGVM201631920152.vhd?st=2016-10-25T07%3A00%3A00Z&se=2016-11-02T07%3A00%3A00Z&sp=rl&sv=2015-12-11&sr=c&sig=wnEw9RfVKeSmVgqDfsDvC9IHhis4x0fc9Hu%2FW4yvBxk%3D`

    - Make sure that your image file name and ".vhd" are in the URI.
    -	In middle of the signature, make sure that "sp=rl" appears. This demonstrates that Read and List access was provided successfully.
    -	In middle of the signature, make sure that "sr=c" appears. This demonstrates that you have container level access

8.	To ensure that the generated shared access signature URI works, test it in browser. It should start the download process

9.	Copy the shared access signature URI. This is the URI to paste into the Publishing Portal.

10.	Repeat these steps for each VHD in the SKU.


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
   * Versions should be of the form X.Y.Z, where X, Y, and Z are integers.
   * Images in different SKUs can have different major and minor versions.
   * Versions within a SKU should only be incremental changes, which increase the patch version (Z from X.Y.Z).
9. In the **OS VHD URL** box, enter the shared access signature URI created for the operating system VHD.
10. If there are data disks associated with this SKU, select the logical unit number (LUN) to which you would like this data disk to be mounted upon deployment.
11. In the **LUN X VHD URL** box, enter the shared access signature URI created for the first data VHD.

    ![drawing](media/marketplace-publishing-vm-image-creation/vm-image-pubportal-skus-3.png)


## Common SAS URL issues & fixes

|Issue|Failure Message|Fix|Documentation Link|
|---|---|---|---|
|Failure in copying images - "?" is not found in SAS url|Failure: Copying Images. Not able to download blob using provided SAS Uri.|Update the SAS Url using recommended tools|[https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/)|
|Failure in copying images - “st” and “se” parameters not in SAS url|Failure: Copying Images. Not able to download blob using provided SAS Uri.|Update the SAS Url with Start and End dates on it|[https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/)|
|Failure in copying images - “sp=rl” not in SAS url|Failure: Copying Images. Not able to download blob using provided SAS Uri|Update the SAS Url with permissions set as “Read” & “List|[https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/)|
|Failure in copying images - SAS url have white spaces in vhd name|Failure: Copying Images. Not able to download blob using provided SAS Uri.|Update the SAS Url without white spaces|[https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/)|
|Failure in copying images – SAS Url Authorization error|Failure: Copying Images. Not able to download blob due to authorization error|Regenerate the SAS Url|[https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/)|
|Failure in copying images – SAS Url "st" and "se" parameters do not have full date-time specification|Failure: Copying Images. Not able to download blob due to incorrect SAS Url |SAS Url Start and End Date parameters ("st", "se") are required to have full date-time specification, such as 11-02-2017T00:00:00Z, and not only the date or shortened versions for the time. It is possible to encounter this scenario using Azure CLI version 2.0 or higher. Be sure to provide the full date-time specification and regenerate the SAS Url.|[https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/](https://azure.microsoft.com/documentation/articles/storage-dotnet-shared-access-signature-part-1/)|

## Next step
After you are done with the SKU details, you can move forward to the [Azure Marketplace marketing content guide][link-pushstaging]. In that step of the publishing process, you provide the marketing content, pricing, and other information necessary prior to **Step 3: Testing your VM offer in staging**, where you test various use-case scenarios before deploying the offer to the Azure Marketplace for public visibility and purchase.  

## See also
* [Getting started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

[img-acom-1]:media/marketplace-publishing-vm-image-creation/vm-image-acom-datacenter.png
[img-portal-vm-size]:media/marketplace-publishing-vm-image-creation/vm-image-portal-size.png
[img-portal-vm-create]:media/marketplace-publishing-vm-image-creation/vm-image-portal-create-vm.png
[img-portal-vm-location]:media/marketplace-publishing-vm-image-creation/vm-image-portal-location.png
[img-portal-vm-rdp]:media/marketplace-publishing-vm-image-creation/vm-image-portal-rdp.png
[img-azstg-add]:media/marketplace-publishing-vm-image-creation/vm-image-storage-add.png
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
[link-azure-2]:../storage/blobs/storage-dotnet-shared-access-signature-part-2.md
[link-azure-1]:../storage/common/storage-dotnet-shared-access-signature-part-1.md
[link-msft-download]:http://www.microsoft.com/download/details.aspx?id=44299
[link-technet-3]:https://technet.microsoft.com/library/hh846766.aspx
[link-technet-2]:https://msdn.microsoft.com/library/dn495261.aspx
[link-azure-portal]:https://portal.azure.com
[link-pubportal]:https://publish.windowsazure.com
[link-acct-creation]:marketplace-publishing-accounts-creation-registration.md
[link-technet-1]:https://technet.microsoft.com/library/hh848454.aspx
[link-azure-vm-2]:./virtual-machines-linux-agent-user-guide/
[link-openssl]:https://www.openssl.org/
[link-intsvc]:http://www.microsoft.com/download/details.aspx?id=41554
[link-python]:https://www.python.org/
