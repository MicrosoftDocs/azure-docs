---
title: include file
description: include file
services: cosmos-db
author: seesharprun
ms.service: cosmos-db
ms.topic: include
ms.date: 11/07/2022
ms.author: sidandrews
ms.reviewer: mjbrown
ms.custom: include file, ignite-2022
---

This quickstart will create a single Azure Cosmos DB account using the API for NoSQL.

#### [Portal](#tab/azure-portal)

> [!TIP]
> For this quickstart, we recommend using the resource group name ``msdocs-cosmos-quickstart-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Select API option** page, select the **Create** option within the **NoSQL** section. Azure Cosmos DB has six APIs: NoSQL, MongoDB, PostgreSQL, Apache Cassandra, Apache Gremlin, and Table. [Learn more about the API for NoSQL](../index.yml).

   :::image type="content" source="media/create-resources/choose-api.png" lightbox="media/create-resources/choose-api.png" alt-text="Screenshot of select API option page for Azure Cosmos DB.":::

1. On the **Create Azure Cosmos DB Account** page, enter the following information:

   | Setting | Value | Description |
   | --- | --- | --- |
   | Subscription | Subscription name | Select the Azure subscription that you wish to use for this Azure Cosmos account. |
   | Resource Group | Resource group name | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
   | Account Name | A unique name | Enter a name to identify your Azure Cosmos account. The name will be used as part of a fully qualified domain name (FQDN) with a suffix of *documents.azure.com*, so the name must be globally unique. The name can only contain lowercase letters, numbers, and the hyphen (-) character. The name must also be between 3-44 characters in length. |
   | Location | The region closest to your users | Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. |
   | Capacity mode |Provisioned throughput or Serverless|Select **Provisioned throughput** to create an account in [provisioned throughput](../../set-throughput.md) mode. Select **Serverless** to create an account in [serverless](../../serverless.md) mode. |
   | Apply Azure Cosmos DB free tier discount | **Apply** or **Do not apply** | Enable Azure Cosmos DB free tier. With Azure Cosmos DB free tier, you'll get the first 1000 RU/s and 25 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/). |

   > [!NOTE]
   > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.

   :::image type="content" source="media/create-resources/configuration-basics.png" alt-text="Screenshot of new account page for API for NoSQL.":::

1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

1. Select **Go to resource** to go to the Azure Cosmos DB account page.

   :::image type="content" source="media/create-resources/deployment-complete.png" alt-text="Screenshot of deployment page for API for NoSQL resource.":::

1. From the API for NoSQL account page, select the **Keys** navigation menu option.

   :::image type="content" source="media/create-resources/select-resource-menu-keys.png" alt-text="Screenshot of an API for NoSQL account page. The Keys option is highlighted in the navigation menu.":::

1. Record the values from the **URI** and **PRIMARY KEY** fields. You'll use these values in a later step.

   :::image type="content" source="media/create-resources/get-endpoint-credentials.png" alt-text="Screenshot of Keys page with various credentials for an API for NoSQL account.":::

#### [Azure CLI](#tab/azure-cli)

1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-quickstart-rg"
    location="westus"

    # Variable for account name with a randomly generated suffix
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

1. Use the [``az cosmosdb create``](/cli/azure/cosmosdb#az-cosmosdb-create) command to create a new API for NoSQL account with default settings.

    ```azurecli-interactive
    az cosmosdb create \
        --resource-group $resourceGroupName \
        --name $accountName \
        --locations regionName=$location \
        --enable-free-tier true
    ```

    > [!NOTE]
    > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier. To find other free-tier enabled accounts, see [find an existing Azure Cosmos DB free-tier account in a subscription](../../scripts/cli/common/free-tier.md#run-the-script).

1. Get the API for NoSQL endpoint *URI* for the account using the [``az cosmosdb show``](/cli/azure/cosmosdb#az-cosmosdb-show) command.

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $accountName \
        --query "documentEndpoint"
    ```

1. Find the *PRIMARY KEY* from the list of keys for the account with the [`az-cosmosdb-keys-list`](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command.

    ```azurecli-interactive
    az cosmosdb keys list \
        --resource-group $resourceGroupName \
        --name $accountName \
        --type "keys" \
        --query "primaryMasterKey"
    ```

1. Record the *URI* and *PRIMARY KEY* values. You'll use these credentials later.

#### [PowerShell](#tab/azure-powershell)

1. Create shell variables for *ACCOUNT_NAME*, *RESOURCE_GROUP_NAME*, and **LOCATION**.

    ```azurepowershell-interactive
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "msdocs-cosmos-quickstart-rg"
    $LOCATION = "West US"
    
    # Variable for account name with a randomly generated suffix
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

1. Use the [``New-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet to create a new API for NoSQL account with default settings.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Location = $LOCATION
        EnableFreeTier = true
    }
    New-AzCosmosDBAccount @parameters
    ```

   > [!NOTE]
   > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.

1. Get the API for NoSQL endpoint *URI* for the account using the [``Get-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) cmdlet.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
    }
    Get-AzCosmosDBAccount @parameters |
        Select-Object -Property "DocumentEndpoint"
    ```

1. Find the *PRIMARY KEY* from the list of keys for the account with the [``Get-AzCosmosDBAccountKey``](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey) cmdlet.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Type = "Keys"
    }    
    Get-AzCosmosDBAccountKey @parameters |
        Select-Object -Property "PrimaryMasterKey"    
    ```

1. Record the *URI* and *PRIMARY KEY* values. You'll use these credentials later.

---
