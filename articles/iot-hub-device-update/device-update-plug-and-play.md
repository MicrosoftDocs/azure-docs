---
title: Understand how Device Update for IoT Hub uses IoT Plug and Play | Microsoft Docs
description: Device Update for IoT Hub uses to discover and manage devices that are over-the-air update capable.
author: ValOlson
ms.author: valls
ms.date: 2/14/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub and IoT Plug and Play

Device Update for IoT Hub uses [IoT Plug and Play](../iot-pnp/index.yml) to discover and manage devices that are over-the-air update capable. The Device Update service will send and receive properties and messages to and from devices using PnP interfaces. Device Update for IoT Hub requires IoT devices to implement the following interfaces and model-id as described below.

## ADU Core Interface

The 'ADUCoreInterface' interface is used to send update actions and metadata to devices and receive update status from devices. The 'ADU Core' interface is split into two Object properties.

The expected component name in your model is **"azureDeviceUpdateAgent"** when implementing this interface. [Learn more about Azure IoT PnP Components](../iot-pnp/concepts-components.md)

### Agent Metadata

Agent Metadata contains fields that the device or Device Update agent uses to send
information and status to Device Update services.

|Name|Schema|Direction|Description|Example|
|----|------|---------|-----------|-----------|
|resultCode|integer|device to cloud|A code that contains information about the result of the last update action. Can be populated for either success or failure and should follow [http status code specification](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).|500|
|extendedResultCode|integer|device to cloud|A code that contains additional information about the result. Can be populated for either success or failure.|0x80004005|
|state|integer|device to cloud|It is an integer that indicates the current state of the Device Update Agent. See below for details |Idle|
|installedUpdateId|string|device to cloud|An ID of the update that is currently installed (through Device Update). This value will be null for a device that has never taken an update through Device Update.|Null|
|`deviceProperties`|Map|device to cloud|The set of properties that contain the manufacturer and model.|See below for details

#### State

