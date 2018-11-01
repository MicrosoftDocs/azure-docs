---
title: Tutorial Extend Windows file servers with Azure File Sync | Microsoft Docs
description: Learn how to Extend Windows file servers with Azure File Sync, from start to finish.
services: storage
author: wmgries
ms.service: storage
ms.topic: tutorial
ms.date: 10/23/2018
ms.author: wgries
ms.component: files
#Customer intent: As a IT Administrator, I want see how to extend Windows file servers with Azure File Sync, so I can evaluate the process for extending storage capacity of my Windows Servers.
---

# Tutorial: Extend Windows file servers with Azure File Sync
In this tutorial, we'll show the basic steps for extending the storage capacity of a Windows Server using Azure File Sync. Though we're using a Windows Server Azure VM for this tutorial, you would typically do this process for your on-premises servers. If you're ready to deploy Azure File Sync in your own environment, use the [Deploy Azure File Sync](storage-sync-files-deployment-guide.md) article instead.

> [!div class="checklist"]
> * Deploy the Storage Sync Service
> * Prepare Windows Server to use with Azure File Sync
> * Install the Azure File Sync agent
> * Register Windows Server with Storage Sync Service
> * Create a sync group and a cloud endpoint
> * Create a server endpoint

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure
Sign in to the Azure portal at https://portal.azure.com.

## Prepare your environment
There are a few things you need to set up for this tutorial before you deploy Azure File Sync. Along with creating an Azure Storage account and file share, you'll create a Windows Server 2016 Datacenter VM and prepare that server for Azure File Sync.

### Create a folder and .txt file

On your local computer, create a new folder named *FilesToSync* and add a text file named *mytestdoc.txt*. you'll upload that file to the file share later in this tutorial.

### Create a storage account

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

### Create a file share
Next, you create a file share.

1. When the Azure storage account deployment is complete, click **Go to resource**.
1. Click **Files** from the storage account pane.

    ![Click Files](./media/storage-sync-files-extend-servers/click-files.png)

1. Click **+ File Share**.

    ![Click the add file share button](./media/storage-sync-files-extend-servers/create-file-share-portal2.png)

1. Name the new file share *afsfileshare* and enter "1" for the **Quota**, then click **Create**. The quota can be a maximum of 5 TiB, but you only need 1 GB for this tutorial.

    ![Provide a name and quota for the new file share](./media/storage-sync-files-extend-servers/create-file-share-portal3.png)

1. Select the new file share, then on the file share location, click **Upload**.

    ![Upload a file](./media/storage-sync-files-extend-servers/create-file-share-portal5.png)

1. Browse to the *FilesToSync* folder where you created your .txt file, select *mytestdoc.txt* and click **Upload**.

    ![Browse file share](./media/storage-sync-files-extend-servers/create-file-share-portal6.png)

At this point, you've created an Azure Storage account and a file share with one file in it in Azure. Now you'll create the Azure VM with Windows Server 2016 Datacenter to represent the on-premises server in this tutorial.

### Deploy a VM and attach a data disk

1. Next, expand the menu on the left side of the portal and choose **Create a resource** in the upper left-hand corner of the Azure portal.
1. In the search box above the list of **Azure Marketplace** resources, search for and select **Windows Server 2016 Datacenter**, then choose **Create**.
1. In the **Basics** tab, under **Project details**, select the resource group you created for this tutorial.

   ![Enter basic information about your VM in the portal blade](./media/storage-sync-files-extend-servers/vm-resource-group-and-subscription.png)

1. Under **Instance details**, provide a VM name, such as *myVM*.
1. Leave the default settings for **Region**, **Availability options**, **Image**, and **Size**.
1. Under **Administrator account**, provide a **Username** and **Password** for the VM.
1. Under **Inbound port rules**, choose **Allow selected ports** and then select **RDP (3389)** and **HTTP** from the drop-down.

   Before you create the VM, you need to create a data disk.

1. Click **Next:Disks**

   ![Add data disks](./media/storage-sync-files-extend-servers/vm-add-data-disk.png)

1. In the **Disks** tab, under **Disk options**, leave the defaults.
1. Under **DATA DISKS**, click **Create and attach a new disk**.

1. Leave the defaults, except change the **Size (GiB)** to **1 GB** for this tutorial.

   ![Data disk details](./media/storage-sync-files-extend-servers/vm-create-new-disk-details.png)

1. Click **OK**.
1. Click **Review + create**.
1. Click **Create**.

   You can click the **Notifications** icon to watch the **Deployment progress**. Creating a new VM will take a few minutes to complete.

1. Once your VM deployment is complete, click **Go to resource**.

   ![Go to resource](./media/storage-sync-files-extend-servers/vm-gotoresource.png)

   At this point, you've created a new virtual machine and attached a data disk. Now you need to connect to the VM.

### Connect to your VM

1. In the Azure portal, click **Connect** on the virtual machine properties page.

   ![Connect to an Azure VM from the portal](./media/storage-sync-files-extend-servers/connect-vm.png)

