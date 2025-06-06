---
author: nzthiago
ms.service: azure-functions
ms.topic: include
ms.date: 06/06/2025
ms.author: thalme
---

> [!IMPORTANT]
> When using Azure Key Vault for key storage via the `AzureWebJobsSecretStorageKeyVaultUri` setting, secrets are not automatically scoped to individual function apps. If multiple function apps are configured to use the same Key Vault, they will share the same secret store, potentially leading to key collisions or overwrites. To avoid unintended behavior, it is strongly recommended to use a separate Key Vault instance for each function app.