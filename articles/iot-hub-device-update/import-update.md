---
title: How to add a new update | Microsoft Docs
description: How-To guide for adding a new update into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 1/10/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Add an update to Device Update for IoT Hub

Learn how to obtain a new update and import it into Device Update for IoT Hub.

> [!NOTE]
> Some data submitted to this service might be processed in a region outside the region Device Update for IoT Hub is created in.

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md).
* An IoT device (or simulator) [provisioned for Device Update](device-update-agent-provisioning.md) within IoT Hub.
* [PowerShell 5](/powershell/scripting/install/installing-powershell) or later (includes Linux, macOS, and Windows installs)
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

## Obtain an update for your devices

Now that you've set up Device Update and provisioned your devices, you'll need the update file(s) that you'll be deploying to those devices.

* If you’ve purchased devices from an OEM or solution integrator, that organization will most likely provide update files for you, without you needing to create the updates. Contact the OEM or solution integrator to find out how they make updates available.

* If your organization already creates software for the devices you use, that same group will be the ones to create the updates for that software.

When creating an update to be deployed using Device Update for IoT Hub, start with either the [image-based or package-based approach](understand-device-update.md#support-for-a-wide-range-of-update-artifacts) depending on your scenario.

## Create a Device Update import manifest

Once you have your update files, create an import manifest to describe the update. If you haven't already done so, be sure to familiarize yourself with the basic [import concepts](import-concepts.md). While it is possible to author an import manifest JSON manually using a text editor, this guide will use PowerShell as example.

> [!TIP]
> Check out existing import manifest files from [image-based](device-update-raspberry-pi.md), [package-based](device-update-ubuntu-agent.md), or [proxy update](device-update-howto-proxy-updates.md) tutorial.

1. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) `Azure/iot-hub-device-update` [Git repository](https://github.com/Azure/iot-hub-device-update).

2. Navigate to `Tools/AduCmdlets` in your local clone from PowerShell.

3. Run the following commands after replacing the sample parameter values with your own:

    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

    Import-Module ./AduUpdate.psm1

    $updateId = New-AduUpdateId -Provider Contoso -Name Toaster -Version 1.0

    $compat = New-AduUpdateCompatibility New-AduUpdateCompatibility -Properties @{ deviceManufacturer = 'Contoso'; deviceModel = 'Toaster' }

    $installStep = New-AduInstallationStep -Handler 'microsoft/swupdate:1'-HandlerProperties @{ installedCriteria = '1.0' } -Files 'path to your update file'

    $update = New-AduImportManifest -UpdateId $updateId -Compatibility $compat -InstallationSteps $installStep

    # Write the import manifest to a file, ideally next to the update file(s).
    $update | Out-File "./$($updateId.provider).$($updateId.name).$($updateId.version).importmanifest.json" -Encoding utf8NoBOM
    ```

## Import an update

> [!NOTE]
> The instructions below show how to import an update via the Azure portal UI. You can also use the [Device Update for IoT Hub APIs](#if-youre-importing-via-apis-instead) to import an update instead.

1. Log in to the [Azure portal](https://portal.azure.com) and navigate to your IoT Hub with Device Update.

2. On the left-hand side of the page, select `Updates` under `Device Management`.

   :::image type="content" source="media/import-update/import-updates-3-ppr.png" alt-text="Import Updates" lightbox="media/import-update/import-updates-3-ppr.png":::

3. You'll see several tabs across the top of the screen. Select the `Updates` tab.

   :::image type="content" source="media/import-update/updates-tab-ppr.png" alt-text="Updates" lightbox="media/import-update/updates-tab-ppr.png":::

4. Select `+ Import a new update` below the `Available Updates` header.

   :::image type="content" source="media/import-update/import-new-update-2-ppr.png" alt-text="Import New Update" lightbox="media/import-update/import-new-update-2-ppr.png":::

5. Select `+ Select from storage container`. The Storage accounts UI will be shown. Select an existing account or create a new account using `+ Storage account`. This account will be used for a container to stage your updates for importing.

   :::image type="content" source="media/import-update/select-update-files-ppr.png" alt-text="Select Update Files" lightbox="media/import-update/select-update-files-ppr.png":::

6. Once you've selected a Storage account, the Containers UI will be shown. Select an existing container or create a new container using `+ Container`. This container will be used to stage your update files for importing _Recommendation: use a new container each time you import an update to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before completing this step._

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Storage Account" lightbox="media/import-update/storage-account-ppr.png":::

7. In your container, select `Upload`. The Upload UI will be shown.

   :::image type="content" source="media/import-update/container-ppr.png" alt-text="Select Container" lightbox="media/import-update/container-ppr.png":::

8. Select the folder icon on the right side of the `Files` section under the `Upload blob` header. A file picker will be shown. Navigate to the location of your update file(s) and import manifest, select all of the files, then select `Open`. _You can hold the Shift key and click to multi-select files._

   :::image type="content" source="media/import-update/container-picker-ppr.png" alt-text="Publish Update" lightbox="media/import-update/container-picker-ppr.png":::

9. When you've selected all your update files, select `Upload`.

   :::image type="content" source="media/import-update/container-picker-ppr.png" alt-text="Container Upload" lightbox="media/import-update/container-picker-ppr.png":::

10. Select the files you just uploaded to designate them for importing. Then click the `Select` button to return to the `Import update` page.

       :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Select Uploaded Files" lightbox="media/import-update/import-select-ppr.png":::

11. On the Import update page, review the files to be imported. Then select `Import update` to start the import process. _See the [Proxy Update Troubleshooting](device-update-proxy-update-troubleshooting.md) page to resolve any errors._

       :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Import Start" lightbox="media/import-update/import-start-2-ppr.png":::

12. The import process begins, and the screen switches to the `Import History` section. Select `Refresh` to view progress until the import process completes (depending on the size of the update, this may complete in a few minutes but could take longer).

       :::image type="content" source="media/import-update/update-publishing-sequence-2-ppr.png" alt-text="Update Import Sequencing" lightbox="media/import-update/update-publishing-sequence-2-ppr.png":::

13. When the `Status` column indicates the import has succeeded, select the `Ready to Deploy` header. You should see your imported update in the list now.

       :::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Job Status" lightbox="media/import-update/update-ready-ppr.png":::

## If you're importing via APIs instead

In addition to using Azure Portal, you may also import an update programmatically by:
* Using `Azure SDK` for [.NET](https://docs.microsoft.com/dotnet/api/azure.iot.deviceupdate), [Java](https://docs.microsoft.com/java/api/com.azure.iot.deviceupdate), [JavaScript](https://docs.microsoft.com/javascript/api/@azure/iot-device-update) or [Python](https://docs.microsoft.com/python/api/azure-mgmt-deviceupdate/azure.mgmt.deviceupdate)
* Using [Import Update REST API](https://docs.microsoft.com/rest/api/deviceupdate/updates/import-update)
* Using [sample PowerShell modules](https://github.com/Azure/iot-hub-device-update/tree/main/tools/AduCmdlets)

> [!NOTE]
> Refer to [Device update user roles and access](device-update-control-access.md) for required API permission.

In order to import, you have to upload your update files and import manifest to an Azure Storage Blob container for staging, and provide the blob URL, or shared access signature (SAS) for private blobs, to Device Update API. If using a SAS, be sure to provide at least 3-hour expiration window.

> [!TIP]
> To upload large update files to Azure Storage Blob container, you may use one of the following for better performance:
> - [AzCopy](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10)
> - [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer)

## Next Steps

* [Create Groups](create-update-group.md)
* [Learn about import concepts](import-concepts.md)
