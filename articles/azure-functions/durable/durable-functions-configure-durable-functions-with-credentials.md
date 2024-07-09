---
title: "Quickstart: Configure Durable Functions by using Microsoft Entra ID"
description: Configure Durable Functions in Azure Functions by using managed identity credentials and client secret credentials.
author: naiyuantian
ms.topic: quickstart
ms.date: 02/01/2023
ms.author: azfuncdf
---

# Quickstart: Configure Durable Functions in Azure Functions by using Microsoft Entra ID

[Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md) (Microsoft Entra ID) is a cloud-based identity and access management service. Identity-based connections allow Durable Functions, a feature of Azure Functions, to make authorized requests against Microsoft Entra protected resources, like an Azure Storage account, without the need to manage secrets manually. Using the default Azure storage provider, Durable Functions needs to authenticate against an Azure storage account. In this quickstart, we walk through the steps to configure a Durable Functions app to use two kinds of Identity-based connections: *managed identity credentials* and *client secret credentials*.

If you don't have an Azure account, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Configure your app to use managed identity (recommended)

A [managed identity](../../app-service/overview-managed-identity.md) allows your app to easily access other Microsoft Entra-protected resources such as Azure Key Vault. A managed identity is supported in the [Durable Functions extension](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask) version 2.7.0 and later.

> [!NOTE]
> A managed identity is available to apps only when they execute on Azure. When an app is configured to use identity-based connections, a locally executing app uses your *developer credentials* to authenticate with Azure resources. Then, when deployed on Azure, it uses your managed identity configuration instead.

## Prerequisites

To complete this quickstart, you need:

* An existing Durable Functions project created in the Azure portal or a local Durable Functions project deployed to Azure.
* Familiarity running a durable function app in Azure.

If you don't have an existing Durable Functions project deployed in Azure, we suggest you start with one of the following quickstarts to create and deploy the prerequisite project:

