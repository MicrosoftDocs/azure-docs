---
title: Azure Device Update for IoT Hub and IoT Plug and Play
description: Understand how Azure Device Update for IoT Hub uses IoT Plug and Play interfaces to discover and manage devices that are over-the-air update capable.
author: eshashah-msft
ms.author: eshashah
ms.date: 01/21/2025
ms.topic: concept-article
ms.service: azure-iot-hub
ms.subservice: device-update
---

# IoT Plug and Play in Azure Device Update for IoT Hub

Device Update for IoT Hub uses [IoT Plug and Play](../iot/overview-iot-plug-and-play.md) to discover and manage devices that are over-the-air update capable. This article describes how the Device Update service sends and receives properties and messages to and from devices by using IoT Plug and Play interfaces.

For more information, see the [IoT Plug and Play device developer guide](../iot/concepts-developer-guide-device.md) and [How To Build the Device Update Agent](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md).

## Device Update models

Smart devices use IoT Plug and Play model IDs to advertise their capabilities to Azure IoT applications. Device Update requires the IoT Plug and Play smart device to announce a model ID as part of the device connection. For more information, see [Model ID announcement](../iot/concepts-developer-guide-device.md#model-id-announcement).

Device Update has several defined IoT Plug and Play models that support Device Update features. The Device Update model `**dtmi:azure:iot:deviceUpdateContractModel;3**` supports core Device Update functionality and uses the Device Update core interface to send update actions and metadata to devices and receive update status from devices.

The other supported model is `**dtmi:azure:iot:deviceUpdateModel;3**`, which extends `**deviceUpdateContractModel;3**` and also uses IoT Plug and Play interfaces that send device property information and enable diagnostic features. For these and other versions, see [Azure IoT Plug and Play Device Update Models](https://github.com/Azure/iot-plugandplay-models/tree/main/dtmi/azure/iot).

The Device Update agent uses `**dtmi:azure:iot:deviceUpdateModel;3**` which supports all the latest features in the [Device Update 1.1.0 release](https://github.com/Azure/iot-hub-device-update/releases/). This model supports [import manifest version 5.0](import-concepts.md). Older manifests work with the latest agents, but new features require the latest manifest version.

### Agent metadata

The Device Update agent uses the following agent metadata fields to send information to Device Update services.

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|deviceProperties|Map|device to cloud|The set of properties that contain the manufacturer, model, and other device information. See [Device properties](#device-properties) for details. |
|compatPropertyNames|String (comma separated)|device to cloud|Up to five properties that are used to check for device compatibility to target the update deployment. <br>Example: "compatPropertyNames": "manufacturer,model"|
|lastInstallResult|Map|device to cloud|The result reported by the agent, containing result code, extended result code, and result details for main update and other step updates.|
|resultCode|integer|device to cloud|A code that contains information about the result of the last update action. Can be populated for either success or failure. <br>Example: 700|
|extendedResultCode|integer|device to cloud|A code that contains more information about the result. Can be populated for either success or failure. <br>Example: 0x80004005|
|resultDetails|string|device to cloud|A user-provided freeform string to provide more result details. Returned to the twin without parsing.|
|stepResults|map|device to cloud|The result reported by the agent, containing result code, extended result code, and result details for step updates. <br>Example: "step_1": { "resultCode": 0,"extendedResultCode": 0, "resultDetails": ""}|
|state|integer|device to cloud| An integer that indicates the current state of the Device Update agent. See [State](#state) for details. |
|workflow|complex|device to cloud| A set of values that indicate the deployment the agent is currently working on, the ID of the currently installed deployment, and acknowledgment of any retry request sent from service to agent. The `workflow` ID reports a `"nodeployment"` value once a deployment is canceled. <br>Example: "workflow": {"action": 3,"ID": "11b6a7c3-6956-4b33-b5a9-87fdd79d2f01","retryTimestamp": "2022-01-26T11:33:29.9680598Z"}|
|installedUpdateId|string|device to cloud|An ID of the currently installed Device Update deployment. This value captures the update ID JSON, or `null` for a device that never had an update through Device Update. <br>Example: "installedUpdateID": "{\\"provider\\":\\"contoso\\",\\"name\\":\\"image-update\\",\\"version\\":\\"1.0.0\\"}"|

IoT Hub device twin example:

```json
"deviceUpdate": {
                "__t": "c",
                "agent": {
                    "deviceProperties": {
                        "manufacturer": "contoso",
                        "model": "virtual-vacuum-v1",
                        "contractModelId": "dtmi:azure:iot:deviceUpdateContractModel;3",
                        "aduVer": "DU;agent/1.1.0",
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
>The device or module must add the `{"__t": "c"}` marker to indicate that the element refers to a component. For more information, see [IoT Plug and Play conventions](../iot/concepts-convention.md#sample-multiple-components-writable-property).

#### Device properties

The **deviceProperties** field contains the manufacturer and model information for a device.

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|manufacturer|string|device to cloud|The device manufacturer of the device, reported through `deviceProperties`.<br>The `DeviceUpdateCore` interface first attempts to read the `aduc_manufacturer` value from the [configuration file](device-update-configuration-file.md). If the value isn't populated in the configuration file, the interface defaults to reporting the compile-time definition for `ADUC_DEVICEPROPERTIES_MANUFACTURER`. This property is reported only at boot time. <br> Default value: 'Contoso'|
|model|string|device to cloud|The device model of the device, reported through `deviceProperties`. The `DeviceUpdateCore` interface first attempts to read the `aduc_model` value from the [configuration file](device-update-configuration-file.md). If the value isn't populated in the configuration file, the interface defaults to reporting the compile-time definition for `ADUC_DEVICEPROPERTIES_MODEL`. This property is reported only at boot time. <br> Default value: 'Video'|
|contractModelId|string|device to cloud|Property the service uses to identify the base model version the Device Update agent is using to manage and communicate with the agent.<br>Value: `dtmi:azure:iot:deviceUpdateContractModel;3` for devices using Device Update agent version 1.1.0. <br>**Note:** Agents using `dtmi:azure:iot:deviceUpdateModel;2` must report the `contractModelId` as `dtmi:azure:iot:deviceUpdateContractModel;3`, because `deviceUpdateModel;3` is extended from `deviceUpdateContractModel;3`.|
|aduVer|string|device to cloud|Version of the Device Update agent running on the device. This value is read from the build only if `ENABLE_ADU_TELEMETRY_REPORTING` is set to `1` (true) during compile time. You can choose to opt out of version reporting by setting the value to `0` (false). For more information, see [How To Build the Device Update Agent](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md).|
|doVer|string|device to cloud|Version of the Delivery Optimization agent running on the device. The value is read from the build only if `ENABLE_ADU_TELEMETRY_REPORTING` is set to `1` (true) during compile time. You can choose to opt out of version reporting by setting the value to `0` (false). For more information, see [How to customize Delivery Optimization agent properties](https://github.com/microsoft/do-client/blob/main/README.md#building-do-client-components).|
|Custom compatibility properties|User-defined|device to cloud|Other user-defined device properties to use for the compatibility check when targeting the update deployment.|

#### State

The **state** field is the status reported by the Device Update agent in response to an [Action](#action) sent to the Device Update agent from the Device Update service. For more information about requests that flow between the Device Update service and the Device Update agent, see the [Agent workflow](understand-device-update.md#device-update-agent).

|Name|Value|Description|
|---------|-----|-----------|
|Idle|0|The device is ready to receive an action from the Device Update service. After a successful update, state returns to the `Idle` state.|
|DeploymentInprogress|6| A deployment is in progress.|
|Failed|255|A failure occurred during updating.|
|DownloadSucceeded|2|A successful download occurred. Only devices with agent version 0.7.0 or older report this status.|
|InstallSucceeded|4|A successful install occurred. Only devices with agent version 0.7.0 or older report this status.|

#### Action

The **action** field represents the action the Device Update agent should take as instructed by the Device Update service. The Device Update agent reports a [state](#state) for processing the action it receives. For more information about requests that flow between the Device Update service and the Device Update agent, see the [Agent workflow](understand-device-update.md#device-update-agent).

|Name|Value|Description|
|---------|-----|-----------|
|applyDeployment|3|Apply the deployed update.|
|cancel|255|Stop processing the current action and go back to `Idle`, or tell an agent in the `Failed` state to go back to `Idle`.|
|download|0|Download published content or update, and any other content needed. This action is sent only to devices with agent version 0.7.0 or older.|
|install|1|Install the content or update, typically to call the installer for the content or update. Device Update sends this action only to devices with agent version 0.7.0 or older.|
|apply|2|Finalize the update by rebooting if necessary. Device Update sends this action only to devices with agent version 0.7.0 or older.|

### Service metadata

Service metadata contains fields that the Device Update service uses to communicate actions and data to the Device Update agent.

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|action|integer|cloud to device| An integer that corresponds to an action the agent should perform. See [Action](#action) for details. |
|updateManifest|string|cloud to device|Describes the content of an update. Generated from the [Import manifest](create-update.md).|
|updateManifestSignature|JSON Object|cloud to device|A JSON Web Signature (JWS) with JSON web keys to use for source verification.|
|fileUrls|Map|cloud to device|Map of `FileID` to `DownloadUrl`. Tells the agent which files to download and the hash to use to verify that the files downloaded correctly.|

## Device information interface

The device information interface is a concept used within [IoT Plug and Play architecture](../iot/overview-iot-plug-and-play.md). The interface contains device-to-cloud properties that provide information about the device hardware and operating system. Device Update uses the `DeviceInformation.manufacturer` and `DeviceInformation.model` properties for telemetry and diagnostics. For an example of the device information interface, see [https://devicemodels.azure.com/dtmi/azure/devicemanagement/deviceinformation-1.json](https://devicemodels.azure.com/dtmi/azure/devicemanagement/deviceinformation-1.json).

When you implement this interface, the expected component name in your model is **deviceInformation**. For more information, see the [IoT Plug and Play modeling guide](../iot/concepts-modeling-guide.md).

|Name|Type|Schema|Direction|Description|Example|
|----|----|------|---------|-----------|-----------|
|manufacturer|Property|string|device to cloud|Company name of the device manufacturer. Manufacturer could be the same as the name of the original equipment manufacturer (OEM).|Contoso|
|model|Property|string|device to cloud|Device model name or ID.|IoT Edge Device|
|swVersion|Property|string|device to cloud|Version of the software on your device. swVersion could be the version of your firmware.|4.15.0-122|
|osName|Property|string|device to cloud|Name of the operating system on the device.|Ubuntu Server 18.04|
|processorArchitecture|Property|string|device to cloud|Architecture of the processor on the device.|ARM64|
|processorManufacturer|Property|string|device to cloud|Name of the manufacturer of the processor on the device.|Microsoft|
|totalStorage|Property|string|device to cloud|Total available storage on the device in kilobytes.|2048|
|totalMemory|Property|string|device to cloud|Total available memory on the device in kilobytes.|256|

## Related content

* [Device Update configuration file](device-update-configuration-file.md)
* [Device Update for IoT Hub agent overview](device-update-agent-overview.md)
