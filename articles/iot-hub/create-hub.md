---
title: Create an IoT hub
titleSuffix: Azure IoT Hub
description: How to create, manage, and delete Azure IoT hubs through the Azure portal and CLI. Includes information about pricing tiers, scaling, security, and messaging configuration.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 06/10/2024
ms.custom: ['Role: Cloud Development']
---

# Create an IoT hub using the Azure portal

This article describes how to create and manage an IoT hub.

## Prerequisites

* Depending on which tool you use, either have access to the [Azure portal](https://portal.azure.com) or [install the Azure CLI](/cli/azure/install-azure-cli).

## Create an IoT hub

### [Azure portal](#tab/portal)

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

### [Azure CLI](#tab/cli)

Use the Azure CLI to create a resource group and then add an IoT hub.

Use the [iz iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command to create an IoT hub in your resource group, using a globally unique name for your IoT hub. For example:

```azurecli-interactive
az iot hub create --name <NEW_NAME_FOR_YOUR_IOT_HUB> \
   --resource-group <RESOURCE_GROUP_NAME> --sku S1
```

[!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]

The previous command creates an IoT hub in the S1 pricing tier for which you're billed. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

---

## Update an IoT hub

You can change the settings of an existing IoT hub after it's created. Here are some properties you can set for an IoT hub:

* **Pricing and scale**: Migrate to a different tier or set the number of IoT Hub units.

* **IP Filter**: Specify a range of IP addresses for the IoT hub to accept or reject.

* **Properties**: A list of properties that you can copy and use elsewhere, such as the resource ID, resource group, location, and so on.

### [Azure portal](#tab/portal)

### [Azure CLI](#tab/cli)

Use the [az iot hub update](/cli/azure/iot/hub#az-iot-hub-update) command to make changes to an existing IoT hub.

---

## Connect to an IoT hub

Provide access permissions to applications and services that use IoT Hub functionality.

### Connect with a connection string

Connection strings are an easy way to get started with IoT Hub, and are used in many samples and tutorials, but aren't recommended for production scenarios.

Shared access policies define permissions for devices and services to connect to IoT Hub. The built-in policies provide one or more of the following permissions. You should always provide the least necessary permissions for a given scenario.

* The **Registry Read** and **Registry Write** permissions grant read and write access rights to the identity registry. These permissions are used by back-end cloud services to manage device identities. 

* The **Service Connect** permission grants permission to access service endpoints. This permission is used by back-end cloud services to send and receive messages from devices. It's also used to update and read device twin and module twin data.

* The **Device Connect** permission grants permissions for sending and receiving messages using the IoT Hub device-side endpoints. This permission is used by devices to send and receive messages from an IoT hub or update and read device twin and module twin data. It's also used for file uploads.

For information about the access granted by specific permissions, see [IoT Hub permissions](./iot-hub-dev-guide-sas.md#access-control-and-permissions).


#### [Azure portal](#tab/portal)

To get the IoT Hub connection string for the **service** policy, follow these steps:

1. In the [Azure portal](https://portal.azure.com), select **Resource groups**. Select the resource group where your hub is located, and then select your hub from the list of resources.

1. On the left-side pane of your IoT hub, select **Shared access policies**.

1. From the list of policies, select the **service** policy.

1. Copy the **Primary connection string** and save the value.


#### [Azure CLI](#tab/cli)

IoT hubs are created with several default access policies. One such policy is the **service** policy, which provides sufficient permissions for a service to read and write the IoT hub's endpoints. Run the following command to get a connection string for your IoT hub that adheres to the service policy:

```azurecli-interactive
az iot hub connection-string show --hub-name YOUR_IOT_HUB_NAME --policy-name service
```

The service connection string should look similar to the following example:

```javascript
"HostName=<IOT_HUB_NAME>.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=<SHARED_ACCESS_KEY>"
```

---

### Connect with role assignments

In production scenarios, we recommend using Microsoft Entra ID and Azure role-based access control (Azure RBAC) for connecting to IoT Hub. For more information, see [Control access to IoT Hub by using Microsoft Entra ID](./authenticate-authorize-azure-ad.md).

## Delete an IoT hub

### [Azure portal](#tab/portal)

To delete an IoT hub, open your IoT hub in the Azure portal, then choose **Delete**.

:::image type="content" source="./media/iot-hub-create-through-portal/delete-iot-hub.png" alt-text="Screenshot showing where to find the delete button for an IoT hub in the Azure portal." lightbox="./media/iot-hub-create-through-portal/delete-iot-hub.png":::

### [Azure CLI](#tab/cli)

To [delete an IoT hub](/cli/azure/iot/hub#az-iot-hub-delete), run the following command:

```azurecli-interactive
az iot hub delete --name {your iot hub name} -\
  -resource-group {your resource group name}
```

---

## Other tools for managing IoT hubs

* **PowerShell cmdlets**: Use the [Az.IoTHub](/powershell/module/az.iothub) set of commands to create and manage IoT hubs.
* **IoT Hub resource provider REST API**: Use the [IoT Hub Resource](/rest/api/iothub/iot-hub-resource) set of operations to create and manage IoT hubs.
* **Azure resource manager templates, Bicep, or Terraform**: Use the [Microsoft.Devices/IoTHubs](/azure/templates/microsoft.devices/iothubs) resource type to create and manage IoT hubs. For examples, see [IoT Hub sample templates](/samples/browse/?terms=iot%20hub&languages=bicep%2Cjson)
* **Visual Studio Code**: Use the [Azure IoT Hub extension for Visual Studio Code](./reference-iot-hub-extension.md) to create and manage IoT hubs.