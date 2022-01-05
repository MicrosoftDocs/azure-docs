---
title: Disable OSM
description: Disable Open Service Mesh
services: container-service
ms.topic: article
ms.date: 8/26/2021
ms.custom: mvc, devx-track-azurecli
ms.author: pgibson
---

# Disable Open Service Mesh (OSM) add-on for your AKS cluster

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

To disable the OSM add-on, run the following command:

```azurecli-interactive
az aks disable-addons -n <AKS-cluster-name> -g <AKS-resource-group-name> -a open-service-mesh
```