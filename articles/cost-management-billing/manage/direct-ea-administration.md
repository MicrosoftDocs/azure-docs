---
title: Azure portal administration for direct Enterprise Agreements
description: This article explains the common tasks that a direct enterprise administrator accomplishes in the Azure portal.
author: bandersmsft
ms.author: banders
ms.date: 08/29/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: enterprise
ms.reviewer: sapnakeshari
---

# Azure portal administration for direct Enterprise Agreements

This article explains the common tasks that a direct Enterprise Agreement (EA) administrator accomplishes in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes). A direct enterprise agreement is signed between Microsoft and an enterprise agreement customer.

Conversely, an indirect EA is one where a customer signs an agreement with a Microsoft partner. Indirect EAs are managed using the [Azure Enterprise portal](https://ea.azure.com/). For more information about managing indirect EAs, see [Azure EA portal administration](ea-portal-administration.md).

> [!NOTE]
> We recommend that direct EA Azure customers use Cost Management + Billing in the Azure portal to manage their enrollment and billing instead of using the EA portal. For more information about enrollment management in the Azure portal, see [Get started with the Azure portal for direct Enterprise Agreement customers](ea-direct-portal-get-started.md).
>
> As of October 10, 2022 direct EA customers won’t be able to manage their billing account in the EA portal. Instead, they must use the Azure portal. 
> 
> This change doesn’t affect direct Azure Government EA enrollments or indirect EA (an indirect EA is one where a customer signs an agreement with a Microsoft partner) enrollments. Both continue using the EA portal to manage their enrollment.

## Manage your enrollment

To manage your service, the initial enterprise administrator opens the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes) and signs in using the email address from the invitation email.

If you've been set up as the enterprise administrator, then go to the Azure portal and sign in with your work, school, or Microsoft account email address and password.

If you have more than one billing account, select a billing account from billing scope menu. You can view your billing account properties and policy from the left menu.

