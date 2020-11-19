---
title: SubJourneys in Azure Active Directory B2C | Microsoft Docs
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


# SubJourneys

Subjourneys can be used to organize and simplify the flow of orchestration steps within a user journey. [User journeys](userjourneys.md) specify explicit paths through which a policy allows a relying party application to obtain the desired claims for a user. The user is taken through these paths to retrieve the claims that are to be presented to the relying party. In other words, user journeys define the business logic of what an end user goes through as the Azure AD B2C Identity Experience Framework processes the request. A user journey is represented as an orchestration sequence that must be followed through for a successful transaction. The [ClaimsExchange](userjourneys.md#claimsexchanges) element of an orchestration step is tied to a single [technical profile](technical-profiles-overview.md) that executes.

A subjourney is a grouping of orchestration steps that can be invoked at any point within a user journey. You can use subjourneys to create reusable step sequences or implement branching to better represent the business logic.

[!INCLUDE [b2c-public-preview-feature](../../includes/active-directory-b2c-public-preview.md)]

## User journey branching

Subjourneys behave like [user journeys](userjourneys.md), as both are represented as an orchestration sequence that must be followed through for a successful transaction. User journeys can be invoked on their own and require a SendClaims step to execute. Subjourneys are components of user journeys and cannot be invoked independently, and are always called from a user journey.

The key component of branching is to allow for better business logic processing in a user journey. Common orchestration steps are grouped into individual pieces to be invoked separately. A subjourney can simplify a journey where multiple orchestration steps are coupled together (having same preconditions). A subjourney is called only from a user journey, it shouldn't call another subjourney.

There are two types of subjourneys:

- **Call** - Returns control to the caller. The subJourney executes, and then control is returned to the  orchestration step that is currently executing within the user journey.
- **Transfer** - Transfers control to the subjourney (irreversible branching). The subjourney must have a SendClaims step to return the claims back to the relying party application.

## Example scenarios

### Call SubJourney

A Call SubJourney is useful in the following scenarios:

- Age Gating: For age gating, there are many shared components among the user journeys. Branching allows to compile the common elements into sharable components.  
- Parental Consent: Branching allows convenience in the parental consent design by allowing us to access claims from the user journey the minor executed, along with being able to branch into a parental consent user journey after finding the user requires consent. 
- Sign up to sign in: Consider a scenario where a user already exists in the directory but may have forgotten that they had in fact created an account. It may be desirable in such a case that instead of telling the user that the credentials they have entered already exists and forcing the user to restart the journey that the policy is able to perform a switch from a sign up flow to a sign in flow for that user.  

### Transfer SubJourney

A Transfer SubJourney is useful in the following scenarios:

- Showing a block page.
- A/B testing by routing the request to a SubJourney to execute and issue a token.

## Adding a SubJourney element

The following is an example of a `SubJourney` element of type `Call`, which returns control back to the user journey.

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

The following is an example of a `SubJourney` element of type `Transfer`, which returns a token back to the relying party application.

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

### Invoke a subjourney step

A new orchestration step of type `InvokeSubJourney` is used to execute a subjourney. The following is an example showing all the execution elements of this orchestration step.

```xml
<OrchestrationStep Order="5" Type="InvokeSubJourney">
  <JourneyList>
    <Candidate SubJourneyReferenceId="ConditionalAccess_Evaluation" />
  </JourneyList>
</OrchestrationStep>
```

> [!NOTE]
> A subjourney should not call another subjourney.

## Components

To define the subjourneys supported by the policy, add a **SubJourneys** element under the top-level element of the policy file.

The **SubJourneys** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| SubJourney | 1:n | A subjourney that defines all of the constructs necessary for a complete user flow. |

The **SubJourneys** element contains the following attributes:

| Attribute | Required | Description |
| --------- | -------- | ----------- |
| Id | Yes | The SubJourney identifier that can be used to by the user journey to reference the SubJourney in the policy. The **SubJourneyReferenceId** element of the [Candidate](userjourneys.md#journeylist) element points to this attribute. |
| Type | Yes | Possible values: `Call`, or `Transfer`. For more information, see [User journey branching](#user-journey-branching)|

The **SubJourney** element contains the following element:

| Element | Occurrences | Description |
| ------- | ----------- | ----------- |
| OrchestrationSteps | 1:n | An orchestration sequence that must be followed through for a successful transaction. Every user journey consists of an ordered list of orchestration steps that are executed in sequence. If any step fails, the transaction fails. |

## OrchestrationSteps

For the complete list of orchestration step elements, see [UserJourneys](userjourneys.md).

## Next steps

[UserJourneys](userjourneys.md)