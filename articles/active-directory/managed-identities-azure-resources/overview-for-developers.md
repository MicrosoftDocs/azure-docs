---
title: Managed identities for Developers
description: An overview how developers can use managed identities for Azure resources.
services: active-directory
documentationcenter:
author: barclayn
manager: karenhoran
editor:
ms.assetid: 0232041d-b8f5-4bd2-8d11-27999ad69370
ms.service: active-directory
ms.subservice: msi
ms.devlang:
ms.topic: overview
ms.custom: mvc
ms.date: 06/02/2022
ms.author: barclayn
ms.collection: M365-identity-device-management

#Customer intent: As a developer, I'd like to securely manage the credentials that my application uses for authenticating to cloud services without having the credentials in my code or checked into source control.
---

# Connecting from applications to Azure resources without handling credentials

This page explains how developers can use Managed identities so that Azure resources can connect to resources that support authentication with Azure Active Directory, without needing to handle or store any credentials. This is the recommended approach for Azure resources that support the ability to authentiate using a managed identity.

The examples provided will show how an Azure App Service can connect to Azure Key Vault, Azure Storage, and Microsoft SQL Server. However the same principles can be used for any Azure resource that supports Managed Identities and that will connect to endpoints that support Azure Active Directory authentication. 

The Azure resource that will make the connection is referred to as a "source" endpoint, and the resource that you're connecting to is referred to as a "target" endpoint.

The examples shown use the Azure Identity client library, which is the recommended method as it automatically handles many of the steps for you, including acquiring an access token used in the connection.

Some endpoints don't support Azure Active Directory authentication, or its client library doesn't support authenticating with a token. Keep reading to see our guidance on how to use a Managed identity to securely access the credentials without needing to store them in your code or application configuration.

## Creating a managed identity

There are two types of managed identity: system-assigned and user-assigned. System-assigned identities are directly linked to a single Azure resource. When the Azure resource is deleted, so is the identity. A user-assigned identity can be associated with multiple Azure resources, and its lifecycle is independent of those resources. This article will explain how to create and configure a user-assigned identity. Read [our best practice recommendations](managed-identity-best-practice-recommendations.md) to see which type of managed identity is best for your scenario.

### Creating a user-assigned managed identity

> [!NOTE]
> You'll need a role such as "Managed Identity Contributor" to create a new user-assigned managed identity.

If you want to use a user-assigned identity, you'll need to create it before you associate it with your Azure resource.

1. Search for "Managed Identities" from the search bar at the top of the Portal and select the matching result.

:::image type="content" source="media/overview-for-developers/Managed-Identities-Search.png" alt-text="Search for managed identities":::

2. Select the "Create" button.

:::image type="content" source="media/overview-for-developers/Managed-Identity-Create-Button.png" alt-text="Managed identity - create button":::

3. Select the Subscription and Resource group, and enter a name for the Managed identity.

:::image type="content" source="media/overview-for-developers/Managed-Identity-Create-Screen.png" alt-text="Managed identity - create screen":::

4. Select "Review + create" to run the validation test, and then select the "Create" button.

5. When the identity has been created, a confirmation screen will appear.

:::image type="content" source="media/overview-for-developers/Managed-Identity-Confirmation-Screen.png" alt-text="Managed identity - confirmation screen":::

You now have an identity that can be associated with an Azure resource. [Read more about managing your identities](how-manage-user-assigned-managed-identities.md).

### Configuring your resource to use a user-assigned managed identity

Follow these steps to configure your Azure resource to have a managed identity through the Portal. Refer to the documentation for the specific resource type to learn how to configure the resource's identity using the Command Line Interface, PowerShell or ARM template.

> [!NOTE]
> You'll need "Write" permissions to configure an Azure resource to have a system-assigned identity. You'll need a role such as "Managed Identity Operator" to associate a user-assigned identity with an Azure resource.

1. Locate the resource using the search bar at the top of the Portal

:::image type="content" source="media/overview-for-developers/System-Assigned-Identity-Created.png" alt-text="System-assigned identity has been created":::

2. Select the Identity link in the navigation

:::image type="content" source="media/overview-for-developers/App-Service-Summary.png" alt-text="Identity link in Resource screen.":::

3. Select the "User-assigned" tab

4. Select the "Add" button

:::image type="content" source="media/overview-for-developers/User-Assigned-Identity-Blade.png" alt-text="User-assigned identity screen":::

5. Select the user-assigned identity that you created earlier and select "Add"

:::image type="content" source="media/overview-for-developers/Select-User-Assigned-Identity.png" alt-text="Select the User-assigned identity":::

6. The identity will be associated with the resource, and the list will update.

