---
title: Display and configure Azure IoT Connector for FHIR (preview) metrics
description: This article explains how to display and configure Azure IoT Connector for FHIR (preview) metrics.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 10/29/2020
ms.author: jasteppe
---

# Display and configure Azure IoT Connector for FHIR (preview) metrics 

In this article, you'll learn how to display and configure Azure IoT Connector for Fast Healthcare Interoperability Resources (FHIR)* metrics.

> [!NOTE]
> In the Azure portal, Azure IoT Connector for FHIR is referred to as IoT Connector (preview).

> [!TIP]
> To learn how to set up the export of metrics data, follow the guidance in [Export Azure IoT Connector for FHIR (preview) metrics through diagnostics settings](https://docs.microsoft.com/azure/healthcare-apis/iot-metrics-diagnostics-export).

## Display metrics for Azure IoT Connector for FHIR (preview)

1. Sign in to the Azure portal, and then select your Azure API for FHIR service. 

2. On the left pane, select **Metrics**. 

3. Select the **IoT Connector** tab.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-main.png" alt-text="Screenshot of the 'IoT Connector' pane, with line graphs displaying the number of incoming and normalized messages." lightbox="media/iot-metrics-display/iot-metrics-main.png"::: 

4. Select an IoT Connector to view its metrics. For example, there are four IoT Connectors (*connector 1*, *connector 2*, and so on) associated with this Azure API for FHIR service.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-select-connector.png" alt-text="Screenshot of the 'IoT Connector' pane, displaying IoT Connector tabs 1, 2, 3, and 4." lightbox="media/iot-metrics-display/iot-metrics-select-connector.png"::: 

5. Select the time period (for example, **1 hour**, **24 hours**, **7 days**, or **Custom**) of the IoT Connector metrics you want to display. By selecting the **Custom** tab, you can create specific time/date combinations for displaying IoT Connector metrics.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-select-time.png" alt-text="Screenshot of the 'IoT Connector' pane, displaying a '1 hour' time period line graph for 'connector 1'." lightbox="media/iot-metrics-display/iot-metrics-select-time.png"::: 
 
## Metric types for Azure IoT Connector for FHIR (preview) 

The IoT Connector metrics you can display are listed in the following table:

|Metric type|Metric purpose| 
|-----------|--------------|
|Number of Incoming Messages|Displays the number of received raw incoming messages (for example, the device events).|
|Number of Normalized Messages|Displays the number of normalized messages.|
|Number of Message Groups|Displays the number of groups that have messages aggregated in the designated time window.|
|Average Normalized Stage Latency|Displays the average latency of the normalized stage. The normalized stage performs normalization on raw incoming messages.|
|Average Group Stage Latency|Displays the average latency of the group stage. The group stage performs buffering, aggregating, and grouping on normalized messages.| 
|Total Error Count|Displays the total number of errors.| 

## Focus on and configure Azure IoT Connector for FHIR (preview) metrics

In this example, let's focus on the **Number of Incoming Messages** metric.

1. Select a point-in-time that you want to focus on.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-focus.png" alt-text="Screenshot of the 'Number of Incoming Messages' metric pane, highlighting a single point in time on the line graph." lightbox="media/iot-metrics-display/iot-metrics-focus.png"::: 

2. On the **Number of Incoming Messages** pane, you can further customize the metric by selecting **Add metric**, **Add filter**, or **Apply splitting**. 

   :::image type="content" source="media/iot-metrics-display/iot-metrics-add-options.png" alt-text="Screenshot of the 'Number of Incoming Messages' metric pane, highlighting the 'Add metric,' 'Add filter,' and 'Apply splitting' buttons." lightbox="media/iot-metrics-display/iot-metrics-add-options.png"::: 

## Conclusion 
Having access to data plane metrics is essential for monitoring and troubleshooting. Azure IoT Connector for FHIR assists you with these actions through metrics. 

## Next steps

Get answers to frequently asked questions about Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR FAQ](fhir-faq.md)

*FHIR is a registered trademark of HL7 and is used with the permission of HL7.
