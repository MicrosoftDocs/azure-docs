---
title: Organize your invoice based on your needs - Azure
description: Learn how to organize costs on your invoice. You can customize your billing account by creating billing profiles and invoice sections.
author: bandersmsft
ms.reviewer: amberb
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 06/30/2023
ms.author: banders
---

# Organize costs by customizing your billing account

Your billing account for Microsoft Customer Agreement provides you flexibility to organize your costs based on your needs whether it's by department, project, or development environment.

This article describes how you can use the Azure portal to organize your costs. It applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

Watch the [Organize costs by customizing your Microsoft Customer Agreement billing account](https://www.youtube.com/watch?v=7RxTfShGHwU) video to learn how to organize costs for your billing account.

>[!VIDEO https://www.youtube.com/embed/7RxTfShGHwU]

## Structure your account with billing profiles and invoice sections

In the billing account for a Microsoft Customer Agreement, you use billing profiles and invoice sections to organize your costs.

![Screenshot that shows Microsoft Customer Agreement billing hierarchy](./media/mca-section-invoice/mca-hierarchy.png)

### Billing profile

A billing profile represents an invoice and the related billing information such as payment methods and billing address. A monthly invoice is generated at the beginning of the month for each billing profile in your account. The invoice contains charges for Azure usage and other purchases from the previous month.

A billing profile is automatically created along with your billing account when you sign up for Azure. You may create additional billing profiles to organize your costs in multiple monthly invoices.

> [!IMPORTANT]
>
> Creating additional billing profiles may impact your overall cost. For more information, see [Things to consider when adding new billing profiles](#things-to-consider-when-adding-new-billing-profiles).

### Invoice section

An invoice section represents a grouping of costs in your invoice. An invoice section is automatically created for each billing profile in your account. You may create additional sections to organize your costs based on your needs. Each invoice section is displayed on the invoice with the charges incurred that month.

The image below shows an invoice with two invoice sections - Engineering and Marketing. The summary and detail charges for each section is displayed in the invoice. The prices shown in the image are for example purposes only and don't represent the actual prices of Azure services.

![Image showing an invoice with sections](./media/mca-section-invoice/mca-invoice-with-sections.png)

## Billing account structure for common scenarios

This section describes common scenarios for organizing costs and corresponding billing account structures:

|Scenario  |Structure  |
|---------|---------|
|Jack signs-up for Azure and needs a single monthly invoice. | A billing profile and an invoice section. This structure is automatically set up for Jack when he signs up for Azure and doesn't require any additional steps. |

![Info graphic for a single billing scenario.](./media/mca-section-invoice/organize-billing-scenario1.png)

|Scenario  |Structure  |
|---------|---------|
|Contoso is a small organization that needs a single monthly invoice but group costs by their departments - marketing and engineering.  | A billing profile for Contoso and an invoice section each for marketing and engineering departments. |

![Info graphic for a multiple billing scenario.](./media/mca-section-invoice/organize-billing-scenario2.png)

|Scenario  |Structure  |
|---------|---------|
|Fabrikam is a mid-size organization that needs separate invoices for their engineering and marketing departments. For engineering department, they want to group costs by environments - production and development.  | A billing profile each for marketing and engineering departments. For engineering department, an invoice section each for production and development environment. |

![Info graphic for a multiple billing scenario, with separate billing for production and development environments.](./media/mca-section-invoice/organize-billing-scenario3.png)

## Create a new invoice section

To create an invoice section, you need to be a **billing profile owner** or a **billing profile contributor**. For more information, see [Manage invoice sections for billing profile](understand-mca-roles.md#manage-invoice-sections-for-billing-profile).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   ![Screenshot that shows search in portal for cost management + billing](./media/mca-section-invoice/search-cmb.png)

3. Select **Billing profiles** from the left-hand pane. From the list, select a billing profile. The new section will be displayed on the selected billing profile's invoice.

   [![Screenshot that shows billing profile list.](./media/mca-section-invoice/mca-select-profile.png)](./media/mca-section-invoice/mca-select-profile-zoomed-in.png#lightbox)

4. Select **Invoice sections** from the left-hand pane and then select **Add** from the top of the page.

   [![Screenshot that shows adding invoice sections](./media/mca-section-invoice/mca-list-invoice-sections.png)](./media/mca-section-invoice/mca-list-invoice-sections-zoomed-in.png#lightbox)

5. Enter a name for the invoice section.

   [![Screenshot that shows invoice section creation page](./media/mca-section-invoice/mca-create-invoice-section.png)](./media/mca-section-invoice/mca-create-invoice-section-zoomed-in.png#lightbox)

6. Select **Create**.

## Create a new billing profile

To create a billing profile, you need to be a **billing account owner** or a **billing account contributor**. For more information, see [Manage billing profiles for billing account](understand-mca-roles.md#manage-billing-profiles-for-billing-account).

> [!IMPORTANT]
>
> Creating additional billing profiles may impact your overall cost. For more information, see [Things to consider when adding new billing profiles](#things-to-consider-when-adding-new-billing-profiles).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   ![Screenshot that shows search in portal for cost management + billing](./media/mca-section-invoice/search-cmb.png)

3. Select **Billing profiles** from the left-hand pane and then select **Add** from the top of the page.

   [![Screenshot that shows billing profile list with Add selected.](./media/mca-section-invoice/mca-list-profiles.png)](./media/mca-section-invoice/mca-list-profiles-zoomed-in.png#lightbox)

4. Fill the form and select **Create**.

   [![Screenshot that shows billing profile creation page](./media/mca-section-invoice/mca-add-profile.png)](./media/mca-section-invoice/mca-add-profile-zoomed-in.png#lightbox)

    |Field  |Definition  |
    |---------|---------|
    |Name     | A display name that helps you easily identify the billing profile in the Azure portal.  |
    |PO number    | An optional purchase order number. The PO number will be displayed on the invoices generated for the billing profile. |
    |Bill to  | The bill to will be displayed on the invoices generated for the billing profile. |
    |Email invoice   | Check the email invoice box to receive the invoices for this billing profile by email. If you don't opt in, you can view and download the invoices in the Azure portal.|

5. Select **Create**.

## Link charges to invoice sections and billing profiles

Once you have customized your billing account based on your needs, you can link subscriptions and other products to your desired invoice section and billing profile.

### Link a new subscription

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Subscriptions**.

   [![Screenshot that shows search for subscription in the Azure portal.](./media/mca-section-invoice/search-subscriptions.png)](./media/mca-section-invoice/search-subscriptions.png#lightbox)

3. Select **Add** from the top of the page.

   ![Screenshot that shows the Add button in Subscriptions view for a new subscription.](./media/mca-section-invoice/subscription-add.png)

4. If you have access to multiple billing accounts, select your Microsoft Customer Agreement billing account.

   ![Screenshot that shows the Create subscription pane.](./media/mca-section-invoice/mca-create-azure-subscription.png)

5. Select the billing profile that will be billed for the subscription's usage. The charges for Azure usage and other purchases for this subscription will be billed to the selected billing profile's invoice.

6. Select the invoice section to link the subscription's charges. The charges will be displayed under this section on the billing profile's invoice.

7. Select an Azure plan and enter a friendly name for your subscription.

9. Select **Create**.  

### Link existing subscriptions and products

If you have existing Azure subscriptions or other products such as Azure Marketplace and App source resources, you can move them from their existing invoice section to another invoice section to reorganize your costs. However, you can't change the invoice section for a reservation or savings plan.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   ![Screenshot that shows search in the Azure portal for Cost Management + Billing.](./media/mca-section-invoice/search-cmb.png)

3. To link a subscription to a new invoice section, select **Azure subscriptions** from the left-side of the screen. For other products such as Azure Marketplace and App source resources, select **Recurring charges**.

   [![Screenshot that shows the option to change invoice section](./media/mca-section-invoice/mca-select-change-invoice-section.png)](./media/mca-section-invoice/mca-select-change-invoice-section-zoomed-in.png#lightbox)

4. In the page, select the ellipsis (three dots) for the subscription or product that you want to link to a new invoice section. Select **Change invoice section**.

5. Select the new billing profile and the invoice section from the dropdown.

    [![Screenshot that shows selecting a new invoice section](./media/mca-section-invoice/mca-select-new-invoice-section.png)](./media/mca-section-invoice/mca-select-new-invoice-section-zoomed-in.png#lightbox)

6. Select **Save**.

## Things to consider when adding new billing profiles

### Azure usage charges may be impacted

In your billing account for a Microsoft Customer Agreement, Azure usage is aggregated monthly for each billing profile. The prices for Azure resources with tiered pricing are determined based on the usage for each billing profile separately. The usage is not aggregated across billing profiles when calculating the price. This may impact overall cost of Azure usage for accounts with multiple billing profiles.

Let's look at an example of how costs vary for two scenarios. The prices used in the scenarios are for example purposes only and don't represent the actual prices of Azure services.

#### You only have one billing profile.

Let's assume you're using Azure block blob storage, which costs USD .00184 per GB for first 50 terabytes (TB) and then .00177 per GB for next 450 terabytes (TB). You used 100 TB in the subscriptions that are billed to your billing profile, here's how much you would be charged.

|  Tier pricing (USD) |Quantity | Amount (USD)|
|---------|---------|---------|
|1.84 per TB for the first 50 TB/month    | 50 TB        | 92.0   |
|1.77 per TB for the next 450 TB/month    |  50 TB         | 88.5   |
|Total     |     100 TB  | 180.5

The total charges for using 100 TB of data in this scenario is **180.5**

#### You have multiple billing profiles.

Now, let's assume you created another billing profile and used 50 TB through subscriptions that are billed to the first billing profile and 50 TB through subscriptions that are billed to the second billing profile, here's how much you would be charged.

`Charges for the first billing profile`

|  Tier pricing (USD) |Quantity | Amount (USD)|
|---------|---------|---------|
|1.84 per TB for the first 50 TB/month    | 50 TB        | 92.0  |
|1.77 per TB for the next 450 TB/month    |  0 TB         | 0.0  |
|Total     |     50 TB  | 92.0

`Charges for the second billing profile`

|  Tier pricing (USD) |Quantity | Amount (USD)|
|---------|---------|---------|
|1.84 per TB for the first 50 TB/month    | 50 TB        | 92.0  |
|1.77 per TB for the next 450 TB/month    |  0 TB         | 0.0  |
|Total     |     50 TB  | 92.0

The total charges for using 100 TB of data in this scenario is **184.0** (92.0 * 2).

### Azure reservation benefits might not apply to all subscriptions

Azure reservations with shared scope are applied to subscriptions in a single billing profile and are not shared across billing profiles.

![Info graphic for reservation application for different billing account structure](./media/mca-section-invoice/mca-reservations-benefits-by-bg.png)

In the above image, Contoso has two subscriptions. The Azure Reservation benefit is applied differently depending on how the billing account is structured. In the scenario on the left, the reservation benefit is applied to both subscriptions being billed to the engineering billing profile. In the scenario on the right, the reservation benefit will only be applied to subscription 1 since it’s the only subscription being billed to the engineering billing profile.

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Next steps

- [Create an additional Azure subscription for Microsoft Customer Agreement](create-subscription.md)
- [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal)
- [Get billing ownership of Azure subscriptions from users in other billing accounts](mca-request-billing-ownership.md)
