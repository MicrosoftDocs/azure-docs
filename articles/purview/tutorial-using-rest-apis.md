---
title: "Tutorial: Use the REST APIs"
description: This tutorial describes how to use the Azure Purview REST APIs to access the contents of your catalog.
author: hophanms
ms.author: hophan
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 12/03/2020

# Customer intent: I can call the catalog's REST APIs to search and manipulate the contents of the catalog.
---

# Tutorial: Use the REST APIs

In this tutorial, you learn how to use the Azure Purview REST APIs. Anyone who wants to submit data to an Azure Purview Catalog, include the catalog as part of an automated process, or build their own user experience on the catalog can use the REST APIs to do so.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a service principal (application).
> * Configure your catalog to trust the service principal (application).
> * View the REST APIs documentation.
> * Collect the necessary values to use the REST APIs.
> * Use the Postman client to call the REST APIs.
> * Generate a .NET client to call the REST APIs.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

## Prerequisites

* To get started, you must have an existing Azure Purview account. If you don't have a catalog, see the [quickstart for creating a Azure Purview account](create-catalog-portal.md).

* If you need to add data to your catalog, see the [tutorial to run the starter kit and scan data](tutorial-scan-data.md).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Create a service principal (application)

For a REST API client to access the catalog, the client must have a service principal (application), and an identity that the catalog recognizes and is configured to trust. When you make REST API calls to the catalog, they use the service principal's identity.

Customers who have used existing service principals (application IDs) have had a high rate of failure. Therefore, we recommend creating a new service principal for calling APIs.

To create a new service principal:

