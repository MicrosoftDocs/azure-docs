## View device telemetry

You can view the telemetry sent from your device on the **Devices** page in the solution.

1. Select the device you provisioned in the list of devices on the **Devices** page. A panel displays information about your device including a plot of the device telemetry:

    <!-- Insert screenshot here -->

1. Choose **Humidity** to change the telemetry display:

    <!-- Insert screenshot here -->

1. To view diagnostic information about your device, choose **Display diagnostics**:

    <!-- Insert screenshot here -->

## Act on your device

To invoke methods on your devices, use the **Devices** page in the remote monitoring solution. For example, in the remote monitoring solution **Chiller** devices implement a **Reboot** method.

1. Choose **Devices** to navigate to the **Devices** page in the solution.

1. Select the device you provisioned in the list of devices on the **Devices** page:

    <!-- Insert screenshot here -->

1. To display a list of the methods you can call on your device, choose **Schedule**. To schedule a method to run on multiple devices, you can select multiple devices in the list. The **Schedule** panel shows the types of method common to all the devices you selected.

1. Choose **Reboot** and set the job name to **Reboot physical chiller**:

    <!-- Insert screenshot here -->

1. A message displays in the console running your device code when the device handles the method:

    <!-- Insert screenshot here -->

> [!NOTE]
> To track the status of the job in the solution, choose **View**.

## Create a physical device type

To define a new physical device type, you upload a model definition to the **Devices** page in the solution. The device model definition is a JSON file similar to the device model files that you use with the device simulation service. You are given the opportunity to upload a device type definition whne you provision a new physical device on the **Devices** page:

<!-- TODO Add screenshot here -->

## Next steps

The article [Customize the remote monitoring preconfigured solution](../articles/iot-suite/iot-suite-remote-monitoring-customize.md) describes some ways to customize the preconfigured solution.