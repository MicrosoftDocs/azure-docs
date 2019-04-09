---
title: Azure Batch Analytics | Microsoft Docs
description: Reference for Azure Batch Analytics.
services: batch
author: laurenhughes
manager: jeconnoc

ms.assetid: 
ms.service: batch
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: big-compute
ms.date: 04/20/2017
ms.author: lahugh
---

# Batch Analytics
The topics in Batch Analytics contain reference information for the events and alerts available for Batch service resources.

See [Azure Batch diagnostic logging](https://azure.microsoft.com/documentation/articles/batch-diagnostics/) for more information on enabling and consuming Batch diagnostic logs.

## Diagnostic logs

The Azure Batch service emits the following diagnostic log events during the lifetime of certain Batch resources.

**Service Log events**
* [Pool create](batch-pool-create-event.md)
* [Pool delete start](batch-pool-delete-start-event.md)
* [Pool delete complete](batch-pool-delete-complete-event.md)
* [Pool resize start](batch-pool-resize-start-event.md)
* [Pool resize complete](batch-pool-resize-complete-event.md)
* [Task start](batch-task-start-event.md)
* [Task complete](batch-task-complete-event.md)
* [Task fail](batch-task-fail-event.md)