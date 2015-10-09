<properties
   pageTitle="Creating a Virtual Machine Image for the Azure Marketplace | Microsoft Azure"
   description="Detailed instructions on how to create a virtual machine image for the Azure Marketplace for others to purchase."
   services="Azure Marketplace"
   documentationCenter=""
   authors="HannibalSII"
   manager=""
   editor=""/>

<tags
   ms.service="marketplace-publishing"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="Azure"
   ms.workload="na"
   ms.date="10/09/2015"
   ms.author="hascipio; v-divte"/>

# Guide to create a virtual machine image for the Azure Marketplace

This article, **Step 2**, will walk through preparing your VHDs, which are the foundation of your SKU, that you will deploy to the Azure Marketplace. The process will differ depending on whether your are providing a Linux- or Windows-based SKU. This section covers both scenarios. This process can be performed in parallel with [Account Creation and Registration][link-acct-creation].

## 1. Define Offers and SKUs

In this section, you will define the Offers and the SKUs underneath them.

An offer is a "parent" to all of its SKUS. You can have multiple offers. How you decide to structure your offers is up to you. When an offer is pushed to staging, it is pushed along with all of its SKUs. Carefully consider your SKU identifiers, as these will be visible in the URL.

- Azure.com – http://azure.microsoft.com/marketplace/partners/{PartnerNamespace}/{OfferIdentifier}-{SKUidentifier}

- Azure Preview Portal - https://portal.azure.com/#gallery/{PublisherNamespace}.{OfferIdentifier}{SKUIDdentifier}  

A SKU is the commercial name for a VM Image. A VM Image contains one OS disk and zero or more data disks. It is essentially the complete storage profile for a virtual machine. One VHD is needed per disk; even blank data disks require a VHD to be created.

Regardless of which operating system you use, add only the minimum number of data disks needed by the SKU. The end user cannot remove disks that are part of an image at time of deployment, but can always add disks during or after deployment if they need them.

### 1.1 Add an offer

1. Log in to the [Publishing Portal][link-pubportal] using your seller account.
2. Enter the **Virtual Machines** tab of the Publishing Portal. In the prompted entry field, enter your offer name and create.
3. Offer name is typically the name of the product / service that you plan to sell in Azure Marketplace.

### 1.2 Define SKU(s)
Once you have added an offer, you will need to define/identify your SKU(s). You can have multiple offers and each offer can have multiple SKUs under it. When an offer is pushed to staging, it is pushed along with all of its SKUs.

1. **Add a SKU.** It will require an identifier, which will be used in the URL. This will need to be unique within your Publishing Profile, but there is no risk of identifier collision with other publishers.

> [AZURE.NOTE] Offer and SKU identifier will be displayed in the offer URL in the Marketplace.

2. **Add a summary description for your SKU.** This will be read by humans in the UX, so it advised to make it easily readable. This information does not need to be locked until "Push to Staging". Until then, you are free to edit it.
3. If you are using Windows-based SKUs, follow the suggested links to acquire the approved versions of Windows Server.

## 2. Create an Azure-compatible VHDs (Linux-based)
The following section focuses on best practices for creating a Linux-based  VM Image for the Microsoft Azure Marketplace. For a step-by-step walkthrough, refer to the following documentation: [Creating and Uploading a Virtual Hard Disk that Contains the Linux Operating System][link-azure-vm-1]

> [AZURE.TIP] Many of the following steps (e.g. agent install, kernel boot parameters) are already taken care of for Linux images available from the Microsoft Azure Image Gallery.   Thus, starting with one of these images as a base can represent a time-savings vs. configuring a non-Azure aware Linux image.

### 2.1 Choose the correct VHD size
Published SKUs (VM Images) should be designed to work with all VM sizes that support the number of disks for the SKU. You can provide guidance on recommended sizes, but these will be treated as recommendations and not enforced.

