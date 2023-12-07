---
title: Azure CLI Samples
description: Learn about Azure CLI scripts. With these samples, you can create a virtual machine and then start, stop, and delete it in Azure DevTest Labs.
ms.topic: sample
ms.custom: devx-track-azurecli, UpdateFrequency2
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
---

# Azure CLI Samples for Azure DevTest Labs

This article includes sample bash scripts built for Azure CLI for Azure DevTest Labs.

| Script | Description |
|---|---|
| [Create and verify a virtual machine (VM)](#create-and-verify-availability-of-a-vm) | Creates a Windows VM with minimal configuration. |
| [Start a VM](#start-a-vm) | Starts a VM. |
| [Stop and delete a VM](#stop-and-delete-a-vm) | Stops and deletes a VM. |

## Prerequisites

[!INCLUDE [sample-cli-install](../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

All of these scripts have the following prerequisite:

- **A lab**. The script requires you to have an existing lab.

## Create and verify availability of a VM

This Azure CLI script creates a virtual machine in a lab.
The VM created based on a marketplace image with SSH authentication.
The script then verifies that the VM is available for use.

:::code language="powershell" source="../../cli_scripts/devtest-lab/create-verify-virtual-machine-in-lab/create-verify-virtual-machine-in-lab.sh":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az lab vm create](/cli/azure/lab/vm#az-lab-vm-create) | Creates a VM in a lab. |
| [az lab vm show](/cli/azure/lab/vm#az-lab-vm-show) | Displays the status of the VM in a lab. |

## Start a VM

This Azure CLI script starts a virtual machine in a lab.

:::code language="powershell" source="../../cli_scripts/devtest-lab/start-connect-virtual-machine-in-lab/start-connect-virtual-machine-in-lab.sh":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [az lab vm start](/cli/azure/lab/vm#az-lab-vm-start) | Starts a VM in a lab. This operation can take a while to complete. |

## Stop and delete a VM

This Azure CLI script stops and deletes a virtual machine in a lab.

> [!CAUTION]
> Deleting VMs and labs is permanent, and cannot be undone.

:::code language="powershell" source="../../cli_scripts/devtest-lab/stop-delete-virtual-machine-in-lab/stop-delete-virtual-machine-in-lab.sh":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [az lab vm stop](/cli/azure/lab/vm#az-lab-vm-stop) | Stops a VM in a lab. This operation can take a while to complete. |
| [az lab vm delete](/cli/azure/lab/vm#az-lab-vm-delete) | Deletes a VM in a lab. This operation can take a while to complete. |

## Clean up deployment

Run the following command to remove the resource group, VM, and all related resources.

> [!CAUTION]
> Deleting the resource group for the lab is permanent, and cannot be undone. This will remove ALL resources under the group and can not be restored.

```azurecli
az group delete --name $resourceGroupName
```
