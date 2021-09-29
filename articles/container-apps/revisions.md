---
title: Revisions in Azure Container Apps
description: Learn to manage revisions in Azure Container Apps
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Revisions in Azure Container Apps

<!--
https://github.com/microsoft/azure-worker-apps-preview/blob/main/docs/revisions.md
 -->

A revision is an immutable snapshot of a container app.

- The first revision is automatically created when you deploy your container app.
- New revisions are automatically created when a container app's `template` configuration changes.
- While revisions are immutable, they're affected by changes to global configuration values, which apply to all revisions.

Revisions are most useful when you enable [ingress](overview.md) to make your container app accessible via HTTP.  Revisions are often used when you want to direct traffic from one snapshot of your container app to the next. Typical traffic direction strategies include [A/B testing](https://wikipedia.org/wiki/A/B_testing) and [BlueGreen deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html).

The following diagram shows a container app with two revisions.

:::image type="content" source="media/revisions/azure-container-apps-revisions-traffic-split.png" alt-text="Azure Container Apps: Traffic splitting among revisions":::

The scenario shown above presumes the container app is in following state:

- [Ingress](overview.md) is enabled, which makes the container app available via HTTP.
- The first revision is deployed as _Revision 1_.
- After the container was updated, a new revision was activated as _Revision 2_.
- [Traffic splitting](#traffic-splitting) rules are configured so that _Revision 1_ receives 80% of the requests, while _Revision 2_ receives the remaining 20%.

## Change types

Changes made to a container app fall under one of two categories: *revision-scope* and *application-scope* changes. Revision-scope changes are any change that triggers a new revision, while application-scope changes don't create revisions.

### Revision scope changes

The following types of changes create a new revision:

- Changes to containers
- Add or update scaling rules
- Changes to Dapr settings
- Any change that affects the `template` section of the configuration

### Application scope changes

The following types of changes do not create a new revision:

- Changes to [traffic splitting rules](revisions.md#traffic-splitting)
- Turning [ingress](overview.md) on or off
- Changes to [secret values](secure-app.md)
- Any change outside the `template` section of the configuration

While changes to secrets are an application scope change, revisions must be [restarted](#restart) before a container recognizes new secret values.

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

## Next steps

> [!div class="nextstepaction"]
> [Secure an app](get-started.md)
