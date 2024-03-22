---
title: Device Update for Azure IoT Hub log collection | Microsoft Docs
description: Device Update for IoT Hub enables remote collection of diagnostic logs from connected IoT devices.
author: vimeht
ms.author: vimeht
ms.date: 10/26/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Remotely collect diagnostic logs from devices using Device Update for IoT Hub

Learn how to initiate a Device Update for IoT Hub log operation and view collected logs within Azure blob storage.

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md).
* An IoT device (or simulator) [provisioned for Device Update](device-update-agent-provisioning.md) within IoT Hub and implementing the Diagnostic Interface.
* An [Azure Blob storage account](../storage/common/storage-account-create.md) under the same subscription as your Device Update for IoT Hub account.

> [!NOTE]
> The remote log collection feature is currently compatible only with devices that implement the Diagnostic Interface and are able to upload files to Azure Blob storage. The reference agent implementation also expects the device to write log files to a user-specified file path on the device.

# [Azure portal](#tab/portal)

Supported browsers:

* [Microsoft Edge](https://www.microsoft.com/edge)
* Google Chrome

# [Azure CLI](#tab/cli)

An Azure CLI environment:

* Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

  :::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

* Or, if you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

  * Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.
  * Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).
  * When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

>[!TIP]
>The Azure CLI commands in this article use the backslash `\` character for line continuation so that the command arguments are easier to read. This syntax works in Bash environments. If you're running these commands in PowerShell, replace each backslash with a backtick `\``, or remove them entirely.

---

## Link your Azure Blob storage account to your Device Update instance

In order to use the remote log collection feature, you must first link an Azure Blob storage account with your Device Update instance. This Azure Blob storage account is where your devices will upload diagnostic logs to.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your Device Update for IoT Hub account.

2. Select **Instances** under the **Instance Management** section of the navigation pane.

3. Select your Device Update instance from the list, then **Configure Diagnostics**.

4. Select the **Customer Diagnostics** tab, then **Select Azure Storage Account**.

5. Choose your desired storage account from the list and select **Save.**

6. Once back on the instance list, select **Refresh** periodically until the instance's provisioning state shows "Succeeded." This process usually takes 2-3 minutes.

# [Azure CLI](#tab/cli)

Use the [az iot du instance create](/cli/azure/iot/du/instance#az-iot-du-instance-create) command to configure diagnostics for your Device Update instance.

>[!TIP]
>You can use the `az iot du instance create` command on an existing Device Update instances and it will configure the instance with the updated parameters.

Replace the following placeholders with your own information:

* *\<account_name>*: The name of your Device Update account.
* *\<instance_name>*: The name of your Device Update instance.
* *\<storage_id>*: The resource ID of the storage account where the diagnostics logs will be stored. You can retrieve the resource ID by using the [az storage show](/cli/azure/storage/account#az-storage-account-show) command and querying for the ID value: `az storage account show -n <storage_name> --query id`.

```azurecli-interactive
az iot du instance update --account <account_name> --instance <instance_name> --set enableDiagnostics=true diagnosticStorageProperties.resourceId=<storage_id>
```

---

## Configure log collection

The device update agent refers to a configuration file on the device, located at **/etc/adu/du-diagnostics-config.json** in the reference agent.

### Log collection file paths

The Device Update agent on a device will collect files from specific file paths on the device when it receives a log upload start signal from the Device Update service. These file paths are defined in the diagnostics config file.

Within the configuration file, each log file to be collected and uploaded is represented as a `logComponent` object with componentName and logPath properties. This configuration can be modified as desired.

### Max log file size

The Device Update agent will only collect log files under a certain file size. This max file size is defined in the diagnostics config file.

The relevant parameter "maxKilobytesToUploadPerLogPath" will apply to each logComponent object, and can be modified as desired.

## Create a log operation

Log operations are a service-driven action that you can instruct your IoT devices to perform through the Device Update service. For a more detailed explanation of how log operations function, see [Device update diagnostics](device-update-diagnostics.md).

# [Azure portal](#tab/portal)

1. Navigate to your IoT Hub and select the **Updates** tab under the **Device Management** section of the navigation pane.

2. Select the **Diagnostics** tab in the UI. If you don't see a Diagnostics tab, make sure you're using the newest version of the Device Update for IoT Hub user interface. If you see "Diagnostics must be enabled for this Device Update instance," make sure you've linked an Azure Blob storage account with your Device Update instance.

3. Select **Add log upload operation** to navigate to the log operation creation page.

4. Enter a name (ID) and description for your new log operation, then select **Add devices** to select which IoT devices you want to collect diagnostic logs from.

5. Select **Add**.

6. Once back on the Diagnostics tab, select **Refresh** until you see your log operation listed in the Operation Table.

7. Once the operation status is **Succeeded** or **Failed**, select the operation name to view its details. An operation will be marked "Succeeded" only if all targeted devices successfully completed the log upload. If some targeted devices succeeded and some failed, the log operation will be marked "Failed." You can use the log operation details page to see which devices succeeded and which failed.

8. In the log operation details, you can view the device-specific status and see the log location path. This path corresponds to the virtual directory path within your Azure Blob storage account where the diagnostic logs have been uploaded.

# [Azure CLI](#tab/cli)

Use the [az iot du device log collect](/cli/azure/iot/du/device/log#az-iot-du-device-log-collect) command to configure a diagnostics log collection operation.

The `device log collect` command takes the following arguments:

* `--account`: The Device Update account name.
* `--instance`: The Device Update instance name.
* `--log-collection-id`: A name for the log collection operation.
* `--agent-id`: Key=value pairs that identify a target Device Update agent for this log collection operation. Use `deviceId=<device name>` if the agent has a device identity. Use `deviceId=<device name> moduleId=<module name>` if the agent has a module identity. You can use the `--agent-id` parameter multiple times to target multiple devices.

For example:

```azurecli
az iot du device log collect \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --log-collection-id <log collection name} \
    --agent-id deviceId=<device name> \
    --agent-id deviceId=<device name> moduleId=<module name>
```

Use [az iot du device log show](/cli/azure/iot/du/device/log#az-iot-du-device-log-show) to view the details of a specific diagnostic log collection operation.

```azurecli
az iot du device log show \
    --account <Device Update account name> \
    --instance <Device Update instance name> \
    --log-collection-id <log collection name>
```

---

## View and export collected diagnostic logs

1. Once your log operation has succeeded, navigate to your Azure Blob storage account.

2. Select **Containers** under the **Data storage** section of the navigation pane.

3. Select the container with the same name as your Device Update instance.

4. Use the log location path from the log operation details to navigate to the correct directory containing the logs. By default, the remote log collection feature instructs targeted devices to upload diagnostic logs using the following directory path model: **Blob storage container/Target device ID/Log operation ID/On-device log path**

5. If you haven't modified the diagnostic component of the Device Update agent, the device will respond to any log operation by attempting to upload two plaintext log files: the Device Update agent diagnostic log ("aduc.log"), and the DO agent diagnostic log ("do-agent.log"). You can learn more about which log files the Device Update reference agent collects by reading the [Device Update diagnostics](device-update-diagnostics.md) concept page.

6. You can view the log file's contents by selecting the file name, then selecting the menu element (ellipsis) and clicking **View/edit**. You can also download or delete the log file by selecting the respectively labeled options.

   :::image type="content" source="media/device-update-log-collection/blob-storage-log.png" alt-text="Screenshot of log file within Azure Blob storage." lightbox="media/device-update-log-collection/blob-storage-log.png":::

## Next steps

To learn more about Device Update's diagnostic capabilities, see [Device update diagnostic feature overview](device-update-diagnostics.md)
