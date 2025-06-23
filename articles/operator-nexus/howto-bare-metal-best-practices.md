---
title: Best practices for Bare Metal Machine operations
description: Steps that should be taken before executing any Bare Metal Machine replace, or reimage actions. Highlight essential prerequisites and common pitfalls to avoid.
ms.date: 05/22/2025
ms.topic: how-to
ms.service: azure-operator-nexus
ms.custom: template-how-to, best-practices
author: omarrivera
ms.author: omarrivera
ms.reviewer: bartpinto
---

# Best practices for Bare Metal Machine operations

This article provides best practices for Bare Metal Machine (BMM) lifecycle management operations.
The aim is to highlight common pitfalls and essential prerequisites.

## Read important disclaimers

[!INCLUDE [caution-affect-cluster-integrity](./includes/baremetal-machines/caution-affect-cluster-integrity.md)]

[!INCLUDE [important-donot-disrupt-kcpnodes](./includes/baremetal-machines/important-donot-disrupt-kcpnodes.md)]

[!INCLUDE [prerequisites-azure-cli-bare-metal-machine-actions](./includes/baremetal-machines/prerequisites-azure-cli-bare-metal-machine-actions.md)]

## Identify the best-fit corrective approach

Troubleshooting technical problems requires a systematic approach.
One effective method is to start with the least invasive solution and, if necessary, work your way up to more complex and potentially disruptive measures.
Keep in mind that these troubleshooting methods might not always be effective for all scenarios and accounting for various other factors might require a different approach.
For this reason, it's essential to understand the available options well when troubleshooting a Bare Metal Machine for failures to determine the most appropriate corrective action.

### General advice while troubleshooting

- Familiarize yourself with the relevant documentation, including troubleshooting guides and how-to articles.
  Always refer to the latest documentation to stay informed about best practices and updates.
- Avoid repeated failed operations by first attempting to identify the root cause of the failure before retrying the operation.
  Perform retry attempts in incremental steps to isolate and address specific issues.
- Wait for Az CLI commands to run to completion and validate the state of the Bare Metal Machine resource before executing other steps.
- Verify that the firmware and software versions are up-to-date before a new greenfield deployment to prevent compatibility issues between hardware and software versions.
  For more information about firmware compatibility, see [Operator Nexus Platform Prerequisites](./howto-platform-prerequisites.md).
- Check the iDRAC credentials are correct and that the Bare Metal Machine is powered on.

#### Look at general network connectivity health

Ensure stable network connectivity to avoid interruptions during the process.
Ignoring network stability could make operations fail to complete successfully and leave a Bare Metal Machine in an error or degraded state.

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

Evaluate for any Bare Metal Machine warnings or degraded conditions which could indicate the need to resolve hardware, network, or server configuration problems.
For more information, see [Troubleshoot Degraded Status Errors on Bare Metal Machines] and [Troubleshoot Bare Metal Machine Warning Status].

#### Determine if firmware update jobs are running

Validate that there are no running firmware upgrade jobs through the BMC before initiating a `replace` or `reimage` operation.
Interrupting an ongoing firmware upgrade can leave the Bare Metal Machine in an inconsistent state.

- You can view in the iDRAC GUI the `jobqueue` or use `run-read-command` `racadm jobqueque view` to determine if there are firmware upgrade jobs running.
- For more information about the `run-read-command` feature, see [Bare Metal Run-Read Execution](./howto-baremetal-run-read.md).

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

#### Monitor progress using `run-read-command`

In version 2506.2 and above, you can monitor the progress of long running Bare Metal Machine actions using a `run-read-command`.

- Some long running actions such as `Replace` or `Reimage` are composed of multiple steps, for example, `Hardware Validation`, `Deprovisioning`, or `Provisioning`.
- The following `run-read-command` shows how to view the different steps in each action, and the progress or status of each step including any potential errors.
- This information is available on the BareMetalMachine kubernetes resource during or after the action is completed.
- For more information about the `run-read-command` feature, see [BareMetal Run-Read Execution](./howto-baremetal-run-read.md).

Example `run-read-command` to view action progress on Bare Metal Machine `rack2compute08`:

```azurecli
az networkcloud baremetalmachine run-read-command \
  -g <ResourceGroup_Name> \
  -n <Control Node BMM Name> \
  --limit-time-seconds 60 \
  --commands "[{command:'kubectl get',arguments:[-n,nc-system,bmm,rack2compute08,-o,json]}]" \
  --output-directory .
```

