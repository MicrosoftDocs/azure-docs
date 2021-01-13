---
title: Manage users with the Microsoft Graph API
titleSuffix: Azure AD B2C
description: How to manage users in an Azure AD B2C tenant by calling the Microsoft Graph API and using an application identity to automate the process.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 01/13/2021
ms.custom: project-no-code
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

The following user management operations are available in the [Microsoft Graph API](/graph/api/resources/user):

- [Get a list of users](/graph/api/user-list)
- [Create a user](/graph/api/user-post-users)
- [Get a user](/graph/api/user-get)
- [Update a user](/graph/api/user-update)
- [Delete a user](/graph/api/user-delete)


## Code sample: How to programmatically manage user accounts

This code sample is a .NET Core console application that uses the [Microsoft Graph SDK](/graph/sdks/sdks-overview) to interact with Microsoft Graph API. Its code demonstrates how to call the API to programmatically manage users in an Azure AD B2C tenant.
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
    dotnet bin/Debug/netcoreapp3.1/b2c-ms-graph.dll
    ```

The application displays a list of commands you can execute. For example, get all users, get a single user, delete a user, update a user's password, and bulk import.

### Code discussion

The sample code uses the [Microsoft Graph SDK](/graph/sdks/sdks-overview), which is designed to simplify building high-quality, efficient, and resilient applications that access Microsoft Graph.

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

[Make API calls using the Microsoft Graph SDKs](/graph/sdks/create-requests) includes information on how to read and write information from Microsoft Graph, use `$select` to control the properties returned, provide custom query parameters, and use the `$filter` and `$orderBy` query parameters.

## Next steps

For a full index of the Microsoft Graph API operations supported for Azure AD B2C resources, see [Microsoft Graph operations available for Azure AD B2C](microsoft-graph-operations.md).

<!-- LINK -->

[graph-objectIdentity]: /graph/api/resources/objectidentity
[graph-user]: (https://docs.microsoft.com/graph/api/resources/user)
