---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: include
ms.date: 09/09/2022
ms.author: alexwolf
ms.custom: include file
---

## Authenticate the app to Azure

Application requests to Azure Blob Storage must be authorized. Using the `DefaultAzureCredential` class provided by the Azure.Identity client library is the recommended approach for implementing passwordless connections to Azure services in your code, including Blob Storage.

You can also authorize requests to Azure Blob Storage by using the account access key. However, this approach should be used with caution. Developers must be diligent to never expose the access key in an unsecure location. Anyone who gains access to the access key is able to authenticate. `DefaultAzureCredential` offers improved management and security benefits over the account key to allow passwordless authentication. Both options are demonstrated in the following example.

## [Passwordless (Recommended)](#tab/managed-identity)

`DefaultAzureCredential` is a class provided by the Azure Identity client library for .NET, which you can learn more about on the [DefaultAzureCredential overview](/dotnet/azure/sdk/authentication#defaultazurecredential). `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` looks for credentials can be found in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential).

:::image type="content" source="https://raw.githubusercontent.com/Azure/azure-sdk-for-net/main/sdk/identity/Azure.Identity/images/mermaidjs/DefaultAzureCredentialAuthFlow.svg"alt-text="A diagram of the credential flow.":::

For example, your app can authenticate using your Visual Studio sign-in credentials with when developing locally. Your app can then use a [managed identity](../articles/active-directory/managed-identities-azure-resources/overview.md) once it has been deployed to Azure. No code changes are required for this transition.

### Assign roles to your Azure AD user

[!INCLUDE [assign-roles](assign-roles.md)]

### Sign-in and connect your app code to Azure using DefaultAzureCredential

You can authorize access to data in your storage account using the following steps:

1. Make sure you're authenticated with the same Azure AD account you assigned the role to on your Blob Storage account. You can authenticate via the Azure CLI, Visual Studio, or Azure PowerShell.

    [!INCLUDE [default-azure-credential-sign-in](default-azure-credential-sign-in.md)]

2. To use `DefaultAzureCredential`, add the **Azure.Identity** package to your application.

    [!INCLUDE [visual-studio-add-identity](visual-studio-add-identity.md)]

3. Update your *Program.cs* code to match the following example. When the code is run on your local workstation during development, it will use the developer credentials of the prioritized tool you're logged into to authenticate to Azure, such as the Azure CLI or Visual Studio.

    ```csharp
    using Azure.Storage.Blobs;
    using Azure.Storage.Blobs.Models;
    using System;
    using System.IO;
    using Azure.Identity;
    
    // TODO: Replace <storage-account-name> with your actual storage account name
    var blobServiceClient = new BlobServiceClient(
            new Uri("https://<storage-account-name>.blob.core.windows.net"),
            new DefaultAzureCredential());
    ```

4. Make sure to update the Storage account name in the URI of your `BlobServiceClient`. The Storage account name can be found on the overview page of the Azure portal.

    :::image type="content" source="../articles/storage/blobs/media/storage-quickstart-blobs-dotnet/storage-account-name.png" alt-text="A screenshot showing how find the storage account name.":::

    > [!NOTE]
    > When deployed to Azure, this same code can be used to authorize requests to Azure Storage from an application running in Azure. However, you'll need to enable managed identity on your app in Azure. Then configure your Blob Storage account to allow that managed identity to connect. For detailed instructions on configuring this connection between Azure services, see the [Auth from Azure-hosted apps](/dotnet/azure/sdk/authentication-azure-hosted-apps) tutorial.

## [Connection String](#tab/connection-string)

A connection string includes the storage account access key and uses it to authorize requests. Always be careful to never expose the keys in an unsecure location.

> [!NOTE]
> If you plan to use connection strings, you will need the Storage Account Contributor role or higher. You can also use any account with the `Microsoft.Storage/storageAccounts/listkeys/action` permission.

[!INCLUDE [retrieve credentials](retrieve-credentials.md)]

### Configure your storage connection string

After you copy the connection string, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<yourconnectionstring>` with your actual connection string.

**Windows**:

```cmd
setx AZURE_STORAGE_CONNECTION_STRING "<yourconnectionstring>"
```

After you add the environment variable in Windows, you must start a new instance of the command window. If you are using Visual Studio on Windows, you may need to relaunch Visual Studio after creating the environment variable for the change to be detected.

**Linux**:

```bash
export AZURE_STORAGE_CONNECTION_STRING="<yourconnectionstring>"
```

### Configure the connection string

The code below retrieves the connection string for the storage account from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add following code to the end of the `Program.cs` file:

```csharp
// Retrieve the connection string for use with the application. 
string connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");

// Create a BlobServiceClient object 
var blobServiceClient = new BlobServiceClient(connectionString);
```

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authentication to Azure services.

---