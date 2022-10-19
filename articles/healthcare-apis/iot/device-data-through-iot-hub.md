---
title: Receive device data through Azure IoT Hub - Azure Health Data Services
description: In this tutorial, you'll learn how to enable device data routing from IoT Hub into the FHIR service through MedTech service.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: tutorial 
ms.date: 10/03/2022
ms.author: jasteppe
---

# Tutorial: Receive device data through Azure IoT Hub
 
MedTech service may be used with devices created and managed through Azure IoT Hub for enhanced workflows and ease of use. 

This tutorial provides the steps to connect and route device data from IoT Hub to your MedTech service.

## Prerequisites

- An active Azure subscription - [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- FHIR service resource with at least one MedTech service - [Deploy MedTech service using Azure portal](deploy-iot-connector-in-azure.md)
- Azure IoT Hub resource connected with real or simulated device(s) - [Create an IoT Hub using the Azure portal](../../iot-hub/iot-hub-create-through-portal.md)

Below is a diagram of the IoT device message flow from IoT Hub into MedTech service:

:::image type="content" source="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png" alt-text="Diagram of IoT message data flow through IoT Hub into the MedTech service." lightbox="media\iot-hub-to-iot-connector\iot-hub-to-iot-connector.png"::: 

##  Create a managed identity for IoT Hub

For this tutorial, we'll be using an IoT Hub with a [system-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to provide access from the IoT Hub to the MedTech service device message event hub.

For more information about how to create a system-assigned managed identity with your IoT Hub, see [IoT Hub support for managed identities](../../iot-hub/iot-hub-managed-identity.md#system-assigned-managed-identity). 

For more information on Azure role-based access control, see [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

## Connect IoT Hub with the MedTech service

Azure IoT Hub supports a feature called [message routing](../../iot-hub/iot-hub-devguide-messages-d2c.md). Message routing provides the capability to send device data to various Azure services (for example: event hub, Storage Accounts, and Service Buses). MedTech service uses this feature to allow an IoT Hub to connect and send device messages to the MedTech service device message event hub endpoint.

Follow these directions to grant access to the IoT Hub system-assigned managed identity to your MedTech service device message event hub and set up message routing: [Configure message routing with managed identities](../../iot-hub/iot-hub-managed-identity.md#egress-connectivity-from-iot-hub-to-other-azure-resources).

## Send device message to IoT Hub

> [!TIP]
> [Visual Studio Code with the Azure IoT Hub extension](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools) is a recommended method for sending IoT device messages to your IoT Hub for testing and troubleshooting.

Use your device (real or simulated) to send the sample heart rate message shown below to the IoT Hub. 

This message will get routed to MedTech service, where the message will be transformed into a FHIR Observation resource and stored into FHIR service.

> [!IMPORTANT]
> To avoid device spoofing in device-to-cloud messages, Azure IoT Hub enriches all messages with additional properties. To learn more about these properties, see [Anti-spoofing properties](../../iot-hub/iot-hub-devguide-messages-construct.md#anti-spoofing-properties).
>
> To learn about IoT Hub device message enrichment and IotJsonPathContentTemplate mappings usage with the MedTech service device mapping, see [How to use IotJsonPathContentTemplate mappings](how-to-use-iot-jsonpath-content-mappings.md).

**Sample IoT device message to send to IoT Hub**

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
> Make sure to send the device message that conforms to the [Device mappings](how-to-use-device-mappings.md) and [FHIR destinations mappings](how-to-use-fhir-mappings.md) configured with your MedTech service.

## View device data in FHIR service

You can view the FHIR Observation resource(s) created by the MedTech service on the FHIR service using Postman. For information, see [Access the FHIR service using Postman](./../fhir/use-postman.md), and make a `GET` request to `https://your-fhir-server-url/Observation?code=http://loinc.org|8867-4` to view Observation FHIR resources with heart rate value submitted in the above sample message.

> [!TIP]
> Ensure that your user has appropriate access to FHIR service data plane. Use [Azure role-based access control (Azure RBAC)](../azure-api-for-fhir/configure-azure-rbac.md) to assign required data plane roles.

## Next steps

In this tutorial, you set up an Azure IoT Hub to route device data to MedTech service. 

To learn about the different stages of data flow within MedTech service, see

>[!div class="nextstepaction"]
>[MedTech service data flow](iot-data-flow.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.