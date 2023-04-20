---
title: Protected web API app registration
description: Learn how to build a protected web API and the information you need to register the app.
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.date: 01/27/2022
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev
# Customer intent: As an application developer, I want to know how to write a protected web API using the Microsoft identity platform for developers.
---

# Protected web API: App registration

This article explains the specifics of app registration for a protected web API.

For the common steps to register an app, see [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md).

## Accepted token version

The Microsoft identity platform can issue v1.0 tokens and v2.0 tokens. For more information about these tokens, see [Access tokens](access-tokens.md).

The token version your API may accept depends on your **Supported account types** selection when you create your web API application registration in the Azure portal.

- If the value of **Supported account types** is **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**, the accepted token version must be v2.0.
- Otherwise, the accepted token version can be v1.0.

After you create the application, you can determine or change the accepted token version by following these steps:

1. In the Azure portal, select your app and then select **Manifest**.
1. Find the property **accessTokenAcceptedVersion** in the manifest.
1. The value specifies to Azure Active Directory (Azure AD) which token version the web API accepts.
   - If the value is 2, the web API accepts v2.0 tokens.
   - If the value is **null**, the web API accepts v1.0 tokens.
1. If you changed the token version, select **Save**.

The web API specifies which token version it accepts. When a client requests a token for your web API from the Microsoft identity platform, the client gets a token that indicates which token version the web API accepts.

## No redirect URI

Web APIs don't need to register a redirect URI because no user is interactively signed in.

## Exposed API

Other settings specific to web APIs are the exposed API and the exposed scopes or app roles.

## Scopes and the Application ID URI

Scopes usually have the form `resourceURI/scopeName`. For Microsoft Graph, the scopes have shortcuts. For example, `User.Read` is a shortcut for `https://graph.microsoft.com/user.read`.

During app registration, define these parameters:

- The resource URI
- One or more scopes
- One or more app roles

By default, the application registration portal recommends that you use the resource URI `api://{clientId}`. This URI is unique but not human readable. If you change the URI, make sure the new value is unique. The application registration portal will ensure that you use a [configured publisher domain](howto-configure-publisher-domain.md).

To client applications, scopes show up as _delegated permissions_ and app roles show up as _application permissions_ for your web API.

Scopes also appear on the consent window that's presented to users of your app. Therefore, provide the corresponding strings that describe the scope:

- As seen by a user.
- As seen by a tenant admin, who can grant admin consent.

App roles cannot be consented to by a user (as they're used by an application that call the web API on behalf of itself). A tenant administrator will need to consent to client applications of your web API exposing app roles. See [Admin consent](v2-admin-consent.md) for details.

### Expose delegated permissions (scopes)

To expose delegated permissions, or _scopes_, follow the steps in [Configure an application to expose a web API](quickstart-configure-app-expose-web-apis.md).

If you're following along with the web API scenario described in this set of articles, use these settings:

- **Application ID URI**: Accept the proposed application ID URI (_api://\<clientId\>_) (if prompted)
- **Scope name**: _access_as_user_
- **Who can consent**: _Admins and users_
- **Admin consent display name**: _Access TodoListService as a user_
- **Admin consent description**: _Accesses the TodoListService web API as a user_
- **User consent display name**: _Access TodoListService as a user_
- **User consent description**: _Accesses the TodoListService web API as a user_
- **State**: _Enabled_

> [!TIP] 
> For the **Application ID URI**, you have the option to set it to the physical authority of the API, for example `https://graph.microsoft.com`. This can be useful if the URL of the API that needs to be called is known.

### If your web API is called by a service or daemon app

Expose _application permissions_ instead of delegated permissions if your API should be accessed by daemons, services, or other non-interactive (by a human) applications. Because daemon- and service-type applications run unattended and authenticate with their own identity, there is no user to "delegate" their permission.


#### Expose application permissions (app roles)

To expose application permissions, follow the steps in [Add app roles to your app](howto-add-app-roles-in-azure-ad-apps.md).

In the **Create app role** pane under **Allowed member types**, select **Applications**. Or, add the role by using the **Application manifest editor** as described in the article.

#### Restrict access tokens to specific clients apps

App roles are the mechanism an application developer uses to expose their app's permissions. Your web API's code should check for app roles in the access tokens it receives from callers.

To add another layer of security, an Azure AD tenant administrator can configure their tenant so the Microsoft identity platform issues security tokens _only_ to the client apps they've approved for API access.

To increase security by restricting token issuance only to client apps that have been assigned app roles:

1. In the Azure portal, select your app in **Azure Active Directory** > **App registrations**.
1. On the application's overview page, select its **Managed application in local directory** link to navigate to its **Enterprise Application Overview** page.
1. Under **Manage**, select **Properties**.
1. Set **Assignment required?** to **Yes**.
1. Select **Save**.

Azure AD will now check for app role assignments of client applications that request access tokens for your web API. If a client app hasn't been assigned any app roles, Azure AD returns an error message to the client similar to _invalid_client: AADSTS501051: Application \<application name\> isn't assigned to a role for the \<web API\>_.

> [!WARNING]
> **DO NOT use AADSTS error codes** or their message strings as literals in your application's code. The "AADSTS" error codes and the error message strings returned by Azure AD are _not immutable_, and may be changed by Microsoft at any time and without your knowledge. If you make branching decisions in your code based on the values of either the AADSTS codes or their message strings, you put your application's functionality and stability at risk.

## Next steps

The next article in this series is [App code configuration](scenario-protected-web-api-app-configuration.md).
