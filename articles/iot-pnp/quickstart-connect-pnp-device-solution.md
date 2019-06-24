# Quickstart: Connect a Plug and Play device to my solution

Plug and Play simplifies IoT by enabling solution developers to interact with device capabilities while being agnostic by handling the translation between Plug and Play capabilities and underlying primitives. This quickstart shows you how to connect a Plug and Play device to your solution easily.

## Prerequisites
### Visual Studio
You'll need to have Visual Studio installed. If you don't have one, please install the latest version from https://visualstudio.microsoft.com/.

### Azure IoT Hub
You'll need to create a device identity in an Azure IoT Hub. If you don't have one, follow instructions [here](https://docs.microsoft.com/en-us/azure/iot-hub/quickstart-send-telemetry-node#create-an-iot-hub) to create one. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Setup C SDK vcpkg
Please follow [this article](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/setting_up_vcpkg.md#setup-c-sdk-vcpkg-for-windows-development-environment) to set up your development environment.

## Connect your Plug and Play device
In this article, we are going to use the simulated environmental sensor that is written in C as the sample Plug and Play device.

### Create a device identity in Azure IoT Hub
1. Run the following command to add the Microsoft Azure IoT Extension for Azure CLI to your Cloud Shell instance. The IOT Extension adds IoT Hub, IoT Edge, and IoT Device Provisioning Service (DPS) specific commands to Azure CLI.

```azurecli-interactive
    az extension add --name azure-cli-iot-ext
```

2. Run the following command to create a device identity in IoT Hub. ``YourIoTHubName`` and ``Mydevice`` in the command are placeholders and you need to replace them with your actual name and ID.

```azurecli-interactive
    az iot hub device-identity create --hub-name YourIoTHubName --device-id MyDevice
```

3. Run the following command to retrieve your device connection string. ``YourIoTHubName`` and ``Mydevice`` in the command are placeholders and you need to replace them with your actual name and ID.

```azurecli-interactive
    az iot hub device-identity show-connection-string --hub-name YourIoTHubName --device-id MyDevice --output table
```
4. Make a note of your device connection string. It will look like `HostName={YourIoTHubName}.azure-devices.net;DeviceId=MyDevice;SharedAccessKey={YourSharedAccessKey}`. We will need this connection string in the later steps.


### Configure the simulated device
### Build and run the device sample


## Build a solution to interact with Plug and Play device
### View the Telemetry
### View Properties
### Set Writable Properties
### Send Commands 


## Clean up resources 
If you plan to continue with later articles, you can keep these resources. Otherwise you can delete the resource you've created for this quickstart to avoid additional charges.

1. Log into the [Azure Portal](https://portal.azure.com).
1. Go to Resource Groups and type your resource group name that contains your hub in ``Filter by name`` textbox.
1. To the right of your resource group, click `...` and select ``Delete resource group``.

## Next step

In this quickstart, you've created a Plug and Play device using a DCM and validate the device code with Azure IoT explorer. 
To learn about ``next quickstart``, continue to the next quickstart.

> [!div class="nextstepaction"]
> [Quickstart: X]()
