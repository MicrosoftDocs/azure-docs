---
author: anaharris-ms
ms.service: app-service
ms.topic: include
ms.date: 08/08/2024
ms.author: anaharris
---

### Configuration

- Existing [Key Vault references](../app-service/app-service-key-vault-references.md) can't be exported across an Azure geographical boundary. You must recreate any required references in the new region.

- Your app configuration might be managed by [Azure App Configuration](../azure-app-configuration/overview.md) or from some other central (downstream) database dependency. Review any App Configuration store or similar stores for environment and region-specific settings that might require modifications. 