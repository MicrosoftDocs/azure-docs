<properties
   pageTitle="Create and upload a FreeBSD VM image | Microsoft Azure"
   description="Learn to create and upload a virtual hard disk (VHD) that contains the FreeBSD operating system to create an Azure virtual machine"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="KylieLiang"
   manager="timlt"
   editor=""
   tags="azure-service-management"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="06/07/2016"
   ms.author="kyliel"/>

# Create and upload a FreeBSD VHD to Azure

This article shows you how to create and upload a virtual hard disk (VHD) that contains the FreeBSD operating system. After you upload it, you can use it as your own image to create a virtual machine (VM) in Azure.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-classic-include.md)]


## Prerequisites
This article assumes that you have the following items:

- **An Azure subscription**--If you don't have an account, you can create one in just a couple of minutes. If you have an MSDN subscription, see [Monthly Azure credit for Visual Studio subscribers.](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/). Otherwise, learn how to [create a free trial account](https://azure.microsoft.com/pricing/free-trial/).  

- **Azure PowerShell tools**--The Azure PowerShell module must be installed and configured to use your Azure subscription. To download the module, see [Azure downloads](https://azure.microsoft.com/downloads/). A tutorial that describes how install and configure the module is available here. Use the [Azure Downloads](https://azure.microsoft.com/downloads/) cmdlet to upload the VHD.

- **FreeBSD operating system installed in a .vhd file**--A supported   FreeBSD operating system must be installed to a virtual hard disk. Multiple tools exist to create .vhd files. For example, you can use a virtualization solution such as Hyper-V to create the .vhd file and install the operating system. For instructions about how to install and use Hyper-V, see [Install Hyper-V and create a virtual machine](http://technet.microsoft.com/library/hh846766.aspx).

> [AZURE.NOTE] The newer VHDX format is not supported in Azure. You can convert the disk to VHD format by using Hyper-V Manager or the cmdlet [convert-vhd](https://technet.microsoft.com/library/hh848454.aspx). In addition, there is a [tutorial on MSDN about how to use FreeBSD with Hyper-V](http://blogs.msdn.com/b/kylie/archive/2014/12/25/running-freebsd-on-hyper-v.aspx).

This task includes the following five steps.

## Step 1: Prepare the image for upload

On the virtual machine where you installed the FreeBSD operating system, complete the following procedures:

1. Enable DHCP.

		# echo 'ifconfig_hn0="SYNCDHCP"' >> /etc/rc.conf
		# service netif restart

2. Enable SSH.

    SSH is enabled by default after installation from disc. If it isn't enabled for some reason, or if you use FreeBSD VHD directly, type the following:

		# echo 'sshd_enable="YES"' >> /etc/rc.conf
		# ssh-keygen -t dsa -f /etc/ssh/ssh_host_dsa_key
		# ssh-keygen -t rsa -f /etc/ssh/ssh_host_rsa_key
		# service sshd restart

3. Set up a serial console.

		# echo 'console="comconsole vidconsole"' >> /boot/loader.conf
		# echo 'comconsole_speed="115200"' >> /boot/loader.conf

4. Install sudo.

    The root account is disabled in Azure. This means you need to utilize sudo from an unprivileged user to run commands with elevated privileges.

		# pkg install sudo
;
5. Prerequisites for Azure Agent.

		# pkg install python27  
		# pkg install Py27-setuptools27   
		# ln -s /usr/local/bin/python2.7 /usr/bin/python   
		# pkg install git

6. Install Azure Agent.

    The latest release of the Azure Agent can always be found on [github](https://github.com/Azure/WALinuxAgent/releases). The version 2.0.10 + officially supports FreeBSD 10 & 10.1, and the version 2.1.4 officially supports FreeBSD 10.2 and later releases.

		# git clone https://github.com/Azure/WALinuxAgent.git  
		# cd WALinuxAgent  
		# git tag  
		…
		WALinuxAgent-2.0.16
		…
		v2.1.4
		v2.1.4.rc0
		v2.1.4.rc1

    For 2.0, let's use 2.0.16 as an example:

		# git checkout WALinuxAgent-2.0.16
		# python setup.py install  
		# ln -sf /usr/local/sbin/waagent /usr/sbin/waagent  

    For 2.1, let's use 2.1.4 as an example:

		# git checkout v2.1.4
		# python setup.py install  
		# ln -sf /usr/local/sbin/waagent /usr/sbin/waagent  
		# ln -sf /usr/local/sbin/waagent2.0 /usr/sbin/waagent2.0

    >[AZURE.IMPORTANT] After you install Azure Agent, it's a good idea to verify that it's running:

		# waagent -version
		WALinuxAgent-2.1.4 running on freebsd 10.3
		Python: 2.7.11
		# service –e | grep waagent
		/etc/rc.d/waagent
		# cat /var/log/waagent.log

7. Deprovision the system.

    Deprovision the system to clean it and make it suitable for re-provisioning. The following command also deletes the last provisioned user account and the associated data:

		# echo "y" |  /usr/local/sbin/waagent -deprovision+user  
		# echo  'waagent_enable="YES"' >> /etc/rc.conf

    Now you can shut down your VM.

## Step 2: Create a storage account in Azure ##

You need a storage account in Azure to upload a .vhd file so it can be used to create a virtual machine. You can use the Azure classic portal to create a storage account.

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com).

2. On the command bar, select **New**.

3. Select **Data Services** > **Storage** > **Quick Create**.

	![Quick create a storage account](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/Storage-quick-create.png)

4. Fill out the fields as follows:

	- In the **URL** field, type a subdomain name to use in the storage account URL. The entry can contain from 3-24 numbers and lowercase letters. This name becomes the host name within the URL that is used to address Azure Blob storage, Azure Queue storage, or Azure Table storage resources for the subscription.

	- In the **Location/Affinity Group** drop-down menu, choose the **location or affinity group** for the storage account. An affinity group lets you put your cloud services and storage in the same data center.

	- In the **Replication** field, decide whether to use **Geo-Redundant** replication for the storage account. Geo-replication is turned on by default. This option replicates your data to a secondary location, at no cost to you, so that your storage fails over to that location if a major failure occurs at the primary location. The secondary location is assigned automatically and can't be changed. If you need more control over the location of your cloud-based storage due to legal requirements or organizational policy, you can turn off geo-replication. However, be aware that if you later turn on geo-replication, you will be charged a one-time data transfer fee to replicate your existing data to the secondary location. Storage services without geo-replication are offered at a discount. More details about managing geo-replication of storage accounts can be found here: [Create, manage, or delete a storage account](../storage-create-storage-account/#replication-options).

	![Enter storage account details](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/Storage-create-account.png)


5. Select **Create Storage Account**. The account now appears under **storage**.

	![Storage account successfully created](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/Storagenewaccount.png)

6. Next, create a container for your uploaded .vhd files. Select the storage account name, and then select **Containers**.

	![Storage account detail](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/storageaccount_detail.png)

7. Select **Create a Container**.

	![Storage account detail](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/storageaccount_container.png)

8. In the **Name** field, type a name for your container. Then, in the **Access** drop-down menu, select what type of access policy you want.

	![Container name](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/storageaccount_containervalues.png)

    > [AZURE.NOTE] By default, the container is private and can only be accessed by the account owner. To allow public read access to the blobs in the container, but not to the container properties and metadata, use the **Public Blob** option. To allow full public read access for the container and blobs, use the **Public Container** option.

## Step 3: Prepare the connection to Azure

Before you can upload a .vhd file, you need to establish a secure connection between your computer and your Azure subscription. You can use the Azure Active Directory (Azure AD) method or the certificate method to do this.

### Use the Azure AD method to upload a .vhd file

1. Open the Azure PowerShell console.

2. Type the following command:  
	`Add-AzureAccount`

	This command opens a sign-in window where you can sign in with your work or school account.

	![PowerShell Window](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/add_azureaccount.png)

3. Azure authenticates and saves the credential information. Then it closes the window.

### Use the certificate method to upload a .vhd file

1. Open the Azure PowerShell console.

2. Type:
	`Get-AzurePublishSettingsFile`.

3. A browser window opens and prompts you to download a .publishsettings file. This file contains information and a certificate for your Azure subscription.

	![Browser download page](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/Browser_download_GetPublishSettingsFile.png)

3. Save the .publishsettings file.

4. Type:
	`Import-AzurePublishSettingsFile <PathToFile>`, where
`<PathToFile>` is the full path to the .publishsettings file.

   For more information, see [Get started with Azure cmdlets](http://msdn.microsoft.com/library/windowsazure/jj554332.aspx).

   For more information about installing and configuring PowerShell, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

## Step 4: Upload the .vhd file

When you upload the .vhd file, you can place it anywhere within your Blob storage. Following are some terms you'll use when you upload the file:
-  **BlobStorageURL** is the URL for the storage account that you created in Step 2.
-  **YourImagesFolder** is the container within Blob storage where you want to store your images.
- **VHDName** is the label that appears in the Azure classic portal to identify the virtual hard disk.
- **PathToVHDFile** is the full path and name of the .vhd file.


From the Azure PowerShell window you used in the previous step, type:

		Add-AzureVhd -Destination "<BlobStorageURL>/<YourImagesFolder>/<VHDName>.vhd" -LocalFilePath <PathToVHDFile>

## Step 5: Create a VM with the uploaded .vhd file
After you upload the .vhd file, you can add it as an image to the list of custom images that are associated with your subscription and create a virtual machine with this custom image.

1. From the Azure PowerShell window you used in the previous step, type:

		Add-AzureVMImage -ImageName <Your Image's Name> -MediaLocation <location of the VHD> -OS <Type of the OS on the VHD>

    > [AZURE.NOTE]Use Linux as the OS type. The current Azure PowerShell version accepts only “Linux” or “Windows” as a parameter.

2. After you complete the previous steps, the new image is listed when you choose the **Images** tab on the Azure classic portal.  

    ![Choose an image](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/addfreebsdimage.png)

3. Create a virtual machine from the gallery. This new image is now available under **My Images**.
4. Select the new image. Next, go through the prompts to set up a host name, password, SSH key, and so on.

	![Custom image](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/createfreebsdimageinazure.png)

4. After you complete the provisioning, you'll see your FreeBSD VM running in Azure.

	![FreeBSD image in azure](./media/virtual-machines-linux-classic-freebsd-create-upload-vhd/freebsdimageinazure.png)
