---
title: Azure Device Update for IoT Hub delta updates | Microsoft Learn
description: Understand key concepts for using delta or differential updates with Azure Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 02/14/2025
ms.topic: conceptual
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Delta updates (Preview)

Delta updates allow you to generate small updates that represent only the changes between two full updates, a source image and a target image. This approach is ideal for reducing the bandwidth used to download an update to a device, especially if there are only a few changes between the source and target updates.

>[!NOTE]
>The delta update feature in Azure Device Update for IoT Hub is currently in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Requirements for using delta updates in Device Update for IoT Hub

- The source and target update files must be in SWUpdate (SWU) format.
- Within each SWUpdate file, there must be a raw image that uses the Ext2, Ext3, or Ext4 filesystem.

The delta generation process recompresses the target SWU update using gzip compression to produce an optimal delta. You import the recompressed target SWU update to the Device Update service along with the generated delta update file.

## Device Update agent configuration for the delta processor component

To download and install delta updates from the Device Update service, your device needs the Device Update agent with the update handler and delta processor component present and configured.

### Device Update agent

The Device Update agent _orchestrates_ the update process on the device, including download, install, and restart actions. To add the Device Update agent to a device and configure it for use, see [Device Update agent provisioning](device-update-agent-provisioning.md). Use agent version 1.0 or later.

### Update handler

