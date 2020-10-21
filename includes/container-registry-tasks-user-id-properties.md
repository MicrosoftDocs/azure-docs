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
In the command output, the `identity` section shows the identity of type `UserAssigned` is set in the task:

```console
[...]
"identity": {
    "principalId": null,
    "tenantId": null,
    "type": "UserAssigned",
    "userAssignedIdentities": {
      "/subscriptions/xxxxxxxx-d12e-4760-9ab6-xxxxxxxxxxxx/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myACRTasksId": {
        "clientId": "xxxxxxxx-f17e-4768-bb4e-xxxxxxxxxxxx",
        "principalId": "xxxxxxxx-1335-433d-bb6c-xxxxxxxxxxxx"
      }
[...]
``` 
<!-- LINKS - Internal -->
