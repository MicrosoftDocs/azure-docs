---
title: Deploy an update by using Azure Device Update for IoT Hub | Microsoft Docs
description: Learn how to deploy an update to IoT devices by using Azure Device Update for IoT Hub in the Azure portal or with Azure CLI.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 01/24/2025
ms.topic: how-to
ms.service: azure-iot-hub
ms.custom: devx-track-azurecli
ms.subservice: device-update
---

# Deploy an update by using Azure Device Update for IoT Hub

In this article, you learn how to deploy an update to IoT devices by using Azure Device Update for IoT Hub in the Azure portal or with Azure CLI.

## Prerequisites

- A Standard (S1) or higher instance of [Azure IoT Hub](/azure/iot-hub/create-hub?tabs=portal) with [Device Update for IoT Hub enabled](create-device-update-account.md).
- An IoT device or simulator [provisioned for Device Update](device-update-agent-provisioning.md) within the IoT hub. The provisioned device can be a member of a [user-created device group](create-update-group.md) or the default group.
- An [imported update for the provisioned device](import-update.md).

## Deploy the update

This section describes how to deploy the update by using the Azure portal or Azure CLI.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Updates** under **Device management** in the left navigation.

   :::image type="content" source="media/deploy-update/device-update-iot-hub.png" alt-text="Screenshot that shows the Get started with the Device Update for IoT Hub page." lightbox="media/deploy-update/device-update-iot-hub.png":::

1. On the **Updates** page, select the **Groups and Deployments** tab and view the [update compliance chart](device-update-compliance.md) and [device group list](device-update-groups.md). You might need to refresh the view to see recently imported updates available for your device group.

1. Under **Status** in the group list, select **Deploy** next to **One or more new updates are available for this group**.

   :::image type="content" source="media/deploy-update/compliance-1.png" alt-text="Screenshot of the compliance view for Groups and Deployments." lightbox="media/deploy-update/compliance-1.png":::
   
1. View the update compliance chart and group list. You should see a new update available for your tag based or default group. You might need to refresh once. For more information, see [Device Update compliance](device-update-compliance.md).

1. Select **Deploy** next to the **one or more updates available** status.

1. From the list on the right, select the desired update to deploy.

   :::image type="content" source="media/deploy-update/deploy-3.png" alt-text="Screenshot of the deployment view for selecting updates." lightbox="media/deploy-update/deploy-3.png":::
   
1. Schedule your deployment to start immediately or in the future.

   > [!TIP]
   > By default, the **Start** date and time is 24 hours from your current time. Be sure to select a different date and time if you want the deployment to begin sooner or later.

   :::image type="content" source="media/deploy-update/create-deployment.png" alt-text="Screenshot that shows the Create deployment screen" lightbox="media/deploy-update/create-deployment.png":::

1. Create an automatic rollback policy if needed. Then select **Create**.

1. In the **Current updates** tab, you can view the status of your deployment.

   :::image type="content" source="media/deploy-update/current-updates-4.png" alt-text="A screenshot of the Current updates view." lightbox="media/deploy-update/current-updates-4.png":::
   
1. In the **Group basics** view, the compliance chart shows that the update is now in progress.

   After your device successfully updates, your compliance chart and deployment details update to reflect that status.

# [Azure CLI](#tab/cli)

You can use the Bash environment in [Azure Cloud Shell](/azure/cloud-shell/quickstart) to run the following commands. Select **Launch Cloud Shell** to open Cloud Shell, or select the Cloud Shell icon in the top toolbar of the Azure portal.

:::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

Or, if you prefer, you can run the Azure CLI commands locally:

1. [Install Azure CLI](/cli/azure/install-azure-cli). Run [az version](/cli/azure/reference-index#az-version) to see the installed Azure CLI version and dependent libraries, and run [az upgrade](/cli/azure/reference-index#az-upgrade) to install the latest version.
1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login).
1. Install the `azure-iot` extension when prompted on first use. To make sure you're using the latest version of the extension, run `az extension update --name azure-iot`.

