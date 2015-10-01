<properties
	pageTitle="Azure Active Directory B2C preview: Support | Microsoft Azure"
	description="How to file support requests for Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/24/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: How to File Support Requests for Azure Active Directory B2C

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

You can file support requests for Azure Active Directory (AD) B2C on the Azure preview portal using the following steps:

1. [Navigate to the B2C features blade on the Azure preview portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade).
2. Switch from your B2C tenant to another tenant that has an Azure subscription associated with it. Typically, the latter is your employee tenant or the default tenant created for you when you had signed up for an Azure subscription. Read [this article](active-directory-how-subscriptions-associated-directory.md#how-an-azure-subscription-is-related-to-azure-ad) to learn more about the relationship between Azure subscriptions and Azure AD directories.

    > [AZURE.IMPORTANT]
    This step is required. The process will fail if you don't do this step.

    ![Support - Switch directories](./media/active-directory-b2c-support/support-switch-dir.png)

3. After switching directories, click on **Help + support**.

    ![Support - Support](./media/active-directory-b2c-support/support-support.png)

4. Follow the steps outlined in [this article](http://blogs.msdn.com/b/mast/archive/2013/10/24/windows-azure-technical-support-for-msdn-technet-or-mpn-users-and-partners.aspx) to file a support request against Azure AD B2C. Use these details to complete the steps:

    - **Request type** is **Technical**.
	- **Resource** is **Active Directory**.
	- In the **Problem category** blade, select **B2C Preview** as the **Problem type** and the appropriate **Category**.
	- In the **Description** blade, describe your issue with details. In the **Resource** text box, provide your B2C tenant's name; for example, contosob2c.onmicrosoft.com.

5. After submitting your support request, you can monitor it by clicking on **Help + support** on the Startboard and then **Manage support requests**.

## Known Issue: Filing a Support Request in the Context of a B2C Tenant

If you missed step 2 outlined above and try to create a support request in the context of your B2C tenant, you will see the following error.

> [AZURE.IMPORTANT]
Don't attempt to sign up for a new Azure subscription in your B2C tenant.

![Support - No subscription](./media/active-directory-b2c-support/support-no-sub.png)
