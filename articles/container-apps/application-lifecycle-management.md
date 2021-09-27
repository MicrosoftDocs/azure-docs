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

<!-- PRELIMINARY OUTLINE
https://github.com/microsoft/azure-worker-apps-preview/blob/main/docs/revisions.md
-->

The Azure Container Apps application lifecycle revolves around container revisions. A revision is an immutable snapshot of a container app. New revisions are automatically created when a container app's `template` configuration changes.

While revisions remain immutable, they are affected by changes to global configuration values which apply to all revisions.

When you deploy your container app, the first revision is automatically created. If you enable [ingress](overview.md) on your container app, then an IP, port, and fully qualified domain name is assigned to your container app.

:::image type="content" source="media/application-lifecycle-management/azure-container-apps-application-lifecycle-management.png" alt-text="Azure Container Apps application lifecycle management":::

If your container crashes, then it is automatically restarted.

## Usage

Revisions are most useful when you enable ingress to make your container app accessible via HTTP.  Revisions are often used when you want to direct traffic from one snapshot of your container app to the next. Typical traffic direction strategies include [A/B testing](https://wikipedia.org/wiki/A/B_testing) and [BlueGreen deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html).

Revisions may also act as a building block for upgrade strategies for non-HTTP container apps (where ingress is disabled).

## Change types

Changes made to a container app fall under one of two categories: revision-scope and application-scope changes. Revision-scope changes are any change that trigger a new revision, while application-scope changes do not.

The following table shows how changes are categorized.

| Revision-scope | Application-scope |
|---|---|
| Container(s) | Secret values |
| Scale rules | Traffic splitting rules |
| Dapr settings | Turning ingress on or off |

In the end, any change that affects the `template` section of the container app's configuration creates a new revision. Alternatively, any change outside the `template` section, does not create a new revision.

## Shutdown

The containers are shut down in the following situations:

- When the container app scales in.
- When a container app is being deleted.
- When a revision is being deactivated.

When a shutdown is initiated, the container host sends a [SIGTERM message](https://wikipedia.org/wiki/Signal_(IPC)) to your container. The code implemented in the container can respond to this operating system-level message to close connections and shut down services.

If your application does not respond to `SIGTERM` in *** seconds, then a [SIGKILL](https://wikipedia.org/wiki/Signal_(IPC)) message is sent to the application running in the container.

## Delete a container app

```sh
az containerapp delete -n myapp -g myRG
```

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
