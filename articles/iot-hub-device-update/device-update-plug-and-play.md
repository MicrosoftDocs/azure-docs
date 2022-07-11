---
title: Understand how Device Update for IoT Hub uses IoT Plug and Play | Microsoft Docs
description: Device Update for IoT Hub uses to discover and manage devices that are over-the-air update capable.
author: ValOlson
ms.author: valls
ms.date: 1/26/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub and IoT Plug and Play

Device Update for IoT Hub uses [IoT Plug and Play](../iot-develop/index.yml) to discover and manage devices that are over-the-air update capable. The Device Update service sends and receives properties and messages to and from devices using IoT Plug and Play interfaces. Device Update for IoT Hub requires IoT devices to implement the following interfaces and model id.

Concepts:
* Understand the [IoT Plug and Play device client](../iot-develop/concepts-developer-guide-device.md?pivots=programming-language-csharp).
* See how the [Device Update agent is implemented](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md).

## Device Update Core Interface

The 'DeviceUpdateCore' interface is used to send update actions and metadata to devices and receive update status from devices. The 'DeviceUpdateCore' interface is split into two Object properties.

The expected component name in your model is **"deviceUpdate"** when this interface is implemented. [Learn more about Azure IoT Plug and Play Components](../iot-develop/concepts-modeling-guide.md)

### Agent Metadata

The Device Update agent uses Agent Metadata fields to send
information to Device Update services.

