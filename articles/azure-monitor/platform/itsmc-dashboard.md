---
title: Error investigation using dashboard
description: This document contain information about error investigation using the dashboard  
ms.subservice: alerts
ms.topic: conceptual
author: nolavime
ms.author: nolavime
ms.date: 01/15/2021

---

# Error Investigation using the dashboard

In order to view the errors in the dashboard, you should follow the next steps:

1. In **All resources**, look for **ServiceDesk(*your workspace name*)**:

   ![Screenshot that shows recent resources in the Azure portal.](media/itsmc-definition/create-new-connection-from-resource.png)

2. Under **Workspace Data Sources** in the left pane, select **ITSM Connections**:

   ![Screenshot that shows the ITSM Connections menu item.](media/itsmc-overview/add-new-itsm-connection.png)

3. Under **Summary** in the left box **IT Service Management Connector**, select **View Summary**:

    ![Screenshot that shows view summary.](media/itsmc-resync-servicenow/dashboard-view-summary.png)

4. Under **Summary** in the left box **IT Service Management Connector**, click on the graph:

    ![Screenshot that shows graph click.](media/itsmc-resync-servicenow/dashboard-graph-click.png)

5. Using this dashboard you will be able to review the status and the errors in your connector.
    ![Screenshot that shows connector status.](media/itsmc-resync-servicenow/connector-dashboard.png)

## Dashboard Elements

The dashboard contains information on the alerts that were sent into the ITSM tool using this connector.
The dashboard is split into 4 parts:

1. Work Item Created: The graph and the table below contain the count of the work item per type. If you click on the graph or on the table you can see more details about the work items.
    ![Screenshot that shows work item created.](media/itsmc-resync-servicenow/itsm-dashboard-workitems.png)
2. Impacted computers: The tables contain details about the configuration items that created configuration items.
    By clicking on rows in the tables you can get further details on the configuration items.
    The table contain limited number of rows if you would like to see all the list you can click on "See all".
    ![Screenshot that shows impacted computers.](media/itsmc-resync-servicenow/itsm-dashboard-impacted-comp.png)
3. Connector status: The graph and the table below contain messages about the status of the connector. By clicking on the graph on rows in the table you can get further details on the messages of the connector status.
    The table contain limited number of rows if you would like to see all the list you can click on "See all".
    ![Screenshot that shows connector status.](media/itsmc-resync-servicenow/itsm-dashboard-connector-status.png)
4. Alert rules: The tables contain the information on the number of alert rules that were detected.
    By clicking on rows in the tables you can get further details on the rules that were detected.
    The table contain limited number of rows if you would like to see all the list you can click on "See all".
    ![Screenshot that shows alert rules.](media/itsmc-resync-servicenow/itsm-dashboard-alert-rules.png)