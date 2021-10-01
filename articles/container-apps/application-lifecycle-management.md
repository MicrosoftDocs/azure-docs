---
title: Application lifecycle management in Azure Container Apps
description: Learn about the full application lifecycle in Azure Container Apps
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 09/16/2021
ms.author: cshoe
---

# Application lifecycle management in Azure Container Apps

The Azure Container Apps application lifecycle revolves around [revisions](revisions.md).

When you deploy a container app, the first revision is automatically created. [More revisions are created](revisions.md) as [containers](containers.md) change, or any adjustments are made to the `template` section of the configuration.

A container app flows through three phases: deployment, update, and deactivation.

## Deployment

As a container app is deployed, the first revision is automatically created.

:::image type="content" source="media/application-lifecycle-management/azure-container-apps-lifecycle-deployment.png" alt-text="Azure Container Apps: Deployment phase":::

## Update

As a container app is updated with a [revision scope-change](revisions.md#revision-scope-change), a new revision is created. You can choose whether to [automatically deactivate new old revisions, or allow them to remain available](overview.md).

:::image type="content" source="media/application-lifecycle-management/azure-container-apps-lifecycle-update.png" alt-text="Azure Container Apps: Update phase":::

## Deactivate

Once a revision is no longer needed, you can deactivate a revision with the option to reactivate later. During deactivation the container is [shut down](#shutdown).

:::image type="content" source="media/application-lifecycle-management/azure-container-apps-lifecycle-deactivate.png" alt-text="Azure Container Apps: Deactivation phase":::

## Shutdown

<!-- move to containers.md -->

The containers are shut down in the following situations:

- as a container app scales in
- as a container app is being deleted
- as a revision is being deactivated

When a shutdown is initiated, the container host sends a [SIGTERM message](https://wikipedia.org/wiki/Signal_(IPC)) to your container. The code implemented in the container can respond to this operating system-level message to handle termination.

If your application does not respond to the `SIGTERM` message in *** seconds, then [SIGKILL](https://wikipedia.org/wiki/Signal_(IPC)) terminates your container.

## Delete a container app

```sh
az containerapp delete -n myapp -g myRG
```

## Next steps

> [!div class="nextstepaction"]
> [Work with revisions](revisions.md)
