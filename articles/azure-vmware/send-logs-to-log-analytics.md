---
title: Send your Azure VMware Solution logs to Log Analytics
description: Learn about sending logs to log analytics.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/15/2022
---

# Send your Azure VMware Solution logs to Log Analytics

This article shows you how to send Azure VMware Solution logs to Azure Monitor Log Analytics. You can send logs from your AVS private cloud to your Log Analytics workspace, allowing you to take advantage of the Log Analytics feature set, including:

• Powerful querying capabilities with Kusto Query Language (KQL)

• Interactive report-creation capability based on your data, using Workbooks

...without having to get your logs out of the Microsoft ecosystem!

In the rest of this article, we’ll show you how easy it is to make this happen.

## How to set up Log Analytics

A Log Analytics workspace:

• Contains your AVS private cloud logs.

• Is the workspace from which you can take desired actions, such as querying for logs.

In this section, you’ll:

• Configure a Log Analytics workspace

• Create a diagnostic setting in your private cloud to send your logs to this workspace

### Create a resource

1. In the Azure portal, go to **Create a resource**.
2. Search for “Log Analytics Workspace” and click **Create** -> **Log Analytics Workspace**.

:::image type="content" source="media/send-logs-to-log-analytics/marketplace.png" alt-text="Screenshot of Create a resource.":::

### Set up your workspace

1. Enter the Subscription you intend to use, the Resource Group that’ll house this workspace. Give it a name and select a region. 
1. Click **Review** + **Create**.

:::image type="content" source="media/send-logs-to-log-analytics/create-workspace.png" alt-text="Screenshot of Marketplace.":::

### Add a diagnostic setting

Next, we add a diagnostic setting in your AVS private cloud, so it knows where to send your logs to.

:::image type="content" source="media/send-logs-to-log-analytics/private-cloud.png" alt-text="Screenshot of vh-private-cloud.":::

1. Click your AVS private cloud.
Go to Diagnostic settings on the left-hand menu under Monitoring.
Select **Add diagnostic setting**.
2. Give your diagnostic setting a name. 
Select the log categories you are interested in sending to your Log Analytics workspace.

3. Make sure to select the checkbox next to **Send to Log Analytics workspace**.
Select the Subscription your Log Analytics workspace lives in and the Log Analytics workspace.
Click **Save** on the top left.

:::image type="content" source="media/send-logs-to-log-analytics/diagnostic-setting.png" alt-text="Screenshot of Diagnostics settings.":::

At this point, your Log Analytics workspace has been successfully configured to receive logs from your AVS private cloud.

## Search and analyze logs using Kusto

Now that you’ve successfully configured your logs to go to your Log Analytics workspace, you can use that data to gain meaningful insights with Log Analytics’ search feature.
Log Analytics uses a language called the Kusto Query Language (or Kusto) to search through your logs.

For more information, see
[Data analysis in Azure Data Explorer with Kusto Query Language](/training/paths/data-analysis-data-explorer-kusto-query-language/).
