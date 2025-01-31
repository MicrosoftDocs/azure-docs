---
title: Upgrade or rollback
description: Upgrade an Azure IoT Operations instance or rollback to a previous version.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.custom: devx-track-azurecli
ms.date: 01/31/2025

#CustomerIntent: As an OT professional, I want to manage Azure IoT Operations instances.
---

# Upgrade or downgrade between versions

Upgrade an Azure IoT Operations deployment to a newer version or rollback to a previous version. Azure IoT Operations supports upgrade and rollback from version 1.0.x onwards. There is no support for upgrading from any preview version of Azure IoT Operations to any generally available (GA) version.

## Prerequisites

* Azure CLI. This scenario requires Azure CLI version 2.64.0 or higher. Use `az --version` to check your version and `az upgrade` to update if necessary. For more information, see [Get started with Azure CLI](/cli/azure/get-started-with-azure-cli).

* The Azure IoT Operations extension for Azure CLI. Use the following command to add the extension or update it to the latest version:

  ```azurecli
  az extension add --upgrade --name azure-iot-ops
  ```

## Understand upgrade support

Upgrade and rollback are supported between N+3 or N-3 minor versions of Azure IoT Operations, or between any patch versions of the same minor version. The following table provides examples:

| Version | Upgrade range | Downgrade range |
| ------- | ------------- | --------------- |
| 1.0.0   | 1.0.1 through 1.3.x | None      |
| 1.1.0   | 1.1.1 through 1.4.x | 1.0.x     |
| 1.4.4   | 1.4.5 through 1.7.x | 1.1.x through 1.4.3 |

## Upgrade

Azure IoT Operations supports upgrading instances to new GA versions as they're released.

You can't upgrade from a preview installation to a GA version. To move to version 1.0.x, [uninstall Azure IoT Operations](howto-manage-update-uninstall.md#uninstall) and reinstall the new version.

### [Azure portal](#tab/portal)

If your Azure IoT Operations deployment is eligible for an upgrade, the Azure portal displays an **Upgrade** option. If you don't see the option to upgrade, then your deployment is on the latest version.

1. In the [Azure portal](https://portal.azure.com), navigate to your Azure IoT Operations instance.
1. Select **Upgrade** on the **Overview** page of your instance.

   :::image type="content" source="./media/howto-upgrade/instance-upgrade.png" alt-text="Screenshot that shows the upgrade button enabled in the Azure portal.":::

1. The portal presents the Azure CLI command to upgrade your instance, prepopulated with your subscription, resource group, and instance details. Select the copy icon next to the CLI command.

1. Run the copied `az iot ops upgrade` command in any environment where you have the Azure CLI installed.

1. After the upgrade command completes successfully, refresh your instance to see the changes.

The **Version** value displayed on your instance's overview page reflects the version of the Azure IoT Operations instance. However, you may be prompted to upgrade if a required Arc extension has an available upgrade. You can tell that an upgrade was successful if the **Upgrade** option disappears from the instance overview page, even if it doesn't look like anything changed. You can check the versions of the Arc extensions for your Azure IoT Operation deployment on the **Extensions** page of your Arc-enabled cluster in the Azure portal.

### [Azure CLI](#tab/cli)

Use the [az iot ops upgrade](/cli/azure/iot/ops#az-iot-ops-upgrade) command to upgrade an existing Azure IoT Operations deployment to a newer version.

The upgrade command evaluates the entire Azure IoT Operations deployment for available updates, including the arc extensions that are installed in the `az iot ops init` command as well as the Azure IoT Operations instance.

```azurecli
az iot ops upgrade --resource-group <RESOURCE_GROUP_NAME> --name <INSTANCE_NAME>
```

The CLI outputs a table of the components, if any, that have available upgrades. Enter `Y` to continue with the upgrade.

To upgrade to a specific version of a component, specify the version number in the parameters. For example:

```azurecli
az iot ops upgrade --resource-group <RESOURCE_GROUP_NAME> --name <INSTANCE_NAME> --acs-version 2.2.3
```

You can find the supported component versions and release train information in the **azure-iot-operations-enablement.json** file included in any given [Azure IoT Operations release](https://github.com/Azure/azure-iot-operations/releases).

---

## Downgrade

### [Azure portal](#tab/portal)

The Azure portal doesn't offer a version downgrade option. Instead, use the Azure CLI.

### [Azure CLI](#tab/cli)

Use the [az iot ops upgrade](/cli/azure/iot/ops#az-iot-ops-upgrade) command to roll back an existing Azure IoT Operations instance to a previous version.

In the upgrade command, you can specify a component version up to three minor versions older that the latest.

You can find the supported component versions and release train information in the **azure-iot-operations-enablement.json** file included in any given [Azure IoT Operations release](https://github.com/Azure/azure-iot-operations/releases).

---
