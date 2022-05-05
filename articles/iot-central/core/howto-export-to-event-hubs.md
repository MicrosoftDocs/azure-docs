---
title: Export data to Event Hubs IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to Event Hubs
services: iot-central
author: v-krishnag
ms.author: v-krishnag
ms.date: 04/28/2022
ms.topic: how-to
ms.service: iot-central
---

# Export IoT data to Event Hubs

This article describes how to configure data export to send data to the Event Hubs.

[!INCLUDE [iot-central-data-export](../../../includes/iot-central-data-export.md)]

## Set up an Event Hubs export destination

IoT Central exports data in near real time. The data is in the message body and is in JSON format encoded as UTF-8.

The annotations or system properties bag of the message contains the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` fields that have the same values as the corresponding fields in the message body.

## Connection options

Event Hubs destinations let you configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

This article shows how to create a managed identity in the Azure portal. You can also use the Azure CLI to create a manged identity. To learn more, see [Assign a managed identity access to a resource using Azure CLI](../../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md).


# [Connection string](#tab/connection-string)

### Create an Event Hubs destination

If you don't have an existing Event Hubs namespace to export to, follow these steps:

1. Create a [new Event Hubs namespace in the Azure portal](https://portal.azure.com/#create/Microsoft.EventHub). You can learn more in [Azure Event Hubs docs](../../event-hubs/event-hubs-create.md).

1. Create an event hub in your Event Hubs namespace. Go to your namespace, and select **+ Event Hub** at the top to create an event hub instance.

1. Generate a key to use when you to set up your data export in IoT Central:

    - Select the event hub instance you created.
    - Select **Settings > Shared access policies**.
    - Create a new key or choose an existing key that has **Send** permissions.
    - Copy either the primary or secondary connection string. You use this connection string to set up a new destination in IoT Central.
    - Alternatively, you can generate a connection string for the entire Event Hubs namespace:
        1. Go to your Event Hubs namespace in the Azure portal.
        2. Under **Settings**, select **Shared Access Policies**.
        3. Create a new key or choose an existing key that has **Send** permissions.
        4. Copy either the primary or secondary connection string.

To create the Event Hubs destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Event Hubs** as the destination type.

1. Select **Connection string** as the authorization type.

1. Paste in the connection string for your Event Hubs resource, and enter the case-sensitive event hub name if necessary.

1. Select **Save**.

# [Managed identity](#tab/managed-identity)

### Create an Event Hubs destination

If you don't have an existing Event Hubs namespace to export to, follow these steps:

1. Create a [new Event Hubs namespace in the Azure portal](https://portal.azure.com/#create/Microsoft.EventHub). You can learn more in [Azure Event Hubs docs](../../event-hubs/event-hubs-create.md).

1. Create an event hub in your Event Hubs namespace. Go to your namespace, and select **+ Event Hub** at the top to create an event hub instance.

[!INCLUDE [iot-central-managed-identity](../../../includes/iot-central-managed-identity.md)]

To configure the permissions:

1. On the **Add role assignment** page, select the scope and subscription you want to use.

    > [!TIP]
    > If your IoT Central application and event hub are in the same resource group, you can choose **Resource group** as the scope and then select the resource group.

1. Select **Azure Event Hubs Data Sender** as the **Role**.

1. Select **Save**. The managed identity for your IoT Central application is now configured.

To further secure your event hub and only allow access from trusted services with managed identities, see [Export data to a secure destination on an Azure Virtual Network](howto-connect-secure-vnet.md).

To create the Event Hubs destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Event Hubs** as the destination type.

1. Select **System-assigned managed identity** as the authorization type.

1. Enter the host name of your Event Hubs resource. Then enter the case-sensitive event hub name. A host name looks like: `contoso-waste.servicebus.windows.net`.

1. Select **Save**.

---

[!INCLUDE [iot-central-data-export-setup](../../../includes/iot-central-data-export-setup.md)]

[!INCLUDE [iot-central-data-export-message-properties](../../../includes/iot-central-data-export-message-properties.md)]

[!INCLUDE [iot-central-data-export-device-connectivity](../../../includes/iot-central-data-export-device-connectivity.md)]

[!INCLUDE [iot-central-data-export-device-lifecycle](../../../includes/iot-central-data-export-device-lifecycle.md)]

[!INCLUDE [iot-central-data-export-device-template](../../../includes/iot-central-data-export-device-template.md)]

For Event Hubs, IoT Central exports new messages data to your event hub or Service Bus queue or topic in near real time. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` are included automatically.

## Next steps

Now that you know how to export to Event Hubs, a suggested next step is to learn [Export to Azure Data Explorer](howto-export-to-azure-data-explorer.md).
