---
title: UserJourneys  
description: Specify the UserJourneys element of a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 01/27/2023
ms.author: kengaderdus
ms.subservice: B2C
---

# UserJourneys

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

User journeys specify explicit paths through which a policy allows a relying party application to obtain the desired claims for a user. The user is taken through these paths to retrieve the claims that are to be presented to the relying party. In other words, user journeys define the business logic of what an end user goes through as the Azure AD B2C Identity Experience Framework processes the request.

These user journeys can be considered as templates available to satisfy the core need of the various relying parties of the community of interest. User journeys facilitate the definition of the relying party part of a policy. A policy can define multiple user journeys. Each user journey is a sequence of orchestration steps.

To define the user journeys supported by the policy, a `UserJourneys` element is added under the top-level `TrustFrameworkPolicy` element of the policy file.

```xml
<TrustFrameworkPolicy  ...>
  ...
  <UserJourneys>
    ...
  </UserJourneys>
</TrustFrameworkPolicy>
```

The **UserJourneys** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| UserJourney | 1:n | A user journey that defines all of the constructs necessary for a complete user flow. |

The **UserJourney** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier of a user journey that can be used to reference it from other elements in the policy. The **DefaultUserJourney** element of the [relying party policy](relyingparty.md) points to this attribute. |
| DefaultCpimIssuerTechnicalProfileReferenceId| No | The default token issuer technical profile reference ID. For example, [JWT token issuer](userjourneys.md), [SAML token issuer](saml-issuer-technical-profile.md), or [OAuth2 custom error](oauth2-error-technical-profile.md). If your user journey or sub journey already has another `SendClaims` orchestration step, set the `DefaultCpimIssuerTechnicalProfileReferenceId` attribute to the user journey's token issuer technical profile. |

The **UserJourney** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| AuthorizationTechnicalProfiles | 0:1 | List of authorization technical profiles. | 
| OrchestrationSteps | 1:n | An orchestration sequence that must be followed through for a successful transaction. Every user journey consists of an ordered list of orchestration steps that are executed in sequence. If any step fails, the transaction fails. |

## AuthorizationTechnicalProfiles

Suppose a user has completed a UserJourney and obtained an access or an ID token. To manage additional resources, such the [UserInfo endpoint](userinfo-endpoint.md), the user must be identified. To begin this process, the user must present the access token issued earlier as proof that they were originally authenticated by a valid Azure AD B2C policy. A valid token for the user must always be present during this process to ensure the user is allowed to make this request. The authorization technical profiles validate the incoming token and extract claims from the token.

The **AuthorizationTechnicalProfiles** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| AuthorizationTechnicalProfile | 0:1 | The technical profile reference used to authorize the user. | 

The **AuthorizationTechnicalProfile** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| ReferenceId | Yes | The identifier of the technical profile that is to be executed. |

The following example shows a user journey element with authorization technical profiles:

```xml
<UserJourney Id="UserInfoJourney" DefaultCpimIssuerTechnicalProfileReferenceId="UserInfoIssuer">
  <Authorization>
    <AuthorizationTechnicalProfiles>
      <AuthorizationTechnicalProfile ReferenceId="UserInfoAuthorization" />
    </AuthorizationTechnicalProfiles>
  </Authorization>
  <OrchestrationSteps>
    <OrchestrationStep Order="1" Type="ClaimsExchange">
     ...
```

## OrchestrationSteps

A user journey is represented as an orchestration sequence that must be followed through for a successful transaction. If any step fails, the transaction fails. These orchestration steps reference both the building blocks and the claims providers allowed in the policy file. Any orchestration step that is responsible to show or render a user experience also has a reference to the corresponding content definition identifier.

Orchestration steps can be conditionally executed based on preconditions defined in the orchestration step element. For example, you can check to perform an orchestration step only if a specific claim exists, or if a claim is equal or not to the specified value.

To specify the ordered list of orchestration steps, an **OrchestrationSteps** element is added as part of the policy. This element is required.

```xml
<UserJourney Id="SignUpOrSignIn">
  <OrchestrationSteps>
    <OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
      ...
```

The **OrchestrationSteps** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OrchestrationStep | 1:n | An ordered orchestration step. |

