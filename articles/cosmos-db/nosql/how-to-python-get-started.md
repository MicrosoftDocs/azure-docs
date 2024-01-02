---
title: Get started with Azure Cosmos DB for NoSQL using Python
description: Get started developing a Python application that works with Azure Cosmos DB for NoSQL. This article helps you learn how to set up a project and configure access to an Azure Cosmos DB for NoSQL endpoint.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: python
ms.topic: how-to
ms.date: 12/06/2022
ms.custom: devx-track-python, devguide-python, cosmos-db-dev-journey, devx-track-azurepowershell, devx-track-azurecli
---

# Get started with Azure Cosmos DB for NoSQL using Python

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

This article shows you how to connect to Azure Cosmos DB for NoSQL using the Python SDK. Once connected, you can perform operations on databases, containers, and items.

[Package (PyPi)](https://pypi.org/project/azure-cosmos/) | [Samples](samples-python.md) | [API reference](/python/api/azure-cosmos/azure.cosmos) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cosmos/azure-cosmos) | [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- Azure Cosmos DB for NoSQL account. [Create a API for NoSQL account](how-to-create-account.md).
- [Python 3.7 or later](https://www.python.org/downloads/)
- [Azure Command-Line Interface (CLI)](/cli/azure/) or [Azure PowerShell](/powershell/azure/)

## Set up your project

Create an environment that you can run Python code in.

##### [Virtual environment](#tab/env-virtual)

With a [virtual environment](/azure/developer/python/configure-local-development-environment#configure-python-virtual-environment), you can install Python packages in an isolated environment without affecting the rest of your system. 

Install the Azure Cosmos DB for NoSQL Python SDK in the virtual environment.

```bash
pip install azure-cosmos
```

##### [Dev container](#tab/env-container)

A [dev container](https://containers.dev/) is a pre-configured environment that you can use to run Python code.

To run a dev container, you can use:

* **Visual Studio Code**: Clone this repo to your local machine and open the folder using the [Dev containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

* **GitHub Codespaces**: Open this repo in the browser with a [GitHub codespace](https://docs.github.com/en/codespaces/overview).

Install the Azure Cosmos DB for NoSQL Python SDK in the dev container.

```bash
pip install azure-cosmos
```

---

### Create the Python application

In your environment, create a new *app.py* file and add the following code to it:

:::code language="python" source="~/cosmos-db-nosql-python-samples/003-how-to/app.py" id="imports":::

The preceding code imports modules that you'll use in the rest of the article.

## <a id="connect-to-azure-cosmos-db-sql-api"></a>Connect to Azure Cosmos DB for NoSQL

To connect to the API for NoSQL of Azure Cosmos DB, create an instance of the [CosmosClient](/python/api/azure-cosmos/azure.cosmos.cosmosclient) class. This class is the starting point to perform all operations against databases. There are three ways to connect to an API for NoSQL account using the **CosmosClient** class:

- [Connect with an API for NoSQL endpoint and read/write key](#connect-with-an-endpoint-and-key)
- [Connect with an API for NoSQL connection string](#connect-with-a-connection-string)
- [Connect with Microsoft Entra ID](#connect-using-the-microsoft-identity-platform)

### Connect with an endpoint and key

The constructor for **CosmosClient** has two required parameters:

| Parameter | Example value | Description |
| --- | --- | --- |
| `url` | `COSMOS_ENDPOINT` environment variable | API for NoSQL endpoint to use for all requests. |
| `credential` | `COSMOS_KEY` environment variable | Account key or resource token to use when authenticating. |

#### Retrieve your account endpoint and key

##### [Azure CLI](#tab/azure-cli)

1. Create a shell variable for *resourceGroupName*.

    ```azurecli-interactive
    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-python-howto-rg"
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
    $RESOURCE_GROUP_NAME = "msdocs-cosmos-python-howto-rg"
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
> For this guide, we recommend using the resource group name ``msdocs-cosmos-python-howto-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the existing Azure Cosmos DB for NoSQL account page.

1. From the Azure Cosmos DB for NoSQL account page, select the **Keys** navigation menu option.

   :::image type="content" source="media/get-credentials-portal/azure-portal-cosmos-db-account-keys-resource.png" lightbox="media/get-credentials-portal/azure-portal-cosmos-db-account-keys-resource.png" alt-text="Screenshot of an Azure Cosmos DB SQL API account page. The Keys resource is highlighted in the navigation menu.":::

1. Record the values from the **URI** and **PRIMARY KEY** fields. You'll use these values in a later step.

   :::image type="content" source="media/get-credentials-portal/azure-portal-cosmos-db-account-primary-key.png" lightbox="media/get-credentials-portal/azure-portal-cosmos-db-account-primary-key.png" alt-text="Screenshot of the Keys resource showing credentials for an Azure Cosmos DB NoSQL API account.":::

---

To use the **URI** and **PRIMARY KEY** values within your Python code, persist them to new environment variables on the local machine running the application.

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

:::code language="python" source="~/cosmos-db-nosql-python-samples/003-how-to/app.py" id="client":::

### Connect with a connection string

The  **CosmosClient** class has a [from_connection_string](/python/api/azure-cosmos/azure.cosmos.cosmosclient#azure-cosmos-cosmosclient-from-connection-string) method that you can use to connect with one required parameter:

| Parameter | Example value | Description |
| --- | --- | --- |
| `conn_str` | `COSMOS_CONNECTION_STRING` environment variable | The connection string to the API for NoSQL account. |
| `credential` | `COSMOS_KEY` environment variable | An optional alternative account key or resource token to use instead of the one in the connection string. |


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
> For this guide, we recommend using the resource group name ``msdocs-cosmos-python-howto-rg``.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the existing Azure Cosmos DB for NoSQL account page.

1. From the Azure Cosmos DB for NoSQL account page, select the **Keys** navigation menu option.

1. Record the value from the **PRIMARY CONNECTION STRING** field.

---
To use the **PRIMARY CONNECTION STRING** value within your Python code, persist it to a new environment variable on the local machine running the application.

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

:::code language="python" source="~/cosmos-db-nosql-python-samples/003-how-to/app_connection_string.py" id="connection_string":::

### Connect using the Microsoft identity platform

To connect to your API for NoSQL account using the Microsoft identity platform and Microsoft Entra ID, use a security principal. The exact type of principal will depend on where you host your application code. The table below serves as a quick reference guide.

| Where the application runs | Security principal
|--|--|---|
| Local machine (developing and testing) | User identity or service principal |
| Azure | Managed identity |
| Servers or clients outside of Azure | Service principal |

#### Import Azure.Identity

The **azure-identity** package contains core authentication functionality that is shared among all Azure SDK libraries.

Import the [azure-identity](https://pypi.org/project/azure-identity/) package into your environment.

```bash
pip install azure-identity
```

#### Create CosmosClient with default credential implementation

If you're testing on a local machine, or your application will run on Azure services with direct support for managed identities, obtain an OAuth token by creating a [``DefaultAzureCredential``](/python/api/azure-identity/azure.identity.defaultazurecredential) instance.

In your *app.py*:

* Get the endpoint to connect to as show in the section above for [Connect with an endpoint and key](#connect-with-an-endpoint-and-key) and set that as the environment variable `COSMOS_ENDPOINT`.

* Import the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) and create an instance of it.

* Create a new instance of the **CosmosClient** class with the **ENDPOINT** and **credential** as parameters.

:::code language="python" source="~/cosmos-db-nosql-python-samples/003-how-to/app_aad_default.py" id="credential":::

> [!IMPORTANT]
> For details on how to add the correct role to enable `DefaultAzureCredential` to work, see [Configure role-based access control with Microsoft Entra ID for your Azure Cosmos DB account](../how-to-setup-rbac.md). In particular, see the section on creating roles and assigning them to a principal ID.

#### Create CosmosClient with a custom credential implementation

If you plan to deploy the application out of Azure, you can obtain an OAuth token by using other classes in the [Azure.Identity client library for Python](/python/api/overview/azure/identity-readme). These other classes also derive from the ``TokenCredential`` class.

For this example, we create a [``ClientSecretCredential``](/python/api/azure-identity/azure.identity.clientsecretcredential) instance by using client and tenant identifiers, along with a client secret.

In your *app.py*:

* Get the credential information from environment variables for a service principal. You can obtain the client ID, tenant ID, and client secret when you register an application in Microsoft Entra ID. For more information about registering Microsoft Entra applications, see [Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-register-app.md).

* Import the [ClientSecretCredential](/python/api/azure-identity/azure.identity.clientsecretcredential) and create an instance with the ``TENANT_ID``, ``CLIENT_ID``, and ``CLIENT_SECRET`` environment variables as parameters.

* Create a new instance of the **CosmosClient** class with the **ENDPOINT** and **credential** as parameters.

:::code language="python" source="~/cosmos-db-nosql-python-samples/003-how-to/app_aad_principal.py" id="credential":::

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

Each type of resource is represented by one or more associated Python classes. Here's a list of the most common classes for synchronous programming. (There are similar classes for asynchronous programming under the [azure.cosmos.aio](/python/api/azure-cosmos/azure.cosmos.aio) namespace.)

| Class | Description |
|---|---|
| [``CosmosClient``](/python/api/azure-cosmos/azure.cosmos.cosmosclient) | This class provides a client-side logical representation for the Azure Cosmos DB service. The client object is used to configure and execute requests against the service. |
| [``DatabaseProxy``](/python/api/azure-cosmos/azure.cosmos.databaseproxy) | An interface to a database that may, or may not, exist in the service yet. This class shouldn't be instantiated directly. Instead you should use the CosmosClient [get_database_client](/python/api/azure-cosmos/azure.cosmos.cosmosclient#azure-cosmos-cosmosclient-get-database-client) method. |
| [``ContainerProxy``](/python/api/azure-cosmos/azure.cosmos.containerproxy) | An interface to interact with a specific Cosmos DB container. This class shouldn't be instantiated directly. Instead, use the DatabaseProxy [get_container_client](/python/api/azure-cosmos/azure.cosmos.database.databaseproxy#azure-cosmos-database-databaseproxy-get-container-client) method to get an existing container, or the [create_container](/python/api/azure-cosmos/azure.cosmos.database.databaseproxy#azure-cosmos-database-databaseproxy-create-container) method to create a new container. |

The following guides show you how to use each of these classes to build your application.

| Guide | Description |
|--|---|
| [Create a database](how-to-python-create-database.md) | Create databases |
| [Create container](how-to-python-create-container.md) | Create containers |
| [Item examples](./samples-python.md#item-examples) | Point read a specific item |

## See also

- [PyPi](https://pypi.org/project/azure-cosmos/)
- [Samples](samples-python.md)
- [API reference](/python/api/azure-cosmos/azure.cosmos)
- [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/main/sdk/cosmos/azure-cosmos)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)

## Next steps

Now that you've connected to an API for NoSQL account, use the next guide to create and manage databases.

> [!div class="nextstepaction"]
> [Create a database in Azure Cosmos DB for NoSQL using Python](how-to-python-create-database.md)