Example output for a Replace action:

```json
[
  {
    "correlationId": "961a6154-4342-4831-9693-27314671e6a7",
    "endTime": "2025-05-15T21:20:44Z",
    "startTime": "2025-05-15T20:16:19Z",
    "status": "Completed",
    "stepStates": [
      {
        "endTime": "2025-05-15T20:25:51Z",
        "name": "Hardware Validation",
        "startTime": "2025-05-15T20:16:19Z",
        "status": "Completed"
      },
      {
        "endTime": "2025-05-15T20:26:21Z",
        "name": "Deprovisioning",
        "startTime": "2025-05-15T20:25:51Z",
        "status": "Completed"
      },
      {
        "endTime": "2025-05-15T21:20:44Z",
        "name": "Provisioning",
        "startTime": "2025-05-15T20:26:21Z",
        "status": "Completed"
      }
    ],
    "type": "Microsoft.NetworkCloud/bareMetalMachines/replace"
  }
]
```

## Best practices for a Bare Metal Machine reimage

The Bare Metal Machine (BMM) `reimage` action is explained in [Bare Metal Machine Lifecycle Management Commands] and scenario procedures described in [Troubleshoot Azure Operator Nexus Server Problems].

[!INCLUDE [warning-do-not-run-multiple-actions](./includes/baremetal-machines/warning-do-not-run-multiple-actions.md)]

You can restore the operating system runtime version on a Bare Metal Machine by executing the `reimage` operation.
A Bare Metal Machine `reimage` can be both time-saving and reliable for resolving issues or restoring the operating system software to a known-good state.
This process **redeploys** the runtime image on the target Bare Metal Machine and executes the steps to rejoin the cluster with the same identifiers.
The `reimage` action is designed to interact with the operating system partition, leaving virtual machine's local storage unchanged.

> [!IMPORTANT]
> Avoid manual or automated changes to the Bare Metal Machine's file system (also known as "break glass").
> The `reimage` action is required to restore Microsoft support and any changes done to the Bare Metal Machine are lost while restoring the node to its expected state.

### Preconditions and validations before a Bare Metal Machine reimage

Before initiating any `reimage` operation, ensure the following preconditions are met:

- Make sure the Bare Metal Machine's workloads are drained using the [`cordon`](./howto-baremetal-functions.md#make-a-bare-metal-machine-unschedulable-cordon) command with the parameter `evacuate` set to `True`.
- Perform high level checks covered in the article [Troubleshoot Bare Metal Machine Provisioning].
- Evaluate any Bare Metal Machine warnings or degraded conditions which could indicate the need to resolve hardware, network, or server configuration problems before a `reimage` operation.
  For more information, read [Troubleshoot Degraded Status Errors on Bare Metal Machines] and [Troubleshoot Bare Metal Machine Warning Status].
