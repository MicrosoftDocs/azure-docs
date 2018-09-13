---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/13/2018
 ms.author: cynthn
 ms.custom: include file
---



## List information

List galleries across subscriptions.

```azurecli-interactive
az account list -otsv --query "[].id" | xargs -n 1 az sig list  --subscription
```

Get the location, status and other information about the available image galleries using [az sig list](/cli/azure/)

```azurecli-interactive 
az sig list -o table
```

List the image definitions in a gallery, including information about OS type and status, using [az sig image-definition list](/cli/azure/).

```azurecli-interactive 
az sig image-definition list -g myGalleryRG -r myGallery -o table
```

List the shared image versions in a gallery, using [az sig image-version list](/cli/azure/).

```azurecli-interactive
az sig image-version list -g myGalleryRG -r myGallery -i myGalleryImage -o table
```