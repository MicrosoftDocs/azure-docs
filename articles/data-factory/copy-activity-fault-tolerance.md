---
title: Fault tolerance of copy activity in Azure Dat Factory | Microsoft Docs
description: 'Learn about the fault tolerance by skipping the compatible rows during copy using Azure Data Factory'
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2017
ms.author: jingwang

---
# Copy Activity fault tolerance - skip incompatible rows
The copy activity in Azure Data Factory offers you two ways to handle incompatible rows when copying data between source and sink data stores:

- You can abort and fail the copy activity when incompatible data is encountered (default behavior).
- You can continue to copy all of the data by adding fault tolerance and skipping incompatible data rows. In addition, you can log the incompatible rows in Azure Blob storage. You can then examine the log to learn the cause for the failure, fix the data on the data source, and retry the copy activity.

