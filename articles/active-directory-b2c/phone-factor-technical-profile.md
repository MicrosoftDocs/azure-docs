---
title: Define a phone factor technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define a phone factor technical profile in a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 01/11/2024

ms.author: kengaderdus
ms.subservice: B2C


#Customer intent: As a developer implementing phone number verification in Azure AD B2C, I want to define a phone factor technical profile, so that I can provide a user interface for users to verify or enroll their phone numbers, support multiple phone numbers, and return claims indicating the status of the phone number.

---

# Define a phone factor technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for enrolling and verifying phone numbers. This technical profile:

- Provides a user interface to interact with the user to verify, or enroll a phone number.
- Supports phone calls and text messages to validate the phone number.
- Supports multiple phone numbers. The user can select one of the phone numbers to verify.  
- Returns a claim indicating whether the user provided a new phone number. You can use this claim to decide whether the phone number should  be persisted to the Azure AD B2C user profile.  
- Uses a [content definition](contentdefinitions.md) to control the look and feel.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C for phone factor:
`Web.TPEngine.Providers.PhoneFactorProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`

The following example shows a phone factor technical profile for enrollment and validation:

```xml
<TechnicalProfile Id="PhoneFactor-InputOrVerify">
  <DisplayName>PhoneFactor</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.PhoneFactorProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
</TechnicalProfile>
```

## Input claims transformations

The InputClaimsTransformations element may contain a collection of input claims transformations that are used to modify the input claims, or generate new ones. The following input claims transformation generates a `UserId` claim that is used later in the input claims collection.

```xml
<InputClaimsTransformations>
  <InputClaimsTransformation ReferenceId="CreateUserIdForMFA" />
</InputClaimsTransformations>
```

## Input claims

The InputClaims element must contain the following claims. You can also map the name of your claim to the name defined in the phone factor technical profile. 

|  Data type| Required | Description |
| --------- | -------- | ----------- | 
| string| Yes | A unique identifier for the user. The claim name, or PartnerClaimType must be set to `UserId`. This claim should not contain personal identifiable information.|
| string| Yes | List of claim types. Each claim contains one phone number. If any of the input claims do not contain a phone number, the user will be asked to enroll and verify a new phone number. The validated phone number is returned as an output claim. If one of the input claims contain a phone number, the user is asked to verify it. If multiple input claims contain a phone number, the user is asked to choose and verify one of the phone numbers. |

The following example demonstrates using multiple phone numbers. For more information, see [sample policy](https://github.com/azure-ad-b2c/samples/tree/master/policies/mfa-add-secondarymfa).

```xml
<InputClaims>
  <InputClaim ClaimTypeReferenceId="userIdForMFA" PartnerClaimType="UserId" />
  <InputClaim ClaimTypeReferenceId="strongAuthenticationPhoneNumber" />
  <InputClaim ClaimTypeReferenceId="secondaryStrongAuthenticationPhoneNumber" />
</InputClaims>
```

## Output claims

The OutputClaims element contains a list of claims returned by the phone factor technical profile.

|  Data type| Required | Description |
|  -------- | ----------- |----------- |
| boolean | Yes | Indicates whether the new phone number has been entered by the user. The claim name, or PartnerClaimType must be set to `newPhoneNumberEntered`|
| string| Yes | The verified phone number. The claim name, or PartnerClaimType must be set to `Verified.OfficePhone`.|

The OutputClaimsTransformations element may contain a collection of OutputClaimsTransformation elements that are used to modify the output claims, or generate new ones.

## Cryptographic keys

The **CryptographicKeys** element is not used.


## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ContentDefinitionReferenceId | Yes | The identifier of the [content definition](contentdefinitions.md) associated with this technical profile. |
| ManualPhoneNumberEntryAllowed| No | Specify whether or not a user is allowed to manually enter a phone number. Possible values: `true`, or `false` (default).|
| setting.authenticationMode | No | The method to validate the phone number. Possible values: `sms`, `phone`, or `mixed` (default).|
| setting.autodial| No| Specify whether the technical profile should auto dial or auto send an SMS. Possible values: `true`, or `false` (default). Auto dial requires the `setting.authenticationMode` metadata be set to `sms`, or `phone`. The input claims collection must have a single phone number. |
| setting.autosubmit | No | Specifies whether the technical profile should auto submit the one-time password entry form. Possible values are `true` (default), or `false`. When auto-submit is turned off, the user needs to select a button to progress the journey. |
| setting.enableCaptchaChallenge | No | Specifies whether CAPTCHA challenge code should be displayed in an MFA flow. Possible values: `true` , or `false` (default). For this setting to work, the [CAPTCHA display control]() must be referenced in the display claims of the phone factor technical profile. [CAPTCHA feature](add-captcha.md) is in **public preview**.|

### UI elements

The phone factor authentication page user interface elements can be [localized](localization-string-ids.md#phone-factor-authentication-page-user-interface-elements).

## Next steps

- Check the [social and local accounts with MFA](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/SocialAndLocalAccountsWithMfa) starter pack.
