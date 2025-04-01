---
title: Best practices for BareMetal Machine operations
description: Steps that should be taken before executing any BMM replace, or reimage actions. Highlight essential prerequisites and common pitfalls to avoid.
ms.date: 03/25/2025
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, best-practices
author: omarrivera
ms.author: omarrivera
ms.reviewer: bartpinto
---

# Best Practices for BareMetal Machine Operations

This article provides best practices for BareMetal Machine (BMM) lifecycle management operations.
The aim is to highlight common pitfalls and essential prerequisites.

## Read Important Disclaimers

[!INCLUDE [caution-affect-cluster-integrity](./includes/baremetal-machines/caution-affect-cluster-integrity.md)]

[!INCLUDE [important-donot-disrupt-kcpnodes](./includes/baremetal-machines/important-donot-disrupt-kcpnodes.md)]

[!INCLUDE [prerequisites-azcli-bmm-actions](./includes/baremetal-machines/prerequisites-azcli-bmm-actions.md)]

## Identify the Best-fit Corrective Approach

Troubleshooting technical problems requires a systematic approach.
One effective method is to start with the least invasive solution and, if necessary, work your way up to more complex and potentially disruptive measures.
Keep in mind that these troubleshooting methods might not always be effective for all scenarios and accounting for various other factors might require a different approach.
For this reason, it's essential to understand the available options well when troubleshooting a BMM for failures to determine the most appropriate corrective action.

### General Advice while Troubleshooting

- Familiarize yourself with the relevant documentation, including troubleshooting guides and how-to articles.
  Always refer to the latest documentation to stay informed about best practices and updates.
- Avoid repeated failed operations by first attempting to identify the root cause of the failure before retrying the operation.
  Perform retry attempts in incremental steps to isolate and address specific issues.
- Wait for Az CLI commands to run to completion and validate the state of the BMM resource before executing other steps.
- Verify that the firmware and software versions are up-to-date before a new greenfield deployment to prevent compatibility issues between hardware and software versions.
  For more information about firmware compatibility, see [Operator Nexus Platform Prerequisites](./howto-platform-prerequisites.md).
- Check the iDRAC credentials are correct and that the BMM is powered on.

#### Look at General Network Connectivity Health

Ensure stable network connectivity to avoid interruptions during the process.
Ignoring network stability could make operations fail to complete successfully and leave a BMM in an error or degraded state.

A quick look at Cluster resource's `clusterConnectionStatus` serves as one indicator of network connectivity health.

```azurecli
az networkcloud cluster show \
  -g $CLUSTER_MRG \
  -n $BMM_NAME \
  --subscription $SUBSCRIPTION \
  --query "clusterConnectionStatus" \
  -o table

Result
---------
Connected
```

Take a deeper look at the NetworkFabric resources by checking the NetworkFabric resources statuses, alerts, and metrics.
See related articles:
  - [How to monitor interface In and Out packet rate for network fabric devices]
  - [How to configure diagnostic settings and monitor configuration differences in Nexus Network Fabric].

Evaluate for any BMM warnings or degraded conditions which could indicate the need to resolve hardware, network, or server configuration problems.
For more information, see [Troubleshoot Degraded Status Errors on Bare Metal Machines] and [Troubleshoot Bare Metal Machine Warning Status].

#### Determine if Firmware Update Jobs are Running

Validate that there are no running firmware upgrade jobs through the BMC before initiating a `replace` or `reimage` operation.
Interrupting an ongoing firmware upgrade can leave the BMM in an inconsistent state.
You can view in the iDRAC GUI the `jobqueue` or use a `racadm jobqueque view` to determine if there are firmware upgrade jobs running.

```azurecli
az networkcloud baremetalmachine run-read-command \
  -g $CLUSTER_MRG \
  -n $BMM_NAME \
  --subscription $SUBSCRIPTION \
  --limit-time-seconds 60 \
  --commands "[{command:'nc-toolbox nc-toolbox-runread racadm jobqueue view'}]" \
  --output-directory .
```

Here's an example output from the `racadm jobqueue view` command which shows `Firmware Update`.
```
[Job ID=JID_833540920066]
Job Name=Firmware Update: iDRAC
Status=Downloading
Start Time= [Not Applicable]
Expiration Time= [Not Applicable]
Message= [RED001: Job in progress.]
Percent Complete= [50%]
```

