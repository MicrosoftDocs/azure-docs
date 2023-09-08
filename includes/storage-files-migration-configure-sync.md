---
title: include file
description: include file
services: storage
author: khdownie
ms.service: azure-storage
ms.topic: include
ms.date: 2/20/2020
ms.author: kendownie
ms.custom: include file
---

This step ties together all the resources and folders you've set up on your Windows Server instance during the previous steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Locate your Storage Sync Service resource.
1. Create a new *sync group* within the Storage Sync Service resource for each Azure file share. In Azure File Sync terminology, the Azure file share will become a *cloud endpoint* in the sync topology that you're describing with the creation of a sync group. When you create the sync group, give it a familiar name so that you recognize which set of files syncs there. Make sure you reference the Azure file share with a matching name.
1. After you create the sync group, a row for it will appear in the list of sync groups. Select the name (a link) to display the contents of the sync group. You'll see your Azure file share under **Cloud endpoints**.
1. Locate the **Add Server Endpoint** button. The folder on the local server that you've provisioned will become the path for this *server endpoint*.
