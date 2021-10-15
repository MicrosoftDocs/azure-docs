---	
title: Job distribution concepts for Azure Communication Services
titleSuffix: An Azure Communication Services concept document	
description: Learn about the Azure Communication Services Job Router distribution concepts.	
author: jasonshave	
manager: phans
services: azure-communication-services

ms.author: jassha
ms.date: 10/14/2021
ms.topic: conceptual
ms.service: azure-communication-services
---	

# Job distribution concepts

[!INCLUDE [Private Preview Disclaimer](../../includes/private-preview-include-section.md)]

Azure Communication Services Job Router uses a flexible distribution process, which involves the use of a policy and a Job offer lifecycle to assign Workers. This article describes the different ways a Job can be distributed, what the Job offer lifecycle is, and the effect this process has on Workers.

## Job distribution overview

Deciding how to distribute Jobs to Workers is a key feature of Job Router and the SDK offers a similarly flexible and extensible model for you to customize your environment. As described in the [classification concepts](classification-concepts.md) guide, once a Job has been classified, Job Router will look for a suitable Worker based on the characteristics of the Job and the Distribution Policy. Alternatively, if Workers are busy, Job Router will look for a suitable Job when a Worker becomes available. Worker suitability is decided across three characteristics; [an available channel](#channel-configurations), their [abilities,](#worker-abilities) and [status](#worker-status). Once a suitable Worker has been found, a check is performed to make sure they have an open channel the Job can be assigned to.

These two approaches are key concepts in how Job Router initiates the discovery of Jobs or Workers.

### Finding workers for a job

Once a Job has completed the [classification process](classification-concepts.md), Job Router will apply the Distribution Policy configured on the Queue to select one or more workers who meet the worker selectors on the job and generate offers for those workers to take on the job. 

### Finding a job for a worker

There are several scenarios, which will trigger Job Router to find a job for a worker:

- When a Worker registers with Job Router
- When a Job is closed and the channel is released
- When a Job offer is declined or revoked

The distribution process is the same as finding Workers for a Job. When a worker is found, an [offer](#job-offer-overview) is generated.

## Worker overview

Workers **register** with Job Router using the SDK and supply the following basic information:

- A worker ID and name
- Queue IDs
- Total capacity (number)
- A list of **channel configurations**
- A set of labels 

Job Router will always hold a reference to any registered Worker even if they are manually or automatically **deregistered**.

### Channel configurations

Each Job requires a channel ID property representing a pre-configured Job Router channel or a custom channel. A channel configuration consists of a `channelId` string and a `capacityCostPerJob` number. Together they represent an abstract mode of communication and the cost of that mode. For example, most people can only be on one phone call at a time, thus a `Voice` channel may have a high cost of `100`. Alternatively, certain workloads such as chat can have a higher concurrency which means they have a lower cost. You can think of channel configurations as open slots in which a Job can be assigned or attached to. The following example illustrates this point:

```csharp
await client.RegisterWorkerAsync(
    id: "EdmontonWorker",
    queueIds: new[] { "XBOX_Queue", "XBOX_Escalation_Queue" },
    totalCapacity: 100,
    labels: new LabelCollection
    {
        { "Location", "Edmonton" },
        { "XBOX_Hardware", 7 },
    },
    channelConfigurations: new List<ChannelConfiguration>
    {
        new (
            channelId: ManagedChannels.AcsVoiceChannel,
            capacityCostPerJob: 100
        ),
        new (
            channelId: ManagedChannels.AcsChatChannel,
            capacityCostPerJob: 33
        )
    }
);
```

The above worker is registered with two channel configurations each with unique costs per channel. The effective result is that the `EdmontonWorker` can handle three concurrent `ManagedChannels.AcsChatChannel` Jobs or one `ManagedChannels.AcsVoiceChannel` Job.

Job Router includes the following pre-configured channel IDs for you to use:

- ManagedChannels.AcsChatChannel
- ManagedChannels.AcsVoiceChannel
- ManagedChannels.AcsSMSChannel

New abstract channels can be created using the Job Router SDK as follows:

```csharp
await client.SetChannelAsync(
    id: "MakePizza",
    name: "Make a pizza"
);

await client.SetChannelAsync(
    id: "MakeDonairs",
    name: "Make a donair"
);

await client.SetChannelAsync(
    id: "MakeBurgers",
    name: "Make a burger"
);
```

You can then use the channel when registering the Worker to represent their ability to take on a Job matching that channel ID as follows:

```csharp
await client.RegisterWorkerAsync(
    id: "PizzaCook",
    queueIds: new[] { "PizzaOrders", "DonairOrders", "BurgerOrders" },
    totalCapacity: 100,
    labels: new LabelCollection
    {
        { "Location", "New Jersey" },
        { "Language", "English" },
        { "PizzaMaker", 7 },
        { "DonairMaker", 10},
        { "BurgerMaker", 5}
    },
    channelConfigurations: new List<ChannelConfiguration>
    {
        new (
            channelId: MakePizza,
            capacityCostPerJob: 50
        ),
        new (
            channelId: MakeDonair,
            capacityCostPerJob: 33
        ),
        new (
            channelId: MakeBurger,
            capacityCostPerJob: 25        
        )
    }
);
```

The above example illustrates three abstract channels each with their own cost per Job. As such, the following Job concurrency examples are possible for the `PizzaCook` Worker:

| MakePizza | MakeDonair | MakeBurger | Score |
|--|--|--|--|
| 2         |            |            | 100   |
|           | 3          |            | 99    |
| 1         | 1          |            | 83    |
|           | 2          | 1          | 91    |
|           |            | 4          | 100   |
|           | 1          | 2          | 83    |

### Worker abilities

Aside from the available channels a Worker may have, the distribution process uses the labels collection of the registered Worker to determine their suitability for a Job. In the pizza cook example above, the Worker has a label collection consisting of:

```csharp
new LabelCollection
    {
        { "Location", "New Jersey" },
        { "Language", "English" },
        { "PizzaMaker", 7 },
        { "DonairMaker", 10},
        { "BurgerMaker", 5}
    }
```

When a Job is submitted, the **worker selectors** are used to define the requirements for that particular unit of work. If a Job requires an English-speaking person who is good at making donairs, the SDK call would be as follows:

```csharp
await client.CreateJobAsync(
    channelId: "MakeDonair",
    channelReference: "ReceiptNumber_555123",
    queueId: "DonairOrders",
    priority: 1,
    workerSelectors: new List<LabelSelector>
    {
        new (
            key: "DonairMaker",
            @operator: LabelOperator.GreaterThanEqual,
            value: 8),
        new (
            key: "English",
            @operator: LabelOperator.GreaterThan,
            value: 5)
    });
```

### Worker status

Since Job Router can handle concurrent Jobs for a Worker depending on their Channel Configurations, the concept of availability is represented by three states:

**Active -** A Worker is registered with the Job Router and is willing to accept a Job

**Draining -** A Worker has deregistered with the Job Router, however they are currently assigned one or more active Jobs

**Inactive -** A Worker has deregistered with the Job Router and they have no active Jobs

## Job offer overview

When the distribution process locates a suitable Worker who has an open channel and has the correct status, a Job offer is generated and an event is sent. The Distribution Policy contains the following configurable properties for the offer:

**OfferTTL -** The time-to-live for each offer generated

**Mode -** The **distribution modes** which contain both `minConcurrentOffers` and `maxConcurrentOffers` properties.

> [!Important]
> When a Job offer is generated for a Worker it consumes one of the channel configurations matching the channel ID of the Job. The consumption of this channel means the Worker will not receive another offer unless additional capacity for that channel is available on the Worker. If the Worker declines the offer or the offer expires, the channel is released.

### Job offer lifecycle

The following Job offer lifecycle events can be observed through your Event Grid subscription:

- RouterWorkerOfferIssued
- RouterWorkerOfferAccepted
- RouterWorkerOfferDeclined
- RouterWorkerOfferExpired
- RouterWorkerOfferRevoked

> [!NOTE]
> An offer can be accepted or declined by a Worker by using the SDK while all other events are internally generated.

## Distribution modes

Job Router includes the following distribution modes:

**LongestIdleMode -** Generates Offer for the longest idle Worker in a Queue

**RoundRobinMode -** Given a collection of Workers, randomly choose a Worker in a round-robin fashion

**BestWorkerMode -** Use the Job Router's [RuleEngine](router-rule-concepts.md) to choose a Worker based on their labels

## Distribution summary

Depending on several factors such as a Worker's status, channel configuration/capacity, the distribution policy's mode, and offer concurrency can influence the way Job offers are generated. It is suggested to start with a simple implementation and add complexity as your requirements dictate.