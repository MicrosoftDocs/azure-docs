---
title: Estimate storage costs for single-tenant Azure Logic Apps
description: Estimate storage costs for Standard logic app workflows using the Logic Apps Storage Calculator.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/20/2022
---

# Estimate storage costs for Standard logic app workflows in single-tenant Azure Logic Apps

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

Azure Logic Apps uses [Azure Storage](../storage/index.yml) for any storage operations. In traditional *multi-tenant* Azure Logic Apps, any storage usage and costs are attached to the logic app. Now, in *single-tenant* Azure Logic Apps, you can use your own storage account. These storage costs are listed separately in your Azure billing invoice. This capability gives you more flexibility and control over your logic app data.

> [!NOTE]
> This article applies to workflows in the single-tenant Azure Logic Apps environment. These workflows exist in the same logic app and in a single tenant that share the same storage. For more information, see [Single-tenant versus multi-tenant and integration service environment](single-tenant-overview-compare.md).

Storage costs change based on your workflows' content. Different triggers, actions, and payloads result in different storage operations and needs. This article describes how to estimate your storage costs when you're using your own Azure Storage account with single-tenant based logic apps. First, you can [estimate the number of storage operations you'll perform](#estimate-storage-needs) using the Logic Apps storage calculator. Then, you can [estimate your possible storage costs](#estimate-storage-costs) using these numbers in the Azure pricing calculator.

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A single-tenant based logic Apps workflow. You can create a workflow [using the Azure portal](create-single-tenant-workflows-azure-portal.md) or [using Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md). If you don't have a workflow yet, you can use the sample small, medium, and large workflows in the storage calculator.

* An Azure storage account that you want to use with your workflow. If you don't have a storage account, [create a storage account](../storage/common/storage-account-create.md)

## Get your workflow's JSON code

If you have a workflow to estimate, get the JSON code for your workflow:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to the **Logic apps** service, and select your workflow.

1. In your logic app's menu, under **Development tools**, select **Logic app code view**.

1. Copy the workflow's JSON code.

## Estimate storage needs

1. Go to the [Logic Apps storage calculator](https://logicapps.azure.com/calculator).

   :::image type="content" source="./media/estimate-storage-costs/storage-calculator.png" alt-text="Screenshot of Logic Apps storage calculator, showing input interface." lightbox="./media/estimate-storage-costs/storage-calculator.png":::

1. Enter, upload, or select the JSON code for a single-tenant based logic app workflow.

   * If you copied code in the previous section, paste it into the **Paste or upload workflow.json** box. 
   * If you have your **workflow.json** file saved locally, choose **Browse Files** under **Select workflow**. Choose your file, then select **Open**.
   * If you don't have a workflow yet, choose one of the sample workflows under **Select workflow**.

1. Review the options under **Advanced Options**. These settings depend on your workflow type and may include:

   * An option to enter the number of times your loops run.
   * An option to select all actions with payloads over 32 KB.

1. For **Monthly runs**, enter the number of times that you run your workflow each month.

1. Select **Calculate** and wait for the calculation to run.

1. Under **Storage Operation Breakdown and Calculation Steps**, review the **Operation Counts** estimates.

    You can see estimated operation counts by run and by month in the two tables. The following operations are shown:

    * **Blob (read)**, for Azure Blob Storage read operations.
    * **Blob (write)**, for Azure Blob Storage write operations.
    * **Queue**, for Azure Queues Queue Class 2 operations.
    * **Tables**, for Azure Table Storage operations.

    Each operation has a minimum, maximum and "best guess" count number. Choose the most relevant number to use for [estimating your storage operation costs](#estimate-storage-costs) based on your individual scenario. As a recommendation, use the "best guess" count for accuracy. However, you might also use the maximum count to make sure your cost estimate has a buffer.

    :::image type="content" source="./media/estimate-storage-costs/storage-calculator-results.png" alt-text="Screenshot of Logic Apps storage calculator, showing output with estimated operations." lightbox="./media/estimate-storage-costs/storage-calculator-results.png":::

## Estimate storage costs

After you've [calculated your logic app workflow's storage needs](#estimate-storage-needs), you can estimate your possible monthly storage costs. You can estimate prices for the following storage operation types:

* [Blob storage read and write operations](#estimate-blob-storage-operations-costs)
* [Queue storage operations](#estimate-queue-operations-costs)
* [Table storage operations](#estimate-table-operations-costs)

### Estimate blob storage operations costs

To estimate monthly costs for your logic app's blob storage operations:

1. Go to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

1. On the **Products** tab, select **Storage** &gt; **Storage Accounts**. Or, in the **Search Bar** search box, enter **Storage Accounts** and select the tile.

   :::image type="content" source="./media/estimate-storage-costs/pricing-calculator-storage-tile.png" alt-text="Screenshot of Azure pricing calculator, showing tile to add Storage Accounts view." lightbox="./media/estimate-storage-costs/pricing-calculator-storage-tile.png":::

1. On the **Storage Accounts added** notification, select **View** to see the **Storage Accounts** section of the calculator. Or, go to the **Storage Accounts** section manually.

1. For **Region**, select your logic app's region.

1. For **Type**, select **Block Blob Storage**.

1. For **Performance Tier**, select your performance tier.

1. For **Redundancy**, select your redundancy level.

1. Adjust any other settings as needed.

1. Under **Write Operations**, enter your **Blob (write)** operations number from the Logic Apps storage calculator *divided by 10,000*. This step is necessary because the calculator works in transactional units for storage operations.

1. Under **Read Operations**, enter your **Blob (read)** operations number from the Logic Apps storage calculator *divided by 10,000*. This step is necessary because the calculator works in transactional units for storage operations.

1. Review the estimated blob storage operations costs.

### Estimate queue operations costs

To estimate monthly costs for your logic app's queue operations:

1. Go to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

1. On the **Products** tab, select **Storage** &gt; **Storage Accounts**. Or, in the **Search Bar** search box, enter **Storage Accounts** and select the tile.

   :::image type="content" source="./media/estimate-storage-costs/pricing-calculator-storage-tile.png" alt-text="Screenshot of Azure pricing calculator, showing tile to add Storage Accounts view." lightbox="./media/estimate-storage-costs/pricing-calculator-storage-tile.png":::

1. On the **Storage Accounts added** notification, select **View** to see the **Storage Accounts** section of the calculator. Or, go to the **Storage Accounts** section manually.

1. For **Region**, select your logic app's region.

1. For **Type**, select **Queue Storage**.

1. For **Storage Account Type**, select your storage account type.

1. For **Redundancy**, select your redundancy level.

1. Under **Queue Class 2 operations**, enter your **Queue** operations number from the Logic Apps storage calculator *divided by 10,000*. This step is necessary because the calculator works in transactional units for queue operations.

1. Review the estimated queue operations costs.

### Estimate table operations costs

To estimate monthly costs for your logic app's table storage operations:

1. Go to the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

1. On the **Products** tab, select **Storage** &gt; **Storage Accounts**. Or, in the **Search Bar** search box, enter **Storage Accounts** and select the tile.

   :::image type="content" source="./media/estimate-storage-costs/pricing-calculator-storage-tile.png" alt-text="Screenshot of Azure pricing calculator, showing tile to add Storage Accounts view." lightbox="./media/estimate-storage-costs/pricing-calculator-storage-tile.png":::

1. On the **Storage Accounts added** notification, select **View** to see the **Storage Accounts** section of the calculator. Or, go to the **Storage Accounts** section manually.

1. For **Region**, select your logic app's region.

1. For **Type**, select **Table Storage**.

1. For **Tier**, select your performance tier.

1. For **Redundancy**, select your redundancy level.

1. Under **Storage transactions**, enter your **Table** operations number from the Logic Apps storage calculator *divided by 10,000*. This step is necessary because the calculator works in transactional units for queue operations.

1. Review the estimated table storage operations costs.

## Next step

> [!div class="nextstepaction"]
> [Plan and manage costs for Logic Apps](plan-manage-costs.md)