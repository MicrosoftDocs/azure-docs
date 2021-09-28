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

The Azure Container Apps application lifecycle revolves around container [revisions](revisions.md).

If your container crashes, then it is automatically restarted.

## Shutdown

The containers are shut down in the following situations:

- as a container app scales in
- as a container app is being deleted
- as a revision is being deactivated

When a shutdown is initiated, the container host sends a [SIGTERM message](https://wikipedia.org/wiki/Signal_(IPC)) to your container. The code implemented in the container can respond to this operating system-level message to handle termination.

If your application does not respond to the `SIGTERM` message in *** seconds, then a [SIGKILL](https://wikipedia.org/wiki/Signal_(IPC)) message is sent to the application running in the container.

## Delete a container app

```sh
az containerapp delete -n myapp -g myRG
```

## Next steps

> [!div class="nextstepaction"]
> [Work with revisions](revisions.md)
