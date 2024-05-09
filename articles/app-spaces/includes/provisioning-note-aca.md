---
author: msangapu-msft
ms.author: msangapu
ms.topic: include
ms.date: 05/22/2024
---

> [!NOTE]
> Azure App Spaces automatically creates the following resources for you during deployment:
> - Workspace
> - Virtual network + subnet (sub resource of virtual network)
> - Container app environment
> - Container app
> - User-assigned managed identity
> - Federated identity credential (sub resource of user identity)
> - Contributor RBAC role assigned to user-assigned identity over the scope of the resource group (for OIDC purposes)
> - Source control (sub resource of container app)
>