---
title: Quickstart - Client library for .NET
titleSuffix: Azure Cosmos DB for NoSQL
description: Deploy a .NET web application to manage Azure Cosmos DB for NoSQL account resources in this quickstart.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.devlang: csharp
ms.topic: quickstart
ms.date: 10/24/2023
ms.custom: devx-track-csharp, devguide-csharp, cosmos-db-dev-journey, passwordless-dotnet, devx-track-azurecli, devx-track-dotnet
zone_pivot_groups: azure-cosmos-db-quickstart-path
# CustomerIntent: As a developer, I want to learn the basics of the .NET client library so that I can build applications with Azure Cosmos DB for NoSQL.
---

# Quickstart: Azure Cosmos DB for NoSQL client library for .NET

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

[!INCLUDE[Quickstart selector](includes/quickstart-selector.md)]

Get started with the Azure Cosmos DB client library for .NET to create databases, containers, and items within your account. Follow these steps to deploy a sample application and explore the code. In this quickstart, you use the Azure Developer CLI (`azd`) and the `Microsoft.Azure.Cosmos` library to connect to a newly created Azure Cosmos DB for NoSQL account.

[API reference documentation](/dotnet/api/microsoft.azure.cosmos) | [Library source code](https://github.com/Azure/azure-cosmos-dotnet-v3) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.Cosmos) | [Azure Developer CLI](/azure/developer/azure-developer-cli/overview)

## Prerequisites

- An Azure account with an active subscription.
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- [.NET 8.0](https://dotnet.microsoft.com/download/dotnet/8.0)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

::: zone pivot="azd"

## Deploy the Azure Developer CLI template

Use the Azure Developer CLI (`azd`) to create an Azure Cosmos DB for NoSQL account and set up an Azure Container Apps web application. The sample application uses the client library for .NET to manage resources.

1. Start in an empty directory in the Azure Cloud Shell.

    > [!TIP]
    > We recommend creating a new uniquely named directory within the fileshare folder (`~/clouddrive`).
    >
    > For example, this command will create a new directory and navigate to that directory:
    >
    > ```azurecli-interactive
    > mkdir ~/clouddrive/cosmos-db-nosql-dotnet-quickstart
    > 
    > cd ~/clouddrive/cosmos-db-nosql-dotnet-quickstart
    > ```

1. Initialize the Azure Developer CLI using `azd init` and the `cosmos-db-nosql-dotnet-quickstart` template.

    ```azurecli-interactive
    azd init --template cosmos-db-nosql-dotnet-quickstart
    ```

1. During initialization, configure a unique environment name.

    > [!NOTE]
    > The environment name will also be used as the target resource group name.

1. Deploy the Azure Cosmos DB account and other resources for this quickstart with `azd provision`.

    ```azurecli-interactive
    azd provision
    ```

1. During the provisioning process, select your subscription and desired location. Wait for the provisioning process to complete. The process can take **approximately five minutes**.

1. Once the provisioning of your Azure resources is done, a link to the running web application is included in the output.

    ```output
    View the running web application in Azure Container Apps:
    <https://container-app-39423723798.redforest-xz89v7c.eastus.azurecontainerapps.io>
    
    SUCCESS: Your application was provisioned in Azure in 5 minutes 0 seconds.
    ```

1. Use the link in the console to navigate to your web application in the browser.

    :::image type="content" source="media/quickstart-dotnet/web-application.png" alt-text="Screenshot of the running web application.":::

::: zone-end

::: zone pivot="local"

## Get the application code

Use the Azure Developer CLI (`azd`) to get the application code. The sample application uses the client library for .NET to manage resources.

1. Start in an empty directory.

1. Initialize the Azure Developer CLI using `azd init` and the `cosmos-db-nosql-dotnet-quickstart` template.

    ```azurecli
    azd init --template cosmos-db-nosql-dotnet-quickstart
    ```

1. During initialization, configure a unique environment name.

    > [!NOTE]
    > If you decide to deploy this application to Azure in the future, the environment name will also be used as the target resource group name.

## Create the API for NoSQL account

Use the Azure CLI (`az`) to create an API for NoSQL account. You can choose to create an account in your existing subscription, or try a free Azure Cosmos DB account.

### [Try Azure Cosmos DB free](#tab/try-free)

1. Navigate to the **Try Azure Cosmos DB free** homepage: <https://cosmos.azure.com/try/>

1. Sign-in using your Microsoft account.

1. In the list of APIs, select the **Create** button for the **API for NoSQL**.

1. Navigate to the newly created account by selecting **Open in portal**.

1. Record the account and resource group names for the API for NoSQL account. You use these values in later steps.

> [!IMPORTANT]
> If you are using a free account, you might need to change the default subscription in Azure CLI to the subscription ID used for the free account.
>
> ```azurecli
> az account set --subscription <subscription-id>
> ```

### [Azure subscription](#tab/azure-subscription)

1. If you haven't already, sign in to the Azure CLI using the `az login` command.

1. Use `az group create` to create a new resource group in your subscription.

    ```azurecli
    az group create \
        --name <resource-group-name> \
        --location <location>
    ```

1. Use the `az cosmosdb create` command to create a new API for NoSQL account with default settings.

    ```azurecli
    az cosmosdb create \
        --resource-group <resource-group-name> \
        --name <account-name> \
        --locations regionName=<location>
    ```

---

## Create the database and container

Use the Azure CLI to create the `cosmicworks` database and `products` container for the quickstart.

1. Create a new database with `az cosmosdb sql database create`. Set the name of the database to `comsicworks` and use autoscale throughput with a maximum of **1,000** RU/s.

    ```azurecli
    az cosmosdb sql database create \
        --resource-group <resource-group-name> \
        --account-name <account-name> \
        --name "cosmicworks" \
        --max-throughput 1000
    ```

1. Create a container named `products` within the `cosmicworks` database using `az cosmosdb sql container create`. Set the partition key path to `/category`.

    ```azurecli
    az cosmosdb sql container create \
        --resource-group <resource-group-name> \
        --account-name <account-name> \
        --database-name "cosmicworks" \
        --name "products" \
        --partition-key-path "/category"
    ```

## Configure passwordless authentication

When developing locally with passwordless authentication, make sure the user account that connects to Cosmos DB is assigned a role with the correct permissions to perform data operations. Currently, Azure Cosmos DB for NoSQL doesn't include built-in roles for data operations, but you can create your own using the Azure CLI or PowerShell.

1. Get the API for NoSQL endpoint for the account using `az cosmosdb show`. You'll use this value in the next step.

    ```azurecli
    az cosmosdb show \
        --resource-group <resource-group-name> \
        --name <account-name> \
        --query "documentEndpoint"
    ```

1. Set the `AZURE_COSMOS_DB_NOSQL_ENDPOINT` environment variable using the .NET secret manager (`dotnet user-secrets`). Set the value to the API for NoSQL account endpoint recorded in the previous step.

    ```bash
    dotnet user-secrets set "AZURE_COSMOS_DB_NOSQL_ENDPOINT" "<cosmos-db-nosql-endpoint>" --project ./src/web/Cosmos.Samples.NoSQL.Quickstart.Web.csproj
    ```

1. Create a JSON file named `role-definition.json`. Use this content to configure the role with the following permissions:

    - `Microsoft.DocumentDB/databaseAccounts/readMetadata`
    - `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*`
    - `Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*`

    ```json
    {
      "RoleName": "Write to Azure Cosmos DB for NoSQL data plane",
      "Type": "CustomRole",
      "AssignableScopes": [
        "/"
      ],
      "Permissions": [
        {
          "DataActions": [
            "Microsoft.DocumentDB/databaseAccounts/readMetadata",
            "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*",
            "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*"
          ]
        }
      ]
    }
    ```

1. Create a role using the `az role definition create` command. Name the role `Write to Azure Cosmos DB for NoSQL data plane` and ensure the role is scoped to the account level using `/`. Use the `role-definition.json` file you created in the previous step.

    ```azurecli
    az cosmosdb sql role definition create \
        --resource-group <resource-group-name> \
        --account-name <account-name> \
        --body @role-definition.json
    ```

1. When the command is finished, it outputs an object that includes an `id` field. Record the value from the `id` field. You use this value in an upcoming step.

    > [!TIP]
    > If you need to get the `id` again, you can use the `az cosmosdb sql role definition list` command:
    >
    > ```azurecli
    > az cosmosdb sql role definition list \
    >     --resource-group <resource-group-name> \
    >     --account-name <account-name> \
    >     --query "[?roleName == 'Write to Azure Cosmos DB for NoSQL data plane'].id"
    > ```
    >

1. For local development, get your currently logged in **service principal id**. Record this value as you'll also use this value in the next step.

    ```azurecli
    az ad signed-in-user show --query id
    ```

1. Assign the role definition to your currently logged in user using `az cosmosdb sql role assignment create`.

    ```azurecli
    az cosmosdb sql role assignment create \
        --resource-group <resource-group-name> \
        --account-name <account-name> \
        --scope "/" \
        --role-definition-id "<your-custom-role-definition-id>" \
        --principal-id "<your-service-principal-id>"
    ```

1. Run the .NET web application.

    ```bash
    dotnet run --project ./src/web/Cosmos.Samples.NoSQL.Quickstart.Web.csproj
    ```

1. Use the link in the console to navigate to your web application in the browser.

    :::image type="content" source="media/quickstart-dotnet/web-application.png" alt-text="Screenshot of the running web application.":::

::: zone-end

## Walk through the .NET library code

- [Authenticate the client](#authenticate-the-client)
- [Get a database](#get-a-database)
- [Get a container](#get-a-container)
- [Create an item](#create-an-item)
- [Get an item](#read-an-item)
- [Query items](#query-items)

The sample code in the Azure Develop CLI template creates a database named `cosmicworks` with a container named `products`. The `products` container is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this sample, the container uses the `/category` property as a logical partition key.

The code blocks used to perform these operations in this sample are included in this section. You can also [browse the entire template's source](https://vscode.dev/github/azure-samples/cosmos-db-nosql-dotnet-quickstart) using Visual Studio Code for the Web.

### Authenticate the client

Application requests to most Azure services must be authorized. Using the <xref:Azure.Identity.DefaultAzureCredential> class provided by the <xref:Azure.Identity> client library and namespace is the recommended approach for implementing passwordless connections to Azure services in your code.

> [!IMPORTANT]
> You can also authorize requests to Azure services using passwords, connection strings, or other credentials directly. However, this approach should be used with caution. Developers must be diligent to never expose these secrets in an unsecure location. Anyone who gains access to the password or secret key is able to authenticate. `DefaultAzureCredential` offers improved management and security benefits over the account key to allow passwordless authentication.

`DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime.

The client authentication code for this project is in the `src/web/Program.cs` file.

For example, your app can authenticate using your Visual Studio sign-in credentials when developing locally, and then use a system-assigned managed identity once it has been deployed to Azure. No code changes are required for this transition between environments.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Program.cs" id="create_client":::

Alternatively, your app can specify a `clientId` with the <xref:Azure.Identity.DefaultAzureCredentialOptions> class to use a user-assigned managed identity locally or in Azure.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Program.cs" id="create_client_client_id":::

### Get a database

The code to access database resources is in the `GenerateQueryDataAsync` method of the `src/web/Pages/Index.razor` file.

Use the <xref:Microsoft.Azure.Cosmos.CosmosClient.GetDatabase%2A> method to return a reference to the specified database.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="get_database":::

### Get a container

The code to access container resources is also in the `GenerateQueryDataAsync` method.

The <xref:Microsoft.Azure.Cosmos.Database.GetContainer%2A> returns a reference to the specified container.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="get_container":::

### Create an item

The easiest way to create a new item in a container is to first build a C# class or record type with all of the members you want to serialize into JSON. In this example, the C# record has a unique identifier, a `category` field for the partition key, name, quantity, price, and clearance fields.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Models/Product.cs" id="model":::

In the `GenerateQueryDataAsync` method, create an item in the container by calling <xref:Microsoft.Azure.Cosmos.Container.UpsertItemAsync%2A>.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="create_item":::

### Read an item

In Azure Cosmos DB, you can perform a point read operation by using both the unique identifier (`id`) and partition key fields. In the SDK, call <xref:Microsoft.Azure.Cosmos.Container.ReadItemAsync%2A> passing in both values to return a deserialized instance of your C# type.
Still in the `GenerateQueryDataAsync` method, use `ReadItemAsync<Product>` to serialize the item using the `Product` type.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="read_item":::

### Query items

After you insert an item, you can run a query to get all items that match a specific filter. This example runs the SQL query: `SELECT * FROM products p WHERE p.category = "gear-surf-surfboards"`. This example uses the QueryDefinition type and a parameterized query expression for the partition key filter. Once the query is defined, call <xref:Microsoft.Azure.Cosmos.Container.GetItemQueryIterator%2A> to get a result iterator that manages the pages of results. In the example, the query logic is also in the `GenerateQueryDataAsync` method.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="query_items":::

Then, use a combination of `while` and `foreach` loops to retrieve pages of results and then iterate over the individual items.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="parse_results":::

## Clean up resources

::: zone pivot="azd"

When you no longer need the sample application or resources, remove the corresponding deployment and all resources.

```azurecli-interactive
azd down
```

::: zone-end

::: zone pivot="local"

### [Try Azure Cosmos DB free](#tab/try-free)

1. Navigate to the **Try Azure Cosmos DB free** homepage again: <https://cosmos.azure.com/try/>

1. Sign-in using your Microsoft account.

1. Select **Delete your account**.

### [Azure subscription](#tab/azure-subscription)

When you no longer need the API for NoSQL account, you can delete the corresponding resource group. Use the `az group delete` command to delete the resource group.

```azurecli
az group delete --name <resource-group-name>
```

---

::: zone-end

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL](tutorial-dotnet-console-app.md)
