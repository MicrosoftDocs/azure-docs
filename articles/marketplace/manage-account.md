---
title: How to manage a commercial marketplace account in Microsoft Partner Center - Azure Marketplace
description: Learn how to manage a commercial marketplace account in Microsoft Partner Center.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: varsha-sarah
ms.author: vavargh
ms.date: 09/14/2021
---

# Manage your commercial marketplace account in Partner Center

**Appropriate roles**

- Owner
- Manager

Once you've [created a Partner Center account](./create-account.md), you can use the [commercial marketplace dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace/overview) to manage your account and offers.

## Access your account settings

If you have not already done so, you (or your organization's administrator) should access the [account settings](https://partner.microsoft.com/dashboard/account/v3/organization/legalinfo#developer) for your Partner Center account.

1. Sign in to the [commercial marketplace dashboard](https://go.microsoft.com/fwlink/?linkid=2165290) in Partner Center with the account you want to access. If you’re part of multiple accounts and have signed in with a different, you can [switch accounts](switch-accounts.md).
1. In the top-right, select **Settings** (gear icon), and then select **Account settings**.

   :::image type="content" source="media/manage-accounts/settings-account.png" alt-text="Screenshot showing the Account Settings option in Partner Center.":::

1. Under **Account settings** select **Legal**. Then select the **Developer** tab to view details related to your commercial marketplace account.

   :::image type="content" source="media/manage-accounts/developer-tab.png" alt-text="Screenshot showing the Developer tab." lightbox="media/manage-accounts/developer-tab.png":::

### Account settings page

When you select **Settings** and expand **Account settings**, the default view is **Legal info**. This page can have up to three tabs, depending on the programs you have enrolled in: _Partner_, _Reseller_, and _Developer_.

The **Partner** tab, for partners enrolled in MPN, includes:

- All the legal business information such as registered legal name and address for your company
- Primary contact
- Business locations.

The **Reseller** tab, for partners doing CSP business, includes:

- Primary contact information
- Customer support profile
- Program information

The **Developer** tab, for partners enrolled in any developer program, has the following information:

- **Account details**: Account type and Account status
- **Publisher IDs**: Seller ID, User ID, Publisher ID, Azure AD tenants, and more
- **Contact info**: Publisher display name, seller contact (name, email, phone, and address) and Company approver (name, email, phone)

### Account settings - Developer tab

The following information describes the information on the Developer tab.

#### Account details

In the _Account details_ section of the _Developer_ tab, you can see basic info, such as your **Account type** (Company or Individual) and the **Verification status** of your account. During your account verification process, these settings will display each step required, including email verification, employment verification, and business verification.

#### Publisher IDs

In the Publisher IDs section, you can see your **Symantec ID** (if applicable), **Seller ID**, **User ID**, **MPN ID**, and **Azure AD tenants**. These values are assigned by Microsoft to uniquely identify your developer account and can't be edited.

If you don’t have a Symantec ID, you can select the link to request one.

### Contact info

In the _Contact info_ section, you can see your **Publisher display name**, **Seller contact info** (the contact name, email, phone number, and address for the company seller), and the **Company approver** (the name, email, and phone number of the individual with authority to approve decisions for the company).

You can also select the **Update** link to change your contact info, such as publisher display name and email address.

### Account settings identifiers

Under **Account settings** > **Organization profile**, select **Identifiers** to see the following information:

- **MPN IDs**: Any MPN IDs associated with your account
- **CSP**: MPN IDs associated with the CSP program for this account.
- **Publisher**: Seller IDs associated with your account
- **Tracking GUIDs**: Any tracking GUIDs associated with your account

#### Tracking GUIDs

Globally Unique Identifiers (GUIDs) are unique reference numbers (with 32 hexadecimal digits) that can be used for tracking your Azure usage.

To create GUIDs for tracking, you should use a GUID generator. The Azure Storage team has created a [GUID generator form](https://aka.ms/StoragePartners) that will email you a GUID of the correct format and can be reused across the different tracking systems.

We recommend that you create a unique GUID for every offer and distribution channel for each product. You can opt to use a single GUID for the product's multiple distribution channels if you do not want reporting to be split.

If you deploy a product by using a template and it is available on both Azure Marketplace and GitHub, you can create and register two distinct GUIDs:

- Product A in Azure Marketplace
- Product A on GitHub

Reporting is done by the partner value (Microsoft Partner ID) and the GUIDs. You can also track GUIDs at a more granular level aligning to each plan within your offer.

For more information, see the [Tracking Azure customer usage with GUIDs FAQ](azure-partner-customer-usage-attribution.md#faq)).

### Agreements

The **Agreements** page lets you view a list of the publishing agreements that you've authorized. These agreements are listed according to name and version number, including the date it was accepted and the name of the user that accepted the agreement.

To access the Agreements page:

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
1. In the top-right, select **Settings** > **Account settings**.
1. Under **Account settings**, select **Agreements**.

**Actions needed** may appear at the top of this page if there are agreement updates that need your attention. To accept an updated agreement, first read the linked Agreement Version, then select **Accept agreement**.

## Set up a payout profile

To have a transactable offer in Azure Marketplace, a Tax profile and Payment profile must be submitted and validated in Partner Center.  A Tax profile needs to be submitted first before a Payout profile can be created. Please be aware that a Tax profile submission can take up to 48 hours to validate.  For more information about a payout profile, see [Set up your payout account and tax forms](/partner-center/set-up-your-payout-account).

## Devices

The device management settings apply only to universal windows platform (UWP) publishing. [Learn more](/windows/uwp/publish/manage-account-settings-and-profile#additional-settings-and-info).

## Create a billing profile

If you are publishing a [Dynamics 365 for Customer Engagement & Power Apps](./partner-center-portal/create-new-customer-engagement-offer.md) or [Dynamics 365 for Operations](./partner-center-portal/create-new-operations-offer.md) offer, you need to complete your *billing profile*.

The billing address is pre-populated from your legal entity, and you can update this address later. The TAX and VAT ID fields are required for some countries and optional for others. The country/region name and company name cannot be edited.

1. Go to **Account settings**.
1. Then in the left-nav expand **Organization profile** and select **Billing profile**.

## Multi-user account management

Partner Center uses [Azure Active Directory](/azure/active-directory/fundamentals/active-directory-whatis) (Azure AD) for multi-user account access and management. Your organization's Azure AD is automatically associated with your Partner Center account as part of the enrollment process.

## Next steps

- [Add and manage users](add-manage-users.md)
