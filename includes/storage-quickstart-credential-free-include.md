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

## Authenticating the app to Azure

Application requests to Azure Blob Storage must be authenticated. `DefaultAzureCredential` is the recommended approach for implementing authentication to Azure services in your code, including Blob Storage. 

Azure Blob Storage also provides the option to authenticate using Connection Strings, but this approach should be used with caution. `DefaultAzureCredential` offers improved management and security benefits over connection strings. Both options are demonstrated in the following example.

## [DefaultAzureCredential (Recommended)](#tab/managed-identity)

`DefaultAzureCredential` is a class provided by the Azure SDK for .NET, which you can learn more about on the [Managed Identity Overview](/en-us/dotnet/azure/sdk/authentication). `DefaultAzureCredential` supports multiple authentication methods and determines which should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs production) without implementing environment specific code.

The order and locations in which `DefaultAzureCredential` looks for credentials is shown in the diagram and table below.

:::image type="content" source="../articles/storage/blobs/media/storage-blobs-introduction/authentication-defaultazurecredential.png" alt-text="A diagram of the DefaultAzureCredential order.":::

For example, your app can authenticate using your Visual Studio sign-in credentials with when developing locally, but then use Managed Identity once it has been deployed to Azure. No code changes are required for this transition.

### Assign roles to your Azure AD user

[!INCLUDE [assign-roles](assign-roles.md)]

### Connect your app code using DefaultAzureCredential

You can authenticate your local app to the Blob Storage account you created using the following steps:

1. Make sure you're signed-in to the same Azure AD account you assigned the role to on your Blob Storage account. You can sign-in through the Azure CLI, Visual Studio, Visual Studio Code, or Azure PowerShell.

    [!INCLUDE [defaultazurecredential-sign-in](defaultazurecredential-sign-in.md)]

2. To implement `DefaultAzureCredential`, add the **Azure.Identity** and the **Microsoft.Extensions.Azure packages** to your application.

    ```dotnetcli
    dotnet add package Azure.Identity
    dotnet add package Microsoft.Extensions.Azure
    ```

    Azure services can be accessed using corresponding client classes from the SDK. These classes should be registered in the Program.cs file so they can be accessed via dependency injection throughout your app. 
    
3. Update your code inside of `Program.cs` to match the following code segment. When the above code is run on your local workstation during development, it will use the developer credentials of whatever prioritized tool you're logged into to authenticate to Azure.

    ```csharp
    using Microsoft.Extensions.Azure;
    using Azure.Identity;
    
    var blobClient = new BlobServiceClient(
            new Uri("https://<account-name>.blob.core.windows.net"),
            new DefaultAzureCredential())
    ```

    > [!IMPORTANT]
    > When deployed to Azure this same application code can also authenticate to other Azure services. However, you will need to enable managed identity on your app in Azure, and then configure your Blob Storage account to allow that managed identity to connect. You can find detailed instructions for how to configure this connection between Azure services in the [Auth from Azure-hosted](/dotnet/azure/sdk/authentication-azure-hosted-apps) apps tutorial.

## [Connection String](#tab/connection-string)

### Retrieve your credentials from the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Locate your storage account.
3. In the storage account menu pane, under **Security + networking**, select **Access keys**. Here, you can view the account access keys and the complete connection string for each key.

    ![Screenshot that shows where the access key settings are in the Azure portal](./media/storage-access-keys-portal/portal-access-key-settings.png)
 
1. In the **Access keys** pane, select **Show keys**.
1. In the **key1** section, locate the **Connection string** value. Select the **Copy to clipboard** icon to copy the connection string. You'll add the connection string value to an environment variable in the next section.

    ![Screenshot showing how to copy a connection string from the Azure portal](./media/storage-copy-connection-string-portal/portal-connection-string.png)

### Configure your storage connection string

After you copy the connection string, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<yourconnectionstring>` with your actual connection string.

**Windows**:

```cmd
setx AZURE_STORAGE_CONNECTION_STRING "<yourconnectionstring>"
```

**Linux**:

```bash
export AZURE_STORAGE_CONNECTION_STRING="<yourconnectionstring>"
```

After you add the environment variable in Windows, you must start a new instance of the command window.

#### Restart programs

After you add the environment variable, restart any running programs that will need to read the environment variable. For example, restart your development environment or editor before you continue.

### Configure the connection string

The code below retrieves the connection string for the storage account from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `Main` method:

```csharp
// Retrieve the connection string for use with the application. 
string connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");

// Create a BlobServiceClient object 
BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
```

> [!IMPORTANT]
> Connection strings should be used with caution. If your connection string is lost or accidentally placed in an insecure location, your service may become vulnerable. DefaultAzureCredential provides enhanced security features and benefits and is the recommended approach for managing authentication to Azure services.

---