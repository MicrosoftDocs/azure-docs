---
title: Microsoft identity platform scopes, permissions, & consent
description: Learn about authorization in the Microsoft identity platform endpoint, including scopes, permissions, and consent.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 04/14/2021
ms.author: ryanwi
ms.reviewer: hirsin, jesakowi, jmprieur, marsma
ms.custom: aaddev, fasttrack-edit, contperf-fy21q1, identityplatformtop40
---

# Permissions and consent in the Microsoft identity platform

Applications that integrate with the Microsoft identity platform follow an authorization model that gives users and administrators control over how data can be accessed. The implementation of the authorization model has been updated on the Microsoft identity platform. It changes how an app must interact with the Microsoft identity platform. This article covers the basic concepts of this authorization model, including scopes, permissions, and consent.

## Scopes and permissions

The Microsoft identity platform implements the [OAuth 2.0](active-directory-v2-protocols.md) authorization protocol. OAuth 2.0 is a method through which a third-party app can access web-hosted resources on behalf of a user. Any web-hosted resource that integrates with the Microsoft identity platform has a resource identifier, or *application ID URI*. 

Here are some examples of Microsoft web-hosted resources:

* Microsoft Graph: `https://graph.microsoft.com`
* Microsoft 365 Mail API: `https://outlook.office.com`
* Azure Key Vault: `https://vault.azure.net`

The same is true for any third-party resources that have integrated with the Microsoft identity platform. Any of these resources also can define a set of permissions that can be used to divide the functionality of that resource into smaller chunks. As an example, [Microsoft Graph](https://graph.microsoft.com) has defined permissions to do the following tasks, among others:

* Read a user's calendar
* Write to a user's calendar
* Send mail as a user

Because of these types of permission definitions, the resource has fine-grained control over its data and how API functionality is exposed. A third-party app can request these permissions from users and administrators, who must approve the request before the app can access data or act on a user's behalf. 

When a resource's functionality is chunked into small permission sets, third-party apps can be built to request only the permissions that they need to perform their function. Users and administrators can know what data the app can access. And they can be more confident that the app isn't behaving with malicious intent. Developers should always abide by the principle of least privilege, asking for only the permissions they need for their applications to function.

In OAuth 2.0, these types of permission sets are called *scopes*. They're also often referred to as *permissions*. In the Microsoft identity platform, a permission is represented as a string value. An app requests the permissions it needs by specifying the permission in the `scope` query parameter. Identity platform supports several well-defined [OpenID Connect scopes](#openid-connect-scopes) as well as resource-based permissions (each permission is indicated by appending the permission value to the resource's identifier or application ID URI). For example, the permission string `https://graph.microsoft.com/Calendars.Read` is used to request permission to read users calendars in Microsoft Graph.

