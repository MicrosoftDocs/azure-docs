---
title: Using Scheduled Events
description: Handle VM events on a node
author: dougclayton
ms.date: 07/01/2025
ms.author: doclayto
monikerRange: '>= cyclecloud-8'
---

# Using Scheduled Events

Starting with version 8.2.2, CycleCloud supports the use of [Scheduled Events](/azure/virtual-machines/linux/scheduled-events) for VMs. With this feature, you can add a script to your VM that runs automatically when a supported event happens.

## Invoking a script when events occur

The Jetpack agent on the node automatically listens for events. When one occurs, the agent looks in the scripts directory (`/opt/cycle/jetpack/scripts` on Linux, `C:\cycle\jetpack\scripts` on Windows) for a script named to match the [event](#supported-events). If the agent finds a script, it executes the script and defers the event until the script succeeds (or the event timeout elapses and Azure schedules the event). When the script exits successfully, the agent acknowledges the event to Azure so that the underlying action (such as a reboot) can happen immediately.

> [!NOTE]
> When you enable event monitoring, CycleCloud automatically acknowledges events that don't have scripts. This automatic acknowledgment avoids delaying events like reboots. If you use a custom process to monitor events, you can disable event monitoring. If you disable event monitoring, CycleCloud doesn't get [notification of spot evictions](../how-to/use-spot-instances.md#spot-vm-eviction).

Scheduled-event monitoring is on by default. You can turn it off by setting the following property on a node or node array:

``` ini
[[[configuration]]]
cyclecloud.monitor_scheduled_events = false
```

The deprecated setting `cyclecloud.monitor_spot_eviction`, introduced in version 8, now works the same way as `cyclecloud.monitor_scheduled_events`.

### Supported events

| Event | Description | Linux script | Windows script |
| - | - | - | - |
| Preempt | The spot VM to evict. | onPreempt.sh | onPreempt.bat |
| Terminate | The VM scheduled for deletion. ([optional](#terminate-notification))| onTerminate.sh | onTerminate.bat |
| Reboot | The VM scheduled to reboot. | onReboot.sh | onReboot.bat |
| Redeploy | The VM scheduled to move to another host. | onRedeploy.sh | onRedeploy.bat |
| Freeze | The VM scheduled to pause for a few seconds.| onFreeze.sh | onFreeze.bat |

## Terminate notification

CycleCloud supports enabling [Terminate Notification](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-terminate-notification) on scale set VMs, such as execute nodes. Set `EnableTerminateNotification` to true on the node array to enable this feature. This setting enables terminate notification for the scale sets created for that node array. To change the timeout, set `TerminateNotificationTimeout` to a new value. For example, in a cluster template:

``` ini
[[nodearray execute]]
EnableTerminateNotification = true
TerminateNotificationTimeout = 10
```

If you don't set `EnableTerminateNotification` to true, the scale set VMs don't receive a terminate event.
