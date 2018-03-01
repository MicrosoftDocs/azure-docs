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
* At least one supported instance of Windows Server or Windows Server cluster to sync with Azure File Sync. For more information about supported versions of Windows Server, see [Interoperability with Windows Server](storage-sync-files-planning.md#azure-file-sync-interoperability).

## Deploy the Storage Sync Service 
The Storage Sync Service is the top-level Azure resource for Azure File Sync. To deploy a Storage Sync Service, go to the [Azure portal](https://portal.azure.com/), click *New* and then search for Azure File Sync. In the search results, select **Azure File Sync (preview)**, and then select **Create** to open the **Deploy Storage Sync** tab.

On the pane that opens, enter the following information:

- **Name**: A unique name (per subscription) for the Storage Sync Service.
- **Subscription**: The subscription in which you want to create the Storage Sync Service. Depending on your organization's configuration strategy, you might have access to one or more subscriptions. An Azure subscription is the most basic container for billing for each cloud service (such as Azure Files).
- **Resource group**: A resource group is a logical group of Azure resources, such as a storage account or a Storage Sync Service. You can create a new resource group or use an existing resource group for Azure File Sync. (We recommend using resource groups as containers to isolate resources logically for your organization, such as grouping HR resources or resources for a specific project.)
- **Location**: The region in which you want to deploy Azure File Sync. Only supported regions are available in this list.

When you are finished, select **Create** to deploy the Storage Sync Service.

## Prepare Windows Server to use with Azure File Sync
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
The Azure File Sync agent is a downloadable package that enables Windows Server to be synced with an Azure file share. You can download the agent from the [Microsoft Download Center](https://go.microsoft.com/fwlink/?linkid=858257). When the download is finished, double-click the MSI package to start the Azure File Sync agent installation.

> [!Important]  
> If you intend to use Azure File Sync with a Failover Cluster, the Azure File Sync agent must be installed on every node in the cluster.


The Azure File Sync agent installation package should install relatively quickly, and without too many additional prompts. We recommend that you do the following:
- Leave the default installation path (C:\Program Files\Azure\StorageSyncAgent), to simplify troubleshooting and server maintenance.
- Enable Microsoft Update to keep Azure File Sync up to date. All updates, to the Azure File Sync agent, including feature updates and hotfixes, occur from Microsoft Update. We recommend installing the latest update to Azure File Sync. For more information, see [Azure File Sync update policy](storage-sync-files-planning.md#azure-file-sync-agent-update-policy).

When the Azure File Sync agent installation is finished, the Server Registration UI automatically opens. To learn how to register this server with Azure File Sync, see the next section.

## Register Windows Server with Storage Sync Service
Registering Windows Server with a Storage Sync Service establishes a trust relationship between your server (or cluster) and the Storage Sync Service. The Server Registration UI should open automatically after installation of the Azure File Sync agent. If it doesn't, you can open it manually from its file location: C:\Program Files\Azure\StorageSyncAgent\ServerRegistration.exe. When the Server Registration UI opens, select **Sign-in** to begin.

After you sign in, you are prompted for the following information:

![A screenshot of the Server Registration UI](media/storage-sync-files-deployment-guide/register-server-scubed-1.png)

- **Azure Subscription**: The subscription that contains the Storage Sync Service (see [Deploy the Storage Sync Service](#deploy-the-storage-sync-service)). 
- **Resource Group**: The resource group that contains the Storage Sync Service.
- **Storage Sync Service**: The name of the Storage Sync Service with which you want to register.

After you have selected the appropriate information, select **Register** to complete the server registration. As part of the registration process, you are prompted for an additional sign-in.

## Create a sync group
A sync group defines the sync topology for a set of files. Endpoints within a sync group are kept in sync with each other. A sync group must contain at least one cloud endpoint, which represents an Azure file share, and one server endpoint, which represents a path on Windows Server. To create a sync group, in the [Azure portal](https://portal.azure.com/), go to your Storage Sync Service, and then select **+ Sync group**:

![Create a new sync group in the Azure portal](media/storage-sync-files-deployment-guide/create-sync-group-1.png)

In the pane that opens, enter the following information to create a sync group with a cloud endpoint:

- **Sync group name**: The name of the sync group to be created. This name must be unique within the Storage Sync Service, but can be any name that is logical for you.
- **Subscription**: The subscription where you deployed the Storage Sync Service in [Deploy the Storage Sync Service](#deploy-the-storage-sync-service).
- **Storage account**: If you select **Select storage account**, another pane appears in which you can select the storage account that has the Azure file share that you want to sync with.
- **Azure File Share**: The name of the Azure file share with which you want to sync.

To add a server endpoint, go to the newly created sync group and then select **Add server endpoint**.

![Add a new server endpoint in the sync group pane](media/storage-sync-files-deployment-guide/create-sync-group-2.png)

In the **Add server endpoint** pane, enter the following information to create a server endpoint:

- **Registered server**: The name of the server or cluster where you want to create the server endpoint.
- **Path**: The Windows Server path to be synced as part of the sync group.
- **Cloud Tiering**: A switch to enable or disable cloud tiering. With cloud tiering, infrequently used or accessed files can be tiered to Azure Files.
- **Volume Free Space**: The amount of free space to reserve on the volume on which the server endpoint is located. For example, if volume free space is set to 50% on a volume that has a single server endpoint, roughly half the amount of data is tiered to Azure Files. Regardless of whether cloud tiering is enabled, your Azure file share always has a complete copy of the data in the sync group.

To add the server endpoint, select **Create**. Your files are now kept in sync across your Azure file share and Windows Server. 

> [!Important]  
> You can make changes to any cloud endpoint or server endpoint in the sync group and have your files synced to the other endpoints in the sync group. If you make a change to the cloud endpoint (Azure file share) directly, changes first need to be discovered by an Azure File Sync change detection job. A change detection job is initiated for a cloud endpoint only once every 24 hours. For more information, see [Azure Files frequently asked questions](storage-files-faq.md#afs-change-detection).

## Onboarding with Azure File Sync
The recommended steps to onboard on Azure File Sync for the first with zero downtime while preserving full file fidelity and access control list (ACL) are as follows:
 
1.	Deploy a Storage Sync Service.
2.	Create a sync group.
3.	Install Azure File Sync agent on the server with the full data set.
4.	Register that server and create a server endpoint on the share. 
5.	Let sync do the full upload to the Azure file share (cloud endpoint).  
6.	After the initial upload is complete, install Azure File Sync agent on each of the remaining servers.
7.	Create new file shares on each of the remaining servers.
8.	Create server endpoints on new file shares with cloud tiering policy, if desired. (This step requires additional storage to be available for the initial setup.)
9.	Let Azure File Sync agent to do a rapid restore of the full namespace without the actual data transfer. After the full namespace sync, sync engine will fill the local disk space based on the cloud tiering policy for the server endpoint. 
10.	Ensure sync completes and test your topology as desired. 
11.	Redirect users and applications to this new share.
12.	You can optionally delete any duplicate shares on the servers.
 
If you don't have extra storage for initial onboarding and would like to attach to the existing shares, you can pre-seed the data in the Azure files shares. This approach is suggested, if and only if you can accept downtime and absolutely guarantee no data changes on the server shares during the initial onboarding process. 
 
1.	Ensure that data on any of the server can't change during the onboarding process.
2.	Pre-seed Azure file shares with the server data using any data transfer tool over the SMB e.g. Robocopy, direct SMB copy. Since AzCopy does not upload data over the SMB so it can’t be used for pre-seeding.
3.	Create Azure File Sync topology with the desired server endpoints pointing to the existing shares.
4.	Let sync finish reconciliation process on all endpoints. 
5.	Once reconciliation is complete, you can open shares for changes.
 
Please be aware that currently, pre-seeding approach has a few limitations - 
- Full fidelity on files is not preserved. For example, files lose ACLs and timestamps.
- Data changes on the server before sync topology is fully up and running can cause conflicts on the server endpoints.  
- After the cloud endpoint is created, Azure File Sync runs a process to detect the files in the cloud before starting the initial sync. The time taken to complete this process varies depending on the various factors like network speed, available bandwidth, and number of files and folders. For the rough estimation in the preview release, detection process runs approximately at 10 files/sec.  Hence, even if pre-seeding runs fast, the overall time to get a fully running system may be significantly longer when data is pre-seeded in the cloud.


## Migrate a DFS Replication (DFS-R) deployment to Azure File Sync
To migrate a DFS-R deployment to Azure File Sync:

1. Create a sync group to represent the DFS-R topology you are replacing.
2. Start on the server that has the full set of data in your DFS-R topology to migrate. Install Azure File Sync on that server.
3. Register that server and create a server endpoint for the first server to be migrated. Do not enable cloud tiering.
4. Let all of the data sync to your Azure file share (cloud endpoint).
5. Install and register the Azure File Sync agent on each of the remaining DFS-R servers.
6. Disable DFS-R. 
7. Create a server endpoint on each of the DFS-R servers. Do not enable cloud tiering.
8. Ensure sync completes and test your topology as desired.
9. Retire DFS-R.
10. Cloud tiering may now be enabled on any server endpoint as desired.

For more information, see [Azure File Sync interop with Distributed File System (DFS)](storage-sync-files-planning.md#distributed-file-system-dfs).

## Next steps
- [Add or remove an Azure File Sync Server Endpoint](storage-sync-files-server-endpoint.md)
- [Register or unregister a server with Azure File Sync](storage-sync-files-server-registration.md)
