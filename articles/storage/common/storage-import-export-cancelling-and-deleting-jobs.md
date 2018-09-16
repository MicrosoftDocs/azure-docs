---
title: Cancel and delete an Azure Import/Export job | Microsoft Docs
description: Learn how to cancel and delete jobs for the Microsoft Azure Import/Export service.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.component: common
---

# Canceling and deleting Azure Import/Export jobs

 To request that a job be canceled before it is in the `Packaging` state, call the [Update Job Properties](/rest/api/storageimportexport/jobs#Jobs_Update) operation and set the `CancelRequested` element to `true`. The job is canceled on a best-effort basis. If drives are in the process of transferring data, data may continue to be transferred even after cancellation has been requested.

 A canceled job is moved to the `Completed` state and is kept for 90 days, at which point it is deleted.

 To delete a job, call the [Delete Job](/rest/api/storageimportexport/jobs#Jobs_Delete) operation before the job has shipped (that is, while the job is in the `Creating` state). You can also delete a job when it is in the `Completed` state. After a job is deleted, its information and status are no longer accessible via the REST API or the Azure portal.

[!INCLUDE [storage-import-export-delete-personal-info.md](../../../includes/storage-import-export-delete-personal-info.md)]

## Next steps

* [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
