---
title: "Azure Operator Nexus: Platform Functions for Bare Metal Machines"
description: Learn how to manage Bare Metal Machines (BMM).
author: harish6724
ms.author: harishrao
ms.service: azure 
ms.topic: how-to
ms.date: 03/06/2023
ms.custom: template-how-to
---

# Manage lifecycle of Bare Metal Machines

This article describes how to perform lifecycle management operations on Bare Metal Machines (BMM). These steps should be used for troubleshooting purposes to recover from failures or when taking maintenance actions. The commands to manage the lifecycle of the BMM include:

- Power off the BMM
- Start the BMM
- Make the BMM unschedulable or schedulable
- Reinstall the BMM image
- Replace BMM

## Prerequisites

1. Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
1. Ensure that the target bare metal machine (server) must have its `poweredState` set to `On` and have its `readyState` set to `True`
1. Get the Resource group name that you created for `Cluster` resource

## Power off the BMM

This command will `power-off` the specified `bareMetalMachineName`.

```azurecli
  az networkcloud baremetalmachine power-off --name "bareMetalMachineName"  \
        --resource-group "resourceGroupName"
```

## Start the BMM

This command will `start` the specified `bareMetalMachineName`.

```azurecli
 az networkcloud baremetalmachine start --name "bareMetalMachineName" \
    --resource-group "resourceGroupName"
```

## Make a BMM unschedulable (cordon)

You can make a BMM unschedulable by executing the [`cordon`](#make-a-bmm-unschedulable-cordon) command.
On the execution of the `cordon` command,
Operator Nexus workloads are not scheduled on the BMM when cordon is set; any attempt to create a workload on a `cordoned`
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

## Reimage a BMM (reinstall a BMM image)

An existing BMM image is **reinstalled** using the `reimage` command. This command doesn't install a new image.
Make sure the BMM's workloads are drained using the [`cordon`](#make-a-bmm-unschedulable-cordon)
command, with `evacuate "True"`, prior to executing the `reimage` command.

```azurecli
az networkcloud baremetalmachine reimage –-name "bareMetalMachineName"  \
  --resource-group "resourceGroupName"
```

The reimage command restarts the BMM and uncordons it. The re-imaged BMM will have an IP address.You can start deploying workloads on the reimaged BMM.

## Replace BMM

Use `Replace BMM` command whenever a BareMetal machine has encountered hardware issues requiring a complete or partial hardware replacement. After replace the MAC address of Baremetal Host will change, however the IDrac IP address and hostname will remain the same.

```azurecli
az networkcloud baremetalmachine replace --name "bareMetalMachineName" \
    --bmc-credentials password="{password}" username="bmcuser" --bmc-mac-address "00:00:4f:00:57:ad" \
    --boot-mac-address "00:00:4e:00:58:af" --machine-name "name" --serial-number "BM1219XXX" \
    --resource-group "resourceGroupName" 
```
