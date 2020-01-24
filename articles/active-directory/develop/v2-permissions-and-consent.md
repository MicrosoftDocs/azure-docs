---
title: Microsoft identity platform scopes, permissions, and consent | Microsoft Docs
description: A description of authorization in the Microsoft identity platform endpoint, including scopes, permissions, and consent.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG
editor: ''

ms.assetid: 8f98cbf0-a71d-4e34-babf-e644ad9ff423
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 12/10/2019
ms.author: ryanwi
ms.reviewer: hirsin, jesakowi, jmprieur
ms.custom: aaddev
ms.custom: fasttrack-edit
---

# Permissions and consent in the Microsoft identity platform endpoint

[!INCLUDE [active-directory-develop-applies-v2](../../../includes/active-directory-develop-applies-v2.md)]

Applications that integrate with Microsoft identity platform follow an authorization model that gives users and administrators control over how data can be accessed. The implementation of the authorization model has been updated on the Microsoft identity platform endpoint, and it changes how an app must interact with the Microsoft identity platform. This article covers the basic concepts of this authorization model, including scopes, permissions, and consent.

> [!NOTE]
> The Microsoft identity platform endpoint does not support all scenarios and features. To determine whether you should use the Microsoft identity platform endpoint, read about [Microsoft identity platform limitations](active-directory-v2-limitations.md).

## Scopes and permissions

The Microsoft identity platform implements the [OAuth 2.0](active-directory-v2-protocols.md) authorization protocol. OAuth 2.0 is a method through which a third-party app can access web-hosted resources on behalf of a user. Any web-hosted resource that integrates with the Microsoft identity platform has a resource identifier, or *Application ID URI*. For example, some of Microsoft's web-hosted resources include:

* Microsoft Graph: `https://graph.microsoft.com`
* Office 365 Mail API: `https://outlook.office.com`
* Azure AD Graph: `https://graph.windows.net`
* Azure Key Vault: `https://vault.azure.net`

> [!NOTE]
> We strongly recommend that you use Microsoft Graph instead of Azure AD Graph, Office 365 Mail API, etc.

