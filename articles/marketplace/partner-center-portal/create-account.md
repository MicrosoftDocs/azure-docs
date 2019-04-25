---
title: How to create a Commercial Marketplace account in Partner Center  
description: Learn how to create a Commercial Marketplace account in Partner Center. 
author: mattwoj 
manager: evansma
ms.author: parthp 
ms.service: marketplace 
ms.topic: how-to
ms.date: 05/30/2019
---

# How to create a Commercial Marketplace account in Partner Center

In order to publish offers to Azure Marketplace or AppSource, you'll need to create a Partner Center account.  

In this article, we'll cover how to create a Partner Center account, including how to: 

- Set up your account profile
- Link your company's work account 
- Review account guidelines, terms, and conditions 
- Add payment information 
- Add tax information

## Before you begin

To create an account on Partner Center, you’ll need to have on hand the following information. You may want to take a few minutes to gather these items before you get started:

-   Global administrator work email. If you're not sure what your company's work account is, see [Your company work account and Partner Center](azure-active-directory-tenants-and-partner-center.md).

    If your company doesn’t have a work account, you can create one during the account creation process. 

-   Your company’s legal business name, address, and primary contact. We need this information to confirm that your company has an established profile and that you are authorized to act on its behalf. 

-   Authority to sign legal agreements. Ensure that you are authorized to sign legal agreements on your company's behalf as you’ll be asked to do so during the enrollment process.

-   Name and company email of the person you want to act as your primary contact. To help ensure your company’s security and privacy, we’ll email your primary contact to verify that (1) he or she signed up for a Partner Center account, and that (2) this email address belongs to your company. After the primary contact verifies his or her email address, we’ll continue our review of the information you provided.

We’ll verify this information during the account creation process.

## Create a Partner Center account

1.	Review the information on the **Welcome** page and then select **Next**.

2.	Sign in as a global admin to your company's work account. If you're not sure what your company's work account is, see [Your company work account and Partner Center](azure-active-directory-tenants-and-partner-center.md).

    Select **Sign in** if you know your company has a work email account. On the next page, enter global admin credentials for your company's work account. 

    If your company doesn’t have a work account, select **Create one** to set one up now. After creating a work account, sign in using the global admin credentials for the work account you just created.

3.	Provide or update your company’s legal business profile and primary contact information and then select **Enroll now**. 

    The primary contact should be the person in your company we can contact about your application (this can be you or another person in your company). We'll also use this information to verify that this person works at your company and has signed up for a Partner Center account.

    > [!IMPORTANT]  
    > To help ensure your company’s security and privacy, we’ll email your primary contact to verify that (1) he or she signed up for a Partner Center account, and (2) that this email address belongs to your company. After the primary contact verifies his or her email address, we’ll continue our review of the information you provided.

4.	Read and accept the terms and conditions in the [Microsoft Partner Network agreement](https://support.microsoft.com/en-us/help/4488914/how-to-download-the-microsoft-partner-network-mpn-agreement-partner-ce). 

5. Provide a publisher display name that you want the partners to identify you with.  

6. Read and accept the terms and conditions in the [Microsoft Marketplace Publisher Agreement](https://cloudpartner.azure.com/Content/Unversioned/PublisherAgreement2.pdf). 

## Link your company's work account

Your Partner Center account must be linked with your company's Azure work account so that your users can sign-in with their work account username and password.

An Azure work account is a dedicated and isolated virtual representation of your company in the Azure public cloud, created by an organization's administrator (this may or may not be you) when subscribing to a Microsoft cloud service such as Azure, Microsoft Intune, or Office 365.

Your work account enables you to access Microsoft cloud services, such as Microsoft Azure, Microsoft Intune, or Office 365. Your work account also hosts your Azure AD users and information about them, including passwords, profile data, permissions, and so on. The work account also contains groups, applications, and other information pertaining to a company and its security.

A work account can take the form of a user’s work email address, such as username@orgname.com, when an organization synchronizes its Active Directory accounts with Azure Active Directory.

### Use an existing work account

If you’re not sure whether your company has a work account, follow these steps to check. Note that if you have an active subscription to Microsoft Azure or Office 365, you already have a work account.

1.	Sign in to the Azure admin portal at [https://ms.portal.azure.com](https://ms.portal.azure.com)
2.	Select **Azure Active Directory** from the menu and then select **Domain Names**
3.	If you already have a work account, your domain name will be listed

Before you decide to use an existing work account, think about how many users in the account will need to work in the Partner Center. If you have users in the account who won’t need to work in Partner Center, consider creating a new account for only those users who will need to work in the Partner Center.

If you want to use an existing work account, but you’re having trouble signing in, find the scenario on the diagram below that best matches your situation and follow the recommended steps. 

![Diagram for troubleshooting work account sign-in](./media/onboarding-aad-flow.png)

For more information about adding domains in Azure AD, see [Add or associate a domain in Azure AD](https://docs.microsoft.com/azure/active-directory/active-directory-add-domain).

### Create a new work account

If your company doesn’t already have a work account, you can create one during the enrollment process. You may need to request assistance from whoever has administrative permissions on your Microsoft Azure account.

- Log in to the [Microsoft Azure portal](https://portal.azure.com/)
- From the left navigation menu, select the **Azure Active Directory** -> **Users and groups** -> **All users** 
- Select **New user** and create a new Azure work account by entering a name and email address. Ensure that the **Directory role** is set to **User** and select the **Show Password** checkbox at the bottom to view and make a note of the auto-generated password. - Select **Create** to save the new user

The email address for the user account must be a verified domain name in your directory. You can list all the verified domains in your directory using the **Azure Active Directory** -> **Domain names**.

