---
title: "Azure Operator Distributed Services: Platform Functions for bare metal machines"
description: Learn how to manage bare metal machines (BMM).
author: harish6724
ms.author: harishrao
ms.service: Azure Operator Distributed Services
ms.topic: how-to
ms.date: 02/01/2023
ms.custom: template-how-to
---

# Platform Functions

Commands to manage the lifecycle of the bare metal machines (BMM) include:

- power-off, start the BMM
- make the BMM unschedulable or schedulable
- reinstall the BMM image

## Before you begin

- Ensure that you've installed the [Azure CLI & appropriate extensions](howto-install-networkcloud-cli-extensions.md).
- The target bare metal machine (server) must be `powered-on` and have its `readyState` set to True
- Your Azure Resource group name that you created for `network cloud cluster resource`

## Bare metal machine (BMM) power-off and start commands

The commands are used to `power-off` and `start` a bare metal machine (BMM)

### Executing a power-off command

This command will `power-off` the specified `bareMetalMachineName`.

```azurecli
  az networkcloud baremetalmachine power-off --name "bareMetalMachineName"  \
        --resource-group "resourceGroupName"
```

### Executing a start command

This command will `start` the specified `bareMetalMachineName`.

```azurecli
 az networkcloud baremetalmachine start --name "bareMetalMachineName" \
    --resource-group "resourceGroupName"
```

## BMM lifecycle interactions

AODS supports the ability to make a BMM unschedulable, schedulable or have its image reinstalled.

You can make a BMM unschedulable by executing the [`cordon`](#make-a-bmm-unschedulable-cordon) command.
On execution of the `cordon` command,
Kubernetes won't schedule any new pods on the BMM; any attempt to create a pod on a `cordoned`
BMM will result in the pod being set to `pending` state. Existing pods will continue to run.
The cordon command supports an `evacuate` parameter with the default `false` value.
On executing the `cordon` command, with the value `true` for the `evacuate`
parameter, the pods currently running on the BMM will be `stopped` and the BMM will be set to `pending` state.

You can make a BMM `schedulable` (usable) by executing the [`uncordon`](#make-a-bmm-schedulable-uncordon) command. All pods in `pending`
state on the BMM will be `re-started` when the BMM is `uncordoned`.

The BMM image can be reinstalled using the `reimage` command.

### Make a BMM unschedulable (Cordon)

```azurecli
  az networkcloud baremetalmachine cordon \
    --evacuate "True" \
    --name "bareMetalMachineName" \
    --resource-group "resourceGroupName"
```

The `evacuate "True"` removes pods from that node while `evacuate "FALSE"` only prevents the scheduling of new pods.

### Make a BMM schedulable (Uncordon)

```azurecli
  az networkcloud baremetalmachine uncordon \
    --name "bareMetalMachineName" \
    --resource-group "resourceGroupName"
```

### Reimage a BMM (reinstall a BMM image)

Ensure that the workloads are drained from the BMM, using the [`cordon`](#make-a-bmm-unschedulable-cordon)
command, with `evacuate "TRUE"`, prior to executing the `reimage` command.

```azurecli
az networkcloud baremetalmachine reimage –-name "bareMetalMachineName"  \
  --resource-group "resourceGroupName"
```

You should [uncordon](#make-a-bmm-schedulable-uncordon) the BMM on completion of the reimage command.

_Note: The reimage operation won't replace the image with a different image ... it will take the current existing image and reinstall it._
