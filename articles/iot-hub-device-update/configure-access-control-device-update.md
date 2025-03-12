---
title: Configure access control for Azure Device Update for IoT Hub
description: Learn how to configure access control for the Azure Device Update for IoT Hub account and service principal.
author: eshashah-msft
ms.author: eshashah
ms.date: 12/30/2024
ms.topic: how-to
ms.service: azure-iot-hub
ms.subservice: device-update
---

# Configure access control for Device Update resources

For users to access Azure Device Update for IoT Hub, you must grant them access to the Device Update account and instance. You must also grant the Device Update service principal access to the linked IoT hub so it can manage updates and gather information. This article describes how to grant the necessary access by using Azure role-based access control (RBAC) in the Azure portal or Azure CLI.

## Prerequisites

- **Owner** or **User Access Administrator** role in your Azure subscription.
- A [Device Update account and instance configured with an IoT hub](create-device-update-account.md).
- To run Azure CLI commands, the Bash environment in [Azure Cloud Shell](/azure/cloud-shell/quickstart) or [Azure CLI installed locally](/cli/azure/install-azure-cli).

## Configure access control for Device Update account

The following roles are available for assigning access to Device Update:

- Device Update Administrator
- Device Update Reader
- Device Update Content Administrator
- Device Update Content Reader
- Device Update Deployments Administrator
- Device Update Deployments Reader

For more information, see [Azure role-based access control (RBAC) and Device Update](device-update-control-access.md).

# [Azure portal](#tab/portal)

1. In your Device Update account in the Azure portal, select **Access control (IAM)** from the navigation menu, and then select **Add role assignment**.

   :::image type="content" source="media/create-device-update-account/account-access-control.png" alt-text="Screenshot of access Control within Device Update account." lightbox="media/create-device-update-account/account-access-control.png":::

1. On the **Role** tab, select a Device Update role from the available options, and then select **Next**.

   :::image type="content" source="media/create-device-update-account/role-assignment.png" alt-text="Screenshot of access Control role assignments within Device Update account." lightbox="media/create-device-update-account/role-assignment.png":::

1. On the **Members** tab, select **Select members**, and add the users or groups that you want to assign the role to.

   :::image type="content" source="media/create-device-update-account/role-assignment-2.png" alt-text="Screenshot of access Control member selection within Device Update account." lightbox="media/create-device-update-account/role-assignment-2.png":::

1. Select **Review + assign**.
1. Review the new role assignments and select **Review + assign** again.
1. Azure RBAC adds the role assignments, and the selected members can now use Device Update from within your IoT Hub.

# [Azure CLI](#tab/cli)

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to configure access control for your Device Update account. In the command, replace the following placeholders with your own information:

- `<role>`: The Device Update role you're assigning.
- `<user_or_group`: The user or group you want to assign the role to.
- `<account_id>`: The resource ID for the Device Update account to grant access to. You can get the resource ID by using [az iot du account show](/cli/azure/iot/du/account#az-iot-du-account-show) and querying for the ID value with `az iot du account show -n <account_name> --query id`.

```azurecli-interactive
az role assignment create --role '<role>' --assignee <user_or_group> --scope <account_id>
```
---

<a name="configure-access-for-azure-device-update-service-principal-in-linked-iot-hub"></a>
## Configure IoT hub access for the Device Update service principal

Device Update communicates with IoT Hub to manage deployments and updates and to get information about devices. To enable this communication, you need to give the Azure Device Update service principal access to the IoT hub with the **IoT Hub Data Contributor** role.

# [Azure portal](#tab/portal)

1. In your Device Update instance in the Azure portal, select the IoT hub connected to the instance.

   :::image type="content" source="media/create-device-update-account/navigate-to-iot-hub.png" alt-text="Screenshot of instance and linked IoT hub." lightbox="media/create-device-update-account/navigate-to-iot-hub.png":::

1. On the IoT hub page, select **Access Control (IAM)** from the left navigation menu.

1. Select **Add** > **Add role assignment**.

   :::image type="content" source="media/create-device-update-account/iot-hub-access-control.png" alt-text="Screenshot of access control within IoT Hub." lightbox="media/create-device-update-account/iot-hub-access-control.png":::

1. On the **Role** tab, select **IoT Hub Data Contributor**, and then select **Next**.

   :::image type="content" source="media/create-device-update-account/role-assignment-iot-hub.png" alt-text="Screenshot of access control role assignment within IoT Hub." lightbox="media/create-device-update-account/role-assignment-iot-hub.png":::

1. On the **Members** tab, select **User, group, or service principal** for **Assign access to**, and then select **Select members**.

1. On the **Select members** screen, search for and select **Azure Device Update**, and then select **Select**.

   :::image type="content" source="media/create-device-update-account/assign-role-to-du-service-principal.png" alt-text="Screenshot of access Control member selection for IoT Hub." lightbox="media/create-device-update-account/assign-role-to-du-service-principal.png":::

6. Select **Review + assign** and then select **Review + assign** again.

To validate that you set permissions correctly:

1. In the Azure portal, navigate to the IoT hub connected to your Device Update instance.
1. Select **Access Control (IAM)** from the left navigation menu.
1. Select **Check access**.
1. Select **User, group, or service principal**, and search for and select **Azure Device Update**.
1. Verify that the **IoT Hub Data Contributor** role is listed under **Role assignments**.

# [Azure CLI](#tab/cli)

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to create a role assignment for the Azure Device Update service principal.

In the command, replace `<resource_id>` with the resource ID of your IoT hub. You can retrieve the resource ID by using the [az iot hub show](/cli/azure/iot/hub#az-iot-hub-show) command and querying for the ID value with `az iot hub show -n <hub_name> --query id`.

```azurecli
az role assignment create --role "IoT Hub Data Contributor" --assignee https://api.adu.microsoft.com/ --scope <resource_id>
```
---

## Related content

- [Azure role-based access control (RBAC) and Device Update](device-update-control-access.md)
- [Command reference for az role assignment](/cli/azure/role/assignment)