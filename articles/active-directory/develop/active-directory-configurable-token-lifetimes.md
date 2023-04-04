---
title: Configurable token lifetimes
description: Learn how to set lifetimes for access, SAML, and ID tokens issued by the Microsoft identity platform.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 03/07/2023
ms.author: ryanwi
ms.custom: aaddev, identityplatformtop40, contperf-fy21q1
ms.reviewer: ludwignick, sreyanthmora, marsma
---
# Configurable token lifetimes in the Microsoft identity platform (preview)

You can specify the lifetime of an access, ID, or SAML token issued by the Microsoft identity platform. You can set token lifetimes for all apps in your organization, for a multi-tenant (multi-organization) application, or for a specific service principal in your organization. However, we currently don't support configuring the token lifetimes for [managed identity service principals](../managed-identities-azure-resources/overview.md).

In Azure AD, a policy object represents a set of rules that are enforced on individual applications or on all applications in an organization. Each policy type has a unique structure, with a set of properties that are applied to objects to which they're assigned.

You can designate a policy as the default policy for your organization. The policy is applied to any application in the organization, as long as it isn't overridden by a policy with a higher priority. You also can assign a policy to specific applications. The order of priority varies by policy type.

For examples, read [examples of how to configure token lifetimes](configure-token-lifetimes.md).

