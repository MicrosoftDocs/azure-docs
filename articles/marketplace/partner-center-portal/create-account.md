---
title: How to create a Commercial Marketplace account in Partner Center 
description: Learn how to create a Commercial Marketplace account in Partner Center. 
author: mattwojo
manager: evansma
ms.author: parthp 
ms.service: marketplace 
ms.topic: guide
ms.date: 07/05/2019
---

# Create a Commercial Marketplace account in Partner Center

To publish your offers to [Azure Marketplace](https://azuremarketplace.microsoft.com/) or [AppSource](https://appsource.microsoft.com/), you'll need to create an account in the Commercial Marketplace program in Partner Center.

## Create a Partner Center account

In this article, we'll cover how to create a Partner Center account, including how to: 

- [Register using the Partner Center enrollment page](#to-create-a-commercial-marketplace-account-in-partner-center)
- [Sign in with a work account](#sign-in-with-a-work-account)
- [Agree to the terms and conditions](#agree-to-terms-and-conditions) 
- [Provide your publisher profile](#provide-your-publisher-profile)

>[!Important]
>If you have an account in the [Cloud Partner Portal (CPP)](https://cloudpartner.azure.com) that has been moved to Partner Center, you do not need to create a new account. See [Publishers moving from CPP](#publishers-moving-from-cpp) for more information. 

### Before you begin

To create an account on Partner Center, make sure you have:

- Authority to sign legal agreements on your company's behalf.
- Your company’s legal business name, address, and primary contact (this can be you).

We’ll verify this information during the account creation process.

### To create a Commercial Marketplace account in Partner Center

Review the information on the [**Welcome to Microsoft Partner Center**](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/azureisv) enrollment page and then register for an account.

#### Sign in with a work account

So that you can link your company's work email account domain to your new Partner Center account. By associating these accounts, your company employees can sign into Partner Center with their work account user names and passwords.

>[!Note]
>To check whether your company already has a work account, how to create a new work account, or how to set up multiple work accounts to use with Partner Center, visit [Your company work account and Partner Center](./company-work-accounts.md). 

#### Agree to terms and conditions

You'll need to agree to terms and conditions in the [Microsoft Marketplace Publisher Agreement](http://go.microsoft.com/fwlink/?LinkID=699560).

#### Provide your publisher profile

Your publisher profile includes your company name and MPN ID. If you have not yet done so, you will need to join the [Microsoft Partner Network](https://partner.microsoft.com/commercial). After you join the Microsoft Partner Network, you'll be provided with an MPN ID. 

Create a Publisher ID. Your Publisher ID uniquely identifies your company and your offers in Marketplace and AppSource. 

After you've confirmed your publisher profile information, agree to the terms and conditions and create your Partner Center account by selecting **Accept and continue**. 

>[!Important]
>*You must be authorized to act on your company's behalf in order to accept these terms.*

Thank you for creating an account on Partner Center! You'll now be taken to the [Commercial Marketplace Overview](./commercial-marketplace-overview.md) page.

### Publishers moving from CPP

If your account has been migrated from the [Cloud Partner Portal (CPP)](https://cloudpartner.azure.com), you do not need to create a new Partner Center account, but will have received a customized link to your new Partner Center account via email, and in a banner notification displayed after logging in to your existing CPP account.

Once you've enabled your new Partner Center account by visiting this customized link, you can return to your account by visiting the [Commercial Marketplace dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) in Partner Center.

The publishing agreement and company profile information will be migrated to your new Partner Center account, along with any previously set up account payout profile information, user accounts and permissions, and active offers associated with your CPP account. 

After your account information is moved from CPP to Partner Center, you'll no longer use CPP to make account updates, or manage users, permissions, and billing. For a limited time, any account updates you make in Partner Center will automatically be updated in your read-only CPP account until the CPP portal is eventually deprecated.

## Add new publishers to the Commercial Marketplace program

An organization can have multiple publishers associated with a Commercial Marketplace account. An existing user can add more Publishers after logging into Partner Center, by selecting **Account Settings** -> **Publishers** -> **Add Publisher**.

>[!Note]
>Before adding a new publisher, you can review your existing publishers by logging into Partner Center, and select **Account Settings** -> **Publishers** to see a list of existing Publishers.

Another user from the same Azure Active Directory tenant can add a new publisher by following the steps below:

1. Kick off the sign-up flow at [Microsoft Partner Center](https://partner.microsoft.com/en-us/dashboard/account/v3/enrollment/introduction/azureisv).
1. Select **Sign in with a work account** and enter your work email address.
1. Select the **Add Publisher** button.
1. Choose the MPN ID that you want to associate to the publisher.
1. Update the **publisher details** on the form. <br>

   1. **Publisher Name**: The name that will get displayed in Azure Marketplace or AppSource with the offer. <br>
   1. **PublisherID**: An identifier used by Partner Center to uniquely identify your publisher. The default for this field maps to an existing and unique `PublisherID` in the system, which cannot be reused, and therefore this field needs to be updated. <br>
   1. **Contact information**: Update the contact information when necessary.

1. After you complete the process, you can manage your newly created publisher by going to the **Commercial Marketplace** program listed in the left navigation menu. If you don't see the **Commercial Marketplace** program, refresh the page.  The new publisher will appear in the **Publishers** list.

## Next steps

- [Manage your Commercial Marketplace account in Partner Center](./manage-account.md) 
