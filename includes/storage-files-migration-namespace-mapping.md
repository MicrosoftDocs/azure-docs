---
title: Map a folder structure to an Azure File Sync topology.
description: Mapping an existing file and folder structure to Azure file shares for use with Azure File Sync. A common text block, shared between migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

In this step, you are evaluating how many Azure file shares you need. A single Windows Server (or cluster) can sync up to 30 Azure file shares.

You may have more folders on your StorSimple that you currently share out locally as an SMB shares to your users and apps. The easiest would be to envision for an on-premises share to map 1:1 to an Azure file share. If this number is manageably small, meaning below 30 for a single Windows Server, or you plan on having two Windows Servers (60) and so on, then a 1:1 mapping is recommended.

If you have more shares than 30, it is often unnecessary to map an on-premises share 1:1 to an Azure file share.
Consider the following options:

#### Share grouping

For instance, if your HR department has a total of 15 shares, then you could consider storing all of the HR data in a single Azure file share. Storing multiple on-premises shares in one Azure file share does not prevent you from creating the usual 15 SMB shares on your local Windows Server. It only means that you organize the root folders of these 15 shares as subfolders under a common folder. You then sync this common folder to an Azure file share. That way, only a single Azure file share in the cloud is needed for this group of on-premises shares.

#### Volume sync

Azure File Sync supports syncing the root of a volume to an Azure file share.
If you sync the root folder, then all subfolders and files will end up in the same Azure file share.

#### Other best practices to consider

Other than the 30 Azure file share sync limit per server, the leading consideration is the efficiency of sync.

When there are multiple shares on your server each syncing to their own Azure file share, sync can work in parallel for all of them. The scale vector is not the size of all files in a sync scope. It is the number of items (files and folders) that need processing.

A single Azure file share can hold up to 100 TiB.
Azure File Sync supports syncing up to 100 million items per Azure file share.

Synching the root volume will not always be the best answer. There are benefits in syncing multiple locations, doing so helps keep the number of items lower per sync scope. Setting up Azure file sync with a lower number of items is not just important for sync, but also benefits cloud-side restore from backups as well as aiding the speed of disaster recovery in case you lose your server and provision a new one that connects to the same Azure file shares.

Use a combination of the concepts above to help determine how many Azure file shares you need, and which parts of your existing StorSimple data will end up in which Azure file share.

Create a list that records your thoughts, such that you can refer to it in the next step. Staying organized here is important as it can be easy to lose details of your mapping plan when provisioning many resources at once.
