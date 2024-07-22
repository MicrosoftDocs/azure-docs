---
title: include file
description: include file
author: dominicbetts
ms.topic: include
ms.date: 03/05/2024
ms.author: dobett
---

To find the application ID of the managed identity and your tenant ID, run the following commands. Replace the placeholders with your cluster name, resource group, and subscription ID:

```azurecli
CLUSTER_NAME=<Your connected cluster name>
RESOURCE_GROUP=<The resource group where your connected cluster is installed>
SUBSCRIPTION=<The subscription where your connected cluster is installed>
EXTENSION_NAME=processor

OBJECT_ID=$(az k8s-extension show --name $EXTENSION_NAME --cluster-name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --cluster-type connectedClusters --query identity.principalId -o tsv --subscription $SUBSCRIPTION)
echo "App ID:    " `az ad sp show --query appId --id $OBJECT_ID -o tsv`
echo "Tenant ID: " `az account show --query tenantId -o tsv`
```

Make a note of the `App ID` and `Tenant ID`, you need these values later.
