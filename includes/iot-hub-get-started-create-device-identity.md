## Create a device identity

In this section, you use a Node.js tool called [iothub-explorer][iot-hub-explorer] to create a device identity for this tutorial. Device IDs are case sensitive.

1. Run the following in your command-line environment:

    `npm install -g iothub-explorer@latest`

1. Then, run the following command to login to your hub. Substitute `{iot hub connection string}` with the IoT Hub connection string you previously copied:

    `iothub-explorer login "{iot hub connection string}"`

1. Finally, create a new device identity called `myDeviceId` with the command:

    `iothub-explorer create myDeviceId --connection-string`

Make a note of the device connection string from the result. This device connection string is used by the device app to connect to your IoT Hub as a device.

![][img-identity]

Refer to [Getting started with IoT Hub][lnk-getstarted] to programmatically create device identities.

<!-- images and links -->
[img-identity]: media/iot-hub-get-started-create-device-identity/devidentity.png

[iot-hub-explorer]: https://github.com/Azure/iothub-explorer/blob/master/readme.md

[lnk-getstarted]: ../articles/iot-hub/iot-hub-csharp-csharp-getstarted.md
