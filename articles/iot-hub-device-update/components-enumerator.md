---
title: How to use Components Enumerator for Proxy Updates for Device Updates for Azure IoT Hub | Microsoft Docs
description: How to use Components Enumerator for Proxy Updates
author: valls
ms.author: valls
ms.date: 12/3/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# How to register components with Device Update: Contoso Virtual Vacuum Component Enumerator example
In the below section, we cover a sample implementation of the Contoso Virtual Vacuum Components Enumerator that you can reference to implement a custom Components Enumerator for your IoT devices. A component is a sub-device-level identity that has a composition relationship with the host device.

## What is Contoso Virtual Vacuum

A Contoso Virtual-Vacuum is a virtual IoT device that we use to demonstrate the **Proxy Update** feature.  

**Proxy Update** enables updating multiple components on the same IoT device or multiple sensors connected to the IoT device with a single over-the-air deployment. Proxy updates supports (1) an install order when updating components and (2) multi-step updating with pre-install, install, post-install capabilities. Use cases where Proxy Updates are applicable include:

- Targeting specific update files to different partitions on the device.
- Targeting specific update files to different apps/components on the device
- Targeting specific update files to sensors connected to IoT devices over a network protocol (for example, USB, CANbus and so on)  

The Device Update Agent (running on the host device) can send each update to a specific **component** or to a **group of components** of the same hardware class (that is, requiring the same software or firmware update).  

## Virtual-Vacuum Components

For this demonstration, the Contoso Virtual Vacuum consists of five 'logical' components:  

- Host Firmware
- Host Boot File System
- Host Root File System
- Three Motors (Left Wheel, Right Wheel, and Vacuum)
- Two Cameras (Front and Rear)

**Figure 1** - Contoso Virtual Vacuum Components Diagram

:::image type="content" source="media/understand-device-update/contoso-virtual-vacuum-components-diagram.svg" alt-text="Component Enumerator" lightbox="media/understand-device-update/contoso-virtual-vacuum-components-diagram.svg":::

We use the following directory structure to simulate the components mentioned above.

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

Each component's directory contains a JSON file that stores a mock software version number of each component. For example, `firmware.json` or `diskimage.json`.  

