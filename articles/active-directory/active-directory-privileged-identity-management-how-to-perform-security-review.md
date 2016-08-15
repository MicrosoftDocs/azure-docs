<properties
   pageTitle="How to perform an access review | Microsoft Azure"
   description="Learn how to perform a review with the Azure Privileged Identity Management application."
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

# How to perform an access review in Azure AD Privileged Identity Management

Azure Active Directory (AD) Privileged Identity Management simplifies how enterprises manage privileged identities and access to resources in Azure AD as well as other Microsoft online services like Office 365 or Microsoft Intune.  

If you have been assigned to an administrative role, you may be asked by your organization's privileged role administrator to regularly review and confirm that you still need that role for your job. You might get an email that includes a link, or you an go straight to the [Azure portal](https://portal.azure.com). Follow the steps in this article to perform a self-review of your assigned roles.

If you're a privileged role administrator interested in security reviews, get more details at [How to start a security review](active-directory-privileged-identity-management-how-to-start-security-review.md).

## Add the Privileged Identity Management application

You can use the Azure AD Privileged Identity Management (PIM) application in the [Azure portal](https://portal.azure.com/) to perform your review.  If you don't have the Azure AD Privileged Identity Management application on your portal, follow these steps to get started.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. If your organization has more than one directory, click on your username in the upper right hand corner of the Azure portal, and select the directory where you will you be operating.
3. Select **New** > **Security + Identity** > **Azure AD Privileged Identity Management**.

	![Enable PIM in the portal][1]

4. Check the **Pin to dashboard** option and then click the **Create** button. The Privileged Identity Management dashboard will open.


## Approve or deny access

When you approve or deny access, you're just telling the reviewer whether you still use this role or not. Choose **Approve** if you want to stay in the role, or **Deny** if you don't need the access anymore. Your status won't change right away, until the reviewer applies the results.
Follow these steps to find and complete the access review:

1. In the PIM application, select **Review privileged access**. If you have any pending access reviews, they appear in the Azure AD Access reviews blade.
2. Select the review you want to complete.
3. Unless you created the review, you'll appear as the only user in the review. Selectthe check mark next to your name.
4. Choose either  **Approve** or **Deny**. You may need to include a reason for your decision in the **Provide a reason** text box.  
5. Close the **Review Azure AD roles** blade.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
[AZURE.INCLUDE [active-directory-privileged-identity-management-toc](../../includes/active-directory-privileged-identity-management-toc.md)]

<!--Image references-->

[1]: ./media/active-directory-privileged-identity-management-configure/PIM_EnablePim.png
