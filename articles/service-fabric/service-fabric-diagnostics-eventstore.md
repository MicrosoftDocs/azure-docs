---
title: Azure Service Fabric Event Store  
description: Learn about Azure Service Fabric's EventStore, a way to understand and monitor the state of a cluster or workloads at any time.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# EventStore Overview

>[!NOTE]
>As of Service Fabric version 6.4. the EventStore APIs are only available for Windows clusters running on Azure only. We are working on porting this functionality to Linux as well as our Standalone clusters.

## Overview

Introduced in version 6.2, the EventStore service is a monitoring option in Service Fabric. EventStore provides a way to understand the state of your cluster or workloads at a given point in time.
The EventStore is a stateful Service Fabric service that maintains events from the cluster. The event are exposed through the Service Fabric Explorer, REST and APIs. EventStore queries the cluster directly to get diagnostics data on any entity in your cluster and should be used to help:

* Diagnose issues in development or testing, or where you might be using a monitoring pipeline
* Confirm that management actions you are taking on your cluster are being processed correctly
* Get a "snapshot" of how Service Fabric is interacting with a particular entity

![Screenshot shows the EVENTS tab of the Nodes pane several events, including a NodeDown event.](media/service-fabric-diagnostics-eventstore/eventstore.png)

To see a full list of events available in the EventStore, see [Service Fabric events](service-fabric-diagnostics-event-generation-operational.md).

>[!NOTE]
>As of Service Fabric version 6.4. the EventStore APIs and UX are generally available for Azure Windows clusters. We are working on porting this functionality to Linux as well as our Standalone clusters.

The EventStore service can be queried for events that are available for each entity and entity type in your cluster. This means you can query for events on the following levels:
* Cluster: events specific to the cluster itself (e.g. cluster upgrade)
* Nodes: all node level events
* Node: events specific to one node, identified by `nodeName`
* Applications: all application level events
* Application: events specific to one application identified by `applicationId`
* Services: events from all services in your clusters
* Service: events from a specific service identified by `serviceId`
* Partitions: events from all partitions
* Partition: events from a specific partition identified by `partitionId`
* Partition Replicas: events from all replicas / instances within a specific partition identified by `partitionId`
* Partition Replica: events from a specific replica / instance identified by `replicaId` and `partitionId`

To learn more about the API check out the [EventStore API reference](/rest/api/servicefabric/sfclient-index-eventsstore).

The EventStore service also has the ability to correlate events in your cluster. By looking at events that were written at the same time from different entities that may have impacted each other, the EventStore service is able to link these events to help with identifying causes for activities in your cluster. For example, if one of your applications happens to become unhealthy without any induced changes, the EventStore will also look at other events exposed by the platform and could correlate this with an `Error` or `Warning` event. This helps with faster failure detection and root causes analysis.

## Enable EventStore on your cluster

### Local Cluster

In [fabricSettings.json in your cluster](service-fabric-cluster-fabric-settings.md), add EventStoreService as an addOn feature and perform a cluster upgrade.

```json
    "addOnFeatures": [
        "EventStoreService"
    ],
```

### Azure cluster version 6.5+
If your Azure cluster gets upgraded to version 6.5 or higher, EventStore will be automatically enabled on your cluster. To opt out, you need to update your cluster template with the following:

* Use an API version of `2019-03-01` or newer 
* Add the following code to your properties section in your cluster
  ```json  
    "fabricSettings": [
      …
    ],
    "eventStoreServiceEnabled": false
  ```

### Azure cluster version 6.4

If you are using version 6.4, you can edit your Azure Resource Manager template to turn on EventStore service. This is done by performing a [cluster config upgrade](service-fabric-cluster-config-upgrade-azure.md) and adding the following code, you can use PlacementConstraints to put the replicas of the EventStore service on a specific NodeType e.g. a NodeType dedicated for the system services. The `upgradeDescription` section configures the config upgrade to trigger a restart on the nodes. You can remove the section in another update.

```json
    "fabricSettings": [
          …
          …
          …,
         {
            "name": "EventStoreService",
            "parameters": [
              {
                "name": "TargetReplicaSetSize",
                "value": "3"
              },
              {
                "name": "MinReplicaSetSize",
                "value": "1"
              },
              {
                "name": "PlacementConstraints",
                "value": "(NodeType==<node_type_name_here>)"
              }
            ]
          }
        ],
        "upgradeDescription": {
          "forceRestart": true,
          "upgradeReplicaSetCheckTimeout": "10675199.02:48:05.4775807",
          "healthCheckWaitDuration": "00:01:00",
          "healthCheckStableDuration": "00:01:00",
          "healthCheckRetryTimeout": "00:5:00",
          "upgradeTimeout": "1:00:00",
          "upgradeDomainTimeout": "00:10:00",
          "healthPolicy": {
            "maxPercentUnhealthyNodes": 100,
            "maxPercentUnhealthyApplications": 100
          },
          "deltaHealthPolicy": {
            "maxPercentDeltaUnhealthyNodes": 0,
            "maxPercentUpgradeDomainDeltaUnhealthyNodes": 0,
            "maxPercentDeltaUnhealthyApplications": 0
          }
        }
```


## Next steps
* Get started with the EventStore API - [Using the EventStore APIs in Azure Service Fabric clusters](service-fabric-diagnostics-eventstore-query.md)
* Learn more about the list of events offered by EventStore - [Service Fabric events](service-fabric-diagnostics-event-generation-operational.md)
* Overview of monitoring and diagnostics in Service Fabric - [Monitoring and Diagnostics for Service Fabric](service-fabric-diagnostics-overview.md)
* View the full list of API calls - [EventStore REST API Reference](/rest/api/servicefabric/sfclient-index-eventsstore)
* Learn more about monitoring your cluster - [Monitoring the cluster and platform](service-fabric-diagnostics-event-generation-infra.md).
