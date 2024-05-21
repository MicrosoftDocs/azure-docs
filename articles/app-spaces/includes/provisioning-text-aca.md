---
author: msangapu-msft
ms.author: msangapu
ms.topic: include
ms.date: 05/22/2024
---

For a backend app, App Spaces creates the following resources for you during deployment:
- Azure Container App environment
- Azure Container App
- Virtual network + subnet (sub resource of virtual network)
- Continuous deployment with GitHub Actions
- Contributor RBAC role assigned to user-assigned identity over the scope of the resource group (for OIDC purposes)
- A Log Analytics workspace
