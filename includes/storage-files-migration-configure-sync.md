---
title: DO NOT INDEX.
description: Configure Azure File Sync. A common text block, shared between migration docs.
author: fauhse
ms.service: storage
ms.topic: conceptual
ms.date: 2/20/2020
ms.author: fauhse
ms.subservice: files
---

This step ties together all resources and folders you've set up on your Windows Server during the previous steps.

* Go to your storage sync service resource, using the Azure portal.
* Create a new *sync group* for each Azure file share. In Azure File Sync terminology, the Azure file share will become a *cloud endpoint* in the sync topology you are describing with the creation of a sync group. As you are creating the sync group, give it a familiar name, such that you recognize which set of files syncs here. Make sure you reference the Azure file share with a matching name.
* Once the sync group is created, follow the link to display it in the portal. You will see your Azure file share under "Cloud endpoints".
* Locate the command button to *+ Add Server Endpoint*. The folder on the local server you've provisioned, will become the path for this *server endpoint*.
