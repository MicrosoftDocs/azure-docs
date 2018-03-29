---
title: Set environment variables in Azure Container Instances
description: Learn how to set environment variables in Azure Container Instances
services: container-instances
author: david-stanford
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 03/13/2018
ms.author: dastanfo
---
# Set environment variables

Setting environment variables in your container instances allows you to provide dynamic configuration of the application or script run by the container.

You're currently able to set environment variables from the CLI and PowerShell. In both cases, you would use a flag on the commands to set the environment variables. Setting environment variables in ACI is similar to the `--env` command-line argument to `docker run`. For example, if you use the microsoft/aci-wordcount container image you can modify the behavior by specifying the following environment variables:

*NumWords*: The number of words sent to STDOUT.

*MinLength*: The minimum number of characters in a word for it to be counted. A higher number ignores common words like "of" and "the."

## Azure CLI example

To see the default output of the container run the following command:

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

Once the container status shows as *Terminated* (use [az container show][az-container-show] to check its status), display its logs to see the output.  To view the output of the container with no environment variables set --name to be mycontainer1 instead of mycontainer2.

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer2
```

## Azure PowerShell example

To see the default output of the container run the following command:

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer1 \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure
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

Once the container status is *Terminated* (use [Get-AzureRmContainerInstanceLog][azure-instance-log] to check its status), display its logs to see the output. To view the container logs with no environment variables set ContainerGroupName to be mycontainer1 instead of mycontainer2.

```azurepowershell-interactive
Get-AzureRmContainerInstanceLog `
    -ResourceGroupName myResourceGroup `
    -ContainerGroupName mycontainer2
```

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

Now that you know how to customize the input to your container, learn how to persist the output of containers that run to completion.
> [!div class="nextstepaction"]
> [Mounting an Azure file share with Azure Container Instances](container-instances-mounting-azure-files-volume.md)

<!-- LINKS Internal -->
[azure-cloud-shell]: ../cloud-shell/overview.md
[azure-cli-install]: /cli/azure/
[azure-powershell-install]: /powershell/azure/install-azurerm-ps
[azure-instance-log]: /powershell/module/azurerm.containerinstance/get-azurermcontainerinstancelog
[az-container-show]: /cli/azure/container?view=azure-cli-latest#az_container_show