An update handler integrates with the Device Update agent to perform the actual update install. For delta updates, start with the [`microsoft/swupdate:2` update handler](https://github.com/Azure/iot-hub-device-update/blob/main/src/extensions/step_handlers/swupdate_handler_v2/README.md) if you don't already have your own SWUpdate update handler that you want to modify.

### Delta processor

The delta processor at [Azure/iot-hub-device-update-delta](https://github.com/Azure/iot-hub-device-update-delta) re-creates the original SWU image file on your device after the delta file downloads, so your update handler can install the SWU file. To add the delta processor component to your device image and configure it for use, you can download a Debian package for Ubuntu 20.04 and later from [https://github.com/Azure/iot-hub-device-update-delta/tree/main/preview/2.0.0](https://github.com/Azure/iot-hub-device-update-delta/tree/main/preview/2.0.0).

If you use another distro, follow the *README.md* instructions to use CMAKE to build the delta processor from source instead. From there, install the shared object *libadudiffapi.so* directly by copying it to the */usr/lib* directory, as follows:

```bash
sudo cp <path to libadudiffapi.so> /usr/lib/libadudiffapi.so
sudo ldconfig
```

### Add a source SWU image file to your device

After the delta update file downloads to a device, it is compared against a valid `<source_archive>` previously cached on the device. This process enables the delta update to recreate the full target image.

The simplest way to populate this cached image is to [import](import-update.md) and [deploy](deploy-update.md) a full image update to the device via the Device Update service. If the device is configured with Device Update agent version 1.0 or later and the delta processor, the agent caches the installed SWU file automatically for later delta update use.

If you want to directly prepopulate the source image on your device instead, the path where the image is expected is `<BASE_SOURCE_DOWNLOAD_CACHE_PATH>/sha256-<ENCODED HASH>`. By default, `<BASE_SOURCE_DOWNLOAD_CACHE_PATH>` is the path */var/lib/adu/sdc/\<provider>*. The `provider` value is the `provider` part of the [updateId](import-concepts.md#update-identity) for the source SWU file.

`ENCODED_HASH` is the base64 hex string of the SHA256 of the binary, but after encoding to base64 hex string, it encodes the characters as follows:

- `+` encoded as `octets _2B`  
- `/` encoded as `octets _2F`  
- `=` encoded as `octets _3D`

## Delta update generation using the DiffGen tool

You can create delta updates by using the [Diff Generation (DiffGen) tool](https://github.com/Azure/iot-hub-device-update-delta?tab=readme-ov-file#diff-generation).

### Environment prerequisites

Before you create deltas with DiffGen, you need to download and install several things on the environment machine. Ideally, use an Ubuntu 20.04 Linux environment, or Windows Subsystem for Linux if you're on Windows.

The following table shows the content needed, where to get it, and recommended installation if necessary.

| Binary name | Where to acquire | How to install |
|--|--|--|
| DiffGen | [Azure/iot-hub-device-update-delta](https://github.com/Azure/iot-hub-device-update-delta/tree/main/preview/2.0.0) GitHub repo |Download the version matching the OS or distro on the machine to be used to generate delta updates. |
| .NETCore runtime, version 8.0.0 | Via Terminal or package managers | [Install .NET on Linux](/dotnet/core/install/linux). Only the runtime is required. |

### Delta update creation using DiffGen

The DiffGen tool runs with the following required arguments and syntax:

`DiffGenTool <source_archive> <target_archive> <output_path> <log_folder> <working_folder> <recompressed_target_archive>`  

The preceding command runs the *recompress_tool.py* script, which creates the `<recompressed_target_file>`. DiffGen then uses the `<recompressed_target_file>`instead of `<target_archive>` as the target file for creating the diff. Image files within the `<recompressed_target_archive>` are compressed with gzip.

If your SWU files are signed, they also require the `<signing_command>` argument in the DiffGen command:

`DiffGenTool <source_archive> <target_archive> <output_path> <log_folder> <working_folder> <recompressed_target_archive> "<signing_command>"`

The DiffGenTool with signing command string parameter runs the *recompress_and_sign_tool.py* script. This script creates the `<recompressed_target_file>`. In addition, this script also signs the *sw-description* file within the archive to create a  *sw-description.sig* file.

You can use the sample *sign_file.sh* script from the [Azure/iot-hub-device-update-delta](https://github.com/Azure/iot-hub-device-update-delta/tree/main/src/scripts/signing_samples/openssl_wrapper) GitHub repo to create a diff between the input source file and a recompressed and re-signed target file. Open the script, edit it to add the path to your private key file, and save it. See the [Examples](#diffgen-examples) section for sample usage.

The following table describes the arguments in more detail:

| Argument | Description |
|--|--|
| `<source_archive>` | The base image that DiffGen uses as a starting point to create the delta. **Important**: This image must be identical to the image already present on the device, for example cached from a previous update. |
| `<target_archive>` | The image that the delta updates the device to. |
| `<output_path>` | The path on the host machine to place the delta file in after creation, including desired name of the generated delta file. If the path doesn't exist, the tool creates it. |
| `<log_folder>` | The path on the host machine to create logs in. It's best to define this location as a subfolder of the output path. If the path doesn't exist, the tool creates it. |
| `<working_folder>` | The path on the machine to place collateral and other working files in during the delta generation. It's best to define this location as a subfolder of the output path. If the path doesn't exist, the tool creates it. |
| `<recompressed_target_archive>` | The path on the host machine to create the `<recompressed_target_file>` in. The `<recompressed_target_file>` is used instead of the `<target_archive>` as the target file for diff generation. If this path exists before calling the DiffGen tool, it's overwritten. It's best to define this file in a subfolder of the output path. |
| `"<signing_command>"` _(optional)_ | A customizable command for signing the *sw-description* file within the `<recompressed_target_archive>`. The *sw-description* file in the recompressed archive is used as an input parameter for the signing command. DiffGen expects the signing command to create a new signature file, using the name of the input with *.sig* appended.<br><br>You must surround the parameter with double quotes to pass in the whole command as a single parameter. Also avoid using the `~` character in a key path used for signing, and use the full home path instead. For example, use */home/USER/keys/priv.pem* instead of *~/keys/priv.pem*. |

### DiffGen examples

The following examples operate out of the */mnt/o/temp* directory in Windows Subsystem for Linux.

The following code creates a diff between the input source file and a recompressed target file:

```bash
sudo ./DiffGenTool  
/mnt/o/temp/<source file>.swu
/mnt/o/temp/<target file>.swu
/mnt/o/temp/<delta file to create>
/mnt/o/temp/logs
/mnt/o/temp/working
/mnt/o/temp/<recompressed target file to create>.swu
```  

If you also use the signing parameter, which you must if your SWU file is signed, you can use the sample *sign_file.sh* script mentioned previously. Open the script, edit it to add the path to your private key file, save the script, and then run DiffGen as follows.

The following code creates a diff between the input source file and a recompressed and re-signed target file:

```bash
sudo ./DiffGenTool  
/mnt/o/temp/<source file>.swu
/mnt/o/temp/<target file>.swu   
/mnt/o/temp/<delta file to create>  
/mnt/o/temp/logs  
/mnt/o/temp/working  
/mnt/o/temp/<recompressed target file to create>.swu  
/mnt/o/temp/<path to script>/<sign_file>.sh
```  

## Generated delta update import

The basic process of importing a delta update to the Device Update service is the same as for any other update. If you haven't already, be sure to review [How to prepare an update to be imported into Azure Device Update for IoT Hub](create-update.md).

### Generate the import manifest

To import an update into the Device Update service, you must have or create an import manifest file. For more information, see [Importing updates into Device Update](import-concepts.md#import-manifest).

Import manifest files for delta updates must reference the following files that the DiffGen tool created:

- The `<recompressed_target_file>` SWU image
- The `<delta file>`

The delta update feature uses a capability called [related files](related-files.md) that requires a version 5 or later import manifest. To use the related files feature, you must include the [relatedFiles](import-schema.md#relatedfiles-object) and [downloadHandler](import-schema.md#downloadhandler-object) objects in your import manifest.

You use the `relatedFiles` object to specify information about the delta update file, including the file name, file size, and sha256 hash. Most importantly, you must also specify the following two properties that are unique to the delta update feature:

```json
"properties": {
      "microsoft.sourceFileHashAlgorithm": "sha256",
      "microsoft.sourceFileHash": "<source SWU image file hash>"
}
```

Both properties are specific to the `<source image file>` you used as an input to the DiffGen tool when you created your delta update. The import manifest needs the information about the source SWU image even though you don't actually import the source image. The delta components on the device use this metadata about the source image to locate that image on the device after they download the delta update.

Use the `downloadHandler` object to specify how the Device Update agent orchestrates the delta update using the related files feature. Unless you customize your own version of the Device Update agent for delta functionality, use the following `downloadHandler`:

```json
"downloadHandler": {
  "id": "microsoft/delta:1"
}
```

You can use the Azure CLI [`az iot du update init v5`](/cli/azure/iot/du/update/init#az-iot-du-update-init-v5) command to generate an import manifest for your delta update. For more information, see [Create a basic import manifest](create-update.md#create-a-basic-device-update-import-manifest).

```azurecli
--update-provider <replace with your Provider> --update-name <replace with your update Name> --update-version <replace with your update Version> --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> --step handler=microsoft/swupdate:2 properties=<replace with any desired handler properties (JSON-formatted), such as '{"installedCriteria": "1.0"}'> --file path=<replace with path(s) to your update file(s), including the full file name> downloadHandler=microsoft/delta:1 --related-file path=<replace with path(s) to your delta file(s), including the full file name> properties='{"microsoft.sourceFileHashAlgorithm": "sha256", "microsoft.sourceFileHash": "<replace with the source SWU image file hash>"}' 
```

Save your generated import manifest JSON with the file extension *.importmanifest.json*.

### Import using the Azure portal

Once you create your import manifest, import the delta update by following the instructions in [Add an update to Device Update for IoT Hub](import-update.md#import-an-update). You must include the following items in the import:

- The *\*importmanifest.json* file that you previously created in the earlier steps
- The `<recompressed_target_file>` SWU image the DiffGen tool created
- The `<delta file>` the DiffGen tool created

## Delta update deployment to devices

The delta update deployment experience in the Azure portal is the same as deploying a regular image update. For more information, see [Deploy an update by using Device Update](deploy-update.md).

Once you create the deployment for your delta update, the Device Update service and client automatically determine if there's a valid delta update for each device you're deploying to. If they find a valid delta, they download and install the delta update on that device.

If they don't find a valid delta update, the full image update (the recompressed target SWU image) is downloaded instead as a fallback. This approach ensures that all devices you're deploying the update to get to the appropriate version.

There are three possible outcomes for a delta update deployment:

- The delta update installed successfully and the device is on the new version.
- The delta update was unavailable or failed to install, but a fallback install of the full image was successful, and the device is on the new version.
- Both the delta and fallback installs failed, and the device is still on the old version.

To determine which failure outcome occurred, you can view the install results with error code and extended error code by selecting any device that's in a failed state. You can also [collect logs](device-update-log-collection.md) from multiple failed devices if necessary.

- If a delta update succeeded, the device shows a **Succeeded** status.
- If a delta update failed but the fallback to the full image succeeded, the device shows the following error status:

  - `resultCode`: \<value greater than 0>
  - `extendedResultCode`: \<non-zero value>

### Troubleshoot failed updates

Unsuccessful updates display an error status that you can interpret using the following instructions. Start with the Device Update agent errors in [result.h](https://github.com/Azure/iot-hub-device-update/blob/main/src/inc/aduc/result.h).

Errors from the Device Update agent that are specific to the delta updates download handler functionality begin with `0x9`:

| Component | Decimal | Hex | Note |
|--|--|--|--|
| EXTENSION_MANAGER | 0 | 0x00 | Indicates errors from extension manager download handler logic. Example: `0x900XXXXX` |
| PLUGIN | 1 | 0x01 | Indicates errors with usage of download handler plugin shared libraries. Example: `0x901XXXXX` |
| RESERVED | 2 - 7 | 0x02 - 0x07 | Reserved for download handler. Example: `0x902XXXXX` |
| COMMON | 8 | 0x08 | Indicates errors in delta download handler extension top-level logic. Example: `0x908XXXXX` |
| SOURCE_UPDATE_CACHE | 9 | 0x09 | Indicates errors in delta download handler extension source update cache. Example: `0x909XXXXX` |
| DELTA_PROCESSOR | 10 | 0x0A | Error code for errors from delta processor API. Example: `0x90AXXXXX` |

If the error code isn't present in [result.h](https://github.com/Azure/iot-hub-device-update/blob/main/src/inc/aduc/result.h), it's probably an error in the delta processor component, separate from the Device Update agent. If so, the `extendedResultCode` is a negative decimal value in the hexadecimal format `0x90AXXXXX`.

- `9` is "Delta Facility"
- `0A` is "Delta Processor Component" (ADUC_COMPONENT_DELTA_DOWNLOAD_HANDLER_DELTA_PROCESSOR)
- `XXXXX` is the 20-bit error code from the Field Installation Tool (FIT) delta processor

If you can't solve the issue based on the error code information, file a GitHub issue to get further assistance.

## Related content

- [Azure Device Update for IoT Hub import manifest schema](import-schema.md)
- [Troubleshoot common issues](troubleshoot-device-update.md)