>[!TIP]
>The Azure CLI commands in this article use the backslash \\ character for line continuation so that the command arguments are easier to read. This syntax works in Bash environments. If you run these commands in PowerShell, replace each backslash with a backtick \`, or remove them entirely.

### Verify update availability

1. Use the [`az iot du device group list`](/cli/azure/iot/du/device/group#az-iot-du-device-group-list) command to identify your device group.

   ```azurecli
   az iot du device group list \
       --account <Device Update account name> \
       --instance <Device Update instance name>\
   ```

1. Then use [`az iot du device group show`](/cli/azure/iot/du/device/group#az-iot-du-device-group-show) to show the best available update for your group. The command takes the following arguments:

   - `--account`: The Device Update account name.
   - `--instance`: The Device Update instance name.
   - `--group-id`: The device group ID that you're targeting with this deployment, which is either the value of the `ADUGroup` tag, or `$default` for devices with no tag.
   - `--resource-group`: The Device Update account resource group name.
   - `--best-updates`: Returns the best available updates for the device group, including a count of how many devices need each update.
   - `--update-compliance`: Returns device group update compliance information, such as how many devices are on their latest update, how many need new updates, and how many are currently receiving a new update.

   To verify the best available update for your group, run the command as follows:
   
   ```azurecli
   az iot du device group show \
       --account <Device Update account name> \
       --instance <Device Update instance name>\
       --group-id <device group ID>\
       --best-updates
   ```

### Create the deployment

Use [`az iot du device deployment create`](/cli/azure/iot/du/device/deployment#az-iot-du-device-deployment-create) to create a deployment for the device group. The command takes the following arguments:

- `--account`: The Device Update account name.
- `--instance`: The Device Update instance name.
- `--group-id`: The device group ID that you're targeting with this deployment, which is either the value of the `ADUGroup` tag, or `$default` for devices with no tag.
- `--deployment-id`: An ID to identify this deployment.
- `--update-name`, `--update-provider`, and `--update-version`: The parameters that define the `updateId` object, a unique identifier for the update in this deployment.

Run the command as follows:

```azurecli
az iot du device deployment create \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <device group ID> \
    --deployment-id <deployment ID> \
    --update-name <update name> \
    --update-provider <update provider> \
    --update-version <update version>
```

### Use optional arguments

Optional arguments allow you to further configure the deployment. For the full list of optional arguments, see [Optional parameters](/cli/azure/iot/du/device/deployment#az-iot-du-device-deployment-create-optional-parameters).

To create an automatic rollback policy, add the following parameters:

- `--failed-count`: The number of failed devices in a deployment that triggers a rollback.
- `--failed-percentage`: The percentage of failed devices in a deployment that triggers a rollback.
- `--rollback-update-name`, `--rollback-update-provider`, `--rollback-update-version`: The parameters for the update to use if a rollback is initiated.

Run the command as follows:

```azurecli
az iot du device deployment create \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --group-id <device group ID> \
    --deployment-id <deployment ID> \
    --update-name <update name> \
    --update-provider <update provider> \
    --update-version <update version> \
    --failed-count 10 \
    --failed-percentage 5 \
    --rollback-update-name <rollback update name> \
    --rollback-update-provider <rollback update provider> \
    --rollback-update-version <rollback update version>
```

To set the deployment start time, use the `--start-time` parameter to provide the target date and time for the deployment, as follows:

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

## Monitor deployment status

# [Azure portal](#tab/portal)

1. On the **Groups and Deployments** tab of the **Updates** page, select the group you deployed to.

1. On the **Group details** page, go to the **Current deployment** or **Deployment history** tab to confirm that a deployment is in progress.

   :::image type="content" source="media/deploy-update/deployments-history.png" alt-text="Screenshot that shows the Deployment history tab." lightbox="media/deploy-update/deployments-history.png":::

1. Select **Details** next to a deployment to view the deployment details, update details, and target device class details. You can optionally add a friendly name for the device class.

1. Select **Refresh** to view the latest status details.

   :::image type="content" source="media/deploy-update/deployment-details.png" alt-text="Screenshot that shows deployment details." lightbox="media/deploy-update/deployment-details.png":::

Go to the **Group basics** tab of the **Group details** page to search for the status of a particular device, or filter to view devices that failed the deployment.

# [Azure CLI](#tab/cli)

Use [az iot du device deployment list](/cli/azure/iot/du/device/deployment#az-iot-du-device-deployment-list) to view all deployments for a device group.

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

If your deployment fails, you can retry the deployment for failed devices.

# [Azure portal](#tab/portal)

1. Go to the **Current deployment** tab on the **Group details** screen.

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

## Related content

- [Device Update deployments](device-update-deployments.md)
- [Device Update Troubleshooting Guide](troubleshoot-device-update.md)
