---
title: Protected web API - app registration | Azure
description: Learn how to build a protected Web API and the information you need to register the app.
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
#Customer intent: As an application developer, I want to know how to write a protected Web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected web API - app registration

This article explains the app registration specifics for a protected web API.

See [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md) for the common steps on how to register the application.

## Accepted token version

The Microsoft identity platform endpoint can issue two types of tokens: v1.0 tokens and v2.0 tokens. You can learn more about these tokens in [Access tokens](access-tokens.md). The accepted token version depends on the **Supported account types** you chose when you created your application:

- If the value of **Supported account types** is **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**, the accepted token version will be v2.0.
- Otherwise, the accepted token version will be v1.0.

Once you've created the application, you can change the accepted token version by following these steps:

1. In the Azure portal, select your app and then select the **Manifest** for your app.
2. In the manifest, search for **"accessTokenAcceptedVersion"**, and see that its value is **2**. This property lets Azure AD know that the web API accepts v2.0 tokens. If it's **null**, the accepted token version will be v1.0.
3. Select **Save**.

> [!NOTE]
> It's up to the web API to decide which token version (v1.0 or v2.0) it accepts. When clients request a token for your web API using the Microsoft identity platform v2.0 endpoint, they'll get a token that indicates which version is accepted by the web API.

## No redirect URI

Web APIs don't need to register a redirect URI as no user is signed-in interactively.

## Expose an API

Another setting specific to web APIs is the exposed API and the exposed scopes.

### Resource URI and scopes

Scopes are usually of the form `resourceURI/scopeName`. For Microsoft Graph, the scopes have shortcuts like `User.Read`, but this string is just a shortcut for `https://graph.microsoft.com/user.read`.

During app registration, you'll need to define the following parameters:

- The resource URI - By default the application registration portal recommends that you to use `api://{clientId}`. This resource URI is unique, but it's not human readable. You can change it, but make sure that it's unique.
- One or more **scopes** (to client applications, they will show up as **delegated permissions** for your Web API)
- One or more **app roles** (to client applications, they will show up as **application permissions** for your Web API)

The scopes are also displayed on the consent screen that's presented to end users who use your application. Therefore, you'll need to provide the corresponding strings that describe the scope:

- As seen by the end user
- As seen by the tenant admin, who can grant admin consent

### How to expose delegated permissions (scopes)

1. Select the **Expose an API** section in the application registration, and:
   1. Select **Add a scope**.
   1. If requested, accept the proposed Application ID URI (api://{clientId}) by selecting **Save and Continue**.
   1. Enter the following parameters:
      - For **Scope name**, use `access_as_user`.
      - For **Who can consent**, make sure the **Admins and users** option is selected.
      - In **Admin consent display name**, type `Access TodoListService as a user`.
      - In **Admin consent description**, type `Accesses the TodoListService Web API as a user`.
      - In **User consent display name**, type `Access TodoListService as a user`.
      - In **User consent description**, type `Accesses the TodoListService Web API as a user`.
      - Keep **State** set to **Enabled**.
      - Select **Add scope**.

### Case where your Web API is called by daemon application

In this paragraph, you'll learn how to register your protected Web API so that it can be called securely by daemon applications:

- you'll need to expose **application permissions**. You will only declare application permissions as daemon applications do not interact with users and therefore delegated permissions would not make sense.
- tenant admins may require Azure AD to issue tokens for your Web App to only applications that have registered that they want to access one of the Web API apps permissions.

#### How to expose application permissions (app roles)

To Expose application permissions, you'll need to edit the manifest.

1. In the application registration for your application, click **Manifest**.
1. Edit the manifest by locating the `appRoles` setting and adding one or several application roles. The role definition is provided in the sample JSON block below.  Leave the `allowedMemberTypes` to "Application" only. Please make sure that the **id** is a unique guid and **displayName** and **Value** don't contain any spaces.
1. Save the manifest.

The content of `appRoles` should be the following (the `id` can be any unique GUID)

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

#### How to ensure that Azure AD issues tokens for your Web API only to allowed clients

The Web API checks for the app role (that's the developer way of doing it). But you can even configure Azure Active Directory to issue a token for your Web API only to applications that were approved by the tenant admin to access your API. To add this additional security:

1. On the app **Overview** page for your app registration, select the hyperlink with the name of your application in **Managed application in local directory**. The title for this field can be truncated. You could, for instance, read: `Managed application in ...`

   > [!NOTE]
   >
   > When you select this link you will navigate to the **Enterprise Application Overview** page associated with the service principal for your application in the tenant where you created it. You can navigate back to the app registration page by using the back button of your browser.

1. Select the **Properties** page in the **Manage** section of the Enterprise application pages
1. If you want AAD to enforce access to your Web API from only certain clients, set **User assignment required?** to **Yes**.

   > [!IMPORTANT]
   >
   > By setting **User assignment required?** to **Yes**, AAD will check the app role assignments of the clients when they request an access token for the Web API. If the client was not be assigned to any AppRoles, AAD would just return the following error: `invalid_client: AADSTS501051: Application xxxx is not assigned to a role for the xxxx`
   >
   > If you keep **User assignment required?** to **No**, <span style='background-color:yellow; display:inline'>Azure AD  won’t check the app role assignments when a client requests an access token for your Web API</span>. Therefore, any daemon client (that is any client using client credentials flow) would still be able to obtain an access token for the API just by specifying its audience. Any application, would be able to access the API without having to request permissions for it. Now, this is not then end of it, as your Web API can always, as explained in the next section, verify that the application has the right role (which was authorized by the tenant admin), by validating that the access token has a `roles` claim, and the right value for this claim (in our case `access_as_application`).

1. Select **Save**

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-protected-web-api-app-configuration.md)
