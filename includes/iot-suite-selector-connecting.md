> [!div class="op_single_selector"]
> * [C on Windows](../articles/iot-suite/iot-suite-connecting-devices.md)
> * [C on Linux](../articles/iot-suite/iot-suite-connecting-devices-linux.md)
> * [Node.js](../articles/iot-suite/iot-suite-connecting-devices-node.md)

In this tutorial, you implement a device that sends the following telemetry to the remote monitoring [preconfigured solution](../articles/iot-suite/iot-suite-what-are-preconfigured-solutions.md):

* Temperature
* Pressure
* Humidity

For simplicity, the code generates sample telemetry values. You could extend the sample by connecting real sensors to your device and sending real telemetry.

The sample device also:

* Sends metadata to the solution to describe its capabilities.
* Responds to actions triggered from the **Devices** page in the solution.
* Responds to configuration changes send from the **Devices** page in the solution.

To complete this tutorial, you need an active Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).

## Before you start

Before you write any code for your device, you must provision your remote monitoring preconfigured solution and provision a new custom device in that solution.

### Provision your remote monitoring preconfigured solution

The device you create in this tutorial sends data to an instance of the [remote monitoring](../articles/iot-suite/iot-suite-remote-monitoring-explore.md) preconfigured solution. If you haven't already provisioned the remote monitoring preconfigured solution in your Azure account, see [Deploy the remote monitoring preconfigured solution](../articles/iot-suite/iot-suite-remote-monitoring-deploy.md)

When the provisioning process for the remote monitoring solution finishes, click **Launch** to open the solution dashboard in your browser.

<!-- TODO Add screenshot of dashboard after deployment -->

### Provision your device in the remote monitoring solution

> [!NOTE]
> If you have already provisioned a device in your solution, you can skip this step. You need the device credentials when you create the client application.

For a device to connect to the preconfigured solution, it must identify itself to IoT Hub using valid credentials. You can retrieve the device credentials from the solution **Devices** page. You include the device credentials in your client application later in this tutorial.

To add a device to your remote monitoring solution, complete the following steps on the **Devices** page in the solution:

1. Choose **Add new devices**.

    <!-- TODO Add screenshot here -->

1. In the **Provision a new device** panel, choose **Manual**.

    <!-- TODO Add screenshot here -->

1. Enter a Device ID such as `mydevice` and then click **Create** to provision the device.

    <!-- TODO Add screenshot here -->

1. Make a note the device credentials (Device ID, IoT Hub Hostname, and Device Key). Your client application needs these values to connect to the remote monitoring solution.

    <!-- TODO Add screenshot here -->

You have now provisioned a device in the remote monitoring preconfigured solution. In the follwing sections, you implement the client application that uses the device credentials to connect to your solution.