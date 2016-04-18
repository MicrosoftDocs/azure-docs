<properties
   pageTitle="How to complete a security review | Microsoft Azure"
   description="Learn how to complete a review with the Azure Privileged Identity Management application."
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

# How to complete a security review in Azure AD Privileged Identity Management


Security administrators can review privileged access once a [security review has been started](active-directory-privileged-identity-management-how-to-start-security-review.md). Azure AD Privileged Identity Management (PIM) will automatically send an email prompting users to review their access. If a user did not get an email, you can send them the instructions in [how to perform a security review](active-directory-privileged-identity-management-how-to-perform-security-review.md).

After the security review period is over, or all the users have finished their self-review, follow the steps in this article to manage the review and see the results.

## Manage security reviews

1. Go to the [Azure portal](https://portal.azure.com/) and select the **Azure AD Privileged Identity Management** application on your dashboard.
2. Select the **Security reviews** section of the dashboard. The **Security reviews** blade will appear.
3. Select the security review that you want to manage. The security review's detail blade will appear.

Once you're on the security review's detail blade, there are three options for managing that review. You can either complete the review, export the details, or delete it.

### Complete or stop a review

If users have their access denied, you can complete the review to remove those user role assignment in the directory. The **Stop review** button will archive the review.

### Export a review

If you want to apply the results of the security review manually, you can export the review. The **Export** button will start downloading a CSV file. You can manage the results in Excel or other programs that open CSV files.

### Delete a review

> [AZURE.IMPORTANT] You will not get a warning before deletion occurs, so be sure that you want to delete that review.

If you are not interested in the review any further, delete it. The **Delete** button removes the review from the PIM application.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]
