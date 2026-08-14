---
title: Recover an Azure File Sync server
description: Learn how to perform disaster recovery for an Azure File Sync server after a server-level failure. Set up a replacement server, create a new server endpoint, and perform the changeover.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 08/14/2026
ms.author: kendownie
# Customer intent: As an IT administrator, I want to recover an Azure File Sync server after a failure so that I can restore access to my data without significant downtime or loss.
---

# Recover an Azure File Sync server from a server-level failure

If the server hosting your Azure File Sync server endpoint fails but your data disk is still intact, you can recover your data. This article covers the disaster recovery steps for setting up a replacement server and re-syncing from the cloud.

First, on either a new on-premises Windows Server or an Azure virtual machine (VM), create a new data disk that's the same size as the original data disk. Creating a new data disk reduces the potential for hardware failure from the original data disk.

[Install the latest Azure File Sync agent](file-sync-deployment-guide.md#install-the-azure-file-sync-agent) on the new server, then [register the new server](file-sync-deployment-guide.md#register-windows-server-with-storage-sync-service) to the same Storage Sync Service as the original server.

## Create a new server endpoint

Now that your server is configured, [create and configure a new server endpoint](file-sync-deployment-guide.md#create-a-server-endpoint). Before configuring the new server endpoint, consider the following recovery-specific guidance:

If you want to enable cloud tiering, leave **Initial Download Mode** at its default setting. This setting speeds up disaster recovery because only the namespace is downloaded, creating tiered files. If instead you want to keep cloud tiering disabled, the only option for **Initial Download Mode** is to fully download all files.

While the namespace is being synced, don't copy data manually, because that action increases the download time. When the sync finishes, the agent downloads more data in the background. While this background recall occurs, you can continue working as normal. You don't need to wait for it to complete.

If there's data on your original server that didn't upload to the cloud before it went offline, you can potentially recover it. Copy the contents into the new server's volume by using the following Robocopy command.

> [!IMPORTANT]
> If you're recovering multiple servers simultaneously, complete the Robocopy copy on each server before proceeding to the changeover step. Running concurrent copies can cause conflicts.

```cmd
Robocopy <directory-in-old-drive> <directory-in-new-drive> /COPY:DATSO /MIR /DCOPY:AT /XA:O /B /IT /UNILOG:RobocopyLog.txt 
```

## Changeover

Now that everything is set up, you can redirect all your data access to the new server and detach the old data disk. You can also delete the old server endpoint and unregister the old server.

You completed your configuration. Your new server should be operating normally and you can access all data from the new server.
