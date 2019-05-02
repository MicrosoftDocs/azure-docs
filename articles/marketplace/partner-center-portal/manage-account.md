---
title: How to manage a Commercial Marketplace account in Partner Center  
description: Learn how to manage a Commercial Marketplace account in Partner Center. 
author: mattwojo
manager: evansma
ms.author: parthp 
ms.service: marketplace 
ms.topic: how-to
ms.date: 05/30/2019
---

# How to manage your Commercial Marketplace account in Partner Center 

Once you've [created a Partner Center account](./create-account.md), you can manage your account and offers using the [Commercial Marketplace dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace).

In this article, we'll dive into how to manage your Partner Center account, including how to: 

- Access your account settings
- Add new or manage existing account users
- Manager user roles and permissions
- Sell subscriptions
- Manage billing and invoicing
- Create new business profiles
- Manage referrals
- Set up incentive programs
- Provide customer support


## Access your account settings

If you have not already done so, you (or your organization's administrator) should access the [account settings](https://partner.microsoft.com/dashboard/account/management) for your Partner Center account in order to:
- verify your company's account status
- confirm your Seller ID, MPN ID, Publisher ID, and contact information, including the company approver and seller contact
- set up your company’s financial details, including tax exemptions if appropriate
- create user accounts for anyone who will use your business account in Partner Center

### Open developer settings

Account settings is located at the upper right corner of your [Commercial Marketplace dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace) in Partner Center. Select the gear icon (near the upper right corner of the dashboard) and then select **Developer settings**. 

![Account settings menu in Partner Center](./media/dashboard-developer-settings.png)

Inside **Account settings**, you will be able to view your:
- **Account details**: Account type and Account status
- **Publisher IDs**: Seller ID, User ID, Publisher ID, Azure AD tenants, etc.
- **Contact info**: Publisher display name, Seller contact name, email, phone, and address
- **Financial details**: Payout account, Tax profile, and Payout hold status
- **Devices**: Any testing devices associated with your account
- **Tracking GUIDs**: Any tracking GUIDs associate with your account

### Account details

In the Account details section, you can see basic info, like your **Account type** (Company or Individual) and the **Verification status** of your account. During your account verification process, these settings will display each step required, including email verfication, employment verification, and business verification. You can also update your email here and resend the verification if needed. 

### Publisher IDs

In the Publisher IDs section, you can see your **Seller ID**, **MPN ID**, and **Publisher ID**. These values are assigned by Microsoft to uniquely identify your developer account and can't be edited.

### Contact info

In the Contact info section, you can see your **Publisher display name**, **Seller contact info** (the contact name, email, phone number, and address for the company seller), and the **Company approver** (the name, email, and phone number of the individual with authority to approve decisions for the company). 

### Financial details

In the Financial details section, you can provide or update your financial information if you publish paid apps, add-ins, or services. Sign in with your associated Microsoft Account to use pre-existing payment information. 

If you only plan to list free offers, you don't need to set up a payout account or fill out any tax forms. If you change your mind later and decide you do want to sell through Microsoft, you can set up your payout account and fill out tax forms at that time. 

#### Payout account

A payout account is the bank account to which proceeds are sent from your sales. This bank account must be located in the same country where you registered your Partner Center account.

To add a payout account, you will need to:
- **Choose a payment method**: Bank account or PayPal
- **Add payment information**: This may include choosing an account type (checking or savings), entering the account holder name, account number, and routing number, billing address, phone number, or PayPal email address. *For more information about using PayPal as your account payment method and to find out whether it is supported in your market region, see [PayPal info](https://docs.microsoft.com/windows/uwp/publish/setting-up-your-payout-account-and-tax-forms#paypal-info).

> [!IMPORTANT]
> Changing your payout account can delay your payments by up to one payment cycle. This delay occurs because we need to verify the account change, just as we do when first setting up the payout account. You'll still get paid for the full amount after your account has been verified; any payments due for the current payment cycle will be added to the next one.  

#### Tax profile

Review your current tax profile status, confirming the correct **Entity type** and **Tax Certificate Information** is displayed. Select **Edit** to update or complete any required forms.

In order to establish your tax status, you must specify your country of residence and citizenship and complete the appropriate tax forms associated with your country/region.

Regardless of your country of residence or citizenship, you must fill out United States tax forms to sell any offers through Microsoft. Partners who satisfy certain United States residency requirements must fill out an IRS W-9 form. Other partners outside the United States must fill out an IRS W-8 form. You can fill out these forms online as you complete your tax profile.

A United States Individual Taxpayer Identification Number (or ITIN) is not required to receive payments from Microsoft or to claim tax treaty benefits.

You can complete and submit your tax forms electronically in Partner Center; in most cases, you don't need to print and mail any forms.

Different countries and regions have different tax requirements. The exact amount that you must pay in taxes depends on the countries and regions where you sell your offers. Microsoft remits sales and use tax on your behalf in some countries. These countries will be identified in the process of listing your offer. In other countries, depending on where you are registered, you may need to remit sales and use tax for your sales directly to the local taxing authority. In addition, the sales proceeds you receive may be taxable as income. We strongly encourage you to contact the relevant authority for your country or region that can best help you determine the right tax info for your Microsoft sales transactions.

**Withholding rates**
The info you submit in your tax forms determines the appropriate tax withholding rate. The withholding rate applies only to sales that you make into the United States; sales made into non-US locations are not subject to withholding. The withholding rates vary, but for most developers registering outside the United States, the default rate is 30%. You have the option of reducing this rate if your country has agreed to an income tax treaty with the United States.

**Tax treaty benefits**
If you are outside the United States, you may be able to take advantage of tax treaty benefits. These benefits vary from country to country, and may allow you to reduce the amount of taxes that Microsoft withholds. You can claim tax treaty benefits by completing Part II of the W-8BEN form. We recommend that you communicate with the appropriate resources in your country or region to determine whether these benefits apply to you.

[Learn more about tax details for Windows app/game developers and Azure Marketplace publishers](https://docs.microsoft.com/windows/uwp/publish/tax-details-for-paid-apps).

#### Payout hold status

By default, Microsoft sends payments on a monthly basis. However, you have the option to put your payouts on hold, which will prevent sending payments to your account. If you choose to put your payouts on hold, we’ll continue to record any revenue that you earn and provide the details in your **Payout summary**. However, we won’t send any payments to your account until you remove the hold. 

To place your payments on hold, go to **Account settings**. Under **Financial details**, in the **Payout hold status** section, toggle the slider to **On**. You can change your payout hold status at any time, but be aware that your decision will impact the next monthly payout. For example, if you want to hold April’s payout, make sure to set your payout hold status to **On** before the end of March.

Once you have set your payout hold status to **On**, all payouts will be on hold until you toggle the slider back to **Off**. When you do so, you’ll be included during the next monthly payout cycle (provided any applicable payment thresholds have been met). For example, if you’ve had your payouts on hold, but would like to have a payout generated in June, then make sure to toggle the payout hold status to **Off** before the end of May.

> [!NOTE]
> Your **Payout hold status** selection applies to **all** revenue sources that are paid through Microsoft Partner Center, including Azure Marketplace, AppSource, Microsoft Store, advertising, etc.). You cannot select different hold statuses for each revenue source.

### Devices

The device management settings apply only to UWP publishing. [Learn more](https://docs.microsoft.com/windows/uwp/publish/manage-account-settings-and-profile#additional-settings-and-info).

### Tracking GUIDs

<!-- Need info about this -->


## Manage user accounts, define roles, permissions, groups, and applications

Partner Center leverages [Azure Active Directory](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis) (Azure AD) for multi-user account access and management. Once your Partner Center account has been associated with your organization’s Azure Active Directory, you can:

•	add, remove, and manage user accounts;
•	define the role or custom permissions that each user should have; 
•	assign a role to a group of users, or to an AAD application.

If your organization already uses Office 365 or other business services from Microsoft, you already have Azure AD. Otherwise, you can [create a new Azure AD tenant](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-access-create-new-tenant) from within Partner Center at no additional charge.

### Associate Azure AD with your Partner Center account

To associate your organization’s existing Azure AD tenant with your Partner Center account:

1. From Partner Center, select the gear icon (near the upper right corner of the dashboard) and then
select **Developer settings**. In the **Settings** menu, select **Tenants**.

2. Select **Associate Azure AD with your Partner Center account**.

3. Enter your Azure AD credentials for the tenant that you want to associate.

4. Review the organization and domain name for your Azure AD tenant. To complete the association, select **Confirm**.

5. If the association is successful, you will then be ready to add and manage account users in the **Users** section in Partner Center.

In order to create new users, or make other changes to your Azure AD, you’ll need to sign in using an account with [**global administrator permission**](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-assign-admin-roles). However, you don’t need global administrator permission in order to associate the tenant with your Partner Center account, or to add users who already exist in your organization’s tenant.


## Manage users
Account settings is located at the upper right corner of your [Commercial Marketplace dashboard](https://partner.microsoft.com/dashboard/account/usermanagement) in Partner Center. Select the gear icon (near the upper right corner of the dashboard) and then select **Developer settings**. Once Account settings is open, select **Users**. To manage users, you must **Sign in with Azure AD** using your associated credentials. (If you have not done so already, you must [associated your Azure AD credentials with your Partner Center account](#associate-azure-ad-with-your-partner-center-account).)


### Manage Azure AD tenants

**Azure AD tenant** is the term used to represent an organization within Azure Active Directory. A single Azure AD tenant can be associated with multiple Partner Center accounts. You only need to have one Azure AD tenant associated with your Partner Center account in order to add multiple account users, but you also have the option to add multiple Azure AD tenants to a single Partner Center account. 

Any user with the **Manager** role in the Partner Center account will have the option to add and remove Azure AD tenants from the account. [Learn more about roles in Partner Center]().

Note that if you remove a tenant, all users in that tenant (and their account permissions) will be removed from your Partner Center account, but no users will be removed from Azure AD. 

## Agreements

In the Agreements section, you can view a list of the publishing agreements that you've authorized.