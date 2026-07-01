---
title: Include file
description: Include file
services: api-center


ms.service: azure-api-center
ms.topic: include
ms.date: 04/28/2025

ms.custom: Include file
---


To store the API key as a secret in the key vault, see [Set and retrieve secret in Key Vault](/azure/key-vault/secrets/quick-create-portal).


### Enable a managed identity in your API center

[!INCLUDE [enable-managed-identity](includes/enable-managed-identity.md)]

### Assign the managed identity the Key Vault Secrets User role

[!INCLUDE [configure-managed-identity-kv-secret-user](includes/configure-managed-identity-kv-secret-user.md)]