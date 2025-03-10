---
title: Organize your invoice based on your needs - Azure
description: Learn how to organize costs on your invoice. You can customize your billing account by creating billing profiles and invoice sections.
author: bandersmsft
ms.reviewer: amberb
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 01/22/2025
ms.author: banders
---

# Organize costs by customizing your billing account

Your billing account for Microsoft Customer Agreement (MCA) helps you organize your costs based on your needs whether it's by department, project, or development environment.

This article describes how you can use the Azure portal to organize your costs. It applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-access-to-a-microsoft-customer-agreement).

To learn how to organize costs for your billing account, watch the video [Organize costs and customize your Microsoft Customer Agreement billing account](https://www.youtube.com/watch?v=7RxTfShGHwU).

>[!VIDEO https://www.youtube.com/embed/7RxTfShGHwU]

## Structure your account with billing profiles and invoice sections

In the billing account for a Microsoft Customer Agreement, you use billing profiles and invoice sections to organize your costs.

:::image type="content" border="false" source="./media/mca-section-invoice/mca-hierarchy.png" alt-text="Diagram showing the Microsoft Customer Agreement billing hierarchy." lightbox="./media/mca-section-invoice/mca-hierarchy.png" :::

### Billing profile

A billing profile represents an invoice and the related billing information such as payment methods and billing address. A monthly invoice is generated at the beginning of the month for each billing profile in your account. The invoice contains charges for Azure usage and other purchases from the previous month.

A billing profile is automatically created along with your billing account when you sign up for Azure. You can create more billing profiles to organize your costs in multiple monthly invoices.

> [!IMPORTANT]
>
> Creating multiple billing profiles might impact your overall cost. For more information, see [Things to consider when adding new billing profiles](#things-to-consider-when-adding-new-billing-profiles).

### Invoice section

An invoice section represents a grouping of costs in your invoice. An invoice section is automatically created for each billing profile in your account. You can create more sections to organize your costs based on your needs. Each invoice section is shown on the invoice with the charges incurred that month.

The following image shows an invoice with two invoice sections - Engineering and Marketing. The summary and detail charges for each section is shown in the invoice. The prices shown in the image are examples. They don't represent the actual prices of Azure services.

:::image type="content" border="true" source="./media/mca-section-invoice/mca-invoice-with-sections.png" alt-text="Screenshot showing an invoice with sections." lightbox="./media/mca-section-invoice/mca-invoice-with-sections.png" :::

## Billing account structure for common scenarios

This section describes common scenarios for organizing costs and corresponding billing account structures:

|Scenario  |Structure  |
|---------|---------|
|The Jack user signs up for Azure and needs a single monthly invoice. | A billing profile and an invoice section. This structure is automatically set up for Jack when he signs up for Azure and doesn't require any other steps. |

:::image type="content" border="false" source="./media/mca-section-invoice/organize-billing-scenario1.png" alt-text="Diagram showing a single billing scenario." lightbox="./media/mca-section-invoice/organize-billing-scenario1.png" :::

|Scenario  |Structure  |
|---------|---------|
|Contoso is a small organization that needs a single monthly invoice but group costs by their departments - marketing and engineering.  | A billing profile for Contoso and an invoice section each for marketing and engineering departments. |

:::image type="content" border="false" source="./media/mca-section-invoice/organize-billing-scenario2.png" alt-text="Diagram showing a multiple billing scenario." lightbox="./media/mca-section-invoice/organize-billing-scenario2.png" :::

|Scenario  |Structure  |
|---------|---------|
|Fabrikam is a mid-size organization that needs separate invoices for their engineering and marketing departments. For engineering department, they want to group costs by environments - production and development.  | A billing profile each for marketing and engineering departments. For engineering department, an invoice section each for production and development environment. |

:::image type="content" border="false" source="./media/mca-section-invoice/organize-billing-scenario3.png" alt-text="Diagram showing a multiple billing scenario, with separate billing for production and development environments." lightbox="./media/mca-section-invoice/organize-billing-scenario3.png" :::

## Create a new invoice section

To create an invoice section, you need to be a **billing profile owner** or a **billing profile contributor**. For more information, see [Manage invoice sections for billing profile](understand-mca-roles.md#manage-invoice-sections-for-billing-profile).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   :::image type="content" border="true" source="./media/mca-section-invoice/search-cmb.png" alt-text="Screenshot showing search in the Azure portal for Cost Management + Billing.":::

3. Select **Billing profiles** from the left-hand pane. From the list, select a billing profile. The new section is shown on the selected billing profile's invoice.

   :::image type="content" border="true" source="./media/mca-section-invoice/mca-select-profile.png" lightbox="./media/mca-section-invoice/mca-select-profile-zoomed-in.png" alt-text="Screenshot that shows billing profile list.":::

4. Select **Invoice sections** from the left-hand pane and then select **Add** from the top of the page.

   :::image type="content" border="true" source="./media/mca-section-invoice/mca-list-invoice-sections.png" lightbox="./media/mca-section-invoice/mca-list-invoice-sections-zoomed-in.png" alt-text="Screenshot that shows adding invoice sections.":::

5. Enter a name for the invoice section.

   :::image type="content" border="true" source="./media/mca-section-invoice/mca-create-invoice-section.png" lightbox="./media/mca-section-invoice/mca-create-invoice-section-zoomed-in.png" alt-text="Screenshot that shows the invoice section creation page.":::

6. Select **Create**.

## Create a new billing profile

To create a billing profile, you need to be a **billing account owner** or a **billing account contributor**. For more information, see [Manage billing profiles for billing account](understand-mca-roles.md#manage-billing-profiles-for-billing-account).

> [!IMPORTANT]
>
> Creating multiple billing profiles may impact your overall cost. For more information, see [Things to consider when adding new billing profiles](#things-to-consider-when-adding-new-billing-profiles).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   :::image type="content" border="true" source="./media/mca-section-invoice/search-cmb.png" alt-text="Screenshot that shows search in the Azure portal for Cost Management + billing.":::

3. Select **Billing profiles** from the left-hand pane and then select **Add** from the top of the page.

   :::image type="content" border="true" source="./media/mca-section-invoice/mca-list-profiles.png" lightbox="./media/mca-section-invoice/mca-list-profiles-zoomed-in.png" alt-text="Screenshot that shows a billing profile list with Add selected.":::

4. Fill the form and select **Create**.

   :::image type="content" border="true" source="./media/mca-section-invoice/mca-add-profile.png" lightbox="./media/mca-section-invoice/mca-add-profile-zoomed-in.png" alt-text="Screenshot that shows the billing profile creation page.":::

    |Field  |Definition  |
    |---------|---------|
    |Name     | A display name that helps you easily identify the billing profile in the Azure portal.  |
    |PO number    | An optional purchase order number. The PO number is displayed on the invoices generated for the billing profile. |
    |Bill to  | The bill to information is displayed on the invoices generated for the billing profile. |
    |Email invoice   | Check the email invoice box to receive the invoices for this billing profile by email. If you don't opt in, you can view and download the invoices in the Azure portal.|

5. Select **Create**.

## Link charges to invoice sections and billing profiles

Once you customized your billing account based on your needs, you can link subscriptions and other products to your desired invoice section and billing profile.

### Link a new subscription

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Subscriptions**.

   :::image type="content" border="true" source="./media/mca-section-invoice/search-subscriptions.png" lightbox="./media/mca-section-invoice/search-subscriptions.png" alt-text="Screenshot that shows a search for a subscription.":::

3. Select **Add** from the top of the page.

   :::image type="content" border="true" source="./media/mca-section-invoice/subscription-add.png" alt-text="Screenshot that shows the Add option in the Subscriptions view for a new subscription." lightbox="./media/mca-section-invoice/subscription-add.png" :::

4. If you have access to multiple billing accounts, select your Microsoft Customer Agreement billing account.

   :::image type="content" border="true" source="./media/mca-section-invoice/mca-create-azure-subscription.png" alt-text="Screenshot that shows the Create subscription page.":::

5. Select the billing profile that is billed for the subscription's usage. The charges for Azure usage and other purchases for this subscription are billed to the selected billing profile's invoice.

6. Select the invoice section to link the subscription's charges. The charges are displayed under this section on the billing profile's invoice.

7. Select an Azure plan and enter a friendly name for your subscription.

9. Select **Create**.  

### Link existing subscriptions and products

If you have existing Azure subscriptions or other products such as Azure Marketplace and App source resources, you can move them from their existing invoice section to another invoice section to reorganize your costs. However, you can't change the invoice section for a reservation, savings plan, or seat-based subscriptions.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search for **Cost Management + Billing**.

   :::image type="content" border="true" source="./media/mca-section-invoice/search-cmb.png" alt-text="Screenshot that shows search in the Azure portal for Cost Management + Billing.":::

3. To link a subscription to a new invoice section, select **Azure subscriptions** from the left-side of the screen. For other products such as Azure Marketplace and App source resources, select **Recurring charges**.

   :::image type="content" border="true" source="./media/mca-section-invoice/mca-select-change-invoice-section.png" lightbox="./media/mca-section-invoice/mca-select-change-invoice-section-zoomed-in.png" alt-text="Screenshot that shows the option to change an invoice section.":::

4. In the page, select the ellipsis (three dots) for the subscription or product that you want to link to a new invoice section. Select **Change invoice section**.

5. Select the new billing profile and the invoice section from the dropdown.

    :::image type="content" border="true" source="./media/mca-section-invoice/mca-select-new-invoice-section.png" lightbox="./media/mca-section-invoice/mca-select-new-invoice-section-zoomed-in.png" alt-text="Screenshot that shows selecting a new invoice section.":::

6. Select **Save**.

## Things to consider when adding new billing profiles

The following sections describe how adding new billing profiles might impact your overall cost.

### Azure usage charges might be impacted

In your billing account for a Microsoft Customer Agreement, Azure usage is aggregated monthly for each billing profile. The prices for Azure resources with tiered pricing are determined based on the usage for each billing profile separately. The usage isn't aggregated across billing profiles when calculating the price. This situation might impact overall cost of Azure usage for accounts with multiple billing profiles.

Let's look at an example of how costs vary for different scenarios. The prices used in the scenarios are examples. They don't represent the actual prices of Azure services.

#### You only have one billing profile

Let's assume you're using Azure block blob storage, which costs USD .00184 per GB for first 50 terabytes (TB) and then .00177 per GB for next 450 terabytes (TB). You used 100 TB in the subscriptions that are billed to your billing profile, here's how much you would be charged.

|  Tier pricing (USD) |Quantity | Amount (USD)|
|---------|---------|---------|
|1.84 per TB for the first 50 TB/month    | 50 TB        | 92.0   |
|1.77 per TB for the next 450 TB/month    |  50 TB         | 88.5   |
|Total     |     100 TB  | 180.5

The total charges for using 100 TB of data in this scenario is **180.5**

#### You have multiple billing profiles

Now, let's assume you created another billing profile. You used 50 TB through subscriptions that are billed to the first billing profile. You also used 50 TB through subscriptions that are billed to the second billing profile. Here's how much you would be charged:

Charges for the first billing profile:

|  Tier pricing (USD) |Quantity | Amount (USD)|
|---------|---------|---------|
|1.84 per TB for the first 50 TB/month    | 50 TB        | 92.0  |
|1.77 per TB for the next 450 TB/month    |  0 TB         | 0.0  |
|Total     |     50 TB  | 92.0

Charges for the second billing profile:

|  Tier pricing (USD) |Quantity | Amount (USD)|
|---------|---------|---------|
|1.84 per TB for the first 50 TB/month    | 50 TB        | 92.0  |
|1.77 per TB for the next 450 TB/month    |  0 TB         | 0.0  |
|Total     |     50 TB  | 92.0

The total charges for using 100 TB of data in this scenario is **184.0** (92.0 * 2).

### Billing profile alignment and currency usage in MCA markets

The billing profile's sold-to and bill-to country/region must correspond to the MCA market country/region. You can create billing profiles billed through the MCA market currency to allow consumption from another country/region while paying directly to MCA in the MCA market currency.

Here's an example of how billing profiles are aligned with the MCA market currency:

Belgium entities are created in the billing profile and the invoice country/region is designated as Netherlands. The bill-to address set as the Netherlands entity and the sold-to address is set to the Belgium entity residing in Netherlands.

In this example, the Netherlands VAT ID should be used. If the company in Belgium prefers, they can pay Microsoft directly using the Netherlands bank payment information.

### Azure reservation benefits might not apply to all subscriptions

Azure reservations with shared scope are applied to subscriptions in a single billing profile and aren't shared across billing profiles.

:::image type="content" border="false" source="./media/mca-section-invoice/mca-reservations-benefits-by-bg.png" alt-text="Diagram showing reservation application for different billing account structures." lightbox="./media/mca-section-invoice/mca-reservations-benefits-by-bg.png":::

In the above image, Contoso has two subscriptions. The Azure Reservation benefit is applied differently depending on how the billing account is structured. In the scenario on the left, the reservation benefit is applied to both subscriptions being billed to the engineering billing profile. In the scenario on the right, the reservation benefit is only applied to subscription 1 since it’s the only subscription being billed to the engineering billing profile.

## Check access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../../includes/billing-check-mca.md)]

## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.

## Related content

- [Create a more Azure subscriptions for Microsoft Customer Agreement](create-subscription.md)
- [Manage billing roles in the Azure portal](understand-mca-roles.md#manage-billing-roles-in-the-azure-portal)
- [Get billing ownership of Azure subscriptions from users in other billing accounts](mca-request-billing-ownership.md)
