---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 11/17/2022
---

## Model ID announcement

To announce the model ID, the device must include it in the connection information:

```python
device_client = IoTHubDeviceClient.create_from_symmetric_key(
    symmetric_key=symmetric_key,
    hostname=registration_result.registration_state.assigned_hub,
    device_id=registration_result.registration_state.device_id,
    product_info=model_id,
)
```

> [!TIP]
> For modules and IoT Edge, use `IoTHubModuleClient` in place of `IoTHubDeviceClient`.

> [!TIP]
> This is the only time a device can set model ID, it can't be updated after the device connects.

## DPS payload

Devices using the [Device Provisioning Service (DPS)](../articles/iot-dps/about-iot-dps.md) can include the `modelId` to be used during the provisioning process by using the following JSON payload.

```json
{
    "modelId" : "dtmi:com:example:Thermostat;1"
}
```

## Use components

As described in [Understand components in IoT Plug and Play models](../articles/iot-develop/concepts-modeling-guide.md), you must decide if you want to use components to describe your devices. When you use components, devices must follow the rules described in the following sections.

## Telemetry

A default component doesn't require any special property added to the telemetry message.

When you use nested components, devices must set a message property with the component name:

```python
async def send_telemetry_from_temp_controller(device_client, telemetry_msg, component_name=None):
    msg = Message(json.dumps(telemetry_msg))
    msg.content_encoding = "utf-8"
    msg.content_type = "application/json"
    if component_name:
        msg.custom_properties["$.sub"] = component_name
    await device_client.send_message(msg)
```

## Read-only properties

Reporting a property from the default component doesn't require any special construct:

```python
await device_client.patch_twin_reported_properties({"maxTempSinceLastReboot": 38.7})
```

The device twin is updated with the following reported property:

```json
{
  "reported": {
      "maxTempSinceLastReboot" : 38.7
  }
}
```

When using nested components, properties must be created within the component name and include a marker:

```python
inner_dict = {}
inner_dict["targetTemperature"] = 38.7
inner_dict["__t"] = "c"
prop_dict = {}
prop_dict["thermostat1"] = inner_dict

await device_client.patch_twin_reported_properties(prop_dict)
```

The device twin is updated with the following reported property:

```json
{
  "reported": {
    "thermostat1" : {  
      "__t" : "c",  
      "maxTempSinceLastReboot" : 38.7
     }
  }
}
```

## Writable properties

These properties can be set by the device or updated by the back-end application. If the back-end application updates a property, the client receives a notification as a callback in the `IoTHubDeviceClient` or `IoTHubModuleClient`. To follow the IoT Plug and Play conventions, the device must inform the service that the property was successfully received.

If the property type is `Object`, the service must send a complete object to the device even if it's only updating a subset of the object's fields. The acknowledgment the device sends must also be a complete object.

### Report a writable property

When a device reports a writable property, it must include the `ack` values defined in the conventions.

To report a writable property from the default component:

```python
prop_dict = {}
prop_dict["targetTemperature"] = {
    "ac": 200,
    "ad": "reported default value",
    "av": 0,
    "value": 23.2
}

await device_client.patch_twin_reported_properties(prop_dict)
```

The device twin is updated with the following reported property:

```json
{
  "reported": {
    "targetTemperature": {
      "value": 23.2,
      "ac": 200,
      "av": 0,
      "ad": "reported default value"
    }
  }
}
```

To report a writable property from a nested component, the twin must include a marker:

```python
inner_dict = {}
inner_dict["targetTemperature"] = {
    "ac": 200,
    "ad": "reported default value",
    "av": 0,
    "value": 23.2
}
inner_dict["__t"] = "c"
prop_dict = {}
prop_dict["thermostat1"] = inner_dict

await device_client.patch_twin_reported_properties(prop_dict)
```

The device twin is updated with the following reported property:

```json
{
  "reported": {
    "thermostat1": {
      "__t" : "c",
      "targetTemperature": {
          "value": 23.2,
          "ac": 200,
          "av": 0,
          "ad": "complete"
      }
    }
  }
}
```

### Subscribe to desired property updates

Services can update desired properties that trigger a notification on the connected devices. This notification includes the updated desired properties, including the version number identifying the update. Devices must include this version number in the  `ack` message sent back to the service.

