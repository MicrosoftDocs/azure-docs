---
title: Using Scheduled Events
description: Handle VM events on a node
author: dougclayton
ms.date: 03/14/2022
ms.author: doclayto
monikerRange: '>= cyclecloud-8'
---

# Using Scheduled Events

As of 8.2.2, CycleCloud can take advantage of [Scheduled Events](/azure/virtual-machines/linux/scheduled-events) for VMs. This feature lets you put a script on your VM that will be automatically executed when one of the supported events occurs.

## Invoking a script when events occur

The Jetpack agent on the node automatically listens for events. When one occurs, it looks in the scripts directory (`/opt/cycle/jetpack/scripts` on Linux, `C:\cycle\jetpack\scripts` on Windows) for a script named to match the [event](#supported-events). If it finds a script, it executes it and defers the event until the script succeeds (or the event timeout elapses and Azure schedules the event). Once the script exits successfully, the event is acknowledged to Azure so that the underlying action (e.g., a reboot) can happen immediately. 

> [!NOTE]
> Events for which there are no scripts will be automatically acknowledged by CycleCloud when monitoring is enabled, to ensure that events such as reboots are not unnecessarily delayed. If you have another custom process that already monitors events, event monitoring can be disabled. Note that this means CycleCloud will not get [notification of spot evictions](../how-to/use-spot-instances.md#spot-vm-eviction).

Scheduled-event monitoring is on by default, but it can be disabled by setting the following on a node or nodearray:

``` ini
[[[configuration]]]
cyclecloud.monitor_scheduled_events = false
```

The deprecated setting `cyclecloud.monitor_spot_eviction`, added in version 8, now means the same as `cyclecloud.monitor_scheduled_events`.

### Supported Events

| Event | Description | Linux Script | Windows Script |
| - | - | - | - |
| Preempt | The spot VM is being evicted | onPreempt.sh | onPreempt.bat |
| Terminate | The VM is scheduled to be deleted ([optional](#terminate-notification))| onTerminate.sh | onTerminate.bat |
| Reboot | The VM is scheduled to be rebooted | onReboot.sh | onReboot.bat |
| Redeploy | The VM is scheduled to move to another host | onRedeploy.sh | onRedeploy.bat |
| Freeze | The VM is scheduled to pause for a few seconds| onFreeze.sh | onFreeze.bat |

## Terminate Notification

CycleCloud supports enabling [Terminate Notification](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification) on scaleset VMs (e.g., execute nodes). To do this, set `EnableTerminateNotification` to true on the nodearray. This will enable it for scalesets created for this nodearray. To override the timeout allowed, you can set `TerminateNotificationTimeout` to a new time. For example, in a cluster template:

``` ini
[[nodearray execute]]
EnableTerminateNotification = true
TerminateNotificationTimeout = 10
```

Without `EnableTerminateNotification` set to true, the scaleset VMs will not get a Terminate event.
