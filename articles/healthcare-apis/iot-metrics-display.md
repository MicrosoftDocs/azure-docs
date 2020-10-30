---
title: View and configure Azure IoT Connector for FHIR (preview) Metrics
description: This article explains the displaying and configuring of Azure IoT Connector for FHIR (preview) Metrics
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 10/29/2020
ms.author: jasteppe
---

# View and configure Azure IoT Connector for FHIR (preview) Metrics 

In this article, you'll learn how to view and configure Azure IoT Connector for FHIR* Metrics. 

> [!TIP]
> Follow the guidance in [Export Azure IoT Connector for FHIR (preview) Metrics through Diagnostic settings](https://docs.microsoft.com/azure/healthcare-apis/iot-metrics-diagnostics-export) to learn how to set up the export of Metrics data.

## View Metrics for Azure IoT Connector for FHIR (preview)
1. To view Metrics for IoT Connectors, select your Azure API for FHIR service in the Azure portal. 

2. Navigate to **Metrics** 

3. Select the **IoT Connector** tab.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-main.png" alt-text="IoT Connector1" lightbox="media/iot-metrics-display/iot-metrics-main.png"::: 

4. Select an IoT Connector to view its Metrics (for example: there are (4) IoT Connectors associated with this Azure API for FHIR service).

   :::image type="content" source="media/iot-metrics-display/iot-metrics-select-connector.png" alt-text="IoT Connector2" lightbox="media/iot-metrics-display/iot-metrics-select-connector.png"::: 

> [!NOTE]
> The **Custom** tab allows for creating specific time/date combinations for viewing IoT Connector Metrics.

5. Select the time period of IoT Connector Metrics to be displayed (for example: 1 hour, 24 hours, 7 days or Custom).

   :::image type="content" source="media/iot-metrics-display/iot-metrics-select-time.png" alt-text="IoT Connector3" lightbox="media/iot-metrics-display/iot-metrics-select-time.png"::: 
 
## Metrics types for Azure IoT Connector for FHIR (preview) 
The displayed IoT Connector Metrics are as follows:

|Metrics Type|Metrics Purpose| 
|-----------|--------------|
|Number of Incoming Messages|The number of received raw incoming messages (for example: the device events).|
|Number of Normalized Messages|The number of the normalized messages.|
|Number of Message Groups|The number of groups that have messages aggregated in designated time window.|
|Average Normalized Stage Latency|Average latency of the normalize stage. Normalize stage is to perform normalization on raw incoming messages.|
|Average Group Stage Latency|Average latency of the group stage. Group stage is to perform buffering, aggregating, and grouping on normalized messages.| 
|Total Error Count|Total number of errors.| 

## Focusing and configuring Azure IoT Connector for FHIR (preview) Metrics
In this example, we will be focusing on the **Number of Incoming Messages** Metrics.

1. Select a point-in-time that you want to focus on.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-focus.png" alt-text="IoT Connector4" lightbox="media/iot-metrics-display/iot-metrics-focus.png"::: 

2. From this screen, you may **Add metric**, **Add filter** and **Apply splitting** for further customizations. 

   :::image type="content" source="media/iot-metrics-display/iot-metrics-add-options.png" alt-text="IoT Connector5" lightbox="media/iot-metrics-display/iot-metrics-add-options.png"::: 

## Conclusion 
Having access to data plane metrics is essential for monitoring and troubleshooting.  Azure IoT Connector for FHIR assists you in doing these actions through Metrics. 

## Next steps

Check out frequently asked questions about the Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR FAQs](fhir-faq.md)

*In the Azure portal, the Azure IoT Connector for FHIR is referred to as IoT Connector (preview).

FHIR is the registered trademark of HL7 and is used with the permission of HL7.