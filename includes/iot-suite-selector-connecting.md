> [AZURE.SELECTOR]
- [C on Windows](../articles/iot-suite/iot-suite-connecting-devices.md)
- [C on Linux](../articles/iot-suite/iot-suite-connecting-devices-linux.md)
- [C on mbed](../articles/iot-suite/iot-suite-connecting-devices-mbed.md)
- [Node.js](../articles/iot-suite/iot-suite-connecting-devices-node.md)

## Scenario overview

In this scenario, you create a device that sends the following telemetry to the remote monitoring [preconfigured solution][lnk-what-are-preconfig-solutions]:

- External temperature
- Internal temperature
- Humidity

For simplicity, the code on the device generates sample values, but we encourage you to extend the sample by connecting real sensors to your device and sending real telemetry.

To complete this tutorial, you need an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].

## Before you start

Before you write any code for your device, you must provision your remote monitoring preconfigured solution and then provision a new custom device in that solution.

### Provision your remote monitoring preconfigured solution

The device you create in this tutorial sends data to an instance of the [remote monitoring][lnk-remote-monitoring] preconfigured solution. If you haven't already provisioned the remote monitoring preconfigured solution in your Azure account, follow the steps below:

1. On the <https://www.azureiotsuite.com/> page, click **+** to create a new solution.

2. Click **Select** on the **Remote monitoring** panel to create your new solution.

3. On the **Create Remote monitoring solution** page, enter a **Solution name** of your choice, select the **Region** you want to deploy to, and select the Azure subscription to want to use. Then click **Create solution**.

4. Wait until the provisioning process completes.

> [AZURE.WARNING] The preconfigured solutions use billable Azure services. Be sure to remove the preconfigured solution from your subscription when you are done with it to avoid any unnecessary charges. You can completely remove a preconfigured solution from your subscription by visiting the <https://www.azureiotsuite.com/> page.

When the provisioning process for the remote monitoring solution finishes, click **Launch** to open the solution dashboard in your browser.

![][img-dashboard]

### Provision your device in the remote monitoring solution

> [AZURE.NOTE] If you have already provisioned a device in your solution, you can skip this step. You will need to know the device credentials when you create the client application.

For a device to connect to the preconfigured solution, it must identify itself to IoT Hub using valid credentials. You can retrieve the device credentials from the solution dashboard. You include the device credentials in your client application later in this tutorial. 

To add a new device to your remote monitoring solution, complete the following steps in the solution dashboard:

1.  In the lower left-hand corner of the dashboard, click **Add a device**.

    ![][1]

2.  In the **Custom Device** panel, click on **Add new**.

    ![][2]

3.  Choose **Let me define my own Device ID**, enter a Device ID such as **mydevice**, click **Check ID** to verify that name isn't already in use, and then click **Create** to provision the device.

    ![][3]

5. Make a note the device credentials (Device ID, IoT Hub Hostname, and Device Key), your client application needs them to connect to the remote monitoring solution. Then click **Done**.

    ![][4]

6. Make sure your device displays in the devices section. The device status is **Pending** until the device establishes a connection to the remote monitoring solution.

    ![][5]

[img-dashboard]: ./media/iot-suite-selector-connecting/dashboard.png
[1]: ./media/iot-suite-selector-connecting/suite0.png
[2]: ./media/iot-suite-selector-connecting/suite1.png
[3]: ./media/iot-suite-selector-connecting/suite2.png
[4]: ./media/iot-suite-selector-connecting/suite3.png
[5]: ./media/iot-suite-selector-connecting/suite5.png

[lnk-what-are-preconfig-solutions]: ../articles/iot-suite/iot-suite-what-are-preconfigured-solutions.md
[lnk-remote-monitoring]: ../articles/iot-suite/iot-suite-remote-monitoring-sample-walkthrough.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/