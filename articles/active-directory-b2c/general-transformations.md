---
title: General claims transformation examples for custom policies
titleSuffix: Azure AD B2C
description: General claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 02/03/2020
ms.author: mimart
ms.subservice: B2C
---

# General claims transformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article provides examples for using general claims transformations of the Identity Experience Framework schema in Azure Active Directory B2C (Azure AD B2C). For more information, see [ClaimsTransformations](claimstransformations.md).

## CopyClaim

Copy value of a claim to another. Both claims must be from the same type.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | string, int | The claim type which is to be copied. |
| OutputClaim | outputClaim | string, int | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

Use this claims transformation to copy a value from a string or numeric claim, to another claim. The following example copies the externalEmail claim value to email claim.

```XML
<ClaimsTransformation Id="CopyEmailAddress" TransformationMethod="CopyClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="externalEmail" TransformationClaimType="inputClaim"/>
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" TransformationClaimType="outputClaim"/>
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **inputClaim**: bob@contoso.com
- Output claims:
    - **outputClaim**: bob@contoso.com

## DoesClaimExist

Checks if the **inputClaim** exists or not and sets **outputClaim** to true or false accordingly.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim |Any | The input claim whose existence needs to be verified. |
| OutputClaim | outputClaim | boolean | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

Use this claims transformation to check if a claim exists or contains any value. The return value is a boolean that indicates whether the claim exists. Following example checks if the email address exists.

```XML
<ClaimsTransformation Id="CheckIfEmailPresent" TransformationMethod="DoesClaimExist">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="inputClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isEmailPresent" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **inputClaim**: someone@contoso.com
- Output claims:
  - **outputClaim**: true

## Hash

Hash the provided plain text using the salt and a secret. The hashing algorithm used is SHA-256.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | plaintext | string | The input claim to be encrypted |
| InputClaim | salt | string | The salt parameter. You can create a random value, using `CreateRandomString` claims transformation. |
| InputParameter | randomizerSecret | string | Points to an existing Azure AD B2C **policy key**. To create a new policy key: In your Azure AD B2C tenant, under **Manage**, select **Identity Experience Framework**. Select **Policy keys** to view the keys that are available in your tenant. Select **Add**. For **Options**, select **Manual**. Provide a name (the prefix *B2C_1A_* might be added automatically.). In the **Secret** text box, enter any secret you want to use, such as 1234567890. For **Key usage**, select **Signature**. Select **Create**. |
| OutputClaim | hash | string | The ClaimType that is produced after this claims transformation has been invoked. The claim configured in the `plaintext` inputClaim. |

```XML
<ClaimsTransformation Id="HashPasswordWithEmail" TransformationMethod="Hash">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="password" TransformationClaimType="plaintext" />
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="salt" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="randomizerSecret" DataType="string" Value="B2C_1A_AccountTransformSecret" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="hashedPassword" TransformationClaimType="hash" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **plaintext**: MyPass@word1
  - **salt**: 487624568
  - **randomizerSecret**: B2C_1A_AccountTransformSecret
- Output claims:
  - **outputClaim**: CdMNb/KTEfsWzh9MR1kQGRZCKjuxGMWhA5YQNihzV6U=
