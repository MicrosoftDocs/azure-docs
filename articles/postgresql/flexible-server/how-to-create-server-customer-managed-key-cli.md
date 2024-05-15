---
title: Create and manage with data encrypted by customer managed keys using the Azure CLI
description: Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys using the Azure CLI.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
---
# Create and manage  Azure Database for PostgreSQL - Flexible Server with data  encrypted by Customer Managed Keys (CMK) using the Azure CLI

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

> [!NOTE]  
> CLI examples below are based on 2.45.0 version of Azure Database for PostgreSQL flexible server CLI libraries

In this article, you learn how to create and manage Azure Database for PostgreSQL flexible server with data  encrypted by customer managed keys using the Azure CLI. To learn more about the customer managed keys (CMK) feature with Azure Database for PostgreSQL flexible server, see the [overview](concepts-data-encryption.md).

## Set up customer managed key during server creation

Prerequisites:

- You must have an Azure subscription and be an administrator on that subscription.

Follow the steps below to enable CMK while creating an Azure Database for PostgreSQL flexible server instance using Azure CLI.

1.  Create a key vault and a key to use for a customer-managed key. Also enable purge protection and soft delete on the key vault.

```azurecli-interactive
     az keyvault create -g <resource_group> -n <vault_name> --location <azure_region> --enable-purge-protection true
```

2.  In the created Azure Key Vault, create the key that will be used for the data encryption of the Azure Database for PostgreSQL flexible server instance.

```azurecli-interactive
     keyIdentifier=$(az keyvault key create --name <key_name> -p software --vault-name <vault_name> --query key.kid -o tsv)
```
3. Create Managed Identity which will be used to retrieve key from Azure Key Vault.
```azurecli-interactive
 identityPrincipalId=$(az identity create -g <resource_group> --name <identity_name> --location <azure_region> --query principalId -o tsv)
```

4. Add access policy with key permissions of *wrapKey*,*unwrapKey*, *get*, *list* in Azure KeyVault to the managed identity you created above.
```azurecli-interactive
az keyvault set-policy -g <resource_group> -n <vault_name>  --object-id $identityPrincipalId --key-permissions wrapKey unwrapKey get list
```
5.  Finally, create an Azure Database for PostgreSQL flexible server instance with CMK based encryption enabled.
```azurecli-interactive
az postgres flexible-server create -g <resource_group> -n <postgres_server_name> --location <azure_region>  --key $keyIdentifier --identity <identity_name>
```
## Update customer managed key on the CMK enabled Azure Database for PostgreSQL flexible server instance

Prerequisites:
- You must have an Azure subscription and be an administrator on that subscription.
- Key Vault with key in region where the Azure Database for PostgreSQL flexible server instance will be created. Follow this [tutorial](../../key-vault/general/quick-create-portal.md) to create Key Vault and generate key. 

Follow the steps below to change\rotate key or identity after creation of server with data encryption. 
1. Change key/identity  for data encryption for existing server. First the get new key identifier:
```azurecli-interactive
 newKeyIdentifier=$(az keyvault key show --vault-name <vault_name> --name <key_name>  --query key.kid -o tsv)
```
2. Update server with new key and\or identity.
```azurecli-interactive
  az postgres flexible-server update --resource-group <resource_group> --name <server_name> --key $newKeyIdentifier --identity <identity_name>
```
## Next steps

- [Manage an Azure Database for PostgreSQL - Flexible Server by using the Azure CLI](how-to-manage-server-cli.md)
