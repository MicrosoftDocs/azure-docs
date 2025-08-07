---
title: Manage resources in the operations experience UI
description: Use the operations experience web UI to manage resources such as your asset and device configurations.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.date: 07/15/2025

#CustomerIntent: As an OT user, I want to understand the capabilities of the operations experience that are common to all assets and devices.
---

# Use the operations experience to manage resources such as assets, devices, and data flows

The *operations experience* lets OT users manage resources such as their assets, devices, and data flows. The operations experience is a web-based user interface that provides a consistent way to manage assets and devices across different Azure IoT Operations sites and instances.

A _site_ is a collection of Azure IoT Operations instances. Sites typically group instances by physical location and make it easier for OT users to locate and manage assets. Your IT administrator creates sites and assigns Azure IoT Operations instances to them. To learn more, see [What is Azure Arc site manager (preview)?](/azure/azure-arc/site-manager/overview).

In the operations experience web UI, an _instance_ represents an Azure IoT Operations cluster.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

An _inbound endpoint_ is a logical endpoint that you create to represent a physical device or asset. Inbound endpoints have a type, such as OPC UA or ONVIF, that determines the type of physical device or asset to connect to. The available types of inbound endpoints depend on the connector templates the IT admin configured in the Azure portal. Each type of inbound endpoint has its own set of properties that you can configure. For example, an OPC UA inbound endpoint has properties such as the OPC UA server URL, security mode, and security policy.

This article describes how to use the operations experience web UI:

- View sites and instances.
- Import and export devices and assets.
- Use notifications and activity logs.

## Prerequisites

To use the operations experience, you need a running preview instance of Azure IoT Operations.

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

## Sign in

# [Operations experience](#tab/portal)

To sign in to the operations experience, go to the [operations experience](https://iotoperations.azure.com) in your browser and sign in by using your Microsoft Entra ID credentials.

## Select your site

After you sign in, the operations experience displays a list of sites. Each site is a collection of Azure IoT Operations instances where you can configure and manage your assets. A site typically represents a physical location where you have physical assets deployed. Sites make it easier for you to locate and manage assets. Your [IT administrator is responsible for grouping instances in to sites](/azure/azure-arc/site-manager/overview). Any Azure IoT Operations instances that aren't assigned to a site appear in the **Unassigned instances** node. Select the site that you want to use:

:::image type="content" source="media/howto-manage-assets-devices/site-list.png" alt-text="Screenshot that shows a list of sites in the operations experience." lightbox="media/howto-manage-assets-devices/site-list.png":::

> [!TIP]
> You can use the filter box to search for sites.

If you don't see any sites, you might not be in the right Azure Active Directory tenant. You can change the tenant from the top right menu in the operations experience. If you still don't see any sites that means you aren't added to any yet. Reach out to your IT administrator to request access.

## Select your instance

After you select a site, the operations experience displays a list of the Azure IoT Operations instances that are part of the site. Select the instance that you want to use:

:::image type="content" source="media/howto-manage-assets-devices/cluster-list.png" alt-text="Screenshot that shows the list of instances in the operations experience." lightbox="media/howto-manage-assets-devices/cluster-list.png":::

> [!TIP]
> You can use the filter box to search for instances.

After you select your instance, the operations experience displays the **Overview** page for the instance. The **Overview** page shows the status of the instance and the resources, such as assets, that are associated with it:

:::image type="content" source="media/howto-manage-assets-devices/instance-overview.png" alt-text="Screenshot that shows the overview page for an instance in the operations experience." lightbox="media/howto-manage-assets-devices/instance-overview.png":::

## Notifications

Whenever you make a change to a resource in the operations experience, you see a notification that reports the status of the operation:

:::image type="content" source="media/howto-manage-assets-devices/portal-notifications.png" alt-text="A screenshot that shows the notifications in the operations experience." lightbox="media/howto-manage-assets-devices/portal-notifications.png":::

## View activity logs

In the operations experience, you can view activity logs for each instance or each resource in an instance.

To view activity logs at the instance level, select the **Activity logs** tab. You can use the **Timespan** and **Resource type** filters to customize the view.

:::image type="content" source="./media/howto-manage-assets-devices/view-instance-activity-logs.png" alt-text="A screenshot that shows the activity logs for an instance in the operations experience." lightbox="./media/howto-manage-assets-devices/view-instance-activity-logs.png":::

To view activity logs as the resource level, select the resource that you want to inspect. This resource can be an asset, device, or data pipeline. In the resource overview, select **View activity logs**. You can use the **Timespan** filter to customize the view.

## Related content

- [Connector for OPC UA overview](overview-opc-ua-connector.md)
- [Connector for ONVIF overview](overview-onvif-connector.md)
- [Media connector overview](overview-media-connector.md)
- [Connector for REST/HTTP overview](overview-http-connector.md)
- [Process and route data with data flows](../connect-to-cloud/overview-dataflow.md)
