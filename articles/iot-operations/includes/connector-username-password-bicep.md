---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 05/12/2026
ms.author: dobett
ms.service: azure-iot-operations
ai-usage: ai-assisted
---

1. Make sure the username and password are stored as secrets in Azure Key Vault, and that a synced secret on the cluster references both Key Vault secrets. You can create the synced secret either through the operations experience or by using the Azure CLI. To learn more, see [Manage secrets for your Azure IoT Operations deployment](../secure-iot-ops/howto-manage-secrets.md#add-and-use-secrets).

1. Modify the `authentication` block of your Bicep configuration for the connector to reference the synced secret on the cluster. The `usernameSecretName` and `passwordSecretName` values use the form `<synced-secret-name>/<key>`:

    ```bicep
    authentication: {
        method: 'UsernamePassword'
            usernamePasswordCredentials: {
                usernameSecretName: 'my-endpoint-creds/username'
                passwordSecretName: 'my-endpoint-creds/password'
            }
    }
    ```

> [!NOTE]
> The Azure CLI flow for creating the synced secret partially overlaps with the operations experience. The operations experience can also upload the secret to Azure Key Vault as part of the same step, while the Azure CLI flow assumes the secret already exists in Azure Key Vault.
