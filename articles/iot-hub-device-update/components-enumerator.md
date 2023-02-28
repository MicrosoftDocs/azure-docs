---
title: 'Register components with Device Update: Contoso Virtual Vacuum component enumerator | Microsoft Docs'
description: Follow a Contoso Virtual Vacuum example to implement your own component enumerator by using proxy update.
author: kgremban
ms.author: kgremban
ms.date: 08/25/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Register components with Device Update

This article shows an example implementation of a Device Update for IoT Hub component enumerator. You can reference this example to implement a custom component enumerator for your IoT devices. A *component* is an identity beneath the device level that has a composition relationship with the host device.

This article demonstrates a component enumerator using a virtual IoT device called Contoso Virtual Vacuum. Component enumerators are used to implement the *proxy update* feature.  

Proxy update enables updating multiple components on the same IoT device or multiple sensors connected to the IoT device with a single over-the-air deployment. Proxy update supports an installation order for updating components. It also supports multiple-step updating with pre-installation, installation, and post-installation capabilities.

Use cases where proxy updates are applicable include:

- Targeting specific update files to partitions on the device.
- Targeting specific update files to apps or components on the device.
- Targeting specific update files to sensors connected to IoT devices over a network protocol (for example, USB or CAN bus).  

For more information, see [Proxy updates and multi-component updating](device-update-proxy-updates.md).

The Device Update agent runs on the host device. It can send each update to a specific component or to a group of components of the same hardware class (that is, requiring the same software or firmware update).  

## What is a component enumerator?

A component enumerator is an extension for the Device Update agent that provides information about every component that you need for an over-the-air update via a host device's Azure IoT Hub connection.  

The Device Update agent is device and component agnostic. By itself, the agent doesn't know anything about components on (or connected to) a host device at the time of the update.  

To enable proxy updates, device builders must identify all the components on the device that can be updated and assign a unique name to each component. Also, a group name can be assigned to components of the same hardware class, so that the same update can be installed onto all components in the same group. Then, the update content handler can install and apply the update to the correct components.  

:::image type="content" source="media/understand-device-update/contoso-virtual-vacuum-update-flow.svg" alt-text="Diagram that shows the proxy update flow." lightbox="media/understand-device-update/contoso-virtual-vacuum-update-flow.svg":::

Here are the responsibilities of each part of the proxy update flow:

- **Device builder**

  - Design and build the device.

  - Integrate the Device Update agent and its dependencies.

  - Implement a device-specific component enumerator extension and register with the Device Update agent.

    The component enumerator uses the information from a component inventory or a configuration file to augment static component data (Device Update required) with dynamic data (for example, firmware version, connection status, and hardware identity).

  - Create a proxy update that contains one or more child updates that target one or more components on (or connected to) the device.

  - Send the update to the solution operator.

- **Solution operator**

  - Import the update and manifest to the Device Update service.

  - Deploy the update to a group of devices.

- **Device Update agent**

  - Get update information from IoT Hub via the device twin or module twin.

  - Invoke a *steps handler* to process the proxy update intended for one or more components on the device.

    The example in this article has two updates: `host-fw-1.1` and `motors-fw-1.1`. For each child update, the parent steps handler invokes a child steps handler to enumerate all components that match the `Compatibilities` properties specified in the child update's manifest file. Next, the handler downloads, installs, and applies the child update to all targeted components.

    To get the matching components, the child update calls a `SelectComponents` API provided by the component enumerator. If there are no matching components, the child update is skipped.

  - Collect all update results from parent and child updates, and report those results to IoT Hub.

- **Child steps handler**

  - Iterate through a list of component instances that are compatible with the child update content. For more information, see [Steps handler](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/step_handlers).

In production, device builders can use [existing handlers](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/inc/aduc/content_handler.hpp) or implement a custom handler that invokes any installer needed for an over-the-air update. For more information, see [Implement a custom update content handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/how-to-implement-custom-update-handler.md).

## Virtual Vacuum components

For this article, we use a virtual IoT device to demonstrate the key concepts and features. The Contoso Virtual Vacuum device consists of five logical components:  

- Host firmware
- Host boot file system
- Host root file system
- Three motors (left wheel, right wheel, and vacuum)
- Two cameras (front and rear)

:::image type="content" source="media/understand-device-update/contoso-virtual-vacuum-components-diagram.svg" alt-text="Diagram that shows the Contoso Virtual Vacuum components." lightbox="media/understand-device-update/contoso-virtual-vacuum-components-diagram.svg":::

The following directory structure simulates the components:

```sh
/usr/local/contoso-devices/vacuum-1/hostfw
/usr/local/contoso-devices/vacuum-1/bootfs
/usr/local/contoso-devices/vacuum-1/rootfs
/usr/local/contoso-devices/vacuum-1/motors/0   /* left motor */
/usr/local/contoso-devices/vacuum-1/motors/1   /* right motor */
/usr/local/contoso-devices/vacuum-1/motors/2   /* vacuum motor */
/usr/local/contoso-devices/vacuum-1/cameras/0  /* front camera */
/usr/local/contoso-devices/vacuum-1/cameras/1  /* rear camera */
```

