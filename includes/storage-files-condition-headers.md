---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 05/17/2019
 ms.author: rogarana
 ms.custom: include file
---

## Error ConditionHeadersNotSupported from a Web Application using Azure Files from Browser

When accessing content hosted in Azure Files through an application that makes use of conditional headers, such as a web browser, access fails, displaying a ConditionalHeaderNotSupported error.

![ConditionHeaderNotSupported Error](media/storage-files-condition-headers/conditionalerror.png)

### Cause

Conditional headers are not yet supported, applications implementing them will need to request the full file every time the file is accessed.

### Workaround

When a new file is uploaded, the cache-control property by default is “no-cache”. To force the application to request the file every time, the file's cache-control property needs to be updated from “no-cache” to “no-cache, no-store, must-revalidate”.

![Cache-control-property update](media/storage-files-condition-headers/cachecontroloptions.png)