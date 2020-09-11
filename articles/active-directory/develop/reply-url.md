---
title: Redirect URI (reply URL) restrictions | Azure
titleSuffix: Microsoft identity platform
description: A description of the restrictions and limitations on redirect URI (reply URL) format enforced by the Microsoft identity platform.
author: SureshJa
ms.author: sureshja
manager: CelesteDG
ms.date: 08/07/2020
ms.topic: conceptual
ms.subservice: develop
ms.custom: aaddev
ms.service: active-directory
ms.reviewer: lenalepa, manrath
---
# Redirect URI (reply URL) restrictions and limitations

A redirect URI, or reply URL, is the location where the authorization server sends the user once the app has been successfully authorized and granted an authorization code or access token. The authorization server sends the code or token to the redirect URI, so it's important you register the correct location as part of the app registration process.

 The following restrictions apply to redirect URIs:

* The redirect URI must begin with the scheme `https`.

* The redirect URI is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`,  do not specify `.../ABC/response-oidc` in the redirect URI. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.

## Maximum number of redirect URIs

This table shows the maximum number of redirect URIs you can add to an app registration in the Microsoft identity platform.

| Accounts being signed in | Maximum number of redirect URIs | Description |
|--------------------------|---------------------------------|-------------|
| Microsoft work or school accounts in any organization's Azure Active Directory (Azure AD) tenant | 256 | `signInAudience` field in the application manifest is set to either *AzureADMyOrg* or *AzureADMultipleOrgs* |
| Personal Microsoft accounts and work and school accounts | 100 | `signInAudience` field in the application manifest is set to *AzureADandPersonalMicrosoftAccount* |

## Maximum URI length

You can use a maximum of 256 characters for each redirect URI you add to an app registration.

## Supported schemes

The Azure Active Directory (Azure AD) application model currently supports both HTTP and HTTPS schemes for apps that sign in work or school accounts in any organization's Azure AD tenant. These account types are specified by the `AzureADMyOrg` and `AzureADMultipleOrgs` values in the `signInAudience` field of the application manifest. For apps that sign in personal Microsoft accounts (MSA) *and* work and school accounts (that is, the `signInAudience` is set to `AzureADandPersonalMicrosoftAccount`), only the HTTPS scheme is allowed.

To add redirect URIs with an HTTP scheme to app registrations that sign in work or school accounts, you need to use the application manifest editor in [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) in the Azure portal. However, though it's possible to set an HTTP-based redirect URI by using the manifest editor, we *strongly* recommend that you use the HTTPS scheme for your redirect URIs.

## Localhost exceptions

Per [RFC 8252 sections 8.3](https://tools.ietf.org/html/rfc8252#section-8.3) and [7.3](https://tools.ietf.org/html/rfc8252#section-7.3), "loopback" or "localhost" redirect URIs come with two special considerations:

1. `http` URI schemes are acceptable because the redirect never leaves the device. As such, both of these are acceptable:
    - `http://127.0.0.1/myApp`
    - `https://127.0.0.1/myApp`
1. Due to ephemeral port ranges often required by native applications, the port component (for example, `:5001` or `:443`) is ignored for the purposes of matching a redirect URI. As a result, all of these are considered equivalent:
    - `http://127.0.0.1/MyApp`
    - `http://127.0.0.1:1234/MyApp`
    - `http://127.0.0.1:5000/MyApp`
    - `http://127.0.0.1:8080/MyApp`

From a development standpoint, this means a few things:

* Do not register multiple redirect URIs where only the port differs. The login server will pick one arbitrarily and use the behavior associated with that redirect URI (for example, whether it's `web`-, `native`-, or `spa`-type redirect).
* If you need to register multiple redirect URIs on localhost to test different flows during development, differentiate them using the *path* component of the URI. For example, `http://127.0.0.1/MyWebApp` doesn't match `http://127.0.0.1/MyNativeApp`.
* Per RFC guidance, you should not use `localhost` in the redirect URI. Instead, use the actual loopback IP address, `127.0.0.1`. This prevents your app from being broken by misconfigured firewalls or renamed network interfaces.

    To use the `http` scheme with the loopback address (127.0.0.1) instead of localhost, you must edit the [application manifest](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest#replyurls-attribute). 

    The IPv6 loopback address (`[::1]`) is not currently supported.

## Restrictions on wildcards in redirect URIs

Wildcard URIs like `https://*.contoso.com` may seem convenient, but should be avoided due to security implications. According to the OAuth 2.0 specification ([section 3.1.2 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2)), a redirection endpoint URI must be an absolute URI.

Wildcard URIs are currently unsupported in app registrations configured to sign in personal Microsoft accounts and work or school accounts. Wildcard URIs are allowed, however, for apps that are configured to sign in only work or school accounts in an organization's Azure AD tenant.

To add redirect URIs with wildcards to app registrations that sign in work or school accounts, you need to use the application manifest editor in [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) in the Azure portal. Though it's possible to set a redirect URI with a wildcard by using the manifest editor, we *strongly* recommend you adhere to [section 3.1.2 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2) and use only absolute URIs.

If your scenario requires more redirect URIs than the maximum limit allowed, consider the [following approach](#use-a-state-parameter) instead of adding a wildcard redirect URI.

### Use a state parameter

If you have several subdomains and your scenario requires that, upon successful authentication, you redirect users to the same page from which they started, using a state parameter might be helpful.

In this approach:

1. Create a "shared" redirect URI per application to process the security tokens you receive from the authorization endpoint.
1. Your application can send application-specific parameters (such as subdomain URL where the user originated or anything like branding information) in the state parameter. When using a state parameter, guard against CSRF protection as specified in [section 10.12 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-10.12)).
1. The application-specific parameters will include all the information needed for the application to render the correct experience for the user, that is, construct the appropriate application state. The Azure AD authorization endpoint strips HTML from the state parameter so make sure you are not passing HTML content in this parameter.
1. When Azure AD sends a response to the "shared" redirect URI, it will send the state parameter back to the application.
1. The application can then use the value in the state parameter to determine which URL to further send the user to. Make sure you validate for CSRF protection.

> [!WARNING]
> This approach allows a compromised client to modify the additional parameters sent in the state parameter, thereby redirecting the user to a different URL, which is the [open redirector threat](https://tools.ietf.org/html/rfc6819#section-4.2.4) described in RFC 6819. Therefore, the client must protect these parameters by encrypting the state or verifying it by some other means, like validating the domain name in the redirect URI against the token.

## Next steps

Learn about the app registration [Application manifest](reference-app-manifest.md).
