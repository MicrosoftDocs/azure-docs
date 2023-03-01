---
title: "Azure Operator Nexus: Platform Functions for Bare Metal Machines"
description: Learn how to manage Bare Metal Machines (BMM).
author: harish6724
ms.author: harishrao
ms.service: azure 
ms.topic: how-to
ms.date: 02/01/2023
ms.custom: template-how-to
---

# Manage lifecycle of Bare Metal Machines

This article describes how to perform lifecycle management operations on Bare Metal Machines (BMM). The commands to manage the lifecycle of the BMM include:

- power-off
- start the BMM
- make the BMM unschedulable or schedulable
- reinstall the BMM image

When you want to reinstall or  update the image, or replace the BMM, make the BMM unschedulable.  In these cases, you need to evacuate existing workloads. You may have a need for no new workloads to be scheduled on a BMM, in which case make it unschedulable but without evacuating the workloads.

Make your BMM schedulable for it to be used.

## Prerequisites

1. Install the latest version of the
  [appropriate CLI extensions](./howto-install-cli-extensions.md)
1. Ensure that the target bare metal machine (server) must be `powered-on` and have its `readyState` set to True
1. Get the Resource group name that you created for `network cloud cluster resource`

## Power-off bare metal machines

This command will `power-off` the specified `bareMetalMachineName`.

```azurecli
  az networkcloud baremetalmachine power-off --name "bareMetalMachineName"  \
        --resource-group "resourceGroupName"
```

## Start bare metal machine

This command will `start` the specified `bareMetalMachineName`.

```azurecli
 az networkcloud baremetalmachine start --name "bareMetalMachineName" \
    --resource-group "resourceGroupName"
```

## Make a BMM unschedulable (cordon)

You can make a BMM unschedulable by executing the [`cordon`](#make-a-bmm-unschedulable-cordon) command.
On execution of the `cordon` command,
Kubernetes won't schedule any new pods on the BMM; any attempt to create a pod on a `cordoned`
BMM results in the pod being set to `pending` state. Existing pods continue to run.
The cordon command supports an `evacuate` parameter with the default `false` value.
On executing the `cordon` command, with the value `true` for the `evacuate`
parameter, the pods currently running on the BMM will be `stopped` and the BMM will be set to `pending` state.

```azurecli
  az networkcloud baremetalmachine cordon \
    --evacuate "True" \
    --name "bareMetalMachineName" \
    --resource-group "resourceGroupName"
```

The `evacuate "True"` removes pods from that node while `evacuate "FALSE"` only prevents the scheduling of new pods.

## Make a BMM schedulable (uncordon)

You can make a BMM `schedulable` (usable) by executing the [`uncordon`](#make-a-bmm-schedulable-uncordon) command. All pods in `pending`
state on the BMM will be `re-started` when the BMM is `uncordoned`.

```azurecli
  az networkcloud baremetalmachine uncordon \
    --name "bareMetalMachineName" \
    --resource-group "resourceGroupName"
```

## Reimage a BMM (reinstall a BMM image)

The existing BMM image can be **reinstalled** using the `reimage` command but won't install a new image.
Make sure the BMM's workloads are drained using the [`cordon`](#make-a-bmm-unschedulable-cordon)
command, with `evacuate "TRUE"`, prior to executing the `reimage` command.

```azurecli
az networkcloud baremetalmachine reimage –-name "bareMetalMachineName"  \
  --resource-group "resourceGroupName"
```

You should [uncordon](#make-a-bmm-schedulable-uncordon) the BMM on completion of the `reimage` command.
