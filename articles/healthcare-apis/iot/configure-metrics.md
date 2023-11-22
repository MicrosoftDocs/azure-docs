---
title: Configure service metrics for the MedTech service in Azure Health Data Services
description: Learn how to configure MedTech service metrics in the Azure portal. Find out how to use the metrics to monitor and troubleshoot MedTech service issues.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 11/21/2023
ms.author: jasteppe
---

# Configure service metrics for the MedTech service
Gain insights into the health, availability, latency, traffic, and errors of your organization's MedTech services by displaying MedTech service metrics in the Azure portal. To help you identify patterns or trends, pin tiles for the metrics to an Azure portal dashboard for easy access and visualization.

## Metric types for the MedTech service

This table shows MedTech service metrics and what they measure in the Azure portal.  

Metric category|Metric name|Metric description|
|--------------|-----------|--------------|
|Availability|IotConnector Health Status|The overall health of the MedTech service.|
|Errors|Total Error Count|The total number of errors.|
|Latency|Average Group Stage Latency|The average latency of the group stage. The [group stage](overview-of-device-data-processing-stages.md#group---optional) performs buffering, aggregating, and grouping on normalized messages.|
|Latency|Average Normalize Stage Latency|The average latency of the normalized stage. The [normalized stage](overview-of-device-data-processing-stages.md#normalize) performs normalization on raw incoming messages.|
|Traffic|Number of FHIR resources saved|The total number of FHIR&reg; resources [updated or persisted](overview-of-device-data-processing-stages.md#persist) by the MedTech service.|
|Traffic|Number of Incoming Messages|The number of received raw [incoming messages](overview-of-device-data-processing-stages.md#ingest) (for example, the device events) from the configured source event hub.|
|Traffic|Number of Measurements|The number of normalized value readings received by the FHIR [transformation stage](overview-of-device-data-processing-stages.md#transform) of the MedTech service.|
|Traffic|Number of Message Groups|The number of groups that have messages aggregated in the designated time window.|
|Traffic|Number of Normalized Messages|The number of normalized messages.|

## Configure service metrics

1. In the Azure portal, go to your Azure Health Data Services workspace. Select  and select **Services** > **MedTech service**.

   :::image type="content" source="media\configure-metrics\select-medtech-service-crop.png" alt-text="Screenshot showing how to open the MedTech service in a workspace." lightbox="media\configure-metrics\select-medtech-service.png":::

2. Select the MedTech service that you want to display metrics for. In this example, we select a MedTech service named **mt-azuredocsdemo**. You need to select a MedTech service within your organization's Azure Health Data Services workspace.

   :::image type="content" source="media\configure-metrics\select-medtech-service2-crop.png" alt-text="Screenshot showing the MedTech service to display metrics for." lightbox="media\configure-metrics\select-medtech-service2.png":::

3. Select **Metrics** within the MedTech service page.

   :::image type="content" source="media\configure-metrics\select-metrics-under-monitoring.png" alt-text="Screenshot showing the selection of the Metrics option in the MedTech service." lightbox="media\configure-metrics\select-metrics-under-monitoring.png":::

4. The MedTech service metrics page opens, allowing you to use the drop-down menus to view and select the metrics you want.

   :::image type="content" source="media\configure-metrics\select-metrics-to-display.png" alt-text="Screenshot showing the MedTech service metrics page with drop-down menus." lightbox="media\configure-metrics\select-metrics-to-display.png":::

5. Select the metrics to display for your MedTech service. The metrics are:

   * **Scope** = The MedTech service name (**Default**)
   * **Metric Namespace** = Standard metrics (**Default**)
   * **Metric** = The MedTech service metrics you want to display. For example, select **Number of Incoming Messages**.
   * **Aggregation** = How you would like to display the metrics. For example, select **Count**.

6. You can now see your MedTech service metrics for **Number of Incoming Messages** displayed on the MedTech service metrics page.

   :::image type="content" source="media\configure-metrics\select-metrics-being-displayed.png" alt-text="Screenshot showing the selection of metrics to display." lightbox="media\configure-metrics\select-metrics-being-displayed.png":::

7. Add more metrics by selecting **Add metric**.

   :::image type="content" source="media\configure-metrics\select-add-metric.png" alt-text="Screenshot showing select Add metric to add more MedTech service metrics." lightbox="media\configure-metrics\select-add-metric.png":::

8. Then select the metrics that you would like to add to the MedTech service.

   :::image type="content" source="media\configure-metrics\select-more-metrics.png" alt-text="Screenshot showing selection of more metrics to add to the MedTech service." lightbox="media\configure-metrics\select-more-metrics.png":::

   > [!IMPORTANT]
   > Before you leave the MedTech service metrics page, save the metrics by pinning them as a tile on an Azure dashboard. Otherwise, the metrics settings will be lost and you'll need to recreate them. 

   > [!TIP]
   > To learn more about advanced metrics display and sharing options, see [Analyze metrics with Azure Monitor metrics explorer](../../azure-monitor/essentials/analyze-metrics.md).

## Create a dashboard and pin tiles

For more information, see [Create a dashboard in the Azure portal](../../azure-portal/azure-portal-dashboards.md)

## Next steps

[Enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
