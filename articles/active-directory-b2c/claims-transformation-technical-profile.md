---
title: Define a claims transformation technical profile
titleSuffix: Azure AD B2C
description: Define a claims transformation technical profile in a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 01/17/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Define a claims transformation technical profile in an Azure Active Directory B2C custom policy

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

A claims transformation technical profile enables you to call output claims transformations to manipulate claims values, validate claims, or set default values for a set of output claims.

## Protocol

The **Name** attribute of the **Protocol** element needs to be set to `Proprietary`. The **handler** attribute must contain the fully qualified name of the protocol handler assembly that is used by Azure AD B2C: `Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null`.

The following example shows a claims transformation technical profile:

```xml
<TechnicalProfile Id="Facebook-OAUTH-UnLink">
    <DisplayName>Unlink Facebook</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  ...
```

## Output claims

The **OutputClaims** element is mandatory. Provide at least one output claim returned by the technical profile. The following example shows how to set default values in the output claims:

```xml
<OutputClaims>
  <OutputClaim ClaimTypeReferenceId="ageGroup" DefaultValue="Undefined" />
  <OutputClaim ClaimTypeReferenceId="ageGroupValueChanged" DefaultValue="false" />
</OutputClaims>
```

## Output claims transformations

The **OutputClaimsTransformations** element may contain a collection of **OutputClaimsTransformation** elements that are used to modify claims or generate new ones. The following technical profile calls the **RemoveAlternativeSecurityIdByIdentityProvider** claims transformation. This claims transformation removes a social identify from the collection of **AlternativeSecurityIds**. The output claims of this technical profile are **identityProvider2**, which is set to `facebook.com`, and **AlternativeSecurityIds**, which contains the list of social identities associated with this user after facebook.com identity is removed.

```xml
<ClaimsTransformations>
  <ClaimsTransformation Id="RemoveAlternativeSecurityIdByIdentityProvider"
TransformationMethod="RemoveAlternativeSecurityIdByIdentityProvider">
    <InputClaims>
      <InputClaim ClaimTypeReferenceId="IdentityProvider2"
TransformationClaimType="identityProvider" />
      <InputClaim ClaimTypeReferenceId="AlternativeSecurityIds"
TransformationClaimType="collection" />
    </InputClaims>
    <OutputClaims>
      <OutputClaim ClaimTypeReferenceId="AlternativeSecurityIds"
TransformationClaimType="collection" />
    </OutputClaims>
  </ClaimsTransformation>
</ClaimsTransformations>
...
<TechnicalProfile Id="Facebook-OAUTH-UnLink">
    <DisplayName>Unlink Facebook</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="identityProvider2" DefaultValue="facebook.com" AlwaysUseDefaultValue="true" />
    </OutputClaims>
    <OutputClaimsTransformations>
        <OutputClaimsTransformation ReferenceId="RemoveAlternativeSecurityIdByIdentityProvider" />
    </OutputClaimsTransformations>
    <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
</TechnicalProfile>
```

The claims transformation technical profile enables you to execute a claims transformation from any user journey's orchestration step. In the following example, the orchestration step calls one of the unlink technical profiles, such as **UnLink-Facebook-OAUTH**. This technical profile calls the output claims transformation **RemoveAlternativeSecurityIdByIdentityProvider**, which generates a new **AlternativeSecurityIds2** claim. The output claim contains the list of user's social identities, while removing the Facebook identity from the collections.

```xml
<UserJourney Id="AccountUnLink">
  <OrchestrationSteps>
    ...
    <OrchestrationStep Order="8" Type="ClaimsExchange">
      <ClaimsExchanges>
        <ClaimsExchange Id="UnLinkFacebookExchange" TechnicalProfileReferenceId="UnLink-Facebook-OAUTH" />
        <ClaimsExchange Id="UnLinkMicrosoftExchange" TechnicalProfileReferenceId="UnLink-Microsoft-OAUTH" />
        <ClaimsExchange Id="UnLinkGitHubExchange" TechnicalProfileReferenceId="UnLink-GitHub-OAUTH" />
      </ClaimsExchanges>
    </OrchestrationStep>
    ...
  </OrchestrationSteps>
</UserJourney>
```

## Metadata

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| IncludeClaimResolvingInClaimsHandling | No | For input and output claims, specifies whether [claims resolution](claim-resolver-overview.md) is included in the technical profile. Possible values: `true`, or `false` (default). If you want to use a claims resolver in the technical profile, set this metadata to `true`. |
| ContentDefinitionReferenceId | No | The identifier of the [content definition](contentdefinitions.md) associated with this technical profile. The content definition metadata is required for [FormatLocalizedString](string-transformations.md#formatlocalizedstring), [GetLocalizedStringsTransformation](string-transformations.md#getlocalizedstringstransformation), and [GetMappedValueFromLocalizedCollection](string-transformations.md#getmappedvaluefromlocalizedcollection) claims transformations.|

## Use a validation technical profile

A claims transformation technical profile can be used to validate information. In the following example, the [self asserted technical profile](self-asserted-technical-profile.md) named **LocalAccountSignUpWithLogonEmail** asks the user to enter the email twice, then calls the [validation technical profile](validation-technical-profile.md) named **Validate-Email** to validate the emails. The **Validate-Email** technical profile calls the claims transformation **AssertEmailAreEqual** to compare the two claims **email** and **emailRepeat**, and throw an exception if they are not equal according to the specified comparison.

```xml
<ClaimsTransformations>
  <ClaimsTransformation Id="AssertEmailAreEqual" TransformationMethod="AssertStringClaimsAreEqual">
    <InputClaims>
      <InputClaim ClaimTypeReferenceId="email" TransformationClaimType="inputClaim1" />
      <InputClaim ClaimTypeReferenceId="emailRepeat" TransformationClaimType="inputClaim2" />
    </InputClaims>
    <InputParameters>
      <InputParameter Id="stringComparison" DataType="string" Value="ordinalIgnoreCase" />
    </InputParameters>
  </ClaimsTransformation>
</ClaimsTransformations>
```

The claims transformation technical profile calls the **AssertEmailAreEqual** claims transformation, which asserts that emails provided by the user are same.

```xml
<TechnicalProfile Id="Validate-Email">
  <DisplayName>Unlink Facebook</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <InputClaims>
    <InputClaim ClaimTypeReferenceId="emailRepeat" />
  </InputClaims>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" />
  </OutputClaims>
  <OutputClaimsTransformations>
    <OutputClaimsTransformation ReferenceId="AssertEmailAreEqual" />
  </OutputClaimsTransformations>
  <UseTechnicalProfileForSessionManagement ReferenceId="SM-Noop" />
</TechnicalProfile>
```

A self-asserted technical profile can call the validation technical profile and show the error message as specified in the **UserMessageIfClaimsTransformationStringsAreNotEqual** metadata.

```xml
<TechnicalProfile Id="LocalAccountSignUpWithLogonEmail">
  <DisplayName>User ID signup</DisplayName>
  <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.SelfAssertedAttributeProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
  <Metadata>
    ...
    <Item Key="UserMessageIfClaimsTransformationStringsAreNotEqual">The email addresses you provided are not the same</Item>
  </Metadata>
  <OutputClaims>
    <OutputClaim ClaimTypeReferenceId="email" />
    <OutputClaim ClaimTypeReferenceId="emailRepeat" />
    ...
  </OutputClaims>
  <ValidationTechnicalProfiles>
    <ValidationTechnicalProfile ReferenceId="Validate-Email" />
  </ValidationTechnicalProfiles>
</TechnicalProfile>
```
