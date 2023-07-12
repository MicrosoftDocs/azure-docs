---
title: Create an Azure Cosmos DB for NoSQL account
description: Learn how to create a new Azure Cosmos DB for NoSQL account to store databases, containers, and items.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 06/08/2022
---

# Create an Azure Cosmos DB for NoSQL account
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

An Azure Cosmos DB for NoSQL account contains all of your Azure Cosmos DB resources: databases, containers, and items. The account provides a unique endpoint for various tools and SDKs to connect to Azure Cosmos DB and perform everyday operations. For more information about the resources in Azure Cosmos DB, see [Azure Cosmos DB resource model](../resource-model.md).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).

## Create an account

Create a single Azure Cosmos DB account using the API for NoSQL.

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

1. If you haven't already, sign in to the Azure CLI using the [``az login``](/cli/azure/reference-index#az-login) command.

1. Use the [``az group create``](/cli/azure/group#az-group-create) command to create a new resource group in your subscription.

    ```azurecli-interactive
    az group create \
        --name $resourceGroupName \
        --location $location
    ```

1. Use the [``az cosmosdb create``](/cli/azure/cosmosdb#az-cosmosdb-create) command to create a new Azure Cosmos DB for NoSQL account with default settings.

    ```azurecli-interactive
    az cosmosdb create \
        --resource-group $resourceGroupName \
        --name $accountName \
        --locations regionName=$location
    ```

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

1. If you haven't already, sign in to Azure PowerShell using the [``Connect-AzAccount``](/powershell/module/az.accounts/connect-azaccount) cmdlet.

1. Use the [``New-AzResourceGroup``](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a new resource group in your subscription. 

    ```azurepowershell-interactive
    $parameters = @{
        Name = $RESOURCE_GROUP_NAME
        Location = $LOCATION
    }
    New-AzResourceGroup @parameters    
    ```

1. Use the [``New-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet to create a new Azure Cosmos DB for NoSQL account with default settings. 

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Location = $LOCATION
    }
    New-AzCosmosDBAccount @parameters
    ```

#### [Portal](#tab/azure-portal)

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Select API option** page, select the **Create** option within the **NoSQL - Recommend** section. Azure Cosmos DB has five APIs: SQL, MongoDB, Gremlin, Table, and Cassandra. [Learn more about the API for NoSQL](../index.yml).

   :::image type="content" source="media/create-account-portal/cosmos-api-choices.png" lightbox="media/create-account-portal/cosmos-api-choices.png" alt-text="Screenshot of select API option page for Azure Cosmos DB DB.":::

1. On the **Create Azure Cosmos DB Account** page, enter the following information:

   | Setting | Value | Description |
   | --- | --- | --- |
   | Subscription | Subscription name | Select the Azure subscription that you wish to use for this Azure Cosmos DB account. |
   | Resource Group | Resource group name | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
   | Account Name | A unique name | Enter a name to identify your Azure Cosmos DB account. The name will be used as part of a fully qualified domain name (FQDN) with a suffix of *documents.azure.com*, so the name must be globally unique. The name can only contain lowercase letters, numbers, and the hyphen (-) character. The name must also be between 3-44 characters in length. |
   | Location | The region closest to your users | Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. |
   | Capacity mode |Provisioned throughput or Serverless|Select **Provisioned throughput** to create an account in [provisioned throughput](../set-throughput.md) mode. Select **Serverless** to create an account in [serverless](../serverless.md) mode. |
   | Apply Azure Cosmos DB free tier discount | **Apply** or **Do not apply** |With Azure Cosmos DB free tier, you'll get the first 1000 RU/s and 25 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/). |

   > [!NOTE]
   > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.

   :::image type="content" source="media/create-account-portal/new-cosmos-account-page.png" lightbox="media/create-account-portal/new-cosmos-account-page.png" alt-text="Screenshot of new account page for Azure Cosmos DB DB SQL API.":::

1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

1. Select **Go to resource** to go to the Azure Cosmos DB account page. 

   :::image type="content" source="media/create-account-portal/cosmos-deployment-complete.png" lightbox="media/create-account-portal/cosmos-deployment-complete.png" alt-text="Screenshot of deployment page for Azure Cosmos DB DB SQL API resource.":::

---

## Next steps

In this guide, you learned how to create an Azure Cosmos DB for NoSQL account. You can now create an application with your Azure Cosmos DB account.

> [!div class="nextstepaction"]
> [Create a .NET console application with Azure Cosmos DB for NoSQL](tutorial-dotnet-web-app.md)
