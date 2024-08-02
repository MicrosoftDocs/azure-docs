---
ms.assetid: 
title: Configure Log Analytics for Azure Monitor SCOM Managed Instance
description: This article details about the Integration of Azure Monitor SCOM Managed Instance with Log Analytics and how to configure Azure Monitor SCOM Managed Instance with Azure Log Analytics.
author: PriskeyJeronika-MS
ms.author: v-gjeronika
manager: jsuri
ms.date: 05/22/2024
ms.service: azure-monitor
ms.subservice: operations-manager-managed-instance
ms.topic: how-to
---

# Configure Log Analytics for Azure Monitor SCOM Managed Instance

The integration of Azure Monitor SCOM Managed Instance with Azure Log Analytics (LA) is a mechanism to synchronize the monitoring data from individual SCOM Managed Instances to the respective LA workspace with a predefined frequency, enabling retention and advanced user actions such as visualization and reporting.

Synchronization of SCOM Managed Instance workload's monitoring data to a common data source (LA) helps to centralize all monitoring logs and prevents data fragmentation. With LA retention policies, longer-term trend analysis is possible in LA.

This article details about the Integration of Azure Monitor SCOM Managed Instance with Log Analytics and how to configure Azure Monitor SCOM Managed Instance with Azure Log Analytics.

Before you configure Log Analytics workspace for SCOM Managed Instance, ensure you have a Log Analytics workspace available for integration or create a Log Analytics workspace. For more information on how to create Log Analytics workspace, see [Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace?tabs=azure-portal).

## General guidelines

Following are the general guidelines for the location and existence of LA workspaces and SCOM Managed Instance:

- To reduce latency in data synchronization, we recommend that you keep the SCOM Managed Instance and LA workspace in the same region.

- To reduce management (RBAC, policies, NSG) activities, we recommend that you keep SCOM Managed Instance and LA workspace in the same subscription and resource group.

- To onboard Azure Log Analytics workspace to SCOM Managed Instance, you must have required level of permissions, at least **Log Analytics Contributor**. You must assign **Log Analytics Contributor** permissions on the resource group of the workspace to **Microsoft.SCOM Resource Provider**. For more information, see [Manage access to Log Analytics workspace](/azure/azure-monitor/logs/manage-access?tabs=portal).

## Data types synchronized to Log Analytics workspace

The prioritized list of SCOM Managed Instance monitored data that synchronizes to LA workspace are  

- **EVENT**: Table consists of Event log data collected by management pack rules and monitors.
- **STATE**: Table consists of current and past health states of monitored resources.
- **PERFORMANCE**: Table consists of Performance metric data collected by management pack rules and monitors.
- **AUDIT**: Table consists of management pack related audit (change tracking) data.

## Data Retention in Log Analytics

The retention policy application on Log Analytic workspace is default value, which is 30 days. Azure Monitor SCOM Managed Instance doesn't change this value. For more information on Data retention, see [Data retention and archive in Azure Monitor Logs](/azure/azure-monitor/logs/data-retention-archive?tabs=portal-1%2Cportal-2)

:::image type="content" source="media/configure-log-analytics-for-scom-managed-instance/retention-archive.png" alt-text="Diagram that shows an overview of data retention and archive periods.":::

## Configure Log Analytics Workspace for SCOM Managed Instance

### Prerequisites

Ensure to provide Log Analytics Contributor permissions on the Log Analytics Workspace's Resource Group for *Microsoft.SCOM* Resource Provider (RP).

To provide the permissions, follow these steps:

1. Navigate to the resource group of respective Log analytics workspace > **Access Control** > **Add Role Assignment** > **Choose Log Analytics Contributor** and select **Next**.

2. Search for **Microsoft.SCOM Resource provider** and select **Assign**.

### Integrate SCOM Managed Instance with Log Analytics

To integrate SCOM Managed Instance with Log Analytics, follow these steps:

1. Sign in to the [Azure portal](https://ms.portal.azure.com/#home). Search for and select **SCOM Managed Instance**.

2. On the **Overview** page, select **View Instances**.

3. On the **SCOM managed instances** page, select the desired SCOM managed instance.  

4. On the left pane, select **Log Analytics workspace**.

5. On the **Log Analytics workspace** page, select **Link Log Analytics workspace**.

6. On the **Configure Log Analytics Workspace for SCOM managed instance** page, do the following:

     1. **Destination details**:
         - **Subscription**: Select the desired subscription.
         - **Log Analytics workspace**: Select the desired Log Analytics workspace.

             >[!NOTE]
             >Ensure to provide Log Analytics Contributor permissions on the resource group.  

     2. **Log data types**:
         - **Data types**: Select the desired date type.  

     3. **Historic data**:
         - **Enable historic data for last 7 days**: Select this checkbox if you wish to synchronize the last seven days of historic data.

7. Select **Save**.

The Integration of SCOM Managed Instance with Log Analytics takes few minutes to complete.

## View Logs

To view the integrated logs, follow these steps:

1. Post successful configuration, wait for a few minutes, and sign in to the [Azure portal](https://ms.portal.azure.com/#home). Search for and select **Log Analytic workspace**.

2. On the **Overview** page, select **Logs**.
   On the Query page, under **Custom Logs**, SCOM Managed Instance related data tables such as State, Performance, Event, and Management pack (ending with CL) are created.

3. Select the desired custom table (State, Performance, Event and Management pack) and select **Run** to view the results.

Optionally, you can create a new workbook, query the data from this LA workspace, and visualize the monitored data.

For more information on Log Analytics workspaces, see the following articles:

- [Log Analytics workspace overview](/azure/azure-monitor/logs/log-analytics-workspace-overview).
- [Monitor Log Analytics workspace health](/azure/azure-monitor/logs/log-analytics-workspace-health).
