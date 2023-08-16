---
title: MedTech service Microsoft Power BI - Azure Health Data Services
description: Learn how to use the MedTech service and Power BI
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 07/21/2023
ms.author: jasteppe
---

# MedTech service and Microsoft Power BI

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this article, learn about using the MedTech service and Microsoft Power Business Intelligence (Power BI).

## The MedTech service and Power BI reference architecture

This reference architecture shows the basic components of using the Microsoft cloud services to enable Power BI on top of Internet of Things (IoT) and FHIR data.

You can even embed Power BI dashboards inside the Microsoft Teams client to further enhance care team coordination. For more information on embedding Power BI in Teams, see [Embed Power BI content in Microsoft Teams](/power-bi/collaborate-share/service-embed-report-microsoft-teams).

:::image type="content" source="media/concepts-power-bi/iot-connector-power-bi.png" alt-text="Screenshot of the MedTech service and Power BI." lightbox="media/concepts-power-bi/iot-connector-power-bi.png":::

The MedTech service can ingest IoT data from most IoT devices or gateways whatever the location, data center, or cloud.

We do encourage the use of Azure IoT services to assist with device/gateway connectivity.

:::image type="content" source="media/concepts-power-bi/iot-connector-iot-hub-power-bi.png" alt-text="Screenshot of the MedTech service, IoT Hub, and Power BI." lightbox="media/concepts-power-bi/iot-connector-iot-hub-power-bi.png":::

For some solutions, Azure IoT Central can be used in place of Azure IoT Hub.

Azure IoT Edge can be used in with IoT Hub to create an on-premises endpoint for devices and/or in-device connectivity.

:::image type="content" source="media/concepts-power-bi/iot-connector-iot-edge-power-bi.png" alt-text="Screenshot of the MedTech service, IoT Hub, IoT Edge, and Power BI." lightbox="media/concepts-power-bi/iot-connector-iot-edge-power-bi.png":::

## Next steps

In this article, you've learned about the MedTech service and Power BI integration. 

For an overview of the MedTech service, see

> [!div class="nextstepaction"]
> [What is the MedTech service?](overview.md)

To learn about the MedTech service device message data transformation, see

> [!div class="nextstepaction"]
> [Understand the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)

To learn about methods for deploying the MedTech service, see

> [!div class="nextstepaction"]
> [Choose a deployment method for the MedTech service](deploy-new-choose.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
