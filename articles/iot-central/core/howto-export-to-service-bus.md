---
title: Export data to Service Bus IoT Central | Microsoft Docs
description: How to use the new data export to export your IoT data to Service Bus
services: iot-central
author: v-krishnag
ms.author: v-krishnag
ms.date: 04/28/2022
ms.topic: how-to
ms.service: iot-central
---

# Export IoT data to Service Bus

This article describes how to configure data export to send data to the Service Bus.

[!INCLUDE [iot-central-data-export](../../../includes/iot-central-data-export.md)]

## Set up a Service Bus export destination

Both queues and topics are supported for Azure Service Bus destinations.

IoT Central exports data in near real time. The data is in the message body and is in JSON format encoded as UTF-8.

The annotations or system properties bag of the message contains the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` fields that have the same values as the corresponding fields in the message body.

## Connection options

Service Bus destinations let you configure the connection with a *connection string* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

This article shows how to create a managed identity in the Azure portal. You can also use the Azure CLI to create a manged identity. To learn more, see [Assign a managed identity access to a resource using Azure CLI](../../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md).

# [Connection string](#tab/connection-string)

### Create a Service Bus queue or topic destination

If you don't have an existing Service Bus namespace to export to, follow these steps:

1. Create a [new Service Bus namespace in the Azure portal](https://portal.azure.com/#create/Microsoft.ServiceBus.1.0.5). You can learn more in [Azure Service Bus docs](../../service-bus-messaging/service-bus-create-namespace-portal.md).

1. To create a queue or topic to export to, go to your Service Bus namespace, and select **+ Queue** or **+ Topic**.

1. Generate a key to use when you to set up your data export in IoT Central:

    - Select the queue or topic you created.
    - Select **Settings/Shared access policies**.
    - Create a new key or choose an existing key that has **Send** permissions.
    - Copy either the primary or secondary connection string. You use this connection string to set up a new destination in IoT Central.
    - Alternatively, you can generate a connection string for the entire Service Bus namespace:
        1. Go to your Service Bus namespace in the Azure portal.
        2. Under **Settings**, select **Shared Access Policies**.
        3. Create a new key or choose an existing key that has **Send** permissions.
        4. Copy either the primary or secondary connection string.

To create the Service Bus destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Service Bus Queue** or  **Azure Service Bus Topic** as the destination type.

1. Select **Connection string** as the authorization type.

1. Paste in the connection string for your Service Bus resource, and enter the case-sensitive queue or topic name if necessary.

1. Select **Save**.

# [Managed identity](#tab/managed-identity)

### Create a Service Bus queue or topic destination

If you don't have an existing Service Bus namespace to export to, follow these steps:

1. Create a [new Service Bus namespace in the Azure portal](https://portal.azure.com/#create/Microsoft.ServiceBus.1.0.5). You can learn more in [Azure Service Bus docs](../../service-bus-messaging/service-bus-create-namespace-portal.md).

1. To create a queue or topic to export to, go to your Service Bus namespace, and select **+ Queue** or **+ Topic**.

[!INCLUDE [iot-central-managed-identity](../../../includes/iot-central-managed-identity.md)]

To configure the permissions:

1. On the **Add role assignment** page, select the scope and subscription you want to use.

    > [!TIP]
    > If your IoT Central application and queue or topic are in the same resource group, you can choose **Resource group** as the scope and then select the resource group.

1. Select **Azure Service Bus Data Sender** as the **Role**.

1. Select **Save**. The managed identity for your IoT Central application is now configured.

To further secure your queue or topic and only allow access from trusted services with managed identities, see [Export data to a secure destination on an Azure Virtual Network](howto-connect-secure-vnet.md).

To create the Service Bus destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Service Bus Queue** or  **Azure Service Bus Topic** as the destination type.

1. Select **System-assigned managed identity** as the authorization type.

1. Enter the host name of your Service Bus resource. Then enter the case-sensitive queue or topic name. A host name looks like: `contoso-waste.servicebus.windows.net`.

1. Select **Save**.

---

[!INCLUDE [iot-central-data-export-setup](../../../includes/iot-central-data-export-setup.md)]

[!INCLUDE [iot-central-data-export-message-properties](../../../includes/iot-central-data-export-message-properties.md)]

[!INCLUDE [iot-central-data-export-device-connectivity](../../../includes/iot-central-data-export-device-connectivity.md)]

[!INCLUDE [iot-central-data-export-device-lifecycle](../../../includes/iot-central-data-export-device-lifecycle.md)]

[!INCLUDE [iot-central-data-export-device-template](../../../includes/iot-central-data-export-device-template.md)]

For Service Bus, IoT Central exports new messages data to your event hub or Service Bus queue or topic in near real time. In the user properties (also referred to as application properties) of each message, the `iotcentral-device-id`, `iotcentral-application-id`, `iotcentral-message-source`, and `iotcentral-message-type` are included automatically.

## Next steps

Now that you know how to export to Service Bus, a suggested next step is to learn [Export to Event Hubs](howto-export-to-event-hubs.md).