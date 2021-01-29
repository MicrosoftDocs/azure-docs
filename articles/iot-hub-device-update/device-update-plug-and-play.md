---
title: Understand how Device Update for IoT Hub uses IoT Plug and Play | Microsoft Docs
description: Device Update for IoT Hub uses to discover and manage devices that are over-the-air update capable.
author: philmea
ms.author: philmea
ms.date: 1/11/2021
ms.topic: conceptual
ms.service: iot-hub
---

# Device Update for IoT Hub and IoT Plug and Play

Device Update for IoT Hub uses [IoT Plug and
Play](https://docs.microsoft.com/azure/iot-pnp/) to discover and manage
devices that are over-the-air update capable. Device Update services will send and receive
properties and messages to and from devices using PnP interfaces. Device Update requires
devices/clients implement the following interfaces and model-id as described below.

## Device Information

The [DeviceInformation](https://github.com/Azure/iot-plugandplay-models/) interface is a concept used within
the [Azure IoT Plug and Play](https://docs.microsoft.com/azure/iot-pnp/overview-iot-plug-and-play)
which contains device to cloud properties that
provide information about the hardware and operating system of the device. Device Update uses the DeviceInformation.manufacturer
and DeviceInformation.model properties for telemetry and diagnostics. Learn more from this
 `DeviceInformation` [example](https://devicemodels.azure.com/dtmi/azure/devicemanagement/deviceinformation-1.json).

|Name|Type|Schema|Direction|Description|Description|
|----|----|------|---------|-----------|-----------|
|manufacturer|Property|string|device to cloud|Company name of the device manufacturer. This could be the same as the name of the original equipment manufacturer (OEM).|Contoso|
|model|Property|string|device to cloud|Device model name or ID.|IoT Edge Device|
|swVersion|Property|string|device to cloud|Version of the software on your device. This could be the version of your firmware.|4.15.0-122|
|osName|Property|string|device to cloud|Name of the operating system on the device.|Ubuntu Server 18.04|
|processorArchitecture|Property|string|device to cloud|Architecture of the processor on the device.|ARM64|
|processorManufacturer|Property|string|device to cloud|Name of the manufacturer of the processor on the device.|Microsoft|
|totalStorage|Property|string|device to cloud|Total available storage on the device in kilobytes.|2048|
|totalMemory|Property|string|device to cloud|Total available memory on the device in kilobytes.|256|

## Device Update for IoT Hub Core

The Device Update for IoT Hub Core (Device Update Core) interface is used to send update
actions and metadata to devices and receive update status from devices. The Device Update
Core interface is split into two Object properties.

### Agent Metadata

Agent Metadata contains fields that the device or Device Update agent uses to send
information and status to Device Update services.

|Name|Schema|Direction|Description|Example|
|----|------|---------|-----------|-----------|
|resultCode|integer|device to cloud|A code that contains information about the result of the last update action. Can be populated for either success or failure and should follow [http status code specification](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).|500|
|extendedResultCode|integer|device to cloud|A code that contains additional information about the result. Can be populated for either success or failure.|0x80004005|
|state|integer|device to cloud|This is an integer that indicates the current state of the Device Update Agent. Values listed below.|Idle|
|installedUpdateId|string|device to cloud|An ID of the update that is currently installed (through Device Update). This value will be null for a device that has never taken an update through Device Update.|Null|
|deviceProperties|Map|device to cloud|The set of properties that contain the manufacturer and model.|See  below section for details

### deviceProperties

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|manufacturer|string|device to cloud|The device manufacturer of the device, reported through DeviceProperties. This property is read from one of two places, first, the AzureDeviceUpdateCore interface will attempt to read the 'aduc_manufacturer' value from the [Device Update-conf.txt]() file.  Second, if the value is not populated in Device Update-conf.txt, it will default to reporting the compile-time definition for ADUC_DEVICEPROPERTIES_MANUFACTURER. This property will only be reported at boot time.|
|model|string|device to cloud|The device model of the device, reported through DeviceProperties. This property is read from one of two places, first, the AzureDeviceUpdateCore interface will attempt to read the 'aduc_model' value from the [Device Update-conf.txt]() file.  Second, if the value is not populated in Device Update-conf.txt, it will default to reporting the compile-time definition for ADUC_DEVICEPROPERTIES_MODEL. This property will only be reported at boot time.|

### State

The following `State` below represent when the Device Update Agent reports a given state, after receiving an action from the Device Update Service.
See the [overview workflow]() of requests that flow between the Device Update Service
and Agent. `State` is reported in response to an `Action` (see `Actions` section below) sent
to the Device Update Agent from the Device Update Service.

|Name|Value|Description|
|---------|-----|-----------|
|Idle|0|The device is ready to receive an action from the Device Update Service. After a successful update, state is returned to the `Idle` state.|
|DownloadSucceeded|2|A successful download.|
|InstallSucceeded|4|A successful install.|
|Failed|255|A failure occurred during updating.|

### Service Metadata

Service Metadata contains fields that the Device Update services use to communicate
actions and metadata to the device or agent.

|Name|Schema|Direction|Description|
|----|------|---------|-----------|
|action|integer|cloud to device|This is an integer that corresponds to an action the agent should perform. Values listed below.|
|updateManifest|string|cloud to device|Used to describe the content of an update. [Learn more](https://github.com/Azure/adu-private-preview/blob/master/docs/agent-reference/update-manifest.md) about the details of the Update Manifest and how Device Update uses it to ensure the identity of the update, sent to a device.|
|updateManifestSignature|JSON Object|cloud to device|A JSON Web Signature (JWS) with JSON Web Keys used for source verification.|
|fileUrls|Map|cloud to device|Map of `FileHash` to `DownloadUri`. Tells the agent, which files to download and the hash to use to verify the files were downloaded correctly.|

#### Action

The following `Actions` below represent the actions taken by the Device Update Agent as instructed by the Device Update Service.
See the [overview workflow](https://github.com/Azure/adu-private-preview/blob/master/src/agent/adu_core_interface/src/agent_workflow.c)
of requests that flow between the Device Update Service and Agent. `Action` is received by the Device Update Agent as an action from the Device Update Service.
The Device Update Agent will report a `State` (see `State` section above) processing the `Action` received.

|Name|Value|Description|
|---------|-----|-----------|
|Download|0|Download published content or update and any additional content needed|
|Install|1|Install the content or update. Typically this means calling the installer for the content or update.|
|Apply|2|Finalize the update. This will signal the system to reboot if necessary.|
|Cancel|255|Stop processing the current action and go back to `Idle`. Will also be used to tell the agent in the `Failed` state to go back to `Idle`.|

## Model ID

Configure your IoT Plug and Play device to announce the model ID as part of the device connection with the value **"dtmi:AzureDeviceUpdate;1"** by following this [example](https://docs.microsoft.com/azure/iot-pnp/concepts-developer-guide-device-c#model-id-announcement). To learn more on how to build smart devices with IoT Plug and Play that advertise their capabilities to Azure IoT applications visit [IoT Plug and Play device developer guide](https://docs.microsoft.com/azure/iot-pnp/concepts-developer-guide-device-c).
