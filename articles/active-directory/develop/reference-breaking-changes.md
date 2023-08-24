---
title: Updates and breaking changes
description: Learn about changes to the Microsoft identity platform that can impact your application.
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: reference
ms.date: 06/03/2023
ms.author: ryanwi
ms.reviewer: ludwignick
ms.custom: has-adal-ref
---

# What's new for authentication?

Microsoft periodically adds and modifies the features and functionality of the Microsoft identity platform to improve its security, usability, and standards compliance.

Unless otherwise noted, the changes described here apply only to applications registered after the stated effective date of the change.

Check this article regularly to learn about:

- Known issues and fixes
- Protocol changes
- Deprecated functionality

> [!TIP]
> To be notified of updates to this page, add this URL to your RSS feed reader:<br/>`https://learn.microsoft.com/api/search/rss?search=%22Azure+Active+Directory+breaking+changes+reference%22&locale=en-us`

## June 2023

### Omission of email claims with an unverified domain owner

**Effective date**: June 2023

**Endpoints impacted**: v2.0 and v1.0

**Change**

For **multi-tenant applications**, emails that aren't domain-owner verified are omitted by default when the optional `email` claim is requested in a token payload.

An email is considered to be domain-owner verified if:

1. The domain belongs to the tenant where the user account resides, and the tenant admin has done verification of the domain.
1. The email is from a Microsoft Account (MSA).
1. The email is from a Google account.
1. The email was used for authentication using the one-time passcode (OTP) flow.

It should also be noted that Facebook and SAML/WS-Fed accounts do not have verified domains.

## May 2023

### The Power BI administrator role will be renamed to Fabric Administrator.

**Effective date**: June 2023

**Endpoints impacted**: 
-	List roleDefinitions - Microsoft Graph v1.0
-	List directoryRoles - Microsoft Graph v1.0

**Change**

The Power BI Administrator role will be renamed to Fabric Administrator.  
 
On May 23, 2023, Microsoft unveiled Microsoft Fabric, which provides a Data Factory-powered data integration experience, Synapse-powered data engineering, data warehouse, data science, and real-time analytics experiences and business intelligence (BI) with Power BI — all hosted on a lake-centric SaaS solution. The tenant and capacity administration for these experiences are centralized in the Fabric Admin portal (previously known as the Power BI admin portal).  

Starting June 2023, the Power BI Administrator role will be renamed to Fabric Administrator to align with the changing scope and responsibility of this role. All applications including Azure Active Directory, Microsoft Graph APIs, Microsoft 365, and GDAP will start to reflect the new role name over the course of several weeks. 
 
As a reminder, your application code and scripts shouldn't make decisions based on role name or display name.


## December 2021

### AD FS users will see more login prompts to ensure that the correct user is signed in.

**Effective date**: December 2021

**Endpoints impacted**: Integrated Windows Authentication

**Protocol impacted**: Integrated Windows Authentication

**Change**

Today, when a user is sent to AD FS to authenticate, they'll be silently signed into any account that already has a session with AD FS. The silent sign-in occurs even if the user intended to sign into a different user account. To reduce the frequency of this incorrect sign-in occurring, starting in December Azure AD will send the `prompt=login` parameter to AD FS if the Web Account Manager in Windows provides Azure AD a `login_hint` during sign-in, which indicates a specific user is desired for sign-in.

