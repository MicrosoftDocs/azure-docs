---
title: Set up your billing account for a Microsoft Customer Agreement - Azure | Microsoft Docs
description: Learn how to set up your billing account for a Microsoft Customer Agreement.
services: ''
documentationcenter: ''
author: amberbhargava
manager: amberb
editor: banders
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/28/2019
ms.author: banders

---
# Set up your billing account for a Microsoft Customer Agreement

If your organization has signed a Microsoft Customer Agreement to renew your Enterprise Agreement enrollment, you must set up your billing account. Your new billing account provides enhanced billing and cost management capabilities through a new streamlined, unified management experience:  

- Manage your organization’s Azure services and billing, including invoices, in the Azure portal

- Organize the costs on your invoice based on your needs for easy tracking and cost allocation

- Review and analyze your monthly, digital invoice in the Azure Cost Management + Billing page

When you set up the billing account, you transition the billing of your existing Azure subscriptions to the new account. The way you'll manage billing for your subscriptions in the new account is different from how you managed in your Enterprise Agreement enrollment. We recommend you do the following, before you start the setup:

- **Understand changes to your billing hierarchy**
    - You new billing account is organized differently than your Enterprise Agreement enrollment. For more information, see [Understand changes to your billing hierarchy](#understand-changes-to-your-billing-hierarchy).
- **Understand changes to your billing administrators' access**
    - Administrators from your Enterprise Agreement enrollment get access to the billing scopes in the new account. For more information, see [Understand changes to your billing administrators' access](#understand-changes-to-your-billing-administrators-access).
- **Review Enterprise Agreement features that are replaced by the new account**
    - View features of Enterprise Agreement enrollment that are replaced with upgraded features in the new account. [Review features replaced by the new billing account](#review-features-replaced-by-the-new-billing-account).
- **View answers to most common questions**
    - View additional information to learn more about the setup. Go to [Additional information](#additional-information).

## Set up your billing account in the Azure portal

To complete the setup, you need access to both the new billing account and the Enterprise Agreement enrollment. For more information, see [Access required to complete the set up of your billing account](#access-required-to-complete-the-setup).

1. Sign in to the Azure portal using the link in the email that was sent to you when you signed the Microsoft Customer Agreement.

2. If someone else in your organization signed the agreement or you don't have the email, sign in using the following link. Replace **enrollmentNumber** with the enrollment number of your Enterprise Agreement that was renewed.

   `https://portal.azure.com/#blade/Microsoft_Azure_Billing/EATransitionToMCA/enrollmentId/enrollmentNumber`

3. Select **Start transition** in the last step of the setup. Once you select start transition:

    ![Screenshot that shows the setup wizard](./media/billing-mca-setup-account/ea-mca-set-up-wizard.png)

    - A billing hierarchy corresponding to your Enterprise Agreement hierarchy is created in the new billing account. For more information, see [Understand changes to your billing hierarchy](#understand-changes-to-your-billing-hierarchy).
    - Administrators from your Enterprise Agreement enrollment are given access to the new billing account so that they continue to manage billing for your organization.
    - The billing of your Azure subscriptions is transitioned to the new account. **There won’t be any impact on your Azure services during this transition. They’ll keep running without any disruption**.
    - If you have Azure Reservations, they are moved to your new billing account with the same discount and term. Your reservation discount will continue to be applied during the transition.

4. You can monitor the status of the transition on the **Transition status** page.

   ![Screenshot that shows the transition status](./media/billing-mca-setup-account/ea-mca-set-up-status.png)

## Access required to complete the setup

To complete the setup, you need the following access:

- Owner of the billing profile that was created when the Microsoft Customer Agreement was signed. To learn more about billing profiles, see [Understand billing profiles](billing-mca-overview.md#understand-billing-profiles).

- Enterprise administrator on the enrollment that is renewed.

### If you're not an enterprise administrator on the enrollment

You can request the enterprise administrators of the enrollment to complete the setup of your billing account.

1. Sign in to the Azure portal using the link in the email that was sent to you when you signed the Microsoft Customer Agreement.

2. If someone else in your organization signed the agreement or you don't have the email, sign in using the following link. Replace **enrollmentNumber** with the enrollment number of your enterprise agreement that was renewed.

   (https://portal.azure.com/#blade/Microsoft_Azure_Billing/EATransitionToMCA/enrollmentId/enrollmentNumber)

3. Select the enterprise administrators that you want to send the request.

   ![Screenshot that shows inviting the enterprise administrators](./media/billing-mca-setup-account/ea-mca-invite-admins.png)

4. Select **Send request**.

   The administrators will receive an email with instructions to complete the setup.

### If you're not an owner of the billing profile

The user in your organization, who signed the Microsoft Customer Agreement is added as the owner on the billing profile. Request the user to add you as an owner so that you can complete the setup.  <!-- Todo Are there any next steps -->

## Understand changes to your billing hierarchy

Your new billing account simplifies billing for your organization while providing you enhanced billing and cost management capabilities. The following diagram explains how billing is organized in the new billing account.

![Image of ea-mca-post-transition-hierarchy](./media/billing-mca-setup-account/mca-post-transition-hierarchy.svg)

1. You use the billing account to manage billing for your Microsoft customer agreement. To learn more about billing account, see [Understand billing account](billing-mca-overview.md#understand-billing-account).
2. You use the billing profile to manage billing for your organization, similar to your Enterprise Agreement enrollment. Enterprise administrators become owners of the billing profile. To learn more about billing profiles, see [Understand billing profiles](billing-mca-overview.md#understand-billing-profiles).
3. You use an invoice section to organize your costs based on your needs, similar to departments in your Enterprise Agreement enrollment. Department becomes invoice sections and department administrators become owners of the respective invoice sections. To learn more about invoice sections, see [Understand invoice sections](billing-mca-overview.md#understand-invoice-sections).
4. The accounts that were created in your Enterprise Agreement aren’t supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections.

## Understand changes to your billing administrators' access

Depending on their access, billing administrators on your Enterprise Agreement enrollment get access to the billing scopes on the new account. The following diagram explains the change in access during transition:

![Image of ea-mca-post-transition-access](./media/billing-mca-setup-account/mca-post-transition-access.png)

| Existing role | Post transition role  |
|---------|---------|
|Enterprise administrator (Read only = No)     |- Owner on the billing profile for the enrollment </br> - Owner on all the invoice sections |
|Enterprise administrator | -  Reader on the billing profile for the enrollment </br> -  Reader on all the invoice sections |
|Department administrator  (Read only = No)    |- Owner on the invoice section created for their respective department      |
|Department administrator     | - Reader on the invoice section created for their respective department      |
|Account owner     | - Azure subscription creator on the invoice section created for their respective department |

An Azure Active Directory tenant is selected for the new billing account while signing the Microsoft Customer Agreement. If a tenant doesn't exist for your organization, a new tenant is created. The tenant represents your organization within Azure Active Directory. Global tenant administrators in your organization use the tenant to manage access of applications and data in your organization.

Your new account only supports users from the tenant that was selected while signing the Microsoft Customer Agreement. If users with administrative permission on your Enterprise Agreement are part of the tenant, they’ll get access to the new billing account during the transition. If they’re not part of the tenant, they won’t be able to access the new billing account unless you invite them.

When you invite the users, they are added to the tenant as guest users and get access to the billing account. To invite the users, guest access must be turned on for the tenant. For more information, see [Control guest access in Azure Active Directory](https://docs.microsoft.com/en-us/microsoftteams/teams-dependencies#control-guest-access-in-azure-active-directory). If the guest access is turned off, contact the global administrators of your tenant to turn it on. <!-- Todo - How can they find their global administrator -->

## Review features replaced by the new billing account

The following Enterprise Agreement's features are replaced with new features in the billing account for a Microsoft Customer Agreement.

### Enterprise Agreement accounts

The accounts that were created in your Enterprise Agreement enrollment aren't supported in the new billing account. The account's subscriptions belong to the invoice section created for their respective department. Account owners become Azure subscription creators and can create and manage subscriptions for their invoice sections.

### Notification contacts

Notification contacts are sent email communications about the Azure Enterprise Agreement. They are not supported in the new billing account. Emails about Azure credits and invoices are sent to users who have access to billing profiles in your billing account.

### Spending quotas

Spending quotas that were set for departments in your Enterprise Agreement enrollment are replaced with budgets in the new billing account. A budget is created for each spending quota set on departments in your enrollment. For more information on budgets, see [Create and manage Azure budgets](../cost-management/manage-budgets.md).

### Cost centers

Cost center that were set on the Azure subscriptions in your Enterprise Agreement enrollment are carried over in the new billing account. However, cost centers for departments and Enterprise Agreement accounts aren't supported.

## Additional information

The following sections provide additional information about setting up your billing account.

### No service downtime

Azure services in your subscription keep running without any interruption. We only transition the billing relationship for your Azure subscriptions. There won't be an impact to existing resources, resource groups, or management groups.

### User access to Azure resources

Access to Azure resources that was set using Azure RBAC (role-based access control) is not affected during the transition.

### Azure Reservations

Any Azure Reservations in your Enterprise Agreement enrollment is moved to your new billing account. During the transition, there won't be any changes to the reservation discounts that are being applied to your subscriptions.

### Azure Marketplace products

Any Azure Marketplace products in your Enterprise agreement enrollment are moved along with the subscriptions. There won't be any changes to the service access of the Marketplace products during the transition.

### Support plan

Support benefits don't transfer as part of the transition. Purchase a new support plan to get benefits for Azure subscriptions in your new billing account.

### Past charges and balance

Charges and credits balance prior to transition can be viewed in your Enterprise Agreement enrollment through the Azure portal. <!--Todo - Add a link for this-->

### When should the setup be completed?

Complete the setup of your billing account before your Enterprise Agreement enrollment expires. If your enrollment expires, services in your Azure subscriptions will still keep on running without disruption. However, you'll be charged retail rates for the services.

### Changes to the Enterprise Agreement enrollment after the setup

Azure subscriptions that are created for the Enterprise Agreement enrollment after the transition can be manually moved to the new billing account. For more information, see [Get billing ownership of Azure subscriptions from other users](billing-mca-request-billing-ownership.md). To move Azure Reservations that are purchased after the transition, [contact Azure Support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). You can also provide users access to the billing account after the transition. For more information, see [Manage billing roles in the Azure portal](billing-understand-mca-roles.md#manage-billing-roles-in-the-azure-portal)

### Revert the transition

The transition can't be reverted. Once the billing of your Azure subscriptions is transitioned to the new billing account, you can't revert it back to your Enterprise Agreement enrollment.

### Closing your browser during setup

Before you click on **Start transition**, you can close the browser. You can come back to the setup using the link you got in the email and start the transition. If you close the browser, after the transition is started, your transition will keep on running. Come back to the transition status page to monitor the latest status of your transition. You'll get an email when the transition is completed.

## Validate the billing account is set up properly

 Validate the following to ensure your new billing account is set up properly:

### Azure subscriptions

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-setup-account/billing-search-cost-management-billing.png)

3. Select the billing profile. Depending on your access, you may need to select a billing account. From the billing account, select **Billing profiles** and then the billing profile.

4. Select **Azure subscriptions** from the left side.

   ![Screenshot that shows list of subscriptions](./media/billing-mca-setup-account/billing-mca-subscriptions-post-transition.png)

All Azure subscriptions that are transitioned from your Enterprise Agreement enrollment to the new billing account are displayed on the Azure subscriptions page. If you believe any subscription is missing, transition the billing of the subscription manually in the Azure portal. For more information, see [Get billing ownership of Azure subscriptions from other users](billing-mca-request-billing-ownership.md)

### Azure Reservations

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-setup-account/billing-search-cost-management-billing.png)

3. Select an invoice section. Depending on your access, you may need to select a billing account or a billing profile.  From the billing account or billing profile, select **Invoice sections** and then an invoice section.

    ![Screenshot that shows list of invoice section post transition](./media/billing-mca-setup-account/billing-mca-invoice-sections-post-transition.png)

4. Select **All products** from the left side.

5. Search on **Reserved**.

    ![Screenshot that shows list of subscriptions post transition](./media/billing-mca-setup-account/billing-mca-azure-reservations-post-transition.png)

All Azure Reservations that are moved from your Enterprise Agreement enrollment to the new billing account are displayed on the All products page. Repeat the steps for all the invoice sections to verify that all Azure Reservations are moved from your Enterprise Agreement enrollment. If you believe any Azure Reservation is missing, [contact Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to move the Reservation to the new billing account.

### Access of enterprise administrators on the billing profile

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-setup-account/billing-search-cost-management-billing.png)

3. Select the billing profile created for your enrollment. Depending on your access, you may need to select a billing account.  From the billing account, select **Billing profiles** and then the billing profile.

4. Select **Access control (IAM)** from the left side.

   ![Screenshot that shows access of enterprise administrators post transition](./media/billing-mca-setup-account/billing-mca-ea-admins-access-post-transition.png)

Enterprise administrators are listed as billing profile owners while the enterprise administrators with read-only permissions are listed as billing profile readers. If the access for any enterprise administrators is missing, you can give them access in the Azure portal. For more information, see [Manage billing roles in the Azure portal](billing-understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

### Access of enterprise administrators, department administrators, and account owners on invoice sections

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-setup-account/billing-search-cost-management-billing.png).

3. Select an invoice section. Invoice sections have the same name as their respective departments in Enterprise Agreement enrollments. Depending on your access, you may need to select a billing profile or a billing account. From the billing profile or the billing account, select **Invoice sections** and then select an invoice section.

   ![Screenshot that shows list of invoice section post transition](./media/billing-mca-setup-account/billing-mca-invoice-sections-post-transition.png)

4. Select **Access control (IAM)** from the left side.

    ![Screenshot that shows access of department and account admins access post transition](./media/billing-mca-setup-account/billing-mca-department-account-admins-access-post-transition.png)

Enterprise administrators and department administrators are listed as invoice section owners or invoice section readers while account owners in the department are listed as Azure subscription creators. Repeat the step for all invoice sections to check access for all departments in your Enterprise Agreement enrollment. Account owners that weren't part of any department will get permission on an invoice section named **Default invoice section**. If the access for any administrators is missing, you can give them access in the Azure portal. For more information, see [Manage billing roles in the Azure portal](billing-understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Get started with your new billing account](billing-mca-overview.md)

- [Learn how to perform common EA tasks in your new billing account](billing-mca-enterprise-operations.md)
