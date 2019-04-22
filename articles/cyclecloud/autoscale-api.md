---
title: Azure CycleCloud AutoScale API | Microsoft Docs
description: Autoscaling non-standard cluster types with Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Auto-Scale Plugins and API

Azure CycleCloud provides APIs to allow users to enable auto-scaling for cluster types
that are not already built-in.

There are two basic forms of auto-scale plugin: *cluster-side* and *server-side*.

Cluster-side auto-scale plugins are executables run on nodes within the cluster
itself that use the CycleCloud REST API to request scale up and scale down.
Cluster-side plugins generally only require knowledge of the system being scaled,
and require much less knowledge of the CycleCloud APIs.

Server-side plugins run inside CycleCloud itself and use the CycleCloud Java or
Python plugin development APIs to monitor cluster state and request scale-up and
scale-down directly.

> [!NOTE]
> The GridEngine and HTCondor scheduler integrations provide a simplified API for customizing the
> auto-scaling decisions using data collected by the built-in monitoring. Users should not need to use the
> full Auto-Scale Plugin API for any cluster type that provides built-in auto-scaling.

## Cluster-Side API

Building Cluster-side auto-scale plugins is intended to be very simple for
developers who understand the systems in their clusters.

Cluster-side plugins are executables running on one or more nodes in the cluster
(often as system services or cron jobs or scheduled tasks in Windows). They may
be installed and configured using Chef or Cluster-Init, or they may be baked into
the image. They may also include [HealthCheck](healthcheck.md) scripts to ensure that scale-down occurs in the case of failures.

The executables are responsible for monitoring the cluster and reporting demand
for scale-up and scale-down to CycleCloud.

## Scale-Up

CycleCloud offers a simple python API for clusters to request changes to existing node arrays
as well as dynamically creating new node arrays on the fly. Typically autoscaling occurs
by setting either the TargetCount or TargetCoreCount of a node array to increase the number
of resources CycleCloud will allocate.

Cluster-side plugins are responsible for determining the types of resources that are needed
by the cluster at any given time. For example, a standard Grid Engine cluster may require
128 cores towards the standard 'execute' nodearray. In this case, the TargetCoreCount should
be set to 128.

There are two easy ways to make this API call: using the Python API or the jetpack CLI.

### Jetpack CLI

```azurecli-interactive
$ jetpack autoscale --name=execute --corecount=128
```

### Jetpack API

``` API
import jetpack.autoscale

jetpack.autoscale.set(name='execute', corecount=128)
```

The above methods are intended to simplify setting the size on a single pre-existing node array.
This is equivalent to the more general way to autoscale a set of node arrays:

``` API
array = {
    'Name': 'execute',
    'TargetCoreCount': 128
}
jetpack.autoscale.update([array])
```

Note that in this example you are passing in a list of node array definitions. You
can also change any other attribute that is settable on a node array, for example
the machine type, or node configuration:

``` API
import jetpack.autoscale

array = {
    'Name': 'execute',
    'TargetCoreCount': 128,
    'MachineType': "Standard_D4v3",
    'Configuration': {
        'custom_setting': 123
    }
}
jetpack.autoscale.update([array])
```

The definition given is merged with the existing definition, so you only need to
specify attributes whose values you intend to set.

The `update` function takes a list of node arrays so that you can specify all the node arrays currently needed. Certain types of jobs require different configurations. In this case, you
can add a "dynamic" node array to the list for those jobs only if you find jobs of that type in the queue. Instead of updating the execute array, you can create a new node array on the fly that
extends `execute` with some custom settings.

``` API
import jetpack.autoscale

execute = {
    'Name': 'execute',
    'TargetCoreCount': 128
}
dynamic = {
    'Name': 'dynamic_array',
    'Extends': 'execute',
    'TargetCount': 3,
    'Configuration': {
        'application_version': '1.2.3'
    },
    'Dynamic': True
}
jetpack.autoscale.update([execute, dynamic])
```

In the above case we have updated the `execute` array to be set to 128 cores, while also creating
a new array called `dynamic_array` that is based on `execute`, but with a TargetCount of 3
and specifying a (fictional) 1.2.3 version of software to be installed. When using dynamic arrays, you MUST specify a unique name along with setting `Dynamic=True` on the array. You probably also want to extend an existing node array in the cluster to provide base settings, but this is not required if you can supply all the attributes in the autoscale call (ClusterName is set automatically).

If a dynamic array does not exist, it will be created. If it does, it will be updated just like non-dynamic arrays. If it is not included in a subsequent call to `update`, it will be flagged for removal, and once all nodes in the array have auto-stopped, the array itself will be deleted. Dynamic arrays are also deleted automatically on cluster termination.

> [!NOTE]
> The autoscale request must include all node arrays currently needed. Typically this is easier to script > than to only ask for "new" arrays, since that requires keeping local state.

The overall behavior of the `update` API is intended to make it easy to write code that periodically monitors a cluster and determines what resources are needed, including the ability to create new node definitions. CycleCloud tracks any new node arrays created on behalf of this call and removes them when no longer needed.

By default, CycleCloud only attempts to provide the requested TargetCoreCount or TargetCount for 5 minutes after the last autoscale request. This is intended to be used with code that runs regularly (eg via `cron`). You can request a longer interval with the `expiration_interval` argument to the `update` function.

If you want to scale more than one completely independent set of resources, you can write separate scripts that run independently and update separate node arrays. Each script must include a unique value for the optional `request_set` parameter (which defaults to "standard"). Each script can run on its own interval and can set its own `expiration_interval` to match. Dynamic arrays requested in one set will only be deleted when they are no longer included in requests made for that set.

## Auto-Scaling Grouped Nodes

When autoscaling up, CycleCloud can request tightly-coupled nodes. Grouped nodes are meant for MPI-type jobs where the interconnect between the nodes is just as important as the compute power of each individual node. Requesting a grouped set of nodes is very similar to requesting regular nodes when autoscaling.

``` API
import jetpack.autoscale

array = {
    'Name': 'execute',
    'TargetGroupCount': 4,
    'GroupCoreCount': 64,
    'MachineType': "Standard_D4v3"
}
jetpack.autoscale.update([array])
```

The above request shows that we want to allocate 4 groups of tightly-coupled nodes, each group having 64 cores. The machine type in this case is a `Standard_D4v3` which has 4 cores, so each group would be 16 nodes meaning that the total request is for 64 Standard_D4v3 instances. If you want to organize groups by instances instead of cores, you can use the `GroupInstanceCount` attribute. For example, the above request could be changed to use a `GroupInstanceCount` of 16 instead of a `GroupCoreCount` of 64. The end result is that 4 groups of 16 instances will be allocated. If multiple machine types are specified, a group will be created consisting of a single machine type, starting from the beginning of the list. For example, if Standard_D4v3 and Standard_D12v3 are both specified, groups will be made using Standard_D12v3 until there is no more capacity at which time Standard_D4v3 machines will be used to create groups.

When a grouped request is handled by CycleCloud a new dynamic node array is created which extends the
original nodearray the request was spawned from. In the above case a new node array named `execute:64` would be dynamically created (the name of the original array with the group size appended on after a colon). Within this new array, groups will be allocated. In the above example you would end up with 4 groups of 16 instances all in this new array, each group having a unique GroupId set on the node. If an auto scale request was made for 128 cores, a second dynamic array would be created named `execute:128` to handle all 128-core jobs.

Each group of nodes will get a unique ID associated with the group that is passed into each node's configuration as `cyclecloud.node.group_id`, allowing node specific applications (like Grid Engine) to handle grouped nodes effectively.

## Scale-Down

Scale-down may require no direct interaction with CycleCloud at all - simply
shutting down the node using the OS-level shutdown command may be sufficient, as
long as the Scale-Up plugin is reporting the correct level of demand. However,
simply shutting down the node can lead to too many nodes auto-stopping simultaneously.

To ensure that only the correct number of nodes auto-stop based on the
current demand (as reported to CycleCloud for scale-up), CycleCloud provides an
REST API which nodes may use to *request* auto-stop.

If the node should be allowed to stop, CycleCloud will terminate the node upon
receiving the request.

## Usage

```azurecli-interactive
GET <AUTOSTOP_URL>?instance=<INSTANCE_ID>
```

There are two basic ways to capture the Auto-stop REST URL from a node in CycleCloud.

From the shell or a cluster-init script, using Jetpack:

``` ini
AUTOSTOP_URL = $( jetpack config cyclecloud.cluster.autoscale.stop_callback )
INSTANCE_ID  = $( jetpack config cyclecloud.instance.id )
```

From Chef, in a custom recipe:

``` Chef
AUTOSTOP_URL = node[:cyclecloud][:cluster][:autoscale][:stop_callback]
INSTANCE_ID  = node[:cyclecloud][:instance][:id]
```

## Server-Side API

Server-side auto-scale plugins allow developers to take full advantage of the Java
and/or Python CycleCloud plugin APIs. Generally, a server-side auto-scale component
consists of a Monitoring plugin and an Auto-Scale plugin as well as cluster-side
monitoring tools. The Monitoring plugin is usually responsible for collecting and
storing the current (and historical) state of the cluster. The Auto-Scale plugin
uses the data stored by the Monitoring plugin to calculate demand and then calls
the CycleCloud API to request scale-up and scale-down.
