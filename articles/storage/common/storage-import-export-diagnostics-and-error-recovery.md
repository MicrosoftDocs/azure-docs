---
title: Diagnostics and error recovery for Azure Import/Export jobs | Microsoft Docs
description: Learn how to enable verbose logging for Microsoft Azure Import/Export service jobs.
author: muralikk
services: storage
ms.service: storage
ms.topic: article
ms.date: 01/23/2017
ms.author: muralikk
ms.subservice: common
---

# Diagnostics and error recovery for Azure Import/Export jobs
For each drive processed, the Azure Import/Export service creates an error log in the associated storage account. You can also enable verbose logging by setting the `LogLevel` property to `Verbose` when calling the [Put Job](/rest/api/storageimportexport/jobs) or [Update Job Properties](/rest/api/storageimportexport/jobs) operations.

 By default, logs are written to a container named `waimportexport`. You can specify a different name by setting the `DiagnosticsPath` property when calling the `Put Job` or `Update Job Properties` operations. The logs are stored as block blobs with the following naming convention: `waies/jobname_driveid_timestamp_logtype.xml`.

 You can retrieve the URI of the logs for a job by calling the [Get Job](/rest/api/storageimportexport/jobs) operation. The URI for the verbose log is returned in the `VerboseLogUri` property for each drive, while the URI for the error log is returned in the `ErrorLogUri` property.

You can use the logging data to identify the following issues.

## Drive errors

The following items are classified as drive errors:

-   Errors in accessing or reading the manifest file

-   Incorrect BitLocker keys

-   Drive read/write errors

## Blob errors

The following items are classified as blob errors:

-   Incorrect or conflicting blob or names

-   Missing files

-   Blob not found

-   Truncated files (the files on the disk are smaller than specified in the manifest)

-   Corrupted file content (for import jobs, detected with an MD5 checksum mismatch)

-   Corrupted blob metadata and property files (detected with an MD5 checksum mismatch)

-   Incorrect schema for the blob properties and/or metadata files

There may be cases where some parts of an import or export job do not complete successfully, while the overall job still completes. In this case, you can either upload or download the missing pieces of the data over network, or you can create a new job to transfer the data. See the [Azure Import/Export Tool Reference](storage-import-export-tool-how-to-v1.md) to learn how to repair the data over network.

## Next steps

* [Using the Import/Export service REST API](storage-import-export-using-the-rest-api.md)
