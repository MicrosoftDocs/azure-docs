---
title: Plan your Time Series Insights Update environment | Microsoft Docs
description: Plan your Time Series Insights Update environment 
author: kingdomofends
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/20/2018
ms.author: Shiful.Parti
---

# Plan your Time Series Insights Update environment

This article describes how to plan your Azure Time Series Insights environment to ensure you are able to get up and running quickly.  

## Best practices

To get started with Time Series Insights, it’s best if you have identified your time series ID(s) and time stamp property, built your model, and understand how to send events efficiently in JSON.  Additionally, it’s best to configure your environment to suit your business disaster recovery needs at creation time rather than post creation time.  

The Time Series Insights update employs a pay-as-you-go business model.  For more information about charges and capacity, see Time Series Insights pricing.
Configuring time series ID and timestamp property

To create a new Azure Time Series Insights environment, you must select a time series ID property which acts as a logical partition for your data.  It can’t be changed later, so it’s very important to get this right.  You can select up to 3 keys to either create uniqueness or to differentiate between multiple fleets of assets.  Please see the storage and ingress article for more details.  

The timestamp property is also very important.  You can designate this property when adding event sources.  Each event source has its own timestamp property, and these can be different across event sources.  To determine the timestamp property value, you need to understand the message format of the message data sent to your event source. This value is the name of the specific event property in the message data that you want to use as the event timestamp. The value is case-sensitive. When left blank, the event enqueue time within the event source is used as the event timestamp.  If you are sending historical data or batching events, you likely want to make this designation as the enqueued time will likely not be appropriate.  More on this concept here.  

## Understand the time series model

You can configure your Time Series Insights environment’s time series model.  The new model makes it easy to find and analyze IoT data by enabling curation, maintenance, and enrichment of time series data to help establish consumer-ready data sets.  The model uses the time series ID’s, which map to the concept of an instance, and associate the unique asset with variables (known as types) and hierarchies.  You can learn all about the model here.  
The model is dynamic so you can build it at any time.  However, you’ll be able to get started more quickly if it’s built and uploaded prior to you beginning to push data into Time Series Insights.  With that in mind, it’s advised to review this document and begin to build your model.  For many customers, we expect the time series model to map to an existing asset model or ERP system already in place.  For those that do not have an existing model, we’ve built a user experience to get going fast.  More on that experience here.  

## Shaping your events

It's important to ensure the way you send events to TSI is efficient. In short, we would expect most metadata to be stored in the aforementioned time series model as instance fields and events only contain information like time series ID, timestamp, and the value. With this in mind, we suggest reviewing the JSON shaping section of our Sending events documentation.

## Business disaster recovery

As an Azure service, Time Series Insights provides high availability (HA) using redundancies at the Azure region level, without any additional work required by the solution. The Microsoft Azure platform also includes features to help you build solutions with disaster recovery (DR) capabilities or cross-region availability. If you want to provide global, cross-region high availability for devices or users, take advantage of these Azure DR features. The article Azure Business Continuity Technical Guidance describes the built-in features in Azure for business continuity and DR. The Disaster recovery and high availability for Azure applications paper provides architecture guidance on strategies for Azure applications to achieve HA and DR.

Azure Time Series Insights does not have built-in business disaster recovery (BCDR). By default Azure Storage, Azure IoT Hub, and Event Hubs have recovery built in.

To learn more about Azure Storage’s BCDR policies, head here.
To learn more about IoT Hub's BCDR policies, head here.
To learn more about Event hub's BCDR policies, head here.

However, customers that require BCDR can still implement a recovery strategy using the following method. By creating a second Time Series Insights environment in a backup Azure region and send events to this secondary environment from the primary event source, leveraging a second dedicated consumer group and that event source's BCDR guidelines.

1. Create environment in second region. More on creating a Time Series Insights environment here.
1. Create a second dedicated consumer group for your event source and connect that event source to the new environment. Be sure to designate the second, dedicated consumer group. You can learn more about this by following either IoT Hub documentation or Event hub documentation.
1. If your primary region were to go down during a disaster incident, switch over operations to the backup Time Series Insights environment.

It is important to note during any failover scenario there may be a delay before Time Series Insights can start processing messages again: this can cause a spike in message processing. For more information please take a look at this document

