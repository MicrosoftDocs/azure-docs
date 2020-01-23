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
#Customer intent: As an application developer, I want to know how to write a protected web API using the Microsoft identity platform for developers.
---

# Protected web API: App registration

This article explains the specifics of app registration for a protected web API.

See [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md) for the common steps for registering an app.

## Accepted token version

The Microsoft identity platform endpoint can issue two types of tokens: v1.0 tokens and v2.0 tokens. For more information about these tokens, see [Access tokens](access-tokens.md). The accepted token version depends on the **Supported account types** you chose when you created your application:

- If the value of **Supported account types** is **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**, the accepted token version will be v2.0.
- Otherwise, the accepted token version will be v1.0.

After you create the application, you can determine or change the accepted token version by following these steps:

1. In the Azure portal, select your app and then select the **Manifest** for your app.
2. In the manifest, search for **"accessTokenAcceptedVersion"**. Note that its value is **2**. This property specifies to Azure Active Directory (Azure AD) that the web API accepts v2.0 tokens. If the value is **null**, the accepted token version is v1.0.
3. If you've changed the token version, select **Save**.

> [!NOTE]
> The web API specifies which token version (v1.0 or v2.0) it accepts. When clients request a token for your web API from the Microsoft identity platform (v2.0) endpoint, they'll get a token that indicates which version is accepted by the web API.

## No redirect URI

Web APIs don't need to register a redirect URI because no user is signed in interactively.

## Expose an API

Another setting specific to web APIs is the exposed API and the exposed scopes.

### Resource URI and scopes

Scopes are usually in the form `resourceURI/scopeName`. For Microsoft Graph, the scopes have shortcuts like `User.Read`. This string is a shortcut for `https://graph.microsoft.com/user.read`.

During app registration, you'll need to define these parameters:

- The resource URI. By default, the application registration portal recommends that you to use `api://{clientId}`. This resource URI is unique, but it's not human readable. You can change it, but make sure the new value is unique.
- One or more *scopes*. (To client applications, they'll show up as *delegated permissions* for your web API.)
- One or more *app roles*. (To client applications, they'll show up as *application permissions* for your web API.)

The scopes are also displayed on the consent screen that's presented to end users of your app. So you'll need to provide the corresponding strings that describe the scope:

- As seen by the end user.
- As seen by the tenant admin, who can grant admin consent.

### Exposing delegated permissions (scopes)

1. Select the **Expose an API** section in the application registration.
1. Select **Add a scope**.
1. If prompted, accept the proposed Application ID URI (`api://{clientId}`) by selecting **Save and Continue**.
1. Enter these parameters:
      - For **Scope name**, use **access_as_user**.
      - For **Who can consent**, make sure **Admins and users** is selected.
      - In **Admin consent display name**, enter **Access TodoListService as a user**.
      - In **Admin consent description**, enter **Accesses the TodoListService Web API as a user**.
      - In **User consent display name**, enter **Access TodoListService as a user**.
      - In **User consent description**, enter **Accesses the TodoListService Web API as a user**.
      - Keep **State** set to **Enabled**.
      - Select **Add scope**.

### If your web API is called by a daemon app

In this section, you'll learn how to register your protected web API so it can be securely called by daemon apps.

- You'll need to expose *application permissions*. You'll declare only application permissions because daemon apps don't interact with users, so delegated permissions wouldn't make sense.
- Tenant admins can require Azure Active Directory (Azure AD) to issue tokens for your web API only to applications that have registered to access one of the web API's application permissions.

#### Exposing application permissions (app roles)

To expose application permissions, you'll need to edit the manifest.

1. In the application registration for your application, select **Manifest**.
1. Edit the manifest by locating the `appRoles` setting and adding one or more application roles. The role definition is provided in the following sample JSON block. Leave the `allowedMemberTypes` set to `"Application"` only. Make sure the `id` is a unique GUID and that `displayName` and `value` don't contain spaces.
1. Save the manifest.

The following sample shows the contents of `appRoles`. (The `id` can be any unique GUID.)

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

The web API checks for the app role. (That's the developer way to expose application permissions.) But you can also configure Azure AD to issue a token for your web API only to apps that are approved by the tenant admin to access your API. To add this increased security:

1. On the app **Overview** page for your app registration, select the link with the name of your app under **Managed application in local directory**. The title for this field might be truncated. You might, for example, see **Managed application in ...**

   > [!NOTE]
   >
   > When you select this link, you'll go to the **Enterprise Application Overview** page associated with the service principal for your application in the tenant where you created it. You can navigate back to the app registration page by using the back button of your browser.

1. Select the **Properties** page in the **Manage** section of the Enterprise application pages.
1. If you want Azure AD to allow access to your web API from only certain clients, set **User assignment required?** to **Yes**.

   > [!IMPORTANT]
   >
   > If you set **User assignment required?** to **Yes**, Azure AD will check the app role assignments of clients when they request an access token for the web API. If the client isn't assigned to any app roles, Azure AD will return the error `invalid_client: AADSTS501051: Application <application name> is not assigned to a role for the <web API>`.
   >
   > If you keep **User assignment required?** set to **No**, *Azure AD won’t check the app role assignments when a client requests an access token for your web API*. Any daemon client (that is, any client using the client credentials flow) will be able to obtain an access token for the API just by specifying its audience. Any application will be able to access the API without having to request permissions for it. But your web API can always, as explained in the previous section, verify that the application has the right role (which is authorized by the tenant admin). The API performs this verification by validating that the access token has a roles claim and that the value for this claim is correct. (In our case, the value is `access_as_application`.)

1. Select **Save**.

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-protected-web-api-app-configuration.md)
