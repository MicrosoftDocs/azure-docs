---
title: Restart policy for run-once tasks 
description: Learn how to use Azure Container Instances to execute tasks that run to completion, such as in build, test, or image rendering jobs.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: container-instances
ms.custom: devx-track-linux
services: container-instances
ms.date: 06/17/2022
---

# Run containerized tasks with restart policies

The ease and speed of deploying containers in Azure Container Instances provides a compelling platform for executing run-once tasks like build, test, and image rendering in a container instance.

With a configurable restart policy, you can specify that your containers are stopped when their processes have completed. Because container instances are billed by the second, you're charged only for the compute resources used while the container executing your task is running.

The examples presented in this article use the Azure CLI. You must have Azure CLI version 2.0.21 or greater [installed locally][azure-cli-install], or use the CLI in the [Azure Cloud Shell](../cloud-shell/overview.md).

## Container restart policy

When you create a [container group](container-instances-container-groups.md) in Azure Container Instances, you can specify one of three restart policy settings.

| Restart policy   | Description |
| ---------------- | :---------- |
| `Always` | Containers in the container group are always restarted. This is the **default** setting applied when no restart policy is specified at container creation. |
| `Never` | Containers in the container group are never restarted. The containers run at most once. |
| `OnFailure` | Containers in the container group are restarted only when the process executed in the container fails (when it terminates with a nonzero exit code). The containers are run at least once. |

[!INCLUDE [container-instances-restart-ip](../../includes/container-instances-restart-ip.md)]

## Specify a restart policy

How you specify a restart policy depends on how you create your container instances, such as with the Azure CLI, Azure PowerShell cmdlets, or in the Azure portal. In the Azure CLI, specify the `--restart-policy` parameter when you call [az container create][az-container-create].

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer \
    --image mycontainerimage \
    --restart-policy OnFailure
```

## Run to completion example

To see the restart policy in action, create a container instance from the Microsoft [aci-wordcount][aci-wordcount-image] image, and specify the `OnFailure` restart policy. This example container runs a Python script that, by default, analyzes the text of Shakespeare's [Hamlet](http://shakespeare.mit.edu/hamlet/full.html), writes the 10 most common words to STDOUT, and then exits.

Run the example container with the following [az container create][az-container-create] command:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer \
    --image mcr.microsoft.com/azuredocs/aci-wordcount:latest \
    --restart-policy OnFailure
```

Azure Container Instances starts the container, and then stops it when its application (or script, in this case) exits. When Azure Container Instances stops a container whose restart policy is `Never` or `OnFailure`, the container's status is set to **Terminated**. You can check a container's status with the [az container show][az-container-show] command:

```azurecli-interactive
az container show \
    --resource-group myResourceGroup \
    --name mycontainer \
    --query containers[0].instanceView.currentState.state
```

Example output:

```output
"Terminated"
```

Once the example container's status shows *Terminated*, you can see its task output by viewing the container logs. Run the [az container logs][az-container-logs] command to view the script's output:

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer
```

Output:

```output
[('the', 990),
 ('and', 702),
 ('of', 628),
 ('to', 610),
 ('I', 544),
 ('you', 495),
 ('a', 453),
 ('my', 441),
 ('in', 399),
 ('HAMLET', 386)]
```

This example shows the output that the script sent to STDOUT. Your containerized tasks, however, might instead write their output to persistent storage for later retrieval. For example, to an [Azure file share](./container-instances-volume-azure-files.md).

## Next steps

Task-based scenarios, such as batch processing a large dataset with several containers, can take advantage of custom [environment variables](container-instances-environment-variables.md) or [command lines](container-instances-start-command.md) at runtime.

For details on how to persist the output of your containers that run to completion, see [Mounting an Azure file share with Azure Container Instances](./container-instances-volume-azure-files.md).

<!-- LINKS - External -->
[aci-wordcount-image]: https://hub.docker.com/_/microsoft-azuredocs-aci-wordcount

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container#az_container_create
[az-container-logs]: /cli/azure/container#az_container_logs
[az-container-show]: /cli/azure/container#az_container_show
[azure-cli-install]: /cli/azure/install-azure-cli
