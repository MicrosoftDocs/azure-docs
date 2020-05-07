---
title: Connect IoT Plug and Play Preview sample device code to Azure IoT Hub | Microsoft Docs
description: Use Python to build and run IoT Plug and Play Preview sample device code that connects to an IoT hub. Use the Azure IoT explorer tool to view the information sent by the device to the hub.
author: ericmitt
ms.author: ericmitt
ms.date: 5/4/2020
ms.topic: quickstart
ms.service: iot-pnp
services: iot-pnp
ms.custom: mvc

# As a device developer, I want to see a working IoT Plug and Play device sample connecting to IoT Hub and sending properties, commands and telemetry. As a solution developer, I want to use a tool to view the properties, commands, and telemetry an IoT Plug and Play device reports to the IoT hub it connects to.
---

# Quickstart: Connect a sample IoT Plug and Play Preview device application to IoT Hub (Python)

[!INCLUDE [iot-pnp-quickstarts-device-selector.md](../../includes/iot-pnp-quickstarts-device-selector.md)]

This quickstart shows you how to build a sample IoT Plug and Play device application, connect it to your IoT hub, and use the Azure IoT explorer tool to view the information it sends to the hub. The sample application is written for Python and is included in the Azure IoT Hub Device SDK for Python. A solution developer can use the Azure IoT explorer tool to understand the capabilities of an IoT Plug and Play device without the need to view any device code.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Prerequisites

To complete this quickstart, you need Python on your development machine. Python 3.5+ preferably Python 3.7. You can check your python version by running  

```cmd/sh
python --version
```

You can download the latest recommended version for multiple platforms from [python.org](https://www.python.org/).

### Install the Azure IoT explorer

Download and install the latest release of **Azure IoT explorer** from the tool's [repository](https://github.com/Azure/azure-iot-explorer/releases) page, by selecting the .msi file under "Assets" for the most recent update.

[!INCLUDE [iot-pnp-prepare-iot-hub.md](../../includes/iot-pnp-prepare-iot-hub.md)]

Run the following command to get the _IoT hub connection string_ for your hub (note for use later):

```azurecli-interactive
az iot hub show-connection-string --hub-name <YourIoTHubName> --output table
```

## Set up your environment
---
**Installation for Bug Bash 5/8** 

For this bug bash, we'll use a private package. This will be published to pip for the public preview refresh.
Please go to https://aka.ms/PythonDevicePnP0508 and download the wheel (.whl) file. Once downloaded, in your local python environment please install the file. 

```cmd/sh
pip install azure_iot_device-2.1.0-preview-pnp-py2.py3-none-any.whl 
```
---
Clone the Python IoT SDK repo:

```cmd/sh
git clone https://github.com/Azure/azure-iot-sdk-python -b digitaltwins-preview 
```

## Run the sample device

The `azure-iot-sdk-python\azure-iot-device\samples\pnp` folder contains the sample code for the IoT Plug and Play device. There are three files in this folder:

1. pnp_sample_device.py 
1. pnp_helper.py  
1. pnp_methods.py 

The sample file is “pnp_sample_device.py”. Notice that the sample uses methods from “pnp_methods.py”. This “pnp_methods.py” file uses our “azure-iot-device" SDK functionality to provide PNP compatible functionality. It uses certain helper functions that are present in the “pnp_helper.py” file.   

Use the IoT Hub you've created for this bug bash and create a device. Copy its connection string in an environment variable named: IOTHUB_DEVICE_CONNECTION_STRING in the pnp_sample_device.py 

Look at “pnp_sample_device.py” closely. Notice how: 

1. pnp_methods have been imported to enable utilization of their functions. 

2. There are 3 digital twin model identifiers (DTMIs) defined at the top that uniquely represent 3 different interfaces. These 3 interfaces would be used as components in this sample to provide full functionality of the device being implemented. These 3 interfaces have already been published in a central repository. These DTMIs must be known to the user and will vary dependent on the scenario of device implementation. For the current sample these 3 DTMIs represent

    1. An environmental sensor developed by contoso 

    1. Device information developed by azure 

    1. SDK information pertaining to the SDK being used. 

1. The DTMI for the device that is being implemented is defined right after. Please note that this DTMI is user choice and will reflect the name choice for the device and the name of the company that the user belongs to. This must be created by the user. For the purposes of the sample this has been created and it shows that the device being implemented is “sample_device” and it belongs to “my_company” 

1. After this the sample retrieves some component names from the existing DTMIs. The component names for device information and SDK information are the ones which can be retrieved as they will not change and will be present only once per device. The only component name that can be user choice is the name for the environmental sensor. This is simply because the user can choose to use multiple sensors in his device and all of them must be named uniquely. In the current sample there is only 1 environmental sensor is used and it has been named to be just “sensor”. 

1. Next comes the section for command handlers. These are user written handlers and functionality can be changed according to what the user wants to do after receiving command requests. In the current sample we can see handlers for 4 command requests.  

1. A response creator function is written after this. This is also a user written function only to be written if the user wants to respond with any special response back to the hub. Unless this is provided, a generic response will be sent back to the hub. In the current sample, the user only wants to create response for the “blink” command. 

1. Next an input keyboard listener is written. This is only to quit the application. 

1. After that the main functionality starts. The main functionality includes creation of the client, executing listeners for command requests, some update property tasks and a send telemetry task. 

    1. The first section deals with the creation and connection of the device client using the device SDK supplying the connection string. The device is then connected. 

    1. The next section deals with the updating properties. There are 3 tasks that will update properties for 3 different components. The “pnp_update_property” is defined in pnp_methods which is used for this purpose. The user needs to pass the client, the corresponding component name and the properties in key value pairs. One thing to note would be that the property update task for the SDK information has a key named “version” whose value is a constant that is imported from the azure-iot-device SDK.  

    1. The next section deals with listening for command requests. For this there are couple of “execute_listener” calls. This method is defined in pnp_methods which listens to command requests. All the user needs to pass as parameters are the client, component name, the method name and the user handler and sometimes the user defined function that would create user tailored command responses.  

        1. The user handler contains the functionality that the user wants to execute upon reception of command request.  

        1. A response is also sent to the Hub upon successful execution of any command request. This can be viewed on the portal. 

        1. Please observe that the “blink” is the only command request that has a special response creator function.  

1. The next section deals with sending telemetry continuously. The “pnp_send_telemetry” also defined in pnp_methods have been used for this purpose. The user needs to use this one in a loop to send telemetry at certain interval (8 secs in sample) 

Once all the functionality is done, all the listeners and tasks are disabled. 

 

After you have a feel for the code, go ahead and run the sample with: 

> python pnp_sample_device.py 

The sample device sends telemetry messages every eight seconds to your IoT hub.

You see the following output, that indicates the device is sending telemetry data to the hub, and is now ready to receive commands and property updates.

![Device confirmation messages](media/quickstart-connect-device-node/device-confirmation-node.png)

Keep the sample running as you complete the next steps.

## Use the Azure IoT explorer to validate the code

After the device client sample starts, use the Azure IoT explorer tool to verify it's working.

[!INCLUDE [iot-pnp-iot-explorer.md](../../includes/iot-pnp-iot-explorer.md)]

[!INCLUDE [iot-pnp-clean-resources.md](../../includes/iot-pnp-clean-resources.md)]

## Next steps

In this quickstart, you've learned how to connect an IoT Plug and Play device to an IoT hub. To learn more about how to build a solution that interacts with your IoT Plug and Play devices, see:

> [!div class="nextstepaction"]
> [Interact with an IoT Plug and Play Preview device that's connected to your solution](quickstart-service-python.md)
