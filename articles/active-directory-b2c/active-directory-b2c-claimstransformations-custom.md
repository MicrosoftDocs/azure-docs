---
title: Claims Transformations using custom policies in Azure Active Directory B2C | Microsoft Docs
description: Learn how to use Claims Transformations within custom policies in Azure AD B2C.
services: active-directory-b2c
author: whippsp
manager: 

ms.service: active-directory
ms.workload: identity
ms.topic: article
ms.date: 07/03/2018
ms.author: whippsp
ms.component: B2C
---

# Azure AD B2C: Claims Transformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article describes how to configure and use Claims transformations within Azure AD B2C Policies.

## Overview

There are two types of Claims transformations. The first will return a claim based on certain logic. The other will throw an error based on the logic provided.

## How does it work?

Claims Transformations are located within the BuildingBlocks section of a cusotm Azure AD B2C Policy. They are then referenced by either InputClaimsTransformations or OutputClaimsTransformations.

Input Claims Transformations should be put before the InputClaims element in a custom policy.
```XML
<InputClaimsTransformations>
  <InputClaimsTransformation ReferenceId="CreateOtherMailsFromEmail" />
</InputClaimsTransformations>
```

Output Claims Transformations should be put after the OutClaims element in a custom policy.
```XML
<OutputClaimsTransformations>
  <OutputClaimsTransformation ReferenceId="CreateSubjectClaimFromObjectID" />
</OutputClaimsTransformations>
```
The *ReferenceId* attribute as shown above will point to the *Id* attribute of the ClaimsTransformaiton

Azure AD B2C has defined a number of Claims Transformations, however you can also create your own. The format for Claims transformatin should be

```XML
<ClaimsTransformation Id="[Name of the transformation in your policy]" TransformationMethod="[Type of transformation]">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="[Claim name in your policy schema]" TransformationClaimType="[Claim name in the transformation]" />
  </InputClaims>
  <InputParameters>
    <InputParameter Id="[Parameter name in the transformation]" DataType="[Some primitive type]" Value="[The value of the parameter]" />
  </InputParameters>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="[Claim name in your policy schema]" TransformationClaimType="Claim name in the transformation]" />
  </OutputClaims>
</ClaimsTransformation>
```

Note:
NullClaim Replace the value of a claim with null claim_to_null (String) claim_to_null (String)


The table below and subsequent section outline a list of Claims Trasnformation Methods available:


| Method | Type | Description |
| --- | --- | --- |
| [AddItemToStringCollection](#AddItemToStringCollection) | Claims |   |
| [GetSingleItemFromStringCollection](#GetSingleItemFromStringCollection) | Claims |  |
| [AssertBooleanClaimIsEqualToValue](#AssertBooleanClaimIsEqualToValue)  | Assert |   |
| [CreateRandomString](#CreateRandomString) | Claims |  |
| [FormatStringClaim](#FormatStringClaim) | Claims |  |
| [CreateStringClaim](#CreateStringClaim) | Claims |  |
| [CreateAlternativeSecurityId](#CreateAlternativeSecurityId) | Claims |  |
| [FormatStringMultipleClaims](#FormatStringMultipleClaims) | Claims |  |
| [AssertStringClaimsAreEqual](#AssertStringClaimsAreEqual) | Assert |  |
| [AssertDateTimeIsGreaterThan](#AssertDateTimeIsGreaterThan) | Assert |  |
| [ConvertNumberToStringClaim](#ConvertNumberToStringClaim) | Claims |  |
| [GetEmailFromJsonTransformation](#GetEmailFromJsonTransformation)| Claims |  |
| [Hash](#Hash)| Claims |  |
| [Equality](#Equality)| Claims |  |
| [ClaimToClaimEquality](#ClaimToClaimEquality)| Claims |  |
| [AddParameterToStringCollection](#AddParameterToStringCollection) | Claims |  |
| [ChangeCase](#ChangeCase)| Claims |  |
| [CompareClaimToValue](#CompareClaimToValue) | Claims |  |
| [CompareClaims](#CompareClaims) | Claims |  |
| [CreateRandomString](#CreateRandomString) | Claims |  |
| [GetAgeGroupAndConsentProvided](#GetAgeGroupAndConsentProvided) | Claims |  |
| [SetClaimsIfStringsMatch](#SetClaimsIfStringsMatch) | Claims |  |
| [GetMappedValueFromLocalizedCollection](#GetMappedValueFromLocalizedCollection) | Claims |  |
| [DoesClaimExist](#DoesClaimExist)| Claims |  || Claims |  |
| [GetCurrentDateTime](#GetCurrentDateTime)| Claims |  |
| [IsTermsOfUseConsentRequired](#IsTermsOfUseConsentRequired) | Claims |  |


For more information on Claims transformation please see 
[Features Part 6 - Claims Transformaitons](https://github.com/Azure-Samples/active-directory-b2c-advanced-policies/blob/master/Documentation/Features%20part%206.md#specifying-the-claims-transformation)


# Claims Transformation Method Examples



### AddItemToStringCollection

As the name dictates, this provider does nothing. This provider can be used for suppressing SSO behavior for a specific technical profile.

| Variable | Paramater | Description
| - | - | - |
| **Input Claims** | item | A single value claim to add to the collection |
| | collection | The collection of values to combine with item |
| **Input Paramaters** | N/A | | 
| **Output Claims** | collection | The collection claim to output to | 



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

### GetSingleItemFromStringCollection

This provider can be used for storing claims in a session. This provider is typically referenced in a technical profile used for managing local accounts. 

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

### AssertBooleanClaimIsEqualToValue

This provider can be used for storing claims in a session. This provider is typically referenced in a technical profile used for managing local accounts. 

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

To add claims in the session, use the `<PersistedClaims>` element of the technical profile. When the provider is used to repopulate the session, the persisted claims are added to the claims bag. `<OutputClaims>` is used for retrieving claims from the session.




## Next steps

We love feedback and suggestions! If you have any difficulties with this topic, post on Stack Overflow using the tag ['azure-ad-b2c'](https://stackoverflow.com/questions/tagged/azure-ad-b2c). For feature requests, vote for them in our [feedback forum](https://feedback.azure.com/forums/169401-azure-active-directory/category/160596-b2c).
