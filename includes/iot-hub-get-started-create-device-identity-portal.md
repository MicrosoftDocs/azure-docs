## Create a device identity

In this section, you use the [Azure portal][lnk-azure-portal] to create a device identity in the identity registry in your IoT hub. A device cannot connect to IoT hub unless it has an entry in the identity registry. For more information, see the "Identity registry" section of the [IoT Hub developer guide][lnk-devguide-identity]. The **Device Explorer** in the portal helps you generate a unique device ID and key that your device can use to identify itself when it connects to IoT Hub. Device IDs are case sensitive.

1. Make sure you are signed in to the [Azure portal][lnk-azure-portal].

1. In the Jumpbar, click **All resources** and find your IoT hub resource.

    ![Navigate to your Iot hub][img-find-iothub]

1. When your IoT hub resource is opened, click the **Device Explorer** tool, and then click **Add** at the top. Provide the name for your new device, such as **myDeviceId**, and click **Save**.

    ![Create device identity in portal][img-create-device]

   This creates a new device identity for your IoT hub.

1. In the **Device Explorer**'s device list, click the newly created device and make note of the **Connection string---primary key**.

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

