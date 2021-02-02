---
title: Investigate errors by using the dashboard
description: This document contains information about errors on the ITSMC dashboard.
ms.subservice: alerts
ms.topic: conceptual
author: nolavime
ms.author: nolavime
ms.date: 01/15/2021

---

# Investigate errors by using the ITSMC dashboard

This article contains information about the IT Service Management Connector (ITSMC) dashboard. The dashboard helps you investigate the status of ITSMC.

## View the dashboard

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

## Understand dashboard elements

The dashboard contains information on the alerts that were sent into the ITSM tool by using this connector.

The dashboard is split into four sections:

- **WORK ITEMS CREATED**: The graph and table show the number of the work items by type. Select the graph or the table to learn more about your work items.
      ![Screenshot that shows the work items created section.](media/itsmc-resync-servicenow/itsm-dashboard-workitems.png)
- **IMPACTED COMPUTERS**: The table contains details about the configuration items that created work items.
      Select rows in the tables for more details about the configuration items.
      The table contains a limited number of rows. To see the entire list, select **See all**.
      ![Screenshot that shows the impacted computers section.](media/itsmc-resync-servicenow/itsm-dashboard-impacted-comp.png)
- **CONNECTOR STATUS**: The graph and the table show information about the status of the connector. Select the graph or the messages in the table for more details. The table shows a limited number of rows. To see the entire list, select **See all**.
      ![Screenshot that shows the connector status section.](media/itsmc-resync-servicenow/itsm-dashboard-connector-status.png)
- **ALERT RULES**: This section shows information about the number of alert rules that were detected. Select rows in the tables for more details on the rules that were detected. The table has a limited number of rows. To see the entire list, select **See all**.
      ![Screenshot that shows the alert rules section.](media/itsmc-resync-servicenow/itsm-dashboard-alert-rules.png)

## Next steps

Check out [Common connector status errors](itsmc-dashboard-errors.md).
