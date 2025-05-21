---
title: Troubleshoot Azure Operator Nexus server problems
description: Troubleshoot cluster bare metal machines with Restart, Reimage, Replace for Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 04/03/2025
author: eak13
ms.author: ekarandjeff
---

# Troubleshoot Azure Operator Nexus Bare Metal Machine server problems

This article describes how to troubleshoot server problems by using Restart, Reimage, and Replace actions on Azure Operator Nexus Bare Metal Machines (BMMs). You might need to take these actions on your server for maintenance reasons, which may cause a brief disruption to specific BMMs.

The time required to complete each of these actions is similar. Restarting is the fastest, whereas replacing takes slightly longer. All three actions are simple and efficient methods for troubleshooting.

> [!CAUTION]
> Do not perform any action against management servers without first consulting with Microsoft support personnel. Doing so could affect the integrity of the Operator Nexus Cluster.

## Prerequisites

- Familiarize yourself with the capabilities referenced in this article by reviewing the [BMM actions](howto-baremetal-functions.md).
- Gather the following information:
  - Name of the managed resource group for the BMM
  - Name of the BMM that requires a lifecycle management operation
  - Subscription ID

> [!IMPORTANT]
> Disruptive command requests against a Kubernetes Control Plane (KCP) node are rejected if there is another disruptive action command already running against another KCP node or if the full KCP is not available.
>
> Restart, reimage and replace are all considered disruptive actions.
>
> This check is done to maintain the integrity of the Nexus instance and ensure multiple KCP nodes do not go down at once due to simultaneous disruptive actions. If multiple nodes go down, it will break the healthy quorum threshold of the Kubernetes Control Plane.

## Identify the corrective action

When troubleshooting a BMM for failures and determining the most appropriate corrective action, it is essential to understand the available options. This article provides a systematic approach to troubleshoot Azure Operator Nexus server problems using these three methods:

- **Restart** - Least invasive method, best for temporary glitches or unresponsive VMs
- **Reimage** - Intermediate solution, restores OS to known-good state without affecting data
- **Replace** - Most significant action, required for hardware component failures

### Troubleshooting decision tree

Follow this escalation path when troubleshooting BMM issues:

| Problem | First action | If problem persists | If still unresolved |
|---------|-------------|-------------------|-------------------|
| Unresponsive VMs or services | Restart | Reimage | Replace |
| Software/OS corruption | Reimage | Replace | Contact support |
| Known hardware failure | Replace | N/A | Contact support |
| Security compromise | Reimage | Replace | Contact support |

It's recommended to start with the least invasive solution (restart) and escalate to more complex measures only if necessary. Always validate that the issue is resolved after each corrective action.

## Troubleshoot with a restart action

Restarting a BMM is a process of restarting the server through a simple API call. This action can be useful for troubleshooting problems when Tenant Virtual Machines on the host aren't responsive or are otherwise stuck.

The restart typically is the starting point for mitigating a problem.

### Restart workflow

1. **Assess impact** - Determine if restarting the BMM will impact critical workloads.
2. **Power off** - If needed, power off the BMM (optional).
3. **Start or restart** - Either start a powered-off BMM or restart a running BMM.
4. **Verify status** - Check if the BMM is back online and functioning properly.

> [!NOTE]
> The restart operation is the fastest recovery method but may not resolve issues related to OS corruption or hardware failures.

**The following Azure CLI command will `power-off` the specified bareMetalMachineName:**

```azurecli
az networkcloud baremetalmachine power-off \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

**The following Azure CLI command will `start` the specified bareMetalMachineName:**

```azurecli
az networkcloud baremetalmachine start \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

**The following Azure CLI command will `restart` the specified bareMetalMachineName:**

```azurecli
az networkcloud baremetalmachine restart \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

**To verify the BMM status after restart:**

```azurecli
az networkcloud baremetalmachine show \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID> \
  --query "provisioningState"
```

## Troubleshoot with a reimage action

Reimaging a BMM is a process that you use to redeploy the image on the OS disk, without affecting the tenant data. This action executes the steps to rejoin the cluster with the same identifiers.

The reimage action can be useful for troubleshooting problems by restoring the OS to a known-good working state. Common causes that can be resolved through reimaging include recovery due to doubt of host integrity, suspected or confirmed security compromise, or "break glass" write activity.

A reimage action is the best practice for lowest operational risk to ensure the integrity of the BMM.

### Reimage workflow

1. **Verify running workloads** - Before reimaging, check what workloads are running on the BMM.
2. **Cordon and evacuate workloads** - Drain the BMM of workloads.
3. **Perform reimage** - Execute the reimage operation.
4. **Uncordon** - Make the BMM schedulable again after reimage completes.

> [!WARNING]
> Running more than one `baremetalmachine replace` or `reimage` command at the same time, or running a `replace`
> at the same time as a `reimage` will leave servers in a nonworking state. Make sure one operation has fully completed before starting another.

**To identify if any workloads are currently running on a BMM, run the following command:**

**For Virtual Machines:**

```azurecli
az networkcloud baremetalmachine show -n <nodeName> \
--resource-group <resourceGroup> \
--subscription <subscriptionID> | jq '.virtualMachinesAssociatedIds'
```

**For Nexus Kubernetes cluster nodes: (requires logging into the Nexus Kubernetes cluster)**

```
kubectl get nodes <resourceName> -ojson |jq '.metadata.labels."topology.kubernetes.io/baremetalmachine"'
```

**The following Azure CLI command will `cordon` the specified bareMetalMachineName.**

```azurecli
az networkcloud baremetalmachine cordon \
  --evacuate "True" \
  --name <bareMetalMachineName> \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

