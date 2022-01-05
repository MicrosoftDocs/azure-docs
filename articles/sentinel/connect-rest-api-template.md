---
title: Connect your data source to Azure Sentinel's Data Collector API to ingest data | Microsoft Docs
description: Learn how to connect external systems to Azure Sentinel's Data Collector API to ingest their log data to custom logs in your workspace.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/17/2021
ms.author: yelevin

---
# Connect your data source to Azure Sentinel's Data Collector API to ingest data

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

API integrations built by third-party vendors pull data from their products' data sources and connect to Azure Sentinel's [Azure Monitor Data Collector API](../azure-monitor/logs/data-collector-api.md) to push the data into custom log tables in your Azure Sentinel workspace.

For the most part, you can find all the information you need to configure these data sources to connect to Azure Sentinel in each vendor's documentation.

Check your product's section in the [data connectors reference](data-connectors-reference.md) page for any extra instructions that may appear there, and for the links to your vendor's instructions.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Azure Sentinel.

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

- You must have read permissions to shared keys for the workspace. [Learn more about workspace keys](../azure-monitor/agents/agent-windows.md).

## Configure and connect your data source

1. In the Azure Sentinel portal, select **Data connectors** on the navigation menu.

1. Select your product's entry from the data connectors gallery, and then select the **Open connector page** button.

1. Follow any steps that appear on the connector page, or any links to vendor instructions that appear there.

1. When asked for the Workspace ID and the Primary Key, copy them from the data connector page and paste them into the configuration as directed by your vendor's instructions. See the example below.

    :::image type="content" source="media/connect-rest-api-template/workspace-id-primary-key.png" alt-text="Workspace ID and Primary Key":::

## Find your data

After a successful connection is established, the data appears in **Logs** under the **CustomLogs** section. See your product's section in the [data connectors reference](data-connectors-reference.md) page for the table names.

To query the data from your product, use those table names in your query.

It may take up to 20 minutes before your logs start to appear in Log Analytics.

## Next steps

In this document, you learned how to connect external data sources to Azure Sentinel's Data Collector API. To take full advantage of the capabilities built in to these data connectors, select the **Next steps** tab on the data connector page. There you'll find some ready-made sample queries, workbooks, and analytics rule templates so you can get started finding useful information.

To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Azure Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.