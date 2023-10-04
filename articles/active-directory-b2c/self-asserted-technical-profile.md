---
title: Define a self-asserted technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define a self-asserted technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 11/07/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Define a self-asserted technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

All interactions in Azure Active Directory B2C (Azure AD B2C) where the user is expected to provide input are self-asserted technical profiles. For example, a sign-up page, sign-in page, or password reset page.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C, for self-asserted:
`Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`

The following example shows a self-asserted technical profile for email sign-up:

```xml
<TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
  <DisplayName>Email signup</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
```

## Input claims

In a self-asserted technical profile, you can use the **InputClaims** and **InputClaimsTransformations** elements to prepopulate the value of the claims that appear on the self-asserted page (display claims). For example, in the edit profile policy, the user journey first reads the user profile from the Azure AD B2C directory service, then the self-asserted technical profile sets the input claims with the user data stored in the user profile. These claims are collected from the user profile and then presented to the user who can then edit the existing data.

```xml
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

The **DisplayClaims** element contains a list of claims to be presented on the screen for collecting data from the user. To prepopulate the values of display claims, use the input claims that were previously described. The element may also contain a default value.

The order of the claims in **DisplayClaims** specifies the order in which Azure AD B2C renders the claims on the screen. To force the user to provide a value for a specific claim, set the **Required** attribute of the **DisplayClaim** element to `true`.

The **ClaimType** element in the **DisplayClaims** collection needs to set the **UserInputType** element to any user input type supported by Azure AD B2C. For example, `TextBox` or `DropdownSingleSelect`.

### Add a reference to a DisplayControl

In the display claims collection, you can include a reference to a [DisplayControl](display-controls.md) that you've created. A display control is a user interface element that has special functionality and interacts with the Azure AD B2C back-end service. It allows the user to perform actions on the page that invoke a validation technical profile at the back end. For example, verifying an email address, phone number, or customer loyalty number.

The following example `TechnicalProfile` illustrates the use of display claims with display controls.

* The first display claim makes a reference to the `emailVerificationControl` display control, which collects and verifies the email address.
* The fifth display claim makes a reference to the `phoneVerificationControl` display control, which collects and verifies a phone number.
* The other display claims are ClaimTypes to be collected from the user.

```xml
<TechnicalProfile Id="Id">
  <DisplayClaims>
    <DisplayClaim DisplayControlReferenceId="emailVerificationControl" />
    <DisplayClaim ClaimTypeReferenceId="displayName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="givenName" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="surName" Required="true" />
    <DisplayClaim DisplayControlReferenceId="phoneVerificationControl" />
    <DisplayClaim ClaimTypeReferenceId="newPassword" Required="true" />
    <DisplayClaim ClaimTypeReferenceId="reenterPassword" Required="true" />
  </DisplayClaims>
</TechnicalProfile>
```

As mentioned, a display claim with a reference to a display control may run its own validation, for example verifying the email address. In addition, the self-asserted page supports using a validation technical profile to validate the entire page, including any user input (claim types or display controls), before moving on to the next orchestration step.

### Combine usage of display claims and output claims carefully

If you specify one or more **DisplayClaim** elements in a self-asserted technical profile, you must use a DisplayClaim for *every* claim that you want to display on-screen and collect from the user. No output claims are displayed by a self-asserted technical profile that contains at least one display claim.

Consider the following example in which an `age` claim is defined as an **output** claim in a base policy. Before adding any display claims to the self-asserted technical profile, the `age` claim is displayed on the screen for data collection from the user:

```xml
<TechnicalProfile Id="id">
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="age" />
  </OutputClaims>
</TechnicalProfile>
```

If a leaf policy that inherits that base subsequently specifies `officeNumber` as a **display** claim:

```xml
<TechnicalProfile Id="id">
  <DisplayClaims>
    <DisplayClaim ClaimTypeReferenceId="officeNumber" />
  </DisplayClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="officeNumber" />
  </OutputClaims>
