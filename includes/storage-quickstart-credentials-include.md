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

When an application makes a request to Azure Storage, it must be authorized. Managed Identity is the recommended approach for authentication between Azure services. You can read more about the benefits of this approach in the [Managed Identity overview]("/dotnet/azure/sdk/authentication-azure-hosted-apps"). 

Azure Storage also provides the option to use Connection Strings, which offer a simple solution but should be used with caution. Managed Identity provides improved management and security benefits over connection strings. Both options are outlined in the following example.

## [Managed Identity](#tab/managed-identity)

### Enable Managed Identity on the application

1. Navigate to the resource that hosts your application code in the Azure portal.
 
2. On the page for your resource, select the Identity menu item from the left-hand menu. All Azure resources capable of supporting managed identity will have an Identity menu item even though the layout of the menu may vary slightly.

3. On the identity page, change the *status* toggle to *On*, and then select *Save*. Choose *Yes* in the confirmation dialog.

### Assign roles to the managed identity

1. Locate the resource group for your application by searching for the resource group name using the search box at the top of the Azure portal.

2. On the page for the resource group, select Access control (IAM) from the left-hand menu.	

3. On the *Access control (IAM)* page, select the *Role assignments* tab.

4. Select + Add from the top menu and then Add role assignment from the resulting drop-down menu.

5. Use the search box to filter the results to the desired role. For this example, search for *Storage Blob Data Contributor* and select the matching result and then choose *Next*.

6. Under *Assign access to*, select Managed identity, and then choose *+ Select members*.

7. In the *Select managed identities* dialog, choose the managed identity for the Azure resource hosting your application and then choose *Select* at the bottom of the dialog. 

8. Select Review + assign to go to the final page, and then *Review + assign* again to complete the process.

### Configure your connection

DefaultAzureCredential supports multiple authentication methods and determines the authentication method being used at runtime. In this way, your app can use different authentication methods in different environments without implementing environment specific code. This means you can develop locally and deploy to production without manually changing any code or credentials.

The order and locations in which DefaultAzureCredential looks for credentials is shown in the diagram and table below.

:::image type="content" source="../articles/storage/blobs/media/storage-blobs-introduction/authentication-defaultazurecredential.png" alt-text="A diagram of the DefaultAzureCredential order.":::

To implement DefaultAzureCredential, add the Azure.Identity and optionally the Microsoft.Extensions.Azure packages to your application.

```dotnetcli
dotnet add package Azure.Identity
dotnet add package Microsoft.Extensions.Azure
```

Azure services are generally accessed using corresponding client classes from the SDK. These classes and your own custom services should be registered in the Program.cs file so they can be accessed via dependency injection throughout your app. 

An example of this setup is shown in the following code segment inside of `Program.cs`.

```csharp
using Microsoft.Extensions.Azure;
using Azure.Identity;

// Inside of Program.cs
builder.Services.AddAzureClients(x =>
{
    x.AddBlobServiceClient(new Uri("https://<account-name>.blob.core.windows.net"));
    x.UseCredential(new DefaultAzureCredential());
});
```
When the above code is run on your local workstation during development, it will look in the environment variables for an application service principal or at Visual Studio, VS Code, the Azure CLI, or Azure PowerShell for a set of developer credentials.

When deployed to Azure this same code can also authenticate your app to other Azure resources. DefaultAzureCredential can retrieve environment settings and the managed identity configurations you setup earlier to authenticate to other services automatically.

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

## [Windows](#tab/connection-string/environment-variable-windows)

```cmd
setx AZURE_STORAGE_CONNECTION_STRING "<yourconnectionstring>"
```

## [Linux and macOS](#tab/connection-string/environment-variable-linux)

```bash
export AZURE_STORAGE_CONNECTION_STRING="<yourconnectionstring>"
```
---

After you add the environment variable in Windows, you must start a new instance of the command window.

#### Restart programs

After you add the environment variable, restart any running programs that will need to read the environment variable. For example, restart your development environment or editor before you continue.

---