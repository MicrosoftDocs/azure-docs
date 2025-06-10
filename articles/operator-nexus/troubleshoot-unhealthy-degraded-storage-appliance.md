---
title: Troubleshooting an Unhealthy or Degraded Storage Appliance
description: Troubleshooting a Storage Appliance which has Azure Resource Health alerts
author: jensheasby
ms.author: jensheasby
ms.date: 06/10/2025
ms.topic: troubleshooting
ms.service: azure-operator-nexus
---

# Troubleshooting an Unhealthy or Degraded Storage Appliance

This article provides troubleshooting advice and escalation methods for Storage Appliances which are
unhealthy or degraded.

## Capacity Threshold Reached

This will have an "Availability Impacting Reason" of:

- `SACapacityThresholdDegraded`, which means the Storage Appliance is at 80% capacity or above.
- `SACapacityThresholdUnhealthy`, which means the Storage Appliance is at 90% capacity or above.

You can see the current usage of the appliance by navigating to the Storage Appliance in the portal,
navigating to the `Monitoring > Metrics` tab and selecting `Nexus Storage Array Space Utilization` from
the `Metric` dropdown.

These issues can be addressed by reducing the load on the Storage Appliance. This can be achieved by:

- Moving some workloads to another cluster if one is available.
- Activating array expansions, if those are available and unused.

You can check back on the value of the utilization metric to confirm that it has returned below 80%.

Note than any volume deletions may take up to 24 hours to eradicate from the appliance, and that
any deletions should be carried out slowly to avoid worsening the problem.

## Active Alerts

This will have an "Availability Impacting Reason" of:

- `StorageApplianceActiveAlertsWarning`, which means there are 1 or more open warning alerts on the
  Storage Appliance. This means there is an issue which needs resolving, but the Storage Appliance
  should continue to function.
- `StorageApplianceActiveAlertsCritical`, which means there are 1 or more open critical alerts on the
  Storage Appliance. This implies a severe problem with the Storage Appliance.

You should find more details of the specific alert(s), and from that determine whether you need to take
an action yourself (such as re-seating a cable), raise a ticket with your storage vendor, or raise a
ticket with Microsoft.

- If you have your Storage Appliance set up to send logs to a Log Analytics Workspace (LAW), you can gather
  more details by running the below query in your LAW.
  ```
  StorageApplianceAlerts
  | where TIMESTAMP > <start time>
  ```
  This will give you more details of the alert, and may also provide a link to a specific troubleshooting
  article from your storage vendor.
- If you do not have log streaming to a LAW set up, you can still get the details by navigating to the
  Storage Appliance on the portal, navigating to the `Monitoring > Metrics` tab and selecting
  `Nexus Storage Alerts Open` from the `Metric` dropdown. Then, you should click `Apply splitting` and
  select all of the boxes. You will then see a summary of the alert, as well as the vendor alert code. You
  can use this information to search your vendor documentation for further details of the alert.

Once you have this information, you should be able to tell if you can fix the issue yourself, or if
you need to raise a ticket with your Storage Appliance vendor or with us. If you need to raise a
ticket with us, please include the Storage Appliance name and "Availability Impacting Reason" for
quicker issue triage.

## Latency

This will have an "Availability Impacting Reason" of:

- `StorageApplianceLatencyDegraded`, which means the self-reported latency of the Storage Appliance
  has exceeded 1.2ms.
- `StorageApplianceLatencyUnavailable`, which means the self-reported latency of the Storage Appliance
  has exceeded 100ms.

<!-- TODO: needs an update after the new threshold is set (and the new threshold may need to depend on type) -->

The expected latency is 1ms or less.

Latency issues could be caused by an issue with the appliance, or high load. First, check for high
load by navigating to the Storage Appliance on the portal, navigating to the `Monitoring > Metrics` tab
and viewing the `Nexus Storage Array Performance Throughput Iops (Avg)` metric, and the
`Nexus Storage Array Latency` metric on the same chart, starting from shortly before the health event
appeared. You should be able to see from this chart whether high load is the cause. If so, reducing the
load will resolve the health event.

If you have ruled out high load, you should raise a ticket with your Storage Appliance vendor.

## Network Interface Errors

This will have an "Availability Impacting Reason" of:

- `StorageApplianceNetworkErrorsDegraded`, which means the average rate of network interface errors
  on one or more interfaces has exceeded 3%. This implies an issue with the network interface(s).

To determine the unhealthy network interface(s), as well as the distribution of the errors, navigate
to the Storage Appliance in the portal, navigate to the `Monitoring > Metrics` tab select
`Nexus Storage Network Interface Performance Errors` in the `Metric` dropdown. Then, you should click
`Apply splitting`, and select the `Dimension` and `Name` boxes, ensuring that you select a timerange
which starts shortly before the start time of the resource health alert. Once you have identified the
unhealthy network interface(s), and error types, you should raise a ticket with your Storage Appliance
vendor.

## Network Latency

This will have an "Availability Impacting Reason" of:

- `StorageApplianceNetworkLatencyDegraded`, which means the latency between the initiator and the Storage
  Appliance has exceeded 25ms.
- `StorageApplianceNetworkLatencyUnavailable`, which means the latency between the initiator and the Storage
  Appliance has exceeded 100ms.

This increased latency implies an underlying problem with the networking between the Bare Metal Machines
(BMMs) and the Storage Appliance. As this can result from any of the hops between BMMs and Storage Appliance,
you should raise a ticket with Microsoft, quoting the availability impacting reason and the text of this
TSG.
