---
title: Query for cluster events using the EventStore APIs in Azure Service Fabric clusters | Microsoft Docs
description: Learn how to use the Azure Service Fabric EventStore APIs to query for platform events
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 04/25/2018
ms.author: dekapur

---

# Query EventStore APIs for cluster events

This article covers how to query the EventStore APIs that are available in Service Fabric version 6.2 and later - if you would like to learn more about the EventStore service, see the [EventStore service overview](service-fabric-diagnostics-eventstore.md). Currently, the EventStore service can only access data for the last 7 days (this is based on your cluster's diagnostics data retention policy).

>[!NOTE]
>As of Service Fabric version 6.2. the EventStore APIs are currently in preview for Windows clusters running on Azure only. We are working on porting this functionality to Linux as well as our Standalone clusters.

The EventStore APIs can be accessed directly via a REST endpoint, or programmatically. Depending on the query, there are several parameters that are required to gather the right data. These typically include:
* `api-version`: the version of the EventStore APIs you are using
* `StartTimeUtc`: defines the start of the period you are interesting in looking at
* `EndTimeUtc`: end of the time period

In addition to these, there are optional parameters available as well, such as:
* `timeout`: override the default 60 seconds timeout for performing the request operation
* `eventstypesfilter`: this gives you the option to filter for specific event types
* `ExcludeAnalysisEvents`: do not return 'Analysis' events. By default, EventStore queries will return with "analysis" events where possible - analysis events are richer operational channel events that contain additional context or information beyond a regular Service Fabric event and provide more depth.
* `SkipCorrelationLookup`: do not look for potential correlated events in the cluster. By default, the EventStore will attempt to correlate events across a cluster, and link your events together when possible. 

Each entity in a cluster can be queries for events. You can also query for events for all entities of the type. For example, you can query for events for a specific node, or for all nodes in your cluster. The current set of entities for which you can query for events is (with how the query would be structured):
* Cluster: `/EventsStore/Cluster/Events`
* Nodes: `/EventsStore/Nodes/Events`
* Node: `/EventsStore/Nodes/<NodeName>/$/Events`
* Applications: `/EventsStore/Applications/Events`
* Application: `/EventsStore/Applications/<AppName>/$/Events`
* Services: `/EventsStore/Services/Events`
* Service: `/EventsStore/Services/<ServiceName>/$/Events`
* Partitions: `/EventsStore/Partitions/Events`
* Partition: `/EventsStore/Partitions/<PartitionID>/$/Events`
* Replicas: `/EventsStore/Partitions/<PartitionID>/$/Replicas/Events`
* Replica: `/EventsStore/Partitions/<PartitionID>/$/Replicas/<ReplicaID>/$/Events`

>[!NOTE]
>When referencing an application or service name, the query doesn't need to include the "fabric:/" prefix. Additionally, if your application or service names have a "/" in them, switch it to a "~" to keep the query working. For example, if your application shows up as "fabric:/App1/FrontendApp", your app specific queries would be structured as `/EventsStore/Applications/App1~FrontendApp/$/Events`.
>Additionally, health reports for services today show up under the corresponding application, so you would query for `DeployedServiceHealthReportCreated` events for the right application entity. 

## Query the EventStore via REST API endpoints

You can query the EventStore directly via an REST endpoint, by making `GET` requests to:
`<your cluster address>/EventsStore/<entity>/Events/`.

For example, in order to query for all Cluster events between `2018-04-03T18:00:00Z` and `2018-04-04T18:00:00Z`, your request would look like:

```
Method: GET 
URL: http://mycluster:19080/EventsStore/Cluster/Events?api-version=6.2-preview&StartTimeUtc=2018-04-03T18:00:00Z&EndTimeUtc=2018-04-04T18:00:00Z
```

This could either return an error if no events are available, or if the query was successful, you'll see events returned in json:

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

Here are few examples on how you can call the Event Store REST APIs to understand the status of your cluster.

*Cluster upgrades:*

To see the last time your cluster was successfully or attempted to be upgraded last week, you can query the APIs for recently completed upgrades to your cluster, by querying for the "ClusterUpgradeComplete" events in the EventStore:
`https://mycluster.cloudapp.azure.com:19080/EventsStore/Cluster/Events?api-version=6.2-preview&starttimeutc=2017-04-22T17:01:51Z&endtimeutc=2018-04-29T17:02:51Z&EventsTypesFilter=ClusterUpgradeComplete`

*Cluster upgrade issues:*

Similarly, if there were issues with a recent cluster upgrade, you could query for all events for the cluster entity. You'll see various events, including the initiation of upgrades and each UD for which the upgrade rolled through successfully. You will also see events for the point at which the rollback started and corresponding health events. Here's the query you would use for this: 
`https://mycluster.cloudapp.azure.com:19080/EventsStore/Cluster/Events?api-version=6.2-preview&starttimeutc=2017-04-22T17:01:51Z&endtimeutc=2018-04-29T17:02:51Z`

*Node status changes:*

To see your node status changes over the last few days - when nodes went up or down, or were activated or deactivated (either by the platform, the chaos service, or from user input) - use the following query:
`https://mycluster.cloudapp.azure.com:19080/EventsStore/Nodes/Events?api-version=6.2-preview&starttimeutc=2017-04-22T17:01:51Z&endtimeutc=2018-04-29T17:02:51Z`

*Application events:*

You can also track your recent application deployments and upgrades. Use the following query to see all application related events in your cluster:
`https://mycluster.cloudapp.azure.com:19080/EventsStore/Applications/Events?api-version=6.2-preview&starttimeutc=2017-04-22T17:01:51Z&endtimeutc=2018-04-29T17:02:51Z`

*Historical health for an application:*

In addition to just seeing application lifecycle events, you may also want to see historical data on the health of a specific application. You can do this by specifying the application name for which you want to gather the data. Use this query to get all the application health events:
`https://mycluster.cloudapp.azure.com:19080/EventsStore/Applications/myApp/$/Events?api-version=6.2-preview&starttimeutc=2018-03-24T17:01:51Z&endtimeutc=2018-03-29T17:02:51Z&EventsTypesFilter=ProcessApplicationReport`. 
If you want to include health events that may have expired (gone passed their time to live (TTL)), add `,ExpiredDeployedApplicationEvent` to the end of the query, to filter on two types of events.

*Historical health for all services in "myApp":*

Currently, health report events for services show up as `DeployedServiceHealthReportCreated` events under the corresponding application entity. To see how your services have been doing for "App1", use the following query:
`https://winlrc-staging-10.southcentralus.cloudapp.azure.com:19080/EventsStore/Applications/myapp/$/Events?api-version=6.2-preview&starttimeutc=2017-04-22T17:01:51Z&endtimeutc=2018-04-29T17:02:51Z&EventsTypesFilter=DeployedServiceHealthReportCreated`

*Partition reconfiguration:*

To see all the partition movements that happened in your cluster, query for the `ReconfigurationCompleted` event. This can help you figure out what workloads ran on which node at specific times, when diagnosing issues in your cluster. Here's a sample query that does that:
`https://mycluster.cloudapp.azure.com:19080/EventsStore/Partitions/Events?api-version=6.2-preview&starttimeutc=2018-04-22T17:01:51Z&endtimeutc=2018-04-29T17:02:51Z&EventsTypesFilter=PartitionReconfigurationCompleted`

*Chaos service:*

There is an event for when the Chaos service is started or stopped that is exposed at the cluster level. To see your recent use of the Chaos service, use the following query:
`https://mycluster.cloudapp.azure.com:19080/EventsStore/Cluster/Events?api-version=6.2-preview&starttimeutc=2017-04-22T17:01:51Z&endtimeutc=2018-04-29T17:02:51Z&EventsTypesFilter=ChaosStarted,ChaosStopped`

