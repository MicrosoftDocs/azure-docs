# How-to: Install and use Azure IoT explorer

The Azure IoT explorer provides an easy way to interact with a Plug and Play device in a visualized way. It is an electron app which requires download and installation. Once installed, you can connect your device and start using the tool for interacting with your device side codes.

This article lists the steps of how to install and config Azure IoT explorer, and how you can interact and test your devices with this tool.

## Prerequisites
### Azure IoT Hub
You'll need to create a device identity in an Azure IoT Hub. If you don't have one, follow instructions [here](https://docs.microsoft.com/en-us/azure/iot-hub/quickstart-send-telemetry-node#create-an-iot-hub) to create one. If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

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

## Install Azure IoT explorer
### Windows/Linx
1. Go to [Link](), install the latest version by double click ``Azure.IoT.Explorer.Setup.**.exe`` (``**`` refers to the latest version number, e.g. 0.8.2)
2. For Windows, if Promopted by Windows Firewall, click ``Allow access``.
### Macbook
1. Go to [Link](), install the latest version using ``Azure.IoT.Explorer.Setup.**.dmg`` (``**`` refers to the latest version number, e.g. 0.8.2)

## Use Azure IoT explorer
In this article we are going to use Azure IoT explorer to interact with a simulated device. Follow the instructions [here]() to run the device. 

### Connect
#### First time connect
1. Open Azure IoT explorer. Fill in the Azure IoT Hub connection string, and click ``Connect``. 
> [!NOTE]
> By default, the tool will look for your model definition from the Public Model Repository. If you want to configure the model definition resources, please go to settings once you connect.
2. To switch to another IoT Hub or config model definition sources, please go to the settings.

### Overview page
#### Device overview
1. Once conncected, you will land on an overview page, where you have a list of all your device identities that exist in your Azure IoT Hub. 
2. Click on the device once to expand and see some details.
3. To interact with one device, double click to go to the detailed pages.
#### Device management
1. Create a device. You can click the ``Add`` button to create a new device identity in your Azure IoT Hub. Provide a descriptive Device ID; Use the default settings to auto-generate authentication keys and enable the connection to your hub.
2. Delete a device. You can choose a device then click ``Delete`` to delete an existing device identity in your Azure IoT Hub. Please carefully review the device details before you complete this action.
#### Query language
1. This tool supports all existing IoT Hub query language. For more information, please go [here](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-query-language).
2. In addition, this tool supports query by capabilityID and interfaceID.
 ![Img](img/.png)


## Interact with a device
Double-click a device from the overview page brings you to the next level of details. which includes 2 sections: Device and Digital Twin.

### Device information
This section includes ``Device Identity``, ``Telemetry`` and ``Device Twin``.
1. After creating a device, you can view and update the device identity information under ``Device identity`` tab.
2. If a device is connected and actively sending data, you can see them under the ``Telemetry`` tab.
3. You can access the device twin in the tool under ``Device Twin`` tab.

### Digital Twin 
This section shows you a digital twin instance of the device. For a plug and play device, all interfaces that associated with the device capability model will be displayed here. For each interface, you can click to expand its corresponding Plug and Play primitives. For more information of Plug and Play primitive definition, please go to the [Digital Twin Definition Language](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL).

1. Expand one interface, go to ``Properties`` page to view the read-only properties.
2. To update a writable property, go to ``Writable properties``page.
* Look for the property you'd like to update.
* Fill the desired value for that property.
* Preview the payload that will be sent to the device once submit the changes.
* Submit. Once you submit, you can track the update status - Synching, success or error. Once the synching is complete, you will see the new value of your property under ``Reported Property`` column. If you need to navigate to other pages before the synching completes, you will get a notification once the update is done. You can also go to the notification center for the notification history.

![Img](img/.png)
![Img](img/.png)
 
3. To send a command to a device, go to ``Commands`` page. 
* From the list of commands, find the command you want to triger and click to expand. 
* Input the required value for this command.
* Preview the payload that will be sent to the device once submit the changes.
* Submit. Once you submit, you can track the update status - Synching, success or error. Once the synching is complete, you will see the new value of your property under ``Reported Property`` column. If you need to navigate to other pages before the synching completes, you will get a notification once the update is done. You can also go to the notification center for the notification history.

4. To view the telemetry page, go to ``Telemetry`` page.
![Img](img/.png)




