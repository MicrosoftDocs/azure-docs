---
title: Redirect URI (reply URL) restrictions
description: A description of the restrictions and limitations on redirect URI (reply URL) format enforced by the Microsoft identity platform.
author: henrymbuguakiarie
manager: CelesteDG
ms.author: henrymbugua
ms.date: 08/25/2022
ms.reviewer: madansr7
ms.service: active-directory
ms.subservice: develop
ms.topic: reference
---

# Redirect URI (reply URL) restrictions and limitations

A redirect URI, or reply URL, is the location where the authorization server sends the user once the app has been successfully authorized and granted an authorization code or access token. The authorization server sends the code or token to the redirect URI, so it's important you register the correct location as part of the app registration process.

The Microsoft Entra application model specifies these restrictions to redirect URIs:

* Redirect URIs must begin with the scheme `https`. There are some [exceptions for localhost](#localhost-exceptions) redirect URIs.

* Redirect URIs are case-sensitive and must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`,  do not specify `.../ABC/response-oidc` in the redirect URI. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.

* Redirect URIs *not* configured with a path segment are returned with a trailing slash ('`/`') in the response. This applies only when the response mode is `query` or `fragment`.

    Examples:

    * `https://contoso.com` is returned as `https://contoso.com/`
    * `http://localhost:7071` is returned as `http://localhost:7071/`

* Redirect URIs that contain a path segment are *not* appended with a trailing slash in the response.

    Examples:

    * `https://contoso.com/abc` is returned as `https://contoso.com/abc`
    * `https://contoso.com/abc/response-oidc` is returned as `https://contoso.com/abc/response-oidc`

* Redirect URIs do not support special characters - `! $ ' ( ) , ;`

## Maximum number of redirect URIs

This table shows the maximum number of redirect URIs you can add to an app registration in the Microsoft identity platform.

| Accounts being signed in | Maximum number of redirect URIs | Description |
|--------------------------|---------------------------------|-------------|
| Microsoft work or school accounts in any organization's Microsoft Entra tenant | 256 | `signInAudience` field in the application manifest is set to either *AzureADMyOrg* or *AzureADMultipleOrgs* |
| Personal Microsoft accounts and work and school accounts | 100 | `signInAudience` field in the application manifest is set to *AzureADandPersonalMicrosoftAccount* |

The maximum number of redirect URIs can't be raised for [security reasons](#restrictions-on-wildcards-in-redirect-uris). If your scenario requires more redirect URIs than the maximum limit allowed, consider the following [state parameter approach](#use-a-state-parameter) as the solution.

## Maximum URI length

You can use a maximum of 256 characters for each redirect URI you add to an app registration.

## Redirect URIs in application vs. service principal objects

* Always add redirect URIs to the application object only.
* Do not add redirect URI values to a service principal because these values could be removed when the service principal object syncs with the application object. This could happen due to any update operation which triggers a sync between the two objects.

## Query parameter support in redirect URIs

Query parameters are **allowed** in redirect URIs for applications that *only* sign in users with work or school accounts.

Query parameters are **not allowed** in redirect URIs for any app registration configured to sign in users with personal Microsoft accounts like Outlook.com (Hotmail), Messenger, OneDrive, MSN, Xbox Live, or Microsoft 365.

| App registration sign-in audience                                                                                                  | Supports query parameters in redirect URI                            |
|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| Accounts in this organizational directory only (Contoso only - Single tenant)                                                      | :::image type="icon" source="media/common/yes.png" border="false"::: |
| Accounts in any organizational directory (Any Microsoft Entra directory - Multitenant)                                                    | :::image type="icon" source="media/common/yes.png" border="false"::: |
| Accounts in any organizational directory (Any Microsoft Entra directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox) | :::image type="icon" source="media/common/no.png" border="false":::  |
| Personal Microsoft accounts only                                                                                                   | :::image type="icon" source="media/common/no.png" border="false":::  |

## Supported schemes

**HTTPS**: The HTTPS scheme (`https://`) is supported for all HTTP-based redirect URIs.

**HTTP**: The HTTP scheme (`http://`) is supported *only* for *localhost* URIs and should be used only during active local application development and testing.

| Example redirect URI                    | Validity |
|-----------------------------------------|----------|
| `https://contoso.com`                   | Valid    |
| `https://contoso.com/abc/response-oidc` | Valid    |
| `https://localhost`                     | Valid    |
| `http://contoso.com/abc/response-oidc`  | Invalid  |
| `http://localhost`                      | Valid    |
| `http://localhost/abc`                  | Valid    |

### Localhost exceptions

Per [RFC 8252 sections 8.3](https://tools.ietf.org/html/rfc8252#section-8.3) and [7.3](https://tools.ietf.org/html/rfc8252#section-7.3), "loopback" or "localhost" redirect URIs come with two special considerations:

1. `http` URI schemes are acceptable because the redirect never leaves the device. As such, both of these URIs are acceptable:
    - `http://localhost/myApp`
    - `https://localhost/myApp`
1. Due to ephemeral port ranges often required by native applications, the port component (for example, `:5001` or `:443`) is ignored for the purposes of matching a redirect URI. As a result, all of these URIs are considered equivalent:
    - `http://localhost/MyApp`
    - `http://localhost:1234/MyApp`
    - `http://localhost:5000/MyApp`
    - `http://localhost:8080/MyApp`

From a development standpoint, this means a few things:

* Do not register multiple redirect URIs where only the port differs. The login server will pick one arbitrarily and use the behavior associated with that redirect URI (for example, whether it's a `web`-, `native`-, or `spa`-type redirect).

    This is especially important when you want to use different authentication flows in the same application registration, for example both the authorization code grant and implicit flow. To associate the correct response behavior with each redirect URI, the login server must be able to distinguish between the redirect URIs and cannot do so when only the port differs.
* To register multiple redirect URIs on localhost to test different flows during development, differentiate them using the *path* component of the URI. For example, `http://localhost/MyWebApp` doesn't match `http://localhost/MyNativeApp`.
* The IPv6 loopback address (`[::1]`) is not currently supported.

#### Prefer 127.0.0.1 over localhost

To prevent your app from being broken by misconfigured firewalls or renamed network interfaces, use the IP literal loopback address `127.0.0.1` in your redirect URI instead of `localhost`. For example, `https://127.0.0.1`.

You cannot, however, use the **Redirect URIs** text box in the Azure portal to add a loopback-based redirect URI that uses the `http` scheme:

:::image type="content" source="media/reply-url/portal-01-no-http-loopback-redirect-uri.png" alt-text="Error dialog in Azure portal showing disallowed http-based loopback redirect URI":::

To add a redirect URI that uses the `http` scheme with the `127.0.0.1` loopback address, you must currently modify the [replyUrlsWithType attribute in the application manifest](reference-app-manifest.md#replyurlswithtype-attribute).

## Restrictions on wildcards in redirect URIs

Wildcard URIs like `https://*.contoso.com` may seem convenient, but should be avoided due to security implications. According to the OAuth 2.0 specification ([section 3.1.2 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2)), a redirection endpoint URI must be an absolute URI. As such, when a configured wildcard URI matches a redirect URI, query strings and fragments in the redirect URI are stripped.

Wildcard URIs are currently unsupported in app registrations configured to sign in personal Microsoft accounts and work or school accounts. Wildcard URIs are allowed, however, for apps that are configured to sign in only work or school accounts in an organization's Microsoft Entra tenant.

To add redirect URIs with wildcards to app registrations that sign in work or school accounts, use the application manifest editor in **App registrations** in the Azure portal. Though it's possible to set a redirect URI with a wildcard by using the manifest editor, we *strongly* recommend you adhere to section 3.1.2 of RFC 6749. and use only absolute URIs.

If your scenario requires more redirect URIs than the maximum limit allowed, consider the following state parameter approach instead of adding a wildcard redirect URI.

#### Use a state parameter

If you have several subdomains and your scenario requires that, upon successful authentication, you redirect users to the same page from which they started, using a state parameter might be helpful.

In this approach:

1. Create a "shared" redirect URI per application to process the security tokens you receive from the authorization endpoint.
1. Your application can send application-specific parameters (such as subdomain URL where the user originated or anything like branding information) in the state parameter. When using a state parameter, guard against CSRF protection as specified in [section 10.12 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-10.12).
1. The application-specific parameters will include all the information needed for the application to render the correct experience for the user, that is, construct the appropriate application state. The Microsoft Entra authorization endpoint strips HTML from the state parameter so make sure you are not passing HTML content in this parameter.
1. When Microsoft Entra ID sends a response to the "shared" redirect URI, it will send the state parameter back to the application.
1. The application can then use the value in the state parameter to determine which URL to further send the user to. Make sure you validate for CSRF protection.

> [!WARNING]
> This approach allows a compromised client to modify the additional parameters sent in the state parameter, thereby redirecting the user to a different URL, which is the [open redirector threat](https://tools.ietf.org/html/rfc6819#section-4.2.4) described in RFC 6819. Therefore, the client must protect these parameters by encrypting the state or verifying it by some other means, like validating the domain name in the redirect URI against the token.

## Next steps

Learn about the app registration [Application manifest](reference-app-manifest.md).
