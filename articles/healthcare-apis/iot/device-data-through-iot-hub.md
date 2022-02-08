---
title: Receive device data through Azure IoT Hub - Azure Healthcare APIs
description: In this tutorial, you'll learn how to enable device data routing from IoT Hub into FHIR service through IoT connector.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: tutorial 
ms.date: 1/20/2022
ms.author: jasteppe
---

# Tutorial: Receive device data through Azure IoT Hub

> [!IMPORTANT]
> Azure Healthcare APIs is currently in PREVIEW. The [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
 
IoT connector may be used with devices created and managed through Azure IoT Hub for enhanced workflows and ease of use. 

This tutorial provides the steps to connect and route device data from IoT Hub to IoT connector.

## Prerequisites

- An active Azure subscription - [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- FHIR service resource with at least one IoT connector - [Deploy IoT connector using Azure portal](deploy-iot-connector-in-azure.md)
- Azure IoT Hub resource connected with real or simulated device(s) - [Create an IoT Hub using the Azure portal](../../iot-hub/iot-hub-create-through-portal.md)

> [!TIP]
> If you are using an Azure IoT Hub simulated device application, feel free to pick the application of your choice amongst different supported languages and systems.

Below is a diagram of the IoT device message flow from IoT Hub into IoT connector:

:::image type="content" source="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png" alt-text="Diagram of IoT message data flow through IoT Hub into IoT connector." lightbox="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png"::: 

##  Create a managed identity for IoT Hub

For this tutorial, we'll be using an IoT Hub with a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to provide access from the IoT Hub to the IoT connector device message event hub.

For more information about how to create a system-assigned managed identity with your IoT Hub, see [IoT Hub support for managed identities](../../iot-hub/iot-hub-managed-identity.md#system-assigned-managed-identity). 

For more information on Azure role-based access control, see [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

## Connect IoT Hub with IoT connector

Azure IoT Hub supports a feature called [message routing](../../iot-hub/iot-hub-devguide-messages-d2c.md). Message routing provides the capability to send device data to various Azure services (for example: Event Hubs, Storage Accounts, and Service Buses). IoT connector uses this feature to allow an IoT Hub to connect and send device messages to the IoT connector device message event hub endpoint.

Follow these directions to grant access to the IoT Hub user-assigned managed identity to your IoT connector device message event hub and set up message routing: [Configure message routing with managed identities](../../iot-hub/iot-hub-managed-identity.md#egress-connectivity-from-iot-hub-to-other-azure-resources). 

## Send device message to IoT Hub

Use your device (real or simulated) to send the sample heart rate message shown below to the IoT Hub. 

This message will get routed to IoT connector, where the message will be transformed into a FHIR Observation resource and stored into the FHIR service.

```json
{
  "HeartRate": 80,
  "RespiratoryRate": 12,
  "HeartRateVariability": 64,
  "BodyTemperature": 99.08839032397609,
  "BloodPressure": {
    "Systolic": 23,
    "Diastolic": 34
  },
  "Activity": "walking"
}
```
> [!IMPORTANT]
> Make sure to send the device message that conforms to the [Device mappings](how-to-use-device-mappings.md) and [FHIR destinations mappings](how-to-use-fhir-mappings.md) configured with your IoT connector.

## View device data in FHIR service

You can view the FHIR Observation resource(s) created by IoT connector on the FHIR service using Postman. For information, see [Access the FHIR service using Postman](./../fhir/use-postman.md), and make a `GET` request to `https://your-fhir-server-url/Observation?code=http://loinc.org|8867-4` to view Observation FHIR resources with heart rate value submitted in the above sample message.

> [!TIP]
> Ensure that your user has appropriate access to FHIR service data plane. Use [Azure role-based access control (Azure RBAC)](../azure-api-for-fhir/configure-azure-rbac.md) to assign required data plane roles.

## Next steps

In this tutorial, you set up an Azure IoT Hub to route device data to IoT connector. 

To learn about the different stages of data flow within IoT connector, see:

>[!div class="nextstepaction"]
>[IoT connector data flow](iot-data-flow.md)

(FHIR&#174;) is a registered trademark of HL7 and is used with the permission of HL7.