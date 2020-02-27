---
title: DO NOT INDEX.
description: Deploying the Azure File Sync cloud resource. A storage sync service. A common text block, shared between migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

In this step, you will need your Azure subscription credentials. The Azure subscription you use can be different from the one you use for StorSimple.

The core resource to configure Azure File Sync is called a "Storage Sync Service".
We recommend you deploy only one for all servers in the company, that may want to sync the same set of files now or in the future. If you have more than one StorSimple appliance, you can consider creating a storage sync service resource for each one of them. Only create multiple if you have distinct sets of servers that must never exchange data. Otherwise a single storage sync service is the best practice.

Choose an Azure region for your storage sync service that is close to your office location. All other cloud resources must be deployed in that same region.
Best practice is to create a new resource group in your subscription, to house sync and storage resources for easier management.

The following article describes how to deploy a storage sync service. Only follow this part of the doc. There will be links to other subsections of this doc in later steps.

[Learn how to deploy a Storage Sync Service.](../storage-sync-files-deployment-guide.md#deploy-the-storage-sync-service)
