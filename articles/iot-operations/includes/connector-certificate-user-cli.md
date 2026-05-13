---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 05/12/2026
ms.author: dobett
ai-usage: ai-assisted
---

1. Make sure the client certificate and private key are stored as secrets in Azure Key Vault. To learn more, see [Sync a client certificate and private key for mutual TLS](../secure-iot-ops/howto-manage-secrets.md#sync-a-client-certificate-and-private-key-for-mutual-tls).

1. Create a single synced secret on the cluster that references both Key Vault secrets. The following example creates a synced secret named `my-endpoint-cert` that maps the Key Vault secrets `my-kv-client-cert` and `my-kv-client-key` to the keys `certificate` and `privateKey`:

    ```azurecli
    az iot ops secretsync secret set \
      --instance <your-instance-name> \
      --resource-group <your-resource-group> \
      --name my-endpoint-cert \
      --secret target=certificate source=my-kv-client-cert \
      --secret target=privateKey source=my-kv-client-key
    ```

    For more information, see [az iot ops secretsync secret set](/cli/azure/iot/ops/secretsync/secret#az-iot-ops-secretsync-secret-set).

1. Use the [az iot ops ns device endpoint inbound add](/cli/azure/iot/ops/ns/device/endpoint/inbound/add) command with the `--cert-ref` and `--key-ref` parameters to reference the synced secret name and key for the certificate and private key (for example, `my-endpoint-cert/certificate` and `my-endpoint-cert/privateKey`). To include intermediate certificates, add `--icr my-endpoint-cert/intermediateCerts`.

> [!NOTE]
> This Azure CLI flow partially overlaps with the operations experience. The operations experience can also upload the certificate and private key to Azure Key Vault as part of the same step, while the Azure CLI flow assumes the secrets already exist in Azure Key Vault.
