---
title: BuildingBlocks - Azure Active Directory B2C | Microsoft Docs
description: Specify the BuildingBlocks element of a custom policy in Azure Active Directory B2C.
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

# BuildingBlocks

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

The **BuildingBlocks** element is added inside the [TrustFrameworkPolicy](trustframeworkpolicy.md) element.

```XML
<TrustFrameworkPolicy
  xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="https://www.w3.org/2001/XMLSchema"
  xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
  PolicySchemaVersion="0.3.0.0"
  TenantId="mytenant.onmicrosoft.com"
  PolicyId="B2C_1A_TrustFrameworkBase"
  PublicPolicyUri="http://mytenant.onmicrosoft.com/B2C_1A_TrustFrameworkBase">

  <BuildingBlocks>
    <ClaimsSchema>
      ...
    </ClaimsSchema>
    <Predicates>
    ...
    </Predicates>
    <PredicateValidations>
    ...
    </PredicateValidations>
    <ClaimsTransformations>
      ...
    </ClaimsTransformations>
    <ContentDefinitions>
      ...
    </ContentDefinitions>
    <Localization>
      ...
    </Localization>
 </BuildingBlocks>
```

The **BuildingBlocks** element contains the following elements that must be specified in the order defined:

- [ClaimsSchema](claimsschema.md) - Defines the claim types that can be referenced as part of the policy. The claims schema is the place where you declare your claim types. A claim type is similar to a variable in many programmatic languages. You can use the claim type to collect data from the user of your application, receive claims from social identity providers, send and receive data from a custom REST API, or store any internal data used by your custom policy. 

- [Predicates and PredicateValidationsInput](predicates.md) - Enables you to perform a validation process to ensure that only properly formed data is entered into a claim.
 
- [ClaimsTransformations](claimstransformations.md) - Contains a list of claims transformations that can be used in your policy.  A claims transformation converts one claim into another. In the claims transformation, you specify a transform method, such as: 
    - Changing the case of a string claim to the one specified. For example, changing a string from lowercase to uppercase.
    - Comparing two claims and returning a claim with true indicating that the claims match, otherwise false.
    - Creating a string claim from the provided parameter in the policy.
    - Creating a random string using the random number generator.
    - Formatting a claim according to the provided format string. This transformation uses the C# `String.Format` method.

- [ContentDefinitions](contentdefinitions.md) - Contains URLs for HTML5 templates to use in your user journey. In a custom policy, a content definition defines the HTML5 page URI that's used for a specified step in the user journey. For example, the sign-in or sign-up, password reset, or error pages. You can modify the look and feel by overriding the LoadUri for the HTML5 file. Or you can create new content definitions according to your needs. This element may contain a localized resources reference using a localization ID.

- [Localization](localization.md) - Allows you to support multiple languages. The localization support in policies allows you set up the list of supported languages in a policy and pick a default language. Language-specific strings and collections are also supported.


