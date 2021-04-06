---
title: Connect Azure SQL database diagnostics and auditing logs to Azure Sentinel
description: Learn how to connect Azure SQL database diagnostics logs and security auditing logs to Azure Sentinel.
author: yelevin
manager: rkarlin
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.topic: how-to
ms.date: 01/06/2021
ms.author: yelevin
---
# Connect Azure SQL database diagnostics and auditing logs

Azure SQL is a fully managed, Platform-as-a-Service (PaaS) database engine that handles most database management functions, such as upgrading, patching, backups, and monitoring, without user involvement. 

The Azure SQL database connector lets you stream your databases' auditing and diagnostic logs into Azure Sentinel, allowing you to continuously monitor activity in all your instances.

- Connecting diagnostics logs allows you to send database diagnostics logs of different data types to your Azure Sentinel workspace.

- Connecting auditing logs allows you to stream security audit logs from all your Azure SQL databases at the server level.

Learn more about [monitoring Azure SQL Databases](../azure-sql/database/metrics-diagnostic-telemetry-logging-streaming-export-configure.md).

## Prerequisites

- You must have read and write permissions on the Azure Sentinel workspace.

- To connect auditing logs, you must have read and write permissions to Azure SQL Server audit settings.

## Connect to Azure SQL database
	
1. From the Azure Sentinel navigation menu, select **Data connectors**.

1. Select **Azure SQL Database** from the data connectors gallery, and then select **Open Connector Page**  on the preview pane.

1. In the **Configuration** section of the connector page, note the two categories of logs you can connect.

### Connect diagnostics logs

1. Under **Diagnostics logs**, expand **Enable diagnostics logs on each of your Azure SQL databases manually**.

1. Select the **Open Azure SQL >** link to open the **Azure SQL** resources blade.

1. **(Optional)** To find your database resource easily, select **Add filter** on the filters bar at the top.
    1. In the **Filter** drop-down list, select **Resource type**.
    1. In the **Value** drop-down list, deselect **Select all**, then select **SQL database**.
    1. Click **Apply**.
    
1. Select the database resource whose diagnostics logs you want to send to Azure Sentinel.

    > [!NOTE]
    > For each database resource whose logs you want to collect, you must repeat this process, starting from this step.

1. From the resource page of the database you selected, under **Monitoring** on the navigation menu, select **Diagnostic settings**.

    1. Select the **+ Add diagnostic setting** link at the bottom of the table.​

    1. In the **Diagnostic setting** screen, enter a name in the  **Diagnostic setting name** field.
    
    1. In the **Destination details** column, mark the **Send to Log Analytics workspace** check box. Two new fields will be displayed below it. Choose the relevant **Subscription** and **Log Analytics workspace** (where Azure Sentinel resides).​

    1. In the **Category details** column, mark the check boxes of the log and metric types you want to ingest. We recommend selecting all available types under both **log** and **metric**.​

    1. Select **Save** at the top of the screen.

- Alternatively, you can use the supplied **PowerShell script** to connect your diagnostics logs.
    1. Under **Diagnostics logs**, expand **Enable by PowerShell script**.

    1. Copy the code block and paste in PowerShell.

### Connect audit logs

1. Under **Auditing logs (preview)**, expand **Enable auditing logs on all Azure SQL databases (at the server level)**.

1. Select the **Open Azure SQL >** link to open the **SQL servers** resource blade.

1. Select the SQL server whose auditing logs you want to send to Azure Sentinel.

    > [!NOTE]
    > For each server resource whose logs you want to collect, you must repeat this process, starting from this step.

1. From the resource page of the server you selected, under **Security** on the navigation menu, select **Auditing**.

    1. Move the **Enable Azure SQL Auditing** toggle to **ON**.​

    1. Under **Audit log destination**, select **Log Analytics (Preview)**.
    
    1. From the list of workspaces that appears, choose your workspace (where Azure Sentinel resides).​

    1. Select **Save** at the top of the screen.

- Alternatively, you can use the supplied **PowerShell script** to connect your diagnostics logs.
    1. Under **Auditing logs**, expand **Enable by PowerShell script**.

    1. Copy the code block and paste in PowerShell.


> [!NOTE]
>
> With this particular data connector, the connectivity status indicators (a color stripe in the data connectors gallery and connection icons next to the data type names) will show as *connected* (green) only if data has been ingested at some point in the past two weeks. Once two weeks have passed with no data ingestion, the connector will show as being disconnected. The moment more data comes through, the *connected* status will return.

## Next steps
In this document, you learned how to connect Azure SQL database diagnostics and auditing logs to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](quickstart-get-visibility.md).
- Get started [detecting threats with Azure Sentinel](tutorial-detect-threats-built-in.md).