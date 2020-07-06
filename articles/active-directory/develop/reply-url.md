---
# required metadata
title: Redirect URI & reply URL restrictions - Microsoft identity platform | Azure
description: Reply URLs/redirect URls restrictions & limitations
author: SureshJa
ms.author: sureshja
manager: CelesteDG
ms.date: 06/29/2019
ms.topic: conceptual
ms.subservice: develop
ms.custom: aaddev 
ms.service: active-directory
ms.reviewer: lenalepa, manrath
---
# Redirect URI/reply URL restrictions and limitations

A redirect URI, or reply URL, is the location that the authorization server will send the user to once the app has been successfully authorized, and granted an authorization code or access token. The code or token is contained in the redirect URI or reply token so it's important that you register the correct location as part of the app registration process.

 The following restrictions apply to reply URLs:

* The reply URL must begin with the scheme `https`.

* The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. For example, if your application includes as part of its path `.../abc/response-oidc`,  do not specify `.../ABC/response-oidc` in the reply URL. Because the web browser treats paths as case-sensitive, cookies associated with `.../abc/response-oidc` may be excluded if redirected to the case-mismatched `.../ABC/response-oidc` URL.
    
## Maximum number of redirect URIs

The following table shows the maximum number of redirect URIs that you can add when you register your app.

| Accounts being signed in | Maximum number of redirect URIs | Description |
|--------------------------|---------------------------------|-------------|
| Microsoft work or school accounts in any organization's Azure Active Directory (Azure AD) tenant | 256 | `signInAudience` field in the application manifest is set to either *AzureADMyOrg* or *AzureADMultipleOrgs* |
| Personal Microsoft accounts and work and school accounts | 100 | `signInAudience` field in the application manifest is set to *AzureADandPersonalMicrosoftAccount* |

## Maximum URI length

You can use a maximum of 256 characters for each redirect URI that you add to an app registration.

## Supported schemes
The Azure AD application model today supports both HTTP and HTTPS schemes for apps that sign in Microsoft work or school accounts in any organization's Azure Active Directory (Azure AD) tenant. That is `signInAudience` field in the application manifest is set to either *AzureADMyOrg* or *AzureADMultipleOrgs*. For the apps that sign in Personal Microsoft accounts and work and school accounts (that is `signInAudience` set to *AzureADandPersonalMicrosoftAccount*) only HTTPS scheme is allowed.

> [!NOTE]
> The new [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience doesn't allow developers to add URIs with HTTP scheme on the UI. Adding HTTP URIs for apps that sign in work or school accounts is supported only through the app manifest editor. Going forward, new apps won't be able to use HTTP schemes in the redirect URI. However, older apps that contain HTTP schemes in redirect URIs will continue to work. Developers must use HTTPS schemes in the redirect URIs.

## Restrictions using a wildcard in URIs

Wildcard URIs, such as `https://*.contoso.com`, are convenient but should be avoided. Using wildcards in the redirect URI has security implications. According to the OAuth 2.0 specification ([section 3.1.2 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-3.1.2)), a redirection endpoint URI must be an absolute URI. 

The Azure AD application model doesn't support wildcard URIs for apps that are configured to sign in personal Microsoft accounts and work or school accounts. However, wildcard URIs are allowed for apps that are configured to sign in work or school accounts in an organization's Azure AD tenant today. 
 
> [!NOTE]
> The new [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) experience doesn't allow developers to add wildcard URIs on the UI. Adding wilcard URI for apps that sign in work or school accounts is supported only through the app manifest editor. Going forward, new apps won't be able to use wildcards in the redirect URI. However, older apps that contain wildcards in redirect URIs will continue to work.

If your scenario requires more redirect URIs than the maximum limit allowed, instead of adding a wildcard redirect URI, consider the following approach.

### Use a state parameter

If you have a number of sub-domains, and if your scenario requires you to redirect users upon successful authentication to the same page where they started, using a state parameter might be helpful. 

In this approach:

1. Create a "shared" redirect URI per application to process the security tokens you receive from the authorization endpoint.
1. Your application can send application-specific parameters (such as sub-domain URL where the user originated or anything like branding information) in the state parameter. When using a state parameter, guard against CSRF protection as specified in [section 10.12 of RFC 6749](https://tools.ietf.org/html/rfc6749#section-10.12)). 
1. The application-specific parameters will include all the information needed for the application to render the correct experience for the user, that is, construct the appropriate application state. The Azure AD authorization endpoint strips HTML from the state parameter so make sure you are not passing HTML content in this parameter.
1. When Azure AD sends a response to the "shared" redirect URI, it will send the state parameter back to the application.
1. The application can then use the value in the state parameter to determine which URL to further send the user to. Make sure you validate for CSRF protection.

> [!NOTE]
> This approach allows a compromised client to modify the additional parameters sent in the state parameter, thereby redirecting the user to a different URL, which is the [open redirector threat](https://tools.ietf.org/html/rfc6819#section-4.2.4) described in RFC 6819. Therefore, the client must protect these parameters by encrypting the state or verifying it by some other means such as validating domain name in the redirect URI against the token.

## Next steps

- Learn about the [Application manifest](reference-app-manifest.md)
