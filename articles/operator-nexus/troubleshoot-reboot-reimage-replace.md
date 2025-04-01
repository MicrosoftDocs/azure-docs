---
title: Troubleshoot Azure Operator Nexus server problems
description: Troubleshoot cluster bare metal machines with Restart, Reimage, Replace for Azure Operator Nexus.
ms.service: azure-operator-nexus
ms.custom: troubleshooting
ms.topic: troubleshooting
ms.date: 04/24/2024
author: eak13
ms.author: ekarandjeff
---

# Troubleshoot Bare Metal Machine Server Problems

This article describes how to troubleshoot server problems by using `restart`, `reimage`, and `replace` actions on Azure Operator Nexus BareMetal Machines (BMM).
These operations are performed for maintenance on your servers and cause a disruption to the specific BMM.

[!INCLUDE [caution-affect-cluster-integrity](./includes/baremetal-machines/caution-affect-cluster-integrity.md)]

[!INCLUDE [important-donot-disrupt-kcpnodes](./includes/baremetal-machines/important-donot-disrupt-kcpnodes.md)]

[!INCLUDE [prerequisites-azcli-bmm-actions](./includes/baremetal-machines/prerequisites-azcli-bmm-actions.md)]

## Follow Best Practice for BMM Operations

The various operations `restart`, `reimage`, and `replace` are effective troubleshooting methods that you can use to address technical problems.
However, it's important to have a systematic approach and to consider other factors before you try any drastic measures.

First, familiarize yourself with the operations by reading and following the advice on the recommended articles before proceeding with operations:

- [Best Practices for BareMetal Machine Operations](./howto-baremetal-best-practices.md).
- [BMM Lifecycle Management Operations](howto-baremetal-functions.md).

## Troubleshoot with a Restart Operation

A `restart` operation can be useful in troubleshooting problems where tenant virtual machines on the host aren't responsive or are otherwise stuck.

One way approach this operation can be done by executing, in order, both a `power-off` followed by `start` operation.
This approach will `restart` a BMM command by performing a graceful shutdown that power cycles the node.

The following Azure CLI command will `power-off` the specified bareMetalMachineName.

```azurecli
az networkcloud baremetalmachine power-off \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

The following Azure CLI command will `start` the specified bareMetalMachineName.

```azurecli
az networkcloud baremetalmachine start \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

Alternatively, you can let the `restart` command perform a server reboot.

The following Azure CLI command will `restart` the specified bareMetalMachineName.

```azurecli
az networkcloud baremetalmachine restart \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

## Troubleshoot with a Reimage Operation

The `reimage` command on a BMM is a process that **redeploys** the OS image on disk without affecting the tenant data.
This operation executes the steps to rejoin the cluster with the same identifiers.

The `reimage` operation can be useful for troubleshooting problems by restoring the OS to a known-good working state.
Common causes that can be resolved through reimaging include recovery due to doubt of host integrity, suspected or confirmed security compromise, or "break glass" write activity.

A `reimage` operation is the best practice for lowest operational risk to ensure the BMM's integrity.

As a best practice, before executing the `reimage` command make sure the BMM's workloads are drained using the cordon command with `evacuate` parameter set to `True`.

[!INCLUDE [warning-donot-run-multiple-actions](./includes/baremetal-machines/warning-donot-run-multiple-actions.md)]

To identify if any workloads are currently running on a BMM, run the following command:

For Virtual Machines:

```azurecli
az networkcloud baremetalmachine show -n <nodeName> /
  --resource-group <resourceGroup> /
  --subscription <subscriptionID> | jq '.virtualMachinesAssociatedIds'
```

For Nexus Kubernetes cluster nodes: (Requires logging into the Nexus Kubernetes cluster)

```shell
kubectl get nodes <resourceName> -ojson | jq '.metadata.labels."topology.kubernetes.io/baremetalmachine"'
```

The following Azure CLI command will `cordon` the specified bareMetalMachineName.

```azurecli
az networkcloud baremetalmachine cordon \
  --evacuate "True" \
  --name <bareMetalMachineName> \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

The following Azure CLI command will `reimage` the specified bareMetalMachineName.

```azurecli
az networkcloud baremetalmachine reimage \
  --name <bareMetalMachineName>  \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

The following Azure CLI command will `uncordon` the specified bareMetalMachineName.

```azurecli
az networkcloud baremetalmachine uncordon \
  --name <bareMetalMachineName> \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

## Troubleshoot with a Replace Operation

Servers contain many physical components that fail over time. It's important to understand which physical repairs require to perform a BMM `replace`.
Like the `reimage` action, the tenant data isn't modified during a `replace`.

> [!IMPORTANT]
> With the `2024-07-01` GA API version, the RAID controller is reset during BMM replace, wiping all data from the server's virtual disks.
> Baseboard Management Controller (BMC) virtual disk alerts triggered during BMM replace can be ignored unless there are more physical disk and/or RAID controllers alerts.

### Resolve Hardware Validation Issues

A hardware validation process is invoked, as part of the `replace`, to ensure the integrity of the physical host in advance of deploying the OS image.
As a best practice, first issue a `cordon` command to remove the BMM from workload scheduling and then shutdown/`power-off` the BMM in advance of physical repairs.

[!INCLUDE [warning-donot-run-multiple-actions](./includes/baremetal-machines/warning-donot-run-multiple-actions.md)]

The following Azure CLI command will `cordon` the specified bareMetalMachineName.

```azurecli
az networkcloud baremetalmachine cordon \
  --evacuate "True" \
  --name <bareMetalMachineName> \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

A `replace` operation isn't required when you're performing a physical hot swappable power supply repair because the BMM host will continue to function normally after the repair.

Although it isn't strictly necessary to bring the BMM back into service, we recommend doing a `replace` operation when you're performing the following physical repairs:

- CPU
- Dual In-Line Memory Module (DIMM)
- Fan
- Expansion board riser
- Transceiver
- Ethernet or fiber cable replacement

A `replace` operation ***is required*** to bring the BMM back into service when you're performing the following physical repairs:

- Backplane
- System board
- SSD disk
- PERC/RAID adapter
- Mellanox Network Interface Card (NIC)
- Broadcom embedded NIC

After physical repairs are completed, perform a `replace` operation.

The following Azure CLI command will `replace` the specified bareMetalMachineName.

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

Once the BMM `replace` operation completes successfully, validate that the BMM's `provisioningStatus` is `Succeeded` and its `readyState` is set to `True`.
Then, proceed to execute the `uncordon` operation to have the BMM rejoin the workload schedulable node pool.

The following Azure CLI command will `uncordon` the specified bareMetalMachineName.

```azurecli
az networkcloud baremetalmachine uncordon \
  --name <bareMetalMachineName> \
  --resource-group "<resourceGroup>" \
  --subscription <subscriptionID>
```

## Request Support

If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
