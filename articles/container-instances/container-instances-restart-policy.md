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
ms.date: 09/16/2017
ms.author: marsma
ms.custom: mvc
---

# Run to completion containers in Azure Container Instances

The ease and speed of deploying containers in Azure Container Instances provides a compelling platform for executing tasks like build jobs and image rendering in a container instance. With a configurable restart policy, you can specify that your containers are stopped when their processes have completed. Because Azure Container instances are billed by the second, you're charged only for the compute resources used while the container executing your task is running.

## Container restart policy

When you create a container in Azure Container Instances, you can specify one of three restart policy settings:

| Restart policy   | Description |
| ---------------- | :---------- |
| `Always` | Default. Containers in the container group are always restarted. This is the default setting applied when no restart policy is specified at container creation. |
| `Never` | Containers in the container group are never restarted. The containers run at most once. |
| `OnFailure` | Containers in the container group are restarted only when a failure is detected in the container or the process running in the container. The containers are run at least once. |

## Specify a restart policy

The method by which you specify a restart policy depends on how you create your containers, such as with the Azure CLI, PowerShell, or the Azure portal. Azure CLI and PowerShell examples are shown below.

* Azure CLI

  ```azurecli-interactive
  az container create \
      --name mycontainer \
      --image mmacy/aci-wordcount \
      --resource-group myResourceGroup \
      --restart-policy OnFailure
  ```

* PowerShell

  ```powershell
  New-AzureRmContainer -ResourceGroupName myResourceGroup -Name mycontainer -Image mmacy/aci-helloworld -RestartPolicy OnFailure
  ```

## When to use a restart policy

Typical scenarios...

## Run a sample container

To see the restart policy in action, create a container instance from the [mmacy/aci-wordcount](https://hub.docker.com/r/mmacy/aci-wordcount/) image, and specify an `OnFailure` restart policy.

```azurecli-interactive
az container create --name mycontainer --image mmacy/aci-wordcount:v2 --resource-group myResourceGroup --restart-policy OnFailure
```

This the container runs a Python script that, by default, analyzes the text of Shakespeare's *Hamlet*, writes the ten most common words to STDOUT, and then exits. You can configure the text to analyze and the number and minimum length of words by using additional arguments when you create the container.

### Environment variables

You can configure the behavior of the script by specifying the following environment variables when you create the container instance.

`NumWords` - The number of words sent to STDOUT.

`MinLength` - The minimum number of characters in a word for it to be counted. A higher number ignores words like "an" and "the."

```azurecli-interactive
az container create --name mycontainer --image mmacy/aci-wordcount:v2 --resource-group myResourceGroup --restart-policy OnFailure --environment-variables NumWords=5 MinLength=8
```

### Command line override

You can analyze a different text by specifying a command line to be executed by the container. The Python script accepts a URL as an argument, and will process that page's content instead of the default.

For example, to analyze *Romeo and Juliet*:

```azurecli-interactive
az container create --name mycontainer --image mmacy/aci-wordcount:v2 --resource-group myResourceGroup --restart-policy OnFailure --command-line wordcount.py http://shakespeare.mit.edu/romeo_juliet/full.html
```

## Next steps

For details on how to persist the output of your containers that run to completion, see [Mounting an Azure file share with Azure Container Instances](container-instances-mounting-azure-files-volume.md).