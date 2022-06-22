---
title: Create a device update account in Device Update for Azure IoT Hub | Microsoft Docs
description: Create a device update account in Device Update for Azure IoT Hub.
author: vimeht
ms.author: vimeht
ms.date: 06/22/2022
ms.topic: how-to
ms.service: iot-hub-device-update
ms.custom: subject-rbac-steps
---

# Device Update for IoT Hub resource management

To get started with Device Update you'll need to create a Device Update account and instance, and then set access control roles.

## Prerequisites

# [Azure portal](#tab/portal)

An IoT hub. It's recommended that you use an S1 (Standard) tier or above.

# [CLI](#tab/cli)

* An IoT hub. It's recommended that you use an S1 (Standard) tier or above.

* An Azure CLI environment:

  * Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

    [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  * If you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

    * Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.
    * Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).
    * When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

---

## Create a device update account and instance

# [Azure portal](#tab/portal)

1. Go to the [Azure portal](https://portal.azure.com).

2. Select **Create a Resource** and search for "Device Update for IoT Hub"

   :::image type="content" source="media/create-device-update-account/device-update-marketplace.png" alt-text="Screenshot of Device Update for IoT Hub resource." lightbox="media/create-device-update-account/device-update-marketplace.png":::

3. Select **Create** > **Device Update for IoT Hub**

4. On the **Basics** tab, provide the following information for your Device Update account:

   * **Subscription**: The Azure subscription to be associated with your Device Update account.
   * **Resource group**: An existing or new resource group.
   * **Name**: A name for your account.
   * **Location**: The Azure region where your account will be located. For information about which regions support Device Update for IoT Hub, see [Azure Products-by-region page](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub).

   > [!NOTE]
   > Your Device Update account doesn't need to be in the same region as your IoT hubs, but for better performance it is recommended that you keep them geographically close.

   :::image type="content" source="media/create-device-update-account/account-details.png" alt-text="Screenshot of account details." lightbox="media/create-device-update-account/account-details.png":::

5. Optionally, you can check the box to assign the Device Update administrator role to yourself. You can also use the steps listed in the [Configure access control roles](#configure-access-control-roles) section to provide a combination of roles to users and applications for the right level of access.

6. Select **Next: Instance**

    An *instance* of Device Update is associated with a single IoT hub. Select the IoT hub that will be used with Device Update. When you link an IoT hub to a Device Update instance, a new shared access policy is automatically created give Device Update permissions to work with IoT Hub (registry write and service connect). This policy ensures that access is only limited to Device Update.

7. On the **Instance** tab, provide the following information for your Device Update instance:

   * **Name**: A name for your instance.
   * **IoT Hub details**: Select an IoT hub to link to this instance.

   :::image type="content" source="media/create-device-update-account/instance-details.png" alt-text="Screenshot of instance details." lightbox="media/create-device-update-account/instance-details.png":::

8. Select **Next: Review + Create**. After validation, select **Create**.

   :::image type="content" source="media/create-device-update-account/account-review.png" alt-text="Screenshot of account review." lightbox="media/create-device-update-account/account-review.png":::

9. You'll see that your deployment is in progress. The deployment status will change to "complete" in a few minutes. When it does, select **Go to resource**

   :::image type="content" source="media/create-device-update-account/account-complete.png" alt-text="Screenshot of account deployment complete." lightbox="media/create-device-update-account/account-complete.png":::

# [CLI](#tab/cli)

Use the [az iot device-update account create](/cli/azure/iot/device-update/account#az-iot-device-update-account-create) command to create a new Device Update account.

Replace the following placeholders with your own information:

* *\<resource_group>*: An existing resource group in your subscription.
* *\<name>*: A name for your Device Update account.
* *\<region>*: The Azure region where your account will be located. For information about which regions support Device Update for IoT Hub, see [Azure Products-by-region page](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub). If no region is provided, the resource group's location is used.

   > [!NOTE]
   > Your Device Update account doesn't need to be in the same region as your IoT hubs, but for better performance it is recommended that you keep them geographically close.

```azurecli-interactive
az iot device-update account create --resource-group <resource_group> --account <name> --location <region>
```

Use the [az iot device-update instance create](/cli/azure/iot/device-update/instance#az-iot-device-update-instance-create) command to create a Device Update instance.

An *instance* of Device Update is associated with a single IoT hub. Select the IoT hub that will be used with Device Update. When you link an IoT hub to a Device Update instance, a new shared access policy is automatically created give Device Update permissions to work with IoT Hub (registry write and service connect). This policy ensures that access is only limited to Device Update.

Replace the following placeholders with your own information:

* *\<account_name>*: The name of the Device Update account that this instance will be associated with.
* *\<name>*: A name for this instance.
* *\<iothub_id>*: The resource ID for the IoT hub that will be linked to this instance. You can retrieve your IoT hub resource ID by using the [az iot hub show](/cli/azure/iot/hub#az-iot-hub-show) command and querying for the ID value: `az iot hub show -n <iothub_name> --query id`.

```azurecli-interactive
az iot device-update instance create --account <account_name> --instance <name> --iothub-ids <iothub_id>
```

---

## Configure access control roles

In order for other users to have access to Device Update, they must be granted access to this resource. You can skip this step if you assigned the Device Update administrator role to yourself during account creation and don't need to provide access to other users or applications.

# [Azure portal](#tab/portal)

1. In your Device Update account, select **Access control (IAM)** from the navigation menu.

   :::image type="content" source="media/create-device-update-account/account-access-control.png" alt-text="Screenshot of access Control within Device Update account." lightbox="media/create-device-update-account/account-access-control.png":::

2. Select **Add role assignments**.

3. On the **Role** tab, select a Device Update role from the available options:

   * Device Update Administrator
   * Device Update Reader
   * Device Update Content Administrator
   * Device Update Content Reader
   * Device Update Deployments Administrator
   * Device Update Deployments Reader

   For more information, [Learn about Role-based access control in Device Update for IoT Hub](device-update-control-access.md).

   :::image type="content" source="media/create-device-update-account/role-assignment.png" alt-text="Screenshot of access Control role assignments within Device Update account." lightbox="media/create-device-update-account/role-assignment.png":::

4. Select **Next**
5. On the **Members** tab, select the users or groups that you want to assign the role to.

   :::image type="content" source="media/create-device-update-account/role-assignment-2.png" alt-text="Screenshot of access Control member selection within Device Update account." lightbox="media/create-device-update-account/role-assignment-2.png":::

6. Select **Review + assign**
7. Review the new role assignments and select **Review + assign** again
8. You're now ready to use Device Update from within your IoT Hub

# [CLI](#tab/cli)

The following roles are available for assigning access to Device Update:

* Device Update Administrator
* Device Update Reader
* Device Update Content Administrator
* Device Update Content Reader
* Device Update Deployments Administrator
* Device Update Deployments Reader

For more information, [Learn about Role-based access control in Device Update for IoT Hub](device-update-control-access.md).

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to configure access control for your Device Update account.

Replace the following placeholders with your own information:

* *\<role>*: The Device Update role that you're assigning.
* *\<user_group>*: The user or group that you want to assign the role to.
* *\<account_id>*: The resource ID for the Device Update account that the user or group will get access to. You can retrieve the resource ID by using the [az iot device-update account show](/cli/azure/iot/device-update/account#az-iot-device-update-account-show) command and querying for the ID value: `az iot device-update account show -n <account_name> --query id`.

```azurecli-interactive
az role assignment create --role '<role>` --assignee <user_group> --scope <account_id>
```

---

## Next steps

Try updating a device using one of the following quick tutorials:

* [Update a simulated IoT Edge device](device-update-simulator.md)
* [Update a Raspberry Pi](device-update-raspberry-pi.md)
* [Update an Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)

[Learn about Device update account and instance.](device-update-resources.md)

[Learn about Device update access control roles](device-update-control-access.md)
