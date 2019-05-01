---
title: Transfer data with AzCopy and file storage | Microsoft Docs
description: Transfer data with AzCopy and file storage .
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 01/03/2019
ms.author: tamram
ms.subservice: common
---
# Transfer data with AzCopy and file storage 

## Create a file share

```azcopy
.\azcopy make "https://account.file.core.windows.net/share-name"
```