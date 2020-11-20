---
title: Check Azure IoT Hub service and resource health | Microsoft Docs
description: Use Azure Service Health and Azure Resource Health to monitor your IoT Hub
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 04/21/2020
ms.author: robinsh
ms.custom: [amqp, 'Role: Cloud Development', 'Role: Technical Support', devx-track-csharp]
---

# Check IoT Hub service and resource health

Azure IoT Hub integrates with the [Azure Service Health service](../service-health/overview.md) to provide you with the ability to monitor the service-level health of the IoT Hub service and individual IoT hubs. You can also set up alerts to be notified when the status of the IoT Hub service or an IoT hub changes. The Azure Service Health service is a combination of three smaller services: Azure Resource Health, Azure Service Health, and the Azure status page. The sections in this article describe each service and its relationship to IoT Hub in more detail.

Azure Service Health service helps you monitor service-level events like outages and upgrades that may affect the availability of the IoT Hub service and your individual IoT hubs. IoT Hub also integrates with Azure Monitor to provide IoT Hub platform metrics and IoT Hub resource logs that you can use to monitor operational errors and conditions that occur on a specific IoT hub. To learn more, see [Monitor IoT Hub](monitor-iot-hub.md).

## Check health of an IoT hub with Azure Resource Health

Azure Resource Health is a part of Azure Service Health service that tracks the health of individual resources. You can check the health status of your IoT hub directly from the portal.

To see status and status history of your IoT hub using the portal, follow these steps:

1. In [Azure portal](https://portal.azure.com), go to your IoT hub in Azure portal.

1. On the left pane, under **Support + troubleshooting**, select **Resource Health**.

    :::image type="content" source="./media/iot-hub-azure-service-health-integration/iot-hub-resource-health.png" alt-text="Resource health page for an IoT hub":::

To learn more about Azure Resource Health and how to interpret health data, see [Resource Health overview](../service-health/resource-health-overview.md) in the Azure Service Health documentation.

You can also select **Add resource health alert** to set up alerts to trigger when the health status of your IoT hub changes. To learn more, see [Configure alerts for service health events](../service-health/alerts-activity-log-service-notifications-portal.md) and related topics in the Azure Service Health documentation.

## Check health of IoT hubs in your subscription with Azure Service Health

With Azure Service Health, you can check the health status of all of the IoT hubs in your subscription.

To check the health of your IoT hubs, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to **Service Health** > **Resource health**.

3. From the drop-down boxes, select your subscription then select **IoT Hub** as the resource type.

To learn more about Azure Service Health and how to interpret health data, see [Service Health overview](../service-health/service-health-overview.md) in the Azure Service Health documentation.

To learn how to set up alerts with Azure Service Health, see [Configure alerts for service health events](../service-health/alerts-activity-log-service-notifications-portal.md) and related topics in the Azure Service Health documentation.

## Check health of the IoT Hub service by region on Azure status page

To see the status of IoT Hub and other services by region world-wide, you can use the [Azure status page](https://status.azure.com/status). For more information about the Azure status page, see [Azure status overview](../service-health/azure-status-overview.md) in the Azure Service Health documentation.

## Next steps

* See [Azure Service Health service](../service-health/overview.md) for details on Azure Service Health, Azure Resource Health, and Azure status page.
* See [Monitor Azure IoT Hub](monitor-iot-hub.md) for a description of monitoring Azure IoT Hub.
