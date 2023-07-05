---
title: "Tutorial: Use MQTT to create an IoT device client"
description: Tutorial - Use the MQTT protocol directly to create an IoT device client without using the Azure IoT Device SDKs
titleSuffix: Azure IoT
author: ryanwinter
ms.author: rywinter
ms.date: 03/15/2023
ms.topic: tutorial
ms.service: iot-develop
ms.custom: devx-track-azurecli
services: iot-develop
#Customer intent: As a device builder, I want to see how I can use the MQTT protocol to create an IoT device client without using the Azure IoT Device SDKs.
---

# Tutorial - Use MQTT to develop an IoT device client without using a device SDK

You should use one of the Azure IoT Device SDKs to build your IoT device clients if at all possible. However, in scenarios such as using a memory constrained device, you may need to use an MQTT library to communicate with your IoT hub.

The samples in this tutorial use the [Eclipse Mosquitto](http://mosquitto.org/) MQTT library.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Build the C language device client sample applications.
> * Run a sample that uses the MQTT library to send telemetry.
> * Run a sample that uses the MQTT library to process a cloud-to-device message sent from your IoT hub.
> * Run a sample that uses the MQTT library to manage the device twin on the device.

You can use either a Windows or Linux development machine to complete the steps in this tutorial.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

[!INCLUDE [azure-cli-prepare-your-environment-h3](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-h3.md)]

### Development machine prerequisites

If you're using Windows:

1. Install [Visual Studio (Community, Professional, or Enterprise)](https://visualstudio.microsoft.com/downloads). Be sure to enable the **Desktop development with C++** workload.

1. Install [CMake](https://cmake.org/download/). Enable the **Add CMake to the system PATH for all users** option.

1. Install the **x64 version** of [Mosquitto](https://mosquitto.org/download/).

If you're using Linux:

1. Run the following command to install the build tools:

    ```bash
    sudo apt install cmake g++
    ```

1. Run the following command to install the Mosquitto client library:

    ```bash
    sudo apt install libmosquitto-dev
    ```

## Set up your environment

If you don't already have an IoT hub, run the following commands to create a free-tier IoT hub in a resource group called `mqtt-sample-rg`. The command uses the name `my-hub` as an example for the name of the IoT hub to create. Choose a unique name for your IoT hub to use in place of `my-hub`:

```azurecli-interactive
az group create --name mqtt-sample-rg --location eastus
az iot hub create --name my-hub --resource-group mqtt-sample-rg --sku F1 
```

Make a note of the name of your IoT hub, you need it later.

Register a device in your IoT hub. The following command registers a device called `mqtt-dev-01` in an IoT hub called `my-hub`. Be sure to use the name of your IoT hub:

```azurecli-interactive
az iot hub device-identity create --hub-name my-hub --device-id mqtt-dev-01
```

Use the following command to create a SAS token that grants the device access to your IoT hub. Be sure to use the name of your IoT hub:

```dotnetcli
az iot hub generate-sas-token --device-id mqtt-dev-01 --hub-name my-hub --du 7200
```

Make a note of the SAS token the command outputs as you need it later. The SAS token looks like `SharedAccessSignature sr=my-hub.azure-devices.net%2Fdevices%2Fmqtt-dev-01&sig=%2FnM...sNwtnnY%3D&se=1677855761`

> [!TIP]
> By default, the SAS token is valid for 60 minutes. The `--du 7200` option in the previous command extends the token duration to two hours. If it expires before you're ready to use it, generate a new one. You can also create a token with a longer duration. To learn more, see [az iot hub generate-sas-token](/cli/azure/iot/hub#az-iot-hub-generate-sas-token).

## Clone the sample repository

Use the following command to clone the sample repository to a suitable location on your local machine:

```cmd
git clone https://github.com/Azure-Samples/IoTMQTTSample.git
```

The repository also includes:

* A Python sample that uses the `paho-mqtt` library.
* Instructions for using the `mosquitto_pub` CLI to interact with your IoT hub.

## Build the C samples

Before you build the sample, you need to add the IoT hub and device details. In the cloned IoTMQTTSample repository, open the _mosquitto/src/config.h_ file. Add your IoT hub name, device ID, and SAS token as follows. Be sure to use the name of your IoT hub:

```c
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

#define IOTHUBNAME "my-hub"
#define DEVICEID   "mqtt-dev-01"
#define SAS_TOKEN  "SharedAccessSignature sr=my-hub.azure-devices.net%2Fdevices%2Fmqtt-dev-01&sig=%2FnM...sNwtnnY%3D&se=1677855761"

#define CERTIFICATEFILE CERT_PATH "IoTHubRootCA.crt.pem"
```

> [!NOTE]
> The *IoTHubRootCA.crt.pem* file includes the CA root certificates for the TLS connection.

Save the changes to the  _mosquitto/src/config.h_ file.

To build the samples, run the following commands in your shell:

```bash
cd mosquitto
cmake -Bbuild
cmake --build build
```

In Linux, the binaries are in the _./build_ folder underneath the _mosquitto_ folder.

In Windows, the binaries are in the _.\build\Debug_ folder underneath the _mosquitto_ folder.

## Send telemetry

The *mosquitto_telemetry* sample shows how to send a device-to-cloud telemetry message to your IoT hub by using the MQTT library.

Before you run the sample application, run the following command to start the event monitor for your IoT hub. Be sure to use the name of your IoT hub:

```azurecli-interactive
az iot hub monitor-events --hub-name my-hub
```

Run the _mosquitto_telemetry_ sample. For example, on Linux:

```bash
./build/mosquitto_telemetry
```

The `az iot hub monitor-events` generates the following output that shows the payload sent by the device:

```text
Starting event monitor, use ctrl-c to stop...
{
    "event": {
        "origin": "mqtt-dev-01",
        "module": "",
        "interface": "",
        "component": "",
        "payload": "Bonjour MQTT from Mosquitto"
    }
}
```

You can now stop the event monitor.

### Review the code

The following snippets are taken from the _mosquitto/src/mosquitto_telemetry.cpp_ file.

The following statements define the connection information and the name of the MQTT topic you use to send the telemetry message:

```c
#define HOST IOTHUBNAME ".azure-devices.net"
#define PORT 8883
#define USERNAME HOST "/" DEVICEID "/?api-version=2020-09-30"

#define TOPIC "devices/" DEVICEID "/messages/events/"
```

The `main` function sets the user name and password to authenticate with your IoT hub. The password is the SAS token you created for your device:

```c
mosquitto_username_pw_set(mosq, USERNAME, SAS_TOKEN);
```

The sample uses the MQTT topic to send a telemetry message to your IoT hub:

```c
int msgId  = 42;
char msg[] = "Bonjour MQTT from Mosquitto";

// once connected, we can publish a Telemetry message
printf("Publishing....\r\n");
rc = mosquitto_publish(mosq, &msgId, TOPIC, sizeof(msg) - 1, msg, 1, true);
if (rc != MOSQ_ERR_SUCCESS)
{
    return mosquitto_error(rc);
}
printf("Publish returned OK\r\n");
```

To learn more, see [Sending device-to-cloud messages](../iot/iot-mqtt-connect-to-iot-hub.md#sending-device-to-cloud-messages).

## Receive a cloud-to-device message

The *mosquitto_subscribe* sample shows how to subscribe to MQTT topics and receive a cloud-to-device message from your IoT hub by using the MQTT library.

Run the _mosquitto_subscribe_ sample. For example, on Linux:

```bash
./build/mosquitto_subscribe
```

Run the following command to send a cloud-to-device message from your IoT hub. Be sure to use the name of your IoT hub:

```azurecli-interactive
az iot device c2d-message send --hub-name my-hub --device-id mqtt-dev-01 --data "hello world"
```

The output from _mosquitto_subscribe_ looks like the following example:

```text
Waiting for C2D messages...
C2D message 'hello world' for topic 'devices/mqtt-dev-01/messages/devicebound/%24.mid=d411e727-...f98f&%24.to=%2Fdevices%2Fmqtt-dev-01%2Fmessages%2Fdevicebound&%24.ce=utf-8&iothub-ack=none'
Got message for devices/mqtt-dev-01/messages/# topic
```

### Review the code

The following snippets are taken from the _mosquitto/src/mosquitto_subscribe.cpp_ file.

The following statement defines the topic filter the device uses to receive cloud to device messages. The `#` is a multi-level wildcard:

```c
#define DEVICEMESSAGE "devices/" DEVICEID "/messages/#"
```

The `main` function uses the `mosquitto_message_callback_set` function to set a callback to handle messages sent from your IoT hub and uses the `mosquitto_subscribe` function to subscribe to all messages. The following snippet shows the callback function:

```c
void message_callback(struct mosquitto* mosq, void* obj, const struct mosquitto_message* message)
{
    printf("C2D message '%.*s' for topic '%s'\r\n", message->payloadlen, (char*)message->payload, message->topic);

    bool match = 0;
    mosquitto_topic_matches_sub(DEVICEMESSAGE, message->topic, &match);

    if (match)
    {
        printf("Got message for " DEVICEMESSAGE " topic\r\n");
    }
}
```

To learn more, see [Use MQTT to receive cloud-to-device messages](../iot/iot-mqtt-connect-to-iot-hub.md#receiving-cloud-to-device-messages).

## Update a device twin

The *mosquitto_device_twin* sample shows how to set a reported property in a device twin and then read the property back.

Run the _mosquitto_device_twin_ sample. For example, on Linux:

```bash
./build/mosquitto_device_twin
```

The output from _mosquitto_device_twin_ looks like the following example:

```text
Setting device twin reported properties....
Device twin message '' for topic '$iothub/twin/res/204/?$rid=0&$version=2'
Setting device twin properties SUCCEEDED.

Getting device twin properties....
Device twin message '{"desired":{"$version":1},"reported":{"temperature":32,"$version":2}}' for topic '$iothub/twin/res/200/?$rid=1'
Getting device twin properties SUCCEEDED.
```

### Review the code

The following snippets are taken from the _mosquitto/src/mosquitto_device_twin.cpp_ file.

The following statements define the topics the device uses to subscribe to device twin updates, read the device twin, and update the device twin:

```c
#define DEVICETWIN_SUBSCRIPTION  "$iothub/twin/res/#"
#define DEVICETWIN_MESSAGE_GET   "$iothub/twin/GET/?$rid=%d"
#define DEVICETWIN_MESSAGE_PATCH "$iothub/twin/PATCH/properties/reported/?$rid=%d"
```

The `main` function uses the `mosquitto_connect_callback_set` function to set a callback to handle messages sent from your IoT hub and uses the `mosquitto_subscribe` function to subscribe to the `$iothub/twin/res/#` topic.

The following snippet shows the `connect_callback` function that uses `mosquitto_publish` to set a reported property in the device twin. The device publishes the message to the `$iothub/twin/PATCH/properties/reported/?$rid=%d` topic. The `%d` value is incremented each time the device publishes a message to the topic:

```c
void connect_callback(struct mosquitto* mosq, void* obj, int result)
{
    // ... other code ...  

    printf("\r\nSetting device twin reported properties....\r\n");

    char msg[] = "{\"temperature\": 32}";
    char mqtt_publish_topic[64];
    snprintf(mqtt_publish_topic, sizeof(mqtt_publish_topic), DEVICETWIN_MESSAGE_PATCH, device_twin_request_id++);

    int rc = mosquitto_publish(mosq, NULL, mqtt_publish_topic, sizeof(msg) - 1, msg, 1, true);
    if (rc != MOSQ_ERR_SUCCESS)

    // ... other code ...  
}
```

The device subscribes to the `$iothub/twin/res/#` topic and when it receives a message from your IoT hub, the `message_callback` function handles it. When you run the sample, the `message_callback` function gets called twice. The first time, the device receives a response from the IoT hub to the reported property update. The device then requests the device twin. The second time, the device receives the requested device twin. The following snippet shows the `message_callback` function:

```c
void message_callback(struct mosquitto* mosq, void* obj, const struct mosquitto_message* message)
{
    printf("Device twin message '%.*s' for topic '%s'\r\n", message->payloadlen, (char*)message->payload, message->topic);

    const char patchTwinTopic[] = "$iothub/twin/res/204/?$rid=0";
    const char getTwinTopic[]   = "$iothub/twin/res/200/?$rid=1";

    if (strncmp(message->topic, patchTwinTopic, sizeof(patchTwinTopic) - 1) == 0)
    {
        // Process the reported property response and request the device twin
        printf("Setting device twin properties SUCCEEDED.\r\n\r\n");

        printf("Getting device twin properties....\r\n");

        char msg[] = "{}";
        char mqtt_publish_topic[64];
        snprintf(mqtt_publish_topic, sizeof(mqtt_publish_topic), DEVICETWIN_MESSAGE_GET, device_twin_request_id++);

        int rc = mosquitto_publish(mosq, NULL, mqtt_publish_topic, sizeof(msg) - 1, msg, 1, true);
        if (rc != MOSQ_ERR_SUCCESS)
        {
            printf("Error: %s\r\n", mosquitto_strerror(rc));
        }
    }
    else if (strncmp(message->topic, getTwinTopic, sizeof(getTwinTopic) - 1) == 0)
    {
        // Process the device twin response and stop the client
        printf("Getting device twin properties SUCCEEDED.\r\n\r\n");

        mosquitto_loop_stop(mosq, false);
        mosquitto_disconnect(mosq); // finished, exit program
    }
}
```

To learn more, see [Use MQTT to update a device twin reported property](../iot/iot-mqtt-connect-to-iot-hub.md#update-device-twins-reported-properties) and [Use MQTT to retrieve a device twin property](../iot/iot-mqtt-connect-to-iot-hub.md#retrieving-a-device-twins-properties).

## Clean up resources

[!INCLUDE [iot-pnp-clean-resources](../../includes/iot-pnp-clean-resources.md)]

## Next steps

Now that you've learned how to use the Mosquitto MQTT library to communicate with IoT Hub, a suggested next step is to review:

> [!div class="nextstepaction"]
> [Communicate with your IoT hub using the MQTT protocol](../iot/iot-mqtt-connect-to-iot-hub.md)
> [!div class="nextstepaction"]
> [MQTT Application samples](https://github.com/Azure-Samples/MqttApplicationSamples)