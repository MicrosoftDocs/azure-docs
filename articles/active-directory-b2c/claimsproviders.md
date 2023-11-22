---
title: ClaimsProviders  - Azure Active Directory B2C  
description: Specify the ClaimsProvider element of a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 03/08/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# ClaimsProviders

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

A claims provider is an interface to communicate with different types of parties via its [technical profiles](technicalprofiles.md). Every claims provider must have one or more technical profiles that determine the endpoints and the protocols needed to communicate with the claims provider. A claims provider can have multiple technical profiles. For example, multiple technical profiles may be defined because the claims provider supports multiple protocols, various endpoints with different capabilities, or releases different claims at different assurance levels. It may be acceptable to release sensitive claims in one user journey, but not in another.

A user journey combines calling technical profiles via orchestration steps to define your business logic. 

```xml
<ClaimsProviders>
  <ClaimsProvider>
    <Domain>Domain name</Domain>
    <DisplayName>Display name</DisplayName>
    <TechnicalProfiles>
      </TechnicalProfile>
        ...
      </TechnicalProfile>
        ...
    </TechnicalProfiles>
  </ClaimsProvider>
  ...
</ClaimsProviders>
```

The **ClaimsProviders** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| ClaimsProvider | 1:n | An accredited claims provider that can be leveraged in various user journeys. |

## ClaimsProvider

The **ClaimsProvider** element contains the following child elements:

| Element | Occurrences | Description |
| ------- | ---------- | ----------- |
| Domain | 0:1 | A string that contains the domain name for the claim provider. For example, if your claims provider includes the Facebook technical profile, the domain name is Facebook.com. This domain name is used for all technical profiles defined in the claims provider unless overridden by the technical profile. The domain name can also be referenced in a **domain_hint**. For more information, see the **Redirect sign-in to a social provider** section of [Set up direct sign-in using Azure Active Directory B2C](direct-signin.md). |
| DisplayName | 1:1 | A string that contains the name of the claims provider. |
| [TechnicalProfiles](technicalprofiles.md) | 0:1 | A set of technical profiles supported by the claim provider |

**ClaimsProvider** organizes how your technical profiles relate to the claims provider. The following example shows the Microsoft Entra claims provider with the Microsoft Entra technical profiles:

```xml
<ClaimsProvider>
  <DisplayName>Azure Active Directory</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="AAD-Common">
      ...
    </TechnicalProfile>
    <TechnicalProfile Id="AAD-UserWriteUsingAlternativeSecurityId">
      ...
    </TechnicalProfile>
    <TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId">
      ...
    </TechnicalProfile>
    <TechnicalProfile Id="AAD-UserReadUsingAlternativeSecurityId-NoError">
      ...
    </TechnicalProfile>
    <TechnicalProfile Id="AAD-UserReadUsingEmailAddress">
      ...
    </TechnicalProfile>
      ...
    <TechnicalProfile Id="AAD-UserWritePasswordUsingObjectId">
      ...
    </TechnicalProfile>
    <TechnicalProfile Id="AAD-UserWriteProfileUsingObjectId">
      ...
    </TechnicalProfile>
    <TechnicalProfile Id="AAD-UserReadUsingObjectId">
      ...
    </TechnicalProfile>
    <TechnicalProfile Id="AAD-UserWritePhoneNumberUsingObjectId">
      ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```

The following example shows the Facebook claims provider with the **Facebook-OAUTH** technical profile.

```xml
<ClaimsProvider>
  <Domain>facebook.com</Domain>
  <DisplayName>Facebook</DisplayName>
  <TechnicalProfiles>
    <TechnicalProfile Id="Facebook-OAUTH">
      <DisplayName>Facebook</DisplayName>
      <Protocol Name="OAuth2" />
        ...
    </TechnicalProfile>
  </TechnicalProfiles>
</ClaimsProvider>
```
