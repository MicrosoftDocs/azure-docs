---
title: Define a self-asserted technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define a self-asserted technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 11/22/2019
ms.author: marsma
ms.subservice: B2C
---

# Define a self-asserted technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

All interactions in Azure Active Directory B2C (Azure AD B2C) where the user is expected to provide input are self-asserted technical profiles. For example, a sign-up page, sign-in page, or password reset page.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C, for self-asserted:
`Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`

The following example shows a self-asserted technical profile for email sign-up:

```XML
<TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
  <DisplayName>Email signup</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
```

## Input claims

In a self-asserted technical profile, you can use the **InputClaims** and **InputClaimsTransformations** elements to prepopulate the value of the claims that appear on the self-asserted page (display claims). For example, in the edit profile policy, the user journey first reads the user profile from the Azure AD B2C directory service, then the self-asserted technical profile sets the input claims with the user data stored in the user profile. These claims are collected from the user profile and then presented to the user who can then edit the existing data.

```XML
<TechnicalProfile Id="SelfAsserted-ProfileUpdate">
...
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="alternativeSecurityId" />
    <InputClaim ClaimTypeReferenceId="userPrincipalName" />
    <InputClaim ClaimTypeReferenceId="givenName" />
    <InputClaim ClaimTypeReferenceId="surname" />
  </InputClaims>
```

## Display claims

The **DisplayClaims** element contains a list of claims to be presented to collect data from the user. To prepopulate the output claims with some values, use the input claims that were previously described. The element may also contain a default value. The order of the claims in **DisplayClaims** controls the order that Azure AD B2C renders the claims on the screen. To force the user to provide a value for a specific output claim, set the **Required** attribute of the **DisplayClaims** element to `true`.

The **ClaimType** element in the **DisplayClaims** collection needs to set the **UserInputType** element to any user input type supported by Azure AD B2C, such as `TextBox` or `DropdownSingleSelect`.

## Output claims

The **OutputClaims** element contains a list of claims to be return to the next orchestration step. The **DefaultValue** attribute takes effect only if the claim has never been set before. But, if it has been set before in a previous orchestration step, even if the user leaves the value empty, the default value does not take effect. To force the use of a default value, set the **AlwaysUseDefaultValue** attribute to `true`.

> [!NOTE]
> In previous versions of the Identity Experience Framework (IEF), output claims were used to collect data from the user. To collect data from the user, use a **DisplayClaims** collection instead.


The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

### When you should use output claims

In a self-asserted technical profile, the output claims collection return the claims to the next orchestration step. There are four scenarios for output claims:

- **Output the claims via output claims transformation**
- **Setting a default value in an output claim** - Without collecting data from the user or returning the data from the validation technical profile. The `LocalAccountSignUpWithLogonEmail` self-asserted technical profile sets the **executed-SelfAsserted-Input** claim to `true`.
- **A validation technical profile returns the output claims** - Your technical profile may call a validation technical profile that returns some claims. You may want to bubble up the claims and return them to the next orchestration steps in the user journey. For example, when signing in with a local account, the self-asserted technical profile named `SelfAsserted-LocalAccountSignin-Email` calls the validation technical profile named `login-NonInteractive`. This technical profile validates the user credentials and also returns the user profile. Such as 'userPrincipalName', 'displayName', 'givenName' and 'surName'.
- **A display control returns the output claims** - Your technical profile may have a reference to a [display control](display-controls.md). The display control returns some claims, such as the verified email address. You may want to bubble up the claims and return them to the next orchestration steps in the user journey.

The following example demonstrates the use of a self-asserted technical profile.

```XML
<TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
  <DisplayName>Email signup</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    <Item Key="IpAddressClaimReferenceId">IpAddress</Item>
    <Item Key="ContentDefinitionReferenceId">api.localaccountsignup</Item>
    <Item Key="language.button_continue">Create</Item>
  </Metadata>
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" />
  </InputClaims>
  <DisplayClaims>
    <DisplayClaim DisplayControlReferenceId="emailVerificationControl" />
    <DisplayClaim DisplayControlReferenceId="SecondaryEmailVerificationControl" />
    <DisplayClaim ClaimTypeReferenceId="displayName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="givenName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="surName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="newPassword" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="reenterPassword" Required="true" />
  </DisplayClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" Required="true" />
    <OutputClaim ClaimTypeReferenceId="objectId" />
    <OutputClaim ClaimTypeReferenceId="executed-SelfAsserted-Input" DefaultValue="true" />
    <OutputClaim ClaimTypeReferenceId="authenticationSource" />
    <OutputClaim ClaimTypeReferenceId="newUser" />
  </OutputClaims>
  <ValidationTechnicalProfiles>
    <ValidationTechnicalProfile ReferenceId="AAD-UserWriteUsingLogonEmail" />
  </ValidationTechnicalProfiles>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
</TechnicalProfile>
```

## Persist claims

If the **PersistedClaims** element is absent, the self-asserted technical profile doesn't persist the data to Azure AD B2C. Instead, a call is made to a validation technical profile that's responsible for persisting the data. For example, the sign-up policy uses the `LocalAccountSignUpWithLogonEmail` self-asserted technical profile to collect the new user profile. The `LocalAccountSignUpWithLogonEmail` technical profile calls the validation technical profile to create the account in Azure AD B2C.

## Validation technical profiles

A validation technical profile is used for validating some or all of the output claims of the referencing technical profile. The input claims of the validation technical profile must appear in the output claims of the self-asserted technical profile. The validation technical profile validates the user input and can return an error to the user.

The validation technical profile can be any technical profile in the policy, such as [Azure Active Directory](active-directory-technical-profile.md) or a [REST API](restful-technical-profile.md) technical profiles. In the previous example, the `LocalAccountSignUpWithLogonEmail` technical profile validates that the signinName does not exist in the directory. If not, the validation technical profile creates a local account and returns the objectId, authenticationSource, newUser. The `SelfAsserted-LocalAccountSignin-Email` technical profile calls the `login-NonInteractive` validation technical profile to validate the user credentials.

You can also call a REST API technical profile with your business logic, overwrite input claims, or enrich user data by further integrating with corporate line-of-business application. For more information, see [Validation technical profile](validation-technical-profile.md)

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| setting.showContinueButton | No | Displays the continue button. Possible values: `true` (default), or `false` |
| setting.showCancelButton | No | Displays the cancel button. Possible values: `true` (default), or `false` |
| setting.operatingMode | No | For a sign-in page, this property controls the behavior of the username field, such as input validation and error messages. Expected values: `Username` or `Email`. |
| ContentDefinitionReferenceId | Yes | The identifier of the [content definition](contentdefinitions.md) associated with this technical profile. |
| EnforceEmailVerification | No | For sign-up or profile edit, enforces email verification. Possible values: `true` (default), or `false`. |
| setting.showSignupLink | No | Displays the sign-up button. Possible values: `true` (default), or `false` |
| setting.retryLimit | No | Controls the number of times a user can try to provide the data that is checked against a validation technical profile . For example, a user tries to sign-up with an account that already exists and keeps trying until the limit reached.
| SignUpTarget | No | The signup target exchange identifier. When the user clicks the sign-up button, Azure AD B2C executes the specified exchange identifier. |

## Cryptographic keys

The **CryptographicKeys** element is not used.













