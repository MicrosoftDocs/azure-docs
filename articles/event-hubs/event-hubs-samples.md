---
title: Samples - Azure Event Hubs | Microsoft Docs
description: This article provides a list of samples for Azure Event Hubs that are on GitHub.  
services: event-hubs
documentationcenter: na
author: ShubhaVijayasarathy
manager: timlt
editor: ''

ms.assetid: 
ms.service: event-hubs
ms.custom: seodec18
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/06/2018
ms.author: shvija

---

# Git repositories with samples for Azure Event Hubs 
You can find Event Hubs samples on [GitHub](https://github.com/Azure/azure-event-hubs/tree/master/samples). These samples demonstrate key features in [Azure Event Hubs](/azure/event-hubs/). This article categorizes and describes the samples available, with links to each.

## .NET samples

| Sample name | Description | 
| ----------- | ----------- | 
| [SampleSender](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleSender) | This sample shows how to write a .NET Core console application that sends a set of events to an event hub. |
| [SampleEHReceiver](https://github.com/Azure/azure-event-hubs/tree/master/samples/DotNet/Microsoft.Azure.EventHubs/SampleEphReceiver) | This sample shows how to write a .NET Core console application that receives a set of events from an event hub by using the Event Processor Host library.  | 

## Java samples

| Sample name | Description | 
| ----------- | ----------- | 
| [SendBatch](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java/Basic/SendBatch)  | This sample illustrates how to ingest batches of events into your event hub. | 
| [SimpleSend](https://github.com/Azure/azure-event-hubs/tree/master/samples/Java/Basic/SimpleSend) | This sample illustrates how to ingest events into your event hub. |
| [AdvanceSendOptions](https://github.com/Azure/azure-event-hubs/blob/master/samples/Java/Basic/AdvancedSendOptions) | This sample illustrates the various options available with Event Hubs to ingest events. |
| [ReceiveByDateTime](https://github.com/Azure/azure-event-hubs/blob/master/samples/Java/Basic/ReceiveByDateTime) | This sample illustrates how to receive events from an event hub partition using a specific date-time offset. |
| [ReceiveUsingOffset](https://github.com/Azure/azure-event-hubs/blob/master/samples/Java/Basic/ReceiveUsingOffset) | This sample illustrates how to receive events from an event hub partition using a specific data offset. |  
| [ReceiveUsingSequenceNumber](https://github.com/Azure/azure-event-hubs/blob/master/samples/Java/Basic/ReceiveUsingSequenceNumber) | This sample illustrates how can receive from an event hub partitions using a sequence number. |   
| [EventProcessorSample](https://github.com/Azure/azure-event-hubs/blob/master/samples/Java/Basic/EventProcessorSample) |This sample illustrates how to receive events from an event hub using the event processor host, which provides automatic partition selection and fail-over across multiple concurrent receivers. | 
| [AutoScaleOnIngress](https://github.com/Azure/azure-event-hubs/blob/master/samples/Java/Benchmarks/AutoScaleOnIngress) | This sample illustrates how an event hub can automatically scale up on high loads. The sample will send events at a rate that just exceed the configured rate of an event hub, causing the event hub to scale up. | 
| [IngressBenchmark](https://github.com/Azure/azure-event-hubs/blob/master/samples/Java/Benchmarks/IngressBenchmark) | This sample allows measuring the ingress rate. | 

## Python samples
You can find Python samples for Azure Event Hubs in the [azure-event-hubs-python](https://github.com/Azure/azure-event-hubs-python/tree/master/examples) GitHub repository.

## Node.js samples
You can find Node.js samples for Azure Event Hubs in the [azure-sdk-for-js](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/eventhub/event-hubs/samples) GitHub repository.

## Go samples
You can find Go samples for Azure Event Hubs in the [azure-event-hubs-go](https://github.com/Azure/azure-event-hubs-go/tree/master/_examples) GitHub repository.

## Azure CLI samples
You can find Azure CLI samples for Azure Event Hubs in the [azure-event-hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples/Management/CLI) GitHub repository.

## Azure PowerShell samples
You can find Azure PowerShell samples for Azure Event Hubs in the [azure-event-hubs](https://github.com/Azure/azure-event-hubs/tree/master/samples/Management/PowerShell) GitHub repository.
 
## Apache Kafka samples
You can find samples for the Event Hubs for Apache Kafka feature in the [azure-event-hubs-for-kafka](https://github.com/Azure/azure-event-hubs-for-kafka) GitHub repository.

## Next steps
You can learn more about Event Hubs in the following articles:

- [Event Hubs overview](event-hubs-what-is-event-hubs.md)
- [Event Hubs features](event-hubs-features.md)
- [Event Hubs FAQ](event-hubs-faq.md)