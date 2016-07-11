<properties
   pageTitle="How to start an access review | Microsoft Azure"
   description="Learn how to create an access review for privileged identities with the Azure Privileged Identity Management application."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="femila"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/01/2016"
   ms.author="kgremban"/>

# How to start an access review in Azure AD Privileged Identity Management

Role assignments become "stale" when users have privileged access that they don't need anymore. In order to reduce the risk associated with these stale role assignments, privileged role administrators should regularly review the roles that users have been given. This document covers the steps for starting a security review in Azure AD Privileged Identity Management (PIM).

## Start a security review
> [AZURE.NOTE] If you haven't added the PIM application to your dashboard in the Azure portal, see the steps in  [Getting Started with Azure Privileged Identity Management](active-directory-privileged-identity-management-getting-started.md)

From the PIM application main page, there are three ways to start a security review:

- **Access reviews** > **Add**
- **Roles** > **Review** button
- Select the specific role to be reviewed from the roles list > **Review** button

When you click on the **Review** button, the **Start an access review** blade appears. On this blade, you're going to configure the review with a name and time limit, choose a role to review, and decide who will perform the review.

![Start an access review - screenshot][1]

### Configure the review

To create an access review, you need to name it and set a start and end date.

![Configure review - screenshot][2]

Make the length of the review long enough for users to complete it. If you finish before the end date, you can always stop the review early.

### Choose a role to review

Each review focuses on only one role. Unless you started the access review from a specific role blade, you'll need to choose a role now.

1. Navigate to **Review role membership**

    ![Review role membership - screenshot][3]

2. Choose one role from the list.

### Decide who will perform the review

There are two options for performing a review. You can do it yourself, approving or denying access for all users in a role. Or, you can have each user review their own access.

1. Navigate to **Select reviewers**

    ![Select reviewers - screenshot][4]

2. Choose one of the options:
    - **Me**: Useful if you want to preview how access reviews work, or you want to review on behalf of people who can't.
    - **Members review themselves**: Use this option to have the users review their own role assignments.

### Start the review

Finally, you have the option to require that users provide a reason if they approve their access. Add a description of the review if you like, and select **Start**.

Make sure you let your users know that there's an access review waiting for them, and show them [How to perform an access review](active-directory-privileged-identity-management-how-to-perform-security-review.md).

## Manage the access review

You can track the progress as the reviewers complete their reviews in the Azure AD PIM dashboard, in the access reviews section. No access rights will be changed in the directory until [the review completes](active-directory-privileged-identity-management-how-to-complete-review.md).

Until the review period is over, you can remind users to complete their review, or stop the review early from the access reviews section.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## PIM Table of Contents
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-how-to-start-security-review/PIM_start_review.png
[2]: ./media/active-directory-privileged-identity-management-how-to-start-security-review/PIM_review_configure.png
[3]: ./media/active-directory-privileged-identity-management-how-to-start-security-review/PIM_review_role.png
[4]: ./media/active-directory-privileged-identity-management-how-to-start-security-review/PIM_review_reviewers.png
