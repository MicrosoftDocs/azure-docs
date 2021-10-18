---
title: Authorize search requests using Azure AD
titleSuffix: Azure Cognitive Search
description: Acquire a token from Azure AD to authorize search requests

author: dereklegenzoff
ms.author: delegenz
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 10/04/2021
---

# Authorize search requests using Azure AD (preview)

> [!IMPORTANT]
> Role-based access control for data plane operations such as creating an index or querying an index is currently in public preview and available under [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). This functionality is only available in public clouds and may impact the latency of your operations while the functionality is in preview. 

With Azure Active Directory (Azure AD), you can use role-based access control (RBAC) to grant access to your Azure Cognitive Search services. A key advantage of using Azure AD is that your credentials no longer need to be stored in your code. Azure AD authenticates the security principal (a user, group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Cognitive Search. To learn more about the advantages of using Azure AD in your applications, see [Integrating with Azure Active Directory](/azure/active-directory/develop/active-directory-how-to-integrate#benefits-of-integration).

This article will show you how to configure your application for authentication with the Microsoft identity platform. To find out more about the Microsoft identify platform, see the [Microsoft identity platform overview](/azure/active-directory/develop/v2-overview). To learn more about the OAuth 2.0 code grant flow used by Azure AD, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](/azure/active-directory/develop/v2-oauth2-auth-code-flow).

## Prepare your search service

As a first step, [create a search service](search-create-service-portal.md) and configure it to use role-based access control (RBAC).

### Sign up for the preview

The parts of Azure Cognitive Search's RBAC capabilities required to use Azure AD for querying the search service are still in a gated preview. 

For enrollment into the preview, [fill out this form](https://aka.ms/azure-cognitive-search/rbac-preview).

It may take a few business days to process your request. 

### Enable RBAC for data plane operations

Once your subscription is onboarded to the preview, you'll still need to enable RBAC for data plane operations so that you can use Azure AD authentication. By default, Azure Cognitive Search uses key-based authentication for data plane operations but you can change the setting to allow role-based access control. 

To enable role-based access control:

1. Navigate to the Azure portal with this preview link: [https://ms.portal.azure.com/?feature.enableRbac=true](https://ms.portal.azure.com/?feature.enableRbac=true). 
1. On the left navigation pane, select **Keys**
1. Determine if you'd like to allow both key-based and role-based access control, or only role-based access control.

![authentication options for azure cognitive search in the portal](media/search-howto-Azure AD/portal-api-access-control.png)

You can also change these settings programatically as described in the [Azure Cognitive Search RBAC Documentation](/azure/search/search-security-rbac?tabs=config-svc-rest%2Croles-powershell%2Ctest-rest#step-2-preview-configuration).

## Register an application with Azure AD

The next step to using Azure AD for authentication is to register an application with the [Microsoft identity platform](/azure/active-directory/develop/quickstart-register-app). If you have problems creating the application, check to make sure you have the [permissions required for registering an application](/azure/active-directory/develop/howto-create-service-principal-portal#permissions-required-for-registering-an-app).

To register an application with Azure AD:

1. Sign into your Azure Account in the [Azure portal](https://portal.azure.com).
1. Select **Azure Active Directory**.
1. Select **App Registrations**.
1. Select **New Registration**.
1. Give your application a name and select a supported account type, which determines who can use the application. Then, select **Register**.

![Register an application wizard](media/search-howto-aad/register-app.png)

At this point, you've created your Azure AD application and service principal. Make a note of tenant (or directory) ID and the client (or application) ID on the overview page of your app registration. You'll need those values in a future step.

## Create a client secret

The application will also need a client secret or certificate to prove its identity when requesting a token. In this document, we'll show how to use a client secret.

1. Navigate to the app registration you just created
1. Select **Certificates and secrets**.
1. Under **Client secrets**, click **New client secret**.
1. Provide a description of the secret and select the desired expiration interval.

![create a client secret wizard](media/search-howto-aad/create-secret.png)

Make sure to save the value of the secret in a secure location as you won't be able to access the value again. 

## Grant your application permissions to Azure Cognitive Search

Next, you need to grant your Azure AD application access to your search service. Azure Cognitive Search has various [built-in roles](/azure/search/search-security-rbac?tabs=config-svc-portal%2Croles-portal%2Ctest-portal#built-in-roles-used-in-search) that can be used depending on the access required by your application.

In general, it's best to give your application only the access required. For example, if your application only needs to be able to query the search index, you could grant it the [Search Index Data Reader (preview)](/azure/role-based-access-control/built-in-roles#search-index-data-reader) role. Alternatively, if it needs to be able to read and write to a search index, you could use the [Search Index Data Contributor (preview)](/azure/role-based-access-control/built-in-roles#search-index-data-contributor) role.

To assign a role to your app registration:

1. Open the Azure portal and navigate to your search service.
1. Select **Access Control (IAM)** in the left navigation pane.
1. On the right side under **Grant access to this resource**, select **Add role assignment**.
1. Select the role you'd like to use and then click **Next**.
1. On the next page, click **Select members** and find the application you created previously. 
1. Finally, click **Review + assign**

![Add role assignment in the azure portal](media/search-howto-aad/role-assignment.png)

You can also [assign roles using PowerShell](/azure/search/search-security-rbac?tabs=config-svc-rest%2Croles-powershell%2Ctest-rest#step-3-assign-roles).

### Create a custom role

In addition to using [built-in roles](/azure/search/search-security-rbac?tabs=config-svc-portal%2Croles-portal%2Ctest-portal#built-in-roles-used-in-search), you can also create a [custom role](/azure/role-based-access-control/custom-roles) to define exactly what you'd like your application to be able to do.

For example, if you want a role that has the ability to fully manage indexes including the ability to create indexes and read data from them you could define the role shown below:

```json
{
  "Name": "Search Index Manager",
  "Id": "88888888-8888-8888-8888-888888888888",
  "IsCustom": true,
  "Description": "Can manage search indexes and read or write to them",
  "Actions": [
    "Microsoft.Search/searchServices/indexes/*",
    
  ],
  "NotActions": [],
  "DataActions": [
      "Microsoft.Search/searchServices/indexes/documents/*"
  ],
  "NotDataActions": [],
  "AssignableScopes": [
    "/subscriptions/{subscriptionId1}"
  ]
}
```

You can create custom roles using [Azure portal](/azure/role-based-access-control/custom-roles-portal), [Azure PowerShell](/azure/role-based-access-control/custom-roles-powershell), [Azure CLI](/azure/role-based-access-control/custom-roles-cli), or the [REST API](/azure/role-based-access-control/custom-roles-rest). The JSON above shows the syntax for creating a custom role with PowerShell.

For the full list of operations available, see [Microsoft.Search resource provider operations](/azure/role-based-access-control/resource-provider-operations#microsoftsearch).


### Grant access to only a single index

In some scenarios, you may want to scope down an application's access to a single resource, such as an index. 

The portal doesn't currently support granting access to just a single index, but it can be done with [PowerShell](../role-based-access-control/role-assignments-powershell.md) or the [Azure CLI](../role-based-access-control/role-assignments-cli.md).

In PowerShell, you would use [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment), providing the Azure user or group name, and the scope of the assignment.

Before you start, make sure you load the Azure and AzureAD modules and connect to your Azure account:

```powershell
Import-Module -Name Az
Import-Module -Name AzureAD
Connect-AzAccount
```

To add a role assignment scoped to an individual index, you would then run the following command:

```powershell
New-AzRoleAssignment -ObjectId <objectId> `
    -RoleDefinitionName "Search Index Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>/indexes/<index-name>"
```

## Set up Azure AD authentication in your client

Once you have an Azure AD application created and you've granted it permissions to access your search service, you're ready you can add code to your application to authenticate a security principal and acquire an OAuth 2.0 token.

### Azure AD authentication with the .NET SDK

The Azure SDKs make it easy to integrate with Azure AD. Version [11.4.0-beta.2](https://www.nuget.org/packages/Azure.Search.Documents/11.4.0-beta.2) and newer of the .NET SDK support Azure AD authentication. Azure AD authentication is also supported in the preview SDKs for [Java](https://search.maven.org/artifact/com.azure/azure-search-documents/11.5.0-beta.3/jar), [Python](https://pypi.org/project/azure-search-documents/11.3.0b3/), and [JavaScript](https://www.npmjs.com/package/@azure/search-documents/v/11.3.0-beta.3).

As a starting point, clone the [source code](https://github.com/Azure-Samples/azure-search-dotnet-samples/tree/master/quickstart/v11) for the [C# quickstart](search-get-started-dotnet.md).  The quickstart currently uses key-based authentication to create the `SearchClient` and `SearchIndexClient` but you can make a small change to switch over to role-based authentication. Instead of using `AzureKeyCredential` in the beginning of `Main()` in [Program.cs](https://github.com/Azure-Samples/azure-search-dotnet-samples/blob/master/quickstart/v11/AzureSearchQuickstart-v11/Program.cs): 

```dotnet
AzureKeyCredential credential = new AzureKeyCredential(apiKey);

// Create a SearchIndexClient to send create/delete index commands
SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, credential);
// Create a SearchClient to load and query documents
SearchClient srchclient = new SearchClient(serviceEndpoint, indexName, credential);
```

You can use `ClientSecretCredential` to authenticate with the search service.

With this, you'll need:
+ The tenant (or directory) ID. This can be retrieved from the overview page of your app registration.
+ The client (or application) ID. This can be retrieved from the overview page of your app registration.
+ The value of the client secret that you copied in a preview step.

```dotnet
var tokenCredential =  new ClientSecretCredential(aadTenantId, aadClientId, aadSecret);
SearchIndexClient adminClient = new SearchIndexClient(serviceEndpoint, tokenCredential);
```

You'll need to import the [Azure.Identity](https://www.nuget.org/packages/Azure.Identity/) library to use `ClientSecretCredential`.

The Azure.Identity documentation also has additional details on using [Azure AD authentication with the Azure SDK for .NET](/dotnet/api/overview/azure/identity-readme).

### Azure AD authentication with the REST API

Using an Azure SDK simplifies the OAuth 2.0 flow but you can also program directly against the protocol in your application. Full details are available in [Microsoft identity platform and the OAuth 2.0 client credentials flow](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow).

#### Get a token

Start by [getting a token](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#get-a-token) from the Microsoft identity platform:

```
POST /[tenant id]/oauth2/v2.0/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=[client id]
&scope=https%3A%2F%2Fsearch.azure.com%2F.default
&client_secret=[client secret]
&grant_type=client_credentials
```

The required scope is "https://search.azure.com/.default". 

#### Use a token

Now that you have a token, you're ready to issue a request to the search service. 

```http
GET https://[service name].search.windows.net/indexes/[index name]/docs?[query parameters]
Content-Type: application/json   
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik5HVEZ2ZEstZnl0aEV1Q...
```

## See also

+ [Use role-based authorization in Azure Cognitive Search](search-security-rbac.md)
+ [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](/azure/active-directory/develop/v2-oauth2-auth-code-flow)
+ [Integrating with Azure Active Directory](/azure/active-directory/develop/active-directory-how-to-integrate#benefits-of-integration)
+ [Azure custom roles](/azure/role-based-access-control/custom-roles)

