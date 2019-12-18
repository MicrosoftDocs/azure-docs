---
title: Organize your invoice based on your needs - Azure
description: Learn how to organize cost on your invoice.
author: amberbhargava
manager: amberb
editor: banders
tags: billing
ms.service: billing
ms.topic: conceptual
ms.workload: na
ms.date: 10/01/2019
ms.author: banders
---

# Organize the costs for your billing account

Your billing account for Microsoft Customer Agreement provides you flexibility to organize your costs based on your needs whether it by department, project, or development environment. 

This article describes how you can use the Azure portal to organize your costs. It applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

## Use billing profiles and invoice sections to organize costs

In the billing account for a Microsoft Customer Agreement, you use billing profiles and invoice sections to organize your costs.

![Screenshot that shows mca billing hierarchy](./media/billing-mca-section-invoice/mca-hierarchy.png)

### Billing profile

A billing profile represents an invoice and the related billing information such as payment methods and billing address. A monthly invoice is generated at the beginning of the month for each billing profile in your account. The invoice contains charges for Azure subscriptions and other purchases such as Azure marketplace and App source products from the previous month.

A billing profile is automatically created for your billing account. You may create additional billing profiles to organize your costs in multiple monthly invoices. 

> [!IMPORTANT]
>
> Creating additional billing profiles may impact your overall costs of Azure usage. For more information, see [Things to consider before adding new billing profiles](#things-to-consider-before-adding-new-billing-profiles).

### Invoice section

An invoice section represents a grouping of costs in your invoice. An invoice section is automatically created for each billing profile in your account. You may create additional sections to organize your costs in sections on your invoice. 

Once you create an invoice section, you give others permission to create Azure subscriptions and buy products such as Azure marketplace and App source resources. Charges for these Azure subscriptions and products are displayed under this section of the invoice.

## Structure your billing account to organize your costs

This section describes common scenarios for organizing costs and the corresponding billing account structures:

|Scenario  |Structure  |
|---------|---------|
|Jack signs-up for Azure and wants a single monthly invoice. | A billing profile and an invoice section. This structure is automatically set up for Jack when he signs up for Azure and doesn't require any additional steps. |

![Info graphic for a simple billing scenario](./media/billing-mca-section-invoice/organize-billing-scenario1.png)

|Scenario  |Structure  |
|---------|---------|
|Contoso is a small organization that wants a single monthly invoice but group costs by their departments - marketing and finance.  | A billing profile for Contoso and an invoice section each for marketing and finance departments. |

![Info graphic for a simple billing scenario](./media/billing-mca-section-invoice/organize-billing-scenario2.png)

|Scenario  |Structure  |
|---------|---------|
|Fabrikam wants separate invoices for their engineering and marketing departments. For engineering department, they want to group costs by environments - productions and development.  | A billing profile each for marketing and finance departments. For marketing department, an invoice section each for production and development environment. |

![Info graphic for a simple billing scenario](./media/billing-mca-section-invoice/organize-billing-scenario3.png)

## Things to consider before adding new billing profiles

### Cost of Azure usage may increase

In your billing account for Microsoft Customer Agreement, Azure usage is aggregated monthly for each billing profile. The prices for Azure resources with tiered pricing are determined based on the usage for each billing profile separately. The usage is not aggregated across billing profiles when calculating the price. This may impact overall cost of Azure usage for accounts with multiple billing profiles.

Lets look at an example of how costs vary for two scenarios:

#### You only have one billing profile.

You're using Azure block blob storage, which costs USD .00184 per GB for first 50 terabyte (TB) and then .00177 per GB for next 450 terabyte (TB). You used 100 GB through subscriptions that are billed to your billing profile, here's how much you will be charged.


|  |Price per GB  | Amount |
|---------|---------|---------|
|Charges for first 50 GB     | .00184        | .092   |
|Charges for next 50 GB     |  .00177        | .0885   |
|Total     |       | .1805  

#### You have multiple billing profiles.

Now, let's assume you created another billing profile and used 50 GB through subscriptions in the first billing profile and 50 GB through subscriptions in the second billing profile, here's how much you will be charged.

|  |Price per GB  | Amount |
|---------|---------|---------|
|Charges for 50 GB through billing profile 1    | .00184        | .092   |
|Charges for 50 GB through billing profile 2   |  .00177        | .092     |
|Total     |       | .184

### Azure reservation benefits aren't shared across billing profiles

Azure reservations with shared scope are applied to subscriptions in a single billing profile and are not shared across billing profiles. For example, Contoso's billing account has two billing profiles. The first billing profile has two subscriptions, sub 1 and sub 2. The second billing profile only has one subscription, sub 3. If contoso buys an Azure reservation, they can apply the reservation to either sub 1 and sub 2 or just sub 3. The reservation can't be shared across billing profile so it can't be applied to all three subscriptions.

## Create an invoice section in the Azure portal

To create an invoice section, you need to be a **billing profile owner** or a **billing profile contributor**. For more information, see [Manage invoice sections for billing profile](billing-understand-mca-roles.md#manage-invoice-sections-for-billing-profile).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-section-invoice/billing-search-cost-management-billing.png)

3. Select **Billing profiles** from the left-hand pane. From the list, select a billing profile. You’ll see the new section on this billing profile's invoice. 

   ![Screenshot that shows billing profile list](./media/billing-mca-section-invoice/mca-select-profile.png)

4. Select **Invoice sections** from the left-hand pane and then select **Add** from the top of the page.

   ![Screenshot that shows adding invoice sections](./media/billing-mca-section-invoice/mca-list-invoice-sections.png)

5. Enter a name for the invoice section. 

   ![Screenshot that shows invoice section creation page](./media/billing-mca-section-invoice/mca-create-invoice-section.png)

6. Select **Create**.

## Create a billing profile in the Azure portal

To create a billing profile, you need to be a **billing account owner** or a **billing account contributor**. For more information, see [Manage billing profiles for billing account](billing-understand-mca-roles.md#manage-billing-profiles-for-billing-account).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-section-invoice/billing-search-cost-management-billing.png)

3. Select **Billing profiles** from the left-hand pane and then select **Add** from the top of the page.

   ![Screenshot that shows billing profile list](./media/billing-mca-section-invoice/mca-list-profiles.png)

4. Fill the form and click **Create**.

   ![Screenshot that shows invoice section creation page](./media/billing-mca-section-invoice/mca-add-profile.png)

    |Field  |Definition  |
    |---------|---------|
    |Name     | The display name that helps you easily identify the billing profile in the Azure portal.  |
    |PO number    | An optional purchase order number. The PO number will be displayed on the invoices for the billing profile. |
    |Billing address   | The billing address will be displayed on the invoices for the billing profile. |
    |Email invoice   | Check the email invoice box to receive the invoices for this billing profile by email. If you opt in, all users with owner, contributor, or invoice manager role on this billing profile will receive invoices by email.|

5. Select **Create**.

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Create an additional Azure subscription for Microsoft Customer Agreement](billing-mca-create-subscription.md)
- [Manage billing roles in the Azure portal](billing-understand-mca-roles.md#manage-billing-roles-in-the-azure-portal)
- [Get billing ownership of Azure subscriptions from users in other billing accounts](billing-mca-request-billing-ownership.md)
