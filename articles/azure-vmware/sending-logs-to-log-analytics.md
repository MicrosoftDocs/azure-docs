---
title: Sending your Azure VMware Solution logs to Log Analytics
description: Learn about sending logs to log analytics.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/07/2022
---

# Sending your Azure VMware Solution logs to Log Analytics
You can now send your Azure VMware Solution logs to Azure Monitor Log Analytics, adding another tool to your toolkit in addition to Azure Blob Storage, Azure Event Hub, and third-party solutions. Configuring such a tool has never been easier! In this article, we’ll show how you can send logs from your AVS private cloud to your Log Analytics workspace, allowing you to take advantage of the rich feature set Log Analytics has to offer - from powerful querying capabilities with Kusto Query Language (KQL) to creating interactive reports with your data using Workbooks - without having to get your logs out of the Microsoft ecosystem.
Once configured, you can take advantage of Log Analytics’ rich feature set, including:

• Powerful querying capabilities with Kusto Query Language (KQL)

• Interactive report-creation capability based on your data, using Workboooks

...Without having to get your logs out of the Microsoft ecosystem!

In the rest of this article, we’ll show you how easy it is to make this happen.

## How to Set Up Log Analytics

In this section, you’ll:

• Configure a Log Analytics workspace
• Create a diagnostic setting in your private cloud to send your logs to this workspace

A Log Analytics workspace:

• Contains your AVS private cloud logs.
• Is the workspace from which you can take desired actions, such as querying for logs.

### Setup your workspace

1. In the Azure portal, go to + Create a resource.
2. Search for “Log Analytics Workspace” and click Create -> Log Analytics Workspace.
3. Enter the Subscription you intend to use, the Resource Group that’ll house this workspace. Give it a name and select a region. Click Review + Create.
 
### Add a diagnostic setting

Next, we’ll want to add a diagnostic setting in your AVS private cloud, so it knows where to send your logs to.

1. Click on your AVS private cloud. Go to Diagnostic settings on the left-hand menu under Monitoring. Select + Add diagnostic setting.

2. Give your diagnostic setting a name. Select the log categories you are interested in sending to your Log Analytics workspace. 

3. Make sure to select the checkbox next to Send to Log Analytics workspace. Select the Subscription your Log Analytics workspace lives in and the Log Analytics workspace. Click Save on the top left.

At this point, your Log Analytics workspace has been successfully configured to receive logs from your AVS private cloud.

# Search and Analyze Logs using Kusto

Now that you’ve successfully configured your logs to go to your Log Analytics workspace, you can use that data to gain meaningful insights with Log Analytics’ search feature. 
Log Analytics uses a language called the Kusto Query Language (or Kusto) to search through your logs.

# Recommended content

To understand how Kusto works and how you can write your own queries, check out these tutorials:

[Kusto Query Language (KQL) from Scratch | Pluralsight
Introduction - Training | Microsoft Docs](https://app.pluralsight.com/library/courses/kusto-query-language-kql-from-scratch/table-of-contents)

To see how commonly used SQL queries would translate to  Kusto, see [SQL to Kusto query translation - Azure Data Explorer | Microsoft Learn](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/sqlcheatsheet)