</TechnicalProfile>
```

The `age` claim in the base policy is no longer presented on the screen to the user - it's effectively "hidden." To display the `age` claim and collect the age value from the user, you must add an `age` **DisplayClaim**.

## Output claims

The **OutputClaims** element contains a list of claims to be returned to the next orchestration step. The **DefaultValue** attribute takes effect only if the claim has never been set. If it was set in a previous orchestration step, the default value does not take effect even if the user leaves the value empty. To force the use of a default value, set the **AlwaysUseDefaultValue** attribute to `true`.

For security reasons, a password claim value (`UserInputType` set to `Password`) is available only to the self-asserted technical profile's validation technical profiles. You cannot use password claim in the next orchestration steps. 

> [!NOTE]
> In previous versions of the Identity Experience Framework (IEF), output claims were used to collect data from the user. To collect data from the user, use a **DisplayClaims** collection instead.

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify the output claims or generate new ones.

### When you should use output claims

In a self-asserted technical profile, the output claims collection returns the claims to the next orchestration step.

Use output claims when:

- **Claims are output by output claims transformation**.
- **Setting a default value in an output claim** without collecting data from the user or returning the data from the validation technical profile. The `LocalAccountSignUpWithLogonEmail` self-asserted technical profile sets the **executed-SelfAsserted-Input** claim to `true`.
- **A validation technical profile returns the output claims** - Your technical profile may call a validation technical profile that returns some claims. You may want to bubble up the claims and return them to the next orchestration steps in the user journey. For example, when signing in with a local account, the self-asserted technical profile named `SelfAsserted-LocalAccountSignin-Email` calls the validation technical profile named `login-NonInteractive`. This technical profile validates the user credentials and also returns the user profile. Such as 'userPrincipalName', 'displayName', 'givenName' and 'surName'.
- **A display control returns the output claims** - Your technical profile may have a reference to a [display control](display-controls.md). The display control returns some claims, such as the verified email address. You may want to bubble up the claims and return them to the next orchestration steps in the user journey. 

The following example demonstrates the use of a self-asserted technical profile that uses both display claims and output claims.

```xml
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

### Output claims sign-up or sign-in page

