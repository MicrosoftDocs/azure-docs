---
title: Understand Device Update for Azure IoT Hub delta update capabilities | Microsoft Docs
description: Key concepts for using delta (differential) updates with Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 08/24/2022
ms.topic: conceptual
ms.service: iot-hub-device-update
---

# How to understand and use delta updates in Device Update for IoT Hub

Delta updates allow you to generate a small update that represents only the changes between two full updates - a source image and a target image. This approach is ideal for reducing the bandwidth used to download an update to a device, particularly if there have been only a few changes between the source and target updates.

## Requirements for using delta updates in Device Update for IoT Hub

- The source and target updates must:  
  - Be SWU ".swu" format (SWUpdate)  
  - Use Ext2, Ext3, or Ext4 filesystem  
  - Be a raw image (writeable to device)  
  - Compressed originally with gzip or Zstandard (zstd)
- The delta generation process recompresses the target SWU update using zstd compression in order to produce an optimal delta. You'll import this recompressed target SWU update to the Device Update service along with the generated delta update file.
- Enable zstd decompression in SWUpdate on the device.  
  - Requires using [SWUpdate 2019.11](https://github.com/sbabic/swupdate/releases/tag/2019.11) or later.

## Prerequisites for using delta updates

In order to use the Device Update delta update preview, you'll need some files. Download all the files in **iot-hub-device-update/tools/delta/**, as we'll reference those items at various points in the instructions below.

## Configure a device with Device Update agent and delta processor component

### Device Update agent

Add the Device Update agent to a device and configure it for use. Use the latest early access version of the agent. For instructions, see [Device Update agent provisioning](device-update-agent-provisioning.md).

Also, include an SWUpdate [update handler](device-update-agent-overview.md#update-handlers) that integrates with the Device Update agent to perform the actual update install. We recommend starting with the [`microsoft/swupdate:2` update handler](https://github.com/Azure/iot-hub-device-update/blob/release/1.0/src/extensions/step_handlers/swupdate_handler_v2/README.md) if you don't already have your own SWUpdate update handler that you want to modify. If you use your own update handler, be sure to enable zstd decompression in SWUpdate.

### Delta processor

You'll find all the delta processor code in the file you previously downloaded: **Delta_processor.zip**

To add the delta processor component to your device image and configure it for use, use apt-get to install the proper Debian package for your platform (it should be named ms-adu_diffs_x.x.x_amd64.deb for amd64):  

```bash
sudo apt-get install <path to Debian package>
```

Alternatively, on a non-Debian Linux device you can install the shared object (libadudiffapi.so) directly by copying it to the `/usr/lib` directory:  

```bash
sudo cp <path to libadudiffapi.so> /usr/lib/libadudiffapi.so
sudo ldconfig
```

## Deploy a full image update to your device

After a delta update has been downloaded to a device, it must be compared against a valid _source SWU file_ that has been previously cached on the device in order to be re-created into a full image. For this preview, the simplest way to populate this cached image is to deploy a full image update to the device via the Device Update service (using the existing [import](import-update.md) and [deployment](deploy-update.md) processes). As long as the device has been configured with the early access Device Update agent and delta processor, the installed SWU file will be cached automatically by the Device Update agent for future delta update use.

If you instead want to pre-populate the source image on your device, the path where the image is expected is:

`[BASE_SOURCE_DOWNLOAD_CACHE_PATH]/sha256-[ENCODED HASH]`

By default, `BASE_SOURCE_DOWNLOAD_CACHE_PATH` is:

`/var/lib/adu/sdc`

If you're modifying the Device Update agent, you can change the default path to something else if desired via the compile-time configs.

`ENCODED_HASH` is the base64 hex string of the SHA256 of the binary, but after encoding to base64 hex string, it encodes the characters as follows:

- `\+` encoded as `octets _2B`  
- `/` encoded as `octets _2F`  
- `=` encoded as `octets _3D`

## Generate delta updates using the DiffGen tool

### Environment prerequisites

Before creating deltas with DiffGen, several things need to be downloaded and/or installed on the environment machine. We recommend a Linux environment and specifically Ubuntu 20.04 (or WSL if natively on Windows).

The following table provides a list of the content needed, where to retrieve them, and the recommended installation if necessary:

| Binary Name | Where to acquire | How to install |
|--|--|--|
| DiffGen | You'll find all the DiffGen code in the file you previously downloaded: **Delta_generation.zip** | Download all content and place into a known directory. |
| .NET (Runtime) | Via Terminal / Package Managers | Since running a pre-built version of the tool, only the Runtime is required. [Microsoft Doc Link](/dotnet/core/install/linux-ubuntu.md). |

### Dependencies

The zstd_compression_tool is used for decompressing an archive's image files and recompressing them with zstd. This process ensures that all archive files used for diff generation have the same compression algorithm for the images inside the archives.

Commands to install required packages/libraries:  

```bash
sudo apt update  
sudo apt-get install -y python3 python3-pip  
sudo pip3 install libconf zstandard
```

### Run DiffGen

The DiffGen tool is run with several arguments. All arguments are required, and overall syntax is as follows:

`DiffGenTool [source_archive] [target_archive] [output_path] [log_folder] [working_folder] [recompressed_target_archive]`  

- The script recompress_tool.py will be run to create the file [recompressed_target_archive], which will then be used instead of [target_archive] as the target file for creating the diff.
- The image files within [recompressed_target_archive] will be compressed with zstd.

If your SWU files are signed (likely), you'll need another argument as well:

`DiffGenTool [source_archive] [target_archive] [output_path] [log_folder] [working_folder] [recompressed_target_archive] "[signing_command]"`

- In addition to using [recompressed_target_archive] as the target file, providing a signing command string parameter will run recompress_and_sign_tool.py to create the file [recompressed_target_archive] and have the sw-description file within the archive signed (meaning a sw-description.sig file will be present).

The following table describes the arguments in more detail:

| Argument | Description |
|--|--|
| [source_archive] | This is the image that the delta will be based against when creating the delta. Important: the image must be identical to the image that is already present on the device (for example, cached from a previous update). |
| [target_archive] | This is the image that the delta will update the source image to when creating the delta. |
| [output_path] | The path (including the desired name of the delta file being generated) on the host machine where the delta will get placed after creation.  If the path doesn't exist, the directory will be created by the tool. |
| [log_folder] | The path on the host machine where logs will get created and dropped into. We recommend defining this location as a sub folder of the output path. If path doesn't exist, it will be created by the tool. |
| [working_folder] | Path on the machine where collateral and other working files are placed during the delta generation. We recommend defining this location as a subfolder of the output path. If the path doesn't exist, it will be created by the tool. |
| [recompressed_target_archive] | The path on the host machine where the recompressed target file will be created. This file will be used instead of <target_archive> as the target file for diff generation. If this path exists before calling DiffGenTool, the path will be overwritten. We recommend defining this path as a file in the subfolder of the output path. |
| "[signing_command]" _(optional)_ | The desired command used for signing the sw-description file within the recompressed archive file. The sw-description file in the recompressed archive is used as an input parameter for the signing command; DiffGenTool expects the signing command to create a new signature file, using the name of the input with `.sig` appended. Surrounding the parameter in double quotes is needed so that the whole command is passed in as a single parameter. Don't put the '~' character in a key path used for signing, use the full home path instead (for example, use /home/USER/keys/priv.pem instead of ~/keys/priv.pem). |

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

If you're also using the signing parameter (needed if your .swu file is signed), you can use the sample `sign_file.sh` script that you previously downloaded. First, open the script and edit it to add the path to your private key file. Save the script, and then run DiffGen as follows:

_Creating diff between input source file and recompressed/re-signed target file:_

```bash
sudo ./DiffGenTool  
/mnt/o/temp/[source file.swu]  
/mnt/o/temp/[delta file to be created]  
/mnt/o/temp/logs  
/mnt/o/temp/working  
/mnt/o/temp/[recompressed file to be created.swu]  
/mnt/o/temp/[path to script]/sign_file.sh
```  

If you encounter an error "_Parameters failed. Status: MissingBinaries Issues: dumpextfs zstd_compress_file bsdiff_", add executable permissions for those files (such as set chmod 755).

## Import the generated delta update

### Generate import manifest

The basic process of importing an update to the Device Update service is unchanged  for delta updates, so if you haven't already, be sure to review this page:

[How to prepare an update to be imported into Azure Device Update for IoT Hub](create-update.md)

Importantly, however, there are specific aspects of delta support that aren't fully implemented yet for this preview. Therefore, we've created a script to simplify the process during early access, which you previously downloaded: **New-ImportManifest.ps1**. The script uses PowerShell, which can be [installed](/powershell/scripting/install/installing-powershell.md) on Linux, Windows, or macOS.

The first step in importing an update into the Device Update service is always to create an import manifest. For more information about import manifests, see [Importing updates into Device Update](import-concepts.md#import-manifest), but note that delta updates require a new import manifest format that isn't yet ready for our public documentation. Therefore, use New-ImportManifest.ps1 instead to generate your import manifest.

The script includes example usage. The new/unique elements for delta update relative to our publicly documented import manifest format are "-DeltaFile" and "-SourceFile", and there's a specific usage for the "-File" element as well:

- The **File** element represents the target update used when generating the delta.
- The **SourceFile** element represents the source update used when generating the delta.
  - Of note, this version is also the update version that must be available on the device.
- The **DeltaFile** element represents the generated delta (the output of the DiffGen tool when used with the appropriate source and target updates).

### Import using the Azure portal

To import the delta update, follow the instructions in [Add an update to Device Update for IoT Hub](import-update.md#import-an-update). You must include these items when importing:

- The import manifest .json file you created in the previous step.
- The recompressed target SWU image created when you ran the DiffGen tool.
- The delta file created when you ran the DiffGen tool.

## Deploy the delta update to your devices

When you deploy a delta update, the experience in the Azure portal looks identical to deploying a regular image update. For more information on deploying updates, see  [Deploy an update by using Device Update for Azure IoT Hub](deploy-update.md)

Once you've created the deployment for your delta update, the Device Update service and client automatically identify if there's a valid delta update for each device you're deploying to. If a valid delta is found, the delta update will be downloaded and installed on that device. If there's no valid delta update found, the full image update (the Target SWU update) will be downloaded instead. This approach ensures that all devices you're deploying the update to will get to the appropriate version.

There are three possible outcomes for a delta update deployment:

- Delta update installed successfully. Device is on new version.
- Delta update failed to install, but a successful fallback install of the full image occurred instead. Device is on new version.
- Both delta and fallback to full image failed. Device is still on old version.

To determine which of the above outcomes occurred, you can view the install results with error code and extended error code by selecting any device that is in a failed state. You can also [collect logs](device-update-log-collection.md) from multiple failed devices if needed.

If the delta update succeeded:

- resultCode: _[value greater than 0]_
- extendedResultCode: 0

If the delta update failed but did a successful fallback to full image:

- resultCode: _[value greater than 0]_
- extendedResultCode: _[non-zero; will be further defined by GA]_

If the update was unsuccessful:

- Start with the Device Update Agent errors in [result.h](https://github.com/Azure/iot-hub-device-update/blob/early-access/0.9/src/inc/aduc/result.h).

  - Errors from the Device Update Agent that are specific to the Download Handler functionality used for delta updates begin with 0x9:

    | Component | Decimal | Hex | Note |
    |--|--|--|--|--|
    | EXTENSION_MANAGER | 0 | 0x00 | Indicates errors from extension manager download handler logic.  Example: 0x900XXXXX |
    | PLUGIN | 1 | 0x01 | Indicates errors with usage of download handler plugin shared libraries.  Example: 0x901XXXXX |
    | RESERVED | 2 - 7 | 0x02 - 0x07 | Reserved for Download handler.   Example: 0x902XXXXX |
    | COMMON | 8 | 0x08 | Indicates errors in Delta Download Handler extension top-level logic.   Example: 0x908XXXXX |
    | SOURCE_UPDATE_CACHE | 9 | 0x09 | Indicates errors in Delta Download handler extension Source Update Cache.   Example: 0x909XXXXX |
    | DELTA_PROCESSOR | 10 | 0x0A | Error code for errors from delta processor API.   Example: 0x90AXXXXX |

  - If the error code isn't present in the PDF, it's likely an error in the delta processor component (separate from the Device Update agent). If so, the extendedResultCode will be a negative decimal value of the following hexadecimal format: 0x90AXXXXX

    - 9 is "Delta Facility"
    - 0A is "Delta Processor Component" (ADUC_COMPONENT_DELTA_DOWNLOAD_HANDLER_DELTA_PROCESSOR)
    - XXXXX is the 20-bit error code from FIT delta processor

- If you aren't able to solve the issue based on the error code information, file a GitHub issue so we can address it.

## Next steps

[Troubleshoot common issues](troubleshoot-device-update.md)
