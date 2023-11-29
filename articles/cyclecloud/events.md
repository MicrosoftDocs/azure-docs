---
title: Node Events
description: Use the CycleCloud Events integration to get notified on state changes 
author: dougclayton
ms.date: 08/16/2020
ms.author: doclayto
monikerRange: '>= cyclecloud-8'
---

# Events

CycleCloud 8.0 generates *events* when certain changes happen (e.g., when a node is created, or a cluster is deleted). Some events are instantaneous (e.g., deleting a cluster), and some  events represent transitions (e.g., creating a node which implies creating a VM). In these cases, the event is sent at the end of the transition, whether successful or not. 

CycleCloud can be configured to publish to an Event Grid *topic* by connecting it in the **CycleCloud Settings** page in CycleCloud. Event Grid *event subscriptions* can be attached to the topic to route the events to a destination, such as a Storage Queue, where a program can consume events and process them.

## Event objects

The events are in the standard Event Grid schema. All CycleCloud-specific elements are in the `data` property on the event.

| Name | Type | Description |
| - | - | - |
| eventId | String | Uniquely identifies the event |
| eventTime | String | The time of this event (yyyy-MM-ddTHH:mm:ss.SSSZZ) |
| eventType | String | The kind of state transition that happened (e.g., `Microsoft.CycleCloud.NodeCreated`)|
| subject | String | The affected resource (see [Event Subject](#subject)) |
| dataVersion | String | The schema in use for `data` (currently "1") |

In addition, there are several custom properties in `data` for almost all events:

| Property | Type | Description |
| - | - | - | 
| status | [Status](#status) (String) | Whether this transition was successful or not |
| reason | [Reason](#reason) (String) | Why this event was initiated |
| message | String | A human-readable summary of this event |
| errorCode | String | The code for this operation if it failed or was unavailable. Note this may come directly from Azure calls and may not be present for all failures |

### Cluster events

CycleCloud sends events when clusters are modified. Cluster events contain the following common properties in `data`:

| Property | Type | Description |
| - | - | - |
| clusterName | String | The name of the cluster |

#### Microsoft.CycleCloud.ClusterStarted

This event is fired when a cluster is started.

#### Microsoft.CycleCloud.ClusterTerminated

This event is fired when a cluster is terminated.

#### Microsoft.CycleCloud.ClusterDeleted

This event is fired when a cluster is deleted.

#### Microsoft.CycleCloud.ClusterSizeIncreased

This event is fired when nodes are added to the cluster. There is one event for each set of nodes added. (Nodes in a set all have the same definition.)

| Property | Type | Description |
| - | - | - |
| nodesRequested | Integer | How many nodes were requested for this set |
| nodesAdded | Integer | How many nodes were actually added to the cluster |
| nodeArray | String | The nodearray these nodes were created from |
| subscriptionId | String | The subscription ID for this node's resources |
| region | String | The location of this node |
| vmSku | String | The SKU (i.e., machine type) for the VM |
| priority | String | The VM pricing model in effect (either "regular" or "spot") |
| placementGroupId | String | The placement group these nodes are in, if any |

### Node events

CycleCloud sends events when nodes change state. Node events contain additional information in the `data` property:

| Property | Type | Description |
| - | - | - |
| status | [Status](#status) (String) | Whether this event was successful or not |
| clusterName | String | The name of the cluster this node is in. Names are not unique over time |
| nodeName | String | The name of the node that is affected. Names are not unique over time |
| nodeId | String | The id of this node. Node ids *are* unique over time, and once a node is deleted the id will not be reused |
| nodeArray | String | The name of the nodearray this node was created from |
| resourceId | String | The Azure resource for the VM, if there was one created |
| subscriptionId | String | The subscription ID for this node's resources |
| region | String | The location of this node |
| vmSku | String | The SKU (i.e., Machine Type) for the VM |
| priority | String | The VM pricing model in effect (either "regular" or "spot") |
| placementGroupId | String | The placement group this node is in, if any |
| retryCount | Integer | How many times this specific action was attempted previously (see [Retry Count](#retry-count)) |
| timing | (Object) | A map of stages in this event and their durations (see [Timing](#timing)) |

#### Microsoft.CycleCloud.NodeAdded

This event is fired for each node that is added to a cluster. (To get an event for a set of nodes added at once, see [ClusterSizeIncreased](#microsoftcyclecloudclustersizeincreased).) This is sent when the node first appears in the UI, so it does not have any timing information.

#### Microsoft.CycleCloud.NodeCreated

This event is fired each time a node is started for the first time (i.e., a VM is created for it). This event contains the following timing information:

  - `Create`: The total time to create the node. This includes creating the VM and configuring the VM.
  - `CreateVM`: How long it took to create the VM.
  - `Configure`: How long it took to install software and configure the node.

#### Microsoft.CycleCloud.NodeDeallocated

This event is fired each time a node is deallocated. This event contains the following timing information:

  - `Deallocate`: The total time to deallocate the node.
  - `DeallocateVM`: How long it took to deallocate the VM.

#### Microsoft.CycleCloud.NodeStarted

This event is fired each time a node is re-started from a deallocated state. This event contains the following timing information:

  - `Start`: The total time it took to restart the deallocated node.
  - `StartVM`: How long it took to start the deallocated VM.

#### Microsoft.CycleCloud.NodeTerminated

This event is fired each time a node is terminated and its VM is deleted. This event contains the following timing information:

  - `Terminate`: The total time it took to terminate the node.
  - `DeleteVM`: How long it took to delete the VM.

### Subject

Each event has a "subject" which can be used for filtering in Event Grid. Events in CycleCloud have subjects in the following pattern:

  - `/sites/SITENAME`: for events specific to a given CycleCloud installation
  - `/sites/SITENAME/clusters/CLUSTERNAME`: for cluster-level events 
  - `/sites/SITENAME/clusters/CLUSTERNAME/nodes/NODENAME`: for node-level events

This allows "scoping" an Event Grid subscription to a specific prefix to collect a subset of events. This can be used in conjunction with Event Type filtering.

### Status

  - `Succeeded`: the operation was successful.
  - `Failed`: the operation was not successful. There is often a `reason` and/or `errorCode` set.
  - `Canceled`: the operation was canceled.

### Reason

Some events have a reason that they were initiated. Unless otherwise indicated, these are set on the `ClusterSizeIncreased`, `NodeAdded`, `NodeCreated`, `NodeDeallocated`, `NodeStarted`, and `NodeTerminated` events.

  - `Autoscaled`: the node was modified in response to an autoscaling request made through the API
  - `UserInitiated`: the operation was done directly through the UI or CLI
  - `System`: the operation was initiated by CycleCloud (e.g., by default, execute nodes are automatically removed from the cluster when terminated)
  - `SpotEvicted`: the event was triggered because a spot VM was evicted (NodeTerminated events only)
  - `VMDisappeared`: the event was triggered because a non-spot VM disappeared (NodeTerminated events only)
  - `AllocationFailed`: the VM could not be allocated due to placement or capacity constraints (NodeTerminated/NodeDeallocated events only, with the status indicating the result of the terminate/deallocate operation)

> [!NOTE]
> The `reason` is set on NodeTerminated events to indicate why the node was terminated.
> When a node fails to be created due to capacity, it fails with the specific error code from Azure (of which there are several).
> The node is then automatically terminated, and the reason for the termination is `AllocationFailed`.
> When a running spot VM is evicted, the create operation had already succeeded.
> The node is then automatically terminated and the reason given for the termination event is `SpotEvicted`.

### Timing

Some events contain timing information. The `timing` entry in `data` is an object with keys corresponding to stages of the event, and values as total seconds. Each event may have multiple timing stages associated with it. For instance, suppose a node is added to a cluster, started, and terminated:

[!Event Grid Timing Diagram](./images/event-grid-timing.png)

- T1: User adds a node. A `NodeAdded` event is sent, with no timing.
- T2: The create-VM operation fails, so `NodeCreated` is sent with a status of Failed and the following timing information:
  - `Create`: T2-T1
  - `CreateVM`: T2-T1
- T3: User clicks Retry
- T4: The Create-VM operation succeeds, so the node starts installing software.
- T5. The software installs successfully, so `NodeCreated` is sent with a status of Succeeded and the following timing information:
  - `Create`: (T5-T3)
  - `CreateVM`: (T4-T3)
  - `Configure`: (T5-T4)
- T6: User clicks Terminate.
- T7: The delete-VM operation succeeds, so `NodeTerminated` is sent with a state of Succeeded and the following timing information:
  - `Started`: T6-T5
  - `Terminate`: T7-T6
  - `DeleteVM`: T7-T6

#### Previous State Timing

The first time a node transitions to a state (whether successfully or not), it has no previous state. When the target state is then changed after that point, the time spent in the previous state is included in the event for the new target state. Note that this is only included if it reached the previous state successfully. Thus these timing entries measure the length of time for the following:

  - `Started`: prior to this event, the node had been running (i.e., green)
  - `Deallocated`: prior to this event, the node had been deallocated
  - `Terminated`: prior to this event, the node had been off

This can be used, for instance, to track how long a spot VM was running before it was evicted.

### Retry Count

Some operations can be retried in CycleCloud if they fail. These operations are reflected in the `NodeCreated`, `NodeDeallocated`, `NodeStarted`, and `NodeTerminated` events. These events contain an optional `retryCount` property on the event's `data` property indicating how many times prior to this the operation was attempted. This property is included on subsequent retries, whether those attempts succeeded or failed.

