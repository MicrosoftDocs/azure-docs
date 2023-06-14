---
title: Create an account for Device Update for Azure IoT Hub
description: Create a device update account and instance in Device Update for Azure IoT Hub using the Azure portal or CLI.
author: eshashah-msft
ms.author: eshashah
ms.date: 10/30/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Create Device Update for IoT Hub resources

To get started with Device Update, create a Device Update account and instance, and then set access control roles.

A Device Update account is a resource in your Azure subscription. A Device Update instance is a logical container within an account that is associated with a specific IoT hub. An instance contains updates and deployments associated with its IoT hub. You can create multiple instances within an account. For more information, see [Device Update resources](device-update-resources.md).

## Prerequisites

# [Azure portal](#tab/portal)

An IoT hub. It's required that you use an S1 (Standard) tier or above.

# [Azure CLI](#tab/cli)

* An IoT hub. It's required that you use an S1 (Standard) tier or above.

* An Azure CLI environment:

  * Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

    [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  * Or, if you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

    * Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.

    * Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).
 
    * When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

---

## Create an account and instance

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), select **Create a Resource** and search for "Device Update for IoT Hub"

2. Select **Create** > **Device Update for IoT Hub**

   :::image type="content" source="media/create-device-update-account/device-update-marketplace.png" alt-text="Screenshot of Device Update for IoT Hub resource." lightbox="media/create-device-update-account/device-update-marketplace.png":::

3. On the **Basics** tab, provide the following information for your Device Update account and instance:

   * **Subscription**: The Azure subscription to be associated with your Device Update account.
   * **Resource group**: An existing or new resource group.
   * **Name**: A name for your account.
   * **Location**: The Azure region where your account will be located. For information about which regions support Device Update for IoT Hub, see [Azure Products-by-region page](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub).
   * Check the box to assign the Device Update administrator role to yourself. You can also use the steps listed in the [Configure access control roles](configure-access-control-device-update.md) section to provide a combination of roles to users and applications for the right level of access. You need to have Owner or User Access Administrator permissions in your subscription to manage roles.
   * **Instance Name**: A name for your instance.
   * **IoT Hub Name**: Select the IoT Hub you want to link to your Device Update instance
   * Check the box to grant the right access to Azure Device Update service principal in the IoT Hub to set up and operate the Device Update Service. You need to have the right permissions to add access. 
   > [!NOTE]
   > If you are unable to grant access to Azure Device Update service principal during resource creation, refer to [configure the access control for users and Azure Device Update service principal](configure-access-control-device-update.md) . If this access is not set you will not be able to run deployment, device management and diagnostic operations. Learn more about the [Azure Device Update service principal access](device-update-control-access.md#configuring-access-for-azure-device-update-service-principal-in-the-iot-hub).

   :::image type="content" source="media/create-device-update-account/account-details.png" alt-text="Screenshot of account details for a new Device Update account." lightbox="media/create-device-update-account/account-details.png":::

4. Select **Next: Diagnostics**. Enabling Microsoft diagnostics, gives Microsoft permission to collect, store, and analyze diagnostic log files from your devices when they encounter an update failure. In order to enable remote log collection for diagnostics, you need to link your Device Update instance to your Azure Blob storage account. Selecting the Azure Storage account will automatically update the storage details.

   :::image type="content" source="media/create-device-update-account/account-diagnostics.png" alt-text="Screenshot of diagnostic details." lightbox="media/create-device-update-account/account-diagnostics.png":::

5. On the **Networking** tab, to continue creating Device Update account and instance.
   Choose the endpoints that devices can use to connect to your Device Update instance. Accept the default setting, Public access, for this example.

   :::image type="content" source="media/create-device-update-account/account-networking.png" alt-text="Screenshot of networking details." lightbox="media/create-device-update-account/account-networking.png":::

6. Select **Next: Review + Create**. After validation, select **Create**.

   :::image type="content" source="media/create-device-update-account/account-review.png" alt-text="Screenshot of account review." lightbox="media/create-device-update-account/account-review.png":::

7. You'll see that your deployment is in progress. The deployment status will change to "complete" in a few minutes. When it does, select **Go to resource**

# [Azure CLI](#tab/cli)

Use the [az iot du account create](/cli/azure/iot/du/account#az-iot-du-account-create) command to create a new Device Update account.

Replace the following placeholders with your own information:

* *\<resource_group>*: An existing resource group in your subscription.
* *\<account_name>*: A name for your Device Update account.
* *\<region>*: The Azure region where your account will be located. For information about which regions support Device Update for IoT Hub, see [Azure Products-by-region page](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub). If no region is provided, the resource group's location is used.

   > [!NOTE]
   > Your Device Update account doesn't need to be in the same region as your IoT hubs, but for better performance it is recommended that you keep them geographically close.

```azurecli-interactive
az iot du account create --resource-group <resource_group> --account <account_name> --location <region>
```

Use the [az iot du instance create](/cli/azure/iot/du/instance#az-iot-du-instance-create) command to create a Device Update instance.

An *instance* of Device Update is associated with a single IoT hub. Select the IoT hub that will be used with Device Update. When you link an IoT hub to a Device Update instance, a new shared access policy is automatically created give Device Update permissions to work with IoT Hub (registry write and service connect). This policy ensures that access is only limited to Device Update.

Replace the following placeholders with your own information:

* *\<account_name>*: The name of the Device Update account that this instance will be associated with.
* *\<instance_name>*: A name for this instance.
* *\<iothub_id>*: The resource ID for the IoT hub that will be linked to this instance. You can retrieve your IoT hub resource ID by using the [az iot hub show](/cli/azure/iot/hub#az-iot-hub-show) command and querying for the ID value: `az iot hub show -n <iothub_name> --query id`.

```azurecli-interactive
az iot du instance create --account <account_name> --instance <instance_name> --iothub-ids <iothub_id>
```

>[!TIP]
>As part of the instance creation process, you can also configure diagnostics logging. For more information, see [Remotely collect diagnostic logs from devices](device-update-log-collection.md).

---

## Next steps

Once you have created your Device Update resources, [configure the access control for users and Azure Device Update service principal](configure-access-control-device-update.md).

Or, learn more about [Device Update accounts and instances](device-update-resources.md) or [Device Update access control roles](device-update-control-access.md).
