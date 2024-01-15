---
title: Integer claims transformation examples for custom policies
titleSuffix: Azure AD B2C
description: Integer claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 02/16/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Integer claims transformations

This article provides examples for using the integer claims transformations of the Identity Experience Framework schema in Azure Active Directory B2C (Azure AD B2C). For more information, see [ClaimsTransformations](claimstransformations.md).

## AdjustNumber

Increases or decreases a numeric claim and return a new claim. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/integer#adjustnumber) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | int | The claim type, which contains the number to increase or decrease. If the `inputClaim` claim value is null, the default of 0 is used. |
| InputParameter | Operator | string | Possible values: `INCREMENT` (default), or `DECREMENT`.|
| OutputClaim | outputClaim | int | The claim type that is produced after this claims transformation has been invoked. |

### Example of AdjustNumber

Use this claim transformation to increase or decrease a numeric claim value. The following claim transformation increases a numeric claim value.

```xml
<ClaimsTransformation Id="UpdateSteps" TransformationMethod="AdjustNumber">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="steps" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="Operator" DataType="string" Value="INCREMENT" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="steps" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
  - **inputClaim**: 1
- Input parameters:
  - **Operator**: INCREMENT
- Output claims:
  - **outputClaim**: 2

### Example of AdjustNumber with null value

If the input claim is null, the output claim will be one.

- Input claims:
  - **inputClaim**: NULL
- Input parameters:
  - **Operator**: INCREMENT
- Output claims:
  - **outputClaim**: 1

## AssertNumber

Determines whether a numeric claim is greater, lesser, equal, or not equal to a number. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/integer#assertnumber) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | int | The first numeric claim to compare whether it's greater, lesser, equal, or not equal than the second number. Null value throws an exception. |
| InputParameter | CompareToValue | int | The second number to compare whether it's greater, lesser, equal, or not equal than the first number. |
| InputParameter | Operator | string | Possible values: `LessThan`, `GreaterThan`, `GreaterThanOrEqual`, `LessThanOrEqual`, `Equal`, `NotEqual`. |
| InputParameter | throwError | boolean | Specifies whether this assertion should throw an error if the comparison result is `true`. Possible values: `true` (default), or `false`. <br />&nbsp;<br />When set to `true` (Assertion mode), and the comparison result is `true`, an exception will be thrown. When set to `false` (Evaluation mode), the result is a new boolean claim type with a value of `true`, or `false`.| 
| OutputClaim | outputClaim | boolean | If `ThrowError` is set to `false`, this output claim contains `true`, or `false` according to the comparison result. |

### Assertion mode

When `throwError` input parameter is `true` (default), the **AssertNumber** claims transformation is always executed from a [validation technical profile](validation-technical-profile.md) that is called by a [self-asserted technical profile](self-asserted-technical-profile.md). 

The **AssertNumberError** self-asserted technical profile metadata controls the error message that the technical profile presents to the user. The error messages can be [localized](localization-string-ids.md#claims-transformations-error-messages).

```xml
<TechnicalProfile Id="SelfAsserted-LocalAccountSignin-Email">
  <Metadata>
    <Item Key="AssertNumberError">You've reached the maximum logon attempts</Item>
  </Metadata>
  ...
</TechnicalProfile>
```

For more information how to call the claims transformation in an assertion mode, see [AssertStringClaimsAreEqual](string-transformations.md#assertstringclaimsareequal), [AssertBooleanClaimIsEqualToValue](boolean-transformations.md#assertbooleanclaimisequaltovalue), and [AssertDateTimeIsGreaterThan](date-transformations.md#assertdatetimeisgreaterthan) claims transformations.

### Example of AssertNumber

The following example asserts the number of attempts is over five. The  claims transformation throws an error according to the comparison result.

```xml
<ClaimsTransformation Id="isOverLimit" TransformationMethod="AssertNumber">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="attempts" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="Operator" DataType="string" Value="GreaterThan" />
    <InputParameter Id="CompareToValue" DataType="int" Value="5" />
    <InputParameter Id="throwError" DataType="boolean" Value="true" />
  </InputParameters>
</ClaimsTransformation>
```

- Input claims:
  - **inputClaim**: 10
- Input parameters:
  - **Operator**: GreaterThan
  - **CompareToValue**: 5
  - **throwError**: true
- Result: Error thrown

### Example of AssertNumber evaluation mode

The following example evaluates whether the number of attempts is over five. The output claim contains a boolean value according to the comparison result. The claims transformation won't throw an error. 

```xml
<ClaimsTransformation Id="isOverLimit" TransformationMethod="AssertNumber">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="attempts" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="Operator" DataType="string" Value="GreaterThan" />
    <InputParameter Id="CompareToValue" DataType="int" Value="5" />
    <InputParameter Id="throwError" DataType="boolean" Value="false" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="attemptsCountExceeded" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
  - **inputClaim**: 10
- Input parameters:
  - **Operator**: GreaterThan
  - **CompareToValue**: 5
  - **throwError**: false
- Output claims:
  - **outputClaim**: true


## ConvertNumberToStringClaim

Converts a long data type into a string data type. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/integer#convertnumbertostringclaim) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | long | The claim type to convert to a string. |
| OutputClaim | outputClaim | string | The claim type that is produced after this claims transformation has been invoked. |

### Example of ConvertNumberToStringClaim

In this example, the `numericUserId` claim with a value type of long is converted to a `UserId` claim with a value type of string.

```xml
<ClaimsTransformation Id="CreateUserId" TransformationMethod="ConvertNumberToStringClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="numericUserId" TransformationClaimType="inputClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="UserId" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
  - **inputClaim**: 12334 (long)
- Output claims:
  - **outputClaim**: "12334" (string)

## Next steps

- Find more [claims transformation samples](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/integer) on the Azure AD B2C community GitHub repo
