---
title: Define a phone factor technical profile in a custom policy
titleSuffix: Azure AD B2C
description: Define a phone factor technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 03/16/2020
ms.author: mimart
ms.subservice: B2C
---

# Define a phone factor technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

Azure Active Directory B2C (Azure AD B2C) provides support for enroll and verify phone number. This technical profile:

- Provides user interface to interact with the user.
- Uses content definition control the look and feel.
- Uses both phone call and text messages to validate the phone number.
- Supports multiple phone numbers. User can select one of phone numbers to verify.  
- If a phone number is provided, the phone factor asks the user to verify the phone number. If not provided, it asks the user to enroll a new phone number.  
- Returns a claim indicates whether user provides a new phone number. You can use this claim to decide whether the phone number should  be persisted to the Azure AD user profile. 

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C, for phone factor:
`Web.TPEngine.Providers.PhoneFactorProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`

The following example shows a phone factor technical profile for enroll and validation:

```XML
<TechnicalProfile Id="PhoneFactor-InputOrVerify">
  <DisplayName>PhoneFactor</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.PhoneFactorProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
</TechnicalProfile>
```

## Input claims

The InputClaims element must contain following claims. You can also map the name of your claim to the name defined in the phone factor technical profile. 

```XML
<InputClaims>
  <!--A unique identifier of the user. The partner claim type must be set to `UserId` -->
  <InputClaim ClaimTypeReferenceId="userIdForMFA" PartnerClaimType="UserId" />
  <!--A claim that contain the phone number. If the claim is empty, Azure AD B2C asks the user to enroll a new phone number. Otherwise, it asks the user to verify the phone number -->
  <InputClaim ClaimTypeReferenceId="strongAuthenticationPhoneNumber" />
</InputClaims>
```

Following example demonstrates using multiple phone numbers. For more information, see [sample policy](https://github.com/azure-ad-b2c/samples/tree/master/policies/mfa-add-secondarymfa)

```XML
<InputClaims>
  <InputClaim ClaimTypeReferenceId="userIdForMFA" PartnerClaimType="UserId" />
  <InputClaim ClaimTypeReferenceId="strongAuthenticationPhoneNumber" />
  <InputClaim ClaimTypeReferenceId="secondaryStrongAuthenticationPhoneNumber" />
</InputClaims>
```

The InputClaimsTransformations element may contain a collection of InputClaimsTransformation elements that are used to modify the input claims or generate new ones before presenting the phone factor page.

## Output claims

The OutputClaims element contains a list of claims returned by the phone factor technical profile.

```xml
<OutputClaims>
  <!-- The verified phone number. The partner claim type must be set to `Verified.OfficePhone` -->
  <OutputClaim ClaimTypeReferenceId="Verified.strongAuthenticationPhoneNumber" PartnerClaimType="Verified.OfficePhone" />
  <!-- An indication whether new phone number has beed entered by the user. The partner claim type must be set to `newPhoneNumberEntered` -->
  <OutputClaim ClaimTypeReferenceId="newPhoneNumberEntered" PartnerClaimType="newPhoneNumberEntered" />
</OutputClaims>
```

The OutputClaimsTransformations element may contain a collection of OutputClaimsTransformation elements that are used to modify the output claims or generate new ones.

## Cryptographic keys

The **CryptographicKeys** element is not used.


## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ContentDefinitionReferenceId | Yes | The identifier of the [content definition](contentdefinitions.md) associated with this technical profile. |
| ManualPhoneNumberEntryAllowed| No | Specify whether or not a user is allowed to manually enter in a phone number. Possible values: `true`, or `false` (default).|

## Next steps

- Check the [social and local accounts with MFA](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/tree/master/SocialAndLocalAccountsWithMfa) starter pack.

