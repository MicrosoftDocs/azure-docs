---
title: Password complexity in custom policies in Azure Active Directory B2C | Microsoft Docs
description: How to configure complexity requirements for passwords in Custom Policy.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 08/16/2017
ms.author: davidmu
ms.component: B2C
---

# Configure password complexity in custom policies

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

This article is an advanced description of how password complexity works and is enabled using Azure AD B2C custom policies.

## Azure AD B2C: Configure complexity requirements for passwords

Azure Active Directory B2C (Azure AD B2C) supports changing the complexity requirements for passwords supplied by an end user when creating an account.  By default, Azure AD B2C uses **Strong** passwords.  Azure AD B2C also supports configuration options to control the complexity of passwords that customers can use.  This article talks about how to do configure password complexity in custom policies.  It is also possible to use [configure password complexity in built-in policies](active-directory-b2c-reference-password-complexity.md).

## Prerequisites

An Azure AD B2C tenant configured to complete a local account sign-up/sign-in, as described in [Getting started](active-directory-b2c-get-started-custom.md).

## How to configure password complexity in custom policy

To configure password complexity in custom policy, the overall structure of your custom policy must include a `ClaimsSchema`, `Predicates`, and `InputValidations` element inside `BuildingBlocks`.

```XML
  <BuildingBlocks>
    <ClaimsSchema>...</ClaimsSchema>
    <Predicates>...</Predicates>
    <InputValidations>...</InputValidations>
  </BuildingBlocks>
```

The purpose of these elements is as follows:

- Each `Predicate` element defines a basic string validation check that returns true or false.
- The `InputValidations` element has one or more `InputValidation` elements.  Each `InputValidation` is constructed by using a series of `Predicate` elements. This element allows you to perform boolean aggregations (similar to `and` and `or`).
- The `ClaimsSchema` defines which claim is being validated.  It then defines which `InputValidation` rule is used to validate that claim.

### Defining a predicate element

Predicates have two method types: IsLengthRange or MatchesRegex. Let's review an example of each.  First we have an example of MatchesRegex, which is used to match a regular expression.  In this example, it matches string that contains numbers.

```XML
      <Predicate Id="PIN" Method="MatchesRegex" HelpText="The password must be a pin.">
        <Parameters>
          <Parameter Id="RegularExpression">^[0-9]+$</Parameter>
        </Parameters>
      </Predicate>
```

Next let's review an example of IsLengthRange.  This method takes a minimum and maximum string length.

```XML
      <Predicate Id="Length" Method="IsLengthRange" HelpText="The password must be between 8 and 16 characters.">
        <Parameters>
          <Parameter Id="Minimum">8</Parameter>
          <Parameter Id="Maximum">16</Parameter>
        </Parameters>
      </Predicate>
```

Use the `HelpText` attribute to provide an error message for end users if the check fails.  This string can be localized using the [language customization feature](active-directory-b2c-reference-language-customization.md).

### Defining an InputValidation element

An `InputValidation` is an aggregation of `PredicateReferences`. Each `PredicateReferences` must be true in order for the `InputValidation` to succeed.  However, inside the `PredicateReferences` element use an attribute called `MatchAtLeast` to specify how many `PredicateReference` checks must return true.  Optionally, define a `HelpText` attribute to override the error message defined in the `Predicate` elements that it references.

```XML
      <InputValidation Id="PasswordValidation">
        <PredicateReferences Id="LengthGroup" MatchAtLeast="1">
          <PredicateReference Id="Length" />
        </PredicateReferences>
        <PredicateReferences Id="3of4" MatchAtLeast="3" HelpText="You must have at least 3 of the following character classes:">
          <PredicateReference Id="Lowercase" />
          <PredicateReference Id="Uppercase" />
          <PredicateReference Id="Number" />
          <PredicateReference Id="Symbol" />
        </PredicateReferences>
      </InputValidation>
```

### Defining a ClaimsSchema element

The claim types `newPassword` and `reenterPassword` are considered special, so do not change the names.  The UI validates the user correctly reentered their password during account creation based on these `ClaimType` elements.  To find the same `ClaimType` elements, look in the TrustFrameworkBase.xml in your starter pack.  What's new in this example is that we are overriding these elements to define a `InputValidationReference`. The `ID` attribute of this new element is pointing to the `InputValidation` element that we defined.

```XML
    <ClaimsSchema>
      <ClaimType Id="newPassword">
        <InputValidationReference Id="PasswordValidation" />
      </ClaimType>
      <ClaimType Id="reenterPassword">
        <InputValidationReference Id="PasswordValidation" />
      </ClaimType>
    </ClaimsSchema>
```

### Putting it all together

This example shows how all the pieces fit together to form a working policy.  To use this example:

