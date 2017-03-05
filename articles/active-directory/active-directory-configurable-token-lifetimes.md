---
title: Configurable token lifetimes in Azure Active Directory  | Microsoft Docs
description: Learn how to specify the lifetime of tokens issued by Azure AD.
services: active-directory
documentationcenter: ''
author: billmath
manager: femila
editor: ''

ms.assetid: 06f5b317-053e-44c3-aaaa-cf07d8692735
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/17/2016
ms.author: billmath

---
# Configurable token lifetimes in Azure Active Directory (Public Preview)
> [!NOTE]
> This capability currently is in public preview. Be prepared to revert or remove any changes. The feature is available in any Azure Active Directory subscription during public preview. However, some aspects of the feature might require an [Azure Active Directory Premium](active-directory-get-started-premium.md) subscription when the feature becomes generally available.
>
>

You can specify the lifetime of a token issued by Azure Active Directory (AD). Token lifetimes can be configured for all apps in an organization, for a multi-tenant (multi-organization) application, or for a specific Service Principal in an organization.

In Azure AD, a policy object represents a set of rules that are enforced on individual applications or all applications in an organization. Each policy type has a unique structure, with a set of properties that are applied to objects to which they are assigned.

You can designate a policy as the default for your organization. In that case, the policy is applied to any application that resides in that organization, as long as it is not overridden by a policy with a higher priority. You also can assign a policy to specific applications. The order of priority varies by policy type.


## Token types

You can set token lifetime policies for refresh tokens, access tokens, session tokens, and ID tokens.

### Access tokens
Clients use access tokens to access a protected resource. An access token can be used only for a specific combination of user, client, and resource. Access tokens cannot be revoked and are valid until their expiry. A malicious actor that has obtained an access token can use it for extent of its lifetime. Adjusting the lifetime of an access token is a trade-off between improving system performance and increasing the amount of time that the client retains access after the user’s account is disabled. Improved system performance is achieved by reducing the number of times a client needs to acquire a fresh access token.

### Refresh tokens
When a client acquires an access token to access a protected resource, the client receives both a refresh token and an access token. The refresh token is used to obtain new access/refresh token pairs when the current access token expires. A refresh token is bound to a combination of user and client. A refresh token can be revoked, and the token's validity is checked every time the token is used.