:::image type="content" source="media/overview-for-developers/User-Assigned-Identity-Added-To-Resource.png" alt-text="User-assigned identity has been associated with the Azure resource":::

Your resource now has a user-assigned identity that it can use to connect to other resources.

### Configuring your resource to use a system-assigned managed identity

Some resources may only support system-assigned identities, or you may prefer to have a managed identity that's directly associated with just one resource. Follow these instructions to configure your resource to have a system-assigned identity.

1. Locate the resource using the search bar at the top of the Portal

:::image type="content" source="media/overview-for-developers/System-Assigned-Identity-Created.png" alt-text="System-assigned identity has been created":::

2. Select the Identity link in the navigation

:::image type="content" source="media/overview-for-developers/App-Service-Summary.png" alt-text="Identity link in Resource screen.":::

3. Select the "Status" option so that "On" is selected

:::image type="content" source="media/overview-for-developers/system-assigned-select.png" alt-text="Set status to 'On'.":::

4. Select the "Save" button. A confirmation message will appear. Select "Yes".

:::image type="content" source="media/overview-for-developers/system-assigned-confirm.png" alt-text="Confirmation message for system-assigned identity'.":::

5. The page will automatically update, and the client (principal) ID of the identity will be displayed. 

:::image type="content" source="media/overview-for-developers/system-assigned-created.png" alt-text="System-assigned identity is created.":::

Your resource now has a system-assigned identity that it can use to connect to other resources.

## Adding permissions to the identity

> [!NOTE]
> You'll need a role such as "User Access Administrator" or "Owner" for the target resource to add Role assignments. Ensure you're granting the least privilege required for the application to run.

Now your App Service has a managed identity, you'll need to give the identity the correct permissions. As you're using this identity to interact with Azure Storage, you'll use the Azure RBAC (Role Based Access Control) system.

1. Locate the resource you want to connect to using the search bar at the top of the Portal
2. Select the "Access Control (IAM)" link in the left hand navigation.

:::image type="content" source="media/overview-for-developers/resource-summary-screen.png" alt-text="Resource Summary screen":::

3. Select the "Add" button near the top of the screen and select "Add role assignment".

:::image type="content" source="media/overview-for-developers/resource-add-role-assignment-dropdown.png" alt-text="Add Role assignment navigation":::

4. A list of Roles will be displayed. You can see the specific permissions that a role has by selecting the "View" link. Select the role that you want to grant to the identity and select the "Next" button.

:::image type="content" source="media/overview-for-developers/resource-select-role.png" alt-text="Select a Role":::

5. You'll be prompted to select who the role should be granted to. Select the "Managed identity" option and then the "Add members" link.

:::image type="content" source="media/overview-for-developers/resource-selectmember.png" alt-text="Select the identity type":::

6. A context pane will appear on the right where you can search by the type of the managed identity. Select "User-assigned managed identity" from the "Managed identity" option.

:::image type="content" source="media/overview-for-developers/resource-selectidentity.png" alt-text="Select the managed identity":::

7. Select the identity that you created earlier and the "Select" button. The context pane will close, and the identity will be added to the list.

:::image type="content" source="media/overview-for-developers/resource-identityadded.png" alt-text="Identity added to resource":::

8. Select the "Review + assign" button to view the summary of the role assignment, and then once more to confirm.
9. Select the "Role assignments" option, and a list of the role assignments for the resource will be displayed.

:::image type="content" source="media/overview-for-developers/resource-role-assignment-added.png" alt-text="Role assignment added":::

Your managed identity now has the correct permissions to access the Azure resource. [Read more about Azure Role Based Access Control](../../role-based-access-control/overview.md).

## Using the identity in your code

Your App Service now has an identity with permissions. You can use the identity in your code to interact with Azure Storage, instead of storing credentials in your code.

The recommended method is to use the Azure Identity library for your preferred programming language. The supported languages include .NET, Java, JavaScript, Python, Go, and C++. The library acquires access tokens for you, making it simple to connect to target endpoints.

### Using the Azure Identity library in your development environment

With the exception of the C++ library, the Azure Identity libraries support a `DefaultAzureCredential` type. `DefaultAzureCredential` automatically attempts to authenticate via multiple mechanisms, including environment variables or an interactive login. The credential type can be used in your development environment using your own credentials. It can also be used in your production Azure environment using a Managed identity. No code changes are required when you deploy your application.

You can also explicitly specify that the Managed identity you wish to authenticate with by passing in the identity's client ID. You can retrieve this client ID by browsing to the identity in the Portal.

:::image type="content" source="media/overview-for-developers/IdentityClientID.png" alt-text="Client ID for the identity":::

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

var credentialOptions = new DefaultAzureCredentialOptions
{
    ManagedIdentityClientId = "<Client ID of User-assigned identity>"
};
var msiCredential = new DefaultAzureCredential(credentialOptions);                        

