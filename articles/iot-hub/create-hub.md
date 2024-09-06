---
title: Create an Azure IoT hub
titleSuffix: Azure IoT Hub
description: How to create, manage, and delete Azure IoT hubs through the Azure portal, CLI, and PowerShell. Includes information about retrieving the service connection string.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 07/10/2024
ms.custom: ['Role: Cloud Development']
---

# Create and manage Azure IoT hubs

This article describes how to create and manage an IoT hub.

## Prerequisites

Prepare the following prerequisites, depending on which tool you use.

### [Azure portal](#tab/portal)

* Access to the [Azure portal](https://portal.azure.com).

### [Azure CLI](#tab/cli)

* The Azure CLI installed on your development machine. If you don't have the Azure CLI, follow the steps to [Install the Azure CLI](/cli/azure/install-azure-cli).

* A resource group in your Azure subscription. If you want to create a new resource group, use the [az group create](/cli/azure/group#az-group-create) command:

  ```azurecli-interactive
  az group create --name <RESOURCE_GROUP_NAME> --location <REGION>
  ```

### [Azure PowerShell](#tab/powershell)

* Azure PowerShell installed on your development machine. If you don't have Azure PowerShell, follow the steps to [Install Azure PowerShell](/powershell/azure/install-azure-powershell).

* A resource group in your Azure subscription. If you want to create a new resource group, use the [New-AzResourceGroup](/powershell/module/az.Resources/New-azResourceGroup) command:

   ```azurepowershell-interactive
   New-AzResourceGroup -Name <RESOURCE_GROUP_NAME> -Location "<REGION>"
   ```

---

## Create an IoT hub

### [Azure portal](#tab/portal)

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

### [Azure CLI](#tab/cli)

Use the [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command to create an IoT hub in your resource group, using a globally unique name for your IoT hub. For example:

```azurecli-interactive
az iot hub create --name <NEW_NAME_FOR_YOUR_IOT_HUB> --resource-group <RESOURCE_GROUP_NAME> --sku S1
```

[!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]

The previous command creates an IoT hub in the S1 pricing tier. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

### [Azure PowerShell](#tab/powershell)

Use the [New-AzIotHub](/powershell/module/az.IotHub/New-azIotHub) command to create an IoT hub in your resource group. The name of the IoT hub must be globally unique. For example:

```azurepowershell-interactive
New-AzIotHub `
    -ResourceGroupName <RESOURCE_GROUP_NAME> `
    -Name <NEW_NAME_FOR_YOUR_IOT_HUB> `
    -SkuName S1 -Units 1 `
    -Location "<REGION>"
```

[!INCLUDE [iot-hub-pii-note-naming-hub](../../includes/iot-hub-pii-note-naming-hub.md)]

The previous command creates an IoT hub in the S1 pricing tier. For more information, see [Azure IoT Hub pricing](https://azure.microsoft.com/pricing/details/iot-hub/).

---

## Connect to an IoT hub

Provide access permissions to applications and services that use IoT Hub functionality.

### Connect with a connection string

Connection strings are tokens that grant devices and services permissions to connect to IoT Hub based on shared access policies. Connection strings are an easy way to get started with IoT Hub, and are used in many samples and tutorials, but aren't recommended for production scenarios.

For most sample scenarios, the **service** policy is sufficient. The service policy grants **Service Connect** permissions to access service endpoints. For more information about the other built-in shared access policies, see [IoT Hub permissions](./iot-hub-dev-guide-sas.md#access-control-and-permissions).

To get the IoT Hub connection string for the **service** policy, follow these steps:

#### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), select **Resource groups**. Select the resource group where your hub is located, and then select your hub from the list of resources.

1. On the left-side pane of your IoT hub, select **Shared access policies**.

1. From the list of policies, select the **service** policy.

1. Copy the **Primary connection string** and save the value.

#### [Azure CLI](#tab/cli)

Use the [az iot hub connection-string show](/cli/azure/iot/hub/connection-string#az-iot-hub-connection-string-show) command to get a connection string for your IoT hub that grants the service policy permissions:

```azurecli-interactive
az iot hub connection-string show --hub-name <YOUR_IOT_HUB_NAME> --policy-name service
```

The service connection string should look similar to the following example:

```text
"HostName=<IOT_HUB_NAME>.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=<SHARED_ACCESS_KEY>"
```

#### [Azure PowerShell](#tab/powershell)

Use the [Get-AzIotHubConnectionString](/powershell/module/az.iothub/get-aziothubconnectionstring) command to get a connection string for your IoT hub that grants the service policy permissions.

```azurepowershell-interactive
Get-AzIotHubConnectionString -ResourceGroupName "<YOUR_RESOURCE_GROUP>" -Name "<YOUR_IOT_HUB_NAME>" -KeyName "service"
```

The service connection string should look similar to the following example:

```text
"HostName=<IOT_HUB_NAME>.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=<SHARED_ACCESS_KEY>"
```

---

### Connect with role assignments

Authenticating access by using Microsoft Entra ID and controlling permissions by using Azure role-based access control (RBAC) provides improved security and ease of use over security tokens. To minimize potential security issues inherent in security tokens, we recommend that you enforce Microsoft Entra authentication whenever possible. For more information, see [Control access to IoT Hub by using Microsoft Entra ID](./authenticate-authorize-azure-ad.md).

## Delete an IoT hub

When you delete an IoT hub, you lose the associated device identity registry. If you want to move or upgrade an IoT hub, or delete an IoT hub but keep the devices, consider [migrating an IoT hub using the Azure CLI](./migrate-hub-state-cli.md).

### [Azure portal](#tab/portal)

To delete an IoT hub, open your IoT hub in the Azure portal, then choose **Delete**.

:::image type="content" source="./media/create-hub/delete-iot-hub.png" alt-text="Screenshot showing where to find the delete button for an IoT hub in the Azure portal." lightbox="./media/create-hub/delete-iot-hub.png":::

### [Azure CLI](#tab/cli)

To delete an IoT hub, run the [az iot hub delete](/cli/azure/iot/hub#az-iot-hub-delete) command:

```azurecli-interactive
az iot hub delete --name <IOT_HUB_NAME> --resource-group <RESOURCE_GROUP_NAME>
```

### [Azure PowerShell](#tab/powershell)

To delete the IoT hub, use the [Remove-AzIotHub](/powershell/module/az.iothub/remove-aziothub) command.

```azurepowershell-interactive
Remove-AzIotHub `
    -ResourceGroupName MyIoTRG1 `
    -Name MyTestIoTHub
```

---

## Other tools for managing IoT hubs

In addition to the Azure portal and CLI, the following tools are available to help you work with IoT hubs in whichever way supports your scenario:

* **IoT Hub resource provider REST API**

  Use the [IoT Hub Resource](/rest/api/iothub/iot-hub-resource) set of operations.

* **Azure resource manager templates, Bicep, or Terraform**

  Use the [Microsoft.Devices/IoTHubs](/azure/templates/microsoft.devices/iothubs) resource type. For examples, see [IoT Hub sample templates](/samples/browse/?terms=iot%20hub&languages=bicep%2Cjson).

* **Visual Studio Code**

  Use the [Azure IoT Hub extension for Visual Studio Code](./reference-iot-hub-extension.md).
