## Create an IoT hub

[!INCLUDE [iot-hub-create-hub](iot-hub-create-hub.md)]

Now that you have created an IoT hub, locate the important information that you use to connect devices and applications to your IoT hub. 

1. After your IoT hub is created, click it on the dashboard. Make a note of the **Hostname**, and then click **Shared access policies**.

   ![Get the hostname of your IoT hub](../articles/iot-hub/media/iot-hub-create-hub-and-device/4_get-azure-iot-hub-hostname-portal.png)

1. In the **Shared access policies** pane, click the **iothubowner** policy, and then copy and make a note of the **Connection string** of your IoT hub. For more information, see [Control access to IoT Hub](../articles/iot-hub/iot-hub-devguide-security.md).

> [!NOTE] 
You will not need this iothubowner connection string for this set-up tutorial. However, you may need it for some of the tutorials on different IoT scenarios after you complete this set-up.

   ![Get your IoT hub connection string](../articles/iot-hub/media/iot-hub-create-hub-and-device/5_get-azure-iot-hub-connection-string-portal.png)

## Register a device in the IoT hub for your device

1. In the [Azure portal](https://portal.azure.com/), open your IoT hub.

2. Click **Device Explorer**.
3. In the Device Explorer pane, click **Add** to add a device to your IoT hub. Then do the following:

   **Device ID**: Enter the ID of the new device. Device IDs are case sensitive.

   **Authentication Type**: Select **Symmetric Key**.

   **Auto Generate Keys**: Select this check box.

   **Connect device to IoT Hub**: Click **Enable**.

   ![Add a device in the Device Explorer of your IoT hub](../articles/iot-hub/media/iot-hub-create-hub-and-device/6_add-device-in-azure-iot-hub-device-explorer-portal.png)

   [!INCLUDE [iot-hub-pii-note-naming-device](iot-hub-pii-note-naming-device.md)]

4. Click **Save**.
5. After the device is created, open the device in the **Device Explorer** pane.
6. Make a note of the primary key of the connection string.

   ![Get the device connection string](../articles/iot-hub/media/iot-hub-create-hub-and-device/7_get-device-connection-string-in-device-explorer-portal.png)
