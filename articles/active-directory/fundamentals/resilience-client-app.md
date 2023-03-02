---
title: Increase the resilience of authentication and authorization in client applications you develop
description: Learn to increasing resiliency of authentication and authorization in client application using the Microsoft identity platform 
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals 
ms.workload: identity
ms.topic: how-to
author: jricketts
ms.author: jricketts
manager: martinco
ms.date: 02/02/2023
---

# Increase the resilience of authentication and authorization in client applications you develop

Use the guidance in this article to build resilience into client applications that use the Microsoft identity platform and Azure Active Directory (Azure AD) to sign in users, and perform actions on behalf of those users.

## Use the Microsoft Authentication Library (MSAL)

The Microsoft Authentication Library (MSAL) is part of the Microsoft identity platform. MSAL acquires, manages, caches, and refreshes tokens; it uses best practices for resilience. MSAL helps developers create secure solutions.

Learn more:

* [Overview of the Microsoft Authentication Library](../develop/msal-overview.md)
* [What is the Microsoft identity platform?](../develop/v2-overview.md)
* [Microsoft identity platform documentation](../develop/index.yml)

MSAL caches tokens and uses a silent token acquisition pattern. MSAL serializes the token cache on operating systems that natively provide secure storage like Universal Windows Platform (UWP), iOS, and Android. Developers can customize the serialization behavior when using: 

* Microsoft.Identity.Web
* MSAL.NET
* MSAL for Java
* MSAL for Python

Learn more:

