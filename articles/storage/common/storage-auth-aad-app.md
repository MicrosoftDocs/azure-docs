---
title: Authenticate with Azure Active Directory to access blob and queue data from your applications | Microsoft Docs
description: Use Azure Active Directory to authenticate from within an application and then authorize requests to blobs and queues.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/01/2019
ms.author: tamram
ms.subservice: common
---

# Authenticate with Azure Active Directory from an application for access to blobs and queues

A key advantage of using Azure Active Directory (Azure AD) with Azure Storage is that your credentials no longer need to be stored in your code. Instead, you can request an OAuth 2.0 access token from the Microsoft Identity platform (formerly Azure AD). Azure AD handles the authentication of the security principal (a user, group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Storage.

This article shows how to configure your application for authentication with Azure AD. The code example features .NET, but other languages use a similar approach.

Before you authenticate a security principal from your Azure Storage application, configure role-based access control (RBAC) settings for that security principal. Azure Storage defines RBAC roles that encompass permissions for containers and queues. When the RBAC role is assigned to a security principal, that security principal is granted access to that resource. For more information, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).

For an overview of the OAuth 2.0 code grant flow, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).

To authorize blob and queue operations with an OAuth token, you must use HTTPS.

## Assign an RBAC role to an Azure AD security principal

To authenticate a security principal from your Azure Storage application, first configure role-based access control (RBAC) settings for that security principal. Azure Storage defines RBAC roles that encompass permissions for containers and queues. When the RBAC role is assigned to a security principal, that security principal is granted access to that resource. For more information, see [Manage access rights to Azure Blob and Queue data with RBAC](storage-auth-aad-rbac.md).

## Register your application with an Azure AD tenant

