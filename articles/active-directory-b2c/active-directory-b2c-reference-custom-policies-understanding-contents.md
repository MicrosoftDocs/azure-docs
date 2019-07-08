---
title: Understanding custom policies of the starter pack in Azure Active Directory B2C | Microsoft Docs
description: A topic on Azure Active Directory B2C custom policies.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 04/25/2017
ms.author: marsma
ms.subservice: B2C
---

# Understanding the custom policies of the Azure AD B2C Custom Policy starter pack

This section lists all the core elements of the B2C_1A_base policy that comes with the **Starter Pack** and that is leveraged for authoring your own policies through the inheritance of the *B2C_1A_base_extensions policy*.

As such, it more particularly focuses on the already defined claim types, claims transformations, content definitions, claims providers with their technical profile(s), and the core user journeys.

> [!IMPORTANT]
> Microsoft makes no warranties, express or implied, with respect to the information provided hereafter. Changes may be introduced at any time, before GA time, at GA time, or after.

Both your own policies and the B2C_1A_base_extensions policy can override these definitions and extend this parent policy by providing additional ones as needed.

The core elements of the *B2C_1A_base policy* are claim types, claims transformations, and content definitions. These elements can susceptible to be referenced in your own policies as well as in the *B2C_1A_base_extensions policy*.

## Claims schemas

This claims schemas is divided into three sections:

1.	A first section that lists the minimum claims that are required for the user journeys to work properly.
2.	A second section that lists the claims required for query string parameters and other special parameters to be passed to other claims providers, especially login.microsoftonline.com for authentication. **Please do not modify these claims**.
3.	And eventually a third section that lists any additional, optional claims that can be collected from the user, stored in the directory and sent in tokens during sign in. New claims type to be collected from the user and/or sent in the token can be added in this section.

> [!IMPORTANT]
> The claims schema contains restrictions on certain claims such as passwords and usernames. The Trust Framework (TF) policy treats Azure AD as any other claims provider and all its restrictions are modelled in the custom policy. A policy could be modified to add more restrictions, or use another claims provider for credential storage which will have its own restrictions.

The available claim types are listed below.

### Claims that are required for the user journeys

The following claims are required for user journeys to work properly:

| Claims type | Description |
|-------------|-------------|
| *UserId* | Username |
| *signInName* | Sign in name |
| *tenantId* | Tenant identifier (ID) of the user object in Azure AD B2C |
| *objectId* | Object identifier (ID) of the user object in Azure AD B2C |
| *password* | Password |
| *newPassword* | |
| *reenterPassword* | |
| *passwordPolicies* | Password policies used by Azure AD B2C to determine password strength, expiry, etc. |
| *sub* | |
| *alternativeSecurityId* | |
| *identityProvider* | |
| *displayName* | |
| *strongAuthenticationPhoneNumber* | User's telephone number |
| *Verified.strongAuthenticationPhoneNumber* | |
| *email* | Email address that can be used to contact the user |
| *signInNamesInfo.emailAddress* | Email address that the user can use to sign in |
| *otherMails* | Email addresses that can be used to contact the user |
| *userPrincipalName* | Username as stored in the Azure AD B2C |
| *upnUserName* | Username for creating user principal name |
| *mailNickName* | User's mail nick name as stored in the Azure AD B2C |
| *newUser* | |
| *executed-SelfAsserted-Input* | Claim that specifies whether attributes were collected from the user |
| *executed-PhoneFactor-Input* | Claim that specifies whether a new phone number was collected from the user |
| *authenticationSource* | Specifies whether the user was authenticated at Social Identity Provider, login.microsoftonline.com, or local account |

### Claims required for query string parameters and other special parameters

The following claims are required to pass on special parameters (including some query string parameters) to other claims providers:

| Claims type | Description |
|-------------|-------------|
| *nux* | Special parameter passed for local account authentication to login.microsoftonline.com |
| *nca* | Special parameter passed for local account authentication to login.microsoftonline.com |
| *prompt* | Special parameter passed for local account authentication to login.microsoftonline.com |
| *mkt* | Special parameter passed for local account authentication to login.microsoftonline.com |
| *lc* | Special parameter passed for local account authentication to login.microsoftonline.com |
| *grant_type* | Special parameter passed for local account authentication to login.microsoftonline.com |
| *scope* | Special parameter passed for local account authentication to login.microsoftonline.com |
| *client_id* | Special parameter passed for local account authentication to login.microsoftonline.com |
| *objectIdFromSession* | Parameter provided by the default session management provider to indicate that the object ID has been retrieved from an SSO session |
| *isActiveMFASession* | Parameter provided by the MFA session management to indicate that the user has an active MFA session |

