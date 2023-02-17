---
title: Use a managed identity to access Azure Key Vault from Azure Cosmos DB
description: Use managed identity in Azure Cosmos DB to access Azure Key Vault. 
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.devlang: csharp
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/01/2022
ms.reviewer: thweiss
---

# Access Azure Key Vault from Azure Cosmos DB using a managed identity
[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Azure Cosmos DB may need to read secret/key data from Azure Key Vault. For example, your Azure Cosmos DB may require a customer-managed key stored in Azure Key Vault. To do this, Azure Cosmos DB should be configured with a managed identity, and then an Azure Key Vault access policy should grant the managed identity access.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure Cosmos DB API for NoSQL account. [Create an Azure Cosmos DB API for NoSQL account](nosql/quickstart-portal.md)
- An existing Azure Key Vault resource. [Create a key vault using the Azure CLI](../key-vault/general/quick-create-cli.md)
- To perform the steps in this article, install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in to Azure](/cli/azure/authenticate-azure-cli).

## Prerequisite check

1. In a terminal or command window, store the names of your Azure Key Vault resource, Azure Cosmos DB account and resource group as shell variables named ``keyVaultName``, ``cosmosName``, and ``resourceGroupName``.

    ```azurecli-interactive
    # Variable for function app name
    keyVaultName="msdocs-keyvault"
    
    # Variable for Azure Cosmos DB account name
    cosmosName="msdocs-cosmos-app"

    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-keyvault-identity"
    ```

    > [!NOTE]
    > These variables will be re-used in later steps. This example assumes your Azure Cosmos DB account name is ``msdocs-cosmos-app``, your key vault name is ``msdocs-keyvault`` and your resource group name is ``msdocs-cosmos-keyvault-identity``.


## Create a system-assigned managed identity in Azure Cosmos DB

First, create a system-assigned managed identity for the existing Azure Cosmos DB account.

> [!IMPORTANT]
> This how-to guide assumes that you are using a system-assigned managed identity. Many of the steps are similar when using a user-assigned managed identity.

1. Run [``az cosmosdb identity assign``](/cli/azure/cosmosdb/identity#az-cosmosdb-identity-assign) to create a new system-assigned managed identity.

    ```azurecli-interactive
    az cosmosdb identity assign \
        --resource-group $resourceGroupName \
        --name $cosmosName 
    ```

1. Retrieve the metadata of the system-assigned managed identity using [``az cosmosdb identity show``](/cli/azure/cosmosdb/identity#az-cosmosdb-identity-show), filter to just return the ``principalId`` property using the **query** parameter, and store the result in a shell variable named ``principal``.

    ```azurecli-interactive
    principal=$(
        az cosmosdb identity show \
            --resource-group $resourceGroupName \
            --name $cosmosName \
            --query principalId \
            --output tsv
    )

    echo $principal
    ```

    > [!NOTE]
    > This variable will be re-used in a later step.

## Create an Azure Key Vault access policy

In this step, create an access policy in Azure Key Vault using the previously managed identity.

1. Use the [``az keyvault set-policy``](/cli/azure/keyvault#az-keyvault-set-policy) command to create an access policy in Azure Key Vault that gives the Azure Cosmos DB managed identity permission to access Key Vault. Specifically, the policy will use the **key-permissions** parameters to grant permissions to ``get``, ``list``, and ``import`` keys.

    ```azurecli-interactive
    az keyvault set-policy \
        --name $keyVaultName \
        --object-id $principal \
        --key-permissions get list import
    ```

## Next steps

* To use customer-managed keys in Azure Key Vault with your Azure Cosmos DB account, see [configure customer-managed keys](how-to-setup-cmk.md#using-managed-identity)
* To use Azure Key Vault to manage secrets, see [secure credentials](store-credentials-key-vault.md).
