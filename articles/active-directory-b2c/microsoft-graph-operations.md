---
title: Manage resources with Microsoft Graph
titleSuffix: Azure AD B2C
description: How to manage resources in an Azure AD B2C tenant by calling the Microsoft Graph API and using an application identity to automate the process.
services: B2C
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 04/19/2021
ms.custom: project-no-code
ms.author: mimart
ms.subservice: B2C
---
# Manage Azure AD B2C with Microsoft Graph

Microsoft Graph allows you to manage resources in your Azure AD B2C directory. The following Microsoft Graph API operations are supported for the management of Azure AD B2C resources, including users, identity providers, user flows, custom policies, and policy keys. Each link in the following sections targets the corresponding page within the Microsoft Graph API reference for that operation. 

## Prerequisites

To use MS Graph API, and interact with resources in your Azure AD B2C tenant, you need an application registration that grants the permissions to do so. Follow the steps in the [Manage Azure AD B2C with Microsoft Graph](microsoft-graph-get-started.md) article to create an application registration that your management application can use. 

## User management

- [List users](/graph/api/user-list)
- [Create a consumer user](/graph/api/user-post-users)
- [Get a user](/graph/api/user-get)
- [Update a user](/graph/api/user-update)
- [Delete a user](/graph/api/user-delete)

## User phone number management (beta)

