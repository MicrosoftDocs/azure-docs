<properties
   pageTitle="How to start a security review | Microsoft Azure"
   description="Learn how to create a security review for privileged identities with the Azure Privileged Identity Management extension."
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
   ms.date="03/17/2016"
   ms.author="kgremban"/>

# Azure AD Privileged Identity Management: How to start a security review

## Starting a security review
Eventually, you will be able to perform security reviews in other places in the Azure portal.  This document covers the steps for starting a security review within the **Privileged Identity Management (PIM)** interface.

Perhaps there are users that you don't recognize, or perhaps a user has changed jobs or projects and no longer requires privileged access in their new position.  In order to reduce the risk associated with these "stale" role assignments, you and others administrators can review the roles that users have been given by starting a security review.

## Paths to start a security review
> [AZURE.NOTE] If you have not created a PIM dashboard in the Azure portal yet, see the steps in  [Getting Started with Azure Privileged Identity Management](active-directory-privileged-identity-management-getting-started.md)

From the Azure PIM dashboard you can start a view by following any of these paths:

- Dashboard > Security reviews > Review > Review button
- Dashboard > Roles > Review button
- Dashboard > Click on role to be reviewed in roles list > Review button

## Start a security review

When you click on the **Review** button, the **Start to review a role** and the **Select a role to review** blades will appear, and the **Select a role to review** item will be selected.

### Select the role to review

1. Select the role from the roles list in the **Select a role to review** blade.  You can only choose one role at a time.  The **Select a role to review** blade will be replaced by the **Select reviewers blade**.  You have two options when selecting reviewers:
  - Me - use this feature if you would like to preview how security reviews work without involving other administrators.
  - Self review by role members - use this feature to have the users review their own role assignments.
2. Select either of these to start working with the review details. The **Change defaults** blade will appear.

### Review by Self

1. Name the review by entering the review name into the **Name** field.  It is recommended that you give the review a unique name that describes the review and that makes it easy to keep track of.
2. Enter a start date for the review in the **Start date** field.
3. Enter an end date for the review in the **End date** field.  Some things that you should think about when setting the end date for the review are:
  - How many people are being reviewed?
  - How quickly will the users be able to add the extension and complete the review?
4. Click the **OK** button in the **Change defaults** blade. It will close.
5. Click the **OK** button in the **Start a review of a role** blade.  It will close. A notification will appear in the Azure portal main menu. Refresh the dashboard by clicking the **Refresh** button and the security review will appear in the **Security reviews** section.
6. Notify the individuals in the role that they will need to add the extension and then [review their own administrative access](active-directory-privileged-identity-management-how-to-perform-security-review.md).  

### Review by Me

If you selected the "Me" option as the reviewer, then proceed to the security review. For more information about completing the review see [Azure Privileged Identity Management: How To Perform a Security Review](active-directory-privileged-identity-management-how-to-perform-security-review.md)

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## PIM Table of Contents
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
