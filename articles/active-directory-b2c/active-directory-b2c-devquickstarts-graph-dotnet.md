---
title: Use the Graph API in Azure Active Directory B2C
description: How to manage users in an Azure AD B2C tenant by calling the Azure AD Graph API and using an application identity to automate the process.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: marsma
ms.subservice: B2C
---

# Azure AD B2C: Use the Azure AD Graph API

Azure Active Directory B2C (Azure AD B2C) tenants can have thousands or millions of users. This means that many common tenant management tasks need to be performed programmatically. A primary example is user management.

You might need to migrate an existing user store to a B2C tenant. You may want to host user registration on your own page and create user accounts in your Azure AD B2C directory behind the scenes. These kinds of tasks require the ability to create, read, update, and delete user accounts. You can perform such tasks by using the Azure AD Graph API.

For B2C tenants, there are two primary modes of communicating with the Graph API:

* For **interactive**, run-once tasks, you should act as an administrator account in the B2C tenant when you perform the tasks. This mode requires an administrator to sign in with credentials before that admin can perform any calls to the Graph API.
* For **automated**, continuous tasks, you should use some type of service account that you provide with the necessary privileges to perform management tasks. In Azure AD, you can do this by registering an application and authenticating to Azure AD. This is done by using an *Application ID* that uses the [OAuth 2.0 client credentials grant](../active-directory/develop/service-to-service.md). In this case, the application acts as itself, not as a user, to call the Graph API.

In this article, you learn how to perform the automated use case. You'll build a .NET 4.5 `B2CGraphClient` that performs user create, read, update, and delete (CRUD) operations. The client will have a Windows command-line interface (CLI) that allows you to invoke various methods. However, the code is written to behave in a non-interactive, automated fashion.

