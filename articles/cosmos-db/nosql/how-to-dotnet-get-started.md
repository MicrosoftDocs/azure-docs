---
title: Get started with Azure Cosmos DB for NoSQL using .NET
description: Get started developing a .NET application that works with Azure Cosmos DB for NoSQL. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB for NoSQL endpoint.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: how-to
ms.date: 07/06/2022
ms.custom: devx-track-csharp, devguide-csharp, cosmos-db-dev-journey, devx-track-azurepowershell, devx-track-dotnet, devx-track-azurecli
---

# Get started with Azure Cosmos DB for NoSQL using .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article shows you how to connect to Azure Cosmos DB for NoSQL using the .NET SDK. Once connected, you can perform operations on databases, containers, and items.

[Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) | [Samples](samples-dotnet.md) | [API reference](/dotnet/api/microsoft.azure.cosmos) | [Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3) | [Give Feedback](https://github.com/Azure/azure-cosmos-dotnet-v3/issues)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Azure Cosmos DB for NoSQL account. [Create a API for NoSQL account](how-to-create-account.md).
- [.NET 6.0 or later](https://dotnet.microsoft.com/download)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

## Set up your project

### Create the .NET console application

Create a new .NET application by using the [``dotnet new``](/dotnet/core/tools/dotnet-new) command with the **console** template.

```dotnetcli
dotnet new console
```

Import the [Microsoft.Azure.Cosmos](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) NuGet package using the [``dotnet add package``](/dotnet/core/tools/dotnet-add-package) command.

```dotnetcli
dotnet add package Microsoft.Azure.Cosmos
```

Build the project with the [``dotnet build``](/dotnet/core/tools/dotnet-build) command.

```dotnetcli
dotnet build
```

## <a id="connect-to-azure-cosmos-db-sql-api"></a>Connect to Azure Cosmos DB for NoSQL

To connect to the API for NoSQL of Azure Cosmos DB, create an instance of the [``CosmosClient``](/dotnet/api/microsoft.azure.cosmos.cosmosclient) class. This class is the starting point to perform all operations against databases. There are three core ways to connect to an API for NoSQL account using the **CosmosClient** class:

- [Connect with a API for NoSQL endpoint and read/write key](#connect-with-an-endpoint-and-key)
- [Connect with a API for NoSQL connection string](#connect-with-a-connection-string)
- [Connect with Microsoft Entra ID](#connect-using-the-microsoft-identity-platform)

### Connect with an endpoint and key

The most common constructor for **CosmosClient** has two parameters:

| Parameter | Example value | Description |
| --- | --- | --- |
| ``accountEndpoint`` | ``COSMOS_ENDPOINT`` environment variable | API for NoSQL endpoint to use for all requests |
| ``authKeyOrResourceToken`` | ``COSMOS_KEY`` environment variable | Account key or resource token to use when authenticating |

#### Retrieve your account endpoint and key

##### [Azure CLI](#tab/azure-cli)

1. Create a shell variable for *resourceGroupName*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-dotnet-howto-rg"
    ```

1. Use the [``az cosmosdb list``](/cli/azure/cosmosdb#az-cosmosdb-list) command to retrieve the name of the first Azure Cosmos DB account in your resource group and store it in the *accountName* shell variable.

    ```azurecli-interactive
    # Retrieve most recently created account name
    accountName=$(
        az cosmosdb list \
            --resource-group $resourceGroupName \
            --query "[0].name" \
            --output tsv
    )
    ```

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

##### [PowerShell](#tab/azure-powershell)

1. Create a shell variable for *RESOURCE_GROUP_NAME*.

    ```azurepowershell-interactive
    # Variable for resource group name
    $RESOURCE_GROUP_NAME = "msdocs-cosmos-dotnet-howto-rg"
    ```

1. Use the [``Get-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) cmdlet to retrieve the name of the first Azure Cosmos DB account in your resource group and store it in the *ACCOUNT_NAME* shell variable.

    ```azurepowershell-interactive
    # Retrieve most recently created account name
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
    }
    $ACCOUNT_NAME = (
        Get-AzCosmosDBAccount @parameters |
            Select-Object -Property Name -First 1
    ).Name
    ```

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

##### [Portal](#tab/azure-portal)

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos-dotnet-howto-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the existing Azure Cosmos DB for NoSQL account page.

1. From the Azure Cosmos DB for NoSQL account page, select the **Keys** navigation menu option.

   :::image type="content" source="media/get-credentials-portal/cosmos-keys-option.png" lightbox="media/get-credentials-portal/cosmos-keys-option.png" alt-text="Screenshot of an Azure Cosmos DB SQL API account page. The Keys option is highlighted in the navigation menu.":::

1. Record the values from the **URI** and **PRIMARY KEY** fields. You'll use these values in a later step.

   :::image type="content" source="media/get-credentials-portal/cosmos-endpoint-key-credentials.png" lightbox="media/get-credentials-portal/cosmos-endpoint-key-credentials.png" alt-text="Screenshot of Keys page with various credentials for an Azure Cosmos DB SQL API account.":::

---

To use the **URI** and **PRIMARY KEY** values within your .NET code, persist them to new environment variables on the local machine running the application.

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

#### Create CosmosClient with account endpoint and key

Create a new instance of the **CosmosClient** class with the ``COSMOS_ENDPOINT`` and ``COSMOS_KEY`` environment variables as parameters.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/101-client-endpoint-key/Program.cs" id="endpoint_key" highlight="3-4":::

### Connect with a connection string

Another constructor for **CosmosClient** only contains a single parameter:

| Parameter | Example value | Description |
| --- | --- | --- |
| ``accountEndpoint`` | ``COSMOS_ENDPOINT`` environment variable | API for NoSQL endpoint to use for all requests |
| ``connectionString`` | ``COSMOS_CONNECTION_STRING`` environment variable | Connection string to the API for NoSQL account |

#### Retrieve your account connection string

##### [Azure CLI](#tab/azure-cli)

1. Use the [``az cosmosdb list``](/cli/azure/cosmosdb#az-cosmosdb-list) command to retrieve the name of the first Azure Cosmos DB account in your resource group and store it in the *accountName* shell variable.

    ```azurecli-interactive
    # Retrieve most recently created account name
    accountName=$(
        az cosmosdb list \
            --resource-group $resourceGroupName \
            --query "[0].name" \
            --output tsv
    )
    ```

1. Find the *PRIMARY CONNECTION STRING* from the list of connection strings for the account with the [`az-cosmosdb-keys-list`](/cli/azure/cosmosdb/keys#az-cosmosdb-keys-list) command.

    ```azurecli-interactive
    az cosmosdb keys list \
        --resource-group $resourceGroupName \
        --name $accountName \
        --type "connection-strings" \
        --query "connectionStrings[?description == \`Primary SQL Connection String\`] | [0].connectionString"
    ```

##### [PowerShell](#tab/azure-powershell)

1. Use the [``Get-AzCosmosDBAccount``](/powershell/module/az.cosmosdb/get-azcosmosdbaccount) cmdlet to retrieve the name of the first Azure Cosmos DB account in your resource group and store it in the *ACCOUNT_NAME* shell variable.

    ```azurepowershell-interactive
    # Retrieve most recently created account name
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
    }
    $ACCOUNT_NAME = (
        Get-AzCosmosDBAccount @parameters |
            Select-Object -Property Name -First 1
    ).Name
    ```

1. Find the *PRIMARY CONNECTION STRING* from the list of connection strings for the account with the [``Get-AzCosmosDBAccountKey``](/powershell/module/az.cosmosdb/get-azcosmosdbaccountkey) cmdlet.

    ```azurepowershell-interactive
    $parameters = @{
        ResourceGroupName = $RESOURCE_GROUP_NAME
        Name = $ACCOUNT_NAME
        Type = "ConnectionStrings"
    }    
    Get-AzCosmosDBAccountKey @parameters |
        Select-Object -Property "Primary SQL Connection String" -First 1    
    ```

##### [Portal](#tab/azure-portal)

> [!TIP]
> For this guide, we recommend using the resource group name ``msdocs-cosmos-dotnet-howto-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the existing Azure Cosmos DB for NoSQL account page.

1. From the Azure Cosmos DB for NoSQL account page, select the **Keys** navigation menu option.

1. Record the value from the **PRIMARY CONNECTION STRING** field.

---
To use the **PRIMARY CONNECTION STRING** value within your .NET code, persist it to a new environment variable on the local machine running the application.

#### [Windows](#tab/windows)

```powershell
$env:COSMOS_CONNECTION_STRING = "<cosmos-account-PRIMARY-CONNECTION-STRING>"
```

#### [Linux / macOS](#tab/linux+macos)

```bash
export COSMOS_CONNECTION_STRING="<cosmos-account-PRIMARY-CONNECTION-STRING>"
```

---

#### Create CosmosClient with connection string

Create a new instance of the **CosmosClient** class with the ``COSMOS_CONNECTION_STRING`` environment variable as the only parameter.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/102-client-connection-string/Program.cs" id="connection_string" highlight="3":::

### Connect using the Microsoft identity platform

To connect to your API for NoSQL account using the Microsoft identity platform and Microsoft Entra ID, use a security principal. The exact type of principal will depend on where you host your application code. The table below serves as a quick reference guide.

| Where the application runs | Security principal
|--|--|---|
| Local machine (developing and testing) | User identity or service principal |
| Azure | Managed identity |
| Servers or clients outside of Azure | Service principal |

#### Import Azure.Identity

The **Azure.Identity** NuGet package contains core authentication functionality that is shared among all Azure SDK libraries.

Import the [Azure.Identity](https://www.nuget.org/packages/Azure.Identity) NuGet package using the ``dotnet add package`` command.

```dotnetcli
dotnet add package Azure.Identity
```

Rebuild the project with the ``dotnet build`` command.

```dotnetcli
dotnet build
```

In your code editor, add using directives for ``Azure.Core`` and ``Azure.Identity`` namespaces.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/103-client-default-credential/Program.cs" id="using_identity_directives":::

#### Create CosmosClient with default credential implementation

If you're testing on a local machine, or your application will run on Azure services with direct support for managed identities, obtain an OAuth token by creating a [``DefaultAzureCredential``](/dotnet/api/azure.identity.defaultazurecredential) instance.

For this example, we saved the instance in a variable of type [``TokenCredential``](/dotnet/api/azure.core.tokencredential) as that's a more generic type that's reusable across SDKs.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/103-client-default-credential/Program.cs" id="credential":::

Create a new instance of the **CosmosClient** class with the ``COSMOS_ENDPOINT`` environment variable and the **TokenCredential** object as parameters.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/103-client-default-credential/Program.cs" id="default_credential" highlight="4":::

#### Create CosmosClient with a custom credential implementation

If you plan to deploy the application out of Azure, you can obtain an OAuth token by using other classes in the [Azure.Identity client library for .NET](/dotnet/api/overview/azure/identity-readme). These other classes also derive from the ``TokenCredential`` class.

For this example, we create a [``ClientSecretCredential``](/dotnet/api/azure.identity.clientsecretcredential) instance by using client and tenant identifiers, along with a client secret.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/104-client-secret-credential/Program.cs" id="credential" highlight="3-5":::

You can obtain the client ID, tenant ID, and client secret when you register an application in Microsoft Entra ID. For more information about registering Microsoft Entra applications, see [Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md).

Create a new instance of the **CosmosClient** class with the ``COSMOS_ENDPOINT`` environment variable and the **TokenCredential** object as parameters.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-samples/104-client-secret-credential/Program.cs" id="secret_credential" highlight="4":::

## Build your application

As you build your application, your code will primarily interact with four types of resources:

- The API for NoSQL account, which is the unique top-level namespace for your Azure Cosmos DB data.

- Databases, which organize the containers in your account.

- Containers, which contain a set of individual items in your database.

- Items, which represent a JSON document in your container.

The following diagram shows the relationship between these resources.

:::image type="complex" source="media/how-to-dotnet-get-started/resource-hierarchy.svg" alt-text="Diagram of the Azure Cosmos DB hierarchy including accounts, databases, containers, and items." border="false":::
    Hierarchical diagram showing an Azure Cosmos DB account at the top. The account has two child database nodes. One of the database nodes includes two child container nodes. The other database node includes a single child container node. That single container node has three child item nodes.
:::image-end:::

Each type of resource is represented by one or more associated .NET classes. Here's a list of the most common classes:

| Class | Description |
|---|---|
| [``CosmosClient``](/dotnet/api/microsoft.azure.cosmos.cosmosclient) | This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service. |
| [``Database``](/dotnet/api/microsoft.azure.cosmos.database) | This class is a reference to a database that may, or may not, exist in the service yet. The database is validated server-side when you attempt to access it or perform an operation against it. |
| [``Container``](/dotnet/api/microsoft.azure.cosmos.container) | This class is a reference to a container that also may not exist in the service yet. The container is validated server-side when you attempt to work with it. |

The following guides show you how to use each of these classes to build your application.

| Guide | Description |
|--|---|
| [Create a database](how-to-dotnet-create-database.md) | Create databases |
| [Create a container](how-to-dotnet-create-container.md) | Create containers |
| [Read an item](how-to-dotnet-read-item.md) | Point read a specific item |
| [Query items](how-to-dotnet-query-items.md) | Query multiple items |

## See also

- [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos)
- [Samples](samples-dotnet.md)
- [API reference](/dotnet/api/microsoft.azure.cosmos)
- [Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3)
- [Give Feedback](https://github.com/Azure/azure-cosmos-dotnet-v3/issues)

## Next steps

Now that you've connected to an API for NoSQL account, use the next guide to create and manage databases.

> [!div class="nextstepaction"]
> [Create a database in Azure Cosmos DB for NoSQL using .NET](how-to-dotnet-create-database.md)
