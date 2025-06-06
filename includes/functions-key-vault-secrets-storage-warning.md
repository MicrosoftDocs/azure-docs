---
author: nzthiago
ms.service: azure-functions
ms.topic: include
ms.date: 06/06/2025
ms.author: thalme
---

> [!IMPORTANT]
>  Secrets aren't scoped to individual function apps through the `AzureWebJobsSecretStorageKeyVaultUri` setting. If multiple function apps are configured to use the same Key Vault they share the same secrets, potentially leading to key collisions or overwrites. To avoid unintended behavior, it's recommended to use a separate Key Vault instance for each function app.