---
title: Deploy an update by using Device Update for Azure IoT Hub | Microsoft Docs
description: Deploy an update by using Device Update for Azure IoT Hub.
author: vimeht
ms.author: vimeht
ms.date: 10/31/2022
ms.topic: how-to
ms.service: iot-hub-device-update
ms.custom: devx-track-azurecli
---

# Deploy an update by using Device Update for Azure IoT Hub

Learn how to deploy an update to an IoT device by using Device Update for Azure IoT Hub.

## Prerequisites

* Access to [an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md). We recommend that you use an S1 (Standard) tier or above for your IoT Hub.
* An [imported update for the provisioned device](import-update.md).
* An IoT device (or simulator) provisioned for Device Update within IoT Hub.
* The device is part of at least one default group or [user-created update group](create-update-group.md).

# [Azure portal](#tab/portal)

Supported browsers:

* [Microsoft Edge](https://www.microsoft.com/edge)
* Google Chrome

# [Azure CLI](#tab/cli)

An Azure CLI environment:

* Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

  [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

* Or, if you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

  1. Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.
  2. Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).
  3. When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

>[!TIP]
>The Azure CLI commands in this article use the backslash `\` character for line continuation so that the command arguments are easier to read. This syntax works in Bash environments. If you're running these commands in PowerShell, replace each backslash with a backtick `\``, or remove them entirely.

---

## Deploy the update

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Updates** from the navigation menu to open the **Device Update** page of your IoT Hub instance.

    :::image type="content" source="media/deploy-update/device-update-iot-hub.png" alt-text="Screenshot that shows the Get started with the Device Update for IoT Hub page." lightbox="media/deploy-update/device-update-iot-hub.png":::

1. Select the **Groups and Deployments** tab at the top of the page. For more information, see [Device groups](device-update-groups.md).

   :::image type="content" source="media/deploy-update/updated-view.png" alt-text="Screenshot that shows the Groups and Deployments tab." lightbox="media/deploy-update/updated-view.png":::

1. View the update compliance chart and group list. You should see a new update available for your tag based or default group. You might need to refresh once. For more information, see [Device Update compliance](device-update-compliance.md).

1. Select Deploy next to the **one or more updates available**, and confirm that the descriptive label you added when importing is present and looks correct.

1. Confirm that the correct group is selected as the target group and select **Deploy**.

1. To start the deployment, go to the **Current deployment** tab. Select the **Deploy** link next to the desired update from the **Available updates** section. The best available update for a given group is denoted with a **Best** highlight.

   :::image type="content" source="media/deploy-update/select-update.png" alt-text="Screenshot that shows Best highlighted." lightbox="media/deploy-update/select-update.png":::

1. Schedule your deployment to start immediately or in the future.

   > [!TIP]
   > By default, the **Start** date and time is set to Immediately. Be sure to select a different date and time if you want the deployment to begin later.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Screenshot that shows the Create deployment screen" lightbox="media/deploy-update/create-deployment.png":::

1. Create an automatic rollback policy if needed. Then select **Create**.

1. In the deployment details, **Status** turns to **Active**. The deployed update is marked with **(deploying)**.

   :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. View the compliance chart to see that the update is now in progress.

   :::image type="content" source="media/deploy-update/update-in-progress.png" alt-text="Screenshot that shows Updates in progress." lightbox="media/deploy-update/update-in-progress.png":::

1. After your device is successfully updated, you see that your compliance chart and deployment details updated to reflect the same.

   :::image type="content" source="media/deploy-update/update-succeeded.png" alt-text="Screenshot that shows the update succeeded." lightbox="media/deploy-update/update-succeeded.png":::

# [Azure CLI](#tab/cli)

 

The [`az iot du device group list`](/cli/azure/iot/du/device/group#az-iot-du-device-group-list) to verify the best available update for your group. The command takes the following arguments:

* `--account`: The Device Update account name.
* `--instance`: The Device Update instance name.
* `--group-id`: The device group ID that you're targeting with this deployment. This ID is the value of the **ADUGroup** tag, or `$default` for devices with no tag.
* `--best-updates`: This flag indicates the command should fetch the best available updates for the device group including a count of how many devices need each update. 
* `--resource-group -g': Device Update account resource group name.
* '--update-compliance': This flag indicates the command should fetch device group update compliance information such as how many devices are on their latest update, how many need new updates, and how many are in progress on receiving a new update.

```azurecli
az iot du device group list \
    --account <Device Update account name> \
    --instance <Device Update instance name>\
    --gid <device group id>\
    --best-updates {false, true}
```

Use [az iot du device deployment create](/cli/azure/iot/du/device/deployment#az-iot-du-device-deployment-create) to create a deployment for a device group.

The `device deployment create` command takes the following arguments:

* `--account`: The Device Update account name.
* `--instance`: The Device Update instance name.
* `--group-id`: The device group ID that you're targeting with this deployment. This ID is the value of the **ADUGroup** tag, or `$default` for devices with no tag.
* `--deployment-id`: An ID to identify this deployment.
* `--update-name`, `--update-provider`, and `--update-version`: These three parameters define the **updateId** object that is a unique identifier for the update that you're using in this deployment.

```azurecli
az iot du device deployment create \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <device group id> \
    --deployment-id <deployment id> \
    --update-name <update name> \
    --update-provider <update provider> \
    --update-version <update version>
```

Optional arguments allow you to configure the deployment. For the full list, see [Optional parameters](/cli/azure/iot/du/device/deployment#az-iot-du-device-deployment-create-optional-parameters)

If you want to create an automatic rollback policy, add the following parameters:

* `--failed-count`: The number of failed devices in a deployment that will trigger a rollback.
* `--failed-percentage`: The percentage of failed devices in a deployment that will trigger a rollback.
* `--rollback-update-name`, `--rollback-update-provider`, `--rollback-update-version`: The updateID for the update that the device group will use if a rollback is initiated.

```azurecli
az iot du device deployment create \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <device group id> \
    --deployment-id <deployment id> \
    --update-name <update name> \
    --update-provider <update provider> \
    --update-version <update version> \
    --failed-count 10 \
    --failed-percentage 5 \
    --rollback-update-name <rollback update name> \
    --rollback-update-provider <rollback update provider> \
    --rollback-update-version <rollback update version>
```

If you want the deployment to start in the future, use the `--start-time` parameter to provide the target datetime for the deployment.

```azurecli
az iot du device deployment create \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <device group id> \
    --deployment-id <deployment id> \
    --update-name <update name> \
    --update-provider <update provider> \
    --update-version <update version> \
    --start-time "2022-12-20T01:00:00"
```

---

## Monitor an update deployment

# [Azure portal](#tab/portal)

1. Select the group you deployed to, and go to the **Current updates** or **Deployment history** tab to confirm that the deployment is in progress

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Screenshot that shows the Deployment history tab." lightbox="media/deploy-update/deployments-history.png":::

1. Select **Details** next to the deployment you created. Here you can view the deployment details, update details, and target device class details. You can optionally add a friendly name for the device class.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Screenshot that shows deployment details." lightbox="media/deploy-update/deployment-details.png":::

1. Select **Refresh** to view the latest status details.

1. You can go to the group basics view to search the status for a particular device, or filter to view devices that have failed the deployment

# [Azure CLI](#tab/cli)

Use [az iot du device deployment list](/cli/azure/iot/du/device/deployment#az-iot-du-device-deployment-list) to view all deployment for a device group.

```azurecli
az iot du device deployment list \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <device group id>
```

Use [az iot du device deployment show](/cli/azure/iot/du/device/deployment#az-iot-du-device-deployment-show) to view the details of a particular deployment.

```azurecli
az iot du device deployment show \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <device group ID> \
    --deployment-id <deployment ID>
```

Add the `--status` flag to return information about how many devices in the deployment are in progress, completed, or failed.

```azurecli
az iot du device deployment show \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <device group ID> \
    --deployment-id <deployment ID> \
    --status
```

---

## Retry an update deployment

If your deployment fails for some reason, you can retry the deployment for failed devices.

# [Azure portal](#tab/portal)

1. Go to the **Current deployment** tab on the **Group details** screen.

    :::image type="content" source="media/deploy-update/deployment-active.png" alt-text="Screenshot that shows the deployment as Active." lightbox="media/deploy-update/deployment-active.png":::

1. Select **Retry failed devices** and acknowledge the confirmation notification.

# [Azure CLI](#tab/cli)

Use [az iot du device deployment retry](/cli/azure/iot/du/device/deployment#az-iot-du-device-deployment-retry) to retry a deployment for a target subgroup of devices.

This command takes the `--class-id` argument, which is generated from the model ID and compatibility properties reported by the device update agent.

```azurecli
az iot du device deployment retry \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --deployment-id <deployment ID> \
    --group-id <device group ID> \
    --class-id <device class ID>
```

---

## Next steps

[Troubleshoot common issues](troubleshoot-device-update.md)
