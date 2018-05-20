---
title: Authorize access to Azure Storage for a security principal (Preview) | Microsoft Docs
description: Authorize access to Azure Storage for a security principal (Preview).  
services: storage
author: tamram
manager: jeconnoc

ms.service: storage
ms.topic: article
ms.date: 05/18/2018
ms.author: tamram
---

# Authorize access to Azure Storage for a security principal (Preview)

A key advantage of using Azure Active Directory (Azure AD) with Azure Storage is that your credentials no longer need to be stored in your code. Instead, you can request an access token from Azure AD. Azure AD handles the authentication of the security principal (a user, group, or service principal) running the application. If authentication succeeds, Azure AD returns the access token to the application, and the application can then use the access token to authorize requests to Azure Storage.

This article shows how to configure your application for authentication with Azure AD. RBAC

### Endpoints for authorization with Azure AD

To authorize access by a security principal to storage resources with Azure AD, you need to include some well-known endpoints in your code.

#### Azure AD OAuth endpoint

The base Azure AD authority endpoint for OAuth 2.0 is as follows, where *tenant-id* is your Active Directory tenant ID (or directory ID):

`https://login.microsoftonline.com/<tenant-id>/oauth2/token`

The tenant ID identifies the Azure AD tenant to use for authentication. To retrieve the tenant ID, follow the steps outlined in **Get the tenant ID for your Azure Active Directory**.

#### Storage resource endpoint

Use the Azure Storage resource endpoint to acquire a token for authenticating requests to Azure Storage:

`https://storage.azure.com/`

### Register your application with a tenant

The first step in using Azure AD to authorize access to storage resources is registering your application in an Azure AD tenant. Registering your application enables you to call the Azure [Active Directory Authentication Library][../../active-directory/active-directory-authentication-libraries.md] (ADAL) from your code. The ADAL provides an API for authenticating with Azure AD from your application. Registering your application is required if you plan to authorize access using a security principal.

When you register your application, you supply information about your application to Azure AD. Azure AD then provides an application ID (also called a *client ID*) that you use to associate your application with Azure AD at runtime. To learn more about the application ID, see [Application and service principal objects in Azure Active Directory](../../active-directory/develop/active-directory-application-objects.md).

