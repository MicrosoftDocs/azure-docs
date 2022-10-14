---
title: Manage your Microsoft 365 App Store account in Partner Center
description: After you create a Partner Center account, you can manage your account and offers using the Partner Center dashboard.
localization_priority: medium
ms.author: siraghav
ms.topic: article
ms.date: 09/27/2021
---

# Manage your Microsoft 365 App Store account in Partner Center

After you [create a Partner Center account](./open-a-developer-account.md), you can manage your account and offers using the [Partner Center dashboard](https://partner.microsoft.com/dashboard/overview). In this article, we'll describe how to manage your Partner Center account.

## Access your account settings

If you have not already done so, you (or your organization's administrator) should access the [account settings](https://partner.microsoft.com/dashboard/account/v3/organization/legalinfo#mpn) for your Partner Center account in order to:
- Check your company's account verification status
- Confirm your Seller ID and contact information, including the company approver and seller contact
- Set up your company’s financial details, including tax exemptions if appropriate
- Create user accounts for anyone who will use your business account in Partner Center

To access your account settings in Partner Center, select the gear icon (near the upper right corner of the dashboard) and then select **Account settings**.

On the **Account settings** page, you can view your:

- Account details, include account type and account status
- Publisher IDs, including Seller ID, User ID, and Azure AD tenants
- Contact info, including Publisher display name, Seller contact name, email, phone, and address
- Financial details, including payout account, tax profile, and payout hold status

### Account details

In the Account details section, you can see basic info, like your **Account type** (Company or Individual) and the **Account status** of your account. During the account verification process, these settings will display each step required, including email verification, employment verification, and business verification.

### Publisher IDs

In the Publisher IDs section, you can see your **Seller ID** and **User ID**. These values are assigned by Microsoft to uniquely identify your developer account and can't be edited.

### Contact info

In the Contact info section, you can see your **Publisher display name**, **Seller contact info** (the contact name, email, phone number, and address for the company seller), and the **Company approver** (the name, email, and phone number of the individual with authority to approve decisions for the company).

### Financial details

In the Financial details section, you can provide or update your financial information if you publish apps or services which require payment.

If you only plan to list free offers, you don't need to set up a payout account or fill out any tax forms. If you change your mind later, and decide you do want to sell through Microsoft, you can set up your payout account and fill out tax forms at that time.

#### Payout account

A payout account is the bank account to which proceeds are sent from your sales. This bank account must be in the same country where you registered your Partner Center account.

To setup your payout account, you need to **associate your Microsoft account**:
1. In **Account settings**, under the **Financial details** section, select **Associate your Microsoft account**. 
1. When prompted, sign in with your Microsoft account. This account cannot already be associated with another Partner Center account.
1. To complete the setup of your payout account, sign out of Partner Center, then sign back in with your Microsoft account (instead of your work account).

Now that your Microsoft account is associated, to add a payout account, you will need to:
- **Choose a payment method** - Bank account or PayPal
- **Add payment information** - This includes choosing an account type (checking or savings), entering the account holder name, account number, and routing number, billing address, phone number, or PayPal email address. For more information about using PayPal as your account payment method and to find out whether it is supported in your market region, see [PayPal info](/windows/uwp/publish/setting-up-your-payout-account-and-tax-forms#paypal-info).

> [!IMPORTANT]
> Changing your payout account can delay your payments by up to one payment cycle. This delay occurs because we need to verify the account change, just as we do when first setting up the payout account. You'll still get paid for the full amount after your account has been verified; any payments due for the current payment cycle will be added to the next one.  

#### Tax profile

Review your current tax profile status, confirming the correct **Entity type** and **Tax Certificate Information** is displayed. Select **Edit** to update or complete any required forms.

In order to establish your tax status, you must specify your country of residence and citizenship and complete the appropriate tax forms associated with your country/region.

Regardless of your country of residence or citizenship, you must fill out United States tax forms to sell any offers through Microsoft. Partners who satisfy certain United States residency requirements must fill out an IRS W-9 form. Other partners outside the United States must fill out an IRS W-8 form. You can fill out these forms online as you complete your tax profile.

A United States Individual Taxpayer Identification Number (or ITIN) is not required to receive payments from Microsoft or to claim tax treaty benefits.

You can complete and submit your tax forms electronically in Partner Center; in most cases, you don't need to print and mail any forms.

Different countries and regions have different tax requirements. The exact amount that you must pay in taxes depends on the countries and regions where you sell your offers. Microsoft remits sales and use tax on your behalf in some countries. These countries will be identified in the process of listing your offer. In other countries, depending on where you are registered, you may need to remit sales and use tax for your sales directly to the local taxing authority. In addition, the sales proceeds you receive may be taxable as income. We strongly encourage you to contact the relevant authority for your country or region that can best help you determine the right tax info for your Microsoft sales transactions.

##### Withholding rates

The info you submit in your tax forms determines the appropriate tax withholding rate. The withholding rate applies only to sales that you make into the United States; sales made into non-US locations are not subject to withholding. The withholding rates vary, but for most developers registering outside the United States, the default rate is 30%. You have the option of reducing this rate if your country has agreed to an income tax treaty with the United States.

##### Tax treaty benefits

If you are outside the United States, you may be able to take advantage of tax treaty benefits. These benefits vary from country to country, and may allow you to reduce the amount of taxes that Microsoft withholds. You can claim tax treaty benefits by completing Part II of the W-8BEN form. We recommend that you communicate with the appropriate resources in your country or region to determine whether these benefits apply to you.

#### Payout hold status

By default, Microsoft sends payments on a monthly basis. However, you have the option to put your payouts on hold, which will prevent sending payments to your account. If you choose to put your payouts on hold, we’ll continue to record any revenue that you earn and provide the details in your **Payout summary**. However, we won’t send any payments to your account until you remove the hold. 

To place your payments on hold, go to **Account settings**. Under **Financial details**, in the **Payout hold status** section, toggle the slider to **On**. You can change your payout hold status at any time, but be aware that your decision will impact the next monthly payout. For example, if you want to hold April’s payout, make sure to set your payout hold status to **On** before the end of March.

After you set your payout hold status to **On**, all payouts will be on hold until you toggle the slider back to **Off**. When you do so, you’ll be included during the next monthly payout cycle (provided any applicable payment thresholds have been met). For example, if you’ve had your payouts on hold, but would like to have a payout generated in June, then make sure to toggle the payout hold status to **Off** before the end of May.

> [!NOTE]
> Your **Payout hold status** selection applies to **all** revenue sources that are paid through Partner Center. You cannot select different hold statuses for each revenue source.

## Multi-user account management

Partner Center uses [Azure Active Directory](../active-directory/fundamentals/active-directory-whatis.md) (Azure AD) for multi-user account access and management. Your organization's Azure AD is automatically associated with your Partner Center account as part of the enrollment process. 

## Manage users

In the **Users** section of Partner Center (under **Account Settings**) you can use Azure AD to manage the users, groups, and Azure AD applications that have access to your Partner Center account. In order to manage users, you must be signed in with your work account (the associated Azure AD tenant). To manage users within a different work account/tenant, you will need to sign out and then sign back in as a user with **Manager** permissions on that work account/tenant. 

Keep in mind that all Partner Center users (including groups and Azure AD applications) must have an active work account in an [Azure AD tenant](#manage-tenants) that is associated with your Partner Center account. 

### Add or remove users

Your account must have [Manager-level](#define-user-roles-and-permissions) permissions for the work account (Azure AD tenant) in which you want to add or edit users.

#### Add existing users

To add users to your Partner Center account that already exist in your company's work account (Azure AD tenant):

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. Select **User management**, and then on the **Users** tab, select **+ Add user**.
1. Select one or more users from the list that appears. You can use the search box to search for specific users.
*If you select more than one user to add to your Partner Center account, you must assign them the same role or set of custom permissions. To add multiple users with different roles/permissions, repeat these steps for each role or set of custom permissions.
1. When you're finished choosing users, click **Add selected**.
1. In the **Roles** section, specify the role(s) or customized permissions for the selected user(s).
1. Select **Save**.

#### Create new users

To create new user accounts, you must have an account with [**Global administrator**](/azure/active-directory/users-groups-roles/directory-assign-admin-roles) permissions.

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. Select **User management**, and then on the **Users** tab, select **Create new user**.
1. Enter a first name, last name, and username for each new user.
1. If you want the new user to have a global administrator account in your organization's directory, check the box labeled **Make this user a Global administrator in your Azure AD, with full control over all directory resources**. This will give the user full access to all administrative features in your company's Azure AD. They'll be able to add and manage users in your organization's work account (Azure AD tenant), though not in Partner Center, unless you grant the account the appropriate role/permissions. 
1. If you checked the box to **Make this user a Global administrator**, you'll need to provide a **Password recovery email** for the user to recover their password if necessary.
1. In the **Group membership** section, select any groups to which you want the new user to belong.
1. In the **Roles** section, specify the role(s) or customized permissions for the user.
1. Select **Save**.

Creating a new user in Partner Center will also create an account for that user in the work account (Azure AD tenant) to which you are signed in. Making changes to a user's name in Partner Center will make the same changes in your organization's work account (Azure AD tenant).

#### Invite new users by email

To invite users that are not currently a part of your company work account (Azure AD tenant) via email, you must have an account with [Global administrator](/azure/active-directory/users-groups-roles/directory-assign-admin-roles) permissions. 

1. In the menu bar, select **Settings** (gear icon) > **Account settings**.
1. Select **User management**, and then on the **Users** tab, select **Invite users**.
1. Enter one or more email addresses (up to ten), separated by commas or semicolons.
1. In the list that appears, specify the role(s) or customized permissions for the user.
1. Select **Add**.

The users you invited will get an email invitation to join your Partner Center account. A new guest-user account will be created in your work account (Azure AD tenant). Each user will need to accept their invitation before they can access your account.

If you need to resend an invitation, visit the **Users** page, find the invitation in the list of users, select their email address (or the text that says *Invitation pending*). Then, at the bottom of the page, select **Resend invitation**.

> [!NOTE]
> If your organization uses [directory integration](/previous-versions/azure/azure-services/jj573653(v=azure.100)) to sync the on-premises directory service with your Azure AD, you won't be able to create new users, groups, or Azure AD applications in Partner Center. You (or another admin in your on-premises directory) will need to create them directly in the on-premises directory before you'll be able to see and add them in Partner Center.

#### Remove a user

To remove a user from your work account (Azure AD tenant), go to **User management** (under **Account settings**), for the user you want to remove, select **Delete**. A pop-up window will appear for you to confirm that you want to remove the selected user.

> [!NOTE]
> You can only remove the users that you have added.

#### Change a user password

If one of your users needs to change their password, they can do so themselves if you provided a **Password recovery email** when creating the user account. You can also update a user's password by using the following the steps. To change a user's password in your company work account (Azure AD tenant), you must be signed in on an account with [Global administrator](/azure/active-directory/users-groups-roles/directory-assign-admin-roles) permissions. Note that this will change the user's password in your Azure AD tenant, along with the password they use to access Partner Center.

1. From the **Users** page (under **Account settings**), select the name of the user account that you want to edit.
1. Select the *Password reset** at the bottom of the page.
1. A confirmation page will appear showing the login information for the user, including a temporary password. Be sure to print or copy this info and provide it to the user, as you won't be able to access the temporary password after you leave this page.

## Manage groups

Groups allow you to control multiple user roles and permissions all together.

### Add an existing group

To add a group that already exists in your organization's work account (Azure AD tenant) to your Partner Center account:

1. From the **User management** page (under **Account settings**), select **Groups**.
1. Select a group from the list that appears and then select **Next**. You can use the search box to search for specific groups.
If you select more than one group to add to your Partner Center account, you must assign them the same role or set of custom permissions. To add multiple groups with different roles/permissions, repeat these steps for each role or set of custom permissions.
1. Select the user account(s) you want to add the group to and then select **Next**.
1. In the **Roles** section, specify the role(s) or customized permissions for the selected group(s). All members of the group will be able to access your Partner Center account with the permissions you apply to the group, regardless of the roles and permissions associated with their individual account.
1. Select **Update**.

When you add an existing group, every user who is a member of that group will be able to access your Partner Center account, with the permissions associated with the group's assigned role.

### Add a new group

To add a new group to your Partner Center account:

1. From the **User management** page (under **Account settings**), select **Groups**.
1. Select **+ Create user group**.
1. Under **Create group**, select **Skip**.
1. Enter the display name for the new group and then select **Next**.
1. Select user(s) for the new group from the list that appears and then select **Next**. You can use the search box to search for specific users.
1. Select the role(s) or customized permissions for the group and then select **Add**. All members of the group will be able to access your Partner Center account with the permissions you apply here, regardless of the roles/permissions associated with their individual account.

Note that this new group will be created in your organization's work account (Azure AD tenant) as well, not just in your Partner Center account.

### Remove a group

To remove a group from your work account (Azure AD tenant), go to the **User management** page (under **Account settings**). From the **Groups** tab, for the group you want to remove, select **Delete**. In the dialog box that appears, select **Ok** to confirm that you want to remove the selected group.

## Manage Azure AD applications

You can allow applications or services that are part of your company's Azure AD to access your Partner Center account.

### Add existing Azure AD applications

To add applications that already exist in your company's Azure Active Directory:

1. From the **User management** page (under **Account settings**), select the **Azure AD applications** tab.
1. Select one or more Azure AD applications from the list that appears. You can use the search box to search for specific Azure AD applications. If you select more than one Azure AD application to add to your Partner Center account, you must assign them the same role or set of custom permissions. To add multiple Azure AD applications with different roles/permissions, repeat these steps for each role or set of custom permissions.
1. When you are finished selecting Azure AD applications, click **Add selected**.
1. In the **Roles** section, specify the role(s) or customized permissions for the selected Azure AD application(s).
1. Select **Save**.

### Add new Azure AD applications

If you want to grant Partner Center access to a new Azure AD application account, you can create one in the **Users** section. Note that this will create a new account in your company work account (Azure AD tenant), not just in your Partner Center account. If you are primarily using this Azure AD application for Partner Center authentication, and don't need users to access it directly, you can enter any valid address for the **Reply URL** and **App ID URI**, as long as those values are not used by any other Azure AD application in your directory.

1. From the **User management** page (under **Account settings**), select the **Azure AD applications** tab.
1. On the next page, select **Create Azure AD application**.
1. Enter the **Reply URL** for the new Azure AD application. This is the URL where users can sign in and use your Azure AD application (sometimes also known as the App URL or Sign-On URL). The **Reply URL** can't be longer than 256 characters and must be unique within your directory.
1. Enter the **App ID URI** for the new Azure AD application. This is a logical identifier for the Azure AD application that is presented when a single sign-on request is sent to Azure AD. Note that the **App ID URI** must be unique for each Azure AD application in your directory. This ID can't be longer than 256 characters. For more info about the App ID URI, see [Integrating applications with Azure Active Directory](/azure/active-directory/develop/quickstart-modify-supported-accounts#change-the-application-registration-to-support-different-accounts).
1. In the **Roles** section, specify the role(s) or customized permissions for the Azure AD application.
1. Select **Save**.

After you add or create an Azure AD application, you can return to the **Users** section and select the application name to review settings for the application, including the Tenant ID, Client ID, Reply URL, and App ID URI.

### Remove an application

To remove an application from your work account (Azure AD tenant), go to **Users** (under **Account settings**), select the application that you would like to remove using the checkbox in the far right column, then choose **Remove** from the available actions. A pop-up window will appear for you to confirm that you want to remove the selected application(s).

### Manage keys for an Azure AD application

If your Azure AD application reads and writes data in Microsoft Azure AD, it will need a key. You can create keys for an Azure AD application by editing its information in Partner Center. You can also remove keys that are no longer needed.

1. From the **Users** page (under **Account settings**), select the name of the Azure AD application. You'll see all of the active keys for the Azure AD application, including the date on which the key was created and when it will expire.
1. To remove a key that is no longer needed, select **Remove**.
1. To add a new key, select **Add new key**.
1. You will see a screen showing the **Client ID** and **Key values**. Be sure to print or copy this information, as you won't be able to access it again after you leave this page.
1. If you want to create more keys, select **Add another key**.

## Define user roles and permissions

Your company's users can be assigned the following roles and permissions for the Commercial Marketplace program on Partner Center:

- **Manager**
  - Can access all Microsoft account features except tax and payout settings
  - Can manage users, roles, and work accounts (tenants)
- **Developer**
  - Can manage and publish offers
  - Can view some publisher reports

## Manage tenants

An Azure Active Directory (AD) tenant, also referred to as your work account, is a representation of your organization set up in the Azure portal and helps you to manage a specific instance of Microsoft cloud services for your internal and external users. If your organization subscribed to a Microsoft cloud service, such as Azure, Microsoft Intune, or Microsoft 365, an Azure AD tenant was established for you.

You can set up multiple tenants to use with Partner Center. Any user with the **Manager** role in the Partner Center account will have the option to add and remove Azure AD tenants from the account.  

### Add an existing tenant

To associate another Azure AD tenant with your Partner Center account:

1. From the **Tenants** page (under **Account settings**), select **Associate**.
1. Enter your Azure AD credentials for the tenant that you want to associate.
1. Review the organization and domain name for your Azure AD tenant. To complete the association, select **Confirm**.

If the association is successful, you will then be ready to add and manage account users in the **Users** section in Partner Center.

### Create a new tenant

To create a brand new Azure AD tenant with your Partner Center account:

1. From the **Tenants** page (under **Account settings**), select **Create**.
1. Enter the directory information for your new Azure AD:
    - **Domain name**: The unique name that we’ll use for your Azure AD domain, along with “.onmicrosoft.com”. For example, if you entered “example”, your Azure AD domain would be “example.onmicrosoft.com”.
    - **Contact email**: An email address where we can contact you about your account if necessary.
    - **Global administrator user account info**: The first name, last name, username, and password that you want to use for the new global administrator account.
1. Select **Create** to confirm the new domain and account info.
1. Sign in with your new Azure AD global administrator username and password to begin [adding and managing users](#manage-users).

For more information about creating new tenants inside your Azure portal, rather than via the Partner Center portal, see the article [Create a new tenant in Azure Active Directory](../active-directory/fundamentals/active-directory-access-create-new-tenant.md).

### Remove a tenant

To remove a tenant from your Partner Center account, find its name on the **Tenants** page (in **Account settings**), then select **Remove**. You’ll be prompted to confirm that you want to remove the tenant. Once you do so, no users in that tenant will be able to sign into the Partner Center account, and any permissions you have configured for those users will be removed.

When you remove a tenant, all users that were added to the Partner Center account from that tenant will no longer be able to sign in to the account.

> [!TIP]
> You can’t remove a tenant if you're currently signed into Partner Center using an account in the same tenant. To remove a tenant, you must sign in to Partner Center as an **Manager** for another tenant that is associated with the account. If there is only one tenant associated with the account, that tenant can only be removed after signing in with the Microsoft account that opened the account.

## Agreements

On the **Agreements** page (under **Account Settings**), you can see a list of the publishing agreements that you've authorized. These agreements are listed according to name and version number, including the date it was accepted and the name of the user that accepted the agreement.

**Actions needed** might appear at the top of this page if there are agreement updates that need your attention. To accept an updated agreement, first read the linked Agreement Version, then select **Accept agreement**.