---
title: Azure Active Directory breaking changes reference
description: Learn about changes made to the Azure AD protocols that may impact your application.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 5/4/2020
ms.author: ryanwi
ms.reviewer: hirsin
ms.custom: aaddev
---

# What's new for authentication?

>Get notified about updates to this page. Just add [this URL](https://docs.microsoft.com/api/search/rss?search=%22whats%20new%20for%20authentication%22&locale=en-us) to your RSS feed reader.

The authentication system alters and adds features on an ongoing basis to improve security and standards compliance. To stay up-to-date with the most recent developments, this article provides you with information about the following details:

- Latest features
- Known issues
- Protocol changes
- Deprecated functionality

> [!TIP]
> This page is updated regularly, so visit often. Unless otherwise noted, these changes are only put in place for newly registered applications.

## Upcoming changes

None scheduled at this time.  Please see below for the changes that are in or are coming to production.

## May 2020

### Azure Government endpoints are changing

**Effective date**: May 5th (Finishing June 2020) 

**Endpoints impacted**: All

**Protocol impacted**: All flows

On 1 June 2018, the official Azure Active Directory (AAD) Authority for Azure Government changed from `https://login-us.microsoftonline.com` to `https://login.microsoftonline.us`. This change also applied to Microsoft 365 GCC High and DoD, which Azure Government AAD also services. If you own an application within a US Government tenant, you must update your application to sign users in on the `.us` endpoint.  

Starting May 5th, Azure AD will begin enforcing the endpoint change, blocking government users from signing into apps hosted in US Government tenants using the public endpoint (`microsoftonline.com`).  Impacted apps will begin seeing an error `AADSTS900439` - `USGClientNotSupportedOnPublicEndpoint`. This error indicates that the app is attempting to sign in a US Government user on the public cloud endpoint. If your app is in a public cloud tenant and intended to support US Government users, you will need to [update your app to support them explicitly](https://docs.microsoft.com/azure/active-directory/develop/authentication-national-cloud). This may require creating a new app registration in the US Government cloud. 

Enforcement of this change will be done using a gradual rollout based on how frequently users from the US Government cloud sign in to the application - apps signing in US Government users infrequently will see enforcement first, and apps frequently used by US Government users will be last to have enforcement applied. We expect enforcement to be complete across all apps in June 2020. 

For more details, please see the [Azure Government blog post on this migration](https://devblogs.microsoft.com/azuregov/azure-government-aad-authority-endpoint-update/). 

## March 2020

### User passwords will be restricted to 256 characters.

**Effective date**: March 13, 2020

**Endpoints impacted**: All

**Protocol impacted**: All user flows.

Users with passwords longer than 256 characters that sign in directly to Azure AD (as opposed to a federated IDP like ADFS) will be unable to sign in starting March 13, 2020, and be asked to reset their password instead.  Admins may recieve requests to help reset the users password.

The error in the sign in logs will be AADSTS 50052: InvalidPasswordExceedsMaxLength

Message: `The password entered exceeds the maximum length of 256. Please reach out to your admin to reset the password.`

Remediation:

The user is unable to login because their password exceeds the permitted maximum length. They should contact their admin to reset the password. If SSPR is enabled for their tenant, they can reset their password by following the "Forgot your password" link.



## February 2020

### Empty fragments will be appended to every HTTP redirect from the login endpoint.

**Effective date**: February 8, 2020

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: OAuth and OIDC flows that use response_type=query - this covers the [authorization code flow](v2-oauth2-auth-code-flow.md) in some cases, and the [implicit flow](v2-oauth2-implicit-grant-flow.md).

When an authentication response is sent from login.microsoftonline.com to an application via HTTP redirect, the service will append an empty fragment to the reply URL.  This prevents a class of redirect attacks by ensuring that the browser wipes out any existing fragment in the authentication request.  No apps should have a dependency on this behavior.


## August 2019

### POST form semantics will be enforced more strictly - spaces and quotes will be ignored

**Effective date**: September 2, 2019

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: Anywhere POST is used ([client credentials](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow), [authorization code redemption](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow), [ROPC](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth-ropc), [OBO](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow), and [refresh token redemption](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-auth-code-flow#refresh-the-access-token))

Starting the week of 9/2, authentication requests that use the POST method will be validated using stricter HTTP standards.  Specifically, spaces and double-quotes (“) will no longer be removed from request form values. These changes are not expected to break any existing clients, and will ensure that requests sent to Azure AD are reliably handled every time. In the future (see above) we plan to additionally reject duplicate parameters and ignore the BOM within requests.

Example:

Today, `?e=    "f"&g=h` is parsed identically as `?e=f&g=h` - so `e` == `f`.  With this change, it would now be parsed so that `e` == `    "f"` - this is unlikely to be a valid argument, and the request would now fail.


## July 2019

### App-only tokens for single-tenant applications are only issued if the client app exists in the resource tenant

**Effective date**: July 26, 2019

**Endpoints impacted**: Both [v1.0](https://docs.microsoft.com/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow) and [v2.0](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow)

**Protocol impacted**: [Client Credentials (app-only tokens)](https://docs.microsoft.com/azure/active-directory/develop/v1-oauth2-client-creds-grant-flow)

A security change went live July 26th that changes the way app-only tokens (via the client credentials grant) are issued. Previously, applications were allowed to get tokens to call any other app, regardless of presence in the tenant or roles consented to for that application.  This behavior has been updated so that for resources (sometimes called web APIs) set to be single-tenant (the default), the client application must exist within the resource tenant.  Note that existing consent between the client and the API is still not required, and apps should still be doing their own authorization checks to ensure that a `roles` claim is present and contains the expected value for the API.

The error message for this scenario currently states:

`The service principal named <appName> was not found in the tenant named <tenant_name>. This can happen if the application has not been installed by the administrator of the tenant.`

To remedy this issue, use the Admin Consent experience to create the client application service principal in your tenant, or create it manually.  This requirement ensures that the tenant has given the application permission to operate within the tenant.

#### Example request

`https://login.microsoftonline.com/contoso.com/oauth2/authorize?resource=https://gateway.contoso.com/api&response_type=token&client_id=14c88eee-b3e2-4bb0-9233-f5e3053b3a28&...`
In this example, the resource tenant (authority) is contoso.com, the resource app is a single-tenant app called `gateway.contoso.com/api` for the Contoso tenant, and the client app is `14c88eee-b3e2-4bb0-9233-f5e3053b3a28`.  If the client app has a service principal within Contoso.com, this request can continue.  If it doesn't, however, then the request will fail with the error above.

If the Contoso gateway app were a multi-tenant application, however, then the request would continue regardless of the client app having a service principal within Contoso.com.

### Redirect URIs can now contain query string parameters

**Effective date**: July 22, 2019

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: All flows

Per [RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2), Azure AD applications can now register and use redirect (reply) URIs with static query parameters (such as `https://contoso.com/oauth2?idp=microsoft`) for OAuth 2.0 requests.  Dynamic redirect URIs are still forbidden as they represent a security risk, and this cannot be used to retain state information across an authentication request - for that, use the `state` parameter.

The static query parameter is subject to string matching for redirect URIs like any other part of the redirect URI - if no string is registered that matches the URI-decoded redirect_uri, then the request will be rejected.  If the URI is found in the app registration, then the entire string will be used to redirect the user, including the static query parameter.

Note that at this time (End of July 2019), the app registration UX in Azure portal still block query parameters.  However, you can edit the application manifest manually to add query parameters and test this in your app.


## March 2019

### Looping clients will be interrupted

**Effective date**: March 25, 2019

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: All flows

Client applications can sometimes misbehave, issuing hundreds of the same login request over a short period of time.  These requests may or may not be successful, but they all contribute to poor user experience and heightened workloads for the IDP, increasing latency for all users and reducing availability of the IDP.  These applications are operating outside the bounds of normal usage, and should be updated to behave correctly.

Clients that issue duplicate requests multiple times will be sent an `invalid_grant` error:
`AADSTS50196: The server terminated an operation because it encountered a loop while processing a request`.

Most clients will not need to change behavior to avoid this error.  Only misconfigured clients (those without token caching or those exhibiting prompt loops already) will be impacted by this error.  Clients are tracked on a per-instance basis locally (via cookie) on the following factors:

* User hint, if any

* Scopes or resource being requested

* Client ID

* Redirect URI

* Response type and mode

Apps making multiple requests (15+) in a short period of time (5 minutes) will receive an `invalid_grant` error explaining that they are looping.  The tokens being requested have sufficiently long-lived lifetimes (10 minutes minimum, 60 minutes by default), so repeated requests over this time period are unnecessary.

All apps should handle `invalid_grant` by showing an interactive prompt, rather than silently requesting a token.  In order to avoid this error, clients should ensure they are correctly caching the tokens they receive.


## October 2018

### Authorization codes can no longer be reused

**Effective date**: November 15, 2018

**Endpoints impacted**: Both v1.0 and v2.0

**Protocol impacted**: [Code flow](v2-oauth2-auth-code-flow.md)

Starting on November 15, 2018, Azure AD will stop accepting previously used authentication codes for apps. This security change helps to bring Azure AD in line with the OAuth specification and will be enforced on both the v1 and v2 endpoints.

If your app reuses authorization codes to get tokens for multiple resources, we recommend that you use the code to get a refresh token, and then use that refresh token to acquire additional tokens for other resources. Authorization codes can only be used once, but refresh tokens can be used multiple times across multiple resources. Any new app that attempts to reuse an authentication code during the OAuth code flow will get an invalid_grant error.

For more information about refresh tokens, see [Refreshing the access tokens](v2-oauth2-auth-code-flow.md#refresh-the-access-token).  If using ADAL or MSAL, this is handled for you by the library - replace the second instance of 'AcquireTokenByAuthorizationCodeAsync' with 'AcquireTokenSilentAsync'.

## May 2018

### ID tokens cannot be used for the OBO flow

**Date**: May 1, 2018

**Endpoints impacted**: Both v1.0 and v2.0

**Protocols impacted**: Implicit flow and [on-behalf-of flow](v2-oauth2-on-behalf-of-flow.md)

After May 1, 2018, id_tokens cannot be used as the assertion in an OBO flow for new applications. Access tokens should be used instead to secure APIs, even between a client and middle tier of the same application. Apps registered before May 1, 2018 will continue to work and be able to exchange id_tokens for an access token; however, this pattern is not considered a best practice.

To work around this change, you can do the following:

1. Create a web API for your application, with one or more scopes. This explicit entry point will allow finer grained control and security.
1. In your app's manifest, in the [Azure portal](https://portal.azure.com) or the [app registration portal](https://apps.dev.microsoft.com), ensure that the app is allowed to issue access tokens via the implicit flow. This is controlled through the `oauth2AllowImplicitFlow` key.
1. When your client application requests an id_token via `response_type=id_token`, also request an access token (`response_type=token`) for the web API created above. Thus, when using the v2.0 endpoint the `scope` parameter should look similar to `api://GUID/SCOPE`. On the v1.0 endpoint, the `resource` parameter should be the app URI of the web API.
1. Pass this access token to the middle tier in place of the id_token.
