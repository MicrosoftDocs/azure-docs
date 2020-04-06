---
title: Deploy a Storage Sync Service
description: Deploying the Azure File Sync cloud resource. A Storage Sync Service. A common text block, shared between migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

In this step, you need your Azure subscription credentials.

The core resource to configure Azure File Sync is called a "Storage Sync Service".
We recommend you deploy only one for all servers in the company that syncing the same set of files now or in the future. Only create multiple Storage Sync Services if you have distinct sets of servers that must never exchange data. (for example: sync the same Azure file share). Otherwise a single Storage Sync Service is the best practice.

Choose an Azure region for your Storage Sync Service that is close to your office location. All other cloud resources must be deployed in the same region.
To simplify management, create a new resource group in your subscription that houses sync and storage resources.

The following article describes how to deploy a Storage Sync Service. Only follow this part of the doc. There will be links to other subsections of this doc in later steps.

[Learn how to deploy a Storage Sync Service.](../articles/storage/files/storage-sync-files-deployment-guide.md#deploy-the-storage-sync-service)
