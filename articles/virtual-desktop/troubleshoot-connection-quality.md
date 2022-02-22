---
title: Troubleshoot Azure Virtual Desktop connection quality
description: How to troubleshoot connection quality issues in Azure Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 02/21/2022
ms.author: helohr
manager: femila
---

# Troubleshooting connection quality in Azure Virtual Desktop

If you experience issues with graphical quality in your Azure Virtual Desktop connection, you can use the Network Data diagnostic table to figure out what's going on. Graphical quality during a connection is affected by many factors, such as network configuration, network load, or virtual machine (VM) load. The Connection Network Data table can help you figure out which factor is causing the issue.

## Addressing round trip time

Round trip time is affected by the workloads the users are running, the users' sensitivity to latency, and the baseline round trip time for the environment. If the table shows that your users have a round trip time higher than 200 milliseconds, that information will narrow down what you need to do to shorten it.

To reduce round trip time:

- Reduce the physical distance between end-users and the server. When possible, your end-users should connect to VMs in the Azure region closest to them.

- Check your network configuration. Firewalls, ExpressRoutes, and other network configuration features can affect round trip time.

- Check if something is interfering with your network bandwidth. If your network's available bandwidth is too low, you may need to change your network settings to improve connection quality. Make sure your configured settings follow our [network guidelines](/windows-server/remote/remote-desktop-services/network-guidance).

- Check if something is interfering with your compute resources by looking at CPU utilization and available memory on your VM. You can view your compute resources by following the instructions in [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md#configuring-performance-counters) to set up a performance counter to track certain information. For example, you can use the Processor Information(_Total)\\% Processor Time counter to track CPU utilization, or the Memory(\*)\\Available Mbytes counter for available memory. Both of these counters are enabled by default in Azure Virtual Desktop Insights. If both counters show that CPU usage is too high or available memory is too low, your VM size may be too small to support your users' workloads, and you'll need to upgrade your VM to a larger size.

## Next steps

For more information about how to diagnose connection quality, see [Connection quality in Azure Virtual Desktop](connection-latency.md).