Check out the [EA admin manage enrollment](https://www.youtube.com/watch?v=NUlRrJFF1_U) video. It's part of the [Direct Enterprise Customer Billing Experience in the Azure portal](https://www.youtube.com/playlist?list=PLeZrVF6SXmsoHSnAgrDDzL0W5j8KevFIm) series of videos.

>[!VIDEO https://www.youtube.com/embed/NUlRrJFF1_U]

## Select a billing scope

Enterprise agreements and the customers accessing the agreements can have multiple enrollments. A user can have access to multiple enrollment scopes (billing account scopes). All the information and activity in the Azure portal are in the context of a billing account scope. It's important that the enterprise administrator first selects a billing scope and then does administrative tasks.

### To select a billing scope

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Search for **Cost Management + Billing** and select it.  
    :::image type="content" source="./media/direct-ea-administration/search-cost-management.png" alt-text="Screenshot showing search for Cost Management + Billing." lightbox="./media/direct-ea-administration/search-cost-management.png" :::
1. Select **Billing scopes** from the navigation menu and then select the billing account that you want to work with.  
    :::image type="content" source="./media/direct-ea-administration/select-billing-scope.png" alt-text="Screenshot showing select a billing account." lightbox="./media/direct-ea-administration/select-billing-scope.png" :::

## View enrollment details

An Azure enterprise administrator (EA admin) can view and manage enrollment properties and policy to ensure that enrollment settings are correctly configured.

### To view enrollment properties

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the navigation menu, under **Settings**, select **Properties**.
1. View the billing account information.  
    :::image type="content" source="./media/direct-ea-administration/billing-account-properties.png" alt-text="Screenshot showing billing account properties." lightbox="./media/direct-ea-administration/billing-account-properties.png" :::

### View and manage enrollment policies

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the navigation menu, select **Policies**.
1. Enable or disable policies by selecting **On** or **Off**.  
    :::image type="content" source="./media/direct-ea-administration/enrollment-policies.png" alt-text="Screenshot showing E A enrollment policies." lightbox="./media/direct-ea-administration/enrollment-policies.png" :::

For more information about the department admin (DA) and account owner (AO) view charges policy settings, see [Pricing for different user roles](understand-ea-roles.md#see-pricing-for-different-user-roles).

## Add another enterprise administrator

Only existing EA admins can create other enterprise administrators. Use one of the following options, based on your situation.

### If you're already an enterprise administrator

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Access Control (IAM)**.
1. In the top menu, select **+ Add** , and then select **Enterprise administrator**.  
    :::image type="content" source="./media/direct-ea-administration/add-enterprise-admin-navigate.png" alt-text="Screenshot showing navigation to Enterprise administrator." lightbox="./media/direct-ea-administration/add-enterprise-admin-navigate.png" :::
1. Complete the Add role assignment form and then select **Add**.

Make sure that you have the user's email address and preferred authentication method handy, such as a work, school, or Microsoft account.

An EA admin can manage access for existing enterprise administrators by selecting the ellipsis (**…**) symbol to right of each user. They can **Edit** and **Delete** existing users.

### If you're not an enterprise administrator

If you're not an EA admin, contact your EA admin to request that they add you to an enrollment. The EA admin uses the preceding steps to add you as an enterprise administrator. After you're added to an enrollment, you receive an activation email.

### If your enterprise administrator can't help you

If your enterprise administrator can't assist you, create an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest). Provide the following information:

- Enrollment number
- Email address to add, and authentication type (work, school, or Microsoft account)
- Email approval from an existing enterprise administrator

>[!NOTE]
>  - We recommend that you have at least one active Enterprise Administrator at all times. If no active Enterprise Administrator is available, contact your partner to change the contact information on the Volume License agreement. Your partner can make changes to the customer contact information by using the Contact Information Change Request (CICR) process available in the eAgreements (VLCM) tool.
>  - Any new EA administrator account created using the CICR process is assigned read-only permissions to the enrollment in the EA portal and Azure portal. To elevate access, create an [Azure support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

## Create an Azure enterprise department

EA admins and department administrators use departments to organize and report on enterprise Azure services and usage by department and cost center. The enterprise administrator can:

- Add or remove departments.
- Associate an account to a department.
- Create department administrators.
- Allow department administrators to view price and costs.

A department administrator can add new accounts to their departments. They can also remove accounts from their departments, but not from the enrollment.

Check out the [Manage departments in the Azure portal](https://www.youtube.com/watch?v=NUlRrJFF1_U) video.

>[!VIDEO https://www.youtube.com/embed/vs3wIeRDK4Q]

### To create a department

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left navigation menu, select **Departments**.
1. Select **+ Add**.  
    :::image type="content" source="./media/direct-ea-administration/add-department.png" alt-text="Screenshot showing navigation to add a department." lightbox="./media/direct-ea-administration/add-department.png" :::
1. In the Add new department from, enter your information. The department name is the only required field. It must contain at least three characters.
1. When complete, select **Save**.

## Add a department administrator

After a department is created, the EA admin can add department administrators and associate each one to a department. Department administrators can do the following actions for their departments:

- Create other department administrators
- View and edit department properties such as name or cost center
- Add accounts
- Remove accounts
- Download usage details
- View the monthly usage and charges ¹

 ¹ An EA admin must grant the permissions.

### To add a department administrator

As an enterprise administrator:

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the navigation menu, **select Departments**.
1. Select the department where you want to add administrator.
1. In the department view, select **Access Control (IAM)**.
1. Select **+ Add**, then select **Department administrator**.
1. Enter the email address and other required information.
1. For read-only access, set the **Read-Only** option to **Yes**, and then select **Add**.  
    :::image type="content" source="./media/direct-ea-administration/add-department-admin.png" alt-text="Screenshot showing navigation to Department administrator." lightbox="./media/direct-ea-administration/add-department-admin.png" :::

### To set read-only access

EA admins can grant read-only access to department administrators. When you create a new department administrator, set the read-only option to **Yes**.

To edit an existing department administrator:

1. Select the ellipsis symbol (**…**) to the right side of a row and select it.
1. Set the read-only open to  **Yes** and then select **Apply**.

Enterprise administrators automatically get department administrator permissions.

## Add an account and account owner

The structure of accounts and subscriptions affect how they're administered and how they appear on your invoices and reports. Examples of typical organizational structures include business divisions, functional teams, and geographic locations.

After a new account is added to the enrollment, the account owner is sent an account ownership email that's used to confirm ownership.

Check out the [EA admin manage accounts](https://www.youtube.com/watch?v=VKWAEx6qfPc) video. It's part of the [Direct Enterprise Customer Billing Experience in the Azure portal](https://www.youtube.com/playlist?list=PLeZrVF6SXmsoHSnAgrDDzL0W5j8KevFIm) series of videos.

>[!VIDEO https://www.youtube.com/embed/VKWAEx6qfPc]

### To add an account and account owner

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Accounts**.
1. Select **+ Add**.
1. On the Add an account page, type a friendly name to identify the account that's used for reporting.
1. Enter the **Account Owner email** address to associate it with the new account.
1. Select a department or leave it as unassigned.
1. When completed, select **Add**.

### To confirm account ownership

After the account owner receives an account ownership email, they need to confirm their ownership.

1. Sign in to the email account associated with the work, school, or Microsoft account that was set as the account owner.
1. Open the email notification titled _Invitation to Activate your Account on the Microsoft Azure Service_.
1. Select the **Activate Account** link in the invitation.
1. Sign in to the Azure portal.
1. On the Activate Account page, select **Yes, I wish to continue** to confirm account ownership.  
    :::image type="content" source="./media/direct-ea-administration/activate-account.png" alt-text="Screenshot showing the Activate Account page." lightbox="./media/direct-ea-administration/activate-account.png" :::

After account ownership is confirmed, you can create subscriptions and purchase resources with the subscriptions.

## Change Azure subscription or account ownership

EA admins can use the Azure portal to transfer account ownership of selected or all subscriptions in an enrollment. When you complete a subscription or account ownership transfer, Microsoft updates the account owner.

Before starting the ownership transfer, get familiar with the following Azure role-based access control (Azure RBAC) policies:

- When doing a subscription or account ownership transfers between two organizational IDs within the same tenant, the following items are preserved:
    - Azure RBAC policies
    - Existing service administrator
    - Coadministrator roles
- Cross-tenant subscription or account ownership transfers result in losing your Azure RBAC policies and role assignments.
- Policies and administrator roles don't transfer across different directories. Service administrators are updated to the owner of destination account.
- To avoid losing Azure RBAC policies and role assignments when transferring subscription between tenants, ensure that the **Move the subscriptions to the recipient's Azure AD tenant** selection remains cleared. This selection keeps the services, Azure roles, and policies on the current Azure AD tenant and only transfers the billing ownership for the account.

Before changing an account owner:

1. View the **Account** tab and identify the source account. The source account must be active.
1. Identify the destination account and make sure it's active.

To transfer account ownership for all subscriptions:

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Accounts**.
1. Select an **Account** and then to right of the row select the ellipsis (**…**) symbol.
1. Select **Transfer subscriptions**.  
    :::image type="content" source="./media/direct-ea-administration/transfer-subscriptions-01.png" alt-text="Screenshot showing where to transfer subscriptions." lightbox="./media/direct-ea-administration/transfer-subscriptions-01.png" :::
1. On the Transfer subscriptions page, select the destination account to transfer to and then select **Next**.
1. If you want to transfer the account ownership across Azure AD tenants, select the **Yes, I would also like to move the subscriptions to the new account's Azure AD tenant** confirmation.
1. Confirm the transfer and select **Submit**.  
    :::image type="content" source="./media/direct-ea-administration/transfer-account-confirmation.png" alt-text="Screenshot showing the transfer subscription confirmation." lightbox="./media/direct-ea-administration/transfer-account-confirmation.png" :::

To transfer account ownership for a single subscription:

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Azure subscriptions**.
1. On the Azure Subscriptions page, to the right of a subscription, select the ellipsis (**…**) symbol.
1. Select **Transfer subscription**.
1. On the Transfer subscription page, select the destination account to transfer the subscription and then select  **Next**.
1. If you want to transfer the subscription ownership across Azure AD tenants, select the **Yes, I would like to also move the subscriptions to the to the new account's Azure AD tenant** option.
1. Confirm the transfer and then select **Submit**.

## Associate an account to a department

EA admins can associate existing accounts to departments in the enrollment.

### To associate an account to a department

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Accounts**.
1. Select the ellipsis (**…**) symbol to the right side of any account and then select **Edit**.
1. On the Edit account page, select a **Department** from the list.
1. Select **Save**.

## Associate an account with a pay-as-you-go subscription

If you already have an existing school, work, or Microsoft account for an Azure pay-as-you-go subscription, you can associate it with your Enterprise Agreement enrollment.

To associate an account, you must have the EA administrator or department admin role.

### To associate an existing account

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Accounts**.
1. Select **+ Add**.
1. On the Add an Account page, enter a name that you want to use to identify the account for reporting purposes.
1. Select either **Microsoft** or **Work or school account** associated with the existing Azure account.
1. Type the account owner's email address and then confirm it.
1. Select **Add**.

It might take up to eight hours for the account to appear in the Azure portal.

### To confirm account ownership

1. Sign into the email account associated with the work, school, or Microsoft account that you associated in the previous procedure.
1. Open the email notification titled _Invitation to Activate your Account on the Microsoft Azure Service_.
1. Select the **Activate account** link in the invitation.
1. Sign in to the Azure portal.
1. On the Activate Account page, select **Yes, I wish to continue** to confirm account ownership.  
    :::image type="content" source="./media/direct-ea-administration/activate-account.png" alt-text="Screenshot showing the activate account page." lightbox="./media/direct-ea-administration/activate-account.png" :::

## Enable Azure Marketplace purchases

Although most pay-as-you-go _subscriptions_ can be associated with an Azure Enterprise Agreement, previously purchased Azure Marketplace _services_ can't. To get a single view of all subscriptions and charges, we recommend that you enable Azure Marketplace purchases.

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Policies**.
1. Under **Azure Marketplace**, set the policy to **On**.  
   :::image type="content" source="./media/direct-ea-administration/azure-marketplace.png" alt-text="Screenshot showing the Azure Marketplace policy setting." lightbox="./media/direct-ea-administration/azure-marketplace.png" :::

The account owner can then repurchase any Azure Marketplace services that were previously owned in the pay-as-you-go subscription.

The setting applies to all account owners in the enrollment. It allows them to make Azure Marketplace purchases.

After subscriptions are activated under your Azure EA enrollment, cancel the Azure Marketplace services that were created with the pay-as-you-go subscription. This step is critical in case your pay-as-you-go payment instrument expires.

## MSDN subscription transfer

When your transfer an MSDN subscription to an EA enrollment it's automatically converted to an MSDN Dev/Test subscription. After conversion, the subscription loses any existing monetary credit. So, we recommended that you use all your credit before you transfer it to your Enterprise Agreement.

## Azure in Open subscription transfer

When you transfer an Azure in Open subscription to an Enterprise Agreement, you lose any unused Azure in Open credits. We recommended that you use all your credit for the Azure in Open subscription before you transfer it to your Enterprise Agreement.

## Subscription transfers with support plans

If your Enterprise Agreement doesn't have a support plan and try to transfer an existing Microsoft Online Support Agreement (MOSA) subscription that has a support plan, the subscription won't automatically transfer. You'll need to repurchase a support plan for your EA enrollment during the grace period, which is by the end of the following month.

## Manage department and account spending with budgets

EA customers can set budgets for each department and account under an enrollment. Budgets in Cost Management help you plan for and drive organizational accountability. They help you inform others about their spending to proactively manage costs, and to monitor how spending progresses over time. You can configure alerts based on your actual cost or forecasted cost to ensure that your spending is within your organizational spend limit. When the budget thresholds you've created are exceeded, only notifications are triggered. None of your resources are affected and your consumption isn't stopped. You can use budgets to compare and track spending as you analyze costs. For more information about how to create budgets, see [Tutorial: Create and manage Azure budgets](../costs/tutorial-acm-create-budgets.md).

## Enterprise Agreement user roles

The Azure portal helps you to administer your Azure EA costs and usage. There are three main EA roles:

- Enterprise Agreement (EA) admin
- Department administrator
- Account owner

Each role has a different level of access and authority. For more information about user roles, see [Enterprise user roles](understand-ea-roles.md#enterprise-user-roles).

## Add an Azure EA account

An Azure EA account is an organizational unit in the Azure portal. In the Azure portal, it's referred to as _account_. It's used to administer subscriptions and it's also used for reporting. To access and use Azure services, you need to create an account or have one created for you. For more information about accounts, see [Add an account](#add-an-account-and-account-owner).

## Enable the Enterprise Dev/Test offer

As an EA admin, you can allow account owners in your organization to create subscriptions based on the EA Dev/Test offer. To do so, select the **Dev/Test** option in the account properties. After you've selected the Dev/Test option, let the account owner know so that they can create EA Dev/Test subscriptions needed for their teams of Dev/Test subscribers. The offer enables active Visual Studio subscribers to run development and testing workloads on Azure at special Dev/Test rates. It provides access to the full gallery of Dev/Test images including Windows 8.1 and Windows 10.

### To set up the Enterprise Dev/Test offer

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Accounts**.
1. Select the account where you want to enable Dev/Test access.
1. On the enrollment account page, select **Edit**.
1. On the Edit account page, select **Dev/Test** and then select **Save**.

When a user is added as an account owner, any Azure subscriptions associated with the user that are based on either the pay-as-you-go Dev/Test offer or the monthly credit offers for Visual Studio subscribers get converted to the EA Dev/Test offer. Subscriptions based on other offer types, such as pay-as-you-go, that are associated with the account owner get converted to Microsoft Azure Enterprise offers.

Currently, the Dev/Test Offer isn't applicable to Azure Gov customers.

## Create a subscription

Account owners can view and manage subscriptions. You can use subscriptions to give teams in your organization access to development environments and projects. For example: 

- Test
- Production
- Development
- Staging

When you create different subscriptions for each application environment, you help secure each environment.

- You can also assign a different service administrator account for each subscription.
- You can associate subscriptions with any number of services.
- The account owner creates subscriptions and assigns a service administrator account to each subscription in their account.

Check out the [EA admin manage subscriptions](https://www.youtube.com/watch?v=KFfcg2eqPo8) video. It's part of the [Direct Enterprise Customer Billing Experience in the Azure portal](https://www.youtube.com/playlist?list=PLeZrVF6SXmsoHSnAgrDDzL0W5j8KevFIm) series of videos.

>[!VIDEO https://www.youtube.com/embed/KFfcg2eqPo8]

## Add a subscription

Account owners create subscriptions within their enrollment account. The first time you add a subscription to your account, you're asked to accept the Microsoft Online Subscription Agreement (MOSA) and a rate plan. Although they aren't applicable to Enterprise Agreement customers, the MOSA and the rate plan are required to create your subscription. Your Microsoft Azure Enterprise Agreement Enrollment Amendment supersedes the preceding items and your contractual relationship doesn't change. When prompted, select the option that indicates you accept the terms.

_Microsoft Azure Enterprise_ is the default name when a subscription is created. You can change the name to differentiate it from the other subscriptions in your enrollment, and to ensure that it's recognizable in reports at the enterprise level.

### To add a subscription

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope for the enrollment.
1. In the left menu, select **Accounts**.
1. In the list of enrollment accounts, select the one where you want to create a subscription.
1. On the enrollment account page, select **+ New Subscription**.  
    :::image type="content" source="./media/direct-ea-administration/new-subscription.png" alt-text="Screenshot showing the new subscription option." lightbox="./media/direct-ea-administration/new-subscription.png" :::
1. On the Create subscription page, enter a subscription name, and then select **Create**.

The subscription name appears on reports. It's the name of the project associated with the subscription in the development portal.

New subscriptions can take up to 24 hours to appear in the subscriptions list. After you've created a subscription, you can:

- Edit subscription details
- Manage subscription services

You can also create subscriptions by navigating to the Azure Subscriptions page and selecting **+ Add**.

## Cancel a subscription

Only account owners can cancel their own subscriptions.

To delete a subscription where you're the account owner:

1. Sign in to the Azure portal with the credentials associated with your account.
1. In the navigation menu, select **Subscriptions**.
1. Select a subscription.
1. On the subscription details page, in the upper left corner of the page, **Cancel Subscription**.
1. Type the subscription name, choose a cancellation reason, and then select **Cancel**.

For more information, see [What happens after I cancel my subscription?](cancel-azure-subscription.md#what-happens-after-subscription-cancellation).

## Delete an enrollment account

You can delete an enrollment account only when there are no active subscriptions.

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, select **Accounts**.
1. In the Accounts list, search for the account you would like to delete.
1. In the account row that you want to delete, select the ellipsis (**…**) symbol, and then select **Delete**.
1. On the Delete account page, select the **Yes, I want to delete this account** confirmation and then and select **Delete**.

## Manage notification contacts

Notifications allow enterprise administrators to enroll their team members to receive usage, invoice, and user management notifications without giving them billing account access in the Azure portal.

Notification contacts are shown in the Azure portal in the Notifications under Settings. Managing your notification contacts makes sure that the right people in your organization get Azure EA notifications. 

To view current notifications settings and add contacts:

1. Sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_GTM/ModernBillingMenuBlade/AllBillingScopes).
1. Navigate to **Cost Management + Billing**.
1. In the left menu, select **Billing scopes** and then select a billing account scope.
1. In the left menu, under **Settings**, select **Notifications**.
    Notification contacts are shown on the page.
1. To add a contact, select **+ Add**.
1. In the **Add Contact** area, enter the contact's email address.
1. Under **Frequency**, select a notification interval. Weekly is the default value.
1. Under **Categories**, select Lifecycle Management to receive notifications when the enrollment end date is approached or ended.
1. Select **Add** to save the changes.  
    :::image type="content" source="./media/direct-ea-administration/add-contact.png" alt-text="Screenshot showing the Add Contact window where you add a contact." :::

The new notification contact is shown in the Notification list.

An EA admin can manage notification access for a contact by selecting the ellipsis (…) symbol to the right of each contact. They can edit and remove existing notification contacts.

By default, notification contacts are subscribed for the coverage period end date approaching lifecycle notifications. Unsubscribing lifecycle management notifications suppresses notifications for the coverage period and agreement end date.

## Azure sponsorship offer

The Azure sponsorship offer is a limited sponsored Microsoft Azure account. It's available by e-mail invitation only to limited customers selected by Microsoft. If you're entitled to the Microsoft Azure sponsorship offer, you'll receive an e-mail invitation to your account ID.

If you need assistance, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) in the Azure portal.

## Convert to work or school account authentication

Azure Enterprise users can convert from a Microsoft Account (MSA or Live ID) to a Work or School Account. A Work or School Account uses the Azure Active Directory authentication type.

### To begin

1. Add the work or school account to the Azure portal in the role(s) needed.
1. If you get errors, the account may not be valid in Azure Active Directory. Azure uses User Principal Name (UPN), which isn't always identical to the email address.
1. Authenticate to the Azure portal using the work or school account.

### To convert subscriptions from Microsoft accounts to work or school accounts

1. Sign in to the Azure portal using the Microsoft account that owns the subscriptions.
1. Use an account ownership transfer to move to the new account.
1. The Microsoft account should be free from any active subscriptions and can be deleted.
1. Any deleted accounts remain viewable in the Azure portal with inactive status for historic billing reasons. You can filter it out of the view by selecting **Show only active accounts**.

## Azure EA term glossary

**Account**<br>
An organizational unit. It's used to administer subscriptions and for reporting.

**Account owner**<br>
The person who manages subscriptions and service administrators on Azure. They can view usage data on this account and its associated subscriptions.

**Amendment subscription**<br>
A one-year, or coterminous subscription under the enrollment amendment.

**Prepayment**<br>
Prepayment of an annual monetary amount for Azure services at a discounted Prepayment rate for usage against this prepayment.

**Department administrator**<br>
The person who manages departments, creates new accounts and account owners, views usage details for the departments they manage, and can view costs when granted permissions.

**Enrollment number**<br>
A unique identifier supplied by Microsoft to identify the specific enrollment associated with an Enterprise Agreement.

**Enterprise administrator**<br>
The person who manages departments, department owners, accounts, and account owners on Azure. They can manage enterprise administrators and view usage data, billed quantities, and unbilled charges across all accounts and subscriptions associated with the enterprise enrollment.

**Enterprise agreement**<br>
A Microsoft licensing agreement for customers with centralized purchasing who want to standardize their entire organization on Microsoft technology and maintain an information technology infrastructure on a standard of Microsoft software.

**Enterprise agreement enrollment**<br>
An enrollment in the Enterprise Agreement program providing Microsoft products in volume at discounted rates.

**Microsoft account**<br>
A web-based service that enables participating sites to authenticate a user with a single set of credentials.

**Microsoft Azure Enterprise Enrollment Amendment (enrollment amendment)**<br>
An amendment signed by an enterprise, which provides them access to Azure as part of their enterprise enrollment.

**Resource quantity consumed**<br>
The quantity of an individual Azure service that was used in a month.

**Service administrator**<br>
The person who accesses and manages subscriptions and development projects.

**Subscription**<br>
Represents an Azure EA subscription and is a container of Azure services managed by the same service administrator.

**Work or school account**<br>
For organizations that have set up Azure Active Directory with federation to the cloud and all accounts are on a single tenant.

## Enrollment status

**New**<br>
This status is assigned to an enrollment that was created within 24 hours and will be updated to a Pending status within 24 hours.

**Pending**<br>
The enrollment administrator needs to sign in to the Azure portal. Once signed in, the enrollment will switch to an Active status.

**Active**<br>
The enrollment is Active and accounts and subscriptions can be created in the Azure portal. The enrollment will remain active until the Enterprise Agreement end date.

**Indefinite extended term**<br>
An indefinite extended term takes place after the Enterprise Agreement end date has passed. It enables Azure EA customers who are opted in to the extended term to continue to use Azure services indefinitely at the end of their Enterprise Agreement.

Before the Azure EA enrollment reaches the Enterprise Agreement end date, the enrollment administrator should decide which of the following options to take:

- Renew the enrollment by adding more Azure Prepayment.
- Transfer to a new enrollment.
- Migrate to the Microsoft Online Subscription Program (MOSP).
- Confirm disablement of all services associated with the enrollment.

**Expired**<br>
The Azure EA customer is opted out of the extended term, and the Azure EA enrollment has reached the Enterprise Agreement end date. The enrollment will expire, and all associated services will be disabled.

**Transferred**<br>
Enrollments where all associated accounts and services have been transferred to a new enrollment appear with a transferred status.
 > [!NOTE]
 > Enrollments don't automatically transfer if a new enrollment number is generated at renewal. You must include your prior enrollment number in your renewal paperwork to facilitate an automatic transfer.

## Next steps

- If you need to create an Azure support request for your EA enrollment, see [How to create an Azure support request for an Enterprise Agreement issue](how-to-create-azure-support-request-ea.md).
- Read the [Cost Management + Billing FAQ](../cost-management-billing-faq.yml) for questions about EA subscription ownership.