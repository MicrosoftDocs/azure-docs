---
title: "Configure Durable Functions App With Managed Identity"
description: "Learn how to configure a Durable Functions app with managed identity for secure, secret-free access to Azure Storage. Follow this quickstart to set up identity-based connections."
author: naiyuantian
ms.topic: quickstart
ms.service: azure-functions
ms.date: 04/23/2026
ms.author: azfuncdf
---

# Quickstart: Configure Durable Functions with managed identity 

This quickstart shows how to configure a Durable Functions app using the default **Azure Storage provider** to use identity-based connections, so your app can access its storage account without managing secrets. A [managed identity from Microsoft Entra ID](/entra/fundamentals/what-is-entra) is managed by the Azure platform — you don't need to provision or rotate any secrets.

In this article:

- [Local development setup](#local-development-setup) — Use Azurite or your developer credentials for local testing
- [Identity-based connections for app deployed to Azure](#identity-based-connections-for-app-deployed-to-azure) — Enable a managed identity and configure your function app 

> [!NOTE]
> Managed identity is supported in [Durable Functions extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) versions **2.7.0** and greater.

If you don't have an Azure account, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Prerequisites

To complete this quickstart, you need:

- An existing Durable Functions project created in the Azure portal or a local Durable Functions project deployed to Azure.
- Familiarity running a Durable Functions app in Azure. 

If you don't have an existing Durable Functions project deployed in Azure, we recommend that you start with one of the following quickstarts:

- [Create your first durable function - C#](durable-functions-isolated-create-first-csharp.md)
- [Create your first durable function - JavaScript](quickstart-js-vscode.md)
- [Create your first durable function - Python](quickstart-python-vscode.md)
- [Create your first durable function - PowerShell](quickstart-powershell-vscode.md)
- [Create your first durable function - Java](quickstart-java.md)


## Local development setup 

You have two options for local development. Use Azurite for quick local testing without Azure credentials. If you need to test identity-based connections against a real Azure Storage account, use your developer credentials instead.

### Option 1: Use the Azure Storage emulator
When developing locally, it's recommended that you use Azurite, which is Azure Storage's local emulator. Configure your app to the emulator by specifying `"AzureWebJobsStorage": "UseDevelopmentStorage=true"` in the local.settings.json.

### Option 2: Identity-based connections for local development
Strictly speaking, a managed identity is only available to apps when executing on Azure. However, you can still configure a locally running app to use identity-based connection by using your developer credentials to authenticate against Azure resources. Then, when deployed on Azure, the app will utilize your managed identity configuration instead.

When using developer credentials, the connection attempts to get a token from the following locations, in this order:

1. A local cache shared between Microsoft applications
1. The current user context in Visual Studio
1. The current user context in Visual Studio Code
1. The current user context in the Azure CLI

If none of these options are successful, you get an error indicating the app can't retrieve an authentication token. Verify you're signed into one of the listed tools with an account that has access to your Azure Storage account. 

#### Configure runtime to use local developer identity
1. Specify the name of your Azure Storage account in local.settings.json, for example: 
   ```json
   {
      "IsEncrypted": false,
      "Values": {
         "AzureWebJobsStorage__accountName": "<<your Azure Storage account name>>",
         "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
      }
   }
   ```
2. Navigate to your Azure Storage account resource in the Azure portal.

3. Select the **Access Control (IAM)** tab, and then select **Add role assignment**.

4. Assign each of the following roles to yourself. For each role, select **"+ Select members"** and search for the email you use to sign into Visual Studio, Visual Studio Code, or the Azure CLI.

   * Storage Queue Data Contributor 
   * Storage Blob Data Contributor 
   * Storage Table Data Contributor 

   > [!NOTE]
   > These are the same three roles required for your managed identity when deploying to Azure. See [Assign access roles to the managed identity](#assign-access-roles-to-the-managed-identity).

   :::image type="content" source="./media/durable-functions-configure-df-with-credentials/assign-access-user.png" alt-text="Screenshot of assigning Storage Data Contributor roles to a user in the Azure portal Access Control page.":::

## Identity-based connections for app deployed to Azure

### Enable a managed identity resource 

To begin, enable a managed identity for your application. Your function app must have either a system-assigned managed identity or a user-assigned managed identity. To enable a managed identity for your function app, and to learn more about the differences between the two types of identities, see the [managed identity overview](../../app-service/overview-managed-identity.md).   

### Assign access roles to the managed identity

Navigate to your app's Azure Storage resource on the Azure portal and [assign](/entra/identity/managed-identities-azure-resources/how-to-assign-access-azure-resource) three role-based access control (RBAC) roles to your managed identity resource:

* Storage Queue Data Contributor 
* Storage Blob Data Contributor 
* Storage Table Data Contributor 

To find your identity resource, select assign access to **Managed identity** and then **+ Select members** 

:::image type="content" source="./media/durable-functions-configure-df-with-credentials/assign-access-managed-identity.png" alt-text="Screenshot of assigning storage access roles to a managed identity in the Azure portal.":::

### Add the managed identity configuration to your app

Before you can use your app's managed identity, make some changes to the app settings:

1. In the Azure portal, on your function app resource menu under **Settings**, select **Environment variables**.

1. In the list of settings, find **AzureWebJobsStorage** and select the **Delete** icon.
   :::image type="content" source="./media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-01.png" alt-text="Screenshot of the AzureWebJobsStorage environment variable in the Azure portal function app settings." lightbox="./media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-01.png":::

1. Add a setting to link your Azure storage account to the application.

   Use *one of the following methods* depending on the cloud that your app runs in:

   - **Azure cloud**: If your app runs in *global Azure*, add the setting `AzureWebJobsStorage__accountName` that identifies an Azure storage account name. Example value: `mystorageaccount123`

   - **Non-Azure cloud**: If your application runs in a cloud outside of Azure, you must add the following three settings to provide specific service URIs (or *endpoints*) of the storage account instead of an account name.

      - Setting name: `AzureWebJobsStorage__blobServiceUri`

         Example value: `https://mystorageaccount123.blob.core.windows.net/` 

      - Setting name: `AzureWebJobsStorage__queueServiceUri`

         Example value: `https://mystorageaccount123.queue.core.windows.net/` 

      - Setting name: `AzureWebJobsStorage__tableServiceUri`

         Example value: `https://mystorageaccount123.table.core.windows.net/` 

   You can get the values for these URI variables in the storage account information from the **Endpoints** tab.

   :::image type="content" source="media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-02.png" alt-text="Screenshot of the storage account endpoints tab showing blob, queue, and table service URIs.":::

   > [!NOTE] 
   > If you are using [Azure Government](../../azure-government/documentation-government-welcome.md) or any other cloud that's separate from global Azure, you must use the option that provides specific service URIs instead of just the storage account name. For more information on using Azure Storage with Azure Government, see the [Develop by using the Storage API in Azure Government](../../azure-government/documentation-government-get-started-connect-to-storage.md). 

1. Finish your managed identity configuration (remember to click "Apply" after making the setting changes): 

   * If you use a *system-assigned identity*, make no other changes. 

   * If you use a *user-assigned identity*, add the following settings in your app configuration:  

     * **AzureWebJobsStorage__credential**, enter **managedidentity** 

     * **AzureWebJobsStorage__clientId**, get this GUID value from your managed identity resource

   :::image type="content" source="media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-03.png" alt-text="Screenshot of the user-assigned managed identity resource showing the client ID value.":::

   > [!NOTE] 
   > Durable Functions does *not* support `managedIdentityResourceId` when using user-assigned identity. Use `clientId` instead. 

## Verify your configuration

To confirm your managed identity configuration works:

1. In the Azure portal, navigate to your function app and trigger your Durable Functions orchestration (for example, by using an HTTP-trigger function).
1. Check that the orchestration completes successfully by querying the status endpoint or checking the **Monitor** tab.
1. If you see authentication errors, verify that:
   - All three Storage Data Contributor roles are assigned to the correct identity.
   - The `AzureWebJobsStorage` connection string setting is removed.
   - The `AzureWebJobsStorage__accountName` (or service URI) settings are correct.

## Next steps

- [Managed identity overview for App Service and Azure Functions](../../app-service/overview-managed-identity.md)
- [Durable Functions Azure Storage provider](durable-functions-azure-storage-provider.md)
- [Durable Functions storage providers overview](../../durable-task/common/durable-task-storage-providers.md)







