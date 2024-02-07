---
title: Tutorial - Extend Windows file servers with Azure File Sync
description: Learn how to extend Windows file servers with Azure File Sync, from start to finish.
author: khdownie
ms.service: azure-file-storage
ms.topic: tutorial
ms.date: 06/21/2022
ms.author: kendownie
#Customer intent: As an IT administrator, I want see how to extend Windows file servers with Azure File Sync, so I can evaluate the process for extending the storage capacity of my Windows servers.
---

# Tutorial: Extend Windows file servers with Azure File Sync

The article demonstrates the basic steps for extending the storage capacity of a Windows server by using Azure File Sync. Although this tutorial features Windows Server as an Azure virtual machine (VM), you would typically do this process for your on-premises servers. You can find instructions for deploying Azure File Sync in your own environment in the [Deploy Azure File Sync](file-sync-deployment-guide.md) article.

> [!div class="checklist"]
> - Deploy the Storage Sync Service
> - Prepare Windows Server to use with Azure File Sync
> - Install the Azure File Sync agent
> - Register Windows Server with the Storage Sync Service
> - Create a sync group and a cloud endpoint
> - Create a server endpoint

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Prepare your environment

For this tutorial, you need to do the following before you can deploy Azure File Sync:

- Create an Azure storage account and file share
- Set up a Windows Server 2019 Datacenter VM
- Prepare the Windows Server VM for Azure File Sync

### Create a folder and .txt file

On your local computer, create a new folder named *FilesToSync* and add a text file named *mytestdoc.txt*. You'll upload that file to the file share later in this tutorial.

### Create a storage account

[!INCLUDE [storage-create-account-portal-include](../../../includes/storage-create-account-portal-include.md)]

### Create a file share

After you deploy an Azure storage account, follow these steps to create a file share.

1. In the Azure portal, select **Go to resource**.
1. From the menu at the left, select **Data storage** > **File shares**.
1. Select **+ File Share**.

1. Name the new file share *afsfileshare*, leave the tier set to *Transaction optimized*, and then select **Create**. You only need 5 TiB for this tutorial.

    :::image type="content" source="media/storage-sync-files-extend-servers/create-file-share-portal.png" alt-text="Screenshot showing how to create a new file share using the Azure portal.":::

1. Select the new file share. On the file share location, select **Upload**.

    :::image type="content" source="media/storage-sync-files-extend-servers/create-file-share-portal5.png" alt-text="Screenshot showing where to find the Upload button for the new file share.":::

1. Browse to the *FilesToSync* folder on your local machine where you created your .txt file, select *mytestdoc.txt* and select **Upload**.

    :::image type="content" source="media/storage-sync-files-extend-servers/create-file-share-portal6.png" alt-text="Screenshot showing how to browse and upload a file to the new file share using the Azure portal.":::

At this point, you've created a storage account and a file share with one file in it. Next, you'll deploy an Azure VM with Windows Server 2019 Datacenter to represent the on-premises server in this tutorial.

### Deploy a VM and attach a data disk

1. Select **Home** in the Azure portal and under **Azure services**, select **+ Create a resource**.
1. Under **Popular Azure services**, select **Virtual machine** > **Create**.
1. Under **Project details**, select your subscription and the resource group you created for this tutorial.

    :::image type="content" source="media/storage-sync-files-extend-servers/vm-project-and-instance-details.png" alt-text="Screenshot showing how to supply project and instance details when creating a V M for this tutorial.":::

1. Under **Instance details**, provide a VM name. For example, use *myVM*.
1. Don't change the default settings for **Region**, **Availability options**, and **Security type**.
1. Under **Image**, select **Windows Server 2019 Datacenter - Gen2**. Leave **Size** set to the default.
1. Under **Administrator account**, provide a **Username** and **Password** for the VM. The username must be between 1 and 20 characters long and can't contain special characters \\/""[]:|<>+=;,?*@& or end with '.' The password must be between 12 and 123 characters long, and must have 3 of the following: 1 lower case character, 1 upper case character, 1 number, and 1 special character.

    :::image type="content" source="media/storage-sync-files-extend-servers/vm-username-and-password.png" alt-text="Screenshot showing how to set the username, password, and inbound port rules for the V M.":::

