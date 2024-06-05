---
title: Manage and monitor IoT Central
description: This article describes how to create, manage, and monitor your IoT Central applications and enable managed identities.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 04/02/2024
ms.topic: how-to

#customer intent: As an administrator, I want to learn how to manage and monitor IoT Central applications using Azure portal, Azure CLI, and Azure PowerShell so that I can maintain my set of IoT Central applications.

---

# Manage and monitor IoT Central applications

You can use the [Azure portal](https://portal.azure.com), [Azure CLI](/cli/azure/), or [Azure PowerShell](/powershell/azure/) to manage and monitor IoT Central applications.

If you prefer to use a language such as JavaScript, Python, C#, Ruby, or Go to create, update, list, and delete Azure IoT Central applications, see the [Azure IoT Central ARM SDK samples](/samples/azure-samples/azure-iot-central-arm-sdk-samples/azure-iot-central-arm-sdk-samples/) repository.

To learn how to create an IoT Central application, see [Create an IoT Central application](howto-create-iot-central-application.md).

## View applications

# [Azure portal](#tab/azure-portal)

To list all the IoT Central apps in your subscription, navigate to [IoT Central applications](https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.IoTCentral%2FIoTApps).

# [Azure CLI](#tab/azure-cli)

Use the [az iot central app list](/cli/azure/iot/central/app#az-iot-central-app-list) command to list your IoT Central applications and view metadata.

# [PowerShell](#tab/azure-powershell)

Use the [Get-AzIotCentralApp](/powershell/module/az.iotcentral/Get-AzIotCentralApp) cmdlet to list your IoT Central applications and view metadata.

---

## Delete an application

# [Azure portal](#tab/azure-portal)

To delete an IoT Central application in the Azure portal, navigate to the **Overview** page of the application in the portal and select **Delete**.

# [Azure CLI](#tab/azure-cli)

Use the [az iot central app delete](/cli/azure/iot/central/app#az-iot-central-app-delete) command to delete an IoT Central application.

# [PowerShell](#tab/azure-powershell)

Use the [Remove-AzIotCentralApp](/powershell/module/az.iotcentral/remove-aziotcentralapp) cmdlet to delete an IoT Central application.

---

## Manage networking

You can use private IP addresses from a virtual network address space when you manage your devices in IoT Central application to eliminate exposure on the public internet. To learn more, see [Create and configure a private endpoint for IoT Central](../core/howto-create-private-endpoint.md).

## Configure a managed identity

When you configure a data export in your IoT Central application, you can choose to configure the connection to the destination with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities are more secure because:

* You don't store the credentials for your resource in a connection string in your IoT Central application.
* The credentials are automatically tied to the lifetime of your IoT Central application.
* Managed identities automatically rotate their security keys regularly.

IoT Central currently uses [system-assigned managed identities](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). To create the managed identity for your application, you use either the Azure portal or the REST API.

When you configure a managed identity, the configuration includes a *scope* and a *role*:

* The scope defines where you can use the managed identity. For example, you can use an Azure resource group as the scope. In this case, both the IoT Central application and the destination must be in the same resource group.
* The role defines what permissions the IoT Central application is granted in the destination service. For example, for an IoT Central application to send data to an event hub, the managed identity needs the **Azure Event Hubs Data Sender** role assignment.

# [Azure portal](#tab/azure-portal)

[!INCLUDE [iot-central-managed-identity](../../../includes/iot-central-managed-identity.md)]

# [Azure CLI](#tab/azure-cli)

You can enable the managed identity when you create an IoT Central application:

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

# [PowerShell](#tab/azure-powershell)

You can enable the managed identity when you create an IoT Central application:

```powershell
# Create an IoT Central application with a managed identity
New-AzIotCentralApp -ResourceGroupName "MyIoTCentralResourceGroup" `
  -Name "myiotcentralapp" -Subdomain "mysubdomain" `
  -Sku "ST1" -Template "iotc-pnp-preview" `
  -DisplayName "My Custom Display Name" -Identity "SystemAssigned"
```

Alternatively, you can enable a managed identity on an existing IoT Central application:

```powershell
# Enable a system-assigned managed identity
Set-AzIotCentralApp -ResourceGroupName "MyIoTCentralResourceGroup" `
  -Name "myiotcentralapp" -Identity "SystemAssigned"
```

After you enable the managed identity, you can use PowerShell to configure the role assignments.

Use the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) cmdlet to create a role assignment. For example, the following commands first retrieve the principal ID of the managed identity. The second command assigns the `Azure Event Hubs Data Sender` role to the principal ID in the scope of the `MyIoTCentralResourceGroup` resource group:

```powershell
$resourceGroup = Get-AzResourceGroup -Name "MyIoTCentralResourceGroup"
$app = Get-AzIotCentralApp -ResourceGroupName $resourceGroup.ResourceGroupName -Name "myiotcentralapp"
$sp = Get-AzADServicePrincipal -ObjectId $app.Identity.PrincipalId
New-AzRoleAssignment -RoleDefinitionName "Azure Event Hubs Data Sender" `
  -ObjectId $sp.Id -Scope $resourceGroup.ResourceId
```

---

To learn more about the role assignments, see:

* [Built-in roles for Azure Event Hubs](../../event-hubs/authenticate-application.md#built-in-roles-for-azure-event-hubs)
* [Built-in roles for Azure Service Bus](../../service-bus-messaging/authenticate-application.md#azure-built-in-roles-for-azure-service-bus)
* [Built-in roles for Azure Storage Services](../../role-based-access-control/built-in-roles.md#storage)

## Monitor application health

You can use the set of metrics provided by IoT Central to assess the health of devices connected to your IoT Central application and the health of your running data exports.

> [!NOTE]
> IoT Central applications also have an internal [audit log](howto-use-audit-logs.md) to track activity within the application.

Metrics are enabled by default for your IoT Central application and you access them from the [Azure portal](https://portal.azure.com/). The [Azure Monitor data platform exposes these metrics](../../azure-monitor/essentials/data-platform-metrics.md) and provides several ways for you to interact with them. For example, you can use charts in the Azure portal, a REST API, or queries in PowerShell or the Azure CLI.

[Azure role based access control](../../role-based-access-control/overview.md) manages access to metrics in the Azure portal. Use the Azure portal to add users to the IoT Central application/resource group/subscription to grant them access. You must add a user in the portal even they're already added to the IoT Central application. Use [Azure built-in roles](../../role-based-access-control/built-in-roles.md) for finer grained access control.

### View metrics in the Azure portal

The following example **Metrics** page shows a plot of the number of devices connected to your IoT Central application. For a list of the metrics that are currently available for IoT Central, see [Supported metrics with Azure Monitor](../../azure-monitor/essentials/metrics-supported.md#microsoftiotcentraliotapps).

To view IoT Central metrics in the portal:

1. Navigate to your IoT Central application resource in the portal. By default, IoT Central resources are located in a resource group called **IOTC**.
1. To create a chart from your application's metrics, select **Metrics** in the **Monitoring** section.

:::image type="content" source="media/howto-manage-and-monitor-iot-central/metrics.png" alt-text="Screenshot that shows example metrics in the Azure portal." lightbox="media/howto-manage-and-monitor-iot-central/metrics.png":::

### Export logs and metrics

Use the **Diagnostics settings** page to configure exporting metrics and logs to different destinations. To learn more, see [Diagnostic settings in Azure Monitor](../../azure-monitor/essentials/diagnostic-settings.md).

### Analyze logs and metrics

Use the **Workbooks** page to analyze logs and create visual reports. To learn more, see [Azure Workbooks](../../azure-monitor/visualize/workbooks-overview.md).

### Metrics and invoices

Metrics might differ from the numbers shown on your Azure IoT Central invoice. This situation occurs for reasons such as:

* IoT Central [standard pricing plans](https://azure.microsoft.com/pricing/details/iot-central/) include two devices and varying message quotas for free. While the free items are excluded from billing, they're still counted in the metrics.

* IoT Central autogenerates one test device ID for each device template in the application. This device ID is visible on the **Manage test device** page for a device template. You can validate your device templates before publishing them by generating code that uses these test device IDs. While these devices are excluded from billing, they're still counted in the metrics.

* While metrics might show a subset of device-to-cloud communication, all communication between the device and the cloud [counts as a message for billing](https://azure.microsoft.com/pricing/details/iot-central/).

## Monitor connected IoT Edge devices

If your application uses IoT Edge devices, you can monitor the health of your IoT Edge devices and modules using Azure Monitor. To learn more, see [Collect and transport Azure IoT Edge metrics](../../iot-edge/how-to-collect-and-transport-metrics.md).