Each component's directory contains a JSON file that stores a mock software version number of each component. Example JSON files are *firmware.json* and *diskimage.json*.  

For this demo, to update the components' firmware, we'll copy *firmware.json* or *diskimage.json* (update payload) to the targeted components' directory.

Here's an example *firmware.json* file:

```json
{
    "version": "0.5",
    "description": "This component is generated for testing purposes."
}
```

> [!NOTE]
> Contoso Virtual Vacuum contains software or firmware versions for the purpose of demonstrating proxy update. It doesn't provide any other functionality.

## Implement a component enumerator (C language)

### Requirements

Implement all APIs declared in [component_enumerator_extension.hpp](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/inc/aduc/component_enumerator_extension.hpp):

| Function | Arguments | Returns |
|---|---|---|
|`char* GetAllComponents()`|None|A JSON string that contains an array of *all* `ComponentInfo` values. For more information, see [Example return values](#example-return-values).|
|`char* SelectComponents(char* selector)`|A JSON string that contains one or more name/value pairs used for selecting update target components| A JSON string that contains an array of `ComponentInfo` values. For more information, see [Example return values](#example-return-values).|
|`void FreeComponentsDataString(char* string)`|A pointer to string buffer previously returned by `GetAllComponents` or `SelectComponents` functions|None|

### ComponentInfo

The `ComponentInfo` JSON string must include the following properties:

| Name | Type | Description |
|---|---|---|
|`id`| string | A component's unique identity (device scope). Examples include hardware serial number, disk partition ID, and unique file path of the component.|
|`name`| string| A component's logical name. This property is the name that a device builder assigns to a component that's available in every device of the same `device` class.<br/><br/>For example, every Contoso Virtual Vacuum device contains a motor that drives a left wheel. Contoso assigned *left motor* as a common (logical) name for this motor to easily refer to this component, instead of hardware ID, which can be globally unique.|
|`group`|string|A group that this component belongs to.<br/><br/>For example, all motors could belong to a *motors* group.|
|`manufacturer`|string|For a physical hardware component, this property is a manufacturer or vendor name.<br/><br/>For a logical component, such as a disk partition or directory, it can be any device builder's defined value.|
|`model`|string|For a physical hardware component, this property is a model name.<br/><br/>For a logical component, such as a disk partition or directory, this property can be any device builder's defined value.|
|`properties`|object| A JSON object that contains any optional device-specific properties.|

Here's an example of `ComponentInfo` code based on the Contoso Virtual Vacuum components:

```json
{
    "id": "contoso-motor-serial-00000",
    "name": "left-motor",
    "group": "motors",
    "manufacturer": "contoso",
    "model": "virtual-motor",
    "properties": {
        "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/0",
        "firmwareDataFile": "firmware.json",
        "status": "connected",
        "version" : "motor-fw-1.0"
    }
}
```

### Example return values

Following is a JSON document returned from the `GetAllComponents` function. It's based on the example implementation of the Contoso Virtual Vacuum component enumerator.

```json
{
    "components": [
        {
            "id": "hostfw",
            "name": "hostfw",
            "group": "firmware",
            "manufacturer": "contoso",
            "model": "virtual-firmware",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/hostfw",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "host-fw-1.0"
            }
        },
        {
            "id": "bootfs",
            "name": "bootfs",
            "group": "boot-image",
            "manufacturer": "contoso",
            "model": "virtual-disk",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/bootfs",
                "firmwareDataFile": "diskimage.json",
                "status": "ok",
                "version" : "boot-fs-1.0"
            }
        },
        {
            "id": "rootfs",
            "name": "rootfs",
            "group": "os-image",
            "manufacturer": "contoso",
            "model": "virtual-os",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/rootfs",
                "firmwareDataFile": "diskimage.json",
                "status": "ok",
                "version" : "root-fs-1.0"
            }
        },
        {
            "id": "contoso-motor-serial-00000",
            "name": "left-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/0",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "motor-fw-1.0"
            }
        },
        {
            "id": "contoso-motor-serial-00001",
            "name": "right-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/1",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "motor-fw-1.0"
            }
        },
        {
            "id": "contoso-motor-serial-00002",
            "name": "vacuum-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/2",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "motor-fw-1.0"
            }
        },
        {
            "id": "contoso-camera-serial-00000",
            "name": "front-camera",
            "group": "cameras",
            "manufacturer": "contoso",
            "model": "virtual-camera",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/camera\/0",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "camera-fw-1.0"
            }
        },
        {
            "id": "contoso-camera-serial-00001",
            "name": "rear-camera",
            "group": "cameras",
            "manufacturer": "contoso",
            "model": "virtual-camera",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/camera\/1",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "camera-fw-1.0"
            }
        }
    ]
}
```

The following JSON document is returned from the `SelectComponents` function. It's based on the example implementation of the Contoso component enumerator.

Here's the input parameter for selecting the *motors* component group:

```json
{
    "group" : "motors"
}
```

Here's the output of the parameter. All components belong to the *motors* group.

```json
{
    "components": [
        {
            "id": "contoso-motor-serial-00000",
            "name": "left-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/0",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "motor-fw-1.0"
            }
        },
        {
            "id": "contoso-motor-serial-00001",
            "name": "right-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/1",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "motor-fw-1.0"
            }
        },
        {
            "id": "contoso-motor-serial-00002",
            "name": "vacuum-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/2",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "motor-fw-1.0"
            }
        }
    ]
}
```

Here's the input parameter for selecting a single component named *hostfw*:

```json
{
    "name" : "hostfw"
}
```

Here's the parameter's output for the *hostfw* component:

```json
{
    "components": [
        {
            "id": "hostfw",
            "name": "hostfw",
            "group": "firmware",
            "manufacturer": "contoso",
            "model": "virtual-firmware",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/hostfw",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "host-fw-1.0"
            }
        }
    ]
}
```

> [!NOTE]
> The preceding example demonstrated that, if needed, it's possible to send a newer update to any instance of a component that's selected by `name` property. For example, deploy the `motor-fw-2.0` update to *vacuum-motor* while continuing to use `motor-fw-1.0` on *left-motor* and *right-motor*.

## Inventory file

The example implementation shown earlier for the Contoso Virtual Vacuum component enumerator will read the device-specific components' information from the *component-inventory.json* file. This example implementation is only for demonstration purposes.  

In a production scenario, some properties should be retrieved directly from the actual components. These properties include `id`, `manufacturer`, and `model`.

The device builder defines the `name` and `group` properties. These values should never change after they're defined. The `name` property must be unique within the device.  

### Example component-inventory.json file

> [!NOTE]
> The content in this file looks almost the same as the returned value from the `GetAllComponents` function. However, `ComponentInfo` in this file doesn't contain `version` and `status` properties. The component enumerator will populate these properties at runtime.

For example, for *hostfw*, the value of the property `properties.version` will be populated from the specified (mock) `firmwareDataFile` value (*/usr/local/contoso-devices/vacuum-1/hostfw/firmware.json*).

```json
{
    "components": [
        {
            "id": "hostfw",
            "name": "hostfw",
            "group": "firmware",
            "manufacturer": "contoso",
            "model": "virtual-firmware",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/hostfw",
                "firmwareDataFile": "firmware.json",
            }
        },
        {
            "id": "bootfs",
            "name": "bootfs",
            "group": "boot-image",
            "manufacturer": "contoso",
            "model": "virtual-disk",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/bootfs",
                "firmwareDataFile": "diskimage.json",
            }
        },
        {
            "id": "rootfs",
            "name": "rootfs",
            "group": "os-image",
            "manufacturer": "contoso",
            "model": "virtual-os",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/rootfs",
                "firmwareDataFile": "diskimage.json",
            }
        },
        {
            "id": "contoso-motor-serial-00000",
            "name": "left-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/0",
                "firmwareDataFile": "firmware.json",
            }
        },
        {
            "id": "contoso-motor-serial-00001",
            "name": "right-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/1",
                "firmwareDataFile": "firmware.json",
            }
        },
        {
            "id": "contoso-motor-serial-00002",
            "name": "vacuum-motor",
            "group": "motors",
            "manufacturer": "contoso",
            "model": "virtual-motor",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/motors\/2",
                "firmwareDataFile": "firmware.json",
            }
        },
        {
            "id": "contoso-camera-serial-00000",
            "name": "front-camera",
            "group": "cameras",
            "manufacturer": "contoso",
            "model": "virtual-camera",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/camera\/0",
                "firmwareDataFile": "firmware.json",
            }
        },
        {
            "id": "contoso-camera-serial-00001",
            "name": "rear-camera",
            "group": "cameras",
            "manufacturer": "contoso",
            "model": "virtual-camera",
            "properties": {
                "path": "\/usr\/local\/contoso-devices\/vacuum-1\/camera\/1",
                "firmwareDataFile": "firmware.json",
            }
        }
    ]
}
```

## Next steps

The example in this article used C. To explore C++ example source codes, see:

- [CMakeLists.txt](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/component_enumerators/examples/contoso_component_enumerator/CMakeLists.txt)
- [contoso-component-enumerator.cpp](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/component_enumerators/examples/contoso_component_enumerator/contoso_component_enumerator.cpp)
- [inc/aduc/component_enumerator_extension.hpp](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/inc/aduc/component_enumerator_extension.hpp)

For various sample updates for components connected to the Contoso Virtual Vacuum device, see [Proxy update demo](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/component_enumerators/examples/contoso_component_enumerator/demo/README.md).
