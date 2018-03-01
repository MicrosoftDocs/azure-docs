---
title: Set environment variables in Azure Container Instances
description: Learn how to set environment variables in Azure Container Instances
services: container-instances
author: dastanfo
manager: timlt

ms.service: container-instances
ms.topic: article
ms.date: 03/01/2018
ms.author: dastanfo
---

# Set environment variables in Azure Container Instances
Setting environment variables in your container instances allows you to provide dynamic configuration of the application or script run by the container. 

To set an environment variable in Azure Container Intances use the --environment-variables flag with the command line.  This is similar to the `--env` command-line argument to `docker run`.

# [Azure CLI](#tab/azure-cli)

You can log in to Azure and run Azure CLI commands in one of two ways:

- You can run CLI commands from within the Azure portal, in [Azure Cloud Shell][azure-cloud-shell]
- You can [install locally][azure-cli-install] the CLI and run CLI commands locally, if you use it locally a version greater than 2.0.21 is required. 

# [PowerShell](#tab/powershell)

This quickstart requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find your current version. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Example container using environment variables
For example, you can modify the behavior of the script in the example container by specifying the following environment variables when you create the container instance:

# [PowerShell](#tab/powershell)

This quickstart requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find your current version. If you need to install or upgrade, see [Install Azure PowerShell module]().

# [Azure CLI](#tab/azure-cli)

You can log in to Azure and run Azure CLI commands in one of two ways:

- You can run CLI commands from within the Azure portal, in Azure Cloud Shell 
- You can install the CLI and run CLI commands locally 


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

## Next steps

Learn how to mount other volume types in Azure Container Instances:

* [Mount an Azure file share in Azure Container Instances](container-instances-volume-azure-files.md)
* [Mount an emptyDir volume in Azure Container Instances](container-instances-volume-emptydir.md)
* [Mount a gitRepo volume in Azure Container Instances](container-instances-volume-gitrepo.md)

<!-- LINKS - External -->
[tmpfs]: https://wikipedia.org/wiki/Tmpfs

<!-- LINKS Internal -->
[azure-cloud-shell]: ../cloud-shell/overview.md
[azure-cli-install]: /cli/azure/
[azure-powershell-install]: /powershell/azure/install-azurerm-ps