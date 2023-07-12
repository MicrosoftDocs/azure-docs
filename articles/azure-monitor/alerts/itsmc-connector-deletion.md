---
title: Delete unused ITSM connectors
description: This article provides an explanation of how to delete ITSM connectors and the action groups that are associated with it.
ms.topic: conceptual
ms.date: 06/19/2023
ms.custom: references_regions
ms.reviewer: nolavime

---

# Delete unused ITSM connectors

The process of deleting unused IT service management (ITSM) connectors has two phases. You delete all the actions that are associated with an ITSM connector, and then you delete the connector itself. You delete the actions first because actions without a connector might cause errors in your subscription.

## Delete associated actions

1. In the Azure portal, select Monitor, then **Alerts** and **Action groups**.

    :::image type="content" source="media/itsmc-connector-deletion/monitor-alerts-page.png" lightbox="media/itsmc-connector-deletion/monitor-alerts-page.png" alt-text="Screenshot of the Alerts page in the Azure portal. Monitor in the portal menu, Alerts on the left pane, and Action groups button are highlighted.":::

1. Select the action group associated with the ITSM Connector you want to delete.

    :::image type="content" source="media/itsmc-connector-deletion/select-action-group.png" lightbox="media/itsmc-connector-deletion/select-action-group.png" alt-text="Screenshot of the Action groups page in the Azure portal.":::

1. In the action group window, review the information and make sure this is the action group you want to delete. Then, select **Delete**.

    :::image type="content" source="media/itsmc-connector-deletion/delete-action-group.png" lightbox="media/itsmc-connector-deletion/delete-action-group.png" alt-text="Screenshot of the Action groups page in the Azure portal with an action group selected. The Delete button for deleting an action group is highlighted.":::

## Delete the connector

1. In the Azure portal, select **All resources**, then find and select your Service Desk.

    :::image type="content" source="media/itsmc-dashboard/select-service-desk.png" lightbox="media/itsmc-dashboard/select-service-desk.png" alt-text="Screenshot of the All resources page in the Azure portal. Only resources whose name includes the ServiceDes filter criteria are listed.":::

1. In the Service Desk window, select **ITSM Connections** from the **Workspace Data Sources** section on the left pane.

    :::image type="content" source="media/itsmc-resync-servicenow/select-itsm-connections.png" lightbox="media/itsmc-resync-servicenow/select-itsm-connections.png" alt-text="Screenshot of a Solution resource in the Azure portal. ITSM Connections on the left pane is highlighted.":::

1. Select the connector you want to delete.

1. In the **Edit ITSM** window, select **Delete**.

    :::image type="content" source="media/itsmc-connector-deletion/delete-itsm-connector.png" lightbox="media/itsmc-connector-deletion/delete-itsm-connector.png" alt-text="Screenshot of the Edit ITSM window in the Azure portal with the Delete button highlighted.":::

## Next steps

* [Troubleshooting problems in an ITSM connector](./itsmc-resync-servicenow.md)
