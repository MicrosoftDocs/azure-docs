---
title: View and download Azure usage and charges
description: Learn how to download or view your Azure daily usage and charges, and see additional available resources.
keywords: billing usage, usage charges, usage download, view usage, azure invoice, azure usage
author: bandersmsft
ms.author: banders
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.custom: devx-track-azurecli
ms.date: 07/28/2020
---

# View and download your Azure usage and charges

You can download a daily breakdown of your Azure usage and charges in the Azure portal. You can also get your usage data using Azure CLI. Only certain roles have permission to get Azure usage information, like the Account Administrator or Enterprise Administrator. To learn more about getting access to billing information, see [Manage access to Azure billing using roles](../manage/manage-billing-access.md).

If you have a Microsoft Customer Agreement (MCA), you must be a billing profile Owner, Contributor, Reader, or Invoice manager to view your Azure usage and charges.  If you have a Microsoft Partner Agreement (MPA), only the Global Admin and Admin Agent role in the partner organization Microsoft can view and download Azure usage and charges.

Based on the type of subscription that you use, options to download your usage and charges vary.

## Download usage from the Azure portal (.csv)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.  
    ![Screenshot shows Azure portal search for Cost Management + Billing.](./media/download-azure-daily-usage/portal-cm-billing-search.png)
1. Depending on your access, you might need to select a Billing account or Billing profile.
1. In the left menu, select **Invoices** under **Billing**.
1. In the invoice grid, find the row of the billing period corresponding to the usage you want to download.
1. Select the **download icon** or the ellipsis (`...`) on the right.  
  ![Screenshot shows Cost Management + Billing Invoices page with download option.](./media/download-azure-daily-usage/download-usage-others.png)  
1. The Download pane opens on the right. Select **Download** from the **Usage Details** section.  

## Download usage for EA customers

To view and download usage data as a EA customer, you must be an Enterprise Administrator, Account Owner, or Department Admin with the view charges policy enabled.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for *Cost Management + Billing*.  
    ![Screenshot shows Azure portal search.](./media/download-azure-daily-usage/portal-cm-billing-search.png)
1. If you have access to multiple billing accounts, select the billing scope for your EA billing account.
1. Select **Usage + charges**.
1. For the month you want to download, select **Download**.  
    ![Screenshot shows Cost Management + Billing Invoices page for E A customers.](./media/download-azure-daily-usage/download-usage-ea.png)

## Download usage for your Microsoft Customer Agreement

To view and download usage data for a billing profile, you must be a billing profile Owner, Contributor, Reader, or Invoice manager.

### Download usage for billed charges

1. Search for **Cost Management + Billing**.
2. Select a billing profile.
3. Select **Invoices**.
4. In the invoice grid, find the row of the invoice corresponding to the usage you want to download.
5. Click on the ellipsis (`...`) at the end of the row.
6. In the download context menu, select **Azure usage and charges**.

### Download usage for open charges

You can also download month-to-date usage for the current billing period, meaning the charges have not been billed yet.

1. Search for **Cost Management + Billing**.
2. Select a billing profile.
3. In the **Overview** blade, click **Download Azure usage and charges**.

### Download usage for pending charges

If you have a Microsoft Customer Agreement, you can download month-to-date usage for the current billing period. These usage charges that have not been billed yet.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for *Cost Management + Billing*.
3. Select a billing profile. Depending on your access, you might need to select a billing account first.
4. In the **Overview** area, find the download links beneath the recent charges.
5. Select **Download usage and prices**.

## Get usage data with Azure CLI

Start by preparing your environment for the Azure CLI:

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

After you sign in, use the [az costmanagement query](/cli/azure/costmanagement#az_costmanagement_query) command to query month-to-date usage information for your subscription:

```azurecli
az costmanagement query --timeframe MonthToDate --type Usage \
   --scope "subscriptions/00000000-0000-0000-0000-000000000000"
```

You can also narrow the query by using the **--dataset-filter** parameter or other parameters:

```azurecli
az costmanagement query --timeframe MonthToDate --type Usage \
   --scope "subscriptions/00000000-0000-0000-0000-000000000000" \
   --dataset-filter "{\"and\":[{\"or\":[{\"dimension\":{\"name\":\"ResourceLocation\",\"operator\":\"In\",\"values\":[\"East US\",\"West Europe\"]}},{\"tag\":{\"name\":\"Environment\",\"operator\":\"In\",\"values\":[\"UAT\",\"Prod\"]}}]},{\"dimension\":{\"name\":\"ResourceGroup\",\"operator\":\"In\",\"values\":[\"API\"]}}]}"
```

The **--dataset-filter** parameter takes a JSON string or `@json-file`.

You also have the option of using the [az costmanagement export](/cli/azure/costmanagement/export) commands to export usage data to an Azure storage account. You can download the data from there.

1. Create a resource group or use an existing resource group. To create a resource group, run the [az group create](/cli/azure/group#az_group_create) command:

   ```azurecli
   az group create --name TreyNetwork --location "East US"
   ```

1. Create a storage account to receive the exports or use an existing storage account. To create an account, use the [az storage account create](/cli/azure/storage/account#az_storage_account_create) command:

   ```azurecli
   az storage account create --resource-group TreyNetwork --name cmdemo
   ```

1. Run the [az costmanagement export create](/cli/azure/costmanagement/export#az_costmanagement_export_create) command to create the export:

   ```azurecli
   az costmanagement export create --name DemoExport --type Usage \
   --scope "subscriptions/00000000-0000-0000-0000-000000000000" --storage-account-id cmdemo \
   --storage-container democontainer --timeframe MonthToDate --storage-directory demodirectory
   ```

## Need help? Contact us.

If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

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