When the above requirements are met (WAM is used to send the user to Azure AD to sign in, a `login_hint` is included, and the [AD FS instance for the user's domain supports `prompt=login`](/windows-server/identity/ad-fs/operations/ad-fs-prompt-login)) the user won't be silently signed in, and instead asked to provide a username to continue signing into AD FS. If they wish to sign into their existing AD FS session, they can select the "Continue as current user" option displayed below the login prompt. Otherwise, they can continue with the username that they intend to sign in with.

This change will be rolled out in December 2021 over the course of several weeks. It doesn't change sign in behavior for:
* Applications that use IWA directly
* Applications using OAuth
* Domains that aren't federated to an AD FS instance

## October 2021

### Error 50105 has been fixed to not return `interaction_required` during interactive authentication

**Effective date**: October 2021

**Endpoints impacted**: v2.0 and v1.0

**Protocol impacted**: All user flows for apps [requiring user assignment](../manage-apps/what-is-access-management.md#requiring-user-assignment-for-an-app)

**Change**

Error 50105 (the current designation) is emitted when an unassigned user attempts to sign into an app that an admin has marked as requiring user assignment. This is a common access control pattern, and users must often find an admin to request assignment to unblock access. The error had a bug that would cause infinite loops in well-coded applications that correctly handled the `interaction_required` error response. `interaction_required` tells an app to perform interactive authentication, but even after doing so Azure AD would still return an `interaction_required` error response.

The error scenario has been updated, so that during non-interactive authentication (where `prompt=none` is used to hide UX), the app will be instructed to perform interactive authentication using an `interaction_required` error response. In the subsequent interactive authentication, Azure AD will now hold the user and show an error message directly, preventing a loop from occurring.

As a reminder, your application code shouldn't make decisions based on error code strings like `AADSTS50105`. Instead, [follow our error-handling guidance](reference-error-codes.md#handling-error-codes-in-your-application) and use the [standardized authentication responses](https://openid.net/specs/openid-connect-core-1_0.html#AuthError) like `interaction_required` and `login_required` found in the standard `error` field in the response. The other response fields are intended for consumption only by humans troubleshooting their issues.

You can review the current text of the 50105 error and more on the error lookup service: https://login.microsoftonline.com/error?code=50105.

### AppId Uri in single tenant applications will require use of default scheme or verified domains

**Effective date**: October 2021

**Endpoints impacted**: v2.0 and v1.0

**Protocol impacted**: All flows

**Change**

For single tenant applications, adding or updating the AppId URI validates that the domain in the HTTPS scheme URI is listed in the verified domain list in the customer tenant or that the value uses the default scheme (`api://{appId}`) provided by Azure AD. This could prevent applications from adding an AppId URI if the domain isn't in the verified domain list or the value doesn't use the default scheme.
To find more information on verified domains, refer to the [custom domains documentation](../../active-directory/fundamentals/add-custom-domain.md).

The change doesn't affect existing applications using unverified domains in their AppID URI. It validates only new applications or when an existing application updates an identifier URI or adds a new one to the identifierUri collection. The new restrictions apply only to URIs added to an app's identifierUris collection after October 15, 2021. AppId URIs already in an application's identifierUris collection when the restriction takes effect on October 15, 2021 will continue to function even if you add new URIs to that collection.

If a request fails the validation check, the application API for create/update will return a `400 badrequest` to the client indicating HostNameNotOnVerifiedDomain.

[!INCLUDE [active-directory-identifierUri](../../../includes/active-directory-identifier-uri-patterns.md)]

>[!NOTE]
> While it is safe to remove the identifierUris for app registrations within the current tenant, removing the identifierUris may cause clients to fail for other app registrations. 

## August 2021

### Conditional Access will only trigger for explicitly requested scopes

**Effective date**: August 2021, with gradual rollout starting in April.

**Endpoints impacted**: v2.0

**Protocol impacted**: All flows using [dynamic consent](v2-permissions-and-consent.md#requesting-individual-user-consent)

Applications using dynamic consent today are given all the permissions they have consent for, even if they weren't requested by name in the `scope` parameter. An app requesting only `user.read` but with consent to `files.read` can be forced to pass the Conditional Access requirement assigned for `files.read`, for example.

To reduce the number of unnecessary Conditional Access prompts, Azure AD is changing the way scopes are provided to applications so only explicitly requested scopes trigger Conditional Access. Applications relying on Azure AD's previous behavior of including _all_ scopes in the token--whether requested or not--may break due to missing scopes.

Apps will now receive access tokens with a mix of permissions: requested tokens and those they have consent for that don't require Conditional Access prompts. The scope of access for the token is reflected in the token response's `scope` parameter.

This change will be made for all apps except those with an observed dependency on this behavior. Developers will receive outreach if they're exempted from this change, as them may have a dependency on the additional Conditional Access prompts.

**Examples**

An app has consent for `user.read`, `files.readwrite`, and `tasks.read`. `files.readwrite` has Conditional Access policies applied to it, while the other two don't. If an app makes a token request for `scope=user.read`, and the currently signed in user hasn't passed any Conditional Access policies, then the resulting token will be for the `user.read` and `tasks.read` permissions. `tasks.read` is included because the app has consent for it, and it doesn't require a Conditional Access policy to be enforced.

If the app then requests `scope=files.readwrite`, the Conditional Access required by the tenant will trigger, forcing the app to show an interactive auth prompt where the Conditional Access policy can be satisfied. The token returned will have all three scopes in it.

If the app then makes one last request for any of the three scopes (say, `scope=tasks.read`), Azure AD will see that the user has already completed the Conditional Access policies needed for `files.readwrite`, and again issue a token with all three permissions in it.


## June 2021

### The device code flow UX will now include an app confirmation prompt

**Effective date**: June 2021.

**Endpoints impacted**: v2.0 and v1.0

**Protocol impacted**: The [device code flow](v2-oauth2-device-code.md)

To help prevent phishing attacks, the device code flow now includes a prompt that validates the user is signing into the app they expect.

The prompt that appears looks like this:

:::image type="content" source="media/breaking-changes/device-code-flow-prompt.png" alt-text="New prompt, reading 'Are you trying to sign in to the Azure CLI?'":::

## May 2020

### Bug fix: Azure AD will no longer URL-encode the state parameter twice

**Effective date**: May 2021

**Endpoints impacted**: v1.0 and v2.0

**Protocol impacted**: All flows that visit the `/authorize` endpoint (implicit flow and authorization code flow)

A bug was found and fixed in the Azure AD authorization response. During the `/authorize` leg of authentication, the `state` parameter from the request is included in the response, to preserve app state and help prevent CSRF attacks. Azure AD incorrectly URL-encoded the `state` parameter before inserting it into the response, where it was encoded once more. This would result in applications incorrectly rejecting the response from Azure AD.

Azure AD will no longer double-encode this parameter, allowing apps to correctly parse the result. This change will be made for all applications.

### Azure Government endpoints are changing

**Effective date**: May 5, 2020 (Finishing June 2020)

**Endpoints impacted**: All

**Protocol impacted**: All flows

On 1 June 2018, the official Azure Active Directory (Azure AD) Authority for Azure Government changed from `https://login-us.microsoftonline.com` to `https://login.microsoftonline.us`. This change also applied to Microsoft 365 GCC High and DoD, which Azure Government Azure AD also services. If you own an application within a US Government tenant, you must update your application to sign users in on the `.us` endpoint.

On May 5, 2020, Azure AD will begin enforcing the endpoint change, blocking government users from signing into apps hosted in US Government tenants using the public endpoint (`microsoftonline.com`). Impacted apps will begin seeing an error `AADSTS900439` - `USGClientNotSupportedOnPublicEndpoint`. This error indicates that the app is attempting to sign in a US Government user on the public cloud endpoint. If your app is in a public cloud tenant and intended to support US Government users, you'll need to [update your app to support them explicitly](./authentication-national-cloud.md). This may require creating a new app registration in the US Government cloud.

Enforcement of this change will be done using a gradual rollout based on how frequently users from the US Government cloud sign in to the application - apps signing in US Government users infrequently will see enforcement first, and apps frequently used by US Government users will be last to have enforcement applied. We expect enforcement to be complete across all apps in June 2020.

For more details, please see the [Azure Government blog post on this migration](https://devblogs.microsoft.com/azuregov/azure-government-aad-authority-endpoint-update/).

## March 2020

### User passwords will be restricted to 256 characters.

**Effective date**: March 13, 2020

**Endpoints impacted**: All

**Protocol impacted**: All user flows.

Users with passwords longer than 256 characters who sign in directly to Azure AD (not a federated IDP, like AD FS) will be asked to change their passwords before they can sign in. Admins may receive requests to help reset the users password.

The error in the sign-in logs will be similar to _AADSTS 50052: InvalidPasswordExceedsMaxLength_.

Message: `The password entered exceeds the maximum length of 256. Please reach out to your admin to reset the password.`

Remediation:

The user is unable to log in because their password exceeds the permitted maximum length. They should contact their admin to reset the password. If SSPR is enabled for their tenant, they can reset their password by following the "Forgot your password" link.

## February 2020

### Empty fragments will be appended to every HTTP redirect from the login endpoint.

**Effective date**: February 8, 2020

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: OAuth and OIDC flows that use `response_type=query` - this covers the [authorization code flow](v2-oauth2-auth-code-flow.md) in some cases, and the [implicit flow](v2-oauth2-implicit-grant-flow.md).

When an authentication response is sent from _login.microsoftonline.com_ to an application via HTTP redirect, the service will append an empty fragment to the reply URL. This prevents a class of redirect attacks by ensuring that the browser wipes out any existing fragment in the authentication request. No apps should have a dependency on this behavior.


## August 2019

### POST form semantics will be enforced more strictly - spaces and quotes will be ignored

**Effective date**: September 2, 2019

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: Anywhere POST is used ([client credentials](./v2-oauth2-client-creds-grant-flow.md), [authorization code redemption](./v2-oauth2-auth-code-flow.md), [ROPC](./v2-oauth-ropc.md), [OBO](./v2-oauth2-on-behalf-of-flow.md), and [refresh token redemption](./v2-oauth2-auth-code-flow.md#refresh-the-access-token))

Beginning the week of September 2, 2019, authentication requests that use the POST method will be validated using stricter HTTP standards. Specifically, spaces and double-quotes (") will no longer be removed from request form values. These changes aren't expected to break any existing clients, and will ensure that requests sent to Azure AD are reliably handled every time. In the future (see above) we plan to additionally reject duplicate parameters and ignore the BOM within requests.

Example:

Today, `?e=    "f"&g=h` is parsed identically as `?e=f&g=h` - so `e` == `f`. With this change, it would now be parsed so that `e` == `    "f"` - this is unlikely to be a valid argument, and the request would now fail.


## July 2019

### App-only tokens for single-tenant applications are only issued if the client app exists in the resource tenant

**Effective date**: July 26, 2019

**Endpoints impacted**: Both v1.0 and [v2.0](./v2-oauth2-client-creds-grant-flow.md)

**Protocol impacted**: Client Credentials (app-only tokens)

A security change took effect on July 26, 2019 changing the way app-only tokens (via the client credentials grant) are issued. Previously, applications were allowed to get tokens to call any other app, regardless of presence in the tenant or roles consented to for that application. This behavior has been updated so that for resources (sometimes called web APIs) set to be single-tenant (the default), the client application must exist within the resource tenant. Existing consent between the client and the API is still not required, and apps should still be doing their own authorization checks to ensure that a `roles` claim is present and contains the expected value for the API.

The error message for this scenario currently states:

`The service principal named <appName> was not found in the tenant named <tenant_name>. This can happen if the application has not been installed by the administrator of the tenant.`

To remedy this issue, use the Admin Consent experience to create the client application service principal in your tenant, or create it manually. This requirement ensures that the tenant has given the application permission to operate within the tenant.

#### Example request

`https://login.microsoftonline.com/contoso.com/oauth2/authorize?resource=https://gateway.contoso.com/api&response_type=token&client_id=14c88eee-b3e2-4bb0-9233-f5e3053b3a28&...`
In this example, the resource tenant (authority) is contoso.com, the resource app is a single-tenant app called `gateway.contoso.com/api` for the Contoso tenant, and the client app is `14c88eee-b3e2-4bb0-9233-f5e3053b3a28`. If the client app has a service principal within Contoso.com, this request can continue. If it doesn't, however, then the request will fail with the error above.

If the Contoso gateway app were a multi-tenant application, however, then the request would continue regardless of the client app having a service principal within Contoso.com.

### Redirect URIs can now contain query string parameters

**Effective date**: July 22, 2019

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: All flows

Per [RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2), Azure AD applications can now register and use redirect (reply) URIs with static query parameters (such as `https://contoso.com/oauth2?idp=microsoft`) for OAuth 2.0 requests. Dynamic redirect URIs are still forbidden as they represent a security risk, and this can't be used to retain state information across an authentication request - for that, use the `state` parameter.

The static query parameter is subject to string matching for redirect URIs like any other part of the redirect URI - if no string is registered that matches the URI-decoded redirect_uri, then the request will be rejected. If the URI is found in the app registration, then the entire string will be used to redirect the user, including the static query parameter.

At this time (End of July 2019), the app registration UX in Azure portal still block query parameters. However, you can edit the application manifest manually to add query parameters and test this in your app.


## March 2019

### Looping clients will be interrupted

**Effective date**: March 25, 2019

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: All flows

Client applications can sometimes misbehave, issuing hundreds of the same login request over a short period of time. These requests may or may not be successful, but they all contribute to poor user experience and heightened workloads for the IDP, increasing latency for all users and reducing availability of the IDP. These applications are operating outside the bounds of normal usage, and should be updated to behave correctly.

Clients that issue duplicate requests multiple times will be sent an `invalid_grant` error:
`AADSTS50196: The server terminated an operation because it encountered a loop while processing a request`.

Most clients won't need to change behavior to avoid this error. Only misconfigured clients (those without token caching or those exhibiting prompt loops already) will be impacted by this error. Clients are tracked on a per-instance basis locally (via cookie) on the following factors:

* User hint, if any

* Scopes or resource being requested

* Client ID

* Redirect URI

* Response type and mode

Apps making multiple requests (15+) in a short period of time (5 minutes) will receive an `invalid_grant` error explaining that they're looping. The tokens being requested have sufficiently long-lived lifetimes (10 minutes minimum, 60 minutes by default), so repeated requests over this time period are unnecessary.

All apps should handle `invalid_grant` by showing an interactive prompt, rather than silently requesting a token. To avoid this error, clients should ensure they're correctly caching the tokens they receive.


## October 2018

### Authorization codes can no longer be reused

**Effective date**: November 15, 2018

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: [Code flow](v2-oauth2-auth-code-flow.md)

Starting on November 15, 2018, Azure AD will stop accepting previously used authentication codes for apps. This security change helps to bring Azure AD in line with the OAuth specification and will be enforced on both the v1 and v2 endpoints.

If your app reuses authorization codes to get tokens for multiple resources, we recommend that you use the code to get a refresh token, and then use that refresh token to acquire additional tokens for other resources. Authorization codes can only be used once, but refresh tokens can be used multiple times across multiple resources. Any new app that attempts to reuse an authentication code during the OAuth code flow will get an invalid_grant error.

For more information about refresh tokens, see [Refreshing the access tokens](v2-oauth2-auth-code-flow.md#refresh-the-access-token). If using ADAL or MSAL, this is handled for you by the library - replace the second instance of `AcquireTokenByAuthorizationCodeAsync` with `AcquireTokenSilentAsync`.

## May 2018

### ID tokens can't be used for the OBO flow

**Date**: May 1, 2018

**Endpoints impacted**: Both v1.0 and v2.0

**Protocols impacted**: Implicit flow and [on-behalf-of flow](v2-oauth2-on-behalf-of-flow.md)

After May 1, 2018, id_tokens can't be used as the assertion in an OBO flow for new applications. Access tokens should be used instead to secure APIs, even between a client and middle tier of the same application. Apps registered before May 1, 2018 will continue to work and be able to exchange id_tokens for an access token; however, this pattern isn't considered a best practice.

To work around this change, you can do the following:

1. Create a web API for your application, with one or more scopes. This explicit entry point will allow finer grained control and security.
1. In your app's manifest, in the [Azure portal](https://portal.azure.com) or the [app registration portal](https://apps.dev.microsoft.com), ensure that the app is allowed to issue access tokens via the implicit flow. This is controlled through the `oauth2AllowImplicitFlow` key.
1. When your client application requests an id_token via `response_type=id_token`, also request an access token (`response_type=token`) for the web API created above. Thus, when using the v2.0 endpoint the `scope` parameter should look similar to `api://GUID/SCOPE`. On the v1.0 endpoint, the `resource` parameter should be the app URI of the web API.
1. Pass this access token to the middle tier in place of the id_token.
