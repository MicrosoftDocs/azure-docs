---
title: Diagnostics and Error Recovery for Import-Export Jobs | Microsoft Docs
description: Learn how to enable verbose logging for the Microsoft Azure Import-Export Service jobs 
author: renashahmsft
manager: aungoo
editor: tysonn
services: storage
documentationcenter: ''

ms.assetid: 096cc795-9af6-4335-9fe8-fffa9f239a17
ms.service: storage
ms.workload: storage 
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/25/2015
ms.author: renash

---

# Diagnostics and Error Recovery for Import-Export Jobs
For each drive processed, the Azure Import/Export service creates an error log in the associated storage account. You can also enable verbose logging by setting the `EnableVerboseLog` property to `true` when calling the [Put Job](/rest/api/storageservices/importexport/Put-Job) or [Update Job Properties](/rest/api/storageservices/importexport/Update-Job-Properties) operations.  
  
 By default, logs are written to a container named `waimportexport`. You can specify a different name by setting the `ImportExportStatesPath` property when calling the `Put Job` or `Update Job Properties` operations. The logs are stored as block blobs with the following naming convention: `waies/jobname_driveid_timestamp_logtype.xml`.  
  
 You can retrieve the URI of the logs for a job by calling the [Get Job](/rest/api/storageservices/importexport/Get-Job3) operation. The URI for the verbose log is returned in the `VerboseLogUri` property for each drive, while the URI for the error log is returned in the `ErrorLogUri` property.  
  
You can use the logging data to identify the following issues:  
  
**Drive Errors**  
  
-   Errors in accessing or reading the manifest file  
  
-   Incorrect BitLocker keys  
  
-   Drive read/write errors  
  
**Blob Errors**  
  
-   Incorrect or conflicting blob or names  
  
-   Missing files  
  
-   Blob not found  
  
-   Truncated files (the files on the disk are smaller than specified in the manifest)  
  
-   Corrupted file content (for import jobs, detected with an MD5 checksum mismatch)  
  
-   Corrupted blob metadata and property files (detected with an MD5 checksum mismatch)  
  
-   Incorrect schema for the blob properties and/or metadata files  
  
There may be cases where some parts of an import or export job do not complete successfully, while the overall job still completes. In this case, you can either upload or download the missing pieces of the data over network, or you can create a new job to transfer the data. See the [Azure Import-Export Tool Reference](storage-import-export-tool-how-to-v1.md) to learn how to repair the data over network.  
  
## See Also  
[Using the Import/Export Service REST API](storage-import-export-using-the-rest-api.md)