1. Follow the instructions in the pre-requisite [Getting started](active-directory-b2c-get-started-custom.md) to download, configure, and upload TrustFrameworkBase.xml and TrustFrameworkExtensions.xml
1. Create a SignUporSignIn.xml file using the example content in this section.
1. Update SignUporSignIn.xml replacing `yourtenant` with your Azure AD B2C tenant name.
1. Upload the SignUporSignIn.xml policy file last.

This example contains a validation for pin passwords and one for strong passwords:

- Look for `PINpassword`. This `InputValidation` element validates a pin of any length.  It is not used at the moment, because it is not referenced in the `InputValidationReference` element inside `ClaimType`. 
- Look for `PasswordValidation`. This `InputValidation` element validates a password is 8 to 16 characters and contains 3 of 4 of numbers, uppercase, lowercase, or symbols.  It is referenced in `ClaimType`.  Therefore, this rule is being enforced in this policy.

```XML
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<TrustFrameworkPolicy
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns="http://schemas.microsoft.com/online/cpim/schemas/2013/06"
  PolicySchemaVersion="0.3.0.0"
  TenantId="yourtenant.onmicrosoft.com"
  PolicyId="B2C_1A_signup_signin"
  PublicPolicyUri="http://yourtenant.onmicrosoft.com/B2C_1A_signup_signin">
 <BasePolicy>
    <TenantId>yourtenant.onmicrosoft.com</TenantId>
    <PolicyId>B2C_1A_TrustFrameworkExtensions</PolicyId>
  </BasePolicy>
  <BuildingBlocks>
    <ClaimsSchema>
      <ClaimType Id="newPassword">
        <InputValidationReference Id="PasswordValidation" />
      </ClaimType>
      <ClaimType Id="reenterPassword">
        <InputValidationReference Id="PasswordValidation" />
      </ClaimType>
    </ClaimsSchema>
    <Predicates>
      <Predicate Id="Lowercase" Method="MatchesRegex" HelpText="a lowercase">
        <Parameters>
          <Parameter Id="RegularExpression">[a-z]+</Parameter>
        </Parameters>
      </Predicate>
      <Predicate Id="Uppercase" Method="MatchesRegex" HelpText="an uppercase">
        <Parameters>
          <Parameter Id="RegularExpression">[A-Z]+</Parameter>
        </Parameters>
      </Predicate>
      <Predicate Id="Number" Method="MatchesRegex" HelpText="a number">
        <Parameters>
          <Parameter Id="RegularExpression">[0-9]+</Parameter>
        </Parameters>
      </Predicate>
      <Predicate Id="Symbol" Method="MatchesRegex" HelpText="a symbol">
        <Parameters>
          <Parameter Id="RegularExpression">[!@#$%^*()]+</Parameter>
        </Parameters>
      </Predicate>
      <Predicate Id="Length" Method="IsLengthRange" HelpText="The password must be between 8 and 16 characters.">
        <Parameters>
          <Parameter Id="Minimum">8</Parameter>
          <Parameter Id="Maximum">16</Parameter>
        </Parameters>
      </Predicate>
      <Predicate Id="PIN" Method="MatchesRegex" HelpText="The password must be a pin.">
        <Parameters>
          <Parameter Id="RegularExpression">^[0-9]+$</Parameter>
        </Parameters>
      </Predicate>
    </Predicates>
    <InputValidations>
      <InputValidation Id="PasswordValidation">
        <PredicateReferences Id="LengthGroup" MatchAtLeast="1">
          <PredicateReference Id="Length" />
        </PredicateReferences>
        <PredicateReferences Id="3of4" MatchAtLeast="3" HelpText="You must have at least 3 of the following character classes:">
          <PredicateReference Id="Lowercase" />
          <PredicateReference Id="Uppercase" />
          <PredicateReference Id="Number" />
          <PredicateReference Id="Symbol" />
        </PredicateReferences>
      </InputValidation>
      <InputValidation Id="PINpassword">
        <PredicateReferences Id="PINGroup">
          <PredicateReference Id="PIN" />
        </PredicateReferences>
      </InputValidation>
    </InputValidations>
  </BuildingBlocks>
  <RelyingParty>
    <DefaultUserJourney ReferenceId="SignUpOrSignIn" />
    <TechnicalProfile Id="PolicyProfile">
      <DisplayName>PolicyProfile</DisplayName>
      <Protocol Name="OpenIdConnect" />
      <InputClaims>
        <InputClaim ClaimTypeReferenceId="passwordPolicies" DefaultValue="DisablePasswordExpiration, DisableStrongPassword" />
      </InputClaims>
      <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="displayName" />
        <OutputClaim ClaimTypeReferenceId="givenName" />
        <OutputClaim ClaimTypeReferenceId="surname" />
        <OutputClaim ClaimTypeReferenceId="email" />
        <OutputClaim ClaimTypeReferenceId="objectId" PartnerClaimType="sub"/>
      </OutputClaims>
      <SubjectNamingInfo ClaimType="sub" />
    </TechnicalProfile>
  </RelyingParty>
</TrustFrameworkPolicy>
```
