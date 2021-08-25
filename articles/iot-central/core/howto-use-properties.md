---
title: Use properties in an Azure IoT Central solution
description: Learn how to use read-only and writable properties in an Azure IoT Central solution.
author: dominicbetts
ms.author: dobett
ms.date: 11/06/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central

# Solution developer
---

# Use properties in an Azure IoT Central solution

This how-to guide shows you how to use device properties that are defined in a device template in your Azure IoT Central application.

Properties represent point-in-time values. For example, a device can use a property to report the target temperature it's trying to reach. By default, device properties are read-only in IoT Central. Writable properties let you synchronize state between your device and your Azure IoT Central application.

You can also define cloud properties in an Azure IoT Central application. Cloud property values are never exchanged with a device and are out of scope for this article.

## Define your properties

Properties are data fields that represent the state of your device. Use properties to represent the durable state of the device, such as the on/off state of a device. Properties can also represent basic device properties, such as the software version of the device. You declare properties as read-only or writable.

The following screenshot shows a property definition in an Azure IoT Central application.

:::image type="content" source="media/howto-use-properties/property-definition.png" alt-text="Screenshot that shows a property definition in an Azure IoT Central application.":::

The following table shows the configuration settings for a property capability.

| Field           | Description                                                                                                                                                                                                                        |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Display name    | The display name for the property value used on dashboard tiles and device forms.                                                                                                                                                              |
| Name            | The name of the property. Azure IoT Central generates a value for this field from the display name, but you can choose your own value if necessary. This field must be alphanumeric.  The device code uses this **Name** value.           |
| Capability type | Property.                                                                                                                                                                                                                          |
| Semantic type   | The semantic type of the property, such as temperature, state, or event. The choice of semantic type determines which of the following fields are available.                                                                       |
| Schema          | The property data type, such as double, string, or vector. The available choices are determined by the semantic type. Schema isn't available for the event and state semantic types.                                               |
| Writable       | If the property isn't writable, the device can report property values to Azure IoT Central. If the property is writable, the device can report property values to Azure IoT Central. Then Azure IoT Central can send property updates to the device. |
| Severity        | Only available for the event semantic type. The severities are **Error**, **Information**, or **Warning**.                                                                                                                         |
| State values    | Only available for the state semantic type. Define the possible state values, each of which has display name, name, enumeration type, and value.                                                                                   |
| Unit            | A unit for the property value, such as **mph**, **%**, or **&deg;C**.                                                                                                                                                              |
| Display unit    | A display unit for use on dashboards tiles and device forms.                                                                                                                                                                                    |
| Comment         | Any comments about the property capability.                                                                                                                                                                                        |
| Description     | A description of the property capability.                                                                                                                                                                                          |

The properties can also be defined in an interface in a device template as shown here:

``` json
{
  "@type": [
    "Property",
    "Temperature"
  ],
  "name": "targetTemperature",
  "schema": "double",
  "displayName": "Target Temperature",
  "description": "Allows to remotely specify the desired target temperature.",
  "unit" : "degreeCelsius",
  "writable": true
},
{
  "@type": [
    "Property",
    "Temperature"
  ],
  "name": "maxTempSinceLastReboot",
  "schema": "double",
  "unit" : "degreeCelsius",
  "displayName": "Max temperature since last reboot.",
  "description": "Returns the max temperature since last device reboot."
}
```

This example shows two properties. These properties relate to the property definition in the UI:

* `@type` specifies the type of capability: `Property`. The previous example also shows the semantic type `Temperature` for both properties.
* `name` for the property.
* `schema` specifies the data type for the property. This value can be a primitive type, such as double, integer, Boolean, or string. Complex object types and maps are also supported.
* `writable` By default, properties are read-only. You can mark a property as writable by using this field.

Optional fields, such as display name and description, let you add more details to the interface and capabilities.

When you create a property, you can specify complex schema types such as **Object** and **Enum**.

![Screenshot that shows how to add a capability.](./media/howto-use-properties/property.png)

When you select the complex **Schema**, such as **Object**, you need to define the object, too.

:::image type="content" source="media/howto-use-properties/object.png" alt-text="Screenshot that shows how to define an object":::

The following code shows the definition of an Object property type. This object has two fields with types string and integer.

