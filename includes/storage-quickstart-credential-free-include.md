---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: storage
ms.topic: include
ms.date: 02/25/2022
ms.author: alexwolf
ms.custom: include file
---

## Authenticate the app to Azure

Application requests to Azure Blob Storage must be authenticated. `DefaultAzureCredential` is the recommended approach for implementing authentication to Azure services in your code, including Blob Storage. 

Azure Blob Storage also provides the option to authenticate using connection strings, but this approach should be used with caution. `DefaultAzureCredential` offers improved management and security benefits over connection strings. Both options are demonstrated in the following example.

## [DefaultAzureCredential (Recommended)](#tab/managed-identity)

`DefaultAzureCredential` is a class provided by the Azure Identity client library for .NET, which you can learn more about on the [DefaultAzureCredential overview](/dotnet/azure/sdk/authentication#defaultazurecredential). `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` looks for credentials can be found in the [Azure Identity library overview](/dotnet/api/overview/azure/Identity-readme#defaultazurecredential).

For example, your app can authenticate using your Visual Studio sign-in credentials with when developing locally. Your app can then use Managed Identity once it has been deployed to Azure. No code changes are required for this transition.

### Assign roles to your Azure AD user

[!INCLUDE [assign-roles](assign-roles.md)]

### Connect your app code using DefaultAzureCredential

You can authenticate your local app to the Blob Storage account you created using the following steps:

1. Make sure you're authenticated with the same Azure AD account you assigned the role to on your Blob Storage account. You can authenticate via the Azure CLI, Visual Studio, Visual Studio Code, or Azure PowerShell.

    [!INCLUDE [defaultazurecredential-sign-in](defaultazurecredential-sign-in.md)]

2. To implement `DefaultAzureCredential`, add the **Azure.Identity** to your application.

    ```dotnetcli
    dotnet add package Azure.Identity
    ```

    Azure services can be accessed using corresponding client classes from the SDK. These classes should be registered in the *Program.cs* file so they can be accessed via dependency injection throughout your app. 
    
3. Update your *Program.cs* code to match the following example. When the code is run on your local workstation during development, it will use the developer credentials of whatever prioritized tool you're logged into to authenticate to Azure.

    ```csharp
    using Microsoft.Extensions.Azure;
    using Azure.Identity;
    
    var blobServiceClient = new BlobServiceClient(
            new Uri("https://<account-name>.blob.core.windows.net"),
            new DefaultAzureCredential());
    ```

    > [!IMPORTANT]
    > When deployed to Azure, this same application code can also authenticate to other Azure services. However, you'll need to enable managed identity on your app in Azure. Then configure your Blob Storage account to allow that managed identity to connect. For detailed instructions on configuring this connection between Azure services, see the [Auth from Azure-hosted apps](/dotnet/azure/sdk/authentication-azure-hosted-apps) tutorial.

## [Connection String](#tab/connection-string)

[!INCLUDE [retrieve credentials](retrieve-credentials.md)]

### Configure your storage connection string

After you copy the connection string, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<yourconnectionstring>` with your actual connection string.

**Windows**:

```cmd
setx AZURE_STORAGE_CONNECTION_STRING "<yourconnectionstring>"
```

After you add the environment variable in Windows, you must start a new instance of the command window.

**Linux**:

```bash
export AZURE_STORAGE_CONNECTION_STRING="<yourconnectionstring>"
```

#### Restart programs

After you add the environment variable, restart any running programs that will need to read the environment variable. For example, restart your development environment or editor before you continue.

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
> Connection strings should be used with caution. If your connection string is lost or accidentally placed in an insecure location, your service may become vulnerable. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authentication to Azure services.

---