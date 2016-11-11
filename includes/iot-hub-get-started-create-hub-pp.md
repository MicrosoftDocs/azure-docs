[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

## Create a device identity
In this section, you use a Node tool called [IoT Hub Explorer][iot-hub-explorer] to create a device identity for this tutorial.

1. Run the following in your command-line environment:
   
    npm install -g iothub-explorer@latest
2. Then, run the following command to login to your hub, remembering to substitute `{service connection string}` with the IoT Hub connection string you previously copied:
   
    iothub-explorer login "{service connection string}"
3. Finally, create a new device identity called `myDeviceId` with the command:
   
    iothub-explorer create myDeviceId --connection-string

Make a note of the device connection string from the result. This connection string is used by the device app to connect to your IoT Hub as a device.

![][img-identity]

Refer to [Getting started with IoT Hub][lnk-getstarted] for a way to create device identities programmatically.

<!-- images and links -->
[img-identity]: media/iot-hub-get-started-create-hub-pp/devidentity.png

[iot-hub-explorer]: https://github.com/Azure/azure-iot-sdks/tree/master/tools/iothub-explorer

[lnk-getstarted]: ../articles/iot-hub/iot-hub-csharp-csharp-getstarted.md
