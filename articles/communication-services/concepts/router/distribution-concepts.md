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

Azure Communication Services Job Router uses a flexible distribution process which involves the use of a policy and a Job Offer lifecycle to assign Workers. This article describes the different ways a Job can be distributed, what the Job Offer lifecycle is, and the effect this process has on Workers.

## Job distribution overview

Deciding how to distribute Jobs to Workers is a key feature of Job Router and the SDK offers a similarly flexible and extensible model. Once a new incoming Job has been classified, Job Router will look for a suitable Worker based on the characteristics of the Job and the Distribution Policy. Alternatively, if Workers are busy, Job Router will look for a suitable Job when a Worker becomes available. Worker suitability is decided across three characteristics; [an available channel](#channel-configurations), their [abilities](#worker-abilities) and [status](#worker-status). Once a suitable Worker has been found, a check is performed to make sure they have an open channel the Job can be assigned to.

These two approaches are key concepts in how Job Router initiates the discovery of Jobs or Workers.

### Finding workers for a job

When a new Job has completed the [classification process](classification-concepts.md), Job Router will use the Distribution Policy configured on the Queue to select an available Worker. 

### Finding a job for a worker

There are several scenarios which will trigger Job Router to find a job for a worker:

- When a Worker registers with Job Router
- When a Job is closed and the channel is released
- When a Job Offer is declined or revoked

The distribution process is the same as finding Workers for a Job.

## Worker overview

Workers **register** with Job Router using the SDK and supply the following basic information:

- A worker ID and name
- Queue IDs
- Total capacity (number)
- A list of **channel configurations**
- A set of labels 

Job Router will always hold a reference to any registered Worker even if they are manually or automatically **deregistered**.

### Channel configurations

Each Job requires a channel ID property representing a pre-configured Job Router channel or a custom channel. A channel configuration consists of a `channelId` string and a `capacityCostPerJob` number. Together they represent an abstract mode of communication and the cost of that mode. For example, most people can only be on one phone call at a time, thus a `Voice` channel may have a high cost of `100`. In this example, the concurrency is relative to the total capacity of the worker. The following example illustrates this point:

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

The above example illustrates three abstract channels each with their own cost per Job. Given this, the following Job concurrency is possible for the `PizzaCook` Worker:

- 2 MakePizza Jobs = 100
- 3 MakeDonair Jobs = 99
- 4 MakeBurger Jobs = 100
- 1 MakePizza and 1 MakeDonair Jobs = 83
- 2 MakeDonair and 1 MakeBurger Jobs = 91

### Worker abilities

Aside from the available channels a Worker may have, the distribution process uses the labels collection of the registered Worker to determine their suitability for a Job. In the pizza cook example above, the Worker has a label collection consisting of:

```csharp
new LabelCollection
    {
        { "Location", "New Jersey" },
        { "PizzaMaker", 7 },
        { "DonairMaker", 10},
        { "BurgerMaker", 5}
    }
```

When a Job is submitted, the **worker selectors** are used to define the requirements for that particular unit of work. If a Job requires an English-speaking person who is particularly good at making donairs, the SDK call would look like this:

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

When the distribution process locates 