1. Under **Inbound port rules**, choose **Allow selected ports** and then select **RDP (3389)** and **HTTP (80)** from the drop-down menu.

1. Before you create the VM, you need to create a data disk.

   1. At the bottom of the page, select **Next:Disks**.

      :::image type="content" source="media/storage-sync-files-extend-servers/vm-add-data-disk.png" alt-text="Screenshot showing how to select the Disks tab.":::

   1. On the **Disks** tab, under **Disk options**, leave the defaults.
   1. Under **Data disks**, select **Create and attach a new disk**.

   1. Use the default settings except for **Size**, which you can change to **4 GiB** for this tutorial by selecting **Change size**.

      :::image type="content" source="media/storage-sync-files-extend-servers/create-data-disk.png" alt-text="Screenshot showing how to create a new data disk for your V M.":::

   1. Select **OK**.
1. Select **Review + create**.
1. Select **Create**.

   You can select the **Notifications** icon to watch the **Deployment progress**. Creating a new VM might take a few minutes to complete.

1. After your VM deployment is complete, select **Go to resource**.

At this point, you've created a new virtual machine and attached a data disk. Next you connect to the VM.

### Connect to your VM

1. In the Azure portal, select **Connect** > **RDP** on the VM properties page.

   :::image type="content" source="media/storage-sync-files-extend-servers/connect-vm.png" alt-text="Screenshot showing the Connect button on the Azure portal with R D P highlighted.":::

1. On the **Connect** page, keep the default options to connect by **Public IP address** over port 3389. Select **Download RDP file**.

   :::image type="content" source="media/storage-sync-files-extend-servers/download-rdp.png" alt-text="Screenshot showing how to connect with R D P.":::

1. Open the downloaded RDP file and select **Connect** when prompted. You might see a warning that says *The publisher of this remote connection can't be identified*. Click **Connect** anyway.

1. In the **Windows Security** window that asks you to enter your credentials, select **More choices** and then **Use a different account**. Enter *localhost\username* in the **email address** field, enter the password you created for the VM, and then select **OK**.

   :::image type="content" source="media/storage-sync-files-extend-servers/local-host2.png" alt-text="Screenshot showing how to enter your login credentials for the V M.":::

1. You might receive a certificate warning during the sign-in process saying that the identity of the remote computer cannot be verified. Select **Yes** or **Continue** to create the connection.

### Prepare the Windows Server VM

For the Windows Server 2019 Datacenter VM, disable Internet Explorer Enhanced Security Configuration. This step is required only for initial server registration. You can re-enable it after the server has been registered.

In the Windows Server 2019 Datacenter VM, Server Manager opens automatically. If Server Manager doesn't open by default, search for it in Start Menu.

1. In **Server Manager**, select **Local Server**.

   :::image type="content" source="media/storage-sync-files-extend-servers/prepare-server-disable-ieesc-1.png" alt-text="Screenshot showing how to locate Local Server on the left side of the Server Manager U I.":::

1. On the **Properties** pane, find the entry for **IE Enhanced Security Configuration** and click **On**.

   :::image type="content" source="media/storage-sync-files-extend-servers/prepare-server-disable-ieesc-2.png" alt-text="Screenshot showing the Internet Explorer Enhanced Security Configuration pane in the Server Manager UI.":::

1. In the **Internet Explorer Enhanced Security Configuration** dialog box, select **Off** for **Administrators** and **Users**, and then select **OK**.

   :::image type="content" source="media/storage-sync-files-extend-servers/prepare-server-disable-ieesc-3.png" alt-text="Screenshot showing the Internet Explorer Enhanced Security Configuration pop-window with Off selected.":::

Now you can add the data disk to the VM.

### Add the data disk

1. While still in the **Windows Server 2019 Datacenter** VM, select **Files and storage services** > **Volumes** > **Disks**.

   :::image type="content" source="media/storage-sync-files-extend-servers/your-disk.png" alt-text="Screenshot showing how to bring the data disk online and create a volume." lightbox="media/storage-sync-files-extend-servers/your-disk.png":::

