---
title: About technical profiles in Azure Active Directory B2C custom policies | Microsoft Docs
description: Learn about how technical profiles are used in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: marsma
ms.subservice: B2C
---

# About technical profiles in Azure Active Directory B2C custom policies

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

A technical profile provides a framework with a built-in mechanism to communicate with different type of parties using a custom policy in Azure Active Directory (Azure AD) B2C. Technical profiles are used to communicate with your Azure AD B2C tenant, to create a user, or read a user profile. A technical profile can be self-asserted to enable interaction with the user. For example, collect the user's credential to sign in and then render the sign-up page or password reset page.

## Type of technical profiles

A technical profile enables these types of scenarios:

- [Azure Active Directory](active-directory-technical-profile.md) - Provides support for the Azure Active Directory B2C user management.
- [JWT token issuer](jwt-issuer-technical-profile.md) -  Emits a JWT token that is returned back to the relying party application.
- **Phone factor provider** - Multi-factor authentication.
- [OAuth1](oauth1-technical-profile.md) - Federation with any OAuth 1.0 protocol identity provider.
- [OAuth2](oauth2-technical-profile.md) - Federation with any OAuth 2.0 protocol identity provider.
- [OpenIdConnect](openid-connect-technical-profile.md) - Federation with any OpenId Connect protocol identity provider.
- [Claims transformation](claims-transformation-technical-profile.md) - Call output claims transformations to manipulate claims values, validate claims, or set default values for a set of output claims.
- [Restful provider](restful-technical-profile.md) - Call to REST API services, such as validate user input, enrich user data, or integrate with line-of-business applications.
- [SAML2](saml-technical-profile.md) - Federation with any SAML protocol identity provider.
- [Self-Asserted](self-asserted-technical-profile.md) - Interact with the user. For example, collect the user's credential to sign in, render the sign-up page, or password reset.
- **WsFed** - Federation with any WsFed protocol identity provider.
- [Session management](active-directory-b2c-reference-sso-custom.md) - Handle different types of sessions.
- **Application insights**

## Technical profile flow

All types of technical profiles share the same concept. You send input claims, run claims transformation, and communicate with the configured party, such as an identity provider, REST API, or Azure AD directory services. After the process finishes, the technical profile returns the output claims and may run output claims transformation. The following diagram shows how the transformations and mappings referenced in the technical profile are processed. Regardless of the party the technical profile interacts with, after any claims transformation is executed, the output claims from the technical profile are immediately stored in the claims bag.

![Diagram illustrating the technical profile flow](./media/technical-profiles-overview/technical-profile-idp-saml-flow.png)
 
1. **InputClaimsTransformation** - Input claims of every  input [claims transformation](claimstransformations.md) are picked up from the claims bag, and after execution, the output claims are put back in the claims bag. The output claims of an input claims transformation can be input claims of a subsequent input claims transformation.
2. **InputClaims** - Claims are picked up from the claims bag and are used for the technical profile. For example, a [self-asserted technical profile](self-asserted-technical-profile.md) uses the input claims to prepopulate the output claims that the user provides. A REST API technical profile uses the input claims to send input parameters to the REST API endpoint. Azure Active Directory uses input claim as a unique identifier to read, update, or delete an account.
3. **Technical profile execution** - The technical profile exchanges the claims with the configured party. For example:
    - Redirect the user to the identity provider to complete the sign-in. After successful sign-in, the user returns back and the technical profile execution continues.
    - Call a REST API while sending parameters as InputClaims and getting information back as OutputClaims.
    - Create or update the user account.
    - Sends and verifies the MFA text message.
4. **ValidationTechnicalProfiles** - For a [self asserted technical profile](self-asserted-technical-profile.md), you can call an input [validation technical profile](validation-technical-profile.md). The validation technical profile validates the data profiled by the user and returns an error message or Ok, with or without output claims. For example, before Azure AD B2C creates a new account, it checks whether the user already exists in the directory services. You can call a REST API technical profile to add your own business logic.<p>The scope of the output claims of a validation technical profile is limited to the technical profile that invokes the validation technical profile and other validation technical profiles under same technical profile. If you want to use the output claims in the next orchestration step, you need to add the output claims to the technical profile that invokes the validation technical profile.
5. **OutputClaims** - Claims are returned back to the claims bag. You can use those claims in the next orchestrations step, or output claims transformations.
6. **OutputClaimsTransformations** - Input claims of every output [claims transformation](claimstransformations.md) are picked up from the claims bag. The output claims of the technical profile from the previous steps can be input claims of an output claims transformation. After execution, the output claims are put back in the claims bag. The output claims of an output claims transformation can also be input claims of a subsequent output claims transformation.
7. **Single sign-on (SSO) session management** - [SSO session management](active-directory-b2c-reference-sso-custom.md) controls interaction with a user after the user has already authenticated. For example, the administrator can control whether the selection of identity providers is displayed, or whether local account details need to be entered again.

A technical profile can inherit from another technical profile to change settings or add new functionality.  The **IncludeTechnicalProfile** element is a reference to the base technical profile from which a technical profile is derived.

For example, the **AAD-UserReadUsingAlternativeSecurityId-NoError** technical profile includes the **AAD-UserReadUsingAlternativeSecurityId**. This technical profile sets the **RaiseErrorIfClaimsPrincipalDoesNotExist** metadata item to `true`, and raises an error if a social account does not exist in the directory. **AAD-UserReadUsingAlternativeSecurityId-NoError** overrides this behavior and disables the error message if the user has not existed.

```XML
<TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId-NoError">
  <Metadata>
    <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">false</Item>
  </Metadata>
  <IncludeTechnicalProfile ReferenceId="AAD-UserReadUsingAlternativeSecurityId" />
</TechnicalProfile>
```

**AAD-UserReadUsingAlternativeSecurityId** includes the `AAD-Common` technical profile.

```XML
<TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId">
  <Metadata>
    <Item Key="Operation">Read</Item>
    <Item Key="RaiseErrorIfClaimsPrincipalDoesNotExist">true</Item>
    <Item Key="UserMessageIfClaimsPrincipalDoesNotExist">User does not exist. Please sign up before you can sign in.</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="AlternativeSecurityId" PartnerClaimType="alternativeSecurityId" Required="true" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="objectId" />
    <OutputClaim ClaimTypeReferenceId="userPrincipalName" />
    <OutputClaim ClaimTypeReferenceId="displayName" />
    <OutputClaim ClaimTypeReferenceId="otherMails" />
    <OutputClaim ClaimTypeReferenceId="givenName" />
    <OutputClaim ClaimTypeReferenceId="surname" />
  </OutputClaims>
  <IncludeTechnicalProfile ReferenceId="AAD-Common" />
</TechnicalProfile>
```

Both **AAD-UserReadUsingAlternativeSecurityId-NoError** and  **AAD-UserReadUsingAlternativeSecurityId** don't specify the required **Protocol** element because it's specified in the **AAD-Common** technical profile.

```XML
<TechnicalProfile Id="AAD-Common">
  <DisplayName>Azure Active Directory</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.AzureActiveDirectoryProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  ...
</TechnicalProfile>
```

A technical profile may include or inherit another technical profile, which may include another one. There is no limit on the number of levels. Depending on the business requirements, your user journey may call **AAD-UserReadUsingAlternativeSecurityId** that raises an error if a user social account doesn't exist, or **AAD-UserReadUsingAlternativeSecurityId-NoError** which doesn't raise an error.











