---
title: "Azure Operator Nexus: Platform functions for bare metal machines"
description: Learn how to manage bare metal machines (BMM).
author: eak13
ms.author: ekarandjeff
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 04/30/2024
ms.custom: template-how-to, devx-track-azurecli
---

# Manage the lifecycle of bare metal machines

This article describes how to perform lifecycle management operations on bare metal machines (BMM). These steps should be used for troubleshooting purposes to recover from failures or when taking maintenance actions. The commands to manage the lifecycle of the BMM include:

> [!CAUTION]
> Do not perform any action against management servers without first consulting with Microsoft support personnel. Doing so could affect the integrity of the Operator Nexus Cluster.

- **Power off the BMM**
- Start the BMM
- **Restart the BMM**
- Make the BMM unschedulable (cordon without evacuate)
- **Make the BMM unschedulable (cordon with evacuate)**
- Make the BMM schedulable (uncordon)
- **Reimage the BMM**
- **Replace the BMM**

> [!IMPORTANT]
> Disruptive command requests against a Kubernetes Control Plane (KCP) node are rejected if there is another disruptive action command already running against another KCP node or if the full KCP is not available. This check is done to maintain the integrity of the Nexus instance and ensure multiple KCP nodes don't go down at once due to simultaneous disruptive actions. If multiple nodes go down, it will break the healthy quorum threshold of the Kubernetes Control Plane.
>
> The bolded actions in the above list are considered disruptive (Power off, Restart, Reimage, Replace). Cordon without evacuate is not considered disruptive. Cordon with evacuate is considered disruptive.
>
> As noted in the cautionary statement, running actions against management servers, especially KCP nodes, should only be done in consultation with Microsoft support personnel.

## Prerequisites

1. Install the latest version of the
   [appropriate CLI extensions](./howto-install-cli-extensions.md).
1. Get the name of the resource group for the BMM - Cluster managed resource group name (cluster_MRG) .
1. Get the name of the bare metal machine that requires a lifecycle management operation.
1. Ensure that the target bare metal machine `poweredState` set to `On` and `readyState` set to `True`.
   1. This prerequisite isn't applicable for the `start` command.

## Power off the BMM

This command will `power-off` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine power-off \
  --name "bareMetalMachineName"  \
  --resource-group "cluster_MRG"
```

## Start the BMM

This command will `start` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine start \
  --name "bareMetalMachineName" \
  --resource-group "cluster_MRG"
```

## Restart the BMM

This command will `restart` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine restart \
  --name "bareMetalMachineName" \
  --resource-group "cluster_MRG"
```

## Make a BMM unschedulable (cordon)

You can make a BMM unschedulable by executing the [`cordon`](#make-a-bmm-unschedulable-cordon) command.
On the execution of the `cordon` command,
Operator Nexus workloads aren't scheduled on the BMM when cordon is set; any attempt to create a workload on a `cordoned`
BMM results in the workload being set to `pending` state. Existing workloads continue to run.
The cordon command supports an `evacuate` parameter with the default `False` value.
On executing the `cordon` command, with the value `True` for the `evacuate`
parameter, the workloads that are running on the BMM are `stopped` and the BMM is set to `pending` state.

```azurecli
az networkcloud baremetalmachine cordon \
  --evacuate "True" \
  --name "bareMetalMachineName" \
  --resource-group "cluster_MRG"
```

The `evacuate "True"` removes workloads from that node while `evacuate "False"` only prevents the scheduling of new workloads.

## Make a BMM "schedulable" (uncordon)

You can make a BMM "schedulable" (usable) by executing the [`uncordon`](#make-a-bmm-schedulable-uncordon) command. All workloads in a `pending`
state on the BMM are `restarted` when the BMM is `uncordoned`.

```azurecli
az networkcloud baremetalmachine uncordon \
  --name "bareMetalMachineName" \
  --resource-group "cluster_MRG"
```

## Reimage a BMM

You can restore the runtime version on a BMM by executing the `reimage` command. This process **redeploys** the runtime image on the target BMM and executes the steps to rejoin the cluster with the same identifiers. This action doesn't affect the tenant workload files on this BMM.
As a best practice, make sure the BMM's workloads are drained using the [`cordon`](#make-a-bmm-unschedulable-cordon)
command, with `evacuate "True"`, before executing the `reimage` command.

> [!WARNING]
> Running more than one `baremetalmachine replace` or `reimage` command at the same time, or running a `replace`
> at the same time as a `reimage` will leave servers in a nonworking state. Make sure one `replace`/`reimage`
> has fully completed before starting another one.

```azurecli
az networkcloud baremetalmachine reimage \
  –-name "bareMetalMachineName"  \
  --resource-group "cluster_MRG"
```

## Replace BMM

Use the `replace` command when a server encounters hardware issues requiring a complete or partial hardware replacement. After replacement of components such as motherboard or Network Interface Card (NIC) replacement, the MAC address of BMM will change, however the iDRAC IP address and hostname will remain the same.

> [!WARNING]
> Running more than one `baremetalmachine replace` or `reimage` command at the same time, or running a `replace`
> at the same time as a `reimage` will leave servers in a nonworking state. Make sure one `replace`/`reimage`
> has fully completed before starting another one.

```azurecli
az networkcloud baremetalmachine replace \
  --name "bareMetalMachineName" \
  --resource-group "cluster_MRG" \
  --bmc-credentials password="{password}" username="{user}" \
  --bmc-mac-address "00:00:4f:00:57:ad" \
  --boot-mac-address "00:00:4e:00:58:af" \
  --machine-name "OS_hostname" \
  --serial-number "BM1219XXX"
```
