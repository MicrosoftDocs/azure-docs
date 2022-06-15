---
title: Authorize search app requests using Azure AD
titleSuffix: Azure Cognitive Search
description: Acquire a token from Azure AD to authorize search requests to an app built on Azure Cognitive Search.

author: dereklegenzoff
ms.author: delegenz
ms.service: cognitive-search
ms.topic: how-to
ms.date: 11/19/2021
ms.custom: subject-rbac-steps
---

# Authorize access to a search apps using Azure Active Directory

> [!IMPORTANT]
> Role-based access control for data plane operations, such as creating an index or querying an index, is currently in public preview and available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). This functionality is only available in public cloud regions and may impact the latency of your operations while the functionality is in preview. For more information on preview limitations, see [RBAC preview limitations](search-security-rbac.md#preview-limitations).

Search applications that are built on Azure Cognitive Search can now use Azure Active Directory (Azure AD) and Azure role-based access (Azure RBAC) for authenticated and authorized access. A key advantage of using Azure AD is that your credentials and API keys no longer need to be stored in your code. Azure AD authenticates the security principal (a user, group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Cognitive Search. To learn more about the advantages of using Azure AD in your applications, see [Integrating with Azure Active Directory](../active-directory/develop/active-directory-how-to-integrate.md#benefits-of-integration).

This article will show you how to configure your application for authentication with the [Microsoft identity platform](../active-directory/develop/v2-overview.md). To learn more about the OAuth 2.0 code grant flow used by Azure AD, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../active-directory/develop/v2-oauth2-auth-code-flow.md).

## Prepare your search service

As a first step, [create a search service](search-create-service-portal.md) and configure it to use Azure role-based access control (RBAC).

### Sign up for the preview

The parts of Azure Cognitive Search's RBAC capabilities required to use Azure AD for querying the search service are still in preview. To use these capabilities, you'll need to add the preview feature to your Azure subscription.

1. Open [Azure portal](https://portal.azure.com/) and find your search service

1. On the left-nav pane, select **Keys**.

1. In the blue banner that mentions the preview, select **Register** to add the feature to your subscription.

   :::image type="content" source="media/search-howto-aad/rbac-signup-portal.png" alt-text="Screenshot of how to sign up for the rbac preview in the portal" border="true" :::

You can also sign up for the preview using Azure Feature Exposure Control (AFEC) and searching for *Role Based Access Control for Search Service (Preview)*. For more information on adding preview features, see [Set up preview features in Azure subscription](../azure-resource-manager/management/preview-features.md?tabs=azure-portal).

> [!NOTE]
> Once you add the preview to your subscription, all services in the subscription will be permanently enrolled in the preview. If you don't want RBAC on a given service, you can disable RBAC for data plane operations as shown in a later step.

### Enable RBAC for data plane operations

Once your subscription is added to the preview, you'll still need to enable RBAC for data plane operations so that you can use Azure AD authentication. By default, Azure Cognitive Search uses key-based authentication for data plane operations but you can change the setting to allow role-based access control. 

1. Navigate to your search service in the [Azure portal](https://portal.azure.com/).

1. On the left navigation pane, select **Keys**.

1. Determine if you'd like to allow both key-based and role-based access control, or only role-based access control.

   :::image type="content" source="media/search-howto-aad/portal-api-access-control.png" alt-text="Screenshot of authentication options for azure cognitive search in the portal" border="true" :::

You can also change these settings programatically as described in the [Azure Cognitive Search RBAC Documentation](./search-security-rbac.md?tabs=config-svc-rest%2croles-powershell%2ctest-rest#step-2-preview-configuration).

## Register an application with Azure AD

The next step to using Azure AD for authentication is to register an application with the [Microsoft identity platform](../active-directory/develop/quickstart-register-app.md). If you have problems registering the application, make sure you have the [required permissions](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app).

1. Sign into your Azure Account in the [Azure portal](https://portal.azure.com).

1. Search for **Azure Active Directory**.

1. Select **App Registrations**.

1. Select **+ New Registration**.

1. Give your application a name and select a supported account type, which determines who can use the application. Then, select **Register**.

   :::image type="content" source="media/search-howto-aad/register-app.png" alt-text="Screenshot of the register an application wizard" border="true" :::

At this point, you've created your Azure AD application and service principal. Make a note of tenant (or directory) ID and the client (or application) ID on the overview page of your app registration. You'll need those values in a future step.

## Create a client secret

The application will also need a client secret or certificate to prove its identity when requesting a token. 

1. Navigate to the app registration you created.

1. Select **Certificates and secrets**.

1. Under **Client secrets**, select **New client secret**.

1. Provide a description of the secret and select the desired expiration interval.

   :::image type="content" source="media/search-howto-aad/create-secret.png" alt-text="Screenshot of create a client secret wizard" border="true" :::

Make sure to save the value of the secret in a secure location as you won't be able to access the value again. 

## Assign a role to the application

Next, you need to grant your Azure AD application access to your search service. Azure Cognitive Search has various [built-in roles](search-security-rbac.md#built-in-roles-used-in-search). You can also create a [custom role](search-security-rbac.md#create-a-custom-role).

In general, it's best to give your application only the access required. For example, if your application only needs to be able to query the search index, you could grant it the [Search Index Data Reader (preview)](../role-based-access-control/built-in-roles.md#search-index-data-reader) role. Alternatively, if it needs to be able to read and write to a search index, you could use the [Search Index Data Contributor (preview)](../role-based-access-control/built-in-roles.md#search-index-data-contributor) role.

1. Open the [Azure portal](https://portal.azure.com).

1. Navigate to your search service.

1. Select **Access Control (IAM)** in the left navigation pane.

1. Select **+ Add** > **Add role assignment**.

   ![Access control (IAM) page with Add role assignment menu open.](../../includes/role-based-access-control/media/add-role-assignment-menu-generic.png)

1. Select an applicable role:

   + Owner
   + Contributor
   + Reader
   + Search Service Contributor
   + Search Index Data Contributor (preview)
   + Search Index Data Reader (preview)

1. On the **Members** tab, select the Azure AD user or group identity under which your application runs.

1. On the **Review + assign** tab, select **Review + assign** to assign the role.

You can also [assign roles using PowerShell](./search-security-rbac.md?tabs=config-svc-rest%2croles-powershell%2ctest-rest#step-3-assign-roles).

## Set up Azure AD authentication in your client

Once you have an Azure AD application created and you've granted it permissions to access your search service, you're ready you can add code to your application to authenticate a security principal and acquire an OAuth 2.0 token.

Azure AD authentication is also supported in the preview SDKs for [Java](https://search.maven.org/artifact/com.azure/azure-search-documents/11.5.0-beta.3/jar), [Python](https://pypi.org/project/azure-search-documents/11.3.0b3/), and [JavaScript](https://www.npmjs.com/package/@azure/search-documents/v/11.3.0-beta.3).

### [**.NET SDK**](#tab/aad-dotnet)

The Azure SDKs make it easy to integrate with Azure AD. Version [11.4.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.2) and newer of the .NET SDK support Azure AD authentication.

The following instructions reference an existing C# sample to demonstrate the code changes.

1. As a starting point, clone the [source code](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11) for the [C# quickstart](search-get-started-dotnet.md).

   The sample currently uses key-based authentication to create the `SearchClient` and `SearchIndexClient` but you can make a small change to switch over to role-based authentication. Instead of using `AzureKeyCredential` in the beginning of `Main()` in [Program.cs](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/quickstart/v11/AzureSearchQuickstart-v11/Program.cs), use this: 

   ```csharp
   AzureKeyCredential credential = new AzureKeyCredential(apiKey);
     
   // Create a SearchIndexClient to send create/delete index commands
   SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, credential);
   // Create a SearchClient to load and query documents
   SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, credential);
   ```

1. Use `ClientSecretCredential` to authenticate with the search service. First, import the [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/) library to use `ClientSecretCredential`.

1. You'll need to provide the following strings:

   + The tenant (or directory) ID. This can be retrieved from the overview page of your app registration.
   + The client (or application) ID. This can be retrieved from the overview page of your app registration.
   + The value of the client secret that you copied in a preview step.

   ```csharp
   var tokenCredential =  new ClientSecretCredential(aadTenantId, aadClientId, aadSecret);
   SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, tokenCredential);
   ```

The Azure.Identity documentation also has additional details on using [Azure AD authentication with the Azure SDK for .NET](/dotnet/api/overview/azure/identity-readme).

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