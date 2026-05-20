---
title: Deploy delta updates with Azure Device Update for IoT Hub | Microsoft Learn
description: Generate, configure, import, and deploy delta or differential updates with Azure Device Update for IoT Hub
author: cwatson-cat
ms.author: cwatson
ms.date: 02/14/2025
ms.topic: how-to
ms.service: azure-iot-hub

---

# Deploy delta updates to devices

This article shows how to generate delta update files, import them into Azure Device Update for IoT Hub, and deploy them to devices. Delta files can be generated either by using the DiffGen tool or as part of a Yocto-based build. For an overview, see [Azure Device Update for IoT Hub delta updates](delta-updates.md).

> [!NOTE]
> Delta update support is provided through the Device Update agent reference implementation, which can be integrated and adapted as part of your device update workflow. Delta updates are available starting with Device Update agent reference implementation version 1.3.0 or later. 

## Prerequisites

- An Azure Device Update for IoT Hub account and instance.
- An IoT device or simulator provisioned for Device Update with agent reference implementation version 1.3.0 or later integrated. For instructions, see [Device Update agent provisioning](device-update-agent-provisioning.md).
- Source and target update files in **SWUpdate (SWU) format**, with a raw image inside. The Microsoft reference sample uses the **Ext4** filesystem, but **Ext2** and **Ext3** are also supported.

## Configure the device

To apply delta updates, the device needs the Device Update agent with a compatible update handler and the delta processor extension installed. The following sections describe how to set up each component.

## Update handler

The update handler integrates with the Device Update agent to perform the actual update installation on the device.

