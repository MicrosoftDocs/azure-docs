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

## Create an image gallery 

An image gallery is the primary resource used for enabling image sharing. Gallery names must be unique within your subscription. Create an image gallery using [az sig create](/cli/azure). The following example creates a gallery named *myGallery* in *myGalleryRG*.

```azurecli-interactive
az sig create -g myGalleryRG --gallery-name myGallery
```

## Create an image definition

Create an initial image in the gallery using [az sig image-definition create](/cli/azure).

```azurecli-interactive 
az sig image-definition create \
   -g myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --publisher myPublisher \
   --offer myOffer \
   --sku 16.04-LTS \
   --os-type Linux 
```

## Create an image version 
 
Create versions of the image as needed using az image gallery create-image-version.

```azurecli-interactive 
az sig image-version create \
   -g myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --managed-image myImage
```


