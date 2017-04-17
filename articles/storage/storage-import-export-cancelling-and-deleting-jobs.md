---
title: Cancel and delete an Azure Import/Export job | Microsoft Docs
description: Learn how to cancel and delete jobs for the Microsoft Azure Import/Export service.
author: muralikk
manager: syadav
editor: tysonn
services: storage
documentationcenter: ''

ms.assetid: fd3d66f0-1dbb-4c75-9223-307d5abaeefc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk

---

# Canceling and deleting Azure Import/Export jobs

You can request that a job be cancelled before it is in the `Packaging` state by calling the [Update Job Properties](/rest/api/storageimportexport/jobs#Jobs_Update) operation and setting the `CancelRequested` element to `true`. The job will be cancelled on a best-effort basis. If drives are in the process of transferring data, data may continue to be transferred even after cancellation has been requested.

 A cancelled job will move to the `Completed` state and be kept for 90 days, at which point it will be deleted.

 To delete a job, call the [Delete Job](/rest/api/storageimportexport/jobs#Jobs_Delete) operation before the job has shipped (*i.e.*, while the job is in the `Creating` state). You can also delete a job when it is in the `Completed` state. After a job has been deleted, its information and status are no longer accessible via the REST API or the Azure portal.

## Next steps

* [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
