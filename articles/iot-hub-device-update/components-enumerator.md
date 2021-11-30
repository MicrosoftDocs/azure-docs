	---
	title: How to use Components Enumerator for Proxy updates | Microsoft Docs
	description: How to use Components Enumerator for Proxy updates
	author: ValOlson
	ms.author: valls
	ms.date: 11/12/2021
	ms.topic: conceptual
	ms.service: iot-hub-device-update
	---
	
# How to register multiple components with Contoso Virtual Vacuum Component Enumerator example
This sections shows a sample implementation of the Contoso Virtual Vacuum Components Enumerator that you can reference to implement a custom Components Enumerator for your IoT devices. 

## What is Contoso Virtual Vacuum

A Contoso Virtual-Vacuum is a virtual IoT device that we use to demonstrate the **Proxy Update** feature.  

**Proxy Updates** enables updating multiple components on the same IoT device or multiple sensors connected to the IoT device with a single over-the-air deployment. Proxy updates also supports an install order when updating components and a multi-step update process with pre-install, install, post-install capabilities. Use cases where proxy updates is applicable include:

- Targeting specific update files to different partitions on the device.
- Targeting specific update files to different apps/components on the device
- Targeting specific update files to sensors connected to IoT devices over a network protocol (e.g., USB, CANbus etc.)  

The Device Update Agent (running on the host device) can send each update to a specific **component** or to a **group of components** of the same hardware class (i.e. requiring the same software or firmware update).  

## Virtual-Vacuum Components

For this demonstration, the Contoso Virtual Vacuum consists of five 'logical' components:  

- Host Firmware
- Host Boot File System
- Host Root File System
- Three Motors (Left Wheel, Right Wheel, and Vacuum)
- Two Cameras (Front and Rear)

#### Figure 1: Contoso Virtual Vacuum Components Diagram

![Contoso Virtual-Vacuum Components Diagram](../contoso-component-enumerator/assets/contoso-virtual-vacuum-components-diagram.svg)

We use the following directory structure to simulates those components mentioned above.

```sh
/usr/local/contoso-device/vacuum-1/hostfw
/usr/local/contoso-device/vacuum-1/bootfs
/usr/local/contoso-device/vacuum-1/rootfs
/usr/local/contoso-device/vacuum-1/motors/0   /* left motor */
/usr/local/contoso-device/vacuum-1/motors/1   /* right motor */
/usr/local/contoso-device/vacuum-1/motors/2   /* vacuum motor */
/usr/local/contoso-device/vacuum-1/cameras/0  /* front camera */
/usr/local/contoso-device/vacuum-1/cameras/1  /* rear camera */
```

Each component's directory contains a JSON file that stores a mock software version number of each component. These file are `firmware.json` or `diskimage.json`.  

