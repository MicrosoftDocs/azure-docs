---
title: View and download Azure usage and charges
description: Learn how to download or view your Azure daily usage and charges, and see other available resources.
keywords: billing usage, usage charges, usage download, view usage, azure invoice, azure usage
author: Jkinma39
ms.author: jkinma
ms.reviewer: jkinma
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 01/17/2025
---

# View and download your Azure usage and charges

You can download a daily breakdown of your Azure usage and charges in the Azure portal. Only certain roles have permission to get Azure usage information, like the Account Administrator or Enterprise Administrator. To learn more about getting access to billing information, see [Manage access to Azure billing using roles](../manage/manage-billing-access.md).

If you have a Microsoft Customer Agreement (MCA), you must be a billing profile Owner, Contributor, Reader, or Invoice manager to view your Azure usage and charges. If you have a Microsoft Partner Agreement (MPA), only the [billing admin](/partner-center/account-settings/permissions-overview#billing-admin-role) and Admin Agent role in the partner organization Microsoft can view and download Azure usage and charges.

Based on the type of subscription that you use, options to download your usage and charges vary.

Your cost and usage data files show unrounded data. For more information about rounding, see [Cost rounding](../costs/understand-cost-mgt-data.md#cost-rounding).

If you want to get cost and usage data using the Azure CLI, see [Get usage data with the Azure CLI](../automate/get-usage-data-azure-cli.md).

## Download usage for MOSP billing accounts

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.  
    :::image type="content" border="true" source="./media/download-azure-daily-usage/portal-cm-billing-search.png" alt-text="Screenshot showing Azure portal search for Cost Management + Billing.":::
1. Depending on your access, you might need to select a Billing account or Billing profile.
1. In the left menu, select **Invoices** under **Billing**.
1. In the invoice grid, find the row of the billing period corresponding to the usage you want to download.
1. Select the **download icon** or the ellipsis (`...`) on the right.  
  :::image type="content" border="true" source="./media/download-azure-daily-usage/download-usage-others.png" alt-text="Screenshot showing the Cost Management + Billing Invoices page with the download option.":::  
1. The Download pane opens on the right. Select **Download** from the **Usage Details** section.  

## Download usage for EA customers

To view and download usage data as a EA customer, you must be an Enterprise Administrator, Account Owner, or Department Admin with the view charges policy enabled.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.  
    :::image type="content" border="true" source="./media/download-azure-daily-usage/portal-cm-billing-search.png" alt-text="Screenshot shows an Azure portal search.":::
1. If you have access to multiple billing accounts, select the billing scope for your EA billing account.
1. Select **Usage + charges**.
1. For the month you want to download, select **Download**.  
    :::image type="content" border="true" source="./media/download-azure-daily-usage/download-usage-ea.png" alt-text="Screenshot shows the Cost Management + Billing Invoices page for E A customers.":::
1. On the Download Usage + Charges page, under Usage Details, select the type of charges that you want to download from the list. Depending on your selection, the CSV file provides all charges (usage and purchases) including RI (reservation) purchases. Or, amortized charges (usage and purchases) including reservation purchases. 
    :::image type="content" source="./media/download-azure-daily-usage/select-usage-detail-charge-type.png" alt-text="Screenshot showing the Usage Details charge type selection to download." :::
1. Select **Prepare document**.
1.  It could take a while for Azure to prepare your download, depending on your monthly usage. When it's ready for download, select **Download csv**.

## Download usage for your Microsoft Customer Agreement

To view and download usage data for a billing profile, you must be a billing profile Owner, Contributor, Reader, or Invoice manager.

Use the following information to download your Azure usage file.

### Download usage file

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.
1. If necessary, select a billing scope.
1. On the billing scope overview page, at the bottom of the page under **Shortcuts**, select **Download usage and prices**.
1. On the Download usage and prices page, under **Azure usage file**, select **Prepare**. A notification message appears stating that the usage file is being prepared.
    :::image type="content" source="./media/download-azure-daily-usage/download-usage-prices.png" border="true" alt-text="Screenshot showing navigation to Download usage and prices." lightbox="./media/download-azure-daily-usage/download-usage-prices.png" :::
3. When the file is ready to download, select **Download**. If you missed the notification, you can view it from **Notifications** area in top right of the Azure portal (the bell symbol).

#### Calculate discount in the usage file

The usage file shows the following per-consumption line items:

- `costInBillingCurrency` (Column AU)
- `paygCostInBillingCurrency` (Column AX).

Use the information from the two columns to calculate your discount amount and discount percentage, as follows:

Discount amount = (AX – AU)

Discount percentage = (Discount amount / AX) * 100

## Get usage data with Azure CLI

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

Then use the [az costmanagement export](/cli/azure/costmanagement/export) commands to export usage data to an Azure storage account. You can download the data from there.

1. Create a resource group or use an existing resource group. To create a resource group, run the [az group create](/cli/azure/group#az-group-create) command:

   ```azurecli
   az group create --name TreyNetwork --location "East US"
   ```

1. Create a storage account to receive the exports or use an existing storage account. To create an account, use the [az storage account create](/cli/azure/storage/account#az-storage-account-create) command:

   ```azurecli
   az storage account create --resource-group TreyNetwork --name cmdemo
   ```

1. Run the [az costmanagement export create](/cli/azure/costmanagement/export#az-costmanagement-export-create) command to create the export:

   ```azurecli
   az costmanagement export create --name DemoExport --type Usage \
   --scope "subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e" --storage-account-id cmdemo \
   --storage-container democontainer --timeframe MonthToDate --storage-directory demodirectory
   ```

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Related content

To learn more about your invoice and usage charges, see:

- [Understand terms on your Microsoft Azure detailed usage](understand-usage.md)
- [Understand your bill for Microsoft Azure](review-individual-bill.md)
- [View and download your Microsoft Azure invoice](download-azure-invoice.md)
- [View and download your organization's Azure pricing](../manage/ea-pricing.md)

If you have a Microsoft Customer Agreement, see:

- [Understand terms on your Microsoft Customer Agreement Azure detailed usage](mca-understand-your-usage.md)
- [Understand the charges on your Microsoft Customer Agreement invoice](review-customer-agreement-bill.md)
- [View and download your Microsoft Azure invoice](download-azure-invoice.md)
- [View and download tax documents for your Microsoft Customer Agreement](mca-download-tax-document.md)
- [View and download your organization's Azure pricing](../manage/ea-pricing.md)