It is important to make a distinction between confidential and public clients. For more information about different types of clients, see [RFC 6749](https://tools.ietf.org/html/rfc6749#section-2.1).

#### Token lifetimes with confidential client refresh tokens
Confidential clients are applications that can securely store a client password (secret). They can prove that requests are coming from the client application and not from a malicious actor. For example, a web app is a confidential client because it can store a client secret on the web server. It is not exposed. Because these flows are more secure, the default lifetimes of refresh tokens issued to these flows are higher and cannot be changed by using policy.

#### Token lifetimes with public client refresh tokens

Public clients are cannot securely store a client password (secret). For example, an iOS/Android app cannot obfuscate a secret from the resource owner, so it is considered a public client. You can set policies on resources to prevent refresh tokens from public clients older than a specified period from obtaining a new access/refresh token pair (by using the Refresh Token Max Inactive Time property). You also can use policies to set a period beyond which the refresh tokens are no longer accepted (by using the Refresh Token Max Age property). By adjusting the lifetime of a refresh token, you can control when and how often the user is required to reenter credentials instead of being silently reauthenticated when using a public client application.

### ID tokens
ID tokens are passed to websites and native clients. They contain profile information about a user. An ID token is bound to a specific combination of user and client. ID tokens are considered valid until their expiry. Usually, a web application matches a user’s session lifetime in the application to the lifetime of the ID token issued for the user. By adjusting the lifetime of an ID token, you can control how often the web application will expire the application session and require the user to be re-authenticated with Azure AD (either silently or interactively).

### Single sign-on session tokens
When a user authenticates with Azure AD and selects the **Keep me signed in** check box, a single sign-on session (SSO) is established with the user’s browser and Azure AD. The SSO token, in the form of a cookie, represents this session. Note that the SSO session token is not bound to a specific resource/client application. SSO session tokens can be revoked and their validity is checked every time they are used.

There are two kinds of SSO session tokens: persistent and nonpersistent. Persistent session tokens are stored as persistent cookies by the browser. Nonpersistent session tokens are stored as session cookies (they are destroyed when the browser is closed).

Nonpersistent session tokens have a lifetime of 24 hours. Persistent tokens have a lifetime of 180 days. Any time the SSO session token is used within its validity period, the validity period is extended another 24 hours or 180 days. If the SSO session token is not used within its validity period, it is considered expired and is no longer accepted.

You can use a policy to set a period of time after the first session token was issued beyond which the session token is no longer accepted (by using the Session Token Max Age property). By adjusting the lifetime of a session token, you can control when and how often the user is required to reenter credentials instead of being silently authenticated when using a web application.

### Token lifetime policy properties
A token lifetime policy is a type of policy object that contains token lifetime rules. Use the properties of the policy to control specified token lifetimes. If no policy is set, the system enforces the default lifetime value.

### Configurable token lifetime properties
| Property | Policy property string | Affects | Default | Minimum | Maximum |
| --- | --- | --- | --- | --- | --- |
| Access Token Lifetime |AccessTokenLifetime |Access tokens, ID tokens, SAML2 tokens |1 hour |10 minutes |1 day |
| Refresh Token Max Inactive Time |MaxInactiveTime |Refresh tokens |14 days |10 minutes |90 days |
| Single-Factor Refresh Token Max Age |MaxAgeSingleFactor |Refresh tokens (for any users) |90 days |10 minutes |Until-revoked* |
| Multi-Factor Refresh Token Max Age |MaxAgeMultiFactor |Refresh tokens (for any users) |90 days |10 minutes |Until-revoked* |
| Single-Factor Session Token Max Age |MaxAgeSessionSingleFactor** |Session tokens(persistent and nonpersistent) |Until-revoked |10 minutes |Until-revoked* |
| Multi-Factor Session Token Max Age |MaxAgeSessionMultiFactor*** |Session tokens (persistent and nonpersistent) |Until-revoked |10 minutes |Until-revoked* |

* *365 days is the maximum explicit length that can be set for these attributes.
* **If MaxAgeSessionSingleFactor is not set, this value takes the MaxAgeSingleFactor value. If neither parameter is set, the property takes on the default value (Until-revoked).
* ***If MaxAgeSessionMultiFactor is not set, this value takes the MaxAgeMultiFactor value. If neither parameter is set, the property takes on the default value (Until-revoked).

### Exceptions
| Property | Affects | Default |
| --- | --- | --- |
| Refresh Token Max Inactive Time (federated users with insufficient revocation information) |Refresh tokens (Issued for federated users with insufficient revocation information) |12 hours |
| Refresh Token Max Inactive Time (Confidential Clients) |Refresh tokens (Issued for Confidential Clients) |90 days |
| Refresh token Max Age (Issued for Confidential Clients) |Refresh tokens (Issued for Confidential Clients) |Until-revoked |

### Priority and evaluation of policies
You can create and then assign a token lifetime policy to specific applications, organizations, and service principals. It's possible for multiple policies to apply to a specific application. The token lifetime policy that takes effect follows these rules:

* If a policy is explicitly assigned to the service principal, it will be enforced.
* If no policy is explicitly assigned to the service principal, a policy explicitly assigned to the parent organization of the service principal will be enforced.
* If no policy is explicitly assigned to the service principal or the organization, the policy assigned to the application will be enforced.
* If no policy has been assigned to the service principal, the organization, or the application object, the default values will be enforced (see the table in [Configurable token lifetime properties](#configurable-token-lifetime-properties)).

For more information about the relationship between application objects and service principal objects in Azure AD, see [Application and service principal objects in Azure Active Directory](active-directory-application-objects.md).

A token’s validity is evaluated at the time it is used. The policy with the highest priority on the application that is being accessed takes effect.

> [!NOTE]
> Example
>
> A user wants to access two web applications, Web Application A and Web Application B.
>
> * Both applications are in the same parent organization.
> * Token Lifetime Policy 1 with a Session Token Max Age of 8 hours is set as the parent organization’s default.
> * Web Application A is a regular-use web application and isn’t linked to any policies.
> * Web Application B is used for highly sensitive processes. Its service principal is linked to Token Lifetime Policy 2, which has a Session Token Max Age of 30 minutes.
>
> At 12:00 PM, the user starts a new browser session and tries to access Web Application A. The user is redirected to Azure AD and is asked to sign in. This creates a cookie that has a session token in the browser. The user is redirected back to Web Application A with an ID token that allows the user to access the application.
>
> At 12:15 PM, the user tries to access Web Application B. The browser redirects to Azure AD, which detects the session cookie. Web Application B’s service principal is linked to Token Policy 2, but it's also part of the parent organization with default Token Policy 1. Token Policy 2 takes effect because policies linked to service principals have a higher priority than organization default policies. The session token was originally issued within the last 30 minutes, so it is considered valid. The user is redirected back to Web Application B with an ID token that grants them access.
>
> At 1:00 PM, the user tries to access Web Application A. The user is redirected to Azure AD. Web Application A is not linked to any policies, but because it is in a organization with default Token Policy 1, that policy takes effect. The session cookie that was originally issued within the last 8 hours is detected. The user is silently redirected back to Web Application A with a new ID token. The user is not required to authenticate.
>
> Immediately afterward, the user tries to access Web Application B. The user is redirected to Azure AD. As before, Token Policy 2 takes effect. Because the token was issued longer than 30 minutes ago, the user is prompted to reenter their credentials. A brand-new session and ID token are issued. The user can then access Web Application B.
>
>

## Configurable policy properties, in-depth
### Access token lifetime
**String:** AccessTokenLifetime

**Affects:** Access tokens, ID tokens

**Summary:** This policy controls how long access and ID tokens for this resource are considered valid. Reducing the access token lifetime mitigates the risk of an access or ID token being used by a malicious actor for an extended period of time (because they can't be revoked). But, it also adversely affects performance, because the tokens have to be replaced more often.

### Refresh token max inactive time
**String:** MaxInactiveTime

**Affects:** Refresh tokens

**Summary:** This policy controls how old a refresh token can be before a client can no longer use it to retrieve a new access/refresh token pair when attempting to access this resource. Because a new refresh token usually is returned when a refresh token is used, the client must not have tried to access any resource by using the current refresh token for the specified period of time before this policy would prevent access.

This policy forces users who have not been active on their client to reauthenticate to retrieve a new refresh token.

Note that the Refresh Token Max Inactive Time must be set to a lower value than the Single-Factor Token Max Age and the Multi-Factor Refresh Token Max Age.

### Single-factor refresh token max age
**String:** MaxAgeSingleFactor

**Affects:** Refresh tokens

**Summary:** This policy controls how long a user can continue to use refresh tokens to get new access/refresh token pairs after the last time they authenticated successfully with only a single factor. Once a user authenticates and receives a new refresh token, they will be able to use the refresh token flow (as long as the current refresh token is not revoked and it is not left unused for longer than the inactive time) for the specified period of time. At that point, users will be forced to re-authenticate to receive a new refresh token.

Reducing the max age will force users to authenticate more often. Since single-factor authentication is considered less secure than a multi-factor authentication, it is recommended that this policy is set to an equal or lesser value than the Multi-Factor Refresh Token Max Age Policy.

### Multi-factor refresh token max age
**String:** MaxAgeMultiFactor

**Affects:** Refresh tokens

**Summary:** This policy controls how long a user can continue to use refresh tokens to get new access/refresh token pairs after the last time they authenticated successfully with multiple factors. Once a user authenticates and receives a new refresh token, they will be able to use the refresh token flow (as long as the current refresh token is not revoked and it is not left unused for longer than the inactive time) for the specified period of time. At that point, users will be forced to re-authenticate to receive a new refresh token.

Reducing the max age will force users to authenticate more often. Since single-factor authentication is considered less secure than a multi-factor authentication, it is recommended that this policy is set to an equal or greater value than the Single-Factor Refresh Token Max Age Policy.

### Single-factor session token max age
**String:** MaxAgeSessionSingleFactor

**Affects:** Session tokens (persistent and non-persistent)

**Summary:** This policy controls how long a user can continue to use session tokens to get new ID and session tokens after the last time they authenticated successfully with only a single factor. Once a user authenticates and receives a new session token, they will be able to use the session token flow (as long as the current session token is not revoked or expired) for the specified period of time. At that point, users will be forced to re-authenticate to receive a new session token.

Reducing the max age will force users to authenticate more often. Since single-factor authentication is considered less secure than a multi-factor authentication, it is recommended that this policy is set to an equal or lesser value than the Multi-Factor Session Token Max Age Policy.

### Multi-factor session token max age
**String:** MaxAgeSessionMultiFactor

**Affects:** Session tokens (persistent and non-persistent)

**Summary:** This policy controls how long a user can continue to use session tokens to get new ID and session tokens after the last time they authenticated successfully with multiple factors. Once a user authenticates and receives a new session token, they will be able to use the session token flow (as long as the current session token is not revoked or expired) for the specified period of time. At that point, users will be forced to re-authenticate to receive a new session token.

Reducing the max age will force users to authenticate more often. Since single-factor authentication is considered less secure than a multi-factor authentication, it is recommended that this policy is set to an equal or greater value than the Single-Factor Session Token Max Age Policy.

## Sample token lifetime policies
Being able to create and manage token lifetimes for apps, service principals, and your overall organization exposes all kinds of new scenarios possible in Azure AD.  We're going to walk through a few common policy scenarios that will help you impose new rules for:

* Token Lifetimes
* Token Max Inactive Times
* Token Max Age

We'll walk through a few scenarios including:

* Managing an organization's default policy
* Creating a policy for web sign-in
* Creating a policy for native apps that call a web API
* Managing an advanced policy

### Prerequisites
In the sample scenarios, we create, update, link, and delete policies on apps, service principals, and your overall organization. If you are new to Azure AD, see [this article](active-directory-howto-tenant.md) to help you get started before proceeding with these samples.  

1. To begin, download the latest [Azure AD PowerShell Cmdlet Preview](https://www.powershellgallery.com/packages/AzureADPreview).
2. Once you have the Azure AD PowerShell Cmdlets, run Connect command to sign into your Azure AD admin account. You'll need to do this whenever you start a new session.

    ```PowerShell
    Connect-AzureAD -Confirm
    ```

3. Run the following command to see all policies that have been created in your organization.  This command should be used after most operations in the following scenarios.  It will also help you get the **ObjectId** of your policies.

    ```PowerShell
    Get-AzureADPolicy
    ```

### Sample: Managing an organization's default policy
In this sample, we will create a policy that allows your users to sign in less frequently across your entire organization.

To do this, we create a token lifetime policy for Single-Factor Refresh Tokens that is applied across your organization. This policy will be applied to every application in your organization, and each service principal that doesn’t already have a policy set to it.

#### 1. Create a Token Lifetime Policy

Set the Single-Factor Refresh Token to "until-revoked". This means that the token won't expire until access is revoked.  The policy definition below is what we will be creating:

```PowerShell
@('{
    "TokenLifetimePolicy":
    {
        "Version":1,
        "MaxAgeSingleFactor":"until-revoked"
    }
}')
```

Run the following command to create this policy:

```PowerShell
New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1, "MaxAgeSingleFactor":"until-revoked"}}') -DisplayName "OrganizationDefaultPolicyScenario" -IsOrganizationDefault $true -Type "TokenLifetimePolicy"
```

To see your new policy and get its ObjectId, run the following command.

```PowerShell
Get-AzureADPolicy
```

#### 2. Update the Policy

You've decided that the first policy is not quite as strict as your service requires, and have decided you want your Single-Factor Refresh Tokens to expire in 2 days. Run the following command.

```PowerShell
Set-AzureADPolicy -ObjectId <ObjectId FROM GET COMMAND> -DisplayName "OrganizationDefaultPolicyUpdatedScenario" -Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxAgeSingleFactor":"2.00:00:00"}}')
```

#### 3. You're done!

### Sample: Creating a policy for web sign-in

In this sample, we will create a policy that will require your users to authenticate more frequently into your Web App. This policy will set the lifetime of the Access/Id Tokens and the Max Age of a Multi-Factor Session Token to the service principal of your web app.

#### 1. Create a Token Lifetime Policy.

This policy for Web Sign-in will set the Access/Id Token lifetime and the Max Single-Factor Session Token Age to 2 hours.

```PowerShell
New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"AccessTokenLifetime":"02:00:00","MaxAgeSessionSingleFactor":"02:00:00"}}') -DisplayName "WebPolicyScenario" -IsOrganizationDefault $false -Type "TokenLifetimePolicy"
```

To see your new policy and get its ObjectId, run the following command.

```PowerShell
Get-AzureADPolicy
```

#### 2. Assign the policy to your service principal.

We're going to link this new policy with a service principal.  You'll also need a way to access the **ObjectId** of your service principal. You can query the [Microsoft Graph](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity) or go to our [Graph Explorer Tool](https://graphexplorer.cloudapp.net/) and sign into your Azure AD account to see all your organization's service principals.

Once you have the **ObjectId**, Run the following command.

```PowerShell
Add-AzureADServicePrincipalPolicy -ObjectId <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
```

#### 3. You're Done!

### Sample: Creating a policy for native apps calling a Web API
In this sample, we will create a policy that requires users to authenticate less and will lengthen the amount of time they can be inactive without having to authenticate again. The policy will be applied to the Web API, that way when the Native App requests it as a resource this policy will be applied.

#### 1. Create a Token Lifetime Policy.

This command will create a strict policy for a Web API.

```PowerShell
New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxInactiveTime":"30.00:00:00","MaxAgeMultiFactor":"until-revoked","MaxAgeSingleFactor":"180.00:00:00"}}') -DisplayName "WebApiDefaultPolicyScenario" -IsOrganizationDefault $false -Type "TokenLifetimePolicy"
```

To see your new policy and get its ObjectId, run the following command.

```PowerShell
Get-AzureADPolicy
```

#### 2. Assign the policy to your Web API.

We're going to link this new policy with an application.  You'll also need a way to access the **ObjectId** of your application. The best way to find your app's **ObjectId** is to use the [Azure Portal](https://portal.azure.com/).

Once you have the **ObjectId**, Run the following command.

```PowerShell
Add-AzureADApplicationPolicy -ObjectId <ObjectId of the Application> -RefObjectId <ObjectId of the Policy>
```

#### 3. You're done!

### Sample: Managing an advanced policy
In this sample, we create a few policies to demonstrate how the priority system works, and how you can manage multiple policies applied to several objects. This can give you some insight into the priority of policies explained earlier, and can help you manage more complicated scenarios.

#### 1. Create a Token Lifetime Policy.

We've created a organization default policy that sets the Single-Factor Refresh Token lifetime to 30 days:

```PowerShell
New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxAgeSingleFactor":"30.00:00:00"}}') -DisplayName "ComplexPolicyScenario" -IsOrganizationDefault $true -Type "TokenLifetimePolicy"
```

To see your new policy and get it's ObjectId, run the following command:

```PowerShell
Get-AzureADPolicy
```

#### 2. Assign the Policy to a Service Principal.

Now we have a policy on the entire organization.  Let's say we want to preserve this 30 day policy for a specific service principal, but change the organization default policy to be the upper limit of "until-revoked".

First, We're going to link this new policy with our service principal.  You'll also need a way to access the **ObjectId** of your service principal. You can query the [Microsoft Graph](https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipal-entity) or go to our [Graph Explorer Tool](https://graphexplorer.cloudapp.net/) and sign into your Azure AD account to see all your organization's service principals.

Once you have the **ObjectId**, Run the following command.

```PowerShell
Add-AzureADServicePrincipalPolicy -ObjectId <ObjectId of the ServicePrincipal> -RefObjectId <ObjectId of the Policy>
```

#### 3. Set the IsOrganizationDefault flag to false.

```PowerShell
Set-AzureADPolicy -ObjectId <ObjectId of Policy> -DisplayName "ComplexPolicyScenario" -IsOrganizationDefault $false
```

#### 4. Create a new Organization Default Policy.

```PowerShell
New-AzureADPolicy -Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxAgeSingleFactor":"until-revoked"}}') -DisplayName "ComplexPolicyScenarioTwo" -IsOrganizationDefault $true -Type "TokenLifetimePolicy"
```

#### 5. You're Done!

You now have the original policy linked to your service principal and the new policy set as your organization default policy.  It's important to remember that policies applied to service principals have priority over organization default policies.

## Cmdlet Reference

### Manage policies

The following cmdlets can be used to manage policies.

#### New-AzureADPolicy

Creates a new policy.

```PowerShell
New-AzureADPolicy -Definition <Array of Rules> -DisplayName <Name of Policy> -IsOrganizationDefault <boolean> -Type <Policy Type>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;Definition</code> |The array of stringified JSON that contains all the rules of the policy. | `-Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxInactiveTime":"20:00:00"}}')` |
| <code>&#8209;DisplayName</code> |String of the policy name |`-DisplayName "MyTokenPolicy"` |
| <code>&#8209;IsOrganizationDefault</code> |If true sets the policy as organization's default policy, if false does nothing |`-IsOrganizationDefault $true` |
| <code>&#8209;Type</code> |The type of policy, for token lifetimes always use "TokenLifetimePolicy" | `-Type "TokenLifetimePolicy"` |
| <code>&#8209;AlternativeIdentifier</code> [Optional] |Sets an alternative ID for the policy. |`-AlternativeIdentifier "myAltId"` |

</br></br>

#### Get-AzureADPolicy
Gets all AzureAD Policies or specified policy

```PowerShell
Get-AzureADPolicy
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> [Optional] |The ObjectId of the policy you want. |`-ObjectId <ObjectId of Policy>` |

</br></br>

#### Get-AzureADPolicyAppliedObject
Gets all apps and service principals linked to a policy

```PowerShell
Get-AzureADPolicyAppliedObject -ObjectId <ObjectId of Policy>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the policy you want. |`-ObjectId <ObjectId of Policy>` |

</br></br>

#### Set-AzureADPolicy
Updates an existing policy

```PowerShell
Set-AzureADPolicy -ObjectId <ObjectId of Policy> -DisplayName <string>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the policy you want. |`-ObjectId <ObjectId of Policy>` |
| <code>&#8209;DisplayName</code> |The string of the policy name. |`-DisplayName "MyTokenPolicy"` |
| <code>&#8209;Definition</code> [Optional] |The array of stringified JSON that contains all the rules of the policy. |`-Definition @('{"TokenLifetimePolicy":{"Version":1,"MaxInactiveTime":"20:00:00"}}')` |
| <code>&#8209;IsOrganizationDefault</code> [Optional] |If true, sets the policy as the organization's default policy. If false, does nothing |`-IsOrganizationDefault $true` |
| <code>&#8209;Type</code> [Optional] |The type of policy. For token lifetimes, always use "TokenLifetimePolicy". |`-Type "TokenLifetimePolicy"` |
| <code>&#8209;AlternativeIdentifier</code> [Optional] |Sets an alternative ID to the policy. |`-AlternativeIdentifier "myAltId"` |

</br></br>

#### Remove-AzureADPolicy
Deletes the specified policy

```PowerShell
 Remove-AzureADPolicy -ObjectId <ObjectId of Policy>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the policy you want. | `-ObjectId <ObjectId of Policy>` |

</br></br>

### Application policies
You can use the following cmdlets for application policies.</br></br>

#### Add-AzureADApplicationPolicy
Links the specified policy to an application

```PowerShell
Add-AzureADApplicationPolicy -ObjectId <ObjectId of Application> -RefObjectId <ObjectId of Policy>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the application. | `-ObjectId <ObjectId of Application>` |
| <code>&#8209;RefObjectId</code> |The ObjectId of the policy. | `-RefObjectId <ObjectId of Policy>` |

</br></br>

#### Get-AzureADApplicationPolicy
Gets the policy assigned to an application.

```PowerShell
Get-AzureADApplicationPolicy -ObjectId <ObjectId of Application>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the application. | `-ObjectId <ObjectId of Application>` |

</br></br>

#### Remove-AzureADApplicationPolicy
Removes a policy from an application.

```PowerShell
Remove-AzureADApplicationPolicy -ObjectId <ObjectId of Application> -PolicyId <ObjectId of Policy>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the application. | `-ObjectId <ObjectId of Application>` |
| <code>&#8209;PolicyId</code> |The ObjectId of the policy. | `-PolicyId <ObjectId of Policy>` |

</br></br>

### Service principal policies
You can use the following cmdlets for service principal policies.</br></br>

#### Add-AzureADServicePrincipalPolicy
Links the specified policy to a service principal.

```PowerShell
Add-AzureADServicePrincipalPolicy -ObjectId <ObjectId of ServicePrincipal> -RefObjectId <ObjectId of Policy>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the application. | `-ObjectId <ObjectId of Application>` |
| <code>&#8209;RefObjectId</code> |The ObjectId of the policy. | `-RefObjectId <ObjectId of Policy>` |

</br></br>

#### Get-AzureADServicePrincipalPolicy
Gets any policy linked to the specified service principal

```PowerShell
Get-AzureADServicePrincipalPolicy -ObjectId <ObjectId of ServicePrincipal>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the application. | `-ObjectId <ObjectId of Application>` |

</br></br>

#### Remove-AzureADServicePrincipalPolicy
Removes the policy from the specified service principal.

```PowerShell
Remove-AzureADServicePrincipalPolicy -ObjectId <ObjectId of ServicePrincipal>  -PolicyId <ObjectId of Policy>
```

| Parameters | Description | Example |
| --- | --- | --- |
| <code>&#8209;ObjectId</code> |The ObjectId of the application. | `-ObjectId <ObjectId of Application>` |
| <code>&#8209;PolicyId</code> |The ObjectId of the policy. | `-PolicyId <ObjectId of Policy>` |
