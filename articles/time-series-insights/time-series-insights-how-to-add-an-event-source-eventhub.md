---
title: How to add an Event Hub event source to your Azure Time Series Insights environment | Microsoft Docs
description: This article describes how to add an event source that is connected to an Event Hub to your Time Series Insights environment.
services: time-series-insights
ms.service: time-series-insights
author: sandshadow
ms.author: edett
manager: jhubbard
editor: MarkMcGeeAtAquent, jasonwhowell, kfile, MicrosoftDocs/tsidocs
ms.reviewer: v-mamcge, jasonh, kfile, anshan
ms.devlang: csharp
ms.workload: big-data
ms.topic: article | overview | quickstart | sample | tutorial | troubleshooting
ms.date: 11/15/2017
---
# How to add an Event Hub event source to Time Series Insights environment

This article describes how to use the Azure portal to add an event source that reads data from an Event Hub into your Time Series Insights environment.

## Prerequisites
- Create an Event Hub. For more information on Event Hubs, see [Create an Event Hubs namespace and an event hub using the Azure portal](../event-hubs/event-hubs-create.md)
- The Event Hub needs to have active message events being sent in. For more information, see [Send events to Azure Event Hubs using the .NET Framework](../event-hubs/event-hubs-dotnet-framework-getstarted-send.md).
- Create a dedicated consumer group in Event Hub for the Time Series Insight environment to consume from. Each Time Series Insights event source needs to have its own dedicated consumer group that is not shared with any other consumers. If multiple readers consume events from the same consumer group, all readers are likely to see failures. Note that there is also a limit of 20 consumer groups per Event Hub. For details, see the [Event Hubs Programming Guide](../event-hubs/event-hubs-programming-guide.md).

## Add a new event source

1. In the Azure portal, locate your existing Time Series Insights environment.

2. Under the **Environment Topology** heading, click **Event Sources**.

3. Click **Add**.

4. Provide an **Event source name** unique to this Time Series Insights environment, such as **EHSource1**.

5. Select the **Source** as **Event Hub**.

6. Select the appropriate **Import option**. 
   - If you already have an existing Event Hub on one of your subscriptions, it is easiest to select **Use Event Hub from available subscriptions**. 
   - If the Event Hub is external to your subscriptions, or you wish to choose advanced options, choose **Provide Event Hub settings manually**. 

   ![Import Option setting](media/add-event-source/HowToAddEventHubEventImportOption.png)
   
7. If you have selected the **Use Event Hub from available subscriptions** option, the following table explains each required property:

| Property | Description |
| --- | --- |
| Subscription Id | Select the subscription in which this event hub was created.
| Service bus namespace | Select the Service Bus namespace that contains the Event Hub.
| Event hub name | Select the name of the Event Hub.
| Event hub policy name | Select the shared access policy, which can be created on the Event Hub Configure tab. Each shared access policy has a name, permissions that you set, and access keys. The shared access policy for your event source *must* have **read** permissions.
| Event hub policy key | The key is prepopulated.
| Event hub consumer group | The Consumer Group to read events from the Event Hub. It is highly recommended to use a dedicated consumer group for your event source.

8. If you have selected the **Provide Event Hub settings manually** option, the following table explains each required property:

| Property | Description |
| --- | --- |
| Subscription Id | The subscription in which this event hub was created.
| Resource group | The subscription in which this event hub was created.
| Service bus namespace | A Service Bus namespace is a container for a set of messaging entities. When you created a new Event Hub, you also created a Service Bus namespace.
| Event hub name | The name of your Event Hub. When you created your event hub, you also gave it a specific name.
| Event hub policy name | The shared access policy, which can be created on the Event Hub Configure tab. Each shared access policy has a name, permissions that you set, and access keys. The shared access policy for your event source *must* have **read** permissions.
| Event hub policy key | The Shared Access key used to authenticate access to the Service Bus namespace. Type the primary or secondary key here.
| Event hub consumer group | The Consumer Group to read events from the Event Hub. It is highly recommended to use a dedicated consumer group for your event source.

9. Select the **Event serialization format**. JSON is the available serialization at present.

10. It is recommended to provide a **Timestamp property name**. You need to know the message format of the event data to make this decision. This is the name of the event property in the message data that should be used as the event timestamp. When not specified, event enqueue time within the event source will be used as the event timestamp. 

11. Select **Create** to add the new event source.

## Next steps
- Secure the data with a data access policy: [Define data access policies](time-series-insights-data-access.md)
- Access your environment in the [Time Series Insights explorer](https://insights.timeseries.azure.com)
