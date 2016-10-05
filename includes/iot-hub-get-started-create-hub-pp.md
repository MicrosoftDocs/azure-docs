## Create a device management enabled IoT Hub

Since IoT Hub device management is in preview, you need to create a device management enabled IoT hub. When IoT Hub device management reaches General Availability, this tutorial will be updated. The following steps show you how to complete this task using the Azure portal.

1.  Sign in to the [Azure portal].
2.  In the Jumpbar, click **New**, then click **Internet of Things**, and then click **Azure IoT Hub**.

	![][img-new-hub]

3.  In the **IoT Hub** blade, choose the configuration for your IoT Hub.

	![][img-configure-hub]

  -   In the **Name** box, enter a name for your IoT Hub. If the **Name** is valid and available, a green check mark appears in the **Name** box.
  -   Select a **Pricing and scale tier**. This tutorial does not require a specific tier.
  -   In **Resource group**, create a new resource group, or select an existing one. For more information, see [Using resource groups to manage your Azure resources].
  -   Check the box to **Enable Device Management - PREVIEW**.
  -   In **Location**, select the location to host your IoT Hub. IoT Hub device management is only available in East US, North Europe, and East Asia during public preview.

    > [AZURE.NOTE]  If you don't check the box to **Enable Device Management**, the samples don't work.<br/>By checking **Enable Device Management**, you create a preview IoT Hub supported only in East US, North Europe, and East Asia and not intended for production scenarios. You cannot migrate devices into and out of device management enabled hubs.

4.  When you have chosen your IoT Hub configuration options, click **Create**. It can take a few minutes for Azure to create your IoT Hub. To check the status, you can monitor the progress on the **Startboard** or in the **Notifications** panel.

	![][img-monitor]

5.  When the IoT Hub has been created successfully, the blade for your hub will automatically open. Make a note of the **Hostname**, and then click **Shared access policies**.

	![][img-keys]

6.  Click the **iothubowner** policy, then copy and make note of the connection string in the **iothubowner** blade. Copy it to a location you can access later because you need it to complete this tutorial.

 	> [AZURE.NOTE] In production scenarios, make sure to refrain from using the **iothubowner** credentials.

	![][img-connection]

You have now created a device management enabled IoT Hub. You need the connection string to complete this tutorial.

## Create a device identity

In this section, you use a Node tool called [IoT Hub Explorer][iot-hub-explorer] to create a device identity for this tutorial.

1. Run the following in your command-line environment:

    npm install -g iothub-explorer@latest

2. Then, run the following command to login to your hub, remembering to substitute `{service connection string}` with the IoT Hub connection string you previously copied:

    iothub-explorer login "{service connection string}"

3. Finally, create a new device identity called `myDeviceId` with the command:

    iothub-explorer create myDeviceId --connection-string

Make a note of the device connection string from the result. This connection string is used by the device app to connect to your IoT Hub as a device.

![][img-identity]

Refer to [Getting started with IoT Hub][lnk-getstarted] for a way to create device identities programmatically.

<!-- images and links -->
[img-new-hub]: media/iot-hub-get-started-create-hub-pp/image1.png
[img-configure-hub]: media/iot-hub-get-started-create-hub-pp/image2.png
[img-monitor]: media/iot-hub-get-started-create-hub-pp/image3.png
[img-keys]: media/iot-hub-get-started-create-hub-pp/image4.png
[img-connection]: media/iot-hub-get-started-create-hub-pp/image5.png
[img-identity]: media/iot-hub-get-started-create-hub-pp/devidentity.png

[Azure portal]: https://portal.azure.com/
[iot-hub-explorer]: https://github.com/Azure/azure-iot-sdks/tree/master/tools/iothub-explorer

[lnk-getstarted]: ../articles/iot-hub/iot-hub-csharp-csharp-getstarted.md
[Using resource groups to manage your Azure resources]: ../azure-portal/resource-group-portal.md
