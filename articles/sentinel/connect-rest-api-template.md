---
title: Connect your data source to the Microsoft Sentinel Data Collector API to ingest data | Microsoft Docs
description: Learn how to connect external systems to the Microsoft Sentinel Data Collector API to ingest their log data to custom logs in your workspace.
author: yelevin
ms.topic: how-to
ms.date: 06/05/2023
ms.author: yelevin
---

# Connect your data source to the Microsoft Sentinel Data Collector API to ingest data

API integrations built by third-party vendors pull data from their products' data sources and connect to Microsoft Sentinel's [Azure Monitor Data Collector API](../azure-monitor/logs/data-collector-api.md) to push the data into custom log tables in your Microsoft Sentinel workspace.

For the most part, you can find all the information you need to configure these data sources to connect to Microsoft Sentinel in each vendor's documentation.

Check your product's section in the [data connectors reference](data-connectors-reference.md) page for any extra instructions that may appear there, and for the links to your vendor's instructions.

Data will be stored in the geographic location of the workspace on which you are running Microsoft Sentinel.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

## Prerequisites

- You must have read and write permissions on the Microsoft Sentinel workspace.

- You must have read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/agent-windows.md).
- Install the product's solution from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

## Configure and connect your data source

1. In the Microsoft Sentinel portal, select **Data connectors** on the navigation menu.

1. Select your product's entry from the data connectors gallery, and then select the **Open connector page** button.

1. Follow any steps that appear on the connector page, or any links to vendor instructions that appear there.

1. When asked for the Workspace ID and the Primary Key, copy them from the data connector page and paste them into the configuration as directed by your vendor's instructions. See the example below.

    :::image type="content" source="media/connect-rest-api-template/workspace-id-primary-key.png" alt-text="Workspace ID and Primary Key":::

## Find your data

After a successful connection is established, the data appears in **Logs** under the **CustomLogs** section. Find your product's page from the [data connectors reference](data-connectors-reference.md) for the table names.

To query the data from your product, use those table names in your query.

It may take up to 20 minutes before your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect external data sources to the Microsoft Sentinel Data Collector API.

To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
