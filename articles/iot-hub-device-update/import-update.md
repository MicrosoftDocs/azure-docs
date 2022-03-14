---
title: Add an update to Device Update for IoT Hub | Microsoft Docs
description: How-To guide to add an update into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 1/31/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Import an update to Device Update for IoT Hub

Learn how to obtain a new update and import it into Device Update for IoT Hub. If you haven't already, be sure to review the key [import concepts](import-concepts.md) and [how to prepare an update to be imported](create-update.md).

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md).
* An IoT device (or simulator) [provisioned for Device Update](device-update-agent-provisioning.md) within IoT Hub.
* [PowerShell 5](/powershell/scripting/install/installing-powershell) or later (includes Linux, macOS, and Windows installs)
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

## Import an update

> [!NOTE]
> The following instructions show how to import an update via the Azure portal UI. You can also use the [Device Update for IoT Hub APIs](#if-youre-importing-via-apis-instead) to import an update instead.

1. Log in to the [Azure portal](https://portal.azure.com) and navigate to your IoT Hub with Device Update.

2. On the left-hand side of the page, select `Updates` under `Device Management`.

   :::image type="content" source="media/import-update/import-updates-3-ppr.png" alt-text="Import Updates" lightbox="media/import-update/import-updates-3-ppr.png":::

3. Select the `Updates` tab from the list of tabs across the top of the screen.

   :::image type="content" source="media/import-update/updates-tab-ppr.png" alt-text="Updates" lightbox="media/import-update/updates-tab-ppr.png":::

4. Select `+ Import a new update` below the `Available Updates` header.

   :::image type="content" source="media/import-update/import-new-update-2-ppr.png" alt-text="Import New Update" lightbox="media/import-update/import-new-update-2-ppr.png":::

5. Select `+ Select from storage container`. The Storage accounts UI is shown. Select an existing account, or create an account using `+ Storage account`. This account is used for a container to stage your updates for import.

   :::image type="content" source="media/import-update/select-update-files-ppr.png" alt-text="Select Update Files" lightbox="media/import-update/select-update-files-ppr.png":::

6. Once you've selected a Storage account, the Containers UI is shown. Select an existing container, or create a container using `+ Container`. This container is used to stage your update files for importing _Recommendation: use a new container each time you import an update to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before you complete this step._

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Storage Account" lightbox="media/import-update/storage-account-ppr.png":::

7. In your container, select `Upload`. The Upload UI is shown.

   :::image type="content" source="media/import-update/container-ppr.png" alt-text="Select Container" lightbox="media/import-update/container-ppr.png":::

8. Select the folder icon on the right side of the `Files` section under the `Upload blob` header. Use the file picker to navigate to the location of your update files and import manifest, select all of the files, then select `Open`. _You can hold the Shift key and click to multi-select files._

   :::image type="content" source="media/import-update/container-picker-ppr.png" alt-text="Publish Update" lightbox="media/import-update/container-picker-ppr.png":::

9. When you've selected all your update files, select `Upload`.

   :::image type="content" source="media/import-update/container-upload-ppr.png" alt-text="Container Upload" lightbox="media/import-update/container-picker-ppr.png":::

10. Select the uploaded files to designate them to be imported . Then click the `Select` button to return to the `Import update` page.

       :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Select Uploaded Files" lightbox="media/import-update/import-select-ppr.png":::

11. On the Import update page, review the files to be imported. Then select `Import update` to start the import process. _To resolve any errors, see the [Proxy Update Troubleshooting](device-update-proxy-update-troubleshooting.md) page ._

       :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Import Start" lightbox="media/import-update/import-start-2-ppr.png":::

12. The import process begins, and the screen switches to the `Import History` section. Select `Refresh` to view progress until the import process completes (depending on the size of the update, the process might complete in a few minutes but could take longer).

       :::image type="content" source="media/import-update/update-publishing-sequence-2-ppr.png" alt-text="Update Import Sequencing" lightbox="media/import-update/update-publishing-sequence-2-ppr.png":::

13. When the `Status` column indicates that the import has succeeded, select the `Available Updates` header. You should see your imported update in the list now.

       :::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Job Status" lightbox="media/import-update/update-ready-ppr.png":::

## If you're importing via APIs instead

In addition to importing via the Azure portal, you can also import an update programmatically by:
* Using `Azure SDK` for [.NET](/dotnet/api/azure.iot.deviceupdate), [Java](/java/api/com.azure.iot.deviceupdate), [JavaScript](/javascript/api/@azure/iot-device-update) or [Python](/python/api/azure-mgmt-deviceupdate/azure.mgmt.deviceupdate)
* Using [Import Update REST API](/rest/api/deviceupdate/2020-09-01/updates)
* Using [sample PowerShell modules](https://github.com/Azure/iot-hub-device-update/tree/main/tools/AduCmdlets)

> [!NOTE]
> Refer to [Device update user roles and access](device-update-control-access.md) for required API permission.

Update files and import manifest must be uploaded to an Azure Storage Blob container for staging. To import the staged files, provide the blob URL, or shared access signature (SAS) for private blobs, to the Device Update API. If using a SAS, be sure to provide a three hour or greater expiration window.

> [!TIP]
> To upload large update files to Azure Storage Blob container, you may use one of the following for better performance:
> - [AzCopy](../storage/common/storage-use-azcopy-v10.md)
> - [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer)

## Next Steps

* [Create Groups](create-update-group.md)
* [Learn about import concepts](import-concepts.md)