---
title: MedTech service and Teams notifications - Azure Health Data Services
description: Learn how to use the MedTech service and Teams notifications
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 07/21/2023
ms.author: jasteppe
---

# MedTech service and Microsoft Teams notifications

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this article, learn about using the MedTech service and Microsoft Teams for notifications.

## The MedTech service and Teams notifications reference architecture

When combining the MedTech service, the FHIR service, and Teams, you can enable multiple care solutions.

The diagram is a MedTech service to Teams notifications conceptual architecture for enabling the MedTech service, the FHIR service, and the Teams Patient App.

You can even embed Power BI Dashboards inside the Microsoft Teams client. For more information on embedding Power BI in Microsoft Team, see [Embed Power BI content in Microsoft Teams](/power-bi/collaborate-share/service-embed-report-microsoft-teams).

:::image type="content" source="media/concepts-teams/iot-connector-teams.png" alt-text="Screenshot of the MedTech service and Teams." lightbox="media/concepts-teams/iot-connector-teams.png":::

The MedTech service for can ingest IoT data from most IoT devices or gateways regardless of location, data center, or cloud.

We do encourage the use of Azure IoT services to assist with device/gateway connectivity.

:::image type="content" source="media/concepts-teams/iot-connector-iot-hub-teams.png" alt-text="Screenshot of the MedTech service and IoT Hub." lightbox="media/concepts-teams/iot-connector-iot-hub-teams.png":::

For some solutions, Azure IoT Central can be used in place of Azure IoT Hub.

Azure IoT Edge can be used in with IoT Hub to create an on-premises end point for devices and/or in-device connectivity.

:::image type="content" source="media/concepts-teams/iot-connector-iot-edge-teams.png" alt-text="Screenshot of the MedTech service and IoT Edge." lightbox="media/concepts-teams/iot-connector-iot-edge-teams.png":::

## Next steps

In this article, you've learned about the MedTech service and Teams notifications integration. 

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
