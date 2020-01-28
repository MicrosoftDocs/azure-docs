---
title: Azure CLI Script Sample - Create ACS DC/OS Cluster
description: Azure CLI Script Sample - Create ACS DC/OS Cluster
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

# (DEPRECATED) Create an Azure Container Service DC/OS Cluster

[!INCLUDE [ACS deprecation](../../../../includes/container-service-kubernetes-deprecation.md)]

This sample creates an Azure Container Service cluster running DCOS.

[!INCLUDE [sample-cli-install](../../../../includes/sample-cli-install.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Sample script

```azurecli
az group create --name myResourceGroup --location eastus

az acs create \
  --orchestrator-type dcos \
  --resource-group myResourceGroup \
  --name myDCOSCluster \
  --generate-ssh-keys
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
| [az group create](https://docs.microsoft.com/cli/azure/group#az-group-create) | Creates a resource group in which all resources are stored. |
| [az acs create](https://docs.microsoft.com/cli/azure/acs#az-acs-create) | Creates and ACS cluster. |

## Next steps

For more information on the Azure CLI, see [Azure CLI documentation](https://docs.microsoft.com/cli/azure).

Additional Azure Container Service CLI script samples can be found in the [Azure Container Service documentation](../cli-samples.md).
