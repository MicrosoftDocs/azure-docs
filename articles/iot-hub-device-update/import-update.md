---
title: Add an update to Device Update for IoT Hub | Microsoft Docs
description: How-To guide to add an update into Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 10/31/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Import an update to Device Update for IoT Hub

Learn how to obtain a new update and import it into Device Update for IoT Hub. If you haven't already, be sure to review the key [import concepts](import-concepts.md) and [how to prepare an update to be imported](create-update.md).

## Prerequisites

* Access to [an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md).
* An IoT device (or simulator) [provisioned for Device Update](device-update-agent-provisioning.md) within IoT Hub.
* Follow the steps in [Prepare an update to import into Device Update for IoT Hub](create-update.md) to create the import manifest for your update files.

# [Azure portal](#tab/portal)

Supported browsers:

* [Microsoft Edge](https://www.microsoft.com/edge)
* Google Chrome

# [Azure CLI](#tab/cli)

An Azure CLI environment:

* Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

  :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

* Or, if you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

  1. Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.
  2. Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).
  3. When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

>[!TIP]
>The Azure CLI commands in this article use the backslash `\` character for line continuation so that the command arguments are easier to read. This syntax works in Bash environments. If you're running these commands in PowerShell, replace each backslash with a backtick `\``, or remove them entirely.

---

## Import an update

