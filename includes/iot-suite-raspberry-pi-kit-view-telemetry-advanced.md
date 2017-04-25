## View the telemetry

The Raspberry Pi is now sending telemetry to the remote monitoring solution. You can view the telemetry on the solution dashboard. You can also send messages to your Raspberry Pi from the solution dashboard.

- Navigate to the solution dashboard.
- Select your device in the **Device to View** dropdown.
- The telemetry from the Raspberry Pi displays on the dashboard.

![Display telemetry from the Raspberry Pi][img-telemetry-display]

## Update the firmware

You initiate the firmware update process invoking a method on the device. This method is asynchronous, and returns as soon as the update process begins. The device uses reported properties to notify the solution about the process of the update.

From the solution dashboard, you can invoke methods on your Raspberry Pi. When the Raspberry Pi connects to the remote monitoring solution, it sends information about the methods it supports. For more information about the firmware update process, see the description of the firmware update pattern in [Overview of device management with IoT Hub][lnk-update-pattern].

1. In the solution dashboard, click **Devices** to visit the **Devices** page. Select your Raspberry Pi in the **Device List**. Then choose **Methods**:

    ![List devices in dashboard][img-list-devices]

1. On the **Invoke Method** page, choose **InitiateFirmwareUpdate** in the **Method** dropdown.

1. In the **FWPackageURI** field, enter **https://raw.githubusercontent.com/IoTChinaTeam/azure-remote-monitoring-raspberry-pi-node/master/advanced/2.0/raspberry.js**. This file contains the implementation of version 2.0 of the firmware.

1. Choose **InvokeMethod**. The app on the Raspberry Pi sends an acknowledgment back to the solution dashboard. It then starts the firmware update process by downloading the new version of the firmware:

    ![Show method history][img-method-history]

- You can view the progress in of the update process on the Raspberry Pi:

    ![Show update progress][img-update-progress]

- You can view the status of the firmware update, as reported by the device, in the solution portal. The following screenshot shows the status and duration of each stage of the update process, and the new firmware version:

    ![Show job status][img-job-status]

> [!WARNING]
> If you leave the remote monitoring solution running in your Azure account, you are billed for the time it runs. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config]. Delete the preconfigured solution from your Azure account when you have finished using it.


[img-telemetry-display]: media/iot-suite-raspberry-pi-kit-view-telemetry-advanced/telemetry.png
[img-list-devices]: media/iot-suite-raspberry-pi-kit-view-telemetry-advanced/listdevices.png
[img-method-history]: media/iot-suite-raspberry-pi-kit-view-telemetry-advanced/methodhistory.png
[img-update-progress]: media/iot-suite-raspberry-pi-kit-view-telemetry-advanced/updateprogress.png
[img-job-status]: media/iot-suite-raspberry-pi-kit-view-telemetry-advanced/jobstatus.png

[lnk-demo-config]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/configure-preconfigured-demo.md
[lnk-update-pattern]: ../articles/iot-hub/iot-hub-device-management-overview.md