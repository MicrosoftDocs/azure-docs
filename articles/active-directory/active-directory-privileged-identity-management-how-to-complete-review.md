<properties
   pageTitle="How to complete a security review | Microsoft Azure"
   description="Learn how to complete a review with the Azure Privileged Identity Management extension."
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

# Azure AD Privileged Identity Management: How to complete a security review


It is very easy for administrators to review privileged access once a [security review has been started](active-directory-privileged-identity-management-how-to-start-security-review.md).  Azure AD PIM will automatically send them an email.  If a user did not get an email, you can send them the instructions in [how to perform a security review](active-directory-privileged-identity-management-how-to-perform-security-review.md).

## Managing security reviews

1. Go to the PIM dashboard, activating the security administrator role if necessary.
2. Click on the security review in the **Security reviews** list. The security review's detail blade will appear.  
3. If users have their access denied, you can complete the review which will apply the results and remove those users role assignments in the directory. If you wish to apply the results yourself manually, you can export the results.  If you are not interested in the review any further, delete it.

## Completing or stopping a review
1. Go to the PIM dashboard.
2. Click on the security review you want to complete in the **Security reviews** list. The security review's detail blade will appear.
3. Click **Stop review** to complete or stop the review.  This will archive the review and the blade will disappear.

## Exporting a review
You can export a review for use with Excel or other programs that can use CSV files.

1. Go to the PIM dashboard.
2. Click on the **Security reviews** section of the dashboard.  The **Security reviews** blade will appear.
3. Click on the security review that you want to export. The security review's detail blade will appear.
4. Click the **Export** button. A CSV file will start downloading.

## Deleting a review

> [AZURE.WARNING] You will not get a warning before deletion occurs, so be sure that you *want* to actually delete that review.

1. Go back to the PIM dashboard.
2. Click on the **Security reviews** section of the dashboard.  The **Security reviews** blade will appear.
3. Click on the security review that you want to delete. The security review's detail blade will appear.
4. Click the **Delete** button.

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
