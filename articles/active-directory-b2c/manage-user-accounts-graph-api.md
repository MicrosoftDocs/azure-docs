---
title: Manage users with the Microsoft Graph API
titleSuffix: Azure AD B2C
description: How to manage users in an Azure AD B2C tenant by calling the Microsoft Graph API and using an application identity to automate the process.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 03/16/2020
ms.author: mimart
ms.subservice: B2C
---
# Manage Azure AD B2C user accounts with Microsoft Graph

Microsoft Graph allows you to manage user accounts in your Azure AD B2C directory by providing create, read, update, and delete methods in the Microsoft Graph API. You can migrate an existing user store to an Azure AD B2C tenant and perform other user account management operations by calling the Microsoft Graph API.

In the sections that follow, the key aspects of Azure AD B2C user management with the Microsoft Graph API are presented. The Microsoft Graph API operations, types, and properties presented here are a subset of that which appears in the Microsoft Graph API reference documentation.

## Register a management application

Before any user management application or script you write can interact with the resources in your Azure AD B2C tenant, you need an application registration that grants the permissions to do so.

Follow the steps in this how-to article to create an application registration that your management application can use:

[Manage Azure AD B2C with Microsoft Graph](microsoft-graph-get-started.md)

## User management Microsoft Graph operations

The following user management operations are available in the [Microsoft Graph API](https://docs.microsoft.com/graph/api/resources/user):

- [Get a list of users](https://docs.microsoft.com/graph/api/user-list)
- [Create a user](https://docs.microsoft.com/graph/api/user-post-users)
- [Get a user](https://docs.microsoft.com/graph/api/user-get)
- [Update a user](https://docs.microsoft.com/graph/api/user-update)
- [Delete a user](https://docs.microsoft.com/graph/api/user-delete)

## User properties

### Display name property

The `displayName` is the name to display in Azure portal user management for the user, and in the access token Azure AD B2C returns to the application. This property is required.

### Identities property

A customer account, which could be a consumer, partner, or citizen, can be associated with these identity types:

- **Local** identity - The username and password are stored locally in the Azure AD B2C directory. We often refer to these identities as "local accounts."
- **Federated** identity - Also known as a *social* or *enterprise* accounts, the identity of the user is managed by a federated identity provider like Facebook, Microsoft, ADFS, or Salesforce.

A user with a customer account can sign in with multiple identities. For example, username, email, employee ID, government ID, and others. A single account can have multiple identities, both local and social, with the same password.

In the Microsoft Graph API, both local and federated identities are stored in the user `identities` attribute, which is of type [objectIdentity][graph-objectIdentity]. The `identities` collection represents a set of identities used to sign in to a user account. This collection enables the user to sign in to the user account with any of its associated identities.

| Property   | Type |Description|
|:---------------|:--------|:----------|
|signInType|string| Specifies the user sign-in types in your directory. For local account:  `emailAddress`, `emailAddress1`, `emailAddress2`, `emailAddress3`,  `userName`, or any other type you like. Social account must be set to  `federated`.|
|issuer|string|Specifies the issuer of the identity. For local accounts (where **signInType** is not `federated`), this property is the local B2C tenant default domain name, for example `contoso.onmicrosoft.com`. For social identity (where **signInType** is  `federated`) the value is the name of the issuer, for example `facebook.com`|
|issuerAssignedId|string|Specifies the unique identifier assigned to the user by the issuer. The combination of **issuer** and **issuerAssignedId** must be unique within your tenant. For local account, when **signInType** is set to `emailAddress` or `userName`, it represents the sign-in name for the user.<br>When **signInType** is set to: <ul><li>`emailAddress` (or starts with `emailAddress` like `emailAddress1`) **issuerAssignedId** must be a valid email address</li><li>`userName` (or any other value), **issuerAssignedId** must be a valid [local part of an email address](https://tools.ietf.org/html/rfc3696#section-3)</li><li>`federated`, **issuerAssignedId** represents the federated account unique identifier</li></ul>|

The following **Identities** property, with a local account identity with a sign-in name, an email address as sign-in, and with a social identity. 

 ```JSON
 "identities": [
     {
       "signInType": "userName",
       "issuer": "contoso.onmicrosoft.com",
       "issuerAssignedId": "johnsmith"
     },
     {
       "signInType": "emailAddress",
       "issuer": "contoso.onmicrosoft.com",
       "issuerAssignedId": "jsmith@yahoo.com"
     },
     {
       "signInType": "federated",
       "issuer": "facebook.com",
       "issuerAssignedId": "5eecb0cd"
     }
   ]
 ```

For federated identities, depending on the identity provider, the **issuerAssignedId** is a unique value for a given user per application or development account. Configure the Azure AD B2C policy with the same application ID that was previously assigned by the social provider or another application within the same development account.

### Password profile property

For a local identity, the **passwordProfile** property is required, and contains the user's password. The `forceChangePasswordNextSignIn` property must set to `false`.

For a federated (social) identity, the **passwordProfile** property is not required.

```JSON
"passwordProfile" : {
    "password": "password-value",
    "forceChangePasswordNextSignIn": false
  }
```

### Password policy property

The Azure AD B2C password policy (for local accounts) is based on the Azure Active Directory [strong password strength](../active-directory/authentication/concept-sspr-policy.md) policy. The Azure AD B2C sign-up or sign-in and password reset policies require this strong password strength, and don't expire passwords.

In user migration scenarios, if the accounts you want to migrate have weaker password strength than the [strong password strength](../active-directory/authentication/concept-sspr-policy.md) enforced by Azure AD B2C, you can disable the strong password requirement. To change the default password policy, set the `passwordPolicies` property to `DisableStrongPassword`. For example, you can modify the create user request as follows:

```JSON
"passwordPolicies": "DisablePasswordExpiration, DisableStrongPassword"
```

### Extension properties

Every customer-facing application has unique requirements for the information to be collected. Your Azure AD B2C tenant comes with a built-in set of information stored in properties, such as Given Name, Surname, City, and Postal Code. With Azure AD B2C, you can extend the set of properties stored in each customer account. For more information on defining custom attributes, see [custom attributes (user flows)](user-flow-custom-attributes.md) and [custom attributes (custom policies)](custom-policy-custom-attributes.md).

Microsoft Graph API supports creating and updating a user with extension attributes. Extension attributes in the Graph API are named by using the convention `extension_ApplicationObjectID_attributename`. For example:

```JSON
"extension_831374b3bd5041bfaa54263ec9e050fc_loyaltyNumber": "212342"
```

## Code sample

This code sample is a .NET Core console application that uses the [Microsoft Graph SDK](https://docs.microsoft.com/graph/sdks/sdks-overview) to interact with Microsoft Graph API. Its code demonstrates how to call the API to programmatically manage users in an Azure AD B2C tenant.
You can [download the sample archive](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management/archive/master.zip) (*.zip), [browse the repository](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management) on GitHub, or clone the repository:

```cmd
git clone https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management.git
```

After you've obtained the code sample, configure it for your environment and then build the project:

1. Open the project in [Visual Studio](https://visualstudio.microsoft.com) or [Visual Studio Code](https://code.visualstudio.com).
1. Open `src/appsettings.json`.
1. In the `appSettings` section, replace `your-b2c-tenant` with the name of your tenant, and `Application (client) ID` and `Client secret` with the values for your management application registration (see the [Register a management application](#register-a-management-application) section of this article).
1. Open a console window within your local clone of the repo, switch into the `src` directory, then build the project:
    ```console
    cd src
    dotnet build
    ```
1. Run the application with the `dotnet` command:

    ```console
    dotnet bin/Debug/netcoreapp3.0/b2c-ms-graph.dll
    ```

The application displays a list of commands you can execute. For example, get all users, get a single user, delete a user, update a user's password, and bulk import.

### Code discussion

The sample code uses the [Microsoft Graph SDK](https://docs.microsoft.com/graph/sdks/sdks-overview), which is designed to simplify building high-quality, efficient, and resilient applications that access Microsoft Graph.

Any request to the Microsoft Graph API requires an access token for authentication. The solution makes use of the [Microsoft.Graph.Auth](https://www.nuget.org/packages/Microsoft.Graph.Auth/) NuGet package that provides an authentication scenario-based wrapper of the Microsoft Authentication Library (MSAL) for use with the Microsoft Graph SDK.

The `RunAsync` method in the _Program.cs_ file:

1. Reads application settings from the _appsettings.json_ file
1. Initializes the auth provider using [OAuth 2.0 client credentials grant](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md) flow. With the client credentials grant flow, the app is able to get an access token to call the Microsoft Graph API.
1. Sets up the Microsoft Graph service client with the auth provider:

    ```csharp
    // Read application settings from appsettings.json (tenant ID, app ID, client secret, etc.)
    AppSettings config = AppSettingsFile.ReadFromJsonFile();

    // Initialize the client credential auth provider
    IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
        .Create(config.AppId)
        .WithTenantId(config.TenantId)
        .WithClientSecret(config.ClientSecret)
        .Build();
    ClientCredentialProvider authProvider = new ClientCredentialProvider(confidentialClientApplication);

    // Set up the Microsoft Graph service client with client credentials
    GraphServiceClient graphClient = new GraphServiceClient(authProvider);
    ```

The initialized *GraphServiceClient* is then used in _UserService.cs_ to perform the user management operations. For example, getting a list of the user accounts in the tenant:

```csharp
public static async Task ListUsers(GraphServiceClient graphClient)
{
    Console.WriteLine("Getting list of users...");

    // Get all users (one page)
    var result = await graphClient.Users
        .Request()
        .Select(e => new
        {
            e.DisplayName,
            e.Id,
            e.Identities
        })
        .GetAsync();

    foreach (var user in result.CurrentPage)
    {
        Console.WriteLine(JsonConvert.SerializeObject(user));
    }
}
```

[Make API calls using the Microsoft Graph SDKs](https://docs.microsoft.com/graph/sdks/create-requests) includes information on how to read and write information from Microsoft Graph, use `$select` to control the properties returned, provide custom query parameters, and use the `$filter` and `$orderBy` query parameters.

## Next steps

For a full index of the Microsoft Graph API operations supported for Azure AD B2C resources, see [Microsoft Graph operations available for Azure AD B2C](microsoft-graph-operations.md).

<!-- LINK -->

[graph-objectIdentity]: https://docs.microsoft.com/graph/api/resources/objectidentity
[graph-user]: (https://docs.microsoft.com/graph/api/resources/user)
