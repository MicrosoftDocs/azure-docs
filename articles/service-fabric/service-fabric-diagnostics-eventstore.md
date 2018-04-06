---
title: Query for cluster events using the EventStore APIs | Microsoft Docs
description: Learn how to use the Azure Service Fabric EventStore APIs to query for platform events
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/06/2018
ms.author: dekapur

---
# Query EventStore APIs for cluster events

The Event Store in an out-of-the-box monitoring option in Service Fabric, which provides a way for you to understand the state of your cluster or workloads at a given point in time. Service Fabric exposes several structured platform events via the Operational Channel today, but also exposes the same events through the Event Store APIs. These APIs allow you to query the cluster directly to get diagnostics data on various entities in your cluster and should be used to help:
* Diagnose issues in development or testing, where you might not have a fully baked monitoring pipeline available
* Confirm that management actions you are taking on your cluster are being processed correctly by your cluster

The EventStore also looks at various operations in the cluster and attempts to correlate certain activities together. For example, if there is an unexpected change in your replica configuration, i.e. a secondary replica becomes promoted to being primary because the node with your primary on it is having issues, when exposing the event for the replica, the EventStore will also look at other events exposed by the platform to attempt to connect this with a `NodeDown` event. this helps with faster failure detection and root causes analysis

The EventStore exposes events on various levels, so you can query for events for the following entities in your cluster:
* Cluster
* Application
* Service
* Partition
* Replica 
* Container

To see a full list of events available in the EventStore, have a look at Service Fabric's [Operational Channel events](service-fabric-diagnotics-event-generation-operational.md). 

The EventStore APIs can be accessed directly via a REST endpoint, or programmatically. Depending on the query, there are several parameters that are required to gather the right data. These typically include:
* `api-version`: the version of the EventStore APIs you are using
* `StartTimeUtc`: defines the start of the period you are interesting in looking at
* `EndTimeUtc`: end of the time period

In addition to these, there are optional parameters available as well, such as:
* `timeout`: override the default 60 seconds timeout for performing the request operation
* `ExcludeAnalysisEvents`: do not return 'Analysis' events - these are "intelligent" operational channel events with additional context or info beyond a regular cluster event 
* `SkipCorrelationLookup`: do not look for potential correlated events in the cluster

>[!NOTE]
>As of Service Fabric version 6.2. the EventStore APIs are currently in preview for Windows clusters running on Azure only. We are working on porting this functionality to Linux as well as our Standalone clusters.

## Query the EventStore via REST API endpoints

You can query the EventStore directly via an REST endpoint, by making `GET` requests to:
`<your cluster address>/EventsStore/<entity>/Events/`.

For example, in order to query for all Cluster events between `2018-04-03T18:00:00Z` and `2018-04-04T18:00:00Z`, your request would look like:

```
Method: GET 
URL: http://localhost:19080/EventsStore/Cluster/Events?api-version=6.2-preview&StartTimeUtc=2018-04-03T18:00:00Z&EndTimeUtc=2018-04-04T18:00:00Z
```

This could either return an error if no events are available, or if the query was successful:

```json
Response: 200
Body:
[
  {
    "Kind": "ClusterUpgradeStart",
    "CurrentClusterVersion": "0.0.0.0:",
    "TargetClusterVersion": "6.2:1.0",
    "UpgradeType": "Rolling",
    "RollingUpgradeMode": "UnmonitoredAuto",
    "FailureAction": "Manual",
    "EventInstanceId": "090add3c-8f56-4d35-8d57-a855745b6064",
    "TimeStamp": "2018-04-03T20:18:59.4313064Z",
    "HasCorrelatedEvents": false
  },
  {
    "Kind": "ClusterUpgradeDomainComplete",
    "TargetClusterVersion": "6.2:1.0",
    "UpgradeState": "RollingForward",
    "UpgradeDomains": "(0 1 2)",
    "UpgradeDomainElapsedTimeInMs": "78.5288",
    "EventInstanceId": "090add3c-8f56-4d35-8d57-a855745b6064",
    "TimeStamp": "2018-04-03T20:19:59.5729953Z",
    "HasCorrelatedEvents": false
  },
  {
    "Kind": "ClusterUpgradeDomainComplete",
    "TargetClusterVersion": "6.2:1.0",
    "UpgradeState": "RollingForward",
    "UpgradeDomains": "(3 4)",
    "UpgradeDomainElapsedTimeInMs": "0",
    "EventInstanceId": "090add3c-8f56-4d35-8d57-a855745b6064",
    "TimeStamp": "2018-04-03T20:20:59.6271949Z",
    "HasCorrelatedEvents": false
  },
  {
    "Kind": "ClusterUpgradeComplete",
    "TargetClusterVersion": "6.2:1.0",
    "OverallUpgradeElapsedTimeInMs": "120196.5212",
    "EventInstanceId": "090add3c-8f56-4d35-8d57-a855745b6064",
    "TimeStamp": "2018-04-03T20:20:59.8134457Z",
    "HasCorrelatedEvents": false
  }
]
```

Here we can see that between `2018-04-03T18:00:00Z` and `2018-04-04T18:00:00Z`, this cluster successfully completed its first upgrade when it was first stood up, from `"CurrentClusterVersion": "0.0.0.0:"` to `"TargetClusterVersion": "6.2:1.0"`, in `"OverallUpgradeElapsedTimeInMs": "120196.5212"`.

## Query the EventStore programmatically

You can also query the EventStore programmatically, via the [Service Fabric client library](https://docs.microsoft.com/dotnet/api/overview/azure/service-fabric?view=azure-dotnet#client-library).

Once you have your Service Fabric Client set up, you can query for events by accessing the EventStore like this:
` sfhttpClient.EventStore.<request>`

Here is an example request for all cluster events between `2018-04-03T18:00:00Z` and `2018-04-04T18:00:00Z`, via the `GetClusterEventListAsync` function.

```csharp
var sfhttpClient = ServiceFabricClientFactory.Create(clusterUrl, settings);

var clstrEvents = sfhttpClient.EventsStore.GetClusterEventListAsync(
    "2018-04-03T18:00:00Z",
    "2018-04-04T18:00:00Z")
    .GetAwaiter()
    .GetResult()
    .ToList();
```

## Sample scenarios and queries

## Next steps