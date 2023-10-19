---
title: Using multi-stage reviews to meet your attestation and certification needs - Microsoft Entra
description: Learn how to use multi-stage reviews to design more efficient reviews with Microsoft Entra. 
services: active-directory
author: owinfreyATL
manager: amycolannino
editor: florianf
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 06/28/2023
ms.author: owinfrey
ms.reviewer: florianf
ms.collection: M365-identity-device-management
---
 
# Using multi-stage reviews to meet your attestation and certification needs with Microsoft Entra 

Microsoft Entra access reviews support up to three review stages, in which multiple types of reviewers engage in determining who still needs access to company resources. These reviews could be for membership in groups or teams, access to applications, assignments to privileged roles, or access package assignments. When review administrators configure the review for automatic application of decisions, at the end of the review period, access is revoked for denied users.

## Use cases for multi-stage reviews

Multi-stage access reviews allow you and your organization to enable complex workflows to meet recertification and audit requirements calling for multiple reviewers to attest to access for users in a particular sequence. It also helps you design more efficient reviews for your resource owners and auditors by reducing the number of decisions each reviewer is accountable for. This approach allows for combining otherwise disjoint, separate reviews for the same resource, to be combined in one access review.

:::image type="content" source="media/using-multi-stage-reviews/new-access-reviews.png" alt-text="Screenshot of admin experience to configure multi-stage reviews." lightbox="media/using-multi-stage-reviews/new-access-reviews.png":::

Here are some scenarios you may want to consider:

- **Reach consensus across multiple sets of reviewers:** Let two audiences of reviewers independently review access to a resource. You can configure reviews such that both stages of reviewers must agree on *Approved* without seeing each other’s decisions.
- **Assign alternate reviewers to weigh in on unreviewed decisions:** Let the resource owner attest to access to their resource first. Then, users for which no decision has been recorded go to a second stage reviewer, such as the user’s manager or an auditing team, who review the undecided requests. 
- **Reduce burden on later-stage reviewers:** Reviews can be configured such that earlier-stage-denied users won't be reviewed by later stages, allowing for later stage reviewers to see a filtered-down list. Use this scenario to filter down on users to review, stage by stage.     

## Reach consensus across multiple sets of reviewers  

Reaching quorum on the right access for users can be difficult. For resources that many users have access to, or for a diverse group of users that need to be reviewed, it's especially hard for any single reviewer to make the right choices for all reviewees. Reaching consensus by giving up to three different reviewer groups the opportunity to record decisions and by showing what the earlier reviewer audiences said helps drive consensus on who should have access to the resource. 

An example would be a review that consists of three stages that determines group membership to a group that governs access to a resource. In the review settings, the administrator chooses to not show decisions of earlier stage reviewers. This configuration allows for every review audience, for example the user’s manager, the group owner and a security officer to review access independently. The three stages are lined up with increased importance of reviewer audience weight, with decisions from the last reviewer audience potentially overwriting earlier-stage reviewer’s decisions.

The configuration for this scenario would look like this:

 | Attribute | Configuration |
 |:--- |:---:|
 |Multi-stage review|Enabled|
 |First stage reviewers|Managers of users|
 |Second stage reviewers|Group owners|
 |Third stage reviewers|Select user(s) or group(s) – “Contoso auditors group”|
 |Show previous stage(s) decisions to later stage reviewers|Enabled|
 |Reviewees going to the next stage|Select all|
 |If reviewers don’t respond|Remove access|

## Assign alternate reviewers to weigh in on unreviewed decisions 

For scenarios that you need decisions recorded and need to make sure that access is preserved for the right people, multi-stage reviews let you progress a subset of reviewees to the next stage, that potentially needs a second reviewer audience for double-checking or decision making. Use this pattern to ensure that there are fewer unreviewed users or users marked as **Don’t know**, by progressing these reviewees to another stage, and having another group of reviewers take decisions.

An example for this would be review that contains of two stages that determines access to an application. In the review settings, the review administrator chooses to **Show previous stage(s) decisions to later stage reviewers**. For **Reviewees going to the next stage**, the decisions that need confirmation would be added: to ensure all reviewees have a decision, select **reviewees marked as ‘Don’t know’** and **Not reviewed reviewees**, so that later-stage reviewers only see the undecided or unsure reviewees to retain the right access.

 | Attribute | Configuration |
 |:--- |:---:|
 |Multi-stage review|Enabled|
 |First stage reviewers|Select user(s) or group(s) – the owner(s) of the applications|
 |Second stage reviewers|Managers of users|
 |Show previous stage(s) decisions to later stage reviewers|Disabled|
 |Reviewees going to the next stage|Select **Not reviewed reviewees** and **Reviewees marked as ‘Don’t know’**|
 |If reviewers don’t respond|Approve Access|

## Reduce burden on later stage reviewers 

For reviews that may contain many reviewees, or users to be reviewed and attested, you may require all end users to self-attest before they're reviewed by a resource owner or their manager in a later stage. This model allows for filtering reviewees from stage to stage, progressing reviewees that have self-approved, only. 

