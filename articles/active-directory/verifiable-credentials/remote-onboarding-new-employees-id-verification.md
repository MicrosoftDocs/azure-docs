---
title: Onboard new remote employees using ID verification
description: A design pattern describing how to onboard new employees remotely
services: decentralized-identity
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: conceptual
ms.date: 02/23/2023
ms.author: barclayn
---


# Onboard new remote employees using ID verification

Onboarding to IT systems is a challenging step because the user being onboarded is not in the trust boundary yet. Verified IDs can help to establish trust based on identity verification by using attestations based from government-issued documents.

## When to use this pattern

1.  Customer has modern HR system with API support that allows programmatic integration to query the HR system to do a reliable matching of user profiles.

2.  Customer already has started their passwordless journey.

## Solution

1.  Custom portal for employee onboarding

2.  A backend job sends the new hire is provided a uniquely identifiable link to that portal from (A) that represents the new hire’s specific process. For this use case, the account for the new hire should already be provisioned in Azure AD. Consider using [Lifecycle Workflows](../governance/what-are-lifecycle-workflows.md)   as the triggering point of this flow.

3.  New hire clicks the link to the portal in (A) above and it is guided through a wizard-like experience:

  - Step 1: **New Hire** is redirected to acquire a verified ID from the Identity verification partner (also referred to IDV. To learn more about the identity verification partners: <https://aka.ms/verifiedidisv>)

   - Step 2: **New Hire** presents the Verified ID acquired in Step 1

   - Step 3: System receives the claims from identity verification partner, looks up the user account for the new hire and performs the validation. For considerations on how to perform the user lookup, [k]()

   - Step 4: System executes the onboarding logic to locate the Azure AD account of the user, and [generate a temporary access pass using MS Graph](https://learn.microsoft.com/graph/api/resources/temporaryaccesspassauthenticationmethod?view=graph-rest-1.0)

![High level flow diagram](media/remote-onboarding-new-employees-id-verification/high-level-flow-diagram.png

## Issues and considerations

1.  The link that is used to initiate the process needs to:

    -   Be specific to the remote employee.
    -   Be valid for a short period of time.
    -   Become invalid after the user completes the flow..
    -   Be designed with a mechanism to correlate the link to the unique identifier of the HR Record, and the Azure AD account should be defined and used to validate when the new hire comes to the site.

2.  It is not uncommon to have discrepancies between the claims in the VC and the attributes in IT systems (HR/Directory) for legitimate users. For example, an employee might have a first name “James” but his profile says “Jim”. For those scenarios:

    1.  At the beginning of the HR process, ask candidates to provide the name exactly as it appears in government issued documents when they first are       created in the HR system, and ask separately the name the user might prefer. This will simplify the validation logic

    2.  Design validation logic to include attributes that are more likely to have an exact match against the HR system. Common attributes include street address, date of birth, nationality, national identification number (if applicable), in addition to first and last name.

    3.  As a fallback, plan for human review to disambiguate lookups who result in ambiguous/non-conclusive results. This might include temporarily storing the attributes presented in the VC, phone call with the user, etc.

3.  For multinational organizations, customers might need to work with different identity proofing partners based on the region of the user.

4.  Assume that the initial interaction between the user and the onboarding partner is untrusted. The onboarding portal should generate detailed auditing on each specific request / notification generated for auditing purposes.

## Additional resources

-   Public architecture document for generalized account onboarding: [Plan your Microsoft Entra Verified ID verification solution](plan-verification-solution.md#account-onboarding)
