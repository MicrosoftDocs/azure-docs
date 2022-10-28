---
title: Understand Device Update for Azure IoT Hub diagnostic features | Microsoft Docs
description: Understand what diagnostic features Device Update for IoT Hub has, including deployment error codes in UX and remote log collection.
author: chrisjlin
ms.author: lichris
ms.date: 1/26/2021
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub diagnostics overview

Device Update for IoT Hub has several features that help you to diagnose and troubleshoot device-side errors. With the release of the v0.8.0 agent, there are two diagnostic features available:

* **Deployment error codes** can be viewed directly in the latest preview version of the Device Update user interface

* **Remote log collection** enables the creation of log operations, which instruct targeted devices to upload on-device diagnostic logs to a linked Azure Blob storage account

## Deployment error codes in UI

When a device reports a deployment failure to the Device Update service, the Device Update user interface displays the device's reported `resultCode` and `extendedResultCode` in the user interface. Use the following steps to view these codes:

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Updates** and then navigate to the **Groups and Deployments** tab.

1. Select the name of a group with an active deployment to get to the **Group details** page.

1. Select any device name in the **Device list** to open the device details panel. Here you can see the result code that the device has reported.

1. The Device Update reference agent follows standard HTTP status code convention for the result code field (for example, "200" indicates success). For more information on how to parse result codes, see [Device Update client error codes](device-update-error-codes.md).

    > [!NOTE]
    > If you have modified your Device Update agent to report customized result codes, the numerical codes will still be passed through to the Device Update user interface. You may then refer to any documentation you have created to parse these numerical codes.

## Remote log collection

When more information from the device is necessary to diagnose and troubleshoot an error, you can use the log collection feature to instruct targeted devices to upload on-device diagnostic logs to a linked Azure Blob storage account. You can start using this feature by following the instructions in [Remotely collect diagnostic logs from devices](device-update-log-collection.md).

Device Update's remote log collection is a service-driven, operation-based feature. To take advantage of log collection, a device need only be able to implement the Diagnostics interface and configuration file, and be able to upload files to Azure Blob storage via SDK.

From a high level, the log collection feature works as follows:

1. The user creates a new log operation using the Device Update user interface or APIs, targeting up to 100 devices that have implemented the Diagnostics interface.

2. The Device Update service sends a log collection start message to the targeted devices using the Diagnostics interface. This start message includes the log operation ID and a SAS token for uploading to the associated Azure Storage account.

3. Upon receiving the start message, the Device Update agent of the targeted device attempts to collect and upload the files in the pre-defined filepath(s) specified in the on-device agent configuration file. The Device Update reference agent is configured to upload the Device Update agent diagnostic log (`aduc.log`), and the DO Agent diagnostic log ("do-agent.log") by default.

4. The Device Update agent then reports the state of the operation (either **Succeeded** or **Failed**) back to the service, including the log operation ID, a ResultCode, and an ExtendedResultCode. If the Device Update agent fails a log operation, it will automatically attempt to retry three times, reporting only the final state back to the service.

5. Once all targeted devices have reported their terminal state back to the Device Update service, the Device Update service marks the log operation as either **Succeeded** or **Failed**. A successful log operation indicates that all targeted devices successfully completed the log operation. A failed log operation indicates that at least one targeted device failed the log operation.

   > [!NOTE]
   > Since the log operation is carried out in parallel by the targeted devices, it is possible that some targeted devices successfully uploaded logs, but the overall log operation is marked as failed. You can see which devices succeeded and which failed by viewing the log operation details through the user interface or APIs.

## Next steps

Learn how to use Device Update's remote log collection feature: [Remotely collect diagnostic logs from devices using Device Update for IoT Hub](device-update-log-collection.md)
