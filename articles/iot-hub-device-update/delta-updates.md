---
title: Understand Device Update for Azure IoT Hub delta update capabilities | Microsoft Docs
description: Key concepts for using delta (differential) updates with Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 08/24/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# How to understand and use delta updates in Device Update for IoT Hub (Preview)

Delta updates allow you to generate a small update that represents only the changes between two full updates - a source image and a target image. This approach is ideal for reducing the bandwidth used to download an update to a device, particularly if there have been only a few changes between the source and target updates.

>[!NOTE]
>The delta update feature is currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Requirements for using delta updates in Device Update for IoT Hub

- The source and target update files must be SWU (SWUpdate) format.
- Within each SWUpdate file, there must be a raw image that uses the Ext2, Ext3, or Ext4 filesystem. That image can be compressed with gzip or zstd.
- The delta generation process recompresses the target SWU update using zstd compression in order to produce an optimal delta. You'll import this recompressed target SWU update to the Device Update service along with the generated delta update file.
- Within SWUpdate on the device, zstd decompression must also be enabled.  
  - This requires using [SWUpdate 2019.11](https://github.com/sbabic/swupdate/releases/tag/2019.11) or later.

## Configure a device with Device Update agent and delta processor component

In order for your device to download and install delta updates from the Device Update service, you need several components present and configured.

### Device Update agent

The Device Update agent _orchestrates_ the update process on the device, including download, install, and restart actions. Add the Device Update agent to a device and configure it for use. You'll need the 1.0 or later version of the agent. For instructions, see [Device Update agent provisioning](device-update-agent-provisioning.md).

### Update handler

An update handler integrates with the Device Update agent to perform the actual update install. For delta updates, start with the [`microsoft/swupdate:2` update handler](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/step_handlers/swupdate_handler_v2/README.md) if you don't already have your own SWUpdate update handler that you want to modify. **If you use your own update handler, be sure to enable zstd decompression in SWUpdate**.

### Delta processor

The delta processor re-creates the original SWU image file on your device after the delta file has been downloaded, so your update handler can install the SWU file. You'll find all the delta processor code in the [Azure/iot-hub-device-update-delta](https://github.com/Azure/iot-hub-device-update-delta) GitHub repo.

To add the delta processor component to your device image and configure it for use, follow the README.md instructions to use CMAKE to build the delta processor from source. From there, install the shared object (libadudiffapi.so) directly by copying it to the `/usr/lib` directory:  

```bash
sudo cp <path to libadudiffapi.so> /usr/lib/libadudiffapi.so
sudo ldconfig
```

## Add a source SWU image file to your device

After a delta update has been downloaded to a device, it must be compared against a valid _source SWU file_ that has been previously cached on the device in order to be re-created into a full image. The simplest way to populate this cached image is to deploy a full image update to the device via the Device Update service (using the existing [import](import-update.md) and [deployment](deploy-update.md) processes). As long as the device has been configured with the Device Update agent (version 1.0 or later) and delta processor, the installed SWU file is cached automatically by the Device Update agent for later delta update use.

If you instead want to directly pre-populate the source image on your device, the path where the image is expected is:

`[BASE_SOURCE_DOWNLOAD_CACHE_PATH]/sha256-[ENCODED HASH]`

By default, `BASE_SOURCE_DOWNLOAD_CACHE_PATH` is the path `/var/lib/adu/sdc/[provider]`. The `[provider]` value is the Provider part of the [updateId](import-concepts.md#update-identity) for the source SWU file.



`ENCODED_HASH` is the base64 hex string of the SHA256 of the binary, but after encoding to base64 hex string, it encodes the characters as follows:

- `+` encoded as `octets _2B`  
- `/` encoded as `octets _2F`  
- `=` encoded as `octets _3D`

## Generate delta updates using the DiffGen tool

### Environment prerequisites

Before creating deltas with DiffGen, several things need to be downloaded and/or installed on the environment machine. We recommend a Linux environment and specifically Ubuntu 20.04 (or WSL if natively on Windows).

The following table provides a list of the content needed, where to retrieve them, and the recommended installation if necessary:

| Binary Name | Where to acquire | How to install |
|--|--|--|
| DiffGen | [Azure/iot-hub-device-update-delta](https://github.com/Azure/iot-hub-device-update-delta) GitHub repo | From the root folder, select the _Microsoft.Azure.DeviceUpdate.Diffs.[version].nupkg_ file. [Learn more about NuGet packages](/nuget/).|
| .NET (Runtime) | Via Terminal / Package Managers | [Instructions for Linux](/dotnet/core/install/linux). Only the Runtime is required. |

### Dependencies

The zstd_compression_tool is used for decompressing an archive's image files and recompressing them with zstd. This process ensures that all archive files used for diff generation have the same compression algorithm for the images inside the archives.

Commands to install required packages/libraries:  

```bash
sudo apt update  
sudo apt-get install -y python3 python3-pip  
sudo pip3 install libconf zstandard
```

### Create a delta update using DiffGen

The DiffGen tool is run with several arguments. All arguments are required, and overall syntax is as follows:

`DiffGenTool [source_archive] [target_archive] [output_path] [log_folder] [working_folder] [recompressed_target_archive]`  

- The script recompress_tool.py runs to create the file [recompressed_target_archive], which then is used instead of [target_archive] as the target file for creating the diff.
- The image files within [recompressed_target_archive] are compressed with zstd.

If your SWU files are signed (likely), you'll need another argument as well:

`DiffGenTool [source_archive] [target_archive] [output_path] [log_folder] [working_folder] [recompressed_target_archive] "[signing_command]"`

- In addition to using [recompressed_target_archive] as the target file, providing a signing command string parameter runs recompress_and_sign_tool.py to create the file [recompressed_target_archive] and have the sw-description file within the archive signed (meaning a sw-description.sig file is present). You can use the sample `sign_file.sh` script from the [Azure/iot-hub-device-update-delta](https://github.com/Azure/iot-hub-device-update-delta/tree/main/src/scripts/signing_samples/openssl_wrapper) GitHub repo. Open the script, edit it to add the path to your private key file, then save it. See the examples section below for sample usage.

The following table describes the arguments in more detail:

| Argument | Description |
|--|--|
| [source_archive] | This is the image that the delta is based against when creating the delta. _Important_: this image must be identical to the image that is already present on the device (for example, cached from a previous update). |
| [target_archive] | This is the image that the delta updates the device to. |
| [output_path] | The path (including the desired name of the delta file being generated) on the host machine where the delta file is placed after creation.  If the path doesn't exist, the directory is created by the tool. |
| [log_folder] | The path on the host machine where logs creates. We recommend defining this location as a sub folder of the output path. If the path doesn't exist, it is created by the tool. |
| [working_folder] | The path on the machine where collateral and other working files are placed during the delta generation. We recommend defining this location as a subfolder of the output path. If the path doesn't exist, it is created by the tool. |
| [recompressed_target_archive] | The path on the host machine where the recompressed target file is created. This file is used instead of <target_archive> as the target file for diff generation. If this path exists before calling DiffGenTool, the path is overwritten. We recommend defining this path as a file in the subfolder of the output path. |
| "[signing_command]" _(optional)_ | A customizable command used for signing the sw-description file within the recompressed archive file. The sw-description file in the recompressed archive is used as an input parameter for the signing command; DiffGenTool expects the signing command to create a new signature file, using the name of the input with `.sig` appended. Surrounding the parameter in double quotes is needed so that the whole command is passed in as a single parameter. Also, avoid putting the '~' character in a key path used for signing, and use the full home path instead (for example, use /home/USER/keys/priv.pem instead of ~/keys/priv.pem). |

### DiffGen examples

In the examples below, we're operating out of the /mnt/o/temp directory (in WSL):

_Creating diff between input source file and recompressed target file:_

```bash
sudo ./DiffGenTool  
/mnt/o/temp/[source file.swu]  
/mnt/o/temp/[target file.swu]  
/mnt/o/temp/[delta file to be created]  
/mnt/o/temp/logs  
/mnt/o/temp/working  
/mnt/o/temp/[recompressed file to be created.swu]
```  

If you're also using the signing parameter (needed if your SWU file is signed), you can use the sample `sign_file.sh` script referenced previously. First, open the script and edit it to add the path to your private key file. Save the script, and then run DiffGen as follows:

_Creating diff between input source file and recompressed/re-signed target file:_

```bash
sudo ./DiffGenTool  
/mnt/o/temp/[source file.swu]
/mnt/o/temp/[target file.swu]   
/mnt/o/temp/[delta file to be created]  
/mnt/o/temp/logs  
/mnt/o/temp/working  
/mnt/o/temp/[recompressed file to be created.swu]  
/mnt/o/temp/[path to script]/sign_file.sh
```  

## Import the generated delta update

The basic process of importing an update to the Device Update service is unchanged  for delta updates, so if you haven't already, be sure to review this page: [How to prepare an update to be imported into Azure Device Update for IoT Hub](create-update.md)

### Generate import manifest

The first step to import an update into the Device Update service is always to create an import manifest if you don't already have one. For more information about import manifests, see [Importing updates into Device Update](import-concepts.md#import-manifest). For delta updates, your import manifest needs to reference two files:

- The _recompressed_ target SWU image created when you ran the DiffGen tool.
- The delta file created when you ran the DiffGen tool.

The delta update feature uses a capability called [related files](related-files.md), which requires an import manifest that is version 5 or later.

To create an import manifest for your delta update using the related files feature, you'll need to add [relatedFiles](import-schema.md#relatedfiles-object) and [downloadHandler](import-schema.md#downloadhandler-object) objects to your import manifest.

Use the `relatedFiles` object to specify information about the delta update file, including the file name, file size and sha256 hash. Importantly, you also need to specify two properties which are unique to the delta update feature:

```json
"properties": {
      "microsoft.sourceFileHashAlgorithm": "sha256",
      "microsoft.sourceFileHash": "[insert the source SWU image file hash]"
}
```

Both of the properties above are specific to your _source SWU image file_ that you used as an input to the DiffGen tool when creating your delta update. The information about the source SWU image is needed in your import manifest even though you don't actually import the source image. The delta components on the device use this metadata about the source image to locate the image on the device once the delta has been downloaded.

Use the `downloadHandler` object to specify how the Device Update agent orchestrates the delta update, using the related files feature. Unless you are customizing your own version of the Device Update agent for delta functionality, you should only use this downloadHandler:

```json
"downloadHandler": {
  "id": "microsoft/delta:1"
}
```

You can use the Azure Command Line Interface (CLI) to generate an import manifest for your delta update. If you haven't used the Azure CLI to create an import manifest before, see [Create a basic import manifest](create-update.md#create-a-basic-device-update-import-manifest).

```azurecli
az iot du update init v5
--update-provider <replace with your Provider> --update-name <replace with your update Name> --update-version <replace with your update Version> --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> --step handler=microsoft/swupdate:2 properties=<replace with any desired handler properties (JSON-formatted), such as '{"installedCriteria": "1.0"}'> --file path=<replace with path(s) to your update file(s), including the full file name> downloadHandler=microsoft/delta:1 --related-file path=<replace with path(s) to your delta file(s), including the full file name> properties='{"microsoft.sourceFileHashAlgorithm": "sha256", "microsoft.sourceFileHash": "<replace with the source SWU image file hash>"}' 
```

Save your generated import manifest JSON to a file with the extension `.importmanifest.json`

### Import using the Azure portal

Once you've created your import manifest, you're ready to import the delta update. To import, follow the instructions in [Add an update to Device Update for IoT Hub](import-update.md#import-an-update). You must include these items when importing:

- The import manifest .json file you created in the previous step.
- The _recompressed_ target SWU image created when you ran the DiffGen tool.
- The delta file created when you ran the DiffGen tool.

## Deploy the delta update to your devices

When you deploy a delta update, the experience in the Azure portal looks identical to deploying a regular image update. For more information on deploying updates, see  [Deploy an update by using Device Update for Azure IoT Hub](deploy-update.md)

Once you've created the deployment for your delta update, the Device Update service and client automatically identify if there's a valid delta update for each device you're deploying to. If a valid delta is found, the delta update will be downloaded and installed on that device. If there's no valid delta update found, the full image update (the recompressed target SWU image) will be downloaded instead as a fallback. This approach ensures that all devices you're deploying the update to will get to the appropriate version.

There are three possible outcomes for a delta update deployment:

- Delta update installed successfully. Device is on new version.
- Delta update was unavailable or failed to install, but a successful fallback install of the full image occurred instead. Device is on new version.
- Both delta and fallback to full image failed. Device is still on old version.

To determine which of the above outcomes occurred, you can view the install results with error code and extended error code by selecting any device that is in a failed state. You can also [collect logs](device-update-log-collection.md) from multiple failed devices if needed.

If the delta update succeeded, the device shows a "Succeeded" status.

If the delta update failed but did a successful fallback to the full image, it shows the following error status:

- resultCode: _[value greater than 0]_
- extendedResultCode: _[non-zero]_

If the update was unsuccessful, it shows an error status that can be interpreted using the instructions below:

- Start with the Device Update Agent errors in [result.h](https://github.com/Azure/iot-hub-device-update/blob/main/src/inc/aduc/result.h).

  - Errors from the Device Update Agent that are specific to the Download Handler functionality used for delta updates begin with 0x9:

    | Component | Decimal | Hex | Note |
    |--|--|--|--|
    | EXTENSION_MANAGER | 0 | 0x00 | Indicates errors from extension manager download handler logic.  Example: 0x900XXXXX |
    | PLUGIN | 1 | 0x01 | Indicates errors with usage of download handler plugin shared libraries.  Example: 0x901XXXXX |
    | RESERVED | 2 - 7 | 0x02 - 0x07 | Reserved for Download handler.   Example: 0x902XXXXX |
    | COMMON | 8 | 0x08 | Indicates errors in Delta Download Handler extension top-level logic.   Example: 0x908XXXXX |
    | SOURCE_UPDATE_CACHE | 9 | 0x09 | Indicates errors in Delta Download handler extension Source Update Cache.   Example: 0x909XXXXX |
    | DELTA_PROCESSOR | 10 | 0x0A | Error code for errors from delta processor API.   Example: 0x90AXXXXX |

  - If the error code isn't present in [result.h](https://github.com/Azure/iot-hub-device-update/blob/main/src/inc/aduc/result.h), it's likely an error in the delta processor component (separate from the Device Update agent). If so, the extendedResultCode will be a negative decimal value of the following hexadecimal format: 0x90AXXXXX

    - 9 is "Delta Facility"
    - 0A is "Delta Processor Component" (ADUC_COMPONENT_DELTA_DOWNLOAD_HANDLER_DELTA_PROCESSOR)
    - XXXXX is the 20-bit error code from FIT delta processor

- If you aren't able to solve the issue based on the error code information, file a GitHub issue to get further assistance.

## Next steps

[Troubleshoot common issues](troubleshoot-device-update.md)
