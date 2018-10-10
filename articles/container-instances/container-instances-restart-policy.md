---
title: Run containerized tasks in Azure Container Instances with restart policies
description: Learn how to use Azure Container Instances to execute tasks that run to completion, such as in build, test, or image rendering jobs.
services: container-instances
author: dlepow

ms.service: container-instances
ms.topic: article
ms.date: 07/26/2018
ms.author: danlep
---

# Run containerized tasks with restart policies

The ease and speed of deploying containers in Azure Container Instances provides a compelling platform for executing run-once tasks like build, test, and image rendering in a container instance.

With a configurable restart policy, you can specify that your containers are stopped when their processes have completed. Because container instances are billed by the second, you're charged only for the compute resources used while the container executing your task is running.

The examples presented in this article use the Azure CLI. You must have Azure CLI version 2.0.21 or greater [installed locally][azure-cli-install], or use the CLI in the [Azure Cloud Shell](../cloud-shell/overview.md).

## Container restart policy

When you create a container in Azure Container Instances, you can specify one of three restart policy settings.

| Restart policy   | Description |
| ---------------- | :---------- |
| `Always` | Containers in the container group are always restarted. This is the **default** setting applied when no restart policy is specified at container creation. |
| `Never` | Containers in the container group are never restarted. The containers run at most once. |
| `OnFailure` | Containers in the container group are restarted only when the process executed in the container fails (when it terminates with a nonzero exit code). The containers are run at least once. |

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

To see the restart policy in action, create a container instance from the [microsoft/aci-wordcount][aci-wordcount-image] image, and specify the `OnFailure` restart policy. This example container runs a Python script that, by default, analyzes the text of Shakespeare's [Hamlet](http://shakespeare.mit.edu/hamlet/full.html), writes the 10 most common words to STDOUT, and then exits.

Run the example container with the following [az container create][az-container-create] command:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure
```

Azure Container Instances starts the container, and then stops it when its application (or script, in this case) exits. When Azure Container Instances stops a container whose restart policy is `Never` or `OnFailure`, the container's status is set to **Terminated**. You can check a container's status with the [az container show][az-container-show] command:

```azurecli-interactive
az container show --resource-group myResourceGroup --name mycontainer --query containers[0].instanceView.currentState.state
```

Example output:

```bash
"Terminated"
```

Once the example container's status shows *Terminated*, you can see its task output by viewing the container logs. Run the [az container logs][az-container-logs] command to view the script's output:

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer
```

Output:

```bash
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

This example shows the output that the script sent to STDOUT. Your containerized tasks, however, might instead write their output to persistent storage for later retrieval. For example, to an [Azure file share](container-instances-mounting-azure-files-volume.md).

## Configure containers at runtime

When you create a container instance, you can set its **environment variables**, as well as specify a custom **command line** to execute when the container is started. You can use these settings in your batch jobs to prepare each container with task-specific configuration.

## Environment variables

Set environment variables in your container to provide dynamic configuration of the application or script run by the container. This is similar to the `--env` command-line argument to `docker run`.

For example, you can modify the behavior of the script in the example container by specifying the following environment variables when you create the container instance:

*NumWords*: The number of words sent to STDOUT.

*MinLength*: The minimum number of characters in a word for it to be counted. A higher number ignores common words like "of" and "the."

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer2 \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure \
    --environment-variables NumWords=5 MinLength=8
```

By specifying `NumWords=5` and `MinLength=8` for the container's environment variables, the container logs should display different output. Once the container status shows as *Terminated* (use `az container show` to check its status), display its logs to see the new output:

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer2
```

Output:

```bash
[('CLAUDIUS', 120),
 ('POLONIUS', 113),
 ('GERTRUDE', 82),
 ('ROSENCRANTZ', 69),
 ('GUILDENSTERN', 54)]
```

## Command line override

Specify a command line when you create a container instance to override the command line baked into the container image. This is similar to the `--entrypoint` command-line argument to `docker run`.

For instance, you can have the example container analyze text other than *Hamlet* by specifying a different command line. The Python script executed by the container, *wordcount.py*, accepts a URL as an argument, and will process that page's content instead of the default.

For example, to determine the top 3 five-letter words in *Romeo and Juliet*:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer3 \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure \
    --environment-variables NumWords=3 MinLength=5 \
    --command-line "python wordcount.py http://shakespeare.mit.edu/romeo_juliet/full.html"
```

Again, once the container is *Terminated*, view the output by showing the container's logs:

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer3
```

Output:

```bash
[('ROMEO', 177), ('JULIET', 134), ('CAPULET', 119)]
```

## Next steps

### Persist task output

For details on how to persist the output of your containers that run to completion, see [Mounting an Azure file share with Azure Container Instances](container-instances-mounting-azure-files-volume.md).

<!-- LINKS - External -->
[aci-wordcount-image]: https://hub.docker.com/r/microsoft/aci-wordcount/

<!-- LINKS - Internal -->
[az-container-create]: /cli/azure/container?view=azure-cli-latest#az-container-create
[az-container-logs]: /cli/azure/container?view=azure-cli-latest#az-container-logs
[az-container-show]: /cli/azure/container?view=azure-cli-latest#az-container-show
[azure-cli-install]: /cli/azure/install-azure-cli