1. From the [Azure portal](https://portal.azure.com), search for and select **Azure Active Directory**.
1. From the **Azure Active Directory** page, select **App registrations** from the left pane.
1. Select **New registration**.
1. On the **Register an application** page:
    1. Enter a **Name** for the application (the service principal name).
    1. Select **Accounts in this organizational directory only (_&lt;your tenant's name&gt;_ only - Single tenant)**.
    1. For **Redirect URI (optional)**, select **Web** and enter a value. This value doesn't need to be a valid URI.
    1. Select **Register**.
1. On the new service principal page, copy the values of the **Display name** and the **Application (client) ID** to save for later.

   The application ID is the `client_id` value in the sample code.

To use the service principal (application), you need to get
its password. Here's how:

1. From the Azure portal, search for and select **Azure Active Directory**, and then select **App registrations** from the left pane.
1. Select your service principal (application) from the list.
1. Select **Certificates & secrets** from the left pane.
1. Select **New client secret**.
1. On the **Add a client secret** page, enter a **Description**, select an expiration time under **Expires**, and then select **Add**.

   On the **Client secrets** page, the string in the **Value** column of your new secret is your password. Save this value.

   :::image type="content" source="./media/tutorial-using-rest-apis/client-secret.png" alt-text="Screenshot showing a client secret.":::

## Configure your catalog to trust the service principal (application)

To configure Azure Purview to trust your new service principal:

1. Navigate to your Purview account

1. On the **Purview account** page, select the tab **Access control (IAM)**

1. Click **+ Add**

1. Select **Add role assignment**

1. For the Role type in **Purview Data Curator**

    > [!Note]
    > For more information on Azure Purview Data Catalog permissions, see [Catalog permissions](catalog-permissions.md). For example, if you need permission to trigger scan, the Role type must be **Purview Data Source Administrator**.

1. For **Assign access to** leave the default, **User, group, or service principal**

1. For **Select** enter the name of the previosly created service principal you wish to assign and then click on their name in the results pane.

1. Click on **Save**

You've now configured the service principal as an application administrator, which enables it to send content to the catalog.

## View the REST APIs documentation

To view the API Swagger documentation, download [PurviewCatalogAPISwagger.zip](https://github.com/Azure/Purview-Samples/raw/master/rest-api/PurviewCatalogAPISwagger.zip), extract its files, and open index.html.

If you want to learn more about the advanced search/suggest API that Azure Purview provides, see the Rest API Search Filter documentation. The AutoRest generated client doesn't currently support customized search parameters. To workaround, follow the search-filter document to define filter classes in code as API call parameters. The index.html document has examples of these APIs.

## Collect the necessary values to use the REST APIs

Find and save the following values:

* Tenant ID:
  * In the [Azure portal](https://portal.azure.com), search for and select **Azure Active Directory**.
  * In the **Manage** section in the left pane, select **Properties**, find the **Tenant ID**, and then select the **Copy to clipboard** icon to save its value.
* Atlas endpoint:
  * From the [Azure Purview accounts page](https://aka.ms/purviewportal) in the Azure portal, find and select your Azure Purview account in the list.
  * Select **Properties**, find **Atlas Endpoint**, and then select the **Copy to clipboard** icon to save its value. Remove the *https://* portion of the string when you use it later.
* Account name:
  * Extract the name of your catalog from the Atlas endpoint string. For example, if your Atlas endpoint is `https://ThisIsMyCatalog.catalog.purview.azure.com`, your account name is `ThisIsMyCatalog`.

## Use the Postman client to call the REST APIs

1. Install the [Postman client](https://www.getpostman.com/).
1. From the client, select **Import**, and use [Test.postman_collection.json](https://raw.githubusercontent.com/Azure/Purview-Samples/master/rest-api/Test.postman_collection.json).
1. Select **Collections**, and then select **Test**.
1. Select **Get Token**:
    1. In the URL next to POST, replace *&lt;your-tenant-id&gt;* with the tenant ID you copied in the previous section.
    1. Select the **Body** tab, and replace the placeholders in the path and body from the previous step.

       After you select **Send**, the response body contains a JSON structure including the name *access_token* and a quoted string value. 
    1. Copy the bearer token value (without quotes), to use in the next step.

1. Select **/v2/types/typedefs**:
    1. Replace the placeholder in the path with your atlas endpoint value. This value can be obtained by navigating to the catalog instance on Ibiza portal and clicking on overview. 

       The bearer token is set from the first step (or you can copy it in the “Authorization” tab manually).

    1. Select **Send** to get the response.

## Generate a .NET client to call the REST APIs

### Install AutoRest



1. [Install Node.js](https://github.com/Azure/autorest/blob/v2/docs/installing-autorest.md).
1. Open PowerShell and run the following command:

   ```powershell
   npm install -g autorest@V2
   ```

### Download rest-api-specs.zip and create the client

1. Download [rest-api-specs.zip](https://github.com/Azure/Purview-Samples/raw/master/rest-api/rest-api-specs.zip) and extract its files.
1. Run the following command in PowerShell from the rest-api-specs extracted folder:

   ```powershell
   autorest --input-file=data-plane/preview/purviewcatalog.json --csharp --output-folder=PurviewCatalogClient/CSharp --namespace=PurviewCatalog --add-credentials
   ```

   The output of this process creates a folder PurviewCatalogClient and subfolder CSharp in the rest-api-specs folder.

### Create a sample .NET console application

1. Open Visual Studio 2019. These instructions have been tested with the free community edition.
1. From the **Create a new project** page, create a **Console App (.NET Core)** project in C#.
1. Copy-and-paste the provided [sample code](#sample-code-for-the-console-application).
1. Replace *accountName*, *servicePrincipalId*, *servicePrincipalKey*, and *tenantId* with the values you previously collected.
1. Use **Solution Explorer** to add a folder named **Generated** in the Visual Studio project.
1. Copy the rest-api-specs\PurviewCatalogClient\CSharp folder that you previously created to the \Generated folder. Use File Explorer or the command-line prompt for the copy operation, which will trigger Visual Studio to automatically add the files to the project.
1. In **Solution Explorer**, right-click the project, and then select **Manage NuGet Packages**.
1. Select the **Browse** tab. Find and select **Microsoft.Rest.ClientRuntime**.
1. Make sure the version is at least 2.3.21, and then select **Install**.
1. Build and run the application.

The sample code returns a count of how many typedefs are in the catalog and shows how to handle role assignments. For details, see `DoRoleAssignmentOperations()` in the sample code. For more information about the project, see [Project Setup](https://github.com/Azure/autorest/blob/v2/docs/client/proj-setup.md).

### Sample code for the console application

```csharp
using Microsoft.Rest;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;

namespace PurviewCatalogSdkTest
{
    class Program
    {
        private static string accountName = "{account-name}";
        private static string servicePrincipalId = "{service-principal-id}";
        private static string servicePrincipalKey = "{service-principal-key}";
        private static string tenantId = "{tenant-id}";

        static void Main(string[] args)
        {
            Console.WriteLine("Azure Purview client");

            // You need to change the api path below (e.g. /api) based on what you're trying to call
            string baseUri = string.Format("https://{0}.catalog.purview.azure.com/api", accountName);

            // Get token and set auth
            var svcClientCreds = new TokenCredentials(getToken(), "Bearer");
            var client = new PurviewCatalog.PurviewCatalogServiceRESTAPIDocument(svcClientCreds);
            client.BaseUri = new System.Uri(baseUri);

            // /v2/types/typedefs
            var task = client.TypesREST.GetAllTypeDefsWithHttpMessagesAsync();
            Console.WriteLine("\nURI:\n" + task.Result.Request.RequestUri);
            Console.WriteLine("\nStatus Code:\n" + task.Result.Response.StatusCode);
            Console.WriteLine("\nResult:\n" + JsonConvert.SerializeObject(task.Result.Body, Formatting.Indented));
        }

        // Replace client_id and client_secret with application ID and password value from service principal
        private static string getToken()
        {
            var values = new Dictionary<string, string>

            // The "resource" could be "https://purview.azure.net" or "73c2949e-da2d-457a-9607-fcc665198967"
            {
                { "grant_type", "client_credentials" },
                { "client_id", servicePrincipalId },
                { "client_secret", servicePrincipalKey },
                { "resource", "73c2949e-da2d-457a-9607-fcc665198967" }
            };

            string authUrl = string.Format("https://login.windows.net/{0}/oauth2/token", tenantId);
            var content = new FormUrlEncodedContent(values);

            HttpClient authClient = new HttpClient();
            var bearerResult = authClient.PostAsync(authUrl, content);
            bearerResult.Wait();
            var resultContent = bearerResult.Result.Content.ReadAsStringAsync();
            resultContent.Wait();
            var bearerToken = JObject.Parse(resultContent.Result)["access_token"].ToString();
            var svcClientCreds = new TokenCredentials(bearerToken, "Bearer");

            return bearerToken;
        }
    }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Manage data sources](manage-data-sources.md)
