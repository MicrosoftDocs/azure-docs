## View device telemetry in the dashboard

The dashboard in the remote monitoring solution enables you to view the telemetry that your devices send to IoT Hub.

1. In your browser, return to the remote monitoring solution dashboard, click **Devices** in the left-hand panel to navigate to the **Devices list**.

2. In the **Devices list**, you should see that the status of your device is now **Running**.

    ![][18]

3. Click **Dashboard** to return to the dashboard, select your device in the **Device to View** drop-down to view its telemetry. The telemetry from the sample application is 50 units for internal temperature, 55 units for external temperature, and 50 units for humidity. Note that by default the dashboard displays only temperature and humidity values.

    ![][img-telemetry]

## Send a command to your device

The dashboard in the remote monitoring solution enables you to send commands to your devices through IoT Hub. For example, in the remote monitoring solution you can send a command to set the internal temperature of a device.

1. In the remote monitoring solution dashboard, click **Devices** in the left-hand panel to navigate to the **Devices list**.

2. Click **Device ID** for your device in the **Devices list**.

3. In the **Device details** panel, click **Commands**.

    ![][13]

4. In the **Command** drop-down, select **SetTemperature**, and then in **Temperature** enter a new temperature value. Click **Send command** to send the command to the device.

    ![][14]

    > [AZURE.NOTE] The command history initially shows the command status as **Pending**. When the device acknowledges the command, the status changes to **Success**.

5. On the dashboard, verify that the device is now sending 75 as the new temperature value.

## Next steps

The article [Customizing preconfigured solutions][lnk-customize] describes some ways you can extend this sample. Possible extensions include using real sensors and implementing additional commands.

You can learn more about the [permissions on the azureiotsuite.com site][lnk-permissions].

[13]: ./media/iot-suite-visualize-connecting/suite4.png
[14]: ./media/iot-suite-visualize-connecting/suite7-1.png
[18]: ./media/iot-suite-visualize-connecting/suite10.png
[img-telemetry]: ./media/iot-suite-visualize-connecting/telemetry.png
[lnk-customize]: ../articles/iot-suite/iot-suite-guidance-on-customizing-preconfigured-solutions.md
[lnk-permissions]: ../articles/iot-suite/iot-suite-permissions.md