The **OrchestrationStep** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `Order` | Yes | The order of the orchestration steps. |
| `Type` | Yes | The type of the orchestration step. Possible values: <ul><li>**ClaimsProviderSelection** - Indicates that the orchestration step presents various claims providers to the user to select one.</li><li>**CombinedSignInAndSignUp** - Indicates that the orchestration step presents a combined social provider sign-in and local account sign-up page.</li><li>**ClaimsExchange** - Indicates that the orchestration step exchanges claims with a claims provider.</li><li>**GetClaims** - Specifies that the orchestration step should process claim data sent to Azure AD B2C from the relying party via its `InputClaims` configuration.</li><li>**InvokeSubJourney** - Indicates that the orchestration step exchanges claims with a [sub journey](subjourneys.md).</li><li>**SendClaims** - Indicates that the orchestration step sends the claims to the relying party with a token issued by a claims issuer.</li></ul> |
| ContentDefinitionReferenceId | No | The identifier of the [content definition](contentdefinitions.md) associated with this orchestration step. Usually the content definition reference identifier is defined in the self-asserted technical profile. But, there are some cases when Azure AD B2C needs to display something without a technical profile. There are two examples - if the type of the orchestration step is one of following: `ClaimsProviderSelection` or  `CombinedSignInAndSignUp`, Azure AD B2C needs to display the identity provider selection without having a technical profile. |
| CpimIssuerTechnicalProfileReferenceId | No | The type of the orchestration step is `SendClaims`. This property defines the technical profile identifier of the claims provider that issues the token for the relying party.  If absent, no relying party token is created. |

The **OrchestrationStep** element can contain the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Preconditions | 0:n | A list of preconditions that must be satisfied for the orchestration step to execute. |
| ClaimsProviderSelections | 0:n | A list of claims provider selections for the orchestration step. |
| ClaimsExchanges | 0:n | A list of claims exchanges for the orchestration step. |
| JourneyList | 0:1 | A list of sub journey candidates for the orchestration step. |

### Preconditions

Orchestration steps can be conditionally executed based on preconditions defined in the orchestration step. The `Preconditions` element contains a list of preconditions to evaluate. When the precondition evaluation is satisfied, the associated orchestration step skips to the next orchestration step. 

Azure AD B2C evaluates the preconditions in list order. The order-based preconditions allows you set the order in which the preconditions are applied. The first precondition that satisfied overrides all the subsequent preconditions. The orchestration step is executed only if all of the preconditions are not satisfied. 

The **Preconditions** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Precondition | 1:n | A precondition to evaluate. |

#### Precondition

The **Precondition** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| `Type` | Yes | The type of check or query to perform for this precondition. The value can be **ClaimsExist**, which specifies that the actions should be performed if the specified claims exist in the user's current claim set, or **ClaimEquals**, which specifies that the actions should be performed if the specified claim exists and its value is equal to the specified value. |
| `ExecuteActionsIf` | Yes | Decides how the precondition is considered satisfied. Possible values: `true`, or `false`. If the value is set to `true`, it's considered satisfied when the claim matches the precondition.  If the value is set to `false`, it's considered satisfied when the claim doesn't match the precondition.  |

The **Precondition** elements contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Value | 1:2 | The identifier of a claim type. The claim is already defined in the claims schema section in the policy file, or parent policy file. When the precondition is type of `ClaimEquals`, a second `Value` element contains the value to be checked. |
| Action | 1:1 | The action that should be performed if the precondition evaluation is satisfied. Possible value: `SkipThisOrchestrationStep`. The associated orchestration step skips to the next one. |
  
Each precondition evaluates a single claim. There are two types of preconditions:
 
- **ClaimsExist** - Specifies that the actions should be performed if the specified claims exist in the user's current claim bag.
- **ClaimEquals** - Specifies that the actions should be performed if the specified claim exists, and its value is equal to the specified value. The check performs a case-sensitive ordinal comparison. When checking Boolean claim type, use `True`, or `False`. 

    If the claim is null or uninitialized, the precondition is ignored, whether the `ExecuteActionsIf` is `true`, or `false`. As a best practice, check both that the claim exists, and equals to a value.

