---
title: "include file"
description: "include file"
services: storage
author: twooley
ms.service: storage
ms.topic: include
ms.date: 02/25/2022
ms.author: twooley
ms.custom: include file
---

## Authenticating the app to Azure

Application requests to Azure Blob Storage must be authenticated. `DefaultAzureCredential` is the recommended approach for implementing authentication to Azure services in your code, including Blob Storage. 

Azure Blob Storage also provides the option to authenticate using Connection Strings, but this approach should be used with caution. `DefaultAzureCredential` offers improved management and security benefits over connection strings. Both options are demonstrated in the following example.

## [DefaultAzureCredential (Recommended)](#tab/managed-identity)

`DefaultAzureCredential` is a class provided by the Azure SDK for .NET, which you can learn more about on the [Managed Identity Overview](/en-us/dotnet/azure/sdk/authentication). `DefaultAzureCredential` supports multiple authentication methods and determines which should be used at runtime. This enables your app to use different authentication methods in different environments (local vs production) without implementing environment specific code.

The order and locations in which `DefaultAzureCredential` looks for credentials is shown in the diagram and table below.

:::image type="content" source="../articles/storage/blobs/media/storage-blobs-introduction/authentication-defaultazurecredential.png" alt-text="A diagram of the DefaultAzureCredential order.":::

For example, your app can authenticate using your Visual Studio login when developing locally, but then use Managed Identity once it has been deployed to Azure. No code changes are required for this transition.

### Assign roles to your Azure AD user

When developing locally, you need to make sure the user you want to connect to your storage account with has the correct permissions. 

1. In the Azure Portal, locate your storage account using the main search bar or left navigation.

2. On the storage account overview page, select **Access control (IAM)** from the left-hand menu.	

3. On the **Access control (IAM)** page, select the **Role assignments** tab.

4. Select **+ Add** from the top menu and then **Add role assignment** from the resulting drop-down menu.

    :::image type="content" source="../articles/storage/blobs/media/storage-blobs-introduction/access-control-small.png" alt-text="A screenshot enabling managed identity." lightbox="../articles/storage/blobs/media/storage-blobs-introduction/access-control.png":::

5. Use the search box to filter the results to the desired role. For this example, search for *Storage Blob Data Contributor* and select the matching result and then choose **Next**.

6. Under **Assign access to**, select **User, group, or service principal**, and then choose **+ Select members**.

7. In the dialog, search for your Azure AD username (usually your email address) and then choose **Select** at the bottom of the dialog. 

8. Select **Review + assign** to go to the final page, and then **Review + assign** again to complete the process.

### Connect your app code using DefaultAzureCredential

You can authenticate your local app to the Blob Storage account you created using the following steps:

1. Make sure you are signed-in to the same Azure AD account you assigned the role to on your Blob Storage account. You can sign-in through Visual Studio, Visual Studio Code, Azure CLI, or Azure PowerShell.

    [!INCLUDE [defaultazurecredential-sign-in](defaultazurecredential-sign-in.md)]

2. To implement `DefaultAzureCredential`, add the **Azure.Identity** and the **Microsoft.Extensions.Azure packages** to your application.

    ```dotnetcli
    dotnet add package Azure.Identity
    dotnet add package Microsoft.Extensions.Azure
    ```

    Azure services can be accessed using corresponding client classes from the SDK. These classes should be registered in the Program.cs file so they can be accessed via dependency injection throughout your app. 
    
3. Update your code inside of `Program.cs` to match the following code segment. When the above code is run on your local workstation during development, it will use the developer credentials of whatever prioritized tool you are logged into to authenticate to Azure.

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

### Get the connection string

The code below retrieves the connection string for the storage account from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `Main` method:

```csharp
// Retrieve the connection string for use with the application. 
string connectionString = Environment.GetEnvironmentVariable("AZURE_STORAGE_CONNECTION_STRING");

// Create a BlobServiceClient object 
BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
```

---