---
author: dominicbetts
ms.author: dobett
ms.service: iot-pnp
ms.topic: include
ms.date: 03/17/2020
---

## Model your device

You use the _digital twin definition language_ to create a device capability model. A model typically consists of multiple _interface_ definition files and a single model file. The **Azure IoT Tools for VS Code** extension pack includes tools to help you create and edit these JSON files.

### Create the interface file

To create an interface file that defines the capabilities of your IoT device in VS Code:

1. Create a folder called **devicemodel**.

1. Launch VS Code and use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Create Interface** command.

1. Browse to and select the **devicemodel** folder you created.

1. Then enter **EnvironmentalSensor** as the name of the interface and press **Enter**. VS Code creates a sample interface file called **EnvironmentalSensor.interface.json**.

1. Replace the contents of this file with the following JSON and replace `{your name}` in the `@id` field with a unique value. Use only the characters a-z, A-Z, 0-9, and underscore. For more information, see [Digital Twin identifier format](https://github.com/Azure/IoTPlugandPlay/tree/master/DTDL#digital-twin-identifier-format). The interface ID must be unique to save the interface in the repository:

    ```json
    {
      "@id": "urn:{your name}:EnvironmentalSensor:1",
      "@type": "Interface",
      "displayName": "Environmental Sensor",
      "description": "Provides functionality to report temperature, humidity. Provides telemetry, commands and read-write properties",
      "comment": "Requires temperature and humidity sensors.",
      "contents": [
        {
          "@type": "Property",
          "displayName": "Device State",
          "description": "The state of the device. Two states online/offline are available.",
          "name": "state",
          "schema": "boolean"
        },
        {
          "@type": "Property",
          "displayName": "Customer Name",
          "description": "The name of the customer currently operating the device.",
          "name": "name",
          "schema": "string",
          "writable": true
        },
        {
          "@type": "Property",
          "displayName": "Brightness Level",
          "description": "The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)",
          "name": "brightness",
          "writable": true,
          "schema": "long"
        },
        {
          "@type": [
            "Telemetry",
            "SemanticType/Temperature"
          ],
          "description": "Current temperature on the device",
          "displayName": "Temperature",
          "name": "temp",
          "schema": "double",
          "unit": "Units/Temperature/fahrenheit"
        },
        {
          "@type": [
            "Telemetry",
            "SemanticType/Humidity"
          ],
          "description": "Current humidity on the device",
          "displayName": "Humidity",
          "name": "humid",
          "schema": "double",
          "unit": "Units/Humidity/percent"
        },
        {
          "@type": "Telemetry",
          "name": "magnetometer",
          "displayName": "Magnetometer",
          "comment": "This shows a complex telemetry that contains a magnetometer reading.",
          "schema": {
            "@type": "Object",
            "fields": [
              {
                "name": "x",
                "schema": "integer"
              },
              {
                "name": "y",
                "schema": "integer"
              },
              {
                "name": "z",
                "schema": "integer"
              }
            ]
          }
        },
        {
          "@type": "Command",
          "name": "turnon",
          "response": {
            "name": "turnon",
            "schema": "string"
          },
          "comment": "This Commands will turn-on the LED light on the device.",
          "commandType": "synchronous"
        },
        {
          "@type": "Command",
          "name": "turnoff",
          "comment": "This Commands will turn-off the LED light on the device.",
          "response": {
            "name": "turnoff",
            "schema": "string"
          },
          "commandType": "synchronous"
        }
      ],
      "@context": "http://azureiot.com/v1/contexts/IoTModel.json"
    }
    ```

    This interface defines device properties such as **Customer Name**, telemetry types such as **Temperature**, and commands such as **turnon**.

1. Add a command capability called **blink** at the end of this interface file. Be sure to add a comma before you add the command. Try typing the definition to see how intellisense, autocomplete, and validation can help you edit an interface definition:

    ```json
    {
      "@type": "Command",
      "description": "This command will begin blinking the LED for given time interval.",
      "name": "blink",
      "request": {
        "name": "blinkRequest",
        "schema": {
          "@type": "Object",
          "fields": [
            {
              "name": "interval",
              "schema": "long"
            }
          ]
        }
      },
      "response": {
        "name": "blinkResponse",
        "schema": "string"
      },
      "commandType": "synchronous"
    }
    ```

1. Save the file.

### Create the model file

The model file specifies the interfaces that your IoT Plug and Play device implements. There are typically at least two interfaces in a model - one or more that define the specific capabilities of your device, and a standard interface that all IoT Plug and Play devices must implement.

To create a model file that specifies the interfaces your IoT Plug and Play device implements in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Create Capability Model** command. Then enter **SensorboxModel** as the name of the model. VS Code creates a sample interface file called **SensorboxModel.capabilitymodel.json**.

1. Replace the contents of this file with the following JSON and replace `{your name}` in the `@id` field and in the `EnvironmentalSensor` interface with the same value you used in the **EnvironmentalSensor.interface.json** file. The interface ID must be unique to save the interface in the repository:

    ```json
    {
      "@id": "urn:{your name}:SensorboxModel:1",
      "@type": "CapabilityModel",
      "displayName": "Environmental Sensorbox Model",
      "implements": [
        {
          "schema": "urn:{your name}:EnvironmentalSensor:1",
          "name": "environmentalSensor"
        },
        {
          "schema": "urn:azureiot:DeviceManagement:DeviceInformation:1",
          "name": "deviceinfo"
        }
      ],
      "@context": "http://azureiot.com/v1/contexts/IoTModel.json"
    }
    ```

    The model defines a device that implements your **EnvironmentalSensor** interface and the standard **DeviceInformation** interface.

1. Save the file.

### Download the DeviceInformation interface

Before you can generate skeleton code from the model, you must create a local copy of the **DeviceInformation** from the *public model repository*. The public model repository already contains the **DeviceInformation** interface.

To download the **DeviceInformation** interface from the public model repository using VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play**, select the **Open Model Repository** command, and then select **Public repository**.

1. Select **Interfaces**, then select the device information interface with ID `urn:azureiot:DeviceManagement:DeviceInformation:1`, and then select **Download**.

You now have the three files that make up your device capability model:

* urn_azureiot_DeviceManagement_DeviceInformation_1.interface.json
* EnvironmentalSensor.interface.json
* SensorboxModel.capabilitymodel.json

## Publish the model

For the Azure IoT explorer tool to be able to read your device capability model, you must publish it in your company model repository. To publish from VS Code, you need the connection string for the company repository:

1. Navigate to the [Azure Certified for IoT portal](https://aka.ms/ACFI).

1. Use your Microsoft _work account_ to sign in to the portal.

1. Select **Company repository** and then **Connection strings**.

1. Copy the _company model repository connection string_.

To open your company repository in VS Code:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Open Model Repository** command.

1. Select **Company repository** and paste in your connection string.

1. Press **Enter** to open your company repository.

To publish your device capability model and interfaces to your company repository:

1. Use **Ctrl+Shift+P** to open the command palette.

1. Enter **Plug and Play** and then select the **IoT Plug & Play: Submit files to Model Repository** command.

1. Select the **EnvironmentalSensor.interface.json** and **SensorboxModel.capabilitymodel.json** files and select **OK**.

Your files are now stored in your company repository.
