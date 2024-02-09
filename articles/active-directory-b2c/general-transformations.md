---
title: General claims transformation examples for custom policies
titleSuffix: Azure AD B2C
description: General claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 02/16/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# General claims transformations

This article provides examples for using general claims transformations of the Azure Active Directory B2C (Azure AD B2C) custom policy. For more information, see [claims transformations](claimstransformations.md).

## CopyClaim

Copy value of a claim to another. Both claims must be from the same type. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/general#copyclaim) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | string, int | The claim type, which is to be copied. |
| OutputClaim | outputClaim | string, int | The claim that is produced after this claims transformation has been invoked. |

Use this claims transformation to copy a value from a string or numeric claim, to another claim. The following example copies the externalEmail claim value to email claim.

```xml
<ClaimsTransformation Id="CopyEmailAddress" TransformationMethod="CopyClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="externalEmail" TransformationClaimType="inputClaim"/>
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" TransformationClaimType="outputClaim"/>
  </OutputClaims>
</ClaimsTransformation>
```

### Example of CopyClaim

- Input claims:
  - **inputClaim**: bob@contoso.com
- Output claims:
  - **outputClaim**: bob@contoso.com

## DoesClaimExist

Checks if the input claim exists, and sets output claim to `true` or `false` accordingly. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/general#doesclaimexist) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim |Any | The input claim whose existence needs to be verified. |
| OutputClaim | outputClaim | boolean | The claim that is produced after this claims transformation has been invoked. |

### Example of DoesClaimExist

Use this claims transformation to check if a claim exists or contains any value. The return value is a boolean that indicates whether the claim exists. Following example checks if the email address exists.

```xml
<ClaimsTransformation Id="CheckIfEmailPresent" TransformationMethod="DoesClaimExist">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="inputClaim" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isEmailPresent" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
  - **inputClaim**: someone@contoso.com
- Output claims:
  - **outputClaim**: true

## Hash

Hash the provided plain text using the salt and a secret. The hashing algorithm used is SHA-256. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/general#hash) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | plaintext | string | The input claim to be encrypted |
| InputClaim | salt | string | The salt parameter. You can create a random value, using `CreateRandomString` claims transformation. |
| InputParameter | randomizerSecret | string | Points to an existing Azure AD B2C **policy key**. To create a new policy key: In your Azure AD B2C tenant, under **Manage**, select **Identity Experience Framework**. Select **Policy keys** to view the keys that are available in your tenant. Select **Add**. For **Options**, select **Manual**. Provide a name (the prefix *B2C_1A_* might be added automatically.). In the **Secret** text box, enter any secret you want to use, such as 1234567890. For **Key usage**, select **Signature**. Select **Create**. |
| OutputClaim | hash | string | The claim that is produced after this claims transformation has been invoked. The claim configured in the `plaintext` inputClaim. |

### Example of Hash 

The following example demonstrates how to hash an email address. The claims transformation adds the salt to the email address before hashing the value. To call this claims transformation, set a value to the `mySalt` claim.

```xml
<ClaimsTransformation Id="HashPasswordWithEmail" TransformationMethod="Hash">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="plaintext" />
    <InputClaim ClaimTypeReferenceId="mySalt" TransformationClaimType="salt" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="randomizerSecret" DataType="string" Value="B2C_1A_AccountTransformSecret" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="hashedEmail" TransformationClaimType="hash" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
  - **plaintext**: someone@contoso.com
  - **salt**: 487624568
  - **randomizerSecret**: B2C_1A_AccountTransformSecret
- Output claims:
  - **outputClaim**: CdMNb/KTEfsWzh9MR1kQGRZCKjuxGMWhA5YQNihzV6U=

## Next steps

- Find more [claims transformation samples](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/general) on the Azure AD B2C community GitHub repo