* [Create your first durable function - C#](durable-functions-create-first-csharp.md)
* [Create your first durable function - JavaScript](quickstart-js-vscode.md)
* [Create your first durable function - Python](quickstart-python-vscode.md)
* [Create your first durable function - PowerShell](quickstart-powershell-vscode.md)
* [Create your first durable function - Java](quickstart-java.md)

### Enable managed identity

Only one identity is needed for your function, either a **system assigned managed identity** or a **user assigned managed identity**. To enable a managed identity for your function and learn more about the differences between the two identities, read the detailed instructions [here](../../app-service/overview-managed-identity.md).

### Assign Role-based Access Controls (RBAC) to managed identity

Go to your app's storage resource on the Azure portal. Follow [these instructions](../../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md) to assign the following roles to your managed identity resource.

* Storage Queue Data Contributor
* Storage Blob Data Contributor
* Storage Table Data Contributor

### Add a managed identity configuration in the Azure portal

Go to your Azure function app’s **Configuration** page and perform the following changes:

1. Remove the default value **AzureWebJobsStorage**.

   ![Screenshot of the default storage setting.](./media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-01.png)

1. Link your Azure storage account by adding *either one* of the following value settings:

   * An account name:

     * `AzureWebJobsStorage__accountName` (example: `mystorageaccount123`)

   * A specific service URL:

     * `AzureWebJobsStorage__blobServiceUri` (example: `https://mystorageaccount123.blob.core.windows.net/`)

     * `AzureWebJobsStorage__queueServiceUri` (example: `https://mystorageaccount123.queue.core.windows.net/`)

     * `AzureWebJobsStorage__tableServiceUri` (example: `https://mystorageaccount123.table.core.windows.net/`)

     > [!NOTE]
     > If you're using [Azure Government](../../azure-government/documentation-government-welcome.md) or any other cloud that's separate from global Azure, you need to use this second option to provide specific service URLs. The values for these settings can be found in the storage account under the **Endpoints** tab. For more information about using Azure Storage with Azure Government, see [Develop with Storage API on Azure Government](../../azure-government/documentation-government-get-started-connect-to-storage.md).

   ![Screenshot of an endpoint sample.](media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-02.png)

1. Finalize your managed identity configuration:

   * If you use **system-assigned identity**, then specify nothing else.

   * If you use **user-assigned identity**, then add the following app settings values in your app configuration:

     * For **AzureWebJobsStorage__credential**, enter **managedidentity**.

     * For **AzureWebJobsStorage__clientId**, get this GUID value from the Microsoft Entra admin center.

     ![Screenshot of the user identity client ID.](media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-03.png)

## Configure your app to use client secret credentials

Registering a client application in Microsoft Entra ID is another way that you can configure access to an Azure service. In the following steps, you learn how to use client secret credentials for authentication to your Azure Storage account. This method can be used by function apps both locally and on Azure. However, client secret credential is **less recommended** than managed identity as it's more complicated to configure and manage and it requires sharing a secret credential with the Azure Functions service.

### Prerequisites

The following steps assume that you're starting with an existing Durable Functions app and are familiar with how to operate it.

Specifically, this quickstart assumes that you have already:

* Created a Durable Functions project on your local machine or in the Azure portal.

<a name='register-a-client-application-on-azure-active-directory'></a>

### Register a client application on Microsoft Entra ID

1. In the Azure portal under Microsoft Entra ID, [register a client application](../../healthcare-apis/register-application.md).

1. Create a client secret for your client application. In your registered application, complete these steps:  

   1. Select **Certificates & Secrets** > **New client secret**.  

   1. For **Description**, enter a value.

   1. For **Expires**, enter a valid time for the secret to expire.  

   1. Copy and save the secret value carefully. The secret value doesn't appear again after you leave the pane.

   ![Screenshot of the client secret page.](media/durable-functions-configure-df-with-credentials/durable-functions-client-secret-scenario-01.png)

### Assign role-based access control (RBAC) roles to the client application

Assign these three roles to your client application by using the steps that are described next:

* Storage Queue Data Contributor
* Storage Blob Data Contributor
* Storage Table Data Contributor

To add the roles:

1. Go to your function’s storage account **Access Control (IAM)** pane and add a new role assignment.

   ![Screenshot of the access control pane.](media/durable-functions-configure-df-with-credentials/durable-functions-client-secret-scenario-02.png)

1. Select the required role, select **Next**, and then search for your application. Review the role, and then add the role.

   ![Screenshot of the role assignment pane.](media/durable-functions-configure-df-with-credentials/durable-functions-client-secret-scenario-03.png)

### Add the client secret configuration

To run and test in Azure, specify the followings in your Azure function app’s **Configuration** page in the Azure portal. To run and test locally, specify the following in the function’s *local.settings.json* file.

1. Remove the default value **AzureWebJobsStorage**.

1. Link your Azure storage account by adding any of the following value settings:

   * **AzureWebJobsStorage__accountName**: For example, `mystorageaccount123`.

   * **AzureWebJobsStorage__blobServiceUri**: For example, `https://mystorageaccount123.blob.core.windows.net/`.

     **AzureWebJobsStorage__queueServiceUri**: For example, `https://mystorageaccount123.queue.core.windows.net/`.

     **AzureWebJobsStorage__tableServiceUri**: For example, `https://mystorageaccount123.table.core.windows.net/`.

   You can get the values for these URI variables in the storage account on the **Endpoints** tab.

   ![Screenshot of an endpoint sample.](media/durable-functions-configure-df-with-credentials/durable-functions-managed-identity-scenario-02.png)

1. Add a client secret credential by specifying the following values:

   * **AzureWebJobsStorage__clientId**: Get this GUID value on the Microsoft Entra application pane.

   * **AzureWebJobsStorage__ClientSecret**: This secret value was generated in the Microsoft Entra admin center in a previous step.

   * **AzureWebJobsStorage__tenantId**: The tenant ID that the Microsoft Entra application is registered in.

   The values to use for the client ID and the tenant ID appear on your client application’s overview pane. The client secret value is the one that you saved in the previous step. It isn't available after the page is refreshed.

   ![Screenshot of application's overview page.](media/durable-functions-configure-df-with-credentials/durable-functions-client-secret-scenario-04.png)
