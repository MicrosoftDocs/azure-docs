---
title: Monitor performance metrics for the MedTech service in Azure Health Data Services
description: Learn how to monitor the performance metrics of the MedTech service in Azure Health Data Services. Find out how to configure, display, and save the metrics in an Azure portal dashboard.
services: healthcare-apis
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: medtech-service
ms.topic: how-to
ms.date: 11/21/2023
ms.author: chrupa
---

# Monitor performance metrics for the MedTech service

> [!IMPORTANT]
> As of 2/26/2025 the MedTech service will no longer be available in the following regions: UK West, UAE North, South Africa North, Qatar Central.

Gain insights into the health, availability, latency, traffic, and errors of your organization's MedTech services by monitoring MedTech service metrics in the Azure portal. To help you identify patterns or trends, pin tiles for the metrics to an Azure portal dashboard for easy access and visualization.

## Configure service metrics

1. In the Azure portal, go to the Azure Health Data Services workspace. Go to **Services** > **MedTech service**.

   :::image type="content" source="media\configure-metrics\select-medtech-service.png" alt-text="Screenshot showing how to open the MedTech service in a workspace." lightbox="media\configure-metrics\select-medtech-service.png":::

2. Select the MedTech service that you want to monitor metrics for. In this example, the MedTech service is named **mt-azuredocsdemo**. 

   :::image type="content" source="media\configure-metrics\select-medtech-service2.png" alt-text="Screenshot showing the MedTech service to display metrics for." lightbox="media\configure-metrics\select-medtech-service2.png":::

3. In the left pane, select **Monitoring** > **Metrics**.

   :::image type="content" source="media\configure-metrics\monitor-metrics.png" alt-text="Screenshot showing the selection of the Metrics menu item in the MedTech service." lightbox="media\configure-metrics\monitor-metrics.png":::

4. Choose **Add metric**.

5. Select a metric from the drop-down list. 
:::image type="content" source="media\configure-metrics\add-metric.png" alt-text="Screenshot showing drop-down list of available metrics." lightbox="media\configure-metrics\add-metric.png":::

The service performance metrics you can monitor are:

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

The screenshot shows an example of a line chart that monitors the **Number of Incoming Messages**.

:::image type="content" source="media\configure-metrics\incoming-messages-line-chart.png" alt-text="Screenshot showing the number of incoming messages line chart." lightbox="media\configure-metrics\incoming-messages-line-chart.png":::

## Save metrics as a tile on an Azure dashboard

To keep your MedTech service metrics settings and view the metrics again later, pin them as a tile on an Azure dashboard. For steps, see [Create a dashboard in the Azure portal](/azure/azure-portal/azure-portal-dashboards).

To learn more about advanced metrics display and sharing options, see [Analyze metrics with Azure Monitor metrics explorer](/azure/azure-monitor/essentials/analyze-metrics).

## Next steps

[Enable diagnostic settings for the MedTech service](how-to-enable-diagnostic-settings.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
