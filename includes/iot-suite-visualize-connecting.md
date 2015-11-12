## Visualize your registered device and the data

7. Go back to your remote monitoring solution dashboard. You should the device has changed the status to Running on the Devices list.

    ![][18]

8. Click on the dashboard to see data coming. The sample is configured to send 50 units for internal temperature, 55 units for external temperature and 50 for humidity. Please note that the dashboard only shows temperature and humidity by default.

8. Now go to the [Command and control](#command) section to learn how to change the temperature on your device from the remote monitoring solution.

## <a name="command"></a>Command and control your device from the dashboard

Now that your device is connected and sending self-generated temperature data from your device, you can command and control your device remotely from IoT Hub. You can implement multiple types of commands that fit your business application. In this case, we've implemented a change in temperature, as if there was a need to control it from the solution. To send the command, you should:

-  Click on your device ID on the Devices list (you can find the device section on the left side menu).

    ![][13]

- On the right menu where device details are shown, click on "Send command"


- Select the command you want to run: In this case, we choose "Set temperature", since we want to change the temperature the device is set at. Select that command and choose the temperature value. Click on Send Command and the new temperature will be pushed to the device. Note: you will see that in the command history the result of the command is "Pending". This is because, for simplicity purposes, this samples hasn't implemented any logic in the device to respond to IoT Hub. You can do this extending the solution.

    ![][14]

- Go back to the dashboard and ensure that the updated data is coming through. You should see updated statistics on temperature and the new data being displayed in the telemetry history.

## Next steps

There are multiple ways to extend the functionality of this sample: connect real sensor to your device to send real date, implement command and control functionality,etc. Please use our [guide](articles/iot-suite/iot-suite-guidance-on-customizing-preconfigured-solutions.md) on how to extend the remote monitoring solution to learn more about this.


[13]: ./media/iot-suite-visualize-connecting/suite4.png
[14]: ./media/iot-suite-visualize-connecting/suite7-1.png
[18]: ./media/iot-suite-visualize-connecting/suite10.png


[lnk-getstarted]: http://www.microsoft.com/server-cloud/internet-of-things/getting-started.aspx
[lnk-what-are-preconfig-solutions]: ../articles/iot-suite/iot-suite-what-are-preconfigured-solutions.md
[lnk-remote-monitoring]: ../articles/iot-suite/iot-suite-remote-monitoring-sample-walkthrough.md
