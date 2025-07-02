---
title: Upgrade versions
description: Upgrade an Azure IoT Operations instance using the Azure portal or CLI.
author: dominicbetts
ms.author: dobett
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 03/03/2025

#CustomerIntent: As an OT professional, I want to manage Azure IoT Operations instances.
---

# Upgrade to a new version

Upgrade an Azure IoT Operations deployment to a newer version. Azure IoT Operations supports upgrade from version 1.0.x onwards. There's no support for upgrading from any preview version of Azure IoT Operations to any generally available (GA) version.

## Prerequisites

* Azure CLI. This scenario requires Azure CLI version 2.53.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

## Understand upgrade support

You can upgrade an existing Azure IoT Operations instance to any patch of the same minor version, or to the next minor version.

Azure IoT Operations doesn't support downgrading between versions. To move to an older version, uninstall Azure IoT Operations and reinstall the desired version.

> [!NOTE]
> Azure IoT Operations doesn't support live upgrades. Please expect some downtime during the upgrade process.

## Upgrade

Azure IoT Operations supports upgrading instances to new GA versions as they're released.

You can't upgrade from a preview installation to a GA version. To move to version 1.0.x, [uninstall Azure IoT Operations](howto-manage-update-uninstall.md#uninstall) and reinstall the new version.

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

1. You need to use the latest version of the Azure IoT Operations CLI extension to get the latest version of Azure IoT Operations. If you didn't update the extension as part of the prerequisites, do so now.

   ```azurecli
   az extension add --upgrade --name azure-iot-ops
   ```

1. Run `az iot ops upgrade`

   ```azurecli
   az iot ops upgrade --resource-group <RESOURCE_GROUP_NAME> --name <INSTANCE_NAME>
   ```

1. The CLI outputs a table of the components that have available upgrades. Enter `Y` to continue with the upgrade.

If you want to upgrade to a specific version of Azure IoT Operations that isn't the latest, use the related CLI extension version. Each version of Azure IoT Operations maps to a version of the Azure IoT Operations CLI extension.

Refer to [IoT Operations versions](https://aka.ms/aio-versions) to find the CLI extension version associated with the Azure IoT Operations version that you want. Then, upgrade the CLI extension:

   ```azurecli
   az extension add --upgrade --name azure-iot-ops --version <VERSION_NUMBER>
   ```

---

## MQTT broker upgrade considerations

To ensure zero data loss and high availability during deployment upgrades, the MQTT broker implements rolling updates across the MQTT broker pods. The health manager pod coordinates an incremental upgrade process for the MQTT broker pods to ensure that:

* Active client connections remain uninterrupted.
* Any in-flight messages are preserved.
* Data stored on disk is properly migrated between versions.

If a failure occurs during the upgrade process, the health manager pod automatically restarts the upgrade process while ensuring no loss of data or connectivity.

Rolling updates can only occur if the MQTT broker is deployed with two or more backend replicas. MQTT broker upgrades aren't supported for single-replica deployments. When you deploy Azure IoT Operations, you specify the number of backend replicas to create in the [az iot ops create](/cli/azure/iot/ops#az-iot-ops-create) command with the `--broker-backend-rf` parameter.

## Supported versions

[!INCLUDE [supported-versions](../includes/supported-versions.md)]
