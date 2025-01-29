---
title: Troubleshoot Azure Load Balancer resource health, frontend, and backend availability problems
description: Use the available metrics to diagnose your degraded or unavailable Azure Standard Load Balancer deployment.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: troubleshooting
ms.date: 02/08/2024
ms.author: mbender
ms.custom: FY23 content-maintenance
---

# Troubleshoot resource health and inbound availability problems

This article can help you investigate problems that affect the availability of your load balancer's frontend IP and backend resources.

You can use the *resource health* feature in Azure Load Balancer to determine the health of your load balancer. It analyzes the Data Path Availability metric to determine whether the load-balancing endpoints, the frontend IP, and frontend port combinations with load-balancing rules are available.

> [!NOTE]
> Basic Load Balancer doesn't support the resource health feature.

The following table describes the logic for determining the health status of your load balancer.

| Resource health status | Description |
| --- | --- |
| **Available** | Your load balancer resource is healthy and available. |
| **Degraded** | Your load balancer has platform or user-initiated events that affect performance. The Data Path Availability metric reported less than 90% but greater than 25% health for at least two minutes. You might be experiencing moderate to severe performance degradation. |
| **Unavailable** | Your load balancer resource isn't healthy. The Data Path Availability metric reported less than 25% health for at least two minutes. You might be experiencing significant performance degradation or a lack of availability for inbound connectivity. User or platform events might be causing unavailability. |
| **Unknown** | Resource health status for your load balancer resource hasn't updated or received Data Path Availability information in the last 10 minutes. This state might be transient, or your load balancer might not support the resource health feature. |

## Monitor your load balancer's availability

The two metrics that Azure Load Balancer uses to check resource health are *Data Path Availability* and *Health Probe Status*. It's important to understand their meaning to derive correct insights.

### Data Path Availability

A TCP ping generates the Data Path Availability metric every 25 seconds on all frontend ports where you configured load-balancing rules. This TCP ping is routed to any of the healthy (probed up) backend instances. The metric is an aggregated percentage success rate of TCP pings on each frontend IP/port combination for each of your load-balancing rules, across a sample period of time.

### Health Probe Status

A ping of the protocol defined in the health probe generates the Health Probe Status metric. This ping is sent to each instance in the backend pool and on the port defined in the health probe. For HTTP and HTTPS probes, a successful ping requires an `HTTP 200 OK` response. With TCP probes, any response is considered successful.

Azure Load Balancer determines the health of each backend instance when the probe reaches the number of consecutive successes or failures that you configured for the probe threshold property. The health status of each backend instance determines whether or not the backend instance is allowed to receive traffic.

Like the Data Path Availability metric, the Health Probe Status metric aggregates the average successful and total pings during the sampling interval. The Health Probe Status value indicates the backend health in isolation from your load balancer by probing your backend instances without sending traffic through the frontend.

> [!IMPORTANT]
> Health Probe Status is sampled on a one-minute basis. This sampling can lead to minor fluctuations in an otherwise steady value.
>
> For example, consider active/passive scenarios where there are two backend instances, one probed up and one probed down. The health probe service might capture seven samples for the healthy instance and six for the unhealthy instance. This situation leads to a previously steady value of 50 showing as 46.15 for a one-minute interval.

## Diagnose degraded and unavailable load balancers

As outlined in the [this article about resource health](load-balancer-standard-diagnostics.md#resource-health-status), a degraded load balancer shows between 25% and 90% for Data Path Availability. An unavailable load balancer is one with less than 25% for Data Path Availability over a two-minute period.

You can take the same steps to investigate the failure that you see in any Health Probe Status or Data Path Availability alerts that you configured. The following steps explore what to do if you check your resource health and find your load balancer to be unavailable with a Data Path Availability value of 0%. Your service is down.

1. In the Azure portal, go to the detailed metrics view of the page for your load balancer insights. Access the view from the page for your load balancer resource or from the link in your resource health message.

1. Go to the tab for frontend and backend availability, and review a 30-minute window of the time period when the degraded or unavailable state occurred. If the Data Path Availability value is 0%, you know that something is preventing traffic for all of your load-balancing rules. You can also see how long this problem has lasted.

1. Check your Health Probe Status metric to determine whether your data path is unavailable because you have no healthy backend instances to serve traffic. If you have at least one healthy backend instance for all of your load-balancing and inbound rules, you know that your configuration isn't what's causing your data paths to be unavailable. This scenario indicates an Azure platform problem. Although platform problems are rare, they trigger an automated alert to our team for rapid resolution.

## Diagnose health probe failures

If your Health Probe Status metric indicates that your backend instances are unhealthy, we recommend using the following checklist to rule out common configuration errors:

* Check the CPU utilization for your resources to determine if they're under high load.

  You can check by viewing the resource's Percentage CPU metric via the **Metrics** page. For more information, see [Troubleshoot high-CPU issues for Azure Windows virtual machines](/troubleshoot/azure/virtual-machines/troubleshoot-high-cpu-issues-azure-windows-vm).
* If you're using an HTTP or HTTPS probe, check if the application is healthy and responsive.

  Validate that your application is functional by directly accessing it through the private IP address or instance-level public IP address that's associated with your backend instance.
* Review the network security groups (NSGs) applied to your backend resources. Ensure that no rules have a higher priority than `AllowAzureLoadBalancerInBound` that block the health probe.

  You can do this task by visiting the network settings of your backend VMs or virtual machine scale sets. If you find that this NSG problem is the case, move the existing `Allow` rule or create a new high-priority rule to allow Azure Load Balancer traffic.
* Check your OS. Ensure that your VMs are listening on the probe port. Also review the OS firewall rules for the VMs to ensure that they aren't blocking the probe traffic originating from IP address `168.63.129.16`.

  You can check listening ports by running `netstat -a` from a Windows command prompt or `netstat -l` from a Linux terminal.
* Ensure that you're using the right protocol. For example, a probe that uses HTTP to probe a port listening for a non-HTTP application fails.
* Don't place Azure Firewall in the backend pool of load balancers. For more information, see [Integrate Azure Firewall with Azure Standard Load Balancer](../firewall/integrate-lb.md).

## Related content

* [Learn more about Azure Load Balancer health probes](load-balancer-custom-probe-overview.md)
* [Learn more about Azure Load Balancer metrics](load-balancer-standard-diagnostics.md)
