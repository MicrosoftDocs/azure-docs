---
title: "Tutorial: Use the REST APIs"
description: This tutorial describes how to use the Azure Babylon REST APIs to access the contents of your catalog.
author: yaronyg
ms.author: yarong
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: tutorial
ms.date: 10/16/2020

# Customer intent: I can call the catalog's REST APIs to search and manipulate the contents of the catalog.
---

# Tutorial: Use the REST APIs

In this tutorial, you learn how to use the Azure Babylon REST APIs. Anyone who wants to submit data to an Azure Babylon catalog, include the catalog as part of an automated process, or build their own user experience on the catalog can use the REST APIs to do so.

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

* To get started, you must have an existing Azure Babylon catalog. If you don't have a catalog, see the [quickstart for creating a Azure Babylon account](create-catalog-portal.md).

* If you need to add data to your catalog, see the [tutorial to run the starter kit and scan data](starter-kit-tutorial-1.md).

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

   On the **Client secrets** page, the string in the **Value** column of your new secret is your password. Save this vaulue.

   :::image type="content" source="./media/tutorial-using-rest-apis/client-secret.png" alt-text="Screenshot showing a client secret.":::

## Configure your catalog to trust the service principal (application)

To configure Azure Babylon to trust your new service principal:

1. Go to the [Azure Babylon accounts page](https://aka.ms/babylonportal) in the Azure portal.
1. Find and select your Azure Babylon account in the list.
1. From your Azure Babylon account page, select **Launch Babylon account**.
1. On your Azure Babylon catalog page, select **Management Center** from the left pane.
1. Select **Assign roles** from the left pane.
1. Select **Add user**, and then select **Catalog administrator**.
1. Enter the name of your new service principal in the search box. This name is the same as the application name you used in the previous section.
1. Select the service principal/application name that appears in the list (along with its application ID), and then select **Apply**.

   You've now configured the service principal as an application administrator, which enables it to send content to the catalog.

## View the REST APIs documentation

To view the API Swagger documentation, download APIDocumentation.zip, extract its files, and open index.html.

If you want to learn more about the advanced search/suggest API that Azure Babylon provides, see the Rest API Search Filter documentation. The AutoRest generated client doesn't currently support customized search parameters. Ss a workaround, follow the search-filter document to define filter classes in code as API call parameters. The index.html document has examples of these APIs.

## Collect the necessary values to use the REST APIs

Find and save the following values:

* Tenant ID:
  * In the [Azure portal](https://portal.azure.com), search for and select **Azure Active Directory**.
  * In the **Manage** section in the left pane, select **Properties**, find the **Tenant ID**, and then select the **Copy to clipboard** icon to save its value.
* Atlas endpoint:
  * From the [Azure Babylon accounts page](https://aka.ms/babylonportal) in the Azure portal, find and select your Azure Babylon account in the list.
  * Select **Overview**, find **Atlas Endpoint**, and then select the **Copy to clipboard** icon to save its value. Remove the *https://* portion of the string when you use it later.
* Account name:
  * Extract the name of your catalog from the Atlas endpoint string. For example, if your Atlas endpoint is `https://ThisIsMyCatalog.catalog.babylon.azure.com`, your account name is `ThisIsMyCatalog`.

## Use the Postman client to call the REST APIs

1. Install the [Postman client](https://www.getpostman.com/).
1. From the client, select **Import**, and use Test.postman\_collection.json.
1. Select **Collections**, and then select **Test**.
1. Select **Get Token**:
    1. In the URL next to POST, replace *&lt;your-tenant-id&gt;* with the tenant ID you copied in the previous section.
    1. Select the **Body** tab, and replace the placeholders in the path and body from the previous step.

       After you select **Send**, the response body contains a JSON structure including the name *access_token* and a quoted string value. 
    1. Copy the bearer token value (without quotes), to use in the next step.

1. Select **/v2/types/typedefs**:
    1. Replace the placeholder in the path with your Atlas endpoint value you previously saved.

       The response body contains a JSON structure including the name *access_token* and a quoted string value.

    1. Copy the bearer token value (without quotes) to use in the next step.

    1. Select **Send** to get the response.

## Generate a .NET client to call the REST APIs

### Install AutoRest



1. [Install Node.js](https://github.com/Azure/autorest/blob/master/docs/installing-autorest.md).
1. Open PowerShell and run the following command:

   ```powershell
   npm install -g autorest@3.0.6187
   ```

### Download rest-api-specs.zip and create the client

1. Download rest-api-specs.zip and extract its files.
1. Run the following command in PowerShell from the rest-api-specs extracted folder:

   ```powershell
   autorest --input-file=.\data-plane\preview\datacataloggen2.json --csharp --output-folder=Csharp_DataCatalogGen2 --namespace=DataCatalogGen2 --add-credentials
   ```

   The output of this process creates a Csharp\_DataCatalogGen2 folder in the rest-api-specs folder.

### Create a sample .NET console application

1. Open Visual Studio 2019. These instructions have been tested with the free community edition.
1. From the **Create a new project** page, create a **Console App (.NET Core)** project in C#.
1. Copy-and-paste the provided [sample code](#sample-code-for-the-console-application).
1. Replace *accountName*, *servicePrincipalId*, *servicePrincipalKey*, and *tenantId* with the values you previously collected.
1. Use **Solution Explorer** to add a folder named **Generated** in the Visual Studio project.
1. Copy the rest-api-specs\Csharp\_DataCatalogGen2 folder that you previously created to the \Generated folder. Use File Explorer or the command-line prompt for the copy operation, which will trigger Visual Studio to automatically add the files to the project.
1. In **Solution Explorer**, right-click the project, and then select **Manage NuGet Packages**.
1. Select the **Browse** tab. Find and select **Microsoft.Rest.ClientRuntime**.
1. Make sure the version is at least 2.3.21, and then select **Install**.
1. Build and run the application.

The sample code returns a count of how many typedefs are in the catalog and shows how to handle role assignments. For details, see `DoRoleAssignmentOperations()` in the sample code. For more information about the project, see [Project Setup](https://github.com/Azure/autorest/blob/master/docs/client/proj-setup.md).

### Sample code for the console application

```csharp
using DataCatalogGen2;
using DataCatalogGen2.Models;
using Microsoft.Rest;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace BabylonSdkTest
{
    class Program
    {
        private static string accountName = "{account-name}";
        private static string servicePrincipalId = "{service-principal-id}";
        private static string servicePrincipalKey = "{service-principal-key}";
        private static string tenantId = "{tenant-id}";

        static void Main(string[] args)
        {
            Console.WriteLine("Azure Babylon client");

            // Example for operating role assignments - replace the User ID in the code
            //DoRoleAssignmentOperations();

            // Example for operating Atlas assets
            DoAtlasOperations();
        }

        private static void DoRoleAssignmentOperations()
        {
            string baseUri = string.Format("https://{0}.catalog.babylon.azure.com/api", accountName);

            // Get token and set auth
            var svcClientCreds = new TokenCredentials(getToken(), "Bearer");
            var client = new DataCatalogGen2.DataCatalogClient(svcClientCreds);
            client.BaseUri = new System.Uri(baseUri);

            // Add role assignment
            var roleAssignmentList = new JsonUpdateRoleAssignmentRequest(new List<JsonRoleAssignmentEntry>()
            {
                new JsonRoleAssignmentEntry("{User-A-ID}", "Catalog Admin"),
                new JsonRoleAssignmentEntry("{User-B-ID}", "Catalog Admin"),
            });
            client.RoleAssignmentREST.AddRoleAssignmentList(roleAssignmentList);
        }

        private static void DoAtlasOperations()
        {
            string baseUri = string.Format("https://{0}.catalog.babylon.azure.com/api/atlas", accountName);

            // Get token and set auth
            var svcClientCreds = new TokenCredentials(getToken(), "Bearer");
            var client = new DataCatalogGen2.DataCatalogClient(svcClientCreds);
            client.BaseUri = new System.Uri(baseUri);

            // /v2/types/typedefs
            var result = client.TypesREST.GetAllTypeDefs();
            // Print Entity Def Count. Can try others in the result.
            Console.WriteLine("\nEntity Def Count:\n" + result.EntityDefs.Count);
            // Print all the type definitions. May be too long and trimmed in console.
            // Console.WriteLine("\nType Def:\n" + JObject.FromObject(result));
        }

        // Replace client_id and client_secret with application ID and password value from service principal
        private static string getToken()
        {
            var values = new Dictionary<string, string>

            // The "resource" could be "https://projectbabylon.azure.net" or "73c2949e-da2d-457a-9607-fcc665198967"
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

            return bearerToken;
        }

    }
}
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
>
> * Create a service principal (application).
> * Configure your catalog to trust the service principal (application).
> * View the REST APIs documentation.
> * Collect the necessary values to use the REST APIs.
> * Use the Postman client to call the REST APIs.
> * Generate a .NET client to call the REST APIs.