A default component sees the single property and creates the reported `ack` with the received version:

```python
async def execute_property_listener(device_client):
    ignore_keys = ["__t", "$version"]
    while True:
        patch = await device_client.receive_twin_desired_properties_patch()  # blocking call

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

The device twin for a nested component shows the desired and reported sections as follows:

```json
{
  "desired" : {
    "targetTemperature": 23.2,
    "$version" : 3
  },
  "reported": {
      "targetTemperature": {
          "value": 23.2,
          "ac": 200,
          "av": 3,
          "ad": "complete"
      }
  }
}
```

A nested component receives the desired properties wrapped with the component name, and should report back the `ack` reported property:

```python
def create_reported_properties_from_desired(patch):
    ignore_keys = ["__t", "$version"]
    component_prefix = list(patch.keys())[0]
    values = patch[component_prefix]

    version = patch["$version"]
    inner_dict = {}

    for prop_name, prop_value in values.items():
        if prop_name in ignore_keys:
            continue
        else:
            inner_dict["ac"] = 200
            inner_dict["ad"] = "Successfully executed patch"
            inner_dict["av"] = version
            inner_dict["value"] = prop_value
            values[prop_name] = inner_dict

    properties_dict = dict()
    if component_prefix:
        properties_dict[component_prefix] = values
    else:
        properties_dict = values

    return properties_dict

async def execute_property_listener(device_client):
    while True:
        patch = await device_client.receive_twin_desired_properties_patch()  # blocking call
        properties_dict = create_reported_properties_from_desired(patch)

        await device_client.patch_twin_reported_properties(properties_dict)
```

The device twin for components shows the desired and reported sections as follows:

```json
{
  "desired" : {
    "thermostat1" : {
        "__t" : "c",
        "targetTemperature": 23.2,
    }
    "$version" : 3
  },
  "reported": {
    "thermostat1" : {
        "__t" : "c",
      "targetTemperature": {
          "value": 23.2,
          "ac": 200,
          "av": 3,
          "ad": "complete"
      }
    }
  }
}
```

## Commands

A default component receives the command name as it was invoked by the service.

A nested component receives the command name prefixed with the component name and the `*` separator.

```python
command_request = await device_client.receive_method_request("thermostat1*reboot")
```

### Request and response payloads

Commands use types to define their request and response payloads. A device must deserialize the incoming input parameter and serialize the response.

The following example shows how to implement a command with complex types defined in the payloads:

```json
{
  "@type": "Command",
  "name": "getMaxMinReport",
  "displayName": "Get Max-Min report.",
  "description": "This command returns the max, min and average temperature from the specified time to the current time.",
  "request": {
    "name": "since",
    "displayName": "Since",
    "description": "Period to return the max-min report.",
    "schema": "dateTime"
  },
  "response": {
    "name" : "tempReport",
    "displayName": "Temperature Report",
    "schema": {
      "@type": "Object",
      "fields": [
        {
          "name": "maxTemp",
          "displayName": "Max temperature",
          "schema": "double"
        },
        {
          "name": "minTemp",
          "displayName": "Min temperature",
          "schema": "double"
        },
        {
          "name" : "avgTemp",
          "displayName": "Average Temperature",
          "schema": "double"
        },
        {
          "name" : "startTime",
          "displayName": "Start Time",
          "schema": "dateTime"
        },
        {
          "name" : "endTime",
          "displayName": "End Time",
          "schema": "dateTime"
        }
      ]
    }
  }
}
```

The following code snippets show how a device implements this command definition, including the types used to enable serialization and deserialization:

```python
def create_max_min_report_response(values):
    response_dict = {
        "maxTemp": max_temp,
        "minTemp": min_temp,
        "avgTemp": sum(avg_temp_list) / moving_window_size,
        "startTime": (datetime.now() - timedelta(0, moving_window_size * 8)).isoformat(),
        "endTime": datetime.now().isoformat(),
    }
    # serialize response dictionary into a JSON formatted str
    response_payload = json.dumps(response_dict, default=lambda o: o.__dict__, sort_keys=True)
    return response_payload
```

> [!TIP]
> The request and response names aren't present in the serialized payloads transmitted over the wire.
