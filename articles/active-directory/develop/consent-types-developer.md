---
title: Microsoft identity platform scopes, permissions, & consent
description: Learn about authorization in the Microsoft identity platform endpoint, including scopes, permissions, and consent.
services: active-directory
author: omondiatieno
manager: mwongerapk

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 09/20/2022
ms.author: marsma
ms.reviewer: jawoods, ludwignick, phsignor
ms.custom: aaddev, fasttrack-edit, contperf-fy21q1, identityplatformtop40, has-adal-ref
---
# Consent types

Applications in Microsoft identity platform rely on consent in order to gain access to necessary resources or APIs. There are a number of kinds of consent that your app may need to know about in order to be successful. If you are defining permissions, you will also need to understand how your users will gain access to your app or API.

### Static user consent 

In the static user consent scenario, you must specify all the permissions it needs in the app's configuration in the Azure portal. If the user (or administrator, as appropriate) has not granted consent for this app, then Microsoft identity platform will prompt the user to provide consent at this time.

Static permissions also enables administrators to [consent on behalf of all users](#requesting-consent-for-an-entire-tenant) in the organization.

While static permissions of the app defined in the Azure portal keep the code nice and simple, it presents some possible issues for developers:

- The app needs to request all the permissions it would ever need upon the user's first sign-in. This can lead to a long list of permissions that discourages end users from approving the app's access on initial sign-in.

- The app needs to know all of the resources it would ever access ahead of time. It is difficult to create apps that could access an arbitrary number of resources.

### Incremental and dynamic user consent

With the Microsoft identity platform endpoint, you can ignore the static permissions defined in the app registration information in the Azure portal and request permissions incrementally instead.  You can ask for a bare minimum set of permissions upfront and request more over time as the customer uses additional app features. To do so, you can specify the scopes your app needs at any time by including the new scopes in the `scope` parameter when [requesting an access token](#requesting-individual-user-consent) - without the need to pre-define them in the application registration information. If the user hasn't yet consented to new scopes added to the request, they'll be prompted to consent only to the new permissions. Incremental, or dynamic consent, only applies to delegated permissions and not to application permissions.

Allowing an app to request permissions dynamically through the `scope` parameter gives developers full control over your user's experience. You can also front load your consent experience and ask for all permissions in one initial authorization request. If your app requires a large number of permissions, you can gather those permissions from the user incrementally as they try to use certain features of the app over time.

> [!IMPORTANT]
> Dynamic consent can be convenient, but presents a big challenge for permissions that require admin consent.  The admin consent experience in the **App registrations** and **Enterprise applications** blades in the portal doesn't know about those dynamic permissions at consent time. We recommend that a developer list all the admin privileged permissions that are needed by the app in the portal.  This enables tenant admins to consent on behalf of all their users in the portal, once.  Users won't need to go through the consent experience for those permissions on sign in. The alternative is to use dynamic consent for those permissions. To grant admin consent, an individual admin signs in to the app, triggers a consent prompt for the appropriate permissions, and selects **consent for my entire org** in the consent dialogue.

### Admin consent

[Admin consent](#using-the-admin-consent-endpoint) is required when your app needs access to certain high-privilege permissions. Admin consent ensures that administrators have some additional controls before authorizing apps or users to access highly privileged data from the organization.

[Admin consent done on behalf of an organization](#requesting-consent-for-an-entire-tenant) is highly recommended if your app has an enterprise audience. Admin consent done on behalf of an organization requires the static permissions to be registered for the app in the portal. Set those permissions for apps in the app registration portal if you need an admin to give consent on behalf of the entire organization.  The admin can consent to those permissions on behalf of all users in the org, once.  The users will not need to go through the consent experience for those permissions when signing in to the app. This is easier for users and reduces the cycles required by the organization admin to set up the application.

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

At this time, the `offline_access` ("Maintain access to data you have given it access to") permission and `User.Read` ("Sign you in and read your profile") permission are automatically included in the initial consent to an application.  These permissions are generally required for proper app functionality. The `offline_access` permission gives the app access to refresh tokens that are critical for native apps and web apps. The `User.Read` permission gives access to the `sub` claim. It allows the client or app to correctly identify the user over time and access rudimentary user information.

![Example screenshot that shows work account consent.](./media/v2-permissions-and-consent/work_account_consent.png)

When the user approves the permission request, consent is recorded. The user doesn't have to consent again when they later sign in to the application.

## Requesting consent for an entire tenant

When an organization purchases a license or subscription for an application, the organization often wants to proactively set up the application for use by all members of the organization. As part of this process, an administrator can grant consent for the application to act on behalf of any user in the tenant. If the admin grants consent for the entire tenant, the organization's users don't see a consent page for the application.

Admin consent done on behalf of an organization requires the static permissions registered for the app. Set those permissions for apps in the app registration portal if you need an admin to give consent on behalf of the entire organization.

To request consent for delegated permissions for all users in a tenant, your app can use the [admin consent endpoint](#using-the-admin-consent-endpoint).

Additionally, applications must use the admin consent endpoint to request application permissions.

## Admin-restricted permissions

Some high-privilege permissions in Microsoft resources can be set to *admin-restricted*. Here are some examples of these kinds of permissions:

* Read all user's full profiles by using `User.Read.All`
* Write data to an organization's directory by using `Directory.ReadWrite.All`
* Read all groups in an organization's directory by using `Groups.Read.All`

> [!NOTE]
>In requests to the authorization, token or consent endpoints for the Microsoft Identity platform, if the resource identifier is omitted in the scope parameter, the resource is assumed to be Microsoft Graph. For example, `scope=User.Read` is equivalent to `https://graph.microsoft.com/User.Read`.

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

In the app registration portal, applications can list the permissions they require, including both delegated permissions and application permissions. This setup allows the use of the `.default` scope and the Azure portal's **Grant admin consent** option.  

In general, the permissions should be statically defined for a given application. They should be a superset of the permissions that the app will request dynamically or incrementally.

> [!NOTE]
>Application permissions can be requested only through the use of [`.default`](#the-default-scope). So if your app needs application permissions, make sure they're listed in the app registration portal.

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
|`scope`        | Required        | Defines the set of permissions being requested by the application. Scopes can be either static (using [`.default`](#the-default-scope)) or dynamic.  This set can include the OpenID Connect scopes (`openid`, `profile`, `email`). If you need application permissions, you must use `.default` to request the statically configured list of permissions.  |


At this point, Azure AD requires a tenant administrator to sign in to complete the request. The administrator is asked to approve all the permissions that you requested in the `scope` parameter.  If you used a static (`.default`) value, it will function like the v1.0 admin consent endpoint and request consent for all scopes found in the required permissions for the app.

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
    "scope": "https://outlook.office.com/Mail.Read https://outlook.office.com/mail.send",
    "code": "AwABAAAAvPM1KaPlrEqdFSBzjqfTGBCmLdgfSTLEMPGYuNHSUYBrq...",
    "redirect_uri": "https://localhost/myapp",
    "client_secret": "zc53fwe80980293klaj9823"  // NOTE: Only required for web apps
}
```

You can use the resulting access token in HTTP requests to the resource. It reliably indicates to the resource that your app has the proper permission to do a specific task.

For more information about the OAuth 2.0 protocol and how to get access tokens, see the [Microsoft identity platform endpoint protocol reference](active-directory-v2-protocols.md).