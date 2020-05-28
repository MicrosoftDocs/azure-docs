---
title: StringCollection claims transformation examples for custom policies
titleSuffix: Azure AD B2C
description: StringCollection claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 04/21/2020
ms.author: mimart
ms.subservice: B2C
---

# StringCollection claims transformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article provides examples for using the string collection claims transformations of the Identity Experience Framework  schema in Azure Active Directory B2C (Azure AD B2C). For more information, see [ClaimsTransformations](claimstransformations.md).

## AddItemToStringCollection

Adds a string claim to a new unique values stringCollection claim.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | item | string | The ClaimType to be added to the output claim. |
| InputClaim | collection | stringCollection | [Optional] If specified, the claims transformation copies the items from this collection, and adds the item to the end of the output collection claim. |
| OutputClaim | collection | stringCollection | The ClaimType that is produced after this claims transformation has been invoked, with the value specified in the input claim. |

Use this claims transformation to add a string to a new or existing stringCollection. It's commonly used in a **AAD-UserWriteUsingAlternativeSecurityId** technical profile. Before a new social account is created, **CreateOtherMailsFromEmail** claims transformation reads the ClaimType and adds the value to the **otherMails** ClaimType.

The following claims transformation adds the **email** ClaimType to **otherMails** ClaimType.

```XML
<ClaimsTransformation Id="CreateOtherMailsFromEmail" TransformationMethod="AddItemToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="item" />
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **collection**: ["someone@outlook.com"]
  - **item**: "admin@contoso.com"
- Output claims:
  - **collection**: ["someone@outlook.com", "admin@contoso.com"]

## AddParameterToStringCollection

Adds a string parameter to a new unique values stringCollection claim.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | collection | stringCollection | [Optional] If specified, the claims transformation copies the items from this collection, and adds the item to the end of the output collection claim. |
| InputParameter | item | string | The value to be added to the output claim. |
| OutputClaim | collection | stringCollection | The ClaimType that is produced after this claims transformation has been invoked, with the value specified in the input parameter. |

Use this claims transformation to add a string value to a new or existing stringCollection. The following example adds a constant email address (admin@contoso.com) to the **otherMails** claim.

```XML
<ClaimsTransformation Id="SetCompanyEmail" TransformationMethod="AddParameterToStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="item" DataType="string" Value="admin@contoso.com" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **collection**: ["someone@outlook.com"]
- Input parameters
  - **item**: "admin@contoso.com"
- Output claims:
  - **collection**: ["someone@outlook.com", "admin@contoso.com"]

## GetSingleItemFromStringCollection

Gets the first item from the provided string collection.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | collection | stringCollection | The ClaimTypes that are used by the claims transformation to get the item. |
| OutputClaim | extractedItem | string | The ClaimTypes that are produced after this ClaimsTransformation has been invoked. The first item in the collection. |

The following example reads the **otherMails** claim and return the first item into the **email** claim.

```XML
<ClaimsTransformation Id="CreateEmailFromOtherMails" TransformationMethod="GetSingleItemFromStringCollection">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="otherMails" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" TransformationClaimType="extractedItem" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
  - **collection**: ["someone@outlook.com", "someone@contoso.com"]
- Output claims:
  - **extractedItem**: "someone@outlook.com"


## StringCollectionContains

Checks if a StringCollection claim type contains an element

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | inputClaim | stringCollection | The claim type which is to be searched. |
|InputParameter|item|string|The value to search.|
|InputParameter|ignoreCase|string|Specifies whether this comparison should ignore the case of the strings being compared.|
| OutputClaim | outputClaim | boolean | The ClaimType that is produced after this ClaimsTransformation has been invoked. A boolean indicator if the collection contains such a string |

Following example checks whether the `roles` stringCollection claim type contains the value of **admin**.

```XML
<ClaimsTransformation Id="IsAdmin" TransformationMethod="StringCollectionContains">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="roles" TransformationClaimType="inputClaim"/>
  </InputClaims>
  <InputParameters>
    <InputParameter  Id="item" DataType="string" Value="Admin"/>
    <InputParameter  Id="ignoreCase" DataType="string" Value="true"/>
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="isAdmin" TransformationClaimType="outputClaim"/>
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
    - **inputClaim**: ["reader", "author", "admin"]
- Input parameters:
    - **item**: "Admin"
    - **ignoreCase**: "true"
- Output claims:
    - **outputClaim**: "true"

## StringCollectionContainsClaim

Checks if a StringCollection claim type contains a claim value.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | collection | stringCollection | The claim type which is to be searched. |
| InputClaim | item|string| The claim type that contains the value to search.|
|InputParameter|ignoreCase|string|Specifies whether this comparison should ignore the case of the strings being compared.|
| OutputClaim | outputClaim | boolean | The ClaimType that is produced after this ClaimsTransformation has been invoked. A boolean indicator if the collection contains such a string |

Following example checks whether the `roles` stringCollection claim type contains the value of the `role` claim type.

```XML
<ClaimsTransformation Id="HasRequiredRole" TransformationMethod="StringCollectionContainsClaim">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="roles" TransformationClaimType="collection" />
    <InputClaim ClaimTypeReferenceId="role" TransformationClaimType="item" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="ignoreCase" DataType="string" Value="true" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="hasAccess" TransformationClaimType="outputClaim" />
  </OutputClaims>
</ClaimsTransformation> 
```

- Input claims:
    - **collection**: ["reader", "author", "admin"]
    - **item**: "Admin"
- Input parameters:
    - **ignoreCase**: "true"
- Output claims:
    - **outputClaim**: "true"
