---
title: "Configure Durable Functions with Azure Active Directory"
description: Configure Durable Functions with Managed Identity Credentials and Client Secret Credentials.
author: naiyuantian
ms.topic: quickstart
ms.date: 02/01/2023
ms.author: azfuncdf
---

# Configure Durable Functions with Azure Active Directory

[Azure Active Directory](../../active-directory/fundamentals/active-directory-whatis.md)(Azure AD) is a cloud-based identity and access management service. Identity-based connections allow Durable Functions to make authorized requests against Azure Active Directory (Azure AD) protected resources, like an Azure Storage account, without the need to manage secrets manually. Using the default storage provider, Durable Functions needs to authenticate against an Azure storage account. In this article, we show how to configure a Durable Functions app to utilize two kinds of Identity-based connections: **Managed Identity Credentials** and **Client Secret Credentials**.


## Configure your app to use Managed Identity (Recommended)

[Managed identity](../../app-service/overview-managed-identity.md) allows your app to easily access other Azure AD-protected resources such as Azure Key Vault. This can **only be used in the Azure Portal**. Managed Identity is supported in [Durable Functions extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) versions **2.7.0** and greater.  

### Prerequisites

The following steps assume that you're starting with an existing Durable Functions app and are familiar with how to operate it. 
In particular, this quickstart assumes that you have already: 

* Created a Durable Function project in the Azure Portal or deployed a local Durable Function to Azure. 

If this isn't the case, we suggest you start with one of the following articles, which provides detailed instructions on how to achieve all the requirements above:

