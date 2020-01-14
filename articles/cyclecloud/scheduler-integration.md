---
title: Scheduler Integration
description: Grid Scheduling configuration for job management in Azure CycleCloud.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Scheduler Integration

The Azure CycleCloud platform has built-in, first-class support for several grid scheduling software solutions allowing for simplified resource and job management in the cloud. Azure CycleCloud can automatically create, manage, and scale several well known and widely adopted scheduling technologies including but not limited to: [Open Grid Scheduler (Grid Engine)](http://gridscheduler.sourceforge.net), [HTCondor](https://research.cs.wisc.edu/htcondor/), and [PBS Professional](http://pbspro.org/).

## Standard Autoscale Configurations

CycleCloud supports a standard set <autostop-attributes> of autostop attributes across schedulers:

| Attribute                                             | Description                                                                                               |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| cyclecloud.cluster.autoscale.stop_enabled             | Is autostop enabled on this node? true/false                                                              |
| cyclecloud.cluster.autoscale.idle_time_after_jobs     | The amount of time (in seconds) for a node to sit idle after completing jobs before it is scaled down.    |
| cyclecloud.cluster.autoscale.idle_time_before_jobs    |   The amount of time (in seconds) for a node to sit idle before completing jobs before it is scaled down. |

