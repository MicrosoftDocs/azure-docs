---
title: Deploy Azure File Sync (preview) | Microsoft Docs
description: Learn how to deploy Azure File Sync, from start to finish.
services: storage
documentationcenter: ''
author: wmgries
manager: klaasl
editor: jgerend

ms.assetid: 297f3a14-6b3a-48b0-9da4-db5907827fb5
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/08/2017
ms.author: wgries
---

# Deploy Azure File Sync (preview)
Use Azure File Sync (preview) to centralize your organization's file shares in Azure Files, while keeping the flexibility, performance, and compatibility of an on-premises file server. Azure File Sync transforms Windows Server into a quick cache of your Azure file share. You can use any protocol that's available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.

We strongly recommend that you read [Planning for an Azure Files deployment](storage-files-planning.md) and [Planning for an Azure File Sync deployment](storage-sync-files-planning.md) before you complete the steps described in this article.

## Prerequisites
* An Azure Storage account and an Azure file share in the same region that you want to deploy Azure File Sync. For more information, see:
    - [Region availability](storage-sync-files-planning.md#region-availability) for Azure File Sync.
    - [Create a storage account](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json) for a step-by-step description of how to create a storage account.
    - [Create a file share](storage-how-to-create-file-share.md) for a step-by-step description of how to create a file share.
* At least one supported Windows server or Windows Server cluster to sync with Azure File Sync. For more information about supported versions of Windows Server, see [Interoperability with Windows Server](storage-sync-files-planning.md#azure-file-sync-interoperability).

## Deploy the Storage Sync Service 
The Storage Sync Service is the top-level Azure resource for Azure File Sync. To deploy a Storage Sync Service, go to the [Azure portal](https://portal.azure.com/), and then search for Azure File Sync. In the search results, select **Azure File Sync (preview)**, and then select **Create** to open the **Deploy Storage Sync** tab.

On the pane that opens, enter the following information:

- **Name**: A unique name (per subscription) for the Storage Sync Service.
- **Subscription**: The subscription in which you want to create the Storage Sync Service. Depending on your organization's configuration strategy, you might have access to one or more subscriptions. An Azure subscription is the most basic container for billing for each cloud service (such as Azure Files).
- **Resource group**: A resource group is a logical group of Azure resources, such as a storage account or a Storage Sync Service. You can create a new resource group or use an existing resource group for Azure File Sync (we recommend using resource groups as containers to isolate resources logically for your organization, such as grouping HR resources or resources for a specific project).
- **Location**: The region in which you want to deploy Azure File Sync. Only supported regions are available in this list.

When you are finished, select **Create** to deploy the Storage Sync Service.

## Prepare Windows servers to use with Azure File Sync
For each server that you intend to use with Azure File Sync, including server nodes in a Failover Cluster, complete the following steps:

1. Disable **Internet Explorer Enhanced Security Configuration**. This is required only for initial server registration. You can re-enable it after the server has been registered.
    1. Open Server Manager.
    2. Click **Local Server**:  
        !["Local Server" on the left side of the Server Manager UI](media/storage-sync-files-deployment-guide/prepare-server-disable-IEESC-1.PNG)
    3. On the **Properties** subpane, select the link for **IE Enhanced Security Configuration**.  
        ![The "IE Enhanced Security Configuration" pane in the Server Manager UI](media/storage-sync-files-deployment-guide/prepare-server-disable-IEESC-2.PNG)
    4. In the **Internet Explorer Enhanced Security Configuration** dialog box, select **Off** for **Administrators** and **Users**:  
        ![The Internet Explorer Enhanced Security Configuration pop-window with "Off" selected](media/storage-sync-files-deployment-guide/prepare-server-disable-IEESC-3.png)

2. Ensure that you are running at least PowerShell 5.1.\* (PowerShell 5.1 is the default on Windows Server 2016). You can verify that you are running PowerShell 5.1.\* by looking at the value of the **PSVersion** property of the **$PSVersionTable** object:

    ```PowerShell
    $PSVersionTable.PSVersion
    ```

    If your PSVersion value is less than 5.1.\*, as will be the case with most installations of Windows Server 2012 R2, you can easily upgrade by downloading and installing [Windows Management Framework (WMF) 5.1](https://www.microsoft.com/download/details.aspx?id=54616). The appropriate package to download and install for Windows Server 2012 R2 is **Win8.1AndW2K12R2-KB\*\*\*\*\*\*\*-x64.msu**.

3. [Install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps). We recommend using the latest version of the Azure PowerShell modules.

## Install the Azure File Sync agent
The Azure File Sync agent is a downloadable package that enables a Windows server to be synced with an Azure file share. You can download the agent from the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257). When the download is finished, double-click the MSI package to start the Azure File Sync agent installation.

> [!Important]  
> If you intend to use Azure File Sync with a Failover Cluster, the Azure File Sync agent must be installed on every node in the cluster.

The Azure File Sync agent installation package should install relatively quickly, and without too many additional prompts. We recommend that you do the following:
- Leave the default installation path (C:\Program Files\Azure\StorageSyncAgent), to simplify troubleshooting and server maintenance.
- Enable Microsoft Update to keep Azure File Sync up to date. All updates, to the Azure File Sync agent, including feature updates and hotfixes, occur from Microsoft Update. We recommend installing the latest update to Azure File Sync. For more information, see [Azure File Sync update policy](storage-sync-files-planning.md#azure-file-sync-agent-update-policy).

When the Azure File Sync agent installation is finished, the Server Registration UI automatically opens. To learn how to register this server with Azure File Sync, see the next section.

## Register Windows Server with Storage Sync Service
Registering your Windows server with a Storage Sync Service establishes a trust relationship between your server (or cluster) and the Storage Sync Service. The Server Registration UI should open automatically after installation of the Azure File Sync agent. If it doesn't, you can open it manually from its file location: C:\Program Files\Azure\StorageSyncAgent\ServerRegistration.exe. When the Server Registration UI opens, select **Sign-in** to begin.

After you sign in, you are prompted for the following information:

![A screenshot of the Server Registration UI](media/storage-sync-files-deployment-guide/register-server-scubed-1.png)

- **Azure Subscription**: The subscription that contains the Storage Sync Service (see [Deploy the Storage Sync Service](#deploy-the-storage-sync-service)). 
- **Resource Group**: The resource group that contains the Storage Sync Service.
- **Storage Sync Service**: The name of the Storage Sync Service with which you want to register.

After you have selected the appropriate information, select **Register** to complete the server registration. As part of the registration process, you are prompted for an additional sign-in.

## Create a Sync Group
A Sync Group defines the sync topology for a set of files. Endpoints within a Sync Group are kept in sync with each other. A Sync Group must contain at least one Cloud Endpoint, which represents an Azure file share, and one Server Endpoint, which represents a path on a Windows server. To create a Sync Group, in the [Azure portal](https://portal.azure.com/), go to your Storage Sync Service, and then select **+ Sync group**:

![Create a new Sync Group in the Azure portal](media/storage-sync-files-deployment-guide/create-sync-group-1.png)

In the pane that opens, enter the following information to create a Sync Group with a Cloud Endpoint:

- **Sync Group Name**: The name of the Sync Group to be created. This name must be unique within the Storage Sync Service, but can be any name that is logical for you.
- **Subscription**: The subscription where you deployed the Storage Sync Service in [Deploy the Storage Sync Service](#deploy-the-storage-sync-service).
- **Storage account**: If you select **Select storage account**, another pane appears in which you can select the storage account that has the Azure file share that you want to sync with.
- **Azure File share**: The name of the Azure file share with which you want to sync.

To add a Server Endpoint, go to the newly created Sync Group and then select **Add server endpoint**.

![Add a new Server Endpoint in the Sync Group pane](media/storage-sync-files-deployment-guide/create-sync-group-2.png)

In the **Add server endpoint** pane, enter the following information to create a Server Endpoint:

- **Registered Server**: The name of the server or cluster where you want to create the Server Endpoint.
- **Path**: The path on the Windows server to be synced as part of the Sync Group.
- **Cloud Tiering**: A switch to enable or disable cloud tiering. With cloud tiering, infrequently used or accessed files can be tiered to Azure Files.
- **Volume Free Space**: The amount of free space to reserve on the volume on which the Server Endpoint is located. For example, if volume free space is set to 50% on a volume that has a single Server Endpoint, roughly half the amount of data is tiered to Azure Files. Regardless of whether cloud tiering is enabled, your Azure file share always has a complete copy of the data in the Sync Group.

To add the Server Endpoint, select **Create**. Your files are now kept in sync across your Azure file share and your Windows server. 

> [!Important]  
> You can make changes to any Cloud Endpoint or Server Endpoint in the Sync Group and have your files synced to the other endpoints in the Sync Group. If you make a change to the Cloud Endpoint (Azure file share) directly, changes first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a Cloud Endpoint only once every 24 hours. For more information, see [Azure Files frequently asked questions](storage-files-faq.md#afs-change-detection).

## Next steps
- [Add or remove an Azure File Sync Server Endpoint](storage-sync-files-server-endpoint.md)
- [Register or unregister a server with Azure File Sync](storage-sync-files-server-registration.md)