---
title: Integer claims transformation examples for the Identity Experience Framework Schema of Azure Active Directory B2C  | Microsoft Docs
description: Integer claims transformation examples for the Identity Experience Framework Schema of Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/16/2018
ms.author: davidmu
ms.component: B2C
---

# Integer claims transformations

This article provides examples for using the integer claims transformations of the Identity Experience Framework  schema in Azure Active Directory (Azure AD) B2C. For more information, see [ClaimsTransformations](claimstransformations.md).

## ConvertNumberToStringClaim 

Converts a long integer into a string data type.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | long | The ClaimType to convert to a string. |
| OutputClaim | outputClaim | string | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

Convert a long integer type to a string. In this example, `numericUserId` with type long is converted to `UserId` with type string.

```XML
<ClaimsTransformation Id="CreateUserId" TransformationMethod="ConvertNumberToStringClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="numericUserId" TransformationClaimType="inputClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="UserId" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputClaim**: 12334 (long)
- Output claims: 
    - **outputClaim**: "12334" (string)

