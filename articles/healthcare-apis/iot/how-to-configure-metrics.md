---
title: How to configure the MedTech service metrics - Azure Health Data Services
description: Learn how to configure the MedTech service metrics.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 06/19/2023
ms.author: jasteppe
---

# How to configure the MedTech service metrics

In this article, learn how to configure the MedTech service metrics in the Azure portal. Also learn how to pin the MedTech service metrics tile to an Azure portal dashboard for later viewing.

The MedTech service metrics can be used to help determine the health and performance of your MedTech service and can be useful with troubleshooting and seeing patterns and/or trends with your MedTech service. 

## Metric types for the MedTech service

This table shows the available MedTech service metrics and the information that the metrics are capturing and displaying within the Azure portal:  

Metric category|Metric name|Metric description|
|--------------|-----------|--------------|
|Availability|IotConnector Health Status|The overall health of the MedTech service.|
|Errors|Total Error Count|The total number of errors.|
|Latency|Average Group Stage Latency|The average latency of the group stage. The [group stage](overview-of-device-data-processing-stages.md#group---optional) performs buffering, aggregating, and grouping on normalized messages.|
|Latency|Average Normalize Stage Latency|The average latency of the normalized stage. The [normalized stage](overview-of-device-data-processing-stages.md#normalize) performs normalization on raw incoming messages.|
|Traffic|Number of Fhir resources saved|The total number of FHIR&reg; resources [updated or persisted](overview-of-device-data-processing-stages.md#persist) by the MedTech service.|
|Traffic|Number of Incoming Messages|The number of received raw [incoming messages](overview-of-device-data-processing-stages.md#ingest) (for example, the device events) from the configured source event hub.|
|Traffic|Number of Measurements|The number of normalized value readings received by the FHIR [transformation stage](overview-of-device-data-processing-stages.md#transform) of the MedTech service.|
|Traffic|Number of Message Groups|The number of groups that have messages aggregated in the designated time window.|
|Traffic|Number of Normalized Messages|The number of normalized messages.|

## Configure the MedTech service metrics

1. Within your Azure Health Data Services workspace, select **MedTech service** under **Services**.

   :::image type="content" source="media\how-to-configure-metrics\workspace-displayed-with-connectors-button.png" alt-text="Screenshot of select the MedTech service within the workspace." lightbox="media\how-to-configure-metrics\workspace-displayed-with-connectors-button.png":::

2. Select the MedTech service that you would like to display metrics for. For this example, we'll select a MedTech service named **mt-azuredocsdemo**. You'll be selecting a MedTech service within your own Azure Health Data Services workspace.

   :::image type="content" source="media\how-to-configure-metrics\select-medtech-service.png" alt-text="Screenshot of select the MedTech service you would like to display metrics for." lightbox="media\how-to-configure-metrics\select-medtech-service.png":::

3. Select **Metrics** within the MedTech service page.

   :::image type="content" source="media\how-to-configure-metrics\select-metrics-under-monitoring.png" alt-text="Screenshot of select the Metrics option within your MedTech service." lightbox="media\how-to-configure-metrics\select-metrics-under-monitoring.png":::

4. The MedTech service metrics page will open allowing you to use the drop-down menus to view and select the metrics that are available for the MedTech service.

   :::image type="content" source="media\how-to-configure-metrics\select-metrics-to-display.png" alt-text="Screenshot the MedTech service metrics page with drop-down menus." lightbox="media\how-to-configure-metrics\select-metrics-to-display.png":::

5. Select the metrics combinations that you want to display for your MedTech service. For this example, we'll be choosing the following selections:

   * **Scope** = Your MedTech service name (**Default**)
   * **Metric Namespace** = Standard metrics (**Default**)
   * **Metric** = The MedTech service metrics you want to display. For this example, we'll choose **Number of Incoming Messages**.
   * **Aggregation** = How you would like to display the metrics. For this example, we'll choose **Count**.

6. You can now see your MedTech service metrics for **Number of Incoming Messages** displayed on the MedTech service metrics page.

   :::image type="content" source="media\how-to-configure-metrics\select-metrics-being-displayed.png" alt-text="Screenshot of select metrics to display." lightbox="media\how-to-configure-metrics\select-metrics-being-displayed.png":::

7. You can add more metrics for your MedTech service by selecting **Add metric**.

   :::image type="content" source="media\how-to-configure-metrics\select-add-metric.png" alt-text="Screenshot of select Add metric to add more MedTech service metrics." lightbox="media\how-to-configure-metrics\select-add-metric.png":::

8. Then select the metrics that you would like to add to your MedTech service.

   :::image type="content" source="media\how-to-configure-metrics\select-more-metrics.png" alt-text="Screenshot of select more metrics to add to your MedTech service." lightbox="media\how-to-configure-metrics\select-more-metrics.png":::

   > [!IMPORTANT]
   > If you leave the MedTech service metrics page, the metrics settings for your MedTech service are lost and will have to be recreated. If you would like to save your MedTech service metrics for future viewing, you can pin them to an Azure portal dashboard as a tile. 
   >
   > To learn how to create an Azure portal dashboard and pin tiles, see [How to create an Azure portal dashboard and pin tiles](how-to-configure-metrics.md#how-to-create-an-azure-portal-dashboard-and-pin-tiles)
   
   > [!TIP]
   > To learn more about advanced metrics display and sharing options, see [Analyze metrics with Azure Monitor metrics explorer](../../azure-monitor/essentials/analyze-metrics.md).

## How to create an Azure portal dashboard and pin tiles

To learn how to create an Azure portal dashboard and pin tiles, see [Create a dashboard in the Azure portal](../../azure-portal/azure-portal-dashboards.md)

## Next steps

[How to enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
