---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-file-storage
 ms.topic: include
 ms.date: 09/04/2019
 ms.author: kendownie
 ms.custom: include file
---

## Error ConditionHeadersNotSupported from a Web Application using Azure Files from Browser

The ConditionHeadersNotSupported error occurs when accessing content hosted in Azure Files through an application that makes use of conditional headers, such as a web browser, access fails. The error states that condition headers aren't supported.

![Azure Files conditional headers error](media/storage-files-condition-headers/conditionalerror.png)

### Cause

Conditional headers aren't currently supported. Applications implementing them will need to request the full file every time the file is accessed.

### Workaround

When a new file is uploaded, the cache-control property by default is “no-cache”. To force the application to request the file every time, the file's cache-control property needs to be updated from “no-cache” to “no-cache, no-store, must-revalidate”. This can be achieved using [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/).

![Storage explorer content cache modification for Azure Files conditional headers](media/storage-files-condition-headers/storage-explorer-cache.png)