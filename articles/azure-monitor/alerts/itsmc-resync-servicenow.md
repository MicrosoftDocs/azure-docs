---
title: How to manually fix ServiceNow sync problems 
description: Reset the connection to ServiceNow so alerts in Microsoft Azure can again call ServiceNow  
ms.topic: conceptual
ms.date: 03/30/2022
ms.reviewer: nolavime

---
# How to manually fix sync problems

Azure Monitor can connect to third-party IT Service Management (ITSM) providers. ServiceNow is one of those providers.

For security reasons, you may need to refresh the authentication token used for your connection with ServiceNow.
Use the following synchronization process to reactivate the connection and refresh the token:

1. In the Azure portal, select **All resources**, then find and select your Service Desk.

   :::image type="content" source="media/itsmc-dashboard/select-service-desk.png" lightbox="media/itsmc-dashboard/select-service-desk.png" alt-text="Screenshot of the All resources page in the Azure portal. Only resources whose name includes the ServiceDes filter criteria are listed.":::

1. In the Service Desk window, select **ITSM Connections** from the **Workspace Data Sources** section on the left pane.

    :::image type="content" source="media/itsmc-resync-servicenow/select-itsm-connections.png" lightbox="media/itsmc-resync-servicenow/select-itsm-connections.png" alt-text="Screenshot of a Solution resource in the Azure portal. ITSM Connections on the left pane is highlighted.":::

1. Select each connector in the list to edit the connector as necessary.

1. In the **Edit ITSM** window,

    1. If this ITSM connector isn’t being used, delete the connector.
    1. Make sure that all of the fields are configured correctly. See the instructions [here](./itsmc-overview.md) for the correct settings. 
    1. Select **Sync**.
    1. Select **Save**.

    :::image type="content" source="media/itsmc-resync-servicenow/edit-itsm-connector.png" lightbox="media/itsmc-resync-servicenow/edit-itsm-connector.png" alt-text="Screenshot of the Edit ITSM window in the Azure portal.":::
