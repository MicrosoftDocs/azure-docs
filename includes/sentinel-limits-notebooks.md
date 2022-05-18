---
title: "include file" 
description: "include file" 
services: microsoft-sentinel
author: cwatson-cat
tags: azure-service-management
ms.topic: "include"
ms.date: 04/27/2022
ms.author: cwatson
ms.custom: "include file"
---

The following limits apply to notebooks in Microsoft Sentinel. The limits are related to the dependencies on other services used by notebooks.

|Description|Limit |Dependency|
|-------|-------|-------|
| Total count of these assets per machine learning workspace: datasets, runs, models, and artifacts |10 million assets |Azure Machine Learning|
| Default limit for total compute clusters per region. Limit is shared between a training cluster and a compute instance. A compute instance is considered a single-node cluster for quota purposes. | 200 compute clusters per region|Azure Machine Learning|
|Storage accounts per region per subscription|250 storage accounts|Azure Storage|
|Maximum size of a file share by default|5 TB|Azure Storage|
|Maximum size of a file share with large file share feature enabled|100 TB|Azure Storage|
|Maximum throughput (ingress + egress) for a single file share by default|60 MB/sec|Azure Storage|
|Maximum throughput (ingress + egress) for a single file share  with large file share feature enabled|300 MB/sec|Azure Storage|