Later stage reviewers, such as user’s managers, or the resource owner, only see the reduced list of reviewees – those that approved previously. The number of reviewees per stage decreases stage by stage. Only the users that have been approved through all three stages preserve access.

An example would be a review of a group that grants an IT exception, that an administrator wants to regularly review. As that exception is popular, users are asked to respond first, and only those that responded that they still need the exception, are progressed to the second stage, where their manager decides. Only if the user and the manager approve, IT owners for the exception get to see the list of users who still need and want the exception, look at a reduced list of reviewees.

 | Attribute | Configuration |
 |:--- |:---:|
 |Multi-stage review|Enabled|
 |First stage reviewers|Users review their own access|
 |Second stage reviewers|Managers of users|
 |Third stage reviewers|Group owner(s)|
 |Show previous stage(s) decisions to later stage reviewers|Disabled|
 |Reviewees going to the next stage|Select **Approved reviewees**|
 |If reviewers don’t respond|Remove Access|

:::image type="content" source="media/using-multi-stage-reviews/multi-stage-reviews.png" alt-text="Screenshot of multi-stage reviews." lightbox="media/using-multi-stage-reviews/multi-stage-reviews.png":::

## Guest user reviews

Guest user reviews help organizations that use Microsoft Entra B2B for collaboration. These guest users’ access should be reviewed regularly to check on whether these guest users have the right access still, and that collaboration is still desired, so revoking access or a cleanup of guest user accounts that are no longer needed is possible.

This scenario can be configured with multi-stage reviews similar to how the "Reduce burden on later stage reviewers" scenario works. First, ask guest users to self-review and attest their continued interest and need for collaboration, including the requirement to provide a business justification. Only self-approved guests are progressed to a later stage, where an internal employee or sponsor approves or denies continued access or collaboration.

For guest user reviews, also consider leveraging the **Inactive users (on tenant level) only** setting. This will scope the review to inactive external users that haven't signed in to the resource tenant in the number of specified days.

In scenarios for guest users, Access Reviews supports an extra configuration option: **Action to apply on denied guest users**, which can result in either:

- Remove user’s membership from the resource
- Block user from signing-in for 30 days, then remove user from the tenant

Depending on your review needs, guest users that aren’t responding to the review request, or decline further collaboration, can be removed automatically from your tenant. This results in a blocked B2B guest user account for 30 days, following an account deletion.

 | Attribute | Configuration |
 |:--- |:---:|
 |Inactive users (on tenant level) only|180 days|
 |Multi-stage review|Enabled|
 |First stage reviewers|Users review their own access|
 |Second stage reviewers|Group owner(s)|
 |Show previous stage(s) decisions to later stage reviewers|Disabled|
 |Reviewees going to the next stage|Select **Approved reviewees**|
 |If reviewers don’t respond|Remove Access|
 |Action to apply on denied guest users|Block user from signing-in for 30 days, then remove user from the tenant|

 > [!NOTE]
 > The **Action to apply on denied guest users** setting is only visible in the review creation process if the Access Review scope is configured as **Guest users only**.

## Duration of review stages  

Review administrators define the duration of every review stage and therefore, how much time reviewers in their stage have to record their decisions. Each stage can be configured to have its own duration, to cater for availability and expectation of reviewers.

:::image type="content" source="media/using-multi-stage-reviews/using-multi-stage-reviews.png" alt-text="Screenshot of using multi-stage reviews." lightbox="media/using-multi-stage-reviews/using-multi-stage-reviews.png":::

Each review stage stays open for reviewers to add decisions for the length of the duration. Review administrators can stop a running stage and automatically progress the overall review to the next review stage on the reviewer overview page, by selecting **Stop current stage**.

## Application of results 

Microsoft Entra access reviews can apply decisions about access to a resource by removing no longer needed users from the resource. Decisions are always applied at the end of the review period or when a review administrator manually ends the review. Automatic application of results is defined by the review administrator with the **Auto apply results to resource** setting or manually through the **Apply results** button in the review overview page.

Decisions are collected by reviewers for every stage. The setting **Reviewees going to the next stage** defines, which reviewees later stage reviewers will see and asked to record decisions for. Only at the end of the overall review, decisions are applied to the resource.

For all decisions, the last decision recorded for a reviewee is applied at the end of the review. Decisions that were made for Jane in the first stage of the review, can in stage two and stage three be overwritten by later-stage reviewers.

If the **Reviewees going to the next stage** setting is set such that only a subset of reviewees progress to later stages, it may be that decisions made in the first stage are applied at the end of the review. If the review administrator configured a three-stage review, and wants only **Denied** and **Not reviewed** reviewees to progress to the next stages, if Jane was approved in the first stage, she won't progress to the later stages and her **Approve** decision is recorded and at the end of the review, applied.

## Next steps
- [What are Microsoft Entra access reviews](access-reviews-overview.md)
- [Create an access review of groups and applications in Microsoft Entra ID](create-access-review.md)




 