**The following Azure CLI command will `reimage` the specified bareMetalMachineName.**

```azurecli
az networkcloud baremetalmachine reimage \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

**The following Azure CLI command will `uncordon` the specified bareMetalMachineName.**

```azurecli
az networkcloud baremetalmachine uncordon \
  --name <bareMetalMachineName> \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

## Troubleshoot with a replace action

Servers contain many physical components that can fail over time. It is important to understand which physical repairs require BMM replacement and when BMM replacement is recommended.

A hardware validation process is invoked to ensure the integrity of the physical host in advance of deploying the OS image. Like the reimage action, the Tenant data isn't modified during replacement.

> [!IMPORTANT]
> Starting with the 2024-07-01 GA API version, the RAID controller is reset during BMM replace, wiping all data from the server's virtual disks. Baseboard Management Controller (BMC) virtual disk alerts triggered during BMM replace can be ignored unless there are additional physical disk and/or RAID controllers alerts.

### Replace workflow

1. **Cordon and evacuate** - Remove workloads from the BMM before physical repair.
2. **Perform physical repairs** - Replace hardware components as needed.
3. **Execute replace command** - Run the replace command with required parameters.
4. **Uncordon** - Make the BMM schedulable again after replacement completes.
5. **Verify status** - Check that the BMM is properly functioning.

**The following Azure CLI command will `cordon` the specified bareMetalMachineName.**

```azurecli
az networkcloud baremetalmachine cordon \
  --evacuate "True" \
  --name <bareMetalMachineName> \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

### Hardware component replacement guide

When you're performing a physical hot swappable power supply repair, a replace action is not required because the BMM host will continue to function normally after the repair.

When you're performing the following physical repairs, we recommend a replace action, though it is not necessary to bring the BMM back into service:

- CPU
- Dual In-Line Memory Module (DIMM)
- Fan
- Expansion board riser
- Transceiver
- Ethernet or fiber cable replacement

When you're performing the following physical repairs, a replace action ***is required*** to bring the BMM back into service:

- Backplane
- System board
- SSD disk
- PERC/RAID adapter
- Mellanox Network Interface Card (NIC)
- Broadcom embedded NIC

After physical repairs are completed, perform a replace action.
  
**The following Azure CLI command will `replace` the specified bareMetalMachineName.**

```azurecli
az networkcloud baremetalmachine replace \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --bmc-credentials password=<IDRAC_PASSWORD> username=<IDRAC_USER> \
  --bmc-mac-address <IDRAC_MAC> \
  --boot-mac-address <PXE_MAC> \
  --machine-name <OS_HOSTNAME> \
  --serial-number <SERIAL_NUM> \
  --subscription <subscriptionID>
```

**The following Azure CLI command will uncordon the specified bareMetalMachineName.**

```azurecli
az networkcloud baremetalmachine uncordon \
  --name <bareMetalMachineName> \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

## Summary

Restarting, reimaging, and replacing are effective troubleshooting methods for addressing Azure Operator Nexus server problems. Here's a quick reference guide:

| Action | When to use | Impact | Requirements |
|--------|------------|--------|-------------|
| **Restart** | Temporary glitches, unresponsive VMs | Brief downtime | None, fastest option |
| **Reimage** | OS corruption, security concerns | Longer downtime, preserves data | Workload evacuation recommended |
| **Replace** | Hardware component failures | Longest downtime, preserves data | Hardware component replacement, specific parameters needed |

### Best practices

- **Always follow the escalation path**: Start with restart, then reimage, then replace unless the issue clearly indicates otherwise.
- **Verify workloads before action**: Use the provided commands to identify running workloads before any disruptive action.
- **Cordon with evacuation**: When performing reimage or replace actions, always use `cordon` with `evacuate="True"` to safely move workloads.
- **Never run multiple operations simultaneously**: Ensure one operation completes before starting another to prevent server issues.
- **Verify resolution**: After performing any action, verify the BMM status and that the original issue is resolved.

More details about the BMM actions can be found in the [BMM actions](howto-baremetal-functions.md) article.

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
