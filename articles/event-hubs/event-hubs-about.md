---
title: Event Hubs Overview | Microsoft Docs
description: Overview and introduction to Azure Event Hubs - Cloud-scale telemetry ingestion from websites, apps, and devices
services: event-hubs
documentationcenter: .net
author: ShubhaVijayasarathy
manager: darosa
editor: ''

ms.assetid:
ms.service: event-hubs
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/19/2018
ms.author: shvija

---
# Introducing Azure Streaming Data platform

Your organization needs data driven strategies to increase competitive advantage. You want to stream data or analyze real-time data to get valuable insights. Azure Event Hubs provides you the streaming platform with low-latency and seamless integration with Azure services to build the complete Big Data pipeline.  

## What is Azure Event Hubs?

Azure Event Hubs is a Big Data streaming Platform as a Service that ingests millions of events per second and providing low-latency high throughput for real-time analytics and visualization

## Why Azure Event Hubs?

### Fully Managed PaaS 
Completely managed service with no configuration or management overhead, so you focus on your business solutions 

### Scalable 
You can start low from MBs and grow to GBs and TBs of data. Use shared resources or completely dedicated resources. Event Hubs answers all streaming platform needs

### Real time and Batch
Use the Event Hubs Capture feature, which allows a single stream to support real time and batch-based pipelines, and reduces the complexity of your solution. Event Hubs Capture is the easiest way to load data into Azure. 

### Simple 
With clients available in various [languages (.NET, Java)](https://github.com/Azure/azure-event-hubs), you can easily send and receive your data from Event Hubs 

## What is Event Hubs Capture?
Azure Event Hubs Capture enables you to automatically deliver the streaming data in Event Hubs to an [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) or [Azure Data Lake Store](https://azure.microsoft.com/services/data-lake-store/) account of your choice, with the added flexibility of specifying a time or size interval. Setting up Capture is fast, there are no administrative costs to run it, and it scales automatically with Event Hubs throughput units. Event Hubs Capture is the easiest way to load streaming data into Azure, and enables you to focus on data processing rather than on data capture. 

## Next Steps
* [Ingest into Event Hubs](https://review.docs.microsoft.com/en-us/azure/event-hubs/event-hubs-quickstart-namespace-powershell?branch=release-mvc-event-hubs)
* [Process events from Event Hubs](https://review.docs.microsoft.com/en-us/azure/event-hubs/event-hubs-quickstart-namespace-powershell?branch=release-mvc-event-hubs)