>[!IMPORTANT]
> You **must** use the [Azure AD Graph API](../active-directory/develop/active-directory-graph-api-quickstart.md) to manage users in an Azure AD B2C directory. The Azure AD Graph API is different from the Microsoft Graph API. Learn more in this MSDN blog post: [Microsoft Graph or Azure AD Graph](https://blogs.msdn.microsoft.com/aadgraphteam/2016/07/08/microsoft-graph-or-azure-ad-graph/).

## Prerequisites

Before you can create applications or users, you need an Azure AD B2C tenant. If you don't already have one, [Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md).

## Register an application

Once you have an Azure AD B2C tenant, you need to register your management application by using the [Azure portal](https://portal.azure.com). You also need to grant it the permissions required for performing management tasks on behalf of your automated script or management application.

### Register application in Azure Active Directory

To use the Azure AD Graph API with your B2C tenant, you need to register an application by using the Azure Active Directory **App registrations** workflow.

1. Sign in to the [Azure portal](https://portal.azure.com) and switch to the directory that contains your Azure AD B2C tenant.
1. Select **Azure Active Directory** (*not* Azure AD B2C) in the left menu. Or, select **All services** and then search for and select **Azure Active Directory**.
1. Under **Manage** in the left menu, select **App registrations (Legacy)**.
1. Select **New application registration**
1. Enter a name for the application. For example, *Management App*.
1. Enter any valid URL in **Sign-on URL**. For example, *https://localhost*. This endpoint does not need to be reachable, but needs to be a valid URL.
1. Select **Create**.
1. Record the **Application ID** that appears on the **Registered app** overview page. You use this value for configuration in a later step.

### Assign API access permissions

1. On the **Registered app** overview page, select **Settings**.
1. Under **API ACCESS**, select **Required permissions**.
1. Select **Windows Azure Active Directory**.
1. Under **APPLICATION PERMISSIONS**, select **Read and write directory data**.
1. Select **Save**.
1. Select **Grant permissions**, and then select **Yes**. It might take a few minutes to for the permissions to fully propagate.

### Create client secret

1. Under **API ACCESS**, select **Keys**.
1. Enter a description for the key in the **Key description** box. For example, *Management Key*.
1. Select a validity **Duration** and then select **Save**.
1. Record the key's **VALUE**. You use this value for configuration in a later step.

You now have an application that has permission to *create*, *read*, and *update* users in your Azure AD B2C tenant. Continue to the next section to add user *delete* and *password update* permissions.

## Add user delete and password update permissions

The *Read and write directory data* permission that you granted earlier does **NOT** include the ability to delete users or update their passwords.

If you want to give your application the ability to delete users or update passwords, you need to grant it the *User administrator* role.

1. Sign in to the [Azure portal](https://portal.azure.com) and switch to the directory that contains your Azure AD B2C tenant.
1. Select **Azure AD B2C** in the left menu. Or, select **All services** and then search for and select **Azure AD B2C**.
1. Under **Manage**, select **Roles and administrators**.
1. Select the **User administrator** role.
1. Select **Add assignment**.
1. In the **Select** text box, enter the name of the application you registered earlier, for example, *Management App*. Select your application when it appears in the search results.
1. Select **Add**. It might take a few minutes to for the permissions to fully propagate.

Your Azure AD B2C application now has the additional permissions required to delete users or update their passwords in your B2C tenant.

## Get the sample code

The code sample is a .NET console application that uses the [Active Directory Authentication Library (ADAL)](../active-directory/develop/active-directory-authentication-libraries.md) to interact with Azure AD Graph API. Its code demonstrates how to call the API to programmatically manage users in an Azure AD B2C tenant.

You can [download the sample archive](https://github.com/AzureADQuickStarts/B2C-GraphAPI-DotNet/archive/master.zip) (\*.zip) or clone the GitHub repository:

```cmd
git clone https://github.com/AzureADQuickStarts/B2C-GraphAPI-DotNet.git
```

After you've obtained the code sample, configure it for your environment and then build the project:

1. Open the `B2CGraphClient\B2CGraphClient.sln` solution in Visual Studio.
1. In the **B2CGraphClient** project, open the *App.config* file.
1. Replace the `<appSettings>` section with the following XML. Then replace `{your-b2c-tenant}` with the name of your tenant, and `{Application ID}` and `{Client secret}` with the values you recorded earlier.

    ```xml
    <appSettings>
        <add key="b2c:Tenant" value="{your-b2c-tenant}.onmicrosoft.com" />
        <add key="b2c:ClientId" value="{Application ID}" />
        <add key="b2c:ClientSecret" value="{Client secret}" />
    </appSettings>
    ```

1. Build the solution. Right-click on the **B2CGraphClient** solution in the Solution Explorer, and then select **Rebuild Solution**.

If the build is successful, the `B2C.exe` console application can be found in `B2CGraphClient\bin\Debug`.

## Review the sample code

To use the B2CGraphClient, open a Command Prompt (`cmd.exe`) and change to project's `Debug` directory. Then, run the `B2C Help` command.

```cmd
cd B2CGraphClient\bin\Debug
B2C Help
```

The `B2C Help` command displays a brief description of the available subcommands. Each time you invoke one of its subcommands, `B2CGraphClient` sends a request to the Azure AD Graph API.

The following sections discuss how the application's code makes calls to the Azure AD Graph API.

### Get an access token

Any request to the Azure AD Graph API requires an access token for authentication. `B2CGraphClient` uses the open-source Active Directory Authentication Library (ADAL) to assist in obtaining access tokens. ADAL makes token acquisition easier by providing a helper API and taking care of a few important details like caching access tokens. You don't have to use ADAL to get tokens, however. You could instead get tokens by manually crafting HTTP requests.

> [!NOTE]
> You must use ADAL v2 or higher to get access tokens that can be used with the Azure AD Graph API. You cannot use ADAL v1.

When `B2CGraphClient` executes, it creates an instance of the `B2CGraphClient` class. The constructor for this class sets up the ADAL authentication scaffolding:

```csharp
public B2CGraphClient(string clientId, string clientSecret, string tenant)
{
    // The client_id, client_secret, and tenant are provided in Program.cs, which pulls the values from App.config
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.tenant = tenant;

    // The AuthenticationContext is ADAL's primary class, in which you indicate the tenant to use.
    this.authContext = new AuthenticationContext("https://login.microsoftonline.com/" + tenant);

    // The ClientCredential is where you pass in your client_id and client_secret, which are
    // provided to Azure AD in order to receive an access_token by using the app's identity.
    this.credential = new ClientCredential(clientId, clientSecret);
}
```

Let's use the `B2C Get-User` command as an example.

When `B2C Get-User` is invoked without additional arguments, the application calls the `B2CGraphClient.GetAllUsers()` method. `GetAllUsers()` then calls `B2CGraphClient.SendGraphGetRequest()`, which submits an HTTP GET request to the Azure AD Graph API. Before `B2CGraphClient.SendGraphGetRequest()` sends the GET request, it first obtains an access token by using ADAL:

```csharp
public async Task<string> SendGraphGetRequest(string api, string query)
{
    // First, use ADAL to acquire a token by using the app's identity (the credential)
    // The first parameter is the resource we want an access_token for; in this case, the Graph API.
    AuthenticationResult result = authContext.AcquireToken("https://graph.windows.net", credential);
    ...
```

You can get an access token for the Graph API by calling the ADAL `AuthenticationContext.AcquireToken()` method. ADAL then returns an `access_token` that represents the application's identity.

### Read users

When you want to get a list of users or get a particular user from the Azure AD Graph API, you can send an HTTP `GET` request to the `/users` endpoint. A request for all of the users in a tenant looks like this:

```HTTP
GET https://graph.windows.net/contosob2c.onmicrosoft.com/users?api-version=1.6
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
```

To see this request, run:

 ```cmd
 B2C Get-User
 ```

There are two important things to note:

* The access token obtained by using ADAL is added to the `Authorization` header by using the `Bearer` scheme.
* For B2C tenants, you must use the query parameter `api-version=1.6`.

Both of these details are handled in the `B2CGraphClient.SendGraphGetRequest()` method:

```csharp
public async Task<string> SendGraphGetRequest(string api, string query)
{
    ...

    // For B2C user management, be sure to use the 1.6 Graph API version.
    HttpClient http = new HttpClient();
    string url = "https://graph.windows.net/" + tenant + api + "?" + "api-version=1.6";
    if (!string.IsNullOrEmpty(query))
    {
        url += "&" + query;
    }

    // Append the access token for the Graph API to the Authorization header of the request by using the Bearer scheme.
    HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, url);
    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);
    HttpResponseMessage response = await http.SendAsync(request);

    ...
```

### Create consumer user accounts

When you create user accounts in your B2C tenant, you can send an HTTP `POST` request to the `/users` endpoint. The following HTTP `POST` request shows an example user to be created in the tenant.

Most of properties in the following request are required to create consumer users. The `//` comments have been included for illustration--do not include them in an actual request.

```HTTP
POST https://graph.windows.net/contosob2c.onmicrosoft.com/users?api-version=1.6
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
Content-Type: application/json
Content-Length: 338

{
    // All of these properties are required to create consumer users.

    "accountEnabled": true,
    "signInNames": [                           // controls which identifier the user uses to sign in to the account
        {
            "type": "emailAddress",            // can be 'emailAddress' or 'userName'
            "value": "consumer@fabrikam.com"
        }
    ],
    "creationType": "LocalAccount",            // always set to 'LocalAccount'
    "displayName": "Consumer User",            // a value that can be used for displaying to the end user
    "mailNickname": "cuser",                   // an email alias for the user
    "passwordProfile": {
        "password": "P@ssword!",
        "forceChangePasswordNextLogin": false  // always set to false
    },
    "passwordPolicies": "DisablePasswordExpiration"
}
```

To see the request, run one of the following commands:

```cmd
B2C Create-User ..\..\..\usertemplate-email.json
B2C Create-User ..\..\..\usertemplate-username.json
```

The `Create-User` command takes as an input parameter a JSON file that contains a JSON representation of a user object. There are two sample JSON files in the code sample: `usertemplate-email.json` and `usertemplate-username.json`. You can modify these files to suit your needs. In addition to the required fields above, several optional fields are included in the files.

For more information on required and optional fields, see the [Entity and complex type reference | Graph API reference](/previous-versions/azure/ad/graph/api/entity-and-complex-type-reference).

You can see how the POST request is constructed in `B2CGraphClient.SendGraphPostRequest()`:

* It attaches an access token to the `Authorization` header of the request.
* It sets `api-version=1.6`.
* It includes the JSON user object in the body of the request.

> [!NOTE]
> If the accounts that you want to migrate from an existing user store have a lower password strength than the [strong password strength enforced by Azure AD B2C](active-directory-b2c-reference-password-complexity.md), you can disable the strong password requirement by using the `DisableStrongPassword` value in the `passwordPolicies` property. For example, you can modify the previous create user request as follows: `"passwordPolicies": "DisablePasswordExpiration, DisableStrongPassword"`.

### Update consumer user accounts

When you update user objects, the process is similar to the one you use to create user objects, but uses the HTTP `PATCH` method:

```HTTP
PATCH https://graph.windows.net/contosob2c.onmicrosoft.com/users/<user-object-id>?api-version=1.6
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
Content-Type: application/json
Content-Length: 37

{
    "displayName": "Joe Consumer"    // this request updates only the user's displayName
}
```

Try updating a user by modifying some values in your JSON files, and then use the `B2CGraphClient` to run one of these commands:

```cmd
B2C Update-User <user-object-id> ..\..\..\usertemplate-email.json
B2C Update-User <user-object-id> ..\..\..\usertemplate-username.json
```

Inspect the `B2CGraphClient.SendGraphPatchRequest()` method for details on how to send this request.

### Search users

You can search for users in your B2C tenant in two ways:

* Reference the user's **object ID**.
* Reference their sign-in identifer, the `signInNames` property.

Run one of the following commands to search for a user:

```cmd
B2C Get-User <user-object-id>
B2C Get-User <filter-query-expression>
```

For example:

```cmd
B2C Get-User 2bcf1067-90b6-4253-9991-7f16449c2d91
B2C Get-User $filter=signInNames/any(x:x/value%20eq%20%27consumer@fabrikam.com%27)
```

### Delete users

To delete users, use the HTTP `DELETE` method, and construct the URL with the user's object ID:

```HTTP
DELETE https://graph.windows.net/contosob2c.onmicrosoft.com/users/<user-object-id>?api-version=1.6
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
```

To see an example, enter this command and view the delete request that is printed to the console:

```cmd
B2C Delete-User <object-id-of-user>
```

Inspect the `B2CGraphClient.SendGraphDeleteRequest()` method for details on how to send this request.

You can perform many other actions with the Azure AD Graph API in addition to user management. The
[Azure AD Graph API reference](/previous-versions/azure/ad/graph/api/api-catalog) provides details on each action, along with sample requests.

## Use custom attributes

Most consumer applications need to store some type of custom user profile information. One way you can do so is to define a custom attribute in your B2C tenant. You can then treat that attribute in the same way you treat any other property on a user object. You can update the attribute, delete the attribute, query by the attribute, send the attribute as a claim in sign-in tokens, and more.

To define a custom attribute in your B2C tenant, see the [B2C custom attribute reference](active-directory-b2c-reference-custom-attr.md).

You can view the custom attributes defined in your B2C tenant by using the following `B2CGraphClient` commands:

```cmd
B2C Get-B2C-Application
B2C Get-Extension-Attribute <object-id-in-the-output-of-the-above-command>
```

The output reveals the details of each custom attribute. For example:

```json
{
      "odata.type": "Microsoft.DirectoryServices.ExtensionProperty",
      "objectType": "ExtensionProperty",
      "objectId": "cec6391b-204d-42fe-8f7c-89c2b1964fca",
      "deletionTimestamp": null,
      "appDisplayName": "",
      "name": "extension_55dc0861f9a44eb999e0a8a872204adb_Jersey_Number",
      "dataType": "Integer",
      "isSyncedFromOnPremises": false,
      "targetObjects": [
        "User"
      ]
}
```

You can use the full name, such as `extension_55dc0861f9a44eb999e0a8a872204adb_Jersey_Number`, as a property on your user objects. Update your JSON file with the new property and a value for the property, and then run:

```cmd
B2C Update-User <object-id-of-user> <path-to-json-file>
```

## Next steps

By using `B2CGraphClient`, you have a service application that can manage your B2C tenant users programmatically. `B2CGraphClient` uses its own application identity to authenticate to the Azure AD Graph API. It also acquires tokens by using a client secret.

As you incorporate this functionality into your own application, remember a few key points for B2C applications:

* Grant the application the required permissions in the tenant.
* For now, you need to use ADAL (not MSAL) to get access tokens. (You can also send protocol messages directly, without using a library.)
* When you call the Graph API, use `api-version=1.6`.
* When you create and update consumer users, a few properties are required, as described above.
