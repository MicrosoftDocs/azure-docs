---
title: Create a device update account in Device Update for Azure IoT Hub | Microsoft Docs
description: Create a device update account in Device Update for Azure IoT Hub.
author: vimeht
ms.author: vimeht
ms.date: 06/23/2022
ms.topic: how-to
ms.service: iot-hub-device-update
ms.custom: subject-rbac-steps
---

# Device Update for IoT Hub resource management

To get started with Device Update you'll need to create a Device Update account and instance, and then set access control roles.

## Prerequisites

# [Azure portal](#tab/portal)

An IoT hub. It's recommended that you use an S1 (Standard) tier or above.

# [Azure CLI](#tab/cli)

* An IoT hub. It's recommended that you use an S1 (Standard) tier or above.

* An Azure CLI environment:

  * Use the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

    [![Launch Cloud Shell in a new window](../../includes/media/cloud-shell-try-it/hdi-launch-cloud-shell.png)](https://shell.azure.com)

  * Or, if you prefer to run CLI reference commands locally, [install the Azure CLI](/cli/azure/install-azure-cli)

    * Sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.

    * Run [az version](/cli/azure/reference-index#az-version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az-upgrade).
 
    * When prompted, install Azure CLI extensions on first use. The commands in this article use the **azure-iot** extension. Run `az extension update --name azure-iot` to make sure you're using the latest version of the extension.

---

## Create a Device Update account and instance

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), select **Create a Resource** and search for "Device Update for IoT Hub"

   :::image type="content" source="media/create-device-update-account/device-update-marketplace.png" alt-text="Screenshot of Device Update for IoT Hub resource." lightbox="media/create-device-update-account/device-update-marketplace.png":::

2. Select **Create** > **Device Update for IoT Hub**

3. On the **Basics** tab, provide the following information for your Device Update account:

   * **Subscription**: The Azure subscription to be associated with your Device Update account.
   * **Resource group**: An existing or new resource group.
   * **Name**: A name for your account.
   * **Location**: The Azure region where your account will be located. For information about which regions support Device Update for IoT Hub, see [Azure Products-by-region page](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub).

   > [!NOTE]
   > Your Device Update account doesn't need to be in the same region as your IoT hubs, but for better performance it is recommended that you keep them geographically close.

   :::image type="content" source="media/create-device-update-account/account-details.png" alt-text="Screenshot of account details." lightbox="media/create-device-update-account/account-details.png":::

4. Optionally, you can check the box to assign the Device Update administrator role to yourself. You can also use the steps listed in the [Configure access control roles](#configure-access-control-roles-for-device-update) section to provide a combination of roles to users and applications for the right level of access.

   You need to have Owner or User Access Administrator permissions in your subscription to manage roles.

5. Select **Next: Instance**

    An *instance* of Device Update is associated with a single IoT hub. Select the IoT hub that will be used with Device Update. When you link an IoT hub to a Device Update instance, a new shared access policy is automatically created give Device Update permissions to work with IoT Hub (registry write and service connect). This policy ensures that access is only limited to Device Update.

6. On the **Instance** tab, provide the following information for your Device Update instance:

   * **Name**: A name for your instance.
   * **IoT Hub details**: Select an IoT hub to link to this instance.

   :::image type="content" source="media/create-device-update-account/instance-details.png" alt-text="Screenshot of instance details." lightbox="media/create-device-update-account/instance-details.png":::

7. Select **Next: Review + Create**. After validation, select **Create**.

   :::image type="content" source="media/create-device-update-account/account-review.png" alt-text="Screenshot of account review." lightbox="media/create-device-update-account/account-review.png":::

8. You'll see that your deployment is in progress. The deployment status will change to "complete" in a few minutes. When it does, select **Go to resource**

   :::image type="content" source="media/create-device-update-account/account-complete.png" alt-text="Screenshot of account deployment complete." lightbox="media/create-device-update-account/account-complete.png":::

# [Azure CLI](#tab/cli)

Use the [az iot device-update account create](/cli/azure/iot/device-update/account#az-iot-device-update-account-create) command to create a new Device Update account.

Replace the following placeholders with your own information:

* *\<resource_group>*: An existing resource group in your subscription.
* *\<account_name>*: A name for your Device Update account.
* *\<region>*: The Azure region where your account will be located. For information about which regions support Device Update for IoT Hub, see [Azure Products-by-region page](https://azure.microsoft.com/global-infrastructure/services/?products=iot-hub). If no region is provided, the resource group's location is used.

   > [!NOTE]
   > Your Device Update account doesn't need to be in the same region as your IoT hubs, but for better performance it is recommended that you keep them geographically close.

```azurecli-interactive
az iot device-update account create --resource-group <resource_group> --account <account_name> --location <region>
```

Use the [az iot device-update instance create](/cli/azure/iot/device-update/instance#az-iot-device-update-instance-create) command to create a Device Update instance.

An *instance* of Device Update is associated with a single IoT hub. Select the IoT hub that will be used with Device Update. When you link an IoT hub to a Device Update instance, a new shared access policy is automatically created give Device Update permissions to work with IoT Hub (registry write and service connect). This policy ensures that access is only limited to Device Update.

Replace the following placeholders with your own information:

* *\<account_name>*: The name of the Device Update account that this instance will be associated with.
* *\<instance_name>*: A name for this instance.
* *\<iothub_id>*: The resource ID for the IoT hub that will be linked to this instance. You can retrieve your IoT hub resource ID by using the [az iot hub show](/cli/azure/iot/hub#az-iot-hub-show) command and querying for the ID value: `az iot hub show -n <iothub_name> --query id`.

```azurecli-interactive
az iot device-update instance create --account <account_name> --instance <instance_name> --iothub-ids <iothub_id>
```

>[!TIP]
>As part of the instance creation process, you can also configure diagnostics logging. For more information, see [Remotely collect diagnostic logs from devices](device-update-log-collection.md).

---

## Configure access control roles for Device Update

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

# [Azure CLI](#tab/cli)

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
az role assignment create --role '<role>' --assignee <user_group> --scope <account_id>
```

---

## Configure access control roles for IoT Hub

Device Update for IoT Hub communicates with IoT Hub to manage deployments and updates and to get information about devices. To enable the access, you need to give the **Azure Device Update** service principal access with the **IoT Hub Data Contributor** role.

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to the IoT hub connected to your Device Update instance.
1. Select **Access Control(IAM)** from the navigation menu.
1. Select **Add** > **Add role assignment**.
1. In the **Role** tab, select **IoT Hub Data Contributor**. Select **Next**.
1. For **Assign access to**, select **User, group, or service principal**.
1. Select **Select Members** and search for '**Azure Device Update**'
1. Select **Next** > **Review + Assign**

To validate that you've set permissions correctly:

1. In the Azure portal, navigate to the IoT hub connected to your Device Update instance.
1. Select **Access Control(IAM)** from the navigation menu.
1. Select **Check access**.
1. Select **User, group, or service principal** and search for '**Azure Device Update**'
1. After clicking on **Azure Device Update**, verify that the **IoT Hub Data Contributor** role is listed under **Role assignments**

# [Azure CLI](#tab/cli)

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to create a role assignment for the Azure Device Update service principal.

Replace *\<resource_id>* with the resource ID of your IoT hub. You can retrieve the resource ID by using the [az iot hub show](/cli/azure/iot/hub#az-iot-hub-show) command and querying for the ID value: `az iot hub show -n <hub_name> --query id`.

```azurecli
az role assignment create --role "IoT Hub Data Contributor" --assignee https://api.adu.microsoft.com/ --scope <resource_id>
```

---

## View and query accounts or instances

You can view, sort, and query all of your Device Update accounts and instances.

# [Azure portal](#tab/portal)

1. To view all Device Update accounts, use the Azure portal to search for the **Device Update for IoT Hubs** service.

   * Use the **Grouping** dropdown menu to group account by subscription, resource group, location, and other conditions.
   * Select **Add filter** to filter the list of accounts by resource group, location, tags, and other conditions.

1. To view all instances in an account, navigate to that account in the Azure portal. Select **Instances** from the **Instance management** section of the menu

   * Use the search box to filter instances.

# [Azure CLI](#tab/cli)

To view all Device Update accounts, use the [az iot device-update account list](/cli/azure/iot/device-update/account#az-iot-device-update-account-list) command.

```azurecli-interactive
az iot device-update account list 
```

To view all instances in an account, use the [az iot device-update instance list](/cli/azure/iot/device-update/instance#az-iot-device-update-instance-list) command.

```azurecli-interactive
az iot device-update instance list --account <account_name>
```

Both `list` commands support additional grouping and filter operations. Use the `--query` argument to find accounts or instances based on conditions like tags. For example, `--query "[?tags.env == 'test']"`. Use the `--output` argument to format the results. For example, `--output table`.

---

## Next steps

Try updating a device using one of the following quick tutorials:

* [Update a simulated IoT Edge device](device-update-simulator.md)
* [Update a Raspberry Pi](device-update-raspberry-pi.md)
* [Update an Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)

[Learn about Device update account and instance.](device-update-resources.md)

[Learn about Device update access control roles](device-update-control-access.md)
