---
title: Interact with an IoT Plug and Play Preview device from an Azure IoT solution | Microsoft Docs
description: As a solution developer, learn about how to use the service SDK to interact with IoT Plug and Play devices.
author: Philmea
ms.author: philmea
ms.date: 12/26/2019
ms.topic: how-to
ms.custom: mvc
ms.service: iot-pnp
services: iot-pnp
manager: philmea

# As a solution developer, I want to use Node service SDK to get and set properties, send commands to an IoT Plug and Play device, and manage telemetry routing and queries.
---

# Connect to and interact with an IoT Plug and Play Preview device

This how-to guide shows you how to use the samples in the Node service SDK that show you how your IoT Solution can interact with IoT Plug and Play Preview devices.

If you haven't completed the [Connect an IoT Plug and Play device to your solution](quickstart-connect-pnp-device-solution-node.md) quickstart, you should do so now. The quickstart shows you how to download and install the SDK and run some of the samples.

Before you run the service samples, open a new terminal, go to the root folder of your cloned repository, navigate to the **digitaltwins/quickstarts/service** folder, and then  run the following command to install the dependencies:

```cmd/sh
npm install
```

## Run the service samples

Use the following samples to explore the capabilities of the Node.js service SDK. Make sure that the `IOTHUB_CONNECTION_STRING` environment variable is set in the shell you use:

### Retrieve a digital twin and list the interfaces

**get_digital_twin.js** gets the digital twin associated with your device and prints its component in the command line. It doesn't require a running device sample to succeed.

**get_digital_twin_interface_instance.js** gets a single interface instance of digital twin associated with your device and prints it in the command line. It doesn't require the device sample to run.

### Get and set properties using the Node service SDK

**update_digital_twin.js** updates a writable property on your device digital twin using a full patch. You can update multiple properties on multiple interfaces if you want to. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about updating a property the service sample printing an updated digital twin in the terminal.

### Send a command and retrieve the response using the Node service SDK

**invoke_command.js** invokes a synchronous command on your device digital twin. For it to succeed, the device sample needs to be running at the same time. Success looks like the device sample is printing something about acknowledging a command, and the service client printing the result of the command in the terminal.

### Connect to the public repository and retrieve a model definition using the Node service SDK

Using the same instructions as for the service and device samples, you need to set the following environment variable:

* `AZURE_IOT_MODEL_REPOSITORY_CONNECTION_STRING`

You can find this connection string in the [Azure Certified for IoT portal](https://preview.catalog.azureiotsolutions.com) on the **Connection strings** tab for your **Company repository**.

The connection string looks like the following example:

```text
HostName={repo host name};RepositoryId={repo ID};SharedAccessKeyName={repo key ID};SharedAccessKey={repo key secret}
```

After you've set these four environment variables, run the sample the same way you ran the other samples:

```cmd/sh
node model_repo.js
```

This sample downloads the **ModelDiscovery** interface and prints this model in the terminal.

### Run queries in IoT Hub based on capability models and interfaces

The IoT Hub query language supports `HAS_INTERFACE` and `HAS_CAPABILITYMODEL` as shown in the following examples:

```sql
select * from devices where HAS_INTERFACE('id without version', version)
```

```sql
select * from devices where HAS_CAPABILITYMODEL('id without version', version)
```

### Creating digital twin routes

Your solution can receive notifications of digital twin change events. To subscribe to these notifications, use the [IoT Hub routing feature](../iot-hub/iot-hub-devguide-endpoints.md) to send the notifications to an endpoint such as blob storage, Event Hubs, or a Service Bus queue.

To create a digital twin route:

1. In the Azure portal, go to your IoT Hub resource.
1. Select **Message routing**.
1. On the **Routes** tab select **Add**.
1. Enter a value in the **Name** field and choose an **Endpoint**. If you haven't configured an endpoint, select **Add endpoint**.
1. In the **Data source** drop-down, select **Digital Twin Change Events**.
1. Select **Save**.

The following JSON shows an example of a digital twin change event:

```json
{
  "interfaces": {
    "urn_azureiot_ModelDiscovery_DigitalTwin": {
      "name": "urn_azureiot_ModelDiscovery_DigitalTwin",
      "properties": {
        "modelInformation": {
          "reported": {
            "value": {
              "modelId": "urn:domain:capabilitymodel:TestCapability:1",
              "interfaces": {
                "MyInterfaceFoo": "urn:domain:interfaces:FooInterface:1",
                "urn_azureiot_ModelDiscovery_DigitalTwin": "urn:azureiot:ModelDiscovery:DigitalTwin:1"
              }
            }
          }
        }
      }
    },
    "MyInterfaceFoo": {
      "name": "MyInterfaceFoo",
      "properties": {
        "property_1": { "desired": { "value": "value_1" } },
        "property_2": {
          "desired": { "value": 20 },
          "reported": {
            "value": 10,
            "desiredState": {
              "code": 200,
              "version": 22,
              "subCode": 400,
              "description": ""
            }
          }
        },
        "property_3": { "reported": { "value": "value_3" } }
      }
    }
  },
  "version": 4
}
```

## Next steps

Now that you've learned about service solutions that interact with your IoT Plug and Play devices, a suggested next step is to learn about [Model discovery](concepts-model-discovery.md).
