---
title: Create transparent gateway device - Azure IoT Edge | Microsoft Docs
description: Use an Azure IoT Edge device as a transparent gateway that can process information from downstream devices
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 11/30/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Configure an IoT Edge device to act as a transparent gateway

This article provides detailed instructions for configuring an IoT Edge device to function as a transparent gateway for other devices to communicate with IoT Hub. This article uses the term *IoT Edge gateway* to refer to an IoT Edge device configured as a transparent gateway. For more information, see [How an IoT Edge device can be used as a gateway](./iot-edge-as-gateway.md).

>[!NOTE]
>Currently:
>
> * Edge-enabled devices can't connect to IoT Edge gateways.
> * Downstream devices can't use file upload.

There are three general steps to set up a successful transparent gateway connection. This article covers the first step:

1. **The gateway device needs to be able to securely connect to downstream devices, receive communications from downstream devices, and route messages to the proper destination.**
2. The downstream device needs to have a device identity to be able to authenticate with IoT Hub, and know to communicate through its gateway device. For more information, see [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).
3. The downstream device needs to connect to its gateway device securely. For more information, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

For a device to function as a gateway, it needs to be able to securely connect to its downstream devices. Azure IoT Edge allows you to use a public key infrastructure (PKI) to set up secure connections between devices. In this case, we’re allowing a downstream device to connect to an IoT Edge device acting as a transparent gateway. To maintain reasonable security, the downstream device should confirm the identity of the gateway device. This identity check prevents your devices from connecting to potentially malicious gateways.

A downstream device in a transparent gateway scenario can be any application or platform that has an identity created with the [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub) cloud service. In many cases, these applications use the [Azure IoT device SDK](../iot-hub/iot-hub-devguide-sdks.md). For all practical purposes, a downstream device could even be an application running on the IoT Edge gateway device itself. However, an IoT Edge device cannot be downstream of an IoT Edge gateway.

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we assume the same certificate setup that you would use to enable [X.509 CA security](../iot-hub/iot-hub-x509ca-overview.md) in IoT Hub, which involves an X.509 CA certificate associated to a specific IoT hub (the IoT hub root CA), a series of certificates signed with this CA, and a CA for the IoT Edge device.

![Gateway certificate setup](./media/how-to-create-transparent-gateway/gateway-setup.png)

>[!NOTE]
>The term "root CA" used throughout this article refers to the topmost authority public certificate of the PKI certificate chain, and not necessarily the certificate root of a syndicated certificate authority. In many cases, it is actually an intermediate CA public certificate.

The gateway presents its IoT Edge device CA certificate to the downstream device during the initiation of the connection. The downstream device checks to make sure the IoT Edge device CA certificate is signed by the root CA certificate. This process allows the downstream device to confirm that the gateway comes from a trusted source.

The following steps walk you through the process of creating the certificates and installing them in the right places on the gateway. You can use any machine to generate the certificates, and then copy them over to your IoT Edge device.

## Prerequisites

An Azure IoT Edge device, configured with [production certificates](how-to-install-production-certificates.md).

## Deploy edgeHub to the gateway

When you first install IoT Edge on a device, only one system module starts automatically: the IoT Edge agent. Once you create the first deployment more a device, the second system module, the IoT Edge hub, is started as well.

The IoT Edge hub is responsible for receiving incoming messages from downstream devices and routing them to the next destination. If the **edgeHub** module isn't running on your device, create an initial deployment for your device. The deployment will look empty because you don't add any modules, but it will make sure that both system modules are running.

You can check which modules are running on a device by checking its device details in the Azure portal, viewing the device status in Visual Studio or Visual Studio Code, or by running the command `iotedge list` on the device itself.

If the **edgeAgent** module is running without the **edgeHub** module, use the following steps:

1. In the Azure portal, navigate to your IoT hub.

2. Go to **IoT Edge** and select your IoT Edge device that you want to use as a gateway.

3. Select **Set Modules**.

4. Select **Next**.

5. In the **Specify routes** page, you should have a default route that sends all messages from all modules to IoT Hub. If not, add the following code then select **Next**.

   ```JSON
   {
       "routes": {
           "route": "FROM /messages/* INTO $upstream"
       }
   }
   ```

6. In the **Review template** page, select **Submit**.

## Open ports on gateway device

Standard IoT Edge devices don't need any inbound connectivity to function, because all communication with IoT Hub is done through outbound connections. Gateway devices are different because they need to receive messages from their downstream devices. If a firewall is between the downstream devices and the gateway device, then communication needs to be possible through the firewall as well.

For a gateway scenario to work, at least one of the IoT Edge hub's supported protocols must be open for inbound traffic from downstream devices. The supported protocols are MQTT, AMQP, HTTPS, MQTT over WebSockets, and AMQP over WebSockets.

| Port | Protocol |
| ---- | -------- |
| 8883 | MQTT |
| 5671 | AMQP |
| 443 | HTTPS <br> MQTT+WS <br> AMQP+WS |

## Route messages from downstream devices

The IoT Edge runtime can route messages sent from downstream devices just like messages sent by modules. This feature allows you to perform analytics in a module running on the gateway before sending any data to the cloud.

Currently, the way that you route messages sent by downstream devices is by differentiating them from messages sent by modules. Messages sent by modules all contain a system property called **connectionModuleId** but messages sent by downstream devices do not. You can use the WHERE clause of the route to exclude any messages that contain that system property.

The below route is an example that would send messages from any downstream device to a module named `ai_insights`, and then from `ai_insights` to IoT Hub.

```json
{
    "routes":{
        "sensorToAIInsightsInput1":"FROM /messages/* WHERE NOT IS_DEFINED($connectionModuleId) INTO BrokeredEndpoint(\"/modules/ai_insights/inputs/input1\")",
        "AIInsightsToIoTHub":"FROM /messages/modules/ai_insights/outputs/output1 INTO $upstream"
    }
}
```

For more information about message routing, see [Deploy modules and establish routes](./module-composition.md#declare-routes).

## Enable extended offline operation

Starting with the [v1.0.4 release](https://github.com/Azure/azure-iotedge/releases/tag/1.0.4) of the IoT Edge runtime, the gateway device and downstream devices connecting to it can be configured for extended offline operation.

With this capability, local modules or downstream devices can re-authenticate with the IoT Edge device as needed and communicate with each other using messages and methods even when disconnected from the IoT hub. For more information, see [Understand extended offline capabilities for IoT Edge devices, modules, and child devices](offline-capabilities.md).

To enable extended offline capabilities, you establish a parent-child relationship between an IoT Edge gateway device and downstream devices that will connect to it. Those steps are explained in more detail in [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).

## Next steps

Now that you have an IoT Edge device working as a transparent gateway, you need to configure your downstream devices to trust the gateway and send messages to it. Continue on to [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md) for the next steps in setting up your transparent gateway scenario.
