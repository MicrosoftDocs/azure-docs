## Create an IoT hub

Create an IoT hub for your simulated device to connect to. The following steps show you how to complete this task by using the Azure portal.

1. Sign in to the [Azure portal][lnk-portal].

2. In the Jumpbar, click **New** > **Internet of Things** > **Azure IoT Hub**.

    ![Azure portal Jumpbar][1]

3. In the **IoT hub** blade, choose the configuration for your IoT hub.

    ![IoT hub blade][2]

    * In the **Name** box, enter a name for your IoT hub. If the **Name** is valid and available, a green check mark appears in the **Name** box.
    * Select a [pricing and scale tier][lnk-pricing]. This tutorial does not require a specific tier. For this tutorial, use the free F1 tier.
    * In **Resource group**, create a new resource group, or select an existing one. For more information, see [Using resource groups to manage your Azure resources][lnk-resource-groups].
    * In **Location**, select the location to host your IoT hub. For this tutorial, choose your nearest location.

4. When you have chosen your IoT hub configuration options, click **Create**.  It can take a few minutes for Azure to create your IoT hub. To check the status, you can monitor the progress on the Startboard or in the Notifications panel.

    ![New IoT hub status][3]

5. When the IoT hub has been created successfully, click the new tile for your IoT hub in the portal to open the blade for the new IoT hub. Make a note of the **Hostname**, and then click **Shared access policies**.

    ![New IoT hub blade][4]

6. In the **Shared access policies** blade, click the **iothubowner** policy, and then copy and make note of the connection string in the **iothubowner** blade. For more information, see [Access control][lnk-access-control] in the "Azure IoT Hub developer guide."

    ![Shared access policies blade][5]


<!-- Images. -->
[1]: ./media/iot-hub-get-started-create-hub/create-iot-hub1.png
[2]: ./media/iot-hub-get-started-create-hub/create-iot-hub2.png
[3]: ./media/iot-hub-get-started-create-hub/create-iot-hub3.png
[4]: ./media/iot-hub-get-started-create-hub/create-iot-hub4.png
[5]: ./media/iot-hub-get-started-create-hub/create-iot-hub5.png

<!-- Links -->
[lnk-resource-groups]: ../articles/azure-portal/resource-group-portal.md
[lnk-portal]: https://portal.azure.com/
[lnk-pricing]: https://azure.microsoft.com/pricing/details/iot-hub/
[lnk-access-control]: ../articles/iot-hub/iot-hub-devguide.md#accesscontrol
