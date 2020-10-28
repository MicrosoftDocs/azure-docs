---
title: Configurable token lifetimes
titleSuffix: Microsoft identity platform
description: Learn how to set lifetimes for tokens issued by Microsoft identity platform.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 10/23/2020
ms.author: ryanwi
ms.custom: aaddev, identityplatformtop40, content-perf, FY21Q1, contperfq1
ms.reviewer: hirsin, jlu, annaba
---
# Configurable token lifetimes in Microsoft identity platform (preview)

You can specify the lifetime of a token issued by Microsoft identity platform. You can set token lifetimes for all apps in your organization, for a multi-tenant (multi-organization) application, or for a specific service principal in your organization. However, we currently do not support configuring the token lifetimes for [managed identity service principals](../managed-identities-azure-resources/overview.md).

> [!IMPORTANT]
> After January 30, 2021, tenants will no longer be able to configure refresh and session token lifetimes and Azure Active Directory will stop honoring existing refresh and session token configuration in policies after that date. You can still configure access token lifetimes after the retirement.
> We’ve implemented [authentication session management capabilities](../conditional-access/howto-conditional-access-session-lifetime.md) in Azure AD Conditional Access. You can use this new feature to configure refresh token lifetimes by setting sign in frequency. Conditional Access is an Azure AD Premium P1 feature and you can evaluate whether premium is right for your organzation on the [premium pricing page](https://azure.microsoft.com/en-us/pricing/details/active-directory/). 
> 
> For tenants that do not use authentication session management in Conditional Access after the retirement date, they can expect that Azure AD will honor the default configuration outlined in the next section.

## Configurable token lifetime properties after the retirement
Refresh and session token configuration are affected by the following properties and their respectively set values. After the retirement of refresh and session token configuration, Azure AD will only honor the default value described below, regardless of whether policies have custom values configured configured custom values.  

|Property   |Policy property string    |Affects |Default |
|----------|-----------|------------|------------|
|Refresh Token Max Inactive Time |MaxInactiveTime  |Refresh tokens |90 days  |
|Single-Factor Refresh Token Max Age  |MaxAgeSingleFactor  |Refresh tokens (for any users)  |Until-revoked  |
|Multi-Factor Refresh Token Max Age  |MaxAgeMultiFactor  |Refresh tokens (for any users) |180 days  |
|Single-Factor Session Token Max Age  |MaxAgeSessionSingleFactor |Session tokens (persistent and nonpersistent)  |Until-revoked |
|Multi-Factor Session Token Max Age  |MaxAgeSessionMultiFactor  |Session tokens (persistent and nonpersistent)  |180 days |

You can use the [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet to identify token lifetime policies whose property values differ from the Azure AD defaults.

To further understand how your policies are used in your tenant, you can use the [Get-AzureADPolicyAppliedObject](/powershell/module/azuread/get-azureadpolicyappliedobject?view=azureadps-2.0-preview&preserve-view=true) cmdlet to identify which apps and service principals are linked to your policies. 

If your tenant has policies which define custom values for refresh and session token configuration properties, Microsoft recommends you update those policies in scope to values that reflect the defaults described above. If no changes are made, Azure AD will automatically honor the default values.  

## Overview

In Azure AD, a policy object represents a set of rules that are enforced on individual applications or on all applications in an organization. Each policy type has a unique structure, with a set of properties that are applied to objects to which they are assigned.

You can designate a policy as the default policy for your organization. The policy is applied to any application in the organization, as long as it is not overridden by a policy with a higher priority. You also can assign a policy to specific applications. The order of priority varies by policy type.

For examples, read [examples of how to configure token lifetimes](configure-token-lifetimes.md).

> [!NOTE]
> Configurable token lifetime policy only applies to mobile and desktop clients that access SharePoint Online and OneDrive for Business resources, and does not apply to web browser sessions.
> To manage the lifetime of web browser sessions for SharePoint Online and OneDrive for Business, use the [Conditional Access session lifetime](../conditional-access/howto-conditional-access-session-lifetime.md) feature. Refer to the [SharePoint Online blog](https://techcommunity.microsoft.com/t5/SharePoint-Blog/Introducing-Idle-Session-Timeout-in-SharePoint-and-OneDrive/ba-p/119208) to learn more about configuring idle session timeouts.

## Token types

You can set token lifetime policies for refresh tokens, access tokens, SAML tokens, session tokens, and ID tokens.

### Access tokens

Clients use access tokens to access a protected resource. An access token can be used only for a specific combination of user, client, and resource. Access tokens cannot be revoked and are valid until their expiry. A malicious actor that has obtained an access token can use it for extent of its lifetime. Adjusting the lifetime of an access token is a trade-off between improving system performance and increasing the amount of time that the client retains access after the user’s account is disabled. Improved system performance is achieved by reducing the number of times a client needs to acquire a fresh access token.  The default is 1 hour - after 1 hour, the client must use the refresh token to (usually silently) acquire a new refresh token and access token. 

### SAML tokens

SAML tokens are used by many web-based SAAS applications, and are obtained using Azure Active Directory's SAML2 protocol endpoint. They are also consumed by applications using WS-Federation. The default lifetime of the token is 1 hour. From an application's perspective, the validity period of the token is specified by the NotOnOrAfter value of the `<conditions …>` element in the token. After the validity period of the token has ended, the client must initiate a new authentication request, which will often be satisfied without interactive sign in as a result of the Single Sign On (SSO) Session token.

The value of NotOnOrAfter can be changed using the `AccessTokenLifetime` parameter in a `TokenLifetimePolicy`. It will be set to the lifetime configured in the policy if any, plus a clock skew factor of five minutes.

The subject confirmation NotOnOrAfter specified in the `<SubjectConfirmationData>` element is not affected by the Token Lifetime configuration. 

### Refresh tokens

When a client acquires an access token to access a protected resource, the client also receives a refresh token. The refresh token is used to obtain new access/refresh token pairs when the current access token expires. A refresh token is bound to a combination of user and client. A refresh token can be [revoked at any time](access-tokens.md#token-revocation), and the token's validity is checked every time the token is used.  Refresh tokens are not revoked when used to fetch new access tokens - it's best practice, however, to securely delete the old token when getting a new one. 

It's important to make a distinction between confidential clients and public clients, as this impacts how long refresh tokens can be used. For more information about different types of clients, see [RFC 6749](https://tools.ietf.org/html/rfc6749#section-2.1).

#### Token lifetimes with confidential client refresh tokens
Confidential clients are applications that can securely store a client password (secret). They can prove that requests are coming from the secured client application and not from a malicious actor. For example, a web app is a confidential client because it can store a client secret on the web server. It is not exposed. Because these flows are more secure, the default lifetimes of refresh tokens issued to these flows is `until-revoked`, cannot be changed by using policy, and will not be revoked on voluntary password resets.

#### Token lifetimes with public client refresh tokens

Public clients cannot securely store a client password (secret). For example, an iOS/Android app cannot obfuscate a secret from the resource owner, so it is considered a public client. You can set policies on resources to prevent refresh tokens from public clients older than a specified period from obtaining a new access/refresh token pair. To do this, use the [Refresh Token Max Inactive Time property](#refresh-token-max-inactive-time) (`MaxInactiveTime`). You also can use policies to set a period beyond which the refresh tokens are no longer accepted. To do this, use the [Single-Factor Refresh Token Max Age](#single-factor-session-token-max-age) or [Multi-Factor Session Token Max Age](#multi-factor-refresh-token-max-age) property. You can adjust the lifetime of a refresh token to control when and how often the user is required to reenter credentials, instead of being silently reauthenticated, when using a public client application.

> [!NOTE]
> The Max Age property is the length of time a single token can be used. 

### ID tokens
ID tokens are passed to websites and native clients. ID tokens contain profile information about a user. An ID token is bound to a specific combination of user and client. ID tokens are considered valid until their expiry. Usually, a web application matches a user’s session lifetime in the application to the lifetime of the ID token issued for the user. You can adjust the lifetime of an ID token to control how often the web application expires the application session, and how often it requires the user to be reauthenticated with Microsoft identity platform (either silently or interactively).

### Single sign-on session tokens
When a user authenticates with Microsoft identity platform, a single sign-on session (SSO) is established with the user’s browser and Microsoft identity platform. The SSO token, in the form of a cookie, represents this session. The SSO session token is not bound to a specific resource/client application. SSO session tokens can be revoked, and their validity is checked every time they are used.

Microsoft identity platform uses two kinds of SSO session tokens: persistent and nonpersistent. Persistent session tokens are stored as persistent cookies by the browser. Nonpersistent session tokens are stored as session cookies. (Session cookies are destroyed when the browser is closed.)
Usually, a nonpersistent session token is stored. But, when the user selects the **Keep me signed in** check box during authentication, a persistent session token is stored.

Nonpersistent session tokens have a lifetime of 24 hours. Persistent tokens have a lifetime of 90 days. Anytime an SSO session token is used within its validity period, the validity period is extended another 24 hours or 90 days, depending on the token type. If an SSO session token is not used within its validity period, it is considered expired and is no longer accepted.

You can use a policy to set the time after the first session token was issued beyond which the session token is no longer accepted. (To do this, use the Session Token Max Age property.) You can adjust the lifetime of a session token to control when and how often a user is required to reenter credentials, instead of being silently authenticated, when using a web application.

### Token lifetime policy properties
A token lifetime policy is a type of policy object that contains token lifetime rules. Use the properties of the policy to control specified token lifetimes. If no policy is set, the system enforces the default lifetime value.

### Configurable token lifetime properties
| Property | Policy property string | Affects | Default | Minimum | Maximum |
| --- | --- | --- | --- | --- | --- |
| Access Token Lifetime |AccessTokenLifetime<sup>2</sup> |Access tokens, ID tokens, SAML2 tokens |1 hour |10 minutes |1 day |
| Refresh Token Max Inactive Time |MaxInactiveTime |Refresh tokens |90 days |10 minutes |90 days |
| Single-Factor Refresh Token Max Age |MaxAgeSingleFactor |Refresh tokens (for any users) |Until-revoked |10 minutes |Until-revoked<sup>1</sup> |
| Multi-Factor Refresh Token Max Age |MaxAgeMultiFactor |Refresh tokens (for any users) | 180 days |10 minutes |180 days<sup>1</sup> |
| Single-Factor Session Token Max Age |MaxAgeSessionSingleFactor |Session tokens (persistent and nonpersistent) |Until-revoked |10 minutes |Until-revoked<sup>1</sup> |
| Multi-Factor Session Token Max Age |MaxAgeSessionMultiFactor |Session tokens (persistent and nonpersistent) | 180 days |10 minutes | 180 days<sup>1</sup> |

* <sup>1</sup>365 days is the maximum explicit length that can be set for these attributes.
* <sup>2</sup>To ensure the Microsoft Teams Web client works, it is recommended to keep AccessTokenLifetime to greater than 15 minutes for Microsoft Teams.

### Exceptions
| Property | Affects | Default |
| --- | --- | --- |
| Refresh Token Max Age (issued for federated users who have insufficient revocation information<sup>1</sup>) |Refresh tokens (issued for federated users who have insufficient revocation information<sup>1</sup>) |12 hours |
| Refresh Token Max Inactive Time (issued for confidential clients) |Refresh tokens (issued for confidential clients) |90 days |
| Refresh Token Max Age (issued for confidential clients) |Refresh tokens (issued for confidential clients) |Until-revoked |

* <sup>1</sup> Federated users who have insufficient revocation information include any users who do not have the "LastPasswordChangeTimestamp" attribute synced. These users are given this short Max Age because Azure Active Directory is unable to verify when to revoke tokens that are tied to an old credential (such as a password that has been changed) and must check back in more frequently to ensure that the user and associated tokens are still in good standing. To improve this experience, tenant admins must ensure that they are syncing the “LastPasswordChangeTimestamp” attribute (this can be set on the user object using PowerShell or through AADSync).

### Policy evaluation and prioritization
You can create and then assign a token lifetime policy to a specific application, to your organization, and to service principals. Multiple policies might apply to a specific application. The token lifetime policy that takes effect follows these rules:

* If a policy is explicitly assigned to the service principal, it is enforced.
* If no policy is explicitly assigned to the service principal, a policy explicitly assigned to the parent organization of the service principal is enforced.
* If no policy is explicitly assigned to the service principal or to the organization, the policy assigned to the application is enforced.
* If no policy has been assigned to the service principal, the organization, or the application object, the default values are enforced. (See the table in [Configurable token lifetime properties](#configurable-token-lifetime-properties).)

For more information about the relationship between application objects and service principal objects, see [Application and service principal objects in Azure Active Directory](app-objects-and-service-principals.md).

A token’s validity is evaluated at the time the token is used. The policy with the highest priority on the application that is being accessed takes effect.

All timespans used here are formatted according to the C# [TimeSpan](/dotnet/api/system.timespan) object - D.HH:MM:SS.  So 80 days and 30 minutes would be `80.00:30:00`.  The leading D can be dropped if zero, so 90 minutes would be `00:90:00`.  

> [!NOTE]
> Here's an example scenario.
>
> A user wants to access two web applications: Web Application A and Web Application B.
> 
> Factors:
> * Both web applications are in the same parent organization.
> * Token Lifetime Policy 1 with a Session Token Max Age of eight hours is set as the parent organization’s default.
> * Web Application A is a regular-use web application and isn’t linked to any policies.
> * Web Application B is used for highly sensitive processes. Its service principal is linked to Token Lifetime Policy 2, which has a Session Token Max Age of 30 minutes.
>
> At 12:00 PM, the user starts a new browser session and tries to access Web Application A. The user is redirected to Microsoft identity platform and is asked to sign in. This creates a cookie that has a session token in the browser. The user is redirected back to Web Application A with an ID token that allows the user to access the application.
>
> At 12:15 PM, the user tries to access Web Application B. The browser redirects to Microsoft identity platform, which detects the session cookie. Web Application B’s service principal is linked to Token Lifetime Policy 2, but it's also part of the parent organization, with default Token Lifetime Policy 1. Token Lifetime Policy 2 takes effect because policies linked to service principals have a higher priority than organization default policies. The session token was originally issued within the last 30 minutes, so it is considered valid. The user is redirected back to Web Application B with an ID token that grants them access.
>
> At 1:00 PM, the user tries to access Web Application A. The user is redirected to Microsoft identity platform. Web Application A is not linked to any policies, but because it is in an organization with default Token Lifetime Policy 1, that policy takes effect. The session cookie that was originally issued within the last eight hours is detected. The user is silently redirected back to Web Application A with a new ID token. The user is not required to authenticate.
>
> Immediately afterward, the user tries to access Web Application B. The user is redirected to Microsoft identity platform. As before, Token Lifetime Policy 2 takes effect. Because the token was issued more than 30 minutes ago, the user is prompted to reenter their sign-in credentials. A brand-new session token and ID token are issued. The user can then access Web Application B.
>
>

## Configurable policy property details
### Access Token Lifetime
**String:** AccessTokenLifetime

**Affects:** Access tokens, ID tokens, SAML tokens

**Summary:** This policy controls how long access and ID tokens for this resource are considered valid. Reducing the Access Token Lifetime property mitigates the risk of an access token or ID token being used by a malicious actor for an extended period of time. (These tokens cannot be revoked.) The trade-off is that performance is adversely affected, because the tokens have to be replaced more often.

For an example, see [Create a policy for web sign-in](configure-token-lifetimes.md#create-a-policy-for-web-sign-in).

### Refresh Token Max Inactive Time
**String:** MaxInactiveTime

**Affects:** Refresh tokens

**Summary:** This policy controls how old a refresh token can be before a client can no longer use it to retrieve a new access/refresh token pair when attempting to access this resource. Because a new refresh token usually is returned when a refresh token is used, this policy prevents access if the client tries to access any resource by using the current refresh token during the specified period of time.

This policy forces users who have not been active on their client to reauthenticate to retrieve a new refresh token.

The Refresh Token Max Inactive Time property must be set to a lower value than the Single-Factor Token Max Age and the Multi-Factor Refresh Token Max Age properties.

For an example, see [Create a policy for a native app that calls a web API](configure-token-lifetimes.md#create-a-policy-for-a-native-app-that-calls-a-web-api).

### Single-Factor Refresh Token Max Age
**String:** MaxAgeSingleFactor

**Affects:** Refresh tokens

**Summary:** This policy controls how long a user can use a refresh token to get a new access/refresh token pair after they last authenticated successfully by using only a single factor. After a user authenticates and receives a new refresh token, the user can use the refresh token flow for the specified period of time. (This is true as long as the current refresh token is not revoked, and it is not left unused for longer than the inactive time.) At that point, the user is forced to reauthenticate to receive a new refresh token.

Reducing the max age forces users to authenticate more often. Because single-factor authentication is considered less secure than multi-factor authentication, we recommend that you set this property to a value that is equal to or lesser than the Multi-Factor Refresh Token Max Age property.

For an example, see [Create a policy for a native app that calls a web API](configure-token-lifetimes.md#create-a-policy-for-a-native-app-that-calls-a-web-api).

### Multi-Factor Refresh Token Max Age
**String:** MaxAgeMultiFactor

**Affects:** Refresh tokens

**Summary:** This policy controls how long a user can use a refresh token to get a new access/refresh token pair after they last authenticated successfully by using multiple factors. After a user authenticates and receives a new refresh token, the user can use the refresh token flow for the specified period of time. (This is true as long as the current refresh token is not revoked, and it is not unused for longer than the inactive time.) At that point, users are forced to reauthenticate to receive a new refresh token.

Reducing the max age forces users to authenticate more often. Because single-factor authentication is considered less secure than multi-factor authentication, we recommend that you set this property to a value that is equal to or greater than the Single-Factor Refresh Token Max Age property.

For an example, see [Create a policy for a native app that calls a web API](configure-token-lifetimes.md#create-a-policy-for-a-native-app-that-calls-a-web-api).

### Single-Factor Session Token Max Age
**String:** MaxAgeSessionSingleFactor

**Affects:** Session tokens (persistent and nonpersistent)

**Summary:** This policy controls how long a user can use a session token to get a new ID and session token after they last authenticated successfully by using only a single factor. After a user authenticates and receives a new session token, the user can use the session token flow for the specified period of time. (This is true as long as the current session token is not revoked and has not expired.) After the specified period of time, the user is forced to reauthenticate to receive a new session token.

Reducing the max age forces users to authenticate more often. Because single-factor authentication is considered less secure than multi-factor authentication, we recommend that you set this property to a value that is equal to or less than the Multi-Factor Session Token Max Age property.

For an example, see [Create a policy for web sign-in](configure-token-lifetimes.md#create-a-policy-for-web-sign-in).

### Multi-Factor Session Token Max Age
**String:** MaxAgeSessionMultiFactor

**Affects:** Session tokens (persistent and nonpersistent)

**Summary:** This policy controls how long a user can use a session token to get a new ID and session token after the last time they authenticated successfully by using multiple factors. After a user authenticates and receives a new session token, the user can use the session token flow for the specified period of time. (This is true as long as the current session token is not revoked and has not expired.) After the specified period of time, the user is forced to reauthenticate to receive a new session token.

Reducing the max age forces users to authenticate more often. Because single-factor authentication is considered less secure than multi-factor authentication, we recommend that you set this property to a value that is equal to or greater than the Single-Factor Session Token Max Age property.

## Cmdlet reference

These are the cmdlets in the [Azure Active Directory PowerShell for Graph Preview module](/powershell/module/azuread/?view=azureadps-2.0-preview#service-principals&preserve-view=true&preserve-view=true).

### Manage policies

You can use the following cmdlets to manage policies.

| Cmdlet | Description | 
| --- | --- |
| [New-AzureADPolicy](/powershell/module/azuread/new-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) | Creates a new policy. |
| [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) | Gets all Azure AD policies or a specified policy. |
| [Get-AzureADPolicyAppliedObject](/powershell/module/azuread/get-azureadpolicyappliedobject?view=azureadps-2.0-preview&preserve-view=true) | Gets all apps and service principals that are linked to a policy. |
| [Set-AzureADPolicy](/powershell/module/azuread/set-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) | Updates an existing policy. |
| [Remove-AzureADPolicy](/powershell/module/azuread/remove-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) | Deletes the specified policy. |

### Application policies
You can use the following cmdlets for application policies.</br></br>

| Cmdlet | Description | 
| --- | --- |
| [Add-AzureADApplicationPolicy](/powershell/module/azuread/add-azureadapplicationpolicy?view=azureadps-2.0-preview&preserve-view=true) | Links the specified policy to an application. |
| [Get-AzureADApplicationPolicy](/powershell/module/azuread/get-azureadapplicationpolicy?view=azureadps-2.0-preview&preserve-view=true) | Gets the policy that is assigned to an application. |
| [Remove-AzureADApplicationPolicy](/powershell/module/azuread/remove-azureadapplicationpolicy?view=azureadps-2.0-preview&preserve-view=true) | Removes a policy from an application. |

### Service principal policies
You can use the following cmdlets for service principal policies.

| Cmdlet | Description | 
| --- | --- |
| [Add-AzureADServicePrincipalPolicy](/powershell/module/azuread/add-azureadserviceprincipalpolicy?view=azureadps-2.0-preview&preserve-view=true) | Links the specified policy to a service principal. |
| [Get-AzureADServicePrincipalPolicy](/powershell/module/azuread/get-azureadserviceprincipalpolicy?view=azureadps-2.0-preview&preserve-view=true) | Gets any policy linked to the specified service principal.|
| [Remove-AzureADServicePrincipalPolicy](/powershell/module/azuread/remove-azureadserviceprincipalpolicy?view=azureadps-2.0-preview&preserve-view=true) | Removes the policy from the specified service principal.|

## License requirements

Using this feature requires an Azure AD Premium P1 license. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium editions](https://azure.microsoft.com/pricing/details/active-directory/).

Customers with [Microsoft 365 Business licenses](/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-business-service-description) also have access to Conditional Access features.

## Next steps

To learn more, read [examples of how to configure token lifetimes](configure-token-lifetimes.md).
