---
title: How to add an Event Hub event source to your Azure Time Series Insights environment | Microsoft Docs
description: This tutorial covers how to add an event source that is connected to an Event Hub to your Time Series Insights environment
keywords: 
services: time-series-insights
documentationcenter: 
author: sandshadow
manager: almineev
editor: cgronlun

ms.assetid: 
ms.service: time-series-insights
ms.devlang: na
ms.topic: how-to-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/19/2017
ms.author: edett
---
# How to add an Event Hub event source

This tutorial covers how to use the Azure portal to add an event source that reads from an Event Hub to your Time Series Insights environment.

## Prerequisites

You have created an Event Hub and are writing events to it. For more information on Event Hubs, see <https://azure.microsoft.com/services/event-hubs/>

> [Consumer Groups] Each Time Series Insights event source needs to have its own dedicated consumer group that is not shared with any other consumers. If multiple readers consume events from the same consumer group, all readers are likely to see failures. Note that there is also a limit of 20 consumer groups per Event Hub. For details, see the [Event Hubs Programming Guide](../event-hubs/event-hubs-programming-guide.md).

## Choose an Import option

The settings for the event source can be entered manually or an event hub can be selected from the event hubs that are available to you.
In the **Import Option** selector, choose one of the following options:

* Provide Event Hub settings manually
* Use Event Hub from available subscriptions

### Select an available Event Hub

The following table explains each option in the New Event Source tab with its description when selecting an available Event Hub as an event source:

| PROPERTY NAME | DESCRIPTION |
| --- | --- |
| Event source name | The name of your event source. This name must be unique within your Time Series Insights environment.
| Source | Choose **Event Hub** to create an Event Hub event source.
| Subscription Id | Select the subscription in which this event hub was created.
| Service bus namespace | Select the Service Bus namespace that contains the Event Hub.
| Event hub name | Select the name of the Event Hub.
| Event hub policy name | Select the shared access policy, which can be created on the Event Hub Configure tab. Each shared access policy has a name, permissions that you set, and access keys. The shared access policy for your event source *must* have **read** permissions.
| Event hub consumer group | The Consumer Group to read events from the Event Hub. It is highly recommended to use a dedicated consumer group for your event source.

### Provide Event Hub settings manually

The following table explains each property in the New Event Source tab with its description when entering settings manually:

| PROPERTY NAME | DESCRIPTION |
| --- | --- |
| Event source name | The name of your event source. This name must be unique within your Time Series Insights environment.
| Source | Choose **Event Hub** to create an Event Hub event source.
| Subscription Id | The subscription in which this event hub was created.
| Resource group | The subscription in which this event hub was created.
| Service bus namespace | A Service Bus namespace is a container for a set of messaging entities. When you created a new Event Hub, you also created a Service Bus namespace.
| Event hub name | The name of your Event Hub. When you created your event hub, you also gave it a specific name
| Event hub policy name | The shared access policy, which can be created on the Event Hub Configure tab. Each shared access policy has a name, permissions that you set, and access keys. The shared access policy for your event source *must* have **read** permissions.
| Event hub policy key | The Shared Access key used to authenticate access to the Service Bus namespace. Type the primary or secondary key here.
| Event hub consumer group | The Consumer Group to read events from the Event Hub. It is highly recommended to use a dedicated consumer group for your event source.

## Next steps

1. Add a data access policy to your environment [Define data access policies](time-series-insights-data-access.md)
1. Access your environment in the [Time Series Insights Portal](https://insights.timeseries.azure.com)