1. Linux OS VHD: The Linux OS VHD in your VM Image should be created a a 30GB - 50GB fixed-format VHD. It cannot be less than 30GB. If the physical size is less than VHD size, the VHD should be sparse. Linux VHDs larger than 50GB will be considered on a case by case basis. If you already have a VHD in a different format, you can use the [Convert-VHD PowerShell cmdlet to change the format][link-technet-1].
2. Data disk VHD: Data disks can be as large as 1TB. Data disk VHDs should be created as a fixed-format VHD, but also be sparse. When deciding on the disk size, please keep in mind that end users cannot resize VHDs within an image.

### 2.2 Ensure the latest Azure Linux Agent is installed
When preparing the OS VHD, make sure the latest [Azure Linux Agent][link-azure-vm-2] is installed. Using the RPM or Deb packages.The package is often named walinuxagent or WALinuxAgent, but check with your distribution to be certain. The agent provides key functions for deploying Linux IaaS deployments in Azure, such as VM provisioning and networking capabilities.  

While the agent can be configured in a variety of ways, we recommend that you use a generic agent configuration to maximize compatibility. While it is possible to install the Agent manually, it is strongly recommended that you use the preconfigured packages from your distribution if available.

If you do choose to install the agent manually from the [GitHub repository][link-github-waagent], first copy the 'waagent' file to /usr/sbin and run the following commands as root:

    # chmod 755 /usr/sbin/waagent
    # /usr/sbin/waagent -install

The agent configuration file will be placed at /etc/waagent.conf.

### 2.3 Verify that required libraries are included
In addition to the Azure Linux Agent, the following libraries should also be included:

