---
title: Sub journeys | Microsoft Docs
description: Specify the SubJourneys element of a custom policy in Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/15/2020
ms.author: mimart
ms.subservice: B2C
---

 
# Sub journeys

Sub journeys can be used to organize and simplify the flow of orchestration steps within a user journey. A sub journey is a grouping of orchestration steps that are contained within a user journey and can be invoked at any point. You can use sub journeys to create reusable step sequences or implement branching to better represent the business logic.

[!INCLUDE [b2c-public-preview-feature](../../includes/active-directory-b2c-public-preview.md)]

## User journey branching 

[User journeys](userjourneys.md) specify explicit paths through which a policy allows a relying party application to obtain the desired claims for a user. The user is taken through these paths to retrieve the claims that are to be presented to the relying party. In other words, user journeys define the business logic of what an end user goes through as the Azure AD B2C Identity Experience Framework processes the request. A user journey is represented as an orchestration sequence that must be followed through for a successful transaction. The [ClaimsExchange](userjourneys.md#claimsexchanges) element of an orchestration step is tied to a single [technical profile](technical-profiles-overview.md) that executes.

Sub journeys behave like [user journeys](userjourneys.md), as both are represented as an orchestration sequence that must be followed through for a successful transaction. User journeys can be invoked on their own and require a SendClaims step to execute. Sub journeys are components of user journeys and cannot be invoked independently, and are always called from a user journey. 

The key component of branching is to allow for better business logic processing in a user journey. Common orchestration steps are grouped into individual pieces to be invoked separately. A sub journey can simplify a journey where multiple orchestration steps are coupled together (having same preconditions). A sub journey is called only from a user journey, it shouldn't call another sub journey.

There are two types of sub journeys:

- **Call** - Return control to the caller. Execute the sub journey and return to the current orchestration step and continue the journey from the context of the currently executing user journey
- **Transfer** - Transfer the controls to the sub journey. The sub journey must have a SendClaims step to return the claims back to the relying party application. 

## Example Scenarios

- Age Gating: For age gating, there are many shared components among the user journeys. Branching allows to compile the common elements into sharable components.  
- Parental Consent: Branching allows convenience in the parental consent design by allowing us to access claims from the user journey the minor executed, along with being able to branch into a parental consent user journey after finding the user requires consent. 
- Sign up to sign in: Consider a scenario where a user already exists in the directory but may have forgotten that they had in fact created an account. It may be desirable in such a case that instead of telling the user that the credentials they have entered already exists and forcing the user to restart the journey that the policy is able to perform a switch from a sign up flow to a sign in flow for that user.  

## Adding a sub journey 

Following is an example of a sub journey the returns the controls back to the user journey

```xml
<SubJourneys>
  <SubJourney Id="ConditionalAccess_Evaluation" Type="Call">
    <OrchestrationSteps>
      <OrchestrationStep Order="1" Type="ClaimsExchange">
       <ClaimsExchanges>
        <ClaimsExchange Id="ConditionalAccessEvaluation" TechnicalProfileReferenceId="ConditionalAccessEvaluation" />
       </ClaimsExchanges>
      </OrchestrationStep>
      <OrchestrationStep Order="2" Type="ClaimsExchange">
        <Preconditions>
          <Precondition Type="ClaimsExist" ExecuteActionsIf="false">
            <Value>conditionalAccessClaimCollection</Value>
            <Action>SkipThisOrchestrationStep</Action>
          </Precondition>
        </Preconditions>
        <ClaimsExchanges>
          <ClaimsExchange Id="GenerateCAClaimFlags" TechnicalProfileReferenceId="GenerateCAClaimFlags" />
        </ClaimsExchanges>
      </OrchestrationStep>
    </OrchestrationSteps>
  </SubJourney>
</SubJourneys>
```

Following is an example of a sub journey that returns a token back to the relying party application.

```xml
<SubJourneys>
  <SubJourney Id="B" Type="Transfer">
    <OrchestrationSteps>
      ...
      <OrchestrationStep Order="5" Type="SendClaims">
    </OrchestrationSteps>
  </SubJourney>
</SubJourneys>
```

### InvokeSubJourney Step

In order to take advantage of sub journeys, a new orchestration step `InvokeSubJourney` type is specific to the context of executing a sub journey. An example containing all execution elements of the step is as follows.

```xml
<OrchestrationStep Order="5" Type="InvokeSubJourney">
  <JourneyList>
    <Candidate SubJourneyReferenceId="ConditionalAccess_Evaluation" />
  </JourneyList>
</OrchestrationStep>
``` 

## Components

To define the sub journeys supported by the policy, a **SubJourneys** element is added under the top-level element of the policy file.

The **SubJourneys** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| SubJourney | 1:n | A sub journey that defines all of the constructs necessary for a complete user flow. |

The **SubJourneys** element contains the following attribute:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | An identifier of a sub journey that can be used to reference it from other user journey in the policy. The **SubJourneyReferenceId** element of the [Candidate](userjourneys.md#journeylist) element points to this attribute. |
| Type | Yes | Possible values: `Call`, or `Transfer`. For more information, see [User journey branching](#user-journey-branching)|

The **SubJourney** element contains the following elements:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OrchestrationSteps | 1:n | An orchestration sequence that must be followed through for a successful transaction. Every user journey consists of an ordered list of orchestration steps that are executed in sequence. If any step fails, the transaction fails. |

## OrchestrationSteps

For a complete list of orchestration step elements, see [UserJourneys](userjourneys.md).
