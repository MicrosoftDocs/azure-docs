---
title: include file
description: include file
services: storage
author: khdownie
ms.service: azure-file-storage
ms.topic: include
ms.date: 2/20/2020
ms.author: kendownie
ms.custom: include file
---

To complete this step, you need your Azure subscription credentials.

The core resource to configure for Azure File Sync is called a *Storage Sync Service*. We recommend that you deploy only one for all servers that are syncing the same set of files now or in the future. Create multiple Storage Sync Services only if you have distinct sets of servers that must never exchange data. For example, you might have servers that must never sync the same Azure file share. Otherwise, using a single Storage Sync Service is the best practice.

Choose an Azure region for your Storage Sync Service that's close to your location. All other cloud resources must be deployed in the same region. To simplify management, create a new resource group in your subscription that houses sync and storage resources.

For more information, see the [section about deploying the Storage Sync Service](../articles/storage/file-sync/file-sync-deployment-guide.md#deploy-the-storage-sync-service) in the article about deploying Azure File Sync. Follow only this section of the article. There will be links to other sections of the article in later steps.