An example scenario would be to challenge the user for MFA if the user has `MfaPreference` set to `Phone`. To perform this conditional logic, check if the `MfaPreference` claim exists, and also check the claim value equals to `Phone`. The following XML demonstrates how to implement this logic with preconditions. 
  
```xml
<Preconditions>
  <!-- Skip this orchestration step if MfaPreference doesn't exist. -->
  <Precondition Type="ClaimsExist" ExecuteActionsIf="false">
    <Value>MfaPreference</Value>
    <Action>SkipThisOrchestrationStep</Action>
  </Precondition>
  <!-- Skip this orchestration step if MfaPreference doesn't equal to Phone. -->
  <Precondition Type="ClaimEquals" ExecuteActionsIf="false">
    <Value>MfaPreference</Value>
    <Value>Phone</Value>
    <Action>SkipThisOrchestrationStep</Action>
  </Precondition>
</Preconditions>
```

#### Preconditions examples

The following preconditions checks whether the user's objectId exists. In the user journey, the user has selected to sign in using local account. If the objectId exists, skip this orchestration step.

```xml
<OrchestrationStep Order="2" Type="ClaimsExchange">
  <Preconditions>
    <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
      <Value>objectId</Value>
      <Action>SkipThisOrchestrationStep</Action>
    </Precondition>
  </Preconditions>
  <ClaimsExchanges>
    <ClaimsExchange Id="FacebookExchange" TechnicalProfileReferenceId="Facebook-OAUTH" />
    <ClaimsExchange Id="SignUpWithLogonEmailExchange" TechnicalProfileReferenceId="LocalAccountSignUpWithLogonEmail" />
  </ClaimsExchanges>
</OrchestrationStep>
```

The following preconditions checks whether the user signed in with a social account. An attempt is made to find the user account in the directory. If the user signs in or signs up with a local account, skip this orchestration step.

```xml
<OrchestrationStep Order="3" Type="ClaimsExchange">
  <Preconditions>
    <Precondition Type="ClaimEquals" ExecuteActionsIf="true">
      <Value>authenticationSource</Value>
      <Value>localAccountAuthentication</Value>
      <Action>SkipThisOrchestrationStep</Action>
    </Precondition>
  </Preconditions>
  <ClaimsExchanges>
    <ClaimsExchange Id="AADUserReadUsingAlternativeSecurityId" TechnicalProfileReferenceId="AAD-UserReadUsingAlternativeSecurityId-NoError" />
  </ClaimsExchanges>
</OrchestrationStep>
```

Preconditions can check multiple preconditions. The following example checks whether 'objectId' or 'email' exists. If the first condition is true, the journey skips to the next orchestration step.

```xml
<OrchestrationStep Order="4" Type="ClaimsExchange">
  <Preconditions>
    <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
      <Value>objectId</Value>
      <Action>SkipThisOrchestrationStep</Action>
    </Precondition>
    <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
      <Value>email</Value>
      <Action>SkipThisOrchestrationStep</Action>
    </Precondition>
  </Preconditions>
  <ClaimsExchanges>
    <ClaimsExchange Id="SelfAsserted-SocialEmail" TechnicalProfileReferenceId="SelfAsserted-SocialEmail" />
  </ClaimsExchanges>
</OrchestrationStep>
```

## Claims provider selection

Claims provider selection lets users select an action from a list of options. The identity provider selection consists of a pair of two orchestration  steps: 

1. **Buttons** - It starts with type of `ClaimsProviderSelection`, or `CombinedSignInAndSignUp` that contains a list of options a user can choose from. The order of the options inside the `ClaimsProviderSelections` element controls the order of the buttons presented to the user.
2. **Actions** - Followed by type of `ClaimsExchange`. The ClaimsExchange contains list of actions. The action is a reference to a technical profile, such as [OAuth2](oauth2-technical-profile.md), [OpenID Connect](openid-connect-technical-profile.md), [claims transformation](claims-transformation-technical-profile.md), or [self-asserted](self-asserted-technical-profile.md). When a user clicks on one of the buttons, the corresponding action is executed.

The **ClaimsProviderSelections** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| ClaimsProviderSelection | 1:n | Provides the list of claims providers that can be selected.|

