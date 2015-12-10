> [AZURE.SELECTOR]
- [C on Windows](../articles/iot-suite/iot-suite-connecting-devices.md)
- [C on Linux](../articles/iot-suite/iot-suite-connecting-devices-linux.md)
- [C on mbed](../articles/iot-suite/iot-suite-connecting-devices-mbed.md)
- [Node.js](../articles/iot-suite/iot-suite-connecting-devices-node.md)

## Scenario overview

In this scenario, you will create a device that sends the following telemetry to the remote monitoring [preconfigured solution][lnk-what-are-preconfig-solutions]:

- External temperature
- Internal temperature
- Humidity

For simplicity, the code on the device generates sample values, but we encourage you to extend the sample by connecting real sensors to your device and sending real telemetry.

## Before you start

Before you write any code for your device, you should provision your remote monitoring preconfigured solution and then provision a device in that solution.

### Provision your remote monitoring preconfigured solution

The device you create will send data to an instance of the [remote monitoring][lnk-remote-monitoring] preconfigured solution. Visit [Get started with Azure IoT Suite][lnk-getstarted] to create an Azure account and provision IoT Suite. Select **Remote monitoring** when you create your new solution.

When the remote monitoring solution has been provisioned, click **Launch** to open the solution dashboard.

![][img-dashboard]

### Provision your device in the remote monitoring solution

> [AZURE.NOTE] If you have already provisioned a device in your solution, you can skip this step. You will need to know the device credentials when you create the client application.

For a device to connect to the preconfigured solution, it must be able to identify itself using valid credentials. You can get the device credentials from the solution dashboard and then include them in your client application. 

To add a new device to your remote monitoring solution, complete the following steps in the solution dashboard:

1.  In the lower left-hand corner of the dashboard, click **Add a device**.

    ![][1]

2.  In the **Custom Device** panel, click on **Add new**.

    ![][2]

3.  Choose **Let me define my own Device ID**, enter a Device ID such as **mydevice**, click **Check ID** to verify that name isn't in use, and then click **Create** to provision the device.

    ![][3]

5. Make a note the device credentials (Device ID, IoT Hub Hostname, and Device Key), your client application will need them to connect your device to the remote monitoring solution. Then click **Done**.

    ![][4]

6. Make sure your device displays correctly in the devices section. The status is **Pending** until the device establishes a connection to the remote monitoring solution.

    ![][5]

[img-dashboard]: ./media/iot-suite-selector-connecting/dashboard.png
[1]: ./media/iot-suite-selector-connecting/suite0.png
[2]: ./media/iot-suite-selector-connecting/suite1.png
[3]: ./media/iot-suite-selector-connecting/suite2.png
[4]: ./media/iot-suite-selector-connecting/suite3.png
[5]: ./media/iot-suite-selector-connecting/suite5.png

[lnk-getstarted]: http://www.microsoft.com/server-cloud/internet-of-things/getting-started.aspx
[lnk-what-are-preconfig-solutions]: ../articles/iot-suite/iot-suite-what-are-preconfigured-solutions.md
[lnk-remote-monitoring]: ../articles/iot-suite/iot-suite-remote-monitoring-sample-walkthrough.md