``` json
{
  "@type": "Property",
  "displayName": {
    "en": "ObjectProperty"
  },
  "name": "ObjectProperty",
  "schema": {
    "@type": "Object",
    "displayName": {
      "en": "Object"
    },
    "fields": [
      {
        "displayName": {
          "en": "Field1"
        },
        "name": "Field1",
        "schema": "integer"
      },
      {
        "displayName": {
          "en": "Field2"
        },
        "name": "Field2",
        "schema": "string"
      }
    ]
  }
}
```

## Implement read-only properties

By default, properties are read-only. Read-only properties let a device report property value updates to your Azure IoT Central application. Your Azure IoT Central application can't set the value of a read-only property.

Azure IoT Central uses device twins to synchronize property values between the device and the Azure IoT Central application. Device property values use device twin reported properties. For more information, see [device twins](../../iot-hub/tutorial-device-twins.md).

The following snippet from a device model shows the definition of a read-only property type:

``` json
{
  "name": "model",
  "displayName": "Device model",
  "schema": "string",
  "comment": "Device model name or ID. Ex. Surface Book 2."
}
```

Property updates are sent by a device as a JSON payload. For more information, see [payloads](./concepts-telemetry-properties-commands.md).

You can use the Azure IoT device SDK to send a property update to your Azure IoT Central application.

Device twin properties can be sent to your Azure IoT Central application by using the following function:

``` javascript
hubClient.getTwin((err, twin) => {
    const properties = {
        model: 'environmentalSensor1.0'
    };
    twin.properties.reported.update(properties, (err) => {
        console.log(err ? `error: ${err.toString()}` : `status: success` )
    });
});
```

This article uses Node.js for simplicity. For other language examples, see the [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md) tutorial.

The following view in Azure IoT Central application shows the properties you can see. The view automatically makes the **Device model** property a _read-only device property_.

:::image type="content" source="media/howto-use-properties/read-only.png" alt-text="Screenshot that shows the view of a read-only property":::

## Implement writable properties

Writable properties are set by an operator in the Azure IoT Central application on a form. Azure IoT Central sends the property to the device. Azure IoT Central expects an acknowledgment from the device.

The following snippet from a device model shows the definition of a writable property type:

``` json
{
  "@type": "Property",
  "displayName": "Brightness Level",
  "description": "The brightness level for the light on the device. Can be specified as 1 (high), 2 (medium), 3 (low)",
  "name": "brightness",
  "writable": true,
  "schema": "long"
}
```

To define and handle the writable properties your device responds to, you can use the following code:

``` javascript
hubClient.getTwin((err, twin) => {
    twin.on('properties.desired.brightness', function(desiredBrightness) {
        console.log( `Received setting: ${desiredBrightness.value}` );
        var patch = {
            brightness: {
                value: desiredBrightness.value,
                ad: 'success',
                ac: 200,
                av: desiredBrightness.$version
            }
        }
        twin.properties.reported.update(patch, (err) => {
            console.log(err ? `error: ${err.toString()}` : `status: success` )
        });
    });
});
```

The response message should include the `ac` and `av` fields. The `ad` field is optional. See the following snippets for examples:

* `ac` is a numeric field that uses the values in the following table.
* `av` is the version number sent to the device.
* `ad` is an option string description.

| Value | Label | Description |
| ----- | ----- | ----------- |
| `'ac': 200` | Completed | The property change operation was successfully completed. |
| `'ac': 202` or `'ac': 201` | Pending | The property change operation is pending or in progress. |
| `'ac': 4xx` | Error | The requested property change wasn't valid or had an error. |
| `'ac': 5xx` | Error | The device experienced an unexpected error when processing the requested change. |

For more information on device twins, see [Configure your devices from a back-end service](../../iot-hub/tutorial-device-twins.md).

When the operator sets a writable property in the Azure IoT Central application, the application uses a device twin desired property to send the value to the device. The device then responds by using a device twin reported property. When Azure IoT Central receives the reported property value, it updates the property view with a status of **Accepted**.

The following view shows the writable properties. When you enter the value and select **Save**, the initial status is **Pending**. When the device accepts the change, the status changes to **Accepted**.

![Screenshot that shows Pending status.](./media/howto-use-properties/status-pending.png)

![Screenshot that shows Accepted property.](./media/howto-use-properties/accepted.png)

## Next steps

Now that you've learned how to use properties in your Azure IoT Central application, see:

* [Payloads](concepts-telemetry-properties-commands.md)
* [Create and connect a client application to your Azure IoT Central application](tutorial-connect-device.md)