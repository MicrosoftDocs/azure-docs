## View the telemetry

The Raspberry Pi is now sending telemetry to the remote monitoring solution. You can view the telemetry on the solution dashboard. You can also send messages to your Raspberry Pi from the solution dashboard.

- Navigate to the solution dashboard.
- Select your device in the **Device to View** dropdown.
- The telemetry from the Raspberry Pi displays on the dashboard.

![Display telemetry from the Raspberry Pi][img-telemetry-display]

## Act on the device

From the solution dashboard, you can invoke methods on your Raspberry Pi. When the Raspberry Pi connects to the remote monitoring solution, it sends information about the methods it supports.

- In the solution dashboard, click **Devices** to visit the **Devices** page. Select your Raspberry Pi in the **Device List**. Then choose **Methods**:

    ![List devices in dashboard][img-list-devices]

- On the **Invoke Method** page, choose **LightBlink** in the **Method** dropdown.

- Choose **InvokeMethod**. The LED connected to the Raspberry Pi flashes several times. The app on the Raspberry Pi sends an acknowledgment back to the solution dashboard:

    ![Show method history][img-method-history]

- You can switch the LED on and off using the **ChangeLightStatus** method with a **LightStatusValue** set to **1** for on or **0** for off.

> [!WARNING]
> If you leave the remote monitoring solution running in your Azure account, you are billed for the time it runs. For more information about reducing consumption while the remote monitoring solution runs, see [Configuring Azure IoT Suite preconfigured solutions for demo purposes][lnk-demo-config]. Delete the preconfigured solution from your Azure account when you have finished using it.


[img-telemetry-display]: media/iot-suite-raspberry-pi-kit-view-telemetry/telemetry.png
[img-list-devices]: media/iot-suite-raspberry-pi-kit-view-telemetry/listdevices.png
[img-method-history]: media/iot-suite-raspberry-pi-kit-view-telemetry/methodhistory.png

[lnk-demo-config]: https://github.com/Azure/azure-iot-remote-monitoring/blob/master/Docs/configure-preconfigured-demo.md