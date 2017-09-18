## View device telemetry in the dashboard
The dashboard in the remote monitoring solution enables you to view the telemetry your devices send to IoT Hub.

1. In your browser, return to the remote monitoring solution dashboard, click **Devices** in the left-hand panel to navigate to the **Devices list**.
2. In the **Devices list**, you should see that the status of your device is **Running**. If not, click **Enable Device** in the **Device Details** panel.
   
    ![View device status][18]
3. Click **Dashboard** to return to the dashboard, select your device in the **Device to View** drop-down to view its telemetry. The telemetry from the sample application is 50 units for internal temperature, 55 units for external temperature, and 50 units for humidity.
   
    ![View device telemetry][img-telemetry]

## Invoke a method on your device
The dashboard in the remote monitoring solution enables you to invoke methods on your devices through IoT Hub. For example, in the remote monitoring solution you can invoke a method to simulate rebooting a device.

1. In the remote monitoring solution dashboard, click **Devices** in the left-hand panel to navigate to the **Devices list**.
2. Click **Device ID** for your device in the **Devices list**.
3. In the **Device details** panel, click **Methods**.
   
    ![Device methods][13]
4. In the **Method** drop-down, select **InitiateFirmwareUpdate**, and then in **FWPACKAGEURI** enter a dummy URL. Click **Invoke Method** to call the method on the device.
   
    ![Invoke a device method][14]
   

5. You see a message in the console running your device code when the device handles the method. The results of the method are added to the history in the solution portal:

    ![View method history][img-method-history]

## Next steps
The article [Customizing preconfigured solutions][lnk-customize] describes some ways you can extend this sample. Possible extensions include using real sensors and implementing additional commands.

You can learn more about the [permissions on the azureiotsuite.com site][lnk-permissions].

[13]: ./media/iot-suite-visualize-connecting/suite4.png
[14]: ./media/iot-suite-visualize-connecting/suite7-1.png
[18]: ./media/iot-suite-visualize-connecting/suite10.png
[img-telemetry]: ./media/iot-suite-visualize-connecting/telemetry.png
[img-method-history]: ./media/iot-suite-visualize-connecting/history.png
[lnk-customize]: ../articles/iot-suite/iot-suite-guidance-on-customizing-preconfigured-solutions.md
[lnk-permissions]: ../articles/iot-suite/iot-suite-permissions.md
