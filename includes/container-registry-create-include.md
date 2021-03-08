---
author: dlepow
ms.service: container-registry
ms.topic: include
ms.date: 02/24/2021
ms.author: danlep
---
## Create container registry - CLI

Use the [Azure CLI][azure-cli] to create an Azure container registry.

If needed, create a resource group for the registry by using the [az group create][az-group-create] command. This example creates the resource group in the East US region.

```azurecli
az group create --name myResourceGroup --location eastus
```


Use the [az acr create][az-acr-create] command to create a container registry in the Basic service tier. Specify a globally unique registry name.

```azurecli
az acr create --resource-group myResourceGroup \
  --name myregistry --sku Basic
```

[azure-cli]: /cli/azure/install-azure-cli
[az-group-create]: /cli/azure/group#az_group_create
[az-acr-create]: /cli/azure/acr#az_acr_create
