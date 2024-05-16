---
title: Replace an Azure File Sync server
description: How to replace an Azure File Sync server due to hardware decommissioning or end of support. 
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 03/22/2024
ms.author: kendownie
---

# Replace an Azure File Sync server

This article provides guidance on how to replace an Azure File Sync server due to hardware decommissioning or end of support (for example, Windows Server 2012 R2). 

## New Azure File Sync server

1. Deploy a new on-premises server or Azure virtual machine that's running a [supported Windows Server operating system version](file-sync-planning.md#operating-system-requirements).
2. [Install the latest Azure File Sync agent](file-sync-deployment-guide.md#install-the-azure-file-sync-agent) on the new server, then [register the server](file-sync-deployment-guide.md#register-windows-server-with-storage-sync-service) to the same Storage Sync Service as the server that's being replaced (referred to as "old server" in this guide).
3. Create file shares on the new server and verify that the share-level permissions match the permissions configured on the old server.
4. Optional: To reduce the amount of data that needs to be downloaded to the new server from the Azure file share, use Robocopy to copy the files in the cache from the old server to the new server. 

    ```console
    Robocopy <source> <destination> /MT:16 /R:2 /W:1 /COPYALL /MIR /DCOPY:DAT /XA:O /B /IT /UNILOG:RobocopyLog.txt
     ```
    Once the initial copy is completed, run the Robocopy command again to copy any remaining changes.

5. In the Azure portal, navigate to the Storage Sync Service. Go to the sync group which has a server endpoint for the old server and [create a server endpoint](file-sync-server-endpoint-create.md#create-a-server-endpoint) on the new server. Repeat this step for every sync group that has a server endpoint for the old server.
   
    For example, if the old server has four server endpoints (four sync groups), then you should create four server endpoints on the new server.
  	 
6. Wait for the namespace download to complete to the new server. To monitor progress, see [How do I monitor the progress of a current sync session?](/troubleshoot/azure/azure-storage/file-sync-troubleshoot-sync-errors?tabs=portal1%2Cazure-portal#how-do-i-monitor-the-progress-of-a-current-sync-session).

## User cut-over

To redirect user access to the new Azure File Sync server, perform one of the following options:
- Option #1: Rename the old server to a random name, then rename the new server to the same name as the old server. 
- Option #2: Use [Distributed File Systems Namespaces (DFS-N)](/windows-server/storage/dfs-namespaces/dfs-overview) to redirect users to the new server.

## Old Azure File Sync server

1. Follow the steps in the [Deprovision or delete your Azure File Sync server endpoint](file-sync-server-endpoint-delete.md#scenario-1-you-intend-to-delete-your-server-endpoint-and-stop-using-your-local-server--vm) documentation to verify that all files have synced to the Azure file share prior to deleting one or more server endpoints on the old server.
2. Once all server endpoints are deleted on the old server, you can [unregister the server](file-sync-server-registration.md#unregister-the-server).