### Additional (optional) claims that can be collected

The following claims are additional claims that can be collected from the users, stored in the directory, and sent in the token. As outlined before, additional claims can be added to this list.

| Claims type | Description |
|-------------|-------------|
| *givenName* | User's given name (also known as first name) |
| *surname* | User's surname (also known as family name or last name) |
| *Extension_picture* | User's picture from social |

## Claim transformations

The available claim transformations are listed below.

| Claim transformation | Description |
|----------------------|-------------|
| *CreateOtherMailsFromEmail* | |
| *CreateRandomUPNUserName* | |
| *CreateUserPrincipalName* | |
| *CreateSubjectClaimFromObjectID* | |
| *CreateSubjectClaimFromAlternativeSecurityId* | |
| *CreateAlternativeSecurityId* | |

## Content definitions

This section describes the content definitions already declared in the *B2C_1A_base* policy. These content definitions are susceptible to be referenced, overridden, and/or extended as needed in your own policies as well as in the *B2C_1A_base_extensions* policy.

| Claims provider | Description |
|-----------------|-------------|
| *Facebook* | |
| *Local Account SignIn* | |
| *PhoneFactor* | |
| *Azure Active Directory* | |
| *Self Asserted* | |
| *Local Account* | |
| *Session Management* | |
| *Trustframework Policy Engine* | |
| *TechnicalProfiles* | |
| *Token Issuer* | |

## Technical profiles

This section depicts the technical profiles already declared per claim provider in the *B2C_1A_base* policy. These technical profiles are susceptible to be further referenced, overridden, and/or extended as needed in your own policies as well as in the *B2C_1A_base_extensions* policy.

### Technical profiles for Facebook

| Technical profile | Description |
|-------------------|-------------|
| *Facebook-OAUTH* | |

### Technical profiles for Local Account Signin

| Technical profile | Description |
|-------------------|-------------|
| *Login-NonInteractive* | |

### Technical profiles for Phone Factor

| Technical profile | Description |
|-------------------|-------------|
| *PhoneFactor-Input* | |
| *PhoneFactor-InputOrVerify* | |
| *PhoneFactor-Verify* | |

### Technical profiles for Azure Active Directory

| Technical profile | Description |
|-------------------|-------------|
| *AAD-Common* | Technical profile included by the other AAD-xxx technical profiles |
| *AAD-UserWriteUsingAlternativeSecurityId* | Technical profile for social logins |
| *AAD-UserReadUsingAlternativeSecurityId* | Technical profile for social logins |
| *AAD-UserReadUsingAlternativeSecurityId-NoError* | Technical profile for social logins |
| *AAD-UserWritePasswordUsingLogonEmail* | Technical profile for local accounts |
| *AAD-UserReadUsingEmailAddress* | Technical profile for local accounts |
| *AAD-UserWriteProfileUsingObjectId* | Technical profile for updating user record using objectId |
| *AAD-UserWritePhoneNumberUsingObjectId* | Technical profile for updating user record using objectId |
| *AAD-UserWritePasswordUsingObjectId* | Technical profile for updating user record using objectId |
| *AAD-UserReadUsingObjectId* | Technical profile is used to read data after user authenticates |

### Technical profiles for Self Asserted

| Technical profile | Description |
|-------------------|-------------|
| *SelfAsserted-Social* | |
| *SelfAsserted-ProfileUpdate* | |

### Technical profiles for Local Account

| Technical profile | Description |
|-------------------|-------------|
| *LocalAccountSignUpWithLogonEmail* | |

### Technical profiles for Session Management

| Technical profile | Description |
|-------------------|-------------|
| *SM-Noop* | |
| *SM-AAD* | |
| *SM-SocialSignup* | Profile name is being used to disambiguate AAD session between sign up and sign in |
| *SM-SocialLogin* | |
| *SM-MFA* | |

### Technical profiles for the trust framework policy engine

Currently, no technical profiles are defined for the **Trustframework Policy Engine TechnicalProfiles** claims provider.

### Technical profiles for Token Issuer

| Technical profile | Description |
|-------------------|-------------|
| *JwtIssuer* | |

## User journeys

This section depicts the user journeys already declared in the *B2C_1A_base* policy. These user journeys are susceptible to be further referenced, overridden, and/or extended as needed in your own policies as well as in the *B2C_1A_base_extensions* policy.

| User journey | Description |
|--------------|-------------|
| *SignUp* | |
| *SignIn* | |
| *SignUpOrSignIn* | |
| *EditProfile* | |
| *PasswordReset* | |
