<properties
   pageTitle="How to perform a security review | Microsoft Azure"
   description="Learn how to perform a review with the Azure Privileged Identity Management extension."
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

# Azure AD Privileged Identity Management: How to perform a security review

Azure Active Directory (AD) Privileged Identity Management simplifies how enterprises manage privileged identities and their access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.  

If you have been assigned to an administrative role, you may be asked by your organization's security administrator to regularly review and confirm that you still need that role for your job.

You may receive an email indicating that they should review their access.  The email will contain a link in to the Azure portal.

It is very easy to review and update your privileged access once a [review has been started](active-directory-privileged-identity-management-how-to-start-security-review.md).

## Adding the Privileged Identity Management extension

You can use the Azure AD Privileged Identity Management extension in the [Azure portal](https://portal.azure.com/) to perform your review.  If you don't have the Azure AD Privileged Identity Management extension on your portal, follow these steps to get started.

1. Sign in to the [Azure portal](https://portal.azure.com/), if you haven't already.
2. If your organization has more than one directory, click on your username in the upper right hand corner of the Azure portal, and select the directory where you will you be operating.
3. Click the **New** icon in the left navigation.
4. Select **Security + Identity** from the Create menu.
5. Select **Azure AD Privileged Identity Management**.
6. Leave **Pin to dashboard** checked and then click the **Create** button. The Privileged Identity Management extension will open.


## Confirming to approve or denying access

1. In the PIM main menu, click **Review administrative access**. A list of security reviews will appear.
2. Select the **user(s)** in the list for which you want to change access.
3. Click either  **Approve access** or **Deny access** for the users you have selected.  A notification will appear in the Azure portal main menu and the selected names in review list will disappear (you can get them back by changing the filter option).  Close the **Review Azure AD roles** blade.

NOTE: Access will not be changed until [the review completes](active-directory-privileged-identity-management-how-to-complete-review.md).  This process is simply building a checklist for those who would change the access for the role.  Once at least one user has been selected, the **Approve access** and **Deny access** buttons will be enabled.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
