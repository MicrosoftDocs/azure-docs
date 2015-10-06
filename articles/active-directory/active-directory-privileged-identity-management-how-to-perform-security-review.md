<properties
   pageTitle="Azure Privileged Identity Management: How To Perform a Security Review"
   description="Learn how to add roles to privileged identities with the Azure Privileged Identity Management extension."
   services="active-directory"
   documentationCenter=""
   authors="IHenkel"
   manager="stevenpo"
   editor=""/>

<tags
   ms.service="na"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="09/21/2015"
   ms.author="inhenk"/>

# Azure Privileged Identity Management: How To Perform a Security Review

## Performing Security Review
It is very easy to review privileged access once a [security review has been started](active-directory-privileged-identity-management-how-to-start-security-review.md).

## For Reviewers: Approving or Denying Access

### Me Review
1. In the PIM main menu, click **Review administrative access**. A list of security reviews will appear.
2. Select the **user(s)** in the list for which you want to change access. NOTE: Access will actually be changed.  This process is simply building a checklist for those who would change the access for the role.  Once at least one user has been selected the **Approve access** and **Deny access** buttons will be enabled.
3. Click either  **Approve access** or **Deny access** for the users you have selected.  A notification will appear in the portal main menu and the review list will disappear.  Close the **Review Azure AD roles** blade.

### Self-review
1. The user will receive an email indicating that they should review their access.  The email will contain a link for logging in to the portal.
2. Once there, the user can approve or deny their own access by clicking on the  **Approve access** or **Deny access** buttons.  Their name will disappear from the list.

## For Review Managers: Managing Security Reviews

## Completing or Stopping a Review
1. Go back to the PIM dashboard.
2. Click on the security review you want to complete in the **Security reviews** list. The security review's detail blade will appear.
3. Click **Stop review** to complete or stop the review.  This will archive the review and the blade will disappear.

## Exporting a review
You can export a review for use with Excel or other program that can use CSV files.

1. Go back to the PIM dashboard.
2. Click on the **Security reviews** section of the dashboard.  The **Security reviews** blade will appear.
3. Click on the security review that you want to export. The security review's detail blade will appear.
4. Click the **Export** button. A CSV file will start downloading.

## Deleing a Review

> AZURE.WARNING [You will not get a warning before deletion occurs, so be sure that you *want* to actually delete that review.]

1. Go back to the PIM dashboard.
2. Click on the **Security reviews** section of the dashboard.  The **Security reviews** blade will appear.
3. Click on the security review that you want to delete. The security review's detail blade will appear.
4. Click the **Delete** button.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