> [!NOTE] 
> For this demo, to update the components' firmware, we will copy a `firmware.json` or `diskimage.json` (update payload) to `targetted components' directory`.

Example `firmware.json` file:

```json
{
    "version": "0.5",
    "description": "This component is generated for testing purposes."
}
```

> [!NOTE]
> The Contoso Virtual-Vacuum doesn't provide any other functionality besides containing software or firmware versions for Proxy Update demonstration purposes.  

## What is a Component Enumerator?

A **Component Enumerator** is a **Device Update Agent Extension** that provides information about every **component** that you need to over-the-air update via a host device's IoT Hub connection.  

The Device Update Agent is device and component agnostic. By itself, Device Update Agent doesn't know anything about components on (or connected to) a host device at the time of the update.  

To enable Proxy Updates, device builders must identify all updateable components on the device and assign a unique name to each component. Also, group name can be assigned to components of the same hardware class, so that, the same update can be installed onto all components in the same group.  

After doing the above, the Update Content Handler can install and apply the update to the correct component(s).  

**Figure 2** - Proxy Update Flow Diagram

:::image type="content" source="media/understand-device-update/contoso-virtual-vacuum-update-flow.svg" alt-text="Proxy Update Flow Diagram" lightbox="media/understand-device-update/contoso-virtual-vacuum-update-flow.svg":::

- **Device builder responsibilities**
  - Design and build the device.
  - Integrate Device Update Agent and its dependencies.
  - Implement device-specific **Component Enumerator Extension** and register with DU Agent.
  - The **Component Enumerator** uses the components information from a component inventory or configuration file. Then augment static (Device Update required) component data with the dynamic data (for example, firmware version, connection status, hardware identity, etc.)
  - Create a Proxy Update containing one or more Child Updates that target one or more components on (or connected to) the device.
  - Sent the update to their Solution Operator
- **Solution Operator**
  - Import the update (and manifest) to the Device Update Service
  - Deploy the update to a group of devices
- **Device Update Agent**
  - Receives update information from Azure IoT Hub (via Device Twin or Module Twin)
  - Invokes **Steps Handler** to process the Proxy Update intended for one or more components on the device
    - For each Child Update (in this example, there are two updates, `host-fw-1.1` and `motors-fw-1.1`), Parent **Steps Handler** invokes Child **Steps Handler** to enumerate all components that match the **Compatibilities** properties specified in Child Update Manifest file. Next the handler downloads, installs and applies the Child Update to all targeted components.
    - To get the matching components, the Child Update will call a `SelectComponents` API provided by the **Component Enumerator**. <br/> If there are no matching components, the Child Update will be skipped.
  - Collects all update results from Parent and Child Update(s) and reports it to the Azure IoT Hub.
- Child **Steps Handler**
  - Iterate through a list of **instances of component** that are compatible with the **Child Update** content.
  - For more information, see [Steps Handler](https://github.com/Azure/iot-hub-device-update/tree/main/src/content_handlers/steps_handler).
- In production, device builders can use [existing handlers](https://github.com/Azure/iot-hub-device-update/tree/main/src/content_handlers) or implement a custom handler that invokes any installer needed for an over-the-air update. See [How To Implement Custom Update Content Handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/how-to-implement-custom-update-handler.md) for more details.

## How To Implement Component Enumerator for Device Update Agent (C language)

### Requirements

- Implements all APIs declared in [component_enumerator_extension.hpp](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/inc/aduc/component_enumerator_extension.hpp)

| Function | Arguments | Returns |
|---|---|---|
|`char* GetAllComponents()`|None|A JSON string contains an array of **all** ComponentInfo. See Example Return Values below for more details.|
|`char* SelectComponents(char* selector)`|A JSON string containing one or more name-value pair(s) use for selecting update target component(s)| A JSON string contains an array of ComponentInfo. See Example Return Values below for more details.|
|`void FreeComponentsDataString(char* string)`|A pointer to string buffer previously returned by `GetAllComponents` or `SelectComponents` functions.|None|

### ComponentInfo

The ComponentInfo JSON string must include following required properties

| Name | Type | Description |
|---|---|---|
|id| string | A component's unique identity (device scope)<br/><br/>for example, hardware's serial number, disk partition id, unique file path of the component, etc.|
|name| string| A component's `logical` name. This is the name that a device builder assigns to a component that is available in every device of the same `device class`.<br/><br/>For example, every Contoso Virtual-Vacuum device contains a motor that drives left wheel. Contoso assigned 'Left Motor' as a common (logical) name for this motor, to easily refer to this component, instead of hardware ID, which can be globally unique.|
|group|string|A group that this component belongs to.<br/><br/>For example, all motors could belong to a 'motors' group.|
|manufacturer|string|For physical hardware component, it is a manufacturer or vendor name.<br/><br/>For logical component, such as, disk partition or directory, it can be any device Builder's Defined value.|
|model|string|For physical hardware component, it is a model name.<br/><br/>For logical component, such as, disk partition or directory, this can be any device builder's Defined value.|
|properties|object| A JSON object contain any optional device-specific properties.|

#### Example ComponentInfo

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

### Example Return Values

Following is a JSON document returned from `GetAllComponents` function *(Based on example Contoso Component Enumerator implementation)*

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

Following is a JSON document returned from `SelectComponents` function *(Based on example Contoso Component Enumerator implementation)*

Input parameter (select **motors** component group):

```json
{
    "group" : "motors"
}
```

Output (all components belong to **motors** group):

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

Input parameter (select a single component named **hostfw**):

```json
{
    "name" : "hostfw"
}
```

Output (**hostfw** component):

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
> The above example demonstrated that, if needed, it's possible to send a newer update to any instance of a component when selected by `name` property.  
For example, deploy `motor-fw-2.0` update to `vacuum-motor` while continue using `motor-fw-1.0` on `left-motor` and `right-motor`.

## component-inventory.json

The example implementation shown above for Contoso Component Enumerator will read the device-specific components' information from the `component-inventory.json` file. Note that example implementation is only for demonstration purposes.  

**In the production scenario**, some properties, such as `id`, `manufacturer`, `model`, should be retrieved directly from the actual components.  

`name` and `group` properties are defined by the device builder. These values should never change, once defined. The `name` property must be unique within the device.  

#### Example component-inventory.json file

> [!NOTE]
> The content in this file looks almost the same as the returned value from `GetAllComponents` function. However, `ComponentInfo` in this file doesn't contain `version` and `status` properties. These properties will be populated at runtime, by the Component Enumerator.

For example, for `hostfw`, the value of property `properties.version` will be populate with value from the specified (mock) `firmwareDataFile` (`/usr/local/contoso-devices/vacuum-1/hostfw/firmware.json`)

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

### Example Source Codes

This example is written in `C++`. You can choose to use `C` if wanted.

- [CMakeLists.txt](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/contoso-component-enumerator/CMakeLists.txt)
- [contoso-component-enumerator.cpp](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/contoso-component-enumerator/contoso-component-enumerator.cpp)
- [inc/aduc/component_enumerator_extension.hpp](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/inc/aduc/component_enumerator_extension.hpp)

### Example Proxy Update

See [Proxy Update Demo](https://github.com/Azure/iot-hub-device-update/tree/main/src/extensions/component-enumerators/examples/contoso-component-enumerator/demo/README.md) for various sample updates for components connected to the Contoso Virtual Vacuum device.
