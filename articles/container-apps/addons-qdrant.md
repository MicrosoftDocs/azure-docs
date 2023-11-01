---
title: 'Tutorial: Connect to a Qdrant vector database in Azure Container Apps (preview)'
description: Learn to use a Container Apps add on to quickly connect to a Qdrant vector database.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 11/01/2023
ms.author: cshoe
---

# Tutorial: Connect to a Qdrant vector database in Azure Container Apps (preview)

```bash
export APPNAME=music-recommendations-demo-app
export RESOURCE_GROUP=playground
```

```bash
export LOCATION=southcentralus
export ENVIRONMENT=music-recommendations-demo-environment
export WORK_LOAD_PROFILE_TYPE=D32
export CPU_SIZE=8.0
export MEMORY_SIZE=16.0Gi
export IMAGE=simonj.azurecr.io/aca-ephemeral-music-recommendation-image
export SERVICE_NAME=qdrantdb
```

```azurecli
az group create --name $RESOURCE_GROUP --location $LOCATION
```

```azurecli
az containerapp env create \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

```azurecli
az containerapp env workload-profile set \
  --name $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --workload-profile-type $WORK_LOAD_PROFILE_TYPE \
  --workload-profile-name bigProfile \
  --min-nodes 0 \
  --max-nodes 2
```

```azurecli
az containerapp service qdrant create \
  --environment $ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $SERVICE_NAME
```

```azurecli
az containerapp create \
  --name $APPNAME \
  --resource-group $RESOURCE_GROUP \
  --environment $ENVIRONMENT \
  --workload-profile-name bigProfile \
  --cpu $CPU_SIZE \
  --memory $MEMORY_SIZE \
  --image $IMAGE \
  --min-replicas 1 \
  --max-replicas 1 \
  --env-vars RESTARTABLE=yes
```

```azurecli
az containerapp update -n $APPNAME -g $RESOURCE_GROUP --bind qdrantdb
```

## enable ingress

```azurecli
az containerapp ingress enable \
  --name $APPNAME \
  --resource-group $RESOURCE_GROUP \
  --type external \
  --target-port 8888 \
  --transport auto
```

```azurecli
az containerapp ingress cors enable \
  --name $APPNAME \
  --resource-group $RESOURCE_GROUP \
  --allowed-origins *
```

```bash
echo your login token is: `az containerapp logs show -g $RESOURCE_GROUP --name $APPNAME --tail 300 | \
  grep token |  cut -d= -f 2 | cut -d\" -f 1 | uniq`
```
