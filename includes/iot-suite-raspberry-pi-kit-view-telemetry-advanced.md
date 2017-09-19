## View the telemetry

The Raspberry Pi is now sending telemetry to the remote monitoring solution. You can view the telemetry on the solution dashboard. You can also send messages to your Raspberry Pi from the solution dashboard.

- Navigate to the solution dashboard.
- Select your device in the **Device to View** dropdown.
- The telemetry from the Raspberry Pi displays on the dashboard.

![Display telemetry from the Raspberry Pi][img-telemetry-display]

## Initiate the firmware update

The firmware update process downloads and installs an updated version of the device client application on the Raspberry Pi. For more information about the firmware update process, see the description of the firmware update pattern in [Overview of device management with IoT Hub][lnk-update-pattern].

You initiate the firmware update process by invoking a method on the device. This method is asynchronous, and returns as soon as the update process begins. The device uses reported properties to notify the solution about the progress of the update.

You invoke methods on your Raspberry Pi from the solution dashboard. When the Raspberry Pi first connects to the remote monitoring solution, it sends information about the methods it supports. 

[img-telemetry-display]: media/iot-suite-raspberry-pi-kit-view-telemetry-advanced/telemetry.png
[lnk-update-pattern]: ../articles/iot-hub/iot-hub-device-management-overview.md