The same is true for any third-party resources that have integrated with the Microsoft identity platform. Any of these resources also can define a set of permissions that can be used to divide the functionality of that resource into smaller chunks. As an example, [Microsoft Graph](https://graph.microsoft.com) has defined permissions to do the following tasks, among others:

* Read a user's calendar
* Write to a user's calendar
* Send mail as a user

By defining these types of permissions, the resource has fine-grained control over its data and how API functionality is exposed. A third-party app can request these permissions from users and administrators, who must approve the request before the app can access data or act on a user's behalf. By chunking the resource's functionality into smaller permission sets, third-party apps can be built to request only the specific permissions that they need to perform their function. Users and administrators can know exactly what data the app has access to, and they can be more confident that it isn't behaving with malicious intent. Developers should always abide by the concept of least privilege, asking for only the permissions they need for their applications to function.

In OAuth 2.0, these types of permissions are called *scopes*. They are also often referred to as *permissions*. A permission is represented in the Microsoft identity platform as a string value. Continuing with the Microsoft Graph example, the string value for each permission is:

* Read a user's calendar by using `Calendars.Read`
* Write to a user's calendar by using `Calendars.ReadWrite`
* Send mail as a user using by `Mail.Send`

An app most commonly requests these permissions by specifying the scopes in requests to the Microsoft identity platform authorize endpoint. However, certain high privilege permissions can only be granted through administrator consent and requested/granted using the [administrator consent endpoint](v2-permissions-and-consent.md#admin-restricted-permissions). Read on to learn more.

## Permission types

Microsoft identity platform supports two types of permissions: **delegated permissions** and **application permissions**.

* **Delegated permissions** are used by apps that have a signed-in user present. For these apps, either the user or an administrator consents to the permissions that the app requests, and the app is delegated permission to act as the signed-in user when making calls to the target resource. Some delegated permissions can be consented to by non-administrative users, but some higher-privileged permissions require [administrator consent](v2-permissions-and-consent.md#admin-restricted-permissions). To learn which administrator roles can consent to delegated permissions, see [Administrator role permissions in Azure AD](../users-groups-roles/directory-assign-admin-roles.md).

* **Application permissions** are used by apps that run without a signed-in user present; for example, apps that run as background services or daemons.  Application permissions can only be [consented by an administrator](v2-permissions-and-consent.md#requesting-consent-for-an-entire-tenant).

_Effective permissions_ are the permissions that your app will have when making requests to the target resource. It's important to understand the difference between the delegated and application permissions that your app is granted and its effective permissions when making calls to the target resource.

- For delegated permissions, the _effective permissions_ of your app will be the least privileged intersection of the delegated permissions the app has been granted (via consent) and the privileges of the currently signed-in user. Your app can never have more privileges than the signed-in user. Within organizations, the privileges of the signed-in user may be determined by policy or by membership in one or more administrator roles. To learn which administrator roles can consent to delegated permissions, see [Administrator role permissions in Azure AD](../users-groups-roles/directory-assign-admin-roles.md).

   For example, assume your app has been granted the _User.ReadWrite.All_ delegated permission. This permission nominally grants your app permission to read and update the profile of every user in an organization. If the signed-in user is a global administrator, your app will be able to update the profile of every user in the organization. However, if the signed-in user isn't in an administrator role, your app will be able to update only the profile of the signed-in user. It will not be able to update the profiles of other users in the organization because the user that it has permission to act on behalf of does not have those privileges.
  
- For application permissions, the _effective permissions_ of your app will be the full level of privileges implied by the permission. For example, an app that has the _User.ReadWrite.All_ application permission can update the profile of every user in the organization. 

## OpenID Connect scopes

The Microsoft identity platform implementation of OpenID Connect has a few well-defined scopes that do not apply to a specific resource: `openid`, `email`, `profile`, and `offline_access`. The `address` and `phone` OpenID Connect scopes are not supported.

### openid

If an app performs sign-in by using [OpenID Connect](active-directory-v2-protocols.md), it must request the `openid` scope. The `openid` scope shows on the work account consent page as the "Sign you in" permission, and on the personal Microsoft account consent page as the "View your profile and connect to apps and services using your Microsoft account" permission. With this permission, an app can receive a unique identifier for the user in the form of the `sub` claim. It also gives the app access to the UserInfo endpoint. The `openid` scope can be used at the Microsoft identity platform token endpoint to acquire ID tokens, which can be used by the app for authentication.

### email

The `email` scope can be used with the `openid` scope and any others. It gives the app access to the user's primary email address in the form of the `email` claim. The `email` claim is included in a token only if an email address is associated with the user account, which isn't always the case. If it uses the `email` scope, your app should be prepared to handle a case in which the `email` claim does not exist in the token.

### profile

The `profile` scope can be used with the `openid` scope and any others. It gives the app access to a substantial amount of information about the user. The information it can access includes, but isn't limited to, the user's given name, surname, preferred username, and object ID. For a complete list of the profile claims available in the id_tokens parameter for a specific user, see the [`id_tokens` reference](id-tokens.md).

### offline_access

The [`offline_access` scope](https://openid.net/specs/openid-connect-core-1_0.html#OfflineAccess) gives your app access to resources on behalf of the user for an extended time. On the consent page, this scope appears as the "Maintain access to data you have given it access to" permission. When a user approves the `offline_access` scope, your app can receive refresh tokens from the Microsoft identity platform token endpoint. Refresh tokens are long-lived. Your app can get new access tokens as older ones expire.

> [!NOTE]
> This permission appears on all consent screens today, even for flows that don't provide a refresh token (the [implicit flow](v2-oauth2-implicit-grant-flow.md)).  This is to cover scenarios where a client can begin within the implicit flow, and then move onto to the code flow where a refresh token is expected.

On the Microsoft identity platform (requests made to the v2.0 endpoint), your app must explicitly request the `offline_access` scope, to receive refresh tokens. This means that when you redeem an authorization code in the [OAuth 2.0 authorization code flow](active-directory-v2-protocols.md), you'll receive only an access token from the `/token` endpoint. The access token is valid for a short time. The access token usually expires in one hour. At that point, your app needs to redirect the user back to the `/authorize` endpoint to get a new authorization code. During this redirect, depending on the type of app, the user might need to enter their credentials again or consent again to permissions. 

For more information about how to get and use refresh tokens, see the [Microsoft identity platform protocol reference](active-directory-v2-protocols.md).

## Requesting individual user consent

In an [OpenID Connect or OAuth 2.0](active-directory-v2-protocols.md) authorization request, an app can request the permissions it needs by using the `scope` query parameter. For example, when a user signs in to an app, the app sends a request like the following example (with line breaks added for legibility):

```
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

The `scope` parameter is a space-separated list of delegated permissions that the app is requesting. Each permission is indicated by appending the permission value to the resource's identifier (the Application ID URI). In the request example, the app needs permission to read the user's calendar and send mail as the user.

After the user enters their credentials, the Microsoft identity platform endpoint checks for a matching record of *user consent*. If the user has not consented to any of the requested permissions in the past, nor has an administrator consented to these permissions on behalf of the entire organization, the Microsoft identity platform endpoint asks the user to grant the requested permissions.

> [!NOTE]
> At this time, the `offline_access` ("Maintain access to data you have given it access to") and `user.read` ("Sign you in and read your profile") permissions are automatically included in the initial consent to an application.  These permissions are generally required for proper app functionality - `offline_access` gives the app access to refresh tokens, critical for native and web apps, while `user.read` gives access to the `sub` claim, allowing the client or app to correctly identify the user over time and access rudimentary user information.  

![Example screenshot that shows work account consent](./media/v2-permissions-and-consent/work_account_consent.png)

When the user approves the permission request, consent is recorded and the user doesn't have to consent again on subsequent sign-ins to the application.

## Requesting consent for an entire tenant

Often, when an organization purchases a license or subscription for an application, the organization wants to proactively set up the application for use by all members of the organization. As part of this process, an administrator can grant consent for the application to act on behalf of any user in the tenant. If the admin grants consent for the entire tenant, the organization's users won't see a consent page for the application.

To request consent for delegated permissions for all users in a tenant, your app can use the admin consent endpoint.

Additionally, applications must use the admin consent endpoint to request Application Permissions.

## Admin-restricted permissions

Some high-privilege permissions in the Microsoft ecosystem can be set to *admin-restricted*. Examples of these kinds of permissions include the following:

* Read all user's full profiles by using `User.Read.All`
* Write data to an organization's directory by using `Directory.ReadWrite.All`
* Read all groups in an organization's directory by using `Groups.Read.All`

Although a consumer user might grant an application access to this kind of data, organizational users are restricted from granting access to the same set of sensitive company data. If your application requests access to one of these permissions from an organizational user, the user receives an error message that says they're not authorized to consent to your app's permissions.

If your app requires access to admin-restricted scopes for organizations, you should request them directly from a company administrator, also by using the admin consent endpoint, described next.

If the application is requesting high privilege delegated permissions and an administrator grants these permissions via the admin consent endpoint, consent is granted for all users in the tenant.

If the application is requesting application permissions and an administrator grants these permissions via the admin consent endpoint, this grant isn't done on behalf of any specific user. Instead, the client application is granted permissions *directly*. These types of permissions are only used by daemon services and other non-interactive applications that run in the background.

## Using the admin consent endpoint

> [!NOTE] 
> Please note after granting admin consent using the admin consent endpoint, you have finished granting admin consent and users do not need to perform any further additional actions. After granting admin consent, users can get an access token via a typical auth flow and the resulting access token will have the consented permissions. 

When a Company Administrator uses your application and is directed to the authorize endpoint, Microsoft identity platform will detect the user's role and ask them if they would like to consent on behalf of the entire tenant for the permissions you have requested. However, there is also a dedicated admin consent endpoint you can use if you would like to proactively request that an administrator grants permission on behalf of the entire tenant. Using this endpoint is also necessary for requesting Application Permissions (which can't be requested using the authorize endpoint).

If you follow these steps, your app can request permissions for all users in a tenant, including admin-restricted scopes. This is a high privilege operation and should only be done if necessary for your scenario.

To see a code sample that implements the steps, see the [admin-restricted scopes sample](https://github.com/Azure-Samples/active-directory-dotnet-admin-restricted-scopes-v2).

### Request the permissions in the app registration portal

The admin consent does not accept a scope parameter, so any permissions being requested must be statically defined in the application's registration. In general, it's best practice to ensure that the permissions statically defined for a given application are a superset of the permissions that it will be requesting dynamically/incrementally.

#### To configure the list of statically requested permissions for an application

1. Go to your application in the [Azure portal – App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience, or [create an app](quickstart-register-app.md) if you haven't already.
2. Locate the **API Permissions** section, and within the API permissions click Add a permission.
3. Select **Microsoft Graph** from the list of available APIs and then add the permissions that your app requires.
3. **Save** the app registration.

### Recommended: Sign the user into your app

Typically, when you build an application that uses the admin consent endpoint, the app needs a page or view in which the admin can approve the app's permissions. This page can be part of the app's sign-up flow, part of the app's settings, or it can be a dedicated "connect" flow. In many cases, it makes sense for the app to show this "connect" view only after a user has signed in with a work or school Microsoft account.

When you sign the user into your app, you can identify the organization to which the admin belongs before asking them to approve the necessary permissions. Although not strictly necessary, it can help you create a more intuitive experience for your organizational users. To sign the user in, follow our [Microsoft identity platform protocol tutorials](active-directory-v2-protocols.md).

### Request the permissions from a directory admin

When you're ready to request permissions from your organization's admin, you can redirect the user to the Microsoft identity platform *admin consent endpoint*.

```
// Line breaks are for legibility only.
  GET https://login.microsoftonline.com/{tenant}/v2.0/adminconsent?
  client_id=6731de76-14a6-49ae-97bc-6eba6914391e
  &state=12345
  &redirect_uri=http://localhost/myapp/permissions
  &scope=
  https://graph.microsoft.com/calendars.read 
  https://graph.microsoft.com/mail.send
```


| Parameter		| Condition		| Description																				|
|:--------------|:--------------|:-----------------------------------------------------------------------------------------|
| `tenant` | Required | The directory tenant that you want to request permission from. Can be provided in GUID or friendly name format OR generically referenced with `common` as seen in the example. |
| `client_id` | Required | The **Application (client) ID** that the [Azure portal – App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience assigned to your app. |
| `redirect_uri` | Required |The redirect URI where you want the response to be sent for your app to handle. It must exactly match one of the redirect URIs that you registered in the app registration portal. |
| `state` | Recommended | A value included in the request that will also be returned in the token response. It can be a string of any content you want. Use the state to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
|`scope`		| Required		| Defines the set of permissions being requested by the application. This can be either static (using /.default) or dynamic scopes.  This can include the OIDC scopes (`openid`, `profile`, `email`). | 


At this point, Azure AD requires a tenant administrator to sign in to complete the request. The administrator is asked to approve all the permissions that you have requested in the `scope` parameter.  If you've used a static (`/.default`) value, it will function like the v1.0 admin consent endpoint and request consent for all scopes found in the required permissions for the app.

#### Successful response

If the admin approves the permissions for your app, the successful response looks like this:

```
GET http://localhost/myapp/permissions?tenant=a8990e1f-ff32-408a-9f8e-78d3b9139b95&state=state=12345&admin_consent=True
```

| Parameter | Description |
| --- | --- |
| `tenant` | The directory tenant that granted your application the permissions it requested, in GUID format. |
| `state` | A value included in the request that also will be returned in the token response. It can be a string of any content you want. The state is used to encode information about the user's state in the app before the authentication request occurred, such as the page or view they were on. |
| `admin_consent` | Will be set to `True`. |

#### Error response

If the admin does not approve the permissions for your app, the failed response looks like this:

```
GET http://localhost/myapp/permissions?error=permission_denied&error_description=The+admin+canceled+the+request
```

| Parameter | Description |
| --- | --- |
| `error` | An error code string that can be used to classify types of errors that occur, and can be used to react to errors. |
| `error_description` | A specific error message that can help a developer identify the root cause of an error. |

After you've received a successful response from the admin consent endpoint, your app has gained the permissions it requested. Next, you can request a token for the resource you want.

## Using permissions

After the user consents to permissions for your app, your app can acquire access tokens that represent your app's permission to access a resource in some capacity. An access token can be used only for a single resource, but encoded inside the access token is every permission that your app has been granted for that resource. To acquire an access token, your app can make a request to the Microsoft identity platform token endpoint, like this:

```
POST common/oauth2/v2.0/token HTTP/1.1
Host: https://login.microsoftonline.com
Content-Type: application/json

{
    "grant_type": "authorization_code",
    "client_id": "6731de76-14a6-49ae-97bc-6eba6914391e",
    "scope": "https://outlook.office.com/mail.read https://outlook.office.com/mail.send",
    "code": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq..."
    "redirect_uri": "https://localhost/myapp",
    "client_secret": "zc53fwe80980293klaj9823"  // NOTE: Only required for web apps
}
```

You can use the resulting access token in HTTP requests to the resource. It reliably indicates to the resource that your app has the proper permission to perform a specific task. 

For more information about the OAuth 2.0 protocol and how to get access tokens, see the [Microsoft identity platform endpoint protocol reference](active-directory-v2-protocols.md).

## The /.default scope

You can use the `/.default` scope to help migrate your apps from the v1.0 endpoint to the Microsoft identity platform endpoint. This is a built-in scope for every application that refers to the static list of permissions configured on the application registration. A `scope` value of `https://graph.microsoft.com/.default` is functionally the same as the v1.0 endpoints `resource=https://graph.microsoft.com` - namely, it requests a token with the scopes on Microsoft Graph that the application has registered for in the Azure portal.

The /.default scope can be used in any OAuth 2.0 flow, but is necessary in the [On-Behalf-Of flow](v2-oauth2-on-behalf-of-flow.md) and [client credentials flow](v2-oauth2-client-creds-grant-flow.md).  

> [!NOTE]
> Clients can't combine static (`/.default`) and dynamic consent in a single request. Thus, `scope=https://graph.microsoft.com/.default+mail.read` will result in an error due to the combination of scope types.

### /.default and consent

The `/.default` scope triggers the v1.0 endpoint behavior for `prompt=consent` as well. It requests consent for all permissions registered by the application, regardless of the resource. If included as part of the request, the `/.default` scope returns a token that contains the scopes for the resource requested.

### /.default when the user has already given consent

Because `/.default` is functionally identical to the `resource`-centric v1.0 endpoint's behavior, it brings with it the consent behavior of the v1.0 endpoint as well. Namely, `/.default` only triggers a consent prompt if no permission has been granted between the client and the resource by the user. If any such consent exists, then a token will be returned containing all scopes granted by the user for that resource. However, if no permission has been granted, or the `prompt=consent` parameter has been provided, a consent prompt will be shown for all scopes registered by the client application.

#### Example 1: The user, or tenant admin, has granted permissions

The user (or a tenant administrator) has granted the client the Microsoft Graph permissions `mail.read` and `user.read`. If the client makes a request for `scope=https://graph.microsoft.com/.default`, then no consent prompt will be shown regardless of the contents of the client applications registered permissions for Microsoft Graph. A token would be returned containing the scopes `mail.read` and `user.read`.

#### Example 2: The user hasn't granted permissions between the client and the resource

No consent for the user exists between the client and Microsoft Graph. The client has registered for the `user.read` and `contacts.read` permissions, as well as the Azure Key Vault scope `https://vault.azure.net/user_impersonation`. When the client requests a token for `scope=https://graph.microsoft.com/.default`, the user will see a consent screen for the `user.read`, `contacts.read`, and the Key Vault `user_impersonation` scopes. The token returned will have just the `user.read` and `contacts.read` scopes in it.

#### Example 3: The user has consented and the client requests additional scopes

The user has already consented to `mail.read` for the client. The client has registered for the `contacts.read` scope in its registration. When the client makes a request for a token using `scope=https://graph.microsoft.com/.default` and requests consent through `prompt=consent`, then the user will see a consent screen for only and all the permissions registered by the application. `contacts.read` will be present in the consent screen, but `mail.read` will not. The token returned will be for Microsoft Graph and will contain `mail.read` and `contacts.read`.

### Using the /.default scope with the client

A special case of the `/.default` scope exists where a client requests its own `/.default` scope. The following example demonstrates this scenario.

```
// Line breaks are for legibility only.

GET https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize?
response_type=token            //code or a hybrid flow is also possible here
&client_id=9ada6f8a-6d83-41bc-b169-a306c21527a5
&scope=9ada6f8a-6d83-41bc-b169-a306c21527a5/.default
&redirect_uri=https%3A%2F%2Flocalhost
&state=1234
```

This produces a consent screen for all registered permissions (if applicable based on the above descriptions of consent and `/.default`), then returns an id_token, rather than an access token.  This behavior exists for certain legacy clients moving from ADAL to MSAL, and should not be used by new clients targeting the Microsoft identity platform endpoint.  

## Troubleshooting permissions and consent

If you or your application's users are seeing unexpected errors during the consent process, see this article for troubleshooting steps: [Unexpected error when performing consent to an application](../manage-apps/application-sign-in-unexpected-user-consent-error.md).
