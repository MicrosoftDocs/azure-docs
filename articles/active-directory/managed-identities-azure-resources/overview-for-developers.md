---
title: Developer introduction and guidelines
description: An overview how developers can use managed identities for Azure resources.
services: active-directory
documentationcenter:
author: barclayn
manager: amycolannino
editor:
ms.assetid: 0232041d-b8f5-4bd2-8d11-27999ad69370
ms.service: active-directory
ms.subservice: msi
ms.devlang:
ms.topic: overview
ms.custom: mvc
ms.date: 06/15/2022
ms.author: barclayn
ms.collection: M365-identity-device-management

#Customer intent: As a developer, I'd like to securely manage the credentials that my application uses for authenticating to cloud services without having the credentials in my code or checked into source control. 
---

# Connecting from your application to resources without handling credentials

Azure resources with managed identities support always provide an option to specify a managed identity to connect to Azure resources that support Microsoft Entra authentication. Managed identities support makes it unnecessary for developers to manage credentials in code. Managed identities are the recommended authentication option when working with Azure resources that support them. [Read an overview of managed identities](overview.md).

This page demonstrates how to configure an App Service so it can connect to Azure Key Vault, Azure Storage, and Microsoft SQL Server. The same principles can be used for any Azure resource that supports managed identities and that will connect to resources that support Microsoft Entra authentication. 

The code samples use the Azure Identity client library, which is the recommended method as it automatically handles many of the steps for you, including acquiring an access token used in the connection.

### What resources can managed identities connect to?
A managed identity can connect to any resource that supports Microsoft Entra authentication. In general, there's no special support required for the resource to allow managed identities to connect to it.

Some resources don't support Microsoft Entra authentication, or their client library doesn't support authenticating with a token. Keep reading to see our guidance on how to use a Managed identity to securely access the credentials without needing to store them in your code or application configuration.

## Creating a managed identity

There are two types of managed identity: system-assigned and user-assigned. System-assigned identities are directly linked to a single Azure resource. When the Azure resource is deleted, so is the identity. A user-assigned managed identity can be associated with multiple Azure resources, and its lifecycle is independent of those resources. 

This article will explain how to create and configure a user-assigned managed identity, which is [recommended for most scenarios](managed-identity-best-practice-recommendations.md). If the source resource you're using doesn't support user-assigned managed identities, then you should refer to that resource provider's documentation to learn how to configure it to have a system-assigned managed identity.

### Creating a user-assigned managed identity

> [!NOTE]
> You'll need a role such as "Managed Identity Contributor" to create a new user-assigned managed identity.

#### [Portal](#tab/portal)

1. Search for "Managed Identities" from the search bar at the top of the Portal and select the matching result.

:::image type="content" source="media/developer-introduction/managed-identities-search.png" alt-text="Screenshot of searching for managed identities in the portal.":::

2. Select the "Create" button.

:::image type="content" source="media/developer-introduction/managed-identity-create-button.png" alt-text="Screenshot showing a managed identity create button in the portal.":::

3. Select the Subscription and Resource group, and enter a name for the Managed identity.

:::image type="content" source="media/developer-introduction/managed-identity-create-screen.png" alt-text="Screenshot showing a managed identity create screen in the portal.":::

4. Select "Review + create" to run the validation test, and then select the "Create" button.

5. When the identity has been created, a confirmation screen will appear.

:::image type="content" source="media/developer-introduction/managed-identity-confirmation-screen.png" alt-text="Screenshot showing a managed identity confirmation screen after creation in the portal.":::

#### [Azure CLI](#tab/cli)
```azurecli
az identity create --name <name of the identity> --resource-group <name of the resource group>
```

Take a note of the `clientId` and the `principalId` values that are returned when the managed identity is created. You'll use `principalId` while adding permissions, and `clientId` in your application's code.

---

You now have an identity that can be associated with an Azure source resource. [Read more about managing user-assigned managed identities.](how-manage-user-assigned-managed-identities.md).

#### Configuring your source resource to use a user-assigned managed identity

Follow these steps to configure your Azure resource to have a managed identity through the Portal. Refer to the documentation for the specific resource type to learn how to configure the resource's identity using the Command Line Interface, PowerShell or ARM template.

> [!NOTE]
> You'll need "Write" permissions to configure an Azure resource to have a system-assigned identity. You'll need a role such as "Managed Identity Operator" to associate a user-assigned identity with an Azure resource.

1. Locate the resource using the search bar at the top of the Portal

