# Troubleshooting an Unhealthy or Degraded Storage Appliance
This article provides troubleshooting advice and escalation methods for Storage Appliances which are
unhealthy or degraded.

## Capacity Threshold Reached
This will have an "Availability Impacting Reason" of:
- `SACapacityThresholdDegraded`, which means the Storage Appliance is at 80% capacity or above.
- `SACapacityThresholdUnhealthy`, which means the Storage Appliance is at 90% capacity or above.

These issues can be addressed by reducing the load on the Storage Appliance. This can be achieved by:
- Moving some workloads to another cluster if one is available.
- Activating array expansions, if those are available and unused.

Note than any volume deletions may take up to 24 hours to eradicate from the appliance.

## Active Alerts
This will have an "Availability Impacting Reason" of:
- `StorageApplianceActiveAlertsWarning`, which means there are 1 or more open warning alerts on the
Storage Appliance. This means there is an issue which needs resolving, but the Storage Appliance
should continue to function.
- `StorageApplianceAlertsStreamingLost`, which means we are unable to determine if there are open
alerts on the Storage Appliance.
- `StorageApplianceActiveAlertsCritical`, which means there are 1 or more open critical alerts on the
Storage Appliance. This implies a severe problem with the Storage Appliance. If another cluster is
available, you should consider moving mission critical workloads to this alternative cluster until
all critical alerts are resolved.

You should find more details of the specific alert(s) by running the below query in your Log Analytics
Workspace (LAW).

```
StorageApplianceAlerts
| where TIMESTAMP > <start time>
```

>[!NOTE]
>You must have your Storage Appliance set up to send logs to your LAW by adding a diagnostic setting.

Once you have this information, you should be able to tell if you can fix the issue yourself, or if
you need to raise a ticket with your Storage Appliance vendor or with us (see below section for
instructions on raising a ticket with us).

## Latency
This will have an "Availability Impacting Reason" of:
- `StorageApplianceLatencyDegraded`, which means the self-reported latency of the Storage Appliance
has exceeded 1.2ms.
- `StorageApplianceLatencyUnavailable`, which means the self-reported latency of the Storage Appliance
has exceeded 100ms.

The expected latency is 1ms or less.

Latency issues could be caused by an issue with the appliance, or high load. First, check for high
load by navigating to the Storage Appliance on the portal, and viewing the
`Nexus Storage Array Performance Throughput Iops (Avg)` metric, and the `Nexus Storage Array Latency`
metric on the same chart, starting from shortly before the health event appeared. You should be able
to see from this chart whether high load is the course. If so, reducing the load will resolve the
health event.

If you have ruled out high load, you should raise a ticket with your Storage Appliance vendor.

## Hardware Health
This will have an "Availability Impacting Reason" of:
- `SAHardwareDegraded`, which means at least one hardware component is self-reporting as unhealthy.
- `SAHardwareControllersUnhealthy`, which means all controllers are self-reporting as unhealthy. This
could cause all storage control plane operations to fail.
- `SAHardwareDriveBaysUnhealthy`, which means all drive bays are self-reporting as unhealthy. This
could cause all storage data plane operations to fail.
- `SAHardwareNVRAMBaysUnhealthy`, which means all NVRAM bays as self-reporting as unhealthy. This
could cause all storage data plane operations to fail.

If another cluster is available, and you see one of the 3 "Availability Impacting Reason"s which end
with "Unhealthy", you should consider moving mission critical workloads to this alternative cluster
until the health event resolves.

For the case of the `SAHardwareDegraded` "Availability Impacting Reason", you will need to determine
which hardware is unhealthy by navigating to the Storage Appliance on the portal, and viewing the
`Nexus Storage Hardware Component Status` metric. Split this by the `Component Name` dimension, and
filter the `Component Status` to `critical` or `degraded`.

Next, send an engineer to your site to check that the relevant pieces of hardware are in place. If
the hardware is in place, and the health event persists, you should raise a ticket with your Storage
Appliance vendor.

## Network Interface Errors
This will have an "Availability Impacting Reason" of:
- `StorageApplianceNetworkErrorsDegraded`, which means the average rate of network interface errors
on one or more interfaces has exceeded 100/s, and is increasing with time. This implies an issue with
the network interface(s)

To determine the unhealthy network interface(s), navigate to the Storage Appliance in the portal, and
look at the `Nexus Storage Network Interface Performance Errors` metric series, and split it by
`Dimension` and `Name`. Once you have identified the unhealthy network interface(s), you should send
an engineer to the lab to ensure the relevant cables are correctly plugged in. If you determine the
interfaces are correctly wired, and the health event has not cleared, you should raise a ticket with
your Storage Appliance vendor.