---
title: Troubleshooting an Unhealthy or Degraded Storage Appliance
description: Troubleshooting a Storage Appliance that has Azure Resource Health alerts
author: jensheasby
ms.author: jensheasby
ms.date: 06/10/2025
ms.topic: troubleshooting
ms.service: azure-operator-nexus
---

# Troubleshooting an Unhealthy or Degraded Storage Appliance

This article provides troubleshooting advice and escalation methods for Storage Appliances that are
unhealthy or degraded.

## Capacity Threshold Reached

The health events listed in the text below indicate that the appliance is nearing capacity:

- `SACapacityThresholdDegraded`, which means the Storage Appliance is at 80% capacity or above.
- `SACapacityThresholdUnhealthy`, which means the Storage Appliance is at 90% capacity or above.

You can see the current usage of the appliance by navigating to the Storage Appliance in the portal,
navigating to the `Monitoring > Metrics` tab, and selecting `Nexus Storage Array Space Utilization` from
the `Metric` dropdown.

:::image type="content" source="media/storage-metrics-utilization.png" alt-text="Metric showing the percentage utilization of a Storage Appliance":::

These issues can be addressed by reducing the load on the Storage Appliance. This outcome can be
achieved by:

- Moving some workloads to another cluster if one is available, and this is a supported operation for
  your workload:
  - Re-create the workload on a different cluster (Operator Nexus).
  - Perform steps required to migrate traffic to the new cluster (the specific steps required will
    depend on your workload).
  - Delete the workload from the current cluster.
- Adding array expansions, if you have empty array expansion spaces in your aggregator rack. Speak to
  your storage vendor for instructions.

You can confirm that utilization is reduced by checking the metric again.

Note that any volume deletions may take up to 24 hours to eradicate from the appliance, and that
any deletions should be carried out slowly to avoid worsening the problem.

## Active Alerts

The health events listed in the text below indicate that the appliance has active alerts:

- `StorageApplianceActiveAlertsWarning`, which means there are one or more open warning alerts on the
  Storage Appliance. Warning alerts indicate that there is an issue that requires attention, but the Storage
  Appliance should continue to function.
- `StorageApplianceActiveAlertsCritical`, which means there are one or more open critical alerts on the
  Storage Appliance. Critical alerts indicate a severe problem with the Storage Appliance, that may impact
  functionality.

You can find more details of the specific alert(s), using the following instructions:

- If you have your Storage Appliance set up to send logs to a
  [Log Analytics workspace](/azure/azure-monitor/logs/log-analytics-workspace-overview) (LAW), you can gather
  more details by running the query from the text block below in your LAW.
  ```
  StorageApplianceAlerts
  | where TIMESTAMP > <start time>
  ```
  This log will give you more details of the alert, and may also provide a link to a specific troubleshooting
  article from your storage vendor.
- If you do not have log streaming to a LAW set up, you can still get the details by navigating to the
  Storage Appliance on the portal, navigating to the `Monitoring > Metrics` tab, and selecting
  `Nexus Storage Alerts Open` from the `Metric` dropdown. Then, you should click `Apply splitting` and
  select all of the boxes. You will see a summary of the alert, and the vendor alert code. Use this information
  to search your vendor documentation for further details of the alert.

:::image type="content" source="media/storage-metrics-alerts.png" alt-text="Metric showing an active alert on a Storage Appliance":::

Once you have this information, use it to determine the appropriate next action. You should either:

- Take an action yourself (such as reseating a cable).
- Raise a ticket with your storage vendor.
- Raise a ticket with Microsoft. If you need to raise a ticket with Microsoft, please include the Storage Appliance
  resource ID, and the details of the health event for quicker issue triage.

## Latency

The health events listed in the text below indicate that the appliance has high latency:

- `StorageApplianceLatencyDegraded`, which means the self-reported latency of the Storage Appliance
  exceeds 3 ms.
- `StorageApplianceLatencyUnavailable`, which means the self-reported latency of the Storage Appliance
  exceeds 100 ms.

The expected latency for Pure X-series is 1 ms or less.

The root cause of high latency could be an issue with the appliance, or high load. First, check if high load
is the cause:

- Navigate to the Storage Appliance on the portal.
- Navigate to the `Monitoring > Metrics` tab.
- Select the `Nexus Storage Array Latency` metric. Click `Apply splitting`, and select `Dimension` as
  the dimension to split on.
- Click `+ New Chart`, and select the `Nexus Storage Array Performance Throughput Iops (Avg)` metric.
  Click `Apply Splitting`, and select `Dimension` as the dimension to split on.

:::image type="content" source="media/storage-metrics-latency-throughput.png" alt-text="Metric showing the latency and throughput on a Storage Appliance":::

By comparing the resulting graphs, you can determine whether high load is the cause. If so, reduce the
load to resolve the health event.

If the issue is _not_ high load, you should raise a ticket with your Storage Appliance vendor.

## Network Interface Errors

The health event listed in the text below indicates that the appliance has network interface errors:

- `StorageApplianceNetworkErrorsDegraded`, which means the average rate of network interface errors
  on one or more interfaces has exceeded 3%.

To determine the unhealthy network interfaces, as well as the distribution of the errors, navigate
to the Storage Appliance in the portal, navigate to the `Monitoring > Metrics` tab, and select
`Nexus Storage Network Interface Performance Errors` in the `Metric` dropdown. Then, you should click
`Apply splitting`, and select the `Dimension` and `Name` boxes, ensuring that you select a time range
that starts shortly before the start time of the resource health alert. After identifying the
unhealthy network interface(s), and error types, you should raise a ticket with your Storage Appliance
vendor.

:::image type="content" source="media/storage-metrics-network-errors.png" alt-text="Metric showing network interface errors on a Storage Appliance":::

## Network Latency

The health events listed in the text below indicate that the appliance has high networking latency:

- `StorageApplianceNetworkLatencyDegraded`, which means the latency between the initiator and the Storage
  Appliance exceeds 25 ms.
- `StorageApplianceNetworkLatencyUnavailable`, which means the latency between the initiator and the Storage
  Appliance exceeds 100 ms.

This increased latency implies an underlying problem with the networking between the Bare Metal Machines
(BMMs) and the Storage Appliance. Latency can be introduced on any of the hops between BMMs and Storage Appliance.
You should raise a ticket with Microsoft, quoting the text of this troubleshooting article.
