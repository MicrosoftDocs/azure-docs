---
title: IoT connector and Teams notifications - Azure Healthcare APIs
description: In this article, you'll learn how to use IoT connector and Teams notifications 
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: conceptual
ms.date: 11/05/2021
ms.author: jasteppe
---

# IoT connector and Microsoft Teams notifications

In this article, we'll explore using IoT connector and Microsoft Teams for notifications.

## IoT connector and Teams notifications reference architecture

When combining IoT connector, a Fast Healthcare Interoperability Resources (FHIR&#174;) service, and Teams, you can enable multiple care solutions. 

Below is the IoT connector to Teams notifications conceptual architecture for enabling IoT connector, FHIR, and Teams Patient App. 

You can even embed Power BI Dashboards inside the Microsoft Teams client. For more information on embedding Power BI in Microsoft Team visit [here](/power-bi/collaborate-share/service-embed-report-microsoft-teams).

:::image type="content" source="media/iot-concepts/iot-connector-teams.png" alt-text="Screenshot of IoT connector and Teams." lightbox="media/iot-concepts/iot-connector-teams.png":::

The IoT connector for can ingest IoT data from most IoT devices or gateways regardless of location, data center, or cloud. 

We do encourage the use of Azure IoT services to assist with device/gateway connectivity.

:::image type="content" source="media/iot-concepts/iot-connector-iot-hub-teams.png" alt-text="Screenshot of IoT connector and IoT Hub." lightbox="media/iot-concepts/iot-connector-iot-hub-teams.png":::

For some solutions, Azure IoT Central can be used in place of Azure IoT Hub.

Azure IoT Edge can be used in with IoT Hub to create an on-premise end point for devices and/or in-device connectivity.

:::image type="content" source="media/iot-concepts/iot-connector-iot-edge-teams.png" alt-text="Screenshot of IoT connector and IoT Edge." lightbox="media/iot-concepts/iot-connector-iot-edge-teams.png":::

## Next steps

In this article, you've learned about IoT connector and Teams notifications integration. For an overview of IoT connector, see

>[!div class="nextstepaction"]
>[IoT connector overview](iot-connector-overview.md)

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
