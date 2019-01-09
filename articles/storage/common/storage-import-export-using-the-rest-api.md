---
title: Using the Azure Import/Export service REST API | Microsoft Docs
description: Learn where to find resources for using the Azure Import/Export service REST API, including both how-to and reference material.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/15/2017
ms.author: muralikk
ms.component: common
---
# Using the Azure Import/Export service REST API

The Microsoft Azure Import/Export service exposes a REST API to enable programmatic control of import/export jobs. You can use the REST API to perform all of the import/export operations that you can perform with the [Azure portal](https://portal.azure.com/). Additionally, you can use the REST API to perform certain granular operations, such as querying the percentage completion of a job, which is not currently available in the Azure portal.

See [Using the Microsoft Azure Import/Export service to Transfer Data to Blob Storage](../storage-import-export-service.md) for an overview of the Import/Export service and a tutorial that demonstrates how to use the portal to create and manage import and export jobs.

## Service endpoints

The Azure Import/Export service is a resource provider for Azure Resource Manager and provides a set of REST APIs at the following HTTPS endpoint for managing import/export jobs:

```
https://management.azure.com/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.ImportExport/jobs/<job-name>
```

## Versioning

Requests to the Import/Export service must specify the `api-version` parameter and set its value to `2016-11-01`.

## Import/Export service operations

[Creating an import job](../storage-import-export-creating-an-import-job.md)

[Creating an export job](../storage-import-export-creating-an-export-job.md)

[Retrieving state information for a job](storage-import-export-retrieving-state-info-for-a-job.md)

[Enumerating jobs](../storage-import-export-enumerating-jobs.md)

[Cancelling and deleting jobs](storage-import-export-cancelling-and-deleting-jobs.md)

[Backing Up drive manifests](../storage-import-export-backing-up-drive-manifests.md)

[Diagnostics and error recovery for Import/Export jobs](../storage-import-export-diagnostics-and-error-recovery.md)

## Next steps

* [Storage Import/Export REST](/rest/api/storageimportexport)
