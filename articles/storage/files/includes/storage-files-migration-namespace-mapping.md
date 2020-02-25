---
title: DO NOT INDEX.
description: Mapping an existing file and folder structure to Azure file shares for use with Azure File Sync. A common text block, shared between migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

In this step, you are evaluating how many Azure file shares you will need.
A single Windows Server (or cluster) can sync up to 30 Azure file shares.
You may have more folders on your StorSimple that you currently share out locally as an SMB/NFS share to your users and apps. The easiest would be to envision for an on-premises share to map 1:1 to an Azure file share. If this number is manageably small, meaning below 30 for a single Windows Server - or you plan on having two Windows Servers (60) and so on, then a 1:1 mapping is recommended.

If you have more shares than 30, it is often not necessary to map an on-premises share 1:1 to an Azure file share.
Consider the following options:

**Share grouping:**
For instance, if your HR department has a total of 15 shares, then you could consider storing all of the HR data in a single Azure file share. This *will not* prevent you from creating the usual 15 SMB shares on your local Windows Server. It will only mean that you organize the root folders of these 15 shares under a common folder (as subfolders) and you sync the common root. That way you would only need a single Azure file share in the cloud for this group of on-premises shares.

**Volume sync:**
Azure File Sync supports syncing the root of a volume to an Azure file share.
All subfolders and files will be ending up in the same Azure file share. This *will not* prevent you from creating the appropriate number of currently existing SMB/NFS shares on your local Windows Server.

Other best practices to consider:
Other than the 30 Azure file share sync limit per server, the leading consideration is the efficiency of sync.
Sync can work in parallel when there are multiple locations on your server syncing to each their own Azure file share. The scale vector is not the size of all files in a sync scope. It is the number of items (files and folders) that need processing.

A single Azure file share can hold up to 100 TiB.
Azure File Sync supports syncing up to 100 million items per Azure file share.

It would be too simple to say: just sync the root of each of your volumes. There are benefits in syncing multiple locations, that help to keep the number of items lower per sync scope. Setting up AFS with a lower number of items is not just important for sync, but also benefits cloud-side restore from backups as well as aiding the speed of disaster recovery in case you lose your server and provision a new one that connects to the same Azure file shares.

Use a combination of the concepts above to help determine how many Azure file shares you need, and which parts of your existing StorSimple data will end up in which Azure file share.

Create a list that records your thoughts, such that you can refer to it in the next step. Staying organized here is important as it can be easy to lose details of your mapping plan when provisioning many resources at once.