Here's an example output from the `racadm jobqueue view` command showing common happy-path statements.
```
-------------------------JOB QUEUE------------------------
[Job ID=JID_429400224349]
Job Name=Configure: Import Server Configuration Profile
Status=Completed
Scheduled Start Time=[Not Applicable]
Expiration Time=[Not Applicable]
Actual Start Time=[Tue, 25 Mar 2025 17:00:22]
Actual Completion Time=[Tue, 25 Mar 2025 17:00:32]
Message=[SYS053: Successfully imported and applied Server Configuration Profile.]
Percent Complete=[100]
----------------------------------------------------------
[Job ID=JID_429400338344]
Job Name=Export: Server Configuration Profile
Status=Completed
Scheduled Start Time=[Not Applicable]
Expiration Time=[Not Applicable]
Actual Start Time=[Tue, 25 Mar 2025 17:00:33]
Actual Completion Time=[Tue, 25 Mar 2025 17:00:58]
Message=[SYS043: Successfully exported Server Configuration Profile]
Percent Complete=[100]
```

## Best Practices for a BMM Reimage

The BMM `reimage` action is explained in [BMM Lifecycle Management Commands] and scenario procedures described in [Troubleshoot Azure Operator Nexus Server Problems].

[!INCLUDE [warning-donot-run-multiple-actions](./includes/baremetal-machines/warning-donot-run-multiple-actions.md)]

You can restore the operating system runtime version on a BMM by executing the `reimage` operation.
A BMM `reimage` can be both time-saving and reliable for resolving issues or restoring the operating system software to a known-good state.
This process **redeploys** the runtime image on the target BMM and executes the steps to rejoin the cluster with the same identifiers.
The `reimage` action is designed to interact with the operating system partition, leaving virtual machine's local storage unchanged.

> [!IMPORTANT]
> Avoid manual or automated changes to the BMM's file system (also known as "break glass").
> The `reimage` action is required to restore Microsoft support and any changes done to the BMM are lost while restoring the node to its expected state.

### Preconditions and Validations Before a BMM Reimage

Before initiating any `reimage` operation, ensure the following preconditions are met:

- Make sure the BMM's workloads are drained using the [`cordon`](./howto-baremetal-functions.md#make-a-bmm-unschedulable-cordon) command with the parameter `evacuate` set to `True`.
- Perform high level checks covered in the article [Troubleshoot Bare Metal Machine Provisioning].
- Evaluate any BMM warnings or degraded conditions which could indicate the need to resolve hardware, network, or server configuration problems before a `reimage` operation.
  For more information, read [Troubleshoot Degraded Status Errors on Bare Metal Machines] and [Troubleshoot Bare Metal Machine Warning Status].