[Token cache serialization](https://github.com/AzureAD/microsoft-identity-web/wiki/token-cache-serialization)
[Token cache serialization in MSAL.NET](../develop/msal-net-token-cache-serialization.md)
[Custom token cache serialization in MSAL for Java](../develop/msal-java-token-cache-serialization.md)
[Custom token cache serialization in MSAL for Python](../develop/msal-python-token-cache-serialization.md).

   ![Diagram of a device and and application using MSAL to call Microsoft Identity](media/resilience-client-app/resilience-with-microsoft-authentication-library.png)

When using MSAL, token caching, refreshing, and silent acquisition is supported automatically. Use simple patterns to acquire the tokens for authentication. There is support for many languages. Find code sample on, [Microsoft identity platform code samples](../develop/sample-v2-code.md).

## [C#](#tab/csharp)

```csharp
try
{
    result = await app.AcquireTokenSilent(scopes, account).ExecuteAsync();
}
catch(MsalUiRequiredException ex)
{
    result = await app.AcquireToken(scopes).WithClaims(ex.Claims).ExecuteAsync()
}
```

## [JavaScript](#tab/javascript)

```javascript
return myMSALObj.acquireTokenSilent(request).catch(error => {
    console.warn("silent token acquisition fails. acquiring token using redirect");
    if (error instanceof msal.InteractionRequiredAuthError) {
        // fallback to interaction when silent call fails
        return myMSALObj.acquireTokenPopup(request).then(tokenResponse => {
            console.log(tokenResponse);

            return tokenResponse;
        }).catch(error => {
            console.error(error);
        });
    } else {
        console.warn(error);
    }
});
```

---

MSAL is able to refresh tokens. When the Microsoft identity platform issues a long-lived token, it can send information to the client to refresh the token (refresh\_in). The app runs while the old token is valid, but it takes longer for another token acquisition.

### MSAL releases

We recommend developers build a process to use the latest MSAL release because authentication is part of app security. Use this practice for libraries under development and improve app resilience. 

Find the lastest version and release notes:

* [microsoft-authentication-library-for-js](https://github.com/AzureAD/microsoft-authentication-library-for-js/releases)
* [microsoft-authentication-library-for-dotnet](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/releases)
* [microsoft-authentication-library-for-python](https://github.com/AzureAD/microsoft-authentication-library-for-python/releases)
* [microsoft-authentication-library-for-java](https://github.com/AzureAD/microsoft-authentication-library-for-java/releases)
* [microsoft-authentication-library-for-objc](https://github.com/AzureAD/microsoft-authentication-library-for-objc/releases)
* [microsoft-authentication-library-for-android](https://github.com/AzureAD/microsoft-authentication-library-for-android/releases)
* [microsoft-authentication-library-for-js](https://github.com/AzureAD/microsoft-authentication-library-for-js/releases)
* [microsoft-identity-web](https://github.com/AzureAD/microsoft-identity-web/releases)

## Resilient patterns for token handling

If you don't use MSAL, use resilient patterns for token handling. Best practices are implemented by the MSAL library. 

Generally, applications that use modern authentication call an endpoint to retrieve tokens that authenticate the user, or authorize the application to call protected APIs. MSAL handles authentication and implements patterns to improve resilience. If you don't use MSAL use the guidance in this section for best practices. Otherwise, MSAL, implements best practices automatically.

### Cache tokens

Ensure apps cache tokens accurately from the Microsoft identity platform. After your app receives tokens, the HTTP response with tokens has an `expires_in` property that indicates the duration to cache, and when to reuse it. Confirm application don't attempt to decode an API access token.

   ![Diagram of an app calling to Microsoft identity platform, through a token cache on the device running the application.](media/resilience-client-app/token-cache.png)

Cached tokens prevent unnecessary traffic between an app and the Microsoft identity platform. This scenario makes the app less susceptible to token acquisition failures by reducing token acquisition calls. Cached tokens improve application performance, because the app blocks acquiring tokens less frequently. Users remain signed in to your application for the token lifetime.

### Serialize and persist tokens

Ensure apps serialize their token cache securely to persist the tokens between app instances. Reuse tokens during their lifetime. Refresh tokens and access tokens are issued for many hours. During this time, users might start your application several times. When an app starts, confirm it looks for valid access, or a refresh token. This increases app resilience and performance.

Learn more:

* [Refresh the access tokens](../develop/v2-oauth2-auth-code-flow.md#refresh-the-access-token)
* [Microsoft identity platform access tokens](../develop/access-tokens.md)

   ![Diagram of an app calling to Microsoft identity platform, through a token cache and token store on the device running the application.](media/resilience-client-app/token-store.png)

Ensure persistent token storage has access control and encryption, in relation to the user-owner, or process identity. On various operating systems, there are credential storage features.

### Acquire tokens silently

Authenticating a user or retrieving authorization to call an API entails multiple steps in Microsoft identity platform. For example, if a user signs in for the first time, they enter credentials and perform a multi-factor authentication. Each step affects the resource that provides the service. The best user experience with the least dependencies, is silent token aquisition.

  ![Diagram of Microsoft identity platform services that help complete user authentication or authorization.](media/resilience-client-app/external-dependencies.png)

Silent token acquisition starts with a valid token from the app token cache. If there is no valid token, the app attempts to acquires a token using an availble refresh token, and the token endpoint. If neither option is available, the app acquires a token using the `prompt=none` parameter. This action uses the authorization endpoint, but no UI appears for the user. If possible, the Microsoft identity platform provides a token to the app without user interaction. If no method results in a token, then the user manually re-authenticates.

> [!NOTE]
> In general, ensure apps don't use prompts like 'login' and 'consent'. These prompts force user interaction, when no interaction is required.

## Service response handling

While applications should handle all error responses, there are some responses that can impact resilience. If your application receives an HTTP 429 response code, Too Many Requests, Microsoft Identity is throttling your requests. If your app continues to make too many requests, it will continue to be throttled preventing your app from receiving tokens. Your application should not attempt to acquire a token again until after the time, in seconds, in the Retry-After response field has passed. Receiving a 429 response is often an indication that the application is not caching and reusing tokens correctly. Developers should review how tokens are cached and reused in the application.

When an application receives an HTTP 5xx response code the app must not enter a fast retry loop. When present, the application should honor the same Retry-After handling as it does for a 429 response. If no Retry-After header is provided by the response, we recommend implementing an exponential back-off retry with the first retry at least 5 seconds after the response.

When a request times out applications should not retry immediately. Implement an exponential back-off retry with the first retry at least 5 seconds after the response.

## Evaluate options for retrieving authorization related information

Many applications and APIs need specific information about the user to make authorization decisions. There are a few ways for an application to get this information. Each method has its advantages and disadvantages. Developers should weigh these to determine which strategy is best for resilience in their app.

### Tokens

Identity (ID) tokens and access tokens contain standard claims that provide information about the subject. These are documented in [Microsoft identity platform ID tokens](../develop/id-tokens.md) and [Microsoft identity platform access tokens](../develop/access-tokens.md). If the information your app needs is already in the token, then the most efficient technique for retrieving that data is to use token claims as that will save the overheard of an additional network call to retrieve information separately. Fewer network calls mean higher overall resilience for the application.

> [!NOTE]
> Some applications call the UserInfo endpoint to retrieve claims about the user that authenticated. The information available in the ID token that your app can receive is a superset of the information it can get from the UserInfo endpoint. Your app should use the ID token to get information about the user instead of calling the UserInfo endpoint.

An app developer can augment standard token claims with [optional claims](../develop/active-directory-optional-claims.md). One common optional claim is [groups](../develop/active-directory-optional-claims.md#configuring-groups-optional-claims). There are several ways to add group claims. The "Application Group" option only includes groups assigned to the application. The "All" or "Security groups" options include groups from all apps in the same tenant, which can add many groups to the token. It is important to evaluate the effect in your case, as it can potentially negate the efficiency gained by requesting groups in the token by causing token bloat and even requiring additional calls to get the full list of groups.

Instead of using groups in your token you can instead use and include app roles. Developers can define [app roles](../develop/howto-add-app-roles-in-azure-ad-apps.md) for their apps and APIs which the customer can manage from their directory using the portal or APIs. IT Pros can then assign roles to different users and groups to control who has access to what content and functionality. When a token is issued for the application or API, the roles assigned to the user will be available in the roles claim in the token. Getting this information directly in a token can save additional APIs calls.

Finally, IT Admins can also add claims based on specific information in a tenant. For example, an enterprise can have an extension to have an enterprise specific User ID.

In all cases, adding information from the directory directly to a token can be efficient and increase the apps resilience by reducing the number of dependencies the app has. On the other hand, it does not address any resilience issues from being unable to acquire a token. You should only add optional claims for the main scenarios of your application. If the app requires information only for the admin functionality, then it is best for the application to obtain that information only as needed.

### Microsoft Graph

Microsoft Graph provides a unified API endpoint to access the Microsoft 365 data that describes the patterns of productivity, identity and security in an organization. Applications that use Microsoft Graph can potentially use any of the information across Microsoft 365 for authorization decisions.

Apps require just a single token to access all of Microsoft 365. This is more resilient than using the older APIs that are specific to Microsoft 365 components like Microsoft Exchange or Microsoft SharePoint where multiple tokens are required.

When using Microsoft Graph APIs, we suggest your use a [Microsoft Graph SDK](/graph/sdks/sdks-overview). The Microsoft Graph SDKs are designed to simplify building high-quality, efficient, and resilient applications that access Microsoft Graph.

For authorization decisions, developers should consider when to use the claims available in a token as an alternative to some Microsoft Graph calls. As mentioned above, developers could request groups, app roles, and optional claims in their tokens. In terms of resilience, using Microsoft Graph for authorization requires additional network calls that rely on Microsoft Identity (to get the token to access Microsoft Graph) as well as Microsoft Graph itself. However, if your application already relies on Microsoft Graph as its data layer, then relying on the Graph for authorization is not an additional risk to take.

## Use broker authentication on mobile devices

On mobile devices, using an authentication broker like Microsoft Authenticator will improve resilience. The broker adds benefits above what is available with other options such as the system browser or an embedded WebView. The authentication broker can utilize a [primary refresh token](../devices/concept-primary-refresh-token.md) (PRT) that contains claims about the user and the device and can be used to get authentication tokens to access other applications from the device. When a PRT is used to request access to an application, its device and MFA claims are trusted by Azure AD. This increases resilience by avoiding additional steps to authenticate the device again. Users won't be challenged with multiple MFA prompts on the same device, therefore increasing resilience by reducing dependencies on external services and improving the user experience.

![An application making a call to Microsoft identity, but the call goes through a token cache as well as a token store and an Authentication Broker on the device running the application](media/resilience-client-app/authentication-broker.png)

Broker authentication is automatically supported by MSAL. You can find more information on using brokered authentication on the following pages:

- [Configure SSO on macOS and iOS](../develop/single-sign-on-macos-ios.md#sso-through-authentication-broker-on-ios)
- [How to enable cross-app SSO on Android using MSAL](../develop/msal-android-single-sign-on.md)

## Adopt Continuous Access Evaluation

[Continuous Access Evaluation (CAE)](../conditional-access/concept-continuous-access-evaluation.md) is a recent development that can increase application security and resilience with long-lived tokens. CAE is an emerging industry standard being developed in the Shared Signals and Events Working Group of the OpenID Foundation. With CAE, an access token can be revoked based on [critical events](../conditional-access/concept-continuous-access-evaluation.md#critical-event-evaluation) and [policy evaluation](../conditional-access/concept-continuous-access-evaluation.md#conditional-access-policy-evaluation), rather than relying on a short token lifetime. For some resource APIs, because risk and policy are evaluated in real time, CAE can substantially increase token lifetime up to 28 hours. As resource APIs and applications adopt CAE, Microsoft Identity will be able to issue access tokens that are revocable and are valid for extended periods of time. These long-lived tokens will be proactively refreshed by MSAL.

While CAE is in early phases, it is possible to [develop client applications today that will benefit from CAE](../develop/app-resilience-continuous-access-evaluation.md) when the resources (APIs) the application uses adopt CAE. As more resources adopt CAE, your application will be able to acquire CAE enabled tokens for those resources as well. The Microsoft Graph API, and [Microsoft Graph SDKs](/graph/sdks/sdks-overview), will preview CAE capability early 2021. If you would like to participate in the public preview of Microsoft Graph with CAE, you can let us know you are interested here: [https://aka.ms/GraphCAEPreview](https://aka.ms/GraphCAEPreview).

If you develop resource APIs, we encourage you to participate in the [Shared Signals and Events WG](https://openid.net/wg/sse/). We are working with this group to enable the sharing of security events between Microsoft Identity and resource providers.

## Next steps

- [How to use Continuous Access Evaluation enabled APIs in your applications](../develop/app-resilience-continuous-access-evaluation.md)
- [Build resilience into daemon applications](resilience-daemon-app.md)
- [Build resilience in your identity and access management infrastructure](resilience-in-infrastructure.md)
- [Build resilience in your CIAM systems](resilience-b2c.md)