This section shows how to import an update using either the Azure portal or the Azure CLI. You can also use the [Device Update for IoT Hub APIs](#if-youre-importing-using-apis-instead) to import an update instead.

To import an update, you first upload the update files and import manifest into an Azure Storage container. Then, you import the update from Azure Storage into Device Update for IoT Hub, where it will be stored for you to deploy to devices.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT Hub with Device Update.

2. On the left-hand side of the page, select **Updates** under **Device Management**.

   :::image type="content" source="media/import-update/import-updates-3-ppr.png" alt-text="Import Updates" lightbox="media/import-update/import-updates-3-ppr.png":::

3. Select the **Updates** tab from the list of tabs across the top of the screen.

   :::image type="content" source="media/import-update/updates-tab-ppr.png" alt-text="Updates" lightbox="media/import-update/updates-tab-ppr.png":::

4. Select **+ Import a new update** below the **Available Updates** header.

   :::image type="content" source="media/import-update/import-new-update-2-ppr.png" alt-text="Import New Update" lightbox="media/import-update/import-new-update-2-ppr.png":::

5. Select **+ Select from storage container**. The Storage accounts UI is shown. Select an existing account, or create an account using **+ Storage account**. This account is used for a container to stage your updates for import. The account should not have both public and private endpoints enabled at the same time. 

   :::image type="content" source="media/import-update/select-update-files-ppr.png" alt-text="Select Update Files" lightbox="media/import-update/select-update-files-ppr.png":::

6. Once you've selected a Storage account, the Containers UI is shown. Select an existing container, or create a container using **+ Container**. This container is used to stage your update files for importing 

   We recommend that you use a new container each time you import an update. Always using new containers helps you to avoid accidentally importing files from previous updates. If you don't use a new container, be sure to delete any files from the existing container before you complete this step.

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Storage Account" lightbox="media/import-update/storage-account-ppr.png":::

7. In your container, select **Upload**. The Upload UI is shown.

   :::image type="content" source="media/import-update/container-ppr.png" alt-text="Select Container" lightbox="media/import-update/container-ppr.png":::

8. Select the folder icon on the right side of the **Files** section under the **Upload blob** header. Use the file picker to navigate to the location of your update files and import manifest, select all of the files, then select **Open**. _You can hold the Shift key and click to multi-select files._

   :::image type="content" source="media/import-update/container-picker-ppr.png" alt-text="Publish Update" lightbox="media/import-update/container-picker-ppr.png":::

9. When you've selected all your update files, select **Upload**.

   :::image type="content" source="media/import-update/container-upload-ppr.png" alt-text="Container Upload" lightbox="media/import-update/container-picker-ppr.png":::

10. Select the uploaded files to designate them to be imported. Then select the **Select** button to return to the **Import update** page.

       :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Select Uploaded Files" lightbox="media/import-update/import-select-ppr.png":::

11. On the Import update page, review the files to be imported. Then select **Import update** to start the import process. To resolve any errors, see [Proxy update troubleshooting](device-update-proxy-update-troubleshooting.md).

       :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Import Start" lightbox="media/import-update/import-start-2-ppr.png":::

12. The import process begins, and the screen switches to the **Import History** section. Select **Refresh** to view progress until the import process completes (depending on the size of the update, the process might complete in a few minutes but could take longer).

       :::image type="content" source="media/import-update/update-publishing-sequence-2-ppr.png" alt-text="Update Import Sequencing" lightbox="media/import-update/update-publishing-sequence-2-ppr.png":::

13. When the **Status** column indicates that the import has succeeded, select the **Available Updates** header. You should see your imported update in the list now.

       :::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Job Status" lightbox="media/import-update/update-ready-ppr.png":::

# [Azure CLI](#tab/cli)

The [az iot du update stage](/cli/azure/iot/du/update#az-iot-du-update-stage) command handles the prerequisite steps of importing an update, including uploading the update files into a target storage container. An optional flag also lets this command automatically import the files after they're prepared. Otherwise, the [az iot du update import](/cli/azure/iot/du/update#az-iot-du-update-import) command completes the process.

The `stage` command takes the following arguments:

* `--account`: The Device Update account name.
* `--instance`: The Device Update instance name.
* `--manifest-path`: The file path to the import manifest that should be staged.
* `--storage-account`: The name of the storage account to stage the update.
* `--storage-container`: The name of the container within the selected storage account to stage the update.
* `--overwrite`: Optional flag that indicates whether to overwrite existing blobs in the storage container if there's a conflict.
* `--then-import`: Optional flag that indicates whether the update should be imported to Device Update after it's staged.

```azurecli
az iot du update stage \
    --account <Replace with your Device Update account name> \
    --instance <Replace with your Device Update instance name> \
    --manifest-path <Replace with the full path to your import manifest> \
    --storage-account <Replace with your Storage account name> \
    --storage-container <Replace with your container name> \
    --overwrite --then-import
```

For example:

```azurecli
az iot du update stage \
    --account deviceUpdate001 \
    --instance myInstance \
    --manifest-path /my/apt/manifest/file.importmanifest.json \
    --storage-account deviceUpdateStorage \
    --storage-container deviceUpdateDemo \
    --overwrite --then-import
```

If you have multiple import manifests, you can include them all in a single command. For example:

```azurecli
az iot du update stage \
    --account deviceUpdate001 \
    --instance myInstance \
    --manifest-path /my/apt/manifest/parent.importmanifest.json \
    --manifest-path /my/apt/manifest/child1.importmanifest.json \
    --manifest-path /my/apt/manifest/child2.importmanifest.json \
    --storage-account deviceUpdateStorage \
    --storage-container deviceUpdateDemo \
    --overwrite --then-import
```

If you don't use the `--then-import` flag, the output of the `stage` command includes a prompt to run [az iot du update import](/cli/azure/iot/du/update#az-iot-du-update-import), including pre-populated arguments.

Use [az iot du update list](/cli/azure/iot/du/update#az-iot-du-update-list) to verify that your update or updates were successfully imported.

```azurecli
az iot du update list \
    --account <Replace with your Device Update account name> \
    --instance <Replace with your Device Update instance name> \
    -o table
```

---

## If you're importing using APIs instead

You can also import an update programmatically by:

* Using `Azure SDK` for [.NET](/dotnet/api/azure.iot.deviceupdate), [Java](/java/api/com.azure.iot.deviceupdate), [JavaScript](/javascript/api/@azure/iot-device-update) or [Python](/python/api/azure-mgmt-deviceupdate/azure.mgmt.deviceupdate)
* Using [Import Update REST API](/rest/api/deviceupdate/2020-09-01/updates)
* Using [sample PowerShell modules](https://github.com/Azure/iot-hub-device-update/tree/main/tools/AduCmdlets)
  * Requires [PowerShell 5](/powershell/scripting/install/installing-powershell) or later (includes Linux, macOS, and Windows installs)

> [!NOTE]
> Refer to [Device update user roles and access](device-update-control-access.md) for required API permission.

Update files and import manifest must be uploaded to an Azure Storage Blob container for staging. To import the staged files, provide the blob URL, or shared access signature (SAS) for private blobs, to the Device Update API. If using a SAS, be sure to provide an expiration window of three hours or more

> [!TIP]
> To upload large update files to Azure Storage Blob container, you may use one of the following for better performance:
>
> * [AzCopy](../storage/common/storage-use-azcopy-v10.md)
> * [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer)

## Next Steps

* [Create Groups](create-update-group.md)
* [Learn about import concepts](import-concepts.md)