1. The [Linux Integration Services][link-intsvc] Version 3.0 or higher must be enabled in your kernel. See [Linux Kernel Requirements](../virtual-machines/virtual-machines-linux-create-upload-vhd-generic/#linux-kernel-requirements)
2. [Kernel Patch](https://git.kernel.org/cgit/linux/kernel/git/torvalds/linux.git/commit/drivers/scsi/storvsc_drv.c?id=5c1b10ab7f93d24f29b5630286e323d1c5802d5c) for Azure I/O stability (likely not needed for any recent kernel, but should be verified)
3. [Python][link-python] 2.6 or above
4. Python] pyasn1 package, if not already installed
5. [OpenSSL][link-openssl] (v1.0 or greater recommended)

### 2.4 Set up disk partitions
We recommend **not** using Logical Volume Manager. Create a single root partition for the OS disk. Do not use a swap partition on the OS or data disk. We do recommend removing a swap partition, even if it is not mounted in /etc/fstab.  If needed, a swap partition can be created on the local resource disk (/dev/sdb) by the Linux Agent.

### 2.5 Add required Kernel Boot line parameters
The following parameters also need to be added to the Kernel Boot Line:

        console=ttyS0 earlyprintk=ttyS0 rootdelay=300

This ensures that Azure Support can provide customers with serial console output when needed. It also provides adequate timeout for OS disk mounting from cloud storage. Even if your SKU blocks end customer from directly SSHing into the virtual machine, serial console output must be enabled.

### 2.6 Include SSH Server by Default
We strongly recommend enabling SSH for the end user. If SSH Server is enabled, add the SSH keep alive to sshd config with the following option: ClientAliveInterval 180. While 180 is recommended, the acceptable range is 30 to 235. Not all applications desire allowing direct SSH to the virtual machine for the end user. If SSH is explicitly blocked, the ClientAliveInterval does not need to be set.

### 2.7 Meet networking requirements
The following are networking requirements for an Azure-compatible Linux VM Image.

- In many cases it is best to disable NetworkManager.  One exception is with CentOS 7.x based systems (and derivatives) which should keep NetworkManager enabled.
- Networking configuration should be controllable via the ifup/ifdown scripts.  The Linux agent may use these commands to restart networking during provisioning.
- There should be no custom network configuration. The resolv.conf file should be deleted as a final step. This is typically done as part of deprovisioning (see [Azure Linux Agent User Guide](../virtual-machines/virtual-machines-linux-agent-user-guide/)). You can also perform this step manually with the following command:

        rm /etc/resolv.conf

- The network device needs to be brought up on boot and use DHCP.
- IPv6 6 is not supported on Azure. If this property is enabled, it will not work.

### 2.8  Ensure security best are in placed
It is critical for SKUs in the Azure Marketplace to follow best practices in regards to security. These include the following:

- Install all security patches for your distribution.
- Follow distribution security guidelines.
- Avoid creating default accounts, which remain the same, across provisioning instances.
- Clear bash history entries.
- Include iptables (firewall) software, but do not enable any rules. This will provide a seamless default experience for customers. Customers who want to use a VM firewall for additional configuration can configure the iptables rules to meet their specific needs.

### 2.9 Generalize the image
All images in the Azure Marketplace must be re-usable in a generic fashion, which requires stripping them of certain configuration specifics. To accomplish this in Linux, the OS VHD must be deprovisioned.

The Linus command for deprovisioning is as follows:

        # waagent -deprovision

The command automatically performs the following actions:

- Removes the nameserver configuration in /etc/resolv.conf
- Removes cached DHCP client leases
- Resets host name to localhost.localdomain

We recommend setting the configuration file (/etc/waagent.conf) to ensure the following actions are also completed:

- Set Provisioning.RegenerateSshHostKeyPair to 'y' in the configuration file to remove all SSH host keys.
- Set Provisioning.DeleteRootPassword to 'y' in the configuration file to remove the ‘root’ password from /etc/shadow. For documentation of the contents of the configuration file, see the “CONFIGURATION” section of the README file on the Agent Github repository page ([https://github.com/Azure/WALinuxAgent](https://github.com/Azure/WALinuxAgent) and scroll downward).  

At this point, you have completed generalizing of the Linux VM.   Shut down the VM either from the Azure Portal, command line or from within the VM.  When shutdown is complete, continue at Step 3.4.

## 3. Create an Azure-compatible VHDs (Windows-based)
The following section focuses on the steps to create a SKU based on Windows Server for the Microsoft Azure Marketplace.

### 3.1 Ensure you are using the correct base VHDs
The OS VHD for your VM Image must be based on a Microsoft Azure-approved base image, containing Windows Server or SQL Server.

To begin, create a VM from one of the following images, located at the [Microsoft Azure Portal][link-azure-portal]:

- Windows Server ([2012 R2 Datacenter][link-datactr-2012-r2], [2012 Datacenter][link-datactr-2012], [2008 R2 SP1][link-datactr-2008-r2])
- SQL Server 2014 ([Enterprise][link-sql-2014-ent], [Standard][link-sql-2014-std], [Web][link-sql-2014-web])
- SQL Server 2012 SP2 ([Enterprise][link-sql-2012-ent], [Standard][link-sql-2012-std], [Web][link-sql-2012-web])

These links can also be found in the Publishing Portal under the SKU page.

> [AZURE.TIP] if you are using the current Azure Management Portal or PowerShell, Windows Server Images published on September 8, 2014 and later are approved.


### 3.2 Create your Windows VM
From the Microsoft Azure Portal, you can create your VM based on an approved base image in just a few simple steps. The following is an overview of the process.

1. From the base image page, select **Create VM** to be directed to the new [Microsoft Azure Portal][link-azure-portal].

    ![drawing][img-acom-1]

2. Log in to the portal with the Microsoft account (MSA) and password for the Azure subscription you wish to use.
3. Follow the prompts to create a VM using the base image you have selected. At the very least, you will need to provide a host name (name of the computer), username (admin user registered), and password for the VM.

    ![drawing][img-portal-vm-create]

4. Select the size of the VM to deploy.

    a.	If you plan to develop the VHD on premises, the size does not matter. Consider using one of the smaller VMs.

    b.	If you plan to develop the image in Azure, consider using one of the recommended VM sizes for the selected image.

    c.	For pricing information, refer to the Recommended Pricing Tier selector displayed on the portal. It will provide the three recommended sizes provided by the publisher. (In this case, the publisher is Microsoft.)

    ![drawing][img-portal-vm-size]

5. Set properties

    a.	For quick deployment, you can leave the default values for the properties under **Optional Configuration** and **Resource Group**.

    b.	If desired, under Storage Account, you can select the storage account in which the OS VHD will be stored.

    c.	If desired, under Resource Group, you can select the logical group in which to place the VM.
6. Select the **Location** to which to deploy.

    a.	If you plan to develop the VHD on premises, the location does not matter as you will be uploading the image to Azure later.

    b.	If you plan to develop the image in Azure, consider using one of the US-based Microsoft Azure regions from the beginning. This will speed up the VHD copying process that Microsoft performs on your behalf when you submit your image for certification.

    ![drawing][img-portal-vm-location]

7. Click **Create**. The VM will begin deploying. Within minutes, you will have a successful deployment and can begin to create the image for your SKU.

### 3.3 Develop your VHD in the cloud
It is strongly recommended that you develop your VHD in the cloud using Remote Desktop Protocol (RDP). You will connect to RDP with the username and password specifid during provisioning.

> [AZURE.IMPORTANT]: if you are developing your VHD on-premises (which is not recommended) see [Creating a Virtual Machine Image on-premise](marketplace-publishing-vm-image-creation-on-premise.md). **Downloading your VHD is NOT necessary if you are developing in the cloud**.


**Connect via RDP using the [Microsoft Azure Portal][link-azure-portal]**

1. Select **Browse** and then **VMs**.
2. The VMs blade will open. Ensure the VM you want to connect with is running and select it from the list of deployed VMs.
3. A blade opens describing the selected VM. At the top, click **Connect**.
4. You will be prompted to enter the username and password you specified a time of provisioning.

**Connect via RDP using PowerShell**

To download a remote desktop file to a local machine, use the [Get-AzureRemoteDesktopFile cmdlet][link-technet-2]. In order to use this cmdlet, you will need to know the name of the service and name of the VM. If you created the VM from the [Microsoft Azure Portal][link-azure-portal], you can find this information under VM properties.

1. In the Microsoft Azure Portal, select **Browse** and then **VMs**.
2. The **Virtual Machines** blade will open. Select the VM that you deployed from the list of VMs.
3. A blade opens describing the selected VM.
4. Click **Properties**
5. The first portion of the domain name is the service name. The host name is the VM name.

    ![drawing][img-portal-vm-rdp]

6. The cmdlet to download the RDP file for the created VM to the Administrator's local dekstop is as follows:

        Get‐AzureRemoteDesktopFile ‐ServiceName “baseimagevm‐6820cq00” ‐Name “BaseImageVM” –LocalPath “C:\Users\Administrator\Desktop\BaseImageVM.rdp”

More information about RDP can be found on MSDN in the article [Connect to an Azure VM with RDP or SSH](http://msdn.microsoft.com/library/azure/dn535788.aspx).

**Configure a VM and create your SKU**

Once the OS VHD is downloaded, use Hyper­V and configure a VM to begin creating your SKU. Detailed steps can be found at the following TechNet link: [Install Hyper­V and Configure a VM](http://technet.microsoft.com/library/hh846766.aspx).

### 3.4 Choose the correct VHD size
The Windows OS VHD in your VM Image should be created as a 128 GB fixed format VHD.  

If the physical size is less than 128GB, the VHD should be sparse. The base Windows and SQL Server images provided already meet these requirements; do not change the format or the size of the VHD obtained.  

Data disks can be as large as 1TB. When deciding on the disk size, remember that end users cannot resize VHDs within an image at time of deployment. Data disk VHDs should be created as a fixed format VHD, but also be sparse. Data disks can be empty or contain data.


### 3.5 Install the latest Windows patches
The base images contain the latest patches up to their published date. Before publishing the OS VHD you have created, ensure that Windows Update has been run and that all the latest 'Critical' and 'Important' security updates have been installed.

### 3.6 Perform additional configuration and schedule tasks as necessary
If additional configuration is needed, consider using a scheduled task that runs at startup to make any final changes to the VM once it has been deployed.

- It is as best practice to have the task delete itself upon successful execution.
- No configuration should rely on drives other than C:\ or D:\, since these are the only two drives that are always guaranteed to exist. C:\ is the OS disk and D:\ is the temporary local disk.

### 3.7 Generalize the image
All images in the Azure Marketplace must be re-usable in a generic fashion. In other words, the OS VHD must be generalized.

- For Windows, the image should be "sysprepped" and no configurations should be done that do not support the 'sysprep' command.
- You can run the below command from the directory %windir%\System32\Sysprep.

        sysprep.exe /generalize /oobe /sshutdown

  Guidance on how to sysprep the operating system is provided in Step of the following MSDN article - [Create and upload a Windows Server VHD to Azure](../virtual-machines/virtual-machines-create-upload-vhd-windows-server/).

## 4. Deploy a VM from your VHDs
Once your VHD(s), generalized OS VHD and zero or more data disk VHDs, are uploaded to an Azure storage account, you can register them as a user VM Image with which to test. Note, since your OS VHD is generalized, you cannot directly deploy the VM by providing the VHD URL.

To learn more about VM Images review the following blog posts:

- [VM Image](https://azure.microsoft.com/blog/vm-image-blog-post/)
- [VM Image PowerShell How To](https://azure.microsoft.com/blog/vm-image-powershell-how-to-blog-post/)
- [About VM Images in Azure](https://msdn.microsoft.com/library/azure/dn790290.aspx)

### 4.1 Create a User VM Image
To create a user VM Image from your SKU to begin deploying multiple VMs, you need to use the [Create VM Image Rest API](http://msdn.microsoft.com/library/azure/dn775054.aspx) to register VHDs as a VM Image.

You can use the Invoke-WebRequest cmdlet to create a VM Image from PowerShell. The below PowerShell script shows how to create a VM Image with an OS disk and one data disk. Note, the PowerShell session should already be set up and a subscription set.

        # Image Parameters to Specify
        $ImageName=’ENTER-YOUR-OWN-IMAGE-NAME-HERE’
        $Label='ENTER-YOUR-LABEL-HERE'
        $Description='DESCRIBE YOUR IMAGE HERE’
        $osCaching='ReadWrite' $os = 'Windows'
        $state = 'Generalized'
        $osMediaLink = 'https://mystorageaccount.blob.core.windows.net/vhds/myosvhd.vhd'
        $dataCaching='None'
        $lun='1'
        $dataMediaLink='http://mystorageaccount.blob.core.windows.net/vhds/mydatavhd.vhd'
        # Subscription Related Properties
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


By running this script, you create a user VM Image with the name you provided to the ImageName parameter, myVMIMage. It consists of one OS disk and one data disk.

This API is an asynchronous operation and responds with a 202 accepted. In order to see whether the VM Image has been created, you will need to query for operation status. The x-ms-request-id in the return response is the operation id. This id should be set in $opId below.

        $opId = #Fill In With Operation ID
        $uri2 = $SrvMngtEndPoint + "/" + $SubId + "/" + "operations" + "/" + "opId"
        $response2 = Invoke‐WebRequest ‐Uri $uri2 ‐ContentType "application/xml" ‐Certificate $certificate ‐Headers $headers ‐Method GET

To create a VM Image from an OS VHD and an additional empty data disks (you do not have the VHD for this disk
created), with the Create VM Image API, use the following script:

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
        # Subscription Related Properties
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

By running this script, you create a user VM Image with the name you provided to the ImageName parameter, myVMImage. It consists of one OS disk and one data disk.

This API is an asynchronous operation and responds with a 202 accepted.  In order to see whether the VM Image has been created, you will need to query for operation status.  The x-ms-request-id in the return response is the operation id.  This id should be set in $opId below.

        $opId = #Fill In With Operation ID
        $uri2 = $SrvMngtEndPoint + "/" + $SubId + "/" + "operations" + "/" + "$opId"
        $response2 = Invoke-WebRequest -Uri $uri2 -ContentType "application/xml" Certificate $certificate -Headers $headers -Method GET

To create a VM Image from an OS VHD and an additional empty data disks (you do not have the VHD for this disk created), with the Create VM Image API, use the following script:

        # Image Parameters to Specify
        $ImageName=’myVMImage’
        $Label='IMAGE_LABEL'
        $Description='My VM Image to Test’
        $osCaching='ReadWrite' $os = 'Windows'
        $state = 'Generalized'
        $osMediaLink =
        'http://mystorageaccount.blob.core.windows.net/containername/myOSvhd.vhd'
        $dataCaching='None'
        $lun='1'
        $emptyDiskSize= 32
        # Subscription Related Properties
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

By running this script, you create a user VM Image with the name you provided to the ImageName parameter “myVMImage”.  It consists of one OS disk, based on the VHD you passed, and one empty 32 GB data disk.

### 4.2 Deploy VM from a a user VM Image
To deploy a VM from a user VM Image, you can use the current [Azure Management Portal](https://manage.windowsazure.com) or PowerShell.

**Deploy a VM from the current Azure Management Portal**

1. Go to **New > Compute > VM > From Gallery**.

    ![drawing][img-manage-vm-new]

2. Go to **My Images** and select the VM Image from which to deploy a VM.
  1. Pay close attention to which image you select, since the 'My Images' view lists both OS Images and VM Images.
  2. Looking at the number of disks can help determine what type of image you are deploying, since the majority of VM Images will have more than one disk. However, it is still possible to have a VM Image with only a single OS disk, which would then have a 'number of disks' set to one.

    ![drawing][img-manage-vm-select]

3. Follow the VM creation wizard, specifying the VN name, VM size, location, username, and password.

**Deploy a VM from PowerShell**

To deploy a large VM, from the generalized VM Image just created, the following cmdlets can be used.

    $img = Get‐AzureVMImage ‐ImageName "myVMImage"
    $user = "user123"
    $pass = "adminPassword123"
    $myVM = New‐AzureVMConfig ‐Name "VMImageVM" ‐InstanceSize "Large" ‐ImageName $img.ImageName | Add‐AzureProvisioningConfig ‐Windows ‐AdminUsername $user ‐Password $pass
    New‐AzureVM ‐ServiceName "VMImageCloudService" ‐VMs $myVM ‐Location "West US" ‐WaitForBoot

## 5. Obtain certification for your VM Image
The next step in preparing your VM Image for the Azure Store is to have it certified.

This process includes running a special certification tool, uploading the verification results to the Azure container where your VHDs reside, adding an offer, defining your SKU, and submitting your VM Image for certification.

### 5.1 Download and run the Microsoft Azure Certification Tool
The Microsoft Azure Certification Tool will run against a running VM, provisioned from your user VM Image, to ensure that the VM Image is compatible with Microsoft Azure. It will verify that the guidance and requirements about preparing your VHD have been met. The output of the tool is a compatibility report, which should be uploaded on Publishing Portal while requesting for Certification.

The Certification Tool can be used with both Windows and Linux VMs. It connects to Windows VMs via PowerShell, and connects to Linux VMs via SSH.Net.

1. First, download the Certification Tool at the [Microsoft download site][link-msft-download]
2. Open the Certification Tool and click the **Start New Test** button.
3. From the **Test Information** screen, enter a name for the test run.
4. Choose whether your VM is on Linux or Windows. Depending on which you choose, select the subsequent
options.

### **Connecting the Certification Tool to a Linux VM Image**

1. Select the SSH authentication mode: password or key file.
2. If using password-­based authentication, enter the DNS Name, username, and password.
3. If using key file authentication, enter DNS, username, and private key location.

  ![Password authentication of Linux VM Image][img-cert-vm-pswd-lnx]

  ![Key file authentication of Linux VM Image][img-cert-vm-key-lnx]

### **Connecting the Certification Tool to a Windows VM Image**

1. Enter the fully qualified VM Domain Name System (DNS) e.g., MyVMName.Cloudapp.net.
2. Enter the username and password.

  ![Password authentication of Windows VM Image][img-cert-vm-pswd-win]

Once you have selected the correct options for your Linux or Windows VM Image, press **Test Connection** to ensure
that SSH.Net or PowerShell has a valid connection for testing purposes. Once a connection is established, press **Next** to start the test.

When the test is complete, you will receive the results (Pass/Fail/Warning) for each test element.

![Test cases for Linux VM Image][img-cert-vm-test-lnx]

![Test cases for Windows VM Image][img-cert-vm-test-win]

If any of the tests fail, your image will not be certified.  Please review the requirements and make any necessary changes.

Following the automated test, you will be asked to provide additional input on your VM Image via a questionnaire screen.  Complete the questions and press **Next**

![Certification Tool Questionnaire][img-cert-vm-questionnaire]

![Certification Tool Questionnaire][img-cert-vm-questionnaire-2]

Once you have completed the questionnaire, you can provide additional information like SSH access information for Linux VM Image and explanation for the failed assessments. You can download the test results and log files for the executed test cases as well as your answers to the questionnaire. Save the results in the same container as your VHDs .

![Save certification test results][img-cert-vm-results]

### 5.2 Get the Shared Access Signature Uniform Resource Identifier (URI) for your VM Images

During the publishing process, you will specify the URIs that lead to each of the VHDs you have created for your SKU.
Microsoft needs access to these VHDs during the certification process. Therefore, you will need to create a Shared
Access Signature (SAS) Uniform Resource Identifier (URI) for each VHD. This is the URI that should be entered in the
**Images** tab in the publishing portal.

The SAS URI created should adhere to the following requirements:

- When generating SAS URIs for your VHDs, List and Read­Only permissions are sufficient. Do not provide Write or Delete access.
- The duration for access should be a minimum of 7 business days from when the SAS URI is created.
- To avoid immediate errors due to clock skews, specify a time 15 minutes before the current time.

To create a SAS URI, you can follow the instructions provided in [Shared Access Signatures, Part 1: Understanding the SAS Model][link-azure-1], [Shared Access Signatures, Part 2: Create and Use a SAS with the Blob Service][link-azure-2].

Instead of generating a shared access key using code, you can also use storage tools, such as [Azure Storage Explorer][link-azure-codeplex].

**Use Azure Storage Explorer to generate a shared access key**

1. Download [Azure Storage Explorer][link-azure-codeplex] 6 and above from CodePlex.
2. Once installed, open the application.
3. Click **Add Account**.

    ![drawing][img-azstg-add]

4. Specify the Storage Account Name, Storage Account Key and Storage End Points Domain. **Don’t** select “Use Https”

    ![drawing][img-azstg-setup-1]

5. With the above steps, Azure Storage Explorer is now connected to your specific storage account. It will start showing all the containers within the storage account. Select the container where you have copied the OS Disk VHD File (also data disks if they are applicable for your scenario).

    ![drawing][img-azstg-setup-2]

6. After selecting the Blob container, Azure Storage Explorer Application will start showing the files within the container. Select the image file (.vhd) that needs to be submitted.

    ![drawing][img-azstg-setup-3]

7. After selecting the (.vhd) file in the container, click on the **Security** Tab highlighted below.

    ![drawing][img-azstg-setup-4]

8. By Clicking the **Security** Tab , Following Dialog box will appear, leave the defaults on the Access Level tab and click on Shared Access Signatures tab

    ![drawing][img-azstg-setup-5]

9. On this Tab follow the below steps to generate a SAS URL for the .vhd image

    ![drawing][img-azstg-setup-6]

    a.	Access Permitted from -> Just to safe guard for UTC time, please select from date as a day before the current day. For e.g. if date now is 10/6/2014, select 10/5/2014 here.

    b.	Access Permitted -> Give at least 7 to 8 days.

    c.	Actions Permitted-> Make sure to provide both List and Read Permissions

    d.	If you have selected your .vhd file correctly, under Blob name you would see your file with extension .vhd

    e.	Click on Generate Signature.

    f.	In the Generated Shared Access Signature URI, check for the following as highlighted above

    - i.	Check the url is not starting with https
    - ii.	Your image file name .vhd is in the URI
    - iii.	At the End of the signature make sure you have =rl ( this shows read and list access was provided successfully)
    g.	To ensure the generated SAS URI works, click ‘Test in browser’. It should start download process.
10. Copy the SAS URI. This is the URI to paste into the Publishing Portal.
11. Repeat these steps for each VHD in the SKU.

### 5.3 Provide information about the VM Image and request certification in the Publishing Portal
Once you have created your offer and SKU, you should enter the image details associated with that SKU.

1. Go to [Publishing Portal][link-pubportal] and log in with your seller account.
2. Select the **VM Images** tab
3. The identifier listed at the top of the page is actually the offer identifier and NOT the SKU identifier.
4. Fill out the properties under the SKUs section.

    ![drawing][img-pubportal-vm-skus]

5. Under **Operating System Family**, select the operating system type associated with the OS VHD.
6. Under **Operating System**, describe the operating system. Consider a format such as Operating System Family, Type, Version, and Updates. An example is Windows Server Datacenter 2014 R2.
7. Select 3 recommended virtual machine sizes. These are recommendations that get displayed to the end user in
the Pricing Tier Blade in the Azure Management Portal when they decide to purchase and deploy your image.

  > [AZURE.NOTE] these are only recommendations. The end user is able to select any VM size that accommodates the disks specified in your image.

8. Enter the Version. The version field encapsulates a sematic version to identify the product and its updates.
  -	Versions should be of the form X.Y.Z, where X, Y, and Z are integers.
  -	Images in different SKUs can have different major and minor versions.
  -	Versions within a SKU should only be incremental changes, which increase the patch version (Z from X.Y.Z).
9. Under **OS VHD URL**, enter in the SAS URI created for the OS VHD.
10. If there are data disks associated with this SKU, select the Logical Unit Number (LUN) to which you would like this
data disk to be mounted upon deployment.
11. Under LUN X VHD URL, enter in the SAS URI created for the first data VHD.
12.	Upload your validation / test results from the certification tool.
13.	Click **Request Certification.**
14.	Repeat Steps 11, 12 and 13 for every additional data disk VHD.

    ![drawing][img-pubportal-vm-skus-2]

## Next Step
Once you submit your virtual machine image SKU(s) for certification, you can move forward with [Getting your offer to staging][link-pushstaging]. In this step of the publishing process, you will provide the marketing content, pricing, and other information necessary for **Step 3: Testing your offer and/or SKU in staging** where you will test various use case scenarios before deploying the offer to the Azure Marketplace for public visibility and purchase.  

## See Also
- [Getting Started: How to publish an offer to the Azure Marketplace](marketplace-publishing-getting-started.md)

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
[link-azure-2]:../storage/storage-dotnet-shared-access-signature-part-2/
[link-azure-1]:../storage/storage-dotnet-shared-access-signature-part-1/
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
[link-azure-vm-1]:../virtual-machines/virtual-machines-linux-create-upload-vhd/
[link-technet-1]:https://technet.microsoft.com/library/hh848454.aspx
[link-azure-vm-2]:../virtual-machines/virtual-machines-linux-agent-user-guide/
[link-openssl]:https://www.openssl.org/
[link-intsvc]:http://www.microsoft.com/download/details.aspx?id=41554
[link-python]:https://www.python.org/
