---
title: Migrate applications to use passwordless authentication with Azure Cosmos DB for NoSQL
titleSuffix: Azure Cosmos DB
description: Learn to migrate existing applications away from connection strings to instead use Azure AD and Azure RBAC for enhanced security.
author: alexwolfmsft
ms.author: alexwolf
ms.reviewer: randolphwest
ms.date: 04/05/2023
ms.service: cosmos-db
ms.topic: how-to
ms.custom: devx-track-csharp, passwordless-java, passwordless-js, passwordless-python, passwordless-dotnet, devx-track-azurecli, devx-track-azurepowershell
---

# Migrate an application to use passwordless connections with Azure Cosmos DB for NoSQL

Application requests to Azure Cosmos DB for NoSQL must be authenticated. Although there are multiple options for authenticating to Azure Cosmos DB, you should prioritize passwordless connections in your applications when possible. Traditional authentication methods that use connection strings with passwords or secret keys create security risks and complications. Visit the [passwordless connections for Azure services](/azure/developer/intro/passwordless-overview) hub to learn more about the advantages of moving to passwordless connections.

The following tutorial explains how to migrate an existing application to connect to Azure Cosmos DB for NoSQL using passwordless connections instead of a key-based solution.

## Configure roles and users for local development authentication

[!INCLUDE [cosmos-nosql-create-assign-roles](../../../includes/passwordless/cosmos-nosql/cosmos-nosql-create-assign-roles.md)]

### Sign-in to Azure locally

[!INCLUDE [default-azure-credential-sign-in](../../../includes/passwordless/default-azure-credential-sign-in.md)]

### Migrate the app code to use passwordless connections

1. To use `DefaultAzureCredential` in a .NET application, install the `Azure.Identity` package:

   ```dotnetcli
   dotnet add package Azure.Identity
   ```

1. At the top of your file, add the following code:

   ```csharp
   using Azure.Identity;
   ```

1. Identify the locations in your code that create a `CosmosClient` object to connect to Azure Cosmos DB. Update your code to match the following example.

   ```csharp
    using CosmosClient client = new(
        accountEndpoint: Environment.GetEnvironmentVariable("COSMOS_ENDPOINT"),
        tokenCredential: new DefaultAzureCredential()
    );
   ```

### Run the app locally

After making these code changes, run your application locally. The new configuration should pick up your local credentials, such as the Azure CLI, Visual Studio, or IntelliJ. The roles you assigned to your local dev user in Azure allows your app to connect to the Azure service locally.

## Configure the Azure hosting environment

Once your application is configured to use passwordless connections and runs locally, the same code can authenticate to Azure services after it's deployed to Azure. The sections that follow explain how to configure a deployed application to connect to Azure Cosmos DB using a managed identity.

### Create the managed identity

[!INCLUDE [create-managed-identity](../../../includes/passwordless/migration-guide/create-user-assigned-managed-identity.md)]

#### Associate the managed identity with your web app

You need to configure your web app to use the managed identity you created. Assign the identity to your app using either the Azure portal or the Azure CLI.

# [Azure portal](#tab/azure-portal-associate)

Complete the following steps in the Azure portal to associate an identity with your app. These same steps apply to the following Azure services:

* Azure Spring Apps
* Azure Container Apps
* Azure virtual machines
* Azure Kubernetes Service

1. Navigate to the overview page of your web app.
1. Select **Identity** from the left navigation.
1. On the **Identity** page, switch to the **User assigned** tab.
1. Select **+ Add** to open the **Add user assigned managed identity** flyout.
1. Select the subscription you used previously to create the identity.
1. Search for the **MigrationIdentity** by name and select it from the search results.
1. Select **Add** to associate the identity with your app.

   :::image type="content" source="../../../articles/storage/common/media/create-user-assigned-identity-small.png" alt-text="Screenshot showing how to create a user assigned identity." lightbox="../../../articles/storage/common/media/create-user-assigned-identity.png":::

# [Azure CLI](#tab/azure-cli-associate)

[!INCLUDE [associate-managed-identity-cli](../../../includes/passwordless/migration-guide/associate-managed-identity-cli.md)]

---

### Assign roles to the managed identity

Grant permissions to the managed identity by assigning it the custom role you created, just like you did with your local development user.

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource ID using the [az cosmosdb show](/cli/azure/cosmosdb) command. You can filter the output properties using the `--query` parameter.

```azurecli
az cosmosdb show \
    --resource-group '<resource-group-name>' \
    --name '<cosmosdb-name>' \
    --query id
```

Copy the output ID from the preceding command. You can then assign roles using the [az role assignment](/cli/azure/role/assignment) command of the Azure CLI.

```azurecli
az role assignment create \
    --assignee "<your-managed-identity-name>" \
    --role "PasswordlessReadWrite" \
    --scope "<cosmosdb-resource-id>"
```

### Update the application code

You need to configure your application code to look for the specific managed identity you created when it's deployed to Azure. In some scenarios, explicitly setting the managed identity for the app also prevents other environment identities from accidentally being detected and used automatically.

1. On the managed identity overview page, copy the client ID value to your clipboard.
1. Update the `DefaultAzureCredential` object to specify this managed identity client ID:

    ```csharp
    // TODO: Update the <managed-identity-client-id> placeholder.
    var credential = new DefaultAzureCredential(
        new DefaultAzureCredentialOptions
        {
            ManagedIdentityClientId = "<managed-identity-client-id>"
        });
    ```

3. Redeploy your code to Azure after making this change in order for the configuration updates to be applied.

### Test the app

After deploying the updated code, browse to your hosted application in the browser. Your app should be able to connect to Cosmos DB successfully. Keep in mind that it may take several minutes for the role assignments to propagate through your Azure environment. Your application is now configured to run both locally and in a production environment without the developers having to manage secrets in the application itself.

## Next steps

In this tutorial, you learned how to migrate an application to passwordless connections.

You can read the following resources to explore the concepts discussed in this article in more depth:

* [Authorize access to blobs using Azure Active Directory](../../storage/blobs/authorize-access-azure-active-directory.md))
* To learn more about .NET, see [Get started with .NET in 10 minutes](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/intro).