<properties
   pageTitle="How to start a security review | Microsoft Azure"
   description="Learn how to create a security review for privileged identities with the Azure Privileged Identity Management application."
   services="active-directory"
   documentationCenter=""
   authors="kgremban"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="04/15/2016"
   ms.author="kgremban"/>

# How to start a security review in Azure AD Privileged Identity Management

Role assignments become "stale" when users have privileged access that they don't need anymore. In order to reduce the risk associated with these stale role assignments, security administrators should regularly review the roles that users have been given. This document covers the steps for starting a security review in Azure AD Privileged Identity Management (PIM).

## Start a security review
> [AZURE.NOTE] If you haven't added the PIM application to your dashboard in the Azure portal, see the steps in  [Getting Started with Azure Privileged Identity Management](active-directory-privileged-identity-management-getting-started.md)

From the PIM application main page, there are three ways to start a security review:

- **Security reviews** > **Review** > **Review** button
- **Roles** > **Review** button
- Select the role to be reviewed from the roles list > **Review** button

When you click on the **Review** button, the **Start to review a role** and the **Select a role to review** blades appear. The **Select a role to review** item selected for you.

### Select the role to review

1. Select the role from the roles list in the **Select a role to review** blade.  You can only choose one role at a time. The **Select a role to review** blade will be replaced by the **Select reviewers blade**. You have two options when selecting reviewers:
  - Me - use this option if you want to preview how security reviews work without involving other administrators.
  - Self review by role members - use this option to have the users review their own role assignments.
2. Select either of these to start working with the review details. The **Change defaults** blade will appear.

### Review by Me

If you selected the "Me" option as the reviewer, then proceed to the security review. For more information about completing the review see [Azure Privileged Identity Management: How To Perform a Security Review](active-directory-privileged-identity-management-how-to-perform-security-review.md)

### Self review by role members

If you chose to have the users review their own role assignments, follow these steps to set up the review and send out notifications.

1. Name the review by entering the review name into the **Name** field. Give the review a unique name that describes the review and that makes it easy to keep track of.
2. Enter a start date for the review in the **Start date** field.
3. Enter an end date for the review in the **End date** field.  Some things that you should think about when setting the end date for the review are:
  - How many people are being reviewed?
  - How quickly will the users be able to add the PIM application on the Azure portal and complete the review?
4. Click the **OK** button in the **Change defaults** blade. It will close.
5. Click the **OK** button in the **Start a review of a role** blade.  It will close. A notification will appear in the Azure portal main menu. Refresh the dashboard by clicking the **Refresh** button and the security review will appear in the **Security reviews** section.
6. Notify the individuals in the role that they will need to add the PIM application and then [review their own administrative access](active-directory-privileged-identity-management-how-to-perform-security-review.md).  

## Manage the security review

You can track the progress as the reviewers complete their reviews in the Azure AD PIM dashboard, in the security reviews section. No access rights will be changed in the directory until [the review completes](active-directory-privileged-identity-management-how-to-complete-review.md).


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## PIM Table of Contents
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
