---
title: Manage resources in the operations experience UI
description: Use the operations experience web UI to manage resources such as your asset and device configurations.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 09/08/2025

#CustomerIntent: As an OT user, I want to understand the capabilities of the operations experience that are common to all assets and devices.
---

# Use the operations experience web UI

The *operations experience* web UI lets OT users manage resources in Azure IoT Operations. The operations experience is a web-based user interface that gives you a consistent way to manage resources like devices, assets, and data flows.

This article describes how to use the operations experience web UI to manage core resources like

- Sites and instances
- Notifications
- Activity logs

To learn how to use the operations experience to manage assets and devices, see:

- [Configure the connector for OPC UA](howto-configure-opc-ua.md)
- [Configure the connector for ONVIF](howto-use-onvif-connector.md)
- [Configure the media connector](howto-use-media-connector.md)
- [Configure the connector for HTTP/REST](howto-use-http-connector.md)
- [Configure the connector for SSE](howto-use-sse-connector.md)
- [Configure the connector for MQTT (preview)](howto-use-mqtt-connector.md)
To learn how to use the operations experience to manage data flows, see [Process and route data with data flows](../connect-to-cloud/overview-dataflow.md).

## Prerequisites

To use the operations experience, make sure you have a running instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

## Sign in

To sign in to the operations experience, go to the [operations experience](https://iotoperations.azure.com) in your browser and sign in by using your Microsoft Entra ID credentials.

## Select your site

A *site* is a collection of Azure IoT Operations instances. Sites typically group instances by physical location and make it easier for OT users to locate and manage assets. Your IT administrator creates sites and assigns Azure IoT Operations instances to them. To learn more, see [What is Azure Arc site manager (preview)?](/azure/azure-arc/site-manager/overview).

After you sign in, the operations experience displays a list of sites. Each site is a collection of Azure IoT Operations instances where you can configure and manage your assets. A site typically represents a physical location where you have physical assets deployed. Sites make it easier for you to locate and manage assets. Your [IT administrator is responsible for grouping instances in to sites](/azure/azure-arc/site-manager/overview). Any Azure IoT Operations instances that aren't assigned to a site appear in the **Unassigned instances** node. Select the site that you want to use:

:::image type="content" source="media/howto-use-operations-experience/site-list.png" alt-text="Screenshot that shows a list of sites in the operations experience." lightbox="media/howto-use-operations-experience/site-list.png":::

> [!TIP]
> You can use the filter box to search for sites.

If you don't see any sites, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the operations experience. If you still don't see any sites that means you aren't added to any yet. Reach out to your IT administrator to request access.

## Select your instance

In the operations experience web UI, an *instance* represents an Azure IoT Operations cluster.

After you select a site, the operations experience displays a list of the Azure IoT Operations instances that are part of the site. Select the instance that you want to use:

:::image type="content" source="media/howto-use-operations-experience/cluster-list.png" alt-text="Screenshot that shows the list of instances in the operations experience." lightbox="media/howto-use-operations-experience/cluster-list.png":::

> [!TIP]
> You can use the filter box to search for instances.

After you select your instance, the operations experience displays the **Overview** page for the instance. The **Overview** page shows the status of the instance and the resources, such as assets, that are associated with it:

:::image type="content" source="media/howto-use-operations-experience/instance-overview.png" alt-text="Screenshot that shows the overview page for an instance in the operations experience." lightbox="media/howto-use-operations-experience/instance-overview.png":::

## Notifications

Whenever you make a change to a resource in the operations experience, you see a notification that reports the status of the operation:

:::image type="content" source="media/howto-use-operations-experience/portal-notifications.png" alt-text="A screenshot that shows the notifications in the operations experience." lightbox="media/howto-use-operations-experience/portal-notifications.png":::

## Import and export settings

To enable you to copy settings between Azure Iot Operations instances, the operations experience lets you export and import settings for the following configurations:

- Data points and events for OPC UA endpoints (CSV)
- Data points and events for SSE endpoints (CSV)
- Data points for HTTP endpoints (CSV)
- Events and actions for ONVIF endpoints (CSV)
- Stream definitions for media endpoints (CSV)
- Data flow endpoints (JSON)
- Data flow (JSON)

For example, to export the data point definitions for an asset that uses an OPC UA inbound endpoint, go to the **Data points** page for the dataset, select the data points to export, and then select **Export data points**:

:::image type="content" source="media/howto-use-operations-experience/export-data-points.png" alt-text="A screenshot that shows how to export data point definitions to a CSV file." lightbox="media/howto-use-operations-experience/export-data-points.png":::

For example, to import a previously exported data flow definition, go to **Create data flow**, select **Import**, and select the JSON file that contains the data flow definition:

:::image type="content" source="media/howto-use-operations-experience/import-data-flow.png" alt-text="A screenshot that shows how to import a data flow from a JSON file." lightbox="media/howto-use-operations-experience/import-data-flow.png":::

## View activity logs

In the operations experience, you can view activity logs for each instance or each resource in an instance.

To view activity logs at the instance level, select the **Activity logs** tab. You can use the **Timespan** and **Resource type** filters to customize the view.

:::image type="content" source="./media/howto-use-operations-experience/view-instance-activity-logs.png" alt-text="A screenshot that shows the activity logs for an instance in the operations experience." lightbox="./media/howto-use-operations-experience/view-instance-activity-logs.png":::

To view activity logs as the resource level, select the resource that you want to inspect. This resource can be an asset, device, or data pipeline. In the resource overview, select **View activity logs**. You can use the **Timespan** filter to customize the view.

## Related content

- [Connector for OPC UA overview](overview-opc-ua-connector.md)
- [Connector for ONVIF overview](howto-use-onvif-connector.md)
- [Media connector overview](howto-use-media-connector.md)
- [Connector for HTTP/REST overview](howto-use-http-connector.md)
- [Connector for SSE](howto-use-sse-connector.md)
- [Connector for MQTT (preview)](howto-use-mqtt-connector.md)
- [Process and route data with data flows](../connect-to-cloud/overview-dataflow.md)
