---
 title: include file
 description: include file
 services: iot-hub
 author: dominicbetts
 ms.service: iot-hub
 ms.topic: include
 ms.date: 04/05/2018
 ms.author: dobett
 ms.custom: include file
---

## Create a device identity

In this section, you use the [Azure portal][lnk-azure-portal] to create a device identity in the identity registry in your IoT hub. A device cannot connect to IoT hub unless it has an entry in the identity registry. For more information, see the "Identity registry" section of the [IoT Hub developer guide][lnk-devguide-identity]. Use the **IoT Devices** panel in the portal to generate a unique device ID and key for your device to use to identify itself to IoT Hub. Device IDs are case-sensitive.

1. Make sure you are signed in to the [Azure portal][lnk-azure-portal].

1. In the Jumpbar, click **All resources** and find your IoT hub resource.

    ![Navigate to your Iot hub][img-find-iothub]

1. When your IoT hub resource is opened, click the **IoT Devices** tool, and then click **Add** at the top. Provide the name for your new device, such as **myDeviceId**, and click **Save**.

    ![Create device identity in portal][img-create-device]

   This action creates a new device identity for your IoT hub.

   [!INCLUDE [iot-hub-pii-note-naming-device](iot-hub-pii-note-naming-device.md)]

1. In the **IoT Devices**'s device list, click the newly created device and make note of the **Connection string---primary key**.

    ![Device connection string][img-connection-string]

> [!NOTE]
> The IoT Hub identity registry only stores device identities to enable secure access to the IoT hub. It stores device IDs and keys to use as security credentials, and an enabled/disabled flag that you can use to disable access for an individual device. If your application needs to store other device-specific metadata, it should use an application-specific store. For more information, see [IoT Hub developer guide][lnk-devguide-identity].

<!-- Images. -->
[img-find-iothub]: ./media/iot-hub-get-started-create-device-identity-portal/find-iothub.png
[img-create-device]: ./media/iot-hub-get-started-create-device-identity-portal/create-identity-portal.png
[img-connection-string]: ./media/iot-hub-get-started-create-device-identity-portal/device-connection-string.png


<!-- Links -->
[lnk-azure-portal]: https://portal.azure.com
[lnk-devguide-identity]: ../articles/iot-hub/iot-hub-devguide-identity-registry.md

