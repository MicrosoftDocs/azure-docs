---
title: Recover an Azure File Sync equipped server from a server-level failure
description: Learn how to recover an Azure File Sync equipped server from a server-level failure
author: mtalasila
ms.service: storage
ms.topic: how-to
ms.date: 6/01/2021
ms.author: mtalasila
ms.subservice: files
---

# Recover an Azure File Sync equipped server from a server-level failure

If you experience a server-level failure where the data disk is still intact, and you need to recover data at a particular server endpoint, follow these steps: 

Create a new data disk on an existing on-premises Windows Server or Azure VM. Ensure that this new disk is the same size as the data disk on the faulty server.  

Install the latest Azure File Sync agent onto the new server. 

Register the server to the same Storage Sync Service resource as the faulty server. 

Create a new server endpoint on the new data disk in the same sync group that the faulty server was previously in. This links the new data disk to the same Azure file share in the cloud. Set tiering policies as desired. 

During server endpoint creation, if you choose to enable cloud tiering, leave the optional parameter “Initial Download Mode” as the default. This option allows for a faster disaster recovery, since only the namespace is downloaded, creating tiered files. Refrain from copying data manually while the namespace is being synced to the server, as this will increase the time it takes for the namespace to download. After the namespace is synced to the server, there will be a background download of data. Feel free to continue operations as normal while background recall is occurring. You don't need to wait for background recall to complete.  

If you choose to keep cloud tiering disabled, the only option for “Initial Download Mode” is to fully download all files. Refrain from copying data manually while the files are being downloaded as this will only delay the time it takes for this process to complete. 

(Optional- only do this if you have a single VM/machine) If there is still data on your original server that wasn’t uploaded to the cloud share before the original server went offline. It is possible to make that older data volume available by copying its contents into the new server’s volume to recover this subset of data. If you would like to do this, please use the Robocopy command below: Wait for this copy to finish before moving on to the next step. 

 

Robocopy <directory-in-old-drive> <directory-in-new-drive> /COPY:DATSO /MIR /DCOPY:AT /XA:O /B /IT /UNILOG:RobocopyLog.txt 

Warning: Only use this Robocopy command if you only have one server endpoint in the sync group that got broken and you are replacing it. Otherwise, move on to the next step.  

Re-direct all your data access to the new server 

Detach the older data disk. It is not needed anymore. 

At this point, you can delete the older server endpoint and unregister that older server. 

You’re done! Everything is set up and data can be accessed from this new server. 