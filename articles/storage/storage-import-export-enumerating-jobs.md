---
title: Enumerating Jobs | MicrosoftDocs 
description: Learn how to enumerate all of the Azure Import-Export Service jobs in a subscription.
author: renashahmsft
manager: aungoo
editor: tysonn
services: storage
documentationcenter: ''

ms.assetid: f2e619be-1bbd-4a54-9472-9e2f70a83b64
ms.service: storage
ms.workload: storage 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2015
ms.author: renash

---

# Enumerating Jobs
To enumerate all jobs in a subscription, call the [List Jobs](/rest/api/storageservices/importexport/List-Jobs3) operation. `List Jobs` returns a list of jobs as well as the following attributes:  
  
-   The type of job (Import or Export)  
  
-   The current job state  
  
-   The job’s associated storage account  
  
-   The time the job was created  
  
## See Also  
 [Using the Import/Export Service REST API](storage-import-export-using-the-rest-api.md)