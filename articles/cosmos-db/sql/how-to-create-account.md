---
title: Create an Azure Cosmos DB SQL API account
description: Learn how to create a new Azure Cosmos DB SQL API account to store databases, containers, and items.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: how-to
ms.date: 06/08/2022
---

# Create an Azure Cosmos DB SQL API account
[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

An Azure Cosmos DB SQL API account contains all of your Azure Cosmos DB resources: databases, containers, and items. The account provides a unique endpoint for various tools and SDKs to connect to Azure Cosmos DB and perform everyday operations. For more information about the resources in Azure Cosmos DB, see [Azure Cosmos DB resource model](../account-databases-containers-items.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Create an account

Create a single Azure Cosmos DB account using the SQL API.

#### [Azure CLI](#tab/azure-cli)

1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos"

    # Variable for location
    location="westus"

    # Variable for account name with a randomnly generated suffix
    let suffix=$RANDOM*$RANDOM
    accountName="msdocs-$suffix"
    ```

[!INCLUDE [create-cli](../includes/create-sql-api-account-cli.md)]

#### [PowerShell](#tab/azure-powershell)

1. Create shell variables for *ACCOUNT_NAME*, *RESOURCE_GROUP_NAME*, and **LOCATION**.

    ```azurepowershell-interactive
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "msdocs-cosmos"

    # Variable for location
    $LOCATION = "West US"
    
    # Variable for account name with a randomnly generated suffix
    $SUFFIX = Get-Random
    $ACCOUNT_NAME = "msdocs-$SUFFIX"
    ```

[!INCLUDE [create-powershell](../includes/create-sql-api-account-powershell.md)]

#### [Portal](#tab/azure-portal)

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos``.

[!INCLUDE [create-portal](../includes/create-sql-api-account-portal.md)]

#### [Bicep \(ARM\)](#tab/arm-template-bicep)

1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos"

    # Variable for location
    location="westus"

    # Variable for account name with a randomnly generated suffix
    let suffix=$RANDOM*$RANDOM
    accountName="msdocs-$suffix"
    ```

[!INCLUDE [create-arm-bicep](../includes/create-sql-api-account-arm-bicep.md)]

#### [JSON \(ARM\)](#tab/arm-template-json)

1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos"

    # Variable for location
    location="westus"

    # Variable for account name with a randomnly generated suffix
    let suffix=$RANDOM*$RANDOM
    accountName="msdocs-$suffix"
    ```

[!INCLUDE [create-arm-json](../includes/create-sql-api-account-arm-json.md)]

---
