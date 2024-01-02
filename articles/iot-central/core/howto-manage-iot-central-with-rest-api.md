---
title: Use the REST API to manage IoT Central applications
description: This article describes how to create and manage your IoT Central applications with the REST API and add a system assigned managed identity to your application.
services: iot-central
ms.service: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 06/13/2023
ms.topic: how-to
---

# Use the REST API to create and manage IoT Central applications

You can use the [control plane REST API](/rest/api/iotcentral/2021-06-01controlplane/apps) to create and manage IoT Central applications. You can also use the REST API to add a managed identity to your application.

To use this API, you need a bearer token for the `management.azure.com` resource. To get a bearer token, you can use the Azure CLI:

```azurecli
az account get-access-token --resource https://management.azure.com
```

To learn how to manage IoT Central application by using the IoT Central UI, see [Create an IoT Central application.](../core/howto-create-iot-central-application.md)

## List your applications

To get a list of the IoT Central applications in a subscription:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.IoTCentral/iotApps?api-version=2021-06-01
```

To get a list of the IoT Central applications in a resource group:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.IoTCentral/iotApps?api-version=2021-06-01
```

You can retrieve the details of an individual application:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.IoTCentral/iotApps/{applicationName}?api-version=2021-06-01
```

## Create an IoT Central application

To create an IoT Central application with a system assigned [managed identity](../../active-directory/managed-identities-azure-resources/overview.md):

```http
PUT https://management.azure.com/subscriptions/<your subscription id>/resourceGroups/<your resource group name>/providers/Microsoft.IoTCentral/iotApps/<your application name>?api-version=2021-06-01
```

The following payload shows the configuration for the new application, including the managed identity:

```json
{
  "location": "eastus",
  "sku": {
    "name": "ST2"
  },
  "properties": {
    "displayName": "Contoso IoT Central App",
    "subdomain": "my-iot-central-app",
    "template": "iotc-pnp-preview@1.0.0"
  },
  "identity": {
    "type": "SystemAssigned"
  }
}
```

## Modify an IoT Central application

You can modify an existing IoT Central application. The following example shows how to change the display name and enable the system assigned managed identity:

```http
PATCH https://management.azure.com/subscriptions/<your subscription id>/resourceGroups/<your resource group name>/providers/Microsoft.IoTCentral/iotApps/<your application name>?api-version=2021-06-01
```

Use the following payload to change the display name and enable the system assigned managed identity:

```json
{
  "properties": {
    "displayName": "Contoso IoT Central App"
  },
  "identity": {
    "type": "SystemAssigned"
  }
}
```

> [!NOTE]
> You can only add a managed identity to an IoT Central application that was created in a region. All new applications are created in a region.

## Delete an IoT Central application

To delete an IoT Central application, use:

```http
DELETE https://management.azure.com/subscriptions/<your subscription id>/resourceGroups/<your resource group name>/providers/Microsoft.IoTCentral/iotApps/<your application name>?api-version=2021-06-01
```

## Next steps

Now that you've learned how to create and manage Azure IoT Central applications using the REST API, here's the suggested next step:

> [!div class="nextstepaction"]
> [How to use the IoT Central REST API to manage users and roles](howto-manage-users-roles-with-rest-api.md)
