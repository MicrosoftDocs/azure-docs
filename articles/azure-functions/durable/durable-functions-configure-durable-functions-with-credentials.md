---
title: "Configure Durable Functions with managed identity"
description: Configure Durable Functions with managed identity
author: naiyuantian
ms.topic: quickstart
ms.date: 07/24/2024
ms.author: azfuncdf
---

# Configure Durable Functions with managed identity 

A managed identity from the access management service [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md) allows your app to access other Microsoft Entra protected resources without handling secrets manually. The identity is managed by the Azure platform, so you do *not* need to provision or rotate any secrets. The recommended way to authenticate access to Azure resources is through using such an identity. In this article, we show how to configure a Durable Functions app that is using the default Azure Storage provider to use a managed identity to access the storage account. 

## Local development 

### Use Azure Storage emulator
When developing locally, it's recommended that you use Azurite, which is Azure Storage's local emulator. You can configure your app to the emulator by specifying `"AzureWebJobsStorage": "UseDevelopmentStorage = true"` in the local.settings.json.

### Identity-based connections for local development

You can still use an identity-based connection for local development if you prefer. Strictly speaking, a managed identity is only available to apps when executing on Azure. When configured to use identity-based connections, a locally executing app will utilize your developer credentials to authenticate with Azure resources. Then, when deployed on Azure, it will utilize your managed identity configuration instead.

When using your developer credentials, the connection attempts to get a token from the following locations, in the said order, for access to your Azure resources:

- A local cache shared between Microsoft applications
- The current user context in Visual Studio
- The current user context in Visual Studio Code
- The current user context in the Azure CLI

If none of these options are successful, an error occurs.

#### Configure runtime to use local developer identity
1. Specify the name of your Azure Storage account in local.settings.json: 
   ```json
   {
      "IsEncrypted": false,
      "Values": {
         "AzureWebJobsStorage__accountName": "<<your Azure Storage account name>>",
         "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
      }
   }
   ```
2. Go to the Azure Storage account resource on Azure Portal, navigate to the **Access Control (IAM)** tab, and click on **Add role assignment**. Find the following roles: 
   * Storage Queue Data Contributor 
   * Storage Blob Data Contributor 
   * Storage Table Data Contributor 

   Assign the roles to yourself by clicking "+ Select members" and finding your email in the pop-up window. (This email is the one you use to log into Microsoft applications, Azure CLI, or editors in the Visual Studio family.)

   ![Assign access to user](./media/durable-functions-managed-identity/assign-access-user.png)

## Identity-based connections for app deployed to Azure

Managed identity is supported in [Durable Functions extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) versions **2.7.0** and greater. 

### Prerequisites

The following steps assume that you're starting with an existing Durable Functions app and are familiar with how to operate it. In particular, this quickstart assumes that you have already: 

* Deployed an app running in Azure that has Durable Functions. 

If this isn't the case, we suggest you start with one of the following articles, which provides detailed instructions on how to achieve all the requirements above:

- [Create your first durable function - C#](durable-functions-create-first-csharp.md)
- [Create your first durable function - JavaScript](quickstart-js-vscode.md)
- [Create your first durable function - Python](quickstart-python-vscode.md)
- [Create your first durable function - PowerShell](quickstart-powershell-vscode.md)
- [Create your first durable function - Java](quickstart-java.md)

### Enable managed identity resource 

Only one identity is needed for your function, either a **system assigned managed identity** or a **user assigned managed identity**. To enable a managed identity for your function application and learn more about the differences between the two identities, read the [detailed instructions](../../app-service/overview-managed-identity.md).   

### Assign access roles to the managed identity

Navigate to your app's Azure Storage resource on the Azure portal and [assign the following roles](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/how-to-assign-access-azure-resource) to your managed identity resource:

* Storage Queue Data Contributor
* Storage Blob Data Contributor
* Storage Table Data Contributor

You'll need to select assign access to "Managed identity" and then "+ Select members" to find your identity resource: 

![Assign access to managed identity](./media/durable-functions-managed-identity/assign-access-managed-identity.png)

### Add managed identity configuration to your app

Navigate to your Azure Functions app’s **Configuration** page and perform the following changes: 

1. Remove the default value "AzureWebJobsStorage". 

  [ ![Screenshot of default storage setting.](./media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-01.png)](./media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-01.png#lightbox)

2. Link your Azure Storage account by adding **either one** of the following value settings (remember to click "Apply" after making the setting changes): 

   * Option 1: 
      **AzureWebJobsStorage__accountName**: For example: `mystorageaccount123`

   * Option 2: 
      **AzureWebJobsStorage__blobServiceUri**: Example: `https://mystorageaccount123.blob.core.windows.net/` 

       Example: `AzureWebJobsStorage__mystorageaccount123`

   * **Non-Azure cloud**: If your application runs in a cloud outside of Azure, you must add a specific service URI (an *endpoint*) for the storage account instead of an account name.

     > [!NOTE] 
     > If you are using [Azure Government](../../azure-government/documentation-government-welcome.md) or any other cloud that's separate from global Azure, then you will need to use this second option to provide specific service URLs. The values for these settings can be found in the storage account under the **Endpoints** tab. For more information on using Azure Storage with Azure Government, see the [Develop with Storage API on Azure Government](../../azure-government/documentation-government-get-started-connect-to-storage.md) documentation. 

   ![Screenshot of endpoint sample.](media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-02.png)

3. Finalize your managed identity configuration (remember to click "Apply" after making the setting changes): 

   * If **system-assigned identity** should be used, then specify nothing else. 

   * If **user-assigned identity** should be used, then add the following app settings values in your app configuration:  
     * **AzureWebJobsStorage__credential**: managedidentity 

     * **AzureWebJobsStorage__clientId**: (This is a GUID value that you obtain from your managed identity resource)

     :::image type="content" source="media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-03.png" alt-text="Screenshot that shows the user identity client ID." lightbox="media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-03.png":::
     
      > [!NOTE] 
      > Durable Functions does not support `managedIdentityResourceId` when using user-assigned identity. Use `clientId` instead. 
   





