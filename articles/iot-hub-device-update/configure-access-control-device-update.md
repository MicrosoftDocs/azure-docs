---
title: Configure Access Control in Device Update for IoT Hub
description: Configure Access Control in Device Update for IoT Hub.
author: eshashah-msft
ms.author: eshashah
ms.date: 10/31/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Configure access control roles for Device Update resources

In order for users to have access to Device Update, they must be granted access to the Device Update account, Instance and set the required access to the linked IoT hub. 

## Configure access control for Device Update account

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
* *\<account_id>*: The resource ID for the Device Update account that the user or group will get access to. You can retrieve the resource ID by using the [az iot du account show](/cli/azure/iot/du/account#az-iot-du-account-show) command and querying for the ID value: `az iot du account show -n <account_name> --query id`.

```azurecli-interactive
az role assignment create --role '<role>' --assignee <user_group> --scope <account_id>
```
---

## Configure access for Azure Device Update service principal in linked IoT hub

Device Update for IoT Hub communicates with IoT Hub to manage deployments and updates and to get information about devices. To enable the access, you need to give the **Azure Device Update** service principal access with the **IoT Hub Data Contributor** role.

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to the IoT hub connected to your Device Update instance.

   :::image type="content" source="media/create-device-update-account/navigate-to-iot-hub.png" alt-text="Screenshot of instance and linked IoT hub." lightbox="media/create-device-update-account/navigate-to-iot-hub.png":::

1. Select **Access Control(IAM)** from the navigation menu. Select **Add** > **Add role assignment**.

   :::image type="content" source="media/create-device-update-account/iot-hub-access-control.png" alt-text="Screenshot of access Control within IoT Hub." lightbox="media/create-device-update-account/iot-hub-access-control.png":::

3. In the **Role** tab, select **IoT Hub Data Contributor**. Select **Next**.

   :::image type="content" source="media/create-device-update-account/role-assignment-iot-hub.png" alt-text="Screenshot of access Control role assignment within IoT Hub." lightbox="media/create-device-update-account/role-assignment-iot-hub.png":::**

4. For **Assign access to**, select **User, group, or service principal**. Select **Select Members** and search for '**Azure Device Update**'

   :::image type="content" source="media/create-device-update-account/assign-role-to-du-service-principal.png" alt-text="Screenshot of access Control member selection for IoT Hub." lightbox="media/create-device-update-account/assign-role-to-du-service-principal.png":::

6. Select **Next** > **Review + Assign**

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

## Next steps

Try updating a device using one of the following quick tutorials:

* [Update a simulated IoT Edge device](device-update-simulator.md)
* [Update a Raspberry Pi](device-update-raspberry-pi.md)
* [Update an Ubuntu Server 18.04 x64 Package agent](device-update-ubuntu-agent.md)