It is the status reported by the Device Update Agent after receiving an action from the Device Update Service. `State` is reported in response to an `Action` (see `Actions` below) sent to the Device Update Agent from the Device Update Service. See the [overview workflow](understand-device-update.md#device-update-agent) for requests that flow between the Device Update Service and the Device Update Agent.

|Name|Value|Description|
|---------|-----|-----------|
|Idle|0|The device is ready to receive an action from the Device Update Service. After a successful update, state is returned to the `Idle` state.|
|DownloadSucceeded|2|A successful download.|
|InstallSucceeded|4|A successful install.|
|Failed|255|A failure occurred during updating.|

#### Device Properties

It is the set of properties that contain the manufacturer and model.

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|manufacturer|string|device to cloud|The device manufacturer of the device, reported through `deviceProperties`. This property is read from one of two places-the 'AzureDeviceUpdateCore' interface will first attempt to read the 'aduc_manufacturer' value from the [Configuration file](device-update-configuration-file.md) file.  If the value is not populated in the configuration file, it will default to reporting the compile-time definition for ADUC_DEVICEPROPERTIES_MANUFACTURER. This property will only be reported at boot time.|
|model|string|device to cloud|The device model of the device, reported through `deviceProperties`. This property is read from one of two places-the AzureDeviceUpdateCore interface will first attempt to read the 'aduc_model' value from the [Configuration file](device-update-configuration-file.md) file.  If  the value is not populated in the configuration file, it will default to reporting the compile-time definition for ADUC_DEVICEPROPERTIES_MODEL. This property will only be reported at boot time.|
|aduVer|string|device to cloud|Version of the Device Update agent running on the device. This value is read from the build only if during compile time ENABLE_ADU_TELEMETRY_REPORTING is set to 1 (true). Customers can choose to opt-out of version reporting by setting the value to 0 (false). [How to customize Device Update agent properties](https://github.com/Azure/iot-hub-device-update/blob/main/docs/agent-reference/how-to-build-agent-code.md).|
|doVer|string|device to cloud|Version of the Delivery Optimization agent running on the device. The value is read from the build only if during compile time ENABLE_ADU_TELEMETRY_REPORTING is set to 1 (true). Customers can choose to opt-out of the version reporting by setting the value to 0 (false).[How to customize Delivery Optimization agent properties](https://github.com/microsoft/do-client/blob/main/README.md#building-do-client-components).|

### Service Metadata

Service Metadata contains fields that the Device Update services uses to communicate actions and data to the Device Update agent.

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|action|integer|cloud to device|It is an integer that corresponds to an action the agent should perform. Values listed below.|
|updateManifest|string|cloud to device|Used to describe the content of an update. Generated from the [Import Manifest](import-update.md#create-a-device-update-import-manifest)|
|updateManifestSignature|JSON Object|cloud to device|A JSON Web Signature (JWS) with JSON Web Keys used for source verification.|
|fileUrls|Map|cloud to device|Map of `FileHash` to `DownloadUri`. Tells the agent, which files to download and the hash to use to verify the files were downloaded correctly.|

#### Action

`Actions` below represents the actions taken by the Device Update Agent as instructed by the Device Update Service. The Device Update Agent will report a `State` (see `State` section above) processing the `Action` received. See the [overview workflow](understand-device-update.md#device-update-agent) for requests that flow between the Device Update Service and the Device Update Agent.

|Name|Value|Description|
|---------|-----|-----------|
|Download|0|Download published content or update and any other content needed|
|Install|1|Install the content or update. Typically this means calling the installer for the content or update.|
|Apply|2|Finalize the update. It signals the system to reboot if necessary.|
|Cancel|255|Stop processing the current action and go back to `Idle`. Will also be used to tell the agent in the `Failed` state to go back to `Idle`.|

## Device Information Interface

The Device Information Interface is a concept used within [IoT Plug and Play architecture](../iot-pnp/overview-iot-plug-and-play.md). It contains device to cloud properties that provide information about the hardware and operating system of the device. Device Update for IoT Hub uses the DeviceInformation.manufacturer and DeviceInformation.model properties for telemetry and diagnostics. To learn more about Device Information interface, see this [example](https://devicemodels.azure.com/dtmi/azure/devicemanagement/deviceinformation-1.json).

The expected component name in your model is **deviceInformation** when implementing this interface. [Learn about Azure IoT PnP Components](../iot-pnp/concepts-components.md)

|Name|Type|Schema|Direction|Description|Example|
|----|----|------|---------|-----------|-----------|
|manufacturer|Property|string|device to cloud|Company name of the device manufacturer. This could be the same as the name of the original equipment manufacturer (OEM).|Contoso|
|model|Property|string|device to cloud|Device model name or ID.|IoT Edge Device|
|swVersion|Property|string|device to cloud|Version of the software on your device. swVersion could be the version of your firmware.|4.15.0-122|
|osName|Property|string|device to cloud|Name of the operating system on the device.|Ubuntu Server 18.04|
|processorArchitecture|Property|string|device to cloud|Architecture of the processor on the device.|ARM64|
|processorManufacturer|Property|string|device to cloud|Name of the manufacturer of the processor on the device.|Microsoft|
|totalStorage|Property|string|device to cloud|Total available storage on the device in kilobytes.|2048|
|totalMemory|Property|string|device to cloud|Total available memory on the device in kilobytes.|256|

## Model ID 

Model ID is how smart devices advertise their capabilities to Azure IoT applications with IoT Plug and Play.To learn more on how to build smart devices to advertise their capabilities to Azure IoT applications visit [IoT Plug and Play device developer guide](../iot-pnp/concepts-developer-guide-device.md).

Device Update for IoT Hub requires the IoT Plug and Play smart device to announce a model ID with a value of **"dtmi:AzureDeviceUpdate;1"** as part of the device connection. [Learn how to announce a model ID](../iot-pnp/concepts-developer-guide-device.md#model-id-announcement).