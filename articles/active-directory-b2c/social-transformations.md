---
title: Social account claims transformation examples for custom policies
titleSuffix: Azure AD B2C
description: Social account claims transformation examples for the Identity Experience Framework (IEF) schema of Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 02/16/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Social accounts claims transformations

In Azure Active Directory B2C (Azure AD B2C), social account identities are stored in a `alternativeSecurityIds` attribute of a **alternativeSecurityIdCollection** claim type. Each item in the **alternativeSecurityIdCollection** specifies the issuer (identity provider name, such as facebook.com) and the `issuerUserId`, which is a unique user identifier for the issuer.

```json
"alternativeSecurityIds": [{
    "issuer": "google.com",
    "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw"
  },
  {
    "issuer": "facebook.com",
    "issuerUserId": "MTIzNDU="
  }]
```

This article provides examples for using the social account claims transformations of the Identity Experience Framework schema in Azure AD B2C. For more information, see [ClaimsTransformations](claimstransformations.md).

## AddItemToAlternativeSecurityIdCollection

Adds an `AlternativeSecurityId` to an `alternativeSecurityIdCollection` claim. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/social#additemtoalternativesecurityidcollection) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | Element | string | The claim to be added to the output claim. |
| InputClaim | collection | alternativeSecurityIdCollection | The claim that is used by the claims transformation if available in the policy. If provided, the claims transformation adds the `item` at the end of the collection. |
| OutputClaim | collection | alternativeSecurityIdCollection | The claim that is produced after this claims transformation has been invoked. The new collection that contains both the items from input `collection` and `item`. |

### Example of AddItemToAlternativeSecurityIdCollection

The following example links a new social identity with an existing account. To link a new social identity:

1. In the `AAD-UserReadUsingAlternativeSecurityId` and `AAD-UserReadUsingObjectId` technical profiles, output the user's `alternativeSecurityIds` claim.
1. Ask the user to sign in with one of the identity providers that aren't associated with this user.
1. Using the **CreateAlternativeSecurityId** claims transformation, create a new **alternativeSecurityId** claim type with a name of `AlternativeSecurityId2`
1. Call the **AddItemToAlternativeSecurityIdCollection** claims transformation to add the **AlternativeSecurityId2** claim to the existing **AlternativeSecurityIds** claim.
1. Persist the **alternativeSecurityIds** claim to the user account

```xml
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

- Input claims:
  - **item**: 

      ```json
      {
          "issuer": "facebook.com",
          "issuerUserId": "MTIzNDU="
      }
      ```

  - **collection**: 
    
      ```json
      [
          {
              "issuer": "live.com",
              "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw"
          }
      ]
      ```
   
- Output claims:
  - **collection**: 

    ```json
    [
        {
            "issuer": "live.com",
            "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw"
        },
        {
            "issuer": "facebook.com",
            "issuerUserId": "MTIzNDU="
        }
    ]
    ```


## CreateAlternativeSecurityId

Creates a JSON representation of the user’s alternativeSecurityId property that can be used in the calls to Microsoft Entra ID. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/social#createalternativesecurityid) of this claims transformation. For more information, see the [AlternativeSecurityId](/graph/api/resources/alternativesecurityid) schema. 

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | key | string | The claim that specifies the unique user identifier used by the social identity provider. |
| InputClaim | identityProvider | string | The claim that specifies the social account identity provider name, such as facebook.com. |
| OutputClaim | alternativeSecurityId | string | The claim that is produced after the claims transformation has been invoked. Contains information about the identity of a social account user. The **issuer** is the value of the `identityProvider` claim. The **issuerUserId** is the value of the `key` claim in base64 format. |

### Example of CreateAlternativeSecurityId

Use this claims transformation to generate a `alternativeSecurityId` claim. It's used by all social identity provider technical profiles, such as `Facebook-OAUTH`. The following claims transformation receives the user social account ID and the identity provider name. The output of this technical profile is a JSON string format that can be used in Microsoft Entra directory services.

```xml
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

- Input claims:
  - **key**: 12334
  - **identityProvider**: Facebook.com
- Output claims:
  - **alternativeSecurityId**: { "issuer": "facebook.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw"}

## GetIdentityProvidersFromAlternativeSecurityIdCollectionTransformation

Returns list of issuers from the **alternativeSecurityIdCollection** claim into a new **stringCollection** claim. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/social#getidentityprovidersfromalternativesecurityidcollectiontransformation) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | alternativeSecurityIdCollection | alternativeSecurityIdCollection | The claim to be used to get the list of identity providers (issuer). |
| OutputClaim | identityProvidersCollection | stringCollection | The claim that is produced after this claims transformation has been invoked. A list of identity providers associated with the input claim. |

### Example of GetIdentityProvidersFromAlternativeSecurityIdCollectionTransformation

The following claims transformation reads the user **alternativeSecurityIds** claim and extracts the list of identity provider names associated with that account. Use output **identityProvidersCollection** to show the user the list of identity providers associated with the account. Or, on the identity provider selection page, filter the list of identity providers based on output **identityProvidersCollection** claim. So, user can select to link new social identity that isn't already associated with the account.

```xml
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
  - **alternativeSecurityIdCollection**: 

    ```json
    [
        {
            "issuer": "google.com",
            "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw"
        },
        {
            "issuer": "facebook.com",
            "issuerUserId": "MTIzNDU="
        }
    ]
    ```

- Output claims:
  - **identityProvidersCollection**: [ "facebook.com", "google.com" ]

## RemoveAlternativeSecurityIdByIdentityProvider

Removes an **AlternativeSecurityId** from an **alternativeSecurityIdCollection** claim. Check out the [Live demo](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/social#removealternativesecurityidbyidentityprovider) of this claims transformation.

| Element | TransformationClaimType | Data Type | Notes |
| ---- | ----------------------- | --------- | ----- |
| InputClaim | identityProvider | string | The claim that contains the identity provider name to be removed from the collection. |
| InputClaim | collection | alternativeSecurityIdCollection | The claim that is used by the claims transformation. The claims transformation removes the identityProvider from the collection. |
| OutputClaim | collection | alternativeSecurityIdCollection | The claim that is produced after this claims transformation has been invoked. The new collection, after the identityProvider removed from the collection. |

### Example of RemoveAlternativeSecurityIdByIdentityProvider

The following example unlinks one of the social identities with an existing account. To unlink a social identity:

1. In the `AAD-UserReadUsingAlternativeSecurityId` and `AAD-UserReadUsingObjectId` technical profiles, output the user's `alternativeSecurityIds` claim.
2. Ask the user to select which social account to remove from the list identity providers that are associated with this user.
3. Call a claims transformation technical profile that calls the **RemoveAlternativeSecurityIdByIdentityProvider** claims transformation, that removed the selected social identity, using identity provider name.
4. Persist the **alternativeSecurityIds** claim to the user account.

```xml
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

- Input claims:
  - **identityProvider**: facebook.com
  - **collection**: [ { "issuer": "live.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw" }, { "issuer": "facebook.com", "issuerUserId": "MTIzNDU=" } ]
- Output claims:
  - **collection**: [ { "issuer": "live.com", "issuerUserId": "MTA4MTQ2MDgyOTI3MDUyNTYzMjcw" } ]

## Next steps

- Find more [claims transformation samples](https://github.com/azure-ad-b2c/unit-tests/tree/main/claims-transformation/social) on the Azure AD B2C community GitHub repo
