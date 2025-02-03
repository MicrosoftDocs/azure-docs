---
title: Replace a drive on an Azure File Sync server
description: Learn how to replace a drive on an Azure File Sync server because of hardware decommissioning, optimization, or end of support. 
author: sindamnataraj
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 01/25/2025
ms.author: nasindam
---

# Replace a drive on an Azure File Sync server

This article explains how to replace an existing drive that hosts one or more Azure File Sync server endpoints, either on an on-premises Windows Server installation or on a virtual machine (VM) in the cloud. This replacement could be because the drive is failing, or because you want to optimize and balance resources by using a different size or type of drive. Some of the steps will differ slightly, depending on whether your Azure File Sync registered server is located on-premises or in Azure.

> [!IMPORTANT]
> Replacing a drive always involves some amount of downtime for users. We recommend following the steps in this article. If you simply re-create the drive and restart the storage sync service without first deleting the server endpoints, the server will automatically throw away the sync database.

## Step 1: Create a temporary VM with new server endpoints

Create a temporary VM (Server B) that's as close as possible to your registered server (Server A). If your registered server is on-premises, create a VM on-premises. If your registered server is in the cloud, create a VM in the cloud, preferably in the same region as your registered server.

Then, [create the server endpoints](file-sync-server-endpoint-create.md) on Server B. Enable cloud tiering. Temporarily set the volume free space policy to 99% so that you can tier as many files as possible to the cloud.

## Step 2: Copy data to the temporary VM

Use Robocopy, a Server Message Block (SMB) copy tool that's built into Windows, to copy the data from Server A to Server B. Run the following command from the Windows command line on Server A:

```console
robocopy <Server A SourcePath> <Server B Dest.Path> /MT:16 /R:2 /W:1 /COPYALL /MIR /DCOPY:DAT /XA:O /B /IT /UNILOG:RobocopyLog.txt
```

## Step 3: Transition users to the temporary VM

Removing user access to your server endpoints causes downtime. To minimize downtime, perform these steps as quickly as possible:

1. Remove SMB access to the server endpoints on Server A. Don't delete the server endpoints yet.
2. On Server A, change the startup type of the Storage Sync Agent Service from **Automatic** to **Disabled**, and then put it in the **Stopped** state.
3. Run Robocopy again to copy any changes that happened since the last run. From Server A, run:
  
    ```console
    robocopy <SourcePath> <Dest.Path> /MT:16 /R:2 /W:1 /COPYALL /MIR /DCOPY:DAT /XA:O /B /IT /UNILOG:RobocopyLog.txt
    ```

4. Enable SMB access to the server endpoints on Server B. Users should now be able to access the file share from the temporary VM (Server B).
5. On Server A, change the startup type of the Storage Sync Agent Service from **Disabled** to **Automatic**, and then put it in the **Started** state.

## Step 4: Delete old server endpoints and replace the drive

When you're sure that user access is restored, [delete the server endpoints](file-sync-server-endpoint-delete.md) on Server A. If you get an error that server endpoint deletion failed, make sure that the Storage Sync Agent Service on Server A is in the **Started** state.

Replace the drive on Server A. Make sure the drive letter of the replaced drive is the same as it was before the replacement.

## Step 5: Create new server endpoints and copy data to the new drive

Re-create the server endpoints on Server A. Enable cloud tiering. Temporarily set the volume free space policy to 99% so that you can tier as many files as possible to the cloud.

Use Robocopy to copy the data to the new drive on Server A. Run the following command from the Windows command line on Server B:

```console
robocopy <Server B SourcePath> <Server A Dest.Path> /MT:16 /R:2 /W:1 /COPYALL /MIR /DCOPY:DAT /XA:O /B /IT /UNILOG:RobocopyLog.txt
```

## Step 6: Restore user access to the registered server

Removing user access to your server endpoints on the temporary VM causes downtime. To minimize downtime, perform these steps as quickly as possible:

1. Remove SMB access to the server endpoints on Server B. Don't delete the server endpoints yet.
2. Run Robocopy again to copy any changes that happened since the last run. From Server B, run:

    ```console
    robocopy <SourcePath> <Dest.Path> /MT:16 /R:2 /W:1 /COPYALL /MIR /DCOPY:DAT /XA:O /B /IT /UNILOG:RobocopyLog.txt
    ```

3. Make sure that the Storage Sync Agent Service on Server A is in the **Started** state.
4. Enable SMB access to the server endpoints on Server A.
5. Sign in to the Azure portal. Go to the sync group and verify that the cloud endpoint is syncing to the server endpoints on Server A. Users should now be able to access the file share from your registered server.

   Remember to change your volume free space policy to a reasonable level, such as 10-20%.
