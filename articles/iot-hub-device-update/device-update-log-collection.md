---
title: Device Update for Azure IoT Hub log collection | Microsoft Docs
description: Device Update for IoT Hub enables remote collection of diagnostic logs from connected IoT devices.
author: lichris
ms.author: lichris
ms.date: 12/22/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Remotely collect diagnostic logs from devices using Device Update for IoT Hub
Learn how to initiate a Device Update for IoT Hub log operation and view collected logs within Azure blob storage.

## Prerequisites
* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md). 
* An IoT device (or simulator) [provisioned for Device Update](device-update-agent-provisioning.md) within IoT Hub and implementing the Diagnostic Interface.
* An [Azure Blob storage account](../storage/common/storage-account-create.md) under the same subscription as your Device Update for IoT Hub account.

> [!NOTE]
> The remote log collection feature is currently compatible only with devices that implement the Diagnostic Interface and are able to upload files to Azure Blob storage. The reference agent implementation also expects the device to write log files to a user-specified file path on the device.

## Link your Azure Blob storage account to your Device Update instance

In order to use the remote log collection feature, you must first link an Azure Blob storage account with your Device Update instance. This Azure Blob storage account is where your devices will upload diagnostic logs to. 

1. Navigate to your Device Update for IoT Hub resource.

2. Select "Instance" under the "Instance Management" section of the navigation pane.

3. Select your Device Update instance from the list, then "Configure Diagnostics."

4. Select the "Customer Diagnostics" tab, then "Select Azure Storage Account."

5. Choose your desired storage account from the list and select "Save."

6. Once back on the instance list, select "Refresh" periodically until the instance's Provisioning State shows "Succeeded." This usually takes 2-3 minutes.

## Configure which log files are collected from your device

The Device Update agent on a device will collect files from specific file paths on the device when it receives a log upload start signal from the Device Update service. These file paths are defined by a configuration file on the device, located at **/etc/adu/du-diagnostics-config.json** in the reference agent.

Within the configuration file, each log file to be collected and uploaded is represented as a "logComponent" object with componentName and logPath properties. This can be modified as desired.

## Configure max log file size

The Device Update agent will only collect log files under a certain file size. This max file size is defined by a configuration file on the device, located at **/etc/adu/du-diagnostics-config.json** in the reference agent.

The relevant parameter "maxKilobytesToUploadPerLogPath" will apply to each logComponent object, and can be modified as desired.

## Create a new log operation within Device Update for IoT Hub.

Log operations are a new service-driven action that you can instruct your IoT devices to perform through the Device Update service. For a more detailed explanation of how log operations function, please see the [Device update diagnostics](device-update-diagnostics.md) concept page.

1. Navigate to your IoT Hub and select the **Updates** tab under the **Device Management** section of the navigation pane.

2. Select the **Diagnostics** tab in the UI. If you don't see a Diagnostics tab, make sure you're using the newest version of the Device Update for IoT Hub user interface. If you see "Diagnostics must be enabled for this Device Update instance," make sure you've linked an Azure Blob storage account with your Device Update instance.

3. Select **Add log upload operation** to navigate to the log operation creation page.

4. Enter a name (ID) and description for your new log operation, then select **Add devices** to select which IoT devices you want to collect diagnostic logs from.

5. Select **Add**.

6. Once back on the Diagnostics tab, select **Refresh** until you see your log operation listed in the Operation Table.

7. Once the operation status is **Succeeded** or **Failed**, select the operation name to view its details. An operation will be marked "Succeeded" only if all targeted devices successfully completed the log upload. If some targeted devices succeeded and some failed, the log operation will be marked "Failed." You can use the log operation details blade to see which devices succeeded and which failed.

8. In the log operation details, you can view the device-specific status and see the log location path. This path corresponds to the virtual directory path within your Azure Blob storage account where the diagnostic logs have been uploaded.

## View and export collected diagnostic logs

1. Once your log operation has succeeded, navigate to your Azure Blob storage account.

2. Select **Containers** under the **Data storage** section of the navigation pane.

3. Select the container with the same name as your Device Update instance. 

4. Use the log location path from the log operation details to navigate to the correct directory containing the logs. By default, the remote log collection feature instructs targeted devices to upload diagnostic logs using the following directory path model: **Blob storage container/Target device ID/Log operation ID/On-device log path**

5. If you haven't modified the diagnostic component of the DU Agent, the device will respond to any log operation by attempting to upload two plaintext log files: the DU Agent diagnostic log ("aduc.log"), and the DO Agent diagnostic log ("do-agent.log"). You can learn more about which log files the DU reference agent collects by reading the [Device update diagnostics](device-update-diagnostics.md) concept page.

6. You can view the log file's contents by selecting the file name, then selecting the menu element (ellipsis) and clicking **View/edit**. You can also download or delete the log file by selecting the respectively labeled options.
    :::image type="content" source="media/device-update-log-collection/blob-storage-log.png" alt-text="Screenshot of log file within Azure Blob storage." lightbox="media/device-update-log-collection/blob-storage-log.png":::

## Next steps

Learn more about Device Update's diagnostic capabilities:

 - [Device update diagnostic feature overview](device-update-diagnostics.md)