A phone number that can be used by a user to sign-in using [SMS or voice calls](identity-provider-local.md#phone-sign-in-preview), or [multi-factor authentication](multi-factor-authentication.md). For more information, see [Azure AD authentication methods API](/graph/api/resources/phoneauthenticationmethod).

- [Add](/graph/api/authentication-post-phonemethods)
- [List](/graph/api/authentication-list-phonemethods)
- [Get](/graph/api/phoneauthenticationmethod-get)
- [Update](/graph/api/phoneauthenticationmethod-update)
- [Delete](/graph/api/phoneauthenticationmethod-delete)

Note, the [list](/graph/api/authentication-list-phonemethods) operation returns  only enabled phone numbers. The following phone number should be enabled to use with the list operations. 

![Enable phone sign-in](./media/microsoft-graph-operations/enable-phone-sign-in.png)

> [!NOTE]
> In the current beta version, this API works only if the phone number is stored with a space between the country code and the phone number. The Azure AD B2C service doesn't currently add this space by default.

## Self-service password reset email address (beta)

An email address that can be used by a [username sign-in account](identity-provider-local.md#username-sign-in) to reset the password. For more information, see [Azure AD authentication methods API](/graph/api/resources/emailauthenticationmethod).

- [Add](/graph/api/emailauthenticationmethod-post)
- [List](/graph/api/emailauthenticationmethod-list)
- [Get](/graph/api/emailauthenticationmethod-get)
- [Update](/graph/api/emailauthenticationmethod-update)
- [Delete](/graph/api/emailauthenticationmethod-delete)

## Identity providers

Manage the [identity providers](add-identity-provider.md) available to your user flows in your Azure AD B2C tenant.

- [List identity providers registered in the Azure AD B2C tenant](/graph/api/identityprovider-list)
- [Create an identity provider](/graph/api/identityprovider-post-identityproviders)
- [Get an identity provider](/graph/api/identityprovider-get)
- [Update identity provider](/graph/api/identityprovider-update)
- [Delete an identity provider](/graph/api/identityprovider-delete)

## User flow

Configure pre-built policies for sign-up, sign-in, combined sign-up and sign-in, password reset, and profile update.

- [List user flows](/graph/api/identitycontainer-list-b2cuserflows)
- [Create a user flow](/graph/api/identitycontainer-post-b2cuserflows)
- [Get a user flow](/graph/api/b2cidentityuserflow-get)
- [Delete a user flow](/graph/api/b2cidentityuserflow-delete)

## User flow authentication methods (beta)

Choose a mechanism for letting users register via local accounts. Local accounts are the accounts where Azure AD does the identity assertion. For more information, see [b2cAuthenticationMethodsPolicy resource type](/graph/api/resources/b2cauthenticationmethodspolicy).

- [Get](/graph/api/b2cauthenticationmethodspolicy-get)
- [Update](/graph/api/b2cauthenticationmethodspolicy-update)

## Custom policies

The following operations allow you to manage your Azure AD B2C Trust Framework policies, known as [custom policies](custom-policy-overview.md).

- [List all trust framework policies configured in a tenant](/graph/api/trustframework-list-trustframeworkpolicies)
- [Create trust framework policy](/graph/api/trustframework-post-trustframeworkpolicy)
- [Read properties of an existing trust framework policy](/graph/api/trustframeworkpolicy-get)
- [Update or create trust framework policy.](/graph/api/trustframework-put-trustframeworkpolicy)
- [Delete an existing trust framework policy](/graph/api/trustframeworkpolicy-delete)

## Policy keys

The Identity Experience Framework stores the secrets referenced in a custom policy to establish trust between components. These secrets can be symmetric or asymmetric keys/values. In the Azure portal, these entities are shown as **Policy keys**.

The top-level resource for policy keys in the Microsoft Graph API is the [Trusted Framework Keyset](/graph/api/resources/trustframeworkkeyset). Each **Keyset** contains at least one **Key**. To create a key, first create an empty keyset, and then generate a key in the keyset. You can create a manual secret, upload a certificate, or a PKCS12 key. The key can be a generated secret, a string (such as the Facebook application secret), or a certificate you upload. If a keyset has multiple keys, only one of the keys is active.

### Trust Framework policy keyset

- [List the trust framework keysets](/graph/api/trustframework-list-keysets)
- [Create a trust framework keysets](/graph/api/trustframework-post-keysets)
- [Get a keyset](/graph/api/trustframeworkkeyset-get)
- [Update a trust framework keysets](/graph/api/trustframeworkkeyset-update)
- [Delete a trust framework keysets](/graph/api/trustframeworkkeyset-delete)

### Trust Framework policy key

- [Get currently active key in the keyset](/graph/api/trustframeworkkeyset-getactivekey)
- [Generate a key in keyset](/graph/api/trustframeworkkeyset-generatekey)
- [Upload a string based secret](/graph/api/trustframeworkkeyset-uploadsecret)
- [Upload a X.509 certificate](/graph/api/trustframeworkkeyset-uploadcertificate)
- [Upload a PKCS12 format certificate](/graph/api/trustframeworkkeyset-uploadpkcs12)

## Applications

- [List applications](/graph/api/application-list)
- [Create an application](/graph/api/resources/application)
- [Update application](/graph/api/application-update)
- [Create servicePrincipal](/graph/api/resources/serviceprincipal)
- [Create oauth2Permission Grant](/graph/api/resources/oauth2permissiongrant)
- [Delete application](/graph/api/application-delete)

## Application extension properties

- [List extension properties](/graph/api/application-list-extensionproperty)

Azure AD B2C provides a directory that can hold 100 custom attributes per user. For user flows, these extension properties are [managed by using the Azure portal](user-flow-custom-attributes.md). For custom policies, Azure AD B2C creates the property for you, the first time the policy writes a value to the extension property.

## Audit logs

- [List audit logs](/graph/api/directoryaudit-list)

For more information about accessing Azure AD B2C audit logs, see [Accessing Azure AD B2C audit logs](view-audit-logs.md).

## Conditional Access

- [List all of the Conditional Access policies](/graph/api/conditionalaccessroot-list-policies?tabs=http)
- [Read properties and relationships of a Conditional Access policy](/graph/api/conditionalaccesspolicy-get)
- [Create a new Conditional Access policy](/graph/api/resources/application)
- [Update a Conditional Access policy](/graph/api/conditionalaccesspolicy-update)
- [Delete a Conditional Access policy](/graph/api/conditionalaccesspolicy-delete)

## Code sample: How to programmatically manage user accounts

This code sample is a .NET Core console application that uses the [Microsoft Graph SDK](/graph/sdks/sdks-overview) to interact with Microsoft Graph API. Its code demonstrates how to call the API to programmatically manage users in an Azure AD B2C tenant.
You can [download the sample archive](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management/archive/master.zip) (*.zip), [browse the repository](https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management) on GitHub, or clone the repository:

```cmd
git clone https://github.com/Azure-Samples/ms-identity-dotnetcore-b2c-account-management.git
```

After you've obtained the code sample, configure it for your environment and then build the project:

1. Open the project in [Visual Studio](https://visualstudio.microsoft.com) or [Visual Studio Code](https://code.visualstudio.com).
1. Open `src/appsettings.json`.
1. In the `appSettings` section, replace `your-b2c-tenant` with the name of your tenant, and `Application (client) ID` and `Client secret` with the values for your management application registration. For more information, see [Register a Microsoft Graph Application](microsoft-graph-get-started.md).
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

<!-- LINK -->

[graph-objectIdentity]: /graph/api/resources/objectidentity
[graph-user]: (https://docs.microsoft.com/graph/api/resources/user)
