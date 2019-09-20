---
title: Account migration from Cloud Partner Portal to Partner Center - Commercial Marketplace for Azure
description: How to migrate your account from CPP to Partner Center. - Commercial Marketplace for Azure
author: qianw211
manager: evansma
ms.author: v-qiwe
ms.service: marketplace 
ms.topic: conceptual
ms.date: 09/09/2019
---

# Account migration from Cloud Partner Portal to Partner Center

If you have an existing CPP account, your account settings need to be migrated to Partner Center.

## Account migration process

If you are a user with the Owner role in CPP for a given account, a yellow banner is shown on your Publisher Profile page. You may belong to one of the following two cases:

- Your account has already been migrated, and you are ready to manage your Account Settings in Partner Center.
- You need to take some further actions to complete your account migration to Partner Center.

### Your account has been migrated to Partner Center

For all accounts that have completed migration from the CPP to Partner Center, account management will happen in Partner Center. Changes such as user addition/deletion will be synced back to CPP.

### You have not yet migrated your account to Partner Center

Click on the banner to initiate your account migration process. You are expected to enter the following items:

1. Work email address: <br> <br> In most cases, sign in with the email address that you use to sign into CPP. In certain cases, a different email address must be used:

    * Microsoft account: If the CPP account is a Microsoft account, then you need to enter a valid work email address associated with the tenant, for whom the MPN ID is registered.

    * Tenant mismatch: If your work email address does not belong to the tenant that is associated with the Microsoft Partner Network ID present on your CPP account, then you’ll see an error. To move past this error, enter an email address associated with the tenant. An error message will provide the name of the tenant.

2. Sign up for Microsoft Partner Network program

    In the event that your CPP account does not have a Microsoft Partner Network ID, or has one that is invalid, you will have to sign up for the Microsoft Partner Network program as part of the activation process.

## Sign up for Microsoft Partner Network program

Companies who want to partner with Microsoft must join the Microsoft Partner Network (MPN) and get an MPN ID. If you’re already a member of the Microsoft Partner Network and you have an MPN ID, be sure to have it on hand as you’ll need to enter it during the account activation process.  

If you are not yet a member of the Microsoft Partner Network, you can [join now](https://signup.microsoft.com/signup?sku=StoreForBusinessIW&origin=partnerdashboard&culture=en-us&ru=https://partner.microsoft.com/dashboard/account/v3/xpu/onboard?ru=/en-us/dashboard/account/v3/enrollment/companyprofile/basicpartnernetwork/new) to get an MPN ID. Be sure to make a note of your MPN ID as you’ll need to enter it during the account activation process.

To learn more about the Microsoft Partner Network, see [Join the Microsoft Partner Network](https://partner.microsoft.com/en-US/membership) on the partner website. To learn more about how joining the Microsoft Partner Network benefits ISVs, see the [ISV Resource Hub](https://partner.microsoft.com/isv-resource-hub).  

## Move Dynamics 365-based solutions to Partner Center

If you have created Dynamics 365 for Customer Engagement or Dynamics 365 for Finance and Operations solutions in the One Commercial Partner GTM portal, **these solutions should now be managed in Partner Center**.

**If you did not move your solutions by August 31, 2019**, complete the below steps as soon as possible. Until you do so:

- ISVs won’t have access to marketing benefits
- Co-sell prioritized will lose their status
- Those requiring Cloud Embed will be out of compliance after October 15, 2019

> [!NOTE]
> If your MPN membership account was originally created in Partner Membership Center (PMC), sign in to [Partner Center](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) to confirm that your account has been migrated before completing the steps below. If you see a profile screen with your MPN ID, you're ready to proceed. If not, you must start your account migration by following the prompts in the [Partner Membership Center](https://partners.microsoft.com/partnerprogram/Welcome.aspx). If you need help with this, visit [support](https://partner.microsoft.com/support?issueid=100-0077).

1. Go to the [Commercial Marketplace overview page in Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview). If you see "Commercial Marketplace" in the left navigation pane, you are enrolled and should proceed to the next step. If not, [enroll in the commercial marketplace](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/azureisv) now.

2. Confirm your offers are in AppSource by [searching for your offers](https://appsource.microsoft.com/). If your offers are already in AppSource, proceed to the next step. For any offer not in AppSource, create a [new Dynamics 365 for Customer Engagement offer](create-new-customer-engagement-offer.md) or a [new Dynamics 365 for Operations offer](create-new-operations-offer.md).

3. Verify your enrollment in the Business Applications ISV Connect Program:
   * On the [Agreements](https://partner.microsoft.com/dashboard/account/agreements) page in Partner Center, make sure you’ve accepted the **Business Applications ISV Addendum** to enroll in the program.
   * On the [Account settings](https://partner.microsoft.com/dashboard/account/v3/accountsettings/billingprofile) page, provide your billing information.

4. Submit each new and existing offer for certification, even if your offers were previously certified. If eligible, you may request to participate in the premium tier during this process. If your offer was previously certified, **you must complete app recertification by October 15, 2019.** Certification or recertification will require that your app support the latest version of our Business Applications Platform.

5. Go to the [One Commercial Partner GTM portal](https://msgtm.azurewebsites.net/en-US/Profile/SignIn) and add your AppSource listing URL in the Marketplace Links section. If you need help with this step, email us at cosell@microsoft.com.

## Next steps

- [Manage your Commercial Marketplace account in Partner Center](./manage-account.md) 
