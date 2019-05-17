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

### Cause

Conditional headers are not yet supported.

### Workaround

When a new file is uploaded, the cache-control property by default is “no-cache”.   However; to force the browser to actually request the file every single time with no errors, good to go, it needs to be updated from “no-cache” to “no-cache, no-store, must-revalidate”.

![Cache-control-property update](media/storage-files-condition-headers/cachecontroloptions.png)