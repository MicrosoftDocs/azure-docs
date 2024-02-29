---
title: MedTech service Microsoft Power BI - Azure Health Data Services
description: Learn how to use the MedTech service and Power BI
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: conceptual
ms.date: 07/21/2023
ms.author: jasteppe
---

# MedTech service and Microsoft Power BI

In this article, learn about using the MedTech service and Microsoft Power Business Intelligence (Power BI).

## The MedTech service and Power BI reference architecture

This reference architecture shows the basic components of using the Microsoft cloud services to enable Power BI on top of Internet of Things (IoT) and FHIR&reg; data.

You can even embed Power BI dashboards inside the Microsoft Teams client to further enhance care team coordination. For more information on embedding Power BI in Teams, see [Embed Power BI content in Microsoft Teams](/power-bi/collaborate-share/service-embed-report-microsoft-teams).

:::image type="content" source="media/concepts-power-bi/iot-connector-power-bi.png" alt-text="Screenshot of the MedTech service and Power BI." lightbox="media/concepts-power-bi/iot-connector-power-bi.png":::

The MedTech service can ingest IoT data from most IoT devices or gateways whatever the location, data center, or cloud.

We do encourage the use of Azure IoT services to assist with device/gateway connectivity.

:::image type="content" source="media/concepts-power-bi/iot-connector-iot-hub-power-bi.png" alt-text="Screenshot of the MedTech service, IoT Hub, and Power BI." lightbox="media/concepts-power-bi/iot-connector-iot-hub-power-bi.png":::

For some solutions, Azure IoT Central can be used in place of Azure IoT Hub.

Azure IoT Edge can be used in with IoT Hub to create an on-premises endpoint for devices and/or in-device connectivity.

:::image type="content" source="media/concepts-power-bi/iot-connector-iot-edge-power-bi.png" alt-text="Screenshot of the MedTech service, IoT Hub, IoT Edge, and Power BI." lightbox="media/concepts-power-bi/iot-connector-iot-edge-power-bi.png":::

## Next steps

[What is the MedTech service?](overview.md)

[Understand the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)

[Choose a deployment method for the MedTech service](deploy-new-choose.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
