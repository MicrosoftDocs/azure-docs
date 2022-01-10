---
title: How to add a new update | Microsoft Docs
description: How-To guide for adding a new update into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 4/19/2021
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Add an update to Device Update for IoT Hub
Learn how to obtain a new update and import it into Device Update for IoT Hub.

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md). 
* An IoT device (or simulator) [provisioned for Device Update](device-update-agent-provisioning.md) within IoT Hub.
* [PowerShell 5](/powershell/scripting/install/installing-powershell) or later (includes Linux, macOS and Windows installs)
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

> [!NOTE]
> Some data submitted to this service might be processed in a region outside the region this instance was created in.

## Obtain an update for your devices

Now that you've set up Device Update and provisioned your devices, you will need the update file(s) that you will be deploying to those devices.

If you’ve purchased devices from an OEM or solution integrator, that organization will most likely provide update files for you, without you needing to create the updates. Contact the OEM or solution integrator to find out how they make updates available.

If your organization already creates software for the devices you use, that same group will be the ones to create the updates for that software. When creating an update to be deployed using Device Update for IoT Hub, start with either the [image-based or package-based approach](understand-device-update.md#support-for-a-wide-range-of-update-artifacts) depending on your scenario. Note: if you want to create your own updates but are just starting out, GitHub is an excellent option to manage your development. You can store and manage your source code, and do Continuous Integration (CI) and Continuous Deployment (CD) using [GitHub Actions](https://docs.github.com/en/actions/guides/about-continuous-integration).

## Create a Device Update import manifest

If you haven't already done so, be sure to familiarize yourself with the basic [import concepts](import-concepts.md), and try out an [image-based](device-update-raspberry-pi.md), [package-based](device-update-ubuntu-agent.md) or proxy update tutorial first.

1. Ensure that your update file(s) are located in a directory accessible from PowerShell.

2. Create a text file named **AduUpdate.psm1** in the directory where your update image file or APT Manifest file is located. Then open the [AduUpdate.psm1](https://github.com/Azure/iot-hub-device-update/tree/main/tools/AduCmdlets) PowerShell cmdlet, copy the contents to your text file, and then save the text file.

3. In PowerShell, navigate to the directory where you created your PowerShell cmdlet from step 2. Use the Copy option below and then paste into PowerShell to run the commands:

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

    The following table is a quick reference for how to populate the above parameters. If you need more information, you can also view the complete [import manifest schema](import-schema.md).

    | Parameter | Description |
    | --------- | ----------- |
    | deviceManufacturer | Manufacturer of the device the update is compatible with, for example, Contoso. Must match _manufacturer_ [device property](./device-update-plug-and-play.md#device-properties).
    | deviceModel | Model of the device the update is compatible with, for example, Toaster. Must match _model_ [device property](./device-update-plug-and-play.md#device-properties).
    | updateProvider | Entity who is creating or directly responsible for the update. It will often be a company name.
    | updateName | Identifier for a class of updates. The class can be anything you choose. It will often be a device or model name.
    | updateVersion | Version number distinguishing this update from others that have the same Provider and Name. Does not have match a version of an individual software component on the device (but can if you choose).
    | updateType | <ul><li>Specify `microsoft/swupdate:1` for image update</li><li>Specify `microsoft/apt:1` for package update</li></ul>
    | installedCriteria | Used during deployment to compare the version already on the device with the version of the update. Deploying the update to the device will return a “failed” result if the installedCriteria value doesn't match the version that is on the device.<ul><li>For `microsoft/swupdate:1` update type, specify value of SWVersion </li><li>For `microsoft/apt:1` update type, specify **name-version**, where _name_ is the name of the APT Manifest and _version_ is the version of the APT Manifest. For example, contoso-iot-edge-1.0.0.0.
    | updateFilePath(s) | Path to the update file(s) on your computer. For package update, this should be one APT manifest file. For image-based update, it can be multiple files (see [Import manifest schema details](import-schema.md)).


## Review the generated import manifest

An example manifest output is below. For this example, there are two files that comprise this update: a .json file and a .zip file. If you have questions about any of the items, view the complete [import manifest schema](import-schema.md#import-manifest-schema). 
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

## Import an update

> [!NOTE]
> The instructions below show how to import an update via the Azure portal UI. You can also use the [Device Update for IoT Hub APIs](#if-youre-importing-via-apis-instead) to import an update instead.

1. Log in to the [Azure portal](https://portal.azure.com) and navigate to your IoT Hub with Device Update.

2. On the left-hand side of the page, select "Updates" under "Device Management".

   :::image type="content" source="media/import-update/import-updates-3.png" alt-text="Import Updates" lightbox="media/import-update/import-updates-3.png":::

3. You will see several tabs across the top of the screen. Select the Updates tab.

   :::image type="content" source="media/import-update/updates-tab.png" alt-text="Updates" lightbox="media/import-update/updates-tab.png":::

4. Select "+ Import a new update" below the "Available Updates" header.

   :::image type="content" source="media/import-update/import-new-update-2.png" alt-text="Import New Update" lightbox="media/import-update/import-new-update-2.png":::

5. Select "+ Select from storage container". The Storage accounts UI will be shown. Select an existing account or create a new account using "+ Storage account". This account will be used for a container to stage your updates for importing.

   :::image type="content" source="media/import-update/select-update-files.png" alt-text="Select Update Files" lightbox="media/import-update/select-update-files.png":::

6. Once you've selected a Storage account, the Containers UI will be shown. Select an existing container or create a new container using "+ Container". This container will be used to stage your updates for importing. _NOTE: it is recommended to use a new container each time you import an update to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before completing this step._

   :::image type="content" source="media/import-update/storage-account.png" alt-text="Storage Account" lightbox="media/import-update/storage-account.png":::

7. In your container, select "Upload". The Upload UI will be shown.  

   :::image type="content" source="media/import-update/container.png" alt-text="Select Container" lightbox="media/import-update/container.png":::

8. Select the folder icon on the right side of the Files section under the Upload blob header. A file picker will be shown. Navigate to the location of your update file or files, select all of the files, then select "Open". _Note: you can hold the Shift key and click the uppermost and lowermost files to multi-select._

   :::image type="content" source="media/import-update/publish-update.png" alt-text="Publish Update" lightbox="media/import-update/publish-update.png":::

9. When you've selected all your update files, select "Upload". This will upload your files to the staging container that will be used for importing.

   :::image type="content" source="media/import-update/update-publishing-sequence-2.png" alt-text="Update Import Sequencing" lightbox="media/import-update/update-publishing-sequence-2.png":::

10. Select the files you just uploaded to designate them for importing. Then click the "Select" button.

   :::image type="content" source="media/import-update/update-ready.png" alt-text="Job Status" lightbox="media/import-update/update-ready.png":::

## Next Steps

[Create Groups](create-update-group.md)

[Learn about import concepts](import-concepts.md)

## If you're importing via APIs instead

If you want to use the [Device Update for IoT Hub Update APIs](/rest/api/deviceupdate/updates) to import an update instead of importing via the Azure portal, note the following:
  - You will need to upload your update file(s) to an Azure Blob Storage location before you call the Update APIs.
  - You can reference this [sample API call](import-schema.md#example-import-request-body) which uses the import manifest you created above.
  - If you re-use the same SAS URL while testing, you may encounter errors when the token expires. This is the case when submitting the import manifest as well as the update content itself.