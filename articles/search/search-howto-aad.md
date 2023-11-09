---
title: Configure search apps for Microsoft Entra ID
titleSuffix: Azure AI Search
description: Acquire a token from Microsoft Entra ID to authorize search requests to an app built on Azure AI Search.
author: gmndrg
ms.author: gimondra
ms.service: cognitive-search
ms.topic: how-to
ms.date: 05/09/2023
ms.custom: subject-rbac-steps
---

# Authorize access to a search app using Microsoft Entra ID

Search applications that are built on Azure AI Search can now use the [Microsoft identity platform](../active-directory/develop/v2-overview.md) for authenticated and authorized access. On Azure, the identity provider is Microsoft Entra ID. A key [benefit of using Microsoft Entra ID](../active-directory/develop/how-to-integrate.md#benefits-of-integration) is that your credentials and API keys no longer need to be stored in your code. Microsoft Entra authenticates the security principal (a user, group, or service) running the application. If authentication succeeds, Microsoft Entra ID returns the access token to the application, and the application can then use the access token to authorize requests to Azure AI Search.

This article shows you how to configure your client for Microsoft Entra ID:

+ For authentication, you'll create a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) as the security principle. You could also use a different type of service principal object, but this article uses managed identities because they eliminate the need to manage credentials.

+ For authorization, you'll assign an Azure role to the managed identity that grants permissions to run queries or manage indexing jobs.

+ Update your client code to call [`TokenCredential()`](/dotnet/api/azure.core.tokencredential).  For example, you can get started with new SearchClient(endpoint, new `DefaultAzureCredential()`) to authenticate via a Microsoft Entra ID using [Azure.Identity](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/identity/Azure.Identity/README.md).

## Configure role-based access for data plane

**Applies to:** Search Index Data Contributor, Search Index Data Reader, Search Service Contributor

In this step, configure your search service to recognize an **authorization** header on data requests that provide an OAuth2 access token.

### [**Azure portal**](#tab/config-svc-portal)

1. Sign in to the [Azure portal](https://portal.azure.com) and open the search service page.

1. Select **Keys** in the left navigation pane.

   :::image type="content" source="media/search-create-service-portal/set-authentication-options.png" lightbox="media/search-create-service-portal/set-authentication-options.png" alt-text="Screenshot of the keys page with authentication options." border="true":::

1. Choose an **API access control** option. We recommend **Both** if you want flexibility or need to migrate apps. 

   | Option | Description |
   |--------|------------|
   | API Key | (default) Requires an [admin or query API keys](search-security-api-keys.md) on the request header for authorization. No roles are used. |
   | Role-based access control | Requires membership in a role assignment to complete the task, described in the next step. It also requires an authorization header. |
   | Both | Requests are valid using either an API key or role-based access control. |

The change is effective immediately, but wait a few seconds before testing. 

All network calls for search service operations and content will respect the option you select: API keys, bearer token, or either one if you select **Both**.

When you enable role-based access control in the portal, the failure mode will be "http401WithBearerChallenge" if authorization fails.

### [**REST API**](#tab/config-svc-rest)

Use the Management REST API [Create or Update Service](/rest/api/searchmanagement/services/create-or-update) to configure your service.

All calls to the Management REST API are authenticated through Microsoft Entra ID, with Contributor or Owner permissions. For help setting up authenticated requests in Postman, see [Manage Azure AI Search using REST](search-manage-rest.md).

1. Get service settings so that you can review the current configuration.

   ```http
   GET https://management.azure.com/subscriptions/{{subscriptionId}}/providers/Microsoft.Search/searchServices?api-version=2023-11-01
   ```

1. Use PATCH to update service configuration. The following modifications enable both keys and role-based access. If you want a roles-only configuration, see [Disable API keys](search-security-rbac.md#disable-api-key-authentication).

   Under "properties", set ["authOptions"](/rest/api/searchmanagement/services/create-or-update#dataplaneauthoptions) to "aadOrApiKey". The "disableLocalAuth" property must be false to set "authOptions".

   Optionally, set ["aadAuthFailureMode"](/rest/api/searchmanagement/services/create-or-update#aadauthfailuremode) to specify whether 401 is returned instead of 403 when authentication fails. Valid values are "http401WithBearerChallenge" or "http403".

    ```http
    PATCH https://management.azure.com/subscriptions/{{subscriptionId}}/resourcegroups/{{resource-group}}/providers/Microsoft.Search/searchServices/{{search-service-name}}?api-version=2023-11-01
    {
        "properties": {
            "disableLocalAuth": false,
            "authOptions": {
                "aadOrApiKey": {
                    "aadAuthFailureMode": "http401WithBearerChallenge"
                }
            }
        }
    }
    ```

---

## Create a managed identity

In this step, create a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for your client application. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for **Managed Identities**.

1. Select **+ Create**.

1. Give your managed identity a name and select a region. Then, select **Create**.

   :::image type="content" source="media/search-howto-aad/create-managed-identity.png" alt-text="Screenshot of the Create Managed Identity wizard." border="true" :::

## Assign a role to the managed identity

Next, you need to grant your managed identity access to your search service. Azure AI Search has various [built-in roles](search-security-rbac.md#built-in-roles-used-in-search). You can also create a [custom role](search-security-rbac.md#create-a-custom-role).

It's a best practice to grant minimum permissions. If your application only needs to handle queries, you should assign the [Search Index Data Reader](../role-based-access-control/built-in-roles.md#search-index-data-reader) role. Alternatively, if it needs both read and write access on a search index, you should use the [Search Index Data Contributor](../role-based-access-control/built-in-roles.md#search-index-data-contributor) role.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. Select **Access control (IAM)** in the left navigation pane.

1. Select **+ Add** > **Add role assignment**.

   :::image type="content" source="../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png" alt-text="Screenshot of Access control (IAM) page with Add role assignment menu open." border="true":::

1. Select an applicable role:

   + Owner
   + Contributor
   + Reader
   + Search Service Contributor
   + Search Index Data Contributor
   + Search Index Data Reader

   For more information on the available roles, see [Built-in roles used in Search](search-security-rbac.md#built-in-roles-used-in-search).

   > [!NOTE]
   > The Owner, Contributor, Reader, and Search Service Contributor roles don't give you access to the data within a search index, so you can't query a search index or index data using those roles. For data access to a search index, you need either the Search Index Data Contributor or Search Index Data Reader role.

1. On the **Members** tab, select the managed identity that you want to give access to your search service.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

You can assign multiple roles, such as Search Service Contributor and Search Index Data Contributor, if your application needs comprehensive access to the search services, objects, and content.

You can also [assign roles using PowerShell](search-security-rbac.md#assign-roles).

<a name='set-up-azure-ad-authentication-in-your-client'></a>

## Set up Microsoft Entra authentication in your client

Once you have a managed identity and a role assignment on the search service, you're ready to add code to your application to authenticate the security principal and acquire an OAuth 2.0 token.

Use the following client libraries for role-based access control:

+ [azure.search.documents (Azure SDK for .NET) version 11.4](https://www.nuget.org/packages/Azure.Search.Documents/)
+ [azure-search-documents (Azure SDK for Java) version 11.5.6](https://central.sonatype.com/artifact/com.azure/azure-search-documents/11.5.6)
+ [azure/search-documents (Azure SDK for JavaScript) version 11.3.1](https://www.npmjs.com/package/@azure/search-documents/v/11.3.1)
+ [azure.search.documents (Azure SDK for Python) version 11.3](https://pypi.org/project/azure-search-documents/)

> [!NOTE]
> To learn more about the OAuth 2.0 code grant flow used by Microsoft Entra ID, see [Authorize access to Microsoft Entra web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md).

### [**.NET SDK**](#tab/aad-dotnet)

The following instructions reference an existing C# sample to demonstrate the code changes.

1. As a starting point, clone the [source code](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11) for the C# section of [Quickstart: Full text search using the Azure SDKs](search-get-started-text.md).

   The sample currently uses key-based authentication and the `AzureKeyCredential` to create the `SearchClient` and `SearchIndexClient` but you can make a small change to switch over to role-based authentication. 

1. Update the Azure.Search.Documents Nuget package to version 11.4 or later.

1. Import the [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/) library to get access to other authentication techniques.

1. Instead of using `AzureKeyCredential` in the beginning of `Main()` in [Program.cs](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/quickstart/v11/AzureSearchQuickstart-v11/Program.cs), use `DefaultAzureCredential` like in the code snippet below: 

     ```csharp
   // Create a SearchIndexClient to send create/delete index commands
   SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, new DefaultAzureCredential());
   // Create a SearchClient to load and query documents
   SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, new DefaultAzureCredential());
   ```

### Local testing

User-assigned managed identities work only in Azure environments. If you run this code locally, `DefaultAzureCredential` will fall back to authenticating with your credentials. Make sure you've also given yourself the required access to the search service if you plan to run the code locally. 

1. Verify your account has role assignments to run all of the operations in the quickstart sample. To both create and query an index, you'll need "Search Index Data Reader" and "Search Index Data Contributor".

1. Go to **Tools** > **Options** > **Azure Service Authentication** to choose your Azure sign-on account.

You should now be able to run the project from Visual Studio on your local system, using role-based access control for authorization.

> [!NOTE]
> The Azure.Identity documentation has more details about `DefaultAzureCredential` and using [Microsoft Entra authentication with the Azure SDK for .NET](/dotnet/api/overview/azure/identity-readme). `DefaultAzureCredential` is intended to simplify getting started with the SDK by handling common scenarios with reasonable default behaviors. Developers who want more control or whose scenario isn't served by the default settings should use other credential types.

### [**REST API**](#tab/aad-rest)

Using an Azure SDK simplifies the OAuth 2.0 flow but you can also program directly against the protocol in your application. Full details are available in [Microsoft identity platform and the OAuth 2.0 client credentials flow](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md).

1. Start by [getting a token](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#get-a-token) from the Microsoft identity platform:

   ```http
   POST /[tenant id]/oauth2/v2.0/token HTTP/1.1
   Host: login.microsoftonline.com
   Content-Type: application/x-www-form-urlencoded

   client_id=[client id]
   &scope=https%3A%2F%2Fsearch.azure.com%2F.default
   &client_secret=[client secret]
   &grant_type=client_credentials
   ```

   The required scope is "https://search.azure.com/.default". 

1. Now that you have a token, you're ready to issue a request to the search service. 

   ```http
   GET https://[service name].search.windows.net/indexes/[index name]/docs?[query parameters]
   Content-Type: application/json   
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
   ```

---

## See also

+ [Use Azure role-based access control in Azure AI Search](search-security-rbac.md)
+ [Authorize access to Microsoft Entra web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md)
+ [Integrating with Microsoft Entra ID](../active-directory/develop/how-to-integrate.md#benefits-of-integration)
+ [Azure custom roles](../role-based-access-control/custom-roles.md)
