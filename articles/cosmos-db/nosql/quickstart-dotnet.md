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
ms.date: 10/11/2023
ms.custom: devx-track-csharp, devguide-csharp, cosmos-db-dev-journey, passwordless-dotnet, devx-track-azurecli, devx-track-dotnet
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
- [.NET 7.0](https://dotnet.microsoft.com/download/dotnet/7.0)

[!INCLUDE[Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Deploy the Azure Developer CLI template

Use the Azure Developer CLI (`azd`) to create an Azure Cosmos DB for NoSQL account and set up an Azure Container Apps web application. The sample application uses the client library for .NET to manage resources.

1. Start in an empty directory in the Azure Cloud Shell.

    > [!TIP]
    > We recommend creating a new uniquely named directory within the fileshare folder (`~/clouddrive`).
    >
    > For example, this command will create a new directory and remove the existing directory if it already exists:
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

    > [!TIP]
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

## Walk through the .NET library code

- [Authenticate the client](#authenticate-the-client)
- [Get a database](#get-a-database)
- [Get a container](#get-a-container)
- [Create an item](#create-an-item)
- [Get an item](#read-an-item)
- [Query items](#query-items)

The sample code described in this article creates a database named `cosmicworks` with a container named `products`. The `products` container is designed to contain product details such as name, category, quantity, and a sale indicator. Each product also contains a unique identifier.

For this sample code, the container uses the `/category` property as a logical partition key.

### Authenticate the client

Application requests to most Azure services must be authorized. Using the <xref:Azure.Identity.DefaultAzureCredential> class provided by the <xref:Azure.Identity> client library and namespace is the recommended approach for implementing passwordless connections to Azure services in your code.

> [!WARNING]
> You can also authorize requests to Azure services using passwords, connection strings, or other credentials directly. However, this approach should be used with caution. Developers must be diligent to never expose these secrets in an unsecure location. Anyone who gains access to the password or secret key is able to authenticate. `DefaultAzureCredential` offers improved management and security benefits over the account key to allow passwordless authentication. Both options are demonstrated in the following example.

`DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime.

For example, your app can authenticate using your Visual Studio sign-in credentials when developing locally, and then use a system-assigned managed identity once it has been deployed to Azure. No code changes are required for this transition between environments

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Program.cs" id="create_client":::

Alternatively, your app can specify a `clientId` with the <xref:Azure.Identity.DefaultAzureCredentialOptions> class to use a user-assigned managed identity locally or in Azure.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Program.cs" id="create_client_client_id":::

### Get a database

Use the <xref:Microsoft.Azure.Cosmos.CosmosClient.GetDatabase%2A> method to return a reference to the specified database.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="get_database":::

### Get a container

The <xref:Microsoft.Azure.Cosmos.Database.GetContainer%2A> returns a reference to the specified container.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="get_container":::

### Create an item

The easiest way to create a new item in a container is to first build a C# class or record type with all of the members you want to serialize into JSON. In this example, the C# record has a unique identifier, a `category` field for the partition key, name, quantity, price, and clearance fields.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Models/Product.cs" id="model":::

Create an item in the container by calling <xref:Microsoft.Azure.Cosmos.Container.CreateItemAsync%2A>.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="create_item":::

### Read an item

In Azure Cosmos DB, you can perform a point read operation by using both the unique identifier (`id`) and partition key fields. In the SDK, call <xref:Microsoft.Azure.Cosmos.Container.ReadItemAsync%2A> passing in both values to return a deserialized instance of your C# type.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="read_item":::

### Query items

After you insert an item, you can run a query to get all items that match a specific filter. This example runs the SQL query: `SELECT * FROM products p WHERE p.category = "gear-surf-surfboards"`. This example uses the QueryDefinition type and a parameterized query expression for the partition key filter. Once the query is defined, call <xref:Microsoft.Azure.Cosmos.Container.GetItemQueryIterator%2A> to get a result iterator that manages the pages of results.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="query_items":::

Then, use a combination of `while` and `foreach` loops to retrieve pages of results and then iterate over the individual items.

:::code language="csharp" source="~/cosmos-db-nosql-dotnet-quickstart/src/web/Pages/Index.razor" id="parse_results":::

## Clean up resources

When you no longer need the sample application or resources, remove the corresponding deployment.

```azurecli-interactive
azd down
```

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Develop a .NET console application with Azure Cosmos DB for NoSQL](tutorial-dotnet-console-app.md)
