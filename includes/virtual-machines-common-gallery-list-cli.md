---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/20/2018
 ms.author: cynthn
 ms.custom: include file
---


## Using RBAC to share images

You can share images across subscriptions using Role-Based Access Control (RBAC). Any user that has read permissions to an image version, even across subscriptions, will be able to deploy a Virtual Machine using the image version.

For more information about how to share resources using RBAC, see [Manage access using RBAC and Azure CLI](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-cli).


## List information

Get the location, status and other information about the available image galleries using [az sig list](/cli/azure/sig#az-sig-list).

```azurecli-interactive 
az sig list -o table
```

List the image definitions in a gallery, including information about OS type and status, using [az sig image-definition list](/cli/azure/sig/image-definition#az-sig-image-definition-list).

```azurecli-interactive 
az sig image-definition list --resource-group myGalleryRG --gallery-name myGallery -o table
```

List the shared image versions in a gallery, using [az sig image-version list](/cli/azure/sig/image-version#az-sig-image-version-list).

```azurecli-interactive
az sig image-version list --resource-group myGalleryRG --gallery-name myGallery --gallery-image-definition myImageDefinition -o table
```

Get the ID of an image version using [az sig image-version show](/cli/azure/sig/image-version#az-sig-image-version-show).

```azurecli-interactive
az sig image-version show \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --query "id"
```