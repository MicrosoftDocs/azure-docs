---
title: Manage and monitor IoT Central in the Azure portal
description: This article describes how to create, manage, and monitor your IoT Central applications and enable managed identities from the Azure portal.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 07/14/2023
ms.topic: how-to
---

# Manage and monitor IoT Central from the Azure portal

You can use the [Azure portal](https://portal.azure.com) to create, manage, and monitor IoT Central applications.

To learn how to create an IoT Central application, see [Create an IoT Central application](howto-create-iot-central-application.md).

## Manage existing IoT Central applications

If you already have an Azure IoT Central application, you can delete it, or move it to a different subscription or resource group in the Azure portal.

To get started, search for your application in the search bar at the top of the Azure portal. You can also view all your applications by searching for _IoT Central Applications_ and selecting the service:

:::image type="content" source="media/howto-manage-iot-central-from-portal/search-iot-central.png" alt-text="Screenshot that shows the search results for I o T Central Applications with the first service selected.":::

When you select an application in the search results, the Azure portal shows you its overview. You can navigate to the application by selecting the **IoT Central Application URL**:

:::image type="content" source="media/howto-manage-iot-central-from-portal/highlight-application.png" alt-text="Screenshot that shows the Overview page with the I o T Central Application URL highlighted.":::

> [!NOTE]
> Use the **IoT Central Application URL** to access the application for the first time.

To move the application to a different resource group, select **move** beside **Resource group**. On the **Move resources** page, choose the resource group you'd like to move this application to.

To move the application to a different subscription, select **move** beside **Subscription**. On the **Move resources** page, choose the subscription you'd like to move this application to:

:::image type="content" source="media/howto-manage-iot-central-from-portal/highlight-resource-group-subscription.png" alt-text="Screenshot that shows the Overview page with the Resource group (move) highlighted.":::

## Manage networking

You can use private IP addresses from a virtual network address space to manage your devices in IoT Central application to eliminate exposure on the public internet. To learn more, see [Create and configure a private endpoint for IoT Central](../core/howto-create-private-endpoint.md)

## Configure a managed identity

When you configure a data export in your IoT Central application, you can choose to configure the connection to the destination with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md). Managed identities are more secure because:

* You don't store the credentials for your resource in a connection string in your IoT Central application.
* The credentials are automatically tied to the lifetime of your IoT Central application.
* Managed identities automatically rotate their security keys regularly.

IoT Central currently uses [system-assigned managed identities](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). To create the managed identity for your application, you use either the Azure portal or the REST API.

> [!NOTE]
> You can only add a managed identity to an IoT Central application that was created in a region. All new applications are created in a region.

When you configure a managed identity, the configuration includes a *scope* and a *role*:

* The scope defines where you can use the managed identity. For example, you can use an Azure resource group as the scope. In this case, both the IoT Central application and the destination must be in the same resource group.
* The role defines what permissions the IoT Central application is granted in the destination service. For example, for an IoT Central application to send data to an event hub, the managed identity needs the **Azure Event Hubs Data Sender** role assignment.

[!INCLUDE [iot-central-managed-identity](../../../includes/iot-central-managed-identity.md)]

You can configure role assignments in the Azure portal or use the Azure CLI:

* To learn more about to configure role assignments in the Azure portal for specific destinations, see [Export IoT data to cloud destinations using blob storage](howto-export-to-blob-storage.md).
* To learn more about how to configure role assignments using the Azure CLI, see [Manage IoT Central from Azure CLI or PowerShell](howto-manage-iot-central-from-cli.md).

## Monitor application health

You can use the set of metrics provided by IoT Central to assess the health of devices connected to your IoT Central application and the health of your running data exports.

> [!NOTE]
> IoT Central applications have an internal [audit log](howto-use-audit-logs.md) to track activity within the application. 

Metrics are enabled by default for your IoT Central application and you access them from the [Azure portal](https://portal.azure.com/). The [Azure Monitor data platform exposes these metrics](../../azure-monitor/essentials/data-platform-metrics.md) and provides several ways for you to interact with them. For example, you can use charts in the Azure portal, a REST API, or queries in PowerShell or the Azure CLI.

Access to metrics in the Azure portal is managed by [Azure role based access control](../../role-based-access-control/overview.md). Use the Azure portal to add users to the IoT Central application/resource group/subscription to grant them access. You must add a user in the portal even they're already added to the IoT Central application. Use [Azure built-in roles](../../role-based-access-control/built-in-roles.md) for finer grained access control.

### View metrics in the Azure portal

The following example **Metrics** page shows a plot of the number of devices connected to your IoT Central application. For a list of the metrics that are currently available for IoT Central, see [Supported metrics with Azure Monitor](../../azure-monitor/essentials/metrics-supported.md#microsoftiotcentraliotapps).

To view IoT Central metrics in the portal:

1. Navigate to your IoT Central application resource in the portal. By default, IoT Central resources are located in a resource group called **IOTC**.
1. To create a chart from your application's metrics, select **Metrics** in the **Monitoring** section.

:::image type="content" source="media/howto-manage-iot-central-from-portal/metrics.png" alt-text="Screenshot that shows example metrics in the Azure portal.":::

### Export logs and metrics

Use the **Diagnostics settings** page to configure exporting metrics and logs to different destinations. To learn more, see [Diagnostic settings in Azure Monitor](../../azure-monitor/essentials/diagnostic-settings.md).

### Analyze logs and metrics

Use the **Workbooks** page to analyze logs and create visual reports. To learn more, see [Azure Workbooks](../../azure-monitor/visualize/workbooks-overview.md).

### Metrics and invoices

Metrics may differ from the numbers shown on your Azure IoT Central invoice. This situation occurs for reasons such as:

* IoT Central [standard pricing plans](https://azure.microsoft.com/pricing/details/iot-central/) include two devices and varying message quotas for free. While the free items are excluded from billing, they're still counted in the metrics.

* IoT Central autogenerates one test device ID for each device template in the application. This device ID is visible on the **Manage test device** page for a device template. You may choose to validate your device templates before publishing them by generating code that uses these test device IDs. While these devices are excluded from billing, they're still counted in the metrics.

* While metrics may show a subset of device-to-cloud communication, all communication between the device and the cloud [counts as a message for billing](https://azure.microsoft.com/pricing/details/iot-central/).

## Monitor connected IoT Edge devices

To learn how to remotely monitor your IoT Edge fleet using Azure Monitor and built-in metrics integration, see [Collect and transport metrics](../../iot-edge/how-to-collect-and-transport-metrics.md).

## Next steps

Now that you've learned how to manage and monitor Azure IoT Central applications from the Azure portal, here's the suggested next step:

> [!div class="nextstepaction"]
> [Administer your application](howto-administer.md)
