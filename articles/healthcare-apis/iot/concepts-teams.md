---
title: MedTech service and Teams notifications - Azure Health Data Services
description: Learn how to use the MedTech service and Teams notifications
author: chachachachami
ms.service: azure-health-data-services
ms.subservice: medtech-service
ms.topic: conceptual
ms.date: 07/21/2023
ms.author: chrupa
---

# MedTech service and Microsoft Teams notifications

> [!IMPORTANT]
> As of 2/26/2025 the MedTech service will no longer be available in the following regions: UK West, UAE North, South Africa North, Qatar Central.

In this article, learn about using the MedTech service and Microsoft Teams for notifications.

## The MedTech service and Teams notifications reference architecture

When combining the MedTech service, the FHIR&reg; service, and Teams, you can enable multiple care solutions.

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

[What is the MedTech service?](overview.md)

[Understand the MedTech service device data processing stages](overview-of-device-data-processing-stages.md)

[Choose a deployment method for the MedTech service](deploy-new-choose.md)

[!INCLUDE[FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
