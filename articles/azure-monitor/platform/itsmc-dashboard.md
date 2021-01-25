---
title: Investigate errors by using the dashboard
description: This document contains information about error investigation by using the dashboard.
ms.subservice: alerts
ms.topic: conceptual
author: nolavime
ms.author: nolavime
ms.date: 01/15/2021

---

# Investigate errors by using the dashboard

This page contains information about the ITSM connector dashboard. The dashboard helps you investigate the status of your ITSM connector.

## How to view the dashboard

Follow these steps to open the dashboard.

1. Select **All resources**, and then find **ServiceDesk(*your workspace name*)**.

   ![Screenshot that shows the resources in Azure services.](media/itsmc-definition/create-new-connection-from-resource.png)

1. In the left pane, select **Workspace Data Sources**, and then select **ITSM Connections**.

   ![Screenshot that shows selecting ITSM Connections under Workplace Data Sources.](media/itsmc-overview/add-new-itsm-connection.png)

1. In the **Summary** section, select **View Summary** to view a summary graph.

    ![Screenshot that shows the View Summary option in the Summary section.](media/itsmc-resync-servicenow/dashboard-view-summary.png)

1. Select the graph in the **Summary** section to open the dashboard.

    ![Screenshot that shows selecting the Summary graph.](media/itsmc-resync-servicenow/dashboard-graph-click.png)

1. Review the dashboard for status and any errors in your connector.
    ![Screenshot that shows the dashboard.](media/itsmc-resync-servicenow/connector-dashboard.png)

## Dashboard Elements

The dashboard contains information on the alerts that were sent into the ITSM tool by using this connector.

The dashboard is split into four sections:

- **Work Item Created**: The graph and table show the number of the work items by type. Select the graph or the table to learn more about your work items.
      ![Screenshot that shows work item created.](media/itsmc-resync-servicenow/itsm-dashboard-workitems.png)
- **Impacted computers**: The table contains details about the configuration items that created configuration items.
      Select rows in the tables for more details about the configuration items.
      The table contains a limited number of rows. If you want to see the entire list, select **See all**.
      ![Screenshot that shows impacted computers.](media/itsmc-resync-servicenow/itsm-dashboard-impacted-comp.png)
- **Connector status**: The graph and the table contain messages about the status of the connector. Select the graph and rows in the table for more details about the messages of the connector status. The table shows a limited number of rows. If you want to see the entire list, select **See all**.
      ![Screenshot that shows connector status.](media/itsmc-resync-servicenow/itsm-dashboard-connector-status.png)
- **Alert rules**: The tables contain the information about the number of alert rules that were detected.
      Select rows in the tables for more details on the rules that were detected.
      The table contains a limited number of rows. If you want to see the entire list, select **See all**.
      ![Screenshot that shows alert rules.](media/itsmc-resync-servicenow/itsm-dashboard-alert-rules.png)

## Next steps

Check out [Common connector status errors](itsmc-dashboard-errors.md).
