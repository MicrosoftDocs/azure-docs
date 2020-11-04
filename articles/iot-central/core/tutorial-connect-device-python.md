---
title: Tutorial - Connect a generic Python client app to Azure IoT Central | Microsoft Docs
description: This tutorial shows you how, as a device developer, to connect a device running a Python client app to your Azure IoT Central application. You create a device template by importing a device twins definition language (DTDL) model and add views that let you interact with a connected device.
author: dominicbetts
ms.author: dobett
ms.date: 11/03/2020
ms.topic: tutorial
ms.service: iot-central
services: iot-central
ms.custom: [devx-track-python, device-developer]

# As a device developer, I want to try out using Python device code that uses the Azure IoT Python SDK. I want to understand how to send telemetry from a device, synchronize properties with the device, and control the device using commands.
---

# Tutorial: Create and connect a client application to your Azure IoT Central application (Python)

[!INCLUDE [iot-central-selector-tutorial-connect](../../../includes/iot-central-selector-tutorial-connect.md)]

*This article applies to solution builders and device developers.*

This tutorial shows you how, as a device developer, to connect a Python client application to your Azure IoT Central application. The Python application simulates the behavior of a thermostat device. When the application connects to IoT Central, it sends the model ID of the thermostat device model. IoT Central uses the model ID to retrieve the device model and create a device template for you. You add customizations and views to the device template to enable an operator to interact with a device.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create and run the Python device code and see it connect to your IoT Central application.
> * View the simulated telemetry sent from the device.
> * Add custom views to a device template.
> * Publish the device template.
> * Use a view to manage device properties.
> * Call a command to control the device.

## Prerequisites

To complete the steps in this article, you need the following:

