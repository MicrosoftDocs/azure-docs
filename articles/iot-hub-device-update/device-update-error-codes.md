---
title: Error codes for Device Update for Azure IoT Hub | Microsoft Docs
description: This document provides a table of error codes for various Device Update components.
author: chrisjlin
ms.author: lichris
ms.date: 1/26/2022
ms.topic: reference
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub Error Codes

This document provides a table of error codes for various Device Update components. It is meant to be used as a reference for users who want to parse their own error codes to diagnose and troubleshoot issues.

There are two primary client-side components that may throw error codes: the Device Update agent, and the Delivery Optimization agent. Error codes also come from the Device Update content service.

## Device Update agent

### ResultCode and ExtendedResultCode

The Device Update for IoT Hub Core PnP interface reports `ResultCode` and `ExtendedResultCode`, which can be used to diagnose failures. [Learn More](device-update-plug-and-play.md) about the Device Update Core PnP interface.

`ResultCode` is a general status code and `ExtendedResultCode` is an integer with encoded error information.

You will most likely see the `ExtendedResultCode` as a signed integer in the PnP interface. To decode the `ExtendedResultCode`, convert the signed integer to
unsigned hex. Only the first 4 bytes of the `ExtendedResultCode` are used and are of the form `F` `FFFFFFF` where the first nibble is the **Facility Code** and
the rest of the bits are the **Error Code**.

```text  
   0 00 00000     Total 4 bytes (32 bits)
   - -- -----
   | |  |
   | |  |
   | |  +---------  Error code (20 bits)
   | |
   | +------------- Component/Area code (8 bits)
   |
   +--------------- Facility code (4 bits) 
 ```

Please refer to [Device Update Agent result codes and extended result codes](https://github.com/Azure/iot-hub-device-update/tree/main/src/content_handlers) or [implement a custom Content Handler](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/device-update-agent-extended-result-codes.md) for details.

## Device Update content service
The following table lists error codes pertaining to the content service component of the Device Update service. The content service component is responsible for handling importing of update content. Additional troubleshooting information is also available for [importing proxy updates](device-update-proxy-update-troubleshooting.md).

| Error Code                    | String Error                                                               | Next steps                         |
|-------------------------------|----------------------------------------------------------------------------|------------------------------------|
| "UpdateAlreadyExists"         | Update with the same identity already exists.                              | Make sure you are importing an update that hasn’t already been imported into this instance of Device Update for IoT Hub. |
| "DuplicateContentImport"      | Identical content imported simultaneously multiple times.                  | Same as for UpdateAlreadyExists. |
| "CannotProcessImportManifest" | Error processing import manifest.                                          | Refer to [import concepts](./import-concepts.md) and [import update](./import-update.md) documentation for proper import manifest formatting. |
| "CannotDownload"              | Cannot download import manifest.                                           | Check to make sure the URL for the import manifest file is still valid. |
| "CannotParse"                 | Cannot parse import manifest.                                              | Check your import manifest for accuracy against the schema defined in the [import update](./import-update.md) documentation. |
| "UnsupportedVersion"          | Import manifest schema version is not supported.                           | Make sure your import manifest is using the latest schema defined in the [import update](./import-update.md) documentation. |
| "UpdateLimitExceeded"         | Error importing update due to exceeded limit.                              | You have reached a limit on the number of different Providers, Names or Versions allowed in your instance of Device Update for IoT Hub. Delete some updates from your instance and try again. |
| "UpdateProvider"              | Cannot import a new update provider.                                       | You have reached a limit on the number of different __Providers__ allowed in your instance of Device Update for IoT Hub. Delete some updates from your instance and try again. |
| "UpdateName"                  | Cannot import a new update name for the specified provider.                | You have reached a limit on the number of different __Names__ allowed under one Provider in your instance of Device Update for IoT Hub. Delete some updates from your instance and try again. |
| "UpdateVersion"               | Cannot import a new update version for the specified provider and name.    | You have reached a limit on the number of different __Versions__ allowed under one Provider and Name in your instance of Device Update for IoT Hub. Delete some updates with that Name from your instance and try again. |
| "UpdateProviderCompatibility" | Cannot import additional update provider with the specified compatibility. | When defining device manufacturer and device model compatibility properties in an import manifest, keep in mind that Device Update for IoT Hub supports a single Provider and Name combination for a given manufacturer/model. This means if you try to use the same manufacturer/model compatibility properties with more than one Provider/Name combination, you will see these errors. To resolve this, make sure that all updates for a given device (as defined by manufacturer/model) use the same Provider and Name. While not required, you may want to consider making the Provider the same as the manufacturer and the Name the same as the model, just for simplicity. |
| "UpdateNameCompatibility"     | Cannot import additional update name with the specified compatibility.     | Same as for UpdateProviderCompatibility.ContentLimitNamespaceCompatibility. |
| "UpdateVersionCompatibility"  | Cannot import additional update version with the specified compatibility.  | Same as for UpdateProviderCompatibility.ContentLimitNamespaceCompatibility. |
| "CannotProcessUpdateFile"     | Error processing source file.                                              |                                    |
| "ContentFileCannotDownload"   | Cannot download source file.                                               | Check to make sure the URL for the update file(s) is still valid. |

**[Next Step: Troubleshoot issues with Device Update](.\troubleshoot-device-update.md)**
