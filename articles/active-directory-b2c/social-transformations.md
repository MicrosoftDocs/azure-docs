---
title: Social account claims transformation examples for custom policies
titleSuffix: Azure AD B2C
description: Social account claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: mimart
ms.subservice: B2C
---

# Social accounts claims transformations

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

In Azure Active Directory B2C (Azure AD B2C), social account identities are stored in a `userIdentities` attribute of a **alternativeSecurityIdCollection** claim type. Each item in the **alternativeSecurityIdCollection** specifies the issuer (identity provider name, such as facebook.com) and the `issuerUserId`, which is a unique user identifier for the issuer.

```JSON
"userIdentities": [{
    "issuer": "google.com",
    "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw"
  },
  {
    "issuer": "facebook.com",
    "issuerUserId": "MTIzNDU="
  }]
```

This article provides examples for using the social account claims transformations of the Identity Experience Framework schema in Azure AD B2C. For more information, see [ClaimsTransformations](claimstransformations.md).

## CreateAlternativeSecurityId

Creates a JSON representation of the user’s alternativeSecurityId property that can be used in the calls to Azure Active Directory. For more information, see the [AlternativeSecurityId](https://docs.microsoft.com/graph/api/resources/alternativesecurityid) schema.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | key | string | The ClaimType that specifies the unique user identifier used by the social identity provider. |
| InputClaim | identityProvider | string | The ClaimType that specifies the social account identity provider name, such as facebook.com. |
| OutputClaim | alternativeSecurityId | string | The ClaimType that is produced after the ClaimsTransformation has been invoked. Contains information about the identity of a social account user. The **issuer** is the value of the `identityProvider` claim. The **issuerUserId** is the value of the `key` claim in base64 format. |

Use this claims transformation to generate a `alternativeSecurityId` ClaimType. It's used by all social identity provider technical profiles, such as `Facebook-OAUTH`. The following claims transformation receives the user social account ID and the identity provider name. The output of this technical profile is a JSON string format that can be used in Azure AD directory services.

```XML
<ClaimsTransformation Id="CreateAlternativeSecurityId" TransformationMethod="CreateAlternativeSecurityId">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="issuerUserId" TransformationClaimType="key" />
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
    - **alternativeSecurityId**: { "issuer": "facebook.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw"}

## AddItemToAlternativeSecurityIdCollection

Adds an `AlternativeSecurityId` to an `alternativeSecurityIdCollection` claim.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | item | string | The ClaimType to be added to the output claim. |
| InputClaim | collection | alternativeSecurityIdCollection | The ClaimTypes that are used by the claims transformation if available in the policy. If provided, the claims transformation adds the `item` at the end of the collection. |
| OutputClaim | collection | alternativeSecurityIdCollection | The ClaimTypes that are produced after this ClaimsTransformation has been invoked. The new collection that contains both the items from input `collection` and `item`. |

The following example links a new social identity with an existing account. To link a new social identity:
1. In the **AAD-UserReadUsingAlternativeSecurityId** and **AAD-UserReadUsingObjectId** technical profiles, output the user's **alternativeSecurityIds** claim.
1. Ask the user to sign in with one of the identity providers that are not associated with this user.
1. Using the **CreateAlternativeSecurityId** claims transformation, create a new **alternativeSecurityId** claim type with a name of `AlternativeSecurityId2`
1. Call the **AddItemToAlternativeSecurityIdCollection** claims transformation to add the **AlternativeSecurityId2** claim to the existing **AlternativeSecurityIds** claim.
1. Persist the **alternativeSecurityIds** claim to the user account

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

### Example

- Input claims:
    - **item**: { "issuer": "facebook.com", "issuerUserId": "MTIzNDU=" }
    - **collection**: [ { "issuer": "live.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw" } ]
- Output claims:
    - **collection**: [ { "issuer": "live.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw" }, { "issuer": "facebook.com", "issuerUserId": "MTIzNDU=" } ]

## GetIdentityProvidersFromAlternativeSecurityIdCollectionTransformation

Returns list of issuers from the **alternativeSecurityIdCollection** claim into a new **stringCollection** claim.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | alternativeSecurityIdCollection | alternativeSecurityIdCollection | The ClaimType to be used to get the list of identity providers (issuer). |
| OutputClaim | identityProvidersCollection | stringCollection | The ClaimTypes that are produced after this ClaimsTransformation has been invoked. List of identity providers associate with the alternativeSecurityIdCollection input claim |

The following claims transformation reads the user **alternativeSecurityIds** claim and extracts the list of identity provider names associated with that account. Use output **identityProvidersCollection** to show the user the list of identity providers associated with the account. Or, on the identity provider selection page, filter the list of identity providers based on output **identityProvidersCollection** claim. So, user can select to link new social identity that is not already associated with the account.

```XML
<ClaimsTransformation Id="ExtractIdentityProviders" TransformationMethod="GetIdentityProvidersFromAlternativeSecurityIdCollectionTransformation">
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="alternativeSecurityIds" TransformationClaimType="alternativeSecurityIdCollection" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="identityProviders" TransformationClaimType="identityProvidersCollection" />
  </OutputClaims>
</ClaimsTransformation>
```

- Input claims:
    - **alternativeSecurityIdCollection**: [ { "issuer": "google.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw" }, { "issuer": "facebook.com", "issuerUserId": "MTIzNDU=" } ]
- Output claims:
    - **identityProvidersCollection**: [ "facebook.com", "google.com" ]

## RemoveAlternativeSecurityIdByIdentityProvider

Removes an **AlternativeSecurityId** from an **alternativeSecurityIdCollection** claim.

| Item | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | identityProvider | string | The ClaimType that contains the identity provider name to be removed from the collection. |
| InputClaim | collection | alternativeSecurityIdCollection | The ClaimTypes that are used by the claims transformation. The claims transformation removes the identityProvider from the collection. |
| OutputClaim | collection | alternativeSecurityIdCollection | The ClaimTypes that are produced after this ClaimsTransformation has been invoked. The new collection, after the identityProvider removed from the collection. |

The following example unlinks one of the social identity with an existing account. To unlink a social identity:
1. In the **AAD-UserReadUsingAlternativeSecurityId** and **AAD-UserReadUsingObjectId** technical profiles, output the user's **alternativeSecurityIds** claim.
2. Ask the user to select which social account to remove from the list identity providers that are associated with this user.
3. Call a claims transformation technical profile that calls the **RemoveAlternativeSecurityIdByIdentityProvider** claims transformation, that removed the selected social identity, using identity provider name.
4. Persist the **alternativeSecurityIds** claim to the user account.

```XML
<ClaimsTransformation Id="RemoveAlternativeSecurityIdByIdentityProvider" TransformationMethod="RemoveAlternativeSecurityIdByIdentityProvider">
    <InputClaims>
        <InputClaim ClaimTypeReferenceId="secondIdentityProvider" TransformationClaimType="identityProvider" />
        <InputClaim ClaimTypeReferenceId="AlternativeSecurityIds" TransformationClaimType="collection" />
    </InputClaims>
    <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="AlternativeSecurityIds" TransformationClaimType="collection" />
    </OutputClaims>
</ClaimsTransformation>
</ClaimsTransformations>
```

### Example

- Input claims:
    - **identityProvider**: facebook.com
    - **collection**: [ { "issuer": "live.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw" }, { "issuer": "facebook.com", "issuerUserId": "MTIzNDU=" } ]
- Output claims:
    - **collection**: [ { "issuer": "live.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw" } ]
