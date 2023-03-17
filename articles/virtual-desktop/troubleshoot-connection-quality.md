---
title: Troubleshoot Azure Virtual Desktop connection quality
description: How to troubleshoot connection quality issues in Azure Virtual Desktop.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 09/26/2022
ms.author: helohr
manager: femila
---

# Troubleshooting connection quality in Azure Virtual Desktop

If you experience issues with graphical quality in your Azure Virtual Desktop connection, you can use the Network Data diagnostic table to figure out what's going on. Graphical quality during a connection is affected by many factors, such as network configuration, network load, or virtual machine (VM) load. The Connection Network Data table can help you figure out which factor is causing the issue.

## Addressing round trip time

In Azure Virtual Desktop, latency up to 150 ms shouldn’t impact user experience that doesn't involve rendering or video. Latencies between 150 ms and 200 ms should be fine for text processing. Latency above 200 ms may impact user experience.

In addition, the Azure Virtual Desktop connection depends on the internet connection of the machine the user is using the service from. Users may lose connection or experience input delay in one of the following situations:

 - The user doesn't have a stable local internet connection and the latency is over 200 ms.
 - The network is saturated or rate-limited.

To reduce round trip time:

- Reduce the physical distance between end-users and the server. When possible, your end-users should connect to VMs in the Azure region closest to them.

- Check your network configuration. Firewalls, ExpressRoutes, and other network configuration features can affect round trip time.

- Check if something is interfering with your network bandwidth. If your network's available bandwidth is too low, you may need to change your network settings to improve connection quality. Make sure your configured settings follow our [network guidelines](/windows-server/remote/remote-desktop-services/network-guidance).

- Check your compute resources by looking at CPU utilization and available memory on your VM. You can view your compute resources by following the instructions in [Configuring performance counters](../azure-monitor/agents/data-sources-performance-counters.md#configure-performance-counters) to set up a performance counter to track certain information. For example, you can use the Processor Information(_Total)\\% Processor Time counter to track CPU utilization, or the Memory(\*)\\Available Mbytes counter for available memory. Both of these counters are enabled by default in Azure Virtual Desktop Insights. If both counters show that CPU usage is too high or available memory is too low, your VM size or storage may be too small to support your users' workloads, and you'll need to upgrade to a larger size.

## Optimize VM latency with the Azure Virtual Desktop Experience Estimator tool

The [Azure Virtual Desktop Experience Estimator tool](https://azure.microsoft.com/services/virtual-desktop/assessment/) can help you determine the best location to optimize the latency of your VMs. We recommend you use the tool every two to three months to make sure the optimal location hasn't changed as Azure Virtual Desktop rolls out to new areas.

## My connection data isn't going to Azure Log Analytics

If your **Connection Network Data Logs**  aren't going to Azure Log Analytics every two minutes, you'll need to check the following things:

- Make sure you've [configured the diagnostic settings correctly](diagnostics-log-analytics.md).
- Make sure you've configured the VM correctly.
- Make sure you're actively using the session. Sessions that aren't actively used won't send data to Azure Log Analytics as frequently.

## Next steps

For more information about how to diagnose connection quality, see [Connection quality in Azure Virtual Desktop](connection-latency.md).