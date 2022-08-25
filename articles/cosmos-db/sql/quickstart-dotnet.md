---
title: Quickstart - Azure Cosmos DB SQL API client library for .NET
description: Learn how to build a .NET app to manage Azure Cosmos DB SQL API account resources in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.devlang: csharp
ms.topic: quickstart
ms.date: 07/26/2022
ms.custom: devx-track-csharp
---

# Quickstart: Azure Cosmos DB SQL API client library for .NET

[!INCLUDE[appliesto-sql-api](../includes/appliesto-sql-api.md)]

> [!div class="op_single_selector"]
>
> * [.NET](quickstart-dotnet.md)
> * [Node.js](create-sql-api-nodejs.md)
> * [Java](create-sql-api-java.md)
> * [Spring Data](create-sql-api-spring-data.md)
> * [Python](create-sql-api-python.md)
> * [Spark v3](create-sql-api-spark.md)
> * [Go](create-sql-api-go.md)
>

Get started with the Azure Cosmos DB client library for .NET to create databases, containers, and items within your account.  Without a credit card or an Azure subscription, you can set up a free [Try Azure Cosmos DB account](https://aka.ms/trycosmosdb). Follow these steps to  install the package and try out example code for basic tasks.

> [!NOTE]
> The [example code snippets](https://github.com/Azure-Samples/azure-cosmos-db-dotnet-quickstart) are available on GitHub as a .NET project.

[API reference documentation](/dotnet/api/microsoft.azure.cosmos) | [Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) | [Samples](samples-dotnet.md)

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://aka.ms/trycosmosdb).
* [.NET 6.0 or later](https://dotnet.microsoft.com/download)
* [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

### Prerequisite check

* In a terminal or command window, run ``dotnet --version`` to check that the .NET SDK is version 6.0 or later.
* Run ``az --version`` (Azure CLI) or ``Get-Module -ListAvailable AzureRM`` (Azure PowerShell) to check that you have the appropriate Azure command-line tools installed.

## Setting up

This section walks you through creating an Azure Cosmos account and setting up a project that uses Azure Cosmos DB SQL API client library for .NET to manage resources.

### Create an Azure Cosmos DB account

This quickstart will create a single Azure Cosmos DB account using the SQL API.

#### [Azure CLI](#tab/azure-cli)

1. Create shell variables for *accountName*, *resourceGroupName*, and *location*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-quickstart-rg"
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

1. Use the [``az cosmosdb create``](/cli/azure/cosmosdb#az-cosmosdb-create) command to create a new Azure Cosmos DB SQL API account with default settings.

    ```azurecli-interactive
    az cosmosdb create \
        --resource-group $resourceGroupName \
        --name $accountName \
        --locations regionName=$location
    ```

1. Get the SQL API endpoint *URI* for the account using the [``az cosmosdb show``](/cli/azure/cosmosdb#az-cosmosdb-show) command.

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

1. Use the [``New-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/new-azcosmosdbaccount) cmdlet to create a new Azure Cosmos DB SQL API account with default settings.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Location = $LOCATION
    }
    New-AzCosmosDBAccount @parameters
    ```

1. Get the SQL API endpoint *URI* for the account using the [``Get-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) cmdlet.

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

#### [Portal](#tab/azure-portal)

> [!TIP]
> For this quickstart, we recommend using the resource group name ``msdocs-cosmos-quickstart-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the Azure portal menu or the **Home page**, select **Create a resource**.

1. On the **New** page, search for and select **Azure Cosmos DB**.

1. On the **Select API option** page, select the **Create** option within the **Core (SQL) - Recommend** section. Azure Cosmos DB has five APIs: SQL, MongoDB, Gremlin, Table, and Cassandra. [Learn more about the SQL API](../index.yml).

   :::image type="content" source="media/create-account-portal/cosmos-api-choices.png" lightbox="media/create-account-portal/cosmos-api-choices.png" alt-text="Screenshot of select A P I option page for Azure Cosmos DB.":::

1. On the **Create Azure Cosmos DB Account** page, enter the following information:

   | Setting | Value | Description |
   | --- | --- | --- |
   | Subscription | Subscription name | Select the Azure subscription that you wish to use for this Azure Cosmos account. |
   | Resource Group | Resource group name | Select a resource group, or select **Create new**, then enter a unique name for the new resource group. |
   | Account Name | A unique name | Enter a name to identify your Azure Cosmos account. The name will be used as part of a fully qualified domain name (FQDN) with a suffix of *documents.azure.com*, so the name must be globally unique. The name can only contain lowercase letters, numbers, and the hyphen (-) character. The name must also be between 3-44 characters in length. |
   | Location | The region closest to your users | Select a geographic location to host your Azure Cosmos DB account. Use the location that is closest to your users to give them the fastest access to the data. |
   | Capacity mode |Provisioned throughput or Serverless|Select **Provisioned throughput** to create an account in [provisioned throughput](../set-throughput.md) mode. Select **Serverless** to create an account in [serverless](../serverless.md) mode. |
   | Apply Azure Cosmos DB free tier discount | **Apply** or **Do not apply** |With Azure Cosmos DB free tier, you'll get the first 1000 RU/s and 25 GB of storage for free in an account. Learn more about [free tier](https://azure.microsoft.com/pricing/details/cosmos-db/). |

   > [!NOTE]
   > You can have up to one free tier Azure Cosmos DB account per Azure subscription and must opt-in when creating the account. If you do not see the option to apply the free tier discount, this means another account in the subscription has already been enabled with free tier.

   :::image type="content" source="media/create-account-portal/new-cosmos-account-page.png" lightbox="media/create-account-portal/new-cosmos-account-page.png" alt-text="Screenshot of new account page for Azure Cosmos D B SQL A P I.":::

1. Select **Review + create**.

1. Review the settings you provide, and then select **Create**. It takes a few minutes to create the account. Wait for the portal page to display **Your deployment is complete** before moving on.

1. Select **Go to resource** to go to the Azure Cosmos DB account page.

   :::image type="content" source="media/create-account-portal/cosmos-deployment-complete.png" lightbox="media/create-account-portal/cosmos-deployment-complete.png" alt-text="Screenshot of deployment page for Azure Cosmos DB SQL A P I resource.":::

1. From the Azure Cosmos DB SQL API account page, select the **Keys** navigation menu option.

   :::image type="content" source="media/get-credentials-portal/cosmos-keys-option.png" lightbox="media/get-credentials-portal/cosmos-keys-option.png" alt-text="Screenshot of an Azure Cosmos DB SQL A P I account page. The Keys option is highlighted in the navigation menu.":::

1. Record the values from the **URI** and **PRIMARY KEY** fields. You'll use these values in a later step.

   :::image type="content" source="media/get-credentials-portal/cosmos-endpoint-key-credentials.png" lightbox="media/get-credentials-portal/cosmos-endpoint-key-credentials.png" alt-text="Screenshot of Keys page with various credentials for an Azure Cosmos DB SQL A P I account.":::

#### [Resource Manager template](#tab/azure-resource-manager)

> [!NOTE]
> Azure Resource Manager templates are written in two syntaxes, JSON and Bicep. This sample uses the [Bicep](../../azure-resource-manager/bicep/overview.md) syntax. To learn more about the two syntaxes, see [comparing JSON and Bicep for templates](../../azure-resource-manager/bicep/compare-template-syntax.md).

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

1. Create a new ``.bicep`` file with the deployment template in the Bicep syntax.

    :::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql-minimal/main.bicep":::

1. Deploy the Azure Resource Manager (ARM) template with [``az deployment group create``](/cli/azure/deployment/group#az-deployment-group-create)
specifying the filename using the **template-file** parameter and the name ``initial-bicep-deploy`` using the **name** parameter.

    ```azurecli-interactive
    az deployment group create \
        --resource-group $resourceGroupName \
        --name initial-bicep-deploy \
        --template-file main.bicep \
        --parameters accountName=$accountName
    ```

    > [!NOTE]
    > In this example, we assume that the name of the Bicep file is **main.bicep**.

1. Validate the deployment by showing metadata from the newly created account using [``az cosmosdb show``](/cli/azure/cosmosdb#az-cosmosdb-show).

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $accountName
    ```

---

### Create a new .NET app

Create a new .NET application in an empty folder using your preferred terminal. Use the [``dotnet new``](/dotnet/core/tools/dotnet-new) command specifying the **console** template.

```dotnetcli
dotnet new console
```

### Install the package

Add the [Microsoft.Azure.Cosmos](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) NuGet package to the .NET project. Use the [``dotnet add package``](/dotnet/core/tools/dotnet-add-package) command specifying the name of the NuGet package.

```dotnetcli
dotnet add package Microsoft.Azure.Cosmos
```

Build the project with the [``dotnet build``](/dotnet/core/tools/dotnet-build) command.

```dotnetcli
dotnet build
```

Make sure that the build was successful with no errors. The expected output from the build should look something like this:

```output
  Determining projects to restore...
  All projects are up-to-date for restore.
  dslkajfjlksd -> C:\Users\sidandrews\Demos\dslkajfjlksd\bin\Debug\net6.0\dslkajfjlksd.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)
```

### Configure environment variables

To use the **URI** and **PRIMARY KEY** values within your .NET code, persist them to new environment variables on the local machine running the application. To set the environment variable, use your preferred terminal to run the following commands:

#### [Windows](#tab/windows)

```powershell
$env:COSMOS_ENDPOINT = "<cosmos-account-URI>"
$env:COSMOS_KEY = "<cosmos-account-PRIMARY-KEY>"
```

#### [Linux / macOS](#tab/linux+macos)

```bash
export COSMOS_ENDPOINT="<cosmos-account-URI>"
export COSMOS_KEY="<cosmos-account-PRIMARY-KEY>"
```

---

## Object model

Before you start building the application, let's look into the hierarchy of resources in Azure Cosmos DB. Azure Cosmos DB has a specific object model used to create and access resources. The Azure Cosmos DB creates resources in a hierarchy that consists of accounts, databases, containers, and items.

:::image type="complex" source="media/quickstart-dotnet/resource-hierarchy.svg" alt-text="Diagram of the Azure Cosmos DB hierarchy including accounts, databases, containers, and items." border="false":::
    Hierarchical diagram showing an Azure Cosmos DB account at the top. The account has two child database nodes. One of the database nodes includes two child container nodes. The other database node includes a single child container node. That single container node has three child item nodes.
:::image-end:::

For more information about the hierarchy of different resources, see [working with databases, containers, and items in Azure Cosmos DB](../account-databases-containers-items.md).

You'll use the following .NET classes to interact with these resources:

* [``CosmosClient``](/dotnet/api/microsoft.azure.cosmos.cosmosclient) - This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service.
* [``Database``](/dotnet/api/microsoft.azure.cosmos.database) - This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it.
* [``Container``](/dotnet/api/microsoft.azure.cosmos.container) - This class is a reference to a container that also may not exist in the service yet. The container is validated server-side when you attempt to work with it.
* [``QueryDefinition``](/dotnet/api/microsoft.azure.cosmos.querydefinition) - This class represents a SQL query and any query parameters.
* [``FeedIterator<>``](/dotnet/api/microsoft.azure.cosmos.feediterator-1) - This class represents an iterator that can track the current page of results and get a new page of results.
* [``FeedResponse<>``](/dotnet/api/microsoft.azure.cosmos.feedresponse-1) - This class represents a single page of responses from the iterator. This type can be iterated over using a ``foreach`` loop.

## Code examples

* [Authenticate the client](#authenticate-the-client)
* [Create a database](#create-a-database)
* [Create a container](#create-a-container)
* [Create an item](#create-an-item)
* [Get an item](#get-an-item)
* [Query items](#query-items)

The sample code described in this article creates a database named ``adventureworks`` with a container named ``products``. The ``products`` table is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this sample code, the container will use the category as a logical partition key.

### Authenticate the client

From the project directory, open the *Program.cs* file. In your editor, add a using directive for ``Microsoft.Azure.Cosmos``.

:::code language="csharp" source="~/azure-cosmos-dotnet-v3/001-quickstart/Program.cs" id="using_directives":::

Define a new instance of the ``CosmosClient`` class using the constructor, and [``Environment.GetEnvironmentVariable``](/dotnet/api/system.environment.getenvironmentvariable) to read the two environment variables you created earlier.

:::code language="csharp" source="~/azure-cosmos-dotnet-v3/001-quickstart/Program.cs" id="client_credentials" highlight="3-4":::

For more information on different ways to create a ``CosmosClient`` instance, see [Get started with Azure Cosmos DB SQL API and .NET](how-to-dotnet-get-started.md#connect-to-azure-cosmos-db-sql-api).

### Create a database

Use the [``CosmosClient.CreateDatabaseIfNotExistsAsync``](/dotnet/api/microsoft.azure.cosmos.cosmosclient.createdatabaseifnotexistsasync) method to create a new database if it doesn't already exist. This method will return a reference to the existing or newly created database.

:::code language="csharp" source="~/azure-cosmos-dotnet-v3/001-quickstart/Program.cs" id="new_database" highlight="3":::

For more information on creating a database, see [Create a database in Azure Cosmos DB SQL API using .NET](how-to-dotnet-create-database.md).

### Create a container

The [``Database.CreateContainerIfNotExistsAsync``](/dotnet/api/microsoft.azure.cosmos.database.createcontainerifnotexistsasync) will create a new container if it doesn't already exist. This method will also return a reference to the container.

:::code language="csharp" source="~/azure-cosmos-dotnet-v3/001-quickstart/Program.cs" id="new_container" highlight="3-5":::

For more information on creating a container, see [Create a container in Azure Cosmos DB SQL API using .NET](how-to-dotnet-create-container.md).

### Create an item

The easiest way to create a new item in a container is to first build a C# [class](/dotnet/csharp/language-reference/keywords/class) or [record](/dotnet/csharp/language-reference/builtin-types/record) type with all of the members you want to serialize into JSON. In this example, the C# record has a unique identifier, a *category* field for the partition key, and extra *name*, *quantity*, and *sale* fields.

:::code language="csharp" source="~/azure-cosmos-dotnet-v3/001-quickstart/Product.cs" id="entity" highlight="3-4":::

Create an item in the container by calling [``Container.UpsertItemAsync``](/dotnet/api/microsoft.azure.cosmos.container.upsertitemasync). In this example, we chose to *upsert* instead of *create* a new item in case you run this sample code more than once.

:::code language="csharp" source="~/azure-cosmos-dotnet-v3/001-quickstart/Program.cs" id="new_item" highlight="3-4,12":::

For more information on creating, upserting, or replacing items, see [Create an item in Azure Cosmos DB SQL API using .NET](how-to-dotnet-create-item.md).

### Get an item

In Azure Cosmos DB, you can perform a point read operation by using both the unique identifier (``id``) and partition key fields. In the SDK, call [``Container.ReadItemAsync<>``](/dotnet/api/microsoft.azure.cosmos.container.readitemasync) passing in both values to return a deserialized instance of your C# type.

:::code language="csharp" source="~/azure-cosmos-dotnet-v3/001-quickstart/Program.cs" id="read_item" highlight="3-4":::

For more information about reading items and parsing the response, see [Read an item in Azure Cosmos DB SQL API using .NET](how-to-dotnet-read-item.md).

### Query items

After you insert an item, you can run a query to get all items that match a specific filter. This example runs the SQL query: ``SELECT * FROM todo t WHERE t.partitionKey = 'gear-surf-surfboards'``. This example uses the **QueryDefinition** type and a parameterized query expression for the partition key filter. Once the query is defined, call [``Container.GetItemQueryIterator<>``](/dotnet/api/microsoft.azure.cosmos.container.getitemqueryiterator) to get a result iterator that will manage the pages of results. Then, use a combination of ``while`` and ``foreach`` loops to retrieve pages of results and then iterate over the individual items.

:::code language="csharp" source="~/azure-cosmos-dotnet-v3/001-quickstart/Program.cs" id="query_items" highlight="3,5,16":::

## Run the code

This app creates an Azure Cosmos DB SQL API database and container. The example then creates an item and then reads the exact same item back. Finally, the example issues a query that should only return that single item. With each step, the example outputs metadata to the console about the steps it has performed.

To run the app, use a terminal to navigate to the application directory and run the application.

```dotnetcli
dotnet run
```

The output of the app should be similar to this example:

```output
New database:   adventureworks
New container:  products
Created item:   68719518391     [gear-surf-surfboards]
```

## Clean up resources

When you no longer need the Azure Cosmos DB SQL API account, you can delete the corresponding resource group.

### [Azure CLI / Resource Manager template](#tab/azure-cli+azure-resource-manager)

Use the [``az group delete``](/cli/azure/group#az-group-delete) command to delete the resource group.

```azurecli-interactive
az group delete --name $resourceGroupName
```

### [PowerShell](#tab/azure-powershell)

Use the [``Remove-AzResourceGroup``](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to delete the resource group.

```azurepowershell-interactive
$parameters = @{
    Name = $RESOURCE_GROUP_NAME
}
Remove-AzResourceGroup @parameters
```

### [Portal](#tab/azure-portal)

1. Navigate to the resource group you previously created in the Azure portal.

    > [!TIP]
    > In this quickstart, we recommended the name ``msdocs-cosmos-quickstart-rg``.
1. Select **Delete resource group**.

   :::image type="content" source="media/delete-account-portal/delete-resource-group-option.png" lightbox="media/delete-account-portal/delete-resource-group-option.png" alt-text="Screenshot of the Delete resource group option in the navigation bar for a resource group.":::

1. On the **Are you sure you want to delete** dialog, enter the name of the resource group, and then select **Delete**.

   :::image type="content" source="media/delete-account-portal/delete-confirmation.png" lightbox="media/delete-account-portal/delete-confirmation.png" alt-text="Screenshot of the delete confirmation page for a resource group.":::

---

## Next steps

In this quickstart, you learned how to create an Azure Cosmos DB SQL API account, create a database, and create a container using the .NET SDK. You can now dive deeper into the SDK to import more data, perform complex queries, and manage your Azure Cosmos DB SQL API resources.

> [!div class="nextstepaction"]
> [Get started with Azure Cosmos DB SQL API and .NET](how-to-dotnet-get-started.md)