To register your Azure Storage application, follow the steps in the [Adding an Application](../../active-directory/develop/active-directory-integrating-applications.md#adding-an-application) section in [Integrating applications with Azure Active Directory][../../active-directory/active-directory-integrating-applications.md]. If you register your application as a Native Application, you can specify any valid URI for the **Redirect URI**. It does not need to be a real endpoint.

![Register your Azure Storage application with Azure AD](./media/storage-auth-aad-data/app-registration.png)

After you've registered your application, you'll see the application ID under **Settings**:

![Register your Azure Storage application with Azure AD](./media/storage-auth-aad-data/app-registration-client-id.png)

For more information about registering an application with Azure AD, see [Authentication Scenarios for Azure AD](../../active-directory/develop/active-directory-authentication-scenarios.md).

### Grant your registered app permissions to Azure Storage

Next, you need to grant your application permissions to call Azure Storage APIs. This step enables your application to authorize calls to Azure Storage with Azure AD.

1. In the left-hand navigation pane of the Azure portal, choose **All services**, and search for **App Registrations**.
2. Search for the name of the registered application you created in the previous step.
3. Select your registered app and click **Settings**. In the **API Access** section, select **Required permissions**.
4. In the **Required permissions** blade, click the **Add** button.
5. Under **Select an API**, search for "Azure Storage", and select **Azure Storage** from the list of results.

    ![Screen shot showing permissions for storage](media/storage-auth-aad-data/registered-app-permissions-1.png)

6. Under **Select permissions**, check the box next to **Access Azure Storage**, and click **Select**.
7. Click **Done**.

The **Required Permissions** windows now shows that your Azure AD application has access to both Azure Active Directory and the Azure Storage. Permissions are granted to Azure AD automatically when you first register your app with Azure AD.

![Screen shot showing register app permissions](media/storage-auth-aad-data/registered-app-permissions-2.png)

### Get the tenant ID for your Azure Active Directory

The tenant ID identifies the Azure AD tenant that provides authentication services to your application. You need this value to request a token. To get the tenant ID, follow these steps:

1. In the Azure portal, select your Active Directory.
2. Click **Properties**.
3. Copy the GUID value provided for the **Directory ID**. This value is also called the tenant ID.

![Copy the directory ID](./media/storage-auth-aad-data/aad-directory-id.png)

## .NET code example: Create a block blob

The code example shows how to get an access token from Azure AD. The access token is used to authenticate the specified user and then authorize a request to create a block blob. This example authenticates a user, but you can use a similar approach to authenticate a group or service principal.

To get this sample working, first follow the steps outlined in the preceding sections. Also, make sure that the user specified in the method that retrieves the access token has been assigned the Blob Data Contributor RBAC role, even if that user is yourself.

### Add references and using statements  

In Visual Studio, install the preview version of the Azure Storage client library. From the **Tools** menu, select **Nuget Package Manager**, then **Package Manager Console**. Type the following command into the console:

*need path to package*  

Next, add the following using statements to your code:

```dotnet
using System.Web.Script.Serialization;
using Microsoft.IdentityModel.Clients.ActiveDirectory; //ADAL client library for getting the access token
using Microsoft.WindowsAzure.Storage.Auth;
using Microsoft.WindowsAzure.Storage.Blob;
```

You'll need to explicitly reference the **System.Web.Extensions** package in order to resolve members of the `System.Web.Script.Serialization` assembly. For more information, see [How to: Add or remove references by using the Reference Manager](https://docs.microsoft.com/visualstudio/ide/how-to-add-or-remove-references-by-using-the-reference-manager).

### Get an OAuth token from Azure AD

Next, add a method that requests a token from Azure AD for the specified user. To request the token, call the [AuthenticationContext.AcquireTokenAsync](https://docs.microsoft.com/dotnet/api/microsoft.identitymodel.clients.activedirectory.authenticationcontext.acquiretokenasync) method.


```dotnet
static string GetUserOAuthToken()
{
    const string ResourceId = "https://storage.azure.com/"; // Storage resource endpoint
    const string AuthEndpoint = "https://login.microsoftonline.com/{0}/oauth2/token"; // Azure AD OAuth endpoint
    const string TenantId = "<tenant-id>"; // Tenant or directory ID

    // Construct the authority string from the Azure AD OAuth endpoint and the tenant ID. 
    string authority = string.Format(CultureInfo.InvariantCulture, AuthEndpoint, TenantId);
    AuthenticationContext authContext = new AuthenticationContext(authority);

    // Construct a user identifier. The user needs Blob Data Contributor permissions to create a block blob. 
    UserIdentifier uid = new UserIdentifier("<user-email-address>", UserIdentifierType.OptionalDisplayableId);

    // Acquire an access token from Azure AD. 
    AuthenticationResult result = authContext.AcquireTokenAsync(ResourceId, 
                                                                "<client-id>", 
                                                                new Uri(@"<client-redirect-uri>"), 
                                                                new PlatformParameters(PromptBehavior.Auto), 
                                                                uid).Result;

    return result.AccessToken;
}

```

### Create the block blob

Finally, use the access token to create new storage credentials, and use those credentials to create the blob:

```dotnet
// Get the access token.
string accessToken = GetUserOAuthToken();

// Use the access token to create the storage credentials.
TokenCredential tokenCredential = new TokenCredential(accessToken);
StorageCredentials storageCredentials = new StorageCredentials(tokenCredential);

// Create a block blob using those credentials
CloudBlockBlob blob = new CloudBlockBlob(new Uri("https://storagesamples.blob.core.windows.net/sample-container/Blob1.txt"), storageCredentials);
```

## Next steps




## Authorize access by an Azure VM Managed Service Identity (MSI)

