---
title: How to create a Commercial Marketplace account in Partner Center  
description: Learn how to create a Commercial Marketplace account in Partner Center. 
author: mattwojo
manager: evansma
ms.author: parthp 
ms.service: marketplace 
ms.topic: how-to
ms.date: 05/30/2019
---

# How to create a Commercial Marketplace account in Partner Center

In order to publish offers to [Azure Marketplace](https://azuremarketplace.microsoft.com/) or [AppSource](https://appsource.microsoft.com/) via the [Commercial Marketplace portal](https://partner.microsoft.com/dashboard/commercial-marketplace/offers), you'll need to create a Partner Center account.  

In this article, we'll cover how to create a Partner Center account, including how to: 

- [Register for an account using the Partner Center enrollment page](#register-for-an-account-using-the-partner-center-enrollment-page)
- [Enter your work email address](#enter-your-work-email-address)
- [Agree to the terms and conditions](#agree-to-terms-and-conditions) 
- [Troubleshoot work email sign-in](#troubleshoot-work-email-sign-in)
- [Create a new work account](#create-a-new-work-account)

If you had an account in the [Cloud Partner Portal (CPP)](https://cloudpartner.azure.com) that has been migrated over to Partner Center, you do not need to create a new account. See [Publishers migrated from CPP](#publishers-migrated-from-cpp). 

## Prerequisites

To create an account on Partner Center, make sure you have:

- Authority to sign legal agreements on your company's behalf
- Your company’s legal business name, address, and primary contact (this can be you)

We’ll verify this information during the account creation process.

## Register for an account using the Partner Center enrollment page 

Visit the [**Welcome to Microsoft Partner Center**](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/azureisv) enrollment page and review the registration information found there.

### Enter your work email address

As part of your Partner Center enrollment, we ask that you link your company's work email account domain to your new Partner Center account. By associating these accounts, your company employees can sign in to Partner Center with their work account user names and passwords.

#### Check whether your company already has a work account

If your company has subscribed to a Microsoft cloud service such as Azure, Microsoft Intune, or Office 365, then you already have a work email account domain (also referred to as an Azure Active Directory tenant) that can be used with Partner Center.

Follow these steps to check:
1. Sign in to the Azure admin portal at https://ms.portal.azure.com.
2. Select **Azure Active Directory** from the left-navigation menu and then select **Custom domain names**.
3. If you already have a work account, your domain name will be listed.

If your company doesn’t already have a work account, you can create one during the enrollment process.

#### Consider setting up multiple work accounts

Your organization may want to set up multiple work accounts. Before deciding to use an existing work account, consider how many users in the account will need to access Partner Center. If you have users in the work account who won’t need to access Partner Center, you may want to consider creating a new account for only those users who will need to access Partner Center.

#### Create a new work account

To create a new work account for your company, follow the steps below. Note that you may need to request assistance from whoever has administrative permissions on your company's Microsoft Azure account.

1. Log in to the [Microsoft Azure portal](https://ms.portal.azure.com).
2. From the left navigation menu, select the **Azure Active Directory** -> **Users**.
3. Select **New user** and create a new Azure work account by entering a name and email address. Ensure that the **Directory role** is set to **User** and select the **Show Password** checkbox at the bottom to view and make a note of the auto-generated password.
4. Select **Create** to save the new user.

The email address for the user account must be a verified domain name in your directory. You can list all the verified domains in your directory by selecting **Azure Active Directory** -> **Custom domain names** in the left-navigation menu.

### Agree to terms and conditions

You will need to agree to two sets of terms and conditions, including the [Microsoft Online Subscription Agreement](https://go.microsoft.com/fwlink/?LinkId=870457) and the [Microsoft Marketplace Publisher Agreement](https://go.microsoft.com/fwlink/?linkid=843476).


### Provide your Publisher profile

Your publisher profile includes your company name and MPN ID. If you have not yet done so, you will need to join the [Microsoft Partner Network](https://partner.microsoft.com/commercial). By joining the Microsoft Partner Network, you will be provided with an MPN ID. 

You will also need to declare your Publisher ID at this time. Your Publisher ID will uniquely identify your company in the Azure Marketplace and AppSource. 

Once you've confirmed your publisher profile information, you can agree to the terms and conditions and create your Partner Center account by selecting **Accept and continue**. *You must be authorized to act on your company's behalf in order to accept these terms.*

You've now completed your Partner Center enrollment and will be taken to the [Commercial Marketplace Overview](./commercial-marketplace-overview.md) page.

## Troubleshoot work email sign-in

If you’re having trouble signing in to your work account, find the scenario on the diagram below that best matches your situation and follow the recommended steps. 

![Diagram for troubleshooting work account sign-in](./media/onboarding-aad-flow.png)




## Publishers migrated from CPP

If your account was migrated from the [Cloud Partner Portal (CPP)](https://cloudpartner.azure.com), you do not need to create a new Partner Center account, but will have received a customized link to your new Partner Center account via email and in a banner notification displayed after logging in to your existing CPP account.

Once you've enabled your new Partner Center account by visiting this customized link, you can return to your account by visiting the [Commercial Marketplace dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace/) in Partner Center.

The publishing agreement and company profile information will be migrated to your new Partner Center account, along with any previously set up account payout profile information, user accounts and permissions, and active offers associated with your CPP account. 

Once your account is migrated from CPP to Partner Center, the Partner Center account becomes the master account to be used for any account updates, user management, permissions, and payout management. These account updates will automatically be synced back to your read-only CPP account until the CPP portal is eventually deprecated. 