In a combined sign-up and sign-in page, note the following when using a content definition [DataUri](contentdefinitions.md#datauri) element that specifies a `unifiedssp` or `unifiedssd` page type:

- Only the username and password claims are rendered.
- The first two output claims must be the username and the password (in this order). 
- Any other claims are not rendered; for these claims, you'll need to either set the `defaultValue` or invoke a claims form validation technical profile. 

## Persist claims

The PersistedClaims element is not used. The self-asserted technical profile doesn't persist the data to Azure AD B2C. Instead, a call is made to a validation technical profile that's responsible for persisting the data. For example, the sign-up policy uses the `LocalAccountSignUpWithLogonEmail` self-asserted technical profile to collect the new user profile. The `LocalAccountSignUpWithLogonEmail` technical profile calls the validation technical profile to create the account in Azure AD B2C.

## Validation technical profiles

A validation technical profile is used for validating some or all of the output claims of the referencing technical profile. The input claims of the validation technical profile must appear in the output claims of the self-asserted technical profile. The validation technical profile validates the user input and can return an error to the user.

The validation technical profile can be any technical profile in the policy, such as [Microsoft Entra ID](active-directory-technical-profile.md) or a [REST API](restful-technical-profile.md) technical profiles. In the previous example, the `LocalAccountSignUpWithLogonEmail` technical profile validates that the signinName does not exist in the directory. If not, the validation technical profile creates a local account and returns the objectId, authenticationSource, newUser. The `SelfAsserted-LocalAccountSignin-Email` technical profile calls the `login-NonInteractive` validation technical profile to validate the user credentials.

You can also call a REST API technical profile with your business logic, overwrite input claims, or enrich user data by further integrating with corporate line-of-business application. For more information, see [Validation technical profile](validation-technical-profile.md)

> [!NOTE]
> A validation technical profile is only triggered when there's an input from the user. You can't create an _empty_ self-asserted technical profile to call a validation technical profile just to take advantage of the **ContinueOnError** attribute of a **ValidationTechnicalProfile** element. You can only call a validation technical profile from a self-asserted technical profile that requests an input from the user, or from an orchestration step in a user journey. 

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| setting.operatingMode <sup>1</sup>| No | For a sign-in page, this property controls the behavior of the username field, such as input validation and error messages. Expected values: `Username` or `Email`. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/self-asserted#operating-mode) of this metadata.  |
| AllowGenerationOfClaimsWithNullValues| No| Allow to generate a claim with null value. For example, in a case user doesn't select a checkbox.|
| ContentDefinitionReferenceId | Yes | The identifier of the [content definition](contentdefinitions.md) associated with this technical profile. |
| EnforceEmailVerification | No | For sign-up or profile edit, enforces email verification. Possible values: `true` (default), or `false`. |
| setting.retryLimit | No | Controls the number of times a user can try to provide the data that is checked against a validation technical profile. For example, a user tries to sign-up with an account that already exists and keeps trying until the limit reached. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/self-asserted#retry-limit) of this metadata.|
| SignUpTarget <sup>1</sup>| No | The sign-up target exchange identifier. When the user clicks the sign-up button, Azure AD B2C executes the specified exchange identifier. |
| setting.showCancelButton | No | Displays the cancel button. Possible values: `true` (default), or `false`. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/self-asserted#show-the-cancel-button) of this metadata.|
| setting.showContinueButton | No | Displays the continue button. Possible values: `true` (default), or `false`. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/self-asserted#show-the-continue-button) of this metadata. |
| setting.showSignupLink <sup>2</sup>| No | Displays the sign-up button. Possible values: `true` (default), or `false`. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/self-asserted#show-sign-up-link) of this metadata. |
| setting.forgotPasswordLinkLocation <sup>2</sup>| No| Displays the forgot password link. Possible values: `AfterLabel` (default) displays the link directly after the label or after the password input field when there is no label,  `AfterInput` displays the link after the password input field, `AfterButtons` displays the link on the bottom of the form after the buttons, or `None` removes the forgot password link. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/self-asserted#forgot-password-link-location) of this metadata.|
| setting.enableRememberMe <sup>2</sup>| No| Displays the [Keep me signed in](session-behavior.md?pivots=b2c-custom-policy#enable-keep-me-signed-in-kmsi) checkbox. Possible values: `true` , or `false` (default). [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/self-asserted#enable-remember-me-kmsi) of this metadata. |
| setting.inputVerificationDelayTimeInMilliseconds <sup>3</sup>| No| Improves user experience, by waiting for the user to stop typing, and then validate the value. Default value 2000 milliseconds. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/technical-profiles/self-asserted#input-verification-delay-time-in-milliseconds) of this metadata. |
| IncludeClaimResolvingInClaimsHandling  | No | For input and output claims, specifies whether [claims resolution](claim-resolver-overview.md) is included in the technical profile. Possible values: `true`, or `false` (default). If you want to use a claims resolver in the technical profile, set this to `true`. |
|setting.forgotPasswordLinkOverride <sup>4</sup>| No | A password reset claims exchange to be executed. For more information, see [Self-service password reset](add-password-reset-policy.md). |

Notes:

1. Available for content definition [DataUri](contentdefinitions.md#datauri) type of `unifiedssp`, or `unifiedssd`.
1. Available for content definition [DataUri](contentdefinitions.md#datauri) type of `unifiedssp`, or `unifiedssd`. [Page layout version](page-layout.md) 1.1.0 and above.
1. Available for [page layout version](page-layout.md) 1.2.0 and above.
1. Available for content definition [DataUri](contentdefinitions.md#datauri) type of `unifiedssp`. [Page layout version](page-layout.md) 2.1.2 and above.

## Cryptographic keys

The **CryptographicKeys** element is not used.
