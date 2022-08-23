---
title: Azure AD authentication strengths overview
description: Learn how admins can use Azure AD Conditional Access to distinguish which authentication methods can be used based on relevant security factors.

services: multi-factor-authentication
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/23/2022

ms.author: justinha
author: justinha
manager: amycolannino
ms.reviewer: michmcla

ms.collection: M365-identity-device-management
---
# Azure AD authentication strengths overview 

Authentication strengths are a set of Azure Active Directory (Azure AD) authentication method combinations that can be used to authenticate users for scenarios that require multifactor authentication (MFA). Admins can use Conditional Access (CA) to choose from a set of predefined combinations, or create a custom set of combinations. Authentication strengths let admins distinguish which authentication methods can be used based on factors such as:

- The app the user is accessing
- The user’s risk 
- Other contexts offered in CA policies

Authentication strengths are an evolution for strong authentication. They provide an explicit way to perform MFA by using stronger methods. Rather than simply choosing to require MFA for example, you can choose which authentication methods need to be used based on your own policies. 

## Scenarios for authentication strengths

- Comply with regulated authentication requirements for sensitive apps
- Require a specific MFA method when a user is taking a sensitive action within an application
- Require users to use a specific MFA method when they access sensitive apps outside of the corporate network
- Support single-factor and multifactor certificate-based authentication (CBA) and allow only multifactor CBA for sensitive applications
- Require stronger authentication methods when the user is in high risk
- Enforce use of Microsoft Authenticator when users access specific SaaS apps.

## Types of authentication strengths

You can choose from built-in authentication strengths or create custom authentication strengths. 

### Built-in authentication strengths
Microsoft predefined some combinations of authentication methods, called _built-in authentication strengths_. Built-in authentication strengths are always available and can't be modified. 

The following table lists the combinations of authentication methods included in each built-in authentication strength. End users will need to satisfy one of these methods when the strength enforced by a CA policy.

|Authentication method combination |MFA strength | Passwordless authentication strength| Phishing resistant authentication strength|
|----------------------------------|-------------|-------------------------------------|-------------------------------------------|
|Windows Hello for Business| &#x2705; | &#x2705; | &#x2705; | 
|FIDO2 security key| &#x2705; | &#x2705; | &#x2705; |
|x509 Certificate (multifactor) | &#x2705; | &#x2705; | &#x2705; |
|Passwordless sign-in with the Microsoft Authenticator App| &#x2705; | &#x2705; | |
|Temporary Access Pass (single or multiuse)| &#x2705; | | |
|Password + Something you have*| &#x2705; | | |
|Federated multi-factor authentication| &#x2705; | | |
|Federated single-factor authentication + Something you have*| &#x2705; | | |
|x509 Certificate (single-factor)| | | |
|SMS sign-in | | | |
|Password | | | |
|Federated single-factor authentication| | | |
|Email One-time pass (Guest)| | | |

*Something you have refers to one of the following methods: SMS, Voice, Push notification, Software or Hardware-based OATH token. 

The following API call can be used to list definitions of all the built-in Authentication Strength by calling this API endpoint:
`https://graph.microsoft.com/beta/identity/conditionalAccess/authenticationStrengths/policies?$filter=policyType eq 'builtIn'`

### Custom Authentication Strengths
In addition to the three built-in authentication strengths, admins can create their own custom authentication strengths to exactly suit their requirements. Custom strengths can contain any of the combinations in the preceding table. You can create custom authentication strengths in the Azure Portal or by using Microsoft Graph API. You can add custom authentication strengths to any CA policy. 

## Known issues
We are actively working on problems and will post updates when they are fixed.
<!---
- We recommend NOT applying authentication strengths to **All applications** in Conditional Access. When an authentication strength applies to all applications and the user is not registered for any of its methods, the user will get stuck in a loop if they access any application.
- The Sign-in logs show incomplete information for Authentication Strengths
- A)[Grant Control] section in [Conditional Access Policy Details] will always show “Satisfied”, even if the Authentication Strength requirement wasn’t satisfiedNOTE: Authentication Details do show the expected status (Succeeded = false)B)[Authentication requirement] field on the Basic info tab always shows “Single-factor authentication” when Authentication Strength requirements were satisfiedC)Authentication Strengths are not evaluated if the conditional access policy is in “Report-only” mode. You must enable the policy to see information in the sign-in logsThe audit logs are missing details for creation of and updates to authentication strengthsCertain scenarios are not restricted by the Authentication Strengths UX, and may result in a generic error message. To see the error, you will need to open up the edge network inspector(Control + Shift + J), reproduce the error, and then click on the $batch request and expand the response:Known errors that can result in this error message:A)Authentication Strength names cannot be longer than 30 charactersB)Authentication Strengths cannot be deleted while they are in use --->

## Limitations of Conditional Access policies
Conditional access policies are only evaluated after the initial authentication. This means that authentication strengths will not restrict the authentication method used for the user’s first factor. For example, if you are using the phishing-resistant built-in strength, this will not prevent a user from typing in their password, but they will be required to use a FIDO2 key before they can continue.

## Prerequisites

Your tenant needs to have Azure AD Premium P1 license to use Conditional Access. If needed, you can enable free trial. 

## Next steps

- How to configure access control by using authentication strengths
- [Troubleshoot authentication strengths](troubleshoot-authentication-strengths.md) 

