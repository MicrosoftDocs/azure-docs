---
title: Overview of Azure Active Directory authentication strength
description: Learn how admins can use Azure AD Conditional Access to distinguish which authentication methods can be used based on relevant security factors.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/23/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla, inbarckms

ms.collection: M365-identity-device-management
---
# Azure AD authentication strength 

Authentication strength is a Conditional Access (CA) control that allows administrators to require specific combinations of authentication methods to access a resource. For example, you can require phishing-resistant authentication methods to access a sensitive resource while allowing less secure multifactor authentication (MFA) combinations, such as password + SMS, to access non-sensitive applications. 

Authentication strength is based on the Authentication Method policy, where administrators can scope authentication methods to specific users and groups for different applications in Azure Active Directory (Azure AD). It allows administrators to scope the usage of these methods even further for specific scenarios such as sensitive resource access, user risk, location, and more. 

When creating a Conditional Access policy with **Require authentication strength** control, Administrators can choose between three built-in Authentication strengths policies (Multifactor authentication, Passwordless MFA and Phishing-resistant MFA), or create a custom Authentication strength policy based on the authentication methods combinations they want to allow. 
 
## Scenarios for authentication strength

Authentication strength can help customers address scenarios such as: 

- Require specific authentication methods when accessing a sensitive resource
- Require a specific authentication method when a user is taking a sensitive action within an application (in combination with Conditional Access authentication context)
- Require users to use a specific authentication method when they access sensitive apps outside of the corporate network
- Require more secure authentication methods for users at high risk 

## Authentication strength policy 

Authentication strength policy contains a combination of authentication methods. Users can satisfy the authentication strength policy by authenticating with any of the combinations allowed by the policy.

For example, the built-in “Phishing-resistant MFA” policy has the following combinations:
•	Windows Hello for Business
OR
•	FIDO2 Security Key
OR
•	Certificate Based Authentication (Multi-Factor)

<!--placeholder - screenshot of phishing-resistant auth strengths -->

When you create a Conditional Access policy that uses the **Require authentication strength** grant control, you can choose from built-in authentication strength or custom authentication strengths.

<!--place holder - screenshot of CA grant control with auth strength control drop down open-->

### Built-in authentication strengths
Built-in authentication strengths are combinations of authentication methods that are predefined by Microsoft. Built-in authentication strengths are always available and can't be modified.
The following table lists the combinations of authentication methods included in each built-in authentication strength policy. Depending on which methods are available in the Authentication Methods policy and registered for users, they can use any one of the combinations to sign-in.

•	**MFA strength policy** - the same set of combinations that could be used to satisfy the **Require multifactor authentication setting**.

•	**Passwordless MFA authentication strength policy** - includes authentication methods that satisfy MFA but don't require a password.

•	**Phishing-resistant MFA authentication strength policy** - includes methods that require an interaction between the authentication method and the sign-in surface.

|Authentication method combination |MFA strength | Passwordless MFA strength| Phishing-resistant MFA strength|
|----------------------------------|-------------|-------------------------------------|-------------------------------------------|
|Windows Hello for Business| &#x2705; | &#x2705; | &#x2705; | 
|FIDO2 security key| &#x2705; | &#x2705; | &#x2705; |
|Certificate Based Authentication (Multi-Factor) | &#x2705; | &#x2705; | &#x2705; |
|Microsoft Authenticator (Phone Sign-in)| &#x2705; | &#x2705; | |
|Temporary Access Pass (One-time use AND Multi-use)| &#x2705; | | |
|Password + Something you have*| &#x2705; | | |
|Federated Multi-Factor| &#x2705; | | |
|Federated Single-Factor+ Something you have*| &#x2705; | | |
|Certificate Based Authentication (Single-Factor)| | | |
|SMS sign-in | | | |
|Password | | | |
|Federated single-factor authentication| | | |
|Email One-time pass (Guest)| | | |

*Something you have refers to one of the following methods: SMS, Voice, Push notification, Software or Hardware-based OATH token. 

The following API call can be used to list definitions of all the built-in Authentication Strength by calling this API endpoint:
`https://graph.microsoft.com/beta/identity/conditionalAccess/authenticationStrengths/policies?$filter=policyType eq 'builtIn'`

As we add support for additional authentication methods and combinations, the built-in authentication strengths policies will get updated. 

### Custom authentication strengths
In addition to the three built-in authentication strengths, admins can create their own custom authentication strength policies to exactly suit their requirements. A custom authentication strength policy can contain any of the supported combinations in the preceding table. 
Deleting a custom authentication strength is not allowed if the authentication strength policy is referenced by any Conditional Access policy.

<!--
### Place holder: How to create custom authentication strengths policy including FIDO2 AA GUID
### Place holder:How to create conditional access policy that uses authentication strength
-	Add a note that you can use either require mfa or require auth strengths
-->

## External users 
<!-- Namrata to include admin section-->

## User experience

To evaluate if the user should gain access to the resource, the following considerations are taken into account: 

- Which methods are available in the Authentication Strength policy? 
- Which methods are allowed for user sign-in in the Authentication Method policy?
- Is the user registered for the required methods?

When accessing a resource protected by an authentication strength Conditional Access policy, we evaluate if the methods they have previously used satisfy the authentication requirements. For example, let's say a user signs in with Password + SMS. They access a resource protected by an MFA authentication strength policy. In this case, the user can access the resource without another authentication prompt.

Then they access a resource protected by a Phishing-resistant MFA authentication strength policy. At this point, the user will be prompted to provide a phishing-resistant authentication method, such as Windows Hello for Business. 

If the user has never used the method required by the authentication strength policy, the user will be redirected to register the required methods. Registering additional strong authentication methods is possible only if the user can satisfy MFA requirements.

If the authentication strength policy doesn't include methods that the user can register and use, the user is blocked from sign-in to the resource. 

### User experience for external users
<!-- Namrata to add -->

### Registering additional authentication strength 
Not all authentication methods are available to register in the inline registration flow of the combined registration. For the best user experience, make sure users are registered for the different methods they may need to use.

#### Register additional methods that are not supported by the inline registration flow

* Microsoft Authenticator (Phone Sign-in)
* FIDO2
* Certificate Based Authentication
* Windows Hello for Business 
<!-- Place holder - need links to the above or short description  --->


## Known issues
<!-- Inbar to review known issues with engineetring -->


## Limitations
Conditional access policies are only evaluated after the initial authentication. This means that authentication strengths will not restrict the authentication method used for the user’s first factor. For example, if you are using the phishing-resistant built-in strength, this will not prevent a user from typing in their password, but they will be required to use a FIDO2 key before they can continue.

Conditional Access grant controls ‘Require multifactor authentication’ and ‘Require authentication strength’ cannot be used together in the same policy. The built-in authentication strengths ‘Multifactor authentication’ is equivalent to the ‘Require multifactor authentication’ grant control.

Combinations that are currently not available: <!-- Namrata to update about B2B, Inbar to work with Vimala on CBA-->

<!-- place holder: Auth Strength with CCS -->
<! Place holder: what-if tool -->


## Prerequisites

**License** Your tenant needs to have Azure AD Premium P1 license to use Conditional Access. If needed, you can enable free trial. 
**Enable combined registration** -  Authentication strengths policy is supported when using the combined registration. Using the legacy registration will result in poor user experience as the user may register methods who are not required by the authentication method policy.

## Next steps

- How to configure access control by using authentication strengths
- [Troubleshoot authentication strengths](troubleshoot-authentication-strengths.md) 

