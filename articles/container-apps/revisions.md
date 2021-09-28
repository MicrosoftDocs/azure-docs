---
title: Application lifecycle management in Azure Container Apps
description: Learn about the full application lifecycle in Azure Container Apps
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  how-to
ms.date: 09/16/2021
ms.author: cshoe
---

# Work with revisions in Azure Container Apps

<!--
https://github.com/microsoft/azure-worker-apps-preview/blob/main/docs/revisions.md
 -->

## View revisions

First grab the list of revisions associated with your app

```sh
az containerapp revision list \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
  -o table
```

Then examine the revision

```sh
az containerapp revision show \
  --name <REVISION_NAME> \
  --app <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

## Activate and deactivate

Whenever you are done with a revision you can deactivate it

```sh
az workerapp revision deactivate \
  --name <REVISION_NAME> \
  --app <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

This will stop all running replicas of that revision and it will no longer be accessible internally or externally Likewise you can reactivate a revision

```sh
az workerapp revision activate \
  --name <REVISION_NAME> \
  --app <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```

## Traffic splitting

The routing of external traffic to your Worker Apps revisions can be changed using traffic weights. Once applied, traffic to the Worker Apps FDQN will be split according to the weights specified in the configuration.
Additionally you can assign a constant weight to the latest revision so a percentage of traffic will always go to the latest revision.

# [ARM Template](#tab/arm-template)

```json
{
  ...
  "configuration": {
    "ingress": {
      "traffic": [
        {
          "revisionName": <REVISION_NAME>,
          "weight": 50
        },
        {
          "revisionName": <REVISION_NAME>,
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

# [Azure CLI](#tab/azure-cli)

```sh
az workerapp update --name myapp --resource-group $RESOURCE_GROUP_NAME --traffic-weight <REVISION 1>=50,<REVISION 2>=30,latest=20
```

---

## Secrets and revisions

Changes to a container app's secrets will not be applied immediately nor will it create another revision. Instead they are applied to a revision upon restart.

Lets say you want to add a secret to your Worker App by running the following command

```sh
az containerapp update \
  --name <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME> \
 --secrets "storageconnectionstring=$CONNECTIONSTRING"
```

All existing container apps revisions will not have access to this secret until they are restarted

```sh
az containerapp revision restart \
  --name <REVISION_NAME> \
  --app <APPLICATION_NAME> \
  --resource-group <RESOURCE_GROUP_NAME>
```


## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
