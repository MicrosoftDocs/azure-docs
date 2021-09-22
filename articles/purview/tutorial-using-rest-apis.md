---
title: "How to use REST APIs for Purview Data Planes"
description: This tutorial describes how to use the Azure Purview REST APIs to access the contents of your Purview.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: tutorial
ms.date: 09/17/2021

# Customer intent: I can call the Data plane REST APIs to perform CRUD operations on Purview account.
---

# Tutorial: Use the REST APIs

In this tutorial, you learn how to use the Azure Purview REST APIs. Anyone who wants to submit data to an Azure Purview, include Purview as part of an automated process, or build their own user experience on the Purview can use the REST APIs to do so.

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

## Set up authentication using service principal

Once service principal is created, you need to assign Data plane roles of your purview account to the service principal created above. The below steps need to be followed to assign role to establish trust between the service principal and purview account.

1. Navigate to your Purview Studio.
1. Select the Data Map in the left menu.
1. Select Collections.
1. Select the root collection in the collections menu. This will be the top collection in the list, and will have the same name as your Purview account.
1. Select the Role assignments tab.
1. Assign the following roles to service principal created above to access various data planes in Purview.
    1. 'Data Curator' role to access Catalog Data plane.
    1. 'Data Source Administrator' role to access Scanning Data plane. 
    1. 'Collection Admin' role to access Account Data Plane.

1. Select the **Role assignments** tab.

1. Scroll down to **Data curators** and select the **+** user button.

    > [!Note]
    > Only Collection Admins can edit permissions on a collection. If you are not a collection admin, contact one of the admins listed in the root collection. For more information, see the [Purview permissions page](catalog-permissions.md).

1. Search the name of the previosly created service principal you wish to assign and then select their name in the results pane.

1. Select **Save**

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
    1. Replace the placeholder in the path with your atlas endpoint value. This value can be obtained by navigating to the catalog instance on Ibiza portal and selecting overview. 
## Get token
You can send a POST request to the following URL to get access token.

https://login.microsoftonline.com/{your-tenant-id}/oauth2/token

The following parameters needs to be passed to the above URL.

- **client_id**:  client ID of the application registered in Azure Active directory and is assigned to a data plane role for the Purview account.
- **client_secret**: client secret created for the above application.
- **grant_type**: This should be ‘client_credentials’.
- **resource**: This should be ‘https://purview.azure.net’
 
Sample response token:

```json
    {
        "token_type": "Bearer",
        "expires_in": "86399",
        "ext_expires_in": "86399",
        "expires_on": "1621038348",
        "not_before": "1620951648",
        "resource": "https://purview.azure.net",
        "access_token": "<<access token>>"
    }
```

Use the access token above to call the Data plane APIs.

## Data Plane API documentation
Please refer here to see all the Data Plane APIs supported by Purview [Data Plane APIs](https://docs.microsoft.com/rest/api/purview/)

1. Open Visual Studio 2019. These instructions have been tested with the free community edition.
1. From the **Create a new project** page, create a **Console App (.NET Core)** project in C#.
1. Copy-and-paste the provided [sample code](#sample-code-for-the-console-application).
1. Replace *accountName*, *servicePrincipalId*, *servicePrincipalKey*, and *tenantId* with the values you previously collected.
1. Use **Solution Explorer** to add a folder named **Generated** in the Visual Studio project.
1. Copy the rest-api-specs\PurviewCatalogClient\CSharp folder that you previously created to the \Generated folder. Use File Explorer or the command-line prompt for the copy operation, which will trigger Visual Studio to automatically add the files to the project.
1. In **Solution Explorer**, select and hold on (or right-click) the project, and then select **Manage NuGet Packages**.
1. Select the **Browse** tab. Find and select **Microsoft.Rest.ClientRuntime**.
1. Make sure the version is at least 2.3.21, and then select **Install**.
1. Build and run the application.

## Next steps

> [!div class="nextstepaction"]
> [Manage data sources](manage-data-sources.md)