For delta updates, start with the [microsoft/swupdate:2 update handler](https://github.com/Azure/iot-hub-device-update/blob/develop/src/extensions/step_handlers/swupdate_handler_v2/README.md) if you don't already have a custom SWUpdate update handler.

> [!NOTE]
> The SWUpdate handler is not included by default. When integrating the Device Update agent reference implementation, ensure that the handler is included or registered as part of your device image or build.

## Delta processor extension

The delta processor extension reconstructs the full target update on the device by combining the downloaded delta update with the source update already on the device. The update handler then installs the reconstructed update.

There are two ways to install the delta processor extension. Both options result in the extension being available on the device — the difference is whether you install it directly on the device or include it during your device image build.

- **Option 1:** Install the extension directly on the device. This is the most common approach if you're using a prebuilt operating system or working with an existing device.
- **Option 2:** Include the extension as part of your device image build. This option applies if you already build and manage your own device images (for example, with Yocto).

### Option 1: Install the extension on the device

Use this option if you want to install the delta processor extension on an existing device. This approach is recommended if you're using a prebuilt operating system or if you're not modifying your device image.

Download the delta processor extension from the [Azure/iot-hub-device-update-delta repository](https://github.com/Azure/iot-hub-device-update-delta). 

Prebuilt packages are available under the [3.0.0 release](https://github.com/Azure/iot-hub-device-update-delta/tree/main/preview/3.0.0). Choose the package that matches the OS and architecture of your device. 

For Ubuntu 20.04 and later, install the Debian package directly. 

If a prebuilt package isn't available for your platform, follow the build and installation instructions in the repository [README](https://github.com/Azure/iot-hub-device-update-delta) to build the extension from source. 

After building the library, copy the shared object `libadudiffapi.so` to `/usr/lib` and update the system library cache:

```bash
sudo cp <path to libadudiffapi.so> /usr/lib/libadudiffapi.so
sudo ldconfig
```

> [!NOTE]
> The prebuilt library version must match your device's OS and architecture. If a compatible package isn't available, build the extension from source using the instructions in the repository.

### Option 2: Integrate with a Yocto build

Use this option if you build your own device image and want the delta processor extension to be included as part of that image.

With this approach, the extension is installed during the image build, so you don't need to install it separately on the device.

To integrate delta update support into your build, use the Yocto layers provided in the [iot-hub-device-update-yocto repository](https://github.com/Azure/iot-hub-device-update-yocto/blob/feature/vnext-delta/README.md).

For details on the available layers and how to include them in your build, see the [Microsoft-provided Yocto layers section](https://github.com/Azure/iot-hub-device-update-yocto/blob/feature/vnext-delta/README.md#microsoft-provided-yocto-layers).

For information about how delta components are packaged and made available as part of the build output, see [Delta tools distribution](https://github.com/Azure/iot-hub-device-update-yocto/blob/feature/vnext-delta/docs/delta-tools-distribution.md).

After building the image with these layers included, the delta processor extension is already available on the device and no additional installation steps are required.

---

After completing either option, the delta processor extension is installed on the device and ready to reconstruct delta updates during deployment.

## Prepare the source update on the device

A delta update requires a valid source update to be available on the device. During installation, the delta update is combined with the source update on the device to reconstruct the full target update.

The simplest way to make the source update available on the device is to [import](import-update.md) and [deploy](deploy-update.md) a full update through the Device Update service. When the device installs the update, the Device Update agent automatically caches it for use with future delta updates.

This behavior is the same regardless of how you install the delta processor extension. For example, if you're using a Yocto-based image, the installed update is still cached automatically after deployment, so no extra steps are required.

> [!NOTE]
> A device receiving its first update can't apply a delta, since no source update is cached yet. After the first full update is installed and cached, subsequent updates can use the delta path.

If you need to pre-stage the source update manually instead of relying on the cache, place the image at:`<BASE_SOURCE_DOWNLOAD_CACHE_PATH>/sha256-<ENCODED HASH>`

Where:

- `<BASE_SOURCE_DOWNLOAD_CACHE_PATH>` is the base directory path used for cached source updates. By default, this path is `/var/lib/adu/sdc/<provider>`.

- `<provider>` is the `provider` value from the [update identity](import-concepts.md#update-identity) of the source SWU file.

- `<ENCODED_HASH>` is the base64-encoded SHA256 hash of the source image, with the following substitutions:

| Character     | Encoded as     |
|---------------|----------------|
| `+`           | `_2B`          |
| `/`           | `_2F`          |
| `=`           | `_3D`          |

## Generate a delta update file

Generate delta update files by using DiffGen, a Microsoft-provided reference tool that runs on a build machine.

DiffGen takes a source SWU file and a target SWU file as inputs, recompresses the target by using gzip, and produces a delta update file that contains only the differences between the two.

There are two ways to generate delta update files:

- **Option 1:** Download and run DiffGen on a build machine  
- **Option 2:** Use delta generation tools from a Yocto build


### Option 1: Download and run DiffGen manually

Use this option if you're generating delta updates on a separate development or build machine.

Download the DiffGen tool from the [Azure/iot-hub-device-update-delta repository](https://github.com/Azure/iot-hub-device-update-delta). 

Prebuilt binaries are available in the [3.0.0 release](https://github.com/Azure/iot-hub-device-update-delta/tree/main/preview/3.0.0). Choose the version that matches the OS and architecture of your build machine.

For additional details about the DiffGen tool and its usage, see the [Diff Generation (DiffGen) section](https://github.com/Azure/iot-hub-device-update-delta#diff-generation) in the repository.

Run DiffGen on a build machine. Ubuntu 20.04 or 22.04 (or Windows Subsystem for Linux) is recommended.

Before running DiffGen, install the following on your build machine:

| Dependency       | Where to get it | How to install |
|----------------|-----------------|----------------|
| DiffGen tool   | [Azure/iot-hub-device-update-delta repository](https://github.com/Azure/iot-hub-device-update-delta) | Download the version that matches your OS and architecture |
| .NET runtime   | Package manager or terminal | See [Install .NET on Linux](/dotnet/core/install/linux). Only the runtime is required. |


### Option 2: Use DiffGen from a Yocto build

Use this option if you build your device image with Yocto and want to use the tools generated as part of that build.

During a Yocto-based build, the DiffGen tool and related components are produced along with the device image. You can package and run these 
tools on a compatible build host.

To get started, see the [iot-hub-device-update-yocto repository](https://github.com/Azure/iot-hub-device-update-yocto), which provides the required layers and build configuration.

For details on how to package and use the generated tools, see [Delta tools distribution](https://github.com/Azure/iot-hub-device-update-yocto).

## Run DiffGen

After installing the dependencies, run DiffGen by using the following syntax:

```bash
DiffGenTool <source_archive> <target_archive> <output_path> <log_folder> <working_folder> <recompressed_target_archive>
```

This command runs the `recompress_tool.py` script, which creates the `<recompressed_target_archive>`. DiffGen uses the recompressed archive instead of `<target_archive>` when generating the delta update. Image files within the recompressed archive are compressed by using gzip.

If your SWU files are signed, include the `<signing_command>` argument:

```bash
DiffGenTool <source_archive> <target_archive> <output_path> <log_folder> <working_folder> <recompressed_target_archive> "<signing_command>"
```
When you provide a signing command, DiffGen runs the `recompress_and_sign_tool.py` script. This script creates the `<recompressed_target_archive>` and signs the `sw-description` file inside it, producing a `sw-description.sig` file.

To generate a delta update between a source file and a recompressed and re-signed target file, use the sample `sign_file.sh` script from the [Azure/iot-hub-device-update-delta](https://github.com/Azure/iot-hub-device-update-delta/tree/main/src/scripts/signing_samples/openssl_wrapper) repository. Update the script to include the path to your private key, and then run it as part of the DiffGen command. See the examples section for usage.

### DiffGen arguments

| Argument | Description |
|--|--|
| `<source_archive>` | The base SWU file that DiffGen uses as the starting point for delta generation. **Important:** This file must exactly match the update already present on the device (for example, cached from a previous deployment). |
| `<target_archive>` | The SWU file that the device is updated to. |
| `<output_path>` | The path on the build machine where the generated delta file is written, including the desired file name. If the path doesn't exist, the tool creates it. |
| `<log_folder>` | The directory where logs are written. It's recommended to use a subfolder of the output path. If the path doesn't exist, the tool creates it. |
| `<working_folder>` | A directory for intermediate files created during delta generation. It's recommended to use a subfolder of the output path. If the path doesn't exist, the tool creates it. |
| `<recompressed_target_archive>` | The path where the recompressed target archive is created. This file is used instead of `<target_archive>` during delta generation. If it already exists, the tool overwrites it. Define this file in a subfolder of the output path. |
| `"<signing_command>"` *(optional)* | A command used to sign the `sw-description` file within the `<recompressed_target_archive>`. The signing command must produce a corresponding `.sig` file.<br><br>Wrap the entire command in double quotes so it is passed as a single argument. Avoid using `~` in file paths; use full paths instead (for example, `/home/user/keys/priv.pem`). |

### DiffGen examples

The following examples assume a working directory of `/mnt/o/temp` in Windows Subsystem for Linux.

Create a delta update:

```bash
sudo ./DiffGenTool  
/mnt/o/temp/<source file>.swu
/mnt/o/temp/<target file>.swu
/mnt/o/temp/<delta file to create>
/mnt/o/temp/logs
/mnt/o/temp/working
/mnt/o/temp/<recompressed target file to create>.swu
```  

Create a delta update with signing:

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

---

## Import the delta update

The basic process for importing a delta update into the Device Update service is the same as importing any other update. For background information, see [How to prepare an update to be imported into Azure Device Update for IoT Hub](create-update.md).

### Generate the import manifest

To import an update into the Device Update service, you must have or create an import manifest file. For more information, see [Importing updates into Device Update](import-concepts.md#import-manifest).

For delta updates, the import manifest must reference the following files created by the DiffGen tool:

- The `<recompressed_target_file>` SWU image
- The `<delta file>`

Delta updates use a capability called [related files](related-files.md), which requires a version 5 or later import manifest. To use this feature, include both the [relatedFiles](import-schema.md#relatedfiles-object) and [downloadHandler](import-schema.md#downloadhandler-object) objects in your manifest.

You use the `relatedFiles` object to specify information about the delta update file, including the file name, file size, and sha256 hash. Most importantly, you must also specify the following two properties that are unique to the delta update feature:

```json
"properties": {
      "microsoft.sourceFileHashAlgorithm": "sha256",
      "microsoft.sourceFileHash": "<source SWU image file hash>"
}
```

Both properties refer to the source update used as input to the DiffGen tool when generating the delta update. The import manifest requires this information even though the source SWU file is not included in the import.

The delta components on the device use this metadata about the source image to locate that image on the device after downloading the delta update.

Use the following `downloadHandler` unless your implementation of the Device Update agent has been modified in a way that changes the expected delta download and installation behavior:

```json
"downloadHandler": {
  "id": "microsoft/delta:1"
}
```
#### Generate the import manifest using the Azure CLI

You can use the Azure CLI [`az iot du update init v5`](/cli/azure/iot/du/update/init#az-iot-du-update-init-v5) command to generate an import manifest for your delta update. For more information, see [Create a basic import manifest](create-update.md#create-a-basic-device-update-import-manifest).

```azurecli
--update-provider <replace with your Provider> --update-name <replace with your update Name> --update-version <replace with your update Version> --compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> --step handler=microsoft/swupdate:2 properties=<replace with any desired handler properties (JSON-formatted), such as '{"installedCriteria": "1.0"}'> --file path=<replace with path(s) to your update file(s), including the full file name> downloadHandler=microsoft/delta:1 --related-file path=<replace with path(s) to your delta file(s), including the full file name> properties='{"microsoft.sourceFileHashAlgorithm": "sha256", "microsoft.sourceFileHash": "<replace with the source SWU image file hash>"}' 
```

Save your generated import manifest JSON with the file extension `*.importmanifest.json`.

### Import using the Azure portal

After you create your import manifest, import the delta update by following the instructions in [Add an update to Device Update for IoT Hub](import-update.md#import-an-update). 

Include the following items in the import:

- The `*.importmanifest.json` file
- The `<recompressed_target_file>` SWU image created by DiffGen
- The `<delta file>` created by DiffGen

## Deploy the delta update

Deploying a delta update follows the same process as deploying a full image update. For step-by-step instructions, see [Deploy an update by using Device Update](deploy-update.md).

To support devices running different starting versions, include a delta update for each source version you want to support, along with the full target update.

For example:

- A **v1 → v3** delta update  
- A **v2 → v3** delta update 
- A full **v3** update  

After you create a deployment, the Device Update service and client automatically determine whether a valid delta update is available for each device.

- If a valid delta applies (for example, devices on **v1** or **v2**), the device downloads and installs the delta update.  
- If no valid delta is available (for example, devices on **v0**), the device downloads and installs the full update (the recompressed target SWU image) instead.

This behavior ensures that all devices can update to the target version, even if a matching delta update isn't available.

### Deployment outcomes

After deployment, one of the following outcomes occurs:

- The delta update installs successfully, and the device updates to the target version.  
- The delta update is unavailable or fails, but the fallback full update installs successfully.  
- Both the delta update and fallback full update fail, and the device remains on the previous version.  

To determine the outcome for a device, view its installation results in the Azure portal. For failed updates, review the `resultCode` and `extendedResultCode`.

- If the delta update succeeds, the device shows a **Succeeded** status.  
- If the delta update fails but the fallback succeeds, the device shows an error status with:

  - `resultCode`: \<value greater than 0>  
  - `extendedResultCode`: \<non-zero value>

You can also collect logs from failed devices if needed. For more information, see [collect logs](device-update-log-collection.md).

## Troubleshoot failed updates

Unsuccessful updates display an error status that you can interpret by using the following instructions. 

Start with the Device Update agent error definitions in [result.h](https://github.com/Azure/iot-hub-device-update/blob/main/src/inc/aduc/result.h).

Errors from the Device Update agent that are specific to the delta updates download handler functionality begin with `0x9`:

| Component | Decimal | Hex | Note |
|--|--|--|--|
| EXTENSION_MANAGER | 0 | 0x00 | Indicates errors from extension manager download handler logic. Example: `0x900XXXXX` |
| PLUGIN | 1 | 0x01 | Indicates errors with usage of download handler plugin shared libraries. Example: `0x901XXXXX` |
| RESERVED | 2 - 7 | 0x02 - 0x07 | Reserved for download handler. Example: `0x902XXXXX` |
| COMMON | 8 | 0x08 | Indicates errors in delta download handler extension top-level logic. Example: `0x908XXXXX` |
| SOURCE_UPDATE_CACHE | 9 | 0x09 | Indicates errors in delta download handler extension source update cache. Example: `0x909XXXXX` |
| DELTA_PROCESSOR | 10 | 0x0A | Error code for errors from delta processor API. Example: `0x90AXXXXX` |

If the error code isn't present in [result.h](https://github.com/Azure/iot-hub-device-update/blob/main/src/inc/aduc/result.h), it likely originates from the delta processor extension. In that case, the `extendedResultCode` is a negative decimal value in the hexadecimal format `0x90AXXXXX`, where:

- `9` indicates the Delta facility 
- `0A` indicates the delta processor component (ADUC_COMPONENT_DELTA_DOWNLOAD_HANDLER_DELTA_PROCESSOR)
- `XXXXX` is the 20-bit error code returned by the delta processor

If you can't resolve the issue by using the error code, collect logs from the device and file a GitHub issue for further assistance.

## Related content

- [Azure Device Update for IoT Hub delta updates](delta-updates.md)
- [Azure Device Update for IoT Hub import manifest schema](import-schema.md)
- [Troubleshoot common issues](troubleshoot-device-update.md)