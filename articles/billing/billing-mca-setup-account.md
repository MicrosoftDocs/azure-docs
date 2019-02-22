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
ms.date: 02/19/2018
ms.author: banders

---
# Set up your billing account for a Microsoft Customer Agreement

If your organization has signed a Microsoft Customer Agreement to renew your Enterprise Agreement enrollment, then you must set up your billing account. Your new billing account provides you enhanced billing and cost management capabilities through a new streamlined, unified management experience:  

✔ Manage your organization’s Azure services and billing, including invoices, in the Azure portal.

✔ Organize your invoice based on your needs for easy tracking and cost allocation.

✔ Review and analyze your monthly, digital invoice in the Azure Cost Management + Billing page.

## Set up your billing account in the Azure portal

To complete the setup, you need access to both the new billing account and the Enterprise Agreement enrollment. For more information, see [Access required to complete the set up of your billing account](#permissions-required-to-complete-the-setup).

1. Sign in to the Azure portal using the link in the email that was sent to you when you signed the Microsoft Customer Agreement.

2. If someone else in your organization signed the agreement or you don't have the email, sign in using the following link. Replace **enrollmentNumber** with the enrollment number of your enterprise agreement that was renewed.

   (https://portal.azure.com/#blade/Microsoft_Azure_Billing/EATransitionToMCA/enrollmentId/enrollmentNumber)

3. Select **Start transition** in the last step. The setup includes the following steps:

   ![Screenshot that shows the transition setup wizard](./media/billing-mca-setup-account/ea-mca-set-up-wizard.png)

 **Understand changes to your billing hierarchy:** Billing in your new account is organized differently than your Enterprise Agreement enrollment. This step describes the changes to your billing. For more information, see, [Understand changes to your billing hierarchy](#understand-changes-to-your-billing-hierarchy).

 **Manage access to your billing account:** Ensure that all billing administrators from your Enterprise Agreement get access to your new billing account. This step helps you give access to your billing administrators. For more information, see [Manage access to your new billing account](#manage-access-to-your-new-billing-account).

4. You can monitor the status of the transition on the **Transition status** page.

   ![Screenshot that shows the transition status](./media/billing-mca-setup-account/ea-mca-set-up-status.png)

## Access required to complete the setup

To complete the setup, you need the following access:

1. Owner of the billing profile that was created when the Microsoft Customer Agreement was signed. To learn more about billing profiles, see [Understand billing profiles](billing-mca-overview.md#understand-billing-profiles)

2. Enterprise administrator on the enrollment that is renewed.

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

1. You use the billing account to manage billing for your Microsoft customer agreement. To learn more about billing account, see [Understand billing account].(billing-mca-overview.md#understand-billing-account).
2. You use the billing profile to manage billing for your organization, similar to your Enterprise Agreement enrollment. Enterprise administrators become owners of the billing profile. To learn more about billing profiles, see [Understand billing profiles](billing-mca-overview.md#understand-billing-profiles).
3. You use an invoice section to organize your costs based on your needs, similar to departments in your Enterprise Agreement enrollment. Department becomes invoice sections and department administrators become owners of the respective invoice sections. To learn more about invoice sections, see [Understand invoice sections](billing-mca-overview.md#understand-invoice-sections).
4. The accounts that were created in your Enterprise Agreement aren’t supported in the new billing account. The account's subscriptions belong to the respective invoice section for their department. Account owners can create and manage subscriptions for their invoice sections.

## Understand changes to billing access

Depending on their access, billing administrators on your Enterprise Agreement enrollment get access to the billing contexts on the new billing account. The following diagram explains the change in access post transition:

![Image of ea-mca-post-transition-access](./media/billing-mca-setup-account/mca-post-transition-access.png)

| Existing role | Post transition role  |
|---------|---------|
|Enterprise administrator (Read only = No)     |- Owner on the billing profile for the enrollment </br> - Owner on all the invoice sections |
|Enterprise administrator | -  Reader on the billing profile for the enrollment </br> -  Reader on all the invoice sections |
|Department administrator  (Read only = No)    | * Owner on the invoice section created for their respective department      |
|Department administrator     | * Reader on the invoice section created for their respective department      |
|Account owner     | * Azure subscription creator on the invoice section created for their respective department |

An Azure Active Directory tenant is selected for the new billing account at the time of signing the Microsoft Customer Agreement. If a tenant doesn't exist for your organization, a new tenant is created. The tenant represents your organization within Azure Active Directory. It is a dedicated instance of the Azure AD service that your organization receives and owns. Administrators in your organization use the tenant to manage access of applications and data in your organization.

Your new account only supports billing administrators from the tenant that was selected while signing the Microsoft Customer Agreement. If billing administrators on your Enterprise Agreement enrollment are part of the tenant, they’ll get access to the new billing account during the transition. If they aren't part of the tenant, you must invite them to the tenant to give them access to the new billing account.

When you invite the billing administrators, they are added to the tenant as guest users and get access to the billing account, during the transition. To invite the users, guest access must be turned on for the tenant. For more information, see [Control guest access in Azure Active Directory](https://docs.microsoft.com/en-us/microsoftteams/teams-dependencies#control-guest-access-in-azure-active-directory). If the guest access is turned off, contact the Global Administrator of your tenant to turn it on. <!-- Todo - How can they find their global administrator -->

## Understand the transition

The billing of your Azure subscriptions and the access of your billing administrators are transitioned in the following order:

1. First, all enterprise administrators on your Enterprise Administrators enrollment are provided access to the billing profile created for your enrollment. Enterprise administrators added to your enrollment after this step do not get access to the billing profile.

1. Each department is selected one at a time.
     - An invoice section is created for the department.
     - Enterprise administrators, department administrators, and account owners are provided access to the invoice section.
     - If the department has a spending quota, a corresponding budget is created for the invoice section.
     - Billing of Azure subscriptions is transitioned from the department to the invoice section. Billing for Azure subscriptions that are created after this step does not transition to the new billing account. Charges for these subscriptions show on your Enterprise Agreement enrollment.

1. Azure subscriptions and Enterprise Agreement accounts that don't belong to a department are selected
    - An invoice section is created for all Azure subscriptions and accounts that do not belong to a department.
    - Enterprise administrators and account owners are provided access to the invoice section.
    - Billing of Azure subscriptions is transitioned to the invoice section. Billing for Azure subscriptions that are created after this step does not transition to the new billing account. Charges for these subscriptions show on your Enterprise Agreement enrollment.

1. When the billing for Azure subscriptions is transitioned, your Azure Reservations are moved to the new billing account. Your Azure subscriptions get reservation discounts throughout the transition. Azure Reservations that are purchased after this step don't move to the new billing account. Azure subscriptions in your new billing account don't get discounted through these Reservations.

Azure subscriptions and Reservations that are added to the Enterprise Agreement enrollment after the transition can be manually moved to the new billing account. For more information, see [Get billing ownership of Azure subscriptions from other users](#billing-mca-request-billing-ownership.md).

## Validate the billing account is set up properly

 Validate the following to ensure your new billing account is set up properly:

### Azure subscriptions

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-setup-account/billing-search-costmanagement+billing.png)

3. Select the billing profile. Depending on your access, you may need to select a billing account.  From the billing account, select **Billing profiles** and then the billing profile.
    <!--Todo Add a screenshot -->

4. Select **Azure subscriptions** from the left side.

All Azure subscriptions that are transitioned from your Enterprise Agreement enrollment to the new billing account are displayed on the Azure subscriptions page. If any subscriptions are missing, you can transition the billing of the subscription manually in the Azure portal. For more information, see [Get billing ownership of Azure subscriptions from other users](#billing-mca-request-billing-ownership.md).

### Azure Reservations

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-setup-account/billing-search-costmanagement+billing.png)

3. Select an invoice section. Depending on your access, you may need to select a billing account or a billing profile.  From the billing account or billing profile, select **Invoice sections** and then an invoice section.
    <!--Todo Add a screenshot -->

4. Select **All products** from the left side.

5. Search on **Reserved**.

Azure Reservations are displayed on the All products page. Repeat the steps for all the invoice sections to verify that all Azure Reservations are moved from your Enterprise Agreement enrollment. If any Azure Reservations are missing, you can move the Reservation manually to the new billing account in the Azure portal. For more information, see [Get billing ownership of Azure subscriptions from other users](#billing-mca-request-billing-ownership.md).

### Access of enterprise administrators from your Enterprise Agreement enrollment

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-setup-account/billing-search-costmanagement+billing.png)

3. Select the billing profile created for your enrollment. Depending on your access, you may need to select a billing account.  From the billing account, select **Billing profiles** and then the billing profile.
    <!--Todo Add a screenshot -->

4. Select **Access control (IAM)** from the left side.

Enterprise administrators are listed as Billing profile owners while the enterprise administrators with read-only permissions are listed as Billing profile readers.

### Access of department administrators and account owners from your Enterprise Agreement enrollment

1. Sign in to the [Azure portal](http://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-setup-account/billing-search-costmanagement+billing.png)

3. Select the billing profile created for your enrollment. Depending on your access, you may need to select a billing account.  From the billing account, select **Billing profiles** and then the billing profile.
    <!--Todo Add a screenshot -->

4. Select an invoice section. Invoice sections have the same name as their respective departments in Enterprise Agreement enrollments.
    <!--Todo Add a screenshot -->

5. Select **Access control (IAM)** from the left side.

Department administrators are listed as Invoice section owners while account owners in the departments are listed as Azure subscription creators. Repeat the step for all invoice sections to check all department administrators and account owners in your Enterprise Agreement enrollment. Account owners that weren't part of any department will get permission on an invoice section named **Default section**.

## Features replaced by the new billing account

The following Enterprise Agreement's features are replaced with new features in the billing account for a Microsoft Customer Agreement.

### Enterprise Agreement accounts

The accounts that were created in your Enterprise Agreement enrollment aren’t supported in the new billing account. The account's subscriptions belong to the invoice section created for their respective department. Account owners can create and manage subscriptions for their invoice sections.

### Notification contacts

Notification contacts are sent email communications about the Azure Enterprise Agreement. They are not supported in the new billing account. Emails about Azure credits and invoices are sent to users who have access to billing profiles in your billing account. <!-- Todo add link to alerts doc -->

### Spending quota

Spending quotas that were set for departments in your Enterprise Agreement enrollment are replaced with budgets in the new billing account. A budget is created for each spending quota set on departments in your enrollment. For more information on budgets, see [Create and manage Azure budgets](../cost-management/manage-budgets.md)

### Cost center

Cost center that were set on the Azure subscriptions in your Enterprise Agreement enrollment are carried over in the new billing account. However, cost centers for departments and Enterprise Agreement accounts aren't supported. <!-- Todo add alternative -->

## Helpful information

The following sections provide helpful information about setting up your billing account.

### Service downtime

There is no impact to service running in Azure subscriptions in your Enterprise Agreement enrollment. They will keep on running without any disruption during the transition.

### User access to services

Users access on Azure services and subscriptions that was set using Azure RBAC (role-based access control) is not affected during the transition.

### Azure Reservations

Billing for Azure Reservations in your Enterprise agreement enrollment is transitioned along with the subscriptions. During the transition, there won't be any changes to the reservation discounts that your subscriptions are getting.

### Azure Marketplace products

Billing for Azure Marketplace products in your Enterprise agreement enrollment is transitioned along with the subscriptions. There won't be any changes to the service access of the Marketplace products during the transition.

### Support plan

Support benefits don't transfer as part of the transition. Purchase a new support plan to get benefits for Azure subscriptions in your new billing account. <!-- Todo Verify this. Support plan is free for GA -->

### Past charges and balance

Charges and credits balance prior to transition can be viewed in your Enterprise Agreement enrollment through the Azure portal. <!--Todo - Add a link for this-->

### When should the setup be completed

Complete the setup of your billing account before your Enterprise Agreement enrollment expires. If your enrollment expires, services in your Azure subscriptions will still keep on running without disruption. However, you'll be charged retail rates for the services.

### Revert the transition

The transition is irreversible. Once the billing of your Azure subscriptions is transitioned to the new billing account, you can't revert it back to your Enterprise Agreement enrollment.

### Closing your browser during setup

Before you click on **Start transition**, you can close the browser. You can come back to the setup using the link you got in the email and start the transition. If you close the browser, after the transition is started, your transition will keep on running. You can come back to the transition status page. You'll get an email when the transition is completed.

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Validate the setup](#validate-the-billing-account-is-set-up-properly)

- [Get started with your new billing account](billing-mca-overview.md)

- [Learn how to perform common operations in your new billing account](billing-mca-overview.md) <!--Todo - update the link -->
