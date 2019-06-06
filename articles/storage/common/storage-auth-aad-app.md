---
title: Authenticate with Azure Active Directory to access blob and queue data from your client application
description: Use Azure Active Directory to authenticate from within a client application, acquire an OAuth 2.0 token, and authorize requests to Azure Blob storage and Queue storage.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 06/05/2019
ms.author: tamram
ms.subservice: common
---

# Authenticate with Azure Active Directory from an application for access to blobs and queues

A key advantage of using Azure Active Directory (Azure AD) with Azure Blob storage or Queue storage is that your credentials no longer need to be stored in your code. Instead, you can request an OAuth 2.0 access token from the Microsoft identity platform (formerly Azure AD). Azure AD authenticates the security principal (a user, group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Blob storage or Queue storage.

This article shows how to configure your native application or web application for authentication with Azure AD. The code example features .NET, but other languages use a similar approach.

For an overview of the OAuth 2.0 code grant flow, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).

## Assign an RBAC role to an Azure AD security principal

To authenticate a security principal from your Azure Storage application, first configure role-based access control (RBAC) settings for that security principal. Azure Storage defines built-in RBAC roles that encompass permissions for containers and queues. When the RBAC role is assigned to a security principal, that security principal is granted access to that resource. For more information, see [Manage access rights to Azure Blob and Queue data with RBAC](storage-auth-aad-rbac.md).

## Register your application with an Azure AD tenant