1. In the **Connect to virtual machine** page, keep the default options to connect by **IP address** over port 3389 and click **Download RDP file**.

   ![Download the RDP file](./media/storage-sync-files-extend-servers/download-rdp.png)

1. Open the downloaded RDP file and click **Connect** when prompted.
1. In the **Windows Security** window, select **More choices** and then **Use a different account**. Type the username as *localhost\username*, enter the password you created for the virtual machine, and then click **OK**.

   ![More choices](./media/storage-sync-files-extend-servers/local-host2.png)

1. You may receive a certificate warning during the sign-in process. Click **Yes** or **Continue** to create the connection.

### Prepare the Windows Server
For the **Windows Server 2016 Datacenter** server, disable **Internet Explorer Enhanced Security Configuration**. This step is required only for initial server registration. You can re-enable it after the server has been registered.

In the **Windows Server 2016 Datacenter** VM, **Server Manager** will open automatically.  If **Server Manager** doesn't open by default, search for it in Explorer.

1. In **Server Manager** Click **Local Server**.

   !["Local Server" on the left side of the Server Manager UI](media/storage-sync-files-extend-servers/prepare-server-disable-ieesc-1.png)

1. On the **Properties** subpane, select the link for **IE Enhanced Security Configuration**.  

    ![The "IE Enhanced Security Configuration" pane in the Server Manager UI](media/storage-sync-files-extend-servers/prepare-server-disable-ieesc-2.png)

1. In the **Internet Explorer Enhanced Security Configuration** dialog box, select **Off** for **Administrators** and **Users**.

    ![The Internet Explorer Enhanced Security Configuration pop-window with "Off" selected](media/storage-sync-files-extend-servers/prepare-server-disable-ieesc-3.png)

   Now you can add the data disk to the VM.

### Add the data disk

1. While still in the **Windows Server 2016 Datacenter** VM, click **Files and storage services** > **Volumes** > **Disks**.

    ![Data disk](media/storage-sync-files-extend-servers/your-disk.png)

1. Right-click the 1 GB disk named **Msft Virtual Disk** and click **New volume**.
1. Complete the wizard leaving the defaults in place, noting the assigned drive letter, and click **Create**.
1. Click **Close**.

   At this point, you've brought the disk online and created a volume. You can confirm that adding the data disk was successful by opening Explorer on the VM and confirming that the new drive is present.

1. In Explorer on the VM, expand **This PC** and double-click the new drive. It's the F: drive in this example.
1. Right-click and select **New** > **Folder**. Name the folder *FilesToSync*.
1. Double-click the **FilesToSync** folder.
1. Right-click and select **New** > **Text Document**. Name the text file *MyTestFile*.

    ![Add a new text file](media/storage-sync-files-extend-servers/new-file.png)

1. Close **Explorer** and **Server Manager**.

### Download the AzureRM PowerShell module
Next, in the **Windows Server 2016 Datacenter** VM, install the **AzureRM PowerShell module** on the server.

1. In the VM, open an elevated PowerShell window
1. Run the following command:

   ```powershell
   Install-Module -Name AzureRM -AllowClobber
   ```

   > [!NOTE]
   > If you have a version older than 2.8.5.201 of NuGet, you are prompted to download and install
   > the latest version of NuGet.

   By default, the PowerShell gallery isn't configured as a trusted repository for PowerShellGet. The first time you use the PSGallery you see the following prompt:

   ```output
   Untrusted repository

   You are installing the modules from an untrusted repository. If you trust this repository, change its InstallationPolicy value by running the Set-PSRepository cmdlet.

   Are you sure you want to install the modules from 'PSGallery'?
   [Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):
   ```

1. Answer `Yes` or `Yes to All` to continue with the installation.

The `AzureRM` module is a rollup module for the Azure PowerShell cmdlets. Installing it downloads all the available Azure Resource Manager modules and makes their cmdlets available for use.

At this point, you've finished setting up your environment for the tutorial and you're ready to begin deploying the **Storage Sync Service**.

## Deploy the service 
Deploying Azure File Sync starts with placing a **Storage Sync Service** resource into a resource group for your selected subscription. The Storage Sync Service inherits access permissions from the subscription and resource group you deploy it into.

1. In the Azure portal, click **Create a resource** and then search for **Azure File Sync**.
1. In the search results, select **Azure File Sync**.
1. Select **Create** to open the **Deploy Storage Sync** tab.

   ![Deploy Storage Sync](media/storage-sync-files-extend-servers/afs-info.png)

   On the pane that opens, enter the following information:

   | Value | Description |
   | ----- | ----- |
   | **Name** | A unique name (per subscription) for the Storage Sync Service.<br><br>In this tutorial we're using *afssyncservice02*. |
   | **Subscription** | The subscription you're using for this tutorial. |
   | **Resource group** | The resource group you're using for this tutorial.<br><br>In this tutorial we're using *afsresgroup101918*. |
   | **Location** | East US |

