---
title: Release Notes - Azure Event Grid IoT Edge | Microsoft Docs 
description: Azure Event Grid on IoT Edge Release Notes 
ms.date: 02/15/2022
ms.subservice: iot-edge
ms.topic: article
---

# Release Notes: Azure Event Grid on IoT Edge

> [!IMPORTANT]
> On March 31, 2023, Event Grid on Azure IoT Edge support will be retired, so make sure to transition to IoT Edge native capabilities prior to that date. For more information, see [Transition from Event Grid on Azure IoT Edge to Azure IoT Edge](transition.md). 



## 1.0.0-preview1

Initial release of Azure Event Grid on IoT Edge. Included features:

* Topic creation
* Event Subscription creation
* Advanced Filters
* Output batching
* Retry policies
* Module to module publishing
* Publish to WebHook as a destination
* Publish to IoT Edge Hub as a destination
* Publish to Azure Event Grid cloud service as a destination
* Persisted state for metadata
* Blob storage module integration

Tags: `1.0.0-preview1`

## 1.0.0-preview2

Preview 2 of Azure Event Grid on IoT Edge added:

* Configurable persisting events to disk
* Topic metrics
* Event subscription metrics
* Publish to Event Hubs as a destination
* Publish to Service Bus Queues as a destination
* Publish to Service Bus Topics as a destination
* Publish to Storage Queues as a destination

Tags: `1.0.0-preview2`, `1.0`, `latest`