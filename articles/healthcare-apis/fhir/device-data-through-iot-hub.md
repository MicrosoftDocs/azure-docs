---
title: 'Tutorial: Receive device data through Azure IoT Hub'
description: In this tutorial, you'll learn how to enable device data routing from IoT Hub into Azure API for FHIR through Azure IoT Connector for FHIR.
services: healthcare-apis
author: ms-puneet-nagpal
ms.service: healthcare-apis
ms.subservice: iomt
ms.topic: tutorial 
ms.date: 11/13/2020
ms.author: punagpal
---

# Tutorial: Receive device data through Azure IoT Hub

Azure IoT Connector for Fast Healthcare Interoperability Resources (FHIR&#174;)* provides you the capability to ingest data from Internet of Medical Things (IoMT) devices into Azure API for FHIR. The [Deploy Azure IoT Connector for FHIR (preview) using Azure portal](iot-fhir-portal-quickstart.md) quickstart showed an example of device managed by Azure IoT Central [sending telemetry](iot-fhir-portal-quickstart.md#connect-your-devices-to-iot) to Azure IoT Connector for FHIR. Azure IoT Connector for FHIR can also work with devices provisioned and managed through Azure IoT Hub. This tutorial provides the procedure to connect and route device data from Azure IoT Hub to Azure IoT Connector for FHIR.

## Prerequisites

- An active Azure subscription - [Create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Azure API for FHIR resource with at least one Azure IoT Connector for FHIR - [Deploy Azure IoT Connector for FHIR (preview) using Azure portal](iot-fhir-portal-quickstart.md)
- Azure IoT Hub resource connected with real or simulated device(s) - [Create an IoT hub using the Azure portal](../../iot-hub/quickstart-send-telemetry-dotnet.md)

> [!TIP]
> If you are using an Azure IoT Hub simulated device application, feel free to pick the application of your choice amongst different supported languages and systems.

## Get connection string for Azure IoT Connector for FHIR (preview)

Azure IoT Hub requires a connection string to securely connect with your Azure IoT Connector for FHIR. Create a new connection string for your Azure IoT Connector for FHIR as described in [Generate a connection string](iot-fhir-portal-quickstart.md#generate-a-connection-string). Preserve this connection string to be used in the next step.

Azure IoT Connector for FHIR uses an Azure Event Hub instance under the hood to receive device messages. The connection string created above is basically the connection string to this underlying Event Hub.

## Connect Azure IoT Hub with the Azure IoT Connector for FHIR (preview)

Azure IoT Hub supports a feature called [message routing](../../iot-hub/iot-hub-devguide-messages-d2c.md) that provides capability to send device data to various Azure services like Event Hub, Storage Account, and Service Bus. Azure IoT Connector for FHIR leverages this feature to connect and send device data from Azure IoT Hub to its Event Hub endpoint.

> [!NOTE] 
> At this time you can only use PowerShell or CLI command to [create message routing](../../iot-hub/tutorial-routing.md) because Azure IoT Connector for FHIR's Event Hub is not hosted on the customer subscription, hence it won't be visible to you through the Azure portal. Though, once the message route objects are added using PowerShell or CLI, they are visible on the Azure portal and can be managed from there.

Setting up a message routing consists of two steps.

### Add an endpoint
This step defines an endpoint to which the IoT Hub would route the data. Create this endpoint using either [Add-AzIotHubRoutingEndpoint](/powershell/module/az.iothub/Add-AzIotHubRoutingEndpoint) PowerShell command or [az iot hub routing-endpoint create](/cli/azure/iot/hub/routing-endpoint#az_iot_hub_routing_endpoint_create) CLI command, based on your preference.

Here is the list of parameters to use with the command to create an endpoint:

|PowerShell Parameter|CLI Parameter|Description|
|---|---|---|
|ResourceGroupName|resource-group|Resource group name of your IoT Hub resource.|
|Name|hub-name|Name of your IoT Hub resource.|
|EndpointName|endpoint-name|Use a name that you would like to assign to the endpoint being created.|
|EndpointType|endpoint-type|Type of endpoint that IoT Hub needs to connect with. Use literal value of "EventHub" for PowerShell and "eventhub" for CLI.|
|EndpointResourceGroup|endpoint-resource-group|Resource group name for your Azure IoT Connector for FHIR's Azure API for FHIR resource. You can get this value from the Overview page of Azure API for FHIR.|
|EndpointSubscriptionId|endpoint-subscription-id|Subscription Id for your Azure IoT Connector for FHIR's Azure API for FHIR resource. You can get this value from the Overview page of Azure API for FHIR.|
|ConnectionString|connection-string|Connection string to your Azure IoT Connector for FHIR. Use the value you obtained in the previous step.|

### Add a message route
This step defines a message route using the endpoint created above. Create a route using either [Add-AzIotHubRoute](/powershell/module/az.iothub/Add-AzIoTHubRoute) PowerShell command or [az iot hub route create](/cli/azure/iot/hub/route#az_iot_hub_route_create) CLI command, based on your preference.

Here is the list of parameters to use with the command to add a message route:

|PowerShell Parameter|CLI Parameter|Description|
|---|---|---|
|ResourceGroupName|g|Resource group name of your IoT Hub resource.|
|Name|hub-name|Name of your IoT Hub resource.|
|EndpointName|endpoint-name|Name of the endpoint you have created above.|
|RouteName|route-name|A name you want to assign to message route being created.|
|Source|source-type|Type of data to send to the endpoint. Use literal value of "DeviceMessages" for PowerShell and "devicemessages" for CLI.|

## Send device message to IoT Hub

Use your device (real or simulated) to send the sample heart rate message shown below to Azure IoT Hub. This message will get routed to Azure IoT Connector for FHIR, where the message will be transformed into a FHIR Observation resource and stored into the Azure API for FHIR.

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
> Make sure to send the device message that conforms to the [mapping templates](iot-mapping-templates.md) configured with your Azure IoT Connector for FHIR.

## View device data in Azure API for FHIR

You can view the FHIR Observation resource(s) created by Azure IoT Connector for FHIR on Azure API for FHIR using Postman. Set up your [Postman to access Azure API for FHIR](access-fhir-postman-tutorial.md) and make a `GET` request to `https://your-fhir-server-url/Observation?code=http://loinc.org|8867-4` to view Observation FHIR resources with heart rate value submitted in the above sample message.

> [!TIP]
> Ensure that your user has appropriate access to Azure API for FHIR data plane. Use [Azure role-based access control (Azure RBAC)](configure-azure-rbac.md) to assign required data plane roles.


## Next steps

In this quickstart guide, you set up Azure IoT Hub to route device data to Azure IoT Connector for FHIR. Select from below next steps to learn more about Azure IoT Connector for FHIR:

Understand different stages of data flow within Azure IoT Connector for FHIR.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR data flow](iot-data-flow.md)

Learn how to configure IoT Connector using device and FHIR mapping templates.

>[!div class="nextstepaction"]
>[Azure IoT Connector for FHIR mapping templates](iot-mapping-templates.md)

*In the Azure portal, Azure IoT Connector for FHIR is referred to as IoT Connector (preview). FHIR is a registered trademark of HL7 and is used with the permission of HL7.