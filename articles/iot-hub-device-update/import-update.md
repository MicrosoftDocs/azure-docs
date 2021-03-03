---
title: How to import a new update | Microsoft Docs
description: How-To guide for importing a new update into IoT Hub Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 2/11/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Import New Update
Learn how to import a new update into Device Update for IoT Hub.

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md). It is recommended that you use a S1 (Standard) tier or above for your IoT Hub. 
* An IoT device (or simulator) provisioned for Device Update within IoT Hub.
   * If using a real device, you’ll need an update image file for image update, or [APT Manifest file](device-update-apt-manifest.md) for package update.
* [PowerShell 5](https://docs.microsoft.com/powershell/scripting/install/installing-powershell) or later.
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

> [!NOTE]
> Some data submitted to this service might be processed in a region outside the region this instance was created in.

## Create Device Update Import Manifest

1. Ensure that your update image file or APT Manifest file is located in a directory accessible from PowerShell.

2. Clone [Device Update for IoT Hub repository](https://github.com/azure/iot-hub-device-update), or download it as a .zip file to
a location accessible from PowerShell (once the zip file is downloaded, right click for `Properties` > `General` tab > check `Unblock` in the `Security` section to avoid PowerShell security warning prompts).

3. In PowerShell, navigate to `tools/AduCmdlets` directory and run:

    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
    Import-Module .\AduUpdate.psm1
    ```

4. Run the following commands by replacing the sample parameter values to generate an import manifest, a JSON file that describes the update:
    ```powershell
    $compat = New-AduUpdateCompatibility -DeviceManufacturer 'deviceManufacturer' -DeviceModel 'deviceModel'

    $importManifest = New-AduImportManifest -Provider 'updateProvider' -Name 'updateName' -Version 'updateVersion' `
                                            -UpdateType 'updateType' -InstalledCriteria 'installedCriteria' `
                                            -Compatibility $compat -Files 'updateFilePath(s)'

    $importManifest | Out-File '.\importManifest.json' -Encoding UTF8
    ```

    For quick reference, here are some example values for the above parameters. You can also view the complete [import manifest schema](import-schema.md) for more details.

    | Parameter | Description |
    | --------- | ----------- |
    | deviceManufacturer | Manufacturer of the device the update is compatible with, for example, Contoso
    | deviceModel | Model of the device the update is compatible with, for example, Toaster
    | updateProvider | Provider part of update identity, for example, Fabrikam
    | updateName | Name part of update identity, for example, ImageUpdate
    | updateVersion | Update version, for example, 2.0
    | updateType | <ul><li>Specify `microsoft/swupdate:1` for image update</li><li>Specify `microsoft/apt:1` for package update</li></ul>
    | installedCriteria | <ul><li>Specify value of SWVersion for `microsoft/swupdate:1` update type</li><li>Specify recommended value for `microsoft/apt:1` update type.
    | updateFilePath(s) | Path to the update file(s) on your computer


## Review Generated Import Manifest

Example:
```json
{
  "updateId": {
    "provider": "Microsoft",
    "name": "Toaster",
    "version": "2.0"
  },
  "updateType": "microsoft/swupdate:1",
  "installedCriteria": "5",
  "compatibility": [
    {
      "deviceManufacturer": "Fabrikam",
      "deviceModel": "Toaster"
    },
    {
      "deviceManufacturer": "Contoso",
      "deviceModel": "Toaster"
    }
  ],
  "files": [
    {
      "filename": "file1.json",
      "sizeInBytes": 7,
      "hashes": {
        "sha256": "K2mn97qWmKSaSaM9SFdhC0QIEJ/wluXV7CoTlM8zMUo="
      }
    },
    {
      "filename": "file2.zip",
      "sizeInBytes": 11,
      "hashes": {
        "sha256": "gbG9pxCr9RMH2Pv57vBxKjm89uhUstD06wvQSioLMgU="
      }
    }
  ],
  "createdDateTime": "2020-10-08T03:32:52.477Z",
  "manifestVersion": "2.0"
}
```

## Import update

1. Log in to the [Azure portal](https://portal.azure.com) and navigate to your IoT Hub with Device Update.

2. On the left-hand side of the page, select "Device Updates" under "Automatic Device Management".

   :::image type="content" source="media/import-update/import-updates-3.png" alt-text="Import Updates" lightbox="media/import-update/import-updates-3.png":::

3. You will see several tabs across the top of the screen. Select the Updates tab.

   :::image type="content" source="media/import-update/updates-tab.png" alt-text="Updates" lightbox="media/import-update/updates-tab.png":::

4. Select "+ Import New Update" below the "Ready to Deploy" header.

   :::image type="content" source="media/import-update/import-new-update-2.png" alt-text="Import New Update" lightbox="media/import-update/import-new-update-2.png":::

5. Select the folder icon or text box under "Select an Import Manifest File". You will see a file picker dialog. Select the Import Manifest you created previously using the PowerShell cmdlet. Next, select the folder icon or text box under "Select one or more update files". You will see a file picker dialog. Select your update file(s).

   :::image type="content" source="media/import-update/select-update-files.png" alt-text="Select Update Files" lightbox="media/import-update/select-update-files.png":::

6. Select the folder icon or text box under "Select a storage container". Then select the appropriate storage account. The storage container is used to stage the update files temporarily.

   :::image type="content" source="media/import-update/storage-account.png" alt-text="Storage Account" lightbox="media/import-update/storage-account.png":::

7. If you’ve already created a container, you can reuse it. (Otherwise, select "+ Container" to create a new storage container for updates.).  Select the container you wish to use and click "Select".

   :::image type="content" source="media/import-update/container.png" alt-text="Select Container" lightbox="media/import-update/container.png":::

8. Select "Submit" to start the import process.

   :::image type="content" source="media/import-update/publish-update.png" alt-text="Publish Update" lightbox="media/import-update/publish-update.png":::

9. The import process begins, and the screen switches to to the "Import History" section. Select "Refresh" to view progress until the import process completes (depending on the size of the update, this may complete in a few minutes but could take longer).

   :::image type="content" source="media/import-update/update-publishing-sequence-2.png" alt-text="Update Import Sequencing" lightbox="media/import-update/update-publishing-sequence-2.png":::

10. When the Status column indicates the import has succeeded, select the "Ready to Deploy" header. You should see your imported update in the list now.

   :::image type="content" source="media/import-update/update-ready.png" alt-text="Job Status" lightbox="media/import-update/update-ready.png":::

## Next Steps

[Create Groups](create-update-group.md)

[Learn about import concepts](import-concepts.md)
