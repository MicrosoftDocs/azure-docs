---
title: include file
description: include file
services: container-registry
author: dlepow

ms.service: container-registry
ms.topic: include
ms.date: 07/12/2019
ms.author: danlep
ms.custom: include file
---
In the command output, the `identity` section shows an identity of type `SystemAssigned` is set in the task. The `principalId` is the service principal ID of the identity:

```console
[...]
  "identity": {
    "principalId": "xxxxxxxx-2703-42f9-97d0-xxxxxxxxxxxx",
    "tenantId": "xxxxxxxx-86f1-41af-91ab-xxxxxxxxxxxx",
    "type": "SystemAssigned",
    "userAssignedIdentities": null
  },
  "location": "eastus",
[...]
``` 
Use the [az acr task show][az-acr-task-show] command to store the principalId in a variable, to use in later commands:

```azurecli
principalID=$(az acr task show --name dockerhubtask --registry myregistry --query identity.principalId --output tsv)
```

<!-- LINKS - Internal -->
[az-acr-task-show]: /cli/azure/acr/task#az-acr-task-show
