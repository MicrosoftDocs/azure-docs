---
title: Azure CLI Samples
description: Learn about Azure CLI scripts. With these samples, you can create a virtual machine and then start, stop, and delete it in Azure Lab Services.
ms.topic: sample
ms.date: 06/26/2020
---

# Azure CLI Samples for Azure Lab Services

This article includes sample bash scripts built for Azure CLI for Azure Lab Services.

[!INCLUDE [sample-cli-install](../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

| Script | Description |
|---|---|
| [Create and verify a virtual machine](#create-and-verify-availability-of-a-virtual-machine) | Creates a Windows virtual machine with minimal configuration. |
| [Start a virtual machine](#start-a-virtual-machine) | Starts a virtual machine. |
| [Stop and delete a virtual machine](#stop-and-delete-a-virtual-machine) | Stops and deletes a virtual machine. |

## Prerequisites

All of these scripts have the following prerequisite:

- **A lab**. The script requires you to have an existing lab.

## Create and verify availability of a virtual machine

This Azure CLI script creates a virtual machine in a lab.
The virtual machine created based on a marketplace image with ssh authentication.
The script then verifies that the virtual machine is available for use.

:::code language="powershell" source="../../cli_scripts/devtest-lab/create-verify-virtual-machine-in-lab/create-verify-virtual-machine-in-lab.sh":::

> [!NOTE] You can run the following command to remove the resource group, virtual machine, and all related resources:
>
> ```azurecli
> az group delete --name myResourceGroup
> ```

This script uses the following commands:

| Command | Notes |
|---|---|
| [az group create](/cli/azure/group#az_group_create) | Creates a resource group in which all resources are stored. |
| [az lab vm create](/cli/azure/lab/vm#az_lab_vm_create) | Creates a virtual machine in a lab. |
| [az lab vm show](/cli/azure/lab/vm#az_lab_vm_show) | Displays the status of the virtual machine in a lab. |

## Start a virtual machine

This Azure CLI script starts a virtual machine in a lab.

:::code language="powershell" source="../../cli_scripts/devtest-lab/start-connect-virtual-machine-in-lab/start-connect-virtual-machine-in-lab.sh":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [az lab vm start](/cli/azure/lab/vm#az_lab_vm_start) | Starts a virtual machine in a lab. This operation can take a while to complete. |

## Stop and delete a virtual machine

This Azure CLI script stops and deletes a virtual machine in a lab.

:::code language="powershell" source="../../cli_scripts/devtest-lab/stop-delete-virtual-machine-in-lab/stop-delete-virtual-machine-in-lab.sh":::

This script uses the following commands:

| Command | Notes |
|---|---|
| [az lab vm stop](/cli/azure/lab/vm#az_lab_vm_stop) | Stops a virtual machine in a lab. This operation can take a while to complete. |
| [az lab vm delete](/cli/azure/lab/vm#az_lab_vm_delete) | Deletes a virtual machine in a lab. This operation can take a while to complete. |

## Clean up deployment

Run the following command to remove the resource group, virtual machine, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](/cli/azure).
