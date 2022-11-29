---
title: MedTech service and Teams notifications - Azure Health Data Services
description: In this article, you'll learn how to use the MedTech service and Teams notifications
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 08/16/2022
ms.author: jasteppe
---

# MedTech service and Microsoft Teams notifications

In this article, we'll explore using the MedTech service and Microsoft Teams for notifications.

## MedTech service and Teams notifications reference architecture

When combining the MedTech service, a Fast Healthcare Interoperability Resources (FHIR&#174;) service, and Teams, you can enable multiple care solutions.

Below is the MedTech service to Teams notifications conceptual architecture for enabling the MedTech service, the FHIR service, and the Teams Patient App.

You can even embed Power BI Dashboards inside the Microsoft Teams client. For more information on embedding Power BI in Microsoft Team visit [here](/power-bi/collaborate-share/service-embed-report-microsoft-teams).

:::image type="content" source="media/iot-concepts/iot-connector-teams.png" alt-text="Screenshot of the MedTech service and Teams." lightbox="media/iot-concepts/iot-connector-teams.png":::

The MedTech service for can ingest IoT data from most IoT devices or gateways regardless of location, data center, or cloud.

We do encourage the use of Azure IoT services to assist with device/gateway connectivity.

:::image type="content" source="media/iot-concepts/iot-connector-iot-hub-teams.png" alt-text="Screenshot of the MedTech service and IoT Hub." lightbox="media/iot-concepts/iot-connector-iot-hub-teams.png":::

For some solutions, Azure IoT Central can be used in place of Azure IoT Hub.

Azure IoT Edge can be used in with IoT Hub to create an on-premises end point for devices and/or in-device connectivity.

:::image type="content" source="media/iot-concepts/iot-connector-iot-edge-teams.png" alt-text="Screenshot of the MedTech service and IoT Edge." lightbox="media/iot-concepts/iot-connector-iot-edge-teams.png":::

## Next steps

In this article, you've learned about the MedTech service and Teams notifications integration. For an overview of the MedTech service, see

>[!div class="nextstepaction"]
>[MedTech service overview](iot-connector-overview.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
