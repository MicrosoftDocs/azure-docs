---
title: Social account claims transformation examples for the Identity Experience Framework Schema of Azure Active Directory B2C  | Microsoft Docs
description: Social account claims transformation examples for the Identity Experience Framework Schema of Azure Active Directory B2C.
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

# Social accounts claims transformations

This article provides examples for using the social account claims transformations of the Identity Experience Framework  schema in Azure Active Directory (Azure AD) B2C. For more information, see [ClaimsTransformations](claimstransformations.md).

## CreateAlternativeSecurityId

**Deprecated** use `CreateUserIdentity` instead.

Creates a JSON representation of the user’s alternativeSecurityId property that can be used in the calls to Azure Active Directory. For more information, see [AlternativeSecurityId's schema](http://msdn.microsoft.com/en-us/library/azure/dn151689.aspx).

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | key | string | The ClaimType that specifies the social account ID (key). |
| InputClaim | identityProvider | string | The ClaimType that specifies the social account identity provider name. |
| OutputClaim | alternativeSecurityId | string | The ClaimType that is produced after this ClaimsTransformation has been invoked. |

Use this claims transformation to generate a `alternativeSecurityId` ClaimType. It's used by all social identity provider technical profiles, such as `Facebook-OAUTH`. The following claims transformation receives the user social account ID and the identity provider name. The output of this technical profile is a JSON string format that can be used in Azure AD directory services.  

```XML
<ClaimsTransformation Id="CreateAlternativeSecurityId" TransformationMethod="CreateAlternativeSecurityId">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="socialIdpUserId" TransformationClaimType="key" />
    <InputClaim ClaimTypeReferenceId="identityProvider" TransformationClaimType="identityProvider" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="alternativeSecurityId" TransformationClaimType="alternativeSecurityId" />
  </OutputClaims>
</ClaimsTransformation>
```

### Example

- Input claims:
    - **key**: 12334
    - **identityProvider**: Facebook.com
- Output claims:
    - **alternativeSecurityId**: 		{
			"issuer": "facebook.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw"}


## AddItemToAlternativeSecurityIdCollection

**Deprecated** use `AddItemToStringCollection` claims transformation instead.

Adds an `AlternativeSecurityId` to an `AlternativeSecurityId` collection. Both the item and the collection are optional in the transformation.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | item | string | The ClaimType to be added to the output claim. |
| InputClaim | collection | alternativeSecurityIdCollection | The ClaimTypes that are used by the claims transformation if available in the policy. |
| OutputClaim | collection | alternativeSecurityIdCollection | The ClaimTypes that are produced after this ClaimsTransformation has been invoked. |

```XML
<ClaimsTransformation Id="AddAnotherAlternativeSecurityId" TransformationMethod="AddItemToAlternativeSecurityIdCollection">
  <InputClaims>
	<InputClaim ClaimTypeReferenceId="AlternativeSecurityId2" TransformationClaimType="item" />
	<InputClaim ClaimTypeReferenceId="AlternativeSecurityIds" TransformationClaimType="collection" />
  </InputClaims>
  <OutputClaims>
	<OutputClaim ClaimTypeReferenceId="AlternativeSecurityIds" TransformationClaimType="collection" />
  </OutputClaims>
</ClaimsTransformation>
```

