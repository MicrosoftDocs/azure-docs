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

Device Update for IoT Hub has several features focused on making it easier to diagnose and troubleshoot device-side errors. With the release of the v0.8.0 agent, there are two diagnostic features available:

* **Deployment error codes** can now be viewed directly in the latest preview version of the Device Update user interface

* **Remote log collection** enables the creation of log operations, which instruct targeted devices to upload on-device diagnostic logs to a linked Azure Blob storage account

## Deployment error codes in UI

When a device reports a deployment failure to the Device Update service, the Device Update user interface now displays the device's reported resultCode and extendedResultCode in the user interface. You can view these codes using the following steps:

1. Navigate to the **Groups and Deployments** tab.

2. Click on the name of a group with an active deployment to get to the **Group details** page.

3. Click on any device name in the **Device list** to open the device details panel. Here you can see the Result code the device has reported.

4. The DU reference agent follows standard HTTP status code convention for the Result code field (e.g. "200" indicates success). For more information on how to parse Result codes, see the [Device Update client error codes](device-update-error-codes.md) page.

    > [!NOTE]
    > If you have modified your DU Agent to report customized Result codes, the numerical codes will still be passed through to the Device Update user interface. You may then refer to any documentation you have created to parse these numerical codes.

## Remote log collection

When more information from the device is necessary to diagnose and troubleshoot an error, you can use the log collection feature to instruct targeted devices to upload on-device diagnostic logs to a linked Azure Blob storage account. You can start using this feature by following these [instructions](device-update-log-collection.md).

Device Update's remote log collection is a service-driven, operation-based feature. To take advantage of log collection, a device need only be able to implement the Diagnostics interface and configuration file, and be able to upload files to Azure Blob storage via SDK.

From a high level, the log collection feature works as follows:

1. The user creates a new log operation using the Device Update user interface or APIs, targeting up to 100 devices that have implemented the Diagnostics Interface.

2. The DU service sends a log collection start message to the targeted devices using the Diagnostics Interface. This start message includes the log operation ID and a SAS token for uploading to the associated Azure Storage account.

3. Upon receiving the start message, the DU agent of the targeted device will attempt to collect and upload the files in the pre-defined filepath(s) specified in the on-device agent configuration file. The DU reference agent is configured to upload the DU Agent diagnostic log ("aduc.log"), and the DO Agent diagnostic log ("do-agent.log") by default.

4. The DU agent then reports the state of the operation ("Succeeded" / "Failed") back to the service, including the log operation ID, a ResultCode, and an ExtendedResultCode. If the DU Agent fails a log operation, it will automatically attempt to retry three times, reporting only the final state back to the service.

5. Once all targeted devices have reported their terminal state back to the DU service, the DU service marks the log operation as "Succeeded" or "Failed." "Succeeded" indicates that all targeted devices successfully completed the log operation. "Failed" indicates that at least one targeted device failed the log operation. 

    > [!NOTE]
    > Since the log operation is carried out in parallel by the targeted devices, it is possible that some targeted devices successfully uploaded logs, but the overall log operation is marked as "Failed." You can see which devices succeeded and which failed by viewing the log operation details through the user interface or APIs.
## Next steps

Learn how to use Device Update's remote log collection feature:

 - [Remotely collect diagnostic logs from devices using Device Update for IoT Hub](device-update-log-collection.md)

