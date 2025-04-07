---
title: Import an update to Azure Device Update for IoT Hub
description: Learn how to import update files into Azure Device Update for IoT Hub by using the Azure portal, Azure CLI, or programmatically.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/08/2025
ms.topic: how-to
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Import an update to Azure Device Update for IoT Hub

To deploy an update to devices using Azure Device Update for IoT Hub, you first import the update files into the Device Update service, which stores the imported update for deployment to devices. In this article, you learn how to import an update into the Device Update service by using the Azure portal, Azure CLI, or Device Update APIs.

## Prerequisites

- A [Device Update account and instance configured with an IoT hub](create-device-update-account.md).
- An IoT device or simulator [provisioned for Device Update](device-update-agent-provisioning.md) within the IoT hub.
- Update files for your device, and an associated import manifest file created by following the instructions in [Prepare an update to import into Device Update](create-update.md).
- An Azure Storage account and container to hold the imported files. Or, you can create a new storage account and container as part of the Azure portal based import process.

  > [!IMPORTANT]
  > Make sure the storage account you use or create doesn't have private endpoints enabled. To see if private endpoints are enabled, you can check for your Azure Storage account name under **Private endpoints** in the [Private Link Center](https://portal.azure.com/#blade/Microsoft_Azure_Network/PrivateLinkCenterBlade/overview).

# [Azure portal](#tab/portal)

- Supported browsers Microsoft Edge or Google Chrome.

# [Azure CLI](#tab/cli)

- A Bash environment.

  You can use the Bash environment in [Azure Cloud Shell](/azure/cloud-shell/quickstart) to run the commands in this article. Select **Launch Cloud Shell** to open Cloud Shell, or select the Cloud Shell icon in the top toolbar of the Azure portal.

  :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

  Or, if you prefer, you can run the Azure CLI commands locally:

  1. [Install Azure CLI](/cli/azure/install-azure-cli). Run [az version](/cli/azure/reference-index#az-version) to see the installed Azure CLI version and dependent libraries, and run [az upgrade](/cli/azure/reference-index#az-upgrade) to install the latest version.
  1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).
  1. Install the `azure-iot` extension when prompted on first use. To make sure you're using the latest version of the extension, run `az extension update --name azure-iot`.