The first step in using Azure AD to authorize access to storage resources is registering your client application with an Azure AD tenant from the [Azure portal](https://portal.azure.com). When you register your client application, you supply information about the application to Azure AD. Azure AD then provides a client ID (also called an *application ID*) that you use to associate your application with Azure AD at runtime. To learn more about the client ID, see [Application and service principal objects in Azure Active Directory](../../active-directory/develop/app-objects-and-service-principals.md).

To register your Azure Storage application, follow the steps shown in [Quickstart: Register an application with the Microsoft identity platform](../../active-directory/develop/quickstart-configure-app-access-web-apis.md). The following image shows common settings for registering a web application:

![Screenshot showing how to register your storage application with Azure AD](./media/storage-auth-aad-app/app-registration.png)

> [!NOTE]
> If you register your application as a native application, you can specify any valid URI for the **Redirect URI**. For native applications, this value does not have to be a real URL. For web applications, the redirect URI must be a valid URI, because it specifies the URL to which tokens are provided.

After you've registered your application, you'll see the application ID (or client ID) under **Settings**:

![Screenshot showing the client ID](./media/storage-auth-aad-app/app-registration-client-id.png)

For more information about registering an application with Azure AD, see [Integrating applications with Azure Active Directory](../../active-directory/develop/quickstart-v2-register-an-app.md).

## Grant your registered app permissions to Azure Storage

Next, grant your application permissions to call Azure Storage APIs. This step enables your application to authorize requests to Azure Storage with Azure AD.

1. On the **Overview** page for your registered application, select **View API Permissions**.
1. In the **API permissions** section, select **Add a permission** and choose **APIs my organization uses**.
1. Under the **APIs my organization uses** section, search for "Azure Storage", and select **Azure Storage** from the list of results to display the **Request API permissions** pane.

    ![Screenshot showing permissions for storage](media/storage-auth-aad-app/registered-app-permissions-1.png)

1. Under **What type of permissions does your application require?**, note that the available permission type is **Delegated permissions**. This option is selected for you by default.
1. In the **Select permissions** section of the **Request API permissions** pane, select the checkbox next to **user_impersonation**, then click  **Add permissions**.
1. The **API permissions** pane now shows that your Azure AD application has access to both Microsoft Graph and the Azure Storage. Permissions are granted to Microsoft Graph automatically when you first register your app with Azure AD.

    ![Screenshot showing register app permissions](media/storage-auth-aad-app/registered-app-permissions-2.png)

## Libraries for token acquisition

Once you have registered your application and granted it permissions to access data in Azure Blob storage or Queue storage, you can add code to your application to authenticate a security principal and acquire an OAuth 2.0 token. To authenticate and acquire the token, you can use either one of the [Microsoft identity platform authentication libraries](../../active-directory/develop/reference-v2-libraries.md) or another open-source library that supports OpenID Connect 1.0. Your application can then use the access token to authorize a request against Azure Blob storage or Queue storage.

For a list of scenarios for which acquiring tokens is supported, see the [Scenarios](https://aka.ms/msal-net-scenarios) section of the [Microsoft Authentication Library (MSAL) for .NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) GitHub repository.

## .NET code example: Create a block blob

The code example shows how to get an access token from Azure AD. The access token is used to authenticate the specified user and then authorize a request to create a block blob. To get this sample working, first follow the steps outlined in the preceding sections.

> [!NOTE]
> As an owner of your Azure Storage account, you are not automatically assigned permissions to access data. You must explicitly assign yourself an RBAC role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or container or queue.
>
> For example, to run the sample code on a storage account where you are an owner and under your own user identity, you must assign the RBAC role for Blob Data Contributor to yourself. Otherwise, the call to create the blob will fail with HTTP status code 403 (Forbidden). For more information, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).

### Well-known values for authentication with Azure AD

To authenticate a security principal with Azure AD, you need to include some well-known values in your code.

#### Azure AD authority

For Microsoft public cloud, the base Azure AD authority is as follows, where *tenant-id* is your Active Directory tenant ID (or directory ID):

`https://login.microsoftonline.com/<tenant-id>/`

The tenant ID identifies the Azure AD tenant to use for authentication. To retrieve the tenant ID, follow the steps outlined in the section titled **Get the tenant ID for your Azure Active Directory**.

#### Storage resource ID

Use the Azure Storage resource ID to acquire a token for authorizing requests to Azure Storage:

`https://storage.azure.com/`

### Get the tenant ID for your Azure Active Directory

To get the tenant ID, follow these steps:

1. In the Azure portal, select your Active Directory.
2. Click **Properties**.
3. Copy the GUID value provided for the **Directory ID**. This value is also called the tenant ID.

![Screenshot showing how to copy the tenant ID](./media/storage-auth-aad-app/aad-tenant-id.png)

## Set up a basic web app to authenticate to Azure AD

When your application accesses Azure storage, it does so on the user's behalf. To try this code example, you need a web application that prompts the user can sign in using an Azure AD identity. You can download this [code example](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2) to test a basic web application that authenticates with your Azure AD account.

### Completed sample

A complete working version of the sample code shown in this article can be downloaded from [GitHub](http://aka.ms/aadstorage). Reviewing and running the complete sample may be helpful for understanding the code examples.

### Add references and using statements  

From Visual Studio, install the Azure Storage client library. From the **Tools** menu, select **Nuget Package Manager**, then **Package Manager Console**. Type the following commands into the console window to install the necessary packages from the Azure Storage client library for .NET:

```console
Install-Package Microsoft.Azure.Storage.Blob
Install-Package Microsoft.Azure.Storage.Common
```

Next, add the following using statements to the HomeController.cs file:

```csharp
using System;
using Microsoft.Identity.Client; //MSAL library for getting the access token
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
```

### Create a block blob

Add the following code snippet to create a block blob:

```csharp
private static async Task<string> CreateBlob(string accessToken)
{
    // Create a blob on behalf of the user
    TokenCredential tokenCredential = new TokenCredential(accessToken);
    StorageCredentials storageCredentials = new StorageCredentials(tokenCredential);

    // Replace the URL below with your storage account URL
    CloudBlockBlob blob =
        new CloudBlockBlob(
            new Uri("https://<storage-account>.blob.core.windows.net/sample-container/Blob1.txt"),
            storageCredentials);
    await blob.UploadTextAsync("Blob created by Azure AD authenticated user.");
    return "Blob successfully created";
}
```

> [!NOTE]
> To authorize blob and queue operations with an OAuth 2.0 token, you must use HTTPS.

In the example above, the .NET client library handles the authorization of the request to create the block blob. Azure Storage client libraries for other languages also handle the authorization of the request for you. However, if you are calling an Azure Storage operation with an OAuth token using the REST API, then you'll need to authorize the request using the OAuth token.

To call Blob and Queue service operations using OAuth access tokens, pass the access token in the **Authorization** header using the **Bearer** scheme, and specify a service version of 2017-11-09 or higher, as shown in the following example:

```https
GET /container/file.txt HTTP/1.1
Host: mystorageaccount.blob.core.windows.net
x-ms-version: 2017-11-09
Authorization: Bearer eyJ0eXAiOnJKV1...Xd6j
```

### Get an OAuth token from Azure AD

Next, add a method that requests a token from Azure AD. The token you request will be on behalf of the user, and we will use the GetTokenOnBehalfOfUser method.

To request the token, you will need the following values from your app's registration,

- Tenant (or Directory) ID
- Client (or Application) ID
- Client redirection URI

Remember that if you have just logged in, and you are requesting a token for the `storage.azure.com` resource, you will need to present the user with a UI where the user can consent to such an action on their behalf. To facilitate that you need to catch the `MsalUiRequiredException` and add the functionality to request user consent, as shown in the following example:

```csharp
public async Task<IActionResult> Blob()
{
    var scopes = new string[] { "https://storage.azure.com/user_impersonation" };
    try
    {
        var accessToken =
            await _tokenAcquisition.GetAccessTokenOnBehalfOfUser(HttpContext, scopes);
        ViewData["Message"] = await CreateBlob(accessToken);
        return View();
    }
    catch (MsalUiRequiredException ex)
    {
        AuthenticationProperties properties = BuildAuthenticationPropertiesForIncrementalConsent(scopes, ex);
        return Challenge(properties);
    }
}
```

Consent is the process of a user granting authorization to an application to access protected resources on their behalf. The Microsoft identity platform 2.0 supports incremental consent, meaning that a security principal can request a minimum set of permissions initially and add permissions over time as needed. When your code requests an access token, specify the scope of permissions that your app needs at any given time by in the `scope` parameter. The following method constructs the authentication properties for requesting incremental consent:

```csharp
private AuthenticationProperties BuildAuthenticationPropertiesForIncrementalConsent(string[] scopes, MsalUiRequiredException ex)
{
    AuthenticationProperties properties = new AuthenticationProperties();

    // Set the scopes, including the scopes that ADAL.NET / MSAL.NET need for the Token cache.
    string[] additionalBuildInScopes = new string[] { "openid", "offline_access", "profile" };
    properties.SetParameter<ICollection<string>>(OpenIdConnectParameterNames.Scope, scopes.Union(additionalBuildInScopes).ToList());

    // Attempt to set the login_hint so that the logged-in user is not presented with an account selection dialog.
    string loginHint = HttpContext.User.GetLoginHint();
    if (!string.IsNullOrWhiteSpace(loginHint))
    {
        properties.SetParameter<string>(OpenIdConnectParameterNames.LoginHint, loginHint);

        string domainHint = HttpContext.User.GetDomainHint();
        properties.SetParameter<string>(OpenIdConnectParameterNames.DomainHint, domainHint);
    }

    // Specify any additional claims that are required (for instance, MFA).
    if (!string.IsNullOrEmpty(ex.Claims))
    {
        properties.Items.Add("claims", ex.Claims);
    }

    return properties;
}
```

## Next steps

- To learn more about the Microsoft identity platform, see [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/).
- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).
- To learn about using managed identities for Azure resources with Azure Storage, see [Authenticate access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](storage-auth-aad-msi.md).
