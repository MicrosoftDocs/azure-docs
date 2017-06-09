## View the solution dashboard

The solution dashboard enables you to manage the deployed solution. For example, you can view telemetry, add devices, and invoke methods.

1. When the provisioning is complete and the tile for your preconfigured solution indicates **Ready**, choose **Launch** to open your remote monitoring solution portal in a new tab.

    ![Launch the preconfigured solution][img-launch-solution]

1. By default, the solution portal shows the *dashboard*. You can navigate to other areas of the solution portal using the menu on the left-hand side of the page.

    ![Remote monitoring preconfigured solution dashboard][img-menu]

## Add a device

For a device to connect to the preconfigured solution, it must identify itself to IoT Hub using valid credentials. You can retrieve the device credentials from the solution dashboard. You include the device credentials in your client application later in this tutorial.

If you haven't already done so, add a custom device to your remote monitoring solution. Complete the following steps in the solution dashboard:

1. In the lower left-hand corner of the dashboard, click **Add a device**.

   ![Add a device][1]

1. In the **Custom Device** panel, click **Add new**.

   ![Add a custom device][2]

1. Choose **Let me define my own Device ID**. Enter a Device ID such as **rasppi**, click **Check ID** to verify you haven't already used the name in your solution, and then click **Create** to provision the device.

   ![Add device ID][3]

1. Make a note the device credentials (**Device ID**, **IoT Hub Hostname**, and **Device Key**). Your client application on the Raspberry Pi needs these values to connect to the remote monitoring solution. Then click **Done**.

    ![View device credentials][4]

1. Select your device in the device list in the solution dashboard. Then, in the **Device Details** panel, click **Enable Device**. The status of your device is now **Running**. The remote monitoring solution can now receive telemetry from your device and invoke methods on the device.

[img-launch-solution]: media/iot-suite-raspberry-pi-kit-view-solution/launch.png
[img-menu]: media/iot-suite-raspberry-pi-kit-view-solution/menu.png
[1]: media/iot-suite-raspberry-pi-kit-view-solution/suite0.png
[2]: media/iot-suite-raspberry-pi-kit-view-solution/suite1.png
[3]: media/iot-suite-raspberry-pi-kit-view-solution/suite2.png
[4]: media/iot-suite-raspberry-pi-kit-view-solution/suite3.png