---
title: Boolean claims transformation examples for custom policies
titleSuffix: Azure AD B2C
description: Boolean claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 06/06/2020
ms.author: mimart
ms.subservice: B2C
---

# Boolean claims transformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article provides examples for using the boolean claims transformations of the Identity Experience Framework schema in Azure Active Directory B2C (Azure AD B2C). For more information, see [ClaimsTransformations](claimstransformations.md).

## AndClaims

Performs an And operation of two boolean inputClaims and sets the outputClaim with result of the operation.

| Item  | TransformationClaimType  | Data Type  | Notes |
|-------| ------------------------ | ---------- | ----- |
| InputClaim | inputClaim1 | boolean | The first ClaimType to evaluate. |
| InputClaim | inputClaim2  | boolean | The second ClaimType to evaluate. |
|OutputClaim | outputClaim | boolean | The ClaimTypes that will be produced after this claims transformation has been invoked (true or false). |

The following claims transformation demonstrates how to And two boolean ClaimTypes: `isEmailNotExist`, and `isSocialAccount`. The output claim `presentEmailSelfAsserted` is set to `true` if the value of both input claims are `true`. In an orchestration step, you can use a precondition to preset a self-asserted page, only if a social account email is empty.

```XML
<ClaimsTransformation Id="CheckWhetherEmailBePresented" TransformationMethod="AndClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="isEmailNotExist" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="isSocialAccount" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="presentEmailSelfAsserted" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example of AndClaims

- Input claims:
    - **inputClaim1**: true
    - **inputClaim2**: false
- Output claims:
    - **outputClaim**: false


## AssertBooleanClaimIsEqualToValue

Checks that boolean values of two claims are equal, and throws an exception if they are not.

| Item | TransformationClaimType  | Data Type  | Notes |
| ---- | ------------------------ | ---------- | ----- |
| inputClaim | inputClaim | boolean | The ClaimType to be asserted. |
| InputParameter |valueToCompareTo | boolean | The value to compare (true or false). |

The **AssertBooleanClaimIsEqualToValue** claims transformation is always executed from a [validation technical profile](validation-technical-profile.md) that is called by a [self-asserted technical profile](self-asserted-technical-profile.md). The **UserMessageIfClaimsTransformationBooleanValueIsNotEqual** self-asserted technical profile metadata controls the error message that the technical profile presents to the user. The error messages can be [localized](localization-string-ids.md#claims-transformations-error-messages).

![AssertStringClaimsAreEqual execution](./media/boolean-transformations/assert-execution.png)

The following claims transformation demonstrates how to check the value of a boolean ClaimType with a `true` value. If the value of the `accountEnabled` ClaimType is false, an error message is thrown.

```XML
<ClaimsTransformation Id="AssertAccountEnabledIsTrue" TransformationMethod="AssertBooleanClaimIsEqualToValue">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="accountEnabled" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="valueToCompareTo" DataType="boolean" Value="true" />
  </InputParameters>
</ClaimsTransformation>
```


The `login-NonInteractive` validation technical profile calls the `AssertAccountEnabledIsTrue` claims transformation.

```XML
<TechnicalProfile Id="login-NonInteractive">
  ...
  <OutputClaimsTransformations>
    <OutputClaimsTransformation ReferenceId="AssertAccountEnabledIsTrue" />
  </OutputClaimsTransformations>
</TechnicalProfile>
```

The self-asserted technical profile calls the validation **login-NonInteractive** technical profile.

```XML
<TechnicalProfile Id="SelfAsserted-LocalAccountSignin-Email">
  <Metadata>
    <Item Key="UserMessageIfClaimsTransformationBooleanValueIsNotEqual">Custom error message if account is disabled.</Item>
  </Metadata>
  <ValidationTechnicalProfiles>
    <ValidationTechnicalProfile ReferenceId="login-NonInteractive" />
  </ValidationTechnicalProfiles>
</TechnicalProfile>
```

### Example of AssertBooleanClaimIsEqualToValue

- Input claims:
    - **inputClaim**: false
    - **valueToCompareTo**: true
- Result: Error thrown

## CompareBooleanClaimToValue

Checks that boolean value of a claim is equal to `true` or `false`, and return the result of the compression.

| Item | TransformationClaimType  | Data Type  | Notes |
| ---- | ------------------------ | ---------- | ----- |
| InputClaim | inputClaim | boolean | The ClaimType to be asserted. |
| InputParameter |valueToCompareTo | boolean | The value to compare (true or false). |
| OutputClaim | compareResult | boolean | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

The following claims transformation demonstrates how to check the value of a boolean ClaimType with a `true` value. If the value of the `IsAgeOver21Years` ClaimType is equal to `true`, the claims transformation returns `true`, otherwise `false`.

```XML
<ClaimsTransformation Id="AssertAccountEnabled" TransformationMethod="CompareBooleanClaimToValue">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="IsAgeOver21Years" TransformationClaimType="inputClaim" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="valueToCompareTo" DataType="boolean" Value="true" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim  ClaimTypeReferenceId="accountEnabled" TransformationClaimType="compareResult"/>
  </OutputClaims>
</ClaimsTransformation>
```

### Example of CompareBooleanClaimToValue

- Input claims:
    - **inputClaim**: false
- Input parameters:
    - **valueToCompareTo**: true
- Output claims:
    - **compareResult**: false

## NotClaims

Performs a Not operation of the boolean inputClaim and sets the outputClaim with result of the operation.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | boolean | The claim to be operated. |
| OutputClaim | outputClaim | boolean | The ClaimTypes that are produced after this ClaimsTransformation has been invoked (true or false). |

Use this claim transformation to perform logical negation on a claim.

```XML
<ClaimsTransformation Id="CheckWhetherEmailBePresented" TransformationMethod="NotClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="userExists" TransformationClaimType="inputClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="userExists" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example of NotClaims

- Input claims:
    - **inputClaim**: false
- Output claims:
    - **outputClaim**: true

## OrClaims

Computes an Or of two boolean inputClaims and sets the outputClaim with result of the operation.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim1 | boolean | The first ClaimType to evaluate. |
| InputClaim | inputClaim2 | boolean | The second ClaimType to evaluate. |
| OutputClaim | outputClaim | boolean | The ClaimTypes that will be produced after this ClaimsTransformation has been invoked (true or false). |

The following claims transformation demonstrates how to `Or` two boolean ClaimTypes. In the orchestration step, you can use a precondition to preset a self-asserted page, if the value of one of the claims is `true`.

```XML
<ClaimsTransformation Id="CheckWhetherEmailBePresented" TransformationMethod="OrClaims">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="isLastTOSAcceptedNotExists" TransformationClaimType="inputClaim1" />
    <InputClaim ClaimTypeReferenceId="isLastTOSAcceptedGreaterThanNow" TransformationClaimType="inputClaim2" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="presentTOSSelfAsserted" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example of OrClaims

- Input claims:
    - **inputClaim1**: true
    - **inputClaim2**: false
- Output claims:
    - **outputClaim**: true
