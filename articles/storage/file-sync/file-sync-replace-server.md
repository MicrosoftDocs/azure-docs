---
title: Replace an Azure File Sync server
description: How to replace an Azure File Sync server due to hardware decommissioning or end of support. 
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 02/27/2024
ms.author: kendownie
---

# Replace an Azure File Sync server

This article provides guidance on how to replace an Azure File Sync server due to hardware decommissioning or end of support (for example, Windows Server 2012 R2). 

To replace an Azure File Sync server, follow the steps below.

## New Azure File Sync server
1.	Deploy a new on-premises server or Azure VM that is running a [supported operation system version](https://learn.microsoft.com/azure/storage/file-sync/file-sync-planning#operating-system-requirements).
2.	[Install the latest Azure File Sync agent](https://learn.microsoft.com/azure/storage/file-sync/file-sync-deployment-guide?tabs=azure-portal%2Cproactive-portal#install-the-azure-file-sync-agent) on the new server, then [register the server](https://learn.microsoft.com/azure/storage/file-sync/file-sync-deployment-guide?tabs=azure-portal%2Cproactive-portal#register-windows-server-with-storage-sync-service) to the same Storage Sync Service as the server that is being replaced (referred to as old server in this guide).
3.	Create file shares on the new server and verify the share-level permissions match the permissions configured on the old server.
4.	Optional: To reduce the amount of data that needs to be downloaded to the new server from the Azure file share, use Robocopy to copy the files in the cache from the old server to the new server. 

    ```console
    Robocopy <source> <destination> /COPY:DATSO /MIR /DCOPY:AT /XA:O /B /IT /UNILOG:RobocopyLog.txt
     ```
    Once the initial copy is completed, run the Robocopy command again to copy any remaining changes.

5.	In the Azure portal, navigate to the new Storage Sync Service, go to the sync group for the old server and [create a server endpoint](https://learn.microsoft.com/azure/storage/file-sync/file-sync-server-endpoint-create?tabs=azure-portal#create-a-server-endpoint) on the new server. Repeat this step for every sync group. For example, if the old server has 4 sever endpoints (4 sync groups), 4 server endpoints should be created on the new server.  
6.	Wait for the namespace download to complete to the new server. To monitor progress, see [How do I monitor the progress of a current sync session?](https://learn.microsoft.com/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?tabs=portal1%2Cazure-portal#how-do-i-monitor-the-progress-of-a-current-sync-session).

## User cut-over
7.	To redirect user access to the new Azure File Sync server, perform one of the following options:
    - Option #1: Rename the old server to a random name, then rename the new server to the same name as the old server. 
    -	Option #2: Use [DFS Namespaces (DFS-N)](https://learn.microsoft.com/windows-server/storage/dfs-namespaces/dfs-overview) to redirect users to the new server.

## Old Azure File Sync server
8.	Follow the steps in the [Deprovision or delete your Azure File Sync server endpoint](https://learn.microsoft.com/azure/storage/file-sync/file-sync-server-endpoint-delete#scenario-1-you-intend-to-delete-your-server-endpoint-and-stop-using-your-local-server--vm) documentation to verify that all files have synced to the Azure file share prior to deleting the server endpoint(s) on the old server.
9.	Once all server endpoint(s) are deleted on the old server, you can [unregister the server](https://learn.microsoft.com/en-us/azure/storage/file-sync/file-sync-server-registration#unregister-the-server).
