<properties
	pageTitle="Azure AD B2C preview | Microsoft Azure"
	description="How to file support requests for Azure AD B2C"
	services="active-directory"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/11/2015"
	ms.author="swkrish"/>

# Azure AD B2C preview: How to file support requests for Azure AD B2C

You can file support requests for Azure AD B2C on the Azure Portal using the following steps:

1. [Navigate to the B2C features blade on the Azure Portal](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade-on-the-azure-portal).
2. Switch from your B2C directory to another directory that has an Azure subscription associated with it. Typically, the latter is your employee directory or the default directory created for you when you had signed up for an Azure subscription. Read [this article](active-directory-how-subscriptions-associated-directory.md#how-an-azure-subscription-is-related-to-azure-ad) to learn more about the relationship between Azure subscriptions and Azure AD directories.

    ![Support - Switch directories](../media/active-directory-b2c/support-switch-dir.png)

3. After switching directories, click on **Help + support**.

    ![Support - Support](../media/active-directory-b2c/support-support.png)

4. Follow the steps outlined in [this article](http://blogs.msdn.com/b/mast/archive/2013/10/24/windows-azure-technical-support-for-msdn-technet-or-mpn-users-and-partners.aspx) to file a support request against Azure AD B2C. Use these details to complete the steps:

    - **Request type** is **Technical**.
	- **Resource** is **Active Directory**.
	- In the **Problem category** blade, select **B2C Preview** as the **Problem type** and the appropriate **Category**.
	- In the **Description** blade, describe your issue with details. In the **Resource** text box, provide your B2C directory's name; for e.g., contosob2c.onmicrosoft.com.

5. After submitting your support request, you can monitor it by clicking on **Help + support** on the Startboard and then **Manage support requests**.

### Known issue: Filing a support request in the context of a B2C directory

If you missed step 2 outlined above and try to create a support request in the context of your B2C directory, you will see the following error.

> [AZURE.IMPORTANT]
Don't attempt to sign up for a new subscription in your B2C directory. It is currently not possible to do so.

![Support - No subscription](../media/active-directory-b2c/support-no-sub.png)
