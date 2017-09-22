---
title: Run to completion containers in Azure Container Instances
description: Learn how to use Azure Container Instances for batch processes like build jobs and image rendering.
services: container-instances
documentationcenter: ''
author: mmacy
manager: timlt
editor: ''
tags:
keywords: ''

ms.assetid:
ms.service: container-instances
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/27/2017
ms.author: marsma
ms.custom:
---

# Run to completion containers in Azure Container Instances

The ease and speed of deploying containers in Azure Container Instances provides a compelling platform for executing run-once tasks like build, test, and image rendering in a container instance.

With a configurable restart policy, you can specify that your containers are stopped when their processes have completed. Because Azure Container Instances are billed by the second, you're charged only for the compute resources used while the container executing your task is running.

## Container restart policy

When you create a container in Azure Container Instances, you can specify one of three restart policy settings.

| Restart policy   | Description |
| ---------------- | :---------- |
| `Always` | Containers in the container group are always restarted. This is the **default** setting applied when no restart policy is specified at container creation. |
| `Never` | Containers in the container group are never restarted. The containers run at most once. |
| `OnFailure` | Containers in the container group are restarted only when a failure is detected in the container, or the process running in the container. The containers are run at least once. |

## Specify a restart policy

The method by which you specify a restart policy depends on how you create your containers, such as with the Azure CLI, PowerShell, or the Azure portal. Azure CLI and PowerShell examples are shown here.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer \
    --image mycontainerimage \
    --restart-policy OnFailure
```

# [PowerShell](#tab/azure-powershell)

```powershell
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer `
    -Image mycontainerimage `
    -RestartPolicy OnFailure
```

---

## Run to completion example

To see the restart policy in action, create a container instance from the [mmacy/aci-wordcount](https://hub.docker.com/r/mmacy/aci-wordcount/) image, and specify the `OnFailure` restart policy.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer \
    --image mmacy/aci-wordcount:v2 \
    --restart-policy OnFailure
```

# [PowerShell](#tab/azure-powershell)

```powershell
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer `
    -Image mmacy/aci-wordcount:v2 `
    -RestartPolicy OnFailure
```

---

This container runs a Python script that, by default, analyzes the text of Shakespeare's [Hamlet](http://shakespeare.mit.edu/hamlet/full.html), writes the 10 most common words to STDOUT, and then exits. You can modify the behavior of the script, however, by specifying a new command line and environment variables when you create the container instance.

## Configure containers at runtime

When you create a container instance, you can set its environment variables, as well as specify a custom command line to execute when the container is started. Your job can use these settings for task-specific configuration when creating a container for each of its tasks.

### Environment variables

Set environment variables in your container to provide dynamic configuration of the script or application run by the container. This is similar to the `--env` command-line argument to `docker run`.

For example, you can modify the behavior of the script run by the container in the earlier example by specifying the following environment variables when you create the container instance.

**NumWords** - The number of words sent to STDOUT.

**MinLength** - The minimum number of characters in a word for it to be counted. A higher number ignores common words like "an" and "the."

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer \
    --image mmacy/aci-wordcount:v2 \
    --restart-policy OnFailure \
    --environment-variables NumWords=5 MinLength=8
```

# [PowerShell](#tab/azure-powershell)

```powershell
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer `
    -Image mmacy/aci-wordcount:v2 `
    -RestartPolicy OnFailure `
    -EnvironmentVariable @{"NumWords"="5";"MinLength"="8"}
```

---

### Command line override

Specify a command line to override the command line baked into the container image. This is similar to the `--entrypoint` command-line argument to `docker run`.

For instance, you can have the example container analyze text other than *Hamlet* by specifying a different command line for the instance. The Python script run by the container, "wordcount.py," accepts a URL as an argument, and will process that page's content instead of the default.

For example, to analyze *Romeo and Juliet*:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer \
    --image mmacy/aci-wordcount:v2 \
    --restart-policy OnFailure \
    --command-line wordcount.py http://shakespeare.mit.edu/romeo_juliet/full.html
```

# [PowerShell](#tab/azure-powershell)

```powershell
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer `
    -Image mmacy/aci-wordcount:v2 `
    -RestartPolicy OnFailure `
    -Command "wordcount.py http://shakespeare.mit.edu/romeo_juliet/full.html"
```

---

## Next steps

For details on how to persist the output of your containers that run to completion, see [Mounting an Azure file share with Azure Container Instances](container-instances-mounting-azure-files-volume.md).