:::image type="content" source="media/developer-introduction/locate-resource.png" alt-text="Screenshot showing a resource being searched for in the portal.":::

2. Select the Identity link in the navigation

:::image type="content" source="media/developer-introduction/app-service-summary.png" alt-text="Screenshot showing the link to the identity screen for a resource in the portal.":::

3. Select the "User-assigned" tab

4. Select the "Add" button

:::image type="content" source="media/developer-introduction/user-assigned-identity-blade.png" alt-text="Screenshot showing a user-assigned identity screen in the portal.":::

5. Select the user-assigned identity that you created earlier and select "Add"

:::image type="content" source="media/developer-introduction/select-user-assigned-identity.png" alt-text="Screenshot showing a user-assigned identity being selected in the portal.":::

6. The identity will be associated with the resource, and the list will update.

:::image type="content" source="media/developer-introduction/user-assigned-identity-added-to-resource.png" alt-text="Screenshot showing a user-assigned identity has been associated with the Azure resource in the portal.":::

Your source resource now has a user-assigned identity that it can use to connect to target resources.

## Adding permissions to the identity

> [!NOTE]
> You'll need a role such as "User Access Administrator" or "Owner" for the target resource to add Role assignments. Ensure you're granting the least privilege required for the application to run.

Now your App Service has a managed identity, you'll need to give the identity the correct permissions. As you're using this identity to interact with Azure Storage, you'll use the [Azure Role Based Access Control (RBAC) system](../../role-based-access-control/overview.md).

### [Portal](#tab/portal)

1. Locate the resource you want to connect to using the search bar at the top of the Portal
2. Select the "Access Control (IAM)" link in the left hand navigation.

:::image type="content" source="media/developer-introduction/resource-summary-screen.png" alt-text="Screenshot showing a resource summary screen in the portal.":::

3. Select the "Add" button near the top of the screen and select "Add role assignment".

:::image type="content" source="media/developer-introduction/resource-add-role-assignment-dropdown.png" alt-text="Screenshot showing the add role assignment navigation in the portal.":::

4. A list of Roles will be displayed. You can see the specific permissions that a role has by selecting the "View" link. Select the role that you want to grant to the identity and select the "Next" button.

:::image type="content" source="media/developer-introduction/resource-select-role.png" alt-text="Screenshot showing a role being selected in the portal.":::

5. You'll be prompted to select who the role should be granted to. Select the "Managed identity" option and then the "Add members" link.

:::image type="content" source="media/developer-introduction/resource-select-member.png" alt-text="Screenshot showing the identity type being selected in the portal.":::

6. A context pane will appear on the right where you can search by the type of the managed identity. Select "User-assigned managed identity" from the "Managed identity" option.

:::image type="content" source="media/developer-introduction/resource-select-identity.png" alt-text="Screenshot showing managed identity being selected in the portal.":::

7. Select the identity that you created earlier and the "Select" button. The context pane will close, and the identity will be added to the list.

:::image type="content" source="media/developer-introduction/resource-identity-added.png" alt-text="Screenshot showing an identity being added to a resource in the portal.":::

8. Select the "Review + assign" button to view the summary of the role assignment, and then once more to confirm.
9. Select the "Role assignments" option, and a list of the role assignments for the resource will be displayed.

:::image type="content" source="media/developer-introduction/resource-role-assignment-added.png" alt-text="Screenshot showing the role assignment has been added in the portal.":::

### [Azure CLI](#tab/cli)
```azurecli
az role assignment create --assignee "<Object/Principal ID of the managed identity>" \
--role "<Role name or Role ID>" \
--scope "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/{providerName}/{resourceType}/{resourceSubType}/{resourceName}"
```

[Read more about adding role assignments using the Command Line Interface](../../role-based-access-control/role-assignments-cli.md).

---

Your managed identity now has the correct permissions to access the Azure target resource. [Read more about Azure Role Based Access Control](../../role-based-access-control/overview.md).

## Using the managed identity in your code

Your App Service now has a managed identity with permissions. You can use the managed identity in your code to interact with target resources, instead of storing credentials in your code.