var blobServiceClient1 = new BlobServiceClient(new Uri("<URI of Storage account>"), msiCredential);
BlobContainerClient containerClient1 = blobServiceClient1.GetBlobContainerClient("<name of blob>");
BlobClient blobClient1 = containerClient1.GetBlobClient("<name of file>");

if (blobClient1.Exists())
{
    var downloadedBlob = blobClient1.Download();
    string blobContents = downloadedBlob.Value.Content.ToString();                
}
```

#### [Java](#tab/java)
_pom.xml_
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-storage-blob</artifactId>
    <version>12.13.0</version>
</dependency>
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.2.0</version>
</dependency>
```

```java
import com.azure.identity.DefaultAzureCredential;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;

DefaultAzureCredential credential = new DefaultAzureCredentialBuilder()
        .managedIdentityClientId("<Client ID of User-assigned identity>")
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

var options = new SecretClientOptions
    {
        Retry =
        {
            Delay= TimeSpan.FromSeconds(2),
            MaxDelay = TimeSpan.FromSeconds(16),
            MaxRetries = 5,
            Mode = RetryMode.Exponential
         }
    };

var client = new SecretClient(
    new Uri("https://<your-unique-key-vault-name>.vault.azure.net/"),
    new DefaultAzureCredential(),
    options);
KeyVaultSecret secret = client.GetSecret("<my secret>");
string secretValue = secret.Value;
```

#### [Java](#tab/java)
_pom.xml_
```xml
<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-security-keyvault-secrets</artifactId>
    <version>4.2.3</version>
</dependency>

<dependency>
    <groupId>com.azure</groupId>
    <artifactId>azure-identity</artifactId>
    <version>1.2.0</version>
</dependency>
```

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

SecretClient secretClient = new SecretClientBuilder()
    .vaultUrl(keyVaultUri)
    .credential(new DefaultAzureCredentialBuilder().build())
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

AccessToken accessToken = await new DefaultAzureCredential().GetTokenAsync(
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
```java
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import com.microsoft.sqlserver.jdbc.SQLServerDataSource;

public class Connect_to_Azure_SQL {
    public static void main(String[] args) throws Exception {

        SQLServerDataSource ds = new SQLServerDataSource();
        ds.setServerName("<your-database-server-name>.database.windows.net");
        ds.setDatabaseName("<your database name>");
        ds.setAuthentication("ActiveDirectoryMSI");
        // Optional
        ds.setMSIClientId("<your-user-assigned-identity-client-id>");
        
        String rowValue;

        try (Connection connection = ds.getConnection();
                Statement stmt = connection.createStatement();
                ResultSet rs = stmt.executeQuery("select top 1 ColumnName from TableName")) {
            if (rs.next()) {
                rowValue = rs.getString(1);
            }
        }
    }
}
```
---

## Connecting to resources that don't support Azure Active Directory or token based authentication in libraries

Some Azure resources either don't yet support Azure Active Directory authentication, or their client libraries don't support authenticating with a token. Typically these endpoints are open-source technologies that expect a username and password or an access key in a connection string.

To avoid storing credentials in your code or your application configuration, you can store the credentials as a secret in Azure Key Vault. Using the example displayed above, you can retrieve the secret from Azure KeyVault using a managed identity, and pass the credentials into your connection string. This approach means that no credentials need to be handled directly in your code or environment.

## Guidelines if you're handling tokens directly

In some scenarios, you may want to acquire tokens for Managed identities manually instead of using a built-in method to connect to the target resource. This may be because there's no client library for the programming language that you're using or for the target resource you're connecting to. When acquiring tokens manually, we provide the following guidelines:

### Cache the tokens you acquire
For performance and reliability, we recommend that your application caches tokens in local memory, or encrypted if you want to save them to disk. As Managed identity tokens are valid for 24 hours, there's no benefit in requesting new tokens regularly, as a cached one will be returned from the token issuing endpoint. If you exceed the request limits, you'll be rate limited and receive an HTTP 429 error.

### Token inspection
Your application shouldn't rely on the contents of a token. The token's content is intended only for the audience (target endpoint) that is being accessed, not the client that's requesting the token. The token content may change or be encrypted in the future.

### Don't expose tokens
Tokens should be treated like credentials. Don't expose them to users or other services; for example logging/monitoring solutions.

## Next steps

* [How to use managed identities for App Service and Azure Functions](../../app-service/overview-managed-identity.md)
* [How to use managed identities with Azure Container Instances](../../container-instances/container-instances-managed-identity.md)
* [Implementing managed identities for Microsoft Azure Resources](https://www.pluralsight.com/courses/microsoft-azure-resources-managed-identities-implementing)
