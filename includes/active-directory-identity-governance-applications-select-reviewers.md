---
author: markwahl-msft
ms.service: active-directory
ms.topic: include
ms.date: 12/22/2022
ms.author: mwahl
---

When you create each access review, administrators can choose one or more reviewers. The reviewers can carry out a review by choosing users for continued access to a resource or removing them.

Typically a resource owner is responsible for performing a review. If you're creating a review of a group, as part of reviewing access for an application integrated in pattern B, then you can select the group owners as reviewers. As applications in Microsoft Entra ID don't necessarily have an owner, the option for selecting the application owner as a reviewer isn't possible.  Instead, when creating the review, you can supply the names of the application owners to be the reviewers.

You can also choose, when creating a review of a group or application, to have a [multi-stage review](../articles/active-directory/governance/create-access-review.md#create-a-multi-stage-access-review). For example, you could select to have the manager of each assigned user perform the first stage of the review, and the resource owner the second stage.  That way the resource owner can focus on the users who have already been approved by their manager.

Before creating the reviews, check that you have at least as many Microsoft Entra ID P2 licenses in your tenant as there are member users who are assigned as reviewers.  Also, check that all reviewers are active users with email addresses.  When the access reviews start, they each review an email from Microsoft Entra ID.  If the reviewer doesn't have a mailbox, they will not receive the email when the review starts or an email reminder.  And, if they are blocked from being able to sign in to Microsoft Entra ID, they will not be able to perform the review.
