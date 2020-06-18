---
title: Acquire a token from Azure AD for authorizing requests from a client application
titleSuffix: Azure Storage
description: Use Azure Active Directory to authenticate from within a client application, acquire an OAuth 2.0 token, and authorize requests to Azure Blob storage and Queue storage.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 12/04/2019
ms.author: tamram
ms.subservice: common
ms.custom: has-adal-ref
---

# Acquire a token from Azure AD for authorizing requests from a client application

A key advantage of using Azure Active Directory (Azure AD) with Azure Blob storage or Queue storage is that your credentials no longer need to be stored in your code. Instead, you can request an OAuth 2.0 access token from the Microsoft identity platform (formerly Azure AD). Azure AD authenticates the security principal (a user, group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Blob storage or Queue storage.

This article shows how to configure your native application or web application for authentication with Microsoft identity platform 2.0. The code example features .NET, but other languages use a similar approach. For more information about Microsoft identity platform 2.0, see [Microsoft identity platform (v2.0) overview](../../active-directory/develop/v2-overview.md).

For an overview of the OAuth 2.0 code grant flow, see [Authorize access to Azure Active Directory web applications using the OAuth 2.0 code grant flow](../../active-directory/develop/v2-oauth2-auth-code-flow.md).

## Assign a role to an Azure AD security principal

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
1. In the **API permissions** section, select **Add a permission** and choose **Microsoft APIs**.
1. Select **Azure Storage** from the list of results to display the **Request API permissions** pane.
1. Under **What type of permissions does your application require?**, observe that the available permission type is **Delegated permissions**. This option is selected for you by default.
1. In the **Select permissions** section of the **Request API permissions** pane, select the checkbox next to **user_impersonation**, then click  **Add permissions**.

    ![Screenshot showing permissions for storage](media/storage-auth-aad-app/registered-app-permissions-1.png)

The **API permissions** pane now shows that your registered Azure AD application has access to both Microsoft Graph and the Azure Storage. Permissions are granted to Microsoft Graph automatically when you first register your app with Azure AD.

![Screenshot showing register app permissions](media/storage-auth-aad-app/registered-app-permissions-2.png)

## Create a client secret

The application needs a client secret to prove its identity when requesting a token. To add the client secret, follow these steps:

1. Navigate to your app registration in the Azure portal.
1. Select the **Certificates & secrets** setting.
1. Under **Client secrets**, click **New client secret** to create a new secret.
1. Provide a description for the secret, and choose the desired expiration interval.
1. Immediately copy the value of the new secret to a secure location. The full value is displayed to you only once.

    ![Screenshot showing client secret](media/storage-auth-aad-app/client-secret.png)

## Client libraries for token acquisition

Once you have registered your application and granted it permissions to access data in Azure Blob storage or Queue storage, you can add code to your application to authenticate a security principal and acquire an OAuth 2.0 token. To authenticate and acquire the token, you can use either one of the [Microsoft identity platform authentication libraries](../../active-directory/develop/reference-v2-libraries.md) or another open-source library that supports OpenID Connect 1.0. Your application can then use the access token to authorize a request against Azure Blob storage or Queue storage.

For a list of scenarios for which acquiring tokens is supported, see the [authentication flows](/en-us/azure/active-directory/develop/msal-authentication-flows) section of the [Microsoft Authentication Library content](/azure/active-directory/develop/msal-overview).

## Well-known values for authentication with Azure AD

To authenticate a security principal with Azure AD, you need to include some well-known values in your code.

### Azure AD authority

For Microsoft public cloud, the base Azure AD authority is as follows, where *tenant-id* is your Active Directory tenant ID (or directory ID):

`https://login.microsoftonline.com/<tenant-id>/`

The tenant ID identifies the Azure AD tenant to use for authentication. It is also referred to as the directory ID. To retrieve the tenant ID, navigate to the **Overview** page for your app registration in the Azure portal, and copy the value from there.

### Azure Storage resource ID

[!INCLUDE [storage-resource-id-include](../../../includes/storage-resource-id-include.md)]

## .NET code example: Create a block blob

The code example shows how to get an access token from Azure AD. The access token is used to authenticate the specified user and then authorize a request to create a block blob. To get this sample working, first follow the steps outlined in the preceding sections.

To request the token, you will need the following values from your app's registration:

- The name of your Azure AD domain. Retrieve this value from the **Overview** page of your Azure Active Directory.
- The tenant (or directory) ID. Retrieve this value from the **Overview** page of your app registration.
- The client (or application) ID. Retrieve this value from the **Overview** page of your app registration.
- The client redirection URI. Retrieve this value from the **Authentication** settings for your app registration.
- The value of the client secret. Retrieve this value from the location to which you previously copied it.

### Create a storage account and container

To run the code sample, create a storage account within the same subscription as your Azure Active Directory. Then create a container within that storage account. The sample code will create a block blob in this container.

Next, explicitly assign the **Storage Blob Data Contributor** role to the user account under which you will run the sample code. For instructions on how to assign this role in the Azure portal, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md).

> [!NOTE]
> When you create an Azure Storage account, you are not automatically assigned permissions to access data via Azure AD. You must explicitly assign yourself an RBAC role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or container or queue.

### Create a web application that authorizes access to Blob storage with Azure AD

When your application accesses Azure Storage, it does so on the user's behalf, meaning that blob or queue resources are accessed using the permissions of the user who is logged in. To try this code example, you need a web application that prompts the user to sign in using an Azure AD identity. You can create your own, or use the sample application provided by Microsoft.

