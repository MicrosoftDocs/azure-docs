---
title: List all of your Azure Import/Export jobs| MicrosoftDocs
description: Learn how to list all of the Azure Import/Export service jobs in a subscription.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.subservice: common
---

# Enumerating jobs in the Azure Import/Export service
To enumerate all jobs in a subscription, call the [List Jobs](/rest/api/storageimportexport/jobs) operation. `List Jobs` returns a list of jobs as well as the following attributes:

-   The type of job (Import or Export)

-   The current job state

-   The job's associated storage account

## Next steps

* [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