**Note:** For this demo, to update the components' firmware, we will copy a `firmware.json` or `diskimage.json` (update payload) to `targetted components' directory`.

#### Example `firmware.json` file:

```json
{
    "version":"motor-fw-1.0"
}
```

**Note:** The Contoso Virtual-Vacuum doesn't provide any other functionality besides containing software or firmware versions for Proxy Update demonstration purposes.  

## What is a Components Enumerator?

A **Components Enumerator** is a **Device Update Agent Extension** that provides information about every **component** that you need to over-the-air update via a host device's IoT Hub connection.  

The Device Update Agent is device and component agnostic. By itself, Device Update Agent doesn't know anything about components that resides on or are connected to a host device at the time of the update.  

To enable Proxy Updates, device builders must identify all updateable components on the device and assign a unique name to each component. After doing this the Update Content Handler can install and apply the update to the correct component(s).  

#### Figure 2 - Proxy Update Flow Diagram

![Contoso Virtual-Vacuum Update Flow](../contoso-component-enumerator/assets/contoso-virtual-vacuum-update-flow.svg)

- **Device builder reponsobilities**
  - Design and build the device.
  - Integrate Device Update Agent and its dependencies.
  - Implement device-specific **Component Enumerator Extension** and register with DU Agent.
  - The **Components Enumerator** leverage components information from a component inventory or configuration file. Then augment static (DU required) component data with the dynamic data (e.g., firmware version, connection status, hardware id, etc.)
  - Create a Proxy Update containing one or more Child Updates that target one or more components on (or connected to) the device.
  - Sent the update to their Solution Operator
- **Solution Operator**
  - Import the update (and manifest) to the Device Update Service
  - Deploy the update to a group of devices
- **Device Update Agent**
  - Receives update information from Azure IoT Hub (via Device Twin or Module Twin)
  - Invokes **Proxy Update Handler** to process the Proxy Update intended for one or more components on the device
    - For each Child Update (in this example, there're 2 updates, `host-fw-1.1` and `motors-fw-1.1`), **Proxy Update Handler** invokes **Child Update Handler** to enumerate all components that match the **Compatibilites** properties specified in Child Update Manifest file. Next the handler downloads, installs and applies the Child Update to all targetted components.
    - To get the matching components, the Child Update will call a `SelectComponents` API provided by the **Components Enumerator**. <br/>**Note:** If there is no matching components, the Child Update will be skipped.
  - Collects all update results from Proxy and Child Update(s) and reports it to the Azure IoT Hub.
- **Child Update Handler**
  - An extension that implements the Child Update workflow.
  - Iterate through a list of **instances of component** that are compatible with the **Child Update** content.
  - See [Child Update Handler](../../../../content_handlers/components_update_handler/README.md) for more information.
- **SWUpdate Installer** and **Motors Firmware Installer**
  - See [How To Implement Custom Update Content Handler](../../../../../docs/agent-reference/how-to-implement-custom-update-handler.md) for more details.

## How To Implement Components Enumerator for Device Update Agent (C language)
### Requirements
- Implements all APIs declared in [component_enumerator_extension.hpp](../../extension_manager/inc/aduc/../../../../inc/aduc/component_enumerator_extension.hpp)

| Function | Arguments | Returns |
|---|---|---|
|`char* GetAllComponents()`|None|A JSON string contains an array of **all** [ComponentInfo](./README.md#componentinfo)<br/><br/>See [Example Return Values](./README.md#example-return-values) for more info.|
|`char* SelectComponents(char* selector)`|A JSON string containing one or more name-value pair(s) use for selecting update target component(s)| A JSON string contains an array of [ComponentInfo](./README.md#componentinfo)<br/><br/>See [Example Return Values](./README.md#example-return-values) for more info.|
|`void FreeComponentsDataString(char* string)`|A pointer to string buffer previously returned by `GetAllComponents` or `SelectComponents` functions.|None|

### ComponentInfo

The ComponentInfo JSON string must include following requried properties

| Name | Type | Description |
|---|---|---|
|id| string | A component's unique id (device scope)<br/><br/>e.g., hardware's serial number, disk partition id, unique file path of the component, etc.|
|name| string| A component's `logical` name. This is the name that a device builder assigns to a component that is available in every device of the same `device class`.<br/><br/>For example, every Contoso Virtual-Vacuum device contains a motor that drives left wheel. Contoso assigned 'Left Motor' as a common (logical) name for this motore, to easily refer to this component, instead of hardware ID, which can be globally unique.|
|group|string|A group that this component belongs to.<br/><br/>For example, all motors could belong to a 'motors' group.|
|manufacturer|string|For physical hardware component, this is a manufacturer or vendor name.<br/><br/>For logical component, such as, disk partition or directory, this can be any device Builder's Defined value.|
|model|string|For physical hardware component, this is a model name.<br/><br/>For logical component, such as, disk partition or directory, this can be any device builder's Defined value.|
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
        "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/0",
        "firmwareDataFile": "firmware.json",
        "status": "connected",
        "version" : "motor-fw-1.0"
    }
}
```

### Example Return Values

Following is a JSON document returned from `GetAllComponents` function *(Based on example Contoso Component Enuemrator implementation)*

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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/hostfw",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/bootfs",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/rootfs",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/0",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/1",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/2",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/camera\/0",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/camera\/1",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "camera-fw-1.0"
            }
        }
    ]
}
```

Following is a JSON document returned from `SelectComponents` function *(Based on example Contoso Component Enuemrator implementation)*

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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/0",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/1",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/2",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/hostfw",
                "firmwareDataFile": "firmware.json",
                "status": "ok",
                "version" : "host-fw-1.0"
            }
        }
    ]
}
```

**Note:** The above example demonstrated that, if needed, it's possible to send a newer update to any instance of a component when selected by `name` property.  
For example, deploy `motor-fw-2.0` update to `vacuum-motor` while continue using `motor-fw-1.0` on `left-motor` and `right-motor`.

## component-inventory.json

The example implementation shown above for Contoso Components Enumerator will read the device-specific components' information from the `component-inventory.json` file. Please note that this is only for demonstration purposes.  

**In the production scenario**, some properties, such as `id`, `manufacturer`, `model`, should be retrived directly from the actual components.  

`name` and `group` properties are usually defined by the device builder. These values should never change, once defined. The `name` property must be unique within the device.  

#### Example component-inventory.json file

Note that the content in this file looks almost the same as the returned value from `GetAllComponents` function. However, `ComponentInfo` in this file doesn't contain `version` and `status` properties. These properties will be populated at runtime, by the Component Enumerator.

For example, for `hostfw`, the value of property `properties.version` will be populate with value from the specified (mock) `firmwareDataFile` (`/usr/local/contoso-device/vacuum-1/hostfw/firmware.json`)

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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/hostfw",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/bootfs",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/rootfs",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/0",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/1",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/motors\/2",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/camera\/0",
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
                "path": "\/usr\/local\/contoso-device\/vacuum-1\/camera\/1",
                "firmwareDataFile": "firmware.json",
            }
        }
    ]
}
```

### Example Source Codes

This example is written in `C++`. You can choose to use `C` if desired.

- [CMakeLists.txt](../contoso-component-enumerator/CMakeLists.txt)
- [contoso-component-enumerator.cpp](../contoso-component-enumerator/contoso-component-enumerator.cpp)
- [inc/aduc/component_enumerator_extension.hpp](../../inc/aduc/../../../inc/aduc/component_enumerator_extension.hpp)

