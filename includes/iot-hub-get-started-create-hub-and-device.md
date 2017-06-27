## Create an IoT hub

1. In the [Azure portal](https://portal.azure.com/), click **New** > **Internet of Things** > **IoT Hub**.

   ![Create an IoT hub in the Azure portal](../articles/iot-hub/media/iot-hub-create-hub-and-device/1_create-azure-iot-hub-portal.png)
2. In the **IoT hub** pane, enter the following information for your IoT hub:

     **Name**: Enter the name of your IoT hub. If the name you enter is valid, a green check mark appears.

     **Pricing and scale tier**: Select the **F1 - Free** tier. This option is sufficient for this demo. For more information, see the [Pricing and scale tier](https://azure.microsoft.com/pricing/details/iot-hub/).

     **Resource group**: Create a resource group to host the IoT hub or use an existing one. For more information, see [Use resource groups to manage your Azure resources](../articles/azure-resource-manager/resource-group-portal.md).

     **Location**: Select the closest location to you where the IoT hub is created.

     **Pin to dashboard**: Select this option for easy access to your IoT hub from the dashboard.

    ![Enter information to create your IoT hub](../articles/iot-hub/media/iot-hub-create-hub-and-device/2_fill-in-fields-for-azure-iot-hub-portal.png)

3. Click **Create**. Your IoT hub might take a few minutes to create. You can see progress in the **Notifications** pane.

   ![See progress notifications for your IoT hub](../articles/iot-hub/media/iot-hub-create-hub-and-device/3_notification-azure-iot-hub-creation-progress-portal.png)

4. After your IoT hub is created, click it on the dashboard. Make a note of the **Hostname**, and then click **Shared access policies**.

   ![Get the hostname of your IoT hub](../articles/iot-hub/media/iot-hub-create-hub-and-device/4_get-azure-iot-hub-hostname-portal.png)

5. In the **Shared access policies** pane, click the **iothubowner** policy, and then copy and make a note of the **Connection string** of your IoT hub. For more information, see [Control access to IoT Hub](../articles/iot-hub/iot-hub-devguide-security.md).

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

4. Click **Save**.
5. After the device is created, open the device in the **Device Explorer** pane.
6. Make a note of the primary key of the connection string.

   ![Get the device connection string](../articles/iot-hub/media/iot-hub-create-hub-and-device/7_get-device-connection-string-in-device-explorer-portal.png)