The recommended method is to use the Azure Identity library for your preferred programming language. The supported languages include [.NET](/dotnet/api/overview/azure/identity-readme), [Java](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true), [JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true), [Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true), [Go](/azure/developer/go/azure-sdk-authentication), and [C++](https://github.com/Azure/azure-sdk-for-cpp/blob/main/sdk/identity/azure-identity/README.md). The library acquires access tokens for you, making it simple to connect to target resources.

### Using the Azure Identity library in your development environment

Except for the C++ library, the Azure Identity libraries support a `DefaultAzureCredential` type. `DefaultAzureCredential` automatically attempts to authenticate via multiple mechanisms, including environment variables or an interactive sign-in. The credential type can be used in your development environment using your own credentials. It can also be used in your production Azure environment using a managed identity. No code changes are required when you deploy your application.

If you're using user-assigned managed identities, you should also explicitly specify the user-assigned managed identity you wish to authenticate with by passing in the identity's client ID as a parameter. You can retrieve the client ID by browsing to the identity in the Portal.

:::image type="content" source="media/developer-introduction/identity-client-id.png" alt-text="Screenshot showing the client ID for the managed identity in the portal.":::

Read more about the Azure Identity libraries below:

* [Azure Identity library for .NET](/dotnet/api/overview/azure/identity-readme)
* [Azure Identity library for Java](/java/api/overview/azure/identity-readme?view=azure-java-stable&preserve-view=true)
* [Azure Identity library for JavaScript](/javascript/api/overview/azure/identity-readme?view=azure-node-latest&preserve-view=true)
* [Azure Identity library for Python](/python/api/overview/azure/identity-readme?view=azure-python&preserve-view=true)
* [Azure Identity module for Go](/azure/developer/go/azure-sdk-authentication)
* [Azure Identity library for C++](https://github.com/Azure/azure-sdk-for-cpp/blob/main/sdk/identity/azure-identity/README.md)

### Accessing a Blob in Azure Storage

#### [.NET](#tab/dotnet)

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

// code omitted for brevity

// Specify the Client ID if using user-assigned managed identities
var clientID = Environment.GetEnvironmentVariable("Managed_Identity_Client_ID");
var credentialOptions = new DefaultAzureCredentialOptions
{
    ManagedIdentityClientId = clientID
};
var credential = new DefaultAzureCredential(credentialOptions);                        

var blobServiceClient1 = new BlobServiceClient(new Uri("<URI of Storage account>"), credential);
BlobContainerClient containerClient1 = blobServiceClient1.GetBlobContainerClient("<name of blob>");
BlobClient blobClient1 = containerClient1.GetBlobClient("<name of file>");

if (blobClient1.Exists())
{
    var downloadedBlob = blobClient1.Download();
    string blobContents = downloadedBlob.Value.Content.ToString();                
}
```

#### [Java](#tab/java)

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;

// read the Client ID from your environment variables
String clientID = System.getProperty("Client_ID");
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
        .managedIdentityClientId(clientID)
        .build();

BlobServiceClient blobStorageClient = new BlobServiceClientBuilder()
        .endpoint("<URI of Storage account>")
        .credential(credential)
        .buildClient();

BlobContainerClient blobContainerClient = blobStorageClient.getBlobContainerClient("<name of blob container>");
BlobClient blobClient = blobContainerClient.getBlobClient("<name of blob/file>");
if (blobClient.exists()) {
    String blobContent = blobClient.downloadContent().toString();
}
```    
---
### Accessing a secret stored in Azure Key Vault

#### [.NET](#tab/dotnet)

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Core;

// code omitted for brevity

// Specify the Client ID if using user-assigned managed identities
var clientID = Environment.GetEnvironmentVariable("Managed_Identity_Client_ID");
var credentialOptions = new DefaultAzureCredentialOptions
{
    ManagedIdentityClientId = clientID
};
var credential = new DefaultAzureCredential(credentialOptions);        

var client = new SecretClient(
    new Uri("https://<your-unique-key-vault-name>.vault.azure.net/"),
    credential);
    
KeyVaultSecret secret = client.GetSecret("<my secret>");
string secretValue = secret.Value;
```

#### [Java](#tab/java)

```java
import com.azure.core.util.polling.SyncPoller;
import com.azure.identity.DefaultAzureCredentialBuilder;

import com.azure.security.keyvault.secrets.SecretClient;
import com.azure.security.keyvault.secrets.SecretClientBuilder;
import com.azure.security.keyvault.secrets.models.DeletedSecret;
import com.azure.security.keyvault.secrets.models.KeyVaultSecret;

String keyVaultName = "mykeyvault";
String keyVaultUri = "https://" + keyVaultName + ".vault.azure.net";
String secretName = "mysecret";

// read the user-assigned managed identity Client ID from your environment variables
String clientID = System.getProperty("Managed_Identity_Client_ID");
DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
        .managedIdentityClientId(clientID)
        .build();

SecretClient secretClient = new SecretClientBuilder()
    .vaultUrl(keyVaultUri)
    .credential(credential)
    .buildClient();
    
KeyVaultSecret retrievedSecret = secretClient.getSecret(secretName);
```
---

### Accessing Azure SQL Database

#### [.NET](#tab/dotnet)

```csharp
using Azure.Identity;
using Microsoft.Data.SqlClient;

// code omitted for brevity

// Specify the Client ID if using user-assigned managed identities
var clientID = Environment.GetEnvironmentVariable("Managed_Identity_Client_ID");
var credentialOptions = new DefaultAzureCredentialOptions
{
    ManagedIdentityClientId = clientID
};

AccessToken accessToken = await new DefaultAzureCredential(credentialOptions).GetTokenAsync(
    new TokenRequestContext(new string[] { "https://database.windows.net//.default" }));                        

using var connection = new SqlConnection("Server=<DB Server>; Database=<DB Name>;")
{
    AccessToken = accessToken.Token
};
var cmd = new SqlCommand("select top 1 ColumnName from TableName", connection);
await connection.OpenAsync();
SqlDataReader dr = cmd.ExecuteReader();
while(dr.Read())
{
    Console.WriteLine(dr.GetValue(0).ToString());
}
dr.Close();	
```

#### [Java](#tab/java)

If you use [Azure Spring Apps](../../spring-apps/index.yml), you can connect to Azure SQL Database with a managed identity without needing to make any changes to your code.

Open the `src/main/resources/application.properties` file, and add `Authentication=ActiveDirectoryMSI;` at the end of the following line. Be sure to use the correct value for `$AZ_DATABASE_NAME` variable.

```properties
spring.datasource.url=jdbc:sqlserver://$AZ_DATABASE_NAME.database.windows.net:1433;database=demo;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;Authentication=ActiveDirectoryMSI;
```

Read more about how to [use a managed identity to connect Azure SQL Database to an Azure Spring Apps app](../../spring-apps/connect-managed-identity-to-azure-sql.md).

---

<a name='connecting-to-resources-that-dont-support-azure-active-directory-or-token-based-authentication-in-libraries'></a>

## Connecting to resources that don't support Microsoft Entra ID or token based authentication in libraries

Some Azure resources either don't yet support Microsoft Entra authentication, or their client libraries don't support authenticating with a token. Typically these resources are open-source technologies that expect a username and password or an access key in a connection string.

To avoid storing credentials in your code or your application configuration, you can store the credentials as a secret in Azure Key Vault. Using the example displayed above, you can retrieve the secret from Azure KeyVault using a managed identity, and pass the credentials into your connection string. This approach means that no credentials need to be handled directly in your code or environment.

## Guidelines if you're handling tokens directly

In some scenarios, you may want to acquire tokens for managed identities manually instead of using a built-in method to connect to the target resource. These scenarios include no client library for the programming language that you're using or the target resource you're connecting to, or connecting to resources that aren't running on Azure. When acquiring tokens manually, we provide the following guidelines:

### Cache the tokens you acquire
For performance and reliability, we recommend that your application caches tokens in local memory, or encrypted if you want to save them to disk. As Managed identity tokens are valid for 24 hours, there's no benefit in requesting new tokens regularly, as a cached one will be returned from the token issuing endpoint. If you exceed the request limits, you'll be rate limited and receive an HTTP 429 error. 

When you acquire a token, you can set your token cache to expire 5 minutes before the `expires_on` (or equivalent property) that will be returned when the token is generated.

### Token inspection
Your application shouldn't rely on the contents of a token. The token's content is intended only for the audience (target resource) that is being accessed, not the client that's requesting the token. The token content may change or be encrypted in the future.

### Don't expose or move tokens
Tokens should be treated like credentials. Don't expose them to users or other services; for example, logging/monitoring solutions. They shouldn't be moved from the source resource that's using them, other than to authenticate against the target resource.

## Next steps

* [How to use managed identities for App Service and Azure Functions](../../app-service/overview-managed-identity.md)
* [How to use managed identities with Azure Container Instances](../../container-instances/container-instances-managed-identity.md)
* [Implementing managed identities for Microsoft Azure Resources](https://www.pluralsight.com/courses/microsoft-azure-resources-managed-identities-implementing)
* Use [workload identity federation for managed identities](../workload-identities/workload-identity-federation.md) to access Microsoft Entra ID protected resources without managing secrets