* An Azure IoT Central application created using the **Custom application** template. For more information, see the [create an application quickstart](quick-deploy-iot-central.md). The application must have been created on or after 14 July 2020.
* A development machine with [Python](https://www.python.org/) version 3.7 or later installed. You can run `python --version` at the command line to check your version. Python is available for a wide variety of operating systems. The instructions in this tutorial assume you're running the **python** command at the Windows command prompt.
* A local copy of the [Microsoft Azure IoT SDK for Python](https://github.com/Azure/azure-iot-sdk-python) GitHub repository that contains the sample code. Use this link to download a copy of the repository: [Download ZIP](https://github.com/Azure/azure-iot-sdk-python/archive/master.zip). Then unzip the file to a suitable location on your local machine.

## Review the code

In the copy of the Microsoft Azure IoT SDK for Python you downloaded previously, open the *azure-iot-sdk-python/azure-iot-device/samples/pnp/simple_thermostat.py* file in a text editor.

When you run the sample to connect to IoT Central, it uses the Device Provisioning Service (DPS) to register the device and generate a connection string. The sample retrieves the DPS connection information it needs from the command-line environment.

The `main` function:

* Uses DPS to provision the device. The provisioning information includes the model ID.
* Creates a `Device_client` object and sets the `dtmi:com:example:Thermostat;1` model ID before it opens the connection.
* Sends the `maxTempSinceLastReboot` property to IoT Central.
* Creates a listener for the `getMaxMinReport` command.
* Creates property listener, to listen for writable property updates.
* Starts a loop to send temperature telemetry every 10 seconds.

```python
async def main():
    switch = os.getenv("IOTHUB_DEVICE_SECURITY_TYPE")
    if switch == "DPS":
        provisioning_host = (
            os.getenv("IOTHUB_DEVICE_DPS_ENDPOINT")
            if os.getenv("IOTHUB_DEVICE_DPS_ENDPOINT")
            else "global.azure-devices-provisioning.net"
        )
        id_scope = os.getenv("IOTHUB_DEVICE_DPS_ID_SCOPE")
        registration_id = os.getenv("IOTHUB_DEVICE_DPS_DEVICE_ID")
        symmetric_key = os.getenv("IOTHUB_DEVICE_DPS_DEVICE_KEY")

        registration_result = await provision_device(
            provisioning_host, id_scope, registration_id, symmetric_key, model_id
        )

        if registration_result.status == "assigned":

            device_client = IoTHubDeviceClient.create_from_symmetric_key(
                symmetric_key=symmetric_key,
                hostname=registration_result.registration_state.assigned_hub,
                device_id=registration_result.registration_state.device_id,
                product_info=model_id,
            )
        else:
            raise RuntimeError(
                "Could not provision device. Aborting Plug and Play device connection."
            )

    elif switch == "connectionString":

        # ...

    # Connect the client.
    await device_client.connect()

    max_temp = 10.96  # Initial Max Temp otherwise will not pass certification
    await device_client.patch_twin_reported_properties({"maxTempSinceLastReboot": max_temp})

    listeners = asyncio.gather(
        execute_command_listener(
            device_client,
            method_name="getMaxMinReport",
            user_command_handler=max_min_handler,
            create_user_response_handler=create_max_min_report_response,
        ),
        execute_property_listener(device_client),
    )

    async def send_telemetry():
        global max_temp
        global min_temp
        current_avg_idx = 0

        while True:
            current_temp = random.randrange(10, 50)
            if not max_temp:
                max_temp = current_temp
            elif current_temp > max_temp:
                max_temp = current_temp

            if not min_temp:
                min_temp = current_temp
            elif current_temp < min_temp:
                min_temp = current_temp

            avg_temp_list[current_avg_idx] = current_temp
            current_avg_idx = (current_avg_idx + 1) % moving_window_size

            temperature_msg1 = {"temperature": current_temp}
            await send_telemetry_from_thermostat(device_client, temperature_msg1)
            await asyncio.sleep(8)

    send_telemetry_task = asyncio.create_task(send_telemetry())

    # ...
```

The `provision_device` function uses DPS to provision the device and register it with IoT Central. The function includes the device model ID in the provisioning payload:

```python
async def provision_device(provisioning_host, id_scope, registration_id, symmetric_key, model_id):
    provisioning_device_client = ProvisioningDeviceClient.create_from_symmetric_key(
        provisioning_host=provisioning_host,
        registration_id=registration_id,
        id_scope=id_scope,
        symmetric_key=symmetric_key,
    )
    provisioning_device_client.provisioning_payload = {"modelId": model_id}
    return await provisioning_device_client.register()
```

The `execute_command_listener` function handles command requests, runs the `max_min_handler` function when the device receives the `getMaxMinReport` command, and runs the `create_max_min_report_response` function to generate the response:

```python
async def execute_command_listener(
    device_client, method_name, user_command_handler, create_user_response_handler
):
    while True:
        if method_name:
            command_name = method_name
        else:
            command_name = None

        command_request = await device_client.receive_method_request(command_name)
        print("Command request received with payload")
        print(command_request.payload)

        values = {}
        if not command_request.payload:
            print("Payload was empty.")
        else:
            values = command_request.payload

        await user_command_handler(values)

        response_status = 200
        response_payload = create_user_response_handler(values)

        command_response = MethodResponse.create_from_method_request(
            command_request, response_status, response_payload
        )

        try:
            await device_client.send_method_response(command_response)
        except Exception:
            print("responding to the {command} command failed".format(command=method_name))
```

The `async def execute_property_listener` handles writable property updates such as `targetTemperature` and generates the JSON response:

```python
async def execute_property_listener(device_client):
    ignore_keys = ["__t", "$version"]
    while True:
        patch = await device_client.receive_twin_desired_properties_patch()  # blocking call

        print("the data in the desired properties patch was: {}".format(patch))

        version = patch["$version"]
        prop_dict = {}

        for prop_name, prop_value in patch.items():
            if prop_name in ignore_keys:
                continue
            else:
                prop_dict[prop_name] = {
                    "ac": 200,
                    "ad": "Successfully executed patch",
                    "av": version,
                    "value": prop_value,
                }

        await device_client.patch_twin_reported_properties(prop_dict)
```

The `send_telemetry_from_thermostat` function sends the telemetry messages to IoT Central:

```python
async def send_telemetry_from_thermostat(device_client, telemetry_msg):
    msg = Message(json.dumps(telemetry_msg))
    msg.content_encoding = "utf-8"
    msg.content_type = "application/json"
    print("Sent message")
    await device_client.send_message(msg)
```

## Get connection information

[!INCLUDE [iot-central-connection-configuration](../../../includes/iot-central-connection-configuration.md)]

## Run the code

To run the sample application, open a command-line environment and navigate to the folder *azure-iot-sdk-python/azure-iot-device/samples/pnp* folder that contains the *simple_thermostat.py* sample file.

[!INCLUDE [iot-central-connection-environment](../../../includes/iot-central-connection-environment.md)]

Install the required packages:

```cmd/sh
pip install azure-iot-device
```

Run the sample:

```cmd/sh
python simple_thermostat.py
```

The following output shows the device registering and connecting to IoT Central. The sample sends the `maxTempSinceLastReboot` property before it starts sending telemetry:

```cmd/sh
Device was assigned
iotc-.......azure-devices.net
sample-device-01
Listening for command requests and property updates
Press Q to quit
Sending telemetry for temperature
Sent message
Sent message
Sent message
```

[!INCLUDE [iot-central-monitor-thermostat](../../../includes/iot-central-monitor-thermostat.md)]

You can see how the device responds to commands and property updates:

```cmd/sh
Sent message
the data in the desired properties patch was: {'targetTemperature': {'value': 86.3}, '$version': 2}
Sent message

...

Sent message
Command request received with payload
2020-10-14T08:00:00.000Z
Will return the max, min and average temperature from the specified time 2020-10-14T08:00:00.000Z to the current time
Done generating
{"avgTemp": 31.5, "endTime": "2020-10-16T10:07:41.580722", "maxTemp": 49, "minTemp": 12, "startTime": "2020-10-16T10:06:21.580632"}
```

## View raw data

[!INCLUDE [iot-central-monitor-thermostat-raw-data](../../../includes/iot-central-monitor-thermostat-raw-data.md)]

## Next steps

If you'd prefer to continue through the set of IoT Central tutorials and learn more about building an IoT Central solution, see:

> [!div class="nextstepaction"]
> [Create a gateway device template](./tutorial-define-gateway-device-type.md)

As a device developer, now that you've learned the basics of how to create a device using Python, some suggested next steps are to:

* Read [What are device templates?](./concepts-device-templates.md) to learn more about the role of device templates when you're implementing your device code.
* Read [Get connected to Azure IoT Central](./concepts-get-connected.md) to learn more about how to register devices with IoT Central and how IoT Central secures device connections.
* Read [Telemetry, property, and command payloads](concepts-telemetry-properties-commands.md) to learn more about the data the device exchanges with IoT Central.
