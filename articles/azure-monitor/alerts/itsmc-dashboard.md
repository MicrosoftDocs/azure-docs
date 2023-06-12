---
title: Investigate errors by using the ITSMC dashboard
description: Learn how to use the IT Service Management Connector dashboard to investigate errors.  
ms.topic: conceptual
ms.date: 2/23/2022
ms.reviewer: nolavime

---

# Investigate errors by using the ITSMC dashboard

This article contains information about the IT Service Management Connector (ITSMC) dashboard. The dashboard helps you to investigate the status of your connector.

## View errors

To view errors in the dashboard:

1. In the Azure portal, select **All resources**, then find and select your Service Desk.

   :::image type="content" source="media/itsmc-dashboard/select-service-desk.png" lightbox="media/itsmc-dashboard/select-service-desk.png" alt-text="Screenshot of the All resources page in the Azure portal. Only resources whose name includes the ServiceDes filter criteria are listed.":::

1. In the Service Desk window, select **View Summary**.

   :::image type="content" source="media/itsmc-dashboard/view-summary.png" lightbox="media/itsmc-dashboard/view-summary.png" alt-text="Screenshot of a Solution resource in the Azure portal. The View Summary button is highlighted.":::

1. Select the graph that appears in the **IT Service Management Connector** section.

1. The IT Service Management Connector Dashboard opens with information about status and errors.

   :::image type="content" source="media/itsmc-resync-servicenow/connector-dashboard.png" lightbox="media/itsmc-resync-servicenow/connector-dashboard.png" alt-text="Screenshot that shows connector status on the dashboard.":::

## Understand dashboard elements

The dashboard contains information on the alerts that were sent to the ITSM tool through this connector. The dashboard is split into four parts.

### Created work items 

In the **WORK ITEMS CREATED** area, the graph and the table below it contain the count of the work items per type. If you select the graph or the table, you can see more details about the work items.

![Screenshot that shows a created work item.](media/itsmc-resync-servicenow/itsm-dashboard-workitems.png)

### Affected computers 

In the **IMPACTED COMPUTERS** area, the table lists computers and their associated work items. By selecting rows in the tables, you can get more details about the computers.

The table contains a limited number of rows. If you want to see all the rows, select **See all**.

![Screenshot that shows affected computers.](media/itsmc-resync-servicenow/itsm-dashboard-impacted-comp.png)

### Connector status 

In the **CONNECTOR STATUS** area, the graph and the table below it contain messages about the status of the connector. By selecting the graph or rows in the table, you can get more details about the messages.

The table contains a limited number of rows. If you want to see all the rows, select **See all**.

To learn more about the messages in the table, see [this article](itsmc-dashboard-errors.md).

![Screenshot that shows connector status.](media/itsmc-resync-servicenow/itsm-dashboard-connector-status.png)

### Alert rules 

In the **ALERT RULES** area, the table contains information on the number of alert rules that were detected. By selecting rows in the table, you can get more details about the detected rules.
    
The table contains a limited number of rows. If you want to see all the rows, select **See all**.

![Screenshot that shows alert rules.](media/itsmc-resync-servicenow/itsm-dashboard-alert-rules.png)