The **ClaimsProviderSelections** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| DisplayOption| No | Controls the behavior of a case where a single claims provider selection is available. Possible values: `DoNotShowSingleProvider` (default) , the user is redirected immediately to the federated identity provider. Or `ShowSingleProvider` Azure AD B2C presents the sign-in page with the single identity provider selection. To use this attribute, the [content definition version](page-layout.md) must be `urn:com:microsoft:aad:b2c:elements:contract:providerselection:1.0.0` and above.|

The **ClaimsProviderSelection** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| TargetClaimsExchangeId | No | The identifier of the claims exchange, which is executed in the next orchestration step of the claims provider selection. This attribute or the ValidationClaimsExchangeId attribute must be specified, but not both. |
| ValidationClaimsExchangeId | No | The identifier of the claims exchange, which is executed in the current orchestration step to validate the claims provider selection. This attribute or the TargetClaimsExchangeId attribute must be specified, but not both. |

### Claims provider selection example

In the following orchestration step, the user can choose to sign in with Facebook, LinkedIn, Twitter, Google, or a local account. If the user selects one of the social identity providers, the second orchestration step executes with the selected claim exchange specified in the `TargetClaimsExchangeId` attribute. The second orchestration step redirects the user to the social identity provider to complete the sign-in process. If the user chooses to sign in with the local account, Azure AD B2C stays on the same orchestration step (the same sign-up page or sign-in page) and skips the second orchestration step.

```xml
<OrchestrationStep Order="1" Type="CombinedSignInAndSignUp" ContentDefinitionReferenceId="api.signuporsignin">
  <ClaimsProviderSelections>
    <ClaimsProviderSelection TargetClaimsExchangeId="FacebookExchange" />
    <ClaimsProviderSelection TargetClaimsExchangeId="LinkedInExchange" />
    <ClaimsProviderSelection TargetClaimsExchangeId="TwitterExchange" />
    <ClaimsProviderSelection TargetClaimsExchangeId="GoogleExchange" />
    <ClaimsProviderSelection ValidationClaimsExchangeId="LocalAccountSigninEmailExchange" />
  </ClaimsProviderSelections>
  <ClaimsExchanges>
  <ClaimsExchange Id="LocalAccountSigninEmailExchange"
        TechnicalProfileReferenceId="SelfAsserted-LocalAccountSignin-Email" />
  </ClaimsExchanges>
</OrchestrationStep>


<OrchestrationStep Order="2" Type="ClaimsExchange">
  <Preconditions>
    <Precondition Type="ClaimsExist" ExecuteActionsIf="true">
      <Value>objectId</Value>
      <Action>SkipThisOrchestrationStep</Action>
    </Precondition>
  </Preconditions>
  <ClaimsExchanges>
    <ClaimsExchange Id="FacebookExchange" TechnicalProfileReferenceId="Facebook-OAUTH" />
    <ClaimsExchange Id="SignUpWithLogonEmailExchange" TechnicalProfileReferenceId="LocalAccountSignUpWithLogonEmail" />
    <ClaimsExchange Id="GoogleExchange" TechnicalProfileReferenceId="Google-OAUTH" />
    <ClaimsExchange Id="LinkedInExchange" TechnicalProfileReferenceId="LinkedIn-OAUTH" />
    <ClaimsExchange Id="TwitterExchange" TechnicalProfileReferenceId="Twitter-OAUTH1" />
  </ClaimsExchanges>
</OrchestrationStep>
```

## ClaimsExchanges

The **ClaimsExchanges** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| ClaimsExchange | 1:n | Depending on the technical profile being used, either redirects the client according to the ClaimsProviderSelection that was selected, or makes a server call to exchange claims. |

The **ClaimsExchange** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier of the claims exchange step. The identifier is used to reference the claims exchange from a claims provider selection step in the policy. |
| TechnicalProfileReferenceId | Yes | The identifier of the technical profile that is to be executed. |

## JourneyList

The **JourneyList** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Candidate | 1:1 | A reference to a sub journey to be called. |

### Candidate

The **Candidate** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| SubJourneyReferenceId | Yes | The identifier of the [sub journey](subjourneys.md) that is to be executed. |
