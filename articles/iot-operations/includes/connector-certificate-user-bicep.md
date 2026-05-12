---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 05/12/2026
ms.author: dobett
---

1. Make sure the client certificate and private key are stored as secrets in Azure Key Vault, and that a synced secret on the cluster references both Key Vault secrets. You can create the synced secret either through the operations experience or by using the Azure CLI. To learn more, see [Sync a client certificate and private key for mutual TLS](../secure-iot-ops/howto-manage-secrets.md#sync-a-client-certificate-and-private-key-for-mutual-tls).

1. Modify the `authentication` block of your Bicep configuration for the device inbound endpoint to reference the synced secret on the cluster. The `certificateSecretName` and `keySecretName` values use the form `<synced-secret-name>/<key>`:

    ```bicep
    authentication: {
        method: 'Certificate'
            x509Credentials: {
                certificateSecretName: 'my-endpoint-cert/certificate'
                keySecretName: 'my-endpoint-cert/privateKey'
            }
    }
    ```

> [!NOTE]
> The Azure CLI flow for creating the synced secret partially overlaps with the operations experience. The operations experience can also upload the certificate and private key to Azure Key Vault as part of the same step, while the Azure CLI flow assumes the secrets already exist in Azure Key Vault.
