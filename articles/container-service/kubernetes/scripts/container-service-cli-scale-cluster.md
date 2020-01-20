---
title: Azure CLI Script Sample - Scale an ACS Cluster
description: Azure CLI Script Sample - Scale an ACS Cluster
author: iainfoulds
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Kubernetes, DC/OS, Azure

ms.assetid: 
ms.service: container-service
ms.devlang: azurecli
ms.topic: sample
ms.date: 05/30/2017
ms.author: iainfou
---

# (DEPRECATED) Scale an Azure Container Service Cluster

[!INCLUDE [ACS deprecation](../../../../includes/container-service-kubernetes-deprecation.md)]

This sample scales and Azure Container Service. 

[!INCLUDE [sample-cli-install](../../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample script

```azurecli
az acs scale --resource-group myResourceGroup --name myK8SCluster --new-agent-count 5
```

## Clean up deployment 

Run the following command to remove the resource group, VM, and all related resources.

```azurecli
az group delete --name myResourceGroup
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [az acs scale](/cli/azure/acs#az-acs-scale) | Scale an ACS cluster. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Container Service CLI script samples can be found in the [Azure Container Service documentation](../cli-samples.md).

