---
title: Enumerating jobs in the Azure Import/Export service | MicrosoftDocs
description: Learn how to enumerate all of the Azure Import/Export service jobs in a subscription.
author: muralikk
manager: syadav
editor: tysonn
services: storage
documentationcenter: ''

ms.assetid: f2e619be-1bbd-4a54-9472-9e2f70a83b64
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/16/2016
ms.author: muralikk

---

# Enumerating Jobs
To enumerate all jobs in a subscription, call the [List Jobs](/rest/api/storageimportexport/jobs#Jobs_List) operation. `List Jobs` returns a list of jobs as well as the following attributes:

-   The type of job (Import or Export)

-   The current job state

-   The job's associated storage account

## See Also
 [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
