---
title: Include file
description: Include file
author: dominicbetts
ms.topic: include
ms.date: 05/12/2026
ms.author: dobett
---

1. Make sure the username and password are stored as secrets in Azure Key Vault. To learn more, see [Add secrets to Azure Key Vault](../secure-iot-ops/howto-manage-secrets.md#add-secrets-to-azure-key-vault).

1. Create a single synced secret on the cluster that references both Key Vault secrets. The following example creates a synced secret named `my-endpoint-creds` that maps the Key Vault secrets `my-kv-username` and `my-kv-password` to the keys `username` and `password`:

    ```azurecli
    az iot ops secretsync secret set \
      --instance <your-instance-name> \
      --resource-group <your-resource-group> \
      --name my-endpoint-creds \
      --secret target=username source=my-kv-username \
      --secret target=password source=my-kv-password
    ```

    For more information, see [az iot ops secretsync secret set](/cli/azure/iot/ops/secretsync/secret#az-iot-ops-secretsync-secret-set).

1. Use the [az iot ops ns device endpoint inbound add](/cli/azure/iot/ops/ns/device/endpoint/inbound/add) command with the `--user-ref` and `--pass-ref` parameters to reference the synced secret name and key for the username and password (for example, `my-endpoint-creds/username` and `my-endpoint-creds/password`).

> [!NOTE]
> This Azure CLI flow partially overlaps with the operations experience. The operations experience can also upload the secret to Azure Key Vault as part of the same step, while the Azure CLI flow assumes the secret already exists in Azure Key Vault.