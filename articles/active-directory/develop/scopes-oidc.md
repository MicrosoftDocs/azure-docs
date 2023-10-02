---
title: Microsoft identity platform scopes and permissions
description: Learn about openID connect scopes and permissions in the Microsoft identity platform endpoint.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 11/01/2022
ms.author: jomondi
ms.reviewer: jawoods, ludwignick, phsignor
---
# Scopes and permissions in the Microsoft identity platform

The Microsoft identity platform implements the [OAuth 2.0](./v2-protocols.md) authorization protocol. OAuth 2.0 is a method through which a third-party app can access web-hosted resources on behalf of a user. Any web-hosted resource that integrates with the Microsoft identity platform has a resource identifier, or *application ID URI*.

In this article, you'll learn about scopes and permissions in the identity platform.

The following list shows some examples of Microsoft web-hosted resources:

- Microsoft Graph: `https://graph.microsoft.com`
- Microsoft 365 Mail API: `https://outlook.office.com`
- Azure Key Vault: `https://vault.azure.net`

The same is true for any third-party resources that have integrated with the Microsoft identity platform. Any of these resources can also define a set of permissions that can be used to divide the functionality of that resource into smaller chunks. As an example, [Microsoft Graph](https://graph.microsoft.com) has defined permissions to do the following tasks, among others:

- Read a user's calendar
- Write to a user's calendar
- Send mail as a user

Because of these types of permission definitions, the resource has fine-grained control over its data and how API functionality is exposed. A third-party app can request these permissions from users and administrators, who must approve the request before the app can access data or act on a user's behalf. 

When a resource's functionality is chunked into small permission sets, third-party apps can be built to request only the permissions that they need to perform their function. Users and administrators can know what data the app can access. And they can be more confident that the app isn't behaving with malicious intent. Developers should always abide by the principle of least privilege, asking for only the permissions they need for their applications to function.

In OAuth 2.0, these types of permission sets are called *scopes*. They're also often referred to as *permissions*. In the Microsoft identity platform, a permission is represented as a string value. An app requests the permissions it needs by specifying the permission in the `scope` query parameter. Identity platform supports several well-defined [OpenID Connect scopes](#openid-connect-scopes) and resource-based permissions (each permission is indicated by appending the permission value to the resource's identifier or application ID URI). For example, the permission string `https://graph.microsoft.com/Calendars.Read` is used to request permission to read users calendars in Microsoft Graph.

In requests to the authorization server, for the Microsoft identity platform, if the resource identifier is omitted in the scope parameter, the resource is assumed to be Microsoft Graph. For example, `scope=User.Read` is equivalent to `https://graph.microsoft.com/User.Read`.

## Admin-restricted permissions

Permissions in the Microsoft identity platform can be set to admin restricted. For example, many higher-privilege Microsoft Graph permissions require admin approval. If your app requires admin-restricted permissions, an organization's administrator must consent to those scopes on behalf of the organization's users. The following section gives examples of these kinds of permissions:

- Read all user's full profiles by using `User.Read.All`
- Write data to an organization's directory by using `Directory.ReadWrite.All`
- Read all groups in an organization's directory by using `Groups.Read.All`

> [!NOTE]
>In requests to the authorization, token or consent endpoints for the Microsoft identity platform, if the resource identifier is omitted in the scope parameter, the resource is assumed to be Microsoft Graph. For example, `scope=User.Read` is equivalent to `https://graph.microsoft.com/User.Read`.

Although a consumer user might grant an application access to this kind of data, organizational users can't grant access to the same set of sensitive company data. If your application requests access to one of these permissions from an organizational user, the user receives an error message that says they're not authorized to consent to your app's permissions.

If the application requests application permissions and an administrator grants these permissions this grant isn't done on behalf of any specific user. Instead, the client application is granted permissions *directly*. These types of permissions should only be used by daemon services and other non-interactive applications that run in the background. For more information on the direct access scenario, see [Access scenarios in the Microsoft identity platform](permissions-consent-overview.md).

For a step by step guide on how to expose scopes in a web API, see [Configure an application to expose a web API](quickstart-configure-app-expose-web-apis.md).

## OpenID Connect scopes

The Microsoft identity platform implementation of OpenID Connect has a few well-defined scopes that are also hosted on Microsoft Graph: `openid`, `email`, `profile`, and `offline_access`. The `address` and `phone` OpenID Connect scopes aren't supported.

If you request the OpenID Connect scopes and a token, you'll get a token to call the [UserInfo endpoint](userinfo.md).

### openid

