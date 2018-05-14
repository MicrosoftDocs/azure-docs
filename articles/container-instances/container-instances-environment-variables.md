---
title: Set environment variables in Azure Container Instances
description: Learn how to set environment variables in the containers you run in Azure Container Instances
services: container-instances
author: mmacy
manager: jeconnoc

ms.service: container-instances
ms.topic: article
ms.date: 05/16/2018
ms.author: marsma
---
# Set environment variables

Setting environment variables in your container instances allows you to provide dynamic configuration of the application or script run by the container. To set environment variables in a container, specify them when you create a container instance. You can set environment variables when you start a container with the [Azure CLI][azure-cli-install], [Azure PowerShell][azure-powershell-install], and the [Azure portal][portal].

For example, if you run the [microsoft/aci-wordcount][aci-wordcount] container image, you can modify its behavior by specifying the following environment variables:

*NumWords*: The number of words sent to STDOUT.

*MinLength*: The minimum number of characters in a word for it to be counted. A higher number ignores common words like "of" and "the."

## Azure CLI example

To see the default output of the [microsoft/aci-wordcount][aci-wordcount]  container, run the following [az container create][az-container-create] command:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer1 \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure
```

Once the container status shows as *Terminated* (use [az container show][az-container-show] to check its status), display its logs with [az container logs][az-container-logs] to see the output.

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer1
```

Without environment variables, the first container's log output is:

```console
$ az container logs --resource-group myResourceGroup --name mycontainer1
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

By specifying `NumWords=5` and `MinLength=8` for the container's environment variables, the container logs display different output. This example adds the `--environment-variables` argument, and specifies the *NumWords* and *MinLength* variables:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer2 \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure \
    --environment-variables NumWords=5 MinLength=8
```

With environment variables, the second container's log output is:

```console
$ az container logs --resource-group myResourceGroup --name mycontainer2
[('CLAUDIUS', 120),
 ('POLONIUS', 113),
 ('GERTRUDE', 82),
 ('ROSENCRANTZ', 69),
 ('GUILDENSTERN', 54)]
```

## Azure PowerShell example

Setting environment variables in PowerShell is similar to the CLI, but uses the `-EnvironmentVariable` command-line argument.

First, launch the container in its default configuration with this [New-AzureRmContainerGroup][new-azurermcontainergroup] command:

```azurepowershell-interactive
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer1 `
    -Image microsoft/aci-wordcount:latest
```

Now run the following [New-AzureRmContainerGroup][new-azurermcontainergroup] command, which specifies the *NumWords* and *MinLength* environment variables after populating an array variable, `envVars`:

```azurepowershell-interactive
$envVars = @{NumWords=5;MinLength=8}
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer2 `
    -Image microsoft/aci-wordcount:latest `
    -RestartPolicy OnFailure `
    -EnvironmentVariable $envVars
```

Once each container's status is *Terminated* (use [Get-AzureRmContainerInstanceLog][azure-instance-log] to check its status), pull its logs with the [Get-AzureRmContainerInstanceLog][azure-instance-log] command.

```azurepowershell-interactive
Get-AzureRmContainerInstanceLog `
    -ResourceGroupName myResourceGroup `
    -ContainerGroupName mycontainer2
```

Output of the second container shows that you've limited the number words to five, and the minimum word length to eight characters:

```console
PS Azure:\> $envVars = @{NumWords=5;MinLength=8}
Azure:\
PS Azure:\> New-AzureRmContainerGroup `
>>     -ResourceGroupName myResourceGroup `
>>     -Name mycontainer2 `
>>     -Image microsoft/aci-wordcount:latest `
>>     -RestartPolicy OnFailure `
>>     -EnvironmentVariable $envVars
[('CLAUDIUS', 120),
 ('POLONIUS', 113),
 ('GERTRUDE', 82),
 ('ROSENCRANTZ', 69),
 ('GUILDENSTERN', 54)]
```

## Azure portal example

TODO

## Next steps

For more information on running task-based containers, such as for batch computing scenarios, see [Run containerized tasks in Azure Container Instances](container-instances-restart-policy.md).

<!-- LINKS - External -->
[aci-wordcount]: https://hub.docker.com/r/microsoft/aci-wordcount/

<!-- LINKS Internal -->
[az-container-create]: /cli/azure/container#az-container-create
[az-container-logs]: /cli/azure/container#az-container-logs
[az-container-show]: /cli/azure/container#az-container-show
[azure-cli-install]: /cli/azure/
[azure-instance-log]: /powershell/module/azurerm.containerinstance/get-azurermcontainerinstancelog
[azure-powershell-install]: /powershell/azure/install-azurerm-ps
[new-azurermcontainergroup]: /powershell/module/azurerm.containerinstance/new-azurermcontainergroup
[portal]: https://portal.azure.com