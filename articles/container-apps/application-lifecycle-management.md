---
title: Application lifecycle management in Azure Container Apps
description: Learn about the full application lifecycle in Azure Container Apps
services: app-service
author: craigshoemaker
ms.service: app-service
ms.topic:  conceptual
ms.date: 11/01/2021
ms.author: cshoe
---

# Application lifecycle management in Azure Container Apps

<!-- PRELIMINARY OUTLINE

What happens when I deploy an app?

What happens as it scales?

How do I make changes?
- application scope changes
    - managing secrets
    - managing traffic (% splitting)
- revision scope
    - code changes
    - container changes
    - scale settings
    - dapr settings

What happens when something goes wrong?
- deployment
    - container failed to start - bug somewhere
- scale
    - scale settings are misconfigured - too aggressively or not aggressive enough
        - do your due diligence - load testing, etc.
- upgrades
    - new revision is broken, what do you do?
        - tools - shift traffic, activate/deactivate through revisions
-->

## Next steps

> [!div class="nextstepaction"]
> [Get started](get-started.md)