An app most commonly requests these permissions by specifying the scopes in requests to the Microsoft identity platform authorize endpoint. However, some high-privilege permissions can be granted only through administrator consent. They can be requested or granted by using the [administrator consent endpoint](#admin-restricted-permissions). Keep reading to learn more.

## Permission types

The Microsoft identity platform supports two types of permissions: *delegated permissions* and *application permissions*.

* **Delegated permissions** are used by apps that have a signed-in user present. For these apps, either the user or an administrator consents to the permissions that the app requests. The app is delegated permission to act as the signed-in user when it makes calls to the target resource. 

    Some delegated permissions can be consented to by nonadministrators. But some high-privileged permissions require [administrator consent](#admin-restricted-permissions). To learn which administrator roles can consent to delegated permissions, see [Administrator role permissions in Azure Active Directory (Azure AD)](../roles/permissions-reference.md).

* **Application permissions** are used by apps that run without a signed-in user present, for example, apps that run as background services or daemons. Only [an administrator can consent to](#requesting-consent-for-an-entire-tenant) application permissions.

_Effective permissions_ are the permissions that your app has when it makes requests to the target resource. It's important to understand the difference between the delegated permissions and application permissions that your app is granted, and the effective permissions your app is granted when it makes calls to the target resource.

- For delegated permissions, the _effective permissions_ of your app are the least-privileged intersection of the delegated permissions the app has been granted (by consent) and the privileges of the currently signed-in user. Your app can never have more privileges than the signed-in user. 

   Within organizations, the privileges of the signed-in user can be determined by policy or by membership in one or more administrator roles. To learn which administrator roles can consent to delegated permissions, see [Administrator role permissions in Azure AD](../roles/permissions-reference.md).

   For example, assume your app has been granted the _User.ReadWrite.All_ delegated permission. This permission nominally grants your app permission to read and update the profile of every user in an organization. If the signed-in user is a global administrator, your app can update the profile of every user in the organization. However, if the signed-in user doesn't have an administrator role, your app can update only the profile of the signed-in user. It can't update the profiles of other users in the organization because the user that it has permission to act on behalf of doesn't have those privileges.

- For application permissions, the _effective permissions_ of your app are the full level of privileges implied by the permission. For example, an app that has the _User.ReadWrite.All_ application permission can update the profile of every user in the organization.

## OpenID Connect scopes

The Microsoft identity platform implementation of OpenID Connect has a few well-defined scopes that are also hosted on Microsoft Graph: `openid`, `email`, `profile`, and `offline_access`. The `address` and `phone` OpenID Connect scopes aren't supported.

If you request the OpenID Connect scopes and a token, you'll get a token to call the [UserInfo endpoint](userinfo.md).

### openid

If an app signs in by using [OpenID Connect](active-directory-v2-protocols.md), it must request the `openid` scope. The `openid` scope appears on the work account consent page as the **Sign you in** permission. On the personal Microsoft account consent page, it appears as the **View your profile and connect to apps and services using your Microsoft account** permission. 

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

On the Microsoft identity platform (requests made to the v2.0 endpoint), your app must explicitly request the `offline_access` scope, to receive refresh tokens. So when you redeem an authorization code in the [OAuth 2.0 authorization code flow](active-directory-v2-protocols.md), you'll receive only an access token from the `/token` endpoint. 

The access token is valid for a short time. It usually expires in one hour. At that point, your app needs to redirect the user back to the `/authorize` endpoint to get a new authorization code. During this redirect, depending on the type of app, the user might need to enter their credentials again or consent again to permissions.

For more information about how to get and use refresh tokens, see the [Microsoft identity platform protocol reference](active-directory-v2-protocols.md).

## Requesting individual user consent

In an [OpenID Connect or OAuth 2.0](active-directory-v2-protocols.md) authorization request, an app can request the permissions it needs by using the `scope` query parameter. For example, when a user signs in to an app, the app sends a request like the following example. (Line breaks are added for legibility.)

```HTTP
GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&response_type=code
&redirect_uri=http%3A%2F%2Flocalhost%2Fmyapp%2F
&response_mode=query
&scope=
https%3A%2F%2Fgraph.microsoft.com%2Fcalendars.read%20
https%3A%2F%2Fgraph.microsoft.com%2Fmail.send
&state=12345
```

The `scope` parameter is a space-separated list of delegated permissions that the app is requesting. Each permission is indicated by appending the permission value to the resource's identifier (the application ID URI). In the request example, the app needs permission to read the user's calendar and send mail as the user.

After the user enters their credentials, the Microsoft identity platform checks for a matching record of *user consent*. If the user hasn't consented to any of the requested permissions in the past, and if the administrator hasn't consented to these permissions on behalf of the entire organization, the Microsoft identity platform asks the user to grant the requested permissions.

At this time, the `offline_access` ("Maintain access to data you have given it access to") permission and `user.read` ("Sign you in and read your profile") permission are automatically included in the initial consent to an application.  These permissions are generally required for proper app functionality. The `offline_access` permission gives the app access to refresh tokens that are critical for native apps and web apps. The `user.read` permission gives access to the `sub` claim. It allows the client or app to correctly identify the user over time and access rudimentary user information.

![Example screenshot that shows work account consent.](./media/v2-permissions-and-consent/work_account_consent.png)

When the user approves the permission request, consent is recorded. The user doesn't have to consent again when they later sign in to the application.

## Requesting consent for an entire tenant

When an organization purchases a license or subscription for an application, the organization often wants to proactively set up the application for use by all members of the organization. As part of this process, an administrator can grant consent for the application to act on behalf of any user in the tenant. If the admin grants consent for the entire tenant, the organization's users don't see a consent page for the application.

To request consent for delegated permissions for all users in a tenant, your app can use the admin consent endpoint.

Additionally, applications must use the admin consent endpoint to request application permissions.

## Admin-restricted permissions

Some high-privilege permissions in Microsoft resources can be set to *admin-restricted*. Here are some examples of these kinds of permissions:

* Read all user's full profiles by using `User.Read.All`
* Write data to an organization's directory by using `Directory.ReadWrite.All`
* Read all groups in an organization's directory by using `Groups.Read.All`

Although a consumer user might grant an application access to this kind of data, organizational users can't grant access to the same set of sensitive company data. If your application requests access to one of these permissions from an organizational user, the user receives an error message that says they're not authorized to consent to your app's permissions.

If your app requires scopes for admin-restricted permissions, an organization's administrator must consent to those scopes on behalf of the organization's users. To avoid displaying prompts to users that request consent for permissions they can't grant, your app can use the admin consent endpoint. The admin consent endpoint is covered in the next section.

If the application requests high-privilege delegated permissions and an administrator grants these permissions through the admin consent endpoint, consent is granted for all users in the tenant.

If the application requests application permissions and an administrator grants these permissions through the admin consent endpoint, this grant isn't done on behalf of any specific user. Instead, the client application is granted permissions *directly*. These types of permissions are used only by daemon services and other noninteractive applications that run in the background.

## Using the admin consent endpoint

After you use the admin consent endpoint to grant admin consent, you're finished. Users don't need to take any further action. After admin consent is granted, users can get an access token through a typical auth flow. The resulting access token has the consented permissions.

When a Global Administrator uses your application and is directed to the authorize endpoint, the Microsoft identity platform detects the user's role. It asks if the Global Administrator wants to consent on behalf of the entire tenant for the permissions you requested. You could instead use a dedicated admin consent endpoint to proactively request an administrator to grant permission on behalf of the entire tenant. This endpoint is also necessary for requesting application permissions. Application permissions can't be requested by using the authorize endpoint.

If you follow these steps, your app can request permissions for all users in a tenant, including admin-restricted scopes. This operation is high privilege. Use the operation only if necessary for your scenario.

To see a code sample that implements the steps, see the [admin-restricted scopes sample](https://github.com/Azure-Samples/active-directory-dotnet-admin-restricted-scopes-v2) in GitHub.

### Request the permissions in the app registration portal

In the app registration portal, applications can list the permissions they require, including both delegated permissions and application permissions. This setup allows the use of the `/.default` scope and the Azure portal's **Grant admin consent** option.  

In general, the permissions should be statically defined for a given application. They should be a superset of the permissions that the app will request dynamically or incrementally.

> [!NOTE]
>Application permissions can be requested only through the use of [`/.default`](#the-default-scope). So if your app needs application permissions, make sure they're listed in the app registration portal.

To configure the list of statically requested permissions for an application:

1. Go to your application in the <a href="https://go.microsoft.com/fwlink/?linkid=2083908" target="_blank">Azure portal - App registrations</a> quickstart experience.
1. Select an application, or [create an app](quickstart-register-app.md) if you haven't already.
1. On the application's **Overview** page, under **Manage**, select **API Permissions** > **Add a permission**.
1. Select **Microsoft Graph** from the list of available APIs. Then add the permissions that your app requires.
1. Select **Add Permissions**.

### Recommended: Sign the user in to your app

Typically, when you build an application that uses the admin consent endpoint, the app needs a page or view in which the admin can approve the app's permissions. This page can be:

* Part of the app's sign-up flow.
* Part of the app's settings.
* A dedicated "connect" flow. 

In many cases, it makes sense for the app to show this "connect" view only after a user has signed in with a work Microsoft account or school Microsoft account.

When you sign the user in to your app, you can identify the organization to which the admin belongs before you ask them to approve the necessary permissions. Although this step isn't strictly necessary, it can help you create a more intuitive experience for your organizational users. 

To sign the user in, follow the [Microsoft identity platform protocol tutorials](active-directory-v2-protocols.md).

### Request the permissions from a directory admin

When you're ready to request permissions from your organization's admin, you can redirect the user to the Microsoft identity platform admin consent endpoint.

```HTTP
// Line breaks are for legibility only.
GET https://login.microsoftonline.com/{tenant}/v2.0/adminconsent?
client_id=6731de76-14a6-49ae-97bc-6eba6914391e
&state=12345
&redirect_uri=http://localhost/myapp/permissions
&scope=
https://graph.microsoft.com/calendars.read
https://graph.microsoft.com/mail.send
```


| Parameter        | Condition        | Description                                                                                |
|:--------------|:--------------|:-----------------------------------------------------------------------------------------|
| `tenant` | Required | The directory tenant that you want to request permission from. It can be provided in a GUID or friendly name format. Or it can be generically referenced with organizations, as seen in the example. Don't use "common," because personal accounts can't provide admin consent except in the context of a tenant. To ensure the best compatibility with personal accounts that manage tenants, use the tenant ID when possible. |
| `client_id` | Required | The application (client) ID that the [Azure portal – App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience assigned to your app. |
| `redirect_uri` | Required |The redirect URI where you want the response to be sent for your app to handle. It must exactly match one of the redirect URIs that you registered in the app registration portal. |
| `state` | Recommended | A value included in the request that will also be returned in the token response. It can be a string of any content you want. Use the state to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
|`scope`        | Required        | Defines the set of permissions being requested by the application. Scopes can be either static (using [`/.default`](#the-default-scope)) or dynamic.  This set can include the OpenID Connect scopes (`openid`, `profile`, `email`). If you need application permissions, you must use `/.default` to request the statically configured list of permissions.  |


At this point, Azure AD requires a tenant administrator to sign in to complete the request. The administrator is asked to approve all the permissions that you requested in the `scope` parameter.  If you used a static (`/.default`) value, it will function like the v1.0 admin consent endpoint and request consent for all scopes found in the required permissions for the app.

#### Successful response

If the admin approves the permissions for your app, the successful response looks like this:

```HTTP
GET http://localhost/myapp/permissions?tenant=a8990e1f-ff32-408a-9f8e-78d3b9139b95&state=state=12345&admin_consent=True
```

| Parameter | Description |
| --- | --- |
| `tenant` | The directory tenant that granted your application the permissions it requested, in GUID format. |
| `state` | A value included in the request that also will be returned in the token response. It can be a string of any content you want. The state is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| `admin_consent` | Will be set to `True`. |

#### Error response

If the admin doesn't approve the permissions for your app, the failed response looks like this:

```HTTP
GET http://localhost/myapp/permissions?error=permission_denied&error_description=The+admin+canceled+the+request
```

| Parameter | Description |
| --- | --- |
| `error` | An error code string that can be used to classify types of errors that occur. It can also be used to react to errors. |
| `error_description` | A specific error message that can help a developer identify the root cause of an error. |

After you've received a successful response from the admin consent endpoint, your app has gained the permissions it requested. Next, you can request a token for the resource you want.

## Using permissions

After the user consents to permissions for your app, your app can acquire access tokens that represent the app's permission to access a resource in some capacity. An access token can be used only for a single resource. But encoded inside the access token is every permission that your app has been granted for that resource. To acquire an access token, your app can make a request to the Microsoft identity platform token endpoint, like this:

```HTTP
POST common/oauth2/v2.0/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/json

{
    "grant_type": "authorization_code",
    "client_id": "6731de76-14a6-49ae-97bc-6eba6914391e",
    "scope": "https://outlook.office.com/mail.read https://outlook.office.com/mail.send",
    "code": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...",
    "redirect_uri": "https://localhost/myapp",
    "client_secret": "zc53fwe80980293klaj9823"  // NOTE: Only required for web apps
}
```

You can use the resulting access token in HTTP requests to the resource. It reliably indicates to the resource that your app has the proper permission to do a specific task.

For more information about the OAuth 2.0 protocol and how to get access tokens, see the [Microsoft identity platform endpoint protocol reference](active-directory-v2-protocols.md).

## The /.default scope

You can use the `/.default` scope to help migrate your apps from the v1.0 endpoint to the Microsoft identity platform endpoint. The `/.default` scope is built in for every application that refers to the static list of permissions configured on the application registration. 

A `scope` value of `https://graph.microsoft.com/.default` is functionally the same as `resource=https://graph.microsoft.com` on the v1.0 endpoint. By specifying the `https://graph.microsoft.com/.default` scope in its request, your application is requesting an access token that includes scopes for every Microsoft Graph permission you've selected for the app in the app registration portal. The scope is constructed by using the resource URI and `/.default`. So if the resource URI is `https://contosoApp.com`, the scope requested is `https://contosoApp.com/.default`.  For cases where you must include a second slash to correctly request the token, see the [section about trailing slashes](#trailing-slash-and-default).

The `/.default` scope can be used in any OAuth 2.0 flow. But it's necessary in the [On-Behalf-Of flow](v2-oauth2-on-behalf-of-flow.md) and [client credentials flow](v2-oauth2-client-creds-grant-flow.md). You also need it when you use the v2 admin consent endpoint to request application permissions.

Clients can't combine static (`/.default`) consent and dynamic consent in a single request. So `scope=https://graph.microsoft.com/.default+mail.read` results in an error because it combines scope types.

### /.default and consent

The `/.default` scope triggers the v1.0 endpoint behavior for `prompt=consent` as well. It requests consent for all permissions that the application registered, regardless of the resource. If it's included as part of the request, the `/.default` scope returns a token that contains the scopes for the resource requested.

### /.default when the user has already given consent

The `/.default` scope is functionally identical to the behavior of the `resource`-centric v1.0 endpoint. It carries the consent behavior of the v1.0 endpoint as well. That is, `/.default` triggers a consent prompt only if the user has granted no permission between the client and the resource. 

If any such consent exists, the returned token contains all scopes the user granted for that resource. However, if no permission has been granted or if the `prompt=consent` parameter has been provided, a consent prompt is shown for all scopes that the client application registered.

#### Example 1: The user, or tenant admin, has granted permissions

In this example, the user or a tenant administrator has granted the `mail.read` and `user.read` Microsoft Graph permissions to the client. 

If the client requests `scope=https://graph.microsoft.com/.default`, no consent prompt is shown, regardless of the contents of the client application's registered permissions for Microsoft Graph. The returned token contains the scopes `mail.read` and `user.read`.

#### Example 2: The user hasn't granted permissions between the client and the resource

In this example, the user hasn't granted consent between the client and Microsoft Graph. The client has registered for the permissions `user.read` and `contacts.read`. It has also registered for the Azure Key Vault scope `https://vault.azure.net/user_impersonation`. 

When the client requests a token for `scope=https://graph.microsoft.com/.default`, the user sees a consent page for the `user.read` scope, the `contacts.read` scope, and the Key Vault `user_impersonation` scopes. The returned token contains only the `user.read` and `contacts.read` scopes. It can be used only against Microsoft Graph.

#### Example 3: The user has consented, and the client requests more scopes

In this example, the user has already consented to `mail.read` for the client. The client has registered for the `contacts.read` scope. 

When the client requests a token by using `scope=https://graph.microsoft.com/.default` and requests consent through `prompt=consent`, the user sees a consent page for all (and only) the permissions that the application registered. The `contacts.read` scope is on the consent page but `mail.read` isn't. The token returned is for Microsoft Graph. It contains `mail.read` and `contacts.read`.

### Using the /.default scope with the client

In some cases, a client can request its own `/.default` scope. The following example demonstrates this scenario.

```HTTP
// Line breaks are for legibility only.

GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
response_type=token            //Code or a hybrid flow is also possible here
&client_id=9ada6f8a-6d83-41bc-b169-a306c21527a5
&scope=9ada6f8a-6d83-41bc-b169-a306c21527a5/.default
&redirect_uri=https%3A%2F%2Flocalhost
&state=1234
```

This code example produces a consent page for all registered permissions if the preceding descriptions of consent and `/.default` apply to the scenario. Then the code returns an `id_token`, rather than an access token.  

This behavior accommodates some legacy clients that are moving from Azure AD Authentication Library (ADAL) to the Microsoft Authentication Library (MSAL). This setup *shouldn't* be used by new clients that target the Microsoft identity platform.

### Client credentials grant flow and /.default  

Another use of `/.default` is to request application permissions (or *roles*) in a noninteractive application like a daemon app that uses the [client credentials](v2-oauth2-client-creds-grant-flow.md) grant flow to call a web API.

To create application permissions (roles) for a web API, see [Add app roles in your application](howto-add-app-roles-in-azure-ad-apps.md).

Client credentials requests in your client app *must* include `scope={resource}/.default`. Here, `{resource}` is the web API that your app intends to call. Issuing a client credentials request by using individual application permissions (roles) is *not* supported. All the application permissions (roles) that have been granted for that web API are included in the returned access token.

To grant access to the application permissions you define, including granting admin consent for the application, see [Configure a client application to access a web API](quickstart-configure-app-access-web-apis.md).

### Trailing slash and /.default

Some resource URIs have a trailing forward slash, for example, `https://contoso.com/` as opposed to `https://contoso.com`. The trailing slash can cause problems with token validation. Problems occur primarily when a token is requested for Azure Resource Manager (`https://management.azure.com/`). In this case, a trailing slash on the resource URI means the slash must be present when the token is requested.  So when you request a token for `https://management.azure.com/` and use `/.default`, you must request `https://management.azure.com//.default` (notice the double slash!). In general, if you verify that the token is being issued, and if the token is being rejected by the API that should accept it, consider adding a second forward slash and trying again. 

## Troubleshooting permissions and consent

For troubleshooting steps, see [Unexpected error when performing consent to an application](../manage-apps/application-sign-in-unexpected-user-consent-error.md).

## Next steps

* [ID tokens in the Microsoft identity platform](id-tokens.md)
* [Access tokens in the Microsoft identity platform](access-tokens.md)
