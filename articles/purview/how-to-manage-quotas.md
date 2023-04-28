---
title: Manage resources and quotas
titleSuffix: Microsoft Purview
description: Learn about the quotas and limits on resources for Microsoft Purview and how to request quota increases.
author: whhender
ms.author: whhender
ms.service: purview
ms.topic: conceptual
ms.date: 02/17/2023
---
 
# Manage and increase quotas for resources with Microsoft Purview
 
This article highlights the limits that currently exist in the Microsoft Purview service. These limits are also known as quotas.

## Microsoft Purview limits
 
|**Resource**|  **Default Limit**  |**Maximum Limit**|
|---|---|---|
|Microsoft Purview accounts per region, per tenant (all subscriptions combined)|3|Contact Support|
|Data Map throughput^ <br><small>There's no default limit on the data map metadata storage</small>| 10 capacity units <br><small>250 operations per second</small> | 100 capacity units <br><small>2,500 operations per second</small> |
|vCores available for scanning, per account*|160|160|
|Concurrent scans per Purview account. The limit is based on the type of data sources scanned*|5 | 10 |
|Maximum time that a scan can run for|7 days|7 days|
|Size of assets per account|100M physical assets |Contact Support|
|Maximum size of an asset in a catalog|2 MB|2 MB|
|Maximum length of an asset name and classification name|4 KB|4 KB|
|Maximum length of asset property name and value|32 KB|32 KB|
|Maximum length of classification attribute  name and value|32 KB|32 KB|
|Maximum number of glossary terms, per account|100K|100K|
|Maximum number of self-service policies, per account|3K|3K|

\* Self-hosted integration runtime scenarios aren't included in the limits defined in the above table.

^ Increasing the data map throughput limit also increases the minimum number of capacity units with no usage. See [Data Map throughput](concept-elastic-data-map.md) for more info.
 
## Request quota increase

Use the following steps to create a new support request from the Azure portal to increase quota for Microsoft Purview. You can create a quota request for Microsoft Purview accounts in a subscription, accounts in a tenant and the data map throughput of a specific account. 

1. On  the [Azure portal](https://portal.azure.com) menu, select **Help + support**.

    :::image type="content" source="./media/how-to-manage-quotas/help-plus-support.png" alt-text="Screenshot showing how to navigate to help and support" border="true":::

1. In **Help + support**, select **New support request**.

    :::image type="content" source="./media/how-to-manage-quotas/create-new-support-request.png" alt-text="Screenshot showing how to create new support request" border="true":::

1. For **Issue type**, select **Service and subscription limits (quotas)**.

1. For **Subscription**, select the subscription whose quota you want to increase.

1. For **Quota type**, select Microsoft Purview. Then select **Next**.

    :::image type="content" source="./media/how-to-manage-quotas/enter-support-details.png" alt-text="Screenshot showing how to enter support information" border="true":::

1. In the **Details** window, select **Enter details** to enter additional information.
1. Choose your **Quota type**, scope (either location or account) and what you wish the new limit to be

    :::image type="content" source="./media/how-to-manage-quotas/enter-quota-amount.png" alt-text="Screenshot showing how to enter quota amount for Microsoft Purview accounts per subscription" border="true":::

1. Enter the rest of the required support information. Review and create the support request

## Next steps
 
> [!div class="nextstepaction"]
>[Concept: Elastic Data Map in Microsoft Purview](concept-elastic-data-map.md)

> [!div class="nextstepaction"]
>[Tutorial: Scan data with Microsoft Purview](tutorial-scan-data.md)

> [!div class="nextstepaction"]
>[Tutorial: Navigate the home page and search for an asset](tutorial-asset-search.md)

> [!div class="nextstepaction"]
>[Tutorial: Browse assets and view their lineage](tutorial-browse-and-view-lineage.md)