- [Create your first durable function - C#](durable-functions-create-first-csharp.md)
- [Create your first durable function - JavaScript](quickstart-js-vscode.md)
- [Create your first durable function - Python](quickstart-python-vscode.md)
- [Create your first durable function - PowerShell](quickstart-powershell-vscode.md)
- [Create your first durable function - Java](quickstart-java.md)

### Enable Managed Identity

Only one identity is needed for your function, either a **system assigned managed identity** or a **user assigned managed identity**. To enable Managed Identity for your function and learn more about the differences between the two identities, read the detailed instructions [here](../../app-service/overview-managed-identity.md).   

### Assign Role-based Access Controls (RBAC) to Managed Identity

Navigate to your app's storage resource on the Azure portal. Follow [these instructions](../../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md) to assign the following roles to your managed identity resource.

* Storage Queue Data Contributor 
* Storage Blob Data Contributor 
* Storage Table Data Contributor 

### Add Managed Identity Configuration in the Azure Portal

Navigate to your Azure function app’s **Configuration** page and perform the following changes: 

1. Remove the default value "AzureWebJobsStorage". 

   ![Default Sample](./media/durable-functions-configure-df-with-credentials/durable-functions-MI-scenario-01.png)

2. Link Azure storage account by adding **either one** of the following value settings: 

   * **AzureWebJobsStorage__accountName**: MyStorageAccount 

   * **AzureWebJobsStorage__blobServiceUri**: MyBlobEndpoint; 
   **AzureWebJobsStorage__queueServiceUri**: MyQueueEndpoint;
   **AzureWebJobsStorage__tableServiceUri**: MyTableEndpoint. 
   
   The values for these variables can be found in the storage account under the **Endpoints** tab. 

   ![Endpoint Sample](media/durable-functions-configure-df-with-credentials/durable-functions-MI-scenario-02.png)

3. Managed Identity setting: 

   * If **system-assigned identity** should be used:  then specify nothing else and let the [DefaultAzureCredential Class](https://learn.microsoft.com/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet) take care of everything. 

   * If **user-assigned identity** should be used: then add the following value settings in configuration: 
     * **AzureWebJobsStorage__credential**: managedidentity 

     * **AzureWebJobsStorage__clientId**: MyUserIdentityClientId

     ![user identity client id Sample](media/durable-functions-configure-df-with-credentials/durable-functions-MI-scenario-03.png)



## Configure your app to use Client Secret Credential

Registering a client application in Azure Active Directory (Azure AD) can also help us get access to an Azure service. In the following steps, you will learn how to use client secret credentials for authentication.  This method can be used both locally and on Azure. However, Client Secret Credential is **less recommended** compared to Managed Identity since this is sensitive information and including this in your function might cause security concerns. 

### Prerequisites 

The following steps assume that you're starting with an existing Durable Functions app and are familiar with how to operate it. 
In particular, this quickstart assumes that you have already: 

* Created a Durable Functions project on your local machine or in the Azure Portal. 


### Register a Client Application on Azure Active Directory 
1. Register a client application under Azure Active Directory on Azure Portal according to [these instructions](../../healthcare-apis/register-application.md).

2. Create a Client Secret for your client application. In your registered application,  

   1. Select **Certificates & Secrets** and select **New Client Secret**.  

   2. Add **description** and choose secret valid time in **Expires** field.  

   3. Copy and save the secret value carefully because it will not show up again.  
   
   ![Client Secret Sample](media/durable-functions-configure-df-with-credentials/durable-functions-CS-scenario-01.png)

### Assign Role-based Access Controls (RBAC) to the Client Application 

Assign these three roles to your client application with the following steps. 

* Storage Queue Data Contributor 
* Storage Blob Data Contributor 
* Storage Table Data Contributor 

1. Navigate to your function’s storage account **Access Control(IAM)** and add a new role assignment. 

   ![Access Control Sample](media/durable-functions-configure-df-with-credentials/durable-functions-CS-scenario-02.png)

2. Choose the required role, click next, then search for your application, review and add. 

   ![Role Assignment Sample](media/durable-functions-configure-df-with-credentials/durable-functions-CS-scenario-03.png)

### Add Client Secret Configuration 

To run and test in Azure, specify the following in your Azure function app’s **Configuration** page. To run and test locally, specify the following in the function’s **local.settings.json** file. 

1. Remove the default value "AzureWebJobsStorage". 

2. Link Azure storage account by adding either one of the following value settings:

   * **AzureWebJobsStorage__accountName**: MyStorageAccount 

   * **AzureWebJobsStorage__blobServiceUri**: MyBlobEndpoint;
    **AzureWebJobsStorage__queueServiceUri**: MyQueueEndpoint; 
    **AzureWebJobsStorage__tableServiceUri**: MyTableEndpoint. 
   
   The values for these Uri variables can be found in the storage account under the **Endpoints** tab. 
   
   ![Endpoint Sample](media/durable-functions-configure-df-with-credentials/durable-functions-MI-scenario-02.png)

3. Add client secret credentials by specifying the following values: 
   * **AzureWebJobsStorage__clientId**: MyClientId 

   * **AzureWebJobsStorage__ClientSecret**: MyClientSecret

   * **AzureWebJobsStorage__tenantId**: MyTenantId

   Client Secret is saved when you create it and the other two values can be found on your client application’s overview page. 
   
   ![client secret Sample](media/durable-functions-configure-df-with-credentials/durable-functions-CS-scenario-04.png)


## (Optional) Configure a custom non-AzureWebJobsStorage storage connection  

Durable Functions supports using a separate storage account for Durable Task related operations. If this setting is desired, the steps are as follows:  

1. Use the following configuration in host.json: 
    ```json
    {
        "extensions":{
           "durableTask":{
              "hubName": "myTestHub",
              "storageProvider":{
               "connectionStringName": "MySeperateStorageAccount"
              }
           }
        }
    }
    ```

2. In your function’s configuration or local.settings.json, add the value  **mySeparateStorageAccount: storage account connection string**. The connection string can be found in the storage account’s **Access keys**: 

   ![connection string Sample](media/durable-functions-configure-df-with-credentials/durable-functions-option-scenario-01.png)
