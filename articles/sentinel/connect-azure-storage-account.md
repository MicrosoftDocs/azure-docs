---
title: Connect Azure Storage account diagnostics logs to Azure Sentinel
description: Learn how to use Azure Policy to connect Azure Storage account diagnostics logs to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 04/21/2021
ms.author: yelevin
---
# Connect Azure Storage account diagnostics logs

Azure Storage account is a cloud solution for modern data storage scenarios. It contains all your data objects: blobs, files, queues, tables, and disks.

This connector lets you stream your Azure Storage accounts’ diagnostics logs into Azure Sentinel, allowing you to continuously monitor activity and detect security threats in all your Azure storage resources throughout your organization.

Learn more about [monitoring Azure Storage account](../storage/common/storage-analytics-logging.md).

## Prerequisites

To ingest Azure Storage account diagnostics logs into Azure Sentinel:

- You must have read and write permissions on the Azure Sentinel workspace.

- To use Azure Policy to apply a log streaming policy to Azure Storage resources, you must have the Owner role for the policy assignment scope.

## Connect to Azure Storage account

This connector uses Azure Policy to apply a single log streaming configuration to a collection of Azure Storage account resources, defined as a scope. You can see the available Azure Storage log and metric types on the left side of the connector page, under **Data types**.

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure Storage account** from the data connectors gallery, and then select **Open Connector Page** on the preview pane.

1. In the **Configuration** section of the connector page, expand **Stream diagnostics logs from your Azure Storage Account at scale**.

1. Select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy called **Configure diagnostic settings for storage accounts to Log Analytics workspace**.

    1. In the **Basics** tab, click the button with the three dots beside **Scope** to select your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab:
        - Choose your Azure Sentinel workspace from the **Log Analytics workspace** drop-down list.
        - Select, from the **Storage services to deploy** drop-down list, the storage resource types (file, table, queue, etc.) to which you want to deploy diagnostics settings.
        - Leave the **Setting name** and **Effect** fields as is.
        - The remaining drop-down fields represent the available diagnostic log and metric types. Leave marked as “True” all the types you want to ingest.

    1. The steps above will apply the policy to all future storage resources. To apply the policy on your existing resources, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps

In this document, you learned how to connect Azure Storage account to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
