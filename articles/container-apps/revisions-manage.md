---
title: Manage an app in Azure Container Apps
description: Manage an application through its lifecycle in Azure Container Apps.
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Manage revisions Azure Container Apps



## List

List all revisions associated with your container app with `az containerapp revision list`.

```sh
az containerapp revision list \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  -o table
```

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Show

Show details about a specific revision by using `az containerapp revision show`.

```sh
az containerapp revision show \
  --name <REVISION_NAME> \
  --app <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Update

To update a container app, use `az containerapp update`.

```sh
az containerapp update \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --secrets "storageconnectionstring=$CONNECTIONSTRING"
```

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Activate

Activate a revision by using `az containerapp revision activate`.

```sh
az containerapp revision activate \
  --name <REVISION_NAME> \
  --app <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Deactivate

Deactivate revisions that are no longer in use with `az container app revision deactivate`. Deactivation stops all running replicas of a revision.

```sh
az containerapp revision deactivate \
  --name <REVISION_NAME> \
  --app <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Restart

All existing container apps revisions will not have access to this secret until they are restarted

```sh
az containerapp revision restart \
  --name <REVISION_NAME> \
  --app <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

## Set active revision mode

** change to json

## Verify revision endpoint

## Traffic splitting

Applied by assigning percentage values, you can decide how to balance traffic among different revisions. Traffic splitting rules are assigned by setting weights to different revisions.

The following example shows how to split traffic where:

- 50% of the requests go to the first revision
- 30% of the requests go to the section revision
- 20% of the requests go to the latest revision

# [ARM Template](#tab/arm-template)

```json
{
  ...
  "configuration": {
    "ingress": {
      "traffic": [
        {
          "revisionName": <REVISION1_NAME>,
          "weight": 50
        },
        {
          "revisionName": <REVISION2_NAME>,
          "weight": 30
        },
        {
          "latestRevision": true,
          "weight": 20
        }
      ]
    }
  }
}
```

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

# [Azure CLI](#tab/azure-cli)

```sh
az containerapp update \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  --traffic-weight <REVISION1_NAME>=50,<REVISION2_NAME>=30,latest=20
```

As you interact with this example, replace the placeholders surrounded by `<>` with your values.

---

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
