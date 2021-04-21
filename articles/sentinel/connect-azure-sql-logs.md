---
title: Connect all Azure SQL database diagnostics and auditing logs to Azure Sentinel
description: Learn how to use Azure Policy to enforce the connection of Azure SQL database diagnostics logs and security auditing logs to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 04/21/2021
ms.author: yelevin
---
# Connect Azure SQL database diagnostics and auditing logs

Azure SQL is a fully managed, Platform-as-a-Service (PaaS) database engine that handles most database management functions, such as upgrading, patching, backups, and monitoring, without necessitating user involvement. 

The Azure SQL database connector lets you stream your databases' auditing and diagnostic logs into Azure Sentinel, allowing you to continuously monitor activity in all your instances.

- Connecting diagnostics logs allows you to send database diagnostics logs of different data types to your Azure Sentinel workspace.

- Connecting auditing logs allows you to stream security audit logs from all your Azure SQL databases at the server level.

Learn more about [Azure SQL Database diagnostic telemetry](../azure-sql/database/metrics-diagnostic-telemetry-logging-streaming-export-configure.md) and about [Azure SQL server auditing](../azure-sql/database/auditing-overview.md).

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

- To connect auditing logs, you must have read and write permissions to Azure SQL Server audit settings.

- To use Azure Policy to apply a log streaming policy to Azure SQL database and server resources, you must have the Owner role for the policy assignment scope.

## Connect to Azure SQL database

This connector uses Azure Policy to apply a single Azure SQL log streaming configuration to a collection of instances, defined as a scope. The Azure SQL Database connector sends two types of logs to Azure Sentinel: diagnostics logs (from SQL databases) and auditing logs (at the SQL server level). You can see the log types ingested from Azure SQL databases and servers on the left side of connector page, under **Data types**.

1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure SQL Databases** from the data connectors gallery, and then select **Open Connector Page**  on the preview pane.

1. In the **Configuration** section of the connector page, note the two categories of logs you can connect.

### Connect diagnostics logs

1. Expand **Stream diagnostics logs from your Azure SQL databases at scale**.

1. Select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy called **Deploy - Configure diagnostic settings for SQL Databases to Log Analytics workspace**.

    1. In the **Basics** tab, click the button with the three dots under **Scope** to select your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab, leave the first two settings as they are. Choose your Azure Sentinel workspace from the **Log Analytics workspace** drop-down list. The remaining drop-down fields represent the available diagnostic log types. Leave marked as “True” all the log types you want to ingest.

    1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

### Connect audit logs

1. Back in the connector page, expand **Stream auditing logs from your Azure SQL databases at the server level at scale**.

1. Select the **Launch Azure Policy Assignment wizard** button.

    The policy assignment wizard opens, ready to create a new policy called **Deploy - Configure auditing settings for SQL Databases to Log Analytics workspace**.

    1. In the **Basics** tab, click the button with the three dots under **Scope** to select your subscription (and, optionally, a resource group). You can also add a description.

    1. In the **Parameters** tab, choose your Azure Sentinel workspace from the **Log Analytics workspace** drop-down list. Leave the **Effect** setting as is.

    1. The policy will be applied to resources added in the future. To apply the policy on your existing resources as well, select the **Remediation** tab and mark the **Create a remediation task** check box.

    1. In the **Review + create** tab, click **Create**. Your policy is now assigned to the scope you chose.

> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past 14 days. Once 14 days have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps

In this document, you learned how to use Azure Policy to connect Azure SQL database diagnostics and auditing logs to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:

- Learn how to [get visibility into your data and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).