A completed sample web application that acquires a token and uses it to create a blob in Azure Storage is available on [GitHub](https://aka.ms/aadstorage). Reviewing and running the completed sample may be helpful for understanding the code examples. For instructions about how to run the completed sample, see the section titled [View and run the completed sample](#view-and-run-the-completed-sample).

#### Add references and using statements  

From Visual Studio, install the Azure Storage client library. From the **Tools** menu, select **NuGet Package Manager**, then **Package Manager Console**. Type the following commands into the console window to install the necessary packages from the Azure Storage client library for .NET:

```console
Install-Package Microsoft.Azure.Storage.Blob
Install-Package Microsoft.Azure.Storage.Common
```

Next, add the following using statements to the HomeController.cs file:

```csharp
using Microsoft.Identity.Client; //MSAL library for getting the access token
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
```

#### Create a block blob

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
            new Uri("https://<storage-account>.blob.core.windows.net/<container>/Blob1.txt"),
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

#### Get an OAuth token from Azure AD

Next, add a method that requests a token from Azure AD on the behalf of the user. This method defines the scope for which permissions are to be granted. For more information about permissions and scopes, see [Permissions and consent in the Microsoft identity platform endpoint](../../active-directory/develop/v2-permissions-and-consent.md).

Use the resource ID to construct the scope for which to acquire the token. The example constructs the scope by using the resource ID together with the built-in `user_impersonation` scope, which indicates that the token is being requested on behalf of the user.

Keep in mind that you may need to present the user with an interface that enables the user to consent to request the token their behalf. When consent is necessary, the example catches the **MsalUiRequiredException** and calls another method to facilitate the request for consent:

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
        AuthenticationProperties properties =
            BuildAuthenticationPropertiesForIncrementalConsent(scopes, ex);
        return Challenge(properties);
    }
}
```

Consent is the process of a user granting authorization to an application to access protected resources on their behalf. The Microsoft identity platform 2.0 supports incremental consent, meaning that a security principal can request a minimum set of permissions initially and add permissions over time as needed. When your code requests an access token, specify the scope of permissions that your app needs at any given time by in the `scope` parameter. For more information about incremental consent, see the section titled **Incremental and dynamic consent** in [Why update to Microsoft identity platform (v2.0)?](../../active-directory/azuread-dev/azure-ad-endpoint-comparison.md#incremental-and-dynamic-consent).

The following method constructs the authentication properties for requesting incremental consent:

```csharp
private AuthenticationProperties BuildAuthenticationPropertiesForIncrementalConsent(string[] scopes,
                                                                                    MsalUiRequiredException ex)
{
    AuthenticationProperties properties = new AuthenticationProperties();

    // Set the scopes, including the scopes that ADAL.NET or MSAL.NET need for the Token cache.
    string[] additionalBuildInScopes = new string[] { "openid", "offline_access", "profile" };
    properties.SetParameter<ICollection<string>>(OpenIdConnectParameterNames.Scope,
                                                 scopes.Union(additionalBuildInScopes).ToList());

    // Attempt to set the login_hint so that the logged-in user is not presented
    // with an account selection dialog.
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

## View and run the completed sample

To run the sample application, first clone or download it from [GitHub](https://github.com/Azure-Samples/storage-dotnet-azure-ad-msal). Then update the application as described in the following sections.

### Provide values in the settings file

Next, update the *appsettings.json* file with your own values, as follows:

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "<azure-ad-domain-name>.onmicrosoft.com",
    "TenantId": "<tenant-id>",
    "ClientId": "<client-id>",
    "CallbackPath": "/signin-oidc",
    "SignedOutCallbackPath ": "/signout-callback-oidc",

    // To call an API
    "ClientSecret": "<client-secret>"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

### Update the storage account and container name

In the *HomeController.cs* file, update the URI that references the block blob to use the name of your storage account and container:

```csharp
CloudBlockBlob blob = new CloudBlockBlob(
                      new Uri("https://<storage-account>.blob.core.windows.net/<container>/Blob1.txt"),
                      storageCredentials);
```

### Enable implicit grant flow

To run the sample, you may need to configure the implicit grant flow for your app registration. Follow these steps:

1. Navigate to your app registration in the Azure portal.
1. In the Manage section, select the **Authentication** setting.
1. Under **Advanced settings**, in the **Implicit grant** section, select the check boxes to enable access tokens and ID tokens, as shown in the following image:

    ![Screenshot showing how to enable settings for implicit grant flow](media/storage-auth-aad-app/enable-implicit-grant-flow.png)

### Update the port used by localhost

When you run the sample, you may find that you need to update the redirect URI specified in your app registration to use the *localhost* port assigned at runtime. To update the redirect URI to use the assigned port, follow these steps:

1. Navigate to your app registration in the Azure portal.
1. In the Manage section, select the **Authentication** setting.
1. Under **Redirect URIs**, edit the port to match that used by the sample application, as shown in the following image:

    ![Screenshot showing redirect URIs for app registration](media/storage-auth-aad-app/redirect-uri.png)

## Next steps

- To learn more about the Microsoft identity platform, see [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/).
- To learn more about RBAC roles for Azure storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).
- To learn about using managed identities for Azure resources with Azure Storage, see [Authenticate access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](storage-auth-aad-msi.md).