1. When you're finished, select **Create** to deploy the **Storage Sync Service**.
1. Click the **Notifications** tab > **Go to resource**.

## Install the agent
The Azure File Sync agent is a downloadable package that enables Windows Server to be synced with an Azure file share.

1. Switch back to the **Windows Server 2016 Datacenter** VM and open **Internet Explorer**.
1. Go to the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257). Scroll down to the **Azure File Sync Agent** section and click **Download**.

   ![Sync agent download](media/storage-sync-files-extend-servers/sync-agent-download.png)

1. Check the box for **StorageSyncAgent_V3_WS2016.EXE** and click **Next**.

   ![Select agent](media/storage-sync-files-extend-servers/select-agent.png)

1. **Allow once** > **Run** > **Open** the file.
1. If you haven't already done so, close the PowerShell window.
1. Accept the defaults in the **Storage Sync Agent Setup Wizard**.
1. Click **Install**.
1. Click **Finish**.

You've deployed the Azure Sync Service and installed the agent on the **Windows Server 2016 Datacenter** VM. Now you need to register the VM with the **Storage Sync Service**.

## Register Windows Server
Registering your Windows Server with a Storage Sync Service establishes a trust relationship between your server (or cluster) and the Storage Sync Service. A server can only be registered to one Storage Sync Service and can sync with other servers and Azure file shares associated with the same Storage Sync Service.

The Server Registration UI should open automatically after installing the **Azure File Sync agent**. If it doesn't, you can open it manually from its file location: C:\Program Files\Azure\StorageSyncAgent\ServerRegistration.exe.

1. When the Server Registration UI opens in the VM, click **OK**.
1. Click **Sign-in** to begin.
1. Sign in with your Azure account credentials and click **Sign-in**.
1. Provide the following information:

   ![A screenshot of the Server Registration UI](media/storage-sync-files-extend-servers/signin.png)

   | | |
   | ----- | ----- |
   | Value | Description |
   | **Azure Subscription** | The subscription that contains the Storage Sync Service for this tutorial. |
   | **Resource Group** | The resource group that contains the Storage Sync Service for this tutorial. We've used *afsresgroup101918* throughout this tutorial. |
   | **Storage Sync Service** | The name of the Storage Sync Service you used for this tutorial. We've used *afssyncservice02* throughout this tutorial. |

1. Click **Register** to complete the server registration.
1. As part of the registration process, you are prompted for an additional sign-in. Sign in and click **Next**.
1. Click **OK**.

## Create a sync group
A sync group defines the sync topology for a set of files. A sync group must contain one cloud endpoint, which represents an Azure file share and one or more server endpoints. A server endpoint represents a path on a registered server.

1. To create a sync group, in the [Azure portal](https://portal.azure.com/), select **+ Sync group** from the Storage Sync Service you created for this tutorial. We used *afssyncservice02* as the example in this tutorial.

   ![Create a new sync group in the Azure portal](media/storage-sync-files-extend-servers/add-sync-group.png)

1. In the pane that opens, enter the following information to create a sync group with a cloud endpoint:

   | Value | Description |
   | ----- | ----- |
   | **Sync group name** | This name must be unique within the Storage Sync Service, but can be any name that is logical for you. In this tutorial, we're using *afssyncgroup*.|
   | **Subscription** | The subscription where you deployed the Storage Sync Service for this tutorial. |
   | **Storage account** |Click **Select storage account**. On the pane that appears, select the storage account that has the Azure file share you created for this tutorial. We used *afsstoracct101918*. |
   | **Azure file share** | The name of the Azure file share you created for this tutorial. We used *afsfileshare*. |

1. Click **Create**.

If you select your sync group, you can see that you now have one **cloud endpoint**.

## Add a server endpoint
A server endpoint represents a specific location on a registered server, such as a folder on a server volume.

1. To add a server endpoint, select the newly created sync group and then select **Add server endpoint**.

   ![Add a new server endpoint in the sync group pane](media/storage-sync-files-extend-servers/add-server-endpoint.png)

1. In the **Add server endpoint** pane, enter the following information to create a server endpoint:

   | | |
   | ----- | ----- |
   | Value | Description |
   | **Registered server** | The name of the server you created for this tutorial. We used *afsvm101918* in this tutorial |
   | **Path** | The Windows Server path to the drive you created for this tutorial. In our example, it is *f:\filestosync*. |
   | **Cloud Tiering** | Leave disabled for this tutorial. |
   | **Volume Free Space** | Leave blank for this tutorial. |

1. Click **Create**.

Your files are now in sync across your Azure file share and Windows Server.

![Azure Storage successfully synced](media/storage-sync-files-extend-servers/files-synced-in-azurestorage.png)

## Clean up resources

[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

## Next steps
In this tutorial, you learned the basic steps to extend the storage capacity of a Windows Server using Azure File Sync. Follow this link for a more thorough look at planning for an Azure File Sync deployment.

> [!div class="nextstepaction"]
> [Plan for Azure File Sync deployment](./storage-sync-files-planning.md)