- If the Bare Metal Machine reports a failed state with the reason of hardware validation (seen in the Bare Metal Machine `Detailed Status` and `Detailed Status Message` fields), then the Bare Metal Machine needs a `replace` instead.
  See the [Best Practices for a Bare Metal Machine Replace](#best-practices-for-a-bare-metal-machine-replace).
- Validate that there are no running firmware upgrade jobs.
  Follow steps in section [Determine if Firmware Update Jobs are Running](#determine-if-firmware-update-jobs-are-running).

## Best practices for a Bare Metal Machine replace

The Bare Metal Machine `replace` action is explained in [Bare Metal Machine Lifecycle Management Commands] and scenario procedures described in [Troubleshoot Azure Operator Nexus Server Problems].

[!INCLUDE [warning-do-not-run-multiple-actions](./includes/baremetal-machines/warning-do-not-run-multiple-actions.md)]

Hardware failures are a normal occurrence over the life of a server.
Component replacements might be necessary to restore functionality and ensure continued operation.
The `replace` operation must be executed after any hardware maintenance/repair event.
When one or more hardware components fail on the server (multiple failures), make the necessary repairs for **all** components before executing a Bare Metal Machine `replace` operation.

> [!IMPORTANT]
> With the `2024-07-01` GA API version, the RAID controller is reset during Bare Metal Machine `replace`, wiping all data from the server's virtual disks.
> Baseboard Management Controller (BMC) virtual disk alerts triggered during Bare Metal Machine `replace` can be ignored unless there are more physical disk and/or RAID controllers alerts.

### Preconditions and validations before a Bare Metal Machine replace

Before initiating any `replace` operation, ensure the following preconditions are met:

- Make sure the Bare Metal Machine's workloads are drained using the [`cordon`](./howto-baremetal-functions.md#make-a-bare-metal-machine-unschedulable-cordon) command with the parameter `evacuate` set to `True`.
- Perform high level checks covered in the article [Troubleshoot Bare Metal Machine Provisioning].
- Evaluate any Bare Metal Machine warnings or degraded conditions which could indicate the need to resolve hardware, network, or server configuration problems before a `replace` operation.
  For more information, see [Troubleshoot Degraded Status Errors on Bare Metal Machines] and [Troubleshoot Bare Metal Machine Warning Status].
- Validate Bare Metal Machine is powered on.
- Validate that there are no running firmware upgrade jobs.
  Follow steps in section [Determine if Firmware Update Jobs are Running](#determine-if-firmware-update-jobs-are-running).

### Resolve hardware validation issues

When a Bare Metal Machine is marked with failed hardware validation, it might indicate that physical repairs are needed.
It's crucial to identify and address these repairs before performing a Bare Metal Machine `replace`.
A hardware validation process is invoked as part of the `replace` operation to ensure the physical host's integrity before deploying the OS image.
The Bare Metal Machine can't provision successfully when the Bare Metal Machine continues to have hardware validation failures.
As a result, the Bare Metal Machine fails to complete the necessary setup steps to become operational and join the cluster.
Ensure **all hardware validation issues** are cleared before the next `replace` action.

To understand hardware validation result, read through the article [Troubleshoot Hardware Validation Failure](./troubleshoot-hardware-validation-failure.md).

### Bare Metal Machine replace isn't required

Some repairs don't require a Bare Metal Machine `replace` to be executed.
For example, a `replace` operation isn't required when you're performing a physical hot swappable power supply repair because the Bare Metal Machine host will continue to function normally after the repair.
However, if the Bare Metal Machine failed hardware validation, the Bare Metal Machine `replace` is required even if the hot swappable repairs are done.
Examine the Bare Metal Machine status messages to determine if hardware validation failures or other degraded conditions are present.

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

### Bare Metal Machine replace is required

After components such as motherboard or Network Interface Card (NIC) are replaced, the Bare Metal Machine MAC address changes.
However, the iDRAC IP address and hostname remain the same.
Motherboard changes result in MAC address changes, requiring a Bare Metal Machine `replace`.

A `replace` operation **is required** to bring the Bare Metal Machine back into service when you're performing the following physical repairs:

- Backplane
- System board
- SSD disk
- PERC/RAID adapter
- Mellanox Network Interface Card (NIC)
- Broadcom embedded NIC

### Check statuses after a Bare Metal Machine replace operation

After the Bare Metal Machine `replace` operation completes successfully, ensure that the `provisioningStatus` is `Succeeded` and the `readyState` is `True`.
Only then, proceed to execute the `uncordon` operation to have the Bare Metal Machine rejoin the workload schedulable node pool.

## Request support

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).

## References

- [Bare Metal Machine Lifecycle Management Commands]
- [Run emergency bare metal actions outside of Azure using nexusctl]
- [Troubleshoot Azure Operator Nexus Server Problems]
- [Troubleshoot Bare Metal Machine Provisioning]
- [Troubleshoot Bare Metal Machine Warning Status]
- [Troubleshoot Degraded Status Errors on Bare Metal Machines]
- [Troubleshoot Hardware Validation Failure]

[Bare Metal Machine Lifecycle Management Commands]: ./howto-baremetal-functions.md
[Run emergency bare metal actions outside of Azure using nexusctl]: ./howto-baremetal-nexusctl.md
[Troubleshoot Azure Operator Nexus Server Problems]: ./troubleshoot-reboot-reimage-replace.md
[Troubleshoot Bare Metal Machine Provisioning]: ./troubleshoot-bare-metal-machine-provisioning.md
[Troubleshoot Bare Metal Machine Warning Status]: ./troubleshoot-bare-metal-machine-warning.md
[Troubleshoot Degraded Status Errors on Bare Metal Machines]: ./troubleshoot-bare-metal-machine-degraded.md
[Troubleshoot Hardware Validation Failure]: ./troubleshoot-hardware-validation-failure.md
[How to monitor interface In and Out packet rate for network fabric devices]: ./howto-monitor-interface-packet-rate.md
[How to configure diagnostic settings and monitor configuration differences in Nexus Network Fabric]: ./howto-configure-diagnostic-settings-monitor-configuration-differences.md
