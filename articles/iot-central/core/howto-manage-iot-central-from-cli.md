---
title: Manage IoT Central from Azure CLI or PowerShell
description: How to create and manage your IoT Central application using the Azure CLI or PowerShell and configure a managed system identity for secure data export.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 06/14/2023
ms.topic: how-to 
ms.custom: [devx-track-azurecli, devx-track-azurepowershell]
---

# Manage IoT Central from Azure CLI or PowerShell

Instead of creating and managing IoT Central applications in the [Azure portal](https://portal.azure.com/#create/Microsoft.IoTCentral), you can use [Azure CLI](/cli/azure/) or [Azure PowerShell](/powershell/azure/) to manage your applications.

If you prefer to use a language such as JavaScript, Python, C#, Ruby, or Go to create, update, list, and delete Azure IoT Central applications, see the [Azure IoT Central ARM SDK samples](/samples/azure-samples/azure-iot-central-arm-sdk-samples/azure-iot-central-arm-sdk-samples/) repository.

## Prerequisites

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [azure-cli-prepare-your-environment-no-header](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [azure-powershell-requirements-no-header](../../../includes/azure-powershell-requirements-no-header.md)]

> [!TIP]
> If you need to run your PowerShell commands in a different Azure subscription, see [Change the active subscription](/powershell/azure/manage-subscriptions-azureps#change-the-active-subscription).

Run the following command to check the [IoT Central module](/powershell/module/az.iotcentral/) is installed in your PowerShell environment:

```powershell
Get-InstalledModule -name Az.I*
```

If the list of installed modules doesn't include **Az.IotCentral**, run the following command:

```powershell
Install-Module Az.IotCentral
```

---

[!INCLUDE [Warning About Access Required](../../../includes/iot-central-warning-contribitorrequireaccess.md)]

## Create an application

# [Azure CLI](#tab/azure-cli)

Use the [az iot central app create](/cli/azure/iot/central/app#az-iot-central-app-create) command to create an IoT Central application in your Azure subscription. For example:

```Azure CLI
# Create a resource group for the IoT Central application
az group create --location "East US" \
    --name "MyIoTCentralResourceGroup"
```

```azurecli
# Create an IoT Central application
az iot central app create \
  --resource-group "MyIoTCentralResourceGroup" \
  --name "myiotcentralapp" --subdomain "mysubdomain" \
  --sku ST1 --template "iotc-pnp-preview" \
  --display-name "My Custom Display Name"
```

These commands first create a resource group in the east US region for the application. The following table describes the parameters used with the **az iot central app create** command:

| Parameter         | Description |
| ----------------- | ----------- |
| resource-group    | The resource group that contains the application. This resource group must already exist in your subscription. |
| location          | By default, this command uses the location from the resource group. Currently, you can create an IoT Central application in the **Australia East**, **Canada Central**, **Central US**, **East US**, **East US 2**, **Japan East**, **North Europe**, **South Central US**, **Southeast Asia**, **UK South**, **West Europe**, and **West US**. |
| name              | The name of the application in the Azure portal. Avoid special characters - instead, use lower case letters (a-z), numbers (0-9), and dashes (-).|
| subdomain         | The subdomain in the URL of the application. In the example, the application URL is `https://mysubdomain.azureiotcentral.com`. |
| sku               | Currently, you can use either **ST1** or **ST2**. See [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). |
| template          | The application template to use. For more information, see the following table. |
| display-name      | The name of the application as displayed in the UI. |

# [PowerShell](#tab/azure-powershell)

Use the [New-AzIotCentralApp](/powershell/module/az.iotcentral/New-AzIotCentralApp) cmdlet to create an IoT Central application in your Azure subscription. For example:

```powershell
# Create a resource group for the IoT Central application
New-AzResourceGroup -ResourceGroupName "MyIoTCentralResourceGroup" `
  -Location "East US"
```

```powershell
# Create an IoT Central application
New-AzIotCentralApp -ResourceGroupName "MyIoTCentralResourceGroup" `
  -Name "myiotcentralapp" -Subdomain "mysubdomain" `
  -Sku "ST1" -Template "iotc-pnp-preview" `
  -DisplayName "My Custom Display Name"
```

The script first creates a resource group in the east US region for the application. The following table describes the parameters used with the **New-AzIotCentralApp** command:

|Parameter         |Description |
|------------------|------------|
|ResourceGroupName |The resource group that contains the application. This resource group must already exist in your subscription. |
|Location |By default, this cmdlet uses the location from the resource group. Currently, you can create an IoT Central application  in the **Australia East**, **Central US**, **East US**, **East US 2**, **Japan East**, **North Europe**, **Southeast Asia**, **UK South**, **West Europe** and **West US** regions. |
|Name              |The name of the application in the Azure portal. Avoid special characters - instead, use lower case letters (a-z), numbers (0-9), and dashes (-). |
|Subdomain         |The subdomain in the URL of the application. In the example, the application URL is `https://mysubdomain.azureiotcentral.com`. |
|Sku               |Currently, you can use either **ST1** or **ST2**. See [Azure IoT Central pricing](https://azure.microsoft.com/pricing/details/iot-central/). |
|Template          | The application template to use. For more information, see the following table. |
|DisplayName       |The name of the application as displayed in the UI. |

---

### Application templates

[!INCLUDE [iot-central-template-list](../../../includes/iot-central-template-list.md)]

If you've created your own application template, you can use it to create a new application. When asked for an application template, enter the app ID shown in the exported app's URL shareable link under the [Application template export](howto-create-iot-central-application.md#create-and-use-a-custom-application-template) section of your app.

## View applications

# [Azure CLI](#tab/azure-cli)

Use the [az iot central app list](/cli/azure/iot/central/app#az-iot-central-app-list) command to list your IoT Central applications and view metadata.

# [PowerShell](#tab/azure-powershell)

Use the [Get-AzIotCentralApp](/powershell/module/az.iotcentral/Get-AzIotCentralApp) cmdlet to list your IoT Central applications and view metadata.

---

## Modify an application

# [Azure CLI](#tab/azure-cli)

Use the [az iot central app update](/cli/azure/iot/central/app#az-iot-central-app-update) command to update the metadata of an IoT Central application. For example, to change the display name of your application:

```azurecli
az iot central app update --name myiotcentralapp \
  --resource-group MyIoTCentralResourceGroup \
  --set displayName="My new display name"
```

# [PowerShell](#tab/azure-powershell)

Use the [Set-AzIotCentralApp](/powershell/module/az.iotcentral/set-aziotcentralapp) cmdlet to update the metadata of an IoT Central application. For example, to change the display name of your application:

```powershell
Set-AzIotCentralApp -Name "myiotcentralapp" `
  -ResourceGroupName "MyIoTCentralResourceGroup" `
  -DisplayName "My new display name"
```

---

## Delete an application

# [Azure CLI](#tab/azure-cli)

Use the [az iot central app delete](/cli/azure/iot/central/app#az-iot-central-app-delete) command to delete an IoT Central application. For example:

```azurecli
az iot central app delete --name myiotcentralapp \
  --resource-group MyIoTCentralResourceGroup
```

# [PowerShell](#tab/azure-powershell)

Use the [Remove-AzIotCentralApp](/powershell/module/az.iotcentral/Remove-AzIotCentralApp) cmdlet to delete an IoT Central application. For example:

```powershell
Remove-AzIotCentralApp -ResourceGroupName "MyIoTCentralResourceGroup" `
 -Name "myiotcentralapp"
```

---

## Configure a managed identity

An IoT Central application can use a system assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to secure the connection to a [data export destination](howto-export-to-blob-storage.md#connection-options).

To enable the managed identity, use either the [Azure portal - Configure a managed identity](howto-manage-iot-central-from-portal.md#configure-a-managed-identity) or the CLI. You can enable the managed identity when you create an IoT Central application:

```azurecli
# Create an IoT Central application with a managed identity
az iot central app create \
  --resource-group "MyIoTCentralResourceGroup" \
  --name "myiotcentralapp" --subdomain "mysubdomain" \
  --sku ST1 --template "iotc-pnp-preview" \
  --display-name "My Custom Display Name" \
  --mi-system-assigned
```

Alternatively, you can enable a managed identity on an existing IoT Central application:

```azurecli
# Enable a system-assigned managed identity
az iot central app identity assign --name "myiotcentralapp" \
  --resource-group "MyIoTCentralResourceGroup" \
  --system-assigned
```

After you enable the managed identity, you can use the CLI to configure the role assignments.

Use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command to create a role assignment. For example, the following commands first retrieve the principal ID of the managed identity. The second command assigns the `Azure Event Hubs Data Sender` role to the principal ID in the scope of the `MyIoTCentralResourceGroup` resource group:

```azurecli
scope=$(az group show -n "MyIoTCentralResourceGroup" --query "id" --output tsv)
spID=$(az iot central app identity show \
  --name "myiotcentralapp" \
  --resource-group "MyIoTCentralResourceGroup" \
  --query "principalId" --output tsv)
az role assignment create --assignee $spID --role "Azure Event Hubs Data Sender" \
  --scope $scope
```

To learn more about the role assignments, see:

- [Built-in roles for Azure Event Hubs](../../event-hubs/authenticate-application.md#built-in-roles-for-azure-event-hubs)
- [Built-in roles for Azure Service Bus](../../service-bus-messaging/authenticate-application.md#azure-built-in-roles-for-azure-service-bus)
- [Built-in roles for Azure Storage Services](/rest/api/storageservices/authorize-with-azure-active-directory#manage-access-rights-with-rbac)

## Next steps

Now that you've learned how to manage Azure IoT Central applications from Azure CLI or PowerShell, here's the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)
