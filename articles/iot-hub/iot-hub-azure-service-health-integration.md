---
title: Check Azure IoT Hub service and resource health
description: Use Azure Service Health and Azure Resource Health to monitor your IoT Hub
author: cwatson-cat

ms.author: cwatson
ms.service: azure-iot-hub
ms.topic: how-to
ms.date: 08/13/2025
ms.custom: [amqp, 'Role: Cloud Development', 'Role: Technical Support', devx-track-csharp]
---

# Check IoT Hub service and resource health

Azure IoT Hub integrates with [Azure Service Health](/azure/service-health/overview) to enable service-level health monitoring of the IoT Hub service and individual IoT hubs. You can also set up alerts to be notified when the status of the IoT Hub service or an IoT hub (instance) changes. Azure Service Health is a combination of three smaller services: Azure Resource Health, Azure Service Health, and the Azure status page. The sections in this article describe each service and its relationship to IoT Hub.

Azure Service Health helps you monitor service-level events like outages and upgrades that might affect the availability of the IoT Hub service and your individual IoT hubs. IoT Hub also integrates with Azure Monitor to provide IoT Hub platform metrics and IoT Hub resource logs that you can use to monitor operational errors and conditions that occur on a specific IoT hub. To learn more, see [Monitor Azure IoT Hub](monitor-iot-hub.md).

## Check IoT hub health with Azure Resource Health

Azure Resource Health is part of Azure Service Health and tracks the health of individual resources. You can check the health status of your IoT hub directly from the portal.

To see status and status history of your IoT hub using the portal, follow these steps:

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub.

1. In the service menu, under **Help**, select **Resource health**.

   :::image type="content" source="media/iot-hub-azure-service-health-integration/iot-hub-resource-health.png" alt-text="Screenshot of the 'Resource health' page for an IoT hub in the Azure portal." lightbox="media/iot-hub-azure-service-health-integration/iot-hub-resource-health.png":::

To learn more about Azure Resource Health and how to interpret health data, see [Resource Health overview](/azure/service-health/resource-health-overview) in the Azure Service Health documentation.

You can also select **Add resource health alert** to configure alerts to trigger when the health status of your IoT hub changes. To learn more, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal) and related articles in the Azure Service Health documentation.

## Check all IoT hubs' health with Azure Service Health

With Azure Service Health, you can check the health status of all IoT hubs in your subscription.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to the [Service Health portal](https://portal.azure.com/#view/Microsoft_Azure_Health/AzureHealthBrowseBlade/~/serviceIssues).
 
1. From the service menu, under **RESOURCE HEALTH**, select **Resource health**.

1. In the working pane, select your subscription from the **Subscription** dropdown menu, then select **IoT Hub** from the **Resource type** dropdown menu. 

   You see a list of all IoT hubs in your subscription.

To learn more about Azure Service Health and how to interpret health data, see [Azure Service Health portal](/azure/service-health/service-health-portal-update) in the Azure Service Health documentation.

To learn how to set up alerts with Azure Service Health, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal) and related articles in the Azure Service Health documentation.

## Check health of the IoT Hub service by region on Azure status page

To check the status of IoT Hub and other services by region worldwide, view the [Azure status page](https://azure.status.microsoft/status). For more information about the Azure status page, see [Azure status overview](/azure/service-health/azure-status-overview) in the Azure Service Health documentation.

## Next steps

* See [What is Azure Service Health?](/azure/service-health/overview) for details on Azure Service Health, Azure Resource Health, and the Azure status page.
* See [Monitor Azure IoT Hub](monitor-iot-hub.md) for a description of monitoring Azure IoT Hub.
