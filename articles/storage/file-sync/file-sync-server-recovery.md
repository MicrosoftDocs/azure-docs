---
title: Recover an Azure File Sync server
description: Learn how to recover an Azure File Sync server from a server-level failure. Create a new server endpoint and perform the changeover.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 06/05/2024
ms.author: kendownie
---

# Recover an Azure File Sync server from a server-level failure

If the server hosting your Azure file share fails but your data disk is still intact, you might be able to recover the data. This article covers the general steps for successfully recovering your data.

First, on either a new on-premises Windows Server or an Azure virtual machine (VM), create a new data disk that's the same size as the original data disk. Creating a new data disk reduces the potential for hardware failure from the original data disk.

[Install the latest Azure File Sync agent](file-sync-deployment-guide.md#install-the-azure-file-sync-agent) on the new server, then [register the new server](file-sync-deployment-guide.md#register-windows-server-with-storage-sync-service) to the same Storage Sync Service as the original server.

## Create a new server endpoint

Now that your server is configured, [create and configure a new server endpoint](file-sync-deployment-guide.md#create-a-server-endpoint). For recovery purposes, there are a few things you should consider before configuring your new server endpoint:

If you want to enable cloud tiering, leave **Initial Download Mode** at its default setting. This allows for a faster disaster recovery because only the namespace is downloaded, creating tiered files. If instead you want to keep cloud tiering disabled, the only option for **Initial Download Mode** is to fully download all files.

While the namespace is being synced, don't copy data manually, because that will increase the download time. When the sync completes, additional data will download in the background. While this background recall occurs, feel free to continue working as normal. You don't need to wait for it to complete.

If there is data on your original server that didn't upload to the cloud before it went offline, you can potentially recover it. You can do this by copying its contents into the new server's volume using the following Robocopy command.

> [!IMPORTANT]
> If you're recovering more than one VM/machine, don't run this command. Wait for this copy to complete before moving to the next step.

```bash
Robocopy <directory-in-old-drive> <directory-in-new-drive> /COPY:DATSO /MIR /DCOPY:AT /XA:O /B /IT /UNILOG:RobocopyLog.txt 
```

## Changeover

Now that everything is set up, you can redirect all your data access to the new server and detach the old data disk. You can also delete the old server endpoint and unregister the old server.

You've now completed your configuration. Your new server should be operating normally and all data can be accessed from the new server.
