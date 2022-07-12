---
title: "Migrate from Diagnostic Settings Storage Retention to Azure Storage Lifecycle Policy"
description: "How to Migrate from Diagnostic Settings Storage Retention to Azure Storage Lifecycle Policy"
author:EdB-MSFT
ms.author: edbayansh
ms.topic: how-to
ms.reviewer: osalzbergms.
date: 07/10/2022

#Customer intent: As a dev-ops administrator I want to migrate my retention setting from diagnostic setting retention storage to azure storage lifecycle policy so that it continues to work after the feature has been deprecated.
---

# Migrate from Diagnostic Settings Storage Retention to Azure Storage Lifecycle Policy

This guide walks you through migrating from using the Diagnostic Settings Storage Retention feature to using Azure Storage Lifecycle Policy for retention.

The Diagnostic Settings Storage Retention feature is being deprecated. To configure retention for logs and metrics use [Azure Storage Lifecycle Management](azure/storage/blobs/lifecycle-management-policy-configure?tabs=azure-portal).

+ On September 30 2023, the Diagnostic Settings Storage Retention feature will no longer be available to configure new retention rules for log data. If you have configured retention setting, you will still be able to see them and change them.
+ On September 30 2024, you will no longer be able to use the API or Azure portal to configure retention setting unless you are change them to *0*.
+ On September 30, 2025 – All retention functionality for the Diagnostic Settings Storage Retention feature will be disabled across all environments.

## Prerequisites 
An existing diagnostic setting logging to a storage account.

## Migration Procedures

To migrate your diagnostics settings retention rules, followe the steps below:

1. 	Go to the Diagnostic Settings page for your logging resource and locate the diagnostic setting you wish to migrate
1.	Set the retention for your logged categories to *0*
1. Select **Save**
 :::image type="content" source="./media/retention-migration/diagnostics-settingssss.png" alt-text="A screen shot showing a diagnostics setting page.":::

1.	Navigate to the storage account you are logging to
1.	**Under Data management**, select **Lifecycle Management** to view or change lifecycle management policies
1.	Select List View, and select **Add a rule**
:::image type="content" source="./media/retention-migration/lifecycle-management.png" alt-text="A screen shot showing the lifecycle management screen for a storage account.":::
1. Enter a **Rule name**
1. Under **Rule Scope**, select **Limit blobs with filters**
1. Under **Blob Type**, select  **Append Blobs** and **Base blobs** under **Blob subtype**.
1. Select **Next**
:::image type="content" source="./media/retention-migration/lifecycle-management-add-rule-details.png" alt-text="A screen shot showing the details tab for adding a lifecycle rule.":::

1. Set your retention time, then select **Next**
:::image type="content" source="./media/retention-migration/lifecycle-management-add-rule-base-blobs.png" alt-text="A screen shot showing the Base blobs tab for adding a lifecycle rule.":::

1.	On the **Filters** tab >>>>>>>>>>>>>>>>>>>, scope your rule to the container for the logs you wish to set the retention for.
e.g. for all Function App logs, you could use container “insights-logs-functionapplogs” to set retention or all Function App logs, or “insights-logs-functionapplogs/resourceId=/SUBSCRIPTIONS/<SubscriptionId>/RESOURCEGROUPS/<ResourceGroup>/PROVIDERS/MICROSOFT.WEB/SITES/<FunctionAppName>”

1.	Save the rule.
:::image type="content" source="./media/retention-migration/lifecycle-management-add-rule-filter-set.png" alt-text="A screen shot showing the filters tab tab for adding a lifecycle rule.":::
