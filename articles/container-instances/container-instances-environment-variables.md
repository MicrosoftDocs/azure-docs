---
title: Set environment variables in Azure Container Instances
description: Learn how to set environment variables in Azure Container Instances
services: container-instances
author: david-stanford
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 03/01/2018
ms.author: dastanfo
---

# Set environment variables in Azure Container Instances (ACI)
Setting environment variables in your container instances allows you to provide dynamic configuration of the application or script run by the container.

You are currently able to set environment variables from the CLI or powershell. In both cases you would use the --environment-variables flag. This is similar to the `--env` command-line argument to `docker run`.

For example, you can modify the behavior of the script in the example container by specifying the following environment variables when you create the container instance:

*NumWords*: The number of words sent to STDOUT.

*MinLength*: The minimum number of characters in a word for it to be counted. A higher number ignores common words like "of" and "the."

## Azure CLI example

```azurecli-interactive
az container create \
    --resource-group myResourceGroup \
    --name mycontainer2 \
    --image microsoft/aci-wordcount:latest \
    --restart-policy OnFailure \
    --environment-variables NumWords=5 MinLength=8
```

By specifying `NumWords=5` and `MinLength=8` for the container's environment variables, the container logs should display different output. Once the container status shows as *Terminated* (use `az container show` to check its status), display its logs to see the output.

```azurecli-interactive
az container logs --resource-group myResourceGroup --name mycontainer2
```

## Azure Powershell example

```azurepowershell-interactive
$envVars = @{}
$envVars.Add("NumWords", 5)
$envVars.Add("MinLength", 8)
New-AzureRmContainerGroup `
    -ResourceGroupName myResourceGroup `
    -Name mycontainer2 `
    -Image microsoft/aci-wordcount:latest `
    -RestartPolicy OnFailure `
    -EnvironmentVariable $envVars
```

By specifying `NumWords=5` and `MinLength=8` for the container's environment variables, the container logs should display different output. Once the container status shows as *Terminated* (use `Get-AzureRmContainerInstanceLog` to check its status), display its logs to see the output.

```azurepowershell-interactive
Get-AzureRmContainerInstanceLog `
    -ResourceGroupName myResourceGroup `
    -ContainerGroupName mycontainer2
```

## Example Output

```bash
[('CLAUDIUS', 120),
 ('POLONIUS', 113),
 ('GERTRUDE', 82),
 ('ROSENCRANTZ', 69),
 ('GUILDENSTERN', 54)]
```

## Next steps

Now that you know how to customize the input to your container's. Next learn how to persist the output of your containers that run to completion, see [Mounting an Azure file share with Azure Container Instances](container-instances-mounting-azure-files-volume.md).

<!-- LINKS Internal -->
[azure-cloud-shell]: ../cloud-shell/overview.md
[azure-cli-install]: /cli/azure/
[azure-powershell-install]: /powershell/azure/install-azurerm-ps