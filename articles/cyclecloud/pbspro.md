---
title: Azure CycleCloud PBS Professional OSS Integration | Microsoft Docs
description: PBS Professional OSS scheduler configuration in Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# PBS Professional OSS

[PBS Professional OSS (PBS Pro)](http://pbspro.org/) can easily be enabled on a CycleCloud cluster by modifying the "run_list" in the configuration section of your cluster definition. The two basic components of a PBS Professional cluster are the 'master' node which provides a shared filesystem on which the PBS Professional software runs, and the 'execute' nodes which are the hosts that mount the shared filesystem and execute the jobs submitted. For example, a simple cluster template snippet may look like:

``` ini
[cluster my-pbspro]

[[node master]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A4 # 8 cores

    [[[configuration]]]
    run_list = role[pbspro_master_role]

[[nodearray execute]]
    ImageName = cycle.image.centos7
    MachineType = Standard_A1  # 1 core

    [[[configuration]]]
    run_list = role[pbspro_execute_role]
```

Importing and starting a cluster with definition in CycleCloud will yield a single 'master' node. Execute nodes can be added to the cluster via the `cyclecloud add_node` command. For example, to add 10 more execute nodes:

```azurecli-interactive
cyclecloud add_node my-pbspro -t execute -c 10
```

## PBS Professional Configuration Reference

The following are the PBS Professional specific configuration options you can toggle to customize functionality:

| PBS Pro Specific Configuration Options | Description |
| -------------------------------------- | ----------- |
| pbspro.slots                           | The number of slots for a given node to report to PBS Pro. The number of slots is the number of concurrent jobs a node can execute, this value defaults to the number of CPUs on a given machine. You can override this value in cases where you don't run jobs based on CPU but on memory, GPUs, etc.                                                               |
| pbspro.slot_type                       | The name of type of 'slot' a node provides. The default is 'execute'. When a job is tagged with the hard resource 'slot_type=<type>', that job will *only* run on a machine of the same slot type. This allows you to create different software and hardware configurations per node and ensure an appropriate job is always scheduled on the correct type of node.  |
| pbspro.version                         | Default: '18.1.3-0'. This is the PBS Professional version to install and run. This is currently the default and *only* option. In the future additional versions of the PBS Professional software may be supported. |

CycleCloud supports a standard set of autostop attributes for PBS Pro:

| Attribute   | Description |
| ----------  | ----------- |
| cyclecloud.cluster.autoscale.stop_enabled             | Is autostop enabled on this node? [true/false]  |
| cyclecloud.cluster.autoscale.idle_time_after_jobs     | The amount of time (in seconds) for a node to sit idle after completing jobs before it is scaled down.    |
| cyclecloud.cluster.autoscale.idle_time_before_jobs    |   The amount of time (in seconds) for a node to sit idle before completing jobs before it is scaled down. |
 