1. Right-click the 4 GiB disk named **Msft Virtual Disk** and select **New volume**.
1. Complete the wizard. Use the default settings and make note of the assigned drive letter.
1. Select **Create**.
1. Select **Close**.

   At this point, you've brought the disk online and created a volume. Open File Explorer in the Windows Server VM to confirm the presence of the recently added data disk.

1. In File Explorer in the VM, expand **This PC** and open the new drive. It's the F: drive in this example.
1. Right-click and select **New** > **Folder**. Name the folder *FilesToSync*.
1. Open the **FilesToSync** folder.
1. Right-click and select **New** > **Text Document**. Name the text file *MyTestFile*.

   :::image type="content" source="media/storage-sync-files-extend-servers/new-file.png" alt-text="Screenshot showing how to add a new text file on the V M.":::

1. Close **File Explorer** and **Server Manager**.

### Install the Azure PowerShell module

Next, in the Windows Server 2019 Datacenter VM, install the Azure PowerShell module on the server. The `Az` module is a rollup module for the Azure PowerShell cmdlets. Installing it downloads all the available Azure Resource Manager modules and makes their cmdlets available for use.

1. In the VM, open an elevated PowerShell window (run as administrator).
1. Run the following command:

   ```powershell
   Install-Module -Name Az
   ```

   > [!NOTE]
   > If you have a NuGet version that is older than 2.8.5.201, you're prompted to download and install the latest version of NuGet.

   By default, the PowerShell gallery isn't configured as a trusted repository for PowerShellGet. The first time you use the PSGallery, you see the following prompt:

   ```output
   Untrusted repository

   You are installing the modules from an untrusted repository. If you trust this repository, change its InstallationPolicy value by running the Set-PSRepository cmdlet.

   Are you sure you want to install the modules from 'PSGallery'?
   [Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"):
   ```

1. Answer **Yes** or **Yes to All** to continue with the installation.

At this point, you've set up your environment for the tutorial. Close the PowerShell window. You're ready to deploy the Storage Sync Service.

## Deploy the Storage Sync Service

To deploy Azure File Sync, you first place a **Storage Sync Service** resource into a resource group for your selected subscription. The Storage Sync Service inherits access permissions from its subscription and resource group.

1. In the Azure portal, select **Create a resource** and then search for **Azure File Sync**.
1. In the search results, select **Azure File Sync**.
1. Select **Create** to open the **Deploy Azure File Sync** tab.

   :::image type="content" source="media/storage-sync-files-extend-servers/deploy-storage-sync-service.png" alt-text="Screenshot showing how to deploy the Storage Sync Service in the Azure portal.":::

   On the pane that opens, enter the following information:

   | Value | Description |
   | ----- | ----- |
   | **Name** | A unique name (per subscription) for the Storage Sync Service.<br><br>Use *afssyncservice02* for this tutorial. |
   | **Subscription** | The Azure subscription you use for this tutorial. |
   | **Resource group** | The resource group that contains the Storage Sync Service.<br><br>Use *myexamplegroup* for this tutorial. |
   | **Location** | East US |

1. When you're finished, select **Review + Create** and then **Create** to deploy the **Storage Sync Service**. The service will take a few minutes to deploy.
1. When the deployment is complete, select **Go to resource**.

## Install the Azure File Sync agent

The Azure File Sync agent is a downloadable package that enables Windows Server to be synced with an Azure file share.

1. In the **Windows Server 2019 Datacenter** VM, open **Internet Explorer**.

   > [!IMPORTANT]
   > You might see a warning telling you to turn on **Internet Explorer Enhanced Security Configuration**. Don't turn this back on until you've finished registering the server in the next step.

1. Go to the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257). Scroll down to the **Azure File Sync Agent** section and select **Download**.

   :::image type="content" source="media/storage-sync-files-extend-servers/sync-agent-download.png" alt-text="Screenshot showing how to download the Azure File Sync agent.":::

1. Select the check box for **StorageSyncAgent_WS2019.msi** and select **Next**.

   :::image type="content" source="media/storage-sync-files-extend-servers/select-agent.png" alt-text="Screenshot showing how to select the right Azure File Sync agent download.":::

1. Select **Allow once** > **Run**.
1. Go through the **Storage Sync Agent Setup Wizard** and accept the defaults.
1. Select **Install**.
1. Select **Finish**.

