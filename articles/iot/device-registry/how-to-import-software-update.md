---
title: Import a Software Update
titleSuffix: Azure Device Registry
description: Learn how to import a software update and its import manifest into an Azure Device Registry namespace so you can deploy it to your devices.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot
ms.topic: how-to
ms.date: 10/05/2026
#Customer intent: As an IoT solution operator, I want to import a software update into my Azure Device Registry namespace so that I can deploy it to my devices.
---

# Import a software update (preview)

Before you can deploy a software update to a group of devices or to devices that onboard to a namespace, you need to import the update into your Azure Device Registry namespace. Each software update consists of one or more update files and an import manifest. The import manifest describes the update's identity, the devices it's compatible with, and how to install it, so Azure Device Registry knows which devices the update applies to.

This article shows you how to import a software update from an Azure Storage container into a namespace, and how to delete an imported update that you no longer need.

> [!IMPORTANT]
> Azure Device Registry software updates is currently in preview. The current preview is scoped to IoT Hub-connected devices. This preview is provided without a service-level agreement, and the capability and its portal experience might change before it becomes generally available. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

- An active Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An Azure Device Registry namespace with software updates enabled. To create a namespace and enable software updates, see [Get started with Azure Device Registry](get-started-azure-device-registry.md).
- Permissions to read the update files in your storage account, such as the [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles/storage.md#storage-blob-data-contributor) role.
- Permissions to import software updates to the namespace, such as the [Device Update Content Administrator](../../role-based-access-control/built-in-roles/internet-of-things.md#device-update-content-administrator) role on the software updates instance that's linked to your namespace.
- An Azure Storage account with a container that holds your update files and an import manifest:
  - **Update files**: The files that your device installs, such as an image, a package, or a script (for example, `.swu` or `.sh`).
  - **Import manifest**: A JSON file with the `.importmanifest.json` extension that describes the update. Every software update requires an import manifest. To learn how to create one, see [Prepare an update to import](../../iot-hub-device-update/create-update.md) and the [import manifest schema](../../iot-hub-device-update/import-schema.md).

## Go to software updates in your namespace

1. In the [Azure portal](https://portal.azure.com), go to your Azure Device Registry namespace.
1. In the resource menu, under **Operations**, select **Software updates (preview)**.
1. On the **Software updates (preview)** page, select the **Imports** tab to view the software updates that are already imported to the namespace.

If you haven't imported any updates yet, the page shows **No updates to display**.

## Import a software update

1. On **Software updates (preview)**, select **+ Import**.
1. On **Import software updates**, under **File selection**, select **+ Add files**.

   :::image type="content" source="media/how-to-import-software-update/import-form.png" alt-text="Screenshot of the Import software updates page with the Add files command." lightbox="media/how-to-import-software-update/import-form.png":::

1. Select the storage account that contains your update files, and then select **Next**.
1. Select the container that contains your update files, and then select **Next**.
1. On **Select files**, select the update files and the import manifest file (with the `.importmanifest.json` extension) that you want to import.

   :::image type="content" source="media/how-to-import-software-update/select-update-files.png" alt-text="Screenshot of update files and an import manifest file selected in a storage container." lightbox="media/how-to-import-software-update/select-update-files.png":::

1. Close the file picker to return to **Import software updates**.
1. In the **Description** box, optionally enter a description for the update.
1. Under **Malware scan**, select **Scan update files for malware** if you want the update files checked for known malware before they're imported. Malware scanning is available in select regions.
1. Select **Import**.

When the import succeeds, the update appears in the **Imports** list with its name, provider, version, and description. You can now deploy it by using a software update job or an onboarding update job.

### Fix a missing import manifest

If you select **Update files** without an import manifest, the import fails with the message **No import manifest was found**.

1. Review the error banner on the **Import software updates** page. It reminds you that import manifest files use the `.importmanifest.json` extension.
1. Add an import manifest that describes the update to your storage container.
1. Select **Replace files**, and then select your update files and the import manifest.
1. Select **Import** again.

> [!NOTE]
> In this preview, you can't create or edit an import manifest in the Azure portal. Create the import manifest before you import the update.

### Import parent and child updates

An import manifest can reference other updates. For example, a parent update can reference one or more child updates that must be installed together or in a specific order. When you import a parent update together with its child updates, the **Imports** list shows the parent update with its associated child updates.

:::image type="content" source="media/how-to-import-software-update/nested-import.png" alt-text="Screenshot of an imported parent update with its child updates." lightbox="media/how-to-import-software-update/nested-import.png":::

> [!NOTE]
> In this preview, the software updates client in the unified Azure IoT SDKs doesn't install updates that reference other updates. To deploy to devices that use the software updates client, import updates whose import manifests don't reference child updates. For more information, see [Preview limitations](concept-software-updates.md#preview-limitations).

## Delete a software update

If you no longer need an imported update, you can delete it from the namespace.

1. On the **Software updates (preview)** page, select the **Imports** tab.
1. Select the checkbox next to the update that you want to delete.
1. Select **Delete**.
1. When prompted, select **Delete** to confirm.

Deleting a software update doesn't affect devices that already installed it. However, you can no longer use the update in a new job.

## Related content

- [Software updates concepts (preview)](concept-software-updates.md)
- [Deploy a software update to a group (preview)](how-to-deploy-software-update-group.md)
- [Deploy an onboarding update to a namespace (preview)](how-to-deploy-onboarding-update-namespace.md)