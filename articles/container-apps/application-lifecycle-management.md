---
title: Application lifecycle management in Azure Container Apps
description: Learn about the full application lifecycle in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: conceptual
ms.date: 3/13/2023
ms.author: cshoe
ms.custom: ignite-fall-2021, event-tier1-build-2022
---

# Application lifecycle management in Azure Container Apps

The Azure Container Apps application lifecycle revolves around [revisions](revisions.md).

When you deploy a container app, the first revision is automatically created. [More revisions are created](revisions.md) as [containers](containers.md) change, or any adjustments are made to the `template` section of the configuration.

A container app flows through four phases: deployment, update, deactivation, and shut down.

> [!NOTE]
> [Azure Container Apps jobs](jobs.md) don't support revisions. Jobs are deployed and updated directly.

## Deployment

As a container app is deployed, the first revision is automatically created.

:::image type="content" source="media/application-lifecycle-management/azure-container-apps-lifecycle-deployment.png" alt-text="Azure Container Apps: Deployment phase":::

## Update

As a container app is updated with a [revision scope-change](revisions.md#revision-scope-changes), a new revision is created. You can [choose](revisions.md#revision-modes) whether to automatically deactivate old revisions (single revision mode), or allow them to remain available (multiple revision mode).

:::image type="content" source="media/application-lifecycle-management/azure-container-apps-lifecycle-update.png" alt-text="Azure Container Apps: Update phase":::

When in single revision mode, Container Apps handles the automatic switch between revisions to support [zero downtime deployment](revisions.md#zero-downtime-deployment).

## Deactivate

Once a revision is no longer needed, you can deactivate a revision with the option to reactivate later. During deactivation, containers in the revision are [shut down](#shutdown).

:::image type="content" source="media/application-lifecycle-management/azure-container-apps-lifecycle-deactivate.png" alt-text="Azure Container Apps: Deactivation phase":::

## Shutdown

The containers are shut down in the following situations:

- As a container app scales in
- As a container app is being deleted
- As a revision is being deactivated

When a shutdown is initiated, the container host sends a [SIGTERM message](https://wikipedia.org/wiki/Signal_(IPC)) to your container. The code implemented in the container can respond to this operating system-level message to handle termination.

If your application doesn't respond within 30 seconds to the `SIGTERM` message, then [SIGKILL](https://wikipedia.org/wiki/Signal_(IPC)) terminates your container.

Additionally, make sure your application can gracefully handle shutdowns. Containers restart regularly, so don't expect state to persist inside a container. Instead, use external caches for expensive in-memory cache requirements.

## Next steps

> [!div class="nextstepaction"]
> [Microservices](microservices.md)
