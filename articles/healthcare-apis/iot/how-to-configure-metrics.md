---
title: Configure the MedTech service metrics - Azure Health Data Services
description: This article explains how to display MedTech service metrics.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 10/12/2022
ms.author: jasteppe
---

# How to configure the MedTech service metrics

In this article, you'll learn how to configure the [MedTech service](iot-connector-overview.md) metrics in the Azure portal. You'll also learn how to pin the MedTech service metrics tile to an Azure portal dashboard for later viewing.

The MedTech service metrics can be used to help determine the health and performance of your MedTech service and can be useful with troubleshooting and seeing patterns and/or trends with your MedTech service. 

## Metric types for the MedTech service

This table shows the available MedTech service metrics and the information that the metrics are capturing and displaying within the Azure portal:  

Metric category|Metric name|Metric description|
|--------------|-----------|--------------|
|Availability|IotConnector Health Status|The overall health of the MedTech service.|
|Errors|Total Error Count|The total number of errors.|
|Latency|Average Group Stage Latency|The average latency of the group stage. The [group stage](iot-data-flow.md#group) performs buffering, aggregating, and grouping on normalized messages.|
|Latency|Average Normalize Stage Latency|The average latency of the normalized stage. The [normalized stage](iot-data-flow.md#normalize) performs normalization on raw incoming messages.|
|Traffic|Number of Fhir resources saved|The total number of Fast Healthcare Interoperability Resources (FHIR&#174;) resources [updated or persisted](iot-data-flow.md#persist) by the MedTech service.|
|Traffic|Number of Incoming Messages|The number of received raw [incoming messages](iot-data-flow.md#ingest) (for example, the device events) from the configured source event hub.|
|Traffic|Number of Measurements|The number of normalized value readings received by the FHIR [transformation stage](iot-data-flow.md#transform) of the MedTech service.|
|Traffic|Number of Message Groups|The number of groups that have messages aggregated in the designated time window.|
|Traffic|Number of Normalized Messages|The number of normalized messages.|

## Configure the MedTech service metrics

1. Within your Azure Health Data Services workspace, select **MedTech service** under **Services**.

   :::image type="content" source="media\iot-metrics-display\workspace-displayed-with-connectors-button.png" alt-text="Screenshot of select the MedTech service within the workspace." lightbox="media\iot-metrics-display\workspace-displayed-with-connectors-button.png":::

2. Select the MedTech service that you would like to display metrics for. For this example, we'll select a MedTech service named **mt-azuredocsdemo**. You'll be selecting a MedTech service within your own Azure Health Data Services workspace.

   :::image type="content" source="media\iot-metrics-display\select-medtech-service.png" alt-text="Screenshot of select the MedTech service you would like to display metrics for." lightbox="media\iot-metrics-display\select-medtech-service.png":::

3. Select **Metrics** within the MedTech service page.

   :::image type="content" source="media\iot-metrics-display\select-metrics-under-monitoring.png" alt-text="Screenshot of select the Metrics option within your MedTech service." lightbox="media\iot-metrics-display\select-metrics-under-monitoring.png":::

4. The MedTech service metrics page will open allowing you to use the drop-down menus to view and select the metrics that are available for the MedTech service.

   :::image type="content" source="media\iot-metrics-display\select-metrics-to-display.png" alt-text="Screenshot the MedTech service metrics page with drop-down menus." lightbox="media\iot-metrics-display\select-metrics-to-display.png":::

5. Select the metrics combinations that you want to display for your MedTech service. For this example, we'll be choosing the following selections:

   * **Scope** = Your MedTech service name (**Default**)
   * **Metric Namespace** = Standard metrics (**Default**)
   * **Metric** = The MedTech service metrics you want to display. For this example, we'll choose **Number of Incoming Messages**.
   * **Aggregation** = How you would like to display the metrics. For this example, we'll choose **Count**.

6. You can now see your MedTech service metrics for **Number of Incoming Messages** displayed on the MedTech service metrics page.

   :::image type="content" source="media\iot-metrics-display\select-metrics-being-displayed.png" alt-text="Screenshot of select metrics to display." lightbox="media\iot-metrics-display\select-metrics-being-displayed.png":::

7. You can add more metrics for your MedTech service by selecting **Add metric**.

   :::image type="content" source="media\iot-metrics-display\select-add-metric.png" alt-text="Screenshot of select Add metric to add more MedTech service metrics." lightbox="media\iot-metrics-display\select-add-metric.png":::

8. Then select the metrics that you would like to add to your MedTech service.

   :::image type="content" source="media\iot-metrics-display\select-more-metrics.png" alt-text="Screenshot of select more metrics to add to your MedTech service." lightbox="media\iot-metrics-display\select-more-metrics.png":::

   > [!IMPORTANT]
   > If you leave the MedTech service metrics page, the metrics settings for your MedTech service are lost and will have to be recreated. If you would like to save your MedTech service metrics for future viewing, you can pin them to an Azure portal dashboard as a tile. 
   >
   > To learn how to to create an Azure portal dashboard and pin tiles, see [How to create an Azure portal dashboard and pin tiles](how-to-configure-metrics.md#how-to-create-an-azure-portal-dashboard-and-pin-tiles)
   
   > [!TIP]
   > To learn more about advanced metrics display and sharing options, see [Getting started with Azure Metrics Explorer](/azure/azure-monitor/essentials/metrics-getting-started)

## How to create an Azure portal dashboard and pin tiles

To learn how to create an Azure portal dashboard and pin tiles, see [Create a dashboard in the Azure portal](/azure/azure-portal/azure-portal-dashboards)

## Next steps

To learn how to enable the MedTech service diagnostic settings to export logs and metrics to another location (for example: an Azure storage account) for audit, backup, or troubleshooting, see

> [!div class="nextstepaction"]
> [How to enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md)

(FHIR&#174;) is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
