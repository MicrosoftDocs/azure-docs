---
title: ClaimsProviders | Microsoft Docs
description: Specify the ClaimsProvider element of a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 08/13/2018
ms.author: davidmu
ms.component: B2C
---

# ClaimsProviders 

Identity providers, attribute providers, attribute verifiers, directory providers, MFA providers, self-asserted, etc. are all modeled as **Claims Providers**. 

```XML
<TrustFrameworkPolicy 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06" 
  PolicySchemaVersion="0.3.0.0" 
  TenantId="mytenant.onmicrosoft.com" 
  PolicyId="B2C_1A_TrustFrameworkExtensions" 
  PublicPolicyUri="http://mytenant.onmicrosoft.com/B2C_1A_TrustFrameworkExtensions">
  
  <BasePolicy>
    <TenantId>mytenant.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkBase</PolicyId>
  </BasePolicy>

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
  </ClaimsProvider>
  ...
```

The **ClaimsProviders** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| ClaimsProvider | 1:n | An accredited claims provider that can be leveraged in various user journeys. |

## ClaimsProvider

The **ClaimsProvider** element contains the following child elements:

| Element | Occurences | Description |
| ------- | ---------- | ----------- |
| Domain | 0:1 | A string that contains the domain name for the claim provider. For example, if your claims provider includes the Facebook technical profile, the domain name is Facebook.com. This domain name is used for all technical profiles defined in the claims provider unless overridden by the technical profile. |
| DisplayName | 0:1 | A string that contains the name of the claims provider that can be displayed to users. |
| [TechnicalProfiles](technicalprofiles.md) | 0:1 | A set of technical profiles supported by the claim provider. Every claims provider must have one or more technical profiles that determines the endpoints and the protocols needed to communicate with the claims provider. A claims provider can have multiple technical profiles. For example, multiple technical profiles may be defined because the claims provider supports multiple protocols, various endpoints with different capabilities, or releases different claims at different assurance levels. It may be acceptable to release sensitive claims in one user journey, but not in another. |
 
