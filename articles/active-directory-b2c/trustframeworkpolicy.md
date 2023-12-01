---
title: TrustFrameworkPolicy - Azure Active Directory B2C  
description: Specify the TrustFrameworkPolicy element of a custom policy in Azure Active Directory B2C.

author: kengaderdus
manager: CelesteDG

ms.service: active-directory

ms.topic: reference
ms.date: 11/09/2021
ms.author: kengaderdus
ms.subservice: B2C
---

# TrustFrameworkPolicy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

A custom policy is represented as one or more XML-formatted files, which refer to each other in a hierarchical chain. The XML elements define elements of the policy, such as the claims schema, claims transformations, content definitions, claims providers, technical profiles, user journey, and orchestration steps. Each policy file is defined within the top-level **TrustFrameworkPolicy** element of a policy file.

```xml
<TrustFrameworkPolicy
  xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="https://www.w3.org/2001/XMLSchema"
  xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
  PolicySchemaVersion="0.3.0.0"
  TenantId="yourtenant.onmicrosoft.com"
  PolicyId="B2C_1A_TrustFrameworkBase"
  PublicPolicyUri="http://yourtenant.onmicrosoft.com/B2C_1A_TrustFrameworkBase">
  ...
```


The **TrustFrameworkPolicy** element contains the following attributes:

| Attribute | Required | Description |
|---------- | -------- | ----------- |
| PolicySchemaVersion | Yes | The schema version that is to be used to execute the policy. The value must be `0.3.0.0` |
| TenantObjectId | No | The unique object identifier of the Azure Active Directory B2C (Azure AD B2C) tenant. |
| TenantId | Yes | The unique identifier of the tenant to which this policy belongs. |
| PolicyId | Yes | The unique identifier for the policy. This identifier must be prefixed by *B2C_1A_* |
| PublicPolicyUri | Yes | The URI for the policy, which is combination of the tenant ID and the policy ID. |
| DeploymentMode | No | Possible values: `Production`, or `Development`. `Production` is the default. Use this property to debug your policy. For more information, see [Collecting Logs](troubleshoot-with-application-insights.md). |
| UserJourneyRecorderEndpoint | No | The endpoint that is used for logging. The value must be set to `urn:journeyrecorder:applicationinsights` if the attribute exists. For more information, see [Collecting Logs](troubleshoot-with-application-insights.md). |


The following example shows how to specify the **TrustFrameworkPolicy** element:

``` XML
<TrustFrameworkPolicy
   xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
   xmlns:xsd="https://www.w3.org/2001/XMLSchema"
   xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
   PolicySchemaVersion="0.3.0.0"
   TenantId="yourtenant.onmicrosoft.com"
   PolicyId="B2C_1A_TrustFrameworkBase"
   PublicPolicyUri="http://yourtenant.onmicrosoft.com/B2C_1A_TrustFrameworkBase">
```

The **TrustFrameworkPolicy** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| BasePolicy| 0:1| The identifier of a base policy. |
| [BuildingBlocks](buildingblocks.md) | 0:1 | The building blocks of your policy. |
| [ClaimsProviders](claimsproviders.md) | 0:1 | A collection of claims providers. |
| [UserJourneys](userjourneys.md) | 0:1 | A collection of user journeys. |
| [SubJourneys](subjourneys.md) | 0:1 | A collection of sub journeys. |
| [RelyingParty](relyingparty.md) | 0:1 | A definition of a relying party policy. |

To inherit a policy from another policy, a **BasePolicy** element must be declared under the **TrustFrameworkPolicy** element of the policy file. The **BasePolicy** element is a reference to the base policy from which this policy is derived.

The **BasePolicy** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | --------|
| TenantId | 1:1 | The identifier of your Azure AD B2C tenant. |
| PolicyId | 1:1 | The identifier of the parent policy. |


The following example shows how to specify a base policy. This **B2C_1A_TrustFrameworkExtensions** policy is derived from the **B2C_1A_TrustFrameworkBase** policy.

``` XML
<TrustFrameworkPolicy
   xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
   xmlns:xsd="https://www.w3.org/2001/XMLSchema"
   xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
   PolicySchemaVersion="0.3.0.0"
   TenantId="yourtenant.onmicrosoft.com"
   PolicyId="B2C_1A_TrustFrameworkExtensions"
   PublicPolicyUri="http://yourtenant.onmicrosoft.com/B2C_1A_TrustFrameworkExtensions">

  <BasePolicy>
    <TenantId>yourtenant.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkBase</PolicyId>
  </BasePolicy>
  ...
</TrustFrameworkPolicy>
```

