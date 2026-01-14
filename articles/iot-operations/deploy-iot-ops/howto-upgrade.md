---
title: Upgrade versions
description: Upgrade an Azure IoT Operations instance using the Azure portal or CLI.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 07/18/2025

#CustomerIntent: As an IT professional, I want to manage Azure IoT Operations instances.
---

# Upgrade to a new version

Learn how to upgrade an Azure IoT Operations deployment to a newer version.

## Prerequisites

- An Azure account with an active subscription. If you don't have an account, you can create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Azure CLI version 2.53.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

## Understand upgrade support

Azure IoT Operations release versions can be preview or generally available (GA), you can find the latest version in the [Azure IoT Operations versions](https://aka.ms/aio-versions) document. The Azure IoT Operations CLI extension version is tied to the Azure IoT Operations version, so you need to ensure that you have the correct CLI extension version installed to perform an upgrade.

Azure IoT Operations supports the following upgrade scenarios:

- You can upgrade an existing Azure IoT Operations instance to any patch of the same minor version, or to the next minor version.
- You can't downgrade between versions. To move to an older version, [uninstall Azure IoT Operations](howto-manage-update-uninstall.md#uninstall) and reinstall the desired version. 
- You can't upgrade from any preview version to a GA version. You need to [uninstall Azure IoT Operations](howto-manage-update-uninstall.md#uninstall) and reinstall the new version. 
- You can't upgrade from any GA version to a preview version. For more information on how to install a preview version, see [Upgrade to preview version](howto-upgrade.md#upgrade-to-preview-version).

> [!NOTE]
> Azure IoT Operations doesn't support live upgrades. Please expect some downtime during the upgrade process.

## Upgrade

Azure IoT Operations supports upgrading instances to new GA versions as they're released. If your Azure IoT Operations instance is eligible for an upgrade, you can use the Azure portal or the Azure CLI to perform the upgrade.

If the latest version of the Azure IoT Operations is in preview, see [Upgrade to preview version](howto-upgrade.md#upgrade-to-preview-version).

### [Azure portal](#tab/portal)

If your Azure IoT Operations deployment is eligible for an upgrade, the Azure portal displays an **Upgrade** option. If you don't see the option to upgrade, then your deployment is on the latest version.

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure IoT Operations instance.

1. Select **Upgrade** on the **Overview** page of your instance.

   :::image type="content" source="./media/howto-upgrade/instance-upgrade.png" alt-text="Screenshot that shows the upgrade button enabled in the Azure portal.":::

1. You need to use the latest version of the Azure IoT Operations CLI extension to get the latest version of Azure IoT Operations. If you didn't update the extension as part of the prerequisites, do so now.

   ```azurecli
   az extension add --upgrade --name azure-iot-ops
   ```

   Or, if you want to upgrade your deployment to a newer version but not the latest, set the CLI extension version to the one associated with your desired Azure IoT Operations versions in [IoT Operations versions](https://aka.ms/aio-versions).

   ```azurecli
   az extension add --upgrade --name azure-iot-ops --version <VERSION_NUMBER>
   ```

1. The portal presents the Azure CLI command to upgrade your instance, prepopulated with your subscription, resource group, and instance details. Select the copy icon next to the CLI command.

1. Run the copied `az iot ops upgrade` command.

1. After the upgrade command completes successfully, refresh your instance to see the changes.

The **Version** value displayed on your instance's overview page reflects the version of the Azure IoT Operations instance. However, you might be prompted to upgrade if a required Arc extension has an available upgrade. You can tell that an upgrade was successful if the **Upgrade** option disappears from the instance overview page, even if it doesn't look like anything changed. You can check the versions of the Arc extensions for your Azure IoT Operation deployment on the **Extensions** page of your Arc-enabled cluster in the Azure portal.

### [Azure CLI](#tab/cli)

Use the [az iot ops upgrade](/cli/azure/iot/ops#az-iot-ops-upgrade) command to upgrade an existing Azure IoT Operations deployment to a newer version.

The upgrade command evaluates the entire Azure IoT Operations deployment for available updates, including the arc extensions that are installed in the `az iot ops init` command and the Azure IoT Operations instance.

Use the following steps to upgrade your deployment to the latest version:

1. Add the latest version of the Azure IoT Operations CLI extension.

   ```azurecli
   az extension add --upgrade --name azure-iot-ops
   ```

1. Run `az iot ops upgrade`

   ```azurecli
   az iot ops upgrade --resource-group <RESOURCE_GROUP_NAME> --name <INSTANCE_NAME>
   ```

1. The CLI outputs a table of the components that have available upgrades. Enter `Y` to continue with the upgrade. 

If you want to upgrade to a specific version of Azure IoT Operations that isn't the latest, you can run `az iot ops get-versions` or refer to [IoT Operations versions](https://aka.ms/aio-versions) to find the CLI extension version associated with the Azure IoT Operations version that you want. Get the version number and run the following command to upgrade to that version:

```azurecli
az extension add --upgrade --name azure-iot-ops --version <VERSION_NUMBER>
```

---

## Upgrade to preview version

Sometimes the latest version of Azure IoT Operations is in preview. Check the [Azure IoT Operations versions](https://aka.ms/aio-versions) to see the latest version. During preview releases, version upgrade is blocked, and you need to uninstall Azure IoT Operations and reinstall the preview version. 

You can only install a preview version using the Azure CLI.

1. If you have an existing Azure IoT Operations instance, you need to [Uninstall Azure IoT Operations](howto-manage-update-uninstall.md#uninstall) to do a new deployment. 
1. Add the latest version of the Azure IoT Operations CLI extension with the `--allow-preview` flag.

   ```azurecli
   az extension add --upgrade --name azure-iot-ops --allow-preview
   ```

If you want to upgrade to a specific version of Azure IoT Operations that isn't the latest, you can run `az iot ops get-versions` or refer to [IoT Operations versions](https://aka.ms/aio-versions) to find the CLI extension version associated with the Azure IoT Operations version that you want. Get the version number and run the following command to upgrade to that version:

```azurecli
az extension add --upgrade --name azure-iot-ops --version <VERSION_NUMBER>
```

## MQTT broker upgrade considerations

To ensure zero data loss and high availability during deployment upgrades, the MQTT broker implements rolling updates across the MQTT broker pods. The health manager pod coordinates an incremental upgrade process for the MQTT broker pods to ensure that:

* Active client connections remain uninterrupted.
* Any in-flight messages are preserved.
* Data stored on disk is properly migrated between versions.

If a failure occurs during the upgrade process, the health manager pod automatically restarts the upgrade process while ensuring no loss of data or connectivity.

Rolling updates can only occur if the MQTT broker is deployed with two or more backend replicas. MQTT broker upgrades aren't supported for single-replica deployments. When you deploy Azure IoT Operations, you specify the number of backend replicas to create in the [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) command with the `--broker-backend-rf` parameter.

## Supported versions

[!INCLUDE [supported-versions](../includes/supported-versions.md)]
