---
title: Error codes for Device Update for Azure IoT Hub
description: This document provides a table of error codes for various Device Update components.
author: chrisjlin
ms.author: lichris
ms.date: 06/28/2022
ms.topic: troubleshooting
ms.service: iot-hub-device-update
---

# Device Update for IoT Hub error codes

This document provides a table of error codes for various Device Update components. It's meant to be used as a reference for users who want to parse their own error codes to diagnose and troubleshoot issues.

There are two primary client-side components that may throw error codes: the Device Update agent, and the Delivery Optimization agent. Error codes also come from the Device Update content service.

## Device Update agent

### ResultCode and ExtendedResultCode

The Device Update for IoT Hub Core PnP interface reports `ResultCode` and `ExtendedResultCode`, which can be used to diagnose failures. For more information about the Device Update Core PnP interface, see [Device Update and Plug and Play](device-update-plug-and-play.md).

`ResultCode` is a general status code and `ExtendedResultCode` is an integer with encoded error information.

You'll most likely see the `ExtendedResultCode` as a signed integer in the PnP interface. To decode the `ExtendedResultCode`, convert the signed integer to
unsigned hex. Only the first 4 bytes of the `ExtendedResultCode` are used and are of the form `F` `FFFFFFF` where the first nibble is the **Facility Code** and
the rest of the bits are the **Error Code**.

**Facility Codes**

| Facility Code     | Description  |
|-------------------|--------------|
| D                 | Error raised from the DO SDK|
| E                 | Error code is an errno |


For example:

`ExtendedResultCode` is `-536870781`

The unsigned hex representation of `-536870781` is `FFFFFFFF E0000083`.

| Ignore    | Facility Code  | Error Code   |
|-----------|----------------|--------------|
| FFFFFFFF  | E              | 0000083      |

`0x83` in hex is `131` in decimal, which is the errno value for `ENOLCK`.

## Delivery Optimization agent
The following table lists error codes pertaining to the Delivery Optimization (DO) component of the Device Update client. The DO component is responsible for downloading update content onto the IoT device.

The DO error code can be obtained by examining the exceptions thrown in response to an API call. All DO error codes can be identified by the 0x80D0 prefix.

| Error Code  | String Error                       | Type                 | Description |
|-------------|------------------------------------|----------------------|-------------|
| 0x80D01001L | DO_E_NO_SERVICE                    | n/a                  | Delivery Optimization was unable to provide the service |
| 0x80D02002L | DO_E_DOWNLOAD_NO_PROGRESS          | Download Job         | Download of a file saw no progress within the defined period |
| 0x80D02011L | DO_E_UNKNOWN_PROPERTY_ID           | Download Job         | SetProperty() or GetProperty() called with an unknown property ID |
| 0x80D02012L | DO_E_READ_ONLY_PROPERTY            | Download Job         | Unable to call SetProperty() on a read-only property |
| 0x80D02013L | DO_E_INVALID_STATE                 | Download Job         | The requested action is not allowed in the current job state. The job might have been canceled or completed transferring. It is in a read-only state now. |
| 0x80D02018L | DO_E_FILE_DOWNLOADSINK_UNSPECIFIED | Download Job         | Unable to start a download because no download sink (either local file or stream interface) was specified |
| 0x80D02200L | DO_E_DOWNLOAD_NO_URI               | IDODownload Interface| The download was started without providing a URI |
| 0x80D03805L | DO_E_BLOCKED_BY_NO_NETWORK         | Transient conditions | Download paused due to loss of network connectivity |
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

