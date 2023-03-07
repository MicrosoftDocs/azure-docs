---
title: Authorize search app requests using Azure AD
titleSuffix: Azure Cognitive Search
description: Acquire a token from Azure AD to authorize search requests to an app built on Azure Cognitive Search.

author: dereklegenzoff
ms.author: delegenz
ms.service: cognitive-search
ms.topic: how-to
ms.date: 7/20/2022
ms.custom: subject-rbac-steps
---

# Authorize access to a search apps using Azure Active Directory

> [!IMPORTANT]
> Role-based access control for data plane operations, such as creating or querying an index, is currently in public preview and available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). This functionality is only available in public cloud regions and may impact the latency of your operations while the functionality is in preview. For more information on preview limitations, see [RBAC preview limitations](search-security-rbac.md#preview-limitations).

Search applications that are built on Azure Cognitive Search can now use the [Microsoft identity platform](../active-directory/develop/v2-overview.md) for authenticated and authorized access. On Azure, the identity provider is Azure Active Directory (Azure AD). A key [benefit of using Azure AD](../active-directory/develop/active-directory-how-to-integrate.md#benefits-of-integration) is that your credentials and API keys no longer need to be stored in your code. Azure AD authenticates the security principal (a user, group, or service) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Cognitive Search.

This article shows you how to configure your client for Azure AD:

+ For authentication, you'll create a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) as the security principle. You could also use a different type of service principal object, but this article uses managed identities because they eliminate the need to manage credentials.

+ For authorization, you'll assign an Azure role to the managed identity that grants permissions to run queries or manage indexing jobs.

+ Update your client code to call [DefaultAzureCredential()](/dotnet/api/azure.identity.defaultazurecredential)

## Prepare your search service

As a first step, sign up for the preview and enable role-based access control (RBAC) on your [search service](search-create-service-portal.md).

### Sign up for the preview

RBAC for data plane operations is in preview. In this step, add the preview feature to your Azure subscription.

1. Open [Azure portal](https://portal.azure.com/) and find your search service

1. On the left-nav pane, select **Keys**.

1. In the blue banner that mentions the preview, select **Register** to add the feature to your subscription.

   :::image type="content" source="media/search-howto-aad/rbac-signup-portal.png" alt-text="Screenshot of how to sign up for the rbac preview in the portal" border="true" :::

You can also sign up for the preview using Azure Feature Exposure Control (AFEC) and searching for *Role Based Access Control for Search Service (Preview)*. For more information on adding preview features, see [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md?tabs=azure-portal).

> [!NOTE]
> Once you add the preview to your subscription, all search services in the subscription are permanently enrolled in the preview. If you don't want RBAC on a given service, you can disable RBAC for data plane operations as shown in a later step.

### Enable RBAC for data plane operations

Once your subscription is added to the preview, you'll still need to enable RBAC for data plane operations so that you can use Azure AD authentication. By default, Azure Cognitive Search uses key-based authentication for data plane operations but you can change the setting to allow role-based access control. 

1. Navigate to your search service in the [Azure portal](https://portal.azure.com/).

1. On the left navigation pane, select **Keys**.

1. Choose whether to allow both key-based and role-based access control, or only role-based access control.

   :::image type="content" source="media/search-howto-aad/portal-api-access-control.png" alt-text="Screenshot of authentication options for azure cognitive search in the portal" border="true" :::

You can also change these settings programatically as described in the [Azure Cognitive Search RBAC Documentation](./search-security-rbac.md?tabs=config-svc-rest%2croles-powershell%2ctest-rest#step-2-preview-configuration).

## Create a managed identity

In this step, create a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for your client application. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for **Managed Identities**.

1. Select **+ Create**.

1. Give your managed identity a name and select a region. Then, select **Create**.

   :::image type="content" source="media/search-howto-aad/create-managed-identity.png" alt-text="Screenshot of the Create Managed Identity wizard." border="true" :::

## Assign a role to the managed identity

Next, you need to grant your managed identity access to your search service. Azure Cognitive Search has various [built-in roles](search-security-rbac.md#built-in-roles-used-in-search). You can also create a [custom role](search-security-rbac.md#create-a-custom-role).

It's a best practice to grant minimum permissions. If your application only needs to handle queries, you should assign the [Search Index Data Reader (preview)](../role based-access-control/built-in-roles.md#search-index-data-reader) role. Alternatively, if it needs both read and write access on a search index, you should use the [Search Index Data Contributor (preview)](../role-based-access-control/built-in-roles.md#search-index-data-contributor) role.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. Select **Access control (IAM)** in the left navigation pane.

1. Select **+ Add** > **Add role assignment**.

   ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. Select an applicable role:

   + Owner
   + Contributor
   + Reader
   + Search Service Contributor
   + Search Index Data Contributor (preview) 
   + Search Index Data Reader (preview)

   For more information on the available roles, see [Built-in roles used in Search](search-security-rbac.md#built-in-roles-used-in-search).

   > [!NOTE]
   > The Owner, Contributor, Reader, and Search Service Contributor roles don't give you access to the data within a search index, so you can't query a search index or index data using those roles. For data access to a search index, you need either the Search Index Data Contributor or Search Index Data Reader role.

1. On the **Members** tab, select the managed identity that you want to give access to your search service.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

You can assign multiple roles, such as Search Service Contributor and Search Index Data Contributor, if your application needs comprehensive access to the search services, objects, and content.

You can also [assign roles using PowerShell](./search-security-rbac.md?tabs=config-svc-rest%2croles-powershell%2ctest-rest#step-3-assign-roles).

## Set up Azure AD authentication in your client

Once you have a managed identity and a role assignment on the search service, you're ready to add code to your application to authenticate the security principal and acquire an OAuth 2.0 token.

Azure AD authentication is also supported in the preview SDKs for [Java](https://search.maven.org/artifact/com.azure/azure-search-documents/11.5.0-beta.3/jar), [Python](https://pypi.org/project/azure-search-documents/11.3.0b3/), and [JavaScript](https://www.npmjs.com/package/@azure/search-documents/v/11.3.0-beta.3).

> [!NOTE]
> To learn more about the OAuth 2.0 code grant flow used by Azure AD, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md).

### [**.NET SDK**](#tab/aad-dotnet)

The Azure SDKs make it easy to integrate with Azure AD. Version [11.4.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.2) and newer of the .NET SDK support Azure AD authentication.

The following instructions reference an existing C# sample to demonstrate the code changes.

1. As a starting point, clone the [source code](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11) for the [C# quickstart](search-get-started-dotnet.md).

   The sample currently uses key-based authentication and the `AzureKeyCredential` to create the `SearchClient` and `SearchIndexClient` but you can make a small change to switch over to role-based authentication. 

1. Next, import the [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/) library to get access to other authentication techniques.

1. Instead of using `AzureKeyCredential` in the beginning of `Main()` in [Program.cs](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/quickstart/v11/AzureSearchQuickstart-v11/Program.cs), use `DefaultAzureCredential` like in the code snippet below: 

     ```csharp   
   // Create a SearchIndexClient to send create/delete index commands
   SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, new DefaultAzureCredential());
   // Create a SearchClient to load and query documents
   SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, new DefaultAzureCredential());
   ```

> [!NOTE]
> User-assigned managed identities work only in Azure environments. If you run this code locally, `DefaultAzureCredential` will fall back to authenticating with your credentials. Make sure you've also given yourself the required access to the search service if you plan to run the code locally. 

The Azure.Identity documentation has more details about `DefaultAzureCredential` and using [Azure AD authentication with the Azure SDK for .NET](/dotnet/api/overview/azure/identity-readme). `DefaultAzureCredential` is intended to simplify getting started with the SDK by handling common scenarios with reasonable default behaviors. Developers who want more control or whose scenario isn't served by the default settings should use other credential types.

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

+ [Use Azure role-based access control in Azure Cognitive Search](search-security-rbac.md)
+ [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md)
+ [Integrating with Azure Active Directory](../active-directory/develop/active-directory-how-to-integrate.md#benefits-of-integration)
+ [Azure custom roles](../role-based-access-control/custom-roles.md)