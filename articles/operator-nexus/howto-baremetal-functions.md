---
title: "Azure Operator Nexus: Platform Functions for Bare Metal Machines"
description: Learn how to manage Bare Metal Machines (BMM).
author: harish6724
ms.author: harishrao
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 05/26/2023
ms.custom: template-how-to, devx-track-azurecli
---

# Manage lifecycle of Bare Metal Machines

This article describes how to perform lifecycle management operations on Bare Metal Machines (BMM). These steps should be used for troubleshooting purposes to recover from failures or when taking maintenance actions. The commands to manage the lifecycle of the BMM include:

- Power off the BMM
- Start the BMM
- Restart the BMM
- Make the BMM unschedulable or schedulable
- Reimage the BMM
- Replace the BMM

## Prerequisites

1. Install the latest version of the
   [appropriate CLI extensions](./howto-install-cli-extensions.md)
1. Get the name of the resource group for the BMM
1. Get the name of the bare metal machine that requires a lifecycle management operation
1. Ensure that the target bare metal machine `poweredState` set to `On` and `readyState` set to `True`
   1. This prerequisite is not applicable for the `start` command

> [!CAUTION]
> Actions against management servers should not be run without consultation with Microsoft support personnel. Doing so could affect the integrity of the Operator Nexus Cluster.

## Power off the BMM

This command will `power-off` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine power-off \
  --name "bareMetalMachineName"  \
  --resource-group "resourceGroupName"
```

## Start the BMM

This command will `start` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine start \
  --name "bareMetalMachineName" \
  --resource-group "resourceGroupName"
```

## Restart the BMM

This command will `restart` the specified `bareMetalMachineName`.

```azurecli
az networkcloud baremetalmachine restart \
  --name "bareMetalMachineName" \
  --resource-group "resourceGroupName"
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
  --resource-group "resourceGroupName"
```

The `evacuate "True"` removes workloads from that node while `evacuate "False"` only prevents the scheduling of new workloads.

## Make a BMM schedulable (uncordon)

You can make a BMM `schedulable` (usable) by executing the [`uncordon`](#make-a-bmm-schedulable-uncordon) command. All workloads in a `pending`
state on the BMM are `restarted` when the BMM is `uncordoned`.

```azurecli
az networkcloud baremetalmachine uncordon \
  --name "bareMetalMachineName" \
  --resource-group "resourceGroupName"
```

## Reimage a BMM

You can restore the runtime version on a BMM by executing `reimage` command. This process **redeploys** the runtime image on the target BMM and executes the steps to rejoin the cluster with the same identifiers. This action doesn't impact the tenant workload files on this BMM.
As a best practice, make sure the BMM's workloads are drained using the [`cordon`](#make-a-bmm-unschedulable-cordon)
command, with `evacuate "True"`, prior to executing the `reimage` command.

> [!Warning]
> Running more than one baremetalmachine replace or reimage command at the same time, or running a replace
> at the same time as a reimage, will leave servers in a nonworking state. Make sure one replace / reimage
> has fully completed before starting another one. In a future release, we plan to either add the ability
> to replace multiple servers at once or have the command return an error when attempting to do so.

```azurecli
az networkcloud baremetalmachine reimage \
  –-name "bareMetalMachineName"  \
  --resource-group "resourceGroupName"
```

## Replace BMM

Use `Replace BMM` command when a server has encountered hardware issues requiring a complete or partial hardware replacement. After replacement of components such as motherboard or NIC replacement, the MAC address of BMM will change, however the IDrac IP address and hostname will remain the same.

> [!Warning]
> Running more than one baremetalmachine replace or reimage command at the same time, or running a replace
> at the same time as a reimage, will leave servers in a nonworking state. Make sure one replace / reimage
> has fully completed before starting another one. In a future release, we plan to either add the ability
> to replace multiple servers at once or have the command return an error when attempting to do so.

```azurecli
az networkcloud baremetalmachine replace \
  --name "bareMetalMachineName" \
  --resource-group "resourceGroupName" \
  --bmc-credentials password="{password}" username="{user}" \
  --bmc-mac-address "00:00:4f:00:57:ad" \
  --boot-mac-address "00:00:4e:00:58:af" \
  --machine-name "name" \
  --serial-number "BM1219XXX"
```