For more information about parsing codes, see [Device Update Agent result codes and extended result codes](https://github.com/Azure/iot-hub-device-update/tree/main/docs/agent-reference/device-update-agent-extended-result-codes.md) or [implement a custom Content Handler](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/inc/aduc/content_handler.hpp).

## Device Update content service

The following table lists error codes pertaining to the content service component of the Device Update service. The content service component is responsible for importing update content. More troubleshooting information is also available for [importing proxy updates](device-update-proxy-update-troubleshooting.md).

| Error code | String error | Next steps |
|--|--|--|
| UpdateAlreadyExists | Update with the same identity already exists. | Make sure you're importing an update that hasn’t already been imported into this instance of Device Update for IoT Hub. |
| DuplicateContentImport | Identical content imported simultaneously multiple times. | Make sure you're importing an update that hasn’t already been imported into this instance of Device Update for IoT Hub. |
| CannotProcessImportManifest | Error processing import manifest. | Refer to [import concepts](import-concepts.md) and [import update](create-update.md) documentation for proper import manifest formatting. |
| CannotDownload | Cannot download import manifest. | Check to make sure the URL for the import manifest file is still valid. |
| CannotParse | Cannot parse import manifest. | Check your import manifest for accuracy against the schema defined in the [import update](create-update.md) documentation. |
| UnsupportedVersion | Import manifest schema version is not supported. | Make sure your import manifest is using the latest schema defined in the [import update](create-update.md) documentation. |
| Error importing update due to exceeded limit. | Cannot import additional update provider. | You've reached a [limit](device-update-limits.md) on the number of different __providers__ allowed in your instance of Device Update for IoT Hub. Delete some updates from your instance and try again. |
| Error importing update due to exceeded limit. | Cannot import additional update name for the specified provider. | You've reached a [limit](device-update-limits.md) on the number of different __names__ allowed under one provider in your instance of Device Update for IoT Hub. Delete some updates from your instance and try again. |
| Error importing update due to exceeded limit. | Cannot import additional update version for the specified provider and name. | You've reached a [limit](device-update-limits.md) on the number of different __versions__ allowed under one provider and name in your instance of Device Update for IoT Hub. Delete some updates with that name from your instance and try again. |
| Error importing update due to exceeded limit. | Cannot import additional update provider with the specified compatibility.<br><br>_or_<br><br>Cannot import additional update name with the specified compatibility.<br><br>_or_<br><br>Cannot import additional update version with the specified compatibility. | When defining [compatibility properties](import-schema.md#compatibility-object) in an import manifest, keep in mind that Device Update for IoT Hub supports a single provider and name combination for a given set of compatibility properties. If you try to use the same compatibility properties with more than one provider/name combination, you'll see these errors. To resolve this issue, make sure that all updates for a given device (as defined by compatibility properties) use the same provider and name. |
| CannotProcessUpdateFile | Error processing source file. |  |
| ContentFileCannotDownload | Cannot download source file. | Check to make sure the URL for the update file(s) is still valid. |
| SourceFileMalwareDetected | A known malware signature was detected in a file being imported. | Content imported into Device Update for IoT Hub is scanned for malware by several different mechanisms. If a known malware signature is identified, the import fails and a unique error message is returned. The error message contains the description of the malware signature, and a file hash for each file where the signature was detected. You can use the file hash to find the exact file being flagged, and use the description of the malware signature to check that file for malware. <br><br>Once you have removed the malware from any files being imported, you can start the import process again. |
| SourceFilePendingMalwareAnalysis | A signature was detected in a file being imported that may indicate malware is present. | Content imported into Device Update for IoT Hub is scanned for malware by several different mechanisms. The import fails if a scan signature has characteristics of malware, even if there is not an exact match to known malware. When this occurs, a unique error message is returned. The error message contains the description of the suspected malware signature, and a file hash for each file where the signature was detected. You can use the file hash to find the exact file being flagged, and use the description of the malware signature to check that file for malware.<br><br>Once you've removed the malware from any files being imported, you can start the import process again. If you're certain your files are free of malware and continue to see this error, use the [Contact Microsoft Support](troubleshoot-device-update.md#contact) process. |

## Next steps

[Troubleshoot issues with Device Update](.\troubleshoot-device-update.md)
