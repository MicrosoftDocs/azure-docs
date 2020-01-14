---
title: Protected web API app registration | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a protected web API and the information you need to register the app.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As a software developer, I want to know how to write a protected web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected web API: App registration

This article explains the specifics of app registration for a protected web API.

See [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md) for the common steps to register an app.

## Accepted token version

The Microsoft identity platform endpoint can issue v1.0 tokens and v2.0 tokens. For more information about these tokens, see [Access tokens](access-tokens.md).

The accepted token version depends on the **Supported account types** value you choose when you create your application.

- If the value of **Supported account types** includes accounts in any organizational directory or personal Microsoft accounts like Skype, Xbox, or Outlook.com, the accepted token version is v2.0.
- Otherwise, the accepted token version is v1.0.

After you create the application, you can determine or change the accepted token version by following these steps:

1. In the Azure portal, select your app and then select the **Manifest** value for your app.
1. Find the property **accessTokenAcceptedVersion** in the manifest.
1. The property value specifies to Azure Active Directory (Azure AD) which token version the web API accepts.
    - If the property value is 2, the web API accepts v2.0 tokens.
    - If the property value is **null**, the web API accepts v1.0 tokens.
1. If you changed the property value, select **Save**.

> [!NOTE]
> The web API specifies which token version it accepts. When a client requests a token for your web API from the Microsoft identity platform (v2.0) endpoint, the client gets a token that indicates which token version the web API accepts.

## No redirect URI

Web APIs don't need to register a redirect URI because no user is signed in interactively.

## Expose an API

Other settings specific to web APIs are the exposed API and the exposed scopes.

### Resource URI and scopes

Scopes usually have the form `resourceURI/scopeName`. For Microsoft Graph, the scopes have shortcuts. For example, User.Read is a shortcut for https://graph.microsoft.com/user.read.

During app registration, you need to define these parameters:

- The resource URI
- One or more app roles
- One or more scopes

By default, the application registration portal recommends a URI of the form `api://{clientId}`. This resource URI is unique but not human readable. If you change the URI, make sure the new value is unique.

To client applications, app roles show up as *application permissions* and scopes show up as *delegated permissions* for your web API.

Scopes also appear on the consent screen that's presented to users of your app. So you need to provide the corresponding strings that describe the scope:

- As seen by a user.
- As seen by the tenant admin, who can grant admin consent.

### Exposing delegated permissions (scopes)

1. Select the **Expose an API** section in the application registration.
1. Select **Add a scope**.
1. If prompted, accept the proposed application ID URI (`api://{clientId}`) by selecting **Save and Continue**.
1. Specify these values:
      - Select **Scope name** and select **access_as_user**.
      - Select **Who can consent** and make sure **Admins and users** is selected.
      - Select **Admin consent display name** and enter **Access TodoListService as a user**.
      - Select **Admin consent description** and enter **Accesses the TodoListService Web API as a user**.
      - Select **User consent display name** and enter **Access TodoListService as a user**.
      - Select **User consent description** and enter **Accesses the TodoListService Web API as a user**.
      - Keep the **State** value set to **Enabled**.
 1. Select **Add scope**.

### If your web API is called by a daemon app

In this section, you learn how to register your protected web API so it can be securely called by daemon apps.

You need to expose *application permissions*. You declare only application permissions because daemon apps don't interact with users. Delegated permissions wouldn't make sense.

Tenant admins can require Azure AD to issue web API tokens only to applications that have registered to access one of the web API's application permissions.

#### Exposing application permissions (app roles)

To expose application permissions, you need to edit the manifest.

1. In the application registration for your application, select **Manifest**.
1. Edit the manifest by locating the `appRoles` setting and adding one or more application roles. The role definition is provided in the following sample JSON block. 
1. Leave `allowedMemberTypes` set to `"Application"` only. Make sure `id` is a unique GUID and that `displayName` and `value` don't contain spaces.
1. Save the manifest.

The following sample shows the contents of `appRoles`. (The value of `id` can be any unique GUID.)

```JSon
"appRoles": [
	{
	"allowedMemberTypes": [ "Application" ],
	"description": "Accesses the TodoListService-Cert as an application.",
	"displayName": "access_as_application",
	"id": "ccf784a6-fd0c-45f2-9c08-2f9d162a0628",
	"isEnabled": true,
	"lang": null,
	"origin": "Application",
	"value": "access_as_application"
	}
],
```

#### Ensuring that Azure AD issues tokens for your web API to only allowed clients

The web API checks for the app role, which is a software developer's way to expose application permissions. You can also configure Azure AD to issue tokens for your web API only to apps that the tenant admin approves for API access.

To add this increased security:

1. On the app Overview page for your app registration, select the link with the name of your app under **Managed application in local directory**. The name of this selection might be truncated. For example, you might see **Managed application in ...**

   > [!NOTE]
   >
   > When you select this link, you go to the Enterprise Application Overview page associated with the service principal for your application in the tenant where you created it. You can go to the app registration page by using the back button of your browser.

1. Select the **Properties** page in the **Manage** section of the Enterprise application pages.
1. If you want Azure AD to allow access to your web API from only certain clients, set **User assignment required?** to **Yes**.

   > [!IMPORTANT]
   >
   > If you set **User assignment required?** to **Yes**, Azure AD checks the app role assignments of clients when they request a web API access token. If the client isn't assigned to any app roles, Azure AD will return the error message "invalid_client: AADSTS501051: Application \<application name\> is not assigned to a role for the \<web API\>".
   >
   > If you keep **User assignment required?** set to **No**, Azure AD won’t check the app role assignments when a client requests an access token for your web API. Any daemon client, meaning any client using the client credentials flow, can get an access token for the API just by specifying its audience. Any application can access the API without having to request permissions for it.
   >
   > But as explained in the previous section, your web API can always verify that the application has the right role, which is authorized by the tenant admin. The API performs this verification by validating that the access token has a roles claim and that the value for this claim is correct. In the previous JSON sample, the value is `access_as_application`.

1. Select **Save**.

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-protected-web-api-app-configuration.md)
