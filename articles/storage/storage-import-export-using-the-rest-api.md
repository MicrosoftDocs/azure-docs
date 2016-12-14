---
title: Using the Azure Import-Export Service REST API | Microsoft Docs
description: Learn how to use the Azure Import-Export Service REST API
author: renashahmsft
manager: aungoo
editor: tysonn
services: storage
documentationcenter: ''

ms.assetid: 233f80e9-2e7f-48e0-9639-5c7785e7d743
ms.service: storage
ms.workload: storage 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2015
ms.author: renash

---
# Using the Azure Import-Export Service REST API
The Microsoft Azure Import/Export Service exposes a REST API to enable programmatic control of import/export jobs. You can use the REST API to perform all of the import/export operations that you can perform with the [Azure classic portal](http://www.windowsazure.com/). Additionally, you can use the REST API to perform certain granular operations, such as querying the percentage completion of a job, which are not currently available in the classic portal.  
  
See [Using the Microsoft Azure Import/Export Service to Transfer Data to Blob Storage](storage-import-export-service.md) for an overview of the Import/Export service and a tutorial that demonstrates how to use the classic portal to create and manage import and export jobs.  
  
## Service Endpoints and Authentication  
 The Azure Import/Export service provides a set of REST APIs at the following HTTPS endpoint for communicating between a client and the service. Note that `<subscription-id>` is your subscription ID, available in the Azure classic portal:  
  
 `https://management.core.windows.net/<subscription-id>/services/importexport/`  
  
 To protect the security of customers’ data, the service endpoint is exposed only via HTTPS, not via HTTP, and anonymous requests are not allowed.  
  
 The Import/Export service is a Microsoft Azure service and uses the Azure Service Management authentication scheme. See [Authenticating Service Management Requests](assetId:///1becb7dc-1cdc-4db4-8ae8-7e351c96c251) for details on how to authenticate requests.  
  
## Versioning  
 Requests to the Import/Export service must conform to the versioning guidelines described in [Service Management Versioning](assetId:///bb009293-529c-4793-b925-0f8701f337d2). All requests must specify the `x-ms-version` header and set its value to `2014-05-01`or `2014-11-01`.  
  
## In This Section  
[Creating an Import Job](storage-import-export-creating-an-import-job.md)  
  
[Creating an Export Job](storage-import-export-creating-an-export-job.md)  
  
[Retrieving State Information for a Job](storage-import-export-retrieving-state-info-for-a-job.md)  
  
[Enumerating Jobs](storage-import-export-enumerating-jobs.md)  
  
[Cancelling and Deleting Jobs](storage-import-export-cancelling-and-deleting-jobs.md)  
  
[Backing Up Drive Manifests](storage-import-export-backing-up-drive-manifests.md)  
  
[Diagnostics and Error Recovery for Import-Export Jobs](storage-import-export-diagnostics-and-error-recovery.md)  
  
## See Also  
 [Storage Import/Export REST](/rest/api/storageservices/importexport/Storage-Import-Export-Service-REST-API-Reference)