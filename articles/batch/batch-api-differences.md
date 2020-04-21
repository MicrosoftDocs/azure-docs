---
title: Differences between management APIs and service APIs - Azure Batch | Microsoft Docs
description: APIs work on the different layers of the Azure Batch service.
services: batch
author: LauraBrenner
manager: evansma

ms.service: batch
ms.topic: conceptual
ms.date: 02/26/2020 
ms.author: labrenne
ms.custom: seodec18
---

# Service level and management level APIs

Azure Batch has two sets of APIs, one for the service level and one for the management level. The naming is often similar but they return different results. If you want activity logs then you need to use the management APIs. Service level APIs bypass the Azure Resource Management layer and are not logged.


Batch management and Batch service both have APIs for Pool, for example. 
- This API to delete pool is targeted directly on the batch account:  https://docs.microsoft.com/rest/api/batchservice/pool/delete 

- This API to delete pool https://docs.microsoft.com/rest/api/batchmanagement/pool/delete is targeted at the management.azure.com layer.

