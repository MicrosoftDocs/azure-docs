---
title: Account migration from Cloud Partner Portal to Partner Center - Commercial Marketplace for Azure
description: How to migrate your account from CPP to Partner Center. - Commercial Marketplace for Azure
author: ChJenk
manager: evansma
ms.author: v-qiwe
ms.service: marketplace 
ms.topic: conceptual
ms.date: 09/09/2019
---

# Account migration from Cloud Partner Portal to Partner Center

If you have an existing Cloud Partner Portal (CPP) account, your account settings need to be migrated to Partner Center.

## Account migration process

If you are a user with the Owner role in CPP for a given account, a yellow banner is shown on your Publisher Profile page. You may belong to one of the following two cases:

- Your account has already been migrated, and you are ready to manage your Account Settings in Partner Center.
- You need to take further actions to complete your account migration to Partner Center.

### Your account has been migrated to Partner Center

For all accounts that have completed migration from the CPP to Partner Center, account management will happen in Partner Center. Changes such as user addition/deletion will be synced back to CPP.

### You have not yet migrated your account to Partner Center

Click on the banner to initiate your account migration process. You are expected to enter the following items:

1. Work email address: <br> <br> In most cases, sign in with the email address that you use to sign into CPP. In certain cases, a different email address must be used:

    * Microsoft account: If the CPP account is a Microsoft account, enter a valid work email associated with the tenant for whom the Microsoft Partner Network (MPN) ID is registered. For more information, see [Sign up for Microsoft Partner Network Program](#sign-up-for-microsoft-partner-network-program).

    * Tenant mismatch: If your work email address does not belong to the tenant that's associated with the Microsoft Partner Network ID present on your CPP account, then you’ll see an error. To move past this error, enter an email address associated with the tenant. An error message will provide the name of the tenant.

2. Sign up for Microsoft Partner Network program

    If your CPP account doesn't have a Microsoft Partner Network ID or has one that's invalid, you'll need to sign up for the Microsoft Partner Network program as part of the activation process.

## Sign up for Microsoft Partner Network program

Companies that want to partner with Microsoft must join the Microsoft Partner Network (MPN) and get an MPN ID. If you’re already a member of the Microsoft Partner Network and have an MPN ID, keep the information handy as you’ll need it during the account activation process.  

If you're not a member of the Microsoft Partner Network, you can [join here](https://signup.microsoft.com/signup?sku=StoreForBusinessIW&origin=partnerdashboard&culture=en-us&ru=https://partner.microsoft.com/dashboard/account/v3/xpu/onboard?ru=/en-us/dashboard/account/v3/enrollment/companyprofile/basicpartnernetwork/new) to get an MPN ID. Make a note of your MPN ID as you’ll need to enter it during the account activation process.

To learn more about the Microsoft Partner Network, see [Join the Microsoft Partner Network](https://partner.microsoft.com/en-US/membership) on the partner website. To learn more about ISV benefits in the Microsoft Partner Network, see the [ISV Resource Hub](https://partner.microsoft.com/isv-resource-hub).  

## Move Dynamics 365-based solutions to Partner Center

To streamline account and offer management for Dynamics 365 Customer Engagement and Dynamics 365 Operations, the offers have been moved to [Partner Center](https://partner.microsoft.com/). The move ensures the same content is available to both public and seller catalogs.

For specific information on what needs to be done and by when for your Dynamics 365-based solutions, follow the instructions that apply to you:

- If you have published offers for Dynamics 365 Customer Engagement or Dynamics 365 Operations and need to move them to Partner Center, see [Move published offers](#move-published-offers).
- If you have draft offers for Dynamics 365 Customer Engagement or Dynamics 365 Operations already migrated to Partner Center, see [Activate draft offers](#activate-draft-offers).
- If your Partner Center account was not detected and you need to create a new offer for Dynamics 365 Customer Engagement or Dynamics 365 Operations in Partner Center, see [Create new offer](#create-new-offer).

### Move published offers

Use this section if you have published offers for Dynamics 365 Customer Engagement or Dynamics 365 Operations and need to move them to Partner Center.

If you have created Dynamics 365 Customer Engagement or Dynamics 365 Operations solutions in the One Commercial Partner GTM portal, **these offers should now be managed in Partner Center**.

**If you did not move your solutions by August 31, 2019**, complete the steps below as soon as possible. Until you do so:

- ISVs won’t have access to marketing benefits.
- Co-sell prioritized will lose their status.
- Those requiring Cloud Embed will be out of compliance after October 15, 2019.

> [!NOTE]
> If your MPN membership account was originally created in Partner Membership Center (PMC), sign in to [Partner Center](https://partner.microsoft.com/pcv/accountsettings/connectedpartnerprofile) to confirm that your account has been migrated before completing the steps below. If you see a profile screen with your MPN ID, you're ready to proceed. If not, you must start your account migration by following the prompts in the [Partner Membership Center](https://partners.microsoft.com/partnerprogram/Welcome.aspx). If you need help with this, visit [support](https://partner.microsoft.com/support?issueid=100-0077).

1. Go to the [Commercial Marketplace overview page in Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview). If you see "Commercial Marketplace" in the left navigation pane, you are enrolled and should proceed to the next step. If not, [enroll in the commercial marketplace](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/azureisv) now.

2. Confirm your offers are in AppSource by [searching for your offers](https://appsource.microsoft.com/). If your offers are already in AppSource, proceed to the next step. For any offer not in AppSource, create a [new Dynamics 365 for Customer Engagement offer](create-new-customer-engagement-offer.md) or a [new Dynamics 365 for Operations offer](create-new-operations-offer.md).

3. Verify your enrollment in the Business Applications ISV Connect Program:
   * On the [Agreements](https://partner.microsoft.com/dashboard/account/agreements) page in Partner Center, make sure you’ve accepted the **Business Applications ISV Addendum** to enroll in the program.
   * On the [Account settings](https://partner.microsoft.com/dashboard/account/v3/accountsettings/billingprofile) page, provide your billing information.

4. Submit each new and existing offer for certification, even if your offers were previously certified. If eligible, you may request to participate in the premium tier during this process. If your offer was previously certified, **you must complete app recertification by October 15, 2019.** Certification or recertification requires that your app supports the latest version of our Business Applications Platform.

5. Go to the [One Commercial Partner GTM portal](https://msgtm.azurewebsites.net/en-US/Profile/SignIn) and add your AppSource listing URL in the Marketplace Links section. If you need help with this step, email us at cosell@microsoft.com.

### Activate draft offers

Use this section if you have draft offers for Dynamics 365 Customer Engagement or Dynamics 365 Operations already migrated to Partner Center.

You'll need to activate your draft offers in Partner Center to keep them available in our seller catalog and to enable them in our public catalog.

>[!NOTE]
>Publish each of your draft offers in Partner Center before **October 15, 2019** to make them available and avoid their removal from our seller catalog.

For your convenience, we’ve created a draft of each offer based on content you previously provided. If the draft offer is not correct, we may have mis-categorized your offer type. In this case, [contact Microsoft Support](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=faff63bb-29e7-f13c-5876-4270797225ce) to prevent the automatic removal of the offer from the seller catalog.

If the draft offer is correct, complete the following steps **by October 15, 2019** to publish the offer.

>[!IMPORTANT]
> These steps may take more than one week to complete.

1. To access your draft offer, sign in to [Partner Center](https://partner.microsoft.com/dashboard/commercial-marketplace/overview). You must have **Manager** (owner) credentials for the MPN account associated with the offer being migrated.
2. On the [Agreements page](https://partner.microsoft.com/dashboard/account/agreements) for Partner Center, review and accept the Business Applications ISV Addendum.
3. Make sure your billing information is correct and complete in [Account Settings](https://partner.microsoft.com/dashboard/account/accountsettings/billingprofile).
4. Return to [Overview](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) and check that the **offer type** in draft status is **Dynamics 365 Customer Engagement** or **Dynamics 365 Operations**. If the offer type is incorrect, [contact Microsoft Support](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=faff63bb-29e7-f13c-5876-4270797225ce).
5. Before publishing the draft offer, confirm your offers are not already in AppSource by [searching for your offers](https://appsource.microsoft.com/).
    >[!NOTE]
    >If your offer was found in AppSource, it may be a duplicate offer that can be deleted. However, before deleting the draft offer, sign in to Partner Center and access the alternate offer to ensure that it contains co-selling collateral, contact information, and the same market coverage as this draft offer. Also, if you sell through multiple legal entities (e.g., Contoso Inc in USA and Contoso Ltd in Europe), you may want to have multiple offers for different legal entities in AppSource.

6. If your offer is not in AppSource, select the draft offer from [Overview](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) and complete the offer information pages.
7. Select **Submit**.
    >[IMPORTANT]
    >These steps must be completed by **October 15, 2019** to avoid any interruption to your offer.

Once your app is approved, you'll receive an email that will direct you to return to the offer and select **Go live**, which will enable the offer on AppSource.

### Create new offer

Use this section if your Partner Center account was not detected and you need to create a new offer for Dynamics 365 Customer Engagement or Dynamics 365 Operations.

We could not associate your Dynamics 365 Customer Engagement or Dynamics 365 Operations offer with an enrolled Partner Center account and were unable to migrate your offer. To make your offer available in Partner Center, see [Create a new Dynamics 365 for Customer Engagement & PowerApps offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-customer-engagement-offer) or [Create a new Dynamics 365 Operations offer](https://docs.microsoft.com/en-us/azure/marketplace/partner-center-portal/create-new-operations-offer).

>[!NOTE]
>The draft offer will be removed from our seller catalog **October 15, 2019.**

## Additional Resources

Join the weekly [Dynamics ISV community call](https://aka.ms/DynamicsISV-CommunityCall) for support and updates.

If you need help publishing, certifying, or managing your marketplace offers, [submit a support ticket](https://aka.ms/MarketplacePublisherSupport). For reporting the wrong offer type or migrated-in-error only, use [Microsoft Support](https://aka.ms/migrationoffertype) to contact us.

## Next steps

- [Manage your Commercial Marketplace account in Partner Center](./manage-account.md) 
