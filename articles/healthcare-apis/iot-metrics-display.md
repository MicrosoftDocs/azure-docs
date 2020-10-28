---
title: Displaying Azure IoT Connector for FHIR (preview) Metrics
description: This article explains the displaying of Azure IoT Connector for FHIR (preview) Metrics
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: how-to
ms.date: 10/28/2020
ms.author: jasteppe
---

# Displaying Metrics for Azure IoT Connector for FHIR (preview) 

In this article, you'll learn how to view Azure IoT Connector for FHIR* Metrics. 

> [!TIP]
> Follow the guidance in [Export Azure IoT Connector for FHIR (preview) Metrics through Diagnostic settings](https://docs.microsoft.com/azure/healthcare-apis/iot-metrics-diagnostics-export) to learn how to set up the export of Metrics data.

## View Metrics for the Azure IoT Connector for FHIR (preview)
1. To view Metrics for IoT Connectors, select your Azure API for FHIR service in the Azure portal. 

2. Navigate to **Metrics** 

3. Select the **IoT Connector** tab.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-main.png" alt-text="IoT Connector1" lightbox="media/iot-metrics-display/iot-metrics-main.png"::: 

4. Select an IoT Connector to view its Metrics (for example: There are (4) IoT Connectors associated with this Azure API for FHIR service)

   :::image type="content" source="media/iot-metrics-display/iot-metrics-select-connector.png" alt-text="IoT Connector1" lightbox="media/iot-metrics-display/iot-metrics-select-connector.png"::: 

5. Select the time period of IoT Connector Metrics to be displayed (for example: 1 hour, 24 hours, 7 days or Custom).

> [!NOTE]
> The **Custom** tab allows for creating specific time/date combinations for viewing IoT Connector Metrics.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-select-time.png" alt-text="IoT Connector1" lightbox="media/iot-metrics-display/iot-metrics-select-time.png"::: 
 
## Azure IoT Connector for FHIR (preview) Metrics types
The displayed IoT Connector Metrics are as follows:

1. **Number of Incoming Messages:** Developers - Please add verbiage.

2. **Number of Normalized Messages:** Developers - Please add verbiage.

3. **Number of Message Groups:** Developers - Please add verbiage.

4. **Average Normalized Stage Latency:** Developers - Please add verbiage.

5. **Average Group Stage Latency:** Developers - Please add verbiage. 

6. **Total Error Count** Developers - Please add verbiage. 

## Focusing on Azure IoT Connector for FHIR (preview) Metrics
In this example, we will be focusing on the **Number of Incoming Messages**.

1. Select a point-in-time that you want to focus on.

   :::image type="content" source="media/iot-metrics-display/iot-metrics-focus.png" alt-text="IoT Connector1" lightbox="media/iot-metrics-display/iot-metrics-focus.png"::: 

2. From this screen, you may **Add metric**, **Add filter** and **Apply splitting** for further customizations. 

:::image type="content" source="media/iot-metrics-display/iot-metrics-add-options.png" alt-text="IoT Connector1" lightbox="media/iot-metrics-display/iot-metrics-add-options.png"::: 

## Conclusion 
Having access to data plane metrics is essential for monitoring and troubleshooting.  Azure IoT Connector for FHIR assists you in doing these actions through Metrics. 

## Next steps

Check out frequently asked questions about the Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR FAQs](fhir-faq.md)

*In the Azure portal, the Azure IoT Connector for FHIR is referred to as IoT Connector (preview).

FHIR is the registered trademark of HL7 and is used with the permission of HL7.