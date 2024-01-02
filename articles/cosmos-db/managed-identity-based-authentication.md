---
title: Use system-assigned managed identities to access Azure Cosmos DB data
description: Learn how to configure a Microsoft Entra system-assigned managed identity (managed service identity) to access keys from Azure Cosmos DB. 
author: seesharprun
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 10/20/2022
ms.author: sidandrews
ms.reviewer: justipat
ms.custom: devx-track-csharp, devx-track-azurecli, subject-rbac-steps, ignite-2022
---

# Use system-assigned managed identities to access Azure Cosmos DB data

[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

In this article, you'll set up a *robust, key rotation agnostic* solution to access Azure Cosmos DB keys by using [managed identities](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md) and [data plane role-based access control](how-to-setup-rbac.md). The example in this article uses Azure Functions, but you can use any service that supports managed identities.

You'll learn how to create a function app that can access Azure Cosmos DB data without needing to copy any Azure Cosmos DB keys. The function app will trigger when an HTTP request is made and then list all of the existing databases.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An existing Azure Cosmos DB API for NoSQL account. [Create an Azure Cosmos DB API for NoSQL account](nosql/quickstart-portal.md)
- An existing Azure Functions function app. [Create your first function in the Azure portal](../azure-functions/functions-create-function-app-portal.md)
  - A system-assigned managed identity for the function app. [Add a system-assigned identity](../app-service/overview-managed-identity.md#add-a-system-assigned-identity)
- [Azure Functions Core Tools](../azure-functions/functions-run-local.md)
- To perform the steps in this article, install the [Azure CLI](/cli/azure/install-azure-cli) and [sign in to Azure](/cli/azure/authenticate-azure-cli).

## Prerequisite check

1. In a terminal or command window, store the names of your Azure Functions function app, Azure Cosmos DB account and resource group as shell variables named ``functionName``, ``cosmosName``, and ``resourceGroupName``.

    ```azurecli-interactive
    # Variable for function app name
    functionName="msdocs-function-app"
    
    # Variable for Azure Cosmos DB account name
    cosmosName="msdocs-cosmos-app"

    # Variable for resource group name
    resourceGroupName="msdocs-cosmos-functions-dotnet-identity"
    ```

    > [!NOTE]
    > These variables will be re-used in later steps. This example assumes your Azure Cosmos DB account name is ``msdocs-cosmos-app``, your function app name is ``msdocs-function-app`` and your resource group name is ``msdocs-cosmos-functions-dotnet-identity``.

1. View the function app's properties using the [``az functionapp show``](/cli/azure/functionapp#az-functionapp-show) command.

    ```azurecli-interactive
    az functionapp show \
        --resource-group $resourceGroupName \
        --name $functionName
    ```

1. View the properties of the system-assigned managed identity for your function app using [``az webapp identity show``](/cli/azure/webapp/identity#az-webapp-identity-show).

    ```azurecli-interactive
    az webapp identity show \
        --resource-group $resourceGroupName \
        --name $functionName
    ```

1. View the Azure Cosmos DB account's properties using [``az cosmosdb show``](/cli/azure/cosmosdb#az-cosmosdb-show).

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $cosmosName
    ```

## Create Azure Cosmos DB API for NoSQL databases

In this step, you'll create two databases.

1. In a terminal or command window, create a new ``products`` database using [``az cosmosdb sql database create``](/cli/azure/cosmosdb/sql/database#az-cosmosdb-sql-database-create).

    ```azurecli-interactive
    az cosmosdb sql database create \
        --resource-group $resourceGroupName \
        --name products \
        --account-name $cosmosName
    ```

1. Create a new ``customers`` database.

    ```azurecli-interactive
    az cosmosdb sql database create \
        --resource-group $resourceGroupName \
        --name customers \
        --account-name $cosmosName
    ```

## Get Azure Cosmos DB API for NoSQL endpoint

In this step, you'll query the document endpoint for the API for NoSQL account.

1. Use ``az cosmosdb show`` with the **query** parameter set to ``documentEndpoint``. Record the result. You'll use this value in a later step.

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $cosmosName \
        --query documentEndpoint

    cosmosEndpoint=$(
        az cosmosdb show \
            --resource-group $resourceGroupName \
            --name $cosmosName \
            --query documentEndpoint \
            --output tsv
    )
    
    echo $cosmosEndpoint
    ```

    > [!NOTE]
    > This variable will be re-used in a later step.

## Grant access to your Azure Cosmos DB account

In this step, you'll assign a role to the function app's system-assigned managed identity. Azure Cosmos DB has multiple built-in roles that you can assign to the managed identity for control-plane access. For data-plane access, you'll create a new custom role with access to read metadata.

> [!TIP]
> For more information about the importance of least privilege access, see the [Lower exposure of privileged accounts](../security/fundamentals/identity-management-best-practices.md#lower-exposure-of-privileged-accounts) article.

1. Use ``az cosmosdb show`` with the **query** parameter set to ``id``. Store the result in a shell variable named ``scope``.

    ```azurecli-interactive
    scope=$(
        az cosmosdb show \
            --resource-group $resourceGroupName \
            --name $cosmosName \
            --query id \
            --output tsv
    )
    
    echo $scope
    ```

    > [!NOTE]
    > This variable will be re-used in a later step.

1. Use ``az webapp identity show`` with the **query** parameter set to ``principalId``. Store the result in a shell variable named ``principal``.

    ```azurecli-interactive
    principal=$(
        az webapp identity show \
            --resource-group $resourceGroupName \
            --name $functionName \
            --query principalId \
            --output tsv
    )
    
    echo $principal
    ```

1. Create a new JSON file with the configuration of the new custom role.

    ```json
    {
        "RoleName": "Read Azure Cosmos DB Metadata",
        "Type": "CustomRole",
        "AssignableScopes": ["/"],
        "Permissions": [{
            "DataActions": [
                "Microsoft.DocumentDB/databaseAccounts/readMetadata"
            ]
        }]
    }
    ```

    > [!TIP]
    > You can create a file in the Azure Cloud Shell using either `touch <filename>` or the built-in editor (`code .`). For more information, see [Azure Cloud Shell editor](../cloud-shell/using-cloud-shell-editor.md)

1. Use [``az cosmosdb sql role definition create``](/cli/azure/cosmosdb/sql/role/definition#az-cosmosdb-sql-role-definition-create) to create a new role definition named ``Read Azure Cosmos DB Metadata`` using the custom JSON object.

    ```azurecli-interactive
    az cosmosdb sql role definition create \
        --resource-group $resourceGroupName \
        --account-name $cosmosName \
        --body @definition.json
    ```

    > [!NOTE]
    > In this example, the role definition is defined in a file named **definition.json**.

1. Use [``az role assignment create``](/cli/azure/cosmosdb/sql/role/assignment#az-cosmosdb-sql-role-assignment-create) to assign the ``Read Azure Cosmos DB Metadata`` role to the system-assigned managed identity.

    ```azurecli-interactive
    az cosmosdb sql role assignment create \
        --resource-group $resourceGroupName \
        --account-name $cosmosName \
        --role-definition-name "Read Azure Cosmos DB Metadata" \
        --principal-id $principal \
        --scope $scope
    ```

## Programmatically access the Azure Cosmos DB keys

We now have a function app that has a system-assigned managed identity with the custom role. The following function app will query the Azure Cosmos DB account for a list of databases.

1. Create a local function project with the ``--dotnet`` parameter in a folder named ``csmsfunc``. Change your shell's directory

    ```azurecli-interactive
    func init csmsfunc --dotnet
    
    cd csmsfunc
    ```

1. Create a new function with the **template** parameter set to ``httptrigger`` and the **name** set to ``readdatabases``.

    ```azurecli-interactive
    func new --template httptrigger --name readdatabases
    ```

1. Add the [``Azure.Identity``](https://www.nuget.org/packages/Azure.Identity/) and [``Microsoft.Azure.Cosmos``](https://www.nuget.org/packages/Microsoft.Azure.Cosmos/) NuGet package to the .NET project. Build the project using [``dotnet build``](/dotnet/core/tools/dotnet-build).

    ```azurecli-interactive
    dotnet add package Azure.Identity
    
    dotnet add package Microsoft.Azure.Cosmos
    
    dotnet build
    ```

1. Open the function code in an integrated developer environment (IDE).

    > [!TIP]
    > If you are using the Azure CLI locally or in the Azure Cloud Shell, you can open Visual Studio Code.
    >
    > ```azurecli
    > code .
    > ```
    >

1. Replace the code in the **readdatabases.cs** file with this sample function implementation. Save the updated file.

    ```csharp
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Azure.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Azure.Cosmos;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.Http;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Logging;
    
    namespace csmsfunc
    {
        public static class readdatabases
        {
            [FunctionName("readdatabases")]
            public static async Task<IActionResult> Run(
                [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req,
                ILogger log)
            {
                log.LogTrace("Start function");
    
                CosmosClient client = new CosmosClient(
                    accountEndpoint: Environment.GetEnvironmentVariable("COSMOS_ENDPOINT", EnvironmentVariableTarget.Process),
                    new DefaultAzureCredential()
                );
    
                using FeedIterator<DatabaseProperties> iterator = client.GetDatabaseQueryIterator<DatabaseProperties>();
    
                List<(string name, string uri)> databases = new();
                while(iterator.HasMoreResults)
                {
                    foreach(DatabaseProperties database in await iterator.ReadNextAsync())
                    {
                        log.LogTrace($"[Database Found]\t{database.Id}");
                        databases.Add((database.Id, database.SelfLink));
                    }
                }
    
                return new OkObjectResult(databases);
            }
        }
    }
    ```

## (Optional) Run the function locally

In a local environment, the [``DefaultAzureCredential``](/dotnet/api/azure.identity.defaultazurecredential) class will use various local credentials to determine the current identity. While running locally isn't required for the how-to, you can develop locally using your own identity or a service principal.

1. In the **local.settings.json** file, add a new setting named ``COSMOS_ENDPOINT`` in the **Values** object. The value of the setting should be the document endpoint you recorded earlier in this how-to guide.

    ```json
    ...
    "Values": {
        ...
        "COSMOS_ENDPOINT": "https://msdocs-cosmos-app.documents.azure.com:443/",
        ...
    }
    ...
    ```

    > [!NOTE]
    > This JSON object has been shortened for brevity. This JSON object also includes a sample value that assumes your account name is ``msdocs-cosmos-app``.

1. Run the function app

    ```azurecli
    func start
    ```

## Deploy to Azure

Once published, the ``DefaultAzureCredential`` class will use credentials from the environment or a managed identity. For this guide, the system-assigned managed identity will be used as a credential for the [``CosmosClient``](/dotnet/api/microsoft.azure.cosmos.cosmosclient) constructor.

1. Set the ``COSMOS_ENDPOINT`` setting on the function app already deployed in Azure.

    ```azurecli-interactive
    az functionapp config appsettings set \
        --resource-group $resourceGroupName \
        --name $functionName \
        --settings "COSMOS_ENDPOINT=$cosmosEndpoint"
    ```

1. Deploy your function app to Azure by reusing the ``functionName`` shell variable:

    ```azurecli-interactive
    func azure functionapp publish $functionName
    ```

1. [Test your function in the Azure portal](../azure-functions/functions-create-function-app-portal.md#test-the-function).

## Next steps

- [Secure Azure Cosmos DB keys using Azure Key Vault](store-credentials-key-vault.md)
- [Security baseline for Azure Cosmos DB](security-baseline.md)
