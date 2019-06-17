---
title: TechnicalProfiles | Microsoft Docs
description: Specify the TechnicalProfiles element of a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: marsma
ms.subservice: B2C
---

# TechnicalProfiles

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

A **TechnicalProfiles** element contains a set of technical profiles supported by the claim provider. Every claims provider must have one or more technical profiles that determine the endpoints and the protocols needed to communicate with the claims provider. A claims provider can have multiple technical profiles.

```XML
<ClaimsProvider>
  <DisplayName>Display name</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="Technical profile identifier">
      <DisplayName>Display name of technical profile</DisplayName>
      <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.RestfulProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
      <Metadata>
        <Item Key="ServiceUrl">URL of service</Item>
        <Item Key="AuthenticationType">None</Item>
        <Item Key="SendClaimsIn">Body</Item>
      </Metadata>
      <InputTokenFormat>JWT</InputTokenFormat>
      <OutputTokenFormat>JWT</OutputTokenFormat>
      <CryptographicKeys>
        <Key ID="Key identifier" StorageReferenceId="Storage key container identifier"/>
        ...
      </CryptographicKeys>
      <InputClaimsTransformations>
        <InputClaimsTransformation ReferenceId="Claims transformation identifier" />
        ...
      <InputClaimsTransformations>
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="givenName" DefaultValue="givenName" PartnerClaimType="firstName" />
        ...
      </InputClaims>
      <PersistedClaims>
        <PersistedClaim ClaimTypeReferenceId="givenName" DefaultValue="givenName" PartnerClaimType="firstName" />
        ...
      </PersistedClaims>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="loyaltyNumber" DefaultValue="loyaltyNumber" PartnerClaimType="loyaltyNumber" />
      </OutputClaims>
      <OutputClaimsTransformations>
        <OutputClaimsTransformation ReferenceId="Claims transformation identifier" />
        ...
      <OutputClaimsTransformations>
      <ValidationTechnicalProfiles>
        <ValidationTechnicalProfile ReferenceId="Technical profile identifier" />
        ...
      </ValidationTechnicalProfiles>
      <SubjectNamingInfo ClaimType="Claim type identifier" />
      <IncludeTechnicalProfile ReferenceId="Technical profile identifier" />
      <UseTechnicalProfileForSessionManagement ReferenceId="Technical profile identifier" />
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

The **TechnicalProfile** element contains the following attribute:

| Attribute | Required | Description |
|---------|---------|---------|
| Id | Yes | A unique identifier of the technical profile. The technical profile can be referenced using this identifier from other elements in the policy file. For example, **OrchestrationSteps** and **ValidationTechnicalProfile**. |

The **TechnicalProfile** contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Domain | 0:1 | The domain name for the technical profile. For example, if your technical profile specifies the Facebook identity provider, the domain name is Facebook.com. |
| DisplayName | 0:1 | The name of the technical profile that can be displayed to users. |
| Description | 0:1 | The description of the technical profile that can be displayed to users. |
| Protocol | 0:1 | The protocol used for the communication with the other party. |
| Metadata | 0:1 | A collection of key/value pairs that are utilized by the protocol for communicating with the endpoint in the course of a transaction. |
| InputTokenFormat | 0:1 | The format of the input token. Possible values: `JSON`, `JWT`, `SAML11`, or `SAML2`. The `JWT` value represents a JSON Web Token as per IETF specification. The `SAML11` value represents a SAML 1.1 security token as per OASIS specification.  The `SAML2` value represents a SAML 2.0 security token as per OASIS specification. |
| OutputTokenFormat | 0:1 | The format of the output token. Possible values: `JSON`, `JWT`, `SAML11`, or `SAML2`. |
| CryptographicKeys | 0:1 | A list of cryptographic keys that are used in the technical profile. |
| InputClaimsTransformations | 0:1 | A list of previously defined references to claims transformations that should be executed before any claims are sent to the claims provider or the relying party. |
| InputClaims | 0:1 | A list of the previously defined references to claim types that are taken as input in the technical profile. |
| PersistedClaims | 0:1 | A list of the previously defined references to claim types that are persisted by the claims provider that relates to the technical profile. |
| OutputClaims | 0:1 | A list of the previously defined references to claim types that are taken as output in the technical profile. |
| OutputClaimsTransformations | 0:1 | A list of previously defined references to claims transformations that should be executed after the claims are received from the claims provider. |
| ValidationTechnicalProfiles | 0:n | A list of references to other technical profiles that the technical profile uses for validation purposes. For more information, see [validation technical profile](validation-technical-profile.md)|
| SubjectNamingInfo | 0:1 | Controls the production of the subject name in tokens where the subject name is specified separately from claims. For example, OAuth or SAML.  |
| IncludeClaimsFromTechnicalProfile | 0:1 | An identifier of a technical profile from which you want all of the input and output claims to be added to this technical profile. The referenced technical profile must be defined in the same policy file. |
| IncludeTechnicalProfile |0:1 | An identifier of a technical profile from which you want all data to be added to this technical profile. The referenced technical profile must exist in the same policy file. |
| UseTechnicalProfileForSessionManagement | 0:1 | A different technical profile to be used for session management. |
|EnabledForUserJourneys| 0:1 |Controls if the technical profile is executed in a user journey.  |

### Protocol

The **Protocol** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Name | Yes | The name of a valid protocol supported by Azure AD B2C that is used as part of the technical profile. Possible values: `OAuth1`, `OAuth2`, `SAML2`, `OpenIdConnect`, `WsFed`, `WsTrust`, `Proprietary`, `session management`, `self-asserted`, or `None`. |
| Handler | No | When the protocol name is set to `Proprietary`, specify the fully-qualified name of the assembly that is used by Azure AD B2C to determine the protocol handler. |

### Metadata

A **Metadata** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Item | 0:n | The metadata that relates to the technical profile. Each type of technical profile has a different set of metadata items. See the technical profile types section, for more information. |

#### Item

The **Item** element of the **Metadata** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Key | Yes | The metadata key. See each technical profile type, for the list of metadata items. |

### CryptographicKeys

The **CryptographicKeys** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Key | 1:n | A cryptographic key used in this technical profile. |

#### Key

The **Key** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | No | A unique identifier of a particular key pair referenced from other elements in the policy file. |
| StorageReferenceId | Yes | An identifer of a storage key container referenced from other elements in the policy file. |

### InputClaimsTransformations

The **InputClaimsTransformations** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| InputClaimsTransformation | 1:n | The identifier of a claims transformation that should be executed before any claims are sent to the claims provider or the relying party. A claims transformation can be used to modify existing ClaimsSchema claims or generate new ones. |

#### InputClaimsTransformation

The **InputClaimsTransformation** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ReferenceId | Yes | An identifier of a claims transformation already defined in the policy file or parent policy file. |

### InputClaims

The **InputClaims** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| InputClaim | 1:n | An expected input claim type. |

#### InputClaim

The **InputClaim** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClaimTypeReferenceId | Yes | The identifier of a claim type already defined in the ClaimsSchema section in the policy file or parent policy file. |
| DefaultValue | No | A default value to use to create a claim if the claim indicated by ClaimTypeReferenceId does not exist so that the resulting claim can be used as an InputClaim by the technical profile. |
| PartnerClaimType | No | The identifier of the claim type of the external partner that the specified policy claim type maps to. If the PartnerClaimType attribute is not specified, then the specified policy claim type is mapped to the partner claim type of the same name. Use this property when your claim type name is different from the other party. For example, the first claim name is 'givenName', while the partner uses a claim named 'first_name'. |

### PersistedClaims

The **PersistedClaims** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| PersistedClaim | 1:n | The claim type to persist. |

#### PersistedClaim

The **PersistedClaim** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClaimTypeReferenceId | Yes | The identifier of a claim type already defined in the ClaimsSchema section in the policy file or parent policy file. |
| DefaultValue | No | A default value to use to create a claim if the claim indicated by ClaimTypeReferenceId does not exist so that the resulting claim can be used as an InputClaim by the technical profile. |
| PartnerClaimType | No | The identifier of the claim type of the external partner that the specified policy claim type maps to. If the PartnerClaimType attribute is not specified, then the specified policy claim type is mapped to the partner claim type of the same name. Use this property when your claim type name is different from the other party. For example, the first claim name is 'givenName', while the partner uses a claim named 'first_name'. |

### OutputClaims

The **OutputClaims** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OutputClaim | 1:n | An expected output claim type. |

#### OutputClaim

The **OutputClaim** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClaimTypeReferenceId | Yes | The identifier of a claim type already defined in the ClaimsSchema section in the policy file or parent policy file. |
| DefaultValue | No | A default value to use to create a claim if the claim indicated by ClaimTypeReferenceId does not exist so that the resulting claim can be used as an InputClaim by the technical profile. |
|AlwaysUseDefaultValue |No |Force the use of the default value.  |
| PartnerClaimType | No | The identifier of the claim type of the external partner that the specified policy claim type maps to. If the PartnerClaimType attribute is not specified, then the specified policy claim type is mapped to the partner claim type of the same name. Use this property when your claim type name is different from the other party. For example, the first claim name is 'givenName', while the partner uses a claim named 'first_name'. |

### OutputClaimsTransformations

The **OutputClaimsTransformations** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OutputClaimsTransformation | 1:n | The identifiers of claims transformations that should be executed before any claims are sent to the claims provider or the relying party. A claims transformation can be used to modify existing ClaimsSchema claims or generate new ones. |

#### OutputClaimsTransformation

The **OutputClaimsTransformation** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ReferenceId | Yes | An identifier of a claims transformation already defined in the policy file or parent policy file. |

### ValidationTechnicalProfiles

The **ValidationTechnicalProfiles** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| ValidationTechnicalProfile | 1:n | The identifiers of technical profiles that are used validate some or all of the output claims of the referencing technical profile. All of the input claims of the referenced technical profile must appear in the output claims of the referencing technical profile. |

#### ValidationTechnicalProfile

The **ValidationTechnicalProfile** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ReferenceId | Yes | An identifier of a technical profile already defined in the policy file or parent policy file. |

###  SubjectNamingInfo

The **SubjectNamingInfo** contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ClaimType | Yes | An identifier of a claim type already defined in the ClaimsSchema section in the policy file. |

### IncludeTechnicalProfile

The **IncludeTechnicalProfile** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ReferenceId | Yes | An identifier of a technical profile already defined in the policy file or parent policy file. |

### UseTechnicalProfileForSessionManagement

The **UseTechnicalProfileForSessionManagement** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ReferenceId | Yes | An identifier of a technical profile already defined in the policy file or parent policy file. |

### EnabledForUserJourneys
The **ClaimsProviderSelections** in a user journey defines the list of claims provider selection options and their order. With the **EnabledForUserJourneys** element  you filter, which claims provider is available to the user. The **EnabledForUserJourneys** element contains one of the following values:

- **Always**, execute the technical profile.
- **Never**, skip the technical profile.
- **OnClaimsExistence** execute only when a certain claim, specified in the technical profile exists.
- **OnItemExistenceInStringCollectionClaim**, execute only when an item exists in a string collection claim.
- **OnItemAbsenceInStringCollectionClaim** execute only when an item does not exist in a string collection claim.

Using **OnClaimsExistence**, **OnItemExistenceInStringCollectionClaim** or **OnItemAbsenceInStringCollectionClaim**, requires you to provide the following metadata: **ClaimTypeOnWhichToEnable** specifies the claim's type that is to be evaluated, **ClaimValueOnWhichToEnable** specifies the value that is to be compared.

The following technical profile is executed only if the **identityProviders** string collection contains the value of `facebook.com`:

```XML
<TechnicalProfile Id="UnLink-Facebook-OAUTH">
  <DisplayName>Unlink Facebook</DisplayName>
...
    <Metadata>
      <Item Key="ClaimTypeOnWhichToEnable">identityProviders</Item>
      <Item Key="ClaimValueOnWhichToEnable">facebook.com</Item>
    </Metadata>
...
  <EnabledForUserJourneys>OnItemExistenceInStringCollectionClaim</EnabledForUserJourneys>
</TechnicalProfile>
```