> [!NOTE]
> Configurable token lifetime policy only applies to mobile and desktop clients that access SharePoint Online and OneDrive for Business resources, and does not apply to web browser sessions.
> To manage the lifetime of web browser sessions for SharePoint Online and OneDrive for Business, use the [Conditional Access session lifetime](../conditional-access/howto-conditional-access-session-lifetime.md) feature. Refer to the [SharePoint Online blog](https://techcommunity.microsoft.com/t5/SharePoint-Blog/Introducing-Idle-Session-Timeout-in-SharePoint-and-OneDrive/ba-p/119208) to learn more about configuring idle session timeouts.

## License requirements

Using this feature requires an Azure AD Premium P1 license. To find the right license for your requirements, see [Comparing generally available features of the Free and Premium editions](https://www.microsoft.com/security/business/identity-access-management/azure-ad-pricing).

Customers with [Microsoft 365 Business licenses](/office365/servicedescriptions/office-365-service-descriptions-technet-library) also have access to Conditional Access features.

## Token lifetime policies for access, SAML, and ID tokens

You can set token lifetime policies for access tokens, SAML tokens, and ID tokens.

### Access tokens

Clients use access tokens to access a protected resource. An access token can be used only for a specific combination of user, client, and resource. Access tokens cannot be revoked and are valid until their expiry. A malicious actor that has obtained an access token can use it for extent of its lifetime. Adjusting the lifetime of an access token is a trade-off between improving system performance and increasing the amount of time that the client retains access after the user's account is disabled. Improved system performance is achieved by reducing the number of times a client needs to acquire a fresh access token.

The default lifetime of an access token is variable. When issued, an access token's default lifetime is assigned a random value ranging between 60-90 minutes (75 minutes on average).  The default lifetime also varies depending on the client application requesting the token or if conditional access is enabled in the tenant. For more information, see [Access token lifetime](access-tokens.md#access-token-lifetime).

### SAML tokens

SAML tokens are used by many web-based SaaS applications, and are obtained using Azure Active Directory's SAML2 protocol endpoint. They are also consumed by applications using WS-Federation. The default lifetime of the token is 1 hour. From an application's perspective, the validity period of the token is specified by the NotOnOrAfter value of the `<conditions …>` element in the token. After the validity period of the token has ended, the client must initiate a new authentication request, which will often be satisfied without interactive sign in as a result of the Single Sign On (SSO) Session token.

The value of NotOnOrAfter can be changed using the `AccessTokenLifetime` parameter in a `TokenLifetimePolicy`. It will be set to the lifetime configured in the policy if any, plus a clock skew factor of five minutes.

The subject confirmation NotOnOrAfter specified in the `<SubjectConfirmationData>` element is not affected by the Token Lifetime configuration. 

### ID tokens

ID tokens are passed to websites and native clients. ID tokens contain profile information about a user. An ID token is bound to a specific combination of user and client. ID tokens are considered valid until their expiry. Usually, a web application matches a user's session lifetime in the application to the lifetime of the ID token issued for the user. You can adjust the lifetime of an ID token to control how often the web application expires the application session, and how often it requires the user to be re-authenticated with the Microsoft identity platform (either silently or interactively).

## Token lifetime policies for refresh tokens and session tokens

You cannot set token lifetime policies for refresh tokens and session tokens. For lifetime, timeout, and revocation information on refresh tokens, see [Refresh tokens](refresh-tokens.md).

> [!IMPORTANT]
> As of January 30, 2021 you cannot configure refresh and session token lifetimes. Azure Active Directory no longer honors refresh and session token configuration in existing policies.  New tokens issued after existing tokens have expired are now set to the [default configuration](#configurable-token-lifetime-properties). You can still configure access, SAML, and ID token lifetimes after the refresh and session token configuration retirement.
>
> Existing token's lifetime will not be changed. After they expire, a new token will be issued based on the default value.
>
> If you need to continue to define the time period before a user is asked to sign in again, configure sign-in frequency in Conditional Access. To learn more about Conditional Access, read [Configure authentication session management with Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).

## Configurable token lifetime properties
A token lifetime policy is a type of policy object that contains token lifetime rules. This policy controls how long access, SAML, and ID tokens for this resource are considered valid. Token lifetime policies cannot be set for refresh and session tokens. If no policy is set, the system enforces the default lifetime value.

### Access, ID, and SAML2 token lifetime policy properties

Reducing the Access Token Lifetime property mitigates the risk of an access token or ID token being used by a malicious actor for an extended period of time. (These tokens cannot be revoked.) The trade-off is that performance is adversely affected, because the tokens have to be replaced more often.

For an example, see [Create a policy for web sign-in](registration-config-change-token-lifetime-how-to.md).

Access, ID, and SAML2 token configuration are affected by the following properties and their respectively set values:

- **Property**: Access Token Lifetime
- **Policy property string**: AccessTokenLifetime
- **Affects**: Access tokens, ID tokens, SAML2 tokens
- **Default**:
    - Access tokens: varies, depending on the client application requesting the token. For example, continuous access evaluation (CAE) capable clients that negotiate CAE-aware sessions will see a long lived token lifetime (up to 28 hours).
    - ID tokens, SAML2 tokens: 1 hour
- **Minimum**: 10 minutes
- **Maximum**: 1 day

### Refresh and session token lifetime policy properties

Refresh and session token configuration are affected by the following properties and their respectively set values. After the retirement of refresh and session token configuration on January 30, 2021, Azure AD will only honor the default values described below. If you decide not to use [Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md) to manage sign-in frequency, your refresh and session tokens will be set to the default configuration on that date and you'll no longer be able to change their lifetimes.  

|Property   |Policy property string    |Affects |Default |
|----------|-----------|------------|------------|
|Refresh Token Max Inactive Time |MaxInactiveTime  |Refresh tokens |90 days  |
|Single-Factor Refresh Token Max Age  |MaxAgeSingleFactor  |Refresh tokens (for any users)  |Until-revoked  |
|Multi-Factor Refresh Token Max Age  |MaxAgeMultiFactor  |Refresh tokens (for any users) |Until-revoked  |
|Single-Factor Session Token Max Age  |MaxAgeSessionSingleFactor |Session tokens (persistent and nonpersistent)  |Until-revoked |
|Multi-Factor Session Token Max Age  |MaxAgeSessionMultiFactor  |Session tokens (persistent and nonpersistent)  |Until-revoked |

Non-persistent session tokens have a Max Inactive Time of 24 hours whereas persistent session tokens have a Max Inactive Time of 90 days. Anytime the SSO session token is used within its validity period, the validity period is extended another 24 hours or 90 days. If the SSO session token isn't used within its Max Inactive Time period, it's considered expired and will no longer be accepted. Any changes to this default period should be changed using [Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md).

You can use PowerShell to find the policies that will be affected by the retirement.  Use the [PowerShell cmdlets](configure-token-lifetimes.md#get-started) to see the all policies created in your organization, or to find which apps and service principals are linked to a specific policy.

## Policy evaluation and prioritization
You can create and then assign a token lifetime policy to a specific application, to your organization, and to service principals. Multiple policies might apply to a specific application. The token lifetime policy that takes effect follows these rules:

* If a policy is explicitly assigned to the service principal, it's enforced.
* If no policy is explicitly assigned to the service principal, a policy explicitly assigned to the parent organization of the service principal is enforced.
* If no policy is explicitly assigned to the service principal or to the organization, the policy assigned to the application is enforced.
* If no policy has been assigned to the service principal, the organization, or the application object, the default values are enforced. (See the table in [Configurable token lifetime properties](#configurable-token-lifetime-properties).)

For more information about the relationship between application objects and service principal objects, see [Application and service principal objects in Azure Active Directory](app-objects-and-service-principals.md).

A token's validity is evaluated at the time the token is used. The policy with the highest priority on the application that is being accessed takes effect.

All timespans used here are formatted according to the C# [TimeSpan](/dotnet/api/system.timespan) object - D.HH:MM:SS.  So 80 days and 30 minutes would be `80.00:30:00`.  The leading D can be dropped if zero, so 90 minutes would be `00:90:00`.  

## REST API reference

You can configure token lifetime policies and assign them to apps and service principals using Microsoft Graph. For more information, see the [tokenLifetimePolicy resource type](/graph/api/resources/tokenlifetimepolicy) and its associated methods.

## Cmdlet reference

These are the cmdlets in the [Azure Active Directory PowerShell for Graph Preview module](/powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true#service-principals).

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

## Next steps

To learn more, read [examples of how to configure token lifetimes](configure-token-lifetimes.md).