>[!TIP]
>The Azure CLI commands in this article use the backslash \\ character for line continuation so that the command arguments are easier to read. This syntax works in Bash environments. If you run these commands in PowerShell, replace each backslash with a backtick \`, or remove them entirely.

---

## Import an update

This section shows how to import an update using either the Azure portal or the Azure CLI. You can also [import an update by using the Device Update APIs](#import-using-the-device-update-apis) instead.

To import an update, you first upload the update and import manifest files into an Azure Storage container. Then, you import the update from Azure Storage into Device Update for IoT Hub, which stores it for deployment to devices.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), on the IoT hub page for your Device Update instance, select **Device management** > **Updates** from the left navigation.

   :::image type="content" source="media/import-update/import-updates-3-ppr.png" alt-text="Screenshot that shows Import updates." lightbox="media/import-update/import-updates-3-ppr.png":::

1. On the **Updates** page, select **Import a new update**.

   :::image type="content" source="media/import-update/import-new-update-2-ppr.png" alt-text="Screenshot that shows Import a new update." lightbox="media/import-update/import-new-update-2-ppr.png":::

1. On the **Import update** page, select **Select from storage container**.

1. On the **Storage accounts** page, select an existing storage account or create a new account by selecting **Storage account**. You use the storage account for a container to stage the update files.

1. On the **Containers** page, select an existing container or create a new container by selecting **Container**. You use the container to stage the update files for import.

   :::image type="content" source="media/import-update/storage-account-ppr.png" alt-text="Screenshot that shows Storage accounts and Containers.":::

   > [!TIP]
   > Using a new container each time you import an update helps prevent accidentally importing files from previous updates. If you don't use a new container, be sure to delete any previous files from the existing container.

1. On the container page, select **Upload**.

   :::image type="content" source="media/import-update/container-ppr.png" alt-text="Screenshot that shows select Upload.":::

1. On the **Upload blob** screen, select the folder icon next to the **Files**. Use the file picker to navigate to the location of your update and import manifest files, select the files, and then select **Open**. You can use the Shift key to multiselect files.

   :::image type="content" source="media/import-update/container-picker-ppr.png" alt-text="Screenshot that shows selecting files to upload.":::

1. After you select all the files, select **Upload**.

   :::image type="content" source="media/import-update/container-upload-ppr.png" alt-text="Screenshot that shows selecting Upload." lightbox="media/import-update/container-picker-ppr.png":::

1. After they upload, the files appear on the container page. On the container page, review and select the files to import, and then select **Select**.

   :::image type="content" source="media/import-update/import-select-ppr.png" alt-text="Screenshot that shows selecting uploaded files.":::

1. On the **Import update** screen, select **Import update**.

   :::image type="content" source="media/import-update/import-start-2-ppr.png" alt-text="Screenshot that shows Import update.":::

The import process begins, and the screen switches to the **Updates** screen. After the import succeeds, it appears on the **Updates** tab. To resolve any errors, see [Proxy update troubleshooting](device-update-proxy-update-troubleshooting.md).

:::image type="content" source="media/import-update/update-ready-ppr.png" alt-text="Screenshot that shows job status." lightbox="media/import-update/update-ready-ppr.png":::

# [Azure CLI](#tab/cli)

The [az iot du update stage](/cli/azure/iot/du/update#az-iot-du-update-stage) command handles the prerequisite steps of importing an update, including uploading the update files into a target storage container. An optional flag also lets this command automatically import the files after preparing them. Otherwise, the [az iot du update import](/cli/azure/iot/du/update#az-iot-du-update-import) command completes the process.

The `stage` command takes the following arguments:

- `--account`: The Device Update account name.
- `--instance`: The Device Update instance name.
- `--manifest-path`: The file path to the import manifest to stage.
- `--storage-account`: The name of the storage account to stage the update to.
- `--storage-container`: The name of the container within the selected storage account to stage the update to.
- `--overwrite`: Optional flag that indicates whether to overwrite existing blobs in the storage container if there's a conflict.
- `--then-import`: Optional flag that indicates whether to import the update to Device Update after staging it.

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

You can include multiple import manifests in a single command. For example:

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

If you don't use the `--then-import` flag, the output of the `stage` command includes a prompt to run [az iot du update import](/cli/azure/iot/du/update#az-iot-du-update-import) with prepopulated arguments.

Use [az iot du update list](/cli/azure/iot/du/update#az-iot-du-update-list) to verify that your updates successfully import.

```azurecli
az iot du update list \
    --account <Replace with your Device Update account name> \
    --instance <Replace with your Device Update instance name> \
    -o table
```

---

## Import using the Device Update APIs

You can also import an update programmatically by using any of the following methods:

- The Device Update APIs in the Azure SDKs for [.NET](/dotnet/api/azure.iot.deviceupdate), [Java](/java/api/com.azure.iot.deviceupdate), [JavaScript](/javascript/api/@azure/iot-device-update), or [Python](/python/api/azure-mgmt-deviceupdate/azure.mgmt.deviceupdate)
- The Device Update [Import Update](/rest/api/deviceupdate/dataplane/updates/import-update) REST API
- Sample [PowerShell modules](https://github.com/Azure/iot-hub-device-update/tree/main/tools/AduCmdlets) (requires [PowerShell 5](/powershell/scripting/install/installing-powershell) or later for Linux, macOS, or Windows)

> [!NOTE]
> See [Device Update user roles and access](device-update-control-access.md) for required API permission.

The update files and import manifest must be uploaded to an Azure Storage Blob container for staging. To import the staged files, provide the blob URL, or shared access signature (SAS) for private blobs, to the Device Update API. If using a SAS, be sure to provide an expiration window of three hours or more.

> [!TIP]
> To upload large update files to an Azure Storage Blob container, you can use one of the following methods for better performance:
>
> - [AzCopy](../storage/common/storage-use-azcopy-v10.md)
> - [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer)

## Related content

- [Device groups](create-update-group.md)
- [Device Update import manifest](import-concepts.md)