You've deployed the Azure Sync Service and installed the agent on the Windows Server VM. Now you need to register the VM with the Storage Sync Service.

## Register Windows Server

Registering your Windows server with a Storage Sync Service establishes a trust relationship between your server (or cluster) and the Storage Sync Service. A server can only be registered to one Storage Sync Service. It can sync with other servers and Azure file shares that are associated with that Storage Sync Service.

The Server Registration UI should open automatically after you install the Azure File Sync agent. If it doesn't, you can open it manually from its file location: `C:\Program Files\Azure\StorageSyncAgent\ServerRegistration.exe.`

1. When the Server Registration UI opens in the VM, select **Sign in**.

   :::image type="content" source="media/storage-sync-files-extend-servers/server-registration.png" alt-text="Screenshot showing the Server Registration U I to register with an existing Storage Sync Service.":::

1. Sign in with your Azure account credentials.
1. Provide the following information:

   | Value | Description |
   | ----- | ----- |
   | **Azure Subscription** | The subscription that contains the Storage Sync Service for this tutorial. |
   | **Resource Group** | The resource group that contains the Storage Sync Service. Use *myexamplegroup* for this tutorial. |
   | **Storage Sync Service** | The name of the Storage Sync Service. Use *afssyncservice02* for this tutorial. |

1. Select **Register** to complete the server registration.
1. As part of the registration process, you're prompted for an additional sign-in. Sign in and select **Next**.
1. Select **OK**.

## Create a sync group

A sync group defines the sync topology for a set of files. A sync group must contain one cloud endpoint, which represents an Azure file share. A sync group also must contain one or more server endpoints. A server endpoint represents a path on a registered server. To create a sync group:

1. In the [Azure portal](https://portal.azure.com/), select **+ Sync group** from the Storage Sync Service you deployed.

   :::image type="content" source="media/storage-sync-files-extend-servers/add-sync-group.png" alt-text="Screenshot showing how to create a new sync group in the Azure portal.":::

1. Enter the following information to create a sync group with a cloud endpoint:

   | Value | Description |
   | ----- | ----- |
   | **Sync group name** | This name must be unique within the Storage Sync Service, but can be any name that is logical for you.|
   | **Subscription** | The subscription where you deployed the Storage Sync Service for this tutorial. |
   | **Storage account** | Choose **Select storage account**. On the pane that appears, select the storage account that has the Azure file share you created. |
   | **Azure file share** | The name of the Azure file share you created. |

1. Select **Create**.

If you select your sync group, you can see that you now have one **cloud endpoint**.

## Add a server endpoint

A server endpoint represents a specific location on a registered server. For example, a folder on a server volume. To add a server endpoint:

1. Select the newly created sync group and then select **Add server endpoint**.

   :::image type="content" source="media/storage-sync-files-extend-servers/add-server-endpoint.png" alt-text="Screenshot showing how to add a new server endpoint in the sync group pane.":::

1. On the **Add server endpoint** pane, enter the following information to create a server endpoint:

   | Value | Description |
   | ----- | ----- |
   | **Registered server** | The name of the server you created. For example, *myVM*. |
   | **Path** | The Windows Server path to the drive you created. For example, *f:\filestosync*. |
   | **Cloud Tiering** | Leave disabled for this tutorial. |
   | **Volume Free Space** | Leave blank for this tutorial. |

1. Select **Create**.

Your files are now in sync across your Azure file share and Windows Server.

:::image type="content" source="media/storage-sync-files-extend-servers/files-synced-in-azurestorage.png" alt-text="Screenshot showing files successfully synced with an Azure file share.":::

## Clean up resources

If you'd like to clean up the resources you created in this tutorial, first remove the endpoints from the Storage Sync service. Then, unregister the server with your Storage Sync service, remove the sync groups, and delete the Storage Sync service.

[!INCLUDE [storage-files-clean-up-portal](../../../includes/storage-files-clean-up-portal.md)]

## Next steps

In this tutorial, you learned the basic steps to extend the storage capacity of a Windows server by using Azure File Sync. For a more thorough look at planning for an Azure File Sync deployment, see:

> [!div class="nextstepaction"]
> [Plan for Azure File Sync deployment](file-sync-planning.md)
