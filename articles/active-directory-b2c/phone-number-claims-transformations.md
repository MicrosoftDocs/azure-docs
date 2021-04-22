---
title: Phone number claims transformations in custom policies
titleSuffix: Azure AD B2C
description: Custom policy reference for phone number claims transformations in Azure AD B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 02/26/2020
ms.author: mimart
ms.subservice: B2C
---

# Define phone number claims transformations in Azure AD B2C

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article provides reference and examples for using the phone number claims transformations of the Identity Experience Framework schema in Azure Active Directory B2C (Azure AD B2C). For more information about claims transformations in general, see [ClaimsTransformations](claimstransformations.md).

[!INCLUDE [b2c-public-preview-feature](../../includes/active-directory-b2c-public-preview.md)]

## ConvertPhoneNumberClaimToString

Converts a `phoneNumber` data type into a `string` data type.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | phoneNumber | phoneNumber |  The ClaimType to convert to a string. |
| OutputClaim | phoneNumberString | string | The ClaimType that is produced after this claims transformation has been invoked. |

In this example, the cellPhoneNumber claim with a value type of `phoneNumber` is converted to a cellPhone claim with a value type of `string`.

```xml
<ClaimsTransformation Id="PhoneNumberToString" TransformationMethod="ConvertPhoneNumberClaimToString">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="cellPhoneNumber" TransformationClaimType="phoneNumber" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="cellPhone" TransformationClaimType="phoneNumberString" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **phoneNumber**: +11234567890 (phoneNumber)
- Output claims:
  - **phoneNumberString**: +11234567890 (string)


## ConvertStringToPhoneNumberClaim

This claim transformation validates the format of the phone number. If it is in a valid format, change it to a standard format used by Azure AD B2C. If the provided phone number is not in a valid format, an error message is returned.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | phoneNumberString | string |  The string claim for the phone number. The phone number has to be in international format, complete with a leading "+" and country/region code. If input claim `country` is provided, the phone number is in local format (without the country/region code). |
| InputClaim | country | string | [Optional] The string claim for the country/region code of the phone number in ISO3166 format (the two-letter ISO-3166 country/region code). |
| OutputClaim | outputClaim | phoneNumber | The result of this claims transformation. |

The **ConvertStringToPhoneNumberClaim** claims transformation is always executed from a [validation technical profile](validation-technical-profile.md) that is called by a [self-asserted technical profile](self-asserted-technical-profile.md) or [display control](display-controls.md). The **UserMessageIfClaimsTransformationInvalidPhoneNumber** self-asserted technical profile metadata controls the error message that is presented to the user.

![Diagram of error message execution path](./media/phone-authentication/assert-execution.png)

You can use this claims transformation to ensure that the provided string claim is a valid phone number. If not, an error message is thrown. The following example checks that the **phoneString** ClaimType is indeed a valid phone number, and then returns the phone number in the standard Azure AD B2C format. Otherwise, an error message is thrown.

```xml
<ClaimsTransformation Id="ConvertStringToPhoneNumber" TransformationMethod="ConvertStringToPhoneNumberClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="phoneString" TransformationClaimType="phoneNumberString" />
    <InputClaim ClaimTypeReferenceId="countryCode" TransformationClaimType="country" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="phoneNumber" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

The self-asserted technical profile that calls the validation technical profile that contains this claims transformation can define the error message.

```xml
<TechnicalProfile Id="SelfAsserted-LocalAccountSignup-Phone">
  <Metadata>
    <Item Key="UserMessageIfClaimsTransformationInvalidPhoneNumber">Custom error message if the phone number is not valid.</Item>
  </Metadata>
  ...
</TechnicalProfile>
```

### Example 1

- Input claims:
  - **phoneNumberString**: 033 456-7890
  - **country**: DK
- Output claims:
  - **outputClaim**: +450334567890

### Example 2

- Input claims:
  - **phoneNumberString**: +1 (123) 456-7890
- Output claims:
  - **outputClaim**: +11234567890


## GetNationalNumberAndCountryCodeFromPhoneNumberString

This extracts the country/region code and the national number from the input claim, and optionally throws an exception if the supplied phone number is not valid.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | phoneNumber | string | The string claim of the phone number. The phone number has to be in international format, complete with a leading "+" and country/region code. |
| InputParameter | throwExceptionOnFailure | boolean | [Optional] A parameter indicating whether an exception is thrown when the phone number is not valid. Default value is false. |
| InputParameter | countryCodeType | string | [Optional] A parameter indicating the type of country/region code in the output claim. Available values are **CallingCode** (the international calling code for a country/region, for example +1) or **ISO3166** (the two-letter ISO-3166 country/region code). |
| OutputClaim | nationalNumber | string | The string claim for the national number of the phone number. |
| OutputClaim | countryCode | string | The string claim for the country/region code of the phone number. |


If the **GetNationalNumberAndCountryCodeFromPhoneNumberString** claims transformation is executed from a [validation technical profile](validation-technical-profile.md) that is called by a [self-asserted technical profile](self-asserted-technical-profile.md) or a [display control action](display-controls.md#display-control-actions), then the **UserMessageIfPhoneNumberParseFailure** self-asserted technical profile metadata controls the error message that is presented to the user.

![Diagram of error message execution path](./media/phone-authentication/assert-execution.png)

You can use this claims transformation to split a full phone number into the country/region code and the national number. If the phone number provided is not valid, you can choose to throw an error message.

The following example tries to split the phone number into national number and country/region code. If the phone number is valid, the phone number will be overridden by the national number. If the phone number is not valid, an exception will not be thrown and the phone number still has its original value.

```xml
<ClaimsTransformation Id="GetNationalNumberAndCountryCodeFromPhoneNumberString" TransformationMethod="GetNationalNumberAndCountryCodeFromPhoneNumberString">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="phoneNumber" TransformationClaimType="phoneNumber" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="throwExceptionOnFailure" DataType="boolean" Value="false" />
    <InputParameter Id="countryCodeType" DataType="string" Value="ISO3166" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="nationalNumber" TransformationClaimType="nationalNumber" />
    <OutputClaim ClaimTypeReferenceId="countryCode" TransformationClaimType="countryCode" />
  </OutputClaims>
</ClaimsTransformation>
```

The self-asserted technical profile that calls the validation technical profile that contains this claims transformation can define the error message.

```xml
<TechnicalProfile Id="SelfAsserted-LocalAccountSignup-Phone">
  <Metadata>
    <Item Key="UserMessageIfPhoneNumberParseFailure">Custom error message if the phone number is not valid.</Item>
  </Metadata>
  ...
</TechnicalProfile>
```

### Example 1

- Input claims:
  - **phoneNumber**: +49 (123) 456-7890
- Input parameters:
  - **throwExceptionOnFailure**: false
  - **countryCodeType**: ISO3166
- Output claims:
  - **nationalNumber**: 1234567890
  - **countryCode**: DE

### Example 2

- Input claims:
  - **phoneNumber**: +49 (123) 456-7890
- Input parameters
  - **throwExceptionOnFailure**: false
  - **countryCodeType**: CallingCode
- Output claims:
  - **nationalNumber**: 1234567890
  - **countryCode**: +49
