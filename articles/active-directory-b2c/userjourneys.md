---
title: UserJourneys | Microsoft Docs
description: Specify the UserJourneys element of a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/10/2018
ms.author: davidmu
ms.component: B2C
---

# UserJourneys

[!INCLUDE [active-directory-b2c-advanced-audience-warning](../../includes/active-directory-b2c-advanced-audience-warning.md)]

User journeys specify explicit paths through which a policy allows a relying party application to obtain the desired claims for a user. The user is taken through these paths to retrieve the claims that are to be presented to the relying party. In other words, user journeys define the business logic of what an end user goes through as the Azure AD B2C Identity Experience Framework processes the request.

These user journeys can be considered as templates available to satisfy the core need of the various replying parties of the community of interest. User journeys facilitate the definition the relying party part of a policy. A policy can define multiple user journeys. Each user journey is a sequence of orchestration steps.

To define the user journeys supported by the policy, a **UserJourneys** element is added under the top-level element of the policy file. 

The **UserJourneys** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| UserJourney | 1:n | A user journey that defines all of the constructs necessary for a complete user flow. | 

The **UserJourney** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier of a user journey that can be used to reference it from other elements in the policy. The **DefaultUserJourney** element of the [relying party policy](relyingparty.md) points to this attribute. |

The **UserJourney** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OrchestrationSteps | 1:n | An orchestration sequence that must be followed through for a successful transaction. Every user journey consists of an ordered list of orchestration steps that are executed in sequence. If any step fails, the transaction fails. |

## OrchestrationSteps

A user journey is represented as an orchestration sequence that must be followed through for a successful transaction. If any step fails, the transaction fails. These orchestration steps reference both the building blocks and the claims providers allowed in the policy file. Any orchestration step that is responsible to show or render a user experience also has a reference to the corresponding content definition identifier.

Orchestration steps can be conditionaly ecxetuted, based on preconditions defined in the orchestration step element. For examle you can check to perform an orchestration step only if a specific claims exists, or if a claim is equal or not to the specified value. 


To specify the ordered list of orchestration steps, an **OrchestrationSteps** element is added as part of the policy. This element is required.

The **OrchestrationSteps** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OrchestrationStep | 1:n | An ordered orchestration step. | 

The **OrchestrationStep** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Order | Yes | The order of the orchestration steps. | 
| Type | Yes | The type of the orchestration step. Possible values: <ul><li>**ClaimsProviderSelection** - Indicates that the orchestration step presents various claims providers to the user to select one.</li><li>**CombinedSignInAndSignUp** - Indicates that the orchestration step presents a combined social provider sign-in and local account sign-up page.</li><li>**ClaimsExchange** - Indicates that the orchestration step exchanges claims with a claims provider.</li><li>**SendClaims** - Indicates that the orchestration step sends the claims to the relying party with a token issued by a claims issuer.</li></ul> | 
| ContentDefinitionReferenceId | No | The identifier of the [content definition](contentdefinitions.md) associated with this orchestration step. Usually the content definition reference identifier is defined in the self-asserted technical profile. But, there are some cases when Azure AD B2C needs to display something without a technical profile. There are two examples, if the type of the orchestration step is one of follwing: `ClaimsProviderSelection` or  `CombinedSignInAndSignUp`. Azure AD B2C needs to display the identity provider selection without having a technical profile. | 
| CpimIssuerTechnicalProfileReferenceId | No | The type of the orchestration step is `SendClaims`. This property defines the technical profile identifier of the claims provider that issues the token for the relying party.  If absent, no relying party token is created. |


The **OrchestrationStep** element can contain the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- | 
| Preconditions | 0:n | A list of preconditions that must be satisfied for the orchestration step to execute. | 
| ClaimsProviderSelections | 0:n | A list of claims provider selections for the orchestration step. | 
| ClaimsExchanges | 0:n | A list of claims exchanges for the orchestration step. | 

#### Preconditions

The **Preconditions** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- | 
| Precondition | 0:n | Depending on the technical profile being used, either redirects the client according to the claims provider selection or makes a server call to exchange claims. | 


##### Precondition

The **Precondition** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Type | Yes | The type of check or query to perform for this precondition. The value can be **ClaimsExist**, which specifies that the actions should be performed if the specified claims exist in the user's current claim set, or **ClaimEquals**, which specifies that the actions should be performed if the specified claim exists and its value is equal to the specified value. |
| ExecuteActionsIf | Yes | Use a true or false test to decide if the actions in the precondition should be performed. | 

The **Precondition** elements contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| Value | 1:n | A ClaimTypeReferenceId to be queried for. Another value element contains the value to be checked.</li></ul>|
| Action | 1:1 | The action that should be performed if the precondition check within an orchestration step is true. If the value of the `Action` is set to `SkipThisOrchestrationStep`, the associated `OrchestrationStep` should not be executed. | 

### Preconditions examples

The following preconditions checks whether the user's objectId exists. In the user journey, the user has selected to sign in using local account. If the objectId exists, skip this orchestration step.

```XML
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

The following preconditions checks whether the user signed in with a social account. An attempt is made to find the user account in the directory. If the user signs in or signs up with a local account skip, this orchestration step.

```XML
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

Preconditions can check multiple preconditions. The following example checks whether 'objectId' or 'email' exists. If the first condition is true, The journey skips to the next orchestration step.

```XML
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

## ClaimsProviderSelection

An orchestration step of type `ClaimsProviderSelection` or `CombinedSignInAndSignUp` may contain a list of claims providers that a user can sign in with. The order of the elements inside the `ClaimsProviderSelections` elements controls the order of the identity providers presented to the user.

The **ClaimsProviderSelection** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| ClaimsProviderSelection | 0:n | Provides the list of claims providers that can be selected.|

The **ClaimsProviderSelection** element contains the following attributes: 

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| TargetClaimsExchangeId | No | The identifier of the claims exchange, which is executed in the next orchestration step of the claims provider selection. This attribute or the ValidationClaimsExchangeId attribute must be specified, but not both. | 
| ValidationClaimsExchangeId | No | The identifier of the claims exchange, which is executed in the current orchestration step to validate the claims provider selection. This attribute or the TargetClaimsExchangeId attribute must be specified, but not both. |

### ClaimsProviderSelection example

In the following orchestration step, the user can choose to sign in with, Facebook, LinkIn, Twitter, Google, or a local account. If the user selects one of the social identity providers, the second orchestration step executes with the selected claim exchange specified in the `TargetClaimsExchangeId` attribute. The second orchestration step redirects the user to the social identity provider to complete the sign-in process. If the user chooses to sign in with the local account, Azure AD B2C stays on the same orchestration step (the same sign-up page or sign-in page) and skips the second orchestration step.

```XML
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
| ClaimsExchange | 0:n | Depending on the technical profile being used, either redirects the client according to the ClaimsProviderSelection that was selected, or makes a server call to exchange claims. | 

The **ClaimsExchange** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier of the claims exchange step. The identifier is used to reference the claims exchange from a claims provider selection step in the policy. | 
| TechnicalProfileReferenceId | Yes | The identifier of the technical profile that is to be executed. |
 
















