---
title: Use the Graph API in Azure Active Directory B2C | Microsoft Docs
description: How to call the Graph API for a B2C tenant by using an application identity to automate the process.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/07/2017
ms.author: marsma
ms.subservice: B2C
---

# Azure AD B2C: Use the Azure AD Graph API

>[!NOTE]
> You must use the [Azure AD Graph API](/previous-versions/azure/ad/graph/howto/azure-ad-graph-api-operations-overview) to manage users in an Azure AD B2C directory. This is different from the Microsoft Graph API. Learn more [here](https://blogs.msdn.microsoft.com/aadgraphteam/2016/07/08/microsoft-graph-or-azure-ad-graph/).

Azure Active Directory (Azure AD) B2C tenants tend to be very large. This means that many common tenant management tasks need to be performed programmatically. A primary example is user management. You might need to migrate an existing user store to a B2C tenant. You may want to host user registration on your own page and create user accounts in your Azure AD B2C directory behind the scenes. These types of tasks require the ability to create, read, update, and delete user accounts. You can do these tasks by using the Azure AD Graph API.

For B2C tenants, there are two primary modes of communicating with the Graph API.

* For interactive, run-once tasks, you should act as an administrator account in the B2C tenant when you perform the tasks. This mode requires an administrator to sign in with credentials before that admin can perform any calls to the Graph API.
* For automated, continuous tasks, you should use some type of service account that you provide with the necessary privileges to perform management tasks. In Azure AD, you can do this by registering an application and authenticating to Azure AD. This is done by using an **Application ID** that uses the [OAuth 2.0 client credentials grant](../active-directory/develop/service-to-service.md). In this case, the application acts as itself, not as a user, to call the Graph API.

In this article, you learn how to perform the automated-use case. You'll build a .NET 4.5 `B2CGraphClient` that performs user create, read, update, and delete (CRUD) operations. The client will have a Windows command-line interface (CLI) that allows you to invoke various methods. However, the code is written to behave in a noninteractive, automated fashion.

## Get an Azure AD B2C tenant
Before you can create applications or users, you need an Azure AD B2C tenant. If you don't have a tenant already, [get started with Azure AD B2C](active-directory-b2c-get-started.md).

## Register your application in your tenant
After you have a B2C tenant, you need to register your application using the [Azure portal](https://portal.azure.com).

> [!IMPORTANT]
> To use the Graph API with your B2C tenant, you need to register an application using the *App Registrations* service in the Azure portal, **NOT** Azure AD B2C's *Applications* menu. The following instructions lead you to the appropriate menu. You can't reuse existing B2C applications that you registered in the Azure AD B2C's *Applications* menu.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Choose your Azure AD B2C tenant by selecting your account in the top right corner of the page.
3. In the left-hand navigation pane, choose **All Services**, click **App Registrations**, and click **Add**.
4. Follow the prompts and create a new application. 
    1. Select **Web App / API** as the Application Type.    
    2. Provide **any Sign-on URL** (e.g. `https://B2CGraphAPI`) as it's not relevant for this example.  
5. The application will now show up in the list of applications, click on it to obtain the **Application ID** (also known as Client ID). Copy it as you'll need it in a later section.
6. In the Settings menu, click **Keys**.
7. In the **Passwords** section, enter the key description and select a duration, and then click **Save**. Copy the key value (also known as Client Secret) for use in a later section.

## Configure create, read and update permissions for your application
Now you need to configure your application to get all the required permissions to create, read, update and delete users.

1. Continuing in the Azure portal's App Registrations menu, select your application.
2. In the Settings menu, click on **Required permissions**.
3. In the Required permissions menu, click on **Windows Azure Active Directory**.
4. In the Enable Access  menu, select the **Read and write directory data** permission from **Application Permissions** and click **Save**.
5. Finally, back in the Required permissions menu, click on the **Grant Permissions** button.

You now have an application that has permission to create, read and update users from your B2C tenant.

> [!NOTE]
> Granting permissions may take a few minutes to fully process.
> 
> 

## Configure delete or update password permissions for your application
Currently, the *Read and write directory data* permission does **NOT** include the ability to delete users or update user passwords. If you want to give your application the ability to delete users or update passwords, you'll need to do these extra steps that involve PowerShell, otherwise, you can skip to the next section.

First, if you don't already have it installed, install the [Azure AD PowerShell v1 module (MSOnline)](https://docs.microsoft.com/powershell/azure/active-directory/install-msonlinev1?view=azureadps-1.0):

```powershell
Install-Module MSOnline
```

After you install the PowerShell module connect to your Azure AD B2C tenant.

> [!IMPORTANT]
> You need to use a B2C tenant administrator account that is **local** to the B2C tenant. These accounts look like this: myusername@myb2ctenant.onmicrosoft.com.

```powershell
Connect-MsolService
```

Now we'll use the **Application ID** in the script below to assign the application the user account administrator role. These roles have well-known identifiers, so all you need to do is input your **Application ID** in the script below.

```powershell
$applicationId = "<YOUR_APPLICATION_ID>"
$sp = Get-MsolServicePrincipal -AppPrincipalId $applicationId
Add-MsolRoleMember -RoleObjectId fe930be7-5e62-47db-91af-98c3a49a38b1 -RoleMemberObjectId $sp.ObjectId -RoleMemberType servicePrincipal
```

Your application now also has permissions to delete users or update passwords from your B2C tenant.

## Download, configure, and build the sample code
First, download the sample code and get it running. Then we will take a closer look at it.  You can [download the sample code as a .zip file](https://github.com/AzureADQuickStarts/B2C-GraphAPI-DotNet/archive/master.zip). You can also clone it into a directory of your choice:

```cmd
git clone https://github.com/AzureADQuickStarts/B2C-GraphAPI-DotNet.git
```

Open the `B2CGraphClient\B2CGraphClient.sln` Visual Studio solution in Visual Studio. In the `B2CGraphClient` project, open the file `App.config`. Replace the three app settings with your own values:

```xml
<appSettings>
    <add key="b2c:Tenant" value="{Your Tenant Name}" />
    <add key="b2c:ClientId" value="{The ApplicationID from above}" />
    <add key="b2c:ClientSecret" value="{The Key from above}" />
</appSettings>
```

[!INCLUDE [active-directory-b2c-devquickstarts-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)]

Next, right-click on the `B2CGraphClient` solution and rebuild the sample. If you are successful, you should now have a `B2C.exe` executable file located in `B2CGraphClient\bin\Debug`.

## Build user CRUD operations by using the Graph API
To use the B2CGraphClient, open a `cmd` Windows command prompt and change your directory to the `Debug` directory. Then run the `B2C Help` command.

```cmd
cd B2CGraphClient\bin\Debug
B2C Help
```

This will display a brief description of each command. Each time you invoke one of these commands, `B2CGraphClient` makes a request to the Azure AD Graph API.

### Get an access token
Any request to the Graph API requires an access token for authentication. `B2CGraphClient` uses the open-source Active Directory Authentication Library (ADAL) to help acquire access tokens. ADAL makes token acquisition easier by providing a simple API and taking care of some important details, such as caching access tokens. You don't have to use ADAL to get tokens, though. You can also get tokens by crafting HTTP requests.

> [!NOTE]
> This code sample uses ADAL v2 in order to communicate with the Graph API.  You must use ADAL v2 or v3 in order to get access tokens which can be used with the Azure AD Graph API.
> 
> 

When `B2CGraphClient` runs, it creates an instance of the `B2CGraphClient` class. The constructor for this class sets up an ADAL authentication scaffolding:

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

We'll use the `B2C Get-User` command as an example. When `B2C Get-User` is invoked without any additional inputs, the CLI calls the `B2CGraphClient.GetAllUsers(...)` method. This method calls `B2CGraphClient.SendGraphGetRequest(...)`, which submits an HTTP GET request to the Graph API. Before `B2CGraphClient.SendGraphGetRequest(...)` sends the GET request, it first gets an access token by using ADAL:

```csharp
public async Task<string> SendGraphGetRequest(string api, string query)
{
    // First, use ADAL to acquire a token by using the app's identity (the credential)
    // The first parameter is the resource we want an access_token for; in this case, the Graph API.
    AuthenticationResult result = authContext.AcquireToken("https://graph.windows.net", credential);

    ...

```

You can get an access token for the Graph API by calling the ADAL `AuthenticationContext.AcquireToken(...)` method. ADAL then returns an `access_token` that represents the application's identity.

### Read users
When you want to get a list of users or get a particular user from the Graph API, you can send an HTTP `GET` request to the `/users` endpoint. A request for all of the users in a tenant looks like this:

```
GET https://graph.windows.net/contosob2c.onmicrosoft.com/users?api-version=1.6
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
```

To see this request, run:

 ```cmd
 B2C Get-User
 ```

There are two important things to note:

* The access token acquired via ADAL is added to the `Authorization` header by using the `Bearer` scheme.
* For B2C tenants, you must use the query parameter `api-version=1.6`.

Both of these details are handled in the `B2CGraphClient.SendGraphGetRequest(...)` method:

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
When you create user accounts in your B2C tenant, you can send an HTTP `POST` request to the `/users` endpoint:

```
POST https://graph.windows.net/contosob2c.onmicrosoft.com/users?api-version=1.6
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
Content-Type: application/json
Content-Length: 338

{
    // All of these properties are required to create consumer users.

    "accountEnabled": true,
    "signInNames": [                            // controls which identifier the user uses to sign in to the account
        {
            "type": "emailAddress",             // can be 'emailAddress' or 'userName'
            "value": "joeconsumer@gmail.com"
        }
    ],
    "creationType": "LocalAccount",            // always set to 'LocalAccount'
    "displayName": "Joe Consumer",                // a value that can be used for displaying to the end user
    "mailNickname": "joec",                        // an email alias for the user
    "passwordProfile": {
        "password": "P@ssword!",
        "forceChangePasswordNextLogin": false   // always set to false
    },
    "passwordPolicies": "DisablePasswordExpiration"
}
```

Most of these properties in this request are required to create consumer users. To learn more, click [here](/previous-versions/azure/ad/graph/api/users-operations#CreateLocalAccountUser). Note that the `//` comments have been included for illustration. Do not include them in an actual request.

To see the request, run one of the following commands:

```cmd
B2C Create-User ..\..\..\usertemplate-email.json
B2C Create-User ..\..\..\usertemplate-username.json
```

The `Create-User` command takes a .json file as an input parameter. This contains a JSON representation of a user object. There are two sample .json files in the sample code: `usertemplate-email.json` and `usertemplate-username.json`. You can modify these files to suit your needs. In addition to the required fields above, several optional fields that you can use are included in these files. Details on the optional fields can be found in the [Azure AD Graph API entity reference](/previous-versions/azure/ad/graph/api/entity-and-complex-type-reference#user-entity).

You can see how the POST request is constructed in `B2CGraphClient.SendGraphPostRequest(...)`.

* It attaches an access token to the `Authorization` header of the request.
* It sets `api-version=1.6`.
* It includes the JSON user object in the body of the request.

> [!NOTE]
> If the accounts that you want to migrate from an existing user store has lower password strength than the [strong password strength enforced by Azure AD B2C](/previous-versions/azure/jj943764(v=azure.100)), you can disable the strong password requirement using the `DisableStrongPassword` value in the `passwordPolicies` property. For instance, you can modify the create user request provided above as follows: `"passwordPolicies": "DisablePasswordExpiration, DisableStrongPassword"`.
> 
> 

### Update consumer user accounts
When you update user objects, the process is similar to the one you use to create user objects. But this process uses the HTTP `PATCH` method:

```
PATCH https://graph.windows.net/contosob2c.onmicrosoft.com/users/<user-object-id>?api-version=1.6
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
Content-Type: application/json
Content-Length: 37

{
    "displayName": "Joe Consumer"                // this request updates only the user's displayName
}
```

Try to update a user by updating your JSON files with new data. You can then use `B2CGraphClient` to run one of these commands:

```cmd
B2C Update-User <user-object-id> ..\..\..\usertemplate-email.json
B2C Update-User <user-object-id> ..\..\..\usertemplate-username.json
```

Inspect the `B2CGraphClient.SendGraphPatchRequest(...)` method for details on how to send this request.

### Search users
You can search for users in your B2C tenant in a couple of ways. One, using the user's object ID or two, using the user's sign-in identifer (i.e., the `signInNames` property).

Run one of the following commands to search for a specific user:

```cmd
B2C Get-User <user-object-id>
B2C Get-User <filter-query-expression>
```

Here are a couple of examples:

```cmd
B2C Get-User 2bcf1067-90b6-4253-9991-7f16449c2d91
B2C Get-User $filter=signInNames/any(x:x/value%20eq%20%27joeconsumer@gmail.com%27)
```

### Delete users
The process for deleting a user is straightforward. Use the HTTP `DELETE` method and construct the URL with the correct object ID:

```
DELETE https://graph.windows.net/contosob2c.onmicrosoft.com/users/<user-object-id>?api-version=1.6
Authorization: Bearer eyJhbGciOiJSUzI1NiIsIng1dCI6IjdkRC1nZWNOZ1gxWmY3R0xrT3ZwT0IyZGNWQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJod...
```

To see an example, enter this command and view the delete request that is printed to the console:

```cmd
B2C Delete-User <object-id-of-user>
```

Inspect the `B2CGraphClient.SendGraphDeleteRequest(...)` method for details on how to send this request.

You can perform many other actions with the Azure AD Graph API in addition to user management. The
[Azure AD Graph API reference](/previous-versions/azure/ad/graph/api/api-catalog) provides details on each action, along with sample requests.

## Use custom attributes
Most consumer applications need to store some type of custom user profile information. One way you can do this is to define a custom attribute in your B2C tenant. You can then treat that attribute the same way you treat any other property on a user object. You can update the attribute, delete the attribute, query by the attribute, send the attribute as a claim in sign-in tokens, and more.

To define a custom attribute in your B2C tenant, see the [B2C custom attribute reference](active-directory-b2c-reference-custom-attr.md).

You can view the custom attributes defined in your B2C tenant by using `B2CGraphClient`:

```cmd
B2C Get-B2C-Application
B2C Get-Extension-Attribute <object-id-in-the-output-of-the-above-command>
```

The output of these functions reveals the details of each custom attribute, such as:

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

You can use the full name, such as `extension_55dc0861f9a44eb999e0a8a872204adb_Jersey_Number`, as a property on your user objects.  Update your .json file with the new property and a value for the property, and then run:

```cmd
B2C Update-User <object-id-of-user> <path-to-json-file>
```

By using `B2CGraphClient`, you have a service application that can manage your B2C tenant users programmatically. `B2CGraphClient` uses its own application identity to authenticate to the Azure AD Graph API. It also acquires tokens by using a client secret. As you incorporate this functionality into your application, remember a few key points for B2C apps:

* You need to grant the application the proper permissions in the tenant.
* For now, you need to use ADAL (not MSAL) to get access tokens. (You can also send protocol messages directly, without using a library.)
* When you call the Graph API, use `api-version=1.6`.
* When you create and update consumer users, a few properties are required, as described above.

If you have any questions or requests for actions you would like to perform by using the Graph API on your B2C tenant, leave a comment on this article or file an issue in the GitHub code sample repository.

