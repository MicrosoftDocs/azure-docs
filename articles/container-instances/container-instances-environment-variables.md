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

Setting environment variables in your container instances allows you to provide dynamic configuration of the application or script run by the container.

You're currently able to set environment variables with the Azure CLI and Azure PowerShell. In both cases, you supply an argument to set the variables when you create a container instance. Setting environment variables in ACI is similar to the `--env` command-line argument to `docker run`. For example, if you run the [microsoft/aci-wordcount][aci-wordcount] container image, you can modify its behavior by specifying the following environment variables:

*NumWords*: The number of words sent to STDOUT.

*MinLength*: The minimum number of characters in a word for it to be counted. A higher number ignores common words like "of" and "the."

## Azure CLI example

To see the default output of the container, run the following command:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer1 \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure
```

By specifying `NumWords=5` and `MinLength=8` for the container's environment variables, the container logs should display different output.

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer2 \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure \
    --environment-variables NumWords=5 MinLength=8
```

Once the container status shows as *Terminated* (use [az container show][az-container-show] to check its status), display its logs to see the output.

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer2
```

To view the output of the container you started with no environment variables, run the command with `--name` to "mycontainer1" instead of "mycontainer2".

## Azure PowerShell example

To see the default output of the container, run the following command:

```azurepowershell-interactive
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer1 `
    -Image microsoft/aci-wordcount:latest `
    -RestartPolicy OnFailure
```

By specifying `NumWords=5` and `MinLength=8` for the container's environment variables, the container logs should display different output.

```azurepowershell-interactive
$envVars = @{NumWord=5;MinLength=8}
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer2 `
    -Image microsoft/aci-wordcount:latest `
    -RestartPolicy OnFailure `
    -EnvironmentVariable $envVars
```

Once the container status is *Terminated* (use [Get-AzureRmContainerInstanceLog][azure-instance-log] to check its status), display its logs to see the output.

```azurepowershell-interactive
Get-AzureRmContainerInstanceLog `
    -ResourceGroupName myResourceGroup `
    -ContainerGroupName mycontainer2
```

To view the output of the container you started with no environment variables, run the command with `-ContainerGroupName` set to "mycontainer1" instead of "mycontainer2".

## Example output without environment variables

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

## Example output with environment variables

```bash
[('CLAUDIUS', 120),
 ('POLONIUS', 113),
 ('GERTRUDE', 82),
 ('ROSENCRANTZ', 69),
 ('GUILDENSTERN', 54)]
```

## Next steps

For more information on running task-based containers, such as for batch computing scenarios, see [Run containerized tasks in Azure Container Instances](container-instances-restart-policy.md).

<!-- LINKS Internal -->
[aci-wordcount]: https://hub.docker.com/r/microsoft/aci-wordcount/
[azure-cloud-shell]: ../cloud-shell/overview.md
[azure-cli-install]: /cli/azure/
[azure-powershell-install]: /powershell/azure/install-azurerm-ps
[azure-instance-log]: /powershell/module/azurerm.containerinstance/get-azurermcontainerinstancelog
[az-container-show]: /cli/azure/container?view=azure-cli-latest#az_container_show