- If the BMM reports a failed state with the reason of hardware validation (seen in the BMM `Detailed Status` and `Detailed Status Message` fields), then the BMM needs a `replace` instead.
  See the [Best Practices for a BMM Replace](#best-practices-for-a-bmm-replace).
- Validate that there are no running firmware upgrade jobs.
  Follow steps in section [Determine if Firmware Update Jobs are Running](#determine-if-firmware-update-jobs-are-running).

## Best Practices for a BMM Replace

The BMM `replace` action is explained in [BMM Lifecycle Management Commands] and scenario procedures described in [Troubleshoot Azure Operator Nexus Server Problems].

[!INCLUDE [warning-donot-run-multiple-actions](./includes/baremetal-machines/warning-donot-run-multiple-actions.md)]

Hardware failures are a normal occurrence over the life of a server.
Component replacements might be necessary to restore functionality and ensure continued operation.
The `replace` operation must be executed after any hardware maintenance/repair event.
When one or more hardware components fail on the server (multiple failures), make the necessary repairs for **all** components before executing a BMM `replace` operation.

> [!IMPORTANT]
> With the `2024-07-01` GA API version, the RAID controller is reset during BMM `replace`, wiping all data from the server's virtual disks.
> Baseboard Management Controller (BMC) virtual disk alerts triggered during BMM `replace` can be ignored unless there are more physical disk and/or RAID controllers alerts.

### Preconditions and Validations Before a BMM Replace

Before initiating any `replace` operation, ensure the following preconditions are met:

- Make sure the BMM's workloads are drained using the [`cordon`](./howto-baremetal-functions.md#make-a-bmm-unschedulable-cordon) command with the parameter `evacuate` set to `True`.
- Perform high level checks covered in the article [Troubleshoot Bare Metal Machine Provisioning].
- Evaluate any BMM warnings or degraded conditions which could indicate the need to resolve hardware, network, or server configuration problems before a `replace` operation.
  For more information, see [Troubleshoot Degraded Status Errors on Bare Metal Machines] and [Troubleshoot Bare Metal Machine Warning Status].
- Validate that there are no running firmware upgrade jobs.
  Follow steps in section [Determine if Firmware Update Jobs are Running](#determine-if-firmware-update-jobs-are-running).

### Resolve Hardware Validation Issues

When a BMM is marked with failed hardware validation, it might indicate that physical repairs are needed.
It's crucial to identify and address these repairs before performing a BMM `replace`.
A hardware validation process is invoked as part of the `replace` operation to ensure the physical host's integrity before deploying the OS image.
The BMM can't provision successfully when the BMM continues to have hardware validation failures.
As a result, the BMM fails to complete the necessary setup steps to become operational and join the cluster.
Ensure **all hardware validation issues** are cleared before the next `replace` action.

To understand hardware validation result, read through the article [Troubleshoot Hardware Validation Failure](./troubleshoot-hardware-validation-failure.md).

### BMM Replace isn't Required

Some repairs don't require a BMM `replace` to be executed.
For example, a `replace` operation isn't required when you're performing a physical hot swappable power supply repair because the BMM host will continue to function normally after the repair.
However, if the BMM failed hardware validation, the BMM `replace` is required even if the hot swappable repairs are done.
Examine the BMM status messages to determine if hardware validation failures or other degraded conditions are present.
  - [Troubleshoot Degraded Status Errors on Bare Metal Machines]
  - [Troubleshoot Bare Metal Machine Warning Status]
  - [Troubleshoot Hardware Validation Failure](./troubleshoot-hardware-validation-failure.md).

Other repairs of this type might be:

- CPU
- Dual In-Line Memory Module (DIMM)
- Fan
- Expansion board riser
- Transceiver
- Ethernet or fiber cable replacement

### BMM Relace is Required

After components such as motherboard or Network Interface Card (NIC) are replaced, the BMM MAC address changes.
However, the iDRAC IP address and hostname remain the same.
Motherboard changes result in MAC address changes, requiring a BMM `replace`.

A `replace` operation **is required** to bring the BMM back into service when you're performing the following physical repairs:

- Backplane
- System board
- SSD disk
- PERC/RAID adapter
- Mellanox Network Interface Card (NIC)
- Broadcom embedded NIC

### After BMM Replace

After the BMM `replace` operation completes successfully, ensure that the `provisioningStatus` is `Succeeded` and the `readyState` is `True`.
Only then, proceed to execute the `uncordon` operation to have the BMM rejoin the workload schedulable node pool.

## Request Support

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).

## References

- [BMM Lifecycle Management Commands]
- [Run emergency bare metal actions outside of Azure using nexusctl]
- [Troubleshoot Azure Operator Nexus Server Problems]
- [Troubleshoot Bare Metal Machine Provisioning]
- [Troubleshoot Bare Metal Machine Warning Status]
- [Troubleshoot Degraded Status Errors on Bare Metal Machines]
- [Troubleshoot Hardware Validation Failure]

[BMM Lifecycle Management Commands]: ./howto-baremetal-functions.md
[Run emergency bare metal actions outside of Azure using nexusctl]: ./howto-baremetal-nexusctl.md
[Troubleshoot Azure Operator Nexus Server Problems]: ./troubleshoot-reboot-reimage-replace.md
[Troubleshoot Bare Metal Machine Provisioning]: ./troubleshoot-bare-metal-machine-provisioning.md
[Troubleshoot Bare Metal Machine Warning Status]: ./troubleshoot-bare-metal-machine-warning.md
[Troubleshoot Degraded Status Errors on Bare Metal Machines]: ./troubleshoot-bare-metal-machine-degraded.md
[Troubleshoot Hardware Validation Failure]: ./troubleshoot-hardware-validation-failure.md
[How to monitor interface In and Out packet rate for network fabric devices]: ./howto-monitor-interface-packet-rate.md
[How to configure diagnostic settings and monitor configuration differences in Nexus Network Fabric]: ./howto-configure-diagnostic-settings-monitor-configuration-differences.md