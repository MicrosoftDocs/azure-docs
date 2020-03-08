---
title: Configuring Azure File Sync
description: Configure Azure File Sync. A common text block, shared between migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

This step ties together all resources and folders you've set up on your Windows Server during the previous steps.

* Sign into the [Azure portal](https://portal.azure.com).
* Locate your Storage Sync Service resource.
* Create a new *sync group* within the Storage Sync Service resource for each Azure file share. In Azure File Sync terminology, the Azure file share will become a *cloud endpoint* in the sync topology you are describing with the creation of a sync group. As you are creating the sync group, give it a familiar name, such that you recognize which set of files syncs here. Make sure you reference the Azure file share with a matching name.
* Once the sync group is created, you will see a row for it appear in the list of sync groups. Click on the name (a link) to display the contents of the sync group. You will see your Azure file share under "Cloud endpoints".
* Locate the command button to *+ Add Server Endpoint*. The folder on the local server you've provisioned, will become the path for this *server endpoint*.
