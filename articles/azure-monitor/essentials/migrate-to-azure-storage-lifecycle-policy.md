---
title: "Migrate diagnostic settings storage retention to Azure Storage lifecycle management"
description: "How to Migrate from diagnostic settings storage retention to Azure Storage lifecycle management"
author: EdB-MSFT
ms.author: edbaynash
ms.service: azure-monitor
ms.topic: how-to
ms.reviewer: lualderm
ms.date: 07/10/2022

#Customer intent: As a dev-ops administrator I want to migrate my retention setting from diagnostic setting retention storage to Azure Storage lifecycle management so that it continues to work after the feature has been deprecated.
---

# Migrate from diagnostic settings storage retention to Azure Storage lifecycle management

This guide walks you through migrating from using Azure diagnostic settings storage retention to using [Azure Storage lifecycle management](../../storage/blobs/lifecycle-management-policy-configure.md?tabs=azure-portal) for retention.

## Prerequisites

An existing diagnostic setting logging to a storage account.

## Migration Procedures

To migrate your diagnostics settings retention rules, follow the steps below:

1. Go to the Diagnostic Settings page for your logging resource and locate the diagnostic setting you wish to migrate
1. Set the retention for your logged categories to *0*
1. Select **Save**
 :::image type="content" source="./media/retention-migration/diagnostics-setting.png" alt-text="A screenshot showing a diagnostics setting page.":::

1. Navigate to the storage account you're logging to
1. Under **Data management**, select **Lifecycle Management** to view or change lifecycle management policies
1. Select List View, and select **Add a rule**
:::image type="content" source="./media/retention-migration/lifecycle-management.png" alt-text="A screenshot showing the lifecycle management screen for a storage account.":::
1. Enter a **Rule name**
1. Under **Rule Scope**, select **Limit blobs with filters**
1. Under **Blob Type**, select  **Append Blobs** and **Base blobs** under **Blob subtype**.
1. Select **Next**
:::image type="content" source="./media/retention-migration/lifecycle-management-add-rule-details.png" alt-text="A screenshot showing the details tab for adding a lifecycle rule.":::

1. Set your retention time, then select **Next**
:::image type="content" source="./media/retention-migration/lifecycle-management-add-rule-base-blobs.png" alt-text="A screenshot showing the Base blobs tab for adding a lifecycle rule.":::

1. On the **Filters** tab, under **Blob prefix** set path or prefix to the container or logs you want the retention rule to apply to.  
For example, for all Function App logs, you could use the container *insights-logs-functionapplogs* to set the retention for all Function App logs.
To set the rule for a specific subscription, resource group, and function app name, use *insights-logs-functionapplogs/resourceId=/SUBSCRIPTIONS/\<your subscription Id\>/RESOURCEGROUPS/\<your resource group\>/PROVIDERS/MICROSOFT.WEB/SITES/\<your function app name\>*.  

1. Select **Add** to save the rule.
:::image type="content" source="./media/retention-migration/lifecycle-management-add-rule-filter-set.png" alt-text="A screenshot showing the filters tab for adding a lifecycle rule.":::

## Next steps

[Configure a lifecycle management policy](../../storage/blobs/lifecycle-management-policy-configure.md?tabs=azure-portal).