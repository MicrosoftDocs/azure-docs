---
title: About technical profiles | Microsoft Docs
description: Learn about how technical profiles are used in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 08/13/2018
ms.author: davidmu
ms.component: B2C
---

# About technical profiles

A technical profile provides a framework with a built-in mechanism to communicate with different type of parties using a custom policy in Azure Active Directory (Azure AD) B2C. Technical profiles are used to communicate with your Azure AD B2C tenant, to create a user, or read a user profile. A technical profile can be self-asserted to enable interaction with the user. For example, collect the user's credential to sign in and then render the sign-up page or password reset page. 

A technical profile enables these types of scenarios:

- Interaction with Restful services. You can call a Restful API to validate user data or possibly enrich data by further integrating with corporate line-of-business applications. 
- Run your own custom business logic to update corporate databases, send push notifications, or manage permissions. 
- Call Azure Multi-Factor authentication services to add additional layer of security to your policy. 
- Federate with a variety of identity providers over OpenId Connect, OAuth, SAML, and Ws-Fed protocols. The user is sent to a social or enterprise identity provider to sign in and get a JWT or SAML token.

## Technical profile flow

All types of technical profiles share the same concept. You send input claims, run claims transformation, and communicate with the configured party, such as an identity provider, REST API, or Azure AD directory services. After the process finishes, the technical profile returns the output claims and may run output claims transformation. The following diagram shows how the transformations and mappings referenced in the technical profile are processed. Regardless of the party the technical profile interacts with, after any claims transformation is executed, the output claims from the technical profile are immediately stored in the claims bag. 

![Technical profile flow](./media/technical-profiles-overview/technical-profile-idp-saml-flow.png)
 
1. **InputClaimsTransformation** - Input claims of every InputClaimsTransformation are picked up from the claims bag, and after execution, the output claims are put back in the claims bag. The output claims of an input claims transformation can be input claims of a subsequent input claims transformation.
2. **InputClaims** - Claims are picked up from the claims bag and are used for the technical profile. For example, a [self-asserted technical profile](self-asserted-technical-profile.md) uses the input claims to prepopulate the output claims that the user provides. A REST API technical profile uses the input claims to send input parameters to the REST API endpoint. Azure Active Directory uses input claim as a unique identifier to read, update, or delete an account.
3. **Technical profile execution** - The technical profile exchanges the claims with the configured party. For example:
    - Redirect the user to the identity provider to complete the sign-in. After successful sign-in, the user returns back and the technical profile execution continues.
    - Call a REST API while sending parameters as InputClaims and getting information back as OutputClaims.
    - Create or update the user account.
    - Sends and verifies the MFA text message.
4. **ValidationTechnicalProfiles** - For a [self-asserted technical profile](self-asserted-technical-profile.md), you can call an input [validation technical profile](validation-technical-profile.md). The validation technical profile validates the data provided by the user and returns an error message or Ok with or without output claims. For example, before Azure AD B2C creates a new account, it checks whether the user already exists in the directory services. You can call a REST API technical profile to add your own business logic.
5. **OutputClaims** - Claims are retuned back to the claims bag. You can use those claims in the next orchestration steps or output claims transformations.
6. **OutputClaimsTransformations** - Input claims of every output claims transformation are picked up from the claims bag. The output claims of the technical profile from the previous step as well as output claims of the input claims transformations from the first step can be input claims of an output claims transformation. After execution, the output claims are put back in the claims bag. The output claims of an output claims transformation can also be input claims of a subsequent output claims transformation.

## Type of technical profiles 

You can use the following types of technical profiles:

- [Azure Active Directory](active-directory-technical-profile.md) - Provides support for the Azure Active Directory B2C user management.
- [Claims transformation](claims-transformation-technical-profile.md) - Call output claims transformations to manipulate claims values, validate claims, or set default values for a set of output claims.
- [OAuth1](oauth1-technical-profile.md) - Federation with any OAuth 1.0 protocol identity provider.
- [OAuth2](oauth2-technical-profile.md) - Federation with any OAuth 2.0 protocol identity provider.
- [OpenIdConnect](openid-connect-technical-profile.md) - Federation with any OpenId Connect protocol identity provider, or integrated with an OpenId Connect (and OAuth2) relaying party. Applications that can take advantage of OpenIdConnect include web, mobile and desktop.
- [Restful provider](restful-technical-profile.md) - Call to REST API services, such as validate user input, enrich user data, or integrate with line-of-business applications.
- [SAML2](saml-technical-profile.md) - Federation with any SAML protocol identity provider.
- [Self-Asserted](self-asserted-technical-profile.md) - Interact with the user. For example, collect the user's credential to sign in, render the sign-up page, or password reset.
- [Token Issuer](jwt-issuer-technical-profile.md) - Issue an access token.
- **Phone factor provider** - Multi-factor authentication.
- **WsFed** - Federation with any OAuth 1.0 protocol identity provider. 
- **Session management** - Handle different types of sessions. 
- **User journey context provider**
- **Application insights**