If an app signs in by using [OpenID Connect](./v2-protocols.md), it must request the `openid` scope. The `openid` scope appears on the work account consent page as the **Sign you in** permission.

By using this permission, an app can receive a unique identifier for the user in the form of the `sub` claim. The permission also gives the app access to the UserInfo endpoint. The `openid` scope can be used at the Microsoft identity platform token endpoint to acquire ID tokens. The app can use these tokens for authentication.

### email

The `email` scope can be used with the `openid` scope and any other scopes. It gives the app access to the user's primary email address in the form of the `email` claim. 

The `email` claim is included in a token only if an email address is associated with the user account, which isn't always the case. If your app uses the `email` scope, the app needs to be able to handle a case in which no `email` claim exists in the token.

### profile

The `profile` scope can be used with the `openid` scope and any other scope. It gives the app access to a large amount of information about the user. The information it can access includes, but isn't limited to, the user's given name, surname, preferred username, and object ID. 

For a complete list of the `profile` claims available in the `id_tokens` parameter for a specific user, see the [`id_tokens` reference](id-tokens.md).

### offline_access

The [`offline_access` scope](https://openid.net/specs/openid-connect-core-1_0.html#OfflineAccess) gives your app access to resources on behalf of the user for an extended time. On the consent page, this scope appears as the **Maintain access to data you have given it access to** permission. 

When a user approves the `offline_access` scope, your app can receive refresh tokens from the Microsoft identity platform token endpoint. Refresh tokens are long-lived. Your app can get new access tokens as older ones expire.

> [!NOTE]
> This permission currently appears on all consent pages, even for flows that don't provide a refresh token (such as the [implicit flow](v2-oauth2-implicit-grant-flow.md)). This setup addresses scenarios where a client can begin within the implicit flow and then move to the code flow where a refresh token is expected.

On the Microsoft identity platform (requests made to the v2.0 endpoint), your app must explicitly request the `offline_access` scope, to receive refresh tokens. So when you redeem an authorization code in the [OAuth 2.0 authorization code flow](./v2-protocols.md), you'll receive only an access token from the `/token` endpoint. 

The access token is valid for a short time. It usually expires in one hour. At that point, your app needs to redirect the user back to the `/authorize` endpoint to get a new authorization code. During this redirect, depending on the type of app, the user might need to enter their credentials again or consent again to permissions.

For more information about how to get and use refresh tokens, see the [Microsoft identity platform protocol reference](./v2-protocols.md).

## The .default scope

The `.default` scope is used to refer generically to a resource service (API) in a request, without identifying specific permissions. If consent is necessary, using `.default` signals that consent should be prompted for all required permissions listed in the application registration (for all APIs in the list).

The scope parameter value is constructed by using the identifier URI for the resource and `.default`, separated by a forward slash (`/`). For example, if the resource's identifier URI is `https://contoso.com`, the scope to request is `https://contoso.com/.default`. For cases where you must include a second slash to correctly request the token, see the [section about trailing slashes](#trailing-slash-and-default).

Using `scope={resource-identifier}/.default` is functionally the same as `resource={resource-identifier}` on the v1.0 endpoint (where `{resource-identifier}` is the identifier URI for the API, for example `https://graph.microsoft.com` for Microsoft Graph).

The `.default` scope can be used in any OAuth 2.0 flow and to initiate [admin consent](v2-admin-consent.md). Its use is required in the [On-Behalf-Of flow](v2-oauth2-on-behalf-of-flow.md) and [client credentials flow](v2-oauth2-client-creds-grant-flow.md).

Clients can't combine static (`.default`) consent and dynamic consent in a single request. So `scope=https://graph.microsoft.com/.default Mail.Read` results in an error because it combines scope types.

### .default when the user has already given consent

The `.default` scope parameter only triggers a consent prompt if consent hasn't been granted for any delegated permission between the client and the resource, on behalf of the signed-in user.

If consent exists, the returned token contains all scopes granted for that resource for the signed-in user. However, if no permission has been granted for the requested resource (or if the `prompt=consent` parameter has been provided), a consent prompt is shown for all required permissions configured on the client application registration, for all APIs in the list.

For example, if the scope `https://graph.microsoft.com/.default` is requested, your application is requesting an access token for the Microsoft Graph API. If at least one delegated permission has been granted for Microsoft Graph on behalf of the signed-in user, the sign-in will continue and all Microsoft Graph delegated permissions that have been granted for that user will be included in the access token. If no permissions have been granted for the requested resource (Microsoft Graph, in this example), then a consent prompt will be presented for all required permissions configured on the application, for all APIs in the list.

#### Example 1: The user, or tenant admin, has granted permissions

In this example, the user or a tenant administrator has granted the `Mail.Read` and `User.Read` Microsoft Graph permissions to the client. 

If the client requests `scope=https://graph.microsoft.com/.default`, no consent prompt is shown, regardless of the contents of the client application's registered permissions for Microsoft Graph. The returned token contains the scopes `Mail.Read` and `User.Read`.

#### Example 2: The user hasn't granted permissions between the client and the resource

In this example, the user hasn't granted consent between the client and Microsoft Graph, nor has an administrator. The client has registered for the permissions `User.Read` and `Contacts.Read`. It has also registered for the Azure Key Vault scope `https://vault.azure.net/user_impersonation`.

When the client requests a token for `scope=https://graph.microsoft.com/.default`, the user sees a consent page for the Microsoft Graph `User.Read` and `Contacts.Read` scopes, and for the Azure Key Vault `user_impersonation` scope. The returned token contains only the `User.Read` and `Contacts.Read` scopes, and it can be used only against Microsoft Graph.

#### Example 3: The user has consented, and the client requests more scopes

In this example, the user has already consented to `Mail.Read` for the client. The client has registered for the `Contacts.Read` scope. 

The client first performs a sign-in with `scope=https://graph.microsoft.com/.default`. Based on the `scopes` parameter of the response, the application's code detects that only `Mail.Read` has been granted. The client then initiates a second sign-in using `scope=https://graph.microsoft.com/.default`, and this time forces consent using `prompt=consent`. If the user is allowed to consent for all the permissions that the application registered, they'll be shown the consent prompt. (If not, they'll be shown an error message or the [admin consent request](../manage-apps/configure-admin-consent-workflow.md) form.) Both `Contacts.Read` and `Mail.Read` will be in the consent prompt. If consent is granted and the sign-in continues, the token returned is for Microsoft Graph, and contains `Mail.Read` and `Contacts.Read`.

### Using the .default scope with the client

In some cases, a client can request its own `.default` scope. The following example demonstrates this scenario. 

The scenario accommodates some legacy clients that are moving from Azure AD Authentication Library (ADAL) to the Microsoft Authentication Library (MSAL). This setup *shouldn't* be used by new clients that target the Microsoft identity platform.


```http
// Line breaks are for legibility only.

GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
    ?response_type=token            //Code or a hybrid flow is also possible here
    &client_id=9ada6f8a-6d83-41bc-b169-a306c21527a5
    &scope=9ada6f8a-6d83-41bc-b169-a306c21527a5/.default
    &redirect_uri=https%3A%2F%2Flocalhost
    &state=1234
```

This code example produces a consent page for all registered permissions if the preceding descriptions of consent and `.default` apply to the scenario. Then the code returns an `id_token`, rather than an access token.  

### Client credentials grant flow and .default  

Another use of `.default` is to request app roles (also known as application permissions) in a non-interactive application like a daemon app that uses the [client credentials](v2-oauth2-client-creds-grant-flow.md) grant flow to call a web API.

To define app roles (application permissions) for a web API, see [Add app roles in your application](./howto-add-app-roles-in-apps.md).

Client credentials requests in your client service *must* include `scope={resource}/.default`. Here, `{resource}` is the web API that your app intends to call, and wishes to obtain an access token for. Issuing a client credentials request by using individual application permissions (roles) is *not* supported. All the app roles (application permissions) that have been granted for that web API are included in the returned access token.

To grant access to the app roles you define, including granting admin consent for the application, see [Configure a client application to access a web API](quickstart-configure-app-access-web-apis.md).

### Trailing slash and .default

Some resource URIs have a trailing forward slash, for example, `https://contoso.com/` as opposed to `https://contoso.com`. The trailing slash can cause problems with token validation. Problems occur primarily when a token is requested for Azure Resource Manager (`https://management.azure.com/`). In this case, a trailing slash on the resource URI means the slash must be present when the token is requested.  So when you request a token for `https://management.azure.com/` and use `.default`, you must request `https://management.azure.com//.default` (notice the double slash!). In general, if you verify that the token is being issued, and if the token is being rejected by the API that should accept it, consider adding a second forward slash and trying again. 

## Next steps

- [Requesting permissions through consent in the identity platform](consent-types-developer.md)
- [ID tokens in the Microsoft identity platform](id-tokens.md)
- [Access tokens in the Microsoft identity platform](access-tokens.md)