The first step in using Azure AD to authorize access to storage resources is registering your client application in an Azure AD tenant. Once your application is registered, you can use [Azure Active Directory v2.0 authentication libraries](../../active-directory/reference-v2-libraries.md) to authenticate and obtain access tokens. Using the obtained access tokens, your application can then call various endpoints protected by Azure AD in a secure & authenticated manner. These endpoints include Microsoft Graph, Azure Storage, or other custom or third party endpoints. This includes Microsoft Authentication Library (MSAL) or other open-source libraries that support OpenID Connect 1.0. MSAL provides APIs to acquire security tokens for your application to use to authorize requests against Azure Storage. For the list of scenarios for which acquiring tokens is supported, see [Scenarios](https://aka.ms/msal-net-scenarios).

When you register your application, you supply information about your application to Azure AD. Azure AD then provides a client ID (also called an *application ID*) that you use to associate your application with Azure AD at runtime. To learn more about the client ID, see [Application and service principal objects in Azure Active Directory](../../active-directory/develop/app-objects-and-service-principals.md).

To register your Azure Storage application, follow the steps in the [Adding an Application](../../active-directory/develop/quickstart-register-an-app.md) section in [Integrating applications with Azure Active Directory](../../active-directory/develop/quickstart-configure-app-access-web-apis.md). If you register your application as a native application, you can specify any valid URI for the **Redirect URI**. For native applications, this value does not have to be a real URL. For Web applications, this is the URL to which tokens are provided to, so it does need to be a valid URL.

![Screenshot showing how to register your storage application with Azure AD](./media/storage-auth-aad-app/app-registration.png)

After you've registered your application, you'll see the application ID (or client ID) under **Settings**:

![Screenshot showing the client ID](./media/storage-auth-aad-app/app-registration-client-id.png)

For more information about registering an application with Azure AD, see [Integrating applications with Azure Active Directory](../../active-directory/develop/quickstart-v2-register-an-app.md). 

## Grant your registered app permissions to Azure Storage

Next, you need to grant your application permissions to call Azure Storage APIs. This step enables your application to authorize calls to Azure Storage with Azure AD.

1. In the left-hand navigation pane of the Azure portal, choose **All services**, and search for **App Registrations (preview)**.
2. Search for the name of the registered application you created in the previous step.
3. Select your registered app and click **API permissions**. In the **API permissions** section, select **Add a permission** and choose **APIs my organization uses**.
5. Under the **APIs my organization uses** section, search for "Azure Storage", and select **Azure Storage** from the list of results.

    ![Screenshot showing permissions for storage](media/storage-auth-aad-app/registered-app-permissions-1.png)

6. Choose to **Select permissions** select **user_impersonation** then click  **Add permissions**

![Screenshot showing register app permissions](media/storage-auth-aad-app/registered-app-permissions-2.png)

The **API permissions** window now shows that your Azure AD application has access to both Microsoft Graph and the Azure Storage. Permissions are granted to Microsoft Graph automatically when you first register your app with Azure AD.

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

The tenant ID identifies the Azure AD tenant to use for authentication. To retrieve the tenant ID, follow the steps outlined in **Get the tenant ID for your Azure Active Directory**.

#### Storage resource ID

Use the Azure Storage resource ID to acquire a token for authenticating requests to Azure Storage:

`https://storage.azure.com/`

### Get the tenant ID for your Azure Active Directory

To get the tenant ID, follow these steps:

1. In the Azure portal, select your Active Directory.
2. Click **Properties**.
3. Copy the GUID value provided for the **Directory ID**. This value is also called the tenant ID.

![Screenshot showing how to copy the tenant ID](./media/storage-auth-aad-app/aad-tenant-id.png)

## Set up a basic web app that can authenticate to Azure AD
When accessing Azure storage, you are accessing Azure storage on the user's behalf. In order to facilitate this, you will need to have a web application where the user can sign in using an Azure AD identity. You can follow the [code example here](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2) to get a basic web application authenticating with your Azure AD first.

### Add references and using statements  

From Visual Studio, install the Azure Storage client library. From the **Tools** menu, select **Nuget Package Manager**, then **Package Manager Console**. Type the following command into the console to install the latest version of the client library for .NET:

```
Install-Package WindowsAzure.Storage
```

Next, add the following using statements to your HomeController.cs:

```dotnet
using System;
using Microsoft.Identity.Client; //MSAL library for getting the access token
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
```

### Get an OAuth token from Azure AD

**A full working sample for this article can be downloaded at http://aka.ms/aadstorage.** 

Next, add a method that requests a token from Azure AD. The token you request will be on behalf of the user, and we will use the GetTokenOnBehalfOfUser method. 

To request the token, you will need the following values from your app's registration,

- Tenant (directory) ID
- Client (application) ID
- Client redirection URI

Remember that if you have just logged in, and you are requesting a token for the `storage.azure.com` resource, you will need to present the user with a UI where the user can consent to such an action on their behalf. To facilitate that you need to catch the `MsalUiRequiredException` and add the functionality to request user consent. This can be seen as below,

To request the token, call the [AuthenticationContext.AcquireTokenAsync](https://docs.microsoft.com/dotnet/api/microsoft.identitymodel.clients.activedirectory.authenticationcontext.acquiretokenasync) method. Make sure that you have the following values from the steps you followed previously:


```dotnet
public async Task<IActionResult> Blob()
{
    var scopes = new string[] { "https://storage.azure.com/user_impersonation" };
    try
    {
        var accessToken = 
            await _tokenAcquisition.GetAccessTokenOnBehalfOfUser(HttpContext, scopes);

        // create a blob on behalf of the user
        // TODO: Write code to access blob storage here.

        ViewData["Message"] = "Blob successfully created";
        return View();
    }
    catch (MsalUiRequiredException ex)
    {
        if (CanbeSolvedByReSignInUser(ex))
        {
            AuthenticationProperties properties = BuildAuthenticationPropertiesForIncrementalConsent(scopes, ex);
            return Challenge(properties);
        }
        else
        {
            throw;
        }
    }
}
```
In order to request incremental consent, we can use the following method,

```
private AuthenticationProperties BuildAuthenticationPropertiesForIncrementalConsent(string[] scopes, MsalUiRequiredException ex)
{
    AuthenticationProperties properties = new AuthenticationProperties();

    // Set the scopes, including the scopes that ADAL.NET / MASL.NET need for the Token cache
    string[] additionalBuildInScopes = new string[] { "openid", "offline_access", "profile" };
    properties.SetParameter<ICollection<string>>(OpenIdConnectParameterNames.Scope, scopes.Union(additionalBuildInScopes).ToList());

    // Attempts to set the login_hint to avoid the logged-in user to be presented with an account selection dialog
    string loginHint = HttpContext.User.GetLoginHint();
    if (!string.IsNullOrWhiteSpace(loginHint))
    {
        properties.SetParameter<string>(OpenIdConnectParameterNames.LoginHint, loginHint);

        string domainHint = HttpContext.User.GetDomainHint();
        properties.SetParameter<string>(OpenIdConnectParameterNames.DomainHint, domainHint);
    }

    // Additional claims required (for instance MFA)
    if (!string.IsNullOrEmpty(ex.Claims))
    {
        properties.Items.Add("claims", ex.Claims);
    }

    return properties;
}
```

### Create the block blob

Finally, use the access token to create new storage credentials, and use those credentials to create the blob. Keep in mind that to authorize blob and queue operations with an OAuth token, you must use HTTPS.:

```dotnet
TokenCredential tokenCredential = new TokenCredential(accessToken);
StorageCredentials storageCredentials = new StorageCredentials(tokenCredential);

CloudBlockBlob blob = new CloudBlockBlob(new Uri("https://mystorageaccount.blob.core.windows.net/sample-container/Blob1.txt"), storageCredentials); 
await blob.UploadTextAsync("Blob created by Azure AD authenticated user.");
```

> [!NOTE]
> Azure AD integration with Azure Storage requires that you use HTTPS for Azure Storage operations.

In the example above, the .NET client library handles the authorization of the request to create the block blob. Other storage client libraries also handle the authorization of the request for you. However, if you are calling an Azure Storage operation with an OAuth token using the REST API, then you'll need to authorize the request using the OAuth token.   

To call Blob and Queue service operations using OAuth access tokens, pass the access token in the **Authorization** header using the **Bearer** scheme, and specify a service version of 2017-11-09 or higher, as shown in the following example:

```
GET /container/file.txt HTTP/1.1
Host: mystorageaccount.blob.core.windows.net
x-ms-version: 2017-11-09
Authorization: Bearer eyJ0eXAiOnJKV1...Xd6j
```

For more information about authorizing Azure Storage operations from REST, see [Authenticate with Azure Active Directory](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory).

## Next steps

- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).
- To learn about using managed identities for Azure resources with Azure Storage, see [Authenticate access to blobs and queues with Azure managed identities for Azure Resources](storage-auth-aad-msi.md).
- To learn how to sign in to Azure CLI and PowerShell with an Azure AD identity, see [Use an Azure AD identity to access Azure Storage with CLI or PowerShell](storage-auth-aad-script.md).
