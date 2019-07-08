---
 title: include file
 description: include file
 services: iot-hub
 author: dominicbetts
 ms.service: iot-hub
 ms.topic: include
 ms.date: 09/07/2018
 ms.author: dobett
 ms.custom: include file
---

## Create a device identity

In this section, you use the Azure CLI to create a device identity for this tutorial. The Azure CLI is preinstalled in the [Azure Cloud Shell](~/articles/cloud-shell/overview.md), or you can [install the Azure CLI locally](/cli/azure/install-azure-cli). Device IDs are case sensitive.

1. Run the following command in the command-line environment where you are using the Azure CLI to install the IoT extension:

    ```cmd/sh
    az extension add --name azure-cli-iot-ext
    ```

1. If you are running the Azure CLI locally, use the following command to sign in to your Azure account (if you are using the Cloud Shell, you are signed in automatically and you don't need to run this command):

    ```cmd/sh
    az login
    ```

1. Finally, create a new device identity called `myDeviceId` and retrieve the device connection string with these commands:

    ```cmd/sh
    az iot hub device-identity create --device-id myDeviceId --hub-name {Your IoT Hub name}
    az iot hub device-identity show-connection-string --device-id myDeviceId --hub-name {Your IoT Hub name} -o table
    ```

   [!INCLUDE [iot-hub-pii-note-naming-device](iot-hub-pii-note-naming-device.md)]

Make a note of the device connection string from the result. This device connection string is used by the device app to connect to your IoT Hub as a device.

<!-- images and links -->