|Name|Schema|Direction|Description|Example|
|----|------|---------|-----------|-----------|
|deviceProperties|Map|device to cloud|The set of properties that contain the manufacturer, model, and other device information.|See other examples for details|
|compatPropertyNames|String (Comma separated)|device to cloud|The device reported properties that are used to check for compatibility of the device to target the update deployment. Limited to five device properties|"compatPropertyNames": "manufacturer,model"|
|lastInstallResult|Map|device to cloud|The result reported by the agent. It contains result code, extended result code, and result details for main update and other step updates||
|resultCode|integer|device to cloud|A code that contains information about the result of the last update action. Can be populated for either success or failure.|700|
|extendedResultCode|integer|device to cloud|A code that contains additional information about the result. Can be populated for either success or failure.|0x80004005|
|resultDetails|string|device to cloud|Customer-defined free form string to provide additional result details. Returned to the twin without parsing||
|stepResults|map|device to cloud|The result reported by the agent containing result code, extended result code, and result details for step updates |                            "step_1": { "resultCode": 0,"extendedResultCode": 0, "resultDetails": ""}|
|state|integer|device to cloud|It is an integer that indicates the current state of the Device Update agent. See State section for details |0|
|workflow|complex|device to cloud|It is a set of values that indicates which deployment the agent is currently working on, ID of current deployment, and acknowledgment of any retry request sent from service to agent.|"workflow": {"action": 3,"ID": "11b6a7c3-6956-4b33-b5a9-87fdd79d2f01","retryTimestamp": "2022-01-26T11:33:29.9680598Z"}|
|installedUpdateId|string|device to cloud|An ID of the update that is currently installed (through Device Update). This value will be a string capturing the Update ID JSON or null for a device that has never taken an update through Device Update.|installedUpdateID{\"provider\":\"contoso\",\"name\":\"image-update\",\"version\":\"1.0.0\"}"|


#### State

It is the status reported by the Device Update (DU) agent after receiving an action from the Device Update service. `State` is reported in response to an `Action` (see `Actions` section) sent to the Device Update agent from the Device Update service. See the [overview workflow](understand-device-update.md#device-update-agent) for requests that flow between the Device Update service and the Device Update agent.

|Name|Value|Description|
|---------|-----|-----------|
|Idle|0|The device is ready to receive an action from the Device Update service. After a successful update, state is returned to the `Idle` state.|
|DeploymentInprogress|6| A deployment in progress|
|Failed|255|A failure occurred during updating.|
|DownloadSucceeded|2|A successful download. This status is only reported by devices with agent version 0.7.0 or older.|
|InstallSucceeded|4|A successful install. This status is only reported by devices with agent version 0.7.0 or older.|

#### Device Properties

It is the set of properties that contain the manufacturer and model.

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|manufacturer|string|device to cloud|The device manufacturer of the device, reported through `deviceProperties`. This property is read from one of two places - the 'DeviceUpdateCore' interface will first attempt to read the 'aduc_manufacturer' value from the [Configuration file](device-update-configuration-file.md) file. If the value is not populated in the configuration file, it will default to reporting the compile-time definition for ADUC_DEVICEPROPERTIES_MANUFACTURER. This property will only be reported at boot time. Default value 'Contoso'|
|model|string|device to cloud|The device model of the device, reported through `deviceProperties`. This property is read from one of two  - the DeviceUpdateCore interface will first attempt to read the 'aduc_model' value from the [Configuration file](device-update-configuration-file.md) file.  If  the value is not populated in the configuration file, it will default to reporting the compile-time definition for ADUC_DEVICEPROPERTIES_MODEL. This property will only be reported at boot time. Default value 'Video'|
|interfaceId|string|device to cloud|This property is used by the service to identify the interface version being used by the Device Update agent. It is required by Device Update service to manage and communicate with the agent. This property is set at 'dtmi:azure:iot:deviceUpdateModel;1' for device using DU agent version 0.8.0.|
|aduVer|string|device to cloud|Version of the Device Update agent running on the device. This value is read from the build only if during compile time ENABLE_ADU_TELEMETRY_REPORTING is set to 1 (true). Customers can choose to opt-out of version reporting by setting the value to 0 (false). [How to customize Device Update agent properties](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md).|
|doVer|string|device to cloud|Version of the Delivery Optimization agent running on the device. The value is read from the build only if during compile time ENABLE_ADU_TELEMETRY_REPORTING is set to 1 (true). Customers can choose to opt-out of the version reporting by setting the value to 0 (false).[How to customize Delivery Optimization agent properties](https://github.com/microsoft/do-client/blob/main/README.md#building-do-client-components).|
|Custom compatibility Properties|User Defined|device to cloud|Implementer can define other device properties to be used for the compatibility check while targeting the update deployment|


IoT Hub Device Twin sample
```json
"deviceUpdate": {
                "__t": "c",
                "agent": {
                    "deviceProperties": {
                        "manufacturer": "contoso",
                        "model": "virtual-vacuum-v1",
                        "interfaceId": "dtmi:azure:iot:deviceUpdateModel;1",
                        "aduVer": "DU;agent/0.8.0-rc1-public-preview",
                        "doVer": "DU;lib/v0.6.0+20211001.174458.c8c4051,DU;agent/v0.6.0+20211001.174418.c8c4051"
                    },
                    "compatPropertyNames": "manufacturer,model",
                    "lastInstallResult": {
                        "resultCode": 700,
                        "extendedResultCode": 0,
                        "resultDetails": "",
                        "stepResults": {
                            "step_0": {
                                "resultCode": 700,
                                "extendedResultCode": 0,
                                "resultDetails": ""
                            }
                        }
                    },
                    "state": 0,
                    "workflow": {
                        "action": 3,
                        "id": "11b6a7c3-6956-4b33-b5a9-87fdd79d2f01",
                        "retryTimestamp": "2022-01-26T11:33:29.9680598Z"
                    },
                    "installedUpdateId": "{\"provider\":\"Contoso\",\"name\":\"Virtual-Vacuum\",\"version\":\"5.0\"}"
                },
```

>[!NOTE]
>The device or module must add the `{"__t": "c"}` marker to indicate that the element refers to a component, learn more [here](../iot-develop/concepts-convention.md#sample-multiple-components-writable-property).

### Service Metadata

Service Metadata contains fields that the Device Update services uses to communicate actions and data to the Device Update agent.

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|action|integer|cloud to device|It is an integer that corresponds to an action the agent should perform. Values listed in the Action section.|
|updateManifest|string|cloud to device|Used to describe the content of an update. Generated from the [Import Manifest](create-update.md)|
|updateManifestSignature|JSON Object|cloud to device|A JSON Web Signature (JWS) with JSON Web Keys used for source verification.|
|fileUrls|Map|cloud to device|Map of `FileID` to `DownloadUrl`. Tells the agent, which files to download and the hash to use to verify that the files were downloaded correctly.|

#### Action

`Actions` in this section represents the actions taken by the Device Update agent as instructed by the Device Update service. The Device Update agent will report a `State` (see `State` section) processing the `Action` received. See the [overview workflow](understand-device-update.md#device-update-agent) for requests that flow between the Device Update service and the Device Update agent.

|Name|Value|Description|
|---------|-----|-----------|
|ApplyDeployment|3|Apply the update. It signals to the device to apply the deployed update|
|Cancel|255|Stop processing the current action and go back to `Idle`. It is also be used to tell the agent in the `Failed` state to go back to `Idle`.|
|Download|0|Download published content or update and any other content needed. This action is only sent to devices with agent version 0.7.0 or older.|
|Install|1|Install the content or update. Typically this action means to call the installer for the content or update. This action is only sent to devices with agent version 0.7.0 or older.|
|Apply|2|Finalize the update. It signals the system to reboot if necessary. This action is only sent to devices with agent version 0.7.0 or older.|

## Device Information Interface

The Device Information interface is a concept used within [IoT Plug and Play architecture](../iot-develop/overview-iot-plug-and-play.md). It contains device to cloud properties that provide information about the hardware and operating system of the device. Device Update for IoT Hub uses the DeviceInformation.manufacturer and DeviceInformation.model properties for telemetry and diagnostics. To learn more about Device Information interface, see this [example](https://devicemodels.azure.com/dtmi/azure/devicemanagement/deviceinformation-1.json).

The expected component name in your model is **deviceInformation** when this interface is implemented. [Learn about Azure IoT Plug and Play Components](../iot-develop/concepts-modeling-guide.md)

|Name|Type|Schema|Direction|Description|Example|
|----|----|------|---------|-----------|-----------|
|manufacturer|Property|string|device to cloud|Company name of the device manufacturer. This property could be the same as the name of the original equipment manufacturer (OEM).|Contoso|
|model|Property|string|device to cloud|Device model name or ID.|IoT Edge Device|
|swVersion|Property|string|device to cloud|Version of the software on your device. swVersion could be the version of your firmware.|4.15.0-122|
|osName|Property|string|device to cloud|Name of the operating system on the device.|Ubuntu Server 18.04|
|processorArchitecture|Property|string|device to cloud|Architecture of the processor on the device.|ARM64|
|processorManufacturer|Property|string|device to cloud|Name of the manufacturer of the processor on the device.|Microsoft|
|totalStorage|Property|string|device to cloud|Total available storage on the device in kilobytes.|2048|
|totalMemory|Property|string|device to cloud|Total available memory on the device in kilobytes.|256|

## Model ID

Model ID is how smart devices advertise their capabilities to Azure IoT applications with IoT Plug and Play.To learn more on how to build smart devices to advertise their capabilities to Azure IoT applications visit [IoT Plug and Play device developer guide](../iot-develop/concepts-developer-guide-device.md).

Device Update for IoT Hub requires the IoT Plug and Play smart device to announce a model ID with a value of **"dtmi:azure:iot:deviceUpdateModel;1"** as part of the device connection. [Learn how to announce a model ID](../iot-develop/concepts-developer-guide-device.md#model-id-announcement).
