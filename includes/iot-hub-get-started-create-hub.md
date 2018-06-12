## Create an IoT hub
Create an IoT hub for your simulated device app to connect to. The following steps show you how to complete this task by using the Azure portal.

[!INCLUDE [iot-hub-create-hub](iot-hub-create-hub.md)]

Now that you have created an IoT hub, locate the important information that you use to connect devices and applications to your IoT hub. 

1. When the IoT hub has been created successfully, click the new tile for your IoT hub in the Azure portal to open the properties window for the new IoT hub. Make a note of the **Hostname**, and then click **Shared access policies**.
   
    ![New IoT hub window][4]
1. In **Shared access policies**, click the **iothubowner** policy, and then copy and make note of the IoT Hub connection string in the **iothubowner** window. For more information, see [Access control][lnk-access-control] in the "IoT Hub developer guide."
   
    ![Shared access policies][5]

<!-- Images. -->
[4]: ./media/iot-hub-get-started-create-hub/create-iot-hub4.png
[5]: ./media/iot-hub-get-started-create-hub/create-iot-hub5.png

<!-- Links -->
[lnk-access-control]: ../articles/iot-hub/iot-